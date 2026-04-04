import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Shield, Globe, Zap, GraduationCap, Pen, Linkedin, Award,
  BookOpen, Users, ArrowRight, Check, Briefcase, FileCheck, Target,
  Clock, Star, Sparkles, HelpCircle, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { trackViewContent } from "@/hooks/useFbPixel";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

const ALL_SERVICES = [
  {
    icon: FileText, title: "Professional CV Writing", category: "Job Seeker",
    desc: "ATS-friendly, keyword-optimised CVs for all industries and career levels.",
    features: ["ATS-optimised formatting", "Industry-specific keywords", "Achievement-focused content", "Same-day delivery available"],
    price: "From KES 1,490",
  },
  {
    icon: Award, title: "Executive CV Writing", category: "Executive",
    desc: "Premium CVs for C-suite, VP, and Director-level professionals.",
    features: ["Board-level language", "Human editor review", "Executive bio included", "Strategic positioning"],
    price: "From KES 2,490",
  },
  {
    icon: Shield, title: "ATS-Optimised CV", category: "Job Seeker",
    desc: "Engineered specifically to pass applicant tracking systems with high scores.",
    features: ["ATS score guarantee", "Keyword density analysis", "Format compliance", "Machine-readable layout"],
    price: "From KES 1,490",
  },
  {
    icon: Globe, title: "International CV", category: "Job Seeker",
    desc: "Country-specific formatting for 15+ markets worldwide.",
    features: ["Local format standards", "Cultural adaptation", "Language considerations", "Market-specific keywords"],
    price: "From KES 2,000",
  },
  {
    icon: Pen, title: "Cover Letter Writing", category: "Job Seeker",
    desc: "Tailored per application with a compelling hook that gets read.",
    features: ["Company-specific research", "Role alignment", "Compelling narrative", "Action-oriented close"],
    price: "From KES 900",
  },
  {
    icon: Linkedin, title: "LinkedIn Optimisation", category: "Job Seeker",
    desc: "Complete profile overhaul — written by specialists to get you found, messaged, and hired.",
    features: [
      "Keyword-rich headline (recruiter search optimised)",
      "Full About section rewrite (storytelling format)",
      "Experience section — achievement-based bullet rewrites for every role",
      "Skills section — top 50 industry keywords for maximum discoverability",
      "Profile strength checklist (photo, banner, URL, featured section tips)",
      "Networking & content strategy guide (PDF delivery)",
    ],
    price: "From KES 2,000",
  },
  {
    icon: BookOpen, title: "Personal Statement", category: "Academic",
    desc: "UCAS, postgraduate, MBA — compelling narratives that admissions love.",
    features: ["University-specific tone", "Authentic voice", "Structure optimisation", "Multiple revisions"],
    price: "From KES 3,500",
  },
  {
    icon: GraduationCap, title: "Scholarship Essays", category: "Academic",
    desc: "13 major scholarship programs covered with proven success rates.",
    features: ["Program-specific format", "Leadership narratives", "Impact storytelling", "Deadline management"],
    price: "From KES 2,500",
  },
  {
    icon: Users, title: "Reference Letters", category: "Academic",
    desc: "We draft professional reference letters — your referee approves and signs.",
    features: ["Professional tone", "Achievement highlights", "Customised per program", "Quick turnaround"],
    price: "From KES 1,500",
  },
  {
    icon: Target, title: "Career Change CV", category: "Job Seeker",
    desc: "Repositioning your experience for a completely new industry or role.",
    features: ["Transferable skills focus", "Industry bridging", "Narrative reframing", "Skills-based format"],
    price: "From KES 2,490",
  },
  {
    icon: Briefcase, title: "Executive Bio", category: "Executive",
    desc: "Professional biography for board presentations, websites, and conferences.",
    features: ["Multiple lengths", "Tone versatility", "Achievement narrative", "Brand positioning"],
    price: "From KES 2,490",
  },
  {
    icon: FileCheck, title: "CV Review & Critique", category: "Job Seeker",
    desc: "Detailed feedback report with actionable improvements for your existing CV.",
    features: ["ATS compatibility check", "Content analysis", "Format assessment", "Improvement roadmap"],
    price: "From KES 900",
  },
];

const CV_COMPARISON = [
  { feature: "ATS-friendly format", values: [true, true, false, true, true] },
  { feature: "Visual design elements", values: [false, false, true, false, "Market-specific"] },
  { feature: "Keyword optimisation", values: ["Basic", "Advanced", "Basic", "Advanced", "Advanced"] },
  { feature: "Two-column layout", values: [false, false, true, false, "Market-specific"] },
  { feature: "Human editor review", values: [false, false, false, true, false] },
  { feature: "Country formatting", values: [false, false, false, false, true] },
  { feature: "Photo adaptation", values: [false, false, false, false, true] },
  { feature: "Best for", values: ["Corporate roles", "Online portals", "Creative / tech", "C-suite / VP", "Gulf / UK / EU"] },
];

const QUIZ_QUESTIONS = [
  {
    question: "How are you applying?",
    options: [
      { label: "Online job portals", result: "ats" },
      { label: "Direct to hiring manager", result: "professional" },
      { label: "Creative / startup role", result: "modern" },
      { label: "Abroad (Gulf, UK, EU)", result: "international" },
    ],
  },
  {
    question: "What's your experience level?",
    options: [
      { label: "Entry-level / Graduate", result: "professional" },
      { label: "Mid-level (3-8 years)", result: "ats" },
      { label: "Senior / Manager", result: "ats" },
      { label: "Director / C-suite", result: "executive" },
    ],
  },
  {
    question: "What matters most to you?",
    options: [
      { label: "Passing ATS screening", result: "ats" },
      { label: "Standing out visually", result: "modern" },
      { label: "Corporate credibility", result: "professional" },
      { label: "International standards", result: "international" },
    ],
  },
];

const QUIZ_RESULTS: Record<string, { title: string; desc: string; service: string; price: string }> = {
  ats: { title: "ATS-Optimised CV", desc: "Engineered to beat applicant tracking systems at large companies.", service: "ats-cv", price: "KES 2,490" },
  professional: { title: "Professional CV", desc: "Clean, corporate layout trusted by HR managers across all industries.", service: "cv", price: "KES 1,490" },
  modern: { title: "Modern CV", desc: "Contemporary visual design that stands out for creative and tech roles.", service: "modern-cv", price: "KES 2,490" },
  executive: { title: "Executive CV", desc: "Premium positioning for C-suite, VP, and Director-level professionals.", service: "executive-cv", price: "KES 5,490" },
  international: { title: "International CV", desc: "Formatted for Gulf, UK, EU markets with country-specific conventions.", service: "international-cv", price: "KES 4,490" },
};

function CVQuizSection() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (result: string) => {
    const next = [...answers, result];
    setAnswers(next);
    if (step < QUIZ_QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setShowResult(true);
    }
  };

  const reset = () => { setStep(0); setAnswers([]); setShowResult(false); };

  const getResult = () => {
    const counts: Record<string, number> = {};
    answers.forEach((a) => { counts[a] = (counts[a] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "professional";
  };

  const result = showResult ? QUIZ_RESULTS[getResult()] : null;

  return (
    <section className="relative z-10 pb-20 px-4">
      <div className="container max-w-2xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-4">
            <HelpCircle className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-mono text-primary">Quick Quiz</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-3">
            Which CV is <span className="text-gradient">right for me?</span>
          </h2>
          <p className="text-muted-foreground text-sm">Answer 3 quick questions — get a personalised recommendation.</p>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
          className="rounded-2xl border border-border bg-card p-6 sm:p-8"
        >
          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-primary">Q{step + 1} of {QUIZ_QUESTIONS.length}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-gradient-brand rounded-full transition-all" style={{ width: `${((step + 1) / QUIZ_QUESTIONS.length) * 100}%` }} />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-5">{QUIZ_QUESTIONS[step].question}</h3>
                <div className="grid gap-3">
                  {QUIZ_QUESTIONS[step].options.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => handleAnswer(opt.result)}
                      className="rounded-xl border border-border bg-card p-4 text-left text-sm font-medium hover:border-primary/40 hover:bg-primary/5 transition-all flex items-center justify-between group"
                    >
                      {opt.label}
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : result && (
              <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-brand flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-1">We recommend: {result.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{result.desc}</p>
                <p className="text-2xl font-bold text-primary mb-6">{result.price}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to={`/order?service=${result.service}`}>
                    <Button className="bg-gradient-brand border-0 font-semibold gold-shimmer">
                      Order Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="outline" className="border-primary/30" onClick={reset}>
                    Retake Quiz
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}



export default function ServicesPage() {
  useEffect(() => { trackViewContent("Services", "Services"); }, []);
  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative z-10 pt-16 sm:pt-24 pb-16 px-4">
        <div className="container max-w-6xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-6"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-mono text-primary">12 Professional Services</span>
          </motion.div>
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={1}
            className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold leading-[1.08] mb-5"
          >
            Every document you need to{" "}
            <span className="text-gradient">win your career</span>.
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={2}
            className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            From entry-level CVs to executive bios, scholarship essays to LinkedIn rewrites — every document crafted by specialists and delivered same day.
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="relative z-10 pb-24 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ALL_SERVICES.map((s, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i % 6}
                className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-glow-sm transition-all duration-300 flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-brand-subtle flex items-center justify-center">
                    <s.icon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground border border-border rounded-full px-2.5 py-0.5">
                    {s.category}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{s.desc}</p>
                <ul className="space-y-2 mb-6 flex-1">
                  {s.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <span className="text-lg font-bold text-primary">{s.price}</span>
                  <Link to="/order">
                    <Button size="sm" className="bg-gradient-brand border-0 font-semibold gold-shimmer">
                      Order <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Which CV Quiz */}
      <CVQuizSection />

      {/* CV Comparison Table */}
      <section className="relative z-10 pb-20 px-4">
        <div className="container max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-3">
              CV Types <span className="text-gradient">Compared</span>
            </h2>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto">Side-by-side breakdown so you pick the perfect fit.</p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
            className="rounded-2xl border border-border bg-card overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left p-4 font-semibold text-muted-foreground">Feature</th>
                     <th className="p-4 font-semibold text-center">Professional<br/><span className="text-primary text-xs font-bold">KES 1,490</span></th>
                     <th className="p-4 font-semibold text-center">ATS-Optimised<br/><span className="text-primary text-xs font-bold">KES 2,490</span></th>
                     <th className="p-4 font-semibold text-center">Modern<br/><span className="text-primary text-xs font-bold">KES 2,490</span></th>
                     <th className="p-4 font-semibold text-center">Executive<br/><span className="text-primary text-xs font-bold">KES 5,490</span></th>
                     <th className="p-4 font-semibold text-center">International<br/><span className="text-primary text-xs font-bold">KES 4,490</span></th>
                  </tr>
                </thead>
                <tbody>
                  {CV_COMPARISON.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-transparent" : "bg-muted/10"}>
                      <td className="p-4 font-medium text-muted-foreground whitespace-nowrap">{row.feature}</td>
                      {row.values.map((v, j) => (
                        <td key={j} className="p-4 text-center">
                          {v === true ? <Check className="h-4 w-4 text-primary mx-auto" /> :
                           v === false ? <span className="text-muted-foreground/30">—</span> :
                           <span className="text-xs text-muted-foreground">{v}</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>


      <section className="relative z-10 py-20 px-4">
        <div className="container max-w-3xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="rounded-2xl border border-primary/20 bg-gradient-brand-subtle p-10 sm:p-14"
          >
            <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4">
              Not sure which service? <span className="text-gradient">We'll guide you.</span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Chat with us on WhatsApp and get a personalised recommendation in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/order">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-brand border-0 font-semibold h-13 px-10 shadow-glow gold-shimmer">
                  Start Your Order <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
