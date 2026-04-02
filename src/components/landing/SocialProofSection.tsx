import { motion } from "framer-motion";
import { Star, Flame, Globe } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

const TESTIMONIALS = [
  {
    quote:
      "I applied to a Dubai hotel job the same day I got my CV. Got called for interview within a week.",
    name: "Brian M.",
    location: "Nairobi",
  },
  {
    quote:
      "CV Edge helped me get noticed for a cruise ship position I never thought I'd qualify for.",
    name: "Akinyi W.",
    location: "Kisumu",
  },
  {
    quote:
      "Fast, professional, and affordable. My LinkedIn got 3x more views after.",
    name: "James K.",
    location: "Mombasa",
  },
];

export function SocialProofSection() {
  return (
    <section className="relative z-10 py-16 sm:py-24 px-4">
      <div className="container max-w-5xl mx-auto">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="text-3xl sm:text-5xl font-serif font-bold text-center mb-12"
        >
          Kenyans Are Getting <span className="text-gradient">Hired</span>
        </motion.h2>

        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i + 1}
              className="rounded-xl border border-border bg-card p-6"
            >
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed italic">
                "{t.quote}"
              </p>
              <div className="text-sm font-semibold">
                {t.name},{" "}
                <span className="text-muted-foreground font-normal">{t.location}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={4}
          className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-primary" />
            <span>
              <span className="text-foreground font-semibold">37</span> people upgraded their CV today
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            <span>
              Jobs available in <span className="text-foreground font-semibold">10+</span> countries
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
