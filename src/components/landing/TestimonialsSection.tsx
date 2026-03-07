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

const TESTIMONIALS = [
  {
    name: "Wanjiru K.",
    location: "Nairobi",
    text: "I ordered at 9pm and had my CV by midnight. Interview invite within a week.",
    outcome: "Hired at Safaricom",
  },
  {
    name: "Ochieng D.",
    location: "Kisumu",
    text: "My Chevening essays were powerful and authentic. I got the scholarship.",
    outcome: "Chevening Scholar 2024",
  },
  {
    name: "Amina H.",
    location: "Mombasa",
    text: "The ATS CV got me past three companies I'd failed before.",
    outcome: "Joined Deloitte Kenya",
  },
  {
    name: "Kamau N.",
    location: "Nakuru",
    text: "Executive quality. Worth every shilling. My CV commands attention now.",
    outcome: "VP of Operations, KCB",
  },
  {
    name: "Faith M.",
    location: "Nairobi",
    text: "My MasterCard Foundation personal statement was exceptional. I'm going to study abroad.",
    outcome: "MasterCard Foundation Scholar",
  },
  {
    name: "Brian O.",
    location: "Eldoret",
    text: "Fast, professional. My LinkedIn connections doubled after the rewrite.",
    outcome: "Head of Sales, Equity Bank",
  },
  {
    name: "Gloria A.",
    location: "Thika",
    text: "Commonwealth Scholarship essay — accepted first try. Life-changing.",
    outcome: "Commonwealth Scholar",
  },
  {
    name: "Dennis W.",
    location: "Nairobi",
    text: "The cover letter was exactly what I needed for my Unilever application. Perfect tone.",
    outcome: "Brand Manager, Unilever Kenya",
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
          Kenyan Success Stories
        </motion.p>
        <motion.h2
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
          className="text-3xl sm:text-5xl font-serif font-bold text-center mb-16"
        >
          Trusted by professionals <span className="text-gradient">across Kenya</span>.
        </motion.h2>

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
                  {t.name}
                  <img
                    src={`https://flagcdn.com/w20/${t.countryCode}.png`}
                    alt={t.location}
                    className="w-5 h-3.5 rounded-[2px] object-cover"
                  />
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{t.location}</div>
                <div className="text-xs text-primary font-mono mt-1">{t.outcome}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
