import { motion } from "framer-motion";

const TRUST_ITEMS = [
  "10,000+ Documents Delivered",
  "90+ Countries",
  "94% Interview Success Rate",
  "Same-Day Delivery",
  "ATS-Optimised",
  "Trusted by Professionals Worldwide",
  "13 Scholarship Programs Covered",
];

export function TrustBar() {
  const doubled = [...TRUST_ITEMS, ...TRUST_ITEMS];

  return (
    <section className="relative z-10 py-4 border-y border-primary/10 bg-card/50 overflow-hidden">
      <div className="animate-scroll-left flex gap-8 whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-3 text-sm font-medium text-muted-foreground shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}