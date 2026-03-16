import { motion } from "framer-motion";
import { Lock, FileText, FileCheck, Globe, Download, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onUnlock: () => void;
  isPaid: boolean;
}

const BENEFITS = [
  { icon: FileCheck, text: "ATS-optimized version" },
  { icon: Download, text: "Clean PDF + Editable DOCX" },
  { icon: Sparkles, text: "Premium executive formatting" },
  { icon: Globe, text: "Ready for worldwide applications" },
];

export function PremiumUnlockCard({ onUnlock, isPaid }: Props) {
  if (isPaid) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-2xl border border-primary/20 p-5 sm:p-6"
      style={{ background: "linear-gradient(135deg, hsl(222 47% 6%), hsl(222 40% 9%))" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Lock className="h-4 w-4 text-primary" />
        </div>
        <h3 className="font-serif font-bold text-base text-foreground">Unlock Your Full Professional CV</h3>
      </div>

      <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
        Get your complete, polished CV with all sections unlocked — ready to impress recruiters globally.
      </p>

      <ul className="space-y-2.5 mb-5">
        {BENEFITS.map((b, i) => (
          <li key={i} className="flex items-center gap-2.5">
            <b.icon className="h-4 w-4 text-primary shrink-0" />
            <span className="text-sm text-foreground/80">{b.text}</span>
          </li>
        ))}
      </ul>

      <Button
        onClick={onUnlock}
        className="w-full h-11 font-bold border-0 bg-gradient-brand gold-shimmer text-sm"
      >
        Unlock Now — Pay via M-Pesa
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>

      <p className="text-[10px] text-muted-foreground text-center mt-3">
        Paybill 4561075 · Instant delivery · 100% satisfaction guarantee
      </p>
    </motion.div>
  );
}
