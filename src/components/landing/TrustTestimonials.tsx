import { motion } from "framer-motion";
import { Star } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

const TESTIMONIALS = [
  {
    name: "James M.",
    title: "Software Engineer",
    country: "Dubai 🇦🇪",
    text: "Got my dream job in 3 days after submitting the CV Edge CV. The Dubai format was spot-on — recruiters said it was the most professional they'd seen.",
  },
  {
    name: "Aisha K.",
    title: "Registered Nurse",
    country: "United Kingdom 🇬🇧",
    text: "My CV passed every ATS filter! I'd been rejected 12 times before CV Edge. Within a week of using their CV, I had 3 interview invites from NHS trusts.",
  },
  {
    name: "Brian O.",
    title: "Senior Accountant",
    country: "Nairobi 🇰🇪",
    text: "Worth every shilling. The executive CV completely transformed how employers see me. Promoted to Finance Manager within 2 months of updating my profile.",
  },
  {
    name: "Grace W.",
    title: "Marketing Director",
    country: "Canada 🇨🇦",
    text: "The cover letter was so persuasive, I got a callback within hours. CV Edge understood the Canadian market perfectly and tailored every detail.",
  },
  {
    name: "Ahmed H.",
    title: "Civil Engineer",
    country: "Qatar 🇶🇦",
    text: "I needed a Gulf-standard CV for my Qatar application and CV Edge delivered in under 3 hours. Landed the role at a tier-1 construction firm.",
  },
  {
    name: "Linda N.",
    title: "HR Specialist",
    country: "Australia 🇦🇺",
    text: "The achievement-focused format was exactly what Australian employers expect. Went from zero callbacks to 5 interviews in two weeks. Incredible service.",
  },
];

export function TrustTestimonials() {
  return (
    <section className="relative z-10 py-24 px-4">
      <div className="container max-w-6xl mx-auto">
        <motion.p
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          className="text-primary font-mono text-sm text-center mb-3 tracking-wider uppercase"
        >
          Client Success Stories
        </motion.p>
        <motion.h2
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
          className="text-3xl sm:text-5xl font-serif font-bold text-center mb-16"
        >
          Real results from <span className="text-gradient">real professionals</span>.
        </motion.h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 2}
              className="rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-colors"
              style={{ background: "hsl(222 40% 7%)" }}
            >
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">"{t.text}"</p>
              <div className="border-t border-border pt-4">
                <div className="font-semibold text-sm">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.title}</div>
                <div className="text-xs text-primary font-mono mt-1">{t.country}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
