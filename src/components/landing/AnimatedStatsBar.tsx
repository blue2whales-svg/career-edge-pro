import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const STATS = [
  { target: 2400, suffix: "+", label: "CVs Written", prefix: "" },
  { target: 90, suffix: "+", label: "Countries Served", prefix: "" },
  { target: 98, suffix: "%", label: "Satisfaction Rate", prefix: "" },
  { target: 3, suffix: " Hrs", label: "Average Delivery", prefix: "< " },
];

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!start) return;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration, start]);

  return count;
}

function StatItem({ stat, index }: { stat: typeof STATS[0]; index: number }) {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = useCountUp(stat.target, 2000, inView);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.12, duration: 0.5 }}
      className="text-center"
    >
      <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gradient font-serif tabular-nums">
        {stat.prefix}{count.toLocaleString()}{stat.suffix}
      </div>
      <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
    </motion.div>
  );
}

export function AnimatedStatsBar() {
  return (
    <section className="relative z-10 py-14 px-4 border-y border-border/40" style={{ background: "hsl(222 47% 4%)" }}>
      <div className="container max-w-5xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <StatItem key={i} stat={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
