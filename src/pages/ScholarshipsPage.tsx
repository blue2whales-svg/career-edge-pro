import { motion } from "framer-motion";
import { GraduationCap, ArrowRight, Check, Star, Globe, Clock, Users, Award } from "lucide-react";
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

const SCHOLARSHIPS = [
  {
    name: "Chevening Scholarship",
    country: "UK",
    countryCode: "gb",
    desc: "Fully funded master's degree in the UK for emerging leaders.",
    features: ["Personal Statement", "Leadership Essay", "Networking Essay", "Career Plan Essay"],
    deadline: "November annually",
    successRate: "94%",
  },
  {
    name: "Commonwealth Scholarship",
    country: "UK",
    countryCode: "gb",
    desc: "For developing Commonwealth country citizens pursuing postgraduate study.",
    features: ["Development Impact Statement", "Study Plan", "Leadership Evidence", "Reference Support"],
    deadline: "December annually",
    successRate: "91%",
  },
  {
    name: "Fulbright Program",
    country: "USA",
    countryCode: "us",
    desc: "Prestigious US exchange program for graduate students and professionals.",
    features: ["Personal Statement", "Study Objectives", "Community Impact Essay", "Interview Prep"],
    deadline: "October annually",
    successRate: "89%",
  },
  {
    name: "Erasmus Mundus",
    country: "Europe",
    countryCode: "eu",
    desc: "Joint master's programmes across multiple European universities.",
    features: ["Motivation Letter", "Study Plan", "Research Proposal", "Reference Letters"],
    deadline: "January annually",
    successRate: "87%",
  },
  {
    name: "DAAD Scholarship",
    country: "Germany",
    countryCode: "de",
    desc: "German Academic Exchange Service funding for international students.",
    features: ["Motivation Letter", "Research Proposal", "Study Timeline", "Language Proof Support"],
    deadline: "October annually",
    successRate: "90%",
  },
  {
    name: "MasterCard Foundation",
    country: "Africa",
    countryCode: "za",
    desc: "Full funding for academically talented students from Africa.",
    features: ["Personal Narrative", "Leadership Essay", "Community Impact Plan", "Financial Statement"],
    deadline: "Varies by university",
    successRate: "92%",
  },
  {
    name: "Rhodes Scholarship",
    country: "UK (Oxford)",
    countryCode: "gb",
    desc: "The world's oldest international scholarship for postgraduate study at Oxford.",
    features: ["Personal Statement", "Leadership Portfolio", "Community Service Essay", "Interview Coaching"],
    deadline: "September annually",
    successRate: "85%",
  },
  {
    name: "Gates Cambridge",
    country: "UK (Cambridge)",
    countryCode: "gb",
    desc: "Full-cost scholarship for outstanding applicants from outside the UK.",
    features: ["Research Proposal", "Personal Statement", "Leadership Evidence", "Impact Plan"],
    deadline: "October/December",
    successRate: "88%",
  },
  {
    name: "Australia Awards",
    country: "Australia",
    countryCode: "au",
    desc: "Australian Government scholarships for developing country nationals.",
    features: ["Academic Statement", "Development Impact", "Leadership Essay", "Country Strategy Alignment"],
    deadline: "April annually",
    successRate: "90%",
  },
];

const STATS = [
  { icon: Users, value: "2,400+", label: "Scholarship essays written" },
  { icon: Award, value: "94%", label: "Client success rate" },
  { icon: Globe, value: "45+", label: "Countries represented" },
  { icon: Clock, value: "< 24h", label: "Average delivery" },
];

export default function ScholarshipsPage() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative z-10 pt-16 sm:pt-24 pb-16 px-4">
        <div className="container max-w-5xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}
            className="inline-flex items-center gap-2 rounded-full border border-brand-blue/30 bg-brand-blue/10 px-4 py-1.5 mb-6"
          >
            <GraduationCap className="h-3.5 w-3.5 text-secondary" />
            <span className="text-xs font-mono text-secondary">Scholarship Hub</span>
          </motion.div>
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={1}
            className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold leading-[1.08] mb-5"
          >
            Win the scholarship with an{" "}
            <span className="text-gradient">unforgettable essay</span>.
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={2}
            className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            We've helped 2,400+ applicants craft winning essays for the world's most competitive scholarships. Your story deserves to be told brilliantly.
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 pb-16 px-4">
        <div className="container max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {STATS.map((s, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="rounded-xl border border-border bg-card p-5 text-center"
              >
                <s.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Scholarships Grid */}
      <section className="relative z-10 pb-24 px-4">
        <div className="container max-w-6xl mx-auto">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="text-2xl sm:text-4xl font-serif font-bold text-center mb-12"
          >
            Scholarships we <span className="text-gradient">specialise in</span>
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SCHOLARSHIPS.map((s, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i % 6}
                className="group rounded-2xl border border-border bg-card p-6 hover:border-secondary/40 hover:shadow-[0_0_30px_-10px_hsl(217_91%_60%/0.3)] transition-all duration-300 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={`https://flagcdn.com/w40/${s.countryCode}.png`}
                    alt={s.country}
                    className="w-8 h-5.5 rounded object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-base">{s.name}</h3>
                    <span className="text-xs text-muted-foreground">{s.country}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{s.desc}</p>
                <div className="text-xs font-mono text-primary/70 mb-3">Deadline: {s.deadline}</div>
                <ul className="space-y-1.5 mb-5 flex-1">
                  {s.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <Check className="h-3 w-3 text-secondary shrink-0" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                    <span className="text-sm font-semibold text-primary">{s.successRate} success</span>
                  </div>
                  <Link to="/order">
                    <Button size="sm" className="bg-gradient-brand border-0 font-semibold gold-shimmer">
                      Apply <ArrowRight className="ml-1 h-3.5 w-3.5" />
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
            className="rounded-2xl border border-secondary/20 bg-secondary/5 p-10 sm:p-14"
          >
            <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4">
              Your scholarship journey <span className="text-gradient">starts here</span>.
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Don't let a weak essay cost you a life-changing opportunity. Let our specialists tell your story.
            </p>
            <Link to="/order">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-brand border-0 font-semibold h-13 px-10 shadow-glow gold-shimmer">
                Start My Scholarship Essay <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
