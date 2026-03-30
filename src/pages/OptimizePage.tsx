import { useState } from "react";
import { motion } from "framer-motion";
import { Target, Download, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import PageLayout from "@/components/PageLayout";
import MpesaPaymentModal from "@/components/MpesaPaymentModal";
import ProGate from "@/components/ProGate"; // ✅ NEW
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5 },
  }),
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
  const [optimizedCV, setOptimizedCV] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [paymentOpen, setPaymentOpen] = useState(false);

  // ✅ TEMP (replace with Supabase later)
  const isPaid = localStorage.getItem("cvedge_paid") === "true";

  const optimize = async () => {
    if (!jobTitle || !company || !jobDescription || !currentCV) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setLoadingStep(0);

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => Math.min(prev + 1, LOADING_STEPS.length - 1));
    }, 3000);

    try {
      const { data, error } = await supabase.functions.invoke("ai-generate", {
        body: {
          type: "optimize-cv",
          data: { jobTitle, company, jobDescription, currentCV },
        },
      });

      if (error) throw error;

      setOptimizedCV(data.content);
      toast.success("CV optimized!");
    } catch (e: any) {
      toast.error(e.message || "Optimization failed.");
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
    }
  };

  const downloadCV = () => {
    const blob = new Blob([optimizedCV], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CV_Optimized_${company}_${jobTitle}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded!");
  };

  const saveToVault = () => {
    try {
      const files = JSON.parse(localStorage.getItem("cvedge_vault_files") || "[]");
      files.push({
        id: Date.now().toString(),
        name: `CV_Optimized_${company}_${jobTitle}.txt`,
        data: optimizedCV,
      });
      localStorage.setItem("cvedge_vault_files", JSON.stringify(files));
      toast.success("Saved!");
    } catch {
      toast.error("Failed to save");
    }
  };

  return (
    <PageLayout>
      <MpesaPaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        defaultPackage="professional"
      />

      <section className="pt-16 pb-24 px-4">
        <div className="max-w-5xl mx-auto">

          {/* HEADER */}
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
            className="text-3xl sm:text-5xl font-bold text-center mb-3"
          >
            🎯 CV Optimizer
          </motion.h1>

          {/* FORM */}
          {!optimizedCV && !loading && (
            <div className="p-6 border rounded-xl space-y-4">

              <Input
                placeholder="Job Title"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />

              <Input
                placeholder="Company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />

              <Textarea
                placeholder="Job Description"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />

              <Textarea
                placeholder="Paste your CV"
                value={currentCV}
                onChange={(e) => setCurrentCV(e.target.value)}
              />

              <Button onClick={optimize} className="w-full">
                Optimize CV
              </Button>

            </div>
          )}

          {/* RESULT */}
          {optimizedCV && !loading && (
            <div className="space-y-6 mt-6">

              {/* ✅ PRO GATE USED HERE */}
              <ProGate
                isPaid={isPaid}
                fullContent={optimizedCV}
                onUpgrade={() => setPaymentOpen(true)}
              />

              {/* ACTIONS */}
              <div className="flex gap-2 justify-center">
                <Button
                  onClick={() => isPaid ? downloadCV() : setPaymentOpen(true)}
                >
                  <Download className="h-4 w-4" /> Download
                </Button>

                <Button
                  onClick={() => isPaid ? saveToVault() : setPaymentOpen(true)}
                >
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
