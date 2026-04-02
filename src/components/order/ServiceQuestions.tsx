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
          
          {/* Page count selector */}
          <div>
            <label className="block text-sm text-muted-foreground mb-2">How many pages should your CV be?</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "1", label: "1 Page", desc: "Entry-level / concise" },
                { value: "2", label: "2 Pages", desc: "Most popular" },
                { value: "3", label: "3+ Pages", desc: "Senior / detailed" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange("cvPages", opt.value)}
                  className={cn(
                    "rounded-xl border p-3 text-left transition-all",
                    values.cvPages === opt.value
                      ? "border-primary bg-primary/10 ring-1 ring-primary"
                      : "border-border bg-card hover:border-primary/40"
                  )}
                >
                  <span className="block text-sm font-semibold">{opt.label}</span>
                  <span className="block text-[10px] text-muted-foreground mt-0.5">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

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
          <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">LinkedIn Profile Optimisation</h3>
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 mb-2 space-y-2">
            <p className="text-xs font-semibold text-foreground uppercase tracking-wide">✅ What you'll receive:</p>
            <ul className="text-xs text-muted-foreground space-y-1 leading-relaxed">
              <li>• <span className="text-foreground font-medium">Headline rewrite</span> — keyword-rich, recruiter search optimised</li>
              <li>• <span className="text-foreground font-medium">Full About section</span> — compelling story format that converts profile views to messages</li>
              <li>• <span className="text-foreground font-medium">Experience section</span> — every role rewritten with achievement-based bullets</li>
              <li>• <span className="text-foreground font-medium">Skills section</span> — top 50 keywords mapped to your industry for maximum discoverability</li>
              <li>• <span className="text-foreground font-medium">Education & Certifications</span> — fully optimised for search</li>
              <li>• <span className="text-foreground font-medium">Profile strength checklist</span> — photo, banner, URL, featured section tips</li>
              <li>• <span className="text-foreground font-medium">Networking & content strategy guide (PDF)</span> — how to grow from optimised profile</li>
            </ul>
          </div>

          {/* Section 1: Current Profile */}
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-1">Current Profile</p>
          <Input
            placeholder="Your current LinkedIn URL (e.g. linkedin.com/in/yourname)"
            value={values.linkedinUrl || ""}
            onChange={(e) => onChange("linkedinUrl", e.target.value)}
            className="h-12 bg-card border-border"
          />
          <Textarea
            placeholder="Paste your current LinkedIn headline (exactly as it appears now)..."
            value={values.linkedinCurrentHeadline || ""}
            onChange={(e) => onChange("linkedinCurrentHeadline", e.target.value)}
            className="min-h-[60px] bg-card border-border"
          />
          <Textarea
            placeholder="Paste your current About/Summary section (leave blank if you don't have one)..."
            value={values.linkedinCurrentAbout || ""}
            onChange={(e) => onChange("linkedinCurrentAbout", e.target.value)}
            className="min-h-[80px] bg-card border-border"
          />

          {/* Section 2: Role & Industry */}
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-1">Your Role & Industry</p>
          <Input
            placeholder="Current job title & company (e.g. Marketing Manager at Safaricom)"
            value={values.linkedinCurrentRole || ""}
            onChange={(e) => onChange("linkedinCurrentRole", e.target.value)}
            className="h-12 bg-card border-border"
          />
          <Input
            placeholder="Industry/field you want to be found for (e.g. Finance, Tech, Healthcare)"
            value={values.linkedinIndustry || ""}
            onChange={(e) => onChange("linkedinIndustry", e.target.value)}
            className="h-12 bg-card border-border"
          />
          <Input
            placeholder="Years of total experience (e.g. 5 years)"
            value={values.linkedinYearsExp || ""}
            onChange={(e) => onChange("linkedinYearsExp", e.target.value)}
            className="h-12 bg-card border-border"
          />
          <Input
            placeholder="Career stage (e.g. Entry-level, Mid-career, Senior, Executive, Career-changer)"
            value={values.linkedinCareerStage || ""}
            onChange={(e) => onChange("linkedinCareerStage", e.target.value)}
            className="h-12 bg-card border-border"
          />

          {/* Section 3: Goals & Target */}
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-1">Goals & Target Audience</p>
          <Textarea
            placeholder="What do you want LinkedIn to achieve? (e.g. attract Gulf recruiters, transition to product management, land consulting clients, build thought leadership)"
            value={values.linkedinGoals || ""}
            onChange={(e) => onChange("linkedinGoals", e.target.value)}
            className="min-h-[80px] bg-card border-border"
          />
          <Input
            placeholder="Target audience (e.g. HR managers in Dubai, tech recruiters in London, NGO hiring teams)"
            value={values.linkedinTargetAudience || ""}
            onChange={(e) => onChange("linkedinTargetAudience", e.target.value)}
            className="h-12 bg-card border-border"
          />
          <Input
            placeholder="Type of opportunity you're seeking (e.g. Full-time, Remote, Consulting, Relocation)"
            value={values.linkedinOpportunityType || ""}
            onChange={(e) => onChange("linkedinOpportunityType", e.target.value)}
            className="h-12 bg-card border-border"
          />
          <Input
            placeholder="Are you open to work? (Yes / No / Open but not publicly)"
            value={values.linkedinOpenToWork || ""}
            onChange={(e) => onChange("linkedinOpenToWork", e.target.value)}
            className="h-12 bg-card border-border"
          />

          {/* Section 4: Content for Writers */}
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-1">Content for Your Writers</p>
          <Textarea
            placeholder="Top 3-5 career achievements to highlight (with numbers where possible — e.g. 'Grew sales by 40%', 'Managed a team of 12', 'Raised KES 5M in funding')..."
            value={values.linkedinAchievements || ""}
            onChange={(e) => onChange("linkedinAchievements", e.target.value)}
            className="min-h-[110px] bg-card border-border"
          />
          <Textarea
            placeholder="Top skills & tools you want ranked for (e.g. Python, Financial Modelling, Stakeholder Management, Salesforce) — list as many as you can..."
            value={values.linkedinTopSkills || ""}
            onChange={(e) => onChange("linkedinTopSkills", e.target.value)}
            className="min-h-[80px] bg-card border-border"
          />
          <Textarea
            placeholder="Certifications, courses, or awards (e.g. CPA, PMP, Google Analytics, Coursera AI cert)..."
            value={values.linkedinCertifications || ""}
            onChange={(e) => onChange("linkedinCertifications", e.target.value)}
            className="min-h-[70px] bg-card border-border"
          />
          <Input
            placeholder="Education (e.g. BSc Finance, University of Nairobi, 2019)"
            value={values.linkedinEducation || ""}
            onChange={(e) => onChange("linkedinEducation", e.target.value)}
            className="h-12 bg-card border-border"
          />
          <Textarea
            placeholder="Describe your personality & tone preference for the profile (e.g. professional & formal, warm & approachable, bold & confident, thought-leader style)..."
            value={values.linkedinTone || ""}
            onChange={(e) => onChange("linkedinTone", e.target.value)}
            className="min-h-[70px] bg-card border-border"
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
