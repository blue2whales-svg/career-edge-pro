import { motion } from "framer-motion";
import { FileText, PenTool, Rocket, ArrowRight } from "lucide-react";
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

const STEPS = [
  {
    icon: FileText,
    title: "Order your CV",
    desc: "Choose your package, pay via M-Pesa or PayPal",
  },
  {
    icon: PenTool,
    title: "We write it",
    desc: "Expert writers craft your recruiter-ready CV in 24hrs",
  },
  {
    icon: Rocket,
    title: "Apply with confidence",
    desc: "Access verified jobs and land interviews",
  },
];

export function HowItWorksNew() {
  return (
    <section className="relative z-10 py-16 sm:py-24 px-4">
      <div className="container max-w-5xl mx-auto">
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="text-primary font-mono text-sm text-center mb-3 tracking-wider uppercase"
        >
          How It Works
        </motion.p>
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={1}
          className="text-3xl sm:text-5xl font-serif font-bold text-center mb-14"
        >
          Three Steps to <span className="text-gradient">Your Next Job</span>
        </motion.h2>

        <div className="grid sm:grid-cols-3 gap-8 mb-10">
          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i + 2}
              className="text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                <step.icon className="h-7 w-7 text-primary" />
              </div>
              <div className="text-xs font-mono text-primary mb-2">Step {i + 1}</div>
              <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={5}
          className="text-center"
        >
          <Link to="/order">
            <Button
              size="lg"
              className="bg-gradient-brand border-0 font-semibold h-13 px-10 shadow-glow gold-shimmer text-base"
            >
              Start Now — KES 1,200
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
