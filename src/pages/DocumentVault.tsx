// src/pages/DocumentVault.tsx
// Drop into src/pages/ in your Lovable project.
// Route: <Route path="/document-vault" element={<DocumentVault />} />

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
// ─── Types ────────────────────────────────────────────────────────────────────

interface WorkRole {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  current: boolean;
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
  // Personal
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
  // Career
  targetRoles: string;
  careerSummary: string;
  // Experience
  roles: WorkRole[];
  // Education
  education: Education[];
  // Skills
  technicalSkills: string;
  softSkills: string;
  languages: string;
  certifications: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const uid = () => Math.random().toString(36).slice(2, 8);

const emptyRole = (): WorkRole => ({
  id: uid(), title: "", company: "", startDate: "", endDate: "",
  current: false, achievements: ["", "", ""],
});

const emptyEdu = (): Education => ({
  id: uid(), degree: "", institution: "", year: "", grade: "",
});

const defaultProfile = (): VaultProfile => ({
  fullName: "", email: "", phone: "", location: "",
  linkedin: "", portfolio: "", targetRoles: "", careerSummary: "",
  roles: [emptyRole()],
  education: [emptyEdu()],
  technicalSkills: "", softSkills: "", languages: "", certifications: "",
});

// ─── Profile Strength Calculator ─────────────────────────────────────────────

function calcStrength(p: VaultProfile): { score: number; tips: string[] } {
  const tips: string[] = [];
  let score = 0;

  if (p.fullName.trim()) score += 5; else tips.push("Add your full name");
  if (p.email.trim()) score += 5; else tips.push("Add your email");
  if (p.phone.trim()) score += 3;
  if (p.location.trim()) score += 3;
  if (p.linkedin.trim()) score += 4;
  if (p.targetRoles.trim()) score += 8; else tips.push("Add your target roles");
  if (p.careerSummary.trim().length > 80) score += 10; else tips.push("Write a career summary (2–3 sentences)");

  const filledRoles = p.roles.filter(r => r.title && r.company && r.startDate);
  score += Math.min(filledRoles.length * 8, 24);
  if (filledRoles.length === 0) tips.push("Add at least one work experience");

  const quantified = p.roles.flatMap(r => r.achievements).filter(a =>
    a.length > 20 && /\d/.test(a)
  );
  if (quantified.length >= 3) score += 12;
  else tips.push(`Add numbers to achievements (${quantified.length}/3 quantified)`);

  const filledEdu = p.education.filter(e => e.degree && e.institution);
  if (filledEdu.length > 0) score += 6; else tips.push("Add your education");

  if (p.technicalSkills.split(",").filter(Boolean).length >= 5) score += 6;
  else tips.push("List at least 5 technical skills");

  if (p.languages.trim()) score += 4;
  if (p.certifications.trim()) score += 4;

  return { score: Math.min(score, 100), tips: tips.slice(0, 3) };
}

function strengthLabel(score: number) {
  if (score >= 85) return { label: "Excellent", color: "#4ade80" };
  if (score >= 65) return { label: "Good", color: "#d4a843" };
  if (score >= 40) return { label: "Fair", color: "#f59e0b" };
  return { label: "Weak", color: "#f87171" };
}

// ─── Tooltip Component ────────────────────────────────────────────────────────

function Tip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-block ml-1.5 align-middle">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        className="w-4 h-4 rounded-full bg-gray-700 text-gray-400 text-[10px] font-bold flex items-center justify-center hover:bg-amber-600 hover:text-black transition-colors"
        type="button"
        aria-label="Help"
      >?</button>
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-xs text-gray-300 leading-relaxed shadow-xl z-50 pointer-events-none">
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-700" />
          {text}
        </div>
      )}
    </span>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHead({ icon, title, sub }: { icon: string; title: string; sub: string }) {
  return (
    <div className="flex items-start gap-3 mb-6 pb-4 border-b border-gray-800">
      <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-600/30 flex items-center justify-center text-lg flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <h3 className="text-base font-semibold text-white">{title}</h3>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{sub}</p>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DocumentVault() {
  const [profile, setProfile] = useState<VaultProfile>(defaultProfile);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  const { score, tips } = calcStrength(profile);
  const { label: strengthLbl, color: strengthColor } = strengthLabel(score);

  const set = (field: keyof VaultProfile) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setProfile(p => ({ ...p, [field]: e.target.value }));

  // ── Role handlers ────────────────────────────────────────────────────────

  const updateRole = (id: string, field: keyof WorkRole, value: any) =>
    setProfile(p => ({
      ...p,
      roles: p.roles.map(r => r.id === id ? { ...r, [field]: value } : r),
    }));

  const updateAchievement = (roleId: string, idx: number, value: string) =>
    setProfile(p => ({
      ...p,
      roles: p.roles.map(r =>
        r.id === roleId
          ? { ...r, achievements: r.achievements.map((a, i) => i === idx ? value : a) }
          : r
      ),
    }));

  const addAchievement = (roleId: string) =>
    setProfile(p => ({
      ...p,
      roles: p.roles.map(r =>
        r.id === roleId ? { ...r, achievements: [...r.achievements, ""] } : r
      ),
    }));

  const removeAchievement = (roleId: string, idx: number) =>
    setProfile(p => ({
      ...p,
      roles: p.roles.map(r =>
        r.id === roleId
          ? { ...r, achievements: r.achievements.filter((_, i) => i !== idx) }
          : r
      ),
    }));

  const addRole = () => setProfile(p => ({ ...p, roles: [...p.roles, emptyRole()] }));
  const removeRole = (id: string) =>
    setProfile(p => ({ ...p, roles: p.roles.filter(r => r.id !== id) }));

  // ── Education handlers ───────────────────────────────────────────────────

  const updateEdu = (id: string, field: keyof Education, value: string) =>
    setProfile(p => ({
      ...p,
      education: p.education.map(e => e.id === id ? { ...e, [field]: value } : e),
    }));

  const addEdu = () => setProfile(p => ({ ...p, education: [...p.education, emptyEdu()] }));
  const removeEdu = (id: string) =>
    setProfile(p => ({ ...p, education: p.education.filter(e => e.id !== id) }));

  // ── Save ─────────────────────────────────────────────────────────────────

  const handleSave = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("vault_profiles").upsert({
    user_id: user.id,
    full_name: profile.fullName,
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
    linkedin: profile.linkedin,
    portfolio: profile.portfolio,
    target_roles: profile.targetRoles,
    career_summary: profile.careerSummary,
    roles: profile.roles,
    education: profile.education,
    technical_skills: profile.technicalSkills,
    soft_skills: profile.softSkills,
    languages: profile.languages,
    certifications: profile.certifications,
    updated_at: new Date().toISOString(),
  });

  setSaved(true);
  setTimeout(() => setSaved(false), 3000);
};
  // ── Load saved ───────────────────────────────────────────────────────────

  useEffect(() => {
    const stored = localStorage.getItem("cvEdgeVault");
    if (stored) {
      try { setProfile(JSON.parse(stored)); } catch {}
    }
  }, []);

  // ── Shared styles ────────────────────────────────────────────────────────

  const inputCls = "w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 transition-all";
  const labelCls = "block text-[11px] font-mono tracking-widest uppercase text-gray-500 mb-1.5 flex items-center";

  const hasNumbers = (s: string) => /\d/.test(s);

  const sections = ["Personal", "Career Goal", "Experience", "Education", "Skills"];

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&family=DM+Mono:wght@400;500&family=Playfair+Display:wght@700;900&display=swap');`}</style>

      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-gray-950/95 backdrop-blur border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono tracking-widest text-amber-400 uppercase">Document Vault</span>
            <span className="text-gray-700">|</span>
            <span className="text-xs text-gray-500">Profile strength</span>
            <div className="flex items-center gap-2">
              <div className="w-28 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${score}%`, background: strengthColor }} />
              </div>
              <span className="text-xs font-mono font-semibold" style={{ color: strengthColor }}>
                {score}% · {strengthLbl}
              </span>
            </div>
          </div>
          <button onClick={handleSave}
            className={`px-5 py-2 rounded-lg text-xs font-semibold font-mono tracking-wider transition-all
              ${saved
                ? "bg-green-500/20 border border-green-500/40 text-green-400"
                : "bg-amber-500 hover:bg-amber-400 text-black"}`}>
            {saved ? "✓ Saved" : "Save Vault"}
          </button>
        </div>

        {/* Section nav */}
        <div className="max-w-4xl mx-auto px-4 pb-0 flex gap-1 overflow-x-auto">
          {sections.map((s, i) => (
            <button key={s} onClick={() => {
              setActiveSection(i);
              document.getElementById(`section-${i}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
              className={`px-4 py-2 text-xs font-mono whitespace-nowrap border-b-2 transition-all
                ${activeSection === i
                  ? "border-amber-500 text-amber-400"
                  : "border-transparent text-gray-600 hover:text-gray-400"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">

        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            Your Document Vault
          </h1>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed max-w-lg">
            Fill this in once. Every time you apply for a job, we pull from here automatically — so your CV and cover letter are always tailored and ready.
          </p>
        </div>

        {/* Strength tips */}
        {tips.length > 0 && (
          <div className="bg-amber-500/5 border border-amber-600/20 rounded-xl p-4 flex gap-3">
            <span className="text-amber-500 mt-0.5 flex-shrink-0">⚡</span>
            <div>
              <p className="text-xs font-semibold text-amber-400 mb-1.5 font-mono tracking-wider uppercase">Improve your profile</p>
              <ul className="space-y-1">
                {tips.map((t, i) => (
                  <li key={i} className="text-xs text-gray-400 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-amber-600 flex-shrink-0" />{t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ── SECTION 0: Personal Info ── */}
        <div id="section-0" className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <SectionHead icon="👤" title="Personal Information"
            sub="Your contact details. Keep these professional — this is what appears at the top of every CV." />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>
                Full Name
                <Tip text="Use your full legal name as it appears on official documents." />
              </label>
              <input className={inputCls} placeholder="e.g. Amina Ochieng" value={profile.fullName} onChange={set("fullName")} />
            </div>
            <div>
              <label className={labelCls}>
                Professional Email
                <Tip text="Use a firstname.lastname format. Avoid nicknames or numbers like 'coolboy99@gmail.com'." />
              </label>
              <input className={inputCls} placeholder="firstname.lastname@gmail.com" value={profile.email} onChange={set("email")} />
            </div>
            <div>
              <label className={labelCls}>Phone Number</label>
              <input className={inputCls} placeholder="+254 712 345 678" value={profile.phone} onChange={set("phone")} />
            </div>
            <div>
              <label className={labelCls}>
                Location
                <Tip text="City and country is enough. No need for a full street address." />
              </label>
              <input className={inputCls} placeholder="Nairobi, Kenya" value={profile.location} onChange={set("location")} />
            </div>
            <div>
              <label className={labelCls}>
                LinkedIn URL
                <Tip text="Go to your LinkedIn profile, click 'Edit public profile & URL', and copy the clean URL like linkedin.com/in/yourname" />
              </label>
              <input className={inputCls} placeholder="linkedin.com/in/yourname" value={profile.linkedin} onChange={set("linkedin")} />
            </div>
            <div>
              <label className={labelCls}>Portfolio / Website <span className="text-gray-700 ml-1 normal-case tracking-normal font-sans">(optional)</span></label>
              <input className={inputCls} placeholder="yourname.com" value={profile.portfolio} onChange={set("portfolio")} />
            </div>
          </div>
        </div>

        {/* ── SECTION 1: Career Goal ── */}
        <div id="section-1" className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <SectionHead icon="🎯" title="Career Goal"
            sub="This is critical. It tells the AI what kind of roles to optimise your documents for." />
          <div className="space-y-4">
            <div>
              <label className={labelCls}>
                Target Roles / Job Titles
                <Tip text="List the specific job titles you're targeting. Be precise — 'Finance Manager' is better than 'finance jobs'. Separate with commas." />
              </label>
              <input className={inputCls}
                placeholder="e.g. Senior Financial Analyst, Finance Manager, Budget Officer"
                value={profile.targetRoles} onChange={set("targetRoles")} />
            </div>
            <div>
              <label className={labelCls}>
                Career Summary
                <Tip text="2–3 sentences. Who are you professionally, how many years experience, what's your speciality, and what are you looking for next? This becomes your CV's opening paragraph." />
              </label>
              <textarea className={`${inputCls} resize-y`} rows={4}
                placeholder="e.g. Finance professional with 6 years of experience managing multi-million dollar NGO budgets across East Africa. Specialise in donor reporting, budget forecasting, and financial compliance. Looking to transition into a senior corporate finance role where I can apply my analytical skills at scale."
                value={profile.careerSummary} onChange={set("careerSummary")} />
              <p className="text-xs text-gray-600 mt-1.5">
                {profile.careerSummary.length < 80
                  ? `⚠ Too short — aim for at least 100 characters (${profile.careerSummary.length}/100)`
                  : `✓ Good length (${profile.careerSummary.length} characters)`}
              </p>
            </div>
          </div>
        </div>

        {/* ── SECTION 2: Work Experience ── */}
        <div id="section-2" className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <SectionHead icon="💼" title="Work Experience"
            sub="List every relevant role. The more detail and numbers you give, the stronger your CV will be." />

          <div className="space-y-6">
            {profile.roles.map((role, roleIdx) => (
              <div key={role.id} className="bg-gray-950 border border-gray-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-amber-500 tracking-widest uppercase">
                    Role {roleIdx + 1}
                  </span>
                  {profile.roles.length > 1 && (
                    <button onClick={() => removeRole(role.id)}
                      className="text-xs text-gray-600 hover:text-red-400 transition-colors font-mono">
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>
                      Job Title
                      <Tip text="Use your official job title. If it was unusual, add a clarifying title in brackets e.g. 'Finance Lead (Senior Analyst equivalent)'" />
                    </label>
                    <input className={inputCls} placeholder="e.g. Finance Officer"
                      value={role.title} onChange={e => updateRole(role.id, "title", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Company / Organisation</label>
                    <input className={inputCls} placeholder="e.g. UNICEF Kenya"
                      value={role.company} onChange={e => updateRole(role.id, "company", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Start Date</label>
                    <input className={inputCls} type="month"
                      value={role.startDate} onChange={e => updateRole(role.id, "startDate", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>End Date</label>
                    {role.current ? (
                      <div className="flex items-center gap-2 h-[42px]">
                        <span className="text-xs text-green-400 font-mono bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full">Present</span>
                      </div>
                    ) : (
                      <input className={inputCls} type="month"
                        value={role.endDate} onChange={e => updateRole(role.id, "endDate", e.target.value)} />
                    )}
                    <label className="flex items-center gap-2 mt-2 cursor-pointer">
                      <input type="checkbox" checked={role.current}
                        onChange={e => updateRole(role.id, "current", e.target.checked)}
                        className="w-3.5 h-3.5 rounded accent-amber-500" />
                      <span className="text-xs text-gray-500">I currently work here</span>
                    </label>
                  </div>
                </div>

                {/* Achievements */}
                <div>
                  <label className={labelCls}>
                    Key Achievements
                    <Tip text="Each bullet should: start with an action verb, include a number or metric, and show impact. ✓ 'Managed $2.3M annual budget across 4 counties' ✗ 'Responsible for budget management'" />
                  </label>
                  <div className="space-y-2">
                    {role.achievements.map((ach, achIdx) => {
                      const hasNum = ach.length > 10 && hasNumbers(ach);
                      const tooShort = ach.length > 0 && ach.length < 25;
                      return (
                        <div key={achIdx} className="flex gap-2 items-start">
                          <span className="text-gray-600 mt-2.5 text-xs font-mono flex-shrink-0">
                            {hasNum ? <span className="text-green-500">✓</span> : "•"}
                          </span>
                          <div className="flex-1">
                            <input
                              className={`${inputCls} ${tooShort ? "border-amber-700/50" : hasNum ? "border-green-700/40" : ""}`}
                              placeholder={
                                achIdx === 0 ? "e.g. Managed $2.3M annual budget across 4 programme counties" :
                                achIdx === 1 ? "e.g. Reduced financial discrepancies by 31% through improved reconciliation" :
                                "e.g. Trained and supervised 3 junior finance staff"
                              }
                              value={ach}
                              onChange={e => updateAchievement(role.id, achIdx, e.target.value)}
                            />
                            {tooShort && <p className="text-[10px] text-amber-600 mt-0.5">Too vague — add more detail and a number</p>}
                            {hasNum && <p className="text-[10px] text-green-600 mt-0.5">✓ Strong — has a number/metric</p>}
                          </div>
                          {role.achievements.length > 1 && (
                            <button onClick={() => removeAchievement(role.id, achIdx)}
                              className="text-gray-700 hover:text-red-400 mt-2.5 text-sm transition-colors flex-shrink-0">
                              ×
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <button onClick={() => addAchievement(role.id)}
                    className="mt-2 text-xs text-amber-600 hover:text-amber-400 font-mono transition-colors flex items-center gap-1">
                    + Add achievement
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button onClick={addRole}
            className="mt-4 w-full border border-dashed border-gray-700 hover:border-amber-600 text-gray-600 hover:text-amber-500 rounded-xl py-3 text-sm font-mono tracking-wider transition-all">
            + Add Another Role
          </button>
        </div>

        {/* ── SECTION 3: Education ── */}
        <div id="section-3" className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <SectionHead icon="🎓" title="Education"
            sub="Include your highest qualification first. Add certifications in the Skills section below." />

          <div className="space-y-4">
            {profile.education.map((edu, eduIdx) => (
              <div key={edu.id} className="bg-gray-950 border border-gray-800 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-amber-500 tracking-widest uppercase">
                    Qualification {eduIdx + 1}
                  </span>
                  {profile.education.length > 1 && (
                    <button onClick={() => removeEdu(edu.id)}
                      className="text-xs text-gray-600 hover:text-red-400 transition-colors font-mono">
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className={labelCls}>
                      Degree / Qualification
                      <Tip text="Write the full name e.g. 'Bachelor of Commerce (Finance)' not just 'BCom'." />
                    </label>
                    <input className={inputCls} placeholder="e.g. Bachelor of Commerce (Finance)"
                      value={edu.degree} onChange={e => updateEdu(edu.id, "degree", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Institution</label>
                    <input className={inputCls} placeholder="e.g. University of Nairobi"
                      value={edu.institution} onChange={e => updateEdu(edu.id, "institution", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Year Completed</label>
                    <input className={inputCls} placeholder="e.g. 2018"
                      value={edu.year} onChange={e => updateEdu(edu.id, "year", e.target.value)} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>
                      Grade / Classification
                      <Tip text="Only include if strong e.g. 'First Class Honours', 'GPA 3.8', 'Distinction'. Leave blank if average." />
                      <span className="text-gray-700 ml-1 normal-case tracking-normal font-sans text-[11px]">(optional)</span>
                    </label>
                    <input className={inputCls} placeholder="e.g. Second Class Honours (Upper)"
                      value={edu.grade} onChange={e => updateEdu(edu.id, "grade", e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button onClick={addEdu}
            className="mt-4 w-full border border-dashed border-gray-700 hover:border-amber-600 text-gray-600 hover:text-amber-500 rounded-xl py-3 text-sm font-mono tracking-wider transition-all">
            + Add Another Qualification
          </button>
        </div>

        {/* ── SECTION 4: Skills ── */}
        <div id="section-4" className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <SectionHead icon="⚡" title="Skills & Extras"
            sub="Be specific. 'Microsoft Office' is weak. 'Advanced Excel (PivotTables, VLOOKUP, Power Query)' is strong." />

          <div className="space-y-4">
            <div>
              <label className={labelCls}>
                Technical / Hard Skills
                <Tip text="Comma-separated list. Include software, tools, methodologies. Be specific: 'SAP FI/CO', 'Python (pandas)', 'Financial Modelling', not just 'computers'." />
              </label>
              <textarea className={`${inputCls} resize-y`} rows={3}
                placeholder="e.g. SAP FI/CO, Advanced Excel (PivotTables, Power Query), Financial Modelling, Budget Forecasting, QuickBooks, Power BI, IFRS Compliance"
                value={profile.technicalSkills} onChange={set("technicalSkills")} />
              <p className="text-xs text-gray-600 mt-1">
                {profile.technicalSkills.split(",").filter(s => s.trim()).length} skills listed
                {profile.technicalSkills.split(",").filter(s => s.trim()).length < 5 &&
                  " — aim for at least 5"}
              </p>
            </div>
            <div>
              <label className={labelCls}>
                Soft Skills
                <Tip text="Keep to 4–6. Only list ones you can back up with examples from your work experience above. Avoid clichés like 'hardworking' and 'team player'." />
              </label>
              <input className={inputCls}
                placeholder="e.g. Cross-functional collaboration, Stakeholder reporting, Team mentorship, Analytical thinking"
                value={profile.softSkills} onChange={set("softSkills")} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>
                  Languages
                  <Tip text="Format: Language (Proficiency). e.g. English (Native), Swahili (Native), French (Intermediate), Arabic (Basic)" />
                </label>
                <input className={inputCls}
                  placeholder="e.g. English (Native), Swahili (Native)"
                  value={profile.languages} onChange={set("languages")} />
              </div>
              <div>
                <label className={labelCls}>
                  Certifications
                  <Tip text="Include professional certs, online courses (only reputable ones like Coursera, edX, Google, AWS), and licences. Add the year if recent." />
                </label>
                <input className={inputCls}
                  placeholder="e.g. CPA Part II (2021), Google Data Analytics (2023)"
                  value={profile.certifications} onChange={set("certifications")} />
              </div>
            </div>
          </div>
        </div>

        {/* Save CTA */}
        <div className="bg-gradient-to-r from-amber-500/5 to-transparent border border-amber-600/20 rounded-2xl p-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm font-semibold text-white">Ready to save your vault?</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Profile is <span style={{ color: strengthColor }}>{strengthLbl} ({score}%)</span>.
              {score < 85 && " Complete the tips above for best results."}
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button onClick={handleSave}
              className={`px-7 py-3 rounded-xl text-sm font-semibold transition-all
                ${saved
                  ? "bg-green-500/20 border border-green-500/30 text-green-400"
                  : "bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20"}`}>
              {saved ? "✓ Vault Saved!" : "Save My Vault"}
            </button>
            {score >= 60 && (
              <a href="/generate-cv"
                className="px-7 py-3 rounded-xl text-sm font-semibold border border-gray-700 text-gray-300 hover:border-amber-600 hover:text-amber-400 transition-all">
                Apply for a Job →
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
