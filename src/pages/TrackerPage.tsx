import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit3, Trash2, Search, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PageLayout from "@/components/PageLayout";
import { toast } from "sonner";

interface Application {
  id: string;
  company: string;
  jobTitle: string;
  country: string;
  dateApplied: string;
  applicationLink: string;
  status: string;
  notes: string;
}

const STATUSES = ["Applied", "Interview Requested", "Shortlisted", "Rejected", "Offer Received"];
const STATUS_COLORS: Record<string, string> = {
  "Applied": "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "Interview Requested": "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  "Shortlisted": "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  "Rejected": "bg-red-500/15 text-red-400 border-red-500/30",
  "Offer Received": "bg-green-500/15 text-green-400 border-green-500/30 shadow-[0_0_8px_rgba(34,197,94,0.3)]",
};

const getApps = (): Application[] => {
  try { return JSON.parse(localStorage.getItem("cvedge_applications") || "[]"); }
  catch { return []; }
};

export default function TrackerPage() {
  const [apps, setApps] = useState<Application[]>(getApps);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editApp, setEditApp] = useState<Application | null>(null);
  const [form, setForm] = useState({ company: "", jobTitle: "", country: "", dateApplied: new Date().toISOString().split("T")[0], applicationLink: "", status: "Applied", notes: "" });

  useEffect(() => { localStorage.setItem("cvedge_applications", JSON.stringify(apps)); }, [apps]);

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

  const handleSave = () => {
    if (!form.company || !form.jobTitle || !form.country) { toast.error("Fill in required fields"); return; }
    if (editApp) {
      setApps(prev => prev.map(a => a.id === editApp.id ? { ...a, ...form } : a));
      toast.success("Application updated!");
    } else {
      setApps(prev => [...prev, { ...form, id: Date.now().toString() }]);
      toast.success("Application added!");
    }
    setModalOpen(false);
    setEditApp(null);
    setForm({ company: "", jobTitle: "", country: "", dateApplied: new Date().toISOString().split("T")[0], applicationLink: "", status: "Applied", notes: "" });
  };

  const handleDelete = (id: string) => {
    setApps(prev => prev.filter(a => a.id !== id));
    toast.success("Application removed");
  };

  const openEdit = (app: Application) => {
    setEditApp(app);
    setForm(app);
    setModalOpen(true);
  };

  return (
    <PageLayout>
      <Dialog open={modalOpen} onOpenChange={(open) => { setModalOpen(open); if (!open) setEditApp(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editApp ? "Edit" : "Add"} Application</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Company *</Label><Input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} className="mt-1" /></div>
            <div><Label>Job Title *</Label><Input value={form.jobTitle} onChange={e => setForm(f => ({ ...f, jobTitle: e.target.value }))} className="mt-1" /></div>
            <div><Label>Country *</Label><Input value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} className="mt-1" /></div>
            <div><Label>Date Applied</Label><Input type="date" value={form.dateApplied} onChange={e => setForm(f => ({ ...f, dateApplied: e.target.value }))} className="mt-1" /></div>
            <div><Label>Application Link</Label><Input value={form.applicationLink} onChange={e => setForm(f => ({ ...f, applicationLink: e.target.value }))} className="mt-1" /></div>
            <div><Label>Status</Label>
              <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Notes</Label><Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3} className="mt-1" /></div>
            <Button onClick={handleSave} className="w-full bg-gradient-brand border-0 font-semibold">
              {editApp ? "Update" : "Add"} Application
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <section className="relative z-10 pt-16 sm:pt-24 pb-24 px-4">
        <div className="container max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold">Job Application <span className="text-gradient">Tracker</span></h1>
              <p className="text-sm text-muted-foreground mt-1">Track every application in one place</p>
            </div>
            <Button onClick={() => { setForm({ company: "", jobTitle: "", country: "", dateApplied: new Date().toISOString().split("T")[0], applicationLink: "", status: "Applied", notes: "" }); setModalOpen(true); }}
              className="bg-gradient-brand border-0 font-semibold gap-1.5">
              <Plus className="h-4 w-4" /> Add
            </Button>
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
          {filtered.length === 0 ? (
            <div className="text-center py-20 rounded-2xl border border-border bg-card">
              <Briefcase className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground text-sm">No applications yet. Start tracking!</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Company</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Job Title</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground hidden sm:table-cell">Country</th>
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
                          <div className="flex gap-1 justify-end">
                            <Button size="sm" variant="ghost" onClick={() => openEdit(app)}><Edit3 className="h-3.5 w-3.5" /></Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDelete(app.id)} className="text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                          </div>
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
