import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Sparkles, Shield, X, Crown, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import MpesaPaymentModal from "./MpesaPaymentModal";
import { PayPalButton } from "./PayPalButton";
import { useIsInternational } from "@/hooks/useIsInternational";

interface FreemiumPaywallProps {
  open: boolean;
  onClose: () => void;
  templatePrice?: string;
  defaultPackage?: string;
  onPaymentSuccess?: () => void;
}

export default function FreemiumPaywall({
  open,
  onClose,
  templatePrice = "KES 1,200",
  defaultPackage = "starter",
  onPaymentSuccess,
}: FreemiumPaywallProps) {
  const [showMpesa, setShowMpesa] = useState(false);
  const { isInternational } = useIsInternational();

  if (!open) return null;

  return (
    <>
      <AnimatePresence>
        {open && !showMpesa && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)" }}
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md rounded-2xl border border-primary/20 bg-card p-6 sm:p-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Lock className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-serif font-bold mb-2">Your CV is Ready! 🎉</h2>
                <p className="text-sm text-muted-foreground">
                  Unlock the full, watermark-free version to download and share with employers.
                </p>
              </div>

              {/* What you get */}
              <div className="rounded-xl border border-border bg-muted/30 p-4 mb-6 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">What you unlock</p>
                {[
                  "Watermark-free professional PDF",
                  "ATS-optimised formatting",
                  "Unlimited edits for 7 days",
                  "Word + PDF formats",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>

              {/* One-time CTA */}
              <Button
                onClick={() => setShowMpesa(true)}
                className="w-full h-12 bg-gradient-brand border-0 font-bold text-base gold-shimmer mb-3"
              >
                <Zap className="h-4 w-4 mr-2" />
                Download CV — {templatePrice}
              </Button>

              {/* Subscription upsell */}
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">Save more with Pro</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Unlimited CV downloads, job alerts, application tracker — KSh 2,000/mo
                </p>
                <Link to="/subscribe">
                  <Button variant="outline" size="sm" className="w-full border-primary/30 text-xs">
                    See Pro Plans <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              </div>

              <div className="flex items-center justify-center gap-4">
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Shield className="h-3 w-3" /> Secure M-Pesa & PayPal
                </span>
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Shield className="h-3 w-3" /> 2,400+ users
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <MpesaPaymentModal
        open={showMpesa}
        onClose={() => setShowMpesa(false)}
        defaultPackage={defaultPackage}
        onPaymentSuccess={() => {
          setShowMpesa(false);
          onPaymentSuccess?.();
        }}
      />
    </>
  );
}
