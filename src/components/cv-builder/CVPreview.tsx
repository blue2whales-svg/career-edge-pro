import { CVData } from "./types";

interface Props {
  data: CVData;
}

const PERSONAL_MARKETS = ["kenya", "uae", "qatar", "africa"];
const GULF_MARKETS = ["uae", "qatar"];

export default function CVPreview({ data }: Props) {
  const market = data.targetMarket || "kenya";
  const showPersonalDetails = PERSONAL_MARKETS.includes(market);
  const showDOB = data.showDOB && showPersonalDetails;
  const showMarital = data.showMaritalStatus && showPersonalDetails;
  const showReligion = data.showReligion && GULF_MARKETS.includes(market);
  const showPassport = data.showPassport && GULF_MARKETS.includes(market);
  const showPhoto = PERSONAL_MARKETS.includes(market);

  return (
    <div className="bg-white text-[#1a1a1a] rounded-lg shadow-lg min-h-[600px]" style={{ fontFamily: "'Inter', 'DM Sans', 'Helvetica', sans-serif" }}>
      {/* Executive Header */}
      <div className="bg-[#0f1b2d] text-white px-6 sm:px-8 py-6 rounded-t-lg">
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

      <div className="px-6 sm:px-8 py-5 text-[11px] leading-relaxed space-y-4">
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

        {/* Professional Summary */}
        {data.professionalSummary && (
          <Section title="Professional Summary">
            <p className="text-gray-700 whitespace-pre-line">{data.professionalSummary}</p>
          </Section>
        )}

        {/* Work Experience */}
        {data.workExperience.length > 0 && (
          <Section title="Professional Experience">
            {data.workExperience.map((job) => (
              <div key={job.id} className="mb-3">
                <div className="flex justify-between items-baseline">
                  <strong className="text-[#0f1b2d] text-[11.5px]">{job.jobTitle || "Job Title"}</strong>
                  <span className="text-gray-400 text-[9px] font-medium">
                    {job.startDate} — {job.isPresent ? "Present" : job.endDate}
                  </span>
                </div>
                <p className="text-[#64748b] text-[10px] italic">
                  {job.company}{job.location ? ` · ${job.location}` : ""}
                </p>
                {job.responsibilities.filter(Boolean).length > 0 && (
                  <ul className="mt-1.5 space-y-0.5 text-gray-700">
                    {job.responsibilities.filter(Boolean).map((r, i) => (
                      <li key={i} className="flex gap-1.5">
                        <span className="text-[#c9a94e] mt-0.5">▸</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {job.achievements && (
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
                    {edu.qualification}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                  </strong>
                  <span className="text-gray-400 text-[9px]">{edu.graduationYear}</span>
                </div>
                <p className="text-[#64748b] text-[10px] italic">{edu.institution}</p>
                {edu.grade && <p className="text-gray-400 text-[9px]">{edu.grade}</p>}
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
                <span className="text-gray-700">{data.hardSkills.join(" · ")}</span>
              </div>
            )}
            {data.softSkills.length > 0 && (
              <div>
                <span className="text-[10px] font-semibold text-[#0f1b2d] uppercase tracking-wider">Soft Skills: </span>
                <span className="text-gray-700">{data.softSkills.join(" · ")}</span>
              </div>
            )}
          </Section>
        )}

        {/* Languages */}
        {data.languages.filter((l) => l.name).length > 0 && (
          <Section title="Languages">
            <p className="text-gray-700">
              {data.languages.filter((l) => l.name).map((l) => `${l.name} (${l.proficiency})`).join(" · ")}
            </p>
          </Section>
        )}

        {/* Certifications */}
        {data.certifications.filter((c) => c.name).length > 0 && (
          <Section title="Certifications">
            {data.certifications.filter((c) => c.name).map((c, i) => (
              <p key={i} className="text-gray-700">
                {c.name}{c.issuer ? ` — ${c.issuer}` : ""}{c.year ? ` (${c.year})` : ""}
              </p>
            ))}
          </Section>
        )}

        {/* References */}
        {data.references && (
          <Section title="References">
            <p className="text-gray-700">{data.references}</p>
          </Section>
        )}
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
