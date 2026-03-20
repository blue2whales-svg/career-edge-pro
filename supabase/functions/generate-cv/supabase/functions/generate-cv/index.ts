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
    const { systemPrompt, clientProfile, jobDescription } = await req.json();

    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) throw new Error("Missing ANTHROPIC_API_KEY");

    const userMessage = `
CLIENT PROFILE:
${JSON.stringify(clientProfile, null, 2)}

JOB DESCRIPTION:
${jobDescription}

Using the client profile above, generate two things:
1. A tailored, ATS-optimised CV for this specific role
2. A 3-paragraph cover letter tailored to this job and employer

Format your response exactly like this:
===CV===
[full CV here]
===COVER LETTER===
[full cover letter here]
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
        max_tokens: 4000,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    const data = await response.json();
    const text = data.content?.[0]?.text ?? "";

    const cvMatch = text.match(/===CV===([\s\S]*?)===COVER LETTER===/);
    const coverMatch = text.match(/===COVER LETTER===([\s\S]*)/);

    return new Response(
      JSON.stringify({
        cv: cvMatch?.[1]?.trim() ?? "",
        coverLetter: coverMatch?.[1]?.trim() ?? "",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
