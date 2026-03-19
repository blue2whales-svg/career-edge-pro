import { CVData } from "./types";
import { Lock } from "lucide-react";
import { useEffect, useCallback } from "react";

interface Props {
  data: CVData;
  isPaid?: boolean;
  template?: "executive" | "clean" | "sidebar" | "minimal" | "creative" | "corporate";
}

const TEMPLATES = {
  executive: {
    headerBg: "#1a1a2e",
    headerText: "#fff",
    accent: "#c9a84c",
    body: "#fff",
    text: "#1a1a2e",
    sectionTitle: "#1a1a2e",
    divider: "linear-gradient(90deg, #c9a84c, transparent)",
    tagBg: "rgba(201,168,76,0.1)",
    tagBorder: "rgba(201,168,76,0.4)",
    tagText: "#1a1a2e",
    softTagBg: "rgba(26,26,46,0.06)",
    softTagBorder: "rgba(26,26,46,0.15)",
    softTagText: "#555",
    jobTitleColor: "#1a1a2e",
    companyColor: "#c9a84c",
    photoBg: "rgba(201,168,76,0.15)",
    photoBorder: "#c9a84c",
    photoText: "#c9a84c",
    contactColor: "#aab4cc",
    sidebar: false,
  },
  clean: {
    headerBg: "#f8fafc",
    headerText: "#111",
    accent: "#2563eb",
    body: "#fff",
    text: "#222",
    sectionTitle: "#111",
    divider: "linear-gradient(90deg, #2563eb, transparent)",
    tagBg: "rgba(37,99,235,0.08)",
    tagBorder: "rgba(37,99,235,0.3)",
    tagText: "#1e3a8a",
    softTagBg: "rgba(0,0,0,0.04)",
    softTagBorder: "rgba(0,0,0,0.12)",
    softTagText: "#555",
    jobTitleColor: "#111",
    companyColor: "#2563eb",
    photoBg: "rgba(37,99,235,0.1)",
    photoBorder: "#2563eb",
    photoText: "#2563eb",
    contactColor: "#64748b",
    sidebar: false,
  },
  sidebar: {
    headerBg: "#1e293b",
    headerText: "#fff",
    accent: "#38bdf8",
    body: "#f8fafc",
    text: "#1e293b",
    sectionTitle: "#1e293b",
    divider: "linear-gradient(90deg, #38bdf8, transparent)",
    tagBg: "rgba(56,189,248,0.1)",
    tagBorder: "rgba(56,189,248,0.35)",
    tagText: "#0c4a6e",
    softTagBg: "rgba(30,41,59,0.06)",
    softTagBorder: "rgba(30,41,59,0.15)",
    softTagText: "#475569",
    jobTitleColor: "#1e293b",
    companyColor: "#0284c7",
    photoBg: "rgba(56,189,248,0.15)",
    photoBorder: "#38bdf8",
    photoText: "#38bdf8",
    contactColor: "#94a3b8",
    sidebar: true,
    sidebarBg: "#1e293b",
  },
  minimal: {
    headerBg: "#fff",
    headerText: "#111",
    accent: "#111",
    body: "#fff",
    text: "#111",
    sectionTitle: "#111",
    divider: "linear-gradient(90deg, #111, transparent)",
    tagBg: "rgba(0,0,0,0.04)",
    tagBorder: "rgba(0,0,0,0.2)",
    tagText: "#111",
    softTagBg: "rgba(0,0,0,0.02)",
    softTagBorder: "rgba(0,0,0,0.1)",
    softTagText: "#444",
    jobTitleColor: "#111",
    companyColor: "#555",
    photoBg: "rgba(0,0,0,0.05)",
    photoBorder: "#111",
    photoText: "#111",
    contactColor: "#666",
    sidebar: false,
  },
  creative: {
    headerBg: "linear-gradient(135deg, #7c3aed, #db2777)",
    headerText: "#fff",
    accent: "#f0abfc",
    body: "#fff",
    text: "#1a1a2e",
    sectionTitle: "#7c3aed",
    divider: "linear-gradient(90deg, #a78bfa, transparent)",
    tagBg: "rgba(124,58,237,0.08)",
    tagBorder: "rgba(124,58,237,0.3)",
    tagText: "#5b21b6",
    softTagBg: "rgba(219,39,119,0.06)",
    softTagBorder: "rgba(219,39,119,0.2)",
    softTagText: "#9d174d",
    jobTitleColor: "#1a1a2e",
    companyColor: "#7c3aed",
    photoBg: "rgba(240,171,252,0.2)",
    photoBorder: "#f0abfc",
    photoText: "#f0abfc",
    contactColor: "rgba(255,255,255,0.8)",
    sidebar: false,
  },
  corporate: {
    headerBg: "#14532d",
    headerText: "#fff",
    accent: "#4ade80",
    body: "#fff",
    text: "#14532d",
    sectionTitle: "#14532d",
    divider: "linear-gradient(90deg, #16a34a, transparent)",
    tagBg: "rgba(20,83,45,0.08)",
    tagBorder: "rgba(22,163,74,0.35)",
    tagText: "#14532d",
    softTagBg: "rgba(0,0,0,0.04)",
    softTagBorder: "rgba(0,0,0,0.12)",
    softTagText: "#555",
    jobTitleColor: "#14532d",
    companyColor: "#16a34a",
    photoBg: "rgba(74,222,128,0.15)",
    photoBorder: "#4ade80",
    photoText: "#4ade80",
    contactColor: "rgba(255,255,255,0.75)",
    sidebar: false,
  },
};

export default function CVPreview({ data, isPaid = false, template = "executive" }: Props) {
  const t = TEMPLATES[template] || TEMPLATES.executive;
  const market = data.targetMarket || "kenya";
  const showPersonalDetails = market === "kenya";
  const showDOB = data.showDOB && showPersonalDetails;
  const showMarital = data.showMaritalStatus && showPersonalDetails;
  const showReligion = data.showReligion && showPersonalDetails;
  const showPassport = data.showPassport && ["uae", "qatar", "africa"].includes(market);
  const showPhoto = ["kenya", "uae", "qatar", "africa"].includes(market);

  const handleContextMenu = useCallback(
    (e: MouseEvent) => {
      if (!isPaid) e.preventDefault();
    },
    [isPaid],
  );
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isPaid && (e.ctrlKey || e.metaKey) && ["c", "a", "x"].includes(e.key.toLowerCase())) e.preventDefault();
    },
    [isPaid],
  );

  useEffect(() => {
    const el = document.getElementById("cv-preview-container");
    if (!el) return;
    el.addEventListener("contextmenu", handleContextMenu);
    el.addEventListener("keydown", handleKeyDown);
    return () => {
      el.removeEventListener("contextmenu", handleContextMenu);
      el.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleContextMenu, handleKeyDown]);

  const getSummaryPreview = (text: string) => {
    if (isPaid) return text;
    const sentences = text.split(/(?<=[.!?])\s+/);
    const preview = sentences.slice(0, 2).join(" ");
    return preview.length > 180 ? preview.slice(0, 180) + "..." : preview;
  };

  const bodyContent = (
    <div style={{ padding: "20px 36px", background: t.body, position: "relative" }}>
      {showPersonalDetails && (showDOB || showMarital || showReligion || showPassport || data.nationality) && (
        <Section title="Personal Details" colors={t}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 20px", fontSize: "10px", color: t.text }}>
            {data.nationality && (
              <span>
                <strong>Nationality:</strong> {data.nationality}
              </span>
            )}
            {showDOB && data.dateOfBirth && (
              <span>
                <strong>DOB:</strong> {data.dateOfBirth}
              </span>
            )}
            {showMarital && data.maritalStatus && (
              <span>
                <strong>Status:</strong> {data.maritalStatus}
              </span>
            )}
            {showReligion && data.religion && (
              <span>
                <strong>Religion:</strong> {data.religion}
              </span>
            )}
            {showPassport && data.passportNumber && (
              <span>
                <strong>Passport:</strong> {data.passportNumber}
              </span>
            )}
          </div>
        </Section>
      )}

      <Section title="Professional Summary" colors={t}>
        <p style={{ fontSize: "11px", color: t.text, lineHeight: 1.7 }}>
          {data.professionalSummary ? (
            getSummaryPreview(data.professionalSummary)
          ) : (
            <span style={{ color: t.accent, opacity: 0.5, fontStyle: "italic" }}>
              A results-driven professional with X years of experience...
            </span>
          )}
        </p>
      </Section>

      <div style={{ position: "relative" }}>
        {!isPaid && (
          <div
            className="absolute inset-0 z-40"
            style={{
              backdropFilter: "blur(6px)",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.85) 60%, rgba(255,255,255,0.98) 100%)",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  background: t.headerBg as string,
                  borderRadius: "10px",
                  padding: "12px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Lock size={14} color={t.accent as string} />
                <span style={{ fontSize: "12px", color: "#fff", fontWeight: 600 }}>Unlock full CV after payment</span>
              </div>
            </div>
          </div>
        )}

        {data.workExperience?.filter((j) => j.jobTitle).length > 0 ? (
          <Section title="Work Experience" colors={t}>
            {data.workExperience
              .filter((j) => j.jobTitle)
              .map((job, i) => (
                <div key={i} style={{ marginBottom: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: 700, color: t.jobTitleColor }}>{job.jobTitle}</div>
                      <div style={{ fontSize: "11px", color: t.companyColor, fontWeight: 600 }}>
                        {job.company}
                        {job.location ? ` · ${job.location}` : ""}
                      </div>
                    </div>
                    <div style={{ fontSize: "10px", color: "#999", whiteSpace: "nowrap", marginLeft: "8px" }}>
                      {job.startDate}
                      {job.endDate ? ` – ${job.endDate}` : job.isPresent ? " – Present" : ""}
                    </div>
                  </div>
                  {job.responsibilities && (
                    <ul style={{ marginTop: "5px", paddingLeft: "14px" }}>
                      {job.responsibilities.map((line, j) => (
                        <li key={j} style={{ fontSize: "10px", color: t.text, lineHeight: 1.6 }}>
                          {line}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
          </Section>
        ) : (
          <Section title="Work Experience" colors={t}>
            <div style={{ fontSize: "11px", color: t.accent, opacity: 0.5, fontStyle: "italic" }}>
              Senior Manager · Company Name · 2020 – Present
            </div>
          </Section>
        )}

        {data.education?.filter((e) => e.qualification).length > 0 ? (
          <Section title="Education" colors={t}>
            {data.education
              .filter((e) => e.qualification)
              .map((edu, i) => (
                <div key={i} style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: t.jobTitleColor }}>{edu.qualification}</div>
                    <div style={{ fontSize: "11px", color: t.companyColor }}>{edu.institution}</div>
                  </div>
                  <div style={{ fontSize: "10px", color: "#999", whiteSpace: "nowrap", marginLeft: "8px" }}>
                    {edu.graduationYear}
                  </div>
                </div>
              ))}
          </Section>
        ) : (
          <Section title="Education" colors={t}>
            <div style={{ fontSize: "11px", color: t.accent, opacity: 0.5, fontStyle: "italic" }}>
              BSc Computer Science · University of Nairobi · 2018
            </div>
          </Section>
        )}

        {(data.hardSkills?.length > 0 || data.softSkills?.length > 0) && (
          <Section title="Skills" colors={t}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
              {data.hardSkills?.map((s, i) => (
                <span
                  key={i}
                  style={{
                    background: t.tagBg,
                    border: `1px solid ${t.tagBorder}`,
                    color: t.tagText,
                    fontSize: "9px",
                    fontWeight: 600,
                    padding: "2px 10px",
                    borderRadius: "100px",
                  }}
                >
                  {s}
                </span>
              ))}
              {data.softSkills?.map((s, i) => (
                <span
                  key={i}
                  style={{
                    background: t.softTagBg,
                    border: `1px solid ${t.softTagBorder}`,
                    color: t.softTagText,
                    fontSize: "9px",
                    fontWeight: 600,
                    padding: "2px 10px",
                    borderRadius: "100px",
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </Section>
        )}

        {data.languages?.filter((l) => l.name).length > 0 && (
          <Section title="Languages" colors={t}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 24px" }}>
              {data.languages
                .filter((l) => l.name)
                .map((l, i) => (
                  <div key={i} style={{ fontSize: "10px", color: t.text }}>
                    <span style={{ fontWeight: 600 }}>{l.name}</span>
                    {l.proficiency && <span style={{ color: "#999", marginLeft: "4px" }}>· {l.proficiency}</span>}
                  </div>
                ))}
            </div>
          </Section>
        )}

        {data.certifications?.filter((c) => c.name).length > 0 && (
          <Section title="Certifications" colors={t}>
            {data.certifications
              .filter((c) => c.name)
              .map((c, i) => (
                <p key={i} style={{ fontSize: "10px", color: t.text, marginBottom: "3px" }}>
                  <strong>{c.name}</strong>
                  {c.issuer ? ` · ${c.issuer}` : ""}
                </p>
              ))}
          </Section>
        )}

        {data.references && (
          <Section title="References" colors={t}>
            <p style={{ fontSize: "10px", color: "#777" }}>{isPaid ? data.references : "Available upon request"}</p>
          </Section>
        )}
      </div>
    </div>
  );

  return (
    <div
      id="cv-preview-container"
      className="bg-white rounded-lg shadow-2xl min-h-[600px] relative overflow-hidden"
      style={{
        fontFamily: "'Inter', 'DM Sans', 'Helvetica', sans-serif",
        userSelect: isPaid ? "auto" : "none",
        WebkitUserSelect: isPaid ? "auto" : "none",
      }}
    >
      {!isPaid && (
        <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
          <span
            className="text-[48px] font-bold tracking-[0.2em] whitespace-nowrap select-none"
            style={{ transform: "rotate(-38deg)", color: "rgba(201,168,76,0.08)", fontSize: "clamp(32px,6vw,64px)" }}
          >
            CVEdge Preview
          </span>
        </div>
      )}

      {/* SIDEBAR LAYOUT */}
      {template === "sidebar" ? (
        <div style={{ display: "flex", minHeight: "600px" }}>
          {/* Left sidebar */}
          <div
            style={{
              width: "35%",
              background: "#1e293b",
              padding: "28px 16px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {showPhoto && (
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: t.photoBg,
                  border: `2px solid ${t.photoBorder}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "8px",
                  color: t.photoText,
                  textAlign: "center",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  margin: "0 auto",
                }}
              >
                PHOTO
              </div>
            )}
            <div>
              <h1
                style={{
                  fontSize: "14px",
                  fontWeight: 800,
                  color: "#fff",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  fontFamily: "Georgia, serif",
                  marginBottom: "4px",
                }}
              >
                {data.fullName || <span style={{ opacity: 0.4 }}>Your Name</span>}
              </h1>
              <p
                style={{
                  fontSize: "9px",
                  color: t.accent,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                {data.professionalTitle || <span style={{ opacity: 0.4 }}>Professional Title</span>}
              </p>
            </div>
            <div style={{ height: "1px", background: `linear-gradient(90deg, ${t.accent}, transparent)` }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {data.phone && <span style={{ fontSize: "9px", color: t.contactColor }}>📞 {data.phone}</span>}
              {data.email && <span style={{ fontSize: "9px", color: t.contactColor }}>✉️ {data.email}</span>}
              {data.location && <span style={{ fontSize: "9px", color: t.contactColor }}>📍 {data.location}</span>}
              {!data.phone && !data.email && (
                <span style={{ fontSize: "9px", color: "rgba(148,163,184,0.4)" }}>your@email.com</span>
              )}
            </div>
            {(data.hardSkills?.length > 0 || data.softSkills?.length > 0) && (
              <div>
                <p
                  style={{
                    fontSize: "8px",
                    fontWeight: 900,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: t.accent,
                    marginBottom: "6px",
                  }}
                >
                  Skills
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                  {[...(data.hardSkills || []), ...(data.softSkills || [])].slice(0, 8).map((s, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: "9px",
                        color: "#cbd5e1",
                        background: "rgba(56,189,248,0.1)",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        border: "1px solid rgba(56,189,248,0.2)",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {data.languages?.filter((l) => l.name).length > 0 && (
              <div>
                <p
                  style={{
                    fontSize: "8px",
                    fontWeight: 900,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: t.accent,
                    marginBottom: "6px",
                  }}
                >
                  Languages
                </p>
                {data.languages
                  .filter((l) => l.name)
                  .map((l, i) => (
                    <div key={i} style={{ fontSize: "9px", color: "#cbd5e1", marginBottom: "2px" }}>
                      {l.name}
                      {l.proficiency ? ` · ${l.proficiency}` : ""}
                    </div>
                  ))}
              </div>
            )}
          </div>
          {/* Right main */}
          <div style={{ flex: 1, background: "#f8fafc" }}>
            <div style={{ padding: "20px 20px 8px" }}>
              <Section title="Professional Summary" colors={t}>
                <p style={{ fontSize: "11px", color: t.text, lineHeight: 1.7 }}>
                  {data.professionalSummary ? (
                    getSummaryPreview(data.professionalSummary)
                  ) : (
                    <span style={{ color: t.accent, opacity: 0.5, fontStyle: "italic" }}>Your summary...</span>
                  )}
                </p>
              </Section>
            </div>
            <div style={{ padding: "0 20px", position: "relative" }}>
              {!isPaid && (
                <div
                  className="absolute inset-0 z-40"
                  style={{
                    backdropFilter: "blur(6px)",
                    background:
                      "linear-gradient(180deg, rgba(248,250,252,0.4) 0%, rgba(248,250,252,0.9) 60%, rgba(248,250,252,0.98) 100%)",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        background: "#1e293b",
                        borderRadius: "10px",
                        padding: "12px 20px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <Lock size={14} color={t.accent as string} />
                      <span style={{ fontSize: "12px", color: "#fff", fontWeight: 600 }}>
                        Unlock full CV after payment
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {data.workExperience?.filter((j) => j.jobTitle).length > 0 ? (
                <Section title="Work Experience" colors={t}>
                  {data.workExperience
                    .filter((j) => j.jobTitle)
                    .map((job, i) => (
                      <div key={i} style={{ marginBottom: "14px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <div>
                            <div style={{ fontSize: "12px", fontWeight: 700, color: t.jobTitleColor }}>
                              {job.jobTitle}
                            </div>
                            <div style={{ fontSize: "11px", color: t.companyColor, fontWeight: 600 }}>
                              {job.company}
                            </div>
                          </div>
                          <div style={{ fontSize: "10px", color: "#999" }}>
                            {job.startDate}
                            {job.endDate ? ` – ${job.endDate}` : job.isPresent ? " – Present" : ""}
                          </div>
                        </div>
                      </div>
                    ))}
                </Section>
              ) : (
                <Section title="Work Experience" colors={t}>
                  <div style={{ fontSize: "11px", color: t.accent, opacity: 0.5, fontStyle: "italic" }}>
                    Senior Manager · Company Name · 2020 – Present
                  </div>
                </Section>
              )}
              {data.education?.filter((e) => e.qualification).length > 0 && (
                <Section title="Education" colors={t}>
                  {data.education
                    .filter((e) => e.qualification)
                    .map((edu, i) => (
                      <div key={i} style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between" }}>
                        <div>
                          <div style={{ fontSize: "12px", fontWeight: 700, color: t.jobTitleColor }}>
                            {edu.qualification}
                          </div>
                          <div style={{ fontSize: "11px", color: t.companyColor }}>{edu.institution}</div>
                        </div>
                        <div style={{ fontSize: "10px", color: "#999" }}>{edu.graduationYear}</div>
                      </div>
                    ))}
                </Section>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ALL OTHER LAYOUTS */
        <>
          <div
            style={{
              background: template === "creative" ? undefined : (t.headerBg as string),
              backgroundImage: template === "creative" ? (t.headerBg as string) : undefined,
              padding: "32px 36px 24px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <h1
                  style={{
                    fontSize: "clamp(20px,3vw,28px)",
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: t.headerText,
                    marginBottom: "6px",
                    fontFamily: "Georgia, serif",
                  }}
                >
                  {data.fullName || <span style={{ color: t.accent, opacity: 0.5 }}>Your Full Name</span>}
                </h1>
                <p
                  style={{
                    fontSize: "12px",
                    color: t.accent,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    marginBottom: "14px",
                  }}
                >
                  {data.professionalTitle || <span style={{ opacity: 0.4 }}>Professional Title</span>}
                </p>
                <div
                  style={{ display: "flex", flexWrap: "wrap", gap: "12px", fontSize: "10px", color: t.contactColor }}
                >
                  {data.phone && <span>📞 {data.phone}</span>}
                  {data.email && <span>✉️ {data.email}</span>}
                  {data.location && <span>📍 {data.location}</span>}
                  {data.linkedinUrl && <span>🔗 {data.linkedinUrl}</span>}
                  {!data.phone && !data.email && <span style={{ opacity: 0.4 }}>your@email.com · +254 700 000000</span>}
                </div>
              </div>
              {showPhoto && (
                <div
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "50%",
                    background: t.photoBg,
                    border: `2px solid ${t.photoBorder}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "9px",
                    color: t.photoText,
                    textAlign: "center",
                    marginLeft: "16px",
                    flexShrink: 0,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  PHOTO
                </div>
              )}
            </div>
            <div style={{ height: "2px", background: t.divider, marginTop: "16px", borderRadius: "2px" }} />
          </div>
          {bodyContent}
        </>
      )}
    </div>
  );
}

function Section({
  title,
  children,
  colors,
}: {
  title: string;
  children: React.ReactNode;
  colors: typeof TEMPLATES.executive;
}) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
        <h2
          style={{
            fontSize: "9px",
            fontWeight: 900,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: colors.sectionTitle,
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </h2>
        <div style={{ flex: 1, height: "2px", background: colors.divider, borderRadius: "2px" }} />
      </div>
      {children}
    </div>
  );
}
