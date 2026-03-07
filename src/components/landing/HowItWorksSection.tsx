import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
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
  { num: "01", title: "Submit", desc: "Fill our smart intake form, upload your existing CV, share the job or scholarship details." },
  { num: "02", title: "We Craft It", desc: "Your dedicated career expert personally builds your document to the highest professional standard." },
  { num: "03", title: "Download & Apply", desc: "Receive notification, log into your portal, download, and apply with confidence." },
];

export function HowItWorksSection() {
  return (
    <section className="relative z-10 py-24 px-4">
      <div className="container max-w-5xl mx-auto">
        <motion.p
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          className="text-primary font-mono text-sm text-center mb-3 tracking-wider uppercase"
        >
          How It Works
        </motion.p>
        <motion.h2
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
          className="text-3xl sm:text-5xl font-serif font-bold text-center mb-16"
        >
          Three steps to your <span className="text-gradient">perfect document</span>.
        </motion.h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 2}
              className="relative"
            >
              <div className="text-5xl font-serif font-bold text-primary/20 mb-4">{step.num}</div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              {i < STEPS.length - 1 && (
                <div className="hidden sm:block absolute top-8 -right-4 w-8">
                  <ArrowRight className="h-5 w-5 text-primary/30" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={5}
          className="text-center mt-12"
        >
          <Link to="/how-it-works">
            <Button variant="outline" className="border-primary/30 hover:bg-primary/10">
              Learn More <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}