import { useMemo } from "react";
import { motion } from "framer-motion";
import { Check, AlertCircle, ArrowRight } from "lucide-react";

interface CVData {
  fullName?: string;
  email?: string;
  phone?: string;
  summary?: string;
  experience?: any[];
  education?: any[];
  skills?: string[];
  certifications?: string;
  photo?: string;
}

interface CVCompletenessProps {
  data: CVData;
}

const SECTIONS = [
  { key: "contact", label: "Contact Info", weight: 10, check: (d: CVData) => !!(d.fullName && d.email && d.phone) },
  { key: "summary", label: "Professional Summary", weight: 15, check: (d: CVData) => !!(d.summary && d.summary.length > 30) },
  { key: "experience", label: "Work Experience", weight: 25, check: (d: CVData) => !!(d.experience && d.experience.length > 0) },
  { key: "education", label: "Education", weight: 15, check: (d: CVData) => !!(d.education && d.education.length > 0) },
  { key: "skills", label: "Skills", weight: 15, check: (d: CVData) => !!(d.skills && d.skills.length >= 3) },
  { key: "certifications", label: "Certifications", weight: 10, check: (d: CVData) => !!(d.certifications && d.certifications.length > 5) },
  { key: "photo", label: "Profile Photo", weight: 10, check: (d: CVData) => !!d.photo },
];

export function CVCompletenessScore({ data }: CVCompletenessProps) {
  const { score, completed, missing } = useMemo(() => {
    let s = 0;
    const comp: string[] = [];
    const miss: typeof SECTIONS = [];
    SECTIONS.forEach((sec) => {
      if (sec.check(data)) {
        s += sec.weight;
        comp.push(sec.key);
      } else {
        miss.push(sec);
      }
    });
    return { score: s, completed: comp, missing: miss };
  }, [data]);

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const scoreColor = score >= 80 ? "text-emerald-400" : score >= 50 ? "text-amber-400" : "text-red-400";
  const strokeColor = score >= 80 ? "#34d399" : score >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-xl border border-border bg-card p-5 space-y-4"
    >
      <h3 className="text-sm font-semibold">CV Completeness</h3>

      {/* Circular progress */}
      <div className="flex items-center justify-center">
        <div className="relative w-24 h-24">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
            <circle
              cx="48" cy="48" r={radius}
              fill="none" stroke={strokeColor} strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-xl font-bold ${scoreColor}`}>{score}%</span>
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-2">
        {SECTIONS.map((sec) => {
          const done = completed.includes(sec.key);
          return (
            <div key={sec.key} className={`flex items-center gap-2 text-xs ${done ? "text-muted-foreground" : "text-foreground"}`}>
              {done ? (
                <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              )}
              <span className={done ? "line-through" : "font-medium"}>{sec.label}</span>
              <span className="text-muted-foreground ml-auto">{sec.weight}%</span>
              {!done && (
                <button className="text-primary text-[10px] font-semibold flex items-center gap-0.5 hover:underline">
                  Add <ArrowRight className="h-2.5 w-2.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {score === 100 && (
        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-center">
          <p className="text-xs font-semibold text-emerald-400">🎉 Your CV is complete! Download now</p>
        </div>
      )}
    </motion.div>
  );
}
