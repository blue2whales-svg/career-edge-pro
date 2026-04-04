import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Briefcase, Plus, BarChart3, Target, Award, TrendingUp, Edit2, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import PageLayout from "@/components/PageLayout";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface TrackedApp {
  id: string;
  job_title: string;
  company_name: string;
  status: string;
  applied_date: string;
  follow_up_date: string | null;
  notes: string | null;
}

const STATUS_COLORS: Record<string, string> = {
  Applied: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  Interview: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Offer: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Rejected: "bg-red-500/15 text-red-400 border-red-500/30",
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function ApplicationsPage() {
  const [apps, setApps] = useState<TrackedApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ job_title: "", company_name: "", status: "Applied", applied_date: new Date().toISOString().slice(0, 10), follow_up_date: "", notes: "" });
  const navigate = useNavigate();

  const fetchApps = async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) { navigate("/login"); return; }
    // Use the applications table with the user's candidate_id
    const { data } = await supabase
      .from("applications")
      .select("id, job_id, job_title, status, applied_at, cover_note")
      .eq("candidate_id", user.user.id)
      .order("applied_at", { ascending: false });

    setApps((data || []).map((a: any) => ({
      id: a.id,
      job_title: a.job_title || "Untitled",
      company_name: a.job_id || "",
      status: a.status || "Applied",
      applied_date: a.applied_at ? new Date(a.applied_at).toISOString().slice(0, 10) : "",
      follow_up_date: null,
      notes: a.cover_note,
    })));
    setLoading(false);
  };

  useEffect(() => { fetchApps(); }, []);

  const stats = {
    total: apps.length,
    interviews: apps.filter((a) => a.status === "Interview").length,
    offers: apps.filter((a) => a.status === "Offer").length,
    rate: apps.length > 0 ? Math.round((apps.filter((a) => a.status === "Offer").length / apps.length) * 100) : 0,
  };

  const handleAdd = async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) return;
    await supabase.from("applications").insert({
      candidate_id: user.user.id,
      job_id: form.company_name || "manual",
      job_title: form.job_title,
      status: form.status,
      applied_at: form.applied_date || new Date().toISOString(),
      cover_note: form.notes || null,
    } as any);
    setAddOpen(false);
    setForm({ job_title: "", company_name: "", status: "Applied", applied_date: new Date().toISOString().slice(0, 10), follow_up_date: "", notes: "" });
    fetchApps();
  };

  return (
    <PageLayout>
      <section className="relative z-10 pt-16 sm:pt-24 pb-16 px-4">
        <div className="container max-w-5xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl sm:text-4xl font-serif font-bold">Application Tracker</h1>
                <p className="text-sm text-muted-foreground mt-1">Track every job you've applied to</p>
              </div>
              <Button onClick={() => setAddOpen(true)} className="bg-gradient-brand border-0 font-semibold gap-2">
                <Plus className="h-4 w-4" /> Add Application
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total Applied", value: stats.total, icon: <Briefcase className="h-5 w-5" />, color: "text-blue-400" },
                { label: "Interviews", value: stats.interviews, icon: <Target className="h-5 w-5" />, color: "text-amber-400" },
                { label: "Offers", value: stats.offers, icon: <Award className="h-5 w-5" />, color: "text-emerald-400" },
                { label: "Success Rate", value: `${stats.rate}%`, icon: <TrendingUp className="h-5 w-5" />, color: "text-primary" },
              ].map((s, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-4">
                  <div className={`flex items-center gap-2 mb-2 ${s.color}`}>{s.icon}<span className="text-xs font-mono">{s.label}</span></div>
                  <p className="text-2xl font-bold">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Table */}
            {loading ? (
              <div className="text-center py-20 text-muted-foreground">Loading...</div>
            ) : apps.length === 0 ? (
              <div className="text-center py-20">
                <Briefcase className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold text-lg mb-2">No applications yet</h3>
                <p className="text-sm text-muted-foreground mb-6">Start tracking your job applications</p>
                <Button onClick={() => setAddOpen(true)} className="bg-gradient-brand border-0">
                  <Plus className="h-4 w-4 mr-2" /> Add Your First Application
                </Button>
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="text-left p-3 font-semibold">Job Title</th>
                        <th className="text-left p-3 font-semibold">Company</th>
                        <th className="text-left p-3 font-semibold">Status</th>
                        <th className="text-left p-3 font-semibold">Applied</th>
                        <th className="text-left p-3 font-semibold">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {apps.map((app) => (
                        <tr key={app.id} className="border-b border-border/50 hover:bg-muted/10">
                          <td className="p-3 font-medium">{app.job_title}</td>
                          <td className="p-3 text-muted-foreground">{app.company_name}</td>
                          <td className="p-3">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border ${STATUS_COLORS[app.status] || STATUS_COLORS.Applied}`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="p-3 text-muted-foreground">{app.applied_date}</td>
                          <td className="p-3 text-muted-foreground text-xs max-w-[200px] truncate">{app.notes || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Add Application Modal */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Application</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Job Title</label>
              <Input value={form.job_title} onChange={(e) => setForm({ ...form, job_title: e.target.value })} placeholder="Software Engineer" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Company</label>
              <Input value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} placeholder="Google" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Status</label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Applied">Applied</SelectItem>
                  <SelectItem value="Interview">Interview</SelectItem>
                  <SelectItem value="Offer">Offer</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Applied Date</label>
              <Input type="date" value={form.applied_date} onChange={(e) => setForm({ ...form, applied_date: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Notes</label>
              <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Any notes..." rows={3} />
            </div>
            <Button onClick={handleAdd} className="w-full bg-gradient-brand border-0 font-semibold">
              Save Application
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
