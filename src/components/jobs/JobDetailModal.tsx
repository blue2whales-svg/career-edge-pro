import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { MapPin, DollarSign, Clock, Building2, Ship, ArrowRight, CheckCircle2, Briefcase, GraduationCap, Star, Globe2, Lock, Zap, Bookmark } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import type { Job } from "../../data/jobs";
import { useJobAccess, type JobTier } from "../../hooks/useJobAccess";
import { JobLockOverlay } from "./JobLockOverlay";
import { useState, useMemo } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import JobUnlockSheet from "./JobUnlockSheet";

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
  else { reqs.push("Relevant degree or professional qualification","2+ years experience in a similar role","Strong communication and organizational skills"); }
  if (type === "Full-time" && tag?.includes("Gulf")) reqs.push("Willingness to relocate to the Gulf region");
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
  return match[2].toLowerCase().startsWith("day") && parseInt(match[1]) >= 1;
}

function getDaysRemaining(posted: string | undefined): number {
  if (!posted) return 3;
  const match = posted.match(/(\d+)\s*day/i);
  if (!match) return 3;
  return Math.max(1, 4 - parseInt(match[1]));
}

function TagPill({ label, color, icon }: { label: string; color: "red" | "blue" | "green" | "amber" | "purple"; icon?: React.ReactNode }) {
  const colors = {
    red: "border-red-500/30 text-red-400 bg-red-500/10 shadow-[0_0_8px_rgba(239,68,68,0.2)]",
    blue: "border-blue-500/30 text-blue-400 bg-blue-500/10 shadow-[0_0_8px_rgba(59,130,246,0.2)]",
    green: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10 shadow-[0_0_8px_rgba(16,185,129,0.2)]",
    amber: "border-amber-500/30 text-amber-400 bg-amber-500/10 shadow-[0_0_8px_rgba(245,158,11,0.2)]",
    purple: "border-purple-500/30 text-purple-400 bg-purple-500/10 shadow-[0_0_8px_rgba(168,85,247,0.2)]",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-mono font-semibold ${colors[color]}`}>
      {icon}{label}
    </span>
  );
}

export function JobDetailModal({ job, open, onOpenChange }: { job: Job | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  const { canUseFreeUnlock, useFreeUnlock, freeUnlocksRemaining, sessionSocialProof, getJobTier, hasJobAccess, refreshAccess, userId } = useJobAccess();
  const navigate = useNavigate();

  const [paymentMode, setPaymentMode] = useState<"single" | "pro" | null>(null);

  if (!job) return null;

  const jobKey = `${job.title}|${job.company}`;
  const jobId = (job as any).id || jobKey;
  const tier: JobTier = getJobTier(job.company, job.market, job.visa_sponsorship);
  const isFreeJob = tier === "free";
  const hasAccess = hasJobAccess(jobKey, jobId, tier);

  const isCruise = job.tag?.includes("Cruise");
  const requirements = generateRequirements(job);
  const benefits = generateBenefits(job);
  const sourceDisplay = job.source_label || job.source || "";
  const showUrgency = isPostedMoreThanOneDay(job.posted);
  const daysRemaining = getDaysRemaining(job.posted);
  const isInternational = tier === "international";
  const unlockPrice = isInternational ? "KSh 199" : "KSh 99";

  const handleFreeUnlock = () => { useFreeUnlock(jobKey); };

  const handleUnlockClick = () => {
    if (!userId) {
      navigate("/login?redirect=/jobs");
      onOpenChange(false);
      return;
    }
    setPaymentMode("single");
  };

  const handleProClick = () => {
    if (!userId) {
      navigate("/login?redirect=/jobs");
      onOpenChange(false);
      return;
    }
    setPaymentMode("pro");
  };

  const handlePaymentSuccess = () => {
    setPaymentMode(null);
    refreshAccess();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={`max-w-lg p-0 gap-0 bg-background/95 backdrop-blur-xl sm:max-h-[85vh] sm:rounded-xl max-sm:!max-w-[100vw] max-sm:!h-[100dvh] max-sm:!max-h-[100dvh] max-sm:!rounded-none max-sm:!top-0 max-sm:!left-0 max-sm:!translate-x-0 max-sm:!translate-y-0 max-sm:!w-screen max-sm:data-[state=open]:animate-in max-sm:data-[state=open]:slide-in-from-bottom-full max-sm:data-[state=closed]:animate-out max-sm:data-[state=closed]:slide-out-to-bottom-full overflow-hidden border ${
          isInternational
            ? "border-blue-500/20 shadow-[0_0_40px_rgba(74,144,226,0.08)]"
            : "border-amber-500/10 shadow-[0_0_40px_rgba(201,168,76,0.08)]"
        }`}>
          <div className="overflow-y-auto max-sm:h-[calc(100dvh-72px)] sm:max-h-[85vh]">
            {/* Urgency strip */}
            {showUrgency && (
              <div className="bg-red-600 text-white text-center py-2 px-4 text-xs font-bold flex items-center justify-center gap-2 animate-pulse">
                <Zap className="h-3.5 w-3.5" /> Closes in {daysRemaining} day{daysRemaining > 1 ? "s" : ""} — Act fast
              </div>
            )}

            {/* Header */}
            <div className={`p-5 pb-4 border-b border-border/50 ${
              isCruise ? "bg-blue-500/5" : isInternational ? "bg-blue-500/5" : "bg-gradient-to-br from-amber-500/5 to-transparent"
            }`}>
              <DialogHeader>
                <div className="flex items-start gap-3">
                  <div className="relative w-14 h-14 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                    {!hasAccess ? (
                      <>
                        <div className={`absolute inset-0 ${isInternational ? "bg-gradient-to-br from-blue-500/20 to-blue-700/10" : "bg-gradient-to-br from-amber-500/20 to-amber-700/10"} blur-sm`} />
                        <div className={`absolute inset-0 bg-gradient-to-r from-transparent ${isInternational ? "via-blue-400/15" : "via-amber-400/15"} to-transparent animate-pulse`} style={{ animationDuration: "2s" }} />
                        <Lock className={`h-6 w-6 relative z-10 ${isInternational ? "text-blue-400" : "text-amber-400"}`} />
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
                              <span className={`inline-flex items-center gap-1 font-semibold ${isInternational ? "text-blue-400" : "text-amber-400"}`}>
                                {isInternational ? "🌍" : "⭐"} <Lock className="h-3 w-3" /> Confidential {isInternational ? "International" : "Verified"} Employer
                              </span>
                            </p>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="max-w-[260px] text-xs">
                            Top employers post confidentially to control application volume. Unlock to apply directly.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                      {tier === "verified" && <TagPill label="Verified Employer" color="amber" icon={<Star className="h-3 w-3" />} />}
                      {tier === "international" && <TagPill label="International" color="blue" icon={<span>🌍</span>} />}
                      {job.hot && <TagPill label="Urgent Hiring" color="red" icon={<span>🔥</span>} />}
                      {job.salary && !["Competitive", "Not specified"].includes(job.salary) && <TagPill label="High Paying" color="green" icon={<span>💰</span>} />}
                      {job.visa_sponsorship && <TagPill label="Visa Sponsor" color="amber" icon={<span>✈️</span>} />}
                      {sourceDisplay && <TagPill label={sourceDisplay} color="blue" icon={<Globe2 className="h-2.5 w-2.5" />} />}
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

              {/* Description */}
              {job.description && (
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-semibold mb-2">
                    <Briefcase className="h-4 w-4 text-primary" /> Job Description
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {hasAccess ? job.description : getDescriptionPreview(job.description)}
                  </p>
                  {!hasAccess && job.description.length > 150 && (
                    <div className="h-8 bg-gradient-to-t from-background to-transparent -mt-8 relative z-10" />
                  )}
                </div>
              )}

              {/* Requirements */}
              <div>
                <h4 className="flex items-center gap-2 text-sm font-semibold mb-3">
                  <GraduationCap className="h-4 w-4 text-primary" /> Requirements
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
                      +{requirements.length - 2} more — unlock to see all
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
                      <Star className="h-4 w-4 text-amber-400" /> Benefits
                    </h4>
                    <ul className="space-y-2">
                      {benefits.map((b, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Star className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" /> {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {hasAccess && (
                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-2.5">
                    <p className="text-xs font-semibold text-primary">📋 How to Apply</p>
                    <ol className="space-y-1.5 text-[11px] text-muted-foreground list-decimal list-inside">
                      <li>Order a <strong className="text-foreground">CV + Cover Letter</strong> tailored for this role</li>
                      <li>Pay via M-Pesa — documents ready in 24hrs</li>
                      <li>Download in <strong className="text-foreground">PDF or Word</strong></li>
                      <li>The <strong className="text-foreground">direct apply link</strong> unlocks after payment</li>
                    </ol>
                  </div>
                )}

                {hasAccess && job.apply_url && (
                  <a href={job.apply_url} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold h-12 border-0">
                      Apply Now <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </a>
                )}

                <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-amber-500/5 to-transparent p-5 text-center space-y-3">
                  <p className="text-sm font-semibold">🔥 Employers hiring <span className="text-primary">NOW</span></p>
                  <Link to={`/order?service=cv&job_title=${encodeURIComponent(job.title)}&company=${encodeURIComponent(job.company)}`} onClick={() => onOpenChange(false)}>
                    <Button size="lg" className="w-full bg-gradient-brand border-0 font-semibold h-12 shadow-glow gold-shimmer mt-2">
                      Get CV for This Role <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>

              {!hasAccess && (
                <JobLockOverlay
                  jobTitle={job.title}
                  company={job.company}
                  canUseFreeUnlock={canUseFreeUnlock}
                  freeUnlocksRemaining={freeUnlocksRemaining}
                  onFreeUnlock={handleFreeUnlock}
                  socialProofCount={sessionSocialProof}
                  tier={tier}
                  onUnlockClick={handleUnlockClick}
                  onProClick={handleProClick}
                />
              )}
            </div>
          </div>

          {/* Sticky mobile bottom bar */}
          {!hasAccess && (
            <div className="sm:hidden sticky bottom-0 left-0 right-0 z-30 border-t border-amber-500/20 bg-background/95 backdrop-blur-xl p-3">
              <Button
                onClick={handleUnlockClick}
                className={`w-full h-12 font-bold text-sm animate-pulse border-0 ${
                  isInternational
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-[0_0_20px_rgba(74,144,226,0.3)]"
                    : "bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                }`}
                style={{ animationDuration: "3s" }}
              >
                <Lock className="h-4 w-4 mr-2" /> UNLOCK — {unlockPrice} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Sheet */}
      <JobUnlockSheet
        open={paymentMode !== null}
        onClose={() => setPaymentMode(null)}
        mode={paymentMode || "single"}
        jobTitle={job.title}
        jobId={jobId}
        company={job.company}
        tier={isInternational ? "international" : "verified"}
        onUnlocked={handlePaymentSuccess}
      />
    </>
  );
}
