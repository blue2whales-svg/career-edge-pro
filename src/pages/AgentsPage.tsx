import { Zap, Play, Pause, Clock } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const AGENTS = [
  {
    name: "Follow-Up Emailer",
    desc: "Automatically sends follow-up emails 7 days after application if no response.",
    status: "active" as const,
    lastTriggered: "2 hours ago",
  },
  {
    name: "Google Sheet Sync",
    desc: "Syncs all application data to a connected Google Sheet in real-time.",
    status: "active" as const,
    lastTriggered: "30 min ago",
  },
  {
    name: "Offer Deadline Notifier",
    desc: "Sends reminders 48h and 24h before an offer deadline expires.",
    status: "idle" as const,
    lastTriggered: "3 days ago",
  },
  {
    name: "Job Board Scraper",
    desc: "Monitors selected job boards and alerts you to new matching positions.",
    status: "idle" as const,
    lastTriggered: "1 day ago",
  },
];

export default function AgentsPage() {
  return (
    <div className="p-6 space-y-6 max-w-[900px]">
      <div>
        <h1 className="text-2xl font-bold">Zapier Agents</h1>
        <p className="text-sm text-muted-foreground">Manage your automation agents. Connect via Zapier webhooks in Settings.</p>
      </div>

      <div className="grid gap-4">
        {AGENTS.map((agent, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5 flex items-start gap-4">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
              agent.status === "active" ? "bg-emerald-500/20" : "bg-muted"
            )}>
              <Zap className={cn("h-5 w-5", agent.status === "active" ? "text-emerald-400" : "text-muted-foreground")} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-sm">{agent.name}</h3>
                <span className={cn(
                  "text-xs font-mono px-2 py-0.5 rounded-full",
                  agent.status === "active" ? "bg-emerald-500/20 text-emerald-400" : "bg-muted text-muted-foreground"
                )}>
                  {agent.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{agent.desc}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                Last triggered: {agent.lastTriggered}
              </div>
            </div>
            <Switch defaultChecked={agent.status === "active"} />
          </div>
        ))}
      </div>
    </div>
  );
}
