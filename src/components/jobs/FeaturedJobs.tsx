import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, DollarSign, Clock, Building2, ArrowRight, Flame, Ship } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FEATURED_JOBS, type Job } from "@/data/jobs";
import { JobDetailModal } from "./JobDetailModal";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

export function FeaturedJobs() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  return (
    <>
    <JobDetailModal job={selectedJob} open={!!selectedJob} onOpenChange={(open) => !open && setSelectedJob(null)} />
    <section className="relative z-10 pb-8 px-4">
      <div className="container max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-brand-red animate-pulse" />
            <h2 className="text-xl sm:text-2xl font-serif font-bold">Hot Jobs Abroad</h2>
          </div>
          <span className="rounded-full bg-brand-red/10 border border-brand-red/20 px-3 py-1 text-[11px] font-mono text-brand-red">
            Updated hourly
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_JOBS.map((job, i) => (
            <motion.div
              key={i}
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              className="group rounded-xl border-2 border-brand-red/20 bg-card p-5 hover:border-brand-red/40 hover:shadow-glow-sm transition-all duration-300 relative overflow-hidden"
            >
              {/* Hot badge */}
              <div className="absolute top-3 right-3">
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-red/10 border border-brand-red/20 px-2.5 py-1 text-[10px] font-mono text-brand-red font-semibold">
                  {job.tag?.includes("Cruise") ? <Ship className="h-3 w-3" /> : <Flame className="h-3 w-3" />}
                  {job.tag}
                </span>
              </div>

              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-brand-red/10 flex items-center justify-center shrink-0 mt-0.5">
                  {job.tag?.includes("Cruise") ? (
                    <Ship className="h-4 w-4 text-brand-red" />
                  ) : (
                    <Building2 className="h-4 w-4 text-brand-red" />
                  )}
                </div>
                <div className="min-w-0 pr-16">
                  <h3 className="font-semibold text-sm leading-tight">{job.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{job.company}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" /> {job.salary}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {job.posted}
                </span>
              </div>

              <Link to="/order" className="block">
                <Button size="sm" className="w-full bg-gradient-brand border-0 font-semibold text-xs gold-shimmer">
                  Get CV for this role <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
