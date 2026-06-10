// Manage job alerts (list / upsert / toggle / delete). Owner-only via email check.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const OWNER_EMAIL = "blue2whales@gmail.com";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const body = await req.json().catch(() => ({}));
    const { action, requesterEmail } = body || {};

    if (!requesterEmail || String(requesterEmail).toLowerCase() !== OWNER_EMAIL) {
      return new Response(JSON.stringify({ ok: false, error: "Not authorized" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "list") {
      const { data, error } = await supabase
        .from("job_alerts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return new Response(JSON.stringify({ ok: true, alerts: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "upsert") {
      const { id, alert } = body;
      const payload = {
        email: alert.email,
        keywords: alert.keywords || [],
        markets: alert.markets || ["Remote"],
        include_visa: !!alert.include_visa,
        verified_only: alert.verified_only !== false,
        frequency_hours: Number(alert.frequency_hours) || 2,
        active: alert.active !== false,
      };
      const q = id
        ? supabase.from("job_alerts").update(payload).eq("id", id).select().single()
        : supabase.from("job_alerts").insert(payload).select().single();
      const { data, error } = await q;
      if (error) throw error;
      return new Response(JSON.stringify({ ok: true, alert: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "delete") {
      const { id } = body;
      const { error } = await supabase.from("job_alerts").delete().eq("id", id);
      if (error) throw error;
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "send-now") {
      const { email } = body;
      const resp = await fetch(
        `${Deno.env.get("SUPABASE_URL")}/functions/v1/send-job-alerts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
          },
          body: JSON.stringify({ email }),
        }
      );
      const r = await resp.json();
      return new Response(JSON.stringify({ ok: true, result: r }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: false, error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("manage-job-alerts error", err);
    return new Response(JSON.stringify({ ok: false, error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
