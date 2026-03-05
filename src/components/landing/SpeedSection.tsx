import { motion } from "framer-motion";
import { Zap, Clock, Crown, GraduationCap } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

const SPEED_CARDS = [
  { icon: Zap, label: "Starter", time: "Minutes", color: "text-secondary" },
  { icon: Clock, label: "Professional", time: "< 3 Hours", color: "text-primary" },
  { icon: Crown, label: "Executive", time: "< 6 Hours", color: "text-primary" },
  { icon: GraduationCap, label: "Scholar", time: "Same Day", color: "text-accent" },
];

export function SpeedSection() {
  return (
    <section className="relative z-10 py-24 px-4">
      <div className="container max-w-5xl mx-auto">
        <div className="rounded-2xl border border-primary/20 bg-gradient-brand-subtle p-8 sm:p-12">
          <motion.p
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="text-primary font-mono text-sm text-center mb-3 tracking-wider uppercase"
          >
            Speed Promise
          </motion.p>
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
            className="text-3xl sm:text-4xl font-serif font-bold text-center mb-4"
          >
            Your Documents, Ready Today.
          </motion.h2>
          <motion.p
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
            className="text-muted-foreground text-center mb-10 max-w-lg mx-auto"
          >
            The moment you submit, your dedicated specialist gets to work. You apply with confidence.
          </motion.p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {SPEED_CARDS.map((card, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 3}
                className="rounded-xl border border-border bg-card/80 p-5 text-center"
              >
                <card.icon className={`h-8 w-8 mx-auto mb-3 ${card.color}`} />
                <div className="font-semibold mb-1">{card.label}</div>
                <div className="text-sm font-mono text-primary">{card.time}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}