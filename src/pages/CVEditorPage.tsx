import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Download, ArrowLeft } from "lucide-react";

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
  summary: "Write a 2-3 sentence professional summary that highlights your key strengths, years of experience, and what makes you valuable to employers.",
  experiences: [
    {
      title: "Job Title",
      company: "Company Name",
      location: "Nairobi, Kenya",
      from: "Jan 2021",
      to: "Present",
      bullets: "· Describe your key achievement with measurable results\n· Another key responsibility or accomplishment\n· Third achievement that shows your impact",
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

function PreviewTraditional({ cv }: { cv: CVData }) {
  return (
    <div style={{ background: "#fff", fontFamily: "Times New Roman, serif", fontSize: 8, padding: "28px 32px", color: "#222", minHeight: 700 }}>
      <div style={{ textAlign: "center", marginBottom: 10 }}>
        <div style={{ fontSize: 18, fontWeight: "bold" }}>{cv.name}</div>
        <div style={{ fontSize: 9, color: "#555", marginTop: 2 }}>{cv.title}</div>
        <div style={{ fontSize: 8, color: "#777", marginTop: 3 }}>{cv.email} · {cv.phone} · {cv.location} · {cv.linkedin}</div>
      </div>
      <div style={{ borderTop: "1.5px solid #333", borderBottom: "1.5px solid #333", padding: "2px 0", marginBottom: 10 }} />
      <div style={{ fontSize: 8, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Profile</div>
      <div style={{ fontSize: 8, lineHeight: 1.7, color: "#444", marginBottom: 10 }}>{cv.summary}</div>
      <div style={{ borderTop: "0.5px solid #999", marginBottom: 8 }} />
      <div style={{ fontSize: 8, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Experience</div>
      {cv.experiences.map((exp, i) => (
        <div key={i} style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontWeight: "bold", fontSize: 9 }}>{exp.title} — {exp.company}</div>
            <div style={{ fontSize: 7.5, color: "#666" }}>{exp.from} – {exp.to}</div>
          </div>
          <div style={{ fontSize: 7.5, color: "#888", marginBottom: 2 }}>{exp.location}</div>
          {exp.bullets.split("\n").map((b, j) => b && <div key={j} style={{ fontSize: 8, color: "#444", lineHeight: 1.6 }}>{b}</div>)}
        </div>
      ))}
      <div style={{ borderTop: "0.5px solid #999", margin: "8px 0" }} />
      <div style={{ fontSize: 8, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Education</div>
      {cv.educations.map((edu, i) => (
        <div key={i} style={{ marginBottom: 5 }}>
          <div style={{ fontWeight: "bold", fontSize: 9 }}>{edu.degree}</div>
          <div style={{ fontSize: 8, color: "#555" }}>{edu.school} · {edu.year}{edu.grade ? ` · ${edu.grade}` : ""}</div>
        </div>
      ))}
      <div style={{ borderTop: "0.5px solid #999", margin: "8px 0" }} />
      <div style={{ fontSize: 8, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Skills</div>
      <div style={{ fontSize: 8, color: "#444", marginBottom: 8 }}>{cv.skills}</div>
      {cv.languages && (<><div style={{ borderTop: "0.5px solid #999", margin: "8px 0" }} /><div style={{ fontSize: 8, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Languages</div><div style={{ fontSize: 8, color: "#444" }}>{cv.languages}</div></>)}
    </div>
  );
}

function PreviewSidebar({ cv }: { cv: CVData }) {
  return (
    <div style={{ background: "#fff", fontFamily: "Arial, sans-serif", fontSize: 8, display: "flex", minHeight: 700 }}>
      <div style={{ width: 180, background: "#1e293b", padding: "24px 14px", flexShrink: 0 }}>
        <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#38bdf8", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 20, fontWeight: "bold" }}>
          {cv.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
        </div>
        <div style={{ color: "#f1f5f9", fontSize: 11, fontWeight: "bold", textAlign: "center", marginBottom: 14 }}>{cv.name}</div>
        <div style={{ fontSize: 7, color: "#90cdf4", fontWeight: "bold", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Contact</div>
        <div style={{ fontSize: 7.5, color: "#cbd5e1", lineHeight: 1.8 }}>{cv.email}</div>
        <div style={{ fontSize: 7.5, color: "#cbd5e1", lineHeight: 1.8 }}>{cv.phone}</div>
        <div style={{ fontSize: 7.5, color: "#cbd5e1", lineHeight: 1.8 }}>{cv.location}</div>
        <div style={{ fontSize: 7.5, color: "#90cdf4", lineHeight: 1.8 }}>{cv.linkedin}</div>
        <div style={{ height: 0.5, background: "#334155", margin: "10px 0" }} />
        <div style={{ fontSize: 7, color: "#90cdf4", fontWeight: "bold", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Skills</div>
        {cv.skills.split(",").map(s => (<div key={s} style={{ fontSize: 7.5, color: "#cbd5e1", lineHeight: 1.7 }}>· {s.trim()}</div>))}
        {cv.languages && (<><div style={{ height: 0.5, background: "#334155", margin: "10px 0" }} /><div style={{ fontSize: 7, color: "#90cdf4", fontWeight: "bold", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Languages</div><div style={{ fontSize: 7.5, color: "#cbd5e1" }}>{cv.languages}</div></>)}
        {cv.certifications && (<><div style={{ height: 0.5, background: "#334155", margin: "10px 0" }} /><div style={{ fontSize: 7, color: "#90cdf4", fontWeight: "bold", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Certifications</div><div style={{ fontSize: 7.5, color: "#cbd5e1" }}>{cv.certifications}</div></>)}
        <div style={{ height: 0.5, background: "#334155", margin: "10px 0" }} />
        <div style={{ fontSize: 7, color: "#90cdf4", fontWeight: "bold", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Education</div>
        {cv.educations.map((edu, i) => (<div key={i} style={{ marginBottom: 6 }}><div style={{ fontSize: 7.5, color: "#e2e8f0", fontWeight: "bold" }}>{edu.degree}</div><div style={{ fontSize: 7, color: "#94a3b8" }}>{edu.school}</div><div style={{ fontSize: 7, color: "#94a3b8" }}>{edu.year}{edu.grade ? ` · ${edu.grade}` : ""}</div></div>))}
      </div>
      <div style={{ flex: 1, padding: "24px 20px" }}>
        <div style={{ fontSize: 18, fontWeight: "bold", color: "#0f172a" }}>{cv.name}</div>
        <div style={{ fontSize: 9, color: "#38bdf8", marginBottom: 14 }}>{cv.title}</div>
        <div style={{ fontSize: 7, fontWeight: "bold", color: "#1e293b", textTransform: "uppercase", letterSpacing: 1, borderBottom: "1px solid #e2e8f0", paddingBottom: 2, marginBottom: 6 }}>Professional Summary</div>
        <div style={{ fontSize: 8, color: "#475569", lineHeight: 1.7, marginBottom: 12 }}>{cv.summary}</div>
        <div style={{ fontSize: 7, fontWeight: "bold", color: "#1e293b", textTransform: "uppercase", letterSpacing: 1, borderBottom: "1px solid #e2e8f0", paddingBottom: 2, marginBottom: 6 }}>Experience</div>
        {cv.experiences.map((exp, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: "bold", fontSize: 8.5, color: "#0f172a" }}>{exp.title}</span>
              <span style={{ fontSize: 7.5, color: "#38bdf8" }}>{exp.from} – {exp.to}</span>
            </div>
            <div style={{ fontSize: 7.5, color: "#64748b", marginBottom: 2 }}>{exp.company} · {exp.location}</div>
            {exp.bullets.split("\n").map((b, j) => b && <div key={j} style={{ fontSize: 8, color: "#475569", lineHeight: 1.6 }}>{b}</div>)}
          </div>
        ))}
      </div>
    </div>
  );
}

function PreviewExecutive({ cv }: { cv: CVData }) {
  return (
    <div style={{ background: "#fff", fontFamily: "Georgia, serif", fontSize: 8, minHeight: 700 }}>
      <div style={{ background: "#0f172a", padding: "20px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: "bold", color: "#f8fafc", letterSpacing: 1 }}>{cv.name.toUpperCase()}</div>
            <div style={{ fontSize: 9, color: "#c9a84c", marginTop: 3, letterSpacing: 2 }}>{cv.title.toUpperCase()}</div>
            <div style={{ fontSize: 7.5, color: "#94a3b8", marginTop: 5 }}>{cv.email} · {cv.phone} · {cv.location} · {cv.linkedin}</div>
          </div>
          <div style={{ width: 50, height: 50, borderRadius: "50%", background: "#c9a84c", display: "flex", alignItems: "center", justifyContent: "center", color: "#0f172a", fontSize: 16, fontWeight: "bold" }}>
            {cv.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
          </div>
        </div>
      </div>
      <div style={{ height: 3, background: "linear-gradient(90deg,#c9a84c,#f0d080,#c9a84c)" }} />
      <div style={{ padding: "16px 28px" }}>
        <div style={{ fontSize: 8, fontWeight: "bold", color: "#0f172a", textTransform: "uppercase", letterSpacing: 2, borderBottom: "0.5px solid #c9a84c", paddingBottom: 2, marginBottom: 6 }}>Executive Summary</div>
        <div style={{ fontSize: 8.5, color: "#334155", lineHeight: 1.8, marginBottom: 12 }}>{cv.summary}</div>
        <div style={{ fontSize: 8, fontWeight: "bold", color: "#0f172a", textTransform: "uppercase", letterSpacing: 2, borderBottom: "0.5px solid #c9a84c", paddingBottom: 2, marginBottom: 6 }}>Leadership Experience</div>
        {cv.experiences.map((exp, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: "bold", fontSize: 9.5, color: "#0f172a" }}>{exp.title} — {exp.company}</span>
              <span style={{ fontSize: 8, color: "#c9a84c" }}>{exp.from} – {exp.to}</span>
            </div>
            <div style={{ fontSize: 7.5, color: "#94a3b8", marginBottom: 2 }}>{exp.location}</div>
            {exp.bullets.split("\n").map((b, j) => b && <div key={j} style={{ fontSize: 8, color: "#475569", lineHeight: 1.6 }}>{b}</div>)}
          </div>
        ))}
        <div style={{ fontSize: 8, fontWeight: "bold", color: "#0f172a", textTransform: "uppercase", letterSpacing: 2, borderBottom: "0.5px solid #c9a84c", paddingBottom: 2, margin: "10px 0 6px" }}>Education</div>
        {cv.educations.map((edu, i) => (<div key={i} style={{ fontSize: 8.5, color: "#334155", marginBottom: 3 }}>{edu.degree} — {edu.school} · {edu.year}{edu.grade ? ` · ${edu.grade}` : ""}</div>))}
        <div style={{ fontSize: 8, fontWeight: "bold", color: "#0f172a", textTransform: "uppercase", letterSpacing: 2, borderBottom: "0.5px solid #c9a84c", paddingBottom: 2, margin: "10px 0 6px" }}>Core Competencies</div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{cv.skills.split(",").map(s => (<span key={s} style={{ fontSize: 7.5, background: "#0f172a", color: "#c9a84c", padding: "2px 8px", borderRadius: 2 }}>{s.trim()}</span>))}</div>
      </div>
    </div>
  );
}

const PREVIEWS: Record<string, (cv: CVData) => JSX.Element> = {
  traditional: (cv) => <PreviewTraditional cv={cv} />,
  centered: (cv) => <PreviewTraditional cv={cv} />,
  twocol: (cv) => <PreviewExecutive cv={cv} />,
  sidebar: (cv) => <PreviewSidebar cv={cv} />,
  minimal: (cv) => <PreviewTraditional cv={cv} />,
  executive: (cv) => <PreviewExecutive cv={cv} />,
};

export default function CVEditorPage() {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const [cv, setCv] = useState<CVData>(defaultCV);

  const update = (field: keyof CVData, value: string) => setCv(prev => ({ ...prev, [field]: value }));

  const updateExp = (i: number, field: keyof Experience, value: string) => {
    const exps = [...cv.experiences];
    exps[i] = { ...exps[i], [field]: value };
    setCv(prev => ({ ...prev, experiences: exps }));
  };

  const addExp = () => setCv(prev => ({
    ...prev,
    experiences: [...prev.experiences, { title: "", company: "", location: "", from: "", to: "", bullets: "" }],
  }));

  const removeExp = (i: number) => setCv(prev => ({ ...prev, experiences: prev.experiences.filter((_, idx) => idx !== i) }));

  const updateEdu = (i: number, field: keyof Education, value: string) => {
    const edus = [...cv.educations];
    edus[i] = { ...edus[i], [field]: value };
    setCv(prev => ({ ...prev, educations: edus }));
  };

  const addEdu = () => setCv(prev => ({
    ...prev,
    educations: [...prev.educations, { degree: "", school: "", year: "", grade: "" }],
  }));

  const removeEdu = (i: number) => setCv(prev => ({ ...prev, educations: prev.educations.filter((_, idx) => idx !== i) }));

  const preview = PREVIEWS[templateId || "traditional"] || PREVIEWS["traditional"];

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "#f1f5f9", padding: "24px 16px 80px", position: "relative", zIndex: 10 }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <button
            onClick={() => navigate("/cv-builder")}
            style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#94a3b8", background: "none", border: "none", cursor: "pointer" }}
          >
            <ArrowLeft style={{ width: 16, height: 16 }} /> Back to templates
          </button>
          <h1 style={{ fontSize: 20, fontWeight: "bold", textTransform: "capitalize", color: "#f1f5f9" }}>{templateId} Template Editor</h1>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
          {/* FORM */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24, maxHeight: "85vh", overflowY: "auto", paddingRight: 8 }}>
            {/* Personal Details */}
            <div style={{ borderRadius: 12, border: "1px solid #1e293b", background: "#1e293b", padding: 20 }}>
              <h2 style={{ fontWeight: "bold", fontSize: 16, marginBottom: 16, color: "#f1f5f9" }}>Personal Details</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ gridColumn: "span 2" }}><Input placeholder="Full Name" value={cv.name} onChange={e => update("name", e.target.value)} /></div>
                <div style={{ gridColumn: "span 2" }}><Input placeholder="Professional Title" value={cv.title} onChange={e => update("title", e.target.value)} /></div>
                <Input placeholder="Email" value={cv.email} onChange={e => update("email", e.target.value)} />
                <Input placeholder="Phone" value={cv.phone} onChange={e => update("phone", e.target.value)} />
                <Input placeholder="Location" value={cv.location} onChange={e => update("location", e.target.value)} />
                <Input placeholder="LinkedIn URL" value={cv.linkedin} onChange={e => update("linkedin", e.target.value)} />
              </div>
            </div>

            {/* Summary */}
            <div style={{ borderRadius: 12, border: "1px solid #1e293b", background: "#1e293b", padding: 20 }}>
              <h2 style={{ fontWeight: "bold", fontSize: 16, marginBottom: 12, color: "#f1f5f9" }}>Professional Summary</h2>
              <Textarea placeholder="Write your professional summary..." value={cv.summary} onChange={e => update("summary", e.target.value)} rows={4} />
            </div>

            {/* Experience */}
            <div style={{ borderRadius: 12, border: "1px solid #1e293b", background: "#1e293b", padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h2 style={{ fontWeight: "bold", fontSize: 16, color: "#f1f5f9" }}>Work Experience</h2>
                <button onClick={addExp} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#c9a84c", background: "none", border: "none", cursor: "pointer" }}>
                  <Plus style={{ width: 12, height: 12 }} /> Add
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {cv.experiences.map((exp, i) => (
                  <div key={i} style={{ border: "1px solid #334155", borderRadius: 8, padding: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                      <span style={{ fontSize: 12, color: "#94a3b8" }}>Position {i + 1}</span>
                      {cv.experiences.length > 1 && <button onClick={() => removeExp(i)} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}><Trash2 style={{ width: 14, height: 14 }} /></button>}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                      <Input placeholder="Job Title" value={exp.title} onChange={e => updateExp(i, "title", e.target.value)} />
                      <Input placeholder="Company" value={exp.company} onChange={e => updateExp(i, "company", e.target.value)} />
                      <Input placeholder="Location" value={exp.location} onChange={e => updateExp(i, "location", e.target.value)} />
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                        <Input placeholder="From" value={exp.from} onChange={e => updateExp(i, "from", e.target.value)} />
                        <Input placeholder="To" value={exp.to} onChange={e => updateExp(i, "to", e.target.value)} />
                      </div>
                    </div>
                    <Textarea placeholder={"· Achievement one\n· Achievement two\n· Achievement three"} value={exp.bullets} onChange={e => updateExp(i, "bullets", e.target.value)} rows={4} />
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div style={{ borderRadius: 12, border: "1px solid #1e293b", background: "#1e293b", padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h2 style={{ fontWeight: "bold", fontSize: 16, color: "#f1f5f9" }}>Education</h2>
                <button onClick={addEdu} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#c9a84c", background: "none", border: "none", cursor: "pointer" }}>
                  <Plus style={{ width: 12, height: 12 }} /> Add
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {cv.educations.map((edu, i) => (
                  <div key={i} style={{ border: "1px solid #334155", borderRadius: 8, padding: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 12, color: "#94a3b8" }}>Qualification {i + 1}</span>
                      {cv.educations.length > 1 && <button onClick={() => removeEdu(i)} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}><Trash2 style={{ width: 14, height: 14 }} /></button>}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      <div style={{ gridColumn: "span 2" }}><Input placeholder="Degree / Qualification" value={edu.degree} onChange={e => updateEdu(i, "degree", e.target.value)} /></div>
                      <Input placeholder="School / University" value={edu.school} onChange={e => updateEdu(i, "school", e.target.value)} />
                      <Input placeholder="Year" value={edu.year} onChange={e => updateEdu(i, "year", e.target.value)} />
                      <div style={{ gridColumn: "span 2" }}><Input placeholder="Grade / Honours (optional)" value={edu.grade} onChange={e => updateEdu(i, "grade", e.target.value)} /></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Extra */}
            <div style={{ borderRadius: 12, border: "1px solid #1e293b", background: "#1e293b", padding: 20 }}>
              <h2 style={{ fontWeight: "bold", fontSize: 16, marginBottom: 12, color: "#f1f5f9" }}>Additional Information</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 4 }}>Skills (comma separated)</label>
                  <Textarea placeholder="React, Node.js, Leadership..." value={cv.skills} onChange={e => update("skills", e.target.value)} rows={2} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 4 }}>Languages</label>
                  <Input placeholder="English (Fluent), Kiswahili (Native)" value={cv.languages} onChange={e => update("languages", e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 4 }}>Certifications</label>
                  <Input placeholder="CPA-K, AWS Solutions Architect..." value={cv.certifications} onChange={e => update("certifications", e.target.value)} />
                </div>
              </div>
            </div>

            <Button className="w-full bg-gradient-brand border-0 font-semibold shadow-glow gold-shimmer h-12">
              <Download className="mr-2 h-4 w-4" /> Download CV
            </Button>
          </div>

          {/* PREVIEW */}
          <div style={{ position: "sticky", top: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#94a3b8" }}>Live Preview</span>
              <span style={{ fontSize: 12, color: "#94a3b8", background: "#1e293b", padding: "4px 10px", borderRadius: 999 }}>Updates as you type</span>
            </div>
            <div style={{ borderRadius: 12, border: "1px solid #1e293b", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.4)", maxHeight: "80vh", overflowY: "auto" }}>
              {preview(cv)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
