import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Download, Lock, Unlock, Plus, Trash2, Loader2,
  User, FileText, Briefcase, GraduationCap, Wrench, Globe, Award,
  Target, Sparkles, CheckCircle2, XCircle, Pencil, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/* ── Types ── */
interface Experience { title: string; company: string; location: string; from: string; to: string; bullets: string[]; }
interface Education { degree: string; school: string; year: string; grade: string; }
interface CVData {
  name: string; title: string; email: string; phone: string; location: string; linkedin: string; website: string;
  summary: string; experiences: Experience[]; educations: Education[];
  skills: string[]; languages: { name: string; level: string }[];
  certifications: string[];
}

const defaultCV: CVData = {
  name: "", title: "", email: "", phone: "+254 ", location: "", linkedin: "", website: "",
  summary: "",
  experiences: [{ title: "", company: "", location: "", from: "", to: "", bullets: [""] }],
  educations: [{ degree: "", school: "", year: "", grade: "" }],
  skills: [],
  languages: [{ name: "English", level: "Fluent" }, { name: "Swahili", level: "Native" }],
  certifications: [],
};

/* ── Color themes for CV preview ── */
const COLOR_THEMES = [
  { name: "Gold", accent: "#c9a84c", header: "#0f172a" },
  { name: "Navy", accent: "#1e40af", header: "#0f172a" },
  { name: "Forest", accent: "#059669", header: "#0f172a" },
  { name: "Purple", accent: "#7c3aed", header: "#1a1a2e" },
  { name: "Charcoal", accent: "#475569", header: "#111827" },
];

const STEPS = [
  { id: 1, label: "Your Details", icon: User },
  { id: 2, label: "Preview", icon: Eye },
  { id: 3, label: "Job Match", icon: Target },
  { id: 4, label: "Download", icon: Download },
];

/* ── CV Preview ── */
function CVPreviewRender({ cv, colorIdx, templateId }: { cv: CVData; colorIdx: number; templateId: string }) {
  const theme = COLOR_THEMES[colorIdx] || COLOR_THEMES[0];
  const isSidebar = templateId === "sidebar";
  const isExecutive = templateId === "executive-classic" || templateId === "executive";
  const isTwoCol = templateId === "two-column";
  const displayName = cv.name || "Your Full Name";
  const displayTitle = cv.title || "Professional Title";
  const initials = displayName.split(" ").filter(Boolean).map(n => n[0]).join("").slice(0, 2);

  const sectionHeader = (title: string) => (
    <div style={{ fontSize: 9, fontWeight: 700, color: isExecutive ? "#0f172a" : theme.header, textTransform: "uppercase", letterSpacing: 1.5, borderBottom: `1px solid ${theme.accent}`, paddingBottom: 3, marginBottom: 6, marginTop: 14 }}>
      {title}
    </div>
  );

  const contactLine = (
    <div style={{ fontSize: 8, color: isExecutive ? "rgba(255,255,255,0.6)" : "#64748b", display: "flex", flexWrap: "wrap", gap: "4px 12px", marginTop: 4 }}>
      {cv.email && <span>{cv.email}</span>}
      {cv.phone && <span>{cv.phone}</span>}
      {cv.location && <span>{cv.location}</span>}
      {cv.linkedin && <span>{cv.linkedin}</span>}
    </div>
  );

  const experienceSection = cv.experiences.filter(e => e.title).map((exp, i) => (
    <div key={i} style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#0f172a" }}>{exp.title}</span>
        <span style={{ fontSize: 8, color: theme.accent, whiteSpace: "nowrap" }}>{exp.from}{exp.to ? ` – ${exp.to}` : ""}</span>
      </div>
      <div style={{ fontSize: 9, color: theme.accent, fontWeight: 600, marginBottom: 2 }}>{exp.company}{exp.location ? ` · ${exp.location}` : ""}</div>
      {exp.bullets.filter(Boolean).map((b, j) => (
        <div key={j} style={{ fontSize: 8.5, color: "#475569", lineHeight: 1.6, paddingLeft: 10 }}>• {b}</div>
      ))}
    </div>
  ));

  const educationSection = cv.educations.filter(e => e.degree).map((edu, i) => (
    <div key={i} style={{ marginBottom: 6, display: "flex", justifyContent: "space-between" }}>
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#0f172a" }}>{edu.degree}</div>
        <div style={{ fontSize: 9, color: theme.accent }}>{edu.school}{edu.grade ? ` · ${edu.grade}` : ""}</div>
      </div>
      <div style={{ fontSize: 8, color: "#999" }}>{edu.year}</div>
    </div>
  ));

  const skillTags = cv.skills.filter(Boolean).map((s, i) => (
    <span key={i} style={{ fontSize: 7.5, background: `${theme.accent}15`, border: `0.5px solid ${theme.accent}40`, color: theme.accent, padding: "2px 8px", borderRadius: 100, fontWeight: 600 }}>{s}</span>
  ));

  if (isSidebar) {
    return (
      <div style={{ display: "flex", minHeight: 700, fontFamily: "'Inter', sans-serif" }}>
        <div style={{ width: "35%", background: theme.header, padding: "24px 14px", color: "#fff" }}>
          <div style={{ width: 50, height: 50, borderRadius: "50%", background: theme.accent, margin: "0 auto 10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: theme.header }}>{initials}</div>
          <div style={{ fontSize: 12, fontWeight: 800, textAlign: "center", marginBottom: 2 }}>{displayName}</div>
          <div style={{ fontSize: 8, color: theme.accent, textAlign: "center", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>{displayTitle}</div>
          <div style={{ height: 0.5, background: `${theme.accent}40`, marginBottom: 10 }} />
          <div style={{ fontSize: 7, color: theme.accent, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Contact</div>
          {cv.email && <div style={{ fontSize: 7.5, color: "#cbd5e1", lineHeight: 1.8 }}>{cv.email}</div>}
          {cv.phone && <div style={{ fontSize: 7.5, color: "#cbd5e1", lineHeight: 1.8 }}>{cv.phone}</div>}
          {cv.location && <div style={{ fontSize: 7.5, color: "#cbd5e1", lineHeight: 1.8 }}>{cv.location}</div>}
          <div style={{ height: 0.5, background: `${theme.accent}40`, margin: "10px 0" }} />
          <div style={{ fontSize: 7, color: theme.accent, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Skills</div>
          {cv.skills.filter(Boolean).map((s, i) => <div key={i} style={{ fontSize: 7.5, color: "#cbd5e1", lineHeight: 1.7 }}>• {s}</div>)}
          <div style={{ height: 0.5, background: `${theme.accent}40`, margin: "10px 0" }} />
          <div style={{ fontSize: 7, color: theme.accent, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Languages</div>
          {cv.languages.filter(l => l.name).map((l, i) => <div key={i} style={{ fontSize: 7.5, color: "#cbd5e1" }}>{l.name} — {l.level}</div>)}
          <div style={{ height: 0.5, background: `${theme.accent}40`, margin: "10px 0" }} />
          <div style={{ fontSize: 7, color: theme.accent, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Education</div>
          {cv.educations.filter(e => e.degree).map((edu, i) => (
            <div key={i} style={{ marginBottom: 5 }}>
              <div style={{ fontSize: 7.5, color: "#e2e8f0", fontWeight: 600 }}>{edu.degree}</div>
              <div style={{ fontSize: 7, color: "#94a3b8" }}>{edu.school} · {edu.year}</div>
            </div>
          ))}
        </div>
        <div style={{ flex: 1, padding: "24px 18px", background: "#fff" }}>
          {sectionHeader("Professional Summary")}
          <div style={{ fontSize: 9, color: "#475569", lineHeight: 1.7, marginBottom: 6 }}>{cv.summary || "Write your professional summary..."}</div>
          {sectionHeader("Work Experience")}
          {experienceSection.length > 0 ? experienceSection : <div style={{ fontSize: 9, color: "#999", fontStyle: "italic" }}>Add your work experience</div>}
          {cv.certifications.filter(Boolean).length > 0 && <>
            {sectionHeader("Certifications")}
            {cv.certifications.filter(Boolean).map((c, i) => <div key={i} style={{ fontSize: 8.5, color: "#475569" }}>• {c}</div>)}
          </>}
        </div>
      </div>
    );
  }

  // Single column / executive
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", minHeight: 700, background: "#fff" }}>
      <div style={{ background: isExecutive ? theme.header : "#fff", padding: "20px 28px" }}>
        <div style={{ fontSize: isExecutive ? 18 : 16, fontWeight: 800, color: isExecutive ? "#fff" : "#0f172a", letterSpacing: isExecutive ? 1.5 : 0.3 }}>
          {isExecutive ? displayName.toUpperCase() : displayName}
        </div>
        <div style={{ fontSize: 10, color: theme.accent, textTransform: "uppercase", letterSpacing: isExecutive ? 2 : 0.8, marginTop: 2, fontWeight: 600 }}>{displayTitle}</div>
        {contactLine}
      </div>
      {isExecutive && <div style={{ height: 2, background: `linear-gradient(90deg,${theme.accent},#f0d080,${theme.accent})` }} />}
      <div style={{ padding: "12px 28px 24px" }}>
        {sectionHeader(isExecutive ? "Executive Summary" : "Profile")}
        <div style={{ fontSize: 9, color: "#475569", lineHeight: 1.7 }}>{cv.summary || "Write your professional summary..."}</div>
        {sectionHeader(isExecutive ? "Leadership Experience" : "Work Experience")}
        {experienceSection.length > 0 ? experienceSection : <div style={{ fontSize: 9, color: "#999", fontStyle: "italic" }}>Add your work experience</div>}
        {sectionHeader("Education")}
        {educationSection.length > 0 ? educationSection : <div style={{ fontSize: 9, color: "#999", fontStyle: "italic" }}>Add your education</div>}
        {cv.skills.filter(Boolean).length > 0 && <>
          {sectionHeader(isExecutive ? "Core Competencies" : "Skills")}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{skillTags}</div>
        </>}
        {cv.languages.filter(l => l.name).length > 0 && <>
          {sectionHeader("Languages")}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px" }}>
            {cv.languages.filter(l => l.name).map((l, i) => (
              <span key={i} style={{ fontSize: 9, color: "#475569" }}><strong>{l.name}</strong> — {l.level}</span>
            ))}
          </div>
        </>}
        {cv.certifications.filter(Boolean).length > 0 && <>
          {sectionHeader("Certifications")}
          {cv.certifications.filter(Boolean).map((c, i) => <div key={i} style={{ fontSize: 9, color: "#475569" }}>• {c}</div>)}
        </>}
      </div>
    </div>
  );
}

/* ── Job Match Score Section ── */
function JobMatchSection({ cv }: { cv: CVData }) {
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ matchScore: number; matchedKeywords: string[]; missingKeywords: string[]; recommendations: string[] } | null>(null);

  const analyze = async () => {
    if (!jobDesc.trim()) { toast.error("Paste a job description first"); return; }
    const cvText = [cv.name, cv.title, cv.summary, ...cv.skills, ...cv.experiences.map(e => `${e.title} ${e.company} ${e.bullets.join(" ")}`), ...cv.educations.map(e => `${e.degree} ${e.school}`)].filter(Boolean).join("\n");
    if (cvText.length < 50) { toast.error("Add more CV details first"); return; }
    setLoading(true);
    try {
      const { data: res, error } = await supabase.functions.invoke("ai-generate", {
        body: { type: "job-match", data: { jobDescription: jobDesc, cvText } },
      });
      if (error) throw error;
      setResult(JSON.parse(res.content));
    } catch (e: any) {
      toast.error(e.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const circumference = 2 * Math.PI * 45;
  const offset = result ? circumference - (circumference * (result.matchScore / 100)) : circumference;
  const scoreColor = result ? (result.matchScore >= 80 ? "#22c55e" : result.matchScore >= 50 ? "#eab308" : "#ef4444") : "#eab308";

  return (
    <div className="space-y-5">
      {!result && !loading && (
        <>
          <p className="text-sm text-muted-foreground">Paste a job description to see how well your CV matches.</p>
          <Textarea value={jobDesc} onChange={(e) => setJobDesc(e.target.value)} rows={8} placeholder="Paste the full job description here..." className="bg-muted/30 border-border" />
          <Button onClick={analyze} disabled={!jobDesc.trim()} className="w-full h-12 bg-gradient-brand border-0 font-semibold gold-shimmer">
            <Target className="h-4 w-4 mr-2" /> Check My Match Score
          </Button>
        </>
      )}
      {loading && (
        <div className="flex flex-col items-center py-10 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Analyzing match...</p>
        </div>
      )}
      {result && !loading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          <div className="flex flex-col items-center gap-2">
            <div className="relative w-28 h-28">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
                <motion.circle cx="50" cy="50" r="45" fill="none" stroke={scoreColor} strokeWidth="6" strokeLinecap="round" strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: offset }} transition={{ duration: 1.2, ease: "easeOut" }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold" style={{ color: scoreColor }}>{result.matchScore}%</span>
                <span className="text-[9px] text-muted-foreground uppercase tracking-wider">Match</span>
              </div>
            </div>
          </div>
          {result.matchedKeywords.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-green-400 mb-2 flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Matched ({result.matchedKeywords.length})</p>
              <div className="flex flex-wrap gap-1.5">
                {result.matchedKeywords.map((kw, i) => <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/20">{kw}</span>)}
              </div>
            </div>
          )}
          {result.missingKeywords.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-red-400 mb-2 flex items-center gap-1"><XCircle className="h-3.5 w-3.5" /> Missing ({result.missingKeywords.length})</p>
              <div className="flex flex-wrap gap-1.5">
                {result.missingKeywords.map((kw, i) => <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/20">{kw}</span>)}
              </div>
            </div>
          )}
          {result.recommendations?.length > 0 && (
            <div className="rounded-xl border border-border bg-muted/30 p-3 space-y-1.5">
              <p className="text-xs font-semibold text-muted-foreground">💡 Improvement Tips</p>
              {result.recommendations.map((r, i) => <p key={i} className="text-xs text-muted-foreground">• {r}</p>)}
            </div>
          )}
          <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground" onClick={() => setResult(null)}>
            Try a different job description
          </Button>
        </motion.div>
      )}
    </div>
  );
}

/* ── Download Modal ── */
function DownloadModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-card border border-border rounded-2xl p-8 max-w-md w-full mx-4 text-center space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-16 h-16 rounded-full bg-gradient-brand mx-auto flex items-center justify-center">
          <Lock className="h-7 w-7 text-primary-foreground" />
        </div>
        <h2 className="text-xl font-bold">Your CV is Ready!</h2>
        <p className="text-muted-foreground text-sm">Download your professional CV in PDF or DOCX format.</p>
        <div className="border border-border rounded-xl p-4 bg-muted/20">
          <div className="text-2xl font-bold text-primary">KES 1,490</div>
          <div className="text-xs text-muted-foreground">One-time payment · Instant download</div>
        </div>
        <Link to="/order?package=starter">
          <Button className="w-full h-12 bg-gradient-brand border-0 font-semibold gold-shimmer text-base">
            <Lock className="h-4 w-4 mr-2" /> Pay & Download Now
          </Button>
        </Link>
        <button onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
      </motion.div>
    </div>
  );
}

/* ── Main Editor Page ── */
export default function NewCVEditorPage() {
  const { templateId = "classic" } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const [cv, setCv] = useState<CVData>(defaultCV);
  const [colorIdx, setColorIdx] = useState(0);
  const [step, setStep] = useState(1);
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");
  const [showDownload, setShowDownload] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [certInput, setCertInput] = useState("");

  const update = <K extends keyof CVData>(key: K, val: CVData[K]) => setCv(prev => ({ ...prev, [key]: val }));

  const addExp = () => update("experiences", [...cv.experiences, { title: "", company: "", location: "", from: "", to: "", bullets: [""] }]);
  const removeExp = (i: number) => update("experiences", cv.experiences.filter((_, idx) => idx !== i));
  const updateExp = (i: number, field: keyof Experience, val: any) => {
    const exps = [...cv.experiences];
    exps[i] = { ...exps[i], [field]: val };
    update("experiences", exps);
  };

  const addEdu = () => update("educations", [...cv.educations, { degree: "", school: "", year: "", grade: "" }]);
  const removeEdu = (i: number) => update("educations", cv.educations.filter((_, idx) => idx !== i));
  const updateEdu = (i: number, field: keyof Education, val: string) => {
    const edus = [...cv.educations];
    edus[i] = { ...edus[i], [field]: val };
    update("educations", edus);
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      update("skills", [...cv.skills, ...skillInput.split(",").map(s => s.trim()).filter(Boolean)]);
      setSkillInput("");
    }
  };

  const addCert = () => {
    if (certInput.trim()) {
      update("certifications", [...cv.certifications, certInput.trim()]);
      setCertInput("");
    }
  };

  const addLang = () => update("languages", [...cv.languages, { name: "", level: "Conversational" }]);
  const removeLang = (i: number) => update("languages", cv.languages.filter((_, idx) => idx !== i));
  const updateLang = (i: number, field: "name" | "level", val: string) => {
    const langs = [...cv.languages];
    langs[i] = { ...langs[i], [field]: val };
    update("languages", langs);
  };

  /* ── Form Panel ── */
  const formPanel = (
    <div className="space-y-6 pb-32">
      {/* Personal Details */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h2 className="font-bold text-base flex items-center gap-2"><User className="h-4 w-4 text-primary" /> Personal Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2"><Label className="text-xs text-muted-foreground mb-1">Full Name</Label><Input value={cv.name} onChange={(e) => update("name", e.target.value)} placeholder="James Mitchell" /></div>
          <div className="sm:col-span-2"><Label className="text-xs text-muted-foreground mb-1">Professional Title</Label><Input value={cv.title} onChange={(e) => update("title", e.target.value)} placeholder="Senior Marketing Manager" /></div>
          <div><Label className="text-xs text-muted-foreground mb-1">Email</Label><Input value={cv.email} onChange={(e) => update("email", e.target.value)} placeholder="james@email.com" /></div>
          <div><Label className="text-xs text-muted-foreground mb-1">Phone</Label><Input value={cv.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+254 722 000 111" /></div>
          <div><Label className="text-xs text-muted-foreground mb-1">Location</Label><Input value={cv.location} onChange={(e) => update("location", e.target.value)} placeholder="Nairobi, Kenya" /></div>
          <div><Label className="text-xs text-muted-foreground mb-1">LinkedIn</Label><Input value={cv.linkedin} onChange={(e) => update("linkedin", e.target.value)} placeholder="linkedin.com/in/james" /></div>
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-3">
        <h2 className="font-bold text-base flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> Professional Summary</h2>
        <Textarea value={cv.summary} onChange={(e) => update("summary", e.target.value)} rows={4} placeholder="Results-driven professional with 8+ years..." className="bg-muted/20 border-border" />
        <div className="text-xs text-muted-foreground text-right">{cv.summary.length} characters</div>
      </div>

      {/* Work Experience */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-base flex items-center gap-2"><Briefcase className="h-4 w-4 text-primary" /> Work Experience</h2>
          <button onClick={addExp} className="text-xs text-primary hover:underline flex items-center gap-1"><Plus className="h-3 w-3" />Add</button>
        </div>
        {cv.experiences.map((exp, i) => (
          <div key={i} className="border border-border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-muted-foreground">Position {i + 1}</span>
              {cv.experiences.length > 1 && <button onClick={() => removeExp(i)} className="text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Input placeholder="Job Title" value={exp.title} onChange={(e) => updateExp(i, "title", e.target.value)} />
              <Input placeholder="Company" value={exp.company} onChange={(e) => updateExp(i, "company", e.target.value)} />
              <Input placeholder="Location" value={exp.location} onChange={(e) => updateExp(i, "location", e.target.value)} />
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="From" value={exp.from} onChange={(e) => updateExp(i, "from", e.target.value)} />
                <Input placeholder="To" value={exp.to} onChange={(e) => updateExp(i, "to", e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Achievements (one per line)</Label>
              {exp.bullets.map((b, j) => (
                <div key={j} className="flex gap-2">
                  <Input value={b} onChange={(e) => { const bullets = [...exp.bullets]; bullets[j] = e.target.value; updateExp(i, "bullets", bullets); }} placeholder={`Achievement ${j + 1}`} />
                  {exp.bullets.length > 1 && <button onClick={() => { const bullets = exp.bullets.filter((_, idx) => idx !== j); updateExp(i, "bullets", bullets); }} className="text-destructive shrink-0"><Trash2 className="h-3.5 w-3.5" /></button>}
                </div>
              ))}
              <button onClick={() => updateExp(i, "bullets", [...exp.bullets, ""])} className="text-xs text-primary hover:underline flex items-center gap-1"><Plus className="h-3 w-3" />Add bullet</button>
            </div>
          </div>
        ))}
      </div>

      {/* Education */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-base flex items-center gap-2"><GraduationCap className="h-4 w-4 text-primary" /> Education</h2>
          <button onClick={addEdu} className="text-xs text-primary hover:underline flex items-center gap-1"><Plus className="h-3 w-3" />Add</button>
        </div>
        {cv.educations.map((edu, i) => (
          <div key={i} className="border border-border rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-muted-foreground">Qualification {i + 1}</span>
              {cv.educations.length > 1 && <button onClick={() => removeEdu(i)} className="text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="sm:col-span-2"><Input placeholder="Degree / Qualification" value={edu.degree} onChange={(e) => updateEdu(i, "degree", e.target.value)} /></div>
              <Input placeholder="School / University" value={edu.school} onChange={(e) => updateEdu(i, "school", e.target.value)} />
              <Input placeholder="Year" value={edu.year} onChange={(e) => updateEdu(i, "year", e.target.value)} />
              <div className="sm:col-span-2"><Input placeholder="Grade / Honours (optional)" value={edu.grade} onChange={(e) => updateEdu(i, "grade", e.target.value)} /></div>
            </div>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-3">
        <h2 className="font-bold text-base flex items-center gap-2"><Wrench className="h-4 w-4 text-primary" /> Skills</h2>
        <div className="flex flex-wrap gap-1.5 min-h-[28px]">
          {cv.skills.map((s, i) => (
            <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
              {s}
              <button onClick={() => update("skills", cv.skills.filter((_, idx) => idx !== i))} className="ml-0.5 hover:text-destructive">×</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} placeholder="Type skills, comma separated" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }} />
          <Button onClick={addSkill} variant="outline" size="sm">Add</Button>
        </div>
      </div>

      {/* Languages */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-base flex items-center gap-2"><Globe className="h-4 w-4 text-primary" /> Languages</h2>
          <button onClick={addLang} className="text-xs text-primary hover:underline flex items-center gap-1"><Plus className="h-3 w-3" />Add</button>
        </div>
        {cv.languages.map((lang, i) => (
          <div key={i} className="flex items-end gap-3">
            <div className="flex-1"><Input value={lang.name} onChange={(e) => updateLang(i, "name", e.target.value)} placeholder="Language" /></div>
            <div className="w-36">
              <select value={lang.level} onChange={(e) => updateLang(i, "level", e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                {["Basic", "Conversational", "Fluent", "Native"].map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            {cv.languages.length > 1 && <button onClick={() => removeLang(i)} className="text-destructive mb-2"><Trash2 className="h-4 w-4" /></button>}
          </div>
        ))}
      </div>

      {/* Certifications */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-3">
        <h2 className="font-bold text-base flex items-center gap-2"><Award className="h-4 w-4 text-primary" /> Certifications</h2>
        {cv.certifications.map((c, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-sm text-foreground flex-1">• {c}</span>
            <button onClick={() => update("certifications", cv.certifications.filter((_, idx) => idx !== i))} className="text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
        ))}
        <div className="flex gap-2">
          <Input value={certInput} onChange={(e) => setCertInput(e.target.value)} placeholder="e.g. CPA-K, AWS Certified" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCert(); } }} />
          <Button onClick={addCert} variant="outline" size="sm">Add</Button>
        </div>
      </div>

      {/* Job Match (step 3) */}
      {step >= 3 && (
        <div className="rounded-xl border border-primary/30 bg-card p-5 space-y-3">
          <h2 className="font-bold text-base flex items-center gap-2"><Target className="h-4 w-4 text-primary" /> Job Match Score</h2>
          <JobMatchSection cv={cv} />
        </div>
      )}
    </div>
  );

  /* ── Preview Panel ── */
  const previewPanel = (
    <div
      className="bg-white rounded-xl shadow-2xl overflow-hidden"
      style={{ userSelect: "none", WebkitUserSelect: "none" }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Watermark */}
      <div className="relative">
        <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
          <span className="text-[40px] font-bold tracking-[0.2em] whitespace-nowrap select-none" style={{ transform: "rotate(-38deg)", color: "rgba(201,168,76,0.06)" }}>
            CV Edge Preview
          </span>
        </div>
        <CVPreviewRender cv={cv} colorIdx={colorIdx} templateId={templateId} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="container max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/templates")} className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <span className="font-bold text-sm capitalize hidden sm:inline">{templateId.replace(/-/g, " ")} Template</span>
          </div>

          {/* Color swatches - desktop */}
          <div className="hidden sm:flex items-center gap-2">
            {COLOR_THEMES.map((t, i) => (
              <button key={i} onClick={() => setColorIdx(i)} className="w-5 h-5 rounded-full border-2 transition-all" style={{ backgroundColor: t.accent, borderColor: i === colorIdx ? "hsl(var(--foreground))" : "transparent", transform: i === colorIdx ? "scale(1.25)" : "scale(1)" }} title={t.name} />
            ))}
            <button onClick={() => navigate("/templates")} className="ml-3 text-xs text-muted-foreground hover:text-primary transition-colors">Change Template</button>
          </div>

          {/* Progress steps - desktop */}
          <div className="hidden md:flex items-center gap-1">
            {STEPS.map((s) => (
              <button key={s.id} onClick={() => setStep(s.id)} className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${step === s.id ? "bg-gradient-brand text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                <s.icon className="h-3 w-3" /> {s.label}
              </button>
            ))}
          </div>

          {/* Download button */}
          <Button onClick={() => setShowDownload(true)} size="sm" className="bg-gradient-brand border-0 font-semibold shadow-glow-sm gold-shimmer">
            <Lock className="h-3.5 w-3.5 mr-1" /> Download
          </Button>
        </div>

        {/* Mobile color swatches + step progress */}
        <div className="sm:hidden px-4 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {COLOR_THEMES.map((t, i) => (
              <button key={i} onClick={() => setColorIdx(i)} className="w-4 h-4 rounded-full border-2" style={{ backgroundColor: t.accent, borderColor: i === colorIdx ? "hsl(var(--foreground))" : "transparent" }} />
            ))}
          </div>
          <div className="flex items-center gap-1">
            {STEPS.map((s) => (
              <button key={s.id} onClick={() => setStep(s.id)} className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${step === s.id ? "bg-gradient-brand text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {s.id}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile tab switcher */}
      <div className="md:hidden sticky top-[88px] z-30 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="flex">
          <button onClick={() => setMobileTab("edit")} className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${mobileTab === "edit" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}>
            <Pencil className="h-3.5 w-3.5" /> Edit
          </button>
          <button onClick={() => setMobileTab("preview")} className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${mobileTab === "preview" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}>
            <Eye className="h-3.5 w-3.5" /> Preview
          </button>
        </div>
      </div>

      {/* Desktop: side by side */}
      <div className="container max-w-7xl mx-auto px-4 py-6">
        <div className="hidden md:grid md:grid-cols-5 gap-6">
          <div className="col-span-3 max-h-[calc(100vh-120px)] overflow-y-auto pr-2 scrollbar-thin">
            {formPanel}
          </div>
          <div className="col-span-2 sticky top-[72px] h-[calc(100vh-96px)] overflow-y-auto">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Live Preview</span>
              <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Updates as you type</span>
            </div>
            {previewPanel}
          </div>
        </div>

        {/* Mobile: tabbed */}
        <div className="md:hidden">
          {mobileTab === "edit" ? formPanel : previewPanel}
        </div>
      </div>

      {/* Mobile sticky download bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/90 backdrop-blur-xl p-3">
        <Button onClick={() => setShowDownload(true)} className="w-full h-12 bg-gradient-brand border-0 font-semibold gold-shimmer">
          <Lock className="h-4 w-4 mr-2" /> Unlock & Download CV
        </Button>
      </div>

      <DownloadModal open={showDownload} onClose={() => setShowDownload(false)} />
    </div>
  );
}
