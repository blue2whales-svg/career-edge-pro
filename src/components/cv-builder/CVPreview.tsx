import { CVData } from "./types";
import { Lock } from "lucide-react";
import { useEffect, useCallback } from "react";

interface Props {
  data: CVData;
  isPaid?: boolean;
}

const PERSONAL_MARKETS = ["kenya", "uae", "qatar", "africa"];
const GULF_MARKETS = ["uae", "qatar"];

export default function CVPreview({ data, isPaid = false }: Props) {
  const market = data.targetMarket || "kenya";
  const showPersonalDetails = PERSONAL_MARKETS.includes(market);
  const showDOB = data.showDOB && showPersonalDetails;
  const showMarital = data.showMaritalStatus && showPersonalDetails;
  const showReligion = data.showReligion && GULF_MARKETS.includes(market);
  const showPassport = data.showPassport && GULF_MARKETS.includes(market);
  const showPhoto = PERSONAL_MARKETS.includes(market);

  // Copy protection (only when not paid)
  const handleContextMenu = useCallback((e: MouseEvent) => {
    if (!isPaid) e.preventDefault();
  }, [isPaid]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isPaid && (e.ctrlKey || e.metaKey) && (e.key === "c" || e.key === "a" || e.key === "x")) {
      e.preventDefault();
    }
  }, [isPaid]);

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

  // Truncate summary to ~2 lines when not paid
  const getSummaryPreview = (text: string) => {
    if (isPaid) return text;
    const sentences = text.split(/(?<=[.!?])\s+/);
    const preview = sentences.slice(0, 2).join(" ");
    return preview.length > 180 ? preview.slice(0, 180) + "..." : preview;
  };

  return (
    <div
      id="cv-preview-container"
      className="bg-white text-[#1a1a1a] rounded-lg shadow-lg min-h-[600px] relative overflow-hidden"
      style={{
        fontFamily: "'Inter', 'DM Sans', 'Helvetica', sans-serif",
        userSelect: isPaid ? "auto" : "none",
        WebkitUserSelect: isPaid ? "auto" : "none",
      }}
      tabIndex={0}
    >
      {/* Watermark overlay (unpaid only) */}
      {!isPaid && (
        <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center" style={{ transform: "rotate(-30deg)" }}>
          <span className="text-[48px] sm:text-[64px] font-bold tracking-[0.2em] whitespace-nowrap" style={{ color: "rgba(201,169,78,0.08)" }}>
            CVEdge Preview
          </span>
        </div>
      )}

      {/* Executive Header — always visible */}
      <div className="bg-[#0f1b2d] text-white px-6 sm:px-8 py-6 rounded-t-lg relative z-20">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-[22px] sm:text-[26px] font-bold tracking-wide uppercase" style={{ letterSpacing: "0.05em" }}>
              {data.fullName || "Your Full Name"}
            </h1>
            {data.professionalTitle && (
              <p className="text-[13px] text-[#c9a94e] font-medium mt-1 tracking-wide">
                {data.professionalTitle}
              </p>
            )}
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-[10px] text-gray-300">
              {data.phone && data.phone !== "+254" && <span>📞 {data.phone}</span>}
              {data.email && <span>✉ {data.email}</span>}
              {data.location && <span>📍 {data.location}</span>}
              {data.linkedinUrl && <span>🔗 {data.linkedinUrl}</span>}
            </div>
          </div>
          {showPhoto && (
            <div className="w-16 h-16 rounded-full bg-[#1e3050] border-2 border-[#c9a94e] flex items-center justify-center text-[8px] text-gray-400 ml-4 shrink-0">
              PHOTO
            </div>
          )}
        </div>
      </div>

      <div className="px-6 sm:px-8 py-5 text-[11px] leading-relaxed space-y-4 relative z-20">
        {/* Personal Details (region-dependent) */}
        {showPersonalDetails && (data.nationality || showDOB || showMarital || showReligion || showPassport) && (
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-[10px] text-gray-500 pb-3 border-b border-gray-200">
            {data.nationality && <span><strong>Nationality:</strong> {data.nationality}</span>}
            {showDOB && data.dateOfBirth && <span><strong>DOB:</strong> {data.dateOfBirth}</span>}
            {showMarital && data.maritalStatus && <span><strong>Status:</strong> {data.maritalStatus}</span>}
            {showReligion && data.religion && <span><strong>Religion:</strong> {data.religion}</span>}
            {showPassport && data.passportNumber && <span><strong>Passport:</strong> {data.passportNumber}</span>}
          </div>
        )}

        {/* Professional Summary — show first 2 lines, blur rest */}
        {data.professionalSummary && (
          <Section title="Professional Summary">
            <p className="text-gray-700 whitespace-pre-line">{getSummaryPreview(data.professionalSummary)}</p>
            {!isPaid && data.professionalSummary.length > 180 && (
              <div className="relative h-6 -mt-2">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white" />
              </div>
            )}
          </Section>
        )}

        {/* Gated sections — blur when unpaid */}
        <div className="relative">
          {!isPaid && (
            <>
              {/* Blur overlay */}
              <div className="absolute inset-0 z-30 backdrop-blur-[6px]" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.85) 60%, rgba(255,255,255,0.95) 100%)" }} />
              {/* Lock labels */}
              <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-3 pointer-events-none">
                <div className="flex items-center gap-2 bg-[#0f1b2d]/90 text-white text-xs px-4 py-2 rounded-full shadow-lg">
                  <Lock className="h-3.5 w-3.5 text-[#c9a94e]" />
                  <span>Unlock full CV after payment</span>
                </div>
              </div>
            </>
          )}

          {/* Work Experience */}
          {data.workExperience.length > 0 && (
            <Section title="Professional Experience">
              {data.workExperience.map((job) => (
                <div key={job.id} className="mb-3">
                  <div className="flex justify-between items-baseline">
                    <strong className="text-[#0f1b2d] text-[11.5px]">{isPaid ? (job.jobTitle || "Job Title") : "••••••••"}</strong>
                    <span className="text-gray-400 text-[9px] font-medium">
                      {isPaid ? `${job.startDate} — ${job.isPresent ? "Present" : job.endDate}` : "•••• — ••••"}
                    </span>
                  </div>
                  <p className="text-[#64748b] text-[10px] italic">
                    {isPaid ? `${job.company}${job.location ? ` · ${job.location}` : ""}` : "••••••••"}
                  </p>
                  {isPaid && job.responsibilities.filter(Boolean).length > 0 && (
                    <ul className="mt-1.5 space-y-0.5 text-gray-700">
                      {job.responsibilities.filter(Boolean).map((r, i) => (
                        <li key={i} className="flex gap-1.5">
                          <span className="text-[#c9a94e] mt-0.5">▸</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {isPaid && job.achievements && (
                    <p className="mt-1 text-gray-700">
                      <strong className="text-[#0f1b2d]">Key Achievement:</strong> {job.achievements}
                    </p>
                  )}
                </div>
              ))}
            </Section>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <Section title="Education">
              {data.education.map((edu) => (
                <div key={edu.id} className="mb-2">
                  <div className="flex justify-between items-baseline">
                    <strong className="text-[#0f1b2d]">
                      {isPaid ? `${edu.qualification}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}` : "••••••••"}
                    </strong>
                    <span className="text-gray-400 text-[9px]">{isPaid ? edu.graduationYear : "••••"}</span>
                  </div>
                  <p className="text-[#64748b] text-[10px] italic">{isPaid ? edu.institution : "••••••••"}</p>
                </div>
              ))}
            </Section>
          )}

          {/* Skills */}
          {(data.hardSkills.length > 0 || data.softSkills.length > 0) && (
            <Section title="Core Skills">
              {data.hardSkills.length > 0 && (
                <div className="mb-1.5">
                  <span className="text-[10px] font-semibold text-[#0f1b2d] uppercase tracking-wider">Technical: </span>
                  <span className="text-gray-700">{isPaid ? data.hardSkills.join(" · ") : "•••• · •••• · •••• · ••••"}</span>
                </div>
              )}
              {data.softSkills.length > 0 && (
                <div>
                  <span className="text-[10px] font-semibold text-[#0f1b2d] uppercase tracking-wider">Soft Skills: </span>
                  <span className="text-gray-700">{isPaid ? data.softSkills.join(" · ") : "•••• · •••• · ••••"}</span>
                </div>
              )}
            </Section>
          )}

          {/* Languages */}
          {data.languages.filter((l) => l.name).length > 0 && (
            <Section title="Languages">
              <p className="text-gray-700">
                {isPaid
                  ? data.languages.filter((l) => l.name).map((l) => `${l.name} (${l.proficiency})`).join(" · ")
                  : "•••• · •••• · ••••"}
              </p>
            </Section>
          )}

          {/* Certifications */}
          {data.certifications.filter((c) => c.name).length > 0 && (
            <Section title="Certifications">
              {data.certifications.filter((c) => c.name).map((c, i) => (
                <p key={i} className="text-gray-700">
                  {isPaid
                    ? `${c.name}${c.issuer ? ` — ${c.issuer}` : ""}${c.year ? ` (${c.year})` : ""}`
                    : "••••••••"}
                </p>
              ))}
            </Section>
          )}

          {/* References */}
          {data.references && (
            <Section title="References">
              <p className="text-gray-700">{isPaid ? data.references : "••••••••"}</p>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#0f1b2d] border-b-2 border-[#c9a94e] pb-1 mb-2">
        {title}
      </h2>
      {children}
    </div>
  );
}
