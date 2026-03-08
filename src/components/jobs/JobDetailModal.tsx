import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, DollarSign, Clock, Building2, Ship, Flame, ArrowRight, CheckCircle2, Briefcase, GraduationCap, Star } from "lucide-react";
import { Link } from "react-router-dom";
import type { Job } from "@/data/jobs";

function generateRequirements(job: Job): string[] {
  const reqs: string[] = [];
  const { industry, title, tag, type } = job;

  // Industry-specific qualifications
  if (industry === "Cruise & Hospitality") {
    reqs.push("Valid passport with 12+ months validity");
    if (tag?.includes("Cruise")) {
      reqs.push("STCW certification (Basic Safety Training)");
      reqs.push("ENG1 / Pre-employment medical certificate");
    }
    reqs.push("Minimum 2 years experience in hospitality or related field");
    reqs.push("Excellent communication skills in English");
    if (title.toLowerCase().includes("chef") || title.toLowerCase().includes("cook")) {
      reqs.push("Culinary diploma or equivalent professional certification");
    }
    if (title.toLowerCase().includes("nurse")) {
      reqs.push("Registered nursing license valid internationally");
    }
  } else if (industry === "Healthcare") {
    reqs.push("Relevant medical degree or nursing diploma");
    reqs.push("Valid professional license / registration");
    reqs.push("Minimum 2–3 years clinical experience");
    reqs.push("BLS / ACLS certification preferred");
  } else if (industry === "Engineering" || industry === "Oil & Gas") {
    reqs.push("Bachelor's degree in relevant engineering discipline");
    reqs.push("3–5 years industry experience minimum");
    reqs.push("Professional certifications (PMP, HSE, etc.) an advantage");
    reqs.push("Willingness to work in field / remote locations");
  } else if (industry === "Technology") {
    reqs.push("Degree in Computer Science, IT, or related field");
    reqs.push("3+ years hands-on experience with modern tech stack");
    reqs.push("Strong problem-solving and analytical skills");
  } else if (industry === "Finance") {
    reqs.push("Degree in Finance, Accounting, or Business Administration");
    reqs.push("CPA, ACCA, or CFA qualification preferred");
    reqs.push("3+ years experience in a financial role");
  } else {
    reqs.push("Relevant degree or professional qualification");
    reqs.push("2+ years experience in a similar role");
    reqs.push("Strong communication and organizational skills");
  }

  if (type === "Full-time" && tag?.includes("Gulf")) {
    reqs.push("Willingness to relocate to the Gulf region");
  }

  if (title.toLowerCase().includes("fresh graduate") || title.toLowerCase().includes("welcome")) {
    // Remove experience requirements for fresh grad roles
    return reqs.filter(r => !r.toLowerCase().includes("years experience")).concat(["Fresh graduates are encouraged to apply"]);
  }

  return reqs;
}

function generateBenefits(job: Job): string[] {
  const benefits: string[] = [];
  const { tag, salary, industry } = job;

  if (tag?.includes("Cruise")) {
    benefits.push("Free accommodation & meals onboard");
    benefits.push("Travel the world while earning");
    benefits.push("International work experience");
    benefits.push("Contract completion bonus");
  } else if (tag?.includes("Gulf")) {
    benefits.push("Tax-free salary");
    benefits.push("Housing allowance or accommodation provided");
    benefits.push("Annual flight tickets home");
    benefits.push("Medical insurance covered");
  } else {
    benefits.push("Competitive salary package");
    benefits.push("Health insurance & benefits");
    benefits.push("Career growth opportunities");
  }

  if (salary.includes("tips")) {
    benefits.push("Additional tips & service charges");
  }

  return benefits;
}

export function JobDetailModal({ job, open, onOpenChange }: { job: Job | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  if (!job) return null;

  const isCruise = job.tag?.includes("Cruise");
  const isGulf = job.tag?.includes("Gulf");
  const requirements = generateRequirements(job);
  const benefits = generateBenefits(job);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto p-0 gap-0">
        {/* Header */}
        <div className={`p-6 pb-4 border-b border-border ${
          isCruise ? "bg-blue-500/5" : isGulf ? "bg-brand-red/5" : "bg-gradient-brand-subtle"
        }`}>
          <DialogHeader>
            <div className="flex items-start gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                isCruise ? "bg-blue-500/10" : isGulf ? "bg-brand-red/10" : "bg-primary/10"
              }`}>
                {isCruise ? (
                  <Ship className="h-6 w-6 text-blue-500" />
                ) : (
                  <Building2 className="h-6 w-6 text-primary" />
                )}
              </div>
              <div>
                <DialogTitle className="text-lg font-serif leading-tight">{job.title}</DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">{job.company}</p>
                {job.tag && (
                  <span className={`inline-flex items-center gap-1 mt-2 rounded-full border px-2.5 py-0.5 text-[11px] font-mono font-semibold ${
                    isCruise ? "border-blue-500/20 text-blue-400 bg-blue-500/10" : isGulf ? "border-brand-red/20 text-brand-red bg-brand-red/10" : "border-border"
                  }`}>
                    {isCruise ? <Ship className="h-3 w-3" /> : <Flame className="h-3 w-3" />}
                    {job.tag}
                  </span>
                )}
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6">
          {/* Key Details */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <MapPin className="h-3.5 w-3.5" /> Location
              </div>
              <p className="text-sm font-medium">{job.location}</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <DollarSign className="h-3.5 w-3.5" /> Salary
              </div>
              <p className="text-sm font-medium">{job.salary}</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <Briefcase className="h-3.5 w-3.5" /> Type
              </div>
              <p className="text-sm font-medium">{job.type}</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <Clock className="h-3.5 w-3.5" /> Posted
              </div>
              <p className="text-sm font-medium">{job.posted}</p>
            </div>
          </div>

          {/* Requirements */}
          <div>
            <h4 className="flex items-center gap-2 text-sm font-semibold mb-3">
              <GraduationCap className="h-4 w-4 text-primary" /> Qualifications & Requirements
            </h4>
            <ul className="space-y-2">
              {requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  {req}
                </li>
              ))}
            </ul>
          </div>

          {/* Benefits */}
          <div>
            <h4 className="flex items-center gap-2 text-sm font-semibold mb-3">
              <Star className="h-4 w-4 text-brand-red" /> Why This Role
            </h4>
            <ul className="space-y-2">
              {benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Star className="h-3.5 w-3.5 text-brand-red shrink-0 mt-0.5" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* Description (for live jobs) */}
          {job.description && (
            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold mb-3">
                <Briefcase className="h-4 w-4 text-primary" /> Job Description
              </h4>
              <p className="text-sm text-muted-foreground whitespace-pre-line line-clamp-6">{job.description}</p>
            </div>
          )}

          {/* Apply direct link for live jobs */}
          {(job as any).apply_url && (
            <a href={(job as any).apply_url} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="w-full mb-2">
                Apply Directly on Company Site <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          )}

          {/* Urgency + CTA */}
          <div className="rounded-xl border border-primary/20 bg-gradient-brand-subtle p-5 text-center space-y-3">
            <p className="text-sm font-semibold">
              🔥 Employers are hiring <span className="text-primary">NOW</span> — don't miss this opportunity
            </p>
            <p className="text-xs text-muted-foreground">
              A professionally crafted CV tailored to this exact role increases your chances by up to 3×. Our specialists know what {job.company} is looking for.
            </p>
            <Link to="/order" onClick={() => onOpenChange(false)}>
              <Button size="lg" className="w-full bg-gradient-brand border-0 font-semibold h-12 shadow-glow gold-shimmer mt-2">
                Get My CV for This Role <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="text-[10px] text-muted-foreground">Delivery in 24 hours · Unlimited revisions · ATS-optimised</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
