import { getCVMatchScore, getScoreConfig } from "./cvMatchUtils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CVMatchBadgeProps {
  jobKey: string;
  onClick: (e: React.MouseEvent) => void;
}

export function CVMatchBadge({ jobKey, onClick }: CVMatchBadgeProps) {
  const score = getCVMatchScore(jobKey);
  const config = getScoreConfig(score);

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold font-mono transition-transform hover:scale-105"
            style={{
              background: config.bg,
              border: `1px solid ${config.border}`,
              color: config.text,
            }}
          >
            {score >= 80 ? "🟢" : score >= 50 ? "🟡" : "🔴"} {config.label} · {score}%
          </button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p className="text-xs">See how your CV matches this role</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
