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

    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    if (!GROQ_API_KEY) throw new Error("Missing GROQ_API_KEY");

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

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 1000,
        messages: [
          { role: "user", content: prompt }
        ],
      }),
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content ?? "{}";
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
