import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { orderId } = await req.json();
    if (!orderId) throw new Error("orderId is required");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch the order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order) throw new Error("Order not found");

    // Generate a document for each CV-related service
    const cvServices = order.services.filter((s: string) =>
      ["cv", "executive-cv", "ats-cv", "international-cv", "cover-letter", "linkedin", "personal-statement", "scholarship", "reference"].includes(s)
    );

    const results = [];

    for (const serviceType of cvServices) {
      // Insert placeholder
      const { data: doc, error: insertError } = await supabase
        .from("generated_documents")
        .insert({
          order_id: orderId,
          service_type: serviceType,
          status: "generating",
          content: "",
        })
        .select()
        .single();

      if (insertError) {
        console.error("Insert error:", insertError);
        continue;
      }

      const prompt = buildPrompt(serviceType, order);

      try {
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
                content: `You are an expert professional CV and career document writer based in Kenya. You create ATS-optimised, compelling career documents. Output clean, well-structured text using markdown formatting (headers, bullet points, bold). Do NOT include any preamble or explanation — output the document content directly.`,
              },
              { role: "user", content: prompt },
            ],
          }),
        });

        if (!aiResponse.ok) {
          const errText = await aiResponse.text();
          console.error(`AI error for ${serviceType}:`, aiResponse.status, errText);
          await supabase
            .from("generated_documents")
            .update({ status: "error", content: "Generation failed. Please try again." })
            .eq("id", doc.id);
          continue;
        }

        const aiData = await aiResponse.json();
        const content = aiData.choices?.[0]?.message?.content || "No content generated.";

        await supabase
          .from("generated_documents")
          .update({ status: "ready", content })
          .eq("id", doc.id);

        results.push({ serviceType, docId: doc.id, status: "ready" });
      } catch (aiErr) {
        console.error(`AI call failed for ${serviceType}:`, aiErr);
        await supabase
          .from("generated_documents")
          .update({ status: "error", content: "Generation failed." })
          .eq("id", doc.id);
      }
    }

    // Update order status
    await supabase
      .from("orders")
      .update({ status: "documents_ready" })
      .eq("id", orderId);

    return new Response(JSON.stringify({ success: true, documents: results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-cv error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function buildPrompt(serviceType: string, order: any): string {
  const name = order.name || "the client";
  const jobTitle = order.job_title || "";
  const experience = order.experience || "";
  const skills = order.skills || "";
  const education = order.education || "";
  const details = order.details || "";

  const context = `
Client Name: ${name}
Target Job/Role: ${jobTitle}
Experience: ${experience}
Key Skills: ${skills}
Education: ${education}
Additional Details: ${details}
  `.trim();

  switch (serviceType) {
    case "cv":
      return `Write a professional CV for the following client. Make it ATS-friendly, compelling, and well-structured with sections: Professional Summary, Work Experience, Education, Skills, and any relevant sections.\n\n${context}`;
    case "executive-cv":
      return `Write an executive-level CV for a senior professional. Include: Executive Summary, Leadership Experience, Strategic Achievements, Board/Advisory Roles, Education, and Executive Competencies. Use powerful action verbs and quantify achievements.\n\n${context}`;
    case "ats-cv":
      return `Write a highly ATS-optimised CV. Focus on keyword density, clean formatting, standard section headers, and quantified achievements. Ensure it passes applicant tracking systems.\n\n${context}`;
    case "international-cv":
      return `Write an international-format CV suitable for global job applications. Include all standard international sections and adapt formatting for cross-border applications.\n\n${context}`;
    case "cover-letter":
      return `Write a compelling, tailored cover letter. Open with a strong hook, demonstrate value with specific examples, and close with a clear call to action.\n\n${context}`;
    case "linkedin":
      return `Write optimised LinkedIn profile content including: Headline (120 chars max), About section (compelling narrative), and Experience entries with achievements. Optimise for LinkedIn search.\n\n${context}`;
    case "personal-statement":
      return `Write a compelling personal statement for a university/postgraduate application. Show motivation, relevant experience, and future goals.\n\n${context}`;
    case "scholarship":
      return `Write a winning scholarship essay. Demonstrate academic excellence, leadership, community impact, and clear goals. Make it emotionally compelling and authentic.\n\n${context}`;
    case "reference":
      return `Write a professional reference letter for this candidate. Highlight their strengths, achievements, character, and suitability for their target role. Write it from the perspective of a senior colleague or supervisor.\n\n${context}`;
    default:
      return `Write a professional career document for the following client:\n\n${context}`;
  }
}
