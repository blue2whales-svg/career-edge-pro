import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { CVData, WorkExperience } from "./types";

interface Props {
  data: CVData;
  onChange: (updates: Partial<CVData>) => void;
}

const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Self-Employed"];

function createEmptyJob(): WorkExperience {
  return {
    id: crypto.randomUUID(),
    jobTitle: "",
    company: "",
    location: "",
    industry: "",
    startDate: "",
    endDate: "",
    isPresent: false,
    employmentType: "Full-time",
    responsibilities: [""],
    achievements: "",
  };
}

export default function StepWorkExperience({ data, onChange }: Props) {
  const jobs = data.workExperience;

  const updateJob = (id: string, updates: Partial<WorkExperience>) => {
    onChange({
      workExperience: jobs.map((j) => (j.id === id ? { ...j, ...updates } : j)),
    });
  };

  const addJob = () => onChange({ workExperience: [...jobs, createEmptyJob()] });

  const removeJob = (id: string) => onChange({ workExperience: jobs.filter((j) => j.id !== id) });

  const updateResponsibility = (jobId: string, idx: number, value: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;
    const updated = [...job.responsibilities];
    updated[idx] = value;
    updateJob(jobId, { responsibilities: updated });
  };

  const addResponsibility = (jobId: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job || job.responsibilities.length >= 8) return;
    updateJob(jobId, { responsibilities: [...job.responsibilities, ""] });
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-serif font-bold text-foreground">Work Experience</h2>

      {jobs.length === 0 && (
        <div className="text-center py-8 border border-dashed border-border rounded-xl">
          <p className="text-muted-foreground mb-3">No work experience added yet</p>
          <Button onClick={addJob} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" /> Add Your First Role
          </Button>
        </div>
      )}

      {jobs.map((job, index) => (
        <div key={job.id} className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-muted-foreground">Position {index + 1}</span>
            </div>
            <Button onClick={() => removeJob(job.id)} variant="ghost" size="sm" className="text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Job Title *</Label>
              <Input value={job.jobTitle} onChange={(e) => updateJob(job.id, { jobTitle: e.target.value })} placeholder="e.g. Marketing Manager" />
            </div>
            <div className="space-y-1.5">
              <Label>Company *</Label>
              <Input value={job.company} onChange={(e) => updateJob(job.id, { company: e.target.value })} placeholder="e.g. Safaricom PLC" />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Location</Label>
              <Input value={job.location} onChange={(e) => updateJob(job.id, { location: e.target.value })} placeholder="Nairobi, Kenya" />
            </div>
            <div className="space-y-1.5">
              <Label>Industry</Label>
              <Input value={job.industry} onChange={(e) => updateJob(job.id, { industry: e.target.value })} placeholder="Telecommunications" />
            </div>
            <div className="space-y-1.5">
              <Label>Type</Label>
              <select
                value={job.employmentType}
                onChange={(e) => updateJob(job.id, { employmentType: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {EMPLOYMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Start Date</Label>
              <Input type="month" value={job.startDate} onChange={(e) => updateJob(job.id, { startDate: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>End Date</Label>
              <div className="flex items-center gap-3">
                {!job.isPresent && (
                  <Input type="month" value={job.endDate} onChange={(e) => updateJob(job.id, { endDate: e.target.value })} />
                )}
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <Checkbox
                    checked={job.isPresent}
                    onCheckedChange={(v) => updateJob(job.id, { isPresent: !!v, endDate: "" })}
                  />
                  <span className="text-sm text-muted-foreground">Present</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Key Responsibilities</Label>
            {job.responsibilities.map((r, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-muted-foreground mt-2.5 text-sm">•</span>
                <Input
                  value={r}
                  onChange={(e) => updateResponsibility(job.id, i, e.target.value)}
                  placeholder="e.g. Led a team of 12 to deliver 30% revenue growth"
                />
              </div>
            ))}
            {job.responsibilities.length < 8 && (
              <Button onClick={() => addResponsibility(job.id)} variant="ghost" size="sm" className="text-primary">
                <Plus className="h-3 w-3 mr-1" /> Add bullet point
              </Button>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Key Achievements</Label>
            <Textarea
              value={job.achievements}
              onChange={(e) => updateJob(job.id, { achievements: e.target.value })}
              rows={2}
              placeholder="e.g. Increased customer retention by 25% through new loyalty programme"
              className="bg-background border-border"
            />
          </div>
        </div>
      ))}

      {jobs.length > 0 && (
        <Button onClick={addJob} variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-1" /> Add Another Position
        </Button>
      )}
    </div>
  );
}
