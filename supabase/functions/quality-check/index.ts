import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { generatedText, jobTitle, jobCompany, jobDescription } = await req.json();
    if (!generatedText) throw new Error("generatedText is required");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: "You are an expert CV quality assessor. You score career documents on specific criteria and return structured JSON scores.",
          },
          {
            role: "user",
            content: `Score the following CV and Cover Letter documents against this job:

Job Title: ${jobTitle || "N/A"}
Company: ${jobCompany || "N/A"}
Job Description: ${jobDescription || "N/A"}

--- DOCUMENTS ---
${generatedText}
--- END ---

Score each criterion from 1-10 and provide an overall score and written verdict. Return ONLY valid JSON in this exact format:
{
  "tailoring": <number>,
  "keywords": <number>,
  "quantification": <number>,
  "actionVerbs": <number>,
  "clicheAvoidance": <number>,
  "coverLetterQuality": <number>,
  "overall": <number>,
  "verdict": "<string with 2-3 sentence assessment>"
}`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "quality_scores",
              description: "Return quality scores for the CV and cover letter",
              parameters: {
                type: "object",
                properties: {
                  tailoring: { type: "number", description: "Job tailoring score 1-10" },
                  keywords: { type: "number", description: "ATS keywords score 1-10" },
                  quantification: { type: "number", description: "Quantified achievements score 1-10" },
                  actionVerbs: { type: "number", description: "Action verbs usage score 1-10" },
                  clicheAvoidance: { type: "number", description: "Cliché avoidance score 1-10" },
                  coverLetterQuality: { type: "number", description: "Cover letter quality score 1-10" },
                  overall: { type: "number", description: "Overall score 1-10" },
                  verdict: { type: "string", description: "2-3 sentence written assessment" },
                },
                required: ["tailoring", "keywords", "quantification", "actionVerbs", "clicheAvoidance", "coverLetterQuality", "overall", "verdict"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "quality_scores" } },
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI error:", aiResponse.status, errText);
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();

    // Extract from tool call response
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    let scores;
    if (toolCall?.function?.arguments) {
      scores = typeof toolCall.function.arguments === "string"
        ? JSON.parse(toolCall.function.arguments)
        : toolCall.function.arguments;
    } else {
      // Fallback: try parsing from content
      const content = aiData.choices?.[0]?.message?.content || "";
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      scores = jsonMatch ? JSON.parse(jsonMatch[0]) : { error: "Could not parse scores" };
    }

    return new Response(JSON.stringify(scores), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("quality-check error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
