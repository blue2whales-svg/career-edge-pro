import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SAFARICOM_BASE_URL = "https://sandbox.safaricom.co.ke";
const OAUTH_TOKEN_URL = `${SAFARICOM_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`;
const STK_PUSH_URL = `${SAFARICOM_BASE_URL}/mpesa/stkpush/v1/processrequest`;

const SANDBOX_SHORTCODE = "174379";
const SANDBOX_PASSKEY =
  "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function toBase64(value: string): string {
  return btoa(value);
}

async function getAccessToken(): Promise<string> {
  const consumerKey =
    (Deno.env.get("VITE_MPESA_CONSUMER_KEY") ?? "").trim().replace(/\s+/g, "");
  const consumerSecret =
    (Deno.env.get("VITE_MPESA_CONSUMER_SECRET") ?? "").trim().replace(/\s+/g, "");

  if (!consumerKey || !consumerSecret) {
    throw new Error("M-Pesa consumer key or secret not configured");
  }

  const basicAuth = toBase64(`${consumerKey}:${consumerSecret}`);

  const res = await fetch(OAUTH_TOKEN_URL, {
    method: "GET",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      Accept: "application/json",
    },
  });

  const text = await res.text();
  console.log(`Safaricom OAuth response status: ${res.status}, body: ${text || "<empty>"}`);

  if (!res.ok) {
    throw new Error(
      `Token error (${res.status}): ${text || "Empty response body from Safaricom OAuth endpoint"}`
    );
  }

  let data: { access_token?: string };
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Token response was not valid JSON: ${text || "<empty>"}`);
  }

  if (!data.access_token) {
    throw new Error(`Token response missing access_token: ${text || "<empty>"}`);
  }

  return data.access_token;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, phone, amount } = await req.json();

    if (!orderId || !phone || !amount) {
      return new Response(
        JSON.stringify({ error: "orderId, phone, and amount are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Format phone: ensure 254XXXXXXXXX
    let formattedPhone = phone.replace(/\s+/g, "").replace(/^0/, "254").replace(/^\+/, "");
    if (!formattedPhone.startsWith("254")) {
      formattedPhone = "254" + formattedPhone;
    }

    const shortcode = (Deno.env.get("VITE_MPESA_SHORTCODE") ?? "").trim();
    const passkey = (Deno.env.get("VITE_MPESA_PASSKEY") ?? "").trim();

    if (!shortcode || !passkey) {
      throw new Error("M-Pesa shortcode or passkey not configured");
    }

    const timestamp = new Date()
      .toISOString()
      .replace(/[-T:Z.]/g, "")
      .slice(0, 14);

    const password = toBase64(`${shortcode}${passkey}${timestamp}`);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const callbackUrl = `${supabaseUrl}/functions/v1/mpesa-callback`;

    const token = await getAccessToken();

    const stkRes = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: shortcode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: Math.ceil(amount),
          PartyA: formattedPhone,
          PartyB: shortcode,
          PhoneNumber: formattedPhone,
          CallBackURL: callbackUrl,
          AccountReference: orderId.slice(0, 12).toUpperCase(),
          TransactionDesc: `Payment for order ${orderId.slice(0, 8)}`,
        }),
      }
    );

    const stkText = await stkRes.text();
    console.log(`STK push response status: ${stkRes.status}, body: ${stkText || "<empty>"}`);

    let stkData: any;
    try {
      stkData = JSON.parse(stkText);
    } catch {
      stkData = {
        errorCode: `HTTP_${stkRes.status}`,
        errorMessage: stkText?.slice(0, 200) || "STK push returned a non-JSON response",
      };
    }

    if (!stkRes.ok) {
      return new Response(
        JSON.stringify({
          ResponseCode: "1",
          ResponseDescription: "STK push request failed",
          ...stkData,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (stkData.ResponseCode === "0") {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      await supabase.from("orders").update({
        status: "awaiting_payment",
        mpesa_checkout_request_id: stkData.CheckoutRequestID,
      } as any).eq("id", orderId);
    }

    return new Response(JSON.stringify(stkData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("M-Pesa STK error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
