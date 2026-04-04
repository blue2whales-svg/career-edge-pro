import { Lock, ArrowRight, Shield, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

interface JobLockOverlayProps {
  jobTitle: string;
  company: string;
  canUseFreeUnlock: boolean;
  freeUnlocksRemaining?: number;
  onFreeUnlock: () => void;
  socialProofCount?: number;
}

export function JobLockOverlay({ jobTitle, company, canUseFreeUnlock, freeUnlocksRemaining = 0, onFreeUnlock, socialProofCount = 47 }: JobLockOverlayProps) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/85 backdrop-blur-md rounded-b-lg">
      <div className="max-w-sm mx-4 text-center space-y-4">
        {/* Glowing lock icon */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-700/10 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(245,158,11,0.2)] border border-amber-500/20">
          <Lock className="h-7 w-7 text-amber-400" />
        </div>

        <div>
          <h3 className="text-lg font-serif font-bold mb-1">Unlock This Job & 200+ Others</h3>
          <p className="text-sm text-muted-foreground">
            Get a professionally crafted CV and unlock full job details, apply links, and contact info.
          </p>
        </div>

        {/* Social proof */}
        <p className="text-xs text-amber-400 font-semibold">
          🔥 {socialProofCount} people unlocked this job today
        </p>

        {/* Primary CTA — pulsing gold */}
        <Link to={`/order?service=cv&job_title=${encodeURIComponent(jobTitle)}&company=${encodeURIComponent(company)}`}>
          <Button
            size="lg"
            className="w-full h-12 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold shadow-[0_0_20px_rgba(245,158,11,0.3)] animate-pulse border-0"
            style={{ animationDuration: "3s" }}
          >
            <Sparkles className="h-4 w-4 mr-2" /> UNLOCK & APPLY <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>

        {canUseFreeUnlock && (
          <Button variant="outline" size="sm" className="w-full text-xs border-amber-500/20 text-amber-400 hover:bg-amber-500/10" onClick={onFreeUnlock}>
            🎁 Unlock This Job for Free ({freeUnlocksRemaining} free {freeUnlocksRemaining === 1 ? "unlock" : "unlocks"} left)
          </Button>
        )}

        <div className="flex items-center justify-center gap-4 pt-1">
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Shield className="h-3 w-3" /> Secure M-Pesa & PayPal
          </span>
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Shield className="h-3 w-3" /> Used by 2,400+ job seekers
          </span>
        </div>
      </div>
    </div>
  );
}
