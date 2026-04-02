import { Timer, AlertTriangle, Flame } from "lucide-react";

export function UrgencyStrip() {
  return (
    <div className="relative z-10 bg-gradient-brand py-3 px-4">
      <div className="container max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm font-semibold text-primary-foreground">
        <span className="flex items-center gap-1.5">
          <Timer className="h-3.5 w-3.5" />
          New jobs added daily
        </span>
        <span className="flex items-center gap-1.5">
          <AlertTriangle className="h-3.5 w-3.5" />
          Verified listings updated every 2 hours
        </span>
        <span className="flex items-center gap-1.5">
          <Flame className="h-3.5 w-3.5" />
          Limited slots for this week
        </span>
      </div>
    </div>
  );
}
