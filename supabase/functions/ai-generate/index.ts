import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const AI_GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

const PROMPTS: Record<string, (data: any) => string> = {
  "cv-standard": (d) => `You are an elite CV writer with 15 years international experience. Write a complete Standard Professional CV.

Candidate: ${JSON.stringify(d)}

RULES:
- Sections: PROFESSIONAL PROFILE | WORK EXPERIENCE | EDUCATION | SKILLS | LANGUAGES | CERTIFICATIONS
- Achievement-focused bullet points
- Strong action verbs throughout
- Quantify achievements with numbers
- British professional English
- Max 2 pages content
- ZERO placeholder brackets
- Return clean formatted text only`,

  "cv-ats": (d) => `You are an ATS optimization expert. Write a fully ATS-optimized CV.

Candidate: ${JSON.stringify(d)}

RULES:
- NO tables, columns, graphics, text boxes
- Standard headers: "Work Experience" "Education" "Skills" (ATS-recognized)
- Dense keyword integration for ${d.industry || "general"} industry
- 15-20 skills as comma-separated list
- "Core Competencies" section after profile
- Consistent date format MM/YYYY
- Spell out acronyms first use
- Label top: "ATS-OPTIMIZED VERSION"`,

  "cv-gulf": (d) => `You are a Gulf/International CV expert specializing in UAE, Saudi, Qatar, Kuwait.

Candidate: ${JSON.stringify(d)}

RULES:
- Include: Nationality, DOB, Marital Status, Visa Status, Passport No (blank), Religion (optional/blank)
- Note: "[ATTACH PASSPORT PHOTO]" top-right
- Gulf-appropriate objective statement
- Emphasize loyalty, multicultural experience
- Add: Notice Period | Expected Salary | Available to Join fields
- References: "Available upon request"
- Formal respectful tone for Gulf employers
- Label top: "INTERNATIONAL/GULF VERSION"`,

  "cv-europass": (d) => `You are a Europass CV specialist for European Union job applications.

Candidate: ${JSON.stringify(d)}

RULES:
- Follow official Europass structure:
  PERSONAL INFORMATION
  WORK EXPERIENCE (reverse chronological)
  EDUCATION AND TRAINING
  PERSONAL SKILLS (Mother tongue, Other languages with CEFR levels)
  DIGITAL COMPETENCE (DIGCOMP)
  OTHER SKILLS
  DRIVING LICENCE
  ADDITIONAL INFORMATION
- Formal EU administrative English
- Label top: "EUROPASS — EU APPLICATIONS"`,

  "cover-letter": (d) => `Expert career consultant. Write a compelling ATS-optimized cover letter.

Job: ${d.jobTitle} at ${d.company}, ${d.location || ""}
Applicant: ${d.name}
Tone: ${d.tone || "Professional"}
Market: ${d.targetMarket || "International"}
Experience: ${d.experience}

Requirements:
- ${d.tone || "Professional"} tone for ${d.targetMarket || "International"} market
- 3-4 paragraphs: hook, value prop, achievements, strong CTA closing
- Mention ${d.company} and ${d.jobTitle} naturally
- ATS-friendly keywords throughout
- End: "Yours sincerely, ${d.name}"
- NO placeholder brackets
- Max 350 words
- Return cover letter text ONLY`,

  "ats-scan": (d) => `ATS analyst. Analyze this CV.
CV: ${d.cvText}
${d.jobDescription ? "Job Description: " + d.jobDescription : ""}

Return ONLY valid JSON, no markdown:
{
  "overallScore": number 0-100,
  "categories": {
    "atsCompatibility": {"score": number, "label": "ATS Compatibility", "feedback": "one sentence"},
    "keywordOptimization": {"score": number, "label": "Keyword Optimization", "feedback": "one sentence"},
    "formattingQuality": {"score": number, "label": "Formatting Quality", "feedback": "one sentence"},
    "readabilityScore": {"score": number, "label": "Readability", "feedback": "one sentence"},
    "impactLanguage": {"score": number, "label": "Impact Language", "feedback": "one sentence"}
  },
  "topStrengths": ["s1","s2","s3"],
  "criticalIssues": ["i1","i2","i3"],
  "quickWins": ["w1","w2","w3"],
  "missingKeywords": ["k1","k2","k3","k4","k5"],
  "verdict": "one bold summary sentence"
}`,

  "optimize-cv": (d) => `You are an elite CV writer specializing in job-tailored optimization.

JOB TITLE: ${d.jobTitle}
COMPANY: ${d.company}
JOB DESCRIPTION: ${d.jobDescription}

CURRENT CV:
${d.currentCV}

TASK: Rewrite and optimize this CV specifically for this job.

OPTIMIZATION RULES:
1. Reorder experience sections — most relevant to THIS job comes first
2. Inject missing ATS keywords from job description naturally throughout
3. Strengthen achievement statements with numbers and impact
4. Emphasize skills that match job requirements
5. Rewrite professional summary to directly address this specific role
6. Add any missing relevant keywords to skills section

CV STRUCTURE:
PROFESSIONAL SUMMARY (tailored to this role)
CORE SKILLS (keyword-optimized for this job)
PROFESSIONAL EXPERIENCE (relevance-ordered)
EDUCATION
CERTIFICATIONS
LANGUAGES

STANDARDS:
- Achievement-focused bullet points
- Strong action verbs
- ATS-friendly formatting
- Maximum 2 pages
- Professional executive language
- British English
- ZERO placeholder text

Return the complete optimized CV text only.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { type, data } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const promptFn = PROMPTS[type];
    if (!promptFn) throw new Error(`Unknown generation type: ${type}`);

    const prompt = promptFn(data);
    const useJson = type === "ats-scan";

    const response = await fetch(AI_GATEWAY, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
        stream: false,
        ...(useJson ? { response_format: { type: "json_object" } } : {}),
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content || "";

    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("AI generate error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
