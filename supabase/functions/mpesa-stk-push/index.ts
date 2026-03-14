import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const PROD_BASE_URL = "https://api.safaricom.co.ke";
const SANDBOX_BASE_URL = "https://sandbox.safaricom.co.ke";
const TOKEN_PATH = "/oauth/v1/generate?grant_type=client_credentials";
const STK_PUSH_PATH = "/mpesa/stkpush/v1/processrequest";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function toBase64(value: string): string {
  return btoa(value);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeSecret(raw?: string): string {
  let value = (raw ?? "").trim();
  if (!value) return "";

  if (/^[A-Z0-9_]+\s*=/.test(value)) {
    value = value.slice(value.indexOf("=") + 1).trim();
  }

  value = value.replace(/^['"]+|['"]+$/g, "").trim();
  return value.replace(/\s+/g, "");
}

function readFirstEnv(names: string[]): string {
  for (const name of names) {
    const value = normalizeSecret(Deno.env.get(name));
    if (value) return value;
  }
  return "";
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function formatPhone(input: string): string {
  let phone = (input ?? "").replace(/\D/g, "");
  if (phone.startsWith("0")) phone = `254${phone.slice(1)}`;
  if (phone.startsWith("7")) phone = `254${phone}`;
  if (!phone.startsWith("254")) phone = `254${phone}`;
  return phone;
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
      errorMessage: rawText?.slice(0, 300) || "STK push returned a non-JSON response",
    };
  }
}

async function getAccessToken(): Promise<{ token: string; baseUrl: string }> {
  const consumerKey = readFirstEnv(["VITE_MPESA_CONSUMER_KEY", "MPESA_CONSUMER_KEY"]);
  const consumerSecret = readFirstEnv(["VITE_MPESA_CONSUMER_SECRET", "MPESA_CONSUMER_SECRET"]);

  if (!consumerKey || !consumerSecret) {
    throw new Error("M-Pesa consumer key or secret not configured");
  }

  console.log(
    `M-Pesa credentials detected. key_prefix=${consumerKey.slice(0, 6)}..., secret_length=${consumerSecret.length}`
  );

  const explicitBaseUrl = normalizeSecret(Deno.env.get("MPESA_BASE_URL"));
  const mpesaEnv = normalizeSecret(Deno.env.get("MPESA_ENV")).toLowerCase();
  const preferred = mpesaEnv === "sandbox"
    ? [SANDBOX_BASE_URL, PROD_BASE_URL]
    : [PROD_BASE_URL, SANDBOX_BASE_URL];

  const candidates = Array.from(new Set([explicitBaseUrl, ...preferred].filter(Boolean)));
  const basicAuth = toBase64(`${consumerKey}:${consumerSecret}`);
  const errors: string[] = [];

  for (const baseUrl of candidates) {
    const tokenUrl = `${baseUrl}${TOKEN_PATH}`;

    try {
      const res = await fetch(tokenUrl, {
        method: "GET",
        headers: {
          Authorization: `Basic ${basicAuth}`,
          Accept: "application/json",
        },
      });

      const text = await res.text();
      console.log(`Safaricom OAuth [${baseUrl}] status: ${res.status}, body: ${text || "<empty>"}`);

      if (!res.ok) {
        errors.push(`[${baseUrl}] ${res.status} ${text || "<empty>"}`);
        continue;
      }

      let data: { access_token?: string };
      try {
        data = JSON.parse(text);
      } catch {
        errors.push(`[${baseUrl}] token response was not valid JSON: ${text || "<empty>"}`);
        continue;
      }

      if (!data.access_token) {
        errors.push(`[${baseUrl}] token response missing access_token: ${text || "<empty>"}`);
        continue;
      }

      return { token: data.access_token, baseUrl };
    } catch (error: any) {
      errors.push(`[${baseUrl}] ${error?.message || "network error"}`);
    }
  }

  throw new Error(
    `Token error: ${errors.join(" | ")}. Check M-Pesa credentials and ensure production credentials are used with api.safaricom.co.ke.`
  );
}

async function requestStkPush(params: {
  token: string;
  baseUrl: string;
  shortcode: string;
  passkey: string;
  formattedPhone: string;
  amount: number;
  orderId: string;
  callbackUrl: string;
}) {
  const { token, baseUrl, shortcode, passkey, formattedPhone, amount, orderId, callbackUrl } = params;
  const stkPushUrl = `${baseUrl}${STK_PUSH_PATH}`;
  const timestamp = getNairobiTimestamp();
  const password = toBase64(`${shortcode}${passkey}${timestamp}`);

  let lastErrorText = "";
  let lastStatus = 502;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const stkRes = await fetch(stkPushUrl, {
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
      lastStatus = stkRes.status;
      lastErrorText = stkText;

      console.log(`STK push [${baseUrl}] status: ${stkRes.status}, body: ${stkText || "<empty>"}`);

      const isTransientFailure = stkRes.status >= 500 || stkRes.status === 429 || stkRes.status === 408;
      if (!isTransientFailure || attempt === 3) {
        return { stkRes, stkData };
      }

      await sleep(attempt * 700);
    } catch (error: any) {
      lastErrorText = error?.message || "Unknown network error";
      if (attempt === 3) break;
      await sleep(attempt * 700);
    }
  }

  const fallbackData = parseStkResponse(lastErrorText || "STK request failed after retries", lastStatus);
  return {
    stkRes: new Response(lastErrorText || "STK request failed after retries", { status: lastStatus }),
    stkData: fallbackData,
  };
}

async function ensureOrderRecord(params: {
  supabase: ReturnType<typeof createClient>;
  orderId: string;
  amount: number;
  packageName?: string;
  fullName?: string;
  email?: string;
  phone: string;
}): Promise<string | null> {
  const { supabase, orderId, amount, packageName, fullName, email, phone } = params;

  if (isUuid(orderId)) return orderId;

  const safeName = (fullName || "CVEdge Customer").trim().slice(0, 150) || "CVEdge Customer";
  const fallbackEmailId = orderId.toLowerCase().replace(/[^a-z0-9]/g, "") || `${Date.now()}`;
  const safeEmail = (email || `guest+${fallbackEmailId}@cvedge.local`).trim().slice(0, 255);

  const { data, error } = await supabase
    .from("orders")
    .insert({
      name: safeName,
      email: safeEmail,
      phone,
      services: [packageName || "M-Pesa Payment"],
      total_amount: Math.ceil(amount),
      status: "pending",
      details: `External payment reference: ${orderId}`,
    } as any)
    .select("id")
    .single();

  if (error) {
    console.error("Unable to persist order row for polling:", error.message);
    return null;
  }

  return data?.id ?? null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    const { orderId, phone, amount, packageName, fullName, email } = payload ?? {};

    if (!orderId || !phone || !amount) {
      return new Response(
        JSON.stringify({ error: "orderId, phone, and amount are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return new Response(
        JSON.stringify({ error: "amount must be a valid number greater than 0" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const formattedPhone = formatPhone(String(phone));
    if (formattedPhone.length !== 12 || !formattedPhone.startsWith("254")) {
      return new Response(
        JSON.stringify({ error: "Invalid Kenyan phone number" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const shortcode = readFirstEnv(["VITE_MPESA_SHORTCODE", "MPESA_SHORTCODE"]);
    const passkey = readFirstEnv(["VITE_MPESA_PASSKEY", "MPESA_PASSKEY"]);

    if (!shortcode || !passkey) {
      throw new Error("M-Pesa shortcode or passkey not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Backend service credentials are not configured");
    }

    const callbackUrl = `${supabaseUrl}/functions/v1/mpesa-callback`;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const persistedOrderId = await ensureOrderRecord({
      supabase,
      orderId: String(orderId),
      amount: numericAmount,
      packageName: typeof packageName === "string" ? packageName : undefined,
      fullName: typeof fullName === "string" ? fullName : undefined,
      email: typeof email === "string" ? email : undefined,
      phone: formattedPhone,
    });

    const { token, baseUrl } = await getAccessToken();

    const { stkRes, stkData } = await requestStkPush({
      token,
      baseUrl,
      shortcode,
      passkey,
      formattedPhone,
      amount: numericAmount,
      orderId: String(orderId),
      callbackUrl,
    });

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

    if (stkData.ResponseCode === "0" && persistedOrderId) {
      const { error } = await supabase
        .from("orders")
        .update({
          status: "awaiting_payment",
          mpesa_checkout_request_id: stkData.CheckoutRequestID,
        } as any)
        .eq("id", persistedOrderId);

      if (error) {
        console.error("Failed to update order with CheckoutRequestID:", error.message);
      }
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