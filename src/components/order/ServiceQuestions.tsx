import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ServiceQuestionsProps {
  selectedServices: string[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
}

const CV_SERVICES = ["cv", "executive-cv", "ats-cv", "modern-cv", "international-cv"];

export default function ServiceQuestions({ selectedServices, values, onChange }: ServiceQuestionsProps) {
  const hasCV = selectedServices.some(s => CV_SERVICES.includes(s));
  const hasCoverLetter = selectedServices.includes("cover-letter");
  const hasPersonalStatement = selectedServices.includes("personal-statement");
  const hasScholarship = selectedServices.includes("scholarship");
  const hasReference = selectedServices.includes("reference");
  const hasLinkedIn = selectedServices.includes("linkedin");

  return (
    <div className="space-y-6">
      {/* CV-specific questions */}
      {hasCV && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">CV Details</h3>
          <Input
            placeholder="Target job title (e.g. Senior Software Engineer)"
            value={values.jobTitle || ""}
            onChange={(e) => onChange("jobTitle", e.target.value)}
            className="h-12 bg-card border-border"
          />
          <Textarea
            placeholder="Work experience — list your roles, companies, years, and key achievements..."
            value={values.experience || ""}
            onChange={(e) => onChange("experience", e.target.value)}
            className="min-h-[120px] bg-card border-border"
          />
          <Input
            placeholder="Key skills (e.g. Python, Project Management, Financial Analysis)"
            value={values.skills || ""}
            onChange={(e) => onChange("skills", e.target.value)}
            className="h-12 bg-card border-border"
          />
          <Input
            placeholder="Education (e.g. BSc Computer Science, University of Nairobi)"
            value={values.education || ""}
            onChange={(e) => onChange("education", e.target.value)}
            className="h-12 bg-card border-border"
          />
          {selectedServices.includes("international-cv") && (
            <Input
              placeholder="Target country/region (e.g. UK, UAE, Germany)"
              value={values.targetCountry || ""}
              onChange={(e) => onChange("targetCountry", e.target.value)}
              className="h-12 bg-card border-border"
            />
          )}
          {selectedServices.includes("executive-cv") && (
            <Textarea
              placeholder="Leadership achievements — boards, P&L responsibility, team sizes, strategic initiatives..."
              value={values.leadershipAchievements || ""}
              onChange={(e) => onChange("leadershipAchievements", e.target.value)}
              className="min-h-[100px] bg-card border-border"
            />
          )}
        </div>
      )}

      {/* Cover Letter questions */}
      {hasCoverLetter && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Cover Letter Details</h3>
          <Input
            placeholder="Company you're applying to"
            value={values.targetCompany || ""}
            onChange={(e) => onChange("targetCompany", e.target.value)}
            className="h-12 bg-card border-border"
          />
          <Input
            placeholder="Specific position/role you're applying for"
            value={values.coverLetterRole || ""}
            onChange={(e) => onChange("coverLetterRole", e.target.value)}
            className="h-12 bg-card border-border"
          />
          <Textarea
            placeholder="Why are you interested in this company/role? What makes you a strong fit?"
            value={values.coverLetterMotivation || ""}
            onChange={(e) => onChange("coverLetterMotivation", e.target.value)}
            className="min-h-[100px] bg-card border-border"
          />
          <Textarea
            placeholder="Key accomplishments you'd like highlighted in the letter..."
            value={values.coverLetterHighlights || ""}
            onChange={(e) => onChange("coverLetterHighlights", e.target.value)}
            className="min-h-[80px] bg-card border-border"
          />
        </div>
      )}

      {/* Personal Statement questions */}
      {hasPersonalStatement && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Personal Statement Details</h3>
          <Input
            placeholder="Programme/course you're applying for"
            value={values.programme || ""}
            onChange={(e) => onChange("programme", e.target.value)}
            className="h-12 bg-card border-border"
          />
          <Input
            placeholder="University/institution name"
            value={values.institution || ""}
            onChange={(e) => onChange("institution", e.target.value)}
            className="h-12 bg-card border-border"
          />
          <Textarea
            placeholder="Why do you want to study this subject? What sparked your interest?"
            value={values.subjectMotivation || ""}
            onChange={(e) => onChange("subjectMotivation", e.target.value)}
            className="min-h-[100px] bg-card border-border"
          />
          <Textarea
            placeholder="Relevant academic achievements, projects, or extracurricular activities..."
            value={values.academicAchievements || ""}
            onChange={(e) => onChange("academicAchievements", e.target.value)}
            className="min-h-[100px] bg-card border-border"
          />
          <Textarea
            placeholder="Your career goals — where do you see yourself after completing this programme?"
            value={values.careerGoals || ""}
            onChange={(e) => onChange("careerGoals", e.target.value)}
            className="min-h-[80px] bg-card border-border"
          />
        </div>
      )}

      {/* Scholarship Essay questions */}
      {hasScholarship && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Scholarship Essay Details</h3>
          <Input
            placeholder="Scholarship name (e.g. Mastercard Foundation, Chevening)"
            value={values.scholarshipName || ""}
            onChange={(e) => onChange("scholarshipName", e.target.value)}
            className="h-12 bg-card border-border"
          />
          <Input
            placeholder="Programme and university you're applying to"
            value={values.scholarshipProgramme || ""}
            onChange={(e) => onChange("scholarshipProgramme", e.target.value)}
            className="h-12 bg-card border-border"
          />
          <Textarea
            placeholder="Essay prompt/question (paste the exact prompt if available)"
            value={values.essayPrompt || ""}
            onChange={(e) => onChange("essayPrompt", e.target.value)}
            className="min-h-[80px] bg-card border-border"
          />
          <Textarea
            placeholder="Your background — challenges you've overcome, community involvement, leadership roles..."
            value={values.scholarshipBackground || ""}
            onChange={(e) => onChange("scholarshipBackground", e.target.value)}
            className="min-h-[100px] bg-card border-border"
          />
          <Textarea
            placeholder="How will this scholarship help you achieve your goals? What impact do you want to make?"
            value={values.scholarshipImpact || ""}
            onChange={(e) => onChange("scholarshipImpact", e.target.value)}
            className="min-h-[100px] bg-card border-border"
          />
          <Input
            placeholder="Word/character limit (if specified)"
            value={values.essayWordLimit || ""}
            onChange={(e) => onChange("essayWordLimit", e.target.value)}
            className="h-12 bg-card border-border"
          />
        </div>
      )}

      {/* Reference Letter questions */}
      {hasReference && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Reference Letter Details</h3>
          <Input
            placeholder="Who is the reference for? (your name or the person's name)"
            value={values.referenceName || ""}
            onChange={(e) => onChange("referenceName", e.target.value)}
            className="h-12 bg-card border-border"
          />
          <Input
            placeholder="Referee's name and title (e.g. Dr. Kamau, Head of Department)"
            value={values.refereeName || ""}
            onChange={(e) => onChange("refereeName", e.target.value)}
            className="h-12 bg-card border-border"
          />
          <Input
            placeholder="Your relationship with the referee (e.g. Supervisor for 3 years)"
            value={values.refereeRelationship || ""}
            onChange={(e) => onChange("refereeRelationship", e.target.value)}
            className="h-12 bg-card border-border"
          />
          <Input
            placeholder="Purpose of the reference (e.g. Job application at Safaricom, MSc admission)"
            value={values.referencePurpose || ""}
            onChange={(e) => onChange("referencePurpose", e.target.value)}
            className="h-12 bg-card border-border"
          />
          <Textarea
            placeholder="Key qualities, achievements, or projects the referee should mention..."
            value={values.referenceQualities || ""}
            onChange={(e) => onChange("referenceQualities", e.target.value)}
            className="min-h-[100px] bg-card border-border"
          />
        </div>
      )}

      {/* LinkedIn questions */}
      {hasLinkedIn && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">LinkedIn Profile Details</h3>
          <Input
            placeholder="Your current LinkedIn URL (if any)"
            value={values.linkedinUrl || ""}
            onChange={(e) => onChange("linkedinUrl", e.target.value)}
            className="h-12 bg-card border-border"
          />
          <Input
            placeholder="Industry/field you want to be found for"
            value={values.linkedinIndustry || ""}
            onChange={(e) => onChange("linkedinIndustry", e.target.value)}
            className="h-12 bg-card border-border"
          />
          <Textarea
            placeholder="What do you want your LinkedIn to achieve? (e.g. attract recruiters, build thought leadership, network)"
            value={values.linkedinGoals || ""}
            onChange={(e) => onChange("linkedinGoals", e.target.value)}
            className="min-h-[80px] bg-card border-border"
          />
        </div>
      )}

      {/* General additional notes — always shown */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Additional Notes</h3>
        <Textarea
          placeholder="Any other instructions, preferences, or context you'd like us to know..."
          value={values.details || ""}
          onChange={(e) => onChange("details", e.target.value)}
          className="min-h-[80px] bg-card border-border"
        />
      </div>
    </div>
  );
}
