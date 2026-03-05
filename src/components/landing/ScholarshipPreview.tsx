import { motion } from "framer-motion";
import { GraduationCap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

const SCHOLARSHIPS = [
  "Chevening", "Commonwealth", "Fulbright", "Erasmus Mundus",
  "DAAD", "MasterCard Foundation",
];

export function ScholarshipPreview() {
  return (
    <section className="relative z-10 py-24 px-4 border-y border-border/50">
      <div className="container max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.p
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
              className="text-primary font-mono text-sm mb-3 tracking-wider uppercase"
            >
              Scholarship Hub
            </motion.p>
            <motion.h2
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
              className="text-3xl sm:text-4xl font-serif font-bold mb-4"
            >
              Writing the application that <span className="text-gradient">wins the scholarship</span>.
            </motion.h2>
            <motion.p
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
              className="text-muted-foreground mb-6 leading-relaxed"
            >
              Thousands of applicants compete for these scholarships every year. The ones who win have one thing in common — a compelling, expertly written application.
            </motion.p>
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3}
            >
              <Link to="/scholarships">
                <Button className="bg-gradient-brand border-0 font-semibold shadow-glow gold-shimmer">
                  Explore Scholarship Hub <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {SCHOLARSHIPS.map((name, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 4}
                className="rounded-xl border border-border bg-card p-4 flex items-center gap-3 hover:border-primary/30 transition-colors"
              >
                <GraduationCap className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm font-medium">{name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}