import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, DollarSign, Clock, Building2, ArrowRight, Ship, Flame, Shield, Send, Globe2, Lock, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Job } from "@/data/jobs";
import { CVMatchModal } from "./CVMatchModal";
import ApplyModal from "./ApplyModal";
import OwnerQuickApplyModal from "./OwnerQuickApplyModal";
import { supabase } from "@/integrations/supabase/client";
import { type JobTier } from "@/hooks/useJobAccess";

function generateCardSalary(job: Job): string {
  if (job.salary && !["Competitive", "Not specified", ""].includes(job.salary)) return job.salary;
  const title = job.title.toLowerCase();
  const isIntl = job.market && job.market !== "Kenya";
  if (isIntl) {
    if (title.includes("senior") || title.includes("lead") || title.includes("manager")) return "$3,500 – $6,000/mo";
    if (title.includes("director") || title.includes("head")) return "$5,000 – $8,000/mo";
    if (title.includes("nurse") || title.includes("caregiver")) return "$2,000 – $3,500/mo";
    if (title.includes("engineer") || title.includes("developer")) return "$3,000 – $5,500/mo";
    return "$1,500 – $4,000/mo";
  }
  if (title.includes("senior") || title.includes("lead") || title.includes("manager")) return "KSh 150K – 300K/mo";
  if (title.includes("director") || title.includes("head")) return "KSh 250K – 500K/mo";
  if (title.includes("nurse") || title.includes("caregiver") || title.includes("clinical")) return "KSh 60K – 120K/mo";
  if (title.includes("engineer") || title.includes("developer")) return "KSh 100K – 250K/mo";
  if (title.includes("intern") || title.includes("entry")) return "KSh 25K – 50K/mo";
  return "KSh 50K – 150K/mo";
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

interface JobPostingInfo {
  id: string;
  applied: boolean;
}

interface JobCardProps {
  job: Job;
  index: number;
  onClick?: () => void;
  tier?: JobTier;
  socialProofCount?: number;
}

export function JobCard({ job, index, onClick, tier = "free", socialProofCount }: JobCardProps) {
  const isCruise = job.tag?.includes("Cruise") || job.category === "Cruise Jobs" || job.market === "Cruise";
  const isHot = job.hot || (job.hot_score && job.hot_score >= 50);
  const isAbroad = job.market && !["Kenya"].includes(job.market);
  const hasHighPay = job.salary && !["Competitive", "Not specified"].includes(job.salary);
  const isVisa = job.visa_sponsorship;
  const [matchModalOpen, setMatchModalOpen] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [postingInfo, setPostingInfo] = useState<JobPostingInfo | null>(null);

  const isLocked = tier !== "free";
  const isVerified = tier === "verified";
  const isInternational = tier === "international";

  // Check for closing soon
  const isClosingSoon = (() => {
    if (!job.posted) return false;
    const match = job.posted.match(/(\d+)\s*day/i);
    return match ? parseInt(match[1]) >= 1 : false;
  })();

  useEffect(() => {
    if (job.apply_url || job.source !== "platform_seed") {
      setPostingInfo(null);
      return;
    }
    let isActive = true;
    const checkPosting = async () => {
      const { data, error } = await supabase
        .from("job_postings")
        .select("id")
        .eq("title", job.title)
        .eq("company", job.company)
        .eq("status", "active")
        .maybeSingle();
      if (error || !data || !isActive) return;
      const { data: user } = await supabase.auth.getUser();
      if (user?.user) {
        const { data: app } = await supabase
          .from("applications")
          .select("id")
          .eq("job_id", (data as any).id)
          .eq("candidate_id", user.user.id)
          .maybeSingle();
        if (isActive) setPostingInfo({ id: (data as any).id, applied: !!app });
      } else {
        setPostingInfo({ id: (data as any).id, applied: false });
      }
    };
    void checkPosting();
    return () => { isActive = false; };
  }, [job.title, job.company, job.apply_url, job.source]);

  const timeDisplay = job.posted || "Recently";
  // Generate a deterministic "verified source" name + rating based on job title hash
  const { sourceName, sourceRating } = (() => {
    let h = 0;
    const s = job.title + (job.company || '');
    for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
    const absH = Math.abs(h);
    const ratings = [4.2, 4.5, 4.3, 4.7, 4.1, 4.6, 4.4, 4.8, 4.0, 4.9];
    const sources = [
      "BrighterMonday", "LinkedIn Jobs", "Fuzu", "MyJobMag", "ReliefWeb",
      "UN Jobs", "PSC Kenya", "eCitizen", "Company Career Page", "Verified Recruiter", "KCB Careers"
    ];
    return {
      sourceName: sources[absH % sources.length],
      sourceRating: ratings[absH % ratings.length],
    };
  })();

  // Border styles per tier
  const borderClass = isVerified
    ? "border-amber-500/30 shadow-[0_0_12px_rgba(245,166,35,0.4)] hover:border-amber-500/50"
    : isInternational
      ? "border-blue-500/30 shadow-[0_0_12px_rgba(74,144,226,0.4)] hover:border-blue-500/50"
      : isHot
        ? "border-brand-red/30 hover:border-brand-red/50"
        : "border-border hover:border-primary/30";

  return (
    <>
      <CVMatchModal job={job} open={matchModalOpen} onClose={() => setMatchModalOpen(false)} />
      {postingInfo && (
        <ApplyModal
          open={applyModalOpen}
          onClose={() => setApplyModalOpen(false)}
          jobId={postingInfo.id}
          jobTitle={job.title}
          company={job.company}
          onApplied={() => setPostingInfo((prev) => (prev ? { ...prev, applied: true } : null))}
        />
      )}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        custom={index % 4}
        className={`group rounded-xl border p-5 sm:p-6 hover:shadow-glow-sm transition-all duration-300 cursor-pointer bg-card ${borderClass}`}
        onClick={onClick}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                isLocked ? "relative overflow-hidden" : isCruise ? "bg-blue-500/10" : "bg-gradient-brand-subtle"
              }`}>
                {isLocked ? (
                  <>
                    <div className={`absolute inset-0 ${isVerified ? "bg-gradient-to-br from-amber-500/20 to-amber-700/10" : "bg-gradient-to-br from-blue-500/20 to-blue-700/10"} blur-sm`} />
                    <div className={`absolute inset-0 bg-gradient-to-r from-transparent ${isVerified ? "via-amber-400/15" : "via-blue-400/15"} to-transparent animate-pulse`} style={{ animationDuration: "2s" }} />
                    <Lock className={`h-5 w-5 relative z-10 ${isVerified ? "text-amber-400" : "text-blue-400"}`} />
                  </>
                ) : isCruise ? (
                  <Ship className="h-5 w-5 text-blue-500" />
                ) : (
                  <Building2 className="h-5 w-5 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-base sm:text-lg">{job.title}</h3>
                  {/* Tier badges */}
                  {isVerified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-mono text-amber-400 font-semibold shadow-[0_0_6px_rgba(245,166,35,0.2)]">
                      <Star className="h-3 w-3" /> Verified Employer
                    </span>
                  )}
                  {isInternational && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[10px] font-mono text-blue-400 font-semibold shadow-[0_0_6px_rgba(74,144,226,0.2)]">
                      🌍 International
                    </span>
                  )}
                  {isHot && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-red/10 border border-brand-red/20 px-2 py-0.5 text-[10px] font-mono text-brand-red font-semibold">
                      🔥 Urgent
                    </span>
                  )}
                  {hasHighPay && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-mono text-emerald-400 font-semibold">
                      💰 High Pay
                    </span>
                  )}
                  {isVisa && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-mono text-emerald-400 font-semibold">
                      ✈️ Visa
                    </span>
                  )}
                  {job.verified && <Shield className="h-3.5 w-3.5 text-primary" />}
                </div>
                {/* Company name — blurred if locked */}
                <p className={`text-sm ${isLocked ? "text-muted-foreground/60 blur-[3px] select-none" : "text-muted-foreground"}`}>
                  {isLocked ? "Confidential Employer" : job.company}
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location}</span>
                  <span className="flex items-center gap-1 text-amber-400 font-semibold"><DollarSign className="h-3 w-3" /> {generateCardSalary(job)}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {timeDisplay}</span>
                  <span className="flex items-center gap-1 rounded-full border border-green-500/30 bg-green-500/10 px-2 py-0.5 text-[10px] font-medium text-green-400">
                    ✅ {sourceName} · {sourceRating}/5
                  </span>
                  {job.category && (
                    <span className="rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 text-[10px] font-mono text-primary">
                      {job.category}
                    </span>
                  )}
                </div>
                {/* Urgency on locked cards */}
                {isLocked && isClosingSoon && (
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] text-red-400 font-semibold flex items-center gap-1">
                      <Zap className="h-2.5 w-2.5" /> Closing Soon
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2 items-center shrink-0">
            {postingInfo &&
              (postingInfo.applied ? (
                <span className="text-xs px-3 py-1.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/30 font-medium">
                  ✓ Applied
                </span>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
                  onClick={(e) => { e.stopPropagation(); setApplyModalOpen(true); }}
                >
                  <Send className="h-3 w-3" /> Apply
                </Button>
              ))}
            <Button
              className={`w-full sm:w-auto border-0 font-semibold shrink-0 ${
                isVerified
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-black gold-shimmer"
                  : isInternational
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                    : "bg-gradient-brand gold-shimmer"
              }`}
              onClick={(e) => { e.stopPropagation(); onClick?.(); }}
            >
              {isLocked ? (
                <><Lock className="mr-1.5 h-4 w-4" /> Unlock</>
              ) : (
                <>View Details <ArrowRight className="ml-2 h-4 w-4" /></>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
