import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const AI_GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

// ── Region-specific CV rules ──────────────────────────────────────────
const REGION_RULES: Record<string, string> = {
  "kenya": `KENYA LOCAL CV RULES:
- Include: Full name, professional title, phone, email, location, nationality, date of birth, marital status
- Photo placeholder note: "[ATTACH PASSPORT PHOTO]"
- Sections: Professional Summary → Core Skills → Professional Experience → Education → Certifications → Technical Skills → Languages → References
- Emphasise local industry keywords (Safaricom, KCB, Equity Bank, KPMG East Africa, Deloitte Kenya)
- Tone: Professional, warm, community-oriented
- Include driving licence if available
- References section with 2-3 referees (name, title, company, phone)`,

  "uae": `UAE / DUBAI CV RULES:
- Include personal details: Nationality, Date of Birth, Visa Status (if available), Languages spoken
- Note: "[ATTACH PASSPORT PHOTO]" top-right
- Sections: Header → Personal Details → Professional Summary → Core Skills → Professional Experience → Education → Certifications → Technical Skills
- Emphasise reliability, professionalism, and international work readiness
- Mention visa status, notice period, expected salary range if provided
- Highlight multicultural experience and adaptability
- Industries to emphasise: hospitality, real estate, finance, construction, logistics, retail
- Formal, respectful tone suited to Gulf employers`,

  "qatar": `QATAR / GULF CV RULES:
- Similar to UAE but slightly more structured and formal
- Include: Nationality, DOB, Religion (optional), Passport details, Marital Status
- Note: "[ATTACH PASSPORT PHOTO]" top-right
- Sections: Header → Personal Details → Professional Summary → Core Skills → Professional Experience → Education → Certifications → Technical Skills
- Highlight industries: hospitality, engineering, operations, customer service, logistics, oil & gas
- Add: Notice Period, Expected Salary, Available to Join fields at bottom
- References: "Available upon request"
- Very formal, respectful tone`,

  "europe": `EUROPE CV RULES:
- DO NOT include: Date of birth, marital status, nationality, religion, photo
- Privacy-first approach — anti-discrimination laws apply
- Sections: Header → Professional Summary → Core Skills → Professional Experience → Education → Certifications → Technical Skills → Languages (with CEFR levels)
- Clean, minimal, professional format
- Maximum 2 pages
- Use Europass-compatible language proficiency levels (A1-C2)
- Emphasise cross-cultural competence and EU work eligibility if relevant`,

  "australia": `AUSTRALIA CV RULES:
- DO NOT include: Date of birth, marital status, nationality, religion, photo
- Sections: Header → Professional Summary → Key Skills → Professional Experience → Education → Certifications → Technical Skills
- HEAVILY achievement-driven with measurable results
- Example bullets: "Improved operational efficiency by 35%", "Reduced customer complaints by 28%"
- Strong action verbs throughout
- Include LinkedIn URL
- Maximum 2-3 pages
- Emphasise work rights/visa status subtly if relevant`,

  "uk": `UNITED KINGDOM CV RULES:
- DO NOT include: Age, date of birth, marital status, nationality, religion, photo
- Sections: Header → Professional Profile → Core Skills → Professional Experience → Education → Certifications → Additional Skills
- Concise, achievement-focused — maximum 2 pages strictly
- British English spelling throughout
- Strong emphasis on quantified achievements
- Include "Right to work in UK" only if applicable`,

  "usa": `UNITED STATES RESUME RULES:
- This is a RESUME, not a CV — use the word "Resume" internally
- DO NOT include: Date of birth, marital status, nationality, religion, photo, age
- Sections: Header → Professional Summary → Key Skills → Professional Experience → Education → Certifications → Technical Skills
- HIGHLY metrics-driven: "Increased revenue by 20%", "Managed teams of 15+ staff", "Improved retention by 30%"
- 1 page preferred for <10 years experience, 2 pages max
- American English spelling throughout
- Focus strongly on impact, leadership, and ROI`,

  "africa": `AFRICA (PAN-AFRICAN) CV RULES:
- Include: Full name, professional title, phone, email, location, nationality
- Optional: Date of birth, marital status (varies by country)
- Sections: Professional Summary → Core Skills → Professional Experience → Education → Certifications → Technical Skills → Languages → References
- Emphasise adaptability, multilingual skills, cross-border experience
- Highlight relevant NGO, development, or multinational experience
- Include driving licence if available
- References with full contact details preferred`,
};

const DESIGN_RULES = `
EXECUTIVE VISUAL FORMATTING RULES (apply to ALL regions):
- Single-column ATS-friendly structure — NO complex tables
- Clean, modern, executive appearance
- Section headers: UPPERCASE, bold, with subtle accent line below
- Font hierarchy: Name 26-30px bold, Section headings 14-16px uppercase, Body 11-12px
- Body text: black
- Accent colors (headers/dividers only): deep navy, professional gold, slate blue, or charcoal grey
- Generous white space between sections
- Bullet points for experience (5-10 per role for senior, 3-5 for junior)
- Achievement-focused bullet points with strong action verbs
- Quantify achievements with numbers wherever possible

ATS OPTIMIZATION:
- Analyse the job title and industry
- Insert relevant ATS keywords naturally into summary, skills, and experience
- Avoid keyword stuffing — maintain natural readability
- Use standard section headers that ATS systems recognise

CONTENT IMPROVEMENT:
- Convert duties into achievements automatically
- Strengthen weak action verbs
- Correct grammar and improve clarity
- Ensure professional executive tone throughout
- ZERO placeholder brackets — fill everything or omit
`;

function buildCVPrompt(d: any): string {
  const market = d.targetMarket || "kenya";
  const regionRules = REGION_RULES[market] || REGION_RULES["kenya"];
  
  return `You are an elite executive CV writer with 15+ years of international experience writing for Fortune 500 recruiters and global hiring managers. Write a complete, polished, ready-to-submit CV.

CANDIDATE DATA:
${JSON.stringify(d)}

${regionRules}

${DESIGN_RULES}

FORMAT: ${d.cvFormat || "chronological"}
EXPERIENCE LEVEL: ${d.experienceLevel || "mid-level"}

OUTPUT RULES:
- Return the complete CV as clean, well-structured markdown
- Use proper markdown headers (##), bold (**), bullet points (-)
- The document must feel comparable to a $500+ professional CV writing service
- Maximum 2 pages of content (3 for executive level)
- Every section must be complete and polished
- Return CV text ONLY — no commentary or notes`;
}

function buildCoverLetterPrompt(d: any): string {
  const market = d.targetMarket || "kenya";
  
  return `You are an elite career consultant who writes executive-quality cover letters. Write a compelling, persuasive cover letter.

CANDIDATE: ${d.name}
TARGET ROLE: ${d.jobTitle} at ${d.company}
LOCATION: ${d.location || ""}
TONE: ${d.tone || "Professional"}
TARGET MARKET: ${market}
EXPERIENCE: ${d.experience}

COVER LETTER STRUCTURE:
1. Header: Candidate name, contact info, date, hiring manager (if known), company name
2. Opening paragraph: Strong hook introducing application with confidence
3. Body paragraph 1: Highlight 2-3 most relevant achievements with metrics
4. Body paragraph 2: Explain unique value proposition for this specific role and company
5. Closing paragraph: Express enthusiasm, request for discussion, availability

STYLE RULES:
- Tone: Confident, professional, persuasive, executive
- Match the formality level to the ${market} market
- ATS-friendly keywords from the job naturally integrated
- Mention ${d.company} and ${d.jobTitle} naturally — show you've researched
- End with "Yours sincerely," (UK/Europe/Africa) or "Sincerely," (USA/Australia)
- Maximum 350 words
- ZERO placeholder brackets
- Return cover letter text ONLY

${DESIGN_RULES}`;
}

const PROMPTS: Record<string, (data: any) => string> = {
  "cv-standard": buildCVPrompt,
  "cv-ats": (d) => {
    const base = buildCVPrompt(d);
    return base + `\n\nADDITIONAL ATS RULES:
- Label top: "ATS-OPTIMIZED VERSION"
- NO tables, columns, graphics, text boxes
- Standard ATS-recognised headers only
- Dense keyword integration for ${d.industry || "general"} industry
- 15-20 skills as comma-separated list in "Core Competencies" section
- Consistent date format: MM/YYYY
- Spell out acronyms on first use`;
  },
  "cv-gulf": (d) => {
    d.targetMarket = d.targetMarket || "uae";
    return buildCVPrompt(d) + `\n\nGULF-SPECIFIC ADDITIONS:
- Label top: "INTERNATIONAL/GULF VERSION"
- Add Notice Period, Expected Salary, Available to Join fields
- Gulf-appropriate objective statement emphasising loyalty and commitment`;
  },
  "cv-europass": (d) => {
    d.targetMarket = "europe";
    return buildCVPrompt(d) + `\n\nEUROPASS ADDITIONS:
- Label top: "EUROPASS — EU APPLICATIONS"
- Follow official Europass section order
- Language proficiency with CEFR levels (A1-C2)
- Digital competence section (DIGCOMP framework)
- Formal EU administrative English`;
  },
  "cover-letter": buildCoverLetterPrompt,

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

${DESIGN_RULES}

OPTIMIZATION RULES:
1. Reorder experience — most relevant to THIS job first
2. Inject missing ATS keywords from job description naturally
3. Strengthen achievements with numbers and impact
4. Emphasise skills matching job requirements
5. Rewrite professional summary for this specific role
6. Add missing relevant keywords to skills

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
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please try again later." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
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
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
