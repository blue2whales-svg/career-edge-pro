import { Lock, ArrowRight, Shield, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

interface JobLockOverlayProps {
  jobTitle: string;
  company: string;
  canUseFreeUnlock: boolean;
  freeUnlocksRemaining?: number;
  onFreeUnlock: () => void;
}

export function JobLockOverlay({ jobTitle, company, canUseFreeUnlock, freeUnlocksRemaining = 0, onFreeUnlock }: JobLockOverlayProps) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-b-lg">
      <div className="max-w-sm mx-4 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <Lock className="h-7 w-7 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-serif font-bold mb-1">Unlock This Job & 200+ Others</h3>
          <p className="text-sm text-muted-foreground">
            Get a professionally crafted CV and unlock full job details, apply links, and contact info.
          </p>
        </div>

        <Link to={`/order?service=cv&job_title=${encodeURIComponent(jobTitle)}&company=${encodeURIComponent(company)}`}>
          <Button size="lg" className="w-full bg-gradient-brand border-0 font-semibold h-12 shadow-glow gold-shimmer">
            <Sparkles className="h-4 w-4 mr-2" /> Upgrade CV & Unlock Jobs <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>

        {canUseFreeUnlock && (
          <Button variant="outline" size="sm" className="w-full text-xs" onClick={onFreeUnlock}>
            🎁 Unlock This Job for Free (1 free unlock)
          </Button>
        )}

        <div className="flex items-center justify-center gap-4 pt-2">
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
