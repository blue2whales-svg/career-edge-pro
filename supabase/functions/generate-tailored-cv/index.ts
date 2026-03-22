import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { systemPrompt, clientProfile, jobDescription } = await req.json();
    if (!clientProfile || !jobDescription) throw new Error("clientProfile and jobDescription are required");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const userPrompt = `
CLIENT PROFILE:
Name: ${clientProfile.name || "N/A"}
Email: ${clientProfile.email || "N/A"}
Phone: ${clientProfile.phone || "N/A"}
Location: ${clientProfile.location || "N/A"}
LinkedIn: ${clientProfile.linkedin || "N/A"}
Career Summary: ${clientProfile.careerSummary || "N/A"}

Work Experience:
${clientProfile.experience || "N/A"}

Education:
${clientProfile.education || "N/A"}

Skills: ${clientProfile.skills || "N/A"}
Certifications: ${clientProfile.certifications || "N/A"}

---

JOB DESCRIPTION:
Job Title: ${jobDescription.jobTitle || "N/A"}
Company: ${jobDescription.company || "N/A"}

Full Job Posting:
${jobDescription.fullDescription || "N/A"}

---

INSTRUCTIONS:
Generate TWO documents separated by the marker "===COVER_LETTER_START===":

1. First, output a complete, professional, ATS-optimised CV tailored to this specific job. Use proper markdown formatting with headers, bullet points, and bold text.

2. Then output "===COVER_LETTER_START===" on its own line.

3. Then output a compelling, tailored cover letter for this exact role at this company.

Both documents must be tailored to the job description, use action verbs, quantify achievements, include ATS keywords from the job posting, and avoid clichés.
`.trim();

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt || "You are an expert professional CV and cover letter writer. Create ATS-optimised, compelling career documents." },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI error:", aiResponse.status, errText);
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const fullText = aiData.choices?.[0]?.message?.content || "";

    let cv = fullText;
    let coverLetter = "";

    if (fullText.includes("===COVER_LETTER_START===")) {
      const parts = fullText.split("===COVER_LETTER_START===");
      cv = parts[0].trim();
      coverLetter = parts[1].trim();
    }

    return new Response(JSON.stringify({ cv, coverLetter, fullText }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-tailored-cv error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
