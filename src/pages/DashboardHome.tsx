import { motion } from "framer-motion";
import {
  Briefcase,
  Clock,
  TrendingUp,
  Trophy,
  ArrowRight,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const STATS = [
  { label: "Total Applied", value: "47", icon: Briefcase, change: "+5 this week" },
  { label: "In Progress", value: "12", icon: Clock, change: "3 interviews" },
  { label: "Response Rate", value: "38%", icon: TrendingUp, change: "+4% vs last month" },
  { label: "Offers Received", value: "3", icon: Trophy, change: "1 pending" },
];

type KanbanColumn = {
  id: string;
  title: string;
  color: string;
  items: { id: string; company: string; role: string; date: string }[];
};

const KANBAN_COLUMNS: KanbanColumn[] = [
  {
    id: "applied",
    title: "Applied",
    color: "bg-primary/20 text-primary",
    items: [
      { id: "1", company: "Google", role: "Frontend Engineer", date: "Mar 1" },
      { id: "2", company: "Stripe", role: "Full Stack Dev", date: "Feb 28" },
      { id: "3", company: "Vercel", role: "React Developer", date: "Feb 25" },
    ],
  },
  {
    id: "screening",
    title: "Screening",
    color: "bg-secondary/20 text-secondary",
    items: [
      { id: "4", company: "Meta", role: "Software Engineer", date: "Feb 20" },
      { id: "5", company: "Shopify", role: "Product Engineer", date: "Feb 18" },
    ],
  },
  {
    id: "interview",
    title: "Interview",
    color: "bg-amber-500/20 text-amber-400",
    items: [
      { id: "6", company: "Netflix", role: "Senior SWE", date: "Feb 15" },
    ],
  },
  {
    id: "offer",
    title: "Offer",
    color: "bg-emerald-500/20 text-emerald-400",
    items: [
      { id: "7", company: "Linear", role: "Frontend Lead", date: "Feb 10" },
    ],
  },
  {
    id: "closed",
    title: "Closed",
    color: "bg-muted text-muted-foreground",
    items: [
      { id: "8", company: "Figma", role: "Design Engineer", date: "Jan 30" },
    ],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: [0, 0, 0.2, 1] as const },
  }),
};

export default function DashboardHome() {
  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Welcome back 👋</h1>
        <p className="text-muted-foreground text-sm">Here's your job search at a glance.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <motion.div
            key={i}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={i}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <s.icon className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-mono">{s.change}</span>
            </div>
            <div className="text-3xl font-bold">{s.value}</div>
            <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* AI Cover Letter Bar */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={4}
        className="rounded-xl border border-primary/20 bg-gradient-brand-subtle p-5"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <h3 className="font-semibold mb-1">✨ AI Cover Letter Generator</h3>
            <p className="text-sm text-muted-foreground">Paste a job URL to generate a tailored cover letter instantly.</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Input placeholder="https://jobs.example.com/..." className="bg-muted/50 border-border h-10 min-w-[250px]" />
            <Button className="bg-gradient-brand border-0 font-medium shrink-0">
              Generate
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Kanban Board */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Application Pipeline</h2>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Application
          </Button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-4">
          {KANBAN_COLUMNS.map((col, ci) => (
            <motion.div
              key={col.id}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={ci + 5}
              className="flex-shrink-0 w-[240px] rounded-xl border border-border bg-card"
            >
              <div className="p-3 border-b border-border flex items-center gap-2">
                <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", col.color)}>
                  {col.title}
                </span>
                <span className="text-xs text-muted-foreground ml-auto">{col.items.length}</span>
              </div>
              <div className="p-2 space-y-2 min-h-[120px]">
                {col.items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-border bg-muted/30 p-3 hover:border-primary/30 transition-colors cursor-pointer"
                  >
                    <div className="font-medium text-sm">{item.company}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{item.role}</div>
                    <div className="text-xs text-muted-foreground mt-1 font-mono">{item.date}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom panels */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold mb-3">📁 Document Vault</h3>
          <div className="space-y-2">
            {["Resume_2024.pdf", "Cover_Letter_Google.pdf", "Portfolio.pdf"].map((doc) => (
              <div key={doc} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-sm">{doc}</span>
                <span className="text-xs text-muted-foreground font-mono">v2</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold mb-3">⚡ Zapier Agents</h3>
          <div className="space-y-2">
            {[
              { name: "Follow-Up Emailer", status: "Active" },
              { name: "Google Sheet Sync", status: "Active" },
              { name: "Deadline Notifier", status: "Idle" },
            ].map((agent) => (
              <div key={agent.name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-sm">{agent.name}</span>
                <span className={cn(
                  "text-xs font-mono px-2 py-0.5 rounded-full",
                  agent.status === "Active" ? "bg-emerald-500/20 text-emerald-400" : "bg-muted text-muted-foreground"
                )}>
                  {agent.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
