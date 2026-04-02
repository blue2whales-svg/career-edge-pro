import { motion } from "framer-motion";
import { Unlock, CheckCircle2, Zap, Globe, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

const BENEFITS = [
  {
    icon: Unlock,
    title: "Verified Job Listings",
    desc: "Access jobs in Kenya, Gulf, Cruise, Remote",
  },
  {
    icon: CheckCircle2,
    title: "ATS-Optimized",
    desc: "Pass automated screening systems",
  },
  {
    icon: Zap,
    title: "24-Hour Delivery",
    desc: "Apply faster than other candidates",
  },
  {
    icon: Globe,
    title: "Built for Kenya, Going Global",
    desc: "Kenyan job seekers conquering the world",
  },
];

export function WhyUpgradeSection() {
  return (
    <section className="relative z-10 py-16 sm:py-24 px-4">
      <div className="container max-w-5xl mx-auto">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="text-3xl sm:text-5xl font-serif font-bold text-center mb-4"
        >
          Your CV Is the Difference Between{" "}
          <span className="text-gradient">Ignored and Hired</span>
        </motion.h2>
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={1}
          className="text-muted-foreground text-center mb-12 max-w-lg mx-auto"
        >
          Stop sending the same CV everywhere. Get one that actually works.
        </motion.p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {BENEFITS.map((b, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i + 2}
              className="rounded-xl border border-border bg-card p-5 text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <b.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-sm mb-1">{b.title}</h3>
              <p className="text-xs text-muted-foreground">{b.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={6}
          className="text-center"
        >
          <Link to="/order">
            <Button
              size="lg"
              className="bg-gradient-brand border-0 font-semibold h-13 px-10 shadow-glow gold-shimmer text-base"
            >
              Get My CV — KES 1,200
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
