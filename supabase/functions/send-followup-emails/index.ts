import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const AT_API_KEY = Deno.env.get("AFRICASTALKING_API_KEY")!;
const AT_USERNAME = Deno.env.get("AFRICASTALKING_USERNAME")!;

async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY || !to) return;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "CVEdge <hello@cveedge.com>",
      to,
      subject,
      html,
    }),
  });
}

async function sendSMS(to: string, message: string) {
  if (!AT_API_KEY || !to) return;
  // Normalize phone: ensure it starts with +254
  let phone = to.replace(/\s+/g, "");
  if (phone.startsWith("07") || phone.startsWith("01")) {
    phone = "+254" + phone.slice(1);
  } else if (phone.startsWith("254")) {
    phone = "+" + phone;
  }
  const body = new URLSearchParams({
    username: AT_USERNAME,
    to: phone,
    message,
    from: "CVEdge",
  });
  await fetch("https://api.africastalking.com/version1/messaging", {
    method: "POST",
    headers: {
      "apiKey": AT_API_KEY,
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json",
    },
    body: body.toString(),
  });
}

serve(async () => {
  const now = new Date();

  const { data: queue, error } = await supabase
    .from("cv_followup_queue")
    .select("*")
    .or("day1_sent.eq.false,day3_sent.eq.false,day7_sent.eq.false");

  if (error) return new Response("DB error", { status: 500 });

  for (const row of queue ?? []) {
    const created = new Date(row.created_at);
    const hoursElapsed = (now.getTime() - created.getTime()) / (1000 * 60 * 60);

    // DAY 1 — send immediately (within first 2 hours)
    if (!row.day1_sent && hoursElapsed < 2) {
      const subject = "✅ Your CV is being prepared — CVEdge";
      const html = `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;">
          <h2 style="color:#c9a84c;">Hi ${row.name?.split(" ")[0] ?? "there"} 👋</h2>
          <p>Your CV order has been received and your <strong>${row.template_id?.replace(/-/g, " ")}</strong> template is ready to download.</p>
          <p>If you haven't downloaded it yet, <a href="https://cveedge.com/cv-builder" style="color:#c9a84c;">go back to your editor here</a>.</p>
          <hr style="border:none;border-top:1px solid #eee;margin:20px 0;">
          <p style="color:#888;font-size:13px;">CVEdge · Nairobi, Kenya · <a href="https://cveedge.com">cveedge.com</a></p>
        </div>`;
      const sms = `Hi ${row.name?.split(" ")[0] ?? "there"}! Your CVEdge order is confirmed. Download your CV at cveedge.com. Need help? Reply to this message.`;

      if (row.email) await sendEmail(row.email, subject, html);
      await sendSMS(row.phone, sms);

      await supabase.from("cv_followup_queue").update({
        day1_sent: true,
        day1_sent_at: now.toISOString(),
      }).eq("id", row.id);
    }

    // DAY 3 — between 68 and 80 hours
    if (!row.day3_sent && hoursElapsed >= 68 && hoursElapsed <= 80) {
      const subject = "Have you applied yet? Here are jobs matching your profile 🎯";
      const html = `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;">
          <h2 style="color:#c9a84c;">Hi ${row.name?.split(" ")[0] ?? "there"},</h2>
          <p>Your CV is ready — have you started applying?</p>
          <p>Check out <strong>live job listings</strong> on CVEdge right now — hundreds of employers in Kenya and across Africa are hiring.</p>
          <a href="https://cveedge.com/jobs" style="display:inline-block;background:#c9a84c;color:#000;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;margin:12px 0;">Browse Jobs Now →</a>
          <p style="margin-top:16px;">Also — want to stand out even more? Add a <strong>LinkedIn Profile Optimization</strong> to your order for just <strong>KSh 2,000</strong>. We rewrite your LinkedIn to match your new CV.</p>
          <a href="https://cveedge.com/linkedin-optimization" style="color:#c9a84c;font-weight:bold;">Upgrade my LinkedIn →</a>
          <hr style="border:none;border-top:1px solid #eee;margin:20px 0;">
          <p style="color:#888;font-size:13px;">CVEdge · Nairobi, Kenya</p>
        </div>`;
      const sms = `Hi ${row.name?.split(" ")[0] ?? "there"}! CVEdge here. Have you applied yet? Browse live jobs at cveedge.com/jobs. Also: upgrade your LinkedIn for KSh 2,000 - reply YES to learn more.`;

      if (row.email) await sendEmail(row.email, subject, html);
      await sendSMS(row.phone, sms);

      await supabase.from("cv_followup_queue").update({
        day3_sent: true,
        day3_sent_at: now.toISOString(),
      }).eq("id", row.id);
    }

    // DAY 7 — between 164 and 176 hours
    if (!row.day7_sent && hoursElapsed >= 164 && hoursElapsed <= 176) {
      const subject = "Your CV is working — need a cover letter too? ✉️";
      const html = `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;">
          <h2 style="color:#c9a84c;">Hi ${row.name?.split(" ")[0] ?? "there"},</h2>
          <p>It's been a week since you downloaded your CV. We hope the applications are going well!</p>
          <p>One thing that dramatically increases your callback rate: a <strong>tailored cover letter</strong>.</p>
          <p>Get a professionally written cover letter matched to your CV for just <strong>KSh 800</strong>.</p>
          <a href="https://cveedge.com/cover-letter" style="display:inline-block;background:#c9a84c;color:#000;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;margin:12px 0;">Get My Cover Letter →</a>
          <hr style="border:none;border-top:1px solid #eee;margin:20px 0;">
          <p style="color:#888;font-size:13px;">CVEdge · Nairobi, Kenya</p>
        </div>`;
      const sms = `Hi ${row.name?.split(" ")[0] ?? "there"}! CVEdge here. Boost your applications with a cover letter for just KSh 800. Order at cveedge.com/cover-letter`;

      if (row.email) await sendEmail(row.email, subject, html);
      await sendSMS(row.phone, sms);

      await supabase.from("cv_followup_queue").update({
        day7_sent: true,
        day7_sent_at: now.toISOString(),
      }).eq("id", row.id);
    }
  }

  return new Response(JSON.stringify({ processed: queue?.length ?? 0 }), {
    headers: { "Content-Type": "application/json" },
  });
});
