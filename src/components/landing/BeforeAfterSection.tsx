import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

export function BeforeAfterSection() {
  return (
    <section className="relative z-10 py-24 px-4">
      <div className="container max-w-5xl mx-auto">
        <motion.p
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          className="text-primary font-mono text-sm text-center mb-3 tracking-wider uppercase"
        >
          The CVEdge Difference
        </motion.p>
        <motion.h2
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
          className="text-3xl sm:text-5xl font-serif font-bold text-center mb-4"
        >
          See the difference a <span className="text-gradient">professional CV</span> makes
        </motion.h2>
        <motion.p
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
          className="text-muted-foreground text-center mb-12 max-w-xl mx-auto"
        >
          Our experts transform ordinary CVs into interview-winning documents.
        </motion.p>

        <div className="grid sm:grid-cols-2 gap-6">
          {/* Before */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3}
            className="rounded-xl border border-destructive/20 bg-card p-6 relative overflow-hidden"
          >
            <div className="absolute top-3 right-3 text-[10px] font-mono bg-destructive/10 text-destructive px-2 py-0.5 rounded-full border border-destructive/20">
              Before CVEdge
            </div>
            <div className="space-y-4 pt-4">
              <div className="h-5 bg-muted-foreground/15 rounded w-3/5" />
              <div className="h-3 bg-muted-foreground/10 rounded w-2/5" />
              <div className="border-t border-border/30 pt-3 space-y-2">
                <div className="h-3 bg-muted-foreground/8 rounded w-full" />
                <div className="h-3 bg-muted-foreground/8 rounded w-full" />
                <div className="h-3 bg-muted-foreground/8 rounded w-4/5" />
              </div>
              <div className="border-t border-border/30 pt-3 space-y-2">
                <div className="h-3 bg-muted-foreground/10 rounded w-1/3" />
                <div className="h-3 bg-muted-foreground/8 rounded w-full" />
                <div className="h-3 bg-muted-foreground/8 rounded w-full" />
              </div>
            </div>
            <div className="mt-6 space-y-1.5 text-xs text-destructive/80">
              <p>✗ No professional summary</p>
              <p>✗ Weak action verbs</p>
              <p>✗ No ATS keywords</p>
              <p>✗ Poor formatting</p>
            </div>
          </motion.div>

          {/* After */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={4}
            className="rounded-xl border border-primary/30 p-6 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, hsl(222 40% 7%), hsl(222 35% 9%))" }}
          >
            <div className="absolute top-3 right-3 text-[10px] font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
              After CVEdge ✓
            </div>
            <div className="space-y-4 pt-4">
              <div className="h-5 bg-primary/25 rounded w-3/5" />
              <div className="h-3 bg-primary/15 rounded w-2/5" />
              <div className="w-full h-px bg-primary/20" />
              <div className="space-y-2">
                <div className="h-3 bg-primary/12 rounded w-full" />
                <div className="h-3 bg-primary/12 rounded w-full" />
                <div className="h-3 bg-primary/12 rounded w-11/12" />
              </div>
              <div className="w-full h-px bg-primary/20" />
              <div className="space-y-2">
                <div className="h-3 bg-primary/15 rounded w-1/3" />
                <div className="h-3 bg-primary/10 rounded w-full" />
                <div className="h-3 bg-primary/10 rounded w-full" />
              </div>
            </div>
            <div className="mt-6 space-y-1.5 text-xs text-primary/90">
              <p>✓ Powerful professional summary</p>
              <p>✓ Achievement-focused bullets</p>
              <p>✓ ATS-optimised keywords</p>
              <p>✓ Executive formatting</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
