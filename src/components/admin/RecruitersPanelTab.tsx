import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Building2, Briefcase, Users, Crown, Search, Eye, ArrowUpCircle, Trash2, Check, X, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

interface Employer {
  id: string;
  user_id: string;
  company_name: string | null;
  plan_pkg: string | null;
  plan_expires_at: string | null;
  created_at: string | null;
  jobCount: number;
  appCount: number;
}

function planLabel(pkg: string | null) {
  if (pkg === "recruiter-pro") return "Pro";
  if (pkg === "recruiter-featured") return "Featured";
  return "Basic";
}

function planBadgeClass(pkg: string | null) {
  if (pkg === "recruiter-pro") return "bg-purple-500/20 text-purple-400 border-purple-500/30";
  if (pkg === "recruiter-featured") return "bg-primary/20 text-primary border-primary/30";
  return "bg-muted text-muted-foreground border-border";
}

function expiryStatus(d: string | null) {
  if (!d) return { label: "N/A", cls: "text-muted-foreground" };
  const diff = new Date(d).getTime() - Date.now();
  const days = diff / (1000 * 60 * 60 * 24);
  if (days < 0) return { label: "Expired", cls: "text-destructive" };
  if (days < 7) return { label: `${Math.ceil(days)}d left`, cls: "text-yellow-500" };
  return { label: new Date(d).toLocaleDateString(), cls: "text-emerald-500" };
}

export default function RecruitersPanelTab() {
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Sheet
  const [sheetOpen, setSheetOpen] = useState(false);
  const [viewEmployer, setViewEmployer] = useState<Employer | null>(null);
  const [viewJobs, setViewJobs] = useState<any[]>([]);
  const [viewApps, setViewApps] = useState<any[]>([]);

  // Upgrade dialog
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgradeTarget, setUpgradeTarget] = useState<Employer | null>(null);
  const [newPlan, setNewPlan] = useState("recruiter-basic");
  const [newExpiry, setNewExpiry] = useState("");

  // Delete dialog
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Employer | null>(null);

  // Pending jobs
  const [pendingJobs, setPendingJobs] = useState<any[]>([]);

  const fetchAll = async () => {
    setLoading(true);
    const { data: profiles } = await supabase.from("employer_profiles").select("*");
    if (!profiles) { setLoading(false); return; }

    const enriched: Employer[] = await Promise.all(profiles.map(async (p) => {
      const { count: jobCount } = await supabase.from("job_postings").select("id", { count: "exact", head: true }).eq("employer_id", p.user_id);
      // count applications across all their jobs
      const { data: jobs } = await supabase.from("job_postings").select("id").eq("employer_id", p.user_id);
      let appCount = 0;
      if (jobs && jobs.length > 0) {
        const { count } = await supabase.from("applications").select("id", { count: "exact", head: true }).in("job_id", jobs.map(j => j.id));
        appCount = count || 0;
      }
      return { ...p, jobCount: jobCount || 0, appCount };
    }));

    setEmployers(enriched);

    // pending jobs
    const { data: pending } = await supabase.from("job_postings").select("*").eq("status", "pending");
    setPendingJobs(pending || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const filtered = useMemo(() => {
    return employers.filter(e => {
      if (search && !(e.company_name || "").toLowerCase().includes(search.toLowerCase())) return false;
      if (planFilter !== "all" && e.plan_pkg !== planFilter) return false;
      if (statusFilter === "active" && e.plan_expires_at && new Date(e.plan_expires_at).getTime() < Date.now()) return false;
      if (statusFilter === "expired" && (!e.plan_expires_at || new Date(e.plan_expires_at).getTime() >= Date.now())) return false;
      return true;
    });
  }, [employers, search, planFilter, statusFilter]);

  const stats = useMemo(() => ({
    total: employers.length,
    activeJobs: employers.reduce((s, e) => s + e.jobCount, 0),
    basic: employers.filter(e => !e.plan_pkg || e.plan_pkg === "recruiter-basic").length,
    pro: employers.filter(e => e.plan_pkg === "recruiter-pro").length,
  }), [employers]);

  // View
  const handleView = async (emp: Employer) => {
    setViewEmployer(emp);
    const { data: jobs } = await supabase.from("job_postings").select("*").eq("employer_id", emp.user_id);
    setViewJobs(jobs || []);
    if (jobs && jobs.length > 0) {
      const { data: apps } = await supabase.from("applications").select("*").in("job_id", jobs.map(j => j.id));
      setViewApps(apps || []);
    } else {
      setViewApps([]);
    }
    setSheetOpen(true);
  };

  // Upgrade
  const handleUpgradeSave = async () => {
    if (!upgradeTarget) return;
    const updates: any = { plan_pkg: newPlan };
    if (newExpiry) updates.plan_expires_at = new Date(newExpiry).toISOString();
    const { error } = await supabase.from("employer_profiles").update(updates).eq("id", upgradeTarget.id);
    if (error) { toast.error("Failed to upgrade"); return; }
    toast.success("Plan updated");
    setUpgradeOpen(false);
    fetchAll();
  };

  // Delete
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await supabase.from("job_postings").delete().eq("employer_id", deleteTarget.user_id);
    const { error } = await supabase.from("employer_profiles").delete().eq("id", deleteTarget.id);
    if (error) { toast.error("Failed to delete"); return; }
    toast.success("Employer deleted");
    setDeleteOpen(false);
    fetchAll();
  };

  // Pending approve/reject
  const handleApprove = async (jobId: string) => {
    await supabase.from("job_postings").update({ status: "active" }).eq("id", jobId);
    toast.success("Job approved");
    fetchAll();
  };
  const handleReject = async (jobId: string) => {
    await supabase.from("job_postings").update({ status: "rejected" }).eq("id", jobId);
    toast.success("Job rejected");
    fetchAll();
  };

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Total Employers", value: stats.total, color: "text-primary" },
          { label: "Active Job Posts", value: stats.activeJobs, color: "text-emerald-500" },
          { label: "Basic Plan", value: stats.basic, color: "text-muted-foreground" },
          { label: "Pro Plan", value: stats.pro, color: "text-purple-400" },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search company..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={planFilter} onValueChange={setPlanFilter}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Plan" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plans</SelectItem>
            <SelectItem value="recruiter-basic">Basic</SelectItem>
            <SelectItem value="recruiter-featured">Featured</SelectItem>
            <SelectItem value="recruiter-pro">Pro</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Employer Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden mb-10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Jobs</TableHead>
              <TableHead>Apps</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-10 text-muted-foreground"><RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2" />Loading...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-10 text-muted-foreground">No employers found</TableCell></TableRow>
            ) : (
              filtered.map(emp => {
                const exp = expiryStatus(emp.plan_expires_at);
                return (
                  <TableRow key={emp.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary">
                          {(emp.company_name || "C").slice(0, 2).toUpperCase()}
                        </div>
                        <span className="font-medium text-sm">{emp.company_name || "—"}</span>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="outline" className={`text-[10px] font-mono ${planBadgeClass(emp.plan_pkg)}`}>{planLabel(emp.plan_pkg)}</Badge></TableCell>
                    <TableCell className="text-sm">{emp.jobCount}</TableCell>
                    <TableCell className="text-sm">{emp.appCount}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{emp.created_at ? new Date(emp.created_at).toLocaleDateString() : "—"}</TableCell>
                    <TableCell className={`text-xs font-medium ${exp.cls}`}>{exp.label}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" title="View" onClick={() => handleView(emp)}><Eye className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" title="Upgrade" onClick={() => { setUpgradeTarget(emp); setNewPlan(emp.plan_pkg || "recruiter-basic"); setNewExpiry(emp.plan_expires_at?.slice(0, 10) || ""); setUpgradeOpen(true); }}><ArrowUpCircle className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" title="Delete" onClick={() => { setDeleteTarget(emp); setDeleteOpen(true); }}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pending Job Postings */}
      {pendingJobs.length > 0 && (
        <div>
          <h3 className="text-lg font-bold mb-4">Pending Job Postings</h3>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingJobs.map(j => (
                  <TableRow key={j.id}>
                    <TableCell className="font-medium text-sm">{j.title}</TableCell>
                    <TableCell className="text-sm">{j.company}</TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px] font-mono">{planLabel(j.plan_pkg)}</Badge></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{j.created_at ? new Date(j.created_at).toLocaleDateString() : "—"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="sm" className="h-7 text-xs gap-1" onClick={() => handleApprove(j.id)}><Check className="h-3 w-3" /> Approve</Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-destructive" onClick={() => handleReject(j.id)}><X className="h-3 w-3" /> Reject</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* View Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader><SheetTitle>{viewEmployer?.company_name || "Employer"}</SheetTitle></SheetHeader>
          {viewEmployer && (
            <div className="mt-4 space-y-6">
              <div className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Plan:</span> <Badge variant="outline" className={`text-[10px] font-mono ${planBadgeClass(viewEmployer.plan_pkg)}`}>{planLabel(viewEmployer.plan_pkg)}</Badge></p>
                <p><span className="text-muted-foreground">Joined:</span> {viewEmployer.created_at ? new Date(viewEmployer.created_at).toLocaleDateString() : "—"}</p>
                <p><span className="text-muted-foreground">Expires:</span> <span className={expiryStatus(viewEmployer.plan_expires_at).cls}>{expiryStatus(viewEmployer.plan_expires_at).label}</span></p>
              </div>
              <div>
                <h4 className="font-bold text-sm mb-2">Job Postings ({viewJobs.length})</h4>
                {viewJobs.length === 0 ? <p className="text-xs text-muted-foreground">No job postings</p> : (
                  <div className="space-y-2">
                    {viewJobs.map(j => (
                      <div key={j.id} className="rounded-lg border border-border p-3 text-sm">
                        <p className="font-medium">{j.title}</p>
                        <p className="text-xs text-muted-foreground">{j.status} · {viewApps.filter(a => a.job_id === j.id).length} applicants</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-bold text-sm mb-2">Applications ({viewApps.length})</h4>
                {viewApps.length === 0 ? <p className="text-xs text-muted-foreground">No applications yet</p> : (
                  <div className="space-y-2">
                    {viewApps.map(a => (
                      <div key={a.id} className="rounded-lg border border-border p-3 text-sm">
                        <p className="text-xs text-muted-foreground">Candidate: {a.candidate_id.slice(0, 8)}… · {a.status}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Upgrade Dialog */}
      <Dialog open={upgradeOpen} onOpenChange={setUpgradeOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Change Plan — {upgradeTarget?.company_name}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Plan</Label>
              <Select value={newPlan} onValueChange={setNewPlan}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="recruiter-basic">Basic</SelectItem>
                  <SelectItem value="recruiter-featured">Featured</SelectItem>
                  <SelectItem value="recruiter-pro">Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Expiry Date</Label>
              <Input type="date" value={newExpiry} onChange={e => setNewExpiry(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpgradeOpen(false)}>Cancel</Button>
            <Button onClick={handleUpgradeSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Employer</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">This will permanently delete <strong>{deleteTarget?.company_name}</strong> and all their job postings. This cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
