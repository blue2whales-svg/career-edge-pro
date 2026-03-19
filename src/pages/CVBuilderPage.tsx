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

          {/* Template Switcher */}
          <div className="mb-6">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-3">Choose Template</p>
            <div className="grid grid-cols-6 gap-2 sm:gap-3">
              {(["executive", "clean", "sidebar", "minimal", "creative", "corporate"] as const).map((t) => {
                const active = template === t;
                return (
                  <button
                    key={t}
                    onClick={() => {
                      setTemplate(t);
                      if (isMobile) setShowPreview(true);
                    }}
                    className={`flex flex-col items-center gap-2 p-2 sm:p-3 rounded-xl border-2 text-xs capitalize font-medium transition-all w-full ${active ? "border-primary bg-primary/10 text-primary shadow-md" : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"}`}
                  >
                    <div
                      className={`w-full aspect-[3/4] rounded overflow-hidden ${active ? "ring-1 ring-primary/40" : ""}`}
                    >
                      {t === "executive" && (
                        <svg viewBox="0 0 60 80" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                          <rect width="60" height="80" fill="white" />
                          <rect width="60" height="26" fill="#1a1a2e" />
                          <rect x="6" y="7" width="24" height="3" rx="1" fill="#c9a84c" opacity="0.9" />
                          <rect x="6" y="12" width="16" height="1.5" rx="0.5" fill="#c9a84c" opacity="0.5" />
                          <rect x="6" y="16" width="8" height="1.2" rx="0.3" fill="#aab4cc" opacity="0.6" />
                          <rect x="16" y="16" width="10" height="1.2" rx="0.3" fill="#aab4cc" opacity="0.6" />
                          <circle cx="51" cy="13" r="7" fill="none" stroke="#c9a84c" strokeWidth="1" />
                          <rect x="6" y="23" width="48" height="1" fill="#c9a84c" opacity="0.5" />
                          <rect x="6" y="30" width="16" height="1.5" rx="0.5" fill="#1a1a2e" opacity="0.7" />
                          <rect x="6" y="33" width="48" height="0.8" rx="0.3" fill="#c9a84c" opacity="0.3" />
                          <rect x="6" y="36" width="48" height="1" rx="0.3" fill="#555" opacity="0.2" />
                          <rect x="6" y="38.5" width="36" height="1" rx="0.3" fill="#555" opacity="0.15" />
                          <rect x="6" y="44" width="16" height="1.5" rx="0.5" fill="#1a1a2e" opacity="0.7" />
                          <rect x="6" y="47" width="48" height="0.8" rx="0.3" fill="#c9a84c" opacity="0.3" />
                          <rect x="6" y="50" width="30" height="1" rx="0.3" fill="#555" opacity="0.2" />
                          <rect x="6" y="52.5" width="42" height="1" rx="0.3" fill="#555" opacity="0.15" />
                          <rect x="6" y="55" width="36" height="1" rx="0.3" fill="#555" opacity="0.12" />
                          <rect x="6" y="62" width="16" height="1.5" rx="0.5" fill="#1a1a2e" opacity="0.7" />
                          <rect x="6" y="65" width="48" height="0.8" rx="0.3" fill="#c9a84c" opacity="0.3" />
                          <rect x="6" y="68" width="10" height="4" rx="2" fill="#c9a84c" opacity="0.15" />
                          <rect x="18" y="68" width="10" height="4" rx="2" fill="#c9a84c" opacity="0.1" />
                          <rect x="30" y="68" width="12" height="4" rx="2" fill="#c9a84c" opacity="0.1" />
                        </svg>
                      )}
                      {t === "clean" && (
                        <svg viewBox="0 0 60 80" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                          <rect width="60" height="80" fill="white" />
                          <rect x="6" y="7" width="22" height="3" rx="1" fill="#111" opacity="0.85" />
                          <rect x="6" y="12" width="14" height="1.5" rx="0.5" fill="#2563eb" opacity="0.7" />
                          <rect x="6" y="16" width="8" height="1" rx="0.3" fill="#64748b" opacity="0.5" />
                          <rect x="16" y="16" width="10" height="1" rx="0.3" fill="#64748b" opacity="0.5" />
                          <rect x="6" y="21" width="48" height="1.5" fill="#2563eb" opacity="0.2" />
                          <rect x="6" y="27" width="14" height="1.5" rx="0.5" fill="#111" opacity="0.7" />
                          <rect x="6" y="30" width="48" height="0.8" rx="0.3" fill="#2563eb" opacity="0.3" />
                          <rect x="6" y="33" width="48" height="1" rx="0.3" fill="#333" opacity="0.2" />
                          <rect x="6" y="35.5" width="36" height="1" rx="0.3" fill="#333" opacity="0.15" />
                          <rect x="6" y="41" width="14" height="1.5" rx="0.5" fill="#111" opacity="0.7" />
                          <rect x="6" y="44" width="48" height="0.8" rx="0.3" fill="#2563eb" opacity="0.3" />
                          <rect x="6" y="47" width="28" height="1" rx="0.3" fill="#333" opacity="0.2" />
                          <rect x="6" y="49.5" width="40" height="1" rx="0.3" fill="#333" opacity="0.15" />
                          <rect x="6" y="55" width="14" height="1.5" rx="0.5" fill="#111" opacity="0.7" />
                          <rect x="6" y="58" width="48" height="0.8" rx="0.3" fill="#2563eb" opacity="0.3" />
                          <rect x="6" y="61" width="9" height="4" rx="2" fill="#2563eb" opacity="0.12" />
                          <rect x="17" y="61" width="11" height="4" rx="2" fill="#2563eb" opacity="0.08" />
                          <rect x="30" y="61" width="9" height="4" rx="2" fill="#2563eb" opacity="0.08" />
                        </svg>
                      )}
                      {t === "sidebar" && (
                        <svg viewBox="0 0 60 80" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                          <rect width="60" height="80" fill="#f8fafc" />
                          <rect width="21" height="80" fill="#1e293b" />
                          <circle cx="10.5" cy="13" r="6" fill="none" stroke="#38bdf8" strokeWidth="1.2" />
                          <rect x="3" y="22" width="15" height="2" rx="0.5" fill="white" opacity="0.8" />
                          <rect x="3" y="26" width="10" height="1.2" rx="0.3" fill="#38bdf8" opacity="0.7" />
                          <rect x="3" y="31" width="15" height="0.8" rx="0.3" fill="white" opacity="0.35" />
                          <rect x="3" y="33.5" width="12" height="0.8" rx="0.3" fill="white" opacity="0.25" />
                          <rect x="3" y="38" width="6" height="1" rx="0.3" fill="#38bdf8" opacity="0.5" />
                          <rect x="3" y="41" width="15" height="0.8" rx="0.3" fill="white" opacity="0.25" />
                          <rect x="3" y="43.5" width="11" height="0.8" rx="0.3" fill="white" opacity="0.2" />
                          <rect x="3" y="48" width="8" height="3" rx="1.5" fill="#38bdf8" opacity="0.2" />
                          <rect x="3" y="53" width="10" height="3" rx="1.5" fill="#38bdf8" opacity="0.15" />
                          <rect x="25" y="8" width="18" height="2.5" rx="1" fill="#1e293b" opacity="0.8" />
                          <rect x="25" y="12" width="12" height="1.5" rx="0.5" fill="#0284c7" opacity="0.7" />
                          <rect x="25" y="19" width="12" height="1.2" rx="0.5" fill="#1e293b" opacity="0.6" />
                          <rect x="25" y="22" width="32" height="0.7" rx="0.3" fill="#38bdf8" opacity="0.35" />
                          <rect x="25" y="25" width="32" height="0.8" rx="0.3" fill="#333" opacity="0.2" />
                          <rect x="25" y="27.5" width="24" height="0.8" rx="0.3" fill="#333" opacity="0.15" />
                          <rect x="25" y="33" width="12" height="1.2" rx="0.5" fill="#1e293b" opacity="0.6" />
                          <rect x="25" y="36" width="32" height="0.7" rx="0.3" fill="#38bdf8" opacity="0.35" />
                          <rect x="25" y="39" width="28" height="0.8" rx="0.3" fill="#333" opacity="0.2" />
                          <rect x="25" y="41.5" width="20" height="0.8" rx="0.3" fill="#333" opacity="0.15" />
                          <rect x="25" y="47" width="12" height="1.2" rx="0.5" fill="#1e293b" opacity="0.6" />
                          <rect x="25" y="50" width="32" height="0.7" rx="0.3" fill="#38bdf8" opacity="0.35" />
                          <rect x="25" y="53" width="22" height="0.8" rx="0.3" fill="#333" opacity="0.2" />
                        </svg>
                      )}
                      {t === "minimal" && (
                        <svg viewBox="0 0 60 80" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                          <rect width="60" height="80" fill="white" />
                          <rect x="6" y="8" width="26" height="3" rx="0.5" fill="#111" opacity="0.9" />
                          <rect x="6" y="13" width="14" height="1.2" rx="0.3" fill="#555" opacity="0.5" />
                          <rect x="6" y="17" width="48" height="0.5" fill="#111" opacity="0.12" />
                          <rect x="6" y="22" width="12" height="1.2" rx="0.3" fill="#111" opacity="0.5" />
                          <rect x="6" y="25.5" width="48" height="0.8" rx="0.3" fill="#333" opacity="0.15" />
                          <rect x="6" y="28" width="36" height="0.8" rx="0.3" fill="#333" opacity="0.12" />
                          <rect x="6" y="30.5" width="44" height="0.8" rx="0.3" fill="#333" opacity="0.1" />
                          <rect x="6" y="36" width="12" height="1.2" rx="0.3" fill="#111" opacity="0.5" />
                          <rect x="6" y="39.5" width="48" height="0.5" fill="#111" opacity="0.12" />
                          <rect x="6" y="43" width="22" height="1" rx="0.3" fill="#111" opacity="0.5" />
                          <rect x="6" y="45.5" width="16" height="0.8" rx="0.3" fill="#666" opacity="0.3" />
                          <rect x="6" y="48" width="28" height="0.8" rx="0.3" fill="#333" opacity="0.15" />
                          <rect x="6" y="54" width="12" height="1.2" rx="0.3" fill="#111" opacity="0.5" />
                          <rect x="6" y="57.5" width="48" height="0.5" fill="#111" opacity="0.12" />
                          <rect x="6" y="61" width="10" height="3.5" rx="1.5" fill="#111" opacity="0.07" />
                          <rect x="18" y="61" width="12" height="3.5" rx="1.5" fill="#111" opacity="0.05" />
                          <rect x="32" y="61" width="10" height="3.5" rx="1.5" fill="#111" opacity="0.05" />
                        </svg>
                      )}
                      {t === "creative" && (
                        <svg viewBox="0 0 60 80" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                          <rect width="60" height="80" fill="white" />
                          <defs>
                            <linearGradient id="cg2" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="#7c3aed" />
                              <stop offset="100%" stopColor="#db2777" />
                            </linearGradient>
                          </defs>
                          <rect width="60" height="27" fill="url(#cg2)" />
                          <rect x="6" y="7" width="22" height="2.5" rx="1" fill="white" opacity="0.95" />
                          <rect x="6" y="11" width="14" height="1.5" rx="0.5" fill="#f0abfc" opacity="0.9" />
                          <rect x="6" y="15" width="8" height="1" rx="0.3" fill="white" opacity="0.55" />
                          <rect x="16" y="15" width="10" height="1" rx="0.3" fill="white" opacity="0.55" />
                          <circle cx="51" cy="13" r="7" fill="none" stroke="#f0abfc" strokeWidth="1" opacity="0.7" />
                          <rect x="6" y="33" width="14" height="1.5" rx="0.5" fill="#7c3aed" opacity="0.7" />
                          <rect x="6" y="36" width="48" height="0.7" rx="0.3" fill="#a78bfa" opacity="0.35" />
                          <rect x="6" y="39" width="48" height="0.8" rx="0.3" fill="#333" opacity="0.2" />
                          <rect x="6" y="41.5" width="36" height="0.8" rx="0.3" fill="#333" opacity="0.15" />
                          <rect x="6" y="47" width="14" height="1.5" rx="0.5" fill="#7c3aed" opacity="0.7" />
                          <rect x="6" y="50" width="48" height="0.7" rx="0.3" fill="#a78bfa" opacity="0.35" />
                          <rect x="6" y="53" width="30" height="0.8" rx="0.3" fill="#333" opacity="0.2" />
                          <rect x="6" y="55.5" width="42" height="0.8" rx="0.3" fill="#333" opacity="0.15" />
                          <rect x="6" y="61" width="9" height="4" rx="2" fill="#7c3aed" opacity="0.1" />
                          <rect x="17" y="61" width="11" height="4" rx="2" fill="#db2777" opacity="0.08" />
                          <rect x="30" y="61" width="9" height="4" rx="2" fill="#7c3aed" opacity="0.08" />
                        </svg>
                      )}
                      {t === "corporate" && (
                        <svg viewBox="0 0 60 80" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                          <rect width="60" height="80" fill="white" />
                          <rect width="60" height="27" fill="#14532d" />
                          <rect x="6" y="7" width="22" height="2.5" rx="1" fill="white" opacity="0.95" />
                          <rect x="6" y="11" width="14" height="1.5" rx="0.5" fill="#4ade80" opacity="0.9" />
                          <rect x="6" y="15" width="8" height="1" rx="0.3" fill="white" opacity="0.55" />
                          <rect x="16" y="15" width="10" height="1" rx="0.3" fill="white" opacity="0.55" />
                          <circle cx="51" cy="13" r="7" fill="none" stroke="#4ade80" strokeWidth="1" opacity="0.6" />
                          <rect x="6" y="23" width="48" height="1" fill="#4ade80" opacity="0.35" />
                          <rect x="6" y="33" width="14" height="1.5" rx="0.5" fill="#14532d" opacity="0.7" />
                          <rect x="6" y="36" width="48" height="0.7" rx="0.3" fill="#16a34a" opacity="0.35" />
                          <rect x="6" y="39" width="48" height="0.8" rx="0.3" fill="#333" opacity="0.2" />
                          <rect x="6" y="41.5" width="36" height="0.8" rx="0.3" fill="#333" opacity="0.15" />
                          <rect x="6" y="47" width="14" height="1.5" rx="0.5" fill="#14532d" opacity="0.7" />
                          <rect x="6" y="50" width="48" height="0.7" rx="0.3" fill="#16a34a" opacity="0.35" />
                          <rect x="6" y="53" width="30" height="0.8" rx="0.3" fill="#333" opacity="0.2" />
                          <rect x="6" y="55.5" width="42" height="0.8" rx="0.3" fill="#333" opacity="0.15" />
                          <rect x="6" y="61" width="9" height="4" rx="2" fill="#14532d" opacity="0.1" />
                          <rect x="17" y="61" width="11" height="4" rx="2" fill="#14532d" opacity="0.08" />
                          <rect x="30" y="61" width="9" height="4" rx="2" fill="#14532d" opacity="0.07" />
                        </svg>
                      )}
                    </div>
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main content grid */}
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
