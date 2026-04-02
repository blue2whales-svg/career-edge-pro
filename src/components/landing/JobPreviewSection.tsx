import { motion } from "framer-motion";
import { Lock, MapPin, Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

export function JobPreviewSection() {
  const { data: jobs = [] } = useQuery({
    queryKey: ["landing-job-preview"],
    queryFn: async () => {
      const { data } = await supabase
        .from("cached_jobs")
        .select("title, company, location, salary")
        .eq("is_active", true)
        .order("discovered_at", { ascending: false })
        .limit(7);
      return data || [];
    },
    staleTime: 60_000,
  });

  const visible = jobs.slice(0, 3);
  const locked = jobs.slice(3, 7);
  // If not enough real jobs, pad with placeholders
  const placeholderLocked = [
    { title: "Operations Manager", company: "Global Corp", location: "Dubai, UAE", salary: "AED 12,000/mo" },
    { title: "Registered Nurse", company: "NHS Trust", location: "London, UK", salary: "£32,000/yr" },
    { title: "Hotel Receptionist", company: "Cruise Line Ltd", location: "At Sea", salary: "$2,200/mo" },
    { title: "Software Engineer", company: "Tech Kenya", location: "Nairobi", salary: "KES 180,000/mo" },
  ];
  const lockedJobs = locked.length >= 4 ? locked : [...locked, ...placeholderLocked].slice(0, 4);

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
          {visible.map((job, i) => (
            <motion.div
              key={i}
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
            </motion.div>
          ))}
        </div>

        {/* Locked/blurred jobs */}
        <div className="relative">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 blur-[6px] select-none pointer-events-none">
            {lockedJobs.map((job, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-5">
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
          {/* Overlay */}
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
      </div>
    </section>
  );
}
