import { CVData } from "./types";
import { Lock } from "lucide-react";
import { useEffect, useCallback } from "react";

interface Props {
  data: CVData;
  isPaid?: boolean;
  template?: "executive" | "clean" | "sidebar" | "minimal" | "creative" | "corporate";
}
export default function CVPreview({ data, isPaid = false, template = "executive" }: Props) {
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
      if (!isPaid && (e.ctrlKey || e.metaKey) && ["c", "a", "x"].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
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
      {/* Watermark */}
      {!isPaid && (
        <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
          <span
            className="text-[48px] font-bold tracking-[0.2em] whitespace-nowrap select-none"
            style={{
              transform: "rotate(-38deg)",
              color: "rgba(201,168,76,0.08)",
              fontSize: "clamp(32px,6vw,64px)",
            }}
          >
            CVEdge Preview
          </span>
        </div>
      )}

      {/* ── HEADER ── */}
      <div style={{ background: "#1a1a2e", padding: "32px 36px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <h1
              style={{
                fontSize: "clamp(20px,3vw,28px)",
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#ffffff",
                marginBottom: "6px",
                fontFamily: "Georgia, serif",
              }}
            >
              {data.fullName || <span style={{ color: "rgba(201,168,76,0.4)" }}>Your Full Name</span>}
            </h1>
            {(data.professionalTitle || !data.fullName) && (
              <p
                style={{
                  fontSize: "12px",
                  color: "#c9a84c",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  marginBottom: "14px",
                }}
              >
                {data.professionalTitle || <span style={{ color: "rgba(201,168,76,0.35)" }}>Professional Title</span>}
              </p>
            )}
            {/* Contact row */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", fontSize: "10px", color: "#aab4cc" }}>
              {data.phone && <span>📞 {data.phone}</span>}
              {data.email && <span>✉️ {data.email}</span>}
              {data.location && <span>📍 {data.location}</span>}
              {data.linkedinUrl && <span>🔗 {data.linkedinUrl}</span>}
              {!data.phone && !data.email && (
                <span style={{ color: "rgba(170,180,204,0.35)" }}>
                  your@email.com · +254 700 000000 · Nairobi, Kenya
                </span>
              )}
            </div>
          </div>
          {/* Photo placeholder */}
          {showPhoto && (
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                background: "rgba(201,168,76,0.15)",
                border: "2px solid #c9a84c",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "9px",
                color: "#c9a84c",
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
        {/* Gold divider */}
        <div
          style={{
            height: "2px",
            background: "linear-gradient(90deg, #c9a84c, transparent)",
            marginTop: "16px",
            borderRadius: "2px",
          }}
        />
      </div>

      {/* ── BODY ── */}
      <div style={{ padding: "20px 36px", background: "#fff", position: "relative" }}>
        {/* Personal Details */}
        {showPersonalDetails && (showDOB || showMarital || showReligion || showPassport || data.nationality) && (
          <Section title="Personal Details">
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 20px", fontSize: "10px", color: "#555" }}>
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

        {/* Professional Summary */}
        {data.professionalSummary && (
          <Section title="Professional Summary">
            <p style={{ fontSize: "11px", color: "#333", lineHeight: 1.7, position: "relative" }}>
              {getSummaryPreview(data.professionalSummary)}
              {!isPaid && data.professionalSummary.length > 180 && (
                <span
                  style={{
                    display: "block",
                    height: "24px",
                    background: "linear-gradient(to bottom, transparent, white)",
                    marginTop: "-24px",
                    position: "relative",
                  }}
                />
              )}
            </p>
          </Section>
        )}
        {!data.professionalSummary && (
          <Section title="Professional Summary">
            <p style={{ fontSize: "11px", color: "rgba(201,168,76,0.4)", lineHeight: 1.7, fontStyle: "italic" }}>
              A results-driven professional with X years of experience in... (your summary will appear here)
            </p>
          </Section>
        )}

        {/* Blurred section for unpaid */}
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
                style={
                  {
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexCol: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  } as any
                }
              >
                <div
                  style={{
                    background: "#1a1a2e",
                    borderRadius: "10px",
                    padding: "12px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Lock size={14} color="#c9a84c" />
                  <span style={{ fontSize: "12px", color: "#fff", fontWeight: 600 }}>Unlock full CV after payment</span>
                </div>
              </div>
            </div>
          )}

          {/* Work Experience */}
          {data.workExperience && data.workExperience.filter((j) => j.jobTitle).length > 0 ? (
            <Section title="Work Experience">
              {data.workExperience
                .filter((j) => j.jobTitle)
                .map((job, i) => (
                  <div key={i} style={{ marginBottom: "14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontSize: "12px", fontWeight: 700, color: "#1a1a2e" }}>{job.jobTitle}</div>
                        <div style={{ fontSize: "11px", color: "#c9a84c", fontWeight: 600 }}>
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
                          <li key={j} style={{ fontSize: "10px", color: "#444", lineHeight: 1.6 }}>
                            {line}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
            </Section>
          ) : (
            <Section title="Work Experience">
              <div style={{ fontSize: "11px", color: "rgba(201,168,76,0.4)", fontStyle: "italic" }}>
                Senior Manager · Company Name · 2020 – Present
              </div>
            </Section>
          )}

          {/* Education */}
          {data.education && data.education.filter((e) => e.qualification).length > 0 ? (
            <Section title="Education">
              {data.education
                .filter((e) => e.qualification)
                .map((edu, i) => (
                  <div key={i} style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: 700, color: "#1a1a2e" }}>{edu.qualification}</div>
                      <div style={{ fontSize: "11px", color: "#666" }}>{edu.institution}</div>
                    </div>
                    <div style={{ fontSize: "10px", color: "#999", whiteSpace: "nowrap", marginLeft: "8px" }}>
                      {edu.startDate}
                      {edu.endDate ? ` – ${edu.endDate}` : ""}
                    </div>
                  </div>
                ))}
            </Section>
          ) : (
            <Section title="Education">
              <div style={{ fontSize: "11px", color: "rgba(201,168,76,0.4)", fontStyle: "italic" }}>
                BSc Computer Science · University of Nairobi · 2018
              </div>
            </Section>
          )}

          {/* Skills */}
          {(data.hardSkills?.length > 0 || data.softSkills?.length > 0) && (
            <Section title="Skills">
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                {data.hardSkills?.map((s, i) => (
                  <span
                    key={i}
                    style={{
                      background: "rgba(201,168,76,0.1)",
                      border: "1px solid rgba(201,168,76,0.4)",
                      color: "#1a1a2e",
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
                      background: "rgba(26,26,46,0.06)",
                      border: "1px solid rgba(26,26,46,0.15)",
                      color: "#555",
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

          {/* Languages */}
          {data.languages && data.languages.filter((l) => l.name).length > 0 && (
            <Section title="Languages">
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 24px" }}>
                {data.languages
                  .filter((l) => l.name)
                  .map((l, i) => (
                    <div key={i} style={{ fontSize: "10px", color: "#444" }}>
                      <span style={{ fontWeight: 600 }}>{l.name}</span>
                      {l.proficiency && <span style={{ color: "#999", marginLeft: "4px" }}>· {l.proficiency}</span>}
                    </div>
                  ))}
              </div>
            </Section>
          )}

          {/* Certifications */}
          {data.certifications && data.certifications.filter((c) => c.name).length > 0 && (
            <Section title="Certifications">
              {data.certifications
                .filter((c) => c.name)
                .map((c, i) => (
                  <p key={i} style={{ fontSize: "10px", color: "#444", marginBottom: "3px" }}>
                    <strong>{c.name}</strong>
                    {c.issuer ? ` · ${c.issuer}` : ""}
                  </p>
                ))}
            </Section>
          )}

          {/* References */}
          {data.references && (
            <Section title="References">
              <p style={{ fontSize: "10px", color: "#777" }}>{isPaid ? data.references : "Available upon request"}</p>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
        <h2
          style={{
            fontSize: "9px",
            fontWeight: 900,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#1a1a2e",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </h2>
        <div
          style={{
            flex: 1,
            height: "2px",
            background: "linear-gradient(90deg, #c9a84c, transparent)",
            borderRadius: "2px",
          }}
        />
      </div>
      {children}
    </div>
  );
}
