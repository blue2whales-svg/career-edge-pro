import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Briefcase, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PageLayout from "@/components/PageLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Remote"];
const INDUSTRIES_LIST = [
  "Technology", "Finance", "Healthcare", "Engineering", "Marketing",
  "Education", "Legal", "Sales", "Operations", "Cruise & Hospitality",
  "Consulting", "Oil & Gas", "NGO", "Government",
];

export default function PostJobPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planPkg = searchParams.get("pkg") || "recruiter-basic";
  const [userId, setUserId] = useState<string | null>(null);
  const [posted, setPosted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "", company: "", description: "", location: "",
    salary: "", job_type: "Full-time", industry: "Technology",
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id);
      else navigate("/login");
    });
  }, [navigate]);

  const handleSubmit = async () => {
    if (!form.title || !form.company) {
      toast.error("Job title and company are required");
      return;
    }
    if (!userId) return;
    setLoading(true);

    // Upsert employer profile
    await supabase.from("employer_profiles").upsert(
      { user_id: userId, plan_pkg: planPkg } as any,
      { onConflict: "user_id" }
    );

    const { error } = await supabase.from("job_postings").insert({
      employer_id: userId,
      title: form.title,
      company: form.company,
      description: form.description || null,
      location: form.location || null,
      salary: form.salary || null,
      job_type: form.job_type,
      industry: form.industry,
      plan_pkg: planPkg,
    } as any);

    setLoading(false);
    if (error) {
      toast.error("Failed to post job");
      console.error(error);
    } else {
      setPosted(true);
    }
  };

  if (posted) {
    return (
      <PageLayout>
        <section className="relative z-10 pt-24 pb-24 px-4">
          <div className="container max-w-lg mx-auto text-center">
            <div className="rounded-2xl border border-border bg-card p-10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-serif font-bold">Job Posted Successfully!</h2>
              <p className="text-sm text-muted-foreground">Your listing is now live and candidates can apply.</p>
              <Button onClick={() => navigate("/employer-dashboard")} className="bg-gradient-brand border-0 font-semibold">
                Go to Employer Dashboard
              </Button>
            </div>
          </div>
        </section>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <section className="relative z-10 pt-16 sm:pt-24 pb-24 px-4">
        <div className="container max-w-xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold">Post a Job</h1>
              <p className="text-sm text-muted-foreground">Plan: {planPkg}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <div>
              <Label>Job Title *</Label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="mt-1" placeholder="e.g. Senior Software Engineer" />
            </div>
            <div>
              <Label>Company Name *</Label>
              <Input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} className="mt-1" placeholder="e.g. Safaricom PLC" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={5} className="mt-1" placeholder="Job responsibilities, requirements..." />
            </div>
            <div>
              <Label>Location</Label>
              <Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="mt-1" placeholder="e.g. Nairobi, Kenya" />
            </div>
            <div>
              <Label>Salary Range</Label>
              <Input value={form.salary} onChange={e => setForm(f => ({ ...f, salary: e.target.value }))} className="mt-1" placeholder="e.g. KES 100,000 - 200,000" />
            </div>
            <div>
              <Label>Job Type</Label>
              <Select value={form.job_type} onValueChange={v => setForm(f => ({ ...f, job_type: v }))}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{JOB_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Industry</Label>
              <Select value={form.industry} onValueChange={v => setForm(f => ({ ...f, industry: v }))}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{INDUSTRIES_LIST.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <Button onClick={handleSubmit} disabled={loading} className="w-full bg-gradient-brand border-0 font-semibold h-12">
              {loading ? "Posting..." : "Post Job →"}
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
