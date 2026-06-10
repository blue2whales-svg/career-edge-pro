// Send remote job alert digest emails based on saved keyword preferences.
// Triggered by pg_cron every 2 hours (configurable per alert via frequency_hours).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE_NAME = "CV Edge";
const SENDER_DOMAIN = "notify.cvedge.live";
const FROM_DOMAIN = "cvedge.live";
const ROOT_URL = "https://cvedge.live";

interface JobAlert {
  id: string;
  email: string;
  keywords: string[];
  markets: string[];
  include_visa: boolean;
  verified_only: boolean;
  frequency_hours: number;
  last_sent_at: string | null;
}

function escapeHtml(s: string) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function jobMatchesKeywords(job: any, keywords: string[]): boolean {
  if (!keywords.length) return true;
  const hay = `${job.title || ""} ${job.description || ""} ${job.industry || ""} ${job.category || ""} ${job.company || ""}`.toLowerCase();
  return keywords.some((k) => k && hay.includes(k.toLowerCase()));
}

function buildEmailHtml(alert: JobAlert, jobs: any[]) {
  const rows = jobs
    .slice(0, 25)
    .map((j) => {
      const url = j.apply_url || `${ROOT_URL}/jobs`;
      const tag = j.verified ? "✓ Verified" : "Remote";
      const salary = j.salary && j.salary !== "Competitive" ? ` · ${escapeHtml(j.salary)}` : "";
      return `
        <tr>
          <td style="padding:14px 0;border-bottom:1px solid #1f1f1f;">
            <a href="${escapeHtml(url)}" style="color:#f59e0b;font-size:16px;font-weight:700;text-decoration:none;font-family:'DM Sans',Arial,sans-serif;">
              ${escapeHtml(j.title)}
            </a>
            <div style="color:#cccccc;font-size:13px;margin-top:4px;font-family:Inter,Arial,sans-serif;">
              ${escapeHtml(j.company || "Confidential")} · ${escapeHtml(j.location || "Remote")}${salary}
            </div>
            <div style="margin-top:6px;font-size:11px;color:#f59e0b;font-weight:600;">${escapeHtml(tag)} · ${escapeHtml(j.source_label || j.source || "")}</div>
          </td>
        </tr>`;
    })
    .join("");

  return `<!doctype html>
<html><head><meta charset="utf-8"><title>${jobs.length} new remote jobs match your alert</title></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:Inter,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#0a0a0a;border:1px solid #1f1f1f;border-radius:14px;overflow:hidden;">
        <tr><td style="padding:28px 28px 8px;">
          <div style="font-size:12px;color:#f59e0b;font-weight:700;letter-spacing:2px;text-transform:uppercase;">CV EDGE · REMOTE ALERTS</div>
          <h1 style="margin:8px 0 4px;color:#ffffff;font-size:22px;font-family:'DM Sans',Arial,sans-serif;">
            ${jobs.length} new verified remote ${jobs.length === 1 ? "job matches" : "jobs match"} your alert
          </h1>
          <p style="margin:0;color:#9a9a9a;font-size:13px;">Matched against: ${escapeHtml(alert.keywords.slice(0, 6).join(", "))}${alert.keywords.length > 6 ? "…" : ""}</p>
        </td></tr>
        <tr><td style="padding:8px 28px 12px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
        </td></tr>
        <tr><td style="padding:20px 28px 28px;text-align:center;">
          <a href="${ROOT_URL}/jobs?market=Remote" style="display:inline-block;background:#f59e0b;color:#0a0a0a;padding:14px 28px;border-radius:10px;font-weight:700;text-decoration:none;font-family:'DM Sans',Arial,sans-serif;">
            View all remote jobs →
          </a>
          <p style="margin:18px 0 0;color:#666;font-size:11px;">
            You are receiving this because you set up a job alert at ${ROOT_URL}.<br>
            Manage your alerts at <a href="${ROOT_URL}/portal/alerts" style="color:#f59e0b;">${ROOT_URL}/portal/alerts</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function buildText(alert: JobAlert, jobs: any[]) {
  const lines = jobs.slice(0, 25).map(
    (j) => `• ${j.title} — ${j.company || "Confidential"} (${j.location || "Remote"})\n  ${j.apply_url || ROOT_URL + "/jobs"}`
  );
  return `${jobs.length} new remote jobs match your alert (${alert.keywords.slice(0, 6).join(", ")})\n\n${lines.join("\n\n")}\n\nView all: ${ROOT_URL}/jobs?market=Remote\nManage alerts: ${ROOT_URL}/portal/alerts`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    let body: any = {};
    try { body = await req.json(); } catch { /* no body */ }
    const forceEmail: string | undefined = body?.email;

    // Load active alerts (optionally filter to one when manually triggered)
    let query = supabase.from("job_alerts").select("*").eq("active", true);
    if (forceEmail) query = query.eq("email", forceEmail);
    const { data: alerts, error: alertsErr } = await query;
    if (alertsErr) throw alertsErr;
    if (!alerts || alerts.length === 0) {
      return new Response(JSON.stringify({ ok: true, processed: 0, message: "No active alerts" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const now = new Date();
    let sent = 0;
    const results: any[] = [];

    for (const alert of alerts as JobAlert[]) {
      // Respect frequency (skip if not due yet) — bypassed when manually triggered with email
      if (!forceEmail && alert.last_sent_at) {
        const hoursSince = (now.getTime() - new Date(alert.last_sent_at).getTime()) / 3600000;
        if (hoursSince < alert.frequency_hours) {
          results.push({ email: alert.email, skipped: "too_soon" });
          continue;
        }
      }

      // Window: since last send, fall back to last 24h
      const sinceIso = alert.last_sent_at || new Date(now.getTime() - 24 * 3600 * 1000).toISOString();

      // Pull a wide candidate pool of remote/verified jobs since `since`
      let jq = supabase
        .from("cached_jobs")
        .select("title,company,location,salary,industry,category,market,apply_url,description,source,source_label,verified,visa_sponsorship,discovered_at,posted_at,is_active")
        .eq("is_active", true)
        .gte("discovered_at", sinceIso)
        .order("discovered_at", { ascending: false })
        .limit(500);

      if (alert.verified_only) jq = jq.eq("verified", true);

      const { data: candidates, error: jErr } = await jq;
      if (jErr) {
        console.error("cached_jobs query failed", jErr);
        results.push({ email: alert.email, error: jErr.message });
        continue;
      }

      // Filter by market (remote-friendly) and keywords
      const wantedMarkets = new Set(alert.markets.map((m) => m.toLowerCase()));
      const remoteSet = new Set(["remote", "worldwide", "anywhere"]);
      const matches = (candidates || []).filter((j: any) => {
        const market = (j.market || "").toLowerCase();
        const loc = (j.location || "").toLowerCase();
        const isRemote = remoteSet.has(market) || /remote|anywhere|worldwide/.test(loc);
        const marketOk =
          isRemote ||
          wantedMarkets.has(market) ||
          (alert.include_visa && j.visa_sponsorship === true);
        if (!marketOk) return false;
        return jobMatchesKeywords(j, alert.keywords);
      });

      if (matches.length === 0) {
        results.push({ email: alert.email, matched: 0 });
        // Still advance last_sent_at so window slides forward
        await supabase
          .from("job_alerts")
          .update({ last_sent_at: now.toISOString(), last_job_count: 0 })
          .eq("id", alert.id);
        continue;
      }

      const html = buildEmailHtml(alert, matches);
      const text = buildText(alert, matches);
      const messageId = crypto.randomUUID();
      const subject = `🔥 ${matches.length} new verified remote ${matches.length === 1 ? "job matches" : "jobs match"} your alert`;

      // Log pending
      await supabase.from("email_send_log").insert({
        message_id: messageId,
        template_name: "job-alert",
        recipient_email: alert.email,
        status: "pending",
      });

      const { error: enqErr } = await supabase.rpc("enqueue_email", {
        queue_name: "transactional_emails",
        payload: {
          run_id: crypto.randomUUID(),
          message_id: messageId,
          to: alert.email,
          from: `${SITE_NAME} Job Alerts <alerts@${FROM_DOMAIN}>`,
          sender_domain: SENDER_DOMAIN,
          subject,
          html,
          text,
          purpose: "transactional",
          label: "job-alert",
          idempotency_key: `job-alert-${alert.id}-${now.toISOString().slice(0, 13)}`,
          queued_at: now.toISOString(),
        },
      });

      if (enqErr) {
        console.error("Enqueue failed", enqErr);
        await supabase.from("email_send_log").insert({
          message_id: messageId,
          template_name: "job-alert",
          recipient_email: alert.email,
          status: "failed",
          error_message: enqErr.message,
        });
        results.push({ email: alert.email, error: enqErr.message });
        continue;
      }

      await supabase
        .from("job_alerts")
        .update({ last_sent_at: now.toISOString(), last_job_count: matches.length })
        .eq("id", alert.id);

      sent++;
      results.push({ email: alert.email, matched: matches.length, queued: true });
    }

    return new Response(JSON.stringify({ ok: true, processed: sent, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-job-alerts error", err);
    return new Response(JSON.stringify({ ok: false, error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
