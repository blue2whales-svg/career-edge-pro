import { motion } from "framer-motion";
import { Star } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

const COUNTRY_FLAGS = [
  { flag: "🇳🇬", code: "NG", name: "Nigeria" },
  { flag: "🇬🇧", code: "GB", name: "United Kingdom" },
  { flag: "🇺🇸", code: "US", name: "United States" },
  { flag: "🇦🇪", code: "AE", name: "UAE" },
  { flag: "🇰🇪", code: "KE", name: "Kenya" },
  { flag: "🇿🇦", code: "ZA", name: "South Africa" },
  { flag: "🇮🇳", code: "IN", name: "India" },
  { flag: "🇬🇭", code: "GH", name: "Ghana" },
  { flag: "🇩🇪", code: "DE", name: "Germany" },
  { flag: "🇨🇦", code: "CA", name: "Canada" },
  { flag: "🇦🇺", code: "AU", name: "Australia" },
  { flag: "🇸🇦", code: "SA", name: "Saudi Arabia" },
  { flag: "🇵🇰", code: "PK", name: "Pakistan" },
  { flag: "🇧🇷", code: "BR", name: "Brazil" },
  { flag: "🇵🇭", code: "PH", name: "Philippines" },
];

const TESTIMONIALS = [
  {
    name: "Emeka O.",
    location: "Lagos",
    flag: "🇳🇬",
    text: "I ordered at 9pm and had my CV by midnight. Interview invite within a week.",
    outcome: "Hired as Senior Engineer",
  },
  {
    name: "Amina D.",
    location: "Nairobi",
    flag: "🇰🇪",
    text: "My Chevening essays were powerful and authentic. I got the scholarship.",
    outcome: "Chevening Scholar 2024",
  },
  {
    name: "Sarah K.",
    location: "London",
    flag: "🇬🇧",
    text: "The ATS CV got me past three companies I'd failed before.",
    outcome: "Joined Big 4 Consulting",
  },
  {
    name: "Khalid M.",
    location: "Dubai",
    flag: "🇦🇪",
    text: "Executive quality. Worth every dirham. My CV commands attention now.",
    outcome: "VP of Operations",
  },
  {
    name: "Ravi P.",
    location: "Mumbai",
    flag: "🇮🇳",
    text: "My Fulbright personal statement was exceptional. I'm going to the US.",
    outcome: "Fulbright Scholar",
  },
  {
    name: "Marcus T.",
    location: "Houston",
    flag: "🇺🇸",
    text: "Fast, professional. My LinkedIn connections doubled after the rewrite.",
    outcome: "Director of Sales",
  },
  {
    name: "Grace A.",
    location: "Accra",
    flag: "🇬🇭",
    text: "Commonwealth Scholarship essay — accepted first try. Life-changing.",
    outcome: "Commonwealth Scholar",
  },
  {
    name: "Ana S.",
    location: "Berlin",
    flag: "🇩🇪",
    text: "The Erasmus motivation letter was exactly what I needed. Perfect tone.",
    outcome: "Erasmus Mundus Scholar",
  },
];

export function TestimonialsSection() {
  return (
    <section className="relative z-10 py-24 px-4">
      <div className="container max-w-6xl mx-auto">
        <motion.p
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          className="text-primary font-mono text-sm text-center mb-3 tracking-wider uppercase"
        >
          Global Success Stories
        </motion.p>
        <motion.h2
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
          className="text-3xl sm:text-5xl font-serif font-bold text-center mb-6"
        >
          Trusted by professionals <span className="text-gradient">worldwide</span>.
        </motion.h2>

        {/* Country flags bar */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1.5}
          className="flex flex-wrap justify-center gap-2 mb-16"
        >
          {COUNTRY_FLAGS.map((c) => (
            <span
              key={c.code}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground"
              title={c.name}
            >
              <span className="text-sm">{c.flag}</span>
              <span className="font-mono">{c.code}</span>
            </span>
          ))}
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 2}
              className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors"
            >
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">"{t.text}"</p>
              <div className="border-t border-border pt-3">
                <div className="font-semibold text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-sm shrink-0">{t.flag}</span>
                  {t.name}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 ml-8">{t.location}</div>
                <div className="text-xs text-primary font-mono mt-1 ml-8">{t.outcome}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}