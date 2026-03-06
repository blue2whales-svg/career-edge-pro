import { motion } from "framer-motion";
import {
  FileText, Shield, Globe, Zap, GraduationCap, Pen, Linkedin, Award,
  BookOpen, Users, ArrowRight, Check, Briefcase, FileCheck, Target,
  Clock, Star, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";

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
    price: "From $25",
  },
  {
    icon: Award, title: "Executive CV Writing", category: "Executive",
    desc: "Premium CVs for C-suite, VP, and Director-level professionals.",
    features: ["Board-level language", "Human editor review", "Executive bio included", "Strategic positioning"],
    price: "From $79",
  },
  {
    icon: Shield, title: "ATS-Optimised CV", category: "Job Seeker",
    desc: "Engineered specifically to pass applicant tracking systems with high scores.",
    features: ["ATS score guarantee", "Keyword density analysis", "Format compliance", "Machine-readable layout"],
    price: "From $30",
  },
  {
    icon: Globe, title: "International CV", category: "Job Seeker",
    desc: "Country-specific formatting for 15+ markets worldwide.",
    features: ["Local format standards", "Cultural adaptation", "Language considerations", "Market-specific keywords"],
    price: "From $35",
  },
  {
    icon: Pen, title: "Cover Letter Writing", category: "Job Seeker",
    desc: "Tailored per application with a compelling hook that gets read.",
    features: ["Company-specific research", "Role alignment", "Compelling narrative", "Action-oriented close"],
    price: "From $15",
  },
  {
    icon: Linkedin, title: "LinkedIn Optimisation", category: "Job Seeker",
    desc: "Full profile rewrite: headline, about section, experience, and skills.",
    features: ["SEO-optimised headline", "Compelling summary", "Achievement bullets", "Skills endorsement strategy"],
    price: "From $20",
  },
  {
    icon: BookOpen, title: "Personal Statement", category: "Academic",
    desc: "UCAS, postgraduate, MBA — compelling narratives that admissions love.",
    features: ["University-specific tone", "Authentic voice", "Structure optimisation", "Multiple revisions"],
    price: "From $35",
  },
  {
    icon: GraduationCap, title: "Scholarship Essays", category: "Academic",
    desc: "13 major scholarship programs covered with proven success rates.",
    features: ["Program-specific format", "Leadership narratives", "Impact storytelling", "Deadline management"],
    price: "From $40",
  },
  {
    icon: Users, title: "Reference Letters", category: "Academic",
    desc: "We draft professional reference letters — your referee approves and signs.",
    features: ["Professional tone", "Achievement highlights", "Customised per program", "Quick turnaround"],
    price: "From $20",
  },
  {
    icon: Target, title: "Career Change CV", category: "Job Seeker",
    desc: "Repositioning your experience for a completely new industry or role.",
    features: ["Transferable skills focus", "Industry bridging", "Narrative reframing", "Skills-based format"],
    price: "From $79",
  },
  {
    icon: Briefcase, title: "Executive Bio", category: "Executive",
    desc: "Professional biography for board presentations, websites, and conferences.",
    features: ["Multiple lengths", "Tone versatility", "Achievement narrative", "Brand positioning"],
    price: "From $49",
  },
  {
    icon: FileCheck, title: "CV Review & Critique", category: "Job Seeker",
    desc: "Detailed feedback report with actionable improvements for your existing CV.",
    features: ["ATS compatibility check", "Content analysis", "Format assessment", "Improvement roadmap"],
    price: "From $19",
  },
];

const CATEGORIES = ["All", "Job Seeker", "Executive", "Academic"];

export default function ServicesPage() {
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

      {/* CTA */}
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
