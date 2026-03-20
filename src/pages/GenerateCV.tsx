// src/pages/GenerateCV.tsx
// Drop this file into your Lovable project's src/pages/ folder.
// Also add the route in your App.tsx: <Route path="/generate-cv" element={<GenerateCV />} />

import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ClientProfile {
  name: string;
  email: string;
  contact: string;
  linkedin: string;
  summary: string;
  experience: string;
  education: string;
  skills: string;
  extra: string;
}

interface JobInfo {
  title: string;
  company: string;
  description: string;
}

interface QualityScores {
  tailoring: number;
  keywords: number;
  quantification: number;
  actionVerbs: number;
  clicheAvoidance: number;
  coverLetterQuality: number;
  overall: number;
  verdict: string;
}

// ─── Constants ─────────────────────────────────────────────────────────────

const DEFAULT_SYSTEM_PROMPT = `You are an elite career strategist and professional document writer working for a premium job application service. Your task is to generate a tailored CV and Cover Letter of exceptional quality.

QUALITY STANDARDS — NON-NEGOTIABLE:
1. TAILORING: Every sentence must reflect the specific job description provided. Mirror the employer's language and keywords naturally.
2. ACTION VERBS: Begin every bullet point with a strong past-tense action verb (Led, Achieved, Designed, Increased, Delivered, etc.)
3. QUANTIFY: Add realistic, specific metrics wherever possible (e.g. "Managed a team of 8", "Reduced costs by 23%", "Served 150+ customers daily").
4. ATS OPTIMISED: Use keywords from the job description throughout both documents. No tables, no graphics, no text boxes — plain structured text only.
5. NO CLICHÉS: Never use phrases like "hardworking", "team player", "passionate", "results-driven", "go-getter". Show, don't tell.
6. PROFESSIONAL TONE: Confident, clear, concise. No filler words.
7. STRUCTURE (CV): Contact Info → Professional Summary (3 lines) → Key Skills (6–8 bullet points) → Work Experience (reverse chronological) → Education → Optional: Certifications / Languages.
8. COVER LETTER: 3 paragraphs only — (1) Why this role + company, (2) Your 2–3 strongest relevant achievements, (3) Call to action. Max 300 words.
9. HONESTY: Work only with the information provided. Do not invent roles, companies, or credentials.
10. FORMATTING: Use clear section headers. Bullet points for experience. Dates aligned right.

OUTPUT FORMAT:
Return two clearly labelled sections:
--- CV ---
[Full CV content here]

--- COVER LETTER ---
[Full Cover Letter content here]`;

const SCORE_DIMENSIONS = [
  { key: "tailoring" as const, label: "Job Tailoring" },
  { key: "keywords" as const, label: "ATS Keywords" },
  { key: "quantification" as const, label: "Quantification" },
  { key: "actionVerbs" as const, label: "Action Verbs" },
  { key: "clicheAvoidance" as const, label: "Cliché-Free" },
  { key: "coverLetterQuality" as const, label: "Cover Letter" },
];

// ─── Score helpers ─────────────────────────────────────────────────────────

function scoreColor(score: number) {
  if (score >= 8) return "#4ade80";
  if (score >= 6) return "#f59e0b";
  return "#f87171";
}

function scoreLabel(score: number) {
  if (score >= 8) return "Ready to Send ✓";
  if (score >= 6) return "Minor Revisions ⚠";
  return "Needs Rework ✗";
}

// ─── Component ─────────────────────────────────────────────────────────────

export default function GenerateCV() {
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState<"cv" | "cover">("cv");
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);

  const [client, setClient] = useState<ClientProfile>({
    name: "", email: "", contact: "", linkedin: "",
    summary: "", experience: "", education: "", skills: "", extra: "",
  });

  const [job, setJob] = useState<JobInfo>({
    title: "", company: "", description: "",
  });

  const [cvText, setCvText] = useState("");
  const [coverText, setCoverText] = useState("");
  const [fullGenerated, setFullGenerated] = useState("");
  const [qualityScores, setQualityScores] = useState<QualityScores | null>(null);

  const [generating, setGenerating] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");

  // ── Helpers ──────────────────────────────────────────────────────────────

  const updateClient = (field: keyof ClientProfile) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setClient((prev) => ({ ...prev, [field]: e.target.value }));

  const updateJob = (field: keyof JobInfo) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setJob((prev) => ({ ...prev, [field]: e.target.value }));

  const loadSampleClient = () =>
    setClient({
      name: "Amina Ochieng",
      email: "amina.ochieng@gmail.com",
      contact: "+254 712 345 678 | Nairobi, Kenya",
      linkedin: "linkedin.com/in/aminaochieng",
      summary: "Finance professional with 6 years in NGO financial management. Looking to transition into a senior finance role in the hospitality sector.",
      experience: `Finance Officer | UNICEF Kenya | 2020–2024
- Managed $2.3M annual programme budget across 4 counties
- Led monthly donor financial reporting for 12 active grants
- Trained and supervised 3 junior finance staff
- Reduced financial discrepancies by 31% through improved reconciliation

Accounts Assistant | Equity Bank | 2018–2020
- Processed an average of 250 transactions daily with 99.8% accuracy
- Supported quarterly audits and internal compliance reviews`,
      education: "B.Com Finance | University of Nairobi | 2018\nCertificate in NGO Financial Management | Kenya School of Government | 2021",
      skills: "Budget management, Financial reporting, Donor compliance, SAP, QuickBooks, Advanced Excel, Team leadership, Cash flow forecasting",
      extra: "CPA Part II | English (Native), Swahili (Native), French (Intermediate)",
    });

  const loadSampleJob = () =>
    setJob({
      title: "Senior Financial Analyst",
      company: "Royal Caribbean International",
      description: `Senior Financial Analyst – Royal Caribbean International

About the Role:
Royal Caribbean International seeks a highly analytical Senior Financial Analyst to join our finance team. You will be responsible for financial planning, performance analysis, and ensuring fiscal compliance across operational departments.

Key Responsibilities:
- Develop and maintain complex financial models for business planning and forecasting
- Prepare monthly, quarterly, and annual financial reports for senior leadership
- Conduct variance analysis and identify trends, risks, and opportunities
- Partner with operational departments to optimise cost efficiency
- Support internal and external audit processes
- Manage budget preparation and monitoring for assigned departments ($5M+ budgets)
- Ensure compliance with IFRS and company financial policies

Requirements:
- Bachelor's degree in Finance, Accounting or related field
- CPA or ACCA qualification (preferred)
- Minimum 5 years progressive finance experience
- Advanced Excel and ERP system proficiency (SAP preferred)
- Experience with financial modelling and variance analysis
- Strong communication skills
- Experience in multi-currency environments is an advantage`,
    });

  // ── Generate Documents ───────────────────────────────────────────────────

  const generateDocuments = async () => {
    if (!job.description.trim()) {
      setError("Please paste the job description before generating.");
      return;
    }
    setError("");
    setGenerating(true);
    setStep(4);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("generate-cv", {
        body: { systemPrompt, clientProfile: client, jobDescription: job },
      });

      if (fnError) throw new Error(fnError.message);
      if (data.error) throw new Error(data.error);

      setCvText(data.cv || "");
      setCoverText(data.coverLetter || "");
      setFullGenerated(data.fullText || "");
    } catch (err: any) {
      setError(err.message || "Something went wrong generating documents.");
      setStep(3);
    } finally {
      setGenerating(false);
    }
  };

  // ── Quality Check ────────────────────────────────────────────────────────

  const runQualityCheck = async () => {
    setChecking(true);
    setStep(5);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("quality-check", {
        body: {
          generatedText: fullGenerated,
          jobTitle: job.title,
          jobCompany: job.company,
          jobDescription: job.description,
        },
      });

      if (fnError) throw new Error(fnError.message);
      if (data.error) throw new Error(data.error);

      setQualityScores(data);
    } catch (err: any) {
      setError(err.message || "Quality check failed.");
      setStep(4);
    } finally {
      setChecking(false);
    }
  };

  // ── Step pill helper ─────────────────────────────────────────────────────

  const StepPill = ({ n, label }: { n: number; label: string }) => {
    const isDone = n < step;
    const isActive = n === step;
    return (
      <div
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs border transition-all
          ${isActive ? "border-amber-500 text-amber-400 bg-amber-500/10" :
            isDone ? "border-green-500 text-green-400 bg-green-500/10" :
            "border-gray-700 text-gray-500"}`}
      >
        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold
          ${isActive ? "bg-amber-500 text-black" :
            isDone ? "bg-green-500 text-black" :
            "bg-gray-700 text-gray-400"}`}>
          {isDone ? "✓" : n}
        </div>
        {label}
      </div>
    );
  };

  // ── Shared input classes ─────────────────────────────────────────────────

  const inputCls = "w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 transition-all resize-y";
  const labelCls = "block text-[11px] font-mono tracking-widest uppercase text-gray-500 mb-1.5";

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-3xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-mono tracking-widest text-amber-400 border border-amber-800 bg-amber-400/10 px-4 py-1.5 rounded-full mb-4">
            ⚙ CV Generation Pipeline
          </span>
          <h1 className="text-4xl font-bold text-white mb-3">Generate Application Documents</h1>
          <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
            Tailored CVs and Cover Letters, quality-checked before delivery.
          </p>
        </div>

        {/* Step Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            [1, "System Prompt"], [2, "Client Profile"], [3, "Job Description"],
            [4, "Generate"], [5, "Quality Check"],
          ].map(([n, label]) => <StepPill key={n} n={n as number} label={label as string} />)}
        </div>

        {/* ── STEP 1: System Prompt ── */}
        {step === 1 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-5">
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">Master System Prompt</h2>
              <p className="text-sm text-gray-500">Controls every document generated. Customise to match your quality standards.</p>
            </div>
            <div>
              <label className={labelCls}>System Prompt</label>
              <textarea
                className={`${inputCls} font-mono text-xs leading-relaxed`}
                rows={18}
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-6 py-2.5 rounded-lg text-sm transition-all">
                Continue →
              </button>
              <button onClick={() => setSystemPrompt(DEFAULT_SYSTEM_PROMPT)} className="border border-gray-700 text-gray-400 hover:text-white px-5 py-2.5 rounded-lg text-sm transition-all">
                Reset
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Client Profile ── */}
        {step === 2 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-5">
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">Client Profile</h2>
              <p className="text-sm text-gray-500">Fill in your client's details. The richer the input, the better the output.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Full Name", field: "name", placeholder: "e.g. Amina Ochieng" },
                { label: "Email", field: "email", placeholder: "e.g. amina@email.com" },
                { label: "Phone & Location", field: "contact", placeholder: "+254 712 345 678 | Nairobi, Kenya" },
                { label: "LinkedIn / Portfolio", field: "linkedin", placeholder: "linkedin.com/in/..." },
              ].map(({ label, field, placeholder }) => (
                <div key={field}>
                  <label className={labelCls}>{label}</label>
                  <input
                    type="text"
                    className={inputCls}
                    placeholder={placeholder}
                    value={client[field as keyof ClientProfile]}
                    onChange={updateClient(field as keyof ClientProfile)}
                  />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className={labelCls}>Professional Summary (in their words)</label>
                <textarea className={inputCls} rows={3}
                  placeholder="e.g. I'm a finance officer with 5 years NGO experience looking to move into corporate..."
                  value={client.summary} onChange={updateClient("summary")} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Work Experience (most recent first)</label>
                <textarea className={inputCls} rows={7}
                  placeholder={`Role | Company | Dates\n- Achievement 1\n- Achievement 2`}
                  value={client.experience} onChange={updateClient("experience")} />
              </div>
              <div>
                <label className={labelCls}>Education</label>
                <textarea className={inputCls} rows={3}
                  placeholder="Degree | Institution | Year"
                  value={client.education} onChange={updateClient("education")} />
              </div>
              <div>
                <label className={labelCls}>Key Skills</label>
                <textarea className={inputCls} rows={3}
                  placeholder="e.g. Budget management, SAP, Excel, Team leadership..."
                  value={client.skills} onChange={updateClient("skills")} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Certifications / Languages / Other</label>
                <input type="text" className={inputCls}
                  placeholder="e.g. CPA Part II | English (Native), Swahili (Native)"
                  value={client.extra} onChange={updateClient("extra")} />
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setStep(3)} className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-6 py-2.5 rounded-lg text-sm transition-all">
                Continue →
              </button>
              <button onClick={() => setStep(1)} className="border border-gray-700 text-gray-400 hover:text-white px-5 py-2.5 rounded-lg text-sm transition-all">
                ← Back
              </button>
              <button onClick={loadSampleClient} className="border border-gray-700 text-gray-400 hover:text-white px-5 py-2.5 rounded-lg text-sm transition-all">
                Load Sample
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Job Description ── */}
        {step === 3 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-5">
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">Job Description</h2>
              <p className="text-sm text-gray-500">Paste the full job posting. Every line of the CV will be tailored to this role.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Job Title</label>
                <input type="text" className={inputCls} placeholder="e.g. Senior Financial Analyst"
                  value={job.title} onChange={updateJob("title")} />
              </div>
              <div>
                <label className={labelCls}>Company</label>
                <input type="text" className={inputCls} placeholder="e.g. Royal Caribbean International"
                  value={job.company} onChange={updateJob("company")} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Full Job Description</label>
                <textarea className={`${inputCls} font-mono text-xs`} rows={14}
                  placeholder="Paste the complete job posting here..."
                  value={job.description} onChange={updateJob("description")} />
              </div>
            </div>
            {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">{error}</p>}
            <div className="flex flex-wrap gap-3">
              <button onClick={generateDocuments} disabled={generating}
                className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-semibold px-6 py-2.5 rounded-lg text-sm transition-all flex items-center gap-2">
                {generating ? <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg> Generating...
                </> : "✦ Generate Documents"}
              </button>
              <button onClick={() => setStep(2)} className="border border-gray-700 text-gray-400 hover:text-white px-5 py-2.5 rounded-lg text-sm transition-all">
                ← Back
              </button>
              <button onClick={loadSampleJob} className="border border-gray-700 text-gray-400 hover:text-white px-5 py-2.5 rounded-lg text-sm transition-all">
                Load Sample Job
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: Output ── */}
        {step === 4 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-5">
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">Generated Documents</h2>
              <p className="text-sm text-gray-500">Review the CV and Cover Letter, then run the quality check.</p>
            </div>

            {generating ? (
              <div className="flex flex-col items-center gap-4 py-16">
                <svg className="animate-spin h-9 w-9 text-amber-500" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                <p className="text-sm font-mono text-gray-500 tracking-widest">Generating tailored documents...</p>
              </div>
            ) : (
              <>
                <div className="flex gap-1 border-b border-gray-800">
                  {(["cv", "cover"] as const).map((t) => (
                    <button key={t} onClick={() => setActiveTab(t)}
                      className={`px-5 py-2.5 text-sm font-mono transition-all border-b-2 -mb-px
                        ${activeTab === t ? "border-amber-500 text-amber-400" : "border-transparent text-gray-600 hover:text-gray-400"}`}>
                      {t === "cv" ? "CV" : "Cover Letter"}
                    </button>
                  ))}
                </div>
                <pre className="bg-gray-950 border border-gray-800 rounded-lg p-5 text-sm text-gray-200 whitespace-pre-wrap font-sans leading-relaxed min-h-48 max-h-[500px] overflow-y-auto">
                  {activeTab === "cv" ? cvText : coverText}
                </pre>
              </>
            )}

            {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">{error}</p>}
            <div className="flex flex-wrap gap-3">
              {!generating && cvText && (
                <button onClick={runQualityCheck}
                  className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-6 py-2.5 rounded-lg text-sm transition-all">
                  ✦ Run Quality Check
                </button>
              )}
              <button onClick={() => setStep(3)} className="border border-gray-700 text-gray-400 hover:text-white px-5 py-2.5 rounded-lg text-sm transition-all">
                ← Regenerate
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 5: Quality Report ── */}
        {step === 5 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-5">
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">Quality Check Report</h2>
              <p className="text-sm text-gray-500">AI-powered audit against your quality standards.</p>
            </div>

            {checking ? (
              <div className="flex flex-col items-center gap-4 py-16">
                <svg className="animate-spin h-9 w-9 text-amber-500" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                <p className="text-sm font-mono text-gray-500 tracking-widest">Auditing document quality...</p>
              </div>
            ) : qualityScores ? (
              <div className="bg-gray-950 border border-gray-800 rounded-xl p-6 space-y-6">
                {/* Overall */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-mono tracking-widest text-gray-500 uppercase mb-1">Overall Score</p>
                    <p className="text-5xl font-bold" style={{ color: scoreColor(qualityScores.overall) }}>
                      {qualityScores.overall.toFixed(1)}<span className="text-2xl text-gray-600">/10</span>
                    </p>
                  </div>
                  <span className="text-xs font-mono px-4 py-2 rounded-full border"
                    style={{
                      color: scoreColor(qualityScores.overall),
                      borderColor: scoreColor(qualityScores.overall),
                      background: `${scoreColor(qualityScores.overall)}18`,
                    }}>
                    {scoreLabel(qualityScores.overall)}
                  </span>
                </div>

                {/* Score bars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {SCORE_DIMENSIONS.map(({ key, label }) => {
                    const val = qualityScores[key];
                    const color = scoreColor(val);
                    return (
                      <div key={key} className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">{label}</span>
                          <span className="text-xs font-mono text-gray-300">{val}/10</span>
                        </div>
                        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${val * 10}%`, background: color }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Verdict */}
                <div className="border-l-2 border-amber-600 pl-4 bg-gray-900 rounded-r-lg p-4">
                  <p className="text-xs font-mono tracking-widest text-gray-500 uppercase mb-2">AI Reviewer Feedback</p>
                  <p className="text-sm text-gray-300 leading-relaxed">{qualityScores.verdict}</p>
                </div>
              </div>
            ) : null}

            {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">{error}</p>}
            <div className="flex flex-wrap gap-3">
              <button onClick={() => { setStep(1); setClient({ name:"",email:"",contact:"",linkedin:"",summary:"",experience:"",education:"",skills:"",extra:"" }); setJob({ title:"",company:"",description:"" }); setCvText(""); setCoverText(""); setFullGenerated(""); setQualityScores(null); }}
                className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-6 py-2.5 rounded-lg text-sm transition-all">
                Start New Client
              </button>
              <button onClick={() => setStep(3)} className="border border-gray-700 text-gray-400 hover:text-white px-5 py-2.5 rounded-lg text-sm transition-all">
                Regenerate Documents
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
