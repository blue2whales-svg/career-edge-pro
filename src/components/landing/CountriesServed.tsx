import { motion } from "framer-motion";

const COUNTRIES = [
  "Kenya 🇰🇪", "UAE 🇦🇪", "UK 🇬🇧", "Canada 🇨🇦",
  "Germany 🇩🇪", "Qatar 🇶🇦", "Saudi Arabia 🇸🇦", "Australia 🇦🇺",
];

export function CountriesServed() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative z-10 py-12 px-4"
    >
      <div className="container max-w-4xl mx-auto text-center">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4">
          Our clients are landing jobs worldwide
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
          {COUNTRIES.map((c, i) => (
            <span key={i} className="text-sm text-foreground/80 font-medium">
              {c}
              {i < COUNTRIES.length - 1 && <span className="text-muted-foreground/40 ml-3">·</span>}
            </span>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
