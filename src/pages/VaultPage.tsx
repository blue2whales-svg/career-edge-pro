import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Globe,
  Target,
  FileText,
  Briefcase,
  GraduationCap,
  Wrench,
  Award,
  Sparkles,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Save,
  Download,
  Copy,
  Check,
  Link,
  AlignLeft,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageLayout from "@/components/PageLayout";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// ─── Types ────────────────────────────────────────────────────────────────────

interface WorkExperience {
  id: string;
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  current: boolean;
  achievements: string[];
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
  grade: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url: string;
}

interface VaultProfile {
  // Personal
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
  // Career
  targetRoles: string;
  careerSummary: string;
  // Work
  workExperience: WorkExperience[];
  // Education
  education: Education[];
  // Skills
  technicalSkills: string;
  softSkills: string;
  languages: string;
  // Certifications
  certifications: Certification[];
}

const defaultProfile = (): VaultProfile => ({
  fullName: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  portfolio: "",
  targetRoles: "",
  careerSummary: "",
  workExperience: [],
  education: [],
  technicalSkills: "",
  softSkills: "",
  languages: "",
  certifications: [],
});

const loadProfile = (): VaultProfile => {
  try {
    return { ...defaultProfile(), ...JSON.parse(localStorage.getItem("cvedge_vault_profile") || "{}") };
  } catch {
    return defaultProfile();
  }
};

// ─── Strength calculator ──────────────────────────────────────────────────────

function calcStrength(p: VaultProfile): { score: number; missing: string[] } {
  const checks: { label: string; ok: boolean }[] = [
    { label: "Full name", ok: !!p.fullName.trim() },
    { label: "Email", ok: !!p.email.trim() },
    { label: "Phone number", ok: !!p.phone.trim() },
    { label: "Location", ok: !!p.location.trim() },
    { label: "LinkedIn URL", ok: !!p.linkedin.trim() },
    { label: "Target job titles", ok: !!p.targetRoles.trim() },
    { label: "Career summary", ok: p.careerSummary.trim().length >= 100 },
    { label: "Work experience", ok: p.workExperience.length > 0 },
    { label: "Education", ok: p.education.length > 0 },
    { label: "Technical skills", ok: !!p.technicalSkills.trim() },
    { label: "Certifications", ok: p.certifications.length > 0 },
  ];
  const done = checks.filter((c) => c.ok).length;
  return {
    score: Math.round((done / checks.length) * 100),
    missing: checks.filter((c) => !c.ok).map((c) => c.label),
  };
}

// ─── Shared input styles ──────────────────────────────────────────────────────

const inp =
  "w-full rounded-lg border border-border bg-background/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-colors";
const label = "block text-xs text-muted-foreground mb-1 font-medium";

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  icon: Icon,
  title,
  children,
  accent,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  accent?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-card p-5 sm:p-6 mb-4"
    >
      <div className="flex items-center gap-2.5 mb-5">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${accent || "bg-primary/10"}`}>
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <h2 className="text-base font-semibold">{title}</h2>
      </div>
      {children}
    </motion.div>
  );
}

// ─── Generate modal ───────────────────────────────────────────────────────────

function GenerateModal({ profile, onClose }: { profile: VaultProfile; onClose: () => void }) {
  const [jobTab, setJobTab] = useState<"url" | "text">("url");
  const [jobUrl, setJobUrl] = useState("");
  const [jobText, setJobText] = useState("");
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState("");
  const [result, setResult] = useState<{ tailoredCV: string; coverLetter: string } | null>(null);
  const [resultTab, setResultTab] = useState<"cv" | "cover">("cv");
  const [copied, setCopied] = useState<"cv" | "cover" | null>(null);

  const buildCVText = () => {
    const p = profile;
    let text = `${p.fullName}\n${p.email} | ${p.phone} | ${p.location}\n`;
    if (p.linkedin) text += `LinkedIn: ${p.linkedin}\n`;
    if (p.portfolio) text += `Portfolio: ${p.portfolio}\n`;
    text += `\nTARGET ROLES: ${p.targetRoles}\n`;
    text += `\nPROFESSIONAL SUMMARY:\n${p.careerSummary}\n`;
    if (p.workExperience.length) {
      text += `\nWORK EXPERIENCE:\n`;
      p.workExperience.forEach((w) => {
        text += `${w.jobTitle} — ${w.company} (${w.startDate} - ${w.current ? "Present" : w.endDate})\n`;
        w.achievements.filter(Boolean).forEach((a) => (text += `• ${a}\n`));
      });
    }
    if (p.education.length) {
      text += `\nEDUCATION:\n`;
      p.education.forEach((e) => {
        text += `${e.degree} — ${e.institution} (${e.startDate} - ${e.endDate})`;
        if (e.grade) text += ` | ${e.grade}`;
        text += "\n";
      });
    }
    if (p.technicalSkills) text += `\nTECHNICAL SKILLS:\n${p.technicalSkills}\n`;
    if (p.softSkills) text += `\nSOFT SKILLS:\n${p.softSkills}\n`;
    if (p.languages) text += `\nLANGUAGES:\n${p.languages}\n`;
    if (p.certifications.length) {
      text += `\nCERTIFICATIONS:\n`;
      p.certifications.forEach((c) => (text += `${c.name} — ${c.issuer} (${c.date})\n`));
    }
    return text;
  };

  const handleGenerate = async () => {
    const input = jobTab === "url" ? jobUrl.trim() : jobText.trim();
    if (!input) {
      toast.error("Please add a job URL or description");
      return;
    }

    const cvText = buildCVText();
    if (cvText.trim().length < 100) {
      toast.error("Please fill in more vault details before generating");
      return;
    }

    setLoading(true);
    setResult(null);
    setPhase("Reading your vault profile...");

    try {
      const jobInput = jobTab === "url" ? `Job URL: ${input}` : input;
      setPhase("Tailoring your CV to the job...");

      const { data, error } = await supabase.functions.invoke("generate-for-job", {
        body: { cvText, jobInput },
      });

      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);

      setResult(data);
      setPhase("");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
      setPhase("");
    } finally {
      setLoading(false);
    }
  };

  const copy = async (type: "cv" | "cover") => {
    const text = type === "cv" ? result?.tailoredCV : result?.coverLetter;
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 1800);
  };

  const downloadTxt = (type: "cv" | "cover") => {
    const text = type === "cv" ? result?.tailoredCV : result?.coverLetter;
    if (!text) return;
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = type === "cv" ? "tailored-cv.txt" : "cover-letter.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Generate for this job
          </DialogTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Your vault profile will be tailored to match the job requirements
          </p>
        </DialogHeader>

        {!result && (
          <div className="space-y-4 mt-2">
            <Tabs value={jobTab} onValueChange={(v) => setJobTab(v as "url" | "text")}>
              <TabsList className="w-full">
                <TabsTrigger value="url" className="flex-1 gap-1.5">
                  <Link className="h-3.5 w-3.5" /> Job URL
                </TabsTrigger>
                <TabsTrigger value="text" className="flex-1 gap-1.5">
                  <AlignLeft className="h-3.5 w-3.5" /> Paste description
                </TabsTrigger>
              </TabsList>
              <TabsContent value="url" className="mt-3">
                <input
                  type="text"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  placeholder="https://linkedin.com/jobs/view/..."
                  className={inp}
                />
              </TabsContent>
              <TabsContent value="text" className="mt-3">
                <textarea
                  value={jobText}
                  onChange={(e) => setJobText(e.target.value)}
                  placeholder="Paste the full job description here..."
                  rows={6}
                  className={`${inp} resize-none`}
                />
              </TabsContent>
            </Tabs>

            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-gradient-brand border-0 font-semibold gap-2"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {phase}
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate tailored CV + cover letter
                </>
              )}
            </Button>
          </div>
        )}

        {result && (
          <div className="mt-2 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-green-400 font-medium flex items-center gap-1.5">
                <Check className="h-4 w-4" /> Generated successfully
              </p>
              <Button
                size="sm"
                variant="ghost"
                className="text-xs text-muted-foreground"
                onClick={() => setResult(null)}
              >
                ← Try different job
              </Button>
            </div>

            <Tabs value={resultTab} onValueChange={(v) => setResultTab(v as "cv" | "cover")}>
              <TabsList className="w-full">
                <TabsTrigger value="cv" className="flex-1">
                  Tailored CV
                </TabsTrigger>
                <TabsTrigger value="cover" className="flex-1">
                  Cover Letter
                </TabsTrigger>
              </TabsList>
              {(["cv", "cover"] as const).map((tab) => (
                <TabsContent key={tab} value={tab} className="mt-3 space-y-3">
                  <div className="rounded-lg border border-border bg-muted/30 p-4 text-xs whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto font-mono">
                    {tab === "cv" ? result.tailoredCV : result.coverLetter}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-gradient-brand border-0 font-semibold gap-1.5"
                      onClick={() => downloadTxt(tab)}
                    >
                      <Download className="h-3.5 w-3.5" /> Download .txt
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1.5" onClick={() => copy(tab)}>
                      {copied === tab ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied === tab ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function VaultPage() {
  const [profile, setProfile] = useState<VaultProfile>(loadProfile);
  const [showGenerate, setShowGenerate] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    localStorage.setItem("cvedge_vault_profile", JSON.stringify(profile));
  }, [profile]);

  const set = (field: keyof VaultProfile, value: any) => setProfile((prev) => ({ ...prev, [field]: value }));

  const { score, missing } = calcStrength(profile);

  const scoreColor =
    score < 40 ? "bg-red-500" : score < 70 ? "bg-yellow-500" : score < 90 ? "bg-blue-500" : "bg-green-500";
  const scoreLabel = score < 40 ? "Weak" : score < 70 ? "Fair" : score < 90 ? "Good" : "Strong";

  const saveProfile = () => {
    localStorage.setItem("cvedge_vault_profile", JSON.stringify(profile));
    setSaved(true);
    toast.success("Vault saved!");
    setTimeout(() => setSaved(false), 2000);
  };

  // Work experience helpers
  const addWork = () =>
    set("workExperience", [
      ...profile.workExperience,
      {
        id: Date.now().toString(),
        jobTitle: "",
        company: "",
        startDate: "",
        endDate: "",
        current: false,
        achievements: ["", "", ""],
      },
    ]);
  const updateWork = (id: string, field: keyof WorkExperience, value: any) =>
    set(
      "workExperience",
      profile.workExperience.map((w) => (w.id === id ? { ...w, [field]: value } : w)),
    );
  const removeWork = (id: string) =>
    set(
      "workExperience",
      profile.workExperience.filter((w) => w.id !== id),
    );
  const updateAchievement = (wid: string, idx: number, val: string) =>
    set(
      "workExperience",
      profile.workExperience.map((w) =>
        w.id === wid ? { ...w, achievements: w.achievements.map((a, i) => (i === idx ? val : a)) } : w,
      ),
    );

  // Education helpers
  const addEdu = () =>
    set("education", [
      ...profile.education,
      {
        id: Date.now().toString(),
        degree: "",
        institution: "",
        startDate: "",
        endDate: "",
        grade: "",
      },
    ]);
  const updateEdu = (id: string, field: keyof Education, value: any) =>
    set(
      "education",
      profile.education.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    );
  const removeEdu = (id: string) =>
    set(
      "education",
      profile.education.filter((e) => e.id !== id),
    );

  // Cert helpers
  const addCert = () =>
    set("certifications", [
      ...profile.certifications,
      {
        id: Date.now().toString(),
        name: "",
        issuer: "",
        date: "",
        url: "",
      },
    ]);
  const updateCert = (id: string, field: keyof Certification, value: any) =>
    set(
      "certifications",
      profile.certifications.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    );
  const removeCert = (id: string) =>
    set(
      "certifications",
      profile.certifications.filter((c) => c.id !== id),
    );

  return (
    <PageLayout>
      {showGenerate && <GenerateModal profile={profile} onClose={() => setShowGenerate(false)} />}

      <section className="relative z-10 pt-16 sm:pt-24 pb-28 px-4">
        <div className="container max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-1">
                Career <span className="text-gradient">Vault</span>
              </h1>
              <p className="text-sm text-muted-foreground">Store your info once. Generate tailored CVs instantly.</p>
            </div>
            <Button
              onClick={() => setShowGenerate(true)}
              className="bg-gradient-brand border-0 font-semibold gap-1.5 shrink-0 ml-4"
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Generate for job</span>
              <span className="sm:hidden">Generate</span>
            </Button>
          </div>

          {/* Profile Strength */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-border bg-card p-5 mb-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">Profile Strength</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    score < 40
                      ? "bg-red-500/15 text-red-400"
                      : score < 70
                        ? "bg-yellow-500/15 text-yellow-400"
                        : score < 90
                          ? "bg-blue-500/15 text-blue-400"
                          : "bg-green-500/15 text-green-400"
                  }`}
                >
                  {scoreLabel}
                </span>
              </div>
              <span className="text-2xl font-bold text-primary">{score}%</span>
            </div>

            <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden mb-4">
              <motion.div
                className={`h-full rounded-full ${scoreColor}`}
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>

            {missing.length > 0 && (
              <div className="space-y-1.5">
                {missing.slice(0, 4).map((m) => (
                  <div key={m} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 shrink-0" />
                    Add your {m.toLowerCase()}
                  </div>
                ))}
                {missing.length > 4 && (
                  <p className="text-xs text-muted-foreground">+{missing.length - 4} more fields</p>
                )}
              </div>
            )}
            {missing.length === 0 && (
              <p className="text-xs text-green-400 flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5" /> Profile complete — ready to generate
              </p>
            )}
          </motion.div>

          {/* Personal Information */}
          <Section icon={User} title="Personal Information">
            <div className="grid grid-cols-1 grid-cols-1 min-[360px]:grid-cols-2 gap-3">
              <div>
                <label className={label}>Full Name *</label>
                <input
                  className={inp}
                  placeholder="James Mitchell"
                  value={profile.fullName}
                  onChange={(e) => set("fullName", e.target.value)}
                />
              </div>
              <div>
                <label className={label}>Email *</label>
                <input
                  className={inp}
                  placeholder="james@example.com"
                  type="email"
                  value={profile.email}
                  onChange={(e) => set("email", e.target.value)}
                />
              </div>
              <div>
                <label className={label}>Phone *</label>
                <input
                  className={inp}
                  placeholder="+254 712 345 678"
                  value={profile.phone}
                  onChange={(e) => set("phone", e.target.value)}
                />
              </div>
              <div>
                <label className={label}>Location *</label>
                <input
                  className={inp}
                  placeholder="Nairobi, Kenya"
                  value={profile.location}
                  onChange={(e) => set("location", e.target.value)}
                />
              </div>
              <div>
                <label className={label}>LinkedIn URL</label>
                <input
                  className={inp}
                  placeholder="https://linkedin.com/in/..."
                  value={profile.linkedin}
                  onChange={(e) => set("linkedin", e.target.value)}
                />
              </div>
              <div>
                <label className={label}>Portfolio / Website</label>
                <input
                  className={inp}
                  placeholder="https://..."
                  value={profile.portfolio}
                  onChange={(e) => set("portfolio", e.target.value)}
                />
              </div>
            </div>
          </Section>

          {/* Career Goal */}
          <Section icon={Target} title="Career Goal">
            <div className="space-y-3">
              <div>
                <label className={label}>Target Job Titles (comma separated)</label>
                <input
                  className={inp}
                  placeholder="Marketing Manager, Brand Director, CMO"
                  value={profile.targetRoles}
                  onChange={(e) => set("targetRoles", e.target.value)}
                />
              </div>
              <div>
                <label className={label}>Career Summary (min 100 characters)</label>
                <textarea
                  className={`${inp} resize-none`}
                  rows={4}
                  placeholder="Write a compelling summary of your career, key achievements, and what you bring to employers..."
                  value={profile.careerSummary}
                  onChange={(e) => set("careerSummary", e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  {profile.careerSummary.length}/100 characters minimum
                </p>
              </div>
            </div>
          </Section>

          {/* Work Experience */}
          <Section icon={Briefcase} title="Work Experience">
            <div className="space-y-4">
              {profile.workExperience.map((w, idx) => (
                <div key={w.id} className="rounded-xl border border-border bg-background/40 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Role {idx + 1}</span>
                    <button
                      onClick={() => removeWork(w.id)}
                      className="text-destructive hover:opacity-70 transition-opacity"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={label}>Job Title</label>
                      <input
                        className={inp}
                        placeholder="Marketing Director"
                        value={w.jobTitle}
                        onChange={(e) => updateWork(w.id, "jobTitle", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={label}>Company</label>
                      <input
                        className={inp}
                        placeholder="Safaricom PLC"
                        value={w.company}
                        onChange={(e) => updateWork(w.id, "company", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={label}>Start Date</label>
                      <input
                        className={inp}
                        type="month"
                        value={w.startDate}
                        onChange={(e) => updateWork(w.id, "startDate", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={label}>End Date</label>
                      <input
                        className={inp}
                        type="month"
                        value={w.endDate}
                        disabled={w.current}
                        onChange={(e) => updateWork(w.id, "endDate", e.target.value)}
                      />
                      <label className="flex items-center gap-1.5 mt-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={w.current}
                          onChange={(e) => updateWork(w.id, "current", e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-xs text-muted-foreground">Current role</span>
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className={label}>Key Achievements (add metrics for impact)</label>
                    {w.achievements.map((a, i) => (
                      <input
                        key={i}
                        className={inp}
                        value={a}
                        placeholder={`Achievement ${i + 1} — e.g. "Increased revenue by 30%"`}
                        onChange={(e) => updateAchievement(w.id, i, e.target.value)}
                      />
                    ))}
                  </div>
                </div>
              ))}
              <button
                onClick={addWork}
                className="w-full rounded-xl border border-dashed border-border py-3 text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" /> Add work experience
              </button>
            </div>
          </Section>

          {/* Education */}
          <Section icon={GraduationCap} title="Education">
            <div className="space-y-4">
              {profile.education.map((e, idx) => (
                <div key={e.id} className="rounded-xl border border-border bg-background/40 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Entry {idx + 1}</span>
                    <button
                      onClick={() => removeEdu(e.id)}
                      className="text-destructive hover:opacity-70 transition-opacity"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={label}>Degree / Qualification</label>
                      <input
                        className={inp}
                        placeholder="BSc Computer Science"
                        value={e.degree}
                        onChange={(ev) => updateEdu(e.id, "degree", ev.target.value)}
                      />
                    </div>
                    <div>
                      <label className={label}>Institution</label>
                      <input
                        className={inp}
                        placeholder="University of Nairobi"
                        value={e.institution}
                        onChange={(ev) => updateEdu(e.id, "institution", ev.target.value)}
                      />
                    </div>
                    <div>
                      <label className={label}>Start Date</label>
                      <input
                        className={inp}
                        type="month"
                        value={e.startDate}
                        onChange={(ev) => updateEdu(e.id, "startDate", ev.target.value)}
                      />
                    </div>
                    <div>
                      <label className={label}>End Date</label>
                      <input
                        className={inp}
                        type="month"
                        value={e.endDate}
                        onChange={(ev) => updateEdu(e.id, "endDate", ev.target.value)}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={label}>Grade / Classification (optional)</label>
                      <input
                        className={inp}
                        placeholder="First Class Honours / 3.8 GPA"
                        value={e.grade}
                        onChange={(ev) => updateEdu(e.id, "grade", ev.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={addEdu}
                className="w-full rounded-xl border border-dashed border-border py-3 text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" /> Add education
              </button>
            </div>
          </Section>

          {/* Skills */}
          <Section icon={Wrench} title="Skills">
            <div className="space-y-3">
              <div>
                <label className={label}>Technical Skills (comma separated)</label>
                <textarea
                  className={`${inp} resize-none`}
                  rows={3}
                  placeholder="React, TypeScript, Python, AWS, Figma, SQL..."
                  value={profile.technicalSkills}
                  onChange={(e) => set("technicalSkills", e.target.value)}
                />
              </div>
              <div>
                <label className={label}>Soft Skills (comma separated)</label>
                <textarea
                  className={`${inp} resize-none`}
                  rows={2}
                  placeholder="Leadership, Communication, Strategic thinking, Problem solving..."
                  value={profile.softSkills}
                  onChange={(e) => set("softSkills", e.target.value)}
                />
              </div>
              <div>
                <label className={label}>Languages</label>
                <input
                  className={inp}
                  placeholder="English (Fluent), Swahili (Native), French (Basic)"
                  value={profile.languages}
                  onChange={(e) => set("languages", e.target.value)}
                />
              </div>
            </div>
          </Section>

          {/* Certifications */}
          <Section icon={Award} title="Certifications">
            <div className="space-y-4">
              {profile.certifications.map((c, idx) => (
                <div key={c.id} className="rounded-xl border border-border bg-background/40 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Cert {idx + 1}</span>
                    <button
                      onClick={() => removeCert(c.id)}
                      className="text-destructive hover:opacity-70 transition-opacity"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={label}>Certification Name</label>
                      <input
                        className={inp}
                        placeholder="AWS Solutions Architect"
                        value={c.name}
                        onChange={(e) => updateCert(c.id, "name", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={label}>Issuing Organisation</label>
                      <input
                        className={inp}
                        placeholder="Amazon Web Services"
                        value={c.issuer}
                        onChange={(e) => updateCert(c.id, "issuer", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={label}>Date Issued</label>
                      <input
                        className={inp}
                        type="month"
                        value={c.date}
                        onChange={(e) => updateCert(c.id, "date", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={label}>Credential URL (optional)</label>
                      <input
                        className={inp}
                        placeholder="https://..."
                        value={c.url}
                        onChange={(e) => updateCert(c.id, "url", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={addCert}
                className="w-full rounded-xl border border-dashed border-border py-3 text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" /> Add certification
              </button>
            </div>
          </Section>

          {/* Save + Generate sticky footer */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur border-t border-border px-4 py-3">
            <div className="container max-w-2xl mx-auto flex gap-3">
              <Button onClick={saveProfile} variant="outline" className="flex-1 gap-2 font-semibold">
                {saved ? <Check className="h-4 w-4 text-green-400" /> : <Save className="h-4 w-4" />}
                {saved ? "Saved!" : "Save vault"}
              </Button>
              <Button
                onClick={() => setShowGenerate(true)}
                className="flex-1 bg-gradient-brand border-0 font-semibold gap-2"
              >
                <Sparkles className="h-4 w-4" /> Generate for job
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
