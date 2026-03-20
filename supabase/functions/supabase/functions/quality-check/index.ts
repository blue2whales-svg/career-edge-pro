import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { cv, coverLetter, jobDescription } = await req.json();

    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) throw new Error("Missing ANTHROPIC_API_KEY");

    const prompt = `
You are a senior CV quality auditor. Score the following CV and cover letter against the job description.

JOB DESCRIPTION:
${jobDescription}

CV:
${cv}

COVER LETTER:
${coverLetter}

Score each dimension from 0 to 10 and return ONLY valid JSON, no extra text:

{
  "tailoring": <0-10>,
  "keywords": <0-10>,
  "quantification": <0-10>,
  "actionVerbs": <0-10>,
  "clicheAvoidance": <0-10>,
  "coverLetterQuality": <0-10>,
  "overall": <0-10>,
  "verdict": "Ready to Send" | "Minor Revisions" | "Needs Rework",
  "topIssues": ["issue 1", "issue 2", "issue 3"]
}
    `.trim();

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    const text = data.content?.[0]?.text ?? "{}";
    const clean = text.replace(/```json|```/g, "").trim();
    const scores = JSON.parse(clean);

    return new Response(JSON.stringify(scores), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
