import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Briefcase, Users, MessageCircle, Calendar, ChevronDown, ChevronUp, Lock, CheckCircle, XCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PageLayout from "@/components/PageLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const STATUS_COLORS: Record<string, string> = {
  "Applied": "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "Interview Requested": "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  "Shortlisted": "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  "Rejected": "bg-red-500/15 text-red-400 border-red-500/30",
  "Offer Received": "bg-green-500/15 text-green-400 border-green-500/30",
};

interface JobPosting {
  id: string; title: string; company: string; location: string | null;
  status: string; created_at: string; plan_pkg: string | null;
}

interface Applicant {
  id: string; candidate_id: string; cover_note: string | null;
  status: string; applied_at: string;
  full_name?: string; headline?: string; location?: string;
}

export default function EmployerDashboard() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [plan, setPlan] = useState<string>("recruiter-basic");
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [applicants, setApplicants] = useState<Record<string, Applicant[]>>({});
  const [chatAppId, setChatAppId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [interviewForm, setInterviewForm] = useState<{ appId: string; date: string; time: string; link: string } | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { navigate("/login"); return; }
      setUserId(data.user.id);
      loadEmployerData(data.user.id);
    });
  }, [navigate]);

  const loadEmployerData = async (uid: string) => {
    const { data: ep } = await supabase.from("employer_profiles").select("plan_pkg").eq("user_id", uid).maybeSingle();
    if (ep?.plan_pkg) setPlan(ep.plan_pkg as string);
    const { data: jp } = await supabase.from("job_postings").select("*").eq("employer_id", uid).order("created_at", { ascending: false });
    if (jp) setJobs(jp as any[]);
  };

  const loadApplicants = async (jobId: string) => {
    if (applicants[jobId]) return;
    const { data } = await supabase.from("applications").select("*").eq("job_id", jobId).order("applied_at", { ascending: false });
    if (!data) return;
    // Load candidate profiles
    const candidateIds = data.map((a: any) => a.candidate_id);
    const { data: profiles } = await supabase.from("candidate_profiles").select("*").in("user_id", candidateIds);
    const profileMap: Record<string, any> = {};
    profiles?.forEach((p: any) => { profileMap[p.user_id] = p; });
    const enriched = data.map((a: any) => ({
      ...a,
      full_name: profileMap[a.candidate_id]?.full_name || "Candidate",
      headline: profileMap[a.candidate_id]?.headline || "",
      location: profileMap[a.candidate_id]?.location || "",
    }));
    setApplicants(prev => ({ ...prev, [jobId]: enriched }));
  };

  const toggleJob = (jobId: string) => {
    if (expandedJob === jobId) { setExpandedJob(null); return; }
    setExpandedJob(jobId);
    loadApplicants(jobId);
  };

  const updateAppStatus = async (appId: string, jobId: string, newStatus: string) => {
    await supabase.from("applications").update({ status: newStatus } as any).eq("id", appId);
    setApplicants(prev => ({
      ...prev,
      [jobId]: prev[jobId]?.map(a => a.id === appId ? { ...a, status: newStatus } : a) || [],
    }));
    toast.success(`Status updated to ${newStatus}`);
  };

  const canShortlist = plan === "recruiter-featured" || plan === "recruiter-pro";
  const canMessage = plan === "recruiter-pro";
  const canSchedule = plan === "recruiter-pro";

  // Chat
  const openChat = async (appId: string) => {
    if (!canMessage) return;
    setChatAppId(appId);
    const { data } = await supabase.from("application_messages").select("*").eq("application_id", appId).order("created_at", { ascending: true });
    setChatMessages(data || []);
    // Realtime
    supabase.channel(`app-msgs-${appId}`).on("postgres_changes", { event: "INSERT", schema: "public", table: "application_messages", filter: `application_id=eq.${appId}` }, (payload) => {
      setChatMessages(prev => [...prev, payload.new]);
    }).subscribe();
  };

  const sendMessage = async () => {
    if (!chatInput.trim() || !chatAppId || !userId) return;
    await supabase.from("application_messages").insert({ application_id: chatAppId, sender_id: userId, body: chatInput.trim() } as any);
    setChatInput("");
  };

  const scheduleInterview = async () => {
    if (!interviewForm || !userId) return;
    const scheduledAt = new Date(`${interviewForm.date}T${interviewForm.time}`).toISOString();
    await supabase.from("interviews").insert({ application_id: interviewForm.appId, scheduled_at: scheduledAt, meeting_link: interviewForm.link || null } as any);
    // Update application status
    const jobId = expandedJob;
    if (jobId) await updateAppStatus(interviewForm.appId, jobId, "Interview Requested");
    setInterviewForm(null);
    toast.success("Interview scheduled!");
  };

  return (
    <PageLayout>
      <section className="relative z-10 pt-16 sm:pt-24 pb-24 px-4">
        <div className="container max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold">Employer <span className="text-gradient">Dashboard</span></h1>
              <p className="text-sm text-muted-foreground mt-1">Plan: <span className="text-primary font-medium">{plan}</span></p>
            </div>
            <Button onClick={() => navigate("/post-job?pkg=" + plan)} className="bg-gradient-brand border-0 font-semibold gap-1.5">
              <Briefcase className="h-4 w-4" /> Post New Job
            </Button>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-20 rounded-2xl border border-border bg-card">
              <Briefcase className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground text-sm">No jobs posted yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map(job => (
                <div key={job.id} className="rounded-2xl border border-border bg-card overflow-hidden">
                  <div className="p-5 flex items-center justify-between cursor-pointer hover:bg-muted/20 transition-colors" onClick={() => toggleJob(job.id)}>
                    <div>
                      <h3 className="font-semibold text-lg">{job.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span>{job.company}</span>
                        {job.location && <span>• {job.location}</span>}
                        <span>• {new Date(job.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" /> {applicants[job.id]?.length ?? "—"}
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${job.status === "active" ? "bg-green-500/15 text-green-400 border-green-500/30" : "bg-muted text-muted-foreground border-border"}`}>{job.status}</span>
                      {expandedJob === job.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </div>

                  {expandedJob === job.id && (
                    <div className="border-t border-border p-5">
                      {!applicants[job.id] || applicants[job.id].length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-6">No applicants yet</p>
                      ) : (
                        <div className="space-y-3">
                          {applicants[job.id].map(app => (
                            <div key={app.id} className="rounded-xl border border-border bg-muted/10 p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">{app.full_name}</p>
                                  {app.headline && <p className="text-xs text-muted-foreground">{app.headline}</p>}
                                  {app.location && <p className="text-xs text-muted-foreground">{app.location}</p>}
                                  <p className="text-xs text-muted-foreground mt-1">Applied {new Date(app.applied_at).toLocaleDateString()}</p>
                                  {app.cover_note && <p className="text-xs text-muted-foreground mt-1 italic">"{app.cover_note}"</p>}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_COLORS[app.status] || ""}`}>{app.status}</span>
                                </div>
                              </div>
                              <div className="flex gap-2 mt-3 flex-wrap">
                                {canShortlist ? (
                                  <>
                                    <Button size="sm" variant="outline" onClick={() => updateAppStatus(app.id, job.id, "Shortlisted")} className="text-xs gap-1">
                                      <CheckCircle className="h-3 w-3" /> Shortlist
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => updateAppStatus(app.id, job.id, "Rejected")} className="text-xs gap-1 text-destructive">
                                      <XCircle className="h-3 w-3" /> Reject
                                    </Button>
                                  </>
                                ) : (
                                  <div className="relative">
                                    <Button size="sm" variant="outline" disabled className="text-xs gap-1 opacity-50">
                                      <Lock className="h-3 w-3" /> Shortlist / Reject
                                    </Button>
                                    <p className="text-[10px] text-primary mt-0.5">Upgrade to Featured</p>
                                  </div>
                                )}

                                {canMessage ? (
                                  <Button size="sm" variant="outline" onClick={() => openChat(app.id)} className="text-xs gap-1">
                                    <MessageCircle className="h-3 w-3" /> Message
                                  </Button>
                                ) : (
                                  <div className="relative">
                                    <Button size="sm" variant="outline" disabled className="text-xs gap-1 opacity-50">
                                      <Lock className="h-3 w-3" /> Message
                                    </Button>
                                    <p className="text-[10px] text-primary mt-0.5">Upgrade to Pro</p>
                                  </div>
                                )}

                                {canSchedule ? (
                                  <Button size="sm" variant="outline" onClick={() => setInterviewForm({ appId: app.id, date: "", time: "", link: "" })} className="text-xs gap-1">
                                    <Calendar className="h-3 w-3" /> Schedule
                                  </Button>
                                ) : (
                                  <div className="relative">
                                    <Button size="sm" variant="outline" disabled className="text-xs gap-1 opacity-50">
                                      <Lock className="h-3 w-3" /> Schedule
                                    </Button>
                                    <p className="text-[10px] text-primary mt-0.5">Upgrade to Pro</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Chat Drawer */}
          {chatAppId && canMessage && (
            <div className="fixed bottom-0 right-0 w-full max-w-sm h-96 rounded-tl-2xl border border-border bg-card z-50 flex flex-col">
              <div className="flex items-center justify-between p-3 border-b border-border">
                <span className="text-sm font-medium">Messages</span>
                <button onClick={() => { setChatAppId(null); setChatMessages([]); }} className="text-muted-foreground hover:text-foreground text-xs">✕</button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {chatMessages.map((m: any) => (
                  <div key={m.id} className={`text-xs p-2 rounded-lg max-w-[80%] ${m.sender_id === userId ? "bg-primary/10 ml-auto" : "bg-muted"}`}>
                    {m.body}
                  </div>
                ))}
              </div>
              <div className="flex gap-2 p-3 border-t border-border">
                <Input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Type..." className="text-sm" onKeyDown={e => e.key === "Enter" && sendMessage()} />
                <Button size="sm" onClick={sendMessage} className="bg-gradient-brand border-0"><Send className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          )}

          {/* Interview Form Modal */}
          {interviewForm && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }} onClick={() => setInterviewForm(null)}>
              <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 space-y-3" onClick={e => e.stopPropagation()}>
                <h3 className="font-serif font-bold text-lg">Schedule Interview</h3>
                <Input type="date" value={interviewForm.date} onChange={e => setInterviewForm(f => f ? { ...f, date: e.target.value } : null)} />
                <Input type="time" value={interviewForm.time} onChange={e => setInterviewForm(f => f ? { ...f, time: e.target.value } : null)} />
                <Input value={interviewForm.link} onChange={e => setInterviewForm(f => f ? { ...f, link: e.target.value } : null)} placeholder="Meeting link (optional)" />
                <Button onClick={scheduleInterview} className="w-full bg-gradient-brand border-0 font-semibold">Confirm Schedule</Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
