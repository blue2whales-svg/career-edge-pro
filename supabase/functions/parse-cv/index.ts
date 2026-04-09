import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { requireAuth } from "../_shared/auth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const auth = await requireAuth(req);
  if (auth instanceof Response) return auth;

  try {
    const { rawText } = await req.json();

    if (!rawText) {
      return new Response(
        JSON.stringify({ error: "No CV text provided" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) throw new Error("Missing ANTHROPIC_API_KEY");

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-5",
        max_tokens: 2000,
        messages: [
          {
            role: "user",
            content: `Extract the following information from this CV and return ONLY a valid JSON object with no extra text, no markdown, no backticks.

Return this exact structure:
{
  "name": "",
  "email": "",
  "phone": "",
  "location": "",
  "linkedin": "",
  "careerSummary": "",
  "experience": "",
  "education": "",
  "skills": "",
  "certifications": ""
}

Rules:
- experience: format each role as "Job Title at Company (Start – End)\n• Achievement 1\n• Achievement 2"
- skills: comma separated list
- If a field is not found, leave it as empty string
- Return ONLY the JSON, nothing else

CV TEXT:
${rawText}`,
          },
        ],
      }),
    });

    const result = await response.json();
    const content = result.content?.[0]?.text || "";

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      const match = content.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      } else {
        throw new Error("Could not parse Claude response as JSON");
      }
    }

    return new Response(
      JSON.stringify({ profile: parsed }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
