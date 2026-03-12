import { useState } from "react";
import { motion } from "framer-motion";
import { Target, FileText, Download, Save, Edit3, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import PageLayout from "@/components/PageLayout";
import PesapalPaymentModal from "@/components/PesapalPaymentModal";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSearchParams, Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

const LOADING_STEPS = [
  "⚡ Extracting job keywords...",
  "🎯 Analyzing CV gaps...",
  "✍️ Rewriting for relevance...",
  "📊 Optimizing ATS score...",
];

export default function OptimizePage() {
  const [searchParams] = useSearchParams();
  const [jobTitle, setJobTitle] = useState(searchParams.get("job_title") || "");
  const [company, setCompany] = useState(searchParams.get("company") || "");
  const [jobDescription, setJobDescription] = useState(searchParams.get("description") || "");
  const [currentCV, setCurrentCV] = useState("");
  const [cvSource, setCvSource] = useState<"paste" | "none">("paste");
  const [optimizedCV, setOptimizedCV] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [editing, setEditing] = useState(false);
  const [editedCV, setEditedCV] = useState("");
  const [paymentOpen, setPaymentOpen] = useState(false);

  // Extract keywords from job description
  const stopWords = new Set(["the", "and", "for", "with", "that", "this", "have", "from", "will", "been", "were", "are", "was", "has", "had", "not", "but", "what", "all", "can", "her", "one", "our", "out", "you", "your"]);
  const keywords = jobDescription ? [...new Set(
    jobDescription.split(/[\s,;.()]+/)
      .filter(w => w.length > 5 && !stopWords.has(w.toLowerCase()))
      .map(w => w.replace(/[^a-zA-Z]/g, ""))
      .filter(w => w.length > 5)
  )].slice(0, 10) : [];

  const optimize = async () => {
    if (!jobTitle || !company || !jobDescription || !currentCV) {
      toast.error("Please fill in all required fields");
      return;
    }
    setLoading(true);
    setLoadingStep(0);

    const stepInterval = setInterval(() => {
      setLoadingStep(prev => Math.min(prev + 1, LOADING_STEPS.length - 1));
    }, 3000);

    try {
      const { data, error } = await supabase.functions.invoke("ai-generate", {
        body: { type: "optimize-cv", data: { jobTitle, company, jobDescription, currentCV } },
      });
      if (error) throw error;
      setOptimizedCV(data.content);
      setEditedCV(data.content);
      toast.success("CV optimized!");
    } catch (e: any) {
      toast.error(e.message || "Optimization failed. Please try again.");
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
    }
  };

  const downloadCV = () => {
    const content = editing ? editedCV : optimizedCV;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CV_Optimized_${company}_${jobTitle}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded!");
  };

  const saveToVault = () => {
    const content = editing ? editedCV : optimizedCV;
    try {
      const files = JSON.parse(localStorage.getItem("cvedge_vault_files") || "[]");
      files.push({
        id: Date.now().toString(),
        name: `CV_Optimized_${company}_${jobTitle}.txt`,
        size: new Blob([content]).size,
        type: "text/plain",
        category: "CVs",
        uploadDate: new Date().toISOString().split("T")[0],
        data: `data:text/plain;base64,${btoa(unescape(encodeURIComponent(content)))}`,
      });
      localStorage.setItem("cvedge_vault_files", JSON.stringify(files));
      toast.success("Saved to Document Vault!");
    } catch { toast.error("Failed to save"); }
  };

  return (
    <PageLayout>
      <PesapalPaymentModal open={paymentOpen} onClose={() => setPaymentOpen(false)} defaultPackage="professional" />
      <section className="relative z-10 pt-16 sm:pt-24 pb-24 px-4">
        <div className="container max-w-5xl mx-auto">
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={0}
            className="text-3xl sm:text-5xl font-serif font-bold mb-3 text-center">
            🎯 Job-Tailored CV <span className="text-gradient">Optimizer</span>
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={1}
            className="text-muted-foreground text-center mb-10 max-w-xl mx-auto">
            Optimize your CV specifically for any job posting using AI
          </motion.p>

          {!optimizedCV && !loading && (
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2}
              className="rounded-2xl border border-border bg-card p-6 max-w-2xl mx-auto space-y-5">
              <h3 className="font-semibold">Step 1 — Job Details</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label>Job Title *</Label><Input value={jobTitle} onChange={e => setJobTitle(e.target.value)} className="mt-1" /></div>
                <div><Label>Company *</Label><Input value={company} onChange={e => setCompany(e.target.value)} className="mt-1" /></div>
              </div>
              <div>
                <Label>Job Description *</Label>
                <Textarea value={jobDescription} onChange={e => setJobDescription(e.target.value)} rows={8} placeholder="Paste the full job description..." className="mt-1" />
              </div>
              {keywords.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-xs text-muted-foreground">Keywords detected:</span>
                  {keywords.map((kw, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">{kw}</span>
                  ))}
                </div>
              )}

              <h3 className="font-semibold pt-2">Step 2 — Your CV</h3>
              <div className="flex gap-2 mb-3">
                <Button size="sm" variant={cvSource === "paste" ? "default" : "outline"} onClick={() => setCvSource("paste")} className="text-xs">✏️ Paste CV</Button>
                <Link to="/cv-builder">
                  <Button size="sm" variant="outline" className="text-xs">📝 Build New CV</Button>
                </Link>
              </div>
              <Textarea value={currentCV} onChange={e => setCurrentCV(e.target.value)} rows={10} placeholder="Paste your current CV text..." />

              <Button onClick={optimize} disabled={!jobTitle || !company || !jobDescription || !currentCV}
                className="w-full h-14 font-bold text-base border-0 bg-gradient-brand gold-shimmer">
                🎯 Optimize My CV For This Job
              </Button>
            </motion.div>
          )}

          {loading && (
            <div className="rounded-2xl border border-border bg-card p-10 max-w-lg mx-auto text-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
              <p className="font-semibold mb-1">🎯 Optimizing your CV for {jobTitle} at {company}...</p>
              <p className="text-xs text-muted-foreground mb-6">Don't close this page (~15 seconds)</p>
              <div className="space-y-3 text-left">
                {LOADING_STEPS.map((step, i) => (
                  <div key={i} className={`text-sm ${i <= loadingStep ? "text-primary" : "text-muted-foreground/40"}`}>
                    {i < loadingStep ? "✅" : i === loadingStep ? "🔄" : "⏳"} {step}
                  </div>
                ))}
              </div>
            </div>
          )}

          {optimizedCV && !loading && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-serif font-bold">✅ CV Optimized for {jobTitle}</h2>
                <p className="text-sm text-muted-foreground">Tailored specifically for {company}</p>
              </div>

              <div className="grid lg:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">📄 Original CV</h3>
                  <div className="max-h-[500px] overflow-y-auto text-xs whitespace-pre-wrap text-muted-foreground/70 font-mono">{currentCV}</div>
                </div>
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-primary">🎯 Optimized CV</h3>
                    <Button size="sm" variant="ghost" onClick={() => setEditing(!editing)} className="text-xs gap-1">
                      {editing ? <Save className="h-3 w-3" /> : <Edit3 className="h-3 w-3" />}
                      {editing ? "Save" : "Edit"}
                    </Button>
                  </div>
                  {editing ? (
                    <Textarea value={editedCV} onChange={e => setEditedCV(e.target.value)} rows={20} className="text-xs font-mono" />
                  ) : (
                    <div className="max-h-[500px] overflow-y-auto text-xs whitespace-pre-wrap font-mono">{optimizedCV}</div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                <Button onClick={downloadCV} className="bg-gradient-brand border-0 font-semibold gap-1.5">
                  <Download className="h-4 w-4" /> Download Optimized CV
                </Button>
                <Button onClick={saveToVault} variant="outline" className="gap-1.5">
                  <Save className="h-4 w-4" /> Save to Vault
                </Button>
              </div>

              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
                <p className="text-sm text-muted-foreground mb-3">Want a human expert to perfect this?</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button variant="outline" onClick={() => { setPaymentOpen(true); }} className="text-xs">Starter — KSh 2,500</Button>
                  <Button onClick={() => setPaymentOpen(true)} className="bg-gradient-brand border-0 font-semibold gold-shimmer">
                    Professional — KSh 5,500 ← Popular
                  </Button>
                  <Button variant="outline" onClick={() => setPaymentOpen(true)} className="text-xs">Executive — KSh 10,500</Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
