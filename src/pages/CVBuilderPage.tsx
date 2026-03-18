import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Wrench,
  Globe,
  ListPlus,
  Settings,
  Eye,
  Edit3,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { CVData, initialCVData, PRICING_TIERS } from "@/components/cv-builder/types";
import StepPersonalDetails from "@/components/cv-builder/StepPersonalDetails";
import StepSummary from "@/components/cv-builder/StepSummary";
import StepWorkExperience from "@/components/cv-builder/StepWorkExperience";
import StepEducation from "@/components/cv-builder/StepEducation";
import StepSkills from "@/components/cv-builder/StepSkills";
import StepLanguages from "@/components/cv-builder/StepLanguages";
import StepAdditional from "@/components/cv-builder/StepAdditional";
import StepSettings from "@/components/cv-builder/StepSettings";
import CVPreview from "@/components/cv-builder/CVPreview";
import { PremiumUnlockCard } from "@/components/cv-builder/PremiumUnlockCard";
import JobMatchScore from "@/components/cv-builder/JobMatchScore";
import MpesaPaymentModal from "@/components/MpesaPaymentModal";
import { useIsMobile } from "@/hooks/use-mobile";

const STEPS = [
  { label: "Personal", icon: User },
  { label: "Summary", icon: FileText },
  { label: "Experience", icon: Briefcase },
  { label: "Education", icon: GraduationCap },
  { label: "Skills", icon: Wrench },
  { label: "Languages", icon: Globe },
  { label: "Additional", icon: ListPlus },
  { label: "Settings", icon: Settings },
  { label: "Job Match", icon: Target },
];

function formatKES(amount: number) {
  return `KES ${amount.toLocaleString()}`;
}

export default function CVBuilderPage() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<CVData>(initialCVData);
  const [showPreview, setShowPreview] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [template, setTemplate] = useState<"executive" | "clean" | "sidebar" | "minimal" | "creative" | "corporate">(
    "executive",
  );
  const [paymentOpen, setPaymentOpen] = useState(false);
  const isMobile = useIsMobile();

  const progress = ((step + 1) / STEPS.length) * 100;
  const selectedTier = data.experienceLevel ? PRICING_TIERS[data.experienceLevel] : null;
  const defaultPackage =
    data.experienceLevel === "executive" ? "executive" : data.experienceLevel === "mid" ? "professional" : "starter";

  const update = (updates: Partial<CVData>) => setData((prev) => ({ ...prev, ...updates }));

  const renderStep = () => {
    switch (step) {
      case 0:
        return <StepPersonalDetails data={data} onChange={update} />;
      case 1:
        return <StepSummary data={data} onChange={update} />;
      case 2:
        return <StepWorkExperience data={data} onChange={update} />;
      case 3:
        return <StepEducation data={data} onChange={update} />;
      case 4:
        return <StepSkills data={data} onChange={update} />;
      case 5:
        return <StepLanguages data={data} onChange={update} />;
      case 6:
        return <StepAdditional data={data} onChange={update} />;
      case 7:
        return <StepSettings data={data} onChange={update} />;
      case 8:
        return <JobMatchScore data={data} onOptimize={() => setPaymentOpen(true)} />;
      default:
        return null;
    }
  };

  return (
    <PageLayout>
      <MpesaPaymentModal open={paymentOpen} onClose={() => setPaymentOpen(false)} defaultPackage={defaultPackage} />

      <section className="relative z-10 pt-4 sm:pt-6 pb-32 sm:pb-24 px-3 sm:px-4">
        <div className="container max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="px-2 sm:px-3">
                <ArrowLeft className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </Link>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-2xl font-serif font-bold truncate">
                CV <span className="text-gradient">Builder</span>
              </h1>
            </div>
            {selectedTier && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <span className="text-xs text-muted-foreground">{selectedTier.label}</span>
                <span className="text-sm font-bold text-primary">{formatKES(selectedTier.price)}</span>
              </div>
            )}
            {isMobile && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 shrink-0"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? <Edit3 className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                {showPreview ? "Edit" : "Preview"}
              </Button>
            )}
          </div>

          {/* Progress */}
          <Progress value={progress} className="h-1 sm:h-1.5 mb-3 sm:mb-4" />

          {/* Step indicators */}
          <div className="flex gap-1 mb-4 sm:mb-6 overflow-x-auto pb-1 -mx-3 px-3 sm:mx-0 sm:px-0 scrollbar-hide">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <button
                  key={i}
                  onClick={() => setStep(i)}
                  className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                    i === step
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : i < step
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  {i === step ? s.label : <span className="hidden sm:inline">{s.label}</span>}
                  {i !== step && <span className="sm:hidden">{i + 1}</span>}
                </button>
              );
            })}
          </div>

          {/* Main content */}
          <div className="grid lg:grid-cols-5 xl:grid-cols-2 gap-4 sm:gap-6">
            {/* Form panel */}
            {(!isMobile || !showPreview) && (
              <div className="lg:col-span-3 xl:col-span-1 rounded-2xl border border-border bg-card p-4 sm:p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.15 }}
                  >
                    {renderStep()}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex justify-between mt-6 sm:mt-8 pt-4 border-t border-border">
                  <Button
                    onClick={() => setStep(Math.max(0, step - 1))}
                    disabled={step === 0}
                    variant="outline"
                    size={isMobile ? "sm" : "default"}
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" /> Previous
                  </Button>
                  {step < STEPS.length - 1 ? (
                    <Button
                      onClick={() => setStep(step + 1)}
                      className="bg-gradient-brand border-0"
                      size={isMobile ? "sm" : "default"}
                    >
                      Next <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setPaymentOpen(true)}
                      className="bg-gradient-brand border-0"
                      size={isMobile ? "sm" : "default"}
                    >
                      {isPaid ? "Download CV" : "Generate CV"}
                      {selectedTier && !isPaid && <span className="ml-1">• {formatKES(selectedTier.price)}</span>}
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Template Switcher */}
            {(!isMobile || showPreview) && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "12px",
                  padding: "12px 8px",
                  marginBottom: "8px",
                  alignItems: "flex-end",
                  justifyContent: "center",
                }}
              >
                {[
                  {
                    id: "executive",
                    label: "Executive",
                    color: "#1a1a2e",
                    accent: "#c9a84c",
                    bg: "#1a1a2e",
                    headerH: 28,
                  },
                  { id: "clean", label: "Clean", color: "#fff", accent: "#2563eb", bg: "#fff", headerH: 24 },
                  { id: "sidebar", label: "Sidebar", color: "#1e293b", accent: "#38bdf8", bg: "#f8fafc", headerH: 0 },
                  { id: "minimal", label: "Minimal", color: "#fff", accent: "#111", bg: "#fff", headerH: 0 },
                  { id: "creative", label: "Creative", color: "#7c3aed", accent: "#a78bfa", bg: "#fff", headerH: 32 },
                  { id: "corporate", label: "Corporate", color: "#14532d", accent: "#86efac", bg: "#fff", headerH: 26 },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTemplate(t.id as any)}
                    style={{
                      width: "72px",
                      height: "94px",
                      borderRadius: "4px",
                      border: template === t.id ? `2px solid #c9a84c` : "2px solid transparent",
                      padding: 0,
                      cursor: "pointer",
                      background: t.bg,
                      boxShadow: template === t.id ? "0 0 0 2px #c9a84c" : "0 2px 8px rgba(0,0,0,0.3)",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.2s",
                      position: "relative",
                    }}
                  >
                    {t.headerH > 0 && <div style={{ background: t.color, height: `${t.headerH}px`, width: "100%" }} />}
                    {t.id === "sidebar" && (
                      <div style={{ display: "flex", flex: 1, width: "100%" }}>
                        <div style={{ background: "#1e293b", width: "35%", height: "100%" }} />
                        <div style={{ background: "#f8fafc", flex: 1 }} />
                      </div>
                    )}
                    {t.id === "minimal" && (
                      <div style={{ padding: "6px 4px", display: "flex", flexDirection: "column", gap: "3px" }}>
                        <div style={{ height: "2px", background: "#111", width: "60%" }} />
                        <div style={{ height: "1px", background: "#ddd", width: "100%" }} />
                        <div style={{ height: "1px", background: "#ddd", width: "80%" }} />
                        <div style={{ height: "1px", background: "#ddd", width: "90%" }} />
                      </div>
                    )}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: "rgba(0,0,0,0.55)",
                        color: "#fff",
                        fontSize: "9px",
                        fontWeight: 700,
                        textAlign: "center",
                        padding: "2px 0",
                        letterSpacing: "0.03em",
                      }}
                    >
                      {t.label}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Preview panel + Unlock card */}
            {(!isMobile || showPreview) && (
              <div className="lg:col-span-2 xl:col-span-1 space-y-4 lg:sticky lg:top-4 lg:max-h-[calc(100vh-100px)] overflow-y-auto">
                <div className="rounded-2xl border border-border bg-muted/30 p-3 sm:p-4">
                  <p className="text-[10px] sm:text-xs text-muted-foreground mb-2 sm:mb-3 text-center font-medium uppercase tracking-wider">
                    Live Preview {!isPaid && <span className="text-primary">· Protected</span>}
                  </p>
                  <div className="transform-gpu origin-top scale-[0.85] sm:scale-90 lg:scale-100">
                    <CVPreview data={data} isPaid={isPaid} template={template} />
                  </div>
                </div>

                {/* Premium unlock card */}
                <PremiumUnlockCard isPaid={isPaid} onUnlock={() => setPaymentOpen(true)} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mobile sticky bottom bar */}
      {isMobile && !showPreview && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border px-4 py-3 safe-area-pb">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Step {step + 1}/{STEPS.length}
              </p>
              {selectedTier && <p className="text-sm font-bold text-primary">{formatKES(selectedTier.price)}</p>}
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} variant="outline" size="sm">
                <ArrowLeft className="h-3.5 w-3.5" />
              </Button>
              {step < STEPS.length - 1 ? (
                <Button onClick={() => setStep(step + 1)} className="bg-gradient-brand border-0" size="sm">
                  Next <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              ) : (
                <Button onClick={() => setPaymentOpen(true)} className="bg-gradient-brand border-0" size="sm">
                  {isPaid ? "Download" : "Generate CV"} <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
