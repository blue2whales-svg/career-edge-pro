import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export function GuaranteeBadge({ className = "" }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className={`inline-flex items-center gap-3 rounded-xl border border-primary/20 bg-card px-5 py-3 ${className}`}
    >
      <ShieldCheck className="h-8 w-8 text-primary shrink-0" />
      <div>
        <div className="text-sm font-bold text-foreground">100% Money Back Guarantee</div>
        <div className="text-xs text-muted-foreground">If you're not happy, we refund you. No questions asked.</div>
      </div>
    </motion.div>
  );
}
