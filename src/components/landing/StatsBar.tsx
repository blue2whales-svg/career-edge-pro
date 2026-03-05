import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

const STATS = [
  { value: "10,000+", label: "Documents Delivered" },
  { value: "90+", label: "Countries Served" },
  { value: "94%", label: "Interview Success Rate" },
  { value: "Same Day", label: "Average Delivery" },
];

export function StatsBar() {
  return (
    <section className="relative z-10 py-16 px-4 border-y border-border/50">
      <div className="container max-w-5xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <motion.div
              key={i}
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              className="text-center"
            >
              <div className="text-3xl sm:text-4xl font-bold text-gradient mb-1 font-serif">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}