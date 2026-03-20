import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Download, ArrowLeft } from "lucide-react";
import { TEMPLATES } from "./TemplatesPage"; // adjust path if your file is elsewhere

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

// Build a CVData object from a template's person data
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
    educations: p.education.map((edu) => ({
      degree: edu.degree,
      school: edu.school,
      year: edu.year,
      grade: "",
    })),
    skills: p.skills.join(", "),
    languages: p.languages.join(", "),
    certifications: p.certifications.join(", "),
  };
}

// ─── PREVIEW: TRADITIONAL ────────────────────────────────────────────────────
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

// ─── PREVIEW: SIDEBAR ────────────────────────────────────────────────────────
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

// ─── PREVIEW: EXECUTIVE ──────────────────────────────────────────────────────
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

// ─── PREVIEW: TWO-COLUMN ─────────────────────────────────────────────────────
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

// ─── PREVIEW: PHOTO ──────────────────────────────────────────────────────────
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

// ─── PREVIEW: MINIMALIST ─────────────────────────────────────────────────────
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

// ─── PREVIEW: CREATIVE ───────────────────────────────────────────────────────
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

// ─── PREVIEW: ATS ────────────────────────────────────────────────────────────
function PreviewATS({ cv, accent = "#1e40af" }: { cv: CVData; accent?: string }) {
  return (
    <div
      style={{
        background: "#fff",
        fontFamily: "Arial, sans-serif",
        fontSize: 8,
        padding: "24px 28px",
        color: "#111",
        minHeight: 700,
        borderLeft: `5px solid ${accent}`,
      }}
    >
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 18, fontWeight: "bold", color: "#000" }}>{cv.name}</div>
        <div style={{ fontSize: 9, color: accent, fontWeight: "bold", marginTop: 2 }}>{cv.title}</div>
        <div style={{ fontSize: 8, color: "#444", marginTop: 4 }}>
          {cv.email} · {cv.phone} · {cv.location} · {cv.linkedin}
        </div>
      </div>
      <div style={{ height: 1.5, background: accent, marginBottom: 10 }} />
      <div
        style={{
          fontSize: 8,
          fontWeight: "bold",
          textTransform: "uppercase",
          letterSpacing: 1,
          color: accent,
          marginBottom: 4,
        }}
      >
        Professional Summary
      </div>
      <div style={{ fontSize: 8, color: "#333", lineHeight: 1.7, marginBottom: 10 }}>{cv.summary}</div>
      <div style={{ height: 0.5, background: "#ccc", marginBottom: 8 }} />
      <div
        style={{
          fontSize: 8,
          fontWeight: "bold",
          textTransform: "uppercase",
          letterSpacing: 1,
          color: accent,
          marginBottom: 6,
        }}
      >
        Work Experience
      </div>
      {cv.experiences.map((exp, i) => (
        <div key={i} style={{ marginBottom: 9 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontWeight: "bold", fontSize: 9 }}>
              {exp.title} | {exp.company}
            </span>
            <span style={{ fontSize: 7.5, color: "#555" }}>
              {exp.from} – {exp.to}
            </span>
          </div>
          <div style={{ fontSize: 7.5, color: "#777", marginBottom: 2 }}>{exp.location}</div>
          {exp.bullets.split("\n").map(
            (b, j) =>
              b && (
                <div key={j} style={{ fontSize: 8, color: "#333", lineHeight: 1.6 }}>
                  {b}
                </div>
              ),
          )}
        </div>
      ))}
      <div style={{ height: 0.5, background: "#ccc", marginBottom: 8 }} />
      <div
        style={{
          fontSize: 8,
          fontWeight: "bold",
          textTransform: "uppercase",
          letterSpacing: 1,
          color: accent,
          marginBottom: 6,
        }}
      >
        Education
      </div>
      {cv.educations.map((edu, i) => (
        <div key={i} style={{ marginBottom: 5 }}>
          <span style={{ fontWeight: "bold", fontSize: 8.5 }}>{edu.degree}</span>
          <span style={{ fontSize: 8, color: "#555" }}>
            {" "}
            | {edu.school} | {edu.year}
            {edu.grade ? ` | ${edu.grade}` : ""}
          </span>
        </div>
      ))}
      <div style={{ height: 0.5, background: "#ccc", marginBottom: 8 }} />
      <div
        style={{
          fontSize: 8,
          fontWeight: "bold",
          textTransform: "uppercase",
          letterSpacing: 1,
          color: accent,
          marginBottom: 4,
        }}
      >
        Skills
      </div>
      <div style={{ fontSize: 8, color: "#333", marginBottom: 8 }}>{cv.skills}</div>
      {cv.certifications && (
        <>
          <div style={{ height: 0.5, background: "#ccc", marginBottom: 8 }} />
          <div
            style={{
              fontSize: 8,
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: 1,
              color: accent,
              marginBottom: 4,
            }}
          >
            Certifications
          </div>
          <div style={{ fontSize: 8, color: "#333", marginBottom: 8 }}>{cv.certifications}</div>
        </>
      )}
      {cv.languages && (
        <>
          <div style={{ height: 0.5, background: "#ccc", marginBottom: 8 }} />
          <div
            style={{
              fontSize: 8,
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: 1,
              color: accent,
              marginBottom: 4,
            }}
          >
            Languages
          </div>
          <div style={{ fontSize: 8, color: "#333" }}>{cv.languages}</div>
        </>
      )}
    </div>
  );
}

// ─── MASTER PREVIEW MAP ──────────────────────────────────────────────────────
const PREVIEWS: Record<string, (cv: CVData) => JSX.Element> = {
  classic: (cv) => <PreviewTraditional cv={cv} />,
  traditional: (cv) => <PreviewTraditional cv={cv} />,
  clean: (cv) => <PreviewTraditional cv={cv} />,
  basic: (cv) => <PreviewTraditional cv={cv} />,
  modern: (cv) => <PreviewTraditional cv={cv} />,
  "modern-dark": (cv) => <PreviewTraditional cv={cv} />,
  "ats-pro": (cv) => <PreviewATS cv={cv} accent="#1e40af" />,
  "ats-classic": (cv) => <PreviewATS cv={cv} accent="#1a2332" />,
  "ats-modern": (cv) => <PreviewATS cv={cv} accent="#1e40af" />,
  "ats-executive": (cv) => <PreviewATS cv={cv} accent="#0f172a" />,
  minimal: (cv) => <PreviewMinimalist cv={cv} />,
  "minimalist-pro": (cv) => <PreviewMinimalist cv={cv} />,
  creative: (cv) => <PreviewCreative cv={cv} accent="#7c3aed" />,
  "creative-bold": (cv) => <PreviewCreative cv={cv} accent="#ec4899" />,
  "creative-minimal": (cv) => <PreviewCreative cv={cv} accent="#6366f1" />,
  "executive-classic": (cv) => <PreviewExecutive cv={cv} accentColor="#c9a84c" headerBg="#0f172a" />,
  "executive-gold": (cv) => <PreviewExecutive cv={cv} accentColor="#c9a84c" headerBg="#0f172a" />,
  "executive-navy": (cv) => <PreviewExecutive cv={cv} accentColor="#93c5fd" headerBg="#1e3a5f" />,
  sidebar: (cv) => <PreviewSidebar cv={cv} accent="#38bdf8" />,
  "two-column-creative": (cv) => <PreviewSidebar cv={cv} accent="#7c3aed" />,
  "two-column": (cv) => <PreviewTwoColumn cv={cv} accent="#2563eb" />,
  "two-column-pro": (cv) => <PreviewTwoColumn cv={cv} accent="#c9a84c" />,
  picture: (cv) => <PreviewPhoto cv={cv} accent="#2563eb" />,
  "picture-classic": (cv) => <PreviewPhoto cv={cv} accent="#2563eb" />,
  "picture-modern": (cv) => <PreviewPhoto cv={cv} accent="#0ea5e9" />,
};

export default function CVEditorPage() {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();

  // Pre-fill the form with the selected template's sample person data
  const [cv, setCv] = useState<CVData>(() => buildCVFromTemplate(templateId ?? "classic"));

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
    setCv((prev) => ({
      ...prev,
      educations: [...prev.educations, { degree: "", school: "", year: "", grade: "" }],
    }));

  const removeEdu = (i: number) =>
    setCv((prev) => ({ ...prev, educations: cv.educations.filter((_, idx) => idx !== i) }));

  const preview = PREVIEWS[templateId ?? "classic"] ?? PREVIEWS["classic"];

  const templateLabel = templateId ? templateId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Classic";

  return (
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
          {/* FORM */}
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

            <div className="flex gap-3">
              <Button className="flex-1 bg-gradient-brand border-0 font-semibold shadow-glow gold-shimmer h-12">
                <Download className="mr-2 h-4 w-4" /> Download CV
              </Button>
            </div>
          </div>

          {/* PREVIEW */}
          <div className="sticky top-24">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-muted-foreground">Live Preview</span>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">Updates as you type</span>
            </div>
            <div
              className="rounded-xl border border-border overflow-hidden shadow-lg"
              style={{ maxHeight: "80vh", overflowY: "auto" }}
            >
              {preview(cv)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
