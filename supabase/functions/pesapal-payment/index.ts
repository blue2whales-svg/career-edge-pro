import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PESAPAL_BASE = "https://pay.pesapal.com/v3";

async function getAuthToken(): Promise<string> {
  const key = Deno.env.get("PESAPAL_CONSUMER_KEY");
  const secret = Deno.env.get("PESAPAL_CONSUMER_SECRET");
  if (!key || !secret) throw new Error("Pesapal credentials not configured");

  const res = await fetch(`${PESAPAL_BASE}/api/Auth/RequestToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ consumer_key: key, consumer_secret: secret }),
  });
  if (!res.ok) throw new Error(`Auth failed: ${res.status}`);
  const data = await res.json();
  return data.token;
}

async function registerIPN(token: string): Promise<string> {
  const res = await fetch(`${PESAPAL_BASE}/api/URLSetup/RegisterIPN`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      url: "https://career-edge-pro.lovable.app/payment-success",
      ipn_notification_type: "GET",
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("IPN registration failed:", text);
    throw new Error(`IPN registration failed: ${res.status}`);
  }
  const data = await res.json();
  return data.ipn_id;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, ...body } = await req.json();

    if (action === "submit-order") {
      const { amount, description, callback_url, email, phone, first_name, last_name } = body;
      
      const token = await getAuthToken();
      const ipnId = await registerIPN(token);

      const orderId = `CVEDGE-${Date.now()}`;
      const orderRes = await fetch(`${PESAPAL_BASE}/api/Transactions/SubmitOrderRequest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: orderId,
          currency: "KES",
          amount,
          description,
          callback_url: callback_url || "https://career-edge-pro.lovable.app/payment-success",
          notification_id: ipnId,
          billing_address: {
            email_address: email,
            phone_number: phone,
            first_name,
            last_name,
          },
        }),
      });

      if (!orderRes.ok) {
        const text = await orderRes.text();
        console.error("Order submission failed:", text);
        throw new Error(`Order submission failed: ${orderRes.status}`);
      }

      const orderData = await orderRes.json();
      return new Response(JSON.stringify({ 
        redirect_url: orderData.redirect_url, 
        order_tracking_id: orderData.order_tracking_id,
        merchant_reference: orderId 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "check-status") {
      const { order_tracking_id } = body;
      const token = await getAuthToken();

      const statusRes = await fetch(
        `${PESAPAL_BASE}/api/Transactions/GetTransactionStatus?orderTrackingId=${order_tracking_id}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!statusRes.ok) throw new Error(`Status check failed: ${statusRes.status}`);
      const statusData = await statusRes.json();
      return new Response(JSON.stringify(statusData), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Pesapal error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
