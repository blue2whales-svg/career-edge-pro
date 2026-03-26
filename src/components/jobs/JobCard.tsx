import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, DollarSign, Clock, Building2, ArrowRight, Ship, Flame, Shield, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Job } from "@/data/jobs";
import { CVMatchBadge } from "./CVMatchBadge";
import { CVMatchModal } from "./CVMatchModal";
import ApplyModal from "./ApplyModal";
import { supabase } from "@/integrations/supabase/client";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

interface JobPostingInfo {
  id: string;
  applied: boolean;
}

export function JobCard({ job, index, onClick }: { job: Job; index: number; onClick?: () => void }) {
  const isCruise = job.tag?.includes("Cruise");
  const isGulf = job.tag?.includes("Gulf");
  const isVisa = job.visa_sponsorship;
  const isHot = job.hot || (job.hot_score && job.hot_score >= 50);
  const [matchModalOpen, setMatchModalOpen] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [postingInfo, setPostingInfo] = useState<JobPostingInfo | null>(null);
  const jobKey = `${job.title}|${job.company}`;

  // Check if this is a posted job (exists in job_postings)
  useEffect(() => {
    const checkPosting = async () => {
      const { data } = await supabase
        .from("job_postings")
        .select("id")
        .eq("title", job.title)
        .eq("company", job.company)
        .eq("status", "active")
        .maybeSingle();
      if (data) {
        const { data: user } = await supabase.auth.getUser();
        if (user?.user) {
          const { data: app } = await supabase
            .from("applications")
            .select("id")
            .eq("job_id", (data as any).id)
            .eq("candidate_id", user.user.id)
            .maybeSingle();
          setPostingInfo({ id: (data as any).id, applied: !!app });
        } else {
          setPostingInfo({ id: (data as any).id, applied: false });
        }
      }
    };
    checkPosting();
  }, [job.title, job.company]);

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
        onApplied={() => setPostingInfo(prev => prev ? { ...prev, applied: true } : null)}
      />
    )}
    <motion.div
      initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={index % 4}
      className={`group rounded-xl border p-5 sm:p-6 hover:shadow-glow-sm transition-all duration-300 cursor-pointer ${
        isHot
          ? "border-brand-red/30 bg-card hover:border-brand-red/50"
          : "border-border bg-card hover:border-primary/30"
      }`}
      onClick={onClick}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
              isCruise ? "bg-blue-500/10" : isGulf ? "bg-brand-red/10" : "bg-gradient-brand-subtle"
            }`}>
              {isCruise ? (
                <Ship className="h-5 w-5 text-blue-500" />
              ) : (
                <Building2 className="h-5 w-5 text-primary" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-base sm:text-lg">{job.title}</h3>
                {isHot && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-red/10 border border-brand-red/20 px-2 py-0.5 text-[10px] font-mono text-brand-red font-semibold">
                    <Flame className="h-3 w-3" /> HOT
                  </span>
                )}
                {isVisa && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-mono text-emerald-400 font-semibold">
                    ✈️ Visa
                  </span>
                )}
                {job.verified && (
                  <Shield className="h-3.5 w-3.5 text-primary" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">{job.company}</p>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" /> {job.salary}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {job.posted}
                </span>
                {job.tag && (
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-mono ${
                    isCruise ? "border-blue-500/20 text-blue-400" : isGulf ? "border-brand-red/20 text-brand-red" : "border-border"
                  }`}>
                    {job.tag}
                  </span>
                )}
                {job.category && (
                  <span className="rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 text-[10px] font-mono text-primary">
                    {job.category}
                  </span>
                )}
                <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-mono">
                  {job.industry}
                </span>
              </div>
              <div className="mt-2">
                <CVMatchBadge jobKey={jobKey} onClick={(e) => { e.stopPropagation(); setMatchModalOpen(true); }} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2 items-center shrink-0">
          {postingInfo && (
            postingInfo.applied ? (
              <span className="text-xs px-3 py-1.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/30 font-medium">✓ Applied</span>
            ) : (
              <Button size="sm" variant="outline" className="text-xs gap-1.5 border-primary/30 text-primary hover:bg-primary/10" onClick={(e) => { e.stopPropagation(); setApplyModalOpen(true); }}>
                <Send className="h-3 w-3" /> Apply
              </Button>
            )
          )}
          <Button className="w-full sm:w-auto bg-gradient-brand border-0 font-semibold gold-shimmer shrink-0" onClick={(e) => { e.stopPropagation(); onClick?.(); }}>
            View Details <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
    </>
  );
}
