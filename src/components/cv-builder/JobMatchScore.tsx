import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Loader2, Sparkles, CheckCircle2, XCircle, ArrowRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CVData } from "./types";

interface MatchResult {
  matchScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  matchedSkills: string[];
  missingSkills: string[];
  potentialScore: number;
  summary: string;
  recommendations: string[];
}

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const raf = useRef<number>();
  useEffect(() => {
    if (!target) { setValue(0); return; }
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setValue(Math.round(target * t));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target, duration]);
  return value;
}

function cvDataToText(data: CVData): string {
  const parts = [
    data.fullName, data.professionalTitle, data.professionalSummary,
    ...data.hardSkills, ...data.softSkills,
    ...data.workExperience.map(w => `${w.jobTitle} ${w.company} ${w.responsibilities.join(" ")} ${w.achievements}`),
    ...data.education.map(e => `${e.qualification} ${e.fieldOfStudy} ${e.institution}`),
    ...data.certifications.map(c => `${c.name} ${c.issuer}`),
    ...data.languages.map(l => l.name),
  ];
  return parts.filter(Boolean).join("\n");
}

function getScoreColor(score: number) {
  if (score >= 80) return { ring: "stroke-green-500", text: "text-green-400", bg: "bg-green-500/10" };
  if (score >= 50) return { ring: "stroke-yellow-500", text: "text-yellow-400", bg: "bg-yellow-500/10" };
  return { ring: "stroke-red-500", text: "text-red-400", bg: "bg-red-500/10" };
}

export default function JobMatchScore({
  data,
  onOptimize,
}: {
  data: CVData;
  onOptimize: () => void;
}) {
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MatchResult | null>(null);

  const animatedScore = useCountUp(result?.matchScore ?? 0);
  const animatedPotential = useCountUp(result?.potentialScore ?? 0);
  const scoreColors = getScoreColor(result?.matchScore ?? 0);

  const analyze = useCallback(async () => {
    const cvText = cvDataToText(data);
    if (!jobDescription.trim()) { toast.error("Paste a job description first"); return; }
    if (cvText.trim().length < 50) { toast.error("Add more CV details first (skills, experience, etc.)"); return; }
    setLoading(true);
    try {
      const { data: res, error } = await supabase.functions.invoke("ai-generate", {
        body: { type: "job-match", data: { jobDescription, cvText } },
      });
      if (error) throw error;
      const parsed = JSON.parse(res.content);
      setResult(parsed);
    } catch (e: any) {
      toast.error(e.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  }, [data, jobDescription]);

  const circumference = 2 * Math.PI * 54;
  const offset = result ? circumference - (circumference * (result.matchScore / 100)) : circumference;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <Target className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-serif font-bold">Job Match Score</h3>
      </div>

      {!result && !loading && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Paste a job description below to see how well your CV matches.
          </p>
          <Textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={8}
            placeholder="Paste the full job description here..."
            className="bg-background/50"
          />
          <Button
            onClick={analyze}
            disabled={!jobDescription.trim()}
            className="w-full h-12 bg-gradient-brand border-0 font-semibold text-base gold-shimmer"
          >
            <Target className="h-4 w-4 mr-2" /> Analyze Match
          </Button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center py-10 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Analyzing job match...</p>
        </div>
      )}

      <AnimatePresence>
        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            {/* Score ring */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                  <motion.circle
                    cx="60" cy="60" r="54" fill="none"
                    className={scoreColors.ring}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-3xl font-bold ${scoreColors.text}`}>{animatedScore}%</span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Match</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground text-center max-w-xs">{result.summary}</p>
            </div>

            {/* Matched keywords */}
            {result.matchedKeywords.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-green-400 mb-2 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Matched Keywords ({result.matchedKeywords.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {result.matchedKeywords.map((kw, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/20">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Missing keywords */}
            {result.missingKeywords.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-red-400 mb-2 flex items-center gap-1">
                  <XCircle className="h-3.5 w-3.5" /> Missing Keywords ({result.missingKeywords.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {result.missingKeywords.map((kw, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/20">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Missing skills */}
            {result.missingSkills.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-amber-400 mb-2 flex items-center gap-1">
                  <XCircle className="h-3.5 w-3.5" /> Missing Skills ({result.missingSkills.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {result.missingSkills.map((kw, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {result.recommendations?.length > 0 && (
              <div className="rounded-xl border border-border bg-muted/30 p-3 space-y-1.5">
                <p className="text-xs font-semibold text-muted-foreground">Quick Wins</p>
                {result.recommendations.map((r, i) => (
                  <p key={i} className="text-xs text-muted-foreground">• {r}</p>
                ))}
              </div>
            )}

            {/* Upgrade prompt */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="rounded-2xl border border-primary/30 bg-gradient-to-br from-[hsl(var(--card))] to-primary/5 p-5 text-center space-y-3"
            >
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="font-serif font-bold text-lg">
                  Improve to <span className="text-primary">{animatedPotential}%</span>
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Unlock Premium Optimization — AI rewrites your CV specifically for this job, adding missing keywords and maximizing ATS compatibility.
              </p>
              <Button onClick={onOptimize} className="bg-gradient-brand border-0 font-semibold gold-shimmer h-12 px-8">
                <Lock className="h-4 w-4 mr-2" /> Optimize My CV for This Job <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </motion.div>

            {/* Re-analyze */}
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs text-muted-foreground"
              onClick={() => { setResult(null); }}
            >
              Try a different job description
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
