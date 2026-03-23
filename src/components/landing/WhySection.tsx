import { motion } from "framer-motion";
import { Shield, Award, Globe, Clock } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

const PILLARS = [
  { icon: Shield, title: "ATS Engineered", desc: "Passes every modern applicant tracking system" },
  { icon: Award, title: "Executive Formatting", desc: "Presentation that commands attention" },
  { icon: Globe, title: "Global Standards", desc: "Documents accepted in 90+ countries worldwide" },
  { icon: Clock, title: "Same-Day Delivery", desc: "Your specialist delivers today, not next week" },
];

export function WhySection() {
  return (
    <section className="relative z-10 py-24 px-4 border-y border-border/50">
      <div className="container max-w-5xl mx-auto">
        <motion.p
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          className="text-primary font-mono text-sm text-center mb-3 tracking-wider uppercase"
        >
          Why CV Edge
        </motion.p>
        <motion.h2
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
          className="text-3xl sm:text-5xl font-serif font-bold text-center mb-16"
        >
          The unfair advantage <span className="text-gradient">you deserve</span>.
        </motion.h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PILLARS.map((p, i) => (
            <motion.div
              key={i}
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 2}
              className="text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-brand-subtle flex items-center justify-center mx-auto mb-4">
                <p.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}