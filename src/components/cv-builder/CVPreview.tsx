import { CVData } from "./types";

interface Props {
  data: CVData;
}

export default function CVPreview({ data }: Props) {
  const showPhoto = ["kenya", "gulf"].includes(data.targetMarket);
  const showDOB = data.showDOB && ["kenya", "gulf"].includes(data.targetMarket);
  const showMarital = data.showMaritalStatus && ["kenya", "gulf"].includes(data.targetMarket);
  const showReligion = data.showReligion && data.targetMarket === "gulf";
  const showPassport = data.showPassport && data.targetMarket === "gulf";

  return (
    <div className="bg-white text-gray-900 p-6 sm:p-8 rounded-lg shadow-lg text-xs leading-relaxed min-h-[600px] font-[system-ui]">
      {/* Header */}
      <div className="text-center border-b-2 border-gray-800 pb-4 mb-4">
        <h1 className="text-xl font-bold uppercase tracking-wide text-gray-900">
          {data.fullName || "Your Full Name"}
        </h1>
        {data.professionalTitle && (
          <p className="text-sm text-gray-600 mt-1">{data.professionalTitle}</p>
        )}
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2 text-gray-500 text-[10px]">
          {data.phone && data.phone !== "+254" && <span>{data.phone}</span>}
          {data.email && <span>{data.email}</span>}
          {data.location && <span>{data.location}, Kenya</span>}
          {data.linkedinUrl && <span>{data.linkedinUrl}</span>}
        </div>
        {(showDOB || showMarital || showReligion || showPassport || data.nationality) && (
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-1 text-gray-400 text-[10px]">
            {data.nationality && <span>Nationality: {data.nationality}</span>}
            {showDOB && data.dateOfBirth && <span>DOB: {data.dateOfBirth}</span>}
            {showMarital && data.maritalStatus && <span>{data.maritalStatus}</span>}
            {showReligion && data.religion && <span>{data.religion}</span>}
            {showPassport && data.passportNumber && <span>Passport: {data.passportNumber}</span>}
          </div>
        )}
      </div>

      {/* Summary */}
      {data.professionalSummary && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-300 pb-1 mb-2">
            Professional Summary
          </h2>
          <p className="text-gray-700 whitespace-pre-line">{data.professionalSummary}</p>
        </div>
      )}

      {/* Work Experience */}
      {data.workExperience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-300 pb-1 mb-2">
            Work Experience
          </h2>
          {data.workExperience.map((job) => (
            <div key={job.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <strong className="text-gray-900">{job.jobTitle || "Job Title"}</strong>
                <span className="text-gray-500 text-[10px]">
                  {job.startDate} — {job.isPresent ? "Present" : job.endDate}
                </span>
              </div>
              <p className="text-gray-600 italic">{job.company}{job.location ? `, ${job.location}` : ""}</p>
              {job.responsibilities.filter(Boolean).length > 0 && (
                <ul className="list-disc list-inside mt-1 text-gray-700 space-y-0.5">
                  {job.responsibilities.filter(Boolean).map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              )}
              {job.achievements && (
                <p className="mt-1 text-gray-700"><strong>Key Achievement:</strong> {job.achievements}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-300 pb-1 mb-2">
            Education
          </h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="mb-2">
              <div className="flex justify-between items-baseline">
                <strong className="text-gray-900">{edu.qualification}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}</strong>
                <span className="text-gray-500 text-[10px]">{edu.graduationYear}</span>
              </div>
              <p className="text-gray-600 italic">{edu.institution}</p>
              {edu.grade && <p className="text-gray-500 text-[10px]">{edu.grade}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {(data.hardSkills.length > 0 || data.softSkills.length > 0) && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-300 pb-1 mb-2">
            Skills
          </h2>
          {data.hardSkills.length > 0 && (
            <p className="text-gray-700"><strong>Technical:</strong> {data.hardSkills.join(" • ")}</p>
          )}
          {data.softSkills.length > 0 && (
            <p className="text-gray-700 mt-1"><strong>Soft Skills:</strong> {data.softSkills.join(" • ")}</p>
          )}
        </div>
      )}

      {/* Languages */}
      {data.languages.filter((l) => l.name).length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-300 pb-1 mb-2">
            Languages
          </h2>
          <p className="text-gray-700">
            {data.languages.filter((l) => l.name).map((l) => `${l.name} (${l.proficiency})`).join(" • ")}
          </p>
        </div>
      )}

      {/* Certifications */}
      {data.certifications.filter((c) => c.name).length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-300 pb-1 mb-2">
            Certifications
          </h2>
          {data.certifications.filter((c) => c.name).map((c, i) => (
            <p key={i} className="text-gray-700">{c.name}{c.issuer ? ` — ${c.issuer}` : ""}{c.year ? ` (${c.year})` : ""}</p>
          ))}
        </div>
      )}

      {/* References */}
      {data.references && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-300 pb-1 mb-2">
            References
          </h2>
          <p className="text-gray-700">{data.references}</p>
        </div>
      )}
    </div>
  );
}
