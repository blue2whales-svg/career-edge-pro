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
    () => {
      const params = new URLSearchParams(window.location.search);
      const t = params.get("t");
      const valid = ["executive", "clean", "sidebar", "minimal", "creative", "corporate"];
      return (t && valid.includes(t) ? t : "executive") as
        | "executive"
        | "clean"
        | "sidebar"
        | "minimal"
        | "creative"
        | "corporate";
    },
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
              {/* Executive */}
              <button
                onClick={() => {
                  setTemplate("executive");
                  setShowPreview(true);
                }}
                className={`flex flex-col items-center gap-1.5 rounded-xl transition-all ${template === "executive" ? "opacity-100" : "opacity-70 hover:opacity-90"}`}
              >
                <div
                  className={`w-full aspect-[3/4] rounded-lg overflow-hidden shadow-md ${template === "executive" ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "ring-1 ring-border"}`}
                  style={{ userSelect: "none", pointerEvents: "none" }}
                >
                  <div style={{ fontFamily: "Georgia,serif", height: "100%", background: "#fff" }}>
                    <div style={{ background: "#1a1a2e", padding: "8px 8px 6px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <div
                            style={{
                              fontSize: "5.5px",
                              fontWeight: 800,
                              color: "#c9a84c",
                              letterSpacing: "1px",
                              textTransform: "uppercase",
                            }}
                          >
                            JAMES MITCHELL
                          </div>
                          <div style={{ fontSize: "3.5px", color: "#c9a84c", opacity: 0.8, marginTop: "1px" }}>
                            Chief Marketing Officer
                          </div>
                          <div style={{ fontSize: "3px", color: "#aab4cc", marginTop: "2px" }}>
                            james@email.com · +254 722 000 000
                          </div>
                        </div>
                        <div
                          style={{
                            width: "14px",
                            height: "14px",
                            borderRadius: "50%",
                            border: "1px solid #c9a84c",
                            background: "rgba(201,168,76,0.15)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <span style={{ fontSize: "3px", color: "#c9a84c" }}>JM</span>
                        </div>
                      </div>
                      <div
                        style={{
                          height: "0.5px",
                          background: "linear-gradient(90deg,#c9a84c,transparent)",
                          marginTop: "5px",
                        }}
                      />
                    </div>
                    <div style={{ padding: "5px 8px" }}>
                      <div style={{ marginBottom: "4px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "3px", marginBottom: "2px" }}>
                          <span
                            style={{
                              fontSize: "3px",
                              fontWeight: 900,
                              color: "#1a1a2e",
                              letterSpacing: "0.8px",
                              textTransform: "uppercase",
                              whiteSpace: "nowrap",
                            }}
                          >
                            SUMMARY
                          </span>
                          <div
                            style={{
                              flex: 1,
                              height: "0.5px",
                              background: "linear-gradient(90deg,#c9a84c,transparent)",
                            }}
                          />
                        </div>
                        <div style={{ fontSize: "3px", color: "#444", lineHeight: 1.5 }}>
                          Visionary executive with 15+ years leading brand transformation across Fortune 500 companies.
                        </div>
                      </div>
                      <div style={{ marginBottom: "4px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "3px", marginBottom: "2px" }}>
                          <span
                            style={{
                              fontSize: "3px",
                              fontWeight: 900,
                              color: "#1a1a2e",
                              letterSpacing: "0.8px",
                              textTransform: "uppercase",
                              whiteSpace: "nowrap",
                            }}
                          >
                            EXPERIENCE
                          </span>
                          <div
                            style={{
                              flex: 1,
                              height: "0.5px",
                              background: "linear-gradient(90deg,#c9a84c,transparent)",
                            }}
                          />
                        </div>
                        <div style={{ fontSize: "3px", color: "#444", lineHeight: 1.5 }}>
                          Chief Marketing Officer · Safaricom PLC · 2020–Present
                        </div>
                        <div style={{ fontSize: "3px", color: "#666", lineHeight: 1.5 }}>
                          Delivered 156% revenue growth · Built 45-person team
                        </div>
                      </div>
                      <div style={{ marginBottom: "4px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "3px", marginBottom: "2px" }}>
                          <span
                            style={{
                              fontSize: "3px",
                              fontWeight: 900,
                              color: "#1a1a2e",
                              letterSpacing: "0.8px",
                              textTransform: "uppercase",
                              whiteSpace: "nowrap",
                            }}
                          >
                            EDUCATION
                          </span>
                          <div
                            style={{
                              flex: 1,
                              height: "0.5px",
                              background: "linear-gradient(90deg,#c9a84c,transparent)",
                            }}
                          />
                        </div>
                        <div style={{ fontSize: "3px", color: "#444", lineHeight: 1.5 }}>
                          MBA Marketing · University of Nairobi · 2018
                        </div>
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "3px", marginBottom: "2px" }}>
                          <span
                            style={{
                              fontSize: "3px",
                              fontWeight: 900,
                              color: "#1a1a2e",
                              letterSpacing: "0.8px",
                              textTransform: "uppercase",
                              whiteSpace: "nowrap",
                            }}
                          >
                            SKILLS
                          </span>
                          <div
                            style={{
                              flex: 1,
                              height: "0.5px",
                              background: "linear-gradient(90deg,#c9a84c,transparent)",
                            }}
                          />
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "2px" }}>
                          {["P&L Mgmt", "Brand Strategy", "Board Relations"].map((s) => (
                            <span
                              key={s}
                              style={{
                                fontSize: "2.5px",
                                background: "rgba(201,168,76,0.1)",
                                border: "0.5px solid rgba(201,168,76,0.3)",
                                color: "#1a1a2e",
                                padding: "1px 3px",
                                borderRadius: "8px",
                              }}
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] sm:text-xs font-semibold tracking-wide">Executive</span>
              </button>

              {/* Clean */}
              <button
                onClick={() => {
                  setTemplate("clean");
                  setShowPreview(true);
                }}
                className={`flex flex-col items-center gap-1.5 rounded-xl transition-all ${template === "clean" ? "opacity-100" : "opacity-70 hover:opacity-90"}`}
              >
                <div
                  className={`w-full aspect-[3/4] rounded-lg overflow-hidden shadow-md ${template === "clean" ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "ring-1 ring-border"}`}
                  style={{ userSelect: "none", pointerEvents: "none" }}
                >
                  <div style={{ fontFamily: "Arial,sans-serif", height: "100%", background: "#fff", padding: "8px" }}>
                    <div style={{ borderBottom: "1.5px solid #2563eb", paddingBottom: "5px", marginBottom: "5px" }}>
                      <div style={{ fontSize: "5.5px", fontWeight: 700, color: "#111" }}>JAMES MITCHELL</div>
                      <div style={{ fontSize: "3.5px", color: "#2563eb", fontWeight: 600, marginTop: "1px" }}>
                        Senior Marketing Manager
                      </div>
                      <div style={{ fontSize: "3px", color: "#555", marginTop: "2px" }}>
                        james@email.com | +254 722 000 000 | Nairobi
                      </div>
                    </div>
                    <div style={{ marginBottom: "4px" }}>
                      <div
                        style={{
                          fontSize: "3px",
                          fontWeight: 700,
                          color: "#111",
                          textTransform: "uppercase",
                          marginBottom: "1.5px",
                        }}
                      >
                        Professional Summary
                      </div>
                      <div style={{ fontSize: "3px", color: "#333", lineHeight: 1.5 }}>
                        Marketing professional with 8+ years in digital marketing, brand management and team leadership
                        with proven results.
                      </div>
                    </div>
                    <div style={{ marginBottom: "4px" }}>
                      <div
                        style={{
                          fontSize: "3px",
                          fontWeight: 700,
                          color: "#111",
                          textTransform: "uppercase",
                          marginBottom: "1.5px",
                        }}
                      >
                        Work Experience
                      </div>
                      <div style={{ fontSize: "3px", color: "#333", lineHeight: 1.5 }}>
                        Marketing Director · Safaricom PLC · 2021–Present
                      </div>
                      <div style={{ fontSize: "3px", color: "#555", lineHeight: 1.5 }}>
                        Increased engagement by 43% · Led team of 12 professionals
                      </div>
                    </div>
                    <div style={{ marginBottom: "4px" }}>
                      <div
                        style={{
                          fontSize: "3px",
                          fontWeight: 700,
                          color: "#111",
                          textTransform: "uppercase",
                          marginBottom: "1.5px",
                        }}
                      >
                        Education
                      </div>
                      <div style={{ fontSize: "3px", color: "#333", lineHeight: 1.5 }}>
                        MBA Marketing · University of Nairobi · 2018
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "3px",
                          fontWeight: 700,
                          color: "#111",
                          textTransform: "uppercase",
                          marginBottom: "1.5px",
                        }}
                      >
                        Skills
                      </div>
                      <div style={{ fontSize: "3px", color: "#333" }}>
                        Brand Strategy | Digital Marketing | SEO/SEM | Analytics | Leadership
                      </div>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] sm:text-xs font-semibold tracking-wide">Clean</span>
              </button>

              {/* Sidebar */}
              <button
                onClick={() => {
                  setTemplate("sidebar");
                  setShowPreview(true);
                }}
                className={`flex flex-col items-center gap-1.5 rounded-xl transition-all ${template === "sidebar" ? "opacity-100" : "opacity-70 hover:opacity-90"}`}
              >
                <div
                  className={`w-full aspect-[3/4] rounded-lg overflow-hidden shadow-md ${template === "sidebar" ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "ring-1 ring-border"}`}
                  style={{ userSelect: "none", pointerEvents: "none" }}
                >
                  <div style={{ fontFamily: "Arial,sans-serif", display: "flex", height: "100%", background: "#fff" }}>
                    <div style={{ width: "35%", background: "#1e293b", padding: "8px 5px" }}>
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          border: "1px solid #38bdf8",
                          background: "rgba(56,189,248,0.15)",
                          margin: "0 auto 4px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span style={{ fontSize: "4px", color: "#38bdf8", fontWeight: 700 }}>JM</span>
                      </div>
                      <div
                        style={{
                          fontSize: "3.5px",
                          fontWeight: 700,
                          color: "#fff",
                          textAlign: "center",
                          marginBottom: "1px",
                        }}
                      >
                        JAMES MITCHELL
                      </div>
                      <div style={{ fontSize: "3px", color: "#38bdf8", textAlign: "center", marginBottom: "4px" }}>
                        Marketing Director
                      </div>
                      <div style={{ height: "0.5px", background: "rgba(56,189,248,0.3)", marginBottom: "4px" }} />
                      <div style={{ fontSize: "2.8px", color: "#94a3b8", lineHeight: 1.8, marginBottom: "4px" }}>
                        james@email.com · Nairobi, Kenya
                      </div>
                      <div
                        style={{
                          fontSize: "3px",
                          fontWeight: 700,
                          color: "#38bdf8",
                          textTransform: "uppercase",
                          marginBottom: "2px",
                        }}
                      >
                        Skills
                      </div>
                      {["Brand Strategy", "Digital Mktg", "Analytics", "Leadership"].map((s) => (
                        <div
                          key={s}
                          style={{
                            fontSize: "2.8px",
                            color: "#94a3b8",
                            background: "rgba(56,189,248,0.1)",
                            padding: "1px 3px",
                            borderRadius: "2px",
                            marginBottom: "1px",
                          }}
                        >
                          {s}
                        </div>
                      ))}
                    </div>
                    <div style={{ flex: 1, padding: "8px 6px" }}>
                      <div style={{ marginBottom: "4px" }}>
                        <div
                          style={{
                            fontSize: "3px",
                            fontWeight: 700,
                            color: "#1e293b",
                            textTransform: "uppercase",
                            borderBottom: "0.5px solid #38bdf8",
                            paddingBottom: "1px",
                            marginBottom: "2px",
                          }}
                        >
                          Summary
                        </div>
                        <div style={{ fontSize: "2.8px", color: "#444", lineHeight: 1.5 }}>
                          Results-driven professional with 8+ years across East Africa in brand and digital marketing.
                        </div>
                      </div>
                      <div style={{ marginBottom: "4px" }}>
                        <div
                          style={{
                            fontSize: "3px",
                            fontWeight: 700,
                            color: "#1e293b",
                            textTransform: "uppercase",
                            borderBottom: "0.5px solid #38bdf8",
                            paddingBottom: "1px",
                            marginBottom: "2px",
                          }}
                        >
                          Experience
                        </div>
                        <div style={{ fontSize: "2.8px", color: "#444", lineHeight: 1.5, fontWeight: 600 }}>
                          Marketing Director
                        </div>
                        <div style={{ fontSize: "2.8px", color: "#38bdf8", lineHeight: 1.5 }}>
                          Safaricom PLC · 2021–Present
                        </div>
                        <div style={{ fontSize: "2.8px", color: "#555", lineHeight: 1.5 }}>
                          Grew brand by 43% · Led team of 12
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: "3px",
                            fontWeight: 700,
                            color: "#1e293b",
                            textTransform: "uppercase",
                            borderBottom: "0.5px solid #38bdf8",
                            paddingBottom: "1px",
                            marginBottom: "2px",
                          }}
                        >
                          Education
                        </div>
                        <div style={{ fontSize: "2.8px", color: "#444", lineHeight: 1.5 }}>
                          MBA Marketing · Univ. of Nairobi · 2018
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] sm:text-xs font-semibold tracking-wide">Sidebar</span>
              </button>

              {/* Minimal */}
              <button
                onClick={() => {
                  setTemplate("minimal");
                  setShowPreview(true);
                }}
                className={`flex flex-col items-center gap-1.5 rounded-xl transition-all ${template === "minimal" ? "opacity-100" : "opacity-70 hover:opacity-90"}`}
              >
                <div
                  className={`w-full aspect-[3/4] rounded-lg overflow-hidden shadow-md ${template === "minimal" ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "ring-1 ring-border"}`}
                  style={{ userSelect: "none", pointerEvents: "none" }}
                >
                  <div
                    style={{
                      fontFamily: "Helvetica,Arial,sans-serif",
                      height: "100%",
                      background: "#fff",
                      padding: "8px",
                    }}
                  >
                    <div style={{ marginBottom: "6px" }}>
                      <div style={{ fontSize: "6px", fontWeight: 800, color: "#111" }}>James Mitchell</div>
                      <div style={{ fontSize: "3.5px", color: "#555", marginTop: "1px" }}>Senior Marketing Manager</div>
                      <div style={{ fontSize: "3px", color: "#888", marginTop: "2px" }}>
                        james@email.com · +254 722 000 000
                      </div>
                      <div style={{ height: "0.3px", background: "#111", marginTop: "4px", opacity: 0.1 }} />
                    </div>
                    <div style={{ marginBottom: "4px" }}>
                      <div
                        style={{
                          fontSize: "2.8px",
                          fontWeight: 700,
                          color: "#111",
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                          marginBottom: "1.5px",
                          opacity: 0.5,
                        }}
                      >
                        Summary
                      </div>
                      <div style={{ fontSize: "3px", color: "#444", lineHeight: 1.5 }}>
                        Results-driven professional with 8+ years in brand strategy and digital marketing.
                      </div>
                    </div>
                    <div style={{ marginBottom: "4px" }}>
                      <div
                        style={{
                          fontSize: "2.8px",
                          fontWeight: 700,
                          color: "#111",
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                          marginBottom: "1.5px",
                          opacity: 0.5,
                        }}
                      >
                        Experience
                      </div>
                      <div style={{ fontSize: "3px", color: "#333", fontWeight: 600 }}>
                        Marketing Director · Safaricom PLC
                      </div>
                      <div style={{ fontSize: "3px", color: "#666" }}>2021–Present · Grew brand engagement 43%</div>
                    </div>
                    <div style={{ marginBottom: "4px" }}>
                      <div
                        style={{
                          fontSize: "2.8px",
                          fontWeight: 700,
                          color: "#111",
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                          marginBottom: "1.5px",
                          opacity: 0.5,
                        }}
                      >
                        Education
                      </div>
                      <div style={{ fontSize: "3px", color: "#333" }}>MBA Marketing · University of Nairobi · 2018</div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "2.8px",
                          fontWeight: 700,
                          color: "#111",
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                          marginBottom: "1.5px",
                          opacity: 0.5,
                        }}
                      >
                        Skills
                      </div>
                      <div style={{ fontSize: "3px", color: "#555" }}>
                        Brand Strategy · Digital Marketing · SEO/SEM · Analytics
                      </div>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] sm:text-xs font-semibold tracking-wide">Minimal</span>
              </button>

              {/* Creative */}
              <button
                onClick={() => {
                  setTemplate("creative");
                  setShowPreview(true);
                }}
                className={`flex flex-col items-center gap-1.5 rounded-xl transition-all ${template === "creative" ? "opacity-100" : "opacity-70 hover:opacity-90"}`}
              >
                <div
                  className={`w-full aspect-[3/4] rounded-lg overflow-hidden shadow-md ${template === "creative" ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "ring-1 ring-border"}`}
                  style={{ userSelect: "none", pointerEvents: "none" }}
                >
                  <div style={{ fontFamily: "Arial,sans-serif", height: "100%", background: "#fff" }}>
                    <div style={{ background: "linear-gradient(135deg,#7c3aed,#db2777)", padding: "8px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontSize: "5.5px", fontWeight: 800, color: "#fff" }}>JAMES MITCHELL</div>
                          <div style={{ fontSize: "3.5px", color: "rgba(255,255,255,0.85)", marginTop: "1px" }}>
                            Senior Marketing Manager
                          </div>
                          <div style={{ fontSize: "3px", color: "rgba(255,255,255,0.6)", marginTop: "2px" }}>
                            james@email.com · Nairobi
                          </div>
                        </div>
                        <div
                          style={{
                            width: "14px",
                            height: "14px",
                            borderRadius: "50%",
                            border: "1px solid rgba(255,255,255,0.5)",
                            background: "rgba(255,255,255,0.15)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <span style={{ fontSize: "3px", color: "#fff" }}>JM</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ padding: "5px 8px" }}>
                      <div style={{ marginBottom: "4px" }}>
                        <div
                          style={{
                            fontSize: "3px",
                            fontWeight: 700,
                            color: "#7c3aed",
                            textTransform: "uppercase",
                            letterSpacing: "0.8px",
                            marginBottom: "1.5px",
                          }}
                        >
                          Profile
                        </div>
                        <div style={{ fontSize: "3px", color: "#444", lineHeight: 1.5 }}>
                          Results-driven professional with 8+ years in brand strategy and digital marketing across East
                          Africa.
                        </div>
                      </div>
                      <div style={{ marginBottom: "4px" }}>
                        <div
                          style={{
                            fontSize: "3px",
                            fontWeight: 700,
                            color: "#7c3aed",
                            textTransform: "uppercase",
                            letterSpacing: "0.8px",
                            marginBottom: "1.5px",
                          }}
                        >
                          Experience
                        </div>
                        <div style={{ fontSize: "3px", color: "#333", fontWeight: 600 }}>
                          Marketing Director · Safaricom PLC
                        </div>
                        <div style={{ fontSize: "3px", color: "#7c3aed" }}>2021–Present · Increased engagement 43%</div>
                      </div>
                      <div style={{ marginBottom: "4px" }}>
                        <div
                          style={{
                            fontSize: "3px",
                            fontWeight: 700,
                            color: "#7c3aed",
                            textTransform: "uppercase",
                            letterSpacing: "0.8px",
                            marginBottom: "1.5px",
                          }}
                        >
                          Education
                        </div>
                        <div style={{ fontSize: "3px", color: "#444" }}>
                          MBA Marketing · University of Nairobi · 2018
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: "3px",
                            fontWeight: 700,
                            color: "#7c3aed",
                            textTransform: "uppercase",
                            letterSpacing: "0.8px",
                            marginBottom: "1.5px",
                          }}
                        >
                          Skills
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "2px" }}>
                          {["Brand Strategy", "Digital Mktg", "Analytics"].map((s) => (
                            <span
                              key={s}
                              style={{
                                fontSize: "2.5px",
                                background: "rgba(124,58,237,0.1)",
                                border: "0.5px solid rgba(124,58,237,0.3)",
                                color: "#7c3aed",
                                padding: "1px 3px",
                                borderRadius: "8px",
                              }}
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] sm:text-xs font-semibold tracking-wide">Creative</span>
              </button>

              {/* Corporate */}
              <button
                onClick={() => {
                  setTemplate("corporate");
                  setShowPreview(true);
                }}
                className={`flex flex-col items-center gap-1.5 rounded-xl transition-all ${template === "corporate" ? "opacity-100" : "opacity-70 hover:opacity-90"}`}
              >
                <div
                  className={`w-full aspect-[3/4] rounded-lg overflow-hidden shadow-md ${template === "corporate" ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "ring-1 ring-border"}`}
                  style={{ userSelect: "none", pointerEvents: "none" }}
                >
                  <div style={{ fontFamily: "Georgia,serif", height: "100%", background: "#fff" }}>
                    <div style={{ background: "#14532d", padding: "8px 8px 6px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <div
                            style={{
                              fontSize: "5.5px",
                              fontWeight: 800,
                              color: "#fff",
                              letterSpacing: "1px",
                              textTransform: "uppercase",
                            }}
                          >
                            JAMES MITCHELL
                          </div>
                          <div style={{ fontSize: "3.5px", color: "#4ade80", marginTop: "1px" }}>
                            Senior Marketing Manager
                          </div>
                          <div style={{ fontSize: "3px", color: "rgba(255,255,255,0.6)", marginTop: "2px" }}>
                            james@email.com · +254 722 000 000
                          </div>
                        </div>
                        <div
                          style={{
                            width: "14px",
                            height: "14px",
                            borderRadius: "50%",
                            border: "1px solid #4ade80",
                            background: "rgba(74,222,128,0.15)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <span style={{ fontSize: "3px", color: "#4ade80" }}>JM</span>
                        </div>
                      </div>
                      <div
                        style={{
                          height: "0.5px",
                          background: "linear-gradient(90deg,#4ade80,transparent)",
                          marginTop: "5px",
                        }}
                      />
                    </div>
                    <div style={{ padding: "5px 8px" }}>
                      <div style={{ marginBottom: "4px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "3px", marginBottom: "2px" }}>
                          <span
                            style={{
                              fontSize: "3px",
                              fontWeight: 900,
                              color: "#14532d",
                              letterSpacing: "0.8px",
                              textTransform: "uppercase",
                              whiteSpace: "nowrap",
                            }}
                          >
                            SUMMARY
                          </span>
                          <div
                            style={{
                              flex: 1,
                              height: "0.5px",
                              background: "linear-gradient(90deg,#4ade80,transparent)",
                            }}
                          />
                        </div>
                        <div style={{ fontSize: "3px", color: "#444", lineHeight: 1.5 }}>
                          Results-driven professional with 8+ years in brand strategy and digital marketing.
                        </div>
                      </div>
                      <div style={{ marginBottom: "4px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "3px", marginBottom: "2px" }}>
                          <span
                            style={{
                              fontSize: "3px",
                              fontWeight: 900,
                              color: "#14532d",
                              letterSpacing: "0.8px",
                              textTransform: "uppercase",
                              whiteSpace: "nowrap",
                            }}
                          >
                            EXPERIENCE
                          </span>
                          <div
                            style={{
                              flex: 1,
                              height: "0.5px",
                              background: "linear-gradient(90deg,#4ade80,transparent)",
                            }}
                          />
                        </div>
                        <div style={{ fontSize: "3px", color: "#333", fontWeight: 600 }}>
                          Marketing Director · Safaricom PLC · 2021–Present
                        </div>
                        <div style={{ fontSize: "3px", color: "#555" }}>Increased engagement 43% · Led team of 12</div>
                      </div>
                      <div style={{ marginBottom: "4px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "3px", marginBottom: "2px" }}>
                          <span
                            style={{
                              fontSize: "3px",
                              fontWeight: 900,
                              color: "#14532d",
                              letterSpacing: "0.8px",
                              textTransform: "uppercase",
                              whiteSpace: "nowrap",
                            }}
                          >
                            EDUCATION
                          </span>
                          <div
                            style={{
                              flex: 1,
                              height: "0.5px",
                              background: "linear-gradient(90deg,#4ade80,transparent)",
                            }}
                          />
                        </div>
                        <div style={{ fontSize: "3px", color: "#444" }}>
                          MBA Marketing · University of Nairobi · 2018
                        </div>
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "3px", marginBottom: "2px" }}>
                          <span
                            style={{
                              fontSize: "3px",
                              fontWeight: 900,
                              color: "#14532d",
                              letterSpacing: "0.8px",
                              textTransform: "uppercase",
                              whiteSpace: "nowrap",
                            }}
                          >
                            SKILLS
                          </span>
                          <div
                            style={{
                              flex: 1,
                              height: "0.5px",
                              background: "linear-gradient(90deg,#4ade80,transparent)",
                            }}
                          />
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "2px" }}>
                          {["Brand Strategy", "Digital Mktg", "Analytics"].map((s) => (
                            <span
                              key={s}
                              style={{
                                fontSize: "2.5px",
                                background: "rgba(20,83,45,0.1)",
                                border: "0.5px solid rgba(20,83,45,0.3)",
                                color: "#14532d",
                                padding: "1px 3px",
                                borderRadius: "8px",
                              }}
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] sm:text-xs font-semibold tracking-wide">Corporate</span>
              </button>
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
