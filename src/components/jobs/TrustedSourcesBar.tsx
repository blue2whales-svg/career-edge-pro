import { motion } from "framer-motion";
import { Shield, CheckCircle2 } from "lucide-react";

const TRUSTED_SOURCES = [
  { name: "BrighterMonday", color: "text-orange-400" },
  { name: "LinkedIn Jobs", color: "text-blue-400" },
  { name: "Fuzu", color: "text-emerald-400" },
  { name: "MyJobMag", color: "text-purple-400" },
  { name: "ReliefWeb", color: "text-red-400" },
  { name: "UN Jobs", color: "text-sky-400" },
  { name: "PSC Kenya", color: "text-amber-400" },
  { name: "eCitizen", color: "text-green-400" },
  { name: "Safaricom Careers", color: "text-emerald-300" },
  { name: "KCB Careers", color: "text-blue-300" },
  { name: "Equity Careers", color: "text-amber-300" },
];

export function TrustedSourcesBar() {
  return (
    <section className="relative z-10 px-4 pb-6">
      <div className="container max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Trusted Job Sources
            </span>
            <span className="text-[10px] text-muted-foreground/70 ml-auto font-mono">
              Verified & Aggregated
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TRUSTED_SOURCES.map((source) => (
              <span
                key={source.name}
                className="inline-flex items-center gap-1 rounded-full border border-border/50 bg-background/60 px-2.5 py-1 text-[10px] font-medium text-muted-foreground hover:border-primary/30 transition-colors"
              >
                <CheckCircle2 className={`h-2.5 w-2.5 ${source.color} shrink-0`} />
                {source.name}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
