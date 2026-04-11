import { motion } from "framer-motion";
import { Lock, MapPin, Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { useJobs } from "@/hooks/useJobs";
import { useIsInternational } from "@/hooks/useIsInternational";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

export function JobPreviewSection() {
  const { data, isLoading } = useJobs();
  const { isInternational } = useIsInternational();
  const jobs = data?.jobs ?? [];

  // Prioritize Kenya jobs for local visitors, international/remote for others
  const prioritized = isInternational
    ? [...jobs].sort((a, b) => {
        const aIntl = a.market !== "Kenya" ? 1 : 0;
        const bIntl = b.market !== "Kenya" ? 1 : 0;
        return bIntl - aIntl;
      })
    : [...jobs].sort((a, b) => {
        const aKe = a.market === "Kenya" ? 1 : 0;
        const bKe = b.market === "Kenya" ? 1 : 0;
        return bKe - aKe;
      });

  const visible = prioritized.slice(0, 3);
  const locked = prioritized.slice(3, 7);

  return (
    <section className="relative z-10 py-16 sm:py-24 px-4">
      <div className="container max-w-5xl mx-auto">
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="text-primary font-mono text-sm text-center mb-3 tracking-wider uppercase"
        >
          Job Board
        </motion.p>
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={1}
          className="text-3xl sm:text-5xl font-serif font-bold text-center mb-12"
        >
          Real Jobs. <span className="text-gradient">Right Now.</span>
        </motion.h2>

        {/* Visible jobs */}
        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          {isLoading
            ? [...Array(3)].map((_, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-5">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2 mb-2" />
                  <Skeleton className="h-3 w-2/3 mb-3" />
                  <Skeleton className="h-3 w-24" />
                </div>
              ))
            : visible.map((job, i) => (
                <motion.div
                  key={`${job.title}-${job.company}-${i}`}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i + 2}
                  className="rounded-xl border border-border bg-card p-5"
                >
                  <h3 className="font-semibold text-sm mb-2 line-clamp-1">{job.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <Building2 className="h-3 w-3" />
                    <span className="line-clamp-1">{job.company}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                    <MapPin className="h-3 w-3" />
                    <span className="line-clamp-1">{job.location}</span>
                  </div>
                  <span className="text-xs font-mono text-primary">{job.salary || "Competitive"}</span>
                  <span className="text-[9px] text-green-400 mt-1 block">✅ {["BrighterMonday","LinkedIn Jobs","Fuzu","MyJobMag","PSC Kenya"][i % 5]}</span>
                </motion.div>
              ))}
        </div>

        {/* Locked/blurred jobs */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-5">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2 mb-2" />
                <Skeleton className="h-3 w-2/3 mb-3" />
                <Skeleton className="h-3 w-20" />
              </div>
            ))}
          </div>
        ) : locked.length > 0 ? (
          <div className="relative">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 blur-[6px] select-none pointer-events-none">
              {locked.map((job, i) => (
                <div key={`${job.title}-${job.company}-${i}`} className="rounded-xl border border-border bg-card p-5">
                  <h3 className="font-semibold text-sm mb-2">{job.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <Building2 className="h-3 w-3" />
                    <span>{job.company}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                    <MapPin className="h-3 w-3" />
                    <span>{job.location}</span>
                  </div>
                  <span className="text-xs font-mono text-primary">{job.salary || "Competitive"}</span>
                </div>
              ))}
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground mb-4 text-center max-w-xs">
                Upgrade your CV to unlock all verified listings
              </p>
              <Link to="/order">
                <Button className="bg-gradient-brand border-0 font-semibold shadow-glow gold-shimmer">
                  Unlock All Jobs → Get My CV
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground mb-4">More live jobs are loading on the full jobs board.</p>
            <Link to="/jobs">
              <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                Browse Live Jobs <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
