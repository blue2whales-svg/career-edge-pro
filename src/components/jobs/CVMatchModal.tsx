import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, AlertTriangle, Zap, PenLine, ArrowRight, Target, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getCVMatchScore, getScoreConfig, getSubScores } from "./cvMatchUtils";
import PesapalPaymentModal from "@/components/PesapalPaymentModal";
import type { Job } from "@/data/jobs";

interface CVMatchModalProps {
  job: Job | null;
  open: boolean;
  onClose: () => void;
}

function AnimatedRing({ score, config }: { score: number; config: ReturnType<typeof getScoreConfig> }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-[120px] h-[120px]">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
          <circle
            cx="60" cy="60" r={radius} fill="none"
            stroke={config.text}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 60 60)"
            style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold" style={{ color: config.text }}>{animatedScore}%</span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">Overall CV Match</p>
    </div>
  );
}

function BreakdownBar({ label, value, delay, color }: { label: string; value: number; delay: number; color: string }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 150 + delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted-foreground w-[130px] shrink-0">{label}</span>
      <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
        <div
          className="h-full rounded-full"
          style={{
            width: `${width}%`,
            background: color,
            transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      </div>
      <span className="text-xs font-mono w-[36px] text-right" style={{ color }}>{value}%</span>
    </div>
  );
}

export function CVMatchModal({ job, open, onClose }: CVMatchModalProps) {
  const [paymentOpen, setPaymentOpen] = useState(false);
  if (!job) return null;

  const jobKey = `${job.title}|${job.company}`;
  const score = getCVMatchScore(jobKey);
  const config = getScoreConfig(score);
  const sub = getSubScores(score);
  const isLow = score < 75;

  return (
    <>
    <PesapalPaymentModal open={paymentOpen} onClose={() => setPaymentOpen(false)} defaultPackage="professional" />
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="w-full max-w-[480px] rounded-2xl border border-border bg-card p-6 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="mb-6">
              <h3 className="font-serif font-bold text-lg">{job.title}</h3>
              <p className="text-sm text-muted-foreground">{job.company}</p>
              <p className="text-xs text-muted-foreground mt-1">Here's how your current CV stacks up</p>
            </div>

            {/* Score Ring */}
            <div className="flex justify-center mb-6">
              <AnimatedRing score={score} config={config} />
            </div>

            {/* Breakdown */}
            <div className="space-y-3 mb-6">
              <BreakdownBar label="Skills Match" value={sub.skills} delay={0} color={config.text} />
              <BreakdownBar label="Experience Level" value={sub.experience} delay={100} color={config.text} />
              <BreakdownBar label="ATS Keywords" value={sub.atsKeywords} delay={200} color={config.text} />
              <BreakdownBar label="Document Quality" value={sub.documentQuality} delay={300} color={config.text} />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mb-6">
              <Link to={`/optimize?job_title=${encodeURIComponent(job.title)}&company=${encodeURIComponent(job.company)}`} onClick={onClose} className="flex-1">
                <Button variant="outline" className="w-full text-xs h-9 gap-1">
                  <Target className="h-3 w-3" /> Optimize CV For This Job
                </Button>
              </Link>
              <Link to="/ats-checker" onClick={onClose} className="flex-1">
                <Button variant="outline" className="w-full text-xs h-9 gap-1">
                  <BarChart3 className="h-3 w-3" /> Full ATS Analysis
                </Button>
              </Link>
            </div>

            {/* Conditional CTA */}
            {isLow ? (
              <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-5 space-y-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    Your CV needs work to compete for this role. Recruiters shortlist the top 10% — make sure you're in it.
                  </p>
                </div>

                <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-blue-400" />
                    <span className="text-sm font-semibold">Professional Package</span>
                    <span className="ml-auto text-sm font-bold text-blue-400">KSh 5,500</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    {["CV rewrite for this job type", "ATS keyword optimization", "Cover letter included", "LinkedIn optimization", "Boosts your match score to 90%+"].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <Check className="h-3 w-3 text-blue-400 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={`/order?service=professional&job_title=${encodeURIComponent(job.title)}&company=${encodeURIComponent(job.company)}`}
                    onClick={onClose}
                  >
                    <Button onClick={() => { onClose(); setPaymentOpen(true); }} className="w-full font-bold text-sm h-11 border-0" style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)" }}>
                      ⚡ Upgrade My CV Now — KSh 5,500
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">Or start smaller:</p>
                  <Link to={`/order?service=cv&job_title=${encodeURIComponent(job.title)}`} onClick={onClose}>
                    <Button variant="outline" size="sm" className="text-xs h-8">Starter — KSh 2,500</Button>
                  </Link>
                  <Link to={`/order?service=executive&job_title=${encodeURIComponent(job.title)}`} onClick={onClose}>
                    <Button variant="outline" size="sm" className="text-xs h-8">Executive — KSh 10,500</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-5 space-y-4">
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    Strong match! Your CV is competitive for this role. Maximize your chances with a tailored cover letter.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Link
                    to={`/order?service=cover-letter&job_title=${encodeURIComponent(job.title)}&company=${encodeURIComponent(job.company)}`}
                    onClick={onClose}
                    className="flex-1"
                  >
                    <Button className="w-full font-semibold text-sm h-10 bg-gradient-brand border-0">
                      <PenLine className="h-4 w-4 mr-1.5" /> Get Cover Letter — KSh 1,500
                    </Button>
                  </Link>
                  {job.apply_url && (
                    <a href={job.apply_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                      <Button variant="outline" className="w-full font-semibold text-sm h-10">
                        Apply Now <ArrowRight className="h-4 w-4 ml-1.5" />
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
