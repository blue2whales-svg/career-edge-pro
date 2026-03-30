import { useState } from "react";
import { motion } from "framer-motion";
import { Target, Download, Save, Edit3, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import PageLayout from "@/components/PageLayout";
import MpesaPaymentModal from "@/components/MpesaPaymentModal";
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

  // 🔒 TEMP — replace with real access logic later
  const isPaid = false;

  const stopWords = new Set(["the","and","for","with","that","this","have","from","will","been","were","are","was","has","had","not","but","what","all","can","her","one","our","out","you","your"]);

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
    } catch {
      toast.error("Failed to save");
    }
  };

  return (
    <PageLayout>
      <MpesaPaymentModal open={paymentOpen} onClose={() => setPaymentOpen(false)} defaultPackage="professional" />

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

          {/* FORM */}
          {!optimizedCV && !loading && (
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2}
              className="rounded-2xl border border-border bg-card p-6 max-w-2xl mx-auto space-y-5">

              <h3 className="font-semibold">Step 1 — Job Details</h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Job Title *</Label>
                  <Input value={jobTitle} onChange={e => setJobTitle(e.target.value)} />
                </div>
                <div>
                  <Label>Company *</Label>
                  <Input value={company} onChange={e => setCompany(e.target.value)} />
                </div>
              </div>

              <Textarea value={jobDescription} onChange={e => setJobDescription(e.target.value)} rows={8} />

              <h3 className="font-semibold pt-2">Step 2 — Your CV</h3>

              <Textarea value={currentCV} onChange={e => setCurrentCV(e.target.value)} rows={10} />

              <Button onClick={optimize} className="w-full h-14 font-bold">
                🎯 Optimize My CV
              </Button>

            </motion.div>
          )}

          {/* RESULT */}
          {optimizedCV && !loading && (
            <div className="space-y-6">

              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">

                <h3 className="text-sm font-semibold text-primary mb-3">
                  🎯 Optimized CV
                </h3>

                {/* 🔥 HYBRID GATE */}
                <div className="relative">

                  <div className={`max-h-[500px] overflow-y-auto text-xs whitespace-pre-wrap font-mono ${!isPaid ? "overflow-hidden" : ""}`}>
                    {isPaid
                      ? optimizedCV
                      : optimizedCV.split("\n").slice(0, 15).join("\n")}
                  </div>

                  {!isPaid && (
                    <>
                      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />

                      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                        <div className="bg-[#111827] border border-gray-800 px-6 py-5 rounded-xl text-center shadow-xl max-w-sm w-full">

                          <div className="text-2xl mb-2">🚀🔒</div>

                          <p className="text-xs text-gray-400 mb-4">
                            Unlock full CV optimization
                          </p>

                          <button
                            onClick={() => setPaymentOpen(true)}
                            className="bg-[#C9A84C] text-black font-semibold px-5 py-2 rounded-lg text-sm"
                          >
                            Upgrade to Pro
                          </button>

                        </div>
                      </div>
                    </>
                  )}

                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-2 justify-center">
                <Button onClick={() => isPaid ? downloadCV() : setPaymentOpen(true)}>
                  <Download className="h-4 w-4" /> Download
                </Button>

                <Button onClick={() => isPaid ? saveToVault() : setPaymentOpen(true)}>
                  <Save className="h-4 w-4" /> Save
                </Button>
              </div>

            </div>
          )}

        </div>
      </section>
    </PageLayout>
  );
}
