import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { FileText, User, Briefcase, Sparkles, CheckCircle, ArrowRight, ArrowLeft, Loader2, Download, ChevronDown, ChevronUp } from "lucide-react";
import ReactMarkdown from "react-markdown";
import PageLayout from "@/components/PageLayout";

const DEFAULT_SYSTEM_PROMPT = `You are an elite professional CV and Cover Letter writer with 15+ years of experience in recruitment and career coaching. You create documents that consistently land interviews.

RULES YOU MUST FOLLOW:
1. TAILOR every bullet point to the specific job description provided
2. Use STRONG ACTION VERBS to start every achievement bullet (Led, Drove, Optimised, Spearheaded, Delivered, Architected, etc.)
3. QUANTIFY achievements with numbers, percentages, KES/USD amounts, team sizes, and timeframes
4. Include ATS KEYWORDS extracted directly from the job posting — mirror their exact terminology
5. NEVER use clichés like "team player", "hard worker", "go-getter", "passionate", "results-driven"
6. Structure the CV with clear sections: Contact Info, Professional Profile, Core Skills, Work Experience, Education, Certifications
7. Each role must have 5-8 achievement bullets, not job descriptions
8. The Cover Letter must open with a specific hook about the company, demonstrate value with examples, and close with a clear call to action
9. Both documents must be print-ready with professional typography hierarchy`;

const STEPS = [
  { icon: FileText, label: "System Prompt" },
  { icon: User, label: "Client Profile" },
  { icon: Briefcase, label: "Job Description" },
  { icon: Sparkles, label: "Generated Output" },
  { icon: CheckCircle, label: "Quality Check" },
];

interface ClientProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  careerSummary: string;
  experience: string;
  education: string;
  skills: string;
  certifications: string;
}

interface JobDesc {
  jobTitle: string;
  company: string;
  fullDescription: string;
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

export default function GenerateCVPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
  const [profile, setProfile] = useState<ClientProfile>({
    name: "", email: "", phone: "", location: "", linkedin: "",
    careerSummary: "", experience: "", education: "", skills: "", certifications: "",
  });
  const [job, setJob] = useState<JobDesc>({ jobTitle: "", company: "", fullDescription: "" });
  const [cv, setCv] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [scores, setScores] = useState<QualityScores | null>(null);
  const [generating, setGenerating] = useState(false);
  const [checking, setChecking] = useState(false);
  const [loadingVault, setLoadingVault] = useState(false);

  const loadFromVault = async () => {
    setLoadingVault(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { toast.error("Please log in to load from vault"); setLoadingVault(false); return; }
      const { data, error } = await supabase
        .from("vault_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      if (!data) { toast.info("No vault profile found. Save one in Document Vault first."); setLoadingVault(false); return; }

      const roles = Array.isArray(data.roles) ? data.roles as any[] : [];
      const edu = Array.isArray(data.education) ? data.education as any[] : [];

      setProfile({
        name: data.full_name || "",
        email: data.email || "",
        phone: data.phone || "",
        location: data.location || "",
        linkedin: data.linkedin || "",
        careerSummary: data.career_summary || "",
        experience: roles.map((r: any) =>
          `${r.title} at ${r.company} (${r.startDate} – ${r.current ? "Present" : r.endDate})\n${(r.achievements || []).map((a: string) => `• ${a}`).join("\n")}`
        ).join("\n\n") || "",
        education: edu.map((e: any) => `${e.degree} — ${e.institution} (${e.year})${e.grade ? `, ${e.grade}` : ""}`).join("\n") || "",
        skills: [data.technical_skills, data.soft_skills].filter(Boolean).join(", "),
        certifications: data.certifications || "",
      });
      toast.success("Profile loaded from vault!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to load vault profile");
    }
    setLoadingVault(false);
  };

  const generateCV = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-tailored-cv", {
        body: { systemPrompt, clientProfile: profile, jobDescription: job },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setCv(data.cv || "");
      setCoverLetter(data.coverLetter || "");
      setStep(3);
      toast.success("CV and Cover Letter generated!");
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Generation failed");
    }
    setGenerating(false);
  };

  const runQualityCheck = async () => {
    setChecking(true);
    try {
      const fullText = `${cv}\n\n===COVER_LETTER===\n\n${coverLetter}`;
      const { data, error } = await supabase.functions.invoke("quality-check", {
        body: { generatedText: fullText, jobTitle: job.jobTitle, jobCompany: job.company, jobDescription: job.fullDescription },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setScores(data as QualityScores);
      setStep(4);
      toast.success("Quality check complete!");
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Quality check failed");
    }
    setChecking(false);
  };

  const canProceed = (s: number) => {
    if (s === 0) return systemPrompt.length > 20;
    if (s === 1) return profile.name && profile.careerSummary && profile.experience;
    if (s === 2) return job.jobTitle && job.fullDescription;
    return true;
  };

  const ScoreBar = ({ label, score }: { label: string; score: number }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-300">{label}</span>
        <span className={`font-bold ${score >= 8 ? "text-green-400" : score >= 6 ? "text-yellow-400" : "text-red-400"}`}>{score}/10</span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${score * 10}%`,
            background: score >= 8 ? "#22c55e" : score >= 6 ? "#eab308" : "#ef4444",
          }}
        />
      </div>
    </div>
  );

  return (
    <PageLayout>
      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <div className="border-b border-gray-800 bg-black/90 backdrop-blur sticky top-0 z-30">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold">
              Generate <span className="text-[#d4a843]">Tailored CV</span>
            </h1>
            {/* Steps */}
            <div className="flex items-center gap-1 mt-3 overflow-x-auto pb-1">
              {STEPS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (i <= step || (i === 3 && cv) || (i === 4 && scores)) setStep(i);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    i === step
                      ? "bg-[#d4a843] text-black"
                      : i < step
                      ? "bg-[#d4a843]/20 text-[#d4a843]"
                      : "bg-gray-800 text-gray-500"
                  }`}
                >
                  <s.icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{s.label}</span>
                  <span className="sm:hidden">{i + 1}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Step 0: System Prompt */}
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-[#d4a843] mb-1">System Prompt</h2>
                <p className="text-gray-400 text-sm">Customise the AI's instructions. The default is optimised for high-quality, ATS-friendly CVs.</p>
              </div>
              <Textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                rows={14}
                className="bg-gray-900 border-gray-700 text-white text-sm focus:border-[#d4a843] focus:ring-[#d4a843]/30"
              />
              <div className="flex justify-between items-center">
                <button onClick={() => setSystemPrompt(DEFAULT_SYSTEM_PROMPT)} className="text-xs text-gray-500 hover:text-[#d4a843]">
                  Reset to default
                </button>
                <Button
                  onClick={() => setStep(1)}
                  disabled={!canProceed(0)}
                  className="bg-[#d4a843] text-black hover:bg-[#c49a3a] font-semibold"
                >
                  Next: Client Profile <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 1: Client Profile */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#d4a843] mb-1">Client Profile</h2>
                  <p className="text-gray-400 text-sm">Enter the candidate's details or load from vault.</p>
                </div>
                <Button
                  variant="outline"
                  onClick={loadFromVault}
                  disabled={loadingVault}
                  className="border-[#d4a843] text-[#d4a843] hover:bg-[#d4a843]/10"
                >
                  {loadingVault ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Download className="w-4 h-4 mr-1" />}
                  Load from Vault
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { key: "name", label: "Full Name", placeholder: "James Ochieng" },
                  { key: "email", label: "Email", placeholder: "james@example.com" },
                  { key: "phone", label: "Phone", placeholder: "+254 700 123456" },
                  { key: "location", label: "Location", placeholder: "Nairobi, Kenya" },
                  { key: "linkedin", label: "LinkedIn URL", placeholder: "linkedin.com/in/jamesochieng" },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="text-xs text-gray-400 mb-1 block">{label}</label>
                    <Input
                      value={(profile as any)[key]}
                      onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                      placeholder={placeholder}
                      className="bg-gray-900 border-gray-700 text-white focus:border-[#d4a843]"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">Career Summary</label>
                <Textarea
                  value={profile.careerSummary}
                  onChange={(e) => setProfile({ ...profile, careerSummary: e.target.value })}
                  placeholder="Experienced marketing professional with 8+ years in digital strategy..."
                  rows={3}
                  className="bg-gray-900 border-gray-700 text-white focus:border-[#d4a843]"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Work Experience (include titles, companies, dates, achievements)</label>
                <Textarea
                  value={profile.experience}
                  onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                  placeholder="Senior Marketing Manager — Safaricom (2020–Present)&#10;• Led digital campaigns generating KES 50M+ revenue&#10;• Managed team of 12 across 3 markets"
                  rows={8}
                  className="bg-gray-900 border-gray-700 text-white focus:border-[#d4a843]"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Education</label>
                <Textarea
                  value={profile.education}
                  onChange={(e) => setProfile({ ...profile, education: e.target.value })}
                  placeholder="MBA, University of Nairobi (2018)&#10;BSc Computer Science, JKUAT (2014)"
                  rows={3}
                  className="bg-gray-900 border-gray-700 text-white focus:border-[#d4a843]"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Skills (comma separated)</label>
                  <Textarea
                    value={profile.skills}
                    onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                    placeholder="Digital Marketing, SEO, Google Ads, Team Leadership"
                    rows={2}
                    className="bg-gray-900 border-gray-700 text-white focus:border-[#d4a843]"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Certifications</label>
                  <Textarea
                    value={profile.certifications}
                    onChange={(e) => setProfile({ ...profile, certifications: e.target.value })}
                    placeholder="Google Analytics Certified, HubSpot Inbound"
                    rows={2}
                    className="bg-gray-900 border-gray-700 text-white focus:border-[#d4a843]"
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(0)} className="border-gray-700 text-gray-300 hover:bg-gray-800">
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <Button
                  onClick={() => setStep(2)}
                  disabled={!canProceed(1)}
                  className="bg-[#d4a843] text-black hover:bg-[#c49a3a] font-semibold"
                >
                  Next: Job Description <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Job Description */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-[#d4a843] mb-1">Job Description</h2>
                <p className="text-gray-400 text-sm">Paste the job you're applying for. The AI will tailor the CV specifically to it.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Job Title</label>
                  <Input
                    value={job.jobTitle}
                    onChange={(e) => setJob({ ...job, jobTitle: e.target.value })}
                    placeholder="Senior Marketing Manager"
                    className="bg-gray-900 border-gray-700 text-white focus:border-[#d4a843]"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Company Name</label>
                  <Input
                    value={job.company}
                    onChange={(e) => setJob({ ...job, company: e.target.value })}
                    placeholder="Safaricom PLC"
                    className="bg-gray-900 border-gray-700 text-white focus:border-[#d4a843]"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Full Job Posting</label>
                <Textarea
                  value={job.fullDescription}
                  onChange={(e) => setJob({ ...job, fullDescription: e.target.value })}
                  placeholder="Paste the entire job description here..."
                  rows={14}
                  className="bg-gray-900 border-gray-700 text-white focus:border-[#d4a843]"
                />
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)} className="border-gray-700 text-gray-300 hover:bg-gray-800">
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <Button
                  onClick={generateCV}
                  disabled={!canProceed(2) || generating}
                  className="bg-[#d4a843] text-black hover:bg-[#c49a3a] font-semibold"
                >
                  {generating ? (
                    <><Loader2 className="w-4 h-4 animate-spin mr-1" /> Generating...</>
                  ) : (
                    <><Sparkles className="w-4 h-4 mr-1" /> Generate CV & Cover Letter</>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Generated Output */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#d4a843] mb-1">Generated Output</h2>
                  <p className="text-gray-400 text-sm">Review your tailored CV and Cover Letter.</p>
                </div>
                <Button
                  onClick={runQualityCheck}
                  disabled={checking}
                  className="bg-[#d4a843] text-black hover:bg-[#c49a3a] font-semibold"
                >
                  {checking ? (
                    <><Loader2 className="w-4 h-4 animate-spin mr-1" /> Checking...</>
                  ) : (
                    <><CheckCircle className="w-4 h-4 mr-1" /> Run Quality Check</>
                  )}
                </Button>
              </div>

              <Tabs defaultValue="cv" className="w-full">
                <TabsList className="bg-gray-900 border border-gray-700">
                  <TabsTrigger value="cv" className="data-[state=active]:bg-[#d4a843] data-[state=active]:text-black">
                    📄 CV
                  </TabsTrigger>
                  <TabsTrigger value="cover" className="data-[state=active]:bg-[#d4a843] data-[state=active]:text-black">
                    ✉️ Cover Letter
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="cv">
                  <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 prose prose-invert prose-sm max-w-none min-h-[400px]">
                    <ReactMarkdown>{cv}</ReactMarkdown>
                  </div>
                </TabsContent>
                <TabsContent value="cover">
                  <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 prose prose-invert prose-sm max-w-none min-h-[400px]">
                    <ReactMarkdown>{coverLetter}</ReactMarkdown>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)} className="border-gray-700 text-gray-300 hover:bg-gray-800">
                  <ArrowLeft className="w-4 h-4 mr-1" /> Edit Inputs
                </Button>
                <Button onClick={() => { generateCV(); }} disabled={generating} variant="outline" className="border-[#d4a843] text-[#d4a843] hover:bg-[#d4a843]/10">
                  {generating ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Sparkles className="w-4 h-4 mr-1" />}
                  Regenerate
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Quality Check */}
          {step === 4 && scores && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-[#d4a843] mb-1">Quality Check</h2>
                <p className="text-gray-400 text-sm">AI-powered assessment of your generated documents.</p>
              </div>

              {/* Overall Score */}
              <div className="flex flex-col items-center bg-gray-900 border border-gray-700 rounded-xl p-8">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="52" fill="none" stroke="#1f2937" strokeWidth="10" />
                    <circle
                      cx="60" cy="60" r="52" fill="none"
                      stroke={scores.overall >= 8 ? "#22c55e" : scores.overall >= 6 ? "#eab308" : "#ef4444"}
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={`${scores.overall * 32.67} 326.7`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-white">{scores.overall}</span>
                    <span className="text-xs text-gray-400">/10</span>
                  </div>
                </div>
                <p className="text-lg font-semibold text-white mt-4">Overall Score</p>
              </div>

              {/* Individual Scores */}
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 space-y-4">
                <ScoreBar label="Job Tailoring" score={scores.tailoring} />
                <ScoreBar label="ATS Keywords" score={scores.keywords} />
                <ScoreBar label="Quantification" score={scores.quantification} />
                <ScoreBar label="Action Verbs" score={scores.actionVerbs} />
                <ScoreBar label="Cliché-Free" score={scores.clicheAvoidance} />
                <ScoreBar label="Cover Letter Quality" score={scores.coverLetterQuality} />
              </div>

              {/* Verdict */}
              <div className="bg-gray-900 border border-[#d4a843]/30 rounded-xl p-6">
                <h3 className="text-[#d4a843] font-semibold mb-2">AI Verdict</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{scores.verdict}</p>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(3)} className="border-gray-700 text-gray-300 hover:bg-gray-800">
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back to Output
                </Button>
                <div className="flex gap-2">
                  <Button onClick={() => setStep(1)} variant="outline" className="border-[#d4a843] text-[#d4a843] hover:bg-[#d4a843]/10">
                    Edit Profile & Regenerate
                  </Button>
                  <Button onClick={runQualityCheck} disabled={checking} className="bg-[#d4a843] text-black hover:bg-[#c49a3a] font-semibold">
                    {checking ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
                    Re-check
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
