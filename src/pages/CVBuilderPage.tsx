import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, User, FileText, Briefcase, GraduationCap, Wrench, Globe, ListPlus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { CVData, initialCVData } from "@/components/cv-builder/types";
import StepPersonalDetails from "@/components/cv-builder/StepPersonalDetails";
import StepSummary from "@/components/cv-builder/StepSummary";
import StepWorkExperience from "@/components/cv-builder/StepWorkExperience";
import StepEducation from "@/components/cv-builder/StepEducation";
import StepSkills from "@/components/cv-builder/StepSkills";
import StepLanguages from "@/components/cv-builder/StepLanguages";
import StepAdditional from "@/components/cv-builder/StepAdditional";
import StepSettings from "@/components/cv-builder/StepSettings";
import CVPreview from "@/components/cv-builder/CVPreview";
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
];

export default function CVBuilderPage() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<CVData>(initialCVData);
  const [showPreview, setShowPreview] = useState(false);
  const isMobile = useIsMobile();

  const progress = ((step + 1) / STEPS.length) * 100;

  const update = (updates: Partial<CVData>) => setData((prev) => ({ ...prev, ...updates }));

  const renderStep = () => {
    switch (step) {
      case 0: return <StepPersonalDetails data={data} onChange={update} />;
      case 1: return <StepSummary data={data} onChange={update} />;
      case 2: return <StepWorkExperience data={data} onChange={update} />;
      case 3: return <StepEducation data={data} onChange={update} />;
      case 4: return <StepSkills data={data} onChange={update} />;
      case 5: return <StepLanguages data={data} onChange={update} />;
      case 6: return <StepAdditional data={data} onChange={update} />;
      case 7: return <StepSettings data={data} onChange={update} />;
      default: return null;
    }
  };

  return (
    <PageLayout>
      <section className="relative z-10 pt-6 pb-24 px-4">
        <div className="container max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <Link to="/">
              <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-serif font-bold">
                CV <span className="text-gradient">Builder</span>
              </h1>
            </div>
            {isMobile && (
              <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
                {showPreview ? "Edit" : "Preview"}
              </Button>
            )}
          </div>

          {/* Progress */}
          <Progress value={progress} className="h-1.5 mb-4" />

          {/* Step indicators */}
          <div className="flex gap-1 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <button
                  key={i}
                  onClick={() => setStep(i)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    i === step
                      ? "bg-primary text-primary-foreground"
                      : i < step
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  <span className="hidden sm:inline">{s.label}</span>
                  <span className="sm:hidden">{i + 1}</span>
                </button>
              );
            })}
          </div>

          {/* Main content */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Form panel */}
            {(!isMobile || !showPreview) && (
              <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {renderStep()}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex justify-between mt-8 pt-4 border-t border-border">
                  <Button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} variant="outline">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Previous
                  </Button>
                  {step < STEPS.length - 1 ? (
                    <Button onClick={() => setStep(step + 1)} className="bg-gradient-brand border-0">
                      Next <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  ) : (
                    <Button className="bg-gradient-brand border-0">
                      Generate CV <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Preview panel */}
            {(!isMobile || showPreview) && (
              <div className="rounded-2xl border border-border bg-muted/30 p-4 lg:sticky lg:top-6 lg:max-h-[calc(100vh-120px)] overflow-y-auto">
                <p className="text-xs text-muted-foreground mb-3 text-center font-medium uppercase tracking-wider">Live Preview</p>
                <CVPreview data={data} />
              </div>
            )}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
