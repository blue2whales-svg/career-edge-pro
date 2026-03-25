import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { cvText, jobInput } = await req.json();
    const apiKey = Deno.env.get("GROQ_API_KEY");
    if (!apiKey) throw new Error("GROQ_API_KEY not set");

    const groqFetch = async (prompt: string, maxTokens: number) => {
      const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: maxTokens,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await resp.json();
      if (data.error) throw new Error(data.error.message);
      return data.choices?.[0]?.message?.content || "";
    };

    // --- Tailored CV ---
    const tailoredCV = await groqFetch(`You are an expert CV writer for CVEdge.live. Rewrite this CV to match the job requirements below. Keep all real experience but reorder priorities, sharpen wording, and emphasise matching skills. Follow professional standards: clear sections (Profile, Experience, Education, Skills), concise bullet points starting with action verbs, no fluff.

CV:
${cvText}

JOB:
${jobInput}

Output ONLY the rewritten CV text. No preamble, no explanation.`, 1500);

    // --- Cover Letter ---
    const coverLetter = await groqFetch(`Write a concise, compelling cover letter for this job based on the tailored CV below. 3 paragraphs: (1) strong opening with role name, (2) key matching achievements, (3) confident close. Professional tone.

TAILORED CV:
${tailoredCV}

JOB:
${jobInput}

Output ONLY the cover letter. No preamble.`, 800);

    return new Response(JSON.stringify({ tailoredCV, coverLetter }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
