import { motion } from "framer-motion";
import {
  FileText,
  Shield,
  Globe,
  Zap,
  GraduationCap,
  Pen,
  Linkedin,
  Award,
  BookOpen,
  Users,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

const JOB_SEEKER_SERVICES = [
  { icon: FileText, title: "Professional CV Writing", desc: "ATS-friendly, keyword-optimised for all industries" },
  { icon: Award, title: "Executive CV Writing", desc: "C-suite, VP, Director level — expert-reviewed" },
  { icon: Shield, title: "ATS-Friendly CV", desc: "Engineered to pass applicant tracking systems" },
  { icon: Globe, title: "International CV", desc: "Formatted for international job applications" },
  { icon: Pen, title: "Cover Letter Writing", desc: "Tailored per application with a compelling hook" },
  { icon: Linkedin, title: "LinkedIn Optimisation", desc: "Full rewrite: headline, about, experience" },
];

const ACADEMIC_SERVICES = [
  { icon: BookOpen, title: "Personal Statement", desc: "UCAS, postgraduate, MBA — compelling narratives" },
  { icon: GraduationCap, title: "Scholarship Essays", desc: "13 major scholarship programs covered" },
  { icon: Users, title: "Reference Letters", desc: "We draft it. Your referee approves and signs" },
];

export function ServicesSection() {
  return (
    <section className="relative z-10 py-24 px-4">
      <div className="container max-w-6xl mx-auto">
        <motion.p
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          className="text-primary font-mono text-sm text-center mb-3 tracking-wider uppercase"
        >
          Our Services
        </motion.p>
        <motion.h2
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
          className="text-3xl sm:text-5xl font-serif font-bold text-center mb-4"
        >
          Career documents that <span className="text-gradient">command attention</span>.
        </motion.h2>
        <motion.p
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
          className="text-muted-foreground text-center mb-16 max-w-2xl mx-auto"
        >
          From entry-level CVs to executive bios, scholarship essays to reference letters — every document crafted to the highest professional standard.
        </motion.p>

        {/* Job Seeker Track */}
        <motion.h3
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3}
          className="text-lg font-semibold mb-6 flex items-center gap-2"
        >
          <span className="w-8 h-px bg-primary" />
          Job Seeker Track
        </motion.h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {JOB_SEEKER_SERVICES.map((s, i) => (
            <motion.div
              key={i}
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 4}
              className="group rounded-xl border border-border bg-card p-6 hover:border-primary/30 hover:shadow-glow-sm transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-brand-subtle flex items-center justify-center mb-4">
                <s.icon className="h-5 w-5 text-primary" />
              </div>
              <h4 className="font-semibold mb-1">{s.title}</h4>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Academic Track */}
        <motion.h3
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          className="text-lg font-semibold mb-6 flex items-center gap-2"
        >
          <span className="w-8 h-px bg-primary" />
          Academic & Scholarship Track
        </motion.h3>
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {ACADEMIC_SERVICES.map((s, i) => (
            <motion.div
              key={i}
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1}
              className="group rounded-xl border border-border bg-card p-6 hover:border-primary/30 hover:shadow-glow-sm transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-brand-subtle flex items-center justify-center mb-4">
                <s.icon className="h-5 w-5 text-primary" />
              </div>
              <h4 className="font-semibold mb-1">{s.title}</h4>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/services">
            <Button variant="outline" size="lg" className="font-semibold border-primary/30 hover:bg-primary/10">
              See All Services <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}