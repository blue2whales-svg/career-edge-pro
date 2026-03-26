import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, Send, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface ApplyModalProps {
  open: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle: string;
  company: string;
  onApplied?: () => void;
}

export default function ApplyModal({ open, onClose, jobId, jobTitle, company, onApplied }: ApplyModalProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [tab, setTab] = useState<"quick" | "full">("quick");
  const [coverNote, setCoverNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!open) { setSuccess(false); setCoverNote(""); setTab("quick"); return; }
    supabase.auth.getUser().then(({ data }) => {
      const uid = data.user?.id || null;
      setUserId(uid);
      if (uid) {
        supabase.from("applications").select("id").eq("job_id", jobId).eq("candidate_id", uid).maybeSingle()
          .then(({ data: app }) => { if (app) setAlreadyApplied(true); else setAlreadyApplied(false); });
      }
    });
  }, [open, jobId]);

  const handleApply = async () => {
    if (!userId) return;
    setLoading(true);
    const payload: any = { job_id: jobId, candidate_id: userId, status: "Applied" };
    if (tab === "full" && coverNote.trim()) payload.cover_note = coverNote.trim();
    const { error } = await supabase.from("applications").insert(payload);
    setLoading(false);
    if (error) {
      if (error.code === "23505") { setAlreadyApplied(true); toast.info("You've already applied"); }
      else toast.error("Application failed");
    } else {
      setSuccess(true);
      toast.success("Application submitted! 🎉");
      onApplied?.();
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
        onClick={onClose}>
        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md rounded-2xl border border-border bg-card p-6 relative" onClick={e => e.stopPropagation()}>
          <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>

          {success ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center mx-auto">
                <CheckCircle className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-serif font-bold text-xl">Application Submitted!</h3>
              <p className="text-sm text-muted-foreground">Track your application in the Job Tracker.</p>
              <Button onClick={onClose} variant="outline" className="mt-2">Close</Button>
            </div>
          ) : !userId ? (
            <div className="text-center py-6 space-y-3">
              <LogIn className="h-10 w-10 text-muted-foreground mx-auto" />
              <h3 className="font-serif font-bold text-xl">Sign in to Apply</h3>
              <p className="text-sm text-muted-foreground">Create an account to apply for jobs.</p>
              <Link to="/login"><Button className="bg-gradient-brand border-0 font-semibold">Sign In</Button></Link>
            </div>
          ) : alreadyApplied ? (
            <div className="text-center py-6 space-y-3">
              <CheckCircle className="h-10 w-10 text-primary mx-auto" />
              <h3 className="font-serif font-bold text-xl">Already Applied</h3>
              <p className="text-sm text-muted-foreground">You've already submitted an application for this role.</p>
              <Button onClick={onClose} variant="outline">Close</Button>
            </div>
          ) : (
            <>
              <h3 className="font-serif font-bold text-xl mb-1">Apply for Role</h3>
              <p className="text-sm text-muted-foreground mb-4">{jobTitle} at {company}</p>

              <div className="flex gap-2 mb-4">
                <button onClick={() => setTab("quick")}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${tab === "quick" ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>
                  Quick Apply
                </button>
                <button onClick={() => setTab("full")}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${tab === "full" ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>
                  Full Apply
                </button>
              </div>

              {tab === "full" && (
                <div className="mb-4">
                  <Textarea value={coverNote} onChange={e => setCoverNote(e.target.value)} rows={4} placeholder="Cover note (optional) — tell the employer why you're a great fit..." />
                </div>
              )}

              <Button onClick={handleApply} disabled={loading} className="w-full bg-gradient-brand border-0 font-semibold h-11 gap-2">
                <Send className="h-4 w-4" /> {loading ? "Submitting..." : "Apply Now"}
              </Button>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
