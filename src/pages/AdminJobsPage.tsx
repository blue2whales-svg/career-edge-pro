import React, { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Trash2, Star, CheckCircle2, RefreshCw, Search, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PageLayout from "@/components/PageLayout";
import { supabase } from "@/integrations/supabase/client";
import { useJobs, triggerJobsFetch } from "@/hooks/useJobs";
import { toast } from "sonner";
import type { Job } from "@/data/jobs";
import RecruitersPanelTab from "@/components/admin/RecruitersPanelTab";

export default function AdminJobsPage() {
  const { data, isLoading, refetch } = useJobs();
  const jobs = data?.jobs ?? [];
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const filtered = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase())
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await triggerJobsFetch();
    await refetch();
    setRefreshing(false);
    toast.success("Jobs refreshed");
  };

  const handleDelete = async (job: Job) => {
    const { error } = await supabase.from("cached_jobs").delete().eq("title", job.title).eq("company", job.company);
    if (error) { toast.error("Failed to delete job"); } else { toast.success("Job deleted"); refetch(); }
  };

  const handleFeature = async (job: Job) => {
    const { error } = await supabase.from("cached_jobs").update({ featured: true, hot: true }).eq("title", job.title).eq("company", job.company);
    if (error) { toast.error("Failed to feature job"); } else { toast.success("Job featured"); refetch(); }
  };

  const handleVerify = async (job: Job) => {
    const { error } = await supabase.from("cached_jobs").update({ verified: true }).eq("title", job.title).eq("company", job.company);
    if (error) { toast.error("Failed to verify job"); } else { toast.success("Job verified"); refetch(); }
  };

  return (
    <PageLayout>
      <section className="relative z-10 pt-16 sm:pt-24 pb-10 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-serif font-bold">Control Panel</h1>
          </div>

          <Tabs defaultValue="jobs">
            <TabsList className="mb-6">
              <TabsTrigger value="jobs" className="gap-1.5"><Flame className="h-3.5 w-3.5" /> Jobs</TabsTrigger>
              <TabsTrigger value="recruiters" className="gap-1.5"><Shield className="h-3.5 w-3.5" /> Recruiters</TabsTrigger>
            </TabsList>

            <TabsContent value="jobs">
              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {[
                  { label: "Total Jobs", value: jobs.length, color: "text-primary" },
                  { label: "Hot Jobs", value: jobs.filter((j) => j.hot).length, color: "text-destructive" },
                  { label: "Featured", value: jobs.filter((j) => j.featured).length, color: "text-primary" },
                  { label: "Verified", value: jobs.filter((j) => j.verified).length, color: "text-emerald-500" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-border bg-card p-4">
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 mb-6">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search jobs..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
                </div>
                <Button onClick={handleRefresh} disabled={refreshing} className="gap-2">
                  <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                  Fetch New Jobs
                </Button>
              </div>

              {/* Table */}
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Market</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground"><RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2" />Loading...</TableCell></TableRow>
                    ) : (
                      filtered.slice(0, 100).map((job, i) => (
                        <TableRow key={i}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm">{job.title}</p>
                              <p className="text-xs text-muted-foreground">{job.company} · {job.location}</p>
                            </div>
                          </TableCell>
                          <TableCell><Badge variant="outline" className="text-[10px]">{job.category || job.industry}</Badge></TableCell>
                          <TableCell className="text-xs">{job.market}</TableCell>
                          <TableCell>
                            <span className={`text-xs font-mono font-bold ${(job.hot_score || 0) >= 70 ? "text-destructive" : (job.hot_score || 0) >= 40 ? "text-yellow-500" : "text-muted-foreground"}`}>{job.hot_score || 0}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {job.hot && <Flame className="h-3 w-3 text-destructive" />}
                              {job.featured && <Star className="h-3 w-3 text-primary" />}
                              {job.verified && <CheckCircle2 className="h-3 w-3 text-emerald-500" />}
                              {job.visa_sponsorship && <span className="text-[10px]">✈️</span>}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleVerify(job)} title="Verify"><CheckCircle2 className="h-3.5 w-3.5" /></Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleFeature(job)} title="Feature"><Star className="h-3.5 w-3.5" /></Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(job)} title="Delete"><Trash2 className="h-3.5 w-3.5" /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              {!isLoading && filtered.length > 100 && (
                <p className="text-xs text-muted-foreground text-center mt-4">Showing 100 of {filtered.length} jobs</p>
              )}
            </TabsContent>

            <TabsContent value="recruiters">
              <RecruitersPanelTab />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </PageLayout>
  );
}
