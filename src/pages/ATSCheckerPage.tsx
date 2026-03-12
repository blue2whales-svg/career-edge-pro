import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, AlertTriangle, Check, Zap, Copy, Download, Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import PageLayout from "@/components/PageLayout";
import PesapalPaymentModal from "@/components/PesapalPaymentModal";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

function ScoreRing({ score }: { score: number }) {
  const [animated, setAnimated] = useState(0);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animated / 100) * circumference;
  const color = score >= 90 ? "#22c55e" : score >= 75 ? "#3b82f6" : score >= 50 ? "#eab308" : "#ef4444";
  const label = score >= 90 ? "🏆 Excellent CV" : score >= 75 ? "✅ Good — Minor Tweaks" : score >= 50 ? "🔶 Room for Improvement" : "⚠️ Needs Significant Work";

  useState(() => { setTimeout(() => setAnimated(score), 200); });

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-[160px] h-[160px]">
        <svg width="160" height="160" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
          <circle cx="80" cy="80" r={radius} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset} transform="rotate(-90 80 80)"
            style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)" }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold" style={{ color }}>{animated}</span>
          <span className="text-xs text-muted-foreground">/100</span>
        </div>
      </div>
      <p className="text-sm font-semibold">{label}</p>
    </div>
  );
}

export default function ATSCheckerPage() {
  const [cvText, setCvText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [showJobDesc, setShowJobDesc] = useState(false);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.match(/\.(pdf|docx|txt)$/i)) {
      toast.error("Please upload PDF, DOCX, or TXT files only");
      return;
    }
    setFileName(file.name);
    const text = await file.text();
    setCvText(text);
    toast.success(`${file.name} loaded`);
  };

  const analyze = async () => {
    if (cvText.length < 100) {
      toast.error("Please provide more CV content (at least 100 characters)");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("ai-generate", {
        body: { type: "ats-scan", data: { cvText, jobDescription: showJobDesc ? jobDescription : "" } },
      });
      if (error) throw error;
      const parsed = JSON.parse(data.content);
      setResult(parsed);
      toast.success("Analysis complete!");
    } catch (e: any) {
      toast.error(e.message || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <PesapalPaymentModal open={paymentOpen} onClose={() => setPaymentOpen(false)} defaultPackage="professional" />
      <section className="relative z-10 pt-16 sm:pt-24 pb-10 px-4">
        <div className="container max-w-4xl mx-auto">
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={0}
            className="text-3xl sm:text-5xl font-serif font-bold mb-3 text-center">
            ATS Resume <span className="text-gradient">Score Checker</span>
          </motion.h1>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1}
            className="rounded-xl p-3 mb-8 text-center text-sm" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
            📊 75% of CVs are rejected by ATS before a human sees them
          </motion.div>

          {!result && (
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2} className="rounded-2xl border border-border bg-card p-6">
              <Tabs defaultValue="paste">
                <TabsList className="mb-4">
                  <TabsTrigger value="upload">📄 Upload File</TabsTrigger>
                  <TabsTrigger value="paste">✏️ Paste Text</TabsTrigger>
                </TabsList>
                <TabsContent value="upload">
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-border/50 rounded-xl p-12 cursor-pointer hover:border-primary/30 transition-colors">
                    <Upload className="h-10 w-10 text-muted-foreground/40 mb-3" />
                    <p className="text-sm text-muted-foreground mb-1">Drag & drop or click to upload</p>
                    <p className="text-xs text-muted-foreground">PDF, DOCX, TXT</p>
                    {fileName && <p className="text-xs text-green-500 mt-2">✅ {fileName}</p>}
                    <input type="file" accept=".pdf,.docx,.txt" onChange={handleFileUpload} className="hidden" />
                  </label>
                </TabsContent>
                <TabsContent value="paste">
                  <Textarea value={cvText} onChange={(e) => setCvText(e.target.value)} rows={16} placeholder="Paste your CV text here..." />
                  <p className={`text-xs mt-1 ${cvText.length >= 400 ? "text-green-500" : "text-muted-foreground"}`}>
                    {cvText.length} characters {cvText.length >= 400 && "✅"}
                  </p>
                </TabsContent>
              </Tabs>

              <Collapsible open={showJobDesc} onOpenChange={setShowJobDesc} className="mt-4">
                <CollapsibleTrigger className="text-sm text-primary hover:underline">
                  🎯 Add target job description (improves accuracy)
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} rows={6} placeholder="Paste the job description..." className="mt-2" />
                </CollapsibleContent>
              </Collapsible>

              <Button onClick={analyze} disabled={loading || cvText.length < 100} className="w-full h-12 mt-6 font-bold border-0 bg-gradient-brand gold-shimmer">
                {loading ? "Analyzing..." : "🔍 Analyze My CV"}
              </Button>
              {loading && <Progress value={65} className="mt-3 h-1.5" />}
            </motion.div>
          )}

          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Score */}
              <div className="rounded-2xl border border-border bg-card p-6 text-center">
                <ScoreRing score={result.overallScore} />
                <p className="text-sm text-muted-foreground mt-3">{result.verdict}</p>
              </div>

              {/* Category Bars */}
              <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                <h3 className="font-semibold text-sm mb-3">Detailed Breakdown</h3>
                {Object.values(result.categories as Record<string, any>).map((cat: any, i: number) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{cat.label}</span>
                      <span className="font-mono font-bold">{cat.score}%</span>
                    </div>
                    <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${cat.score}%` }}
                        transition={{ delay: i * 0.1, duration: 0.8 }}
                        className="h-full rounded-full" style={{ background: cat.score >= 75 ? "#22c55e" : cat.score >= 50 ? "#eab308" : "#ef4444" }} />
                    </div>
                    <p className="text-xs text-muted-foreground">{cat.feedback}</p>
                  </div>
                ))}
              </div>

              {/* 3-column */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
                  <h4 className="text-sm font-semibold text-green-500 mb-2">✅ Strengths</h4>
                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    {result.topStrengths?.map((s: string, i: number) => <li key={i}>• {s}</li>)}
                  </ul>
                </div>
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                  <h4 className="text-sm font-semibold text-red-500 mb-2">⚠️ Issues</h4>
                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    {result.criticalIssues?.map((s: string, i: number) => <li key={i}>• {s}</li>)}
                  </ul>
                </div>
                <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                  <h4 className="text-sm font-semibold text-blue-500 mb-2">⚡ Quick Wins</h4>
                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    {result.quickWins?.map((s: string, i: number) => <li key={i}>• {s}</li>)}
                  </ul>
                </div>
              </div>

              {/* Keywords */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <h4 className="text-sm font-semibold mb-3">Missing Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords?.map((kw: string, i: number) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-full font-mono" style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", color: "#f59e0b" }}>
                      + {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Upsell */}
              {result.overallScore < 75 ? (
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
                  <p className="text-sm mb-3">🚀 Score {result.overallScore}/100. We'll rewrite it to 90+</p>
                  <Button onClick={() => setPaymentOpen(true)} className="bg-gradient-brand border-0 font-semibold gold-shimmer">
                    Get CV Professionally Rewritten — KSh 5,500
                  </Button>
                </div>
              ) : (
                <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-6 text-center">
                  <p className="text-sm mb-3">✅ Strong! Complete with a cover letter.</p>
                  <Link to="/cover-letter">
                    <Button className="bg-gradient-brand border-0 font-semibold">Generate AI Cover Letter → </Button>
                  </Link>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-2 justify-center">
                <Button variant="outline" size="sm" onClick={() => { setResult(null); setCvText(""); }} className="text-xs gap-1">
                  <Search className="h-3 w-3" /> Analyze Another
                </Button>
                <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(JSON.stringify(result, null, 2)); toast.success("Report copied!"); }} className="text-xs gap-1">
                  <Copy className="h-3 w-3" /> Copy Report
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
