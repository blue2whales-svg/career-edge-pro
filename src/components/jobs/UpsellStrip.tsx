import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

type Variant = "ats" | "bundle";

export function UpsellStrip({ variant }: { variant: Variant }) {
  if (variant === "ats") {
    return (
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl px-5 py-4"
        style={{
          background: "rgba(59,130,246,0.08)",
          border: "1px solid rgba(59,130,246,0.2)",
        }}
      >
        <div>
          <p className="text-sm font-medium">🎯 Most CVs fail ATS screening before a human ever reads them.</p>
          <p className="text-xs text-muted-foreground mt-0.5">Is yours passing?</p>
        </div>

        {/* UPDATED DESTINATION */}
        <Link to="/ats-checker">
          <Button variant="outline" size="sm" className="text-xs font-semibold h-8 gap-1 shrink-0 rounded-lg">
            Check Free
            <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl px-5 py-4"
      style={{
        background: "rgba(245,158,11,0.06)",
        border: "1px solid rgba(245,158,11,0.2)",
      }}
    >
      <div>
        <p className="text-sm font-medium">⚡ See a job you love? Make sure your CV is ready to compete for it.</p>
        <p className="text-xs text-muted-foreground mt-0.5">Professional Package → KSh 5,500</p>
      </div>

      <Link to="/order?service=professional">
        <Button variant="outline" size="sm" className="text-xs font-semibold h-8 gap-1 shrink-0 rounded-lg">
          Upgrade My CV
          <ArrowRight className="h-3 w-3" />
        </Button>
      </Link>
    </div>
  );
}
