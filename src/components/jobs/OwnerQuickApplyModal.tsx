import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Zap, Upload, Sparkles, ExternalLink, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Job } from "@/data/jobs";

const CV_VERSIONS = ["General", "Tech", "Finance", "NGO", "International"] as const;

interface Props {
  job: Job;
  open: boolean;
  onClose: () => void;
  userId: string;
}

export default function OwnerQuickApplyModal({ job, open, onClose, userId }: Props) {
  const [cvVersion, setCvVersion] = useState<string>("General");
  const [coverLetter, setCoverLetter] = useState("");
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadedCVs, setUploadedCVs] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!open) return;
    loadCVs();
  }, [open, userId]);

  const loadCVs = async () => {
    const { data } = await supabase.storage.from("owner-cvs").list(userId + "/");
    if (data) setUploadedCVs(data.map((f) => f.name));
  };

  const handleUploadCV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const path = `${userId}/${cvVersion}.pdf`;
    const { error } = await supabase.storage.from("owner-cvs").upload(path, file, { upsert: true });
    if (error) toast.error("Upload failed");
    else {
      toast.success(`${cvVersion} CV uploaded`);
      loadCVs();
    }
    setUploading(false);
  };

  const generateCoverLetter = async () => {
    setGenerating(true);
    try {
      const res = await supabase.functions.invoke("ai-generate", {
        body: {
          prompt: `Write a professional, concise cover letter for this job application. Job title: ${job.title}. Company: ${job.company}. Location: ${job.location}. Keep it under 250 words, professional tone, highlight relevant experience and enthusiasm for the role.`,
        },
      });
      if (res.data?.text) setCoverLetter(res.data.text);
      else toast.error("AI generation failed");
    } catch {
      toast.error("AI generation failed");
    }
    setGenerating(false);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    // Log to owner_applications
    const { error } = await supabase.from("owner_applications" as any).insert({
      user_id: userId,
      job_title: job.title,
      company: job.company,
      apply_url: job.apply_url || "",
      cv_version: cvVersion,
      cover_letter: coverLetter,
      status: "Applied",
    } as any);

    if (error) {
      toast.error("Failed to log application");
      setSubmitting(false);
      return;
    }

    // Open apply URL
    if (job.apply_url) {
      window.open(job.apply_url, "_blank");
    }

    toast.success("✅ Applied & logged!");
    setSubmitting(false);
    onClose();
  };

  const hasCVForVersion = uploadedCVs.some((n) => n.startsWith(cvVersion));

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-400">
            <Zap className="h-5 w-5" /> Quick Apply
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Job info */}
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
            <p className="font-semibold">{job.title}</p>
            <p className="text-sm text-muted-foreground">{job.company} · {job.location}</p>
          </div>

          {/* CV Version selector */}
          <div>
            <label className="text-sm font-medium mb-1 block">CV Version</label>
            <Select value={cvVersion} onValueChange={setCvVersion}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CV_VERSIONS.map((v) => (
                  <SelectItem key={v} value={v}>
                    {v} {uploadedCVs.some((n) => n.startsWith(v)) ? "✅" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2 mt-2">
              <label className="cursor-pointer">
                <input type="file" accept=".pdf" className="hidden" onChange={handleUploadCV} />
                <span className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-md bg-muted hover:bg-muted/80 transition">
                  <Upload className="h-3 w-3" /> {uploading ? "Uploading..." : hasCVForVersion ? "Replace CV" : "Upload CV"}
                </span>
              </label>
              {hasCVForVersion && <span className="text-xs text-green-400">✅ {cvVersion} CV ready</span>}
            </div>
          </div>

          {/* Cover letter */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium">Cover Letter</label>
              <Button
                size="sm"
                variant="ghost"
                className="text-xs gap-1 text-amber-400"
                onClick={generateCoverLetter}
                disabled={generating}
              >
                {generating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                AI Generate
              </Button>
            </div>
            <Textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Write or generate a cover letter..."
              rows={6}
            />
          </div>

          {/* Submit */}
          <div className="flex gap-2">
            <Button
              className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Check className="h-4 w-4 mr-2" />
              )}
              Submit Application
            </Button>
            {job.apply_url && (
              <Button variant="outline" size="icon" onClick={() => window.open(job.apply_url, "_blank")}>
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
