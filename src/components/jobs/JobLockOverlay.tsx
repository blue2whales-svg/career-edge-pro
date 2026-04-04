import { Lock, ArrowRight, Shield, Star } from "lucide-react";
import { Button } from "../ui/button";
import type { JobTier } from "@/hooks/useJobAccess";

interface JobLockOverlayProps {
  jobTitle: string;
  company: string;
  canUseFreeUnlock: boolean;
  freeUnlocksRemaining?: number;
  onFreeUnlock: () => void;
  socialProofCount?: number;
  tier?: JobTier;
  onUnlockClick: () => void;
  onProClick: () => void;
}

export function JobLockOverlay({
  jobTitle,
  company,
  canUseFreeUnlock,
  freeUnlocksRemaining = 0,
  onFreeUnlock,
  socialProofCount = 47,
  tier = "verified",
  onUnlockClick,
  onProClick,
}: JobLockOverlayProps) {
  const isInternational = tier === "international";
  const unlockPrice = isInternational ? "KSh 199" : "KSh 99";

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/85 backdrop-blur-md rounded-b-lg">
      <div className="max-w-sm mx-4 text-center space-y-4">
        {/* Glowing lock icon */}
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto border ${
          isInternational
            ? "bg-gradient-to-br from-blue-500/20 to-blue-700/10 shadow-[0_0_30px_rgba(74,144,226,0.2)] border-blue-500/20"
            : "bg-gradient-to-br from-amber-500/20 to-amber-700/10 shadow-[0_0_30px_rgba(245,158,11,0.2)] border-amber-500/20"
        }`}>
          <Lock className={`h-7 w-7 ${isInternational ? "text-blue-400" : "text-amber-400"}`} />
        </div>

        <div>
          <h3 className="text-lg font-serif font-bold mb-1">
            {isInternational ? "🌍 International Opportunity" : "⭐ Confidential Verified Employer"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {isInternational
              ? "Unlock full details, apply link, and employer info for this international role."
              : "Top employers post confidentially to control application volume. Unlock to apply directly."}
          </p>
        </div>

        {/* Social proof */}
        <p className={`text-xs font-semibold ${isInternational ? "text-blue-400" : "text-amber-400"}`}>
          🔥 {socialProofCount} people unlocked this job today
        </p>

        {/* Primary CTA — single unlock via payment */}
        <Button
          onClick={onUnlockClick}
          size="lg"
          className={`w-full h-12 font-bold shadow-lg animate-pulse border-0 ${
            isInternational
              ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-[0_0_20px_rgba(74,144,226,0.3)]"
              : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)]"
          }`}
          style={{ animationDuration: "3s" }}
        >
          <Lock className="h-4 w-4 mr-2" /> Unlock This Job — {unlockPrice} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        {/* Pro CTA */}
        <Button
          onClick={onProClick}
          variant="outline"
          size="sm"
          className={`w-full text-xs mt-1 ${
            isInternational
              ? "border-blue-500/20 text-blue-400 hover:bg-blue-500/10"
              : "border-amber-500/20 text-amber-400 hover:bg-amber-500/10"
          }`}
        >
          <Star className="h-3 w-3 mr-1.5" /> Get Pro — Unlock All Jobs KSh 500/mo
        </Button>

        {canUseFreeUnlock && (
          <Button
            variant="outline"
            size="sm"
            className={`w-full text-xs ${
              isInternational
                ? "border-blue-500/20 text-blue-400 hover:bg-blue-500/10"
                : "border-amber-500/20 text-amber-400 hover:bg-amber-500/10"
            }`}
            onClick={onFreeUnlock}
          >
            🎁 Unlock Free ({freeUnlocksRemaining} left)
          </Button>
        )}

        <div className="flex items-center justify-center gap-4 pt-1">
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Shield className="h-3 w-3" /> M-Pesa & PayPal
          </span>
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Shield className="h-3 w-3" /> 2,400+ job seekers
          </span>
        </div>
      </div>
    </div>
  );
}
