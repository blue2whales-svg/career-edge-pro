import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Calendar, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const TIMELINE = [
  { status: "Applied", date: "Mar 1, 2024", note: "Submitted via company website" },
  { status: "Screening", date: "Mar 5, 2024", note: "Recruiter reached out" },
  { status: "Interview", date: "Mar 10, 2024", note: "Technical interview scheduled" },
];

export default function ApplicationDetailPage() {
  const { id } = useParams();

  return (
    <div className="p-6 space-y-6 max-w-[800px]">
      <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Frontend Engineer</h1>
            <p className="text-muted-foreground">Google · Mountain View, CA</p>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-primary/20 text-primary">Interview</span>
        </div>

        <div className="flex gap-4 text-sm text-muted-foreground mb-6">
          <a href="#" className="flex items-center gap-1 hover:text-primary transition-colors">
            <ExternalLink className="h-3 w-3" /> Job posting
          </a>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" /> Deadline: Mar 15, 2024
          </span>
        </div>

        <div className="space-y-1 mb-6">
          <h3 className="font-semibold text-sm mb-3">Notes</h3>
          <p className="text-sm text-muted-foreground">Referred by John from the engineering team. Focus on React + TypeScript experience in the interview.</p>
        </div>

        <h3 className="font-semibold text-sm mb-3">Timeline</h3>
        <div className="space-y-3">
          {TIMELINE.map((t, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={cn("w-3 h-3 rounded-full", i === TIMELINE.length - 1 ? "bg-primary" : "bg-muted")} />
                {i < TIMELINE.length - 1 && <div className="w-px flex-1 bg-border" />}
              </div>
              <div className="pb-4">
                <div className="font-medium text-sm">{t.status}</div>
                <div className="text-xs text-muted-foreground">{t.date} · {t.note}</div>
              </div>
            </div>
          ))}
        </div>

        <h3 className="font-semibold text-sm mb-3 mt-4">Linked Documents</h3>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm">
            <FileText className="h-4 w-4 text-primary" />
            Resume_2024.pdf
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm">
            <FileText className="h-4 w-4 text-primary" />
            Cover_Letter_Google.pdf
          </div>
        </div>
      </div>
    </div>
  );
}
