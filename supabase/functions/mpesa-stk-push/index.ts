import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SAFARICOM_BASE_URL = "https://api.safaricom.co.ke";
const OAUTH_TOKEN_URL = `${SAFARICOM_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`;
const STK_PUSH_URL = `${SAFARICOM_BASE_URL}/mpesa/stkpush/v1/processrequest`;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function toBase64(value: string): string {
  return btoa(value);
}

function sanitizeSecret(value: string | undefined): string {
  return (value ?? "").replace(/\s+/g, "").trim();
}

function getNairobiTimestamp(): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Nairobi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const byType = (type: string) => parts.find((part) => part.type === type)?.value ?? "00";
  return `${byType("year")}${byType("month")}${byType("day")}${byType("hour")}${byType("minute")}${byType("second")}`;
}

function parseStkResponse(rawText: string, status: number) {
  try {
    return JSON.parse(rawText);
  } catch {
    return {
      errorCode: `HTTP_${status}`,
      errorMessage: rawText?.slice(0, 200) || "STK push returned a non-JSON response",
    };
  }
}

async function requestStkPush(params: {
  token: string;
  shortcode: string;
  passkey: string;
  formattedPhone: string;
  amount: number;
  orderId: string;
  callbackUrl: string;
}) {
  const { token, shortcode, passkey, formattedPhone, amount, orderId, callbackUrl } = params;
  const timestamp = getNairobiTimestamp();
  const password = toBase64(`${shortcode}${passkey}${timestamp}`);

  let lastErrorText = "";
  let lastStatus = 500;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const stkRes = await fetch(STK_PUSH_URL, {
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
      });

      const stkText = await stkRes.text();
      const stkData = parseStkResponse(stkText, stkRes.status);
      console.log(`STK push response status: ${stkRes.status}, body: ${stkText || "<empty>"}`);

      const isTransientServerFailure = stkRes.status >= 500;
      if (!isTransientServerFailure || attempt === 3) {
        return { stkRes, stkData };
      }

      await new Promise((resolve) => setTimeout(resolve, attempt * 700));
      continue;
    } catch (error: any) {
      lastErrorText = error?.message || "Unknown network error";
      if (attempt === 3) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, attempt * 700));
    }
  }

  const fallbackText = lastErrorText || "STK request failed after retries";
  const fallbackData = parseStkResponse(fallbackText, lastStatus);
  return {
    stkRes: new Response(fallbackText, { status: lastStatus }),
    stkData: fallbackData,
  };
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

    const configuredShortcode = sanitizeSecret(Deno.env.get("VITE_MPESA_SHORTCODE"));
    const configuredPasskey = sanitizeSecret(Deno.env.get("VITE_MPESA_PASSKEY"));

    const isSandbox = STK_PUSH_URL.includes("sandbox.safaricom.co.ke");
    const shortcode = configuredShortcode || (isSandbox ? SANDBOX_SHORTCODE : "");
    const passkey = configuredPasskey || (isSandbox ? SANDBOX_PASSKEY : "");

    if (!shortcode || !passkey) {
      throw new Error("M-Pesa shortcode or passkey not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const callbackUrl = `${supabaseUrl}/functions/v1/mpesa-callback`;

    const token = await getAccessToken();

    let { stkRes, stkData } = await requestStkPush({
      token,
      shortcode,
      passkey,
      formattedPhone,
      amount,
      orderId,
      callbackUrl,
    });

    const shouldRetryWithOfficialSandboxCredentials =
      isSandbox &&
      !stkRes.ok &&
      stkData?.errorCode === "500.001.1001" &&
      (shortcode !== SANDBOX_SHORTCODE || passkey !== SANDBOX_PASSKEY);

    if (shouldRetryWithOfficialSandboxCredentials) {
      console.warn("STK returned Wrong credentials. Retrying once with official sandbox shortcode/passkey.");

      const fallbackAttempt = await requestStkPush({
        token,
        shortcode: SANDBOX_SHORTCODE,
        passkey: SANDBOX_PASSKEY,
        formattedPhone,
        amount,
        orderId,
        callbackUrl,
      });

      stkRes = fallbackAttempt.stkRes;
      stkData = fallbackAttempt.stkData;
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
