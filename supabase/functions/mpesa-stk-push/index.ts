import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { encode as base64Encode } from "https://deno.land/std@0.208.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function toBase64(str: string): string {
  const encoder = new TextEncoder();
  return base64Encode(encoder.encode(str));
}

async function getAccessToken(): Promise<string> {
  const consumerKey = Deno.env.get("VITE_MPESA_CONSUMER_KEY")!;
  const consumerSecret = Deno.env.get("VITE_MPESA_CONSUMER_SECRET")!;
  const credentials = toBase64(`${consumerKey}:${consumerSecret}`);

  const res = await fetch(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    { headers: { Authorization: `Basic ${credentials}` } }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token error: ${text}`);
  }

  const data = await res.json();
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

    const shortcode = Deno.env.get("VITE_MPESA_SHORTCODE")!;
    const passkey = Deno.env.get("VITE_MPESA_PASSKEY")!;

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

    const stkData = await stkRes.json();

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
