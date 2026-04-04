import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { MapPin, DollarSign, Clock, Building2, Ship, Flame, ArrowRight, CheckCircle2, Briefcase, GraduationCap, Star, Globe2, Lock, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import type { Job } from "../../data/jobs";
import { useJobAccess } from "../../hooks/useJobAccess";
import { JobLockOverlay } from "./JobLockOverlay";
import { useMemo } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

/* ---------- helpers ---------- */

function generateRequirements(job: Job): string[] {
  const reqs: string[] = [];
  const { industry, title, tag, type } = job;
  if (industry === "Cruise & Hospitality") {
    reqs.push("Valid passport with 12+ months validity");
    if (tag?.includes("Cruise")) { reqs.push("STCW certification (Basic Safety Training)"); reqs.push("ENG1 / Pre-employment medical certificate"); }
    reqs.push("Minimum 2 years experience in hospitality or related field");
    reqs.push("Excellent communication skills in English");
    if (title.toLowerCase().includes("chef") || title.toLowerCase().includes("cook")) reqs.push("Culinary diploma or equivalent professional certification");
    if (title.toLowerCase().includes("nurse")) reqs.push("Registered nursing license valid internationally");
  } else if (industry === "Healthcare") { reqs.push("Relevant medical degree or nursing diploma","Valid professional license / registration","Minimum 2–3 years clinical experience","BLS / ACLS certification preferred"); }
  else if (industry === "Engineering" || industry === "Oil & Gas") { reqs.push("Bachelor's degree in relevant engineering discipline","3–5 years industry experience minimum","Professional certifications (PMP, HSE, etc.) an advantage","Willingness to work in field / remote locations"); }
  else if (industry === "Technology") { reqs.push("Degree in Computer Science, IT, or related field","3+ years hands-on experience with modern tech stack","Strong problem-solving and analytical skills"); }
  else if (industry === "Finance") { reqs.push("Degree in Finance, Accounting, or Business Administration","CPA, ACCA, or CFA qualification preferred","3+ years experience in a financial role"); }
  else if (industry === "Domestic & Housekeeping") { reqs.push("Previous experience in housekeeping, cleaning, or childcare","Good communication skills","Valid passport with 12+ months validity","Willingness to live-in (for residential positions)","Certificate of good conduct / police clearance"); }
  else { reqs.push("Relevant degree or professional qualification","2+ years experience in a similar role","Strong communication and organizational skills"); }
  if (type === "Full-time" && tag?.includes("Gulf")) reqs.push("Willingness to relocate to the Gulf region");
  if (title.toLowerCase().includes("fresh graduate") || title.toLowerCase().includes("welcome"))
    return reqs.filter(r => !r.toLowerCase().includes("years experience")).concat(["Fresh graduates are encouraged to apply"]);
  return reqs;
}

function generateBenefits(job: Job): string[] {
  const benefits: string[] = [];
  const { tag, salary } = job;
  if (tag?.includes("Cruise")) { benefits.push("Free accommodation & meals onboard","Travel the world while earning","International work experience","Contract completion bonus"); }
  else if (tag?.includes("Gulf")) { benefits.push("Tax-free salary","Housing allowance or accommodation provided","Annual flight tickets home","Medical insurance covered"); }
  else { benefits.push("Competitive salary package","Health insurance & benefits","Career growth opportunities"); }
  if (salary?.includes("tips")) benefits.push("Additional tips & service charges");
  return benefits;
}

function getDescriptionPreview(desc: string | undefined): string {
  if (!desc) return "";
  return desc.slice(0, 150) + (desc.length > 150 ? "..." : "");
}

function isPostedMoreThanOneDay(posted: string | undefined): boolean {
  if (!posted) return false;
  const match = posted.match(/(\d+)\s*(day|hour|minute)/i);
  if (!match) return false;
  const num = parseInt(match[1]);
  const unit = match[2].toLowerCase();
  if (unit.startsWith("day") && num >= 1) return true;
  return false;
}

function getDaysRemaining(posted: string | undefined): number {
  if (!posted) return 3;
  const match = posted.match(/(\d+)\s*day/i);
  if (!match) return 3;
  const daysPosted = parseInt(match[1]);
  return Math.max(1, 4 - daysPosted);
}

/* ---------- tag pill component ---------- */
function TagPill({ label, color, icon }: { label: string; color: "red" | "blue" | "green" | "amber" | "purple"; icon?: React.ReactNode }) {
  const colors = {
    red: "border-red-500/30 text-red-400 bg-red-500/10 shadow-[0_0_8px_rgba(239,68,68,0.2)]",
    blue: "border-blue-500/30 text-blue-400 bg-blue-500/10 shadow-[0_0_8px_rgba(59,130,246,0.2)]",
    green: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10 shadow-[0_0_8px_rgba(16,185,129,0.2)]",
    amber: "border-amber-500/30 text-amber-400 bg-amber-500/10 shadow-[0_0_8px_rgba(245,158,11,0.2)]",
    purple: "border-purple-500/30 text-purple-400 bg-purple-500/10 shadow-[0_0_8px_rgba(168,85,247,0.2)]",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-mono font-semibold transition-shadow ${colors[color]}`}>
      {icon}{label}
    </span>
  );
}

/* ---------- main modal ---------- */

export function JobDetailModal({ job, open, onOpenChange }: { job: Job | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  const { isUnlocked, canUseFreeUnlock, useFreeUnlock, isJobFreeUnlocked, freeUnlocksRemaining } = useJobAccess();

  const sessionSocialProof = useMemo(() => Math.floor(Math.random() * 51) + 30, []);

  if (!job) return null;
  const jobKey = `${job.title}|${job.company}`;
  const hasAccess = isUnlocked || isJobFreeUnlocked(jobKey);

  const isCruise = job.tag?.includes("Cruise");
  const isGulf = job.tag?.includes("Gulf");
  const requirements = generateRequirements(job);
  const benefits = generateBenefits(job);
  const sourceDisplay = job.source_label || job.source || "";
  const showUrgency = isPostedMoreThanOneDay(job.posted);
  const daysRemaining = getDaysRemaining(job.posted);

  const handleFreeUnlock = () => { useFreeUnlock(jobKey); };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 gap-0 border border-amber-500/10 bg-background/95 backdrop-blur-xl shadow-[0_0_40px_rgba(201,168,76,0.08)] sm:max-h-[85vh] sm:rounded-xl max-sm:!max-w-[100vw] max-sm:!h-[100dvh] max-sm:!max-h-[100dvh] max-sm:!rounded-none max-sm:!top-0 max-sm:!left-0 max-sm:!translate-x-0 max-sm:!translate-y-0 max-sm:!w-screen max-sm:data-[state=open]:animate-in max-sm:data-[state=open]:slide-in-from-bottom-full max-sm:data-[state=closed]:animate-out max-sm:data-[state=closed]:slide-out-to-bottom-full overflow-hidden">
        <div className="overflow-y-auto max-sm:h-[calc(100dvh-72px)] sm:max-h-[85vh]">
          {/* Urgency strip */}
          {showUrgency && (
            <div className="bg-red-600 text-white text-center py-2 px-4 text-xs font-bold flex items-center justify-center gap-2 animate-pulse">
              <Zap className="h-3.5 w-3.5" /> Closes in {daysRemaining} day{daysRemaining > 1 ? "s" : ""} — Act fast
            </div>
          )}

          {/* Header */}
          <div className={`p-5 pb-4 border-b border-border/50 ${isCruise ? "bg-blue-500/5" : isGulf ? "bg-amber-500/5" : "bg-gradient-to-br from-amber-500/5 to-transparent"}`}>
            <DialogHeader>
              <div className="flex items-start gap-3">
                {/* Icon / Shimmer logo placeholder */}
                <div className="relative w-14 h-14 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                  {!hasAccess ? (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-amber-700/10 blur-sm" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/15 to-transparent animate-pulse" style={{ animationDuration: "2s" }} />
                      <Lock className="h-6 w-6 text-amber-400 relative z-10" />
                    </>
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center ${isCruise ? "bg-blue-500/10" : "bg-primary/10"}`}>
                      {isCruise ? <Ship className="h-6 w-6 text-blue-500" /> : <Building2 className="h-6 w-6 text-primary" />}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <DialogTitle className="text-lg font-serif leading-tight">{job.title}</DialogTitle>
                  {hasAccess ? (
                    <p className="text-sm text-muted-foreground mt-1">{job.company}</p>
                  ) : (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="text-sm mt-1 flex items-center gap-1.5 cursor-help">
                            <span className="inline-flex items-center gap-1 text-amber-400 font-semibold">
                              <Lock className="h-3 w-3" /> Confidential Employer
                            </span>
                            <span className="text-muted-foreground">— Unlock to View</span>
                          </p>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-[260px] text-xs">
                          Top employers post confidentially to avoid candidate floods. Unlock to apply directly.
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  {/* Tags */}
                  <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                    {job.tag && (
                      <TagPill
                        label={job.tag}
                        color={isCruise ? "blue" : isGulf ? "amber" : "purple"}
                        icon={isCruise ? <Ship className="h-3 w-3" /> : <Flame className="h-3 w-3" />}
                      />
                    )}
                    {sourceDisplay && (
                      <TagPill label={sourceDisplay} color="blue" icon={<Globe2 className="h-2.5 w-2.5" />} />
                    )}
                    {job.hot && <TagPill label="Urgent Hiring" color="red" icon={<span>🔥</span>} />}
                    {(job.market && !["Kenya"].includes(job.market)) && <TagPill label="Abroad Opportunity" color="blue" icon={<span>🌍</span>} />}
                    {job.salary && !["Competitive", "Not specified"].includes(job.salary) && <TagPill label="High Paying" color="green" icon={<span>💰</span>} />}
                    {(job as any).visa_sponsorship && <TagPill label="Visa Sponsor" color="amber" icon={<span>✈️</span>} />}
                  </div>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* Info grid */}
          <div className="p-5 pb-3 space-y-4">
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { icon: <MapPin className="h-3.5 w-3.5" />, label: "Location", value: job.location },
                { icon: <DollarSign className="h-3.5 w-3.5" />, label: "Salary", value: job.salary },
                { icon: <Briefcase className="h-3.5 w-3.5" />, label: "Type", value: job.type },
                { icon: <Clock className="h-3.5 w-3.5" />, label: "Posted", value: job.posted },
              ].map((item, i) => (
                <div key={i} className="rounded-lg border border-border/50 bg-muted/20 backdrop-blur-sm p-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">{item.icon} {item.label}</div>
                  <p className="text-sm font-medium">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Description preview */}
            {job.description && (
              <div>
                <h4 className="flex items-center gap-2 text-sm font-semibold mb-2">
                  <Briefcase className="h-4 w-4 text-primary" /> Job Description
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {hasAccess ? job.description : getDescriptionPreview(job.description)}
                </p>
              </div>
            )}

            {/* Requirements */}
            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold mb-3">
                <GraduationCap className="h-4 w-4 text-primary" /> Qualifications & Requirements
              </h4>
              <ul className="space-y-2">
                {(hasAccess ? requirements : requirements.slice(0, 2)).map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    {req}
                  </li>
                ))}
                {!hasAccess && requirements.length > 2 && (
                  <li className="flex items-start gap-2 text-sm text-muted-foreground/50 italic">
                    <Lock className="h-4 w-4 shrink-0 mt-0.5 text-amber-500/50" />
                    +{requirements.length - 2} more requirements — unlock to see all
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Locked / Unlocked content */}
          <div className="relative">
            <div className={`px-5 pb-6 space-y-5 ${!hasAccess ? "blur-sm pointer-events-none select-none" : ""}`}>
              {hasAccess && (
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-semibold mb-3">
                    <Star className="h-4 w-4 text-amber-400" /> Why This Role
                  </h4>
                  <ul className="space-y-2">
                    {benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Star className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {hasAccess && (
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-2.5">
                  <p className="text-xs font-semibold text-primary">📋 How to Apply for This Role</p>
                  <ol className="space-y-1.5 text-[11px] text-muted-foreground list-decimal list-inside">
                    <li>Order a <strong className="text-foreground">CV + Cover Letter</strong> tailored for this role</li>
                    <li>Complete M-Pesa payment — documents ready in 24hrs</li>
                    <li>Download your docs in <strong className="text-foreground">PDF or MS Word</strong></li>
                    <li>The <strong className="text-foreground">direct application link</strong> unlocks after payment</li>
                  </ol>
                </div>
              )}

              <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-amber-500/5 to-transparent p-5 text-center space-y-3">
                <p className="text-sm font-semibold">🔥 Employers are hiring <span className="text-primary">NOW</span></p>
                <p className="text-xs text-muted-foreground">Get a professionally crafted CV tailored to this exact role.</p>
                <Link to={`/order?service=cv&job_title=${encodeURIComponent(job.title)}&company=${encodeURIComponent(job.company)}`} onClick={() => onOpenChange(false)}>
                  <Button size="lg" className="w-full bg-gradient-brand border-0 font-semibold h-12 shadow-glow gold-shimmer mt-2">
                    Get My CV for This Role <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <p className="text-[10px] text-muted-foreground">PDF & Word download · Direct apply link · ATS-optimised</p>
              </div>
            </div>

            {/* Lock overlay */}
            {!hasAccess && (
              <JobLockOverlay
                jobTitle={job.title}
                company={job.company}
                canUseFreeUnlock={canUseFreeUnlock}
                freeUnlocksRemaining={freeUnlocksRemaining}
                onFreeUnlock={handleFreeUnlock}
                socialProofCount={sessionSocialProof}
              />
            )}
          </div>
        </div>

        {/* Sticky mobile bottom bar */}
        {!hasAccess && (
          <div className="sm:hidden sticky bottom-0 left-0 right-0 z-30 border-t border-amber-500/20 bg-background/95 backdrop-blur-xl p-3">
            <Link to={`/order?service=cv&job_title=${encodeURIComponent(job.title)}&company=${encodeURIComponent(job.company)}`} onClick={() => onOpenChange(false)}>
              <Button className="w-full h-12 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold text-sm shadow-[0_0_20px_rgba(245,158,11,0.3)] animate-pulse" style={{ animationDuration: "3s" }}>
                <Lock className="h-4 w-4 mr-2" /> UNLOCK & APPLY <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
