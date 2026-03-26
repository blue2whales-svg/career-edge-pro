import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trash2, Search, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PageLayout from "@/components/PageLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Application {
  id: string;
  company: string;
  jobTitle: string;
  country: string;
  dateApplied: string;
  status: string;
}

const STATUSES = ["Applied", "Interview Requested", "Shortlisted", "Rejected", "Offer Received"];
const STATUS_COLORS: Record<string, string> = {
  "Applied": "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "Interview Requested": "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  "Shortlisted": "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  "Rejected": "bg-red-500/15 text-red-400 border-red-500/30",
  "Offer Received": "bg-green-500/15 text-green-400 border-green-500/30 shadow-[0_0_8px_rgba(34,197,94,0.3)]",
};

export default function TrackerPage() {
  const navigate = useNavigate();
  const [apps, setApps] = useState<Application[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { navigate("/login"); return; }
      setUserId(data.user.id);
      loadApplications(data.user.id);
    });
  }, [navigate]);

  const loadApplications = async (uid: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("applications")
      .select("id, status, applied_at, cover_note, job_id, candidate_id, job_postings(title, company, location)")
      .eq("candidate_id", uid)
      .order("applied_at", { ascending: false });

    if (!error && data) {
      const mapped: Application[] = (data as any[]).map(a => ({
        id: a.id,
        company: a.job_postings?.company || "Unknown",
        jobTitle: a.job_postings?.title || "Unknown",
        country: a.job_postings?.location || "—",
        dateApplied: new Date(a.applied_at).toISOString().split("T")[0],
        status: a.status,
      }));
      setApps(mapped);
    }
    setLoading(false);
  };

  // Realtime subscription for status changes
  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel("tracker-apps")
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "applications",
        filter: `candidate_id=eq.${userId}`,
      }, (payload) => {
        setApps(prev => prev.map(a => a.id === (payload.new as any).id ? { ...a, status: (payload.new as any).status } : a));
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  const filtered = apps.filter(a => {
    const matchSearch = a.company.toLowerCase().includes(search.toLowerCase()) || a.jobTitle.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: apps.length,
    active: apps.filter(a => !["Rejected"].includes(a.status)).length,
    interviews: apps.filter(a => a.status === "Interview Requested").length,
    offers: apps.filter(a => a.status === "Offer Received").length,
  };

  const handleDelete = async (id: string) => {
    await supabase.from("applications").delete().eq("id", id);
    setApps(prev => prev.filter(a => a.id !== id));
    toast.success("Application withdrawn");
  };

  return (
    <PageLayout>
      <section className="relative z-10 pt-16 sm:pt-24 pb-24 px-4">
        <div className="container max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold">Job Application <span className="text-gradient">Tracker</span></h1>
              <p className="text-sm text-muted-foreground mt-1">Track every application in one place</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Total", value: stats.total, color: "text-foreground" },
              { label: "Active", value: stats.active, color: "text-blue-400" },
              { label: "Interviews", value: stats.interviews, color: "text-cyan-400" },
              { label: "Offers", value: stats.offers, color: "text-green-400" },
            ].map((s, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-4 text-center">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          {loading ? (
            <div className="text-center py-20 rounded-2xl border border-border bg-card">
              <p className="text-muted-foreground text-sm">Loading applications...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 rounded-2xl border border-border bg-card">
              <Briefcase className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground text-sm">No applications yet. Apply for jobs to start tracking!</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Company</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Job Title</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground hidden sm:table-cell">Location</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground hidden sm:table-cell">Date</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Actions</th>
                  </tr></thead>
                  <tbody>
                    {filtered.map(app => (
                      <tr key={app.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3 font-medium">{app.company}</td>
                        <td className="px-4 py-3 text-muted-foreground">{app.jobTitle}</td>
                        <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{app.country}</td>
                        <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{app.dateApplied}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_COLORS[app.status] || ""}`}>{app.status}</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(app.id)} className="text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
