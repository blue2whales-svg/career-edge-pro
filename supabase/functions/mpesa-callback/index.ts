import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log("M-Pesa callback received:", JSON.stringify(body));

    const callback = body?.Body?.stkCallback;
    if (!callback) {
      return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Accepted" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const { ResultCode, CheckoutRequestID, CallbackMetadata } = callback;

    if (!CheckoutRequestID || typeof CheckoutRequestID !== "string") {
      console.warn("Callback missing CheckoutRequestID — ignoring");
      return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Accepted" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Verify that this CheckoutRequestID actually exists in our orders table
    const { data: existingOrder, error: lookupError } = await supabase
      .from("orders")
      .select("id, status")
      .eq("mpesa_checkout_request_id", CheckoutRequestID)
      .maybeSingle();

    if (lookupError || !existingOrder) {
      console.warn("Callback for unknown CheckoutRequestID — rejecting:", CheckoutRequestID);
      return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Accepted" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Prevent replay: don't re-process already paid orders
    if (existingOrder.status === "paid") {
      console.warn("Duplicate callback for already-paid order:", CheckoutRequestID);
      return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Accepted" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    if (ResultCode === 0 && CallbackMetadata) {
      const items = CallbackMetadata.Item || [];
      const mpesaReceipt = items.find((i: any) => i.Name === "MpesaReceiptNumber")?.Value;
      const amountPaid = items.find((i: any) => i.Name === "Amount")?.Value;

      console.log(`Payment success: Receipt=${mpesaReceipt}, Amount=${amountPaid}`);

      await supabase.from("orders").update({
        status: "paid",
        mpesa_receipt: mpesaReceipt,
      } as any).eq("mpesa_checkout_request_id" as any, CheckoutRequestID);
    } else {
      console.log(`Payment failed. ResultCode: ${ResultCode}`);
      await supabase.from("orders").update({
        status: "failed",
      }).eq("mpesa_checkout_request_id" as any, CheckoutRequestID);
    }

    return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Accepted" }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Callback error:", error);
    return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Accepted" }), {
      headers: { "Content-Type": "application/json" },
    });
  }
});
