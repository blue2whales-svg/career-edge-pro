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
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest mb-3">
              Choose Template
            </p>
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {(["executive", "clean", "sidebar", "minimal", "creative", "corporate"] as const).map((t) => {
                const active = template === t;
                const labels: Record<string, string> = {
                  executive: "Executive",
                  clean: "Clean",
                  sidebar: "Sidebar",
                  minimal: "Minimal",
                  creative: "Creative",
                  corporate: "Corporate",
                };
                return (
                  <button
                    key={t}
                    onClick={() => {
                      setTemplate(t);
                      setShowPreview(true);
                    }}
                    className={`flex flex-col items-center gap-1.5 rounded-xl transition-all ${active ? "opacity-100" : "opacity-70 hover:opacity-90"}`}
                  >
                    <div
                      className={`w-full aspect-[3/4] rounded-lg overflow-hidden shadow-md transition-all ${active ? "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-primary/20 shadow-lg" : "ring-1 ring-border"}`}
                    >
                      {t === "executive" && (
                        <svg viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                          <rect width="120" height="160" fill="white" />
                          <rect width="120" height="52" fill="#1a1a2e" />
                          <rect x="12" y="13" width="52" height="6" rx="2" fill="#c9a84c" opacity="0.95" />
                          <rect x="12" y="22" width="34" height="3" rx="1" fill="#c9a84c" opacity="0.55" />
                          <rect x="12" y="29" width="16" height="2.5" rx="1" fill="#aab4cc" opacity="0.6" />
                          <rect x="32" y="29" width="20" height="2.5" rx="1" fill="#aab4cc" opacity="0.6" />
                          <rect x="56" y="29" width="18" height="2.5" rx="1" fill="#aab4cc" opacity="0.5" />
                          <circle cx="100" cy="26" r="14" fill="none" stroke="#c9a84c" strokeWidth="2" />
                          <rect x="12" y="46" width="96" height="1.5" fill="#c9a84c" opacity="0.5" />
                          <rect x="12" y="58" width="32" height="3" rx="1" fill="#1a1a2e" opacity="0.75" />
                          <rect x="12" y="64" width="96" height="1.5" rx="0.5" fill="#c9a84c" opacity="0.35" />
                          <rect x="12" y="69" width="96" height="2" rx="0.5" fill="#444" opacity="0.18" />
                          <rect x="12" y="73" width="72" height="2" rx="0.5" fill="#444" opacity="0.13" />
                          <rect x="12" y="77" width="84" height="2" rx="0.5" fill="#444" opacity="0.1" />
                          <rect x="12" y="87" width="32" height="3" rx="1" fill="#1a1a2e" opacity="0.75" />
                          <rect x="12" y="93" width="96" height="1.5" rx="0.5" fill="#c9a84c" opacity="0.35" />
                          <rect x="12" y="98" width="80" height="2" rx="0.5" fill="#444" opacity="0.18" />
                          <rect x="12" y="102" width="60" height="2" rx="0.5" fill="#444" opacity="0.13" />
                          <rect x="12" y="106" width="72" height="2" rx="0.5" fill="#444" opacity="0.1" />
                          <rect x="12" y="116" width="32" height="3" rx="1" fill="#1a1a2e" opacity="0.75" />
                          <rect x="12" y="122" width="96" height="1.5" rx="0.5" fill="#c9a84c" opacity="0.35" />
                          <rect x="12" y="127" width="22" height="8" rx="4" fill="#c9a84c" opacity="0.15" />
                          <rect x="38" y="127" width="22" height="8" rx="4" fill="#c9a84c" opacity="0.1" />
                          <rect x="64" y="127" width="26" height="8" rx="4" fill="#c9a84c" opacity="0.1" />
                          <rect x="12" y="141" width="32" height="3" rx="1" fill="#1a1a2e" opacity="0.75" />
                          <rect x="12" y="147" width="96" height="1.5" rx="0.5" fill="#c9a84c" opacity="0.35" />
                          <rect x="12" y="152" width="50" height="2" rx="0.5" fill="#444" opacity="0.15" />
                        </svg>
                      )}
                      {t === "clean" && (
                        <svg viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                          <rect width="120" height="160" fill="white" />
                          <rect x="12" y="12" width="48" height="6" rx="1.5" fill="#111" opacity="0.88" />
                          <rect x="12" y="21" width="28" height="3" rx="1" fill="#2563eb" opacity="0.7" />
                          <rect x="12" y="27" width="16" height="2.5" rx="1" fill="#64748b" opacity="0.5" />
                          <rect x="32" y="27" width="20" height="2.5" rx="1" fill="#64748b" opacity="0.5" />
                          <rect x="56" y="27" width="18" height="2.5" rx="1" fill="#64748b" opacity="0.4" />
                          <rect x="12" y="34" width="96" height="2" fill="#2563eb" opacity="0.2" />
                          <rect x="12" y="43" width="32" height="3" rx="1" fill="#111" opacity="0.75" />
                          <rect x="12" y="49" width="96" height="1.5" rx="0.5" fill="#2563eb" opacity="0.3" />
                          <rect x="12" y="54" width="96" height="2" rx="0.5" fill="#333" opacity="0.18" />
                          <rect x="12" y="58" width="72" height="2" rx="0.5" fill="#333" opacity="0.13" />
                          <rect x="12" y="62" width="84" height="2" rx="0.5" fill="#333" opacity="0.1" />
                          <rect x="12" y="72" width="32" height="3" rx="1" fill="#111" opacity="0.75" />
                          <rect x="12" y="78" width="96" height="1.5" rx="0.5" fill="#2563eb" opacity="0.3" />
                          <rect x="12" y="83" width="56" height="2" rx="0.5" fill="#333" opacity="0.18" />
                          <rect x="12" y="87" width="80" height="2" rx="0.5" fill="#333" opacity="0.13" />
                          <rect x="12" y="91" width="64" height="2" rx="0.5" fill="#333" opacity="0.1" />
                          <rect x="12" y="101" width="32" height="3" rx="1" fill="#111" opacity="0.75" />
                          <rect x="12" y="107" width="96" height="1.5" rx="0.5" fill="#2563eb" opacity="0.3" />
                          <rect x="12" y="112" width="20" height="8" rx="4" fill="#2563eb" opacity="0.1" />
                          <rect x="36" y="112" width="24" height="8" rx="4" fill="#2563eb" opacity="0.08" />
                          <rect x="64" y="112" width="18" height="8" rx="4" fill="#2563eb" opacity="0.08" />
                          <rect x="12" y="126" width="32" height="3" rx="1" fill="#111" opacity="0.75" />
                          <rect x="12" y="132" width="96" height="1.5" rx="0.5" fill="#2563eb" opacity="0.3" />
                          <rect x="12" y="137" width="66" height="2" rx="0.5" fill="#333" opacity="0.15" />
                          <rect x="12" y="141" width="48" height="2" rx="0.5" fill="#333" opacity="0.12" />
                        </svg>
                      )}
                      {t === "sidebar" && (
                        <svg viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                          <rect width="120" height="160" fill="#f8fafc" />
                          <rect width="40" height="160" fill="#1e293b" />
                          <circle cx="20" cy="24" r="12" fill="none" stroke="#38bdf8" strokeWidth="2" />
                          <rect x="5" y="42" width="30" height="4" rx="1" fill="white" opacity="0.8" />
                          <rect x="5" y="49" width="20" height="2.5" rx="1" fill="#38bdf8" opacity="0.7" />
                          <rect x="5" y="58" width="30" height="1.5" rx="0.5" fill="white" opacity="0.35" />
                          <rect x="5" y="62" width="24" height="1.5" rx="0.5" fill="white" opacity="0.25" />
                          <rect x="5" y="66" width="28" height="1.5" rx="0.5" fill="white" opacity="0.2" />
                          <rect x="5" y="74" width="14" height="2" rx="0.5" fill="#38bdf8" opacity="0.6" />
                          <rect x="5" y="79" width="30" height="1.5" rx="0.5" fill="white" opacity="0.25" />
                          <rect x="5" y="83" width="22" height="1.5" rx="0.5" fill="white" opacity="0.2" />
                          <rect x="5" y="91" width="14" height="2" rx="0.5" fill="#38bdf8" opacity="0.6" />
                          <rect x="5" y="96" width="18" height="6" rx="3" fill="#38bdf8" opacity="0.2" />
                          <rect x="5" y="105" width="22" height="6" rx="3" fill="#38bdf8" opacity="0.15" />
                          <rect x="5" y="114" width="16" height="6" rx="3" fill="#38bdf8" opacity="0.12" />
                          <rect x="48" y="14" width="36" height="5" rx="1.5" fill="#1e293b" opacity="0.8" />
                          <rect x="48" y="22" width="24" height="3" rx="1" fill="#0284c7" opacity="0.7" />
                          <rect x="48" y="34" width="24" height="3" rx="1" fill="#1e293b" opacity="0.65" />
                          <rect x="48" y="40" width="64" height="1.5" rx="0.5" fill="#38bdf8" opacity="0.35" />
                          <rect x="48" y="44" width="64" height="2" rx="0.5" fill="#333" opacity="0.18" />
                          <rect x="48" y="48" width="48" height="2" rx="0.5" fill="#333" opacity="0.13" />
                          <rect x="48" y="58" width="24" height="3" rx="1" fill="#1e293b" opacity="0.65" />
                          <rect x="48" y="64" width="64" height="1.5" rx="0.5" fill="#38bdf8" opacity="0.35" />
                          <rect x="48" y="68" width="56" height="2" rx="0.5" fill="#333" opacity="0.18" />
                          <rect x="48" y="72" width="40" height="2" rx="0.5" fill="#333" opacity="0.13" />
                          <rect x="48" y="82" width="24" height="3" rx="1" fill="#1e293b" opacity="0.65" />
                          <rect x="48" y="88" width="64" height="1.5" rx="0.5" fill="#38bdf8" opacity="0.35" />
                          <rect x="48" y="92" width="44" height="2" rx="0.5" fill="#333" opacity="0.15" />
                          <rect x="48" y="102" width="24" height="3" rx="1" fill="#1e293b" opacity="0.65" />
                          <rect x="48" y="108" width="64" height="1.5" rx="0.5" fill="#38bdf8" opacity="0.35" />
                          <rect x="48" y="112" width="36" height="2" rx="0.5" fill="#333" opacity="0.15" />
                        </svg>
                      )}
                      {t === "minimal" && (
                        <svg viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                          <rect width="120" height="160" fill="white" />
                          <rect x="12" y="12" width="54" height="6" rx="1" fill="#111" opacity="0.9" />
                          <rect x="12" y="21" width="28" height="3" rx="1" fill="#555" opacity="0.45" />
                          <rect x="12" y="27" width="16" height="2" rx="1" fill="#888" opacity="0.4" />
                          <rect x="32" y="27" width="20" height="2" rx="1" fill="#888" opacity="0.4" />
                          <rect x="12" y="33" width="96" height="0.8" fill="#111" opacity="0.1" />
                          <rect x="12" y="42" width="24" height="2.5" rx="0.5" fill="#111" opacity="0.5" />
                          <rect x="12" y="48" width="96" height="2" rx="0.5" fill="#333" opacity="0.14" />
                          <rect x="12" y="52" width="72" height="2" rx="0.5" fill="#333" opacity="0.11" />
                          <rect x="12" y="56" width="84" height="2" rx="0.5" fill="#333" opacity="0.09" />
                          <rect x="12" y="66" width="24" height="2.5" rx="0.5" fill="#111" opacity="0.5" />
                          <rect x="12" y="72" width="96" height="0.8" fill="#111" opacity="0.1" />
                          <rect x="12" y="76" width="44" height="2" rx="0.5" fill="#111" opacity="0.5" />
                          <rect x="12" y="80" width="30" height="2" rx="0.5" fill="#555" opacity="0.3" />
                          <rect x="12" y="85" width="56" height="2" rx="0.5" fill="#333" opacity="0.14" />
                          <rect x="12" y="89" width="40" height="2" rx="0.5" fill="#333" opacity="0.1" />
                          <rect x="12" y="99" width="24" height="2.5" rx="0.5" fill="#111" opacity="0.5" />
                          <rect x="12" y="105" width="96" height="0.8" fill="#111" opacity="0.1" />
                          <rect x="12" y="109" width="22" height="7" rx="3.5" fill="#111" opacity="0.07" />
                          <rect x="38" y="109" width="24" height="7" rx="3.5" fill="#111" opacity="0.05" />
                          <rect x="66" y="109" width="18" height="7" rx="3.5" fill="#111" opacity="0.05" />
                          <rect x="12" y="123" width="24" height="2.5" rx="0.5" fill="#111" opacity="0.5" />
                          <rect x="12" y="129" width="96" height="0.8" fill="#111" opacity="0.1" />
                          <rect x="12" y="133" width="60" height="2" rx="0.5" fill="#333" opacity="0.12" />
                          <rect x="12" y="137" width="44" height="2" rx="0.5" fill="#333" opacity="0.09" />
                        </svg>
                      )}
                      {t === "creative" && (
                        <svg viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                          <rect width="120" height="160" fill="white" />
                          <defs>
                            <linearGradient id="cg3" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="#7c3aed" />
                              <stop offset="100%" stopColor="#db2777" />
                            </linearGradient>
                          </defs>
                          <rect width="120" height="54" fill="url(#cg3)" />
                          <rect x="12" y="13" width="48" height="6" rx="2" fill="white" opacity="0.95" />
                          <rect x="12" y="22" width="30" height="3" rx="1" fill="#f0abfc" opacity="0.9" />
                          <rect x="12" y="29" width="16" height="2.5" rx="1" fill="white" opacity="0.55" />
                          <rect x="32" y="29" width="20" height="2.5" rx="1" fill="white" opacity="0.55" />
                          <circle cx="100" cy="26" r="14" fill="none" stroke="#f0abfc" strokeWidth="2" opacity="0.7" />
                          <rect x="12" y="65" width="32" height="3" rx="1" fill="#7c3aed" opacity="0.75" />
                          <rect x="12" y="71" width="96" height="1.5" rx="0.5" fill="#a78bfa" opacity="0.4" />
                          <rect x="12" y="76" width="96" height="2" rx="0.5" fill="#333" opacity="0.18" />
                          <rect x="12" y="80" width="72" height="2" rx="0.5" fill="#333" opacity="0.13" />
                          <rect x="12" y="90" width="32" height="3" rx="1" fill="#7c3aed" opacity="0.75" />
                          <rect x="12" y="96" width="96" height="1.5" rx="0.5" fill="#a78bfa" opacity="0.4" />
                          <rect x="12" y="101" width="60" height="2" rx="0.5" fill="#333" opacity="0.18" />
                          <rect x="12" y="105" width="84" height="2" rx="0.5" fill="#333" opacity="0.13" />
                          <rect x="12" y="109" width="48" height="2" rx="0.5" fill="#333" opacity="0.1" />
                          <rect x="12" y="119" width="32" height="3" rx="1" fill="#7c3aed" opacity="0.75" />
                          <rect x="12" y="125" width="96" height="1.5" rx="0.5" fill="#a78bfa" opacity="0.4" />
                          <rect x="12" y="130" width="20" height="8" rx="4" fill="#7c3aed" opacity="0.1" />
                          <rect x="36" y="130" width="24" height="8" rx="4" fill="#db2777" opacity="0.08" />
                          <rect x="64" y="130" width="18" height="8" rx="4" fill="#7c3aed" opacity="0.08" />
                          <rect x="12" y="144" width="32" height="3" rx="1" fill="#7c3aed" opacity="0.75" />
                          <rect x="12" y="150" width="96" height="1.5" rx="0.5" fill="#a78bfa" opacity="0.4" />
                          <rect x="12" y="154" width="50" height="2" rx="0.5" fill="#333" opacity="0.13" />
                        </svg>
                      )}
                      {t === "corporate" && (
                        <svg viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                          <rect width="120" height="160" fill="white" />
                          <rect width="120" height="54" fill="#14532d" />
                          <rect x="12" y="13" width="48" height="6" rx="2" fill="white" opacity="0.95" />
                          <rect x="12" y="22" width="30" height="3" rx="1" fill="#4ade80" opacity="0.9" />
                          <rect x="12" y="29" width="16" height="2.5" rx="1" fill="white" opacity="0.55" />
                          <rect x="32" y="29" width="20" height="2.5" rx="1" fill="white" opacity="0.55" />
                          <circle cx="100" cy="26" r="14" fill="none" stroke="#4ade80" strokeWidth="2" opacity="0.6" />
                          <rect x="12" y="49" width="96" height="1.5" fill="#4ade80" opacity="0.4" />
                          <rect x="12" y="65" width="32" height="3" rx="1" fill="#14532d" opacity="0.75" />
                          <rect x="12" y="71" width="96" height="1.5" rx="0.5" fill="#16a34a" opacity="0.35" />
                          <rect x="12" y="76" width="96" height="2" rx="0.5" fill="#333" opacity="0.18" />
                          <rect x="12" y="80" width="72" height="2" rx="0.5" fill="#333" opacity="0.13" />
                          <rect x="12" y="90" width="32" height="3" rx="1" fill="#14532d" opacity="0.75" />
                          <rect x="12" y="96" width="96" height="1.5" rx="0.5" fill="#16a34a" opacity="0.35" />
                          <rect x="12" y="101" width="60" height="2" rx="0.5" fill="#333" opacity="0.18" />
                          <rect x="12" y="105" width="84" height="2" rx="0.5" fill="#333" opacity="0.13" />
                          <rect x="12" y="115" width="32" height="3" rx="1" fill="#14532d" opacity="0.75" />
                          <rect x="12" y="121" width="96" height="1.5" rx="0.5" fill="#16a34a" opacity="0.35" />
                          <rect x="12" y="126" width="20" height="8" rx="4" fill="#14532d" opacity="0.1" />
                          <rect x="36" y="126" width="24" height="8" rx="4" fill="#14532d" opacity="0.08" />
                          <rect x="64" y="126" width="18" height="8" rx="4" fill="#14532d" opacity="0.07" />
                          <rect x="12" y="140" width="32" height="3" rx="1" fill="#14532d" opacity="0.75" />
                          <rect x="12" y="146" width="96" height="1.5" rx="0.5" fill="#16a34a" opacity="0.35" />
                          <rect x="12" y="151" width="50" height="2" rx="0.5" fill="#333" opacity="0.13" />
                        </svg>
                      )}
                    </div>
                    <span className="text-[10px] sm:text-xs font-semibold tracking-wide">{labels[t]}</span>
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
              <div className="col-span-full lg:col-span-2 xl:col-span-1 space-y-4 lg:sticky lg:top-4 lg:max-h-[calc(100vh-100px)] overflow-y-auto">
                <div className="rounded-2xl border border-border bg-muted/30 p-3 sm:p-4 overflow-hidden">
                  <p className="text-[10px] sm:text-xs text-muted-foreground mb-2 sm:mb-3 text-center font-medium uppercase tracking-wider">
                    Live Preview {!isPaid && <span className="text-primary">· Protected</span>}
                  </p>
                  <div className="transform-gpu origin-top scale-[0.75] sm:scale-[0.85] lg:scale-100">
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
