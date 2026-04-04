import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect, useRef } from "react";
import FreemiumPaywall from "@/components/FreemiumPaywall";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Trash2,
  Download,
  ArrowLeft,
  CheckCircle2,
  Target,
  TrendingUp,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { TEMPLATES } from "./TemplatesPage";
import MpesaPaymentModal from "@/components/MpesaPaymentModal";

interface Experience {
  title: string;
  company: string;
  location: string;
  from: string;
  to: string;
  bullets: string;
}
interface Education {
  degree: string;
  school: string;
  year: string;
  grade: string;
}
interface CVData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  summary: string;
  experiences: Experience[];
  educations: Education[];
  skills: string;
  languages: string;
  certifications: string;
}

const defaultCV: CVData = {
  name: "Your Full Name",
  title: "Your Professional Title",
  email: "email@example.com",
  phone: "+254 700 000 000",
  location: "Nairobi, Kenya",
  linkedin: "linkedin.com/in/yourname",
  summary:
    "Write a 2-3 sentence professional summary that highlights your key strengths, years of experience, and what makes you valuable to employers.",
  experiences: [
    {
      title: "Job Title",
      company: "Company Name",
      location: "Nairobi, Kenya",
      from: "Jan 2021",
      to: "Present",
      bullets:
        "· Describe your key achievement with measurable results\n· Another key responsibility or accomplishment\n· Third achievement that shows your impact",
    },
  ],
  educations: [
    {
      degree: "Bachelor of Commerce (Finance)",
      school: "University of Nairobi",
      year: "2020",
      grade: "First Class Honours",
    },
  ],
  skills: "Communication, Leadership, Microsoft Office, Data Analysis, Project Management",
  languages: "English (Fluent), Kiswahili (Native)",
  certifications: "CPA-K, Google Analytics Certificate",
};

function buildCVFromTemplate(templateId: string): CVData {
  const template = TEMPLATES.find((t) => t.id === templateId);
  if (!template) return defaultCV;
  const p = template.person;
  return {
    name: p.name,
    title: p.title,
    email: p.email,
    phone: p.phone,
    location: p.location,
    linkedin: `linkedin.com/in/${p.name.toLowerCase().replace(/\s+/g, "")}`,
    summary: p.summary,
    experiences: p.experience.map((exp) => ({
      title: exp.role,
      company: exp.company,
      location: p.location,
      from: exp.dates.split("–")[0]?.trim() ?? "",
      to: exp.dates.split("–")[1]?.trim() ?? "Present",
      bullets: exp.bullets.map((b) => `· ${b}`).join("\n"),
    })),
    educations: p.education.map((edu) => ({ degree: edu.degree, school: edu.school, year: edu.year, grade: "" })),
    skills: p.skills.join(", "),
    languages: p.languages.join(", "),
    certifications: p.certifications.join(", "),
  };
}

// ─── JOB SCORE MATCH ─────────────────────────────────────────────────────────
function JobScoreMatch({ cv }: { cv: CVData }) {
  const [jobDesc, setJobDesc] = useState("");
  const [score, setScore] = useState<null | {
    overall: number;
    keywords: number;
    experience: number;
    skills: number;
    missing: string[];
    matched: string[];
  }>(null);
  const [loading, setLoading] = useState(false);

  const analyzeMatch = () => {
    if (!jobDesc.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const jdWords = jobDesc
        .toLowerCase()
        .split(/\W+/)
        .filter((w) => w.length > 3);
      const cvText =
        `${cv.title} ${cv.summary} ${cv.skills} ${cv.experiences.map((e) => `${e.title} ${e.company} ${e.bullets}`).join(" ")}`.toLowerCase();
      const cvWords = cvText.split(/\W+/).filter((w) => w.length > 3);
      const stopwords = [
        "that",
        "with",
        "this",
        "will",
        "have",
        "from",
        "they",
        "your",
        "must",
        "able",
        "been",
        "also",
        "into",
        "their",
        "more",
        "about",
        "over",
      ];
      const importantJdWords = [...new Set(jdWords.filter((w) => !stopwords.includes(w)))];
      const matched = importantJdWords.filter((w) => cvWords.includes(w)).slice(0, 8);
      const missing = importantJdWords.filter((w) => !cvWords.includes(w)).slice(0, 6);
      const keywordScore = Math.min(
        100,
        Math.round((matched.length / Math.max(importantJdWords.length, 1)) * 100 * 2.5),
      );
      const expScore = cv.experiences.length >= 3 ? 85 : cv.experiences.length >= 2 ? 70 : 55;
      const skillsScore = Math.min(100, cv.skills.split(",").length * 14);
      const overall = Math.round(keywordScore * 0.45 + expScore * 0.3 + skillsScore * 0.25);
      setScore({ overall, keywords: keywordScore, experience: expScore, skills: skillsScore, matched, missing });
      setLoading(false);
    }, 1200);
  };

  const getScoreColor = (s: number) => (s >= 75 ? "#059669" : s >= 50 ? "#d97706" : "#dc2626");
  const getScoreLabel = (s: number) => (s >= 75 ? "Strong Match" : s >= 50 ? "Moderate Match" : "Weak Match");

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-1">
        <Target className="h-4 w-4 text-primary" />
        <h2 className="font-bold text-base">Job Score Match</h2>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Paste a job description to see how well your CV matches the role.
      </p>
      <Textarea
        placeholder="Paste the job description here..."
        value={jobDesc}
        onChange={(e) => {
          setJobDesc(e.target.value);
          setScore(null);
        }}
        rows={5}
        className="mb-3 text-xs"
      />
      <Button
        onClick={analyzeMatch}
        disabled={!jobDesc.trim() || loading}
        className="w-full bg-gradient-brand border-0 font-semibold gold-shimmer h-10 mb-4"
      >
        {loading ? "Analysing..." : "Analyse Match"}
      </Button>
      {score && (
        <div className="space-y-4">
          <div
            className="flex items-center justify-between p-4 rounded-xl border-2"
            style={{ borderColor: getScoreColor(score.overall), background: `${getScoreColor(score.overall)}08` }}
          >
            <div>
              <div className="text-xs text-muted-foreground mb-0.5">Overall Match Score</div>
              <div className="font-bold text-lg" style={{ color: getScoreColor(score.overall) }}>
                {getScoreLabel(score.overall)}
              </div>
            </div>
            <div className="text-4xl font-black" style={{ color: getScoreColor(score.overall) }}>
              {score.overall}%
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Keywords", value: score.keywords },
              { label: "Experience", value: score.experience },
              { label: "Skills", value: score.skills },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-lg border border-border p-3 text-center">
                <div className="text-xs text-muted-foreground mb-1">{label}</div>
                <div className="font-bold text-base" style={{ color: getScoreColor(value) }}>
                  {value}%
                </div>
                <div className="mt-1.5 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${value}%`, background: getScoreColor(value) }}
                  />
                </div>
              </div>
            ))}
          </div>
          {score.matched.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-xs font-semibold text-emerald-600">Matched Keywords</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {score.matched.map((w) => (
                  <span
                    key={w}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium"
                  >
                    {w}
                  </span>
                ))}
              </div>
            </div>
          )}
          {score.missing.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                <span className="text-xs font-semibold text-amber-600">Consider Adding</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {score.missing.map((w) => (
                  <span
                    key={w}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-medium"
                  >
                    {w}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border border-border">
            <TrendingUp className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {score.overall >= 75
                ? "Great match! Your CV aligns well with this role. Download and apply with confidence."
                : score.overall >= 50
                  ? "Decent match. Consider weaving the missing keywords naturally into your summary or experience bullets."
                  : "Low match. Update your skills and summary to reflect the key requirements in the job description."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PREVIEW COMPONENTS ───────────────────────────────────────────────────────
function PreviewTraditional({ cv }: { cv: CVData }) {
  return (
    <div
      style={{
        background: "#fff",
        fontFamily: "Times New Roman, serif",
        fontSize: 8,
        padding: "28px 32px",
        color: "#222",
        minHeight: 700,
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 10 }}>
        <div style={{ fontSize: 18, fontWeight: "bold" }}>{cv.name}</div>
        <div style={{ fontSize: 9, color: "#555", marginTop: 2 }}>{cv.title}</div>
        <div style={{ fontSize: 8, color: "#777", marginTop: 3 }}>
          {cv.email} · {cv.phone} · {cv.location} · {cv.linkedin}
        </div>
      </div>
      <div
        style={{ borderTop: "1.5px solid #333", borderBottom: "1.5px solid #333", padding: "2px 0", marginBottom: 10 }}
      />
      <div style={{ fontSize: 8, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
        Profile
      </div>
      <div style={{ fontSize: 8, lineHeight: 1.7, color: "#444", marginBottom: 10 }}>{cv.summary}</div>
      <div style={{ borderTop: "0.5px solid #999", marginBottom: 8 }} />
      <div style={{ fontSize: 8, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
        Experience
      </div>
      {cv.experiences.map((exp, i) => (
        <div key={i} style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontWeight: "bold", fontSize: 9 }}>
              {exp.title} — {exp.company}
            </div>
            <div style={{ fontSize: 7.5, color: "#666" }}>
              {exp.from} – {exp.to}
            </div>
          </div>
          <div style={{ fontSize: 7.5, color: "#888", marginBottom: 2 }}>{exp.location}</div>
          {exp.bullets.split("\n").map(
            (b, j) =>
              b && (
                <div key={j} style={{ fontSize: 8, color: "#444", lineHeight: 1.6 }}>
                  {b}
                </div>
              ),
          )}
        </div>
      ))}
      <div style={{ borderTop: "0.5px solid #999", margin: "8px 0" }} />
      <div style={{ fontSize: 8, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
        Education
      </div>
      {cv.educations.map((edu, i) => (
        <div key={i} style={{ marginBottom: 5 }}>
          <div style={{ fontWeight: "bold", fontSize: 9 }}>{edu.degree}</div>
          <div style={{ fontSize: 8, color: "#555" }}>
            {edu.school} · {edu.year}
            {edu.grade ? ` · ${edu.grade}` : ""}
          </div>
        </div>
      ))}
      <div style={{ borderTop: "0.5px solid #999", margin: "8px 0" }} />
      <div style={{ fontSize: 8, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
        Skills
      </div>
      <div style={{ fontSize: 8, color: "#444", marginBottom: 8 }}>{cv.skills}</div>
      {cv.languages && (
        <>
          <div style={{ borderTop: "0.5px solid #999", margin: "8px 0" }} />
          <div
            style={{ fontSize: 8, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}
          >
            Languages
          </div>
          <div style={{ fontSize: 8, color: "#444", marginBottom: 8 }}>{cv.languages}</div>
        </>
      )}
      {cv.certifications && (
        <>
          <div style={{ borderTop: "0.5px solid #999", margin: "8px 0" }} />
          <div
            style={{ fontSize: 8, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}
          >
            Certifications
          </div>
          <div style={{ fontSize: 8, color: "#444" }}>{cv.certifications}</div>
        </>
      )}
    </div>
  );
}

function PreviewSidebar({ cv, accent = "#38bdf8" }: { cv: CVData; accent?: string }) {
  return (
    <div style={{ background: "#fff", fontFamily: "Arial, sans-serif", fontSize: 8, display: "flex", minHeight: 700 }}>
      <div style={{ width: 180, background: "#1e293b", padding: "24px 14px", flexShrink: 0 }}>
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: accent,
            margin: "0 auto 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          {cv.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)}
        </div>
        <div style={{ color: "#f1f5f9", fontSize: 11, fontWeight: "bold", textAlign: "center", marginBottom: 14 }}>
          {cv.name}
        </div>
        <div
          style={{
            fontSize: 7,
            color: accent,
            fontWeight: "bold",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            marginBottom: 4,
          }}
        >
          Contact
        </div>
        <div style={{ fontSize: 7.5, color: "#cbd5e1", lineHeight: 1.8 }}>{cv.email}</div>
        <div style={{ fontSize: 7.5, color: "#cbd5e1", lineHeight: 1.8 }}>{cv.phone}</div>
        <div style={{ fontSize: 7.5, color: "#cbd5e1", lineHeight: 1.8 }}>{cv.location}</div>
        <div style={{ fontSize: 7.5, color: accent, lineHeight: 1.8 }}>{cv.linkedin}</div>
        <div style={{ height: 0.5, background: "#334155", margin: "10px 0" }} />
        <div
          style={{
            fontSize: 7,
            color: accent,
            fontWeight: "bold",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            marginBottom: 4,
          }}
        >
          Skills
        </div>
        {cv.skills.split(",").map((s) => (
          <div key={s} style={{ fontSize: 7.5, color: "#cbd5e1", lineHeight: 1.7 }}>
            · {s.trim()}
          </div>
        ))}
        {cv.languages && (
          <>
            <div style={{ height: 0.5, background: "#334155", margin: "10px 0" }} />
            <div
              style={{
                fontSize: 7,
                color: accent,
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: 0.5,
                marginBottom: 4,
              }}
            >
              Languages
            </div>
            <div style={{ fontSize: 7.5, color: "#cbd5e1" }}>{cv.languages}</div>
          </>
        )}
        {cv.certifications && (
          <>
            <div style={{ height: 0.5, background: "#334155", margin: "10px 0" }} />
            <div
              style={{
                fontSize: 7,
                color: accent,
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: 0.5,
                marginBottom: 4,
              }}
            >
              Certifications
            </div>
            <div style={{ fontSize: 7.5, color: "#cbd5e1" }}>{cv.certifications}</div>
          </>
        )}
        <div style={{ height: 0.5, background: "#334155", margin: "10px 0" }} />
        <div
          style={{
            fontSize: 7,
            color: accent,
            fontWeight: "bold",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            marginBottom: 4,
          }}
        >
          Education
        </div>
        {cv.educations.map((edu, i) => (
          <div key={i} style={{ marginBottom: 6 }}>
            <div style={{ fontSize: 7.5, color: "#e2e8f0", fontWeight: "bold" }}>{edu.degree}</div>
            <div style={{ fontSize: 7, color: "#94a3b8" }}>{edu.school}</div>
            <div style={{ fontSize: 7, color: "#94a3b8" }}>
              {edu.year}
              {edu.grade ? ` · ${edu.grade}` : ""}
            </div>
          </div>
        ))}
      </div>
      <div style={{ flex: 1, padding: "24px 20px" }}>
        <div style={{ fontSize: 18, fontWeight: "bold", color: "#0f172a" }}>{cv.name}</div>
        <div style={{ fontSize: 9, color: accent, marginBottom: 14 }}>{cv.title}</div>
        <div
          style={{
            fontSize: 7,
            fontWeight: "bold",
            color: "#1e293b",
            textTransform: "uppercase",
            letterSpacing: 1,
            borderBottom: `1px solid ${accent}`,
            paddingBottom: 2,
            marginBottom: 6,
          }}
        >
          Professional Summary
        </div>
        <div style={{ fontSize: 8, color: "#475569", lineHeight: 1.7, marginBottom: 12 }}>{cv.summary}</div>
        <div
          style={{
            fontSize: 7,
            fontWeight: "bold",
            color: "#1e293b",
            textTransform: "uppercase",
            letterSpacing: 1,
            borderBottom: `1px solid ${accent}`,
            paddingBottom: 2,
            marginBottom: 6,
          }}
        >
          Experience
        </div>
        {cv.experiences.map((exp, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: "bold", fontSize: 8.5, color: "#0f172a" }}>{exp.title}</span>
              <span style={{ fontSize: 7.5, color: accent }}>
                {exp.from} – {exp.to}
              </span>
            </div>
            <div style={{ fontSize: 7.5, color: "#64748b", marginBottom: 2 }}>
              {exp.company} · {exp.location}
            </div>
            {exp.bullets.split("\n").map(
              (b, j) =>
                b && (
                  <div key={j} style={{ fontSize: 8, color: "#475569", lineHeight: 1.6 }}>
                    {b}
                  </div>
                ),
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function PreviewExecutive({
  cv,
  accentColor = "#c9a84c",
  headerBg = "#0f172a",
}: {
  cv: CVData;
  accentColor?: string;
  headerBg?: string;
}) {
  return (
    <div style={{ background: "#fff", fontFamily: "Georgia, serif", fontSize: 8, minHeight: 700 }}>
      <div style={{ background: headerBg, padding: "20px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: "bold", color: "#f8fafc", letterSpacing: 1 }}>
              {cv.name.toUpperCase()}
            </div>
            <div style={{ fontSize: 9, color: accentColor, marginTop: 3, letterSpacing: 2 }}>
              {cv.title.toUpperCase()}
            </div>
            <div style={{ fontSize: 7.5, color: "#94a3b8", marginTop: 5 }}>
              {cv.email} · {cv.phone} · {cv.location} · {cv.linkedin}
            </div>
          </div>
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              background: accentColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: headerBg,
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            {cv.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>
        </div>
      </div>
      <div style={{ height: 3, background: `linear-gradient(90deg,${accentColor},#f0d080,${accentColor})` }} />
      <div style={{ padding: "16px 28px" }}>
        <div
          style={{
            fontSize: 8,
            fontWeight: "bold",
            color: "#0f172a",
            textTransform: "uppercase",
            letterSpacing: 2,
            borderBottom: `0.5px solid ${accentColor}`,
            paddingBottom: 2,
            marginBottom: 6,
          }}
        >
          Executive Summary
        </div>
        <div style={{ fontSize: 8.5, color: "#334155", lineHeight: 1.8, marginBottom: 12 }}>{cv.summary}</div>
        <div
          style={{
            fontSize: 8,
            fontWeight: "bold",
            color: "#0f172a",
            textTransform: "uppercase",
            letterSpacing: 2,
            borderBottom: `0.5px solid ${accentColor}`,
            paddingBottom: 2,
            marginBottom: 6,
          }}
        >
          Leadership Experience
        </div>
        {cv.experiences.map((exp, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: "bold", fontSize: 9.5, color: "#0f172a" }}>
                {exp.title} — {exp.company}
              </span>
              <span style={{ fontSize: 8, color: accentColor }}>
                {exp.from} – {exp.to}
              </span>
            </div>
            <div style={{ fontSize: 7.5, color: "#94a3b8", marginBottom: 2 }}>{exp.location}</div>
            {exp.bullets.split("\n").map(
              (b, j) =>
                b && (
                  <div key={j} style={{ fontSize: 8, color: "#475569", lineHeight: 1.6 }}>
                    {b}
                  </div>
                ),
            )}
          </div>
        ))}
        <div
          style={{
            fontSize: 8,
            fontWeight: "bold",
            color: "#0f172a",
            textTransform: "uppercase",
            letterSpacing: 2,
            borderBottom: `0.5px solid ${accentColor}`,
            paddingBottom: 2,
            margin: "10px 0 6px",
          }}
        >
          Education
        </div>
        {cv.educations.map((edu, i) => (
          <div key={i} style={{ fontSize: 8.5, color: "#334155", marginBottom: 3 }}>
            {edu.degree} — {edu.school} · {edu.year}
            {edu.grade ? ` · ${edu.grade}` : ""}
          </div>
        ))}
        <div
          style={{
            fontSize: 8,
            fontWeight: "bold",
            color: "#0f172a",
            textTransform: "uppercase",
            letterSpacing: 2,
            borderBottom: `0.5px solid ${accentColor}`,
            paddingBottom: 2,
            margin: "10px 0 6px",
          }}
        >
          Core Competencies
        </div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
          {cv.skills.split(",").map((s) => (
            <span
              key={s}
              style={{ fontSize: 7.5, background: headerBg, color: accentColor, padding: "2px 8px", borderRadius: 2 }}
            >
              {s.trim()}
            </span>
          ))}
        </div>
        {cv.languages && (
          <>
            <div
              style={{
                fontSize: 8,
                fontWeight: "bold",
                color: "#0f172a",
                textTransform: "uppercase",
                letterSpacing: 2,
                borderBottom: `0.5px solid ${accentColor}`,
                paddingBottom: 2,
                margin: "10px 0 6px",
              }}
            >
              Languages
            </div>
            <div style={{ fontSize: 8, color: "#475569" }}>{cv.languages}</div>
          </>
        )}
        {cv.certifications && (
          <>
            <div
              style={{
                fontSize: 8,
                fontWeight: "bold",
                color: "#0f172a",
                textTransform: "uppercase",
                letterSpacing: 2,
                borderBottom: `0.5px solid ${accentColor}`,
                paddingBottom: 2,
                margin: "10px 0 6px",
              }}
            >
              Certifications
            </div>
            <div style={{ fontSize: 8, color: "#475569" }}>{cv.certifications}</div>
          </>
        )}
      </div>
    </div>
  );
}

function PreviewTwoColumn({ cv, accent = "#2563eb" }: { cv: CVData; accent?: string }) {
  return (
    <div style={{ background: "#fff", fontFamily: "Georgia, serif", fontSize: 8, minHeight: 700 }}>
      <div style={{ background: accent, padding: "18px 20px 14px" }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", letterSpacing: -0.5, lineHeight: 1 }}>
          {cv.name}
        </div>
        <div
          style={{
            fontSize: 10,
            color: "rgba(255,255,255,0.88)",
            textTransform: "uppercase",
            letterSpacing: 2,
            fontWeight: 600,
            marginTop: 4,
          }}
        >
          {cv.title}
        </div>
        <div style={{ fontSize: 8, color: "rgba(255,255,255,0.65)", marginTop: 5 }}>
          {cv.email} · {cv.phone} · {cv.location}
        </div>
      </div>
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1, padding: "14px 16px" }}>
          <div
            style={{
              fontSize: 8,
              fontWeight: "bold",
              color: accent,
              textTransform: "uppercase",
              letterSpacing: 1,
              borderBottom: `2px solid ${accent}`,
              paddingBottom: 3,
              marginBottom: 6,
            }}
          >
            Profile
          </div>
          <div style={{ fontSize: 8, color: "#475569", lineHeight: 1.7, marginBottom: 12 }}>{cv.summary}</div>
          <div
            style={{
              fontSize: 8,
              fontWeight: "bold",
              color: accent,
              textTransform: "uppercase",
              letterSpacing: 1,
              borderBottom: `2px solid ${accent}`,
              paddingBottom: 3,
              marginBottom: 6,
            }}
          >
            Work Experience
          </div>
          {cv.experiences.map((exp, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "bold", fontSize: 9, color: "#0f172a" }}>{exp.title}</span>
                <span style={{ fontSize: 7.5, color: "#64748b" }}>
                  {exp.from} – {exp.to}
                </span>
              </div>
              <div style={{ fontSize: 8, color: accent, fontWeight: 600, marginBottom: 2 }}>
                {exp.company} · {exp.location}
              </div>
              {exp.bullets.split("\n").map(
                (b, j) =>
                  b && (
                    <div key={j} style={{ fontSize: 7.5, color: "#475569", lineHeight: 1.6 }}>
                      {b}
                    </div>
                  ),
              )}
            </div>
          ))}
        </div>
        <div style={{ width: "32%", background: "#f8fafc", padding: "14px 12px", borderLeft: `3px solid ${accent}` }}>
          <div
            style={{
              fontSize: 8,
              fontWeight: "bold",
              color: accent,
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 6,
            }}
          >
            Skills
          </div>
          {cv.skills.split(",").map((s) => (
            <div
              key={s}
              style={{ fontSize: 8, color: "#334155", lineHeight: 1.9, display: "flex", alignItems: "center", gap: 4 }}
            >
              <span
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: accent,
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              {s.trim()}
            </div>
          ))}
          <div style={{ height: 1, background: "#e2e8f0", margin: "8px 0" }} />
          <div
            style={{
              fontSize: 8,
              fontWeight: "bold",
              color: accent,
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 6,
            }}
          >
            Education
          </div>
          {cv.educations.map((edu, i) => (
            <div key={i} style={{ marginBottom: 6 }}>
              <div style={{ fontSize: 8, fontWeight: "bold", color: "#0f172a", lineHeight: 1.3 }}>{edu.degree}</div>
              <div style={{ fontSize: 7.5, color: "#64748b" }}>
                {edu.school} · {edu.year}
              </div>
            </div>
          ))}
          {cv.languages && (
            <>
              <div style={{ height: 1, background: "#e2e8f0", margin: "8px 0" }} />
              <div
                style={{
                  fontSize: 8,
                  fontWeight: "bold",
                  color: accent,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 4,
                }}
              >
                Languages
              </div>
              {cv.languages.split(",").map((l) => (
                <div key={l} style={{ fontSize: 7.5, color: "#475569", lineHeight: 1.7 }}>
                  • {l.trim()}
                </div>
              ))}
            </>
          )}
          {cv.certifications && (
            <>
              <div style={{ height: 1, background: "#e2e8f0", margin: "8px 0" }} />
              <div
                style={{
                  fontSize: 8,
                  fontWeight: "bold",
                  color: accent,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 4,
                }}
              >
                Certifications
              </div>
              {cv.certifications.split(",").map((c) => (
                <div key={c} style={{ fontSize: 7.5, color: "#475569", lineHeight: 1.7 }}>
                  ✓ {c.trim()}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function PreviewPhoto({ cv, accent = "#2563eb" }: { cv: CVData; accent?: string }) {
  return (
    <div style={{ background: "#fff", fontFamily: "Georgia, serif", fontSize: 8, minHeight: 700 }}>
      <div style={{ background: "#1e293b", padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: accent,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            fontWeight: 800,
            color: "#fff",
            border: "3px solid rgba(255,255,255,0.2)",
          }}
        >
          {cv.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)}
        </div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", letterSpacing: -0.3, lineHeight: 1 }}>
            {cv.name}
          </div>
          <div
            style={{
              fontSize: 9,
              color: accent,
              textTransform: "uppercase",
              letterSpacing: 1.5,
              fontWeight: 700,
              marginTop: 4,
            }}
          >
            {cv.title}
          </div>
          <div style={{ fontSize: 7.5, color: "rgba(255,255,255,0.55)", marginTop: 4 }}>
            {cv.email} · {cv.phone} · {cv.location}
          </div>
        </div>
      </div>
      <div style={{ height: 3, background: `linear-gradient(90deg, ${accent}, ${accent}60)` }} />
      <div style={{ padding: "12px 20px" }}>
        <div
          style={{
            fontSize: 8,
            fontWeight: "bold",
            color: "#0f172a",
            textTransform: "uppercase",
            letterSpacing: 1.5,
            borderBottom: `2px solid ${accent}`,
            paddingBottom: 3,
            marginBottom: 6,
          }}
        >
          Profile
        </div>
        <div style={{ fontSize: 8, color: "#475569", lineHeight: 1.7, marginBottom: 10 }}>{cv.summary}</div>
        <div
          style={{
            fontSize: 8,
            fontWeight: "bold",
            color: "#0f172a",
            textTransform: "uppercase",
            letterSpacing: 1.5,
            borderBottom: `2px solid ${accent}`,
            paddingBottom: 3,
            marginBottom: 6,
          }}
        >
          Work Experience
        </div>
        {cv.experiences.map((exp, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: "bold", fontSize: 9, color: "#0f172a" }}>{exp.title}</span>
              <span style={{ fontSize: 7.5, color: accent, fontWeight: 600 }}>
                {exp.from} – {exp.to}
              </span>
            </div>
            <div style={{ fontSize: 8, color: accent, fontWeight: 600, marginBottom: 2 }}>
              {exp.company} · {exp.location}
            </div>
            {exp.bullets.split("\n").map(
              (b, j) =>
                b && (
                  <div key={j} style={{ fontSize: 8, color: "#475569", lineHeight: 1.6 }}>
                    {b}
                  </div>
                ),
            )}
          </div>
        ))}
        <div
          style={{
            fontSize: 8,
            fontWeight: "bold",
            color: "#0f172a",
            textTransform: "uppercase",
            letterSpacing: 1.5,
            borderBottom: `2px solid ${accent}`,
            paddingBottom: 3,
            marginBottom: 6,
          }}
        >
          Education
        </div>
        {cv.educations.map((edu, i) => (
          <div key={i} style={{ fontSize: 8.5, marginBottom: 4 }}>
            <span style={{ fontWeight: "bold", color: "#0f172a" }}>{edu.degree}</span>
            <span style={{ color: "#64748b" }}>
              {" "}
              — {edu.school} · {edu.year}
              {edu.grade ? ` · ${edu.grade}` : ""}
            </span>
          </div>
        ))}
        <div
          style={{
            fontSize: 8,
            fontWeight: "bold",
            color: "#0f172a",
            textTransform: "uppercase",
            letterSpacing: 1.5,
            borderBottom: `2px solid ${accent}`,
            paddingBottom: 3,
            margin: "8px 0 6px",
          }}
        >
          Skills
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
          {cv.skills.split(",").map((s) => (
            <span
              key={s}
              style={{
                fontSize: 7.5,
                background: `${accent}18`,
                color: accent,
                padding: "2px 7px",
                borderRadius: 3,
                border: `1px solid ${accent}40`,
                fontWeight: 600,
              }}
            >
              {s.trim()}
            </span>
          ))}
        </div>
        {cv.certifications && (
          <>
            <div
              style={{
                fontSize: 8,
                fontWeight: "bold",
                color: "#0f172a",
                textTransform: "uppercase",
                letterSpacing: 1.5,
                borderBottom: `2px solid ${accent}`,
                paddingBottom: 3,
                margin: "8px 0 6px",
              }}
            >
              Certifications
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
              {cv.certifications.split(",").map((c) => (
                <div key={c} style={{ fontSize: 7.5, color: "#475569" }}>
                  ✓ {c.trim()}
                </div>
              ))}
            </div>
          </>
        )}
        {cv.languages && (
          <>
            <div
              style={{
                fontSize: 8,
                fontWeight: "bold",
                color: "#0f172a",
                textTransform: "uppercase",
                letterSpacing: 1.5,
                borderBottom: `2px solid ${accent}`,
                paddingBottom: 3,
                margin: "8px 0 6px",
              }}
            >
              Languages
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {cv.languages.split(",").map((l) => (
                <div key={l} style={{ fontSize: 7.5, color: "#475569" }}>
                  • {l.trim()}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function PreviewMinimalist({ cv }: { cv: CVData }) {
  return (
    <div
      style={{
        background: "#fff",
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        fontSize: 8,
        padding: "32px 36px",
        color: "#111",
        minHeight: 700,
      }}
    >
      <div style={{ borderBottom: "2px solid #111", paddingBottom: 12, marginBottom: 14 }}>
        <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: -1, lineHeight: 1 }}>{cv.name}</div>
        <div style={{ fontSize: 9, color: "#555", marginTop: 4, letterSpacing: 2, textTransform: "uppercase" }}>
          {cv.title}
        </div>
        <div style={{ fontSize: 7.5, color: "#888", marginTop: 6 }}>
          {cv.email} · {cv.phone} · {cv.location}
        </div>
      </div>
      <div
        style={{
          fontSize: 7,
          fontWeight: 900,
          textTransform: "uppercase",
          letterSpacing: 2,
          color: "#9ca3af",
          marginBottom: 5,
        }}
      >
        Profile
      </div>
      <div style={{ fontSize: 8.5, color: "#374151", lineHeight: 1.8, marginBottom: 14 }}>{cv.summary}</div>
      <div style={{ height: "0.5px", background: "#e5e7eb", margin: "10px 0" }} />
      <div
        style={{
          fontSize: 7,
          fontWeight: 900,
          textTransform: "uppercase",
          letterSpacing: 2,
          color: "#9ca3af",
          marginBottom: 6,
        }}
      >
        Experience
      </div>
      {cv.experiences.map((exp, i) => (
        <div key={i} style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 800, fontSize: 9 }}>{exp.title}</span>
            <span style={{ fontSize: 7.5, color: "#6b7280" }}>
              {exp.from} – {exp.to}
            </span>
          </div>
          <div style={{ fontSize: 8, color: "#6b7280", marginBottom: 2 }}>
            {exp.company} · {exp.location}
          </div>
          {exp.bullets.split("\n").map(
            (b, j) =>
              b && (
                <div key={j} style={{ fontSize: 8, color: "#4b5563", lineHeight: 1.7 }}>
                  {b}
                </div>
              ),
          )}
        </div>
      ))}
      <div style={{ height: "0.5px", background: "#e5e7eb", margin: "10px 0" }} />
      <div
        style={{
          fontSize: 7,
          fontWeight: 900,
          textTransform: "uppercase",
          letterSpacing: 2,
          color: "#9ca3af",
          marginBottom: 6,
        }}
      >
        Education
      </div>
      {cv.educations.map((edu, i) => (
        <div key={i} style={{ marginBottom: 5 }}>
          <span style={{ fontWeight: 800, fontSize: 8.5 }}>{edu.degree}</span>
          <span style={{ fontSize: 8, color: "#6b7280" }}>
            {" "}
            · {edu.school} · {edu.year}
          </span>
        </div>
      ))}
      <div style={{ height: "0.5px", background: "#e5e7eb", margin: "10px 0" }} />
      <div
        style={{
          fontSize: 7,
          fontWeight: 900,
          textTransform: "uppercase",
          letterSpacing: 2,
          color: "#9ca3af",
          marginBottom: 5,
        }}
      >
        Skills
      </div>
      <div style={{ fontSize: 8, color: "#374151" }}>{cv.skills}</div>
      {cv.languages && (
        <>
          <div style={{ height: "0.5px", background: "#e5e7eb", margin: "10px 0" }} />
          <div
            style={{
              fontSize: 7,
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: 2,
              color: "#9ca3af",
              marginBottom: 4,
            }}
          >
            Languages
          </div>
          <div style={{ fontSize: 8, color: "#374151" }}>{cv.languages}</div>
        </>
      )}
    </div>
  );
}

function PreviewCreative({ cv, accent = "#7c3aed" }: { cv: CVData; accent?: string }) {
  return (
    <div style={{ background: "#fff", fontFamily: "Arial, sans-serif", fontSize: 8, minHeight: 700 }}>
      <div style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)`, padding: "20px 24px" }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", letterSpacing: -0.5 }}>{cv.name}</div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.85)", marginTop: 3, letterSpacing: 1 }}>{cv.title}</div>
        <div style={{ fontSize: 7.5, color: "rgba(255,255,255,0.65)", marginTop: 6 }}>
          {cv.email} · {cv.phone} · {cv.location}
        </div>
      </div>
      <div style={{ height: 4, background: `linear-gradient(90deg, ${accent}, #ec4899, #f59e0b)` }} />
      <div style={{ padding: "14px 20px" }}>
        <div
          style={{
            fontSize: 8,
            fontWeight: 800,
            color: accent,
            textTransform: "uppercase",
            letterSpacing: 1.5,
            marginBottom: 5,
          }}
        >
          About Me
        </div>
        <div style={{ fontSize: 8.5, color: "#374151", lineHeight: 1.8, marginBottom: 12 }}>{cv.summary}</div>
        <div
          style={{
            fontSize: 8,
            fontWeight: 800,
            color: accent,
            textTransform: "uppercase",
            letterSpacing: 1.5,
            borderBottom: `2px solid ${accent}`,
            paddingBottom: 3,
            marginBottom: 8,
          }}
        >
          Experience
        </div>
        {cv.experiences.map((exp, i) => (
          <div key={i} style={{ marginBottom: 10, paddingLeft: 10, borderLeft: `3px solid ${accent}` }}>
            <div style={{ fontWeight: 800, fontSize: 9.5, color: "#0f172a" }}>{exp.title}</div>
            <div style={{ fontSize: 8, color: accent, fontWeight: 600 }}>
              {exp.company} · {exp.from} – {exp.to}
            </div>
            <div style={{ fontSize: 7.5, color: "#6b7280", marginBottom: 2 }}>{exp.location}</div>
            {exp.bullets.split("\n").map(
              (b, j) =>
                b && (
                  <div key={j} style={{ fontSize: 8, color: "#475569", lineHeight: 1.6 }}>
                    {b}
                  </div>
                ),
            )}
          </div>
        ))}
        <div
          style={{
            fontSize: 8,
            fontWeight: 800,
            color: accent,
            textTransform: "uppercase",
            letterSpacing: 1.5,
            borderBottom: `2px solid ${accent}`,
            paddingBottom: 3,
            margin: "10px 0 8px",
          }}
        >
          Education
        </div>
        {cv.educations.map((edu, i) => (
          <div key={i} style={{ marginBottom: 5 }}>
            <span style={{ fontWeight: 800, fontSize: 8.5, color: "#0f172a" }}>{edu.degree}</span>
            <span style={{ fontSize: 8, color: "#64748b" }}>
              {" "}
              · {edu.school} · {edu.year}
            </span>
          </div>
        ))}
        <div
          style={{
            fontSize: 8,
            fontWeight: 800,
            color: accent,
            textTransform: "uppercase",
            letterSpacing: 1.5,
            margin: "10px 0 6px",
          }}
        >
          Skills
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {cv.skills.split(",").map((s) => (
            <span
              key={s}
              style={{
                fontSize: 7.5,
                background: `${accent}18`,
                color: accent,
                padding: "3px 8px",
                borderRadius: 20,
                border: `1px solid ${accent}50`,
                fontWeight: 600,
              }}
            >
              {s.trim()}
            </span>
          ))}
        </div>
        {cv.languages && (
          <>
            <div
              style={{
                fontSize: 8,
                fontWeight: 800,
                color: accent,
                textTransform: "uppercase",
                letterSpacing: 1.5,
                margin: "10px 0 4px",
              }}
            >
              Languages
            </div>
            <div style={{ fontSize: 8, color: "#475569" }}>{cv.languages}</div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── ATS PREVIEWS ─────────────────────────────────────────────────────────────
function PreviewATSPro({ cv }: { cv: CVData }) {
  const acc = "#1e40af";
  const SH = ({ label }: { label: string }) => (
    <div style={{ display: "flex", alignItems: "center", margin: "10px 0 5px" }}>
      <span
        style={{
          background: acc,
          color: "#fff",
          fontSize: 6.5,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: 1.2,
          padding: "2px 9px",
          borderRadius: 2,
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <div style={{ flex: 1, height: 0.5, background: "#e2e8f0", marginLeft: 7 }} />
    </div>
  );
  return (
    <div
      style={{
        background: "#fff",
        fontFamily: "Arial, sans-serif",
        fontSize: 8,
        padding: "22px 26px",
        color: "#111",
        minHeight: 700,
        borderLeft: `5px solid ${acc}`,
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <div
          style={{
            fontSize: 19,
            fontWeight: 900,
            color: "#0f172a",
            letterSpacing: 2,
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          {cv.name}
        </div>
        <div
          style={{
            fontSize: 8.5,
            color: acc,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
            marginTop: 4,
          }}
        >
          {cv.title}
        </div>
        <div style={{ fontSize: 7, color: "#94a3b8", marginTop: 5 }}>
          {cv.email} · {cv.phone} · {cv.location} · {cv.linkedin}
        </div>
      </div>
      <div style={{ height: 1.5, background: acc, marginBottom: 2 }} />
      <SH label="Professional Summary" />
      <div style={{ fontSize: 7.5, color: "#475569", lineHeight: 1.7 }}>{cv.summary}</div>
      <SH label="Work Experience" />
      {cv.experiences.map((exp, i) => (
        <div key={i} style={{ marginBottom: 9 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontWeight: 700, fontSize: 8.5, color: "#0f172a" }}>
              {exp.title} — {exp.company}
            </span>
            <span style={{ fontSize: 7, color: "#94a3b8", flexShrink: 0, marginLeft: 8 }}>
              {exp.from} – {exp.to}
            </span>
          </div>
          <div style={{ fontSize: 7, color: "#94a3b8", marginBottom: 2 }}>{exp.location}</div>
          {exp.bullets.split("\n").map((b, j) =>
            b ? (
              <div
                key={j}
                style={{ fontSize: 7.5, color: "#475569", lineHeight: 1.65, paddingLeft: 11, position: "relative" }}
              >
                <span style={{ position: "absolute", left: 0, color: acc, fontSize: 8, lineHeight: 1.5 }}>▸</span>
                {b.replace(/^·\s*/, "")}
              </div>
            ) : null,
          )}
        </div>
      ))}
      <SH label="Education" />
      {cv.educations.map((edu, i) => (
        <div key={i} style={{ marginBottom: 4 }}>
          <span style={{ fontWeight: 700, fontSize: 8.5, color: "#0f172a" }}>{edu.degree}</span>
          <span style={{ fontSize: 7.5, color: "#64748b" }}>
            {" "}
            — {edu.school} · {edu.year}
            {edu.grade ? ` · ${edu.grade}` : ""}
          </span>
        </div>
      ))}
      <SH label="Core Skills" />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginBottom: 6 }}>
        {cv.skills.split(",").map((s) => (
          <span
            key={s}
            style={{
              fontSize: 7,
              background: "#eff6ff",
              color: acc,
              border: "1px solid #bfdbfe",
              borderRadius: 2,
              padding: "1.5px 6px",
              fontWeight: 600,
            }}
          >
            {s.trim()}
          </span>
        ))}
      </div>
      {cv.certifications && (
        <>
          <SH label="Certifications" />
          <div style={{ fontSize: 7.5, color: "#475569" }}>{cv.certifications}</div>
        </>
      )}
      {cv.languages && (
        <>
          <SH label="Languages" />
          <div style={{ fontSize: 7.5, color: "#475569" }}>{cv.languages}</div>
        </>
      )}
    </div>
  );
}

function PreviewATSClassic({ cv }: { cv: CVData }) {
  const SH = ({ label }: { label: string }) => (
    <div
      style={{
        fontSize: 8,
        fontWeight: 900,
        color: "#0f172a",
        textTransform: "uppercase",
        letterSpacing: 2,
        borderBottom: "1.5px solid #0f172a",
        paddingBottom: 2,
        margin: "10px 0 5px",
      }}
    >
      {label}
    </div>
  );
  return (
    <div
      style={{
        background: "#fff",
        fontFamily: "Arial, sans-serif",
        fontSize: 8,
        padding: "24px 28px",
        color: "#111",
        minHeight: 700,
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 10 }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: "#0f172a", letterSpacing: -0.3, lineHeight: 1 }}>
          {cv.name}
        </div>
        <div style={{ fontSize: 8, color: "#475569", letterSpacing: 2, textTransform: "uppercase", marginTop: 4 }}>
          {cv.title}
        </div>
        <div style={{ height: 1, background: "#e2e8f0", margin: "6px auto", width: "60%" }} />
        <div style={{ fontSize: 7.5, color: "#94a3b8" }}>
          {cv.email} · {cv.phone} · {cv.location}
        </div>
      </div>
      <SH label="Experience" />
      {cv.experiences.map((exp, i) => (
        <div key={i} style={{ marginBottom: 9 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontWeight: 700, fontSize: 9, color: "#0f172a" }}>{exp.title}</span>
            <span style={{ fontSize: 7.5, color: "#6b7280", flexShrink: 0, marginLeft: 8 }}>
              {exp.from} – {exp.to}
            </span>
          </div>
          <div style={{ fontSize: 7.5, color: "#64748b", marginBottom: 2 }}>
            {exp.company} · {exp.location}
          </div>
          {exp.bullets.split("\n").map((b, j) =>
            b ? (
              <div
                key={j}
                style={{ fontSize: 7.5, color: "#475569", lineHeight: 1.65, paddingLeft: 10, position: "relative" }}
              >
                <span style={{ position: "absolute", left: 0, color: "#94a3b8" }}>–</span>
                {b.replace(/^·\s*/, "")}
              </div>
            ) : null,
          )}
        </div>
      ))}
      <SH label="Education" />
      {cv.educations.map((edu, i) => (
        <div key={i} style={{ marginBottom: 5 }}>
          <span style={{ fontWeight: 700, fontSize: 9, color: "#0f172a" }}>{edu.degree}</span>
          <span style={{ fontSize: 7.5, color: "#475569" }}>
            {" "}
            · {edu.school} · {edu.year}
            {edu.grade ? ` · ${edu.grade}` : ""}
          </span>
        </div>
      ))}
      <SH label="Skills" />
      <div style={{ fontSize: 7.5, color: "#475569", marginBottom: 6 }}>{cv.skills}</div>
      {cv.certifications && (
        <>
          <SH label="Certifications" />
          <div style={{ fontSize: 7.5, color: "#475569", marginBottom: 6 }}>{cv.certifications}</div>
        </>
      )}
      {cv.languages && (
        <>
          <SH label="Languages" />
          <div style={{ fontSize: 7.5, color: "#475569" }}>{cv.languages}</div>
        </>
      )}
    </div>
  );
}

function PreviewATSModern({ cv }: { cv: CVData }) {
  const acc = "#1e40af";
  const SH = ({ label }: { label: string }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 5, margin: "10px 0 5px" }}>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: acc, flexShrink: 0 }} />
      <span style={{ fontSize: 7.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, color: "#0f172a" }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 0.5, background: "#e2e8f0" }} />
    </div>
  );
  return (
    <div style={{ background: "#fafafa", fontFamily: "Arial, sans-serif", fontSize: 8, minHeight: 700 }}>
      <div style={{ background: "#1e293b", padding: "16px 20px" }}>
        <div style={{ fontSize: 17, fontWeight: 900, color: "#f8fafc", letterSpacing: 0.5 }}>{cv.name}</div>
        <div style={{ fontSize: 7.5, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1.5, marginTop: 3 }}>
          {cv.title}
        </div>
      </div>
      <div
        style={{
          background: "#f1f5f9",
          padding: "5px 20px",
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <span style={{ fontSize: 7, color: "#64748b" }}>{cv.email}</span>
        <span style={{ fontSize: 7, color: "#cbd5e1" }}>·</span>
        <span style={{ fontSize: 7, color: "#64748b" }}>{cv.phone}</span>
        <span style={{ fontSize: 7, color: "#cbd5e1" }}>·</span>
        <span style={{ fontSize: 7, color: "#64748b" }}>{cv.location}</span>
      </div>
      <div style={{ padding: "8px 20px 14px" }}>
        <SH label="Summary" />
        <div style={{ fontSize: 7.5, color: "#475569", lineHeight: 1.7 }}>{cv.summary}</div>
        <SH label="Experience" />
        {cv.experiences.map((exp, i) => (
          <div key={i} style={{ marginBottom: 9 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontWeight: 700, fontSize: 8.5, color: "#0f172a" }}>{exp.title}</span>
              <span style={{ fontSize: 7, color: "#94a3b8", flexShrink: 0, marginLeft: 8 }}>
                {exp.from} – {exp.to}
              </span>
            </div>
            <div style={{ fontSize: 7.5, color: "#64748b", marginBottom: 2 }}>
              {exp.company} · {exp.location}
            </div>
            {exp.bullets.split("\n").map((b, j) =>
              b ? (
                <div
                  key={j}
                  style={{ fontSize: 7.5, color: "#475569", lineHeight: 1.65, paddingLeft: 12, position: "relative" }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: 2,
                      top: 4.5,
                      width: 3,
                      height: 3,
                      borderRadius: "50%",
                      background: acc,
                      display: "inline-block",
                    }}
                  />
                  {b.replace(/^·\s*/, "")}
                </div>
              ) : null,
            )}
          </div>
        ))}
        <SH label="Education" />
        {cv.educations.map((edu, i) => (
          <div key={i} style={{ marginBottom: 4 }}>
            <span style={{ fontWeight: 700, fontSize: 8.5, color: "#0f172a" }}>{edu.degree}</span>
            <span style={{ fontSize: 7.5, color: "#64748b" }}>
              {" "}
              — {edu.school} · {edu.year}
            </span>
          </div>
        ))}
        <SH label="Skills" />
        <div style={{ fontSize: 7.5, color: "#475569", marginBottom: 4 }}>{cv.skills}</div>
        {cv.certifications && (
          <>
            <SH label="Certifications" />
            <div style={{ fontSize: 7.5, color: "#475569", marginBottom: 4 }}>{cv.certifications}</div>
          </>
        )}
        {cv.languages && (
          <>
            <SH label="Languages" />
            <div style={{ fontSize: 7.5, color: "#475569" }}>{cv.languages}</div>
          </>
        )}
      </div>
    </div>
  );
}

function PreviewATSExecutive({ cv }: { cv: CVData }) {
  const SH = ({ label }: { label: string }) => (
    <div
      style={{
        fontSize: 7,
        fontWeight: 900,
        textTransform: "uppercase",
        letterSpacing: 3,
        color: "#94a3b8",
        margin: "12px 0 5px",
      }}
    >
      {label}
    </div>
  );
  return (
    <div
      style={{
        background: "#fff",
        fontFamily: "Arial, sans-serif",
        fontSize: 8,
        padding: "26px 28px",
        color: "#111",
        minHeight: 700,
      }}
    >
      <div style={{ marginBottom: 8 }}>
        <div
          style={{
            fontSize: 20,
            fontWeight: 900,
            color: "#0f172a",
            letterSpacing: -0.5,
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          {cv.name}
        </div>
        <div style={{ fontSize: 7.5, color: "#64748b", letterSpacing: 3, textTransform: "uppercase", marginTop: 5 }}>
          {cv.title}
        </div>
        <div
          style={{
            height: 1,
            background: "linear-gradient(90deg,#0f172a 40%,transparent)",
            marginTop: 6,
            marginBottom: 5,
          }}
        />
        <div style={{ fontSize: 7.5, color: "#94a3b8", display: "flex", gap: 10, flexWrap: "wrap" }}>
          <span>{cv.email}</span>
          <span>{cv.phone}</span>
          <span>{cv.location}</span>
        </div>
      </div>
      <SH label="Professional Summary" />
      <div
        style={{ fontSize: 7.5, color: "#475569", lineHeight: 1.8, borderLeft: "2px solid #e2e8f0", paddingLeft: 8 }}
      >
        {cv.summary}
      </div>
      <SH label="Experience" />
      {cv.experiences.map((exp, i) => (
        <div key={i} style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontWeight: 900, fontSize: 9, color: "#0f172a" }}>{exp.title}</span>
            <span style={{ fontSize: 7.5, color: "#94a3b8", flexShrink: 0, marginLeft: 8 }}>
              {exp.from} – {exp.to}
            </span>
          </div>
          <div style={{ fontSize: 7.5, color: "#475569", fontStyle: "italic", marginBottom: 2 }}>{exp.company}</div>
          {exp.bullets.split("\n").map((b, j) =>
            b ? (
              <div
                key={j}
                style={{ fontSize: 7.5, color: "#475569", lineHeight: 1.7, paddingLeft: 8, position: "relative" }}
              >
                <span style={{ position: "absolute", left: 0, color: "#0f172a", fontSize: 10, lineHeight: 1.3 }}>
                  ·
                </span>
                {b.replace(/^·\s*/, "")}
              </div>
            ) : null,
          )}
        </div>
      ))}
      <SH label="Education" />
      {cv.educations.map((edu, i) => (
        <div key={i} style={{ marginBottom: 4 }}>
          <span style={{ fontWeight: 900, fontSize: 9, color: "#0f172a" }}>{edu.degree}</span>
          <span style={{ fontSize: 7.5, color: "#64748b" }}>
            {" "}
            · {edu.school} · {edu.year}
          </span>
        </div>
      ))}
      <SH label="Skills" />
      <div style={{ fontSize: 7.5, color: "#475569", letterSpacing: 0.3, marginBottom: 4 }}>{cv.skills}</div>
      {cv.certifications && (
        <>
          <SH label="Certifications" />
          <div style={{ fontSize: 7.5, color: "#475569", marginBottom: 4 }}>{cv.certifications}</div>
        </>
      )}
      {cv.languages && (
        <>
          <SH label="Languages" />
          <div style={{ fontSize: 7.5, color: "#475569" }}>{cv.languages}</div>
        </>
      )}
    </div>
  );
}

// ─── MASTER PREVIEW ROUTER ────────────────────────────────────────────────────
function getPreview(templateId: string, cv: CVData, accent: string): JSX.Element {
  const id = templateId ?? "classic";
  if (id === "ats-pro" || id === "ats-stealth") return <PreviewATSPro cv={cv} />;
  if (id === "ats-classic") return <PreviewATSClassic cv={cv} />;
  if (id === "ats-modern" || id === "ats-banner" || id === "ats-banner-cobalt") return <PreviewATSModern cv={cv} />;
  if (id === "ats-executive") return <PreviewATSExecutive cv={cv} />;
  if (id === "minimal" || id === "minimalist-pro" || id === "minimalist-architect" || id === "swiss-minimalist")
    return <PreviewMinimalist cv={cv} />;
  if (id.startsWith("executive")) return <PreviewExecutive cv={cv} accentColor={accent} headerBg="#0f172a" />;
  if (id === "sidebar" || id === "two-column-creative" || id === "two-column-slate" || id === "international-eu")
    return <PreviewSidebar cv={cv} accent={accent} />;
  if (id.startsWith("two-column")) return <PreviewTwoColumn cv={cv} accent={accent} />;
  if (id.startsWith("picture")) return <PreviewPhoto cv={cv} accent={accent} />;
  if (id.startsWith("creative") || id === "creative-vibrant") return <PreviewCreative cv={cv} accent={accent} />;
  return <PreviewTraditional cv={cv} />;
}

// ─── TEMPLATE PRICING ─────────────────────────────────────────────────────────
function getTemplatePrice(templateId: string): { label: string; amount: number } {
  if (templateId.startsWith("ats")) return { label: "KES 1,490", amount: 1490 };
  if (templateId.startsWith("executive")) return { label: "KES 2,500", amount: 2500 };
  if (templateId.startsWith("minimal")) return { label: "KES 1,300", amount: 1300 };
  if (templateId === "sidebar" || templateId.startsWith("two-column-creative"))
    return { label: "KES 1,200", amount: 1200 };
  if (templateId === "modern" || templateId.startsWith("modern")) return { label: "KES 1,200", amount: 1200 };
  if (templateId === "traditional") return { label: "KES 1,400", amount: 1400 };
  if (templateId === "classic" || templateId === "clean" || templateId === "basic")
    return { label: "KES 1,400", amount: 1400 };
  if (templateId === "creative" || templateId.startsWith("creative")) return { label: "KES 1,300", amount: 1300 };
  if (templateId.startsWith("picture")) return { label: "KES 1,400", amount: 1400 };
  return { label: "KES 1,400", amount: 1400 };
}

// ─── BLUR OVERLAY ─────────────────────────────────────────────────────────────
const BlurOverlay = () => (
  <div
    style={{
      position: "sticky",
      bottom: 0,
      left: 0,
      right: 0,
      height: "45%",
      background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.75))",
      backdropFilter: "blur(4px)",
      WebkitBackdropFilter: "blur(4px)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      pointerEvents: "none",
    }}
  >
    <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>🔒 Download to see full CV</div>
    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>Professional format · PDF & DOCX</div>
  </div>
);

// ─── MAIN EDITOR ──────────────────────────────────────────────────────────────
export default function CVEditorPage() {
  const { templateId } = useParams<{ templateId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const previewRef = useRef<HTMLDivElement>(null);

  const accentFromUrl = searchParams.get("color") ?? "";
  const fallbackAccent = TEMPLATES.find((t) => t.id === templateId)?.colors[0] ?? "#c9a84c";
  const accent = accentFromUrl || fallbackAccent;

  // ── Load parsed CV from sessionStorage if available ──
  const [cv, setCv] = useState<CVData>(() => {
    const saved = sessionStorage.getItem("parsedCVProfile");
    if (saved) {
      const p = JSON.parse(saved);
      return {
        name: p.name ?? "",
        title: p.title ?? "",
        email: p.email ?? "",
        phone: p.phone ?? "",
        location: p.location ?? "",
        linkedin: p.linkedin ?? "",
        summary: p.careerSummary ?? "",
        experiences: p.experience
          ? [
              {
                title: "",
                company: p.experience,
                location: p.location ?? "",
                from: "",
                to: "Present",
                bullets: p.experience,
              },
            ]
          : buildCVFromTemplate(templateId ?? "classic").experiences,
        educations: p.education
          ? [{ degree: p.education, school: "", year: "", grade: "" }]
          : buildCVFromTemplate(templateId ?? "classic").educations,
        skills: p.skills ?? "",
        languages: p.languages ?? "",
        certifications: p.certifications ?? "",
      };
    }
    return buildCVFromTemplate(templateId ?? "classic");
  });

  useEffect(() => {
    const saved = sessionStorage.getItem("parsedCVProfile");
    if (!saved) setCv(buildCVFromTemplate(templateId ?? "classic"));
  }, [templateId]);

  // ── Payment state ──
  const [showMpesa, setShowMpesa] = useState(false);
  const [hasPaid, setHasPaid] = useState(() => sessionStorage.getItem("cvedge_payment_verified") === "true");
  const [isGenerating, setIsGenerating] = useState(false);
  const templatePrice = getTemplatePrice(templateId ?? "classic");

  // ── PDF download using html2canvas + jsPDF ──
  const handleDownload = async () => {
    if (!previewRef.current) return;
    setIsGenerating(true);
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      const fileName = `${cv.name.replace(/\s+/g, "_") || "CV"}_${templateId ?? "cv"}.pdf`;
      pdf.save(fileName);
      // Clear payment token after single use download
      sessionStorage.removeItem("cvedge_payment_verified");
      sessionStorage.removeItem("cvedge_payment_token");
      setHasPaid(false);
    } catch (err) {
      console.error("PDF generation error:", err);
      alert("Could not generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // ── Called by MpesaPaymentModal after real payment confirmed ──
  const onPaymentSuccess = async () => {
  setHasPaid(true);

  // Write to follow-up queue (skipped — table not yet created)
  try {
    console.log("Payment success for:", cv.name);
  } catch (err) {
    console.error("Follow-up queue error:", err);
    // Silently fail — never block the download
  }

  setTimeout(() => handleDownload(), 800);
};

  const update = (field: keyof CVData, value: string) => setCv((prev) => ({ ...prev, [field]: value }));
  const updateExp = (i: number, field: keyof Experience, value: string) => {
    const exps = [...cv.experiences];
    exps[i] = { ...exps[i], [field]: value };
    setCv((prev) => ({ ...prev, experiences: exps }));
  };
  const addExp = () =>
    setCv((prev) => ({
      ...prev,
      experiences: [...prev.experiences, { title: "", company: "", location: "", from: "", to: "", bullets: "" }],
    }));
  const removeExp = (i: number) =>
    setCv((prev) => ({ ...prev, experiences: prev.experiences.filter((_, idx) => idx !== i) }));
  const updateEdu = (i: number, field: keyof Education, value: string) => {
    const edus = [...cv.educations];
    edus[i] = { ...edus[i], [field]: value };
    setCv((prev) => ({ ...prev, educations: edus }));
  };
  const addEdu = () =>
    setCv((prev) => ({ ...prev, educations: [...prev.educations, { degree: "", school: "", year: "", grade: "" }] }));
  const removeEdu = (i: number) =>
    setCv((prev) => ({ ...prev, educations: cv.educations.filter((_, idx) => idx !== i) }));

  const templateLabel = templateId ? templateId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Classic";
  const preview = getPreview(templateId ?? "classic", cv, accent);

  return (
    <>
      <MpesaPaymentModal
        open={showMpesa}
        onClose={() => setShowMpesa(false)}
        defaultPackage="starter"
        onPaymentSuccess={onPaymentSuccess}
      />
      <div className="cv-editor-root">
        <div className="container max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate("/cv-builder")}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back to templates
            </button>
            <h1 className="text-xl font-bold">{templateLabel} Template Editor</h1>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* ── Left: form ── */}
            <div className="space-y-6 max-h-[85vh] overflow-y-auto pr-2">
              <div className="rounded-xl border border-border bg-card p-5">
                <h2 className="font-bold text-base mb-4">Personal Details</h2>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <Input placeholder="Full Name" value={cv.name} onChange={(e) => update("name", e.target.value)} />
                  </div>
                  <div className="col-span-2">
                    <Input
                      placeholder="Professional Title"
                      value={cv.title}
                      onChange={(e) => update("title", e.target.value)}
                    />
                  </div>
                  <Input placeholder="Email" value={cv.email} onChange={(e) => update("email", e.target.value)} />
                  <Input placeholder="Phone" value={cv.phone} onChange={(e) => update("phone", e.target.value)} />
                  <Input
                    placeholder="Location"
                    value={cv.location}
                    onChange={(e) => update("location", e.target.value)}
                  />
                  <Input
                    placeholder="LinkedIn URL"
                    value={cv.linkedin}
                    onChange={(e) => update("linkedin", e.target.value)}
                  />
                </div>
              </div>
              <div className="rounded-xl border border-border bg-card p-5">
                <h2 className="font-bold text-base mb-3">Professional Summary</h2>
                <Textarea
                  placeholder="Write your professional summary..."
                  value={cv.summary}
                  onChange={(e) => update("summary", e.target.value)}
                  rows={4}
                />
              </div>
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-base">Work Experience</h2>
                  <button onClick={addExp} className="flex items-center gap-1 text-xs text-primary hover:underline">
                    <Plus className="h-3 w-3" /> Add
                  </button>
                </div>
                <div className="space-y-5">
                  {cv.experiences.map((exp, i) => (
                    <div key={i} className="border border-border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-muted-foreground">Position {i + 1}</span>
                        {cv.experiences.length > 1 && (
                          <button onClick={() => removeExp(i)} className="text-destructive hover:opacity-70">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          placeholder="Job Title"
                          value={exp.title}
                          onChange={(e) => updateExp(i, "title", e.target.value)}
                        />
                        <Input
                          placeholder="Company"
                          value={exp.company}
                          onChange={(e) => updateExp(i, "company", e.target.value)}
                        />
                        <Input
                          placeholder="Location"
                          value={exp.location}
                          onChange={(e) => updateExp(i, "location", e.target.value)}
                        />
                        <div className="grid grid-cols-2 gap-1">
                          <Input
                            placeholder="From"
                            value={exp.from}
                            onChange={(e) => updateExp(i, "from", e.target.value)}
                          />
                          <Input placeholder="To" value={exp.to} onChange={(e) => updateExp(i, "to", e.target.value)} />
                        </div>
                      </div>
                      <Textarea
                        placeholder={"· Achievement one\n· Achievement two\n· Achievement three"}
                        value={exp.bullets}
                        onChange={(e) => updateExp(i, "bullets", e.target.value)}
                        rows={4}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-base">Education</h2>
                  <button onClick={addEdu} className="flex items-center gap-1 text-xs text-primary hover:underline">
                    <Plus className="h-3 w-3" /> Add
                  </button>
                </div>
                <div className="space-y-4">
                  {cv.educations.map((edu, i) => (
                    <div key={i} className="border border-border rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs font-semibold text-muted-foreground">Qualification {i + 1}</span>
                        {cv.educations.length > 1 && (
                          <button onClick={() => removeEdu(i)} className="text-destructive hover:opacity-70">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="col-span-2">
                          <Input
                            placeholder="Degree / Qualification"
                            value={edu.degree}
                            onChange={(e) => updateEdu(i, "degree", e.target.value)}
                          />
                        </div>
                        <Input
                          placeholder="School / University"
                          value={edu.school}
                          onChange={(e) => updateEdu(i, "school", e.target.value)}
                        />
                        <Input
                          placeholder="Year"
                          value={edu.year}
                          onChange={(e) => updateEdu(i, "year", e.target.value)}
                        />
                        <div className="col-span-2">
                          <Input
                            placeholder="Grade / Honours (optional)"
                            value={edu.grade}
                            onChange={(e) => updateEdu(i, "grade", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-border bg-card p-5 space-y-3">
                <h2 className="font-bold text-base mb-1">Additional Information</h2>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Skills (comma separated)</label>
                  <Textarea
                    placeholder="React, Node.js, Leadership..."
                    value={cv.skills}
                    onChange={(e) => update("skills", e.target.value)}
                    rows={2}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Languages</label>
                  <Input
                    placeholder="English (Fluent), Kiswahili (Native)"
                    value={cv.languages}
                    onChange={(e) => update("languages", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Certifications</label>
                  <Input
                    placeholder="CPA-K, AWS Solutions Architect..."
                    value={cv.certifications}
                    onChange={(e) => update("certifications", e.target.value)}
                  />
                </div>
              </div>
              <JobScoreMatch cv={cv} />

              {/* Mobile preview */}
              <div className="lg:hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-muted-foreground">Live Preview</span>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    Updates as you type
                  </span>
                </div>
                <div
                  className="relative rounded-xl border border-border overflow-hidden shadow-lg mb-4"
                  style={{ maxHeight: "60vh", overflowY: "auto" }}
                >
                  {preview}
                  <BlurOverlay />
                </div>
              </div>

              {/* ── DOWNLOAD BUTTON — payment gated ── */}
              <div className="flex gap-3 pb-4">
                <Button
                  onClick={() => {
                    if (hasPaid) {
                      handleDownload();
                    } else {
                      setShowMpesa(true);
                    }
                  }}
                  disabled={isGenerating}
                  className="flex-1 bg-gradient-brand border-0 font-semibold shadow-glow gold-shimmer h-12 text-base"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating PDF...
                    </>
                  ) : hasPaid ? (
                    <>
                      <Download className="mr-2 h-4 w-4" /> Download Your CV
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" /> Download CV — {templatePrice.label}
                    </>
                  )}
                </Button>
              </div>

              {hasPaid && (
                <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 flex items-start gap-3 pb-6">
                  <div className="text-2xl">💼</div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm mb-0.5">
                      Boost your chances — LinkedIn Optimization
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">
                      Gulf and international employers check LinkedIn before interviewing.
                      We rewrite your profile to match your new CV. <strong>KSh 2,000.</strong>
                    </div>
                    <Button
                      size="sm"
                      className="bg-gradient-brand border-0 gold-shimmer font-semibold"
                      onClick={() => {
                        sessionStorage.setItem("linkedin_upsell_from_cv", cv.name);
                        navigate("/linkedin-optimization");
                      }}
                    >
                      Optimize My LinkedIn →
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* ── Desktop sticky preview ── */}
            <div className="hidden lg:block sticky top-24">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-muted-foreground">Live Preview</span>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  Updates as you type
                </span>
              </div>
              <div
                className="relative rounded-xl border border-border overflow-hidden shadow-lg"
                style={{ maxHeight: "80vh", overflowY: "auto" }}
              >
                {/* Hidden full-resolution div used for PDF generation */}
                <div ref={previewRef} style={{ position: "absolute", left: "-9999px", top: 0, width: 794 }}>
                  {getPreview(templateId ?? "classic", cv, accent)}
                </div>
                {preview}
                <BlurOverlay />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
