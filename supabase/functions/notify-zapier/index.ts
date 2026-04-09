import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { requireAuth } from "../_shared/auth.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const auth = await requireAuth(req);
  if (auth instanceof Response) return auth;

  try {
    const { order } = await req.json();
    
    // Get Zapier webhook URL from secrets
    const zapierWebhookUrl = Deno.env.get('ZAPIER_WEBHOOK_URL');
    
    if (!zapierWebhookUrl) {
      console.log('ZAPIER_WEBHOOK_URL not configured — skipping webhook');
      return new Response(
        JSON.stringify({ success: true, webhook_sent: false, message: 'Webhook URL not configured' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send order data to Zapier
    const response = await fetch(zapierWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order_id: order.id,
        name: order.name,
        email: order.email,
        phone: order.phone,
        services: order.services,
        total_amount: order.total_amount,
        details: order.details,
        status: order.status,
        created_at: order.created_at,
        source: 'cvedge-website',
      }),
    });

    console.log('Zapier webhook response status:', response.status);

    return new Response(
      JSON.stringify({ success: true, webhook_sent: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in notify-zapier:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
