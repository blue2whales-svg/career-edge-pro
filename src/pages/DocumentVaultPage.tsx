import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  User, Briefcase, GraduationCap, Wrench, Target, Save,
  Plus, Trash2, CheckCircle2, AlertTriangle, ChevronDown, ChevronUp,
  Shield, Sparkles,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Role {
  id: string;
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  achievements: string[];
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
  grade: string;
}

interface VaultProfile {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
  targetRoles: string;
  careerSummary: string;
  roles: Role[];
  education: Education[];
  technicalSkills: string;
  softSkills: string;
  languages: string;
  certifications: string;
}

const emptyRole = (): Role => ({
  id: crypto.randomUUID(),
  jobTitle: "",
  company: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  achievements: ["", "", ""],
});

const emptyEdu = (): Education => ({
  id: crypto.randomUUID(),
  degree: "",
  institution: "",
  year: "",
  grade: "",
});

const initial: VaultProfile = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  portfolio: "",
  targetRoles: "",
  careerSummary: "",
  roles: [emptyRole()],
  education: [emptyEdu()],
  technicalSkills: "",
  softSkills: "",
  languages: "",
  certifications: "",
};

// ─── Strength calculator ──────────────────────────────────────────────────────
function calcStrength(p: VaultProfile): { score: number; tips: string[] } {
  const tips: string[] = [];
  let pts = 0;
  const max = 100;

  if (p.fullName.trim()) pts += 8; else tips.push("Add your full name");
  if (p.email.trim()) pts += 6; else tips.push("Add your email");
  if (p.phone.trim()) pts += 4; else tips.push("Add your phone number");
  if (p.location.trim()) pts += 4; else tips.push("Add your location");
  if (p.linkedin.trim()) pts += 5; else tips.push("Add your LinkedIn URL");
  if (p.targetRoles.trim()) pts += 6; else tips.push("Add target job titles");
  if (p.careerSummary.trim().length >= 100) pts += 12;
  else if (p.careerSummary.trim().length > 0) { pts += 4; tips.push("Career summary should be at least 100 characters"); }
  else tips.push("Write a career summary (min 100 chars)");

  const filledRoles = p.roles.filter(r => r.jobTitle && r.company);
  if (filledRoles.length >= 2) pts += 20;
  else if (filledRoles.length === 1) { pts += 10; tips.push("Add at least 2 work experiences"); }
  else tips.push("Add your work experience");

  const achCount = p.roles.flatMap(r => r.achievements).filter(a => a.trim()).length;
  if (achCount >= 6) pts += 10;
  else if (achCount > 0) { pts += 4; tips.push("Add more achievement bullets with metrics"); }
  else tips.push("Add achievement bullets to your roles");

  const filledEdu = p.education.filter(e => e.degree && e.institution);
  if (filledEdu.length >= 1) pts += 10; else tips.push("Add your education");

  if (p.technicalSkills.trim()) pts += 8; else tips.push("Add technical skills");
  if (p.softSkills.trim()) pts += 4; else tips.push("Add soft skills");
  if (p.languages.trim()) pts += 3; else tips.push("Add languages");

  return { score: Math.min(Math.round((pts / max) * 100), 100), tips: tips.slice(0, 4) };
}

// ─── Metric check ─────────────────────────────────────────────────────────────
function hasMetric(text: string) {
  return /\d/.test(text);
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({
  icon: Icon, title, children, defaultOpen = true,
}: { icon: React.ElementType; title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 md:p-5 bg-card hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-4.5 h-4.5 text-primary" />
          </div>
          <span className="font-semibold text-foreground">{title}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && <div className="p-4 md:p-5 pt-0 md:pt-0 space-y-4">{children}</div>}
    </div>
  );
}

// ─── Label ────────────────────────────────────────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-muted-foreground mb-1">{children}</label>;
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DocumentVaultPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<VaultProfile>(initial);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const { score, tips } = useMemo(() => calcStrength(profile), [profile]);

  // Auth check + load
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/login"); return; }
      setUserId(user.id);

      const { data } = await supabase
        .from("vault_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data) {
        setProfile({
          fullName: data.full_name || "",
          email: data.email || "",
          phone: data.phone || "",
          location: data.location || "",
          linkedin: data.linkedin || "",
          portfolio: data.portfolio || "",
          targetRoles: data.target_roles || "",
          careerSummary: data.career_summary || "",
          roles: (data.roles as unknown as Role[]) || [emptyRole()],
          education: (data.education as unknown as Education[]) || [emptyEdu()],
          technicalSkills: data.technical_skills || "",
          softSkills: data.soft_skills || "",
          languages: data.languages || "",
          certifications: data.certifications || "",
        });
      }
      setLoading(false);
    })();
  }, [navigate]);

  const set = useCallback(<K extends keyof VaultProfile>(key: K, val: VaultProfile[K]) => {
    setProfile(prev => ({ ...prev, [key]: val }));
  }, []);

  const updateRole = useCallback((id: string, field: keyof Role, val: unknown) => {
    setProfile(prev => ({
      ...prev,
      roles: prev.roles.map(r => r.id === id ? { ...r, [field]: val } : r),
    }));
  }, []);

  const updateEdu = useCallback((id: string, field: keyof Education, val: string) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.map(e => e.id === id ? { ...e, [field]: val } : e),
    }));
  }, []);

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    const payload = {
      user_id: userId,
      full_name: profile.fullName.trim(),
      email: profile.email.trim(),
      phone: profile.phone.trim(),
      location: profile.location.trim(),
      linkedin: profile.linkedin.trim(),
      portfolio: profile.portfolio.trim(),
      target_roles: profile.targetRoles.trim(),
      career_summary: profile.careerSummary.trim(),
      roles: profile.roles as unknown as Record<string, unknown>[],
      education: profile.education as unknown as Record<string, unknown>[],
      technical_skills: profile.technicalSkills.trim(),
      soft_skills: profile.softSkills.trim(),
      languages: profile.languages.trim(),
      certifications: profile.certifications.trim(),
    };

    const { error } = await supabase
      .from("vault_profiles")
      .upsert(payload as any, { onConflict: "user_id" });

    setSaving(false);
    if (error) { toast.error("Failed to save: " + error.message); return; }
    toast.success("Profile saved successfully!");
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </PageLayout>
    );
  }

  const strengthColor = score >= 80 ? "text-green-400" : score >= 50 ? "text-yellow-400" : "text-red-400";
  const strengthBg = score >= 80 ? "bg-green-400" : score >= 50 ? "bg-yellow-400" : "bg-red-400";

  return (
    <PageLayout>
      <div className="min-h-screen bg-background">
        {/* Hero */}
        <section className="relative py-16 md:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-5" />
          <div className="container max-w-3xl mx-auto px-4 text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                <Shield className="w-4 h-4" />
                Secure Career Vault
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                Document <span className="text-gradient">Vault</span>
              </h1>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Store your career information once. Reuse it every time you apply for a job.
              </p>
            </motion.div>
          </div>
        </section>

        <div className="container max-w-3xl mx-auto px-4 pb-24 space-y-6">
          {/* Strength Meter */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">Profile Strength</span>
              </div>
              <span className={`text-2xl font-bold ${strengthColor}`}>{score}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-muted overflow-hidden mb-3">
              <motion.div
                className={`h-full rounded-full ${strengthBg}`}
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
            {tips.length > 0 && (
              <div className="space-y-1.5">
                {tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <AlertTriangle className="w-3.5 h-3.5 text-yellow-500 mt-0.5 shrink-0" />
                    {tip}
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* 1. Personal Information */}
          <Section icon={User} title="Personal Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label>Full Name *</Label><Input value={profile.fullName} onChange={e => set("fullName", e.target.value)} placeholder="James Mitchell" /></div>
              <div><Label>Email *</Label><Input type="email" value={profile.email} onChange={e => set("email", e.target.value)} placeholder="james@example.com" /></div>
              <div><Label>Phone</Label><Input value={profile.phone} onChange={e => set("phone", e.target.value)} placeholder="+254 712 345 678" /></div>
              <div><Label>Location</Label><Input value={profile.location} onChange={e => set("location", e.target.value)} placeholder="Nairobi, Kenya" /></div>
              <div><Label>LinkedIn URL</Label><Input value={profile.linkedin} onChange={e => set("linkedin", e.target.value)} placeholder="https://linkedin.com/in/..." /></div>
              <div><Label>Portfolio URL</Label><Input value={profile.portfolio} onChange={e => set("portfolio", e.target.value)} placeholder="https://..." /></div>
            </div>
          </Section>

          {/* 2. Career Goal */}
          <Section icon={Target} title="Career Goal">
            <div>
              <Label>Target Job Titles (comma separated)</Label>
              <Input value={profile.targetRoles} onChange={e => set("targetRoles", e.target.value)} placeholder="Marketing Manager, Brand Director, CMO" />
            </div>
            <div>
              <Label>Career Summary (min 100 characters)</Label>
              <Textarea
                value={profile.careerSummary}
                onChange={e => set("careerSummary", e.target.value)}
                placeholder="Write a compelling summary of your career, key achievements, and what you bring to employers..."
                rows={4}
                className="resize-none"
              />
              <div className={`text-xs mt-1 ${profile.careerSummary.length >= 100 ? "text-green-400" : "text-muted-foreground"}`}>
                {profile.careerSummary.length}/100 characters minimum
              </div>
            </div>
          </Section>

          {/* 3. Work Experience */}
          <Section icon={Briefcase} title="Work Experience">
            {profile.roles.map((role, ri) => (
              <div key={role.id} className="rounded-lg border border-border/50 bg-muted/10 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Role {ri + 1}</span>
                  {profile.roles.length > 1 && (
                    <button
                      onClick={() => set("roles", profile.roles.filter(r => r.id !== role.id))}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div><Label>Job Title *</Label><Input value={role.jobTitle} onChange={e => updateRole(role.id, "jobTitle", e.target.value)} placeholder="Marketing Director" /></div>
                  <div><Label>Company *</Label><Input value={role.company} onChange={e => updateRole(role.id, "company", e.target.value)} placeholder="Safaricom PLC" /></div>
                  <div><Label>Start Date</Label><Input type="month" value={role.startDate} onChange={e => updateRole(role.id, "startDate", e.target.value)} /></div>
                  <div>
                    <Label>End Date</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        type="month"
                        value={role.endDate}
                        onChange={e => updateRole(role.id, "endDate", e.target.value)}
                        disabled={role.isCurrent}
                        className={role.isCurrent ? "opacity-50" : ""}
                      />
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Checkbox
                          checked={role.isCurrent}
                          onCheckedChange={v => updateRole(role.id, "isCurrent", !!v)}
                          id={`current-${role.id}`}
                        />
                        <label htmlFor={`current-${role.id}`} className="text-xs text-muted-foreground cursor-pointer">Current</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <Label>Achievements (add metrics for impact!)</Label>
                  <div className="space-y-2">
                    {role.achievements.map((ach, ai) => (
                      <div key={ai} className="flex items-center gap-2">
                        <Input
                          value={ach}
                          onChange={e => {
                            const newAch = [...role.achievements];
                            newAch[ai] = e.target.value;
                            updateRole(role.id, "achievements", newAch);
                          }}
                          placeholder={`Achievement ${ai + 1} — e.g. "Increased revenue by 35%"`}
                          className="flex-1"
                        />
                        {ach.trim() && (
                          hasMetric(ach) ? (
                            <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" title="Add a number or metric for more impact" />
                          )
                        )}
                        {role.achievements.length > 3 && (
                          <button
                            onClick={() => {
                              const newAch = role.achievements.filter((_, i) => i !== ai);
                              updateRole(role.id, "achievements", newAch);
                            }}
                            className="text-destructive/60 hover:text-destructive"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => updateRole(role.id, "achievements", [...role.achievements, ""])}
                      className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3 h-3" /> Add achievement
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => set("roles", [...profile.roles, emptyRole()])}
              className="border-primary/30 text-primary hover:bg-primary/10"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Role
            </Button>
          </Section>

          {/* 4. Education */}
          <Section icon={GraduationCap} title="Education">
            {profile.education.map((edu, ei) => (
              <div key={edu.id} className="rounded-lg border border-border/50 bg-muted/10 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Education {ei + 1}</span>
                  {profile.education.length > 1 && (
                    <button
                      onClick={() => set("education", profile.education.filter(e => e.id !== edu.id))}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div><Label>Degree *</Label><Input value={edu.degree} onChange={e => updateEdu(edu.id, "degree", e.target.value)} placeholder="MBA, Marketing" /></div>
                  <div><Label>Institution *</Label><Input value={edu.institution} onChange={e => updateEdu(edu.id, "institution", e.target.value)} placeholder="University of Nairobi" /></div>
                  <div><Label>Year</Label><Input value={edu.year} onChange={e => updateEdu(edu.id, "year", e.target.value)} placeholder="2017" /></div>
                  <div><Label>Grade (optional)</Label><Input value={edu.grade} onChange={e => updateEdu(edu.id, "grade", e.target.value)} placeholder="First Class Honours" /></div>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => set("education", [...profile.education, emptyEdu()])}
              className="border-primary/30 text-primary hover:bg-primary/10"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Education
            </Button>
          </Section>

          {/* 5. Skills */}
          <Section icon={Wrench} title="Skills & Qualifications">
            <div>
              <Label>Technical Skills (comma separated)</Label>
              <Input value={profile.technicalSkills} onChange={e => set("technicalSkills", e.target.value)} placeholder="SEO, Google Analytics, Python, Figma, SQL" />
            </div>
            <div>
              <Label>Soft Skills (comma separated)</Label>
              <Input value={profile.softSkills} onChange={e => set("softSkills", e.target.value)} placeholder="Leadership, Communication, Strategic Thinking" />
            </div>
            <div>
              <Label>Languages</Label>
              <Input value={profile.languages} onChange={e => set("languages", e.target.value)} placeholder="English (Fluent), Swahili (Native), French (Basic)" />
            </div>
            <div>
              <Label>Certifications</Label>
              <Textarea
                value={profile.certifications}
                onChange={e => set("certifications", e.target.value)}
                placeholder="Google Analytics Certified (2023)&#10;PMP Certified (2022)"
                rows={3}
                className="resize-none"
              />
            </div>
          </Section>

          {/* Save */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full h-12 text-base font-semibold bg-gradient-brand hover:opacity-90 text-primary-foreground shadow-glow-sm"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <><Save className="w-5 h-5 mr-2" /> Save Profile</>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
}
