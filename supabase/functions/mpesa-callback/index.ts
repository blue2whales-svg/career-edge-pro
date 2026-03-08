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

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    if (ResultCode === 0 && CallbackMetadata) {
      // Payment successful
      const items = CallbackMetadata.Item || [];
      const mpesaReceipt = items.find((i: any) => i.Name === "MpesaReceiptNumber")?.Value;
      const amountPaid = items.find((i: any) => i.Name === "Amount")?.Value;
      const phoneUsed = items.find((i: any) => i.Name === "PhoneNumber")?.Value;

      console.log(`Payment success: Receipt=${mpesaReceipt}, Amount=${amountPaid}, Phone=${phoneUsed}`);

      // Find orders with awaiting_payment status and update the most recent one
      // In production, you'd store CheckoutRequestID to match exactly
      const { data: orders } = await supabase
        .from("orders")
        .select("id")
        .eq("status", "awaiting_payment")
        .order("created_at", { ascending: false })
        .limit(1);

      if (orders && orders.length > 0) {
        await supabase.from("orders").update({
          status: "paid",
        }).eq("id", orders[0].id);

        console.log(`Order ${orders[0].id} marked as paid`);
      }
    } else {
      console.log(`Payment failed or cancelled. ResultCode: ${ResultCode}`);
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
