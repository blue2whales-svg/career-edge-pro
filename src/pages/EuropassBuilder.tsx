import { useProPlan } from "@/hooks/useProPlan";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PageLayout from "@/components/PageLayout";
import {
  Plus, Trash2, Loader2, Download, Sparkles, User,
  Briefcase, GraduationCap, Globe, Award, Heart, Users, FileText,
} from "lucide-react";
import { toast } from "sonner";

const CEFR = ["A1", "A2", "B1", "B2", "C1", "C2"];
const TABS = [
  { id: "personal", label: "Personal", icon: User },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "skills", label: "Skills & Languages", icon: Globe },
  { id: "extras", label: "Extras", icon: Heart },
];

const emptyExp = () => ({ jobTitle: "", employer: "", startDate: "", endDate: "", location: "", duties: "", achievements: "" });
const emptyEdu = () => ({ qualification: "", institution: "", field: "", startDate: "", endDate: "", location: "" });
const emptyLang = () => ({ name: "", listening: "B1", reading: "B1", spokenProduction: "B1", spokenInteraction: "B1", writing: "B1" });
const emptyCert = () => ({ title: "", institution: "", date: "", description: "", mode: "Classroom" });
const emptyHobby = () => ({ title: "", description: "" });
const emptyVol = () => ({ title: "", description: "", startDate: "", endDate: "", location: "" });

export default function EuropassBuilder() {
  const { isPro, loading } = useProPlan();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [accessChecked, setAccessChecked] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      const email = searchParams.get("email");
      const orderId = searchParams.get("orderId");

      if (!email || !orderId) {
        navigate("/order?reason=europass-required");
        return;
      }

      const { data, error } = await supabase
        .from("orders")
        .select("id")
        .eq("email", email)
        .eq("id", orderId)
        .eq("status", "paid")
        .maybeSingle();

      if (error || !data) {
        navigate("/order?reason=europass-required");
      } else {
        setHasAccess(true);
      }

      setAccessChecked(true);
    };

    checkAccess();
  }, []);

  if (!accessChecked) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-screen bg-[#0a0a0f]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Verifying your access...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!hasAccess) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1120] text-white px-6">
      <div className="max-w-md w-full text-center bg-[#111827] p-8 rounded-2xl shadow-xl border border-gray-800">
        
        <div className="text-4xl mb-4">🔒</div>

        <h2 className="text-2xl font-bold mb-2">
          Europass CV is a Pro Feature
        </h2>

        <p className="text-gray-400 mb-6">
          Upgrade to Pro to unlock this feature.
        </p>

        <button
          onClick={() => window.location.href = "/pro"}
          className="w-full bg-[#C9A84C] text-black font-semibold py-3 rounded-lg"
        >
          Upgrade to Pro
        </button>

      </div>
    </div>
  );
}

  return <EuropassBuilderInner />;
}

function EuropassBuilderInner() {
  const [activeTab, setActiveTab] = useState("personal");
  const [mode, setMode] = useState<"cv" | "cover-letter">("cv");
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");

  const [profile, setProfile] = useState({
    firstName: "", lastName: "", passport: "", dob: "", placeOfBirth: "",
    nationality: "", gender: "", phone: "", email: "", address: "", city: "", country: "",
    aboutMe: "", targetRole: "", targetCompany: "",
    motherTongue: "", skills: "",
    education: [emptyEdu()],
    experience: [emptyExp()],
    languages: [emptyLang()],
    certifications: [emptyCert()],
    hobbies: [emptyHobby()],
    volunteering: [emptyVol()],
  });

  const update = (key: string, val: any) => setProfile(p => ({ ...p, [key]: val }));

  const updateArr = (key: string, index: number, field: string, val: string) => {
    setProfile(p => {
      const arr = [...(p as any)[key]];
      arr[index] = { ...arr[index], [field]: val };
      return { ...p, [key]: arr };
    });
  };

  const addArr = (key: string, empty: any) => setProfile(p => ({ ...p, [key]: [...(p as any)[key], empty] }));
  const removeArr = (key: string, index: number) => setProfile(p => ({ ...p, [key]: (p as any)[key].filter((_: any, i: number) => i !== index) }));

  const generate = async () => {
    if (!profile.firstName || !profile.lastName) {
      toast.error("Please enter at least a first and last name");
      return;
    }
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-europass", {
        body: { profile, mode },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setGeneratedContent(data.content || "");
      toast.success(`Europass ${mode === "cv" ? "CV" : "Cover Letter"} generated!`);
    } catch (e: any) {
      toast.error(e.message || "Generation failed");
    }
    setGenerating(false);
  };

  const downloadTxt = () => {
    const blob = new Blob([generatedContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${profile.firstName}_${profile.lastName}_Europass_${mode === "cv" ? "CV" : "CoverLetter"}.txt`;
    a.click();
  };

  const printPdf = () => {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(
      "<html><head><title>Europass</title>" +
      "<style>" +
      "body { font-family: Arial, sans-serif; font-size: 11px; color: #000; margin: 20mm; line-height: 1.5; }" +
      ".header { display: flex; justify-content: space-between; border-bottom: 2px solid #003399; padding-bottom: 10px; margin-bottom: 15px; }" +
      ".name { font-size: 20px; font-weight: bold; }" +
      "pre { white-space: pre-wrap; font-family: Arial, sans-serif; font-size: 11px; }" +
      "@media print { body { margin: 15mm; } }" +
      "</style></head><body>" +
      "<div class='header'>" +
      "<div><div class='name'>" + profile.firstName.toUpperCase() + " " + profile.lastName.toUpperCase() + "</div>" +
      "<div style='font-size:10px;color:#555;margin-top:5px'>" + profile.email + " | " + profile.phone + " | " + profile.city + ", " + profile.country + "</div></div>" +
      "<div style='color:#003399;font-weight:bold;font-size:14px'>europass</div>" +
      "</div>" +
      "<pre>" + generatedContent + "</pre>" +
      "</body></html>"
    );
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);
  };

  const InputField = ({ label, value, onChange, placeholder = "" }: any) => (
    <div>
      <label className="text-xs text-gray-400 mb-1 block">{label}</label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-gray-900 border-gray-700 text-white text-sm focus:border-blue-500 h-9"
      />
    </div>
  );

  const TextareaField = ({ label, value, onChange, rows = 3, placeholder = "" }: any) => (
    <div>
      <label className="text-xs text-gray-400 mb-1 block">{label}</label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="bg-gray-900 border-gray-700 text-white text-sm focus:border-blue-500"
      />
    </div>
  );

  return (
    <PageLayout>
      <div className="min-h-screen bg-[#0a0a0f] text-white">
        <div className="border-b border-white/10 bg-[#0a0a0f]/95 backdrop-blur sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                <span className="text-blue-400">Europass</span> Builder
              </h1>
              <p className="text-xs text-gray-500">Official EU format • AI-powered</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMode("cv")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${mode === "cv" ? "bg-blue-600 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}
              >
                CV
              </button>
              <button
                onClick={() => setMode("cover-letter")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${mode === "cover-letter" ? "bg-blue-600 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}
              >
                Cover Letter
              </button>
              <Button
                onClick={generate}
                disabled={generating}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 px-4 font-semibold"
              >
                {generating
                  ? <><Loader2 className="w-3 h-3 animate-spin mr-1" />Generating...</>
                  : <><Sparkles className="w-3 h-3 mr-1" />Generate</>}
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6 grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex gap-1 overflow-x-auto pb-1">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${activeTab === tab.id ? "bg-blue-600 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}
                >
                  <tab.icon className="w-3 h-3" />{tab.label}
                </button>
              ))}
            </div>

            {activeTab === "personal" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="First Name *" value={profile.firstName} onChange={(v: string) => update("firstName", v)} placeholder="Timothy" />
                  <InputField label="Last Name *" value={profile.lastName} onChange={(v: string) => update("lastName", v)} placeholder="Mathenge" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Passport/ID" value={profile.passport} onChange={(v: string) => update("passport", v)} placeholder="AK0069033" />
                  <InputField label="Date of Birth" value={profile.dob} onChange={(v: string) => update("dob", v)} placeholder="12/05/1982" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Place of Birth" value={profile.placeOfBirth} onChange={(v: string) => update("placeOfBirth", v)} placeholder="Laikipia, Kenya" />
                  <InputField label="Nationality" value={profile.nationality} onChange={(v: string) => update("nationality", v)} placeholder="Kenyan" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Gender" value={profile.gender} onChange={(v: string) => update("gender", v)} placeholder="Male" />
                  <InputField label="Phone" value={profile.phone} onChange={(v: string) => update("phone", v)} placeholder="+254 717 706007" />
                </div>
                <InputField label="Email" value={profile.email} onChange={(v: string) => update("email", v)} placeholder="timkariz1982@gmail.com" />
                <div className="grid grid-cols-3 gap-3">
                  <InputField label="Address" value={profile.address} onChange={(v: string) => update("address", v)} placeholder="00100" />
                  <InputField label="City" value={profile.city} onChange={(v: string) => update("city", v)} placeholder="Nairobi" />
                  <InputField label="Country" value={profile.country} onChange={(v: string) => update("country", v)} placeholder="Kenya" />
                </div>
                <TextareaField label="About Me" value={profile.aboutMe} onChange={(v: string) => update("aboutMe", v)} rows={4} placeholder="Disciplined professional with 15+ years experience..." />
                {mode === "cover-letter" && (
                  <div className="grid grid-cols-2 gap-3">
                    <InputField label="Target Role" value={profile.targetRole} onChange={(v: string) => update("targetRole", v)} placeholder="Kitchen Porter" />
                    <InputField label="Target Company" value={profile.targetCompany} onChange={(v: string) => update("targetCompany", v)} placeholder="Hotel Meridian" />
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "education" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {profile.education.map((edu, i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-4 space-y-3 border border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-blue-400">Education #{i + 1}</span>
                      {profile.education.length > 1 && (
                        <button onClick={() => removeArr("education", i)} className="text-red-400 hover:text-red-300">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <InputField label="Qualification" value={edu.qualification} onChange={(v: string) => updateArr("education", i, "qualification", v)} placeholder="Diploma in Business Management" />
                    <InputField label="Institution" value={edu.institution} onChange={(v: string) => updateArr("education", i, "institution", v)} placeholder="Kenya Institute of Management (KIM)" />
                    <InputField label="Field of Study" value={edu.field} onChange={(v: string) => updateArr("education", i, "field", v)} placeholder="Management and administration" />
                    <div className="grid grid-cols-3 gap-2">
                      <InputField label="Start Date" value={edu.startDate} onChange={(v: string) => updateArr("education", i, "startDate", v)} placeholder="04/02/2006" />
                      <InputField label="End Date" value={edu.endDate} onChange={(v: string) => updateArr("education", i, "endDate", v)} placeholder="24/03/2008" />
                      <InputField label="Location" value={edu.location} onChange={(v: string) => updateArr("education", i, "location", v)} placeholder="Nairobi, Kenya" />
                    </div>
                  </div>
                ))}
                <button onClick={() => addArr("education", emptyEdu())} className="w-full py-2 border border-dashed border-white/20 rounded-xl text-xs text-gray-400 hover:border-blue-500 hover:text-blue-400 flex items-center justify-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Add Education
                </button>
              </motion.div>
            )}

            {activeTab === "experience" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {profile.experience.map((exp, i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-4 space-y-3 border border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-blue-400">Experience #{i + 1}</span>
                      {profile.experience.length > 1 && (
                        <button onClick={() => removeArr("experience", i)} className="text-red-400 hover:text-red-300">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <InputField label="Job Title" value={exp.jobTitle} onChange={(v: string) => updateArr("experience", i, "jobTitle", v)} placeholder="Kitchen Porter" />
                      <InputField label="Employer" value={exp.employer} onChange={(v: string) => updateArr("experience", i, "employer", v)} placeholder="Marble Ark Hotel" />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <InputField label="Start Date" value={exp.startDate} onChange={(v: string) => updateArr("experience", i, "startDate", v)} placeholder="09/06/2021" />
                      <InputField label="End Date" value={exp.endDate} onChange={(v: string) => updateArr("experience", i, "endDate", v)} placeholder="06/12/2025" />
                      <InputField label="Location" value={exp.location} onChange={(v: string) => updateArr("experience", i, "location", v)} placeholder="Laikipia, Kenya" />
                    </div>
                    <TextareaField label="Duties" value={exp.duties} onChange={(v: string) => updateArr("experience", i, "duties", v)} rows={3} placeholder="• Managed high-volume wash-up station" />
                    <TextareaField label="Key Achievements" value={exp.achievements} onChange={(v: string) => updateArr("experience", i, "achievements", v)} rows={2} placeholder="• Processed 300+ dishes per shift with zero delays" />
                  </div>
                ))}
                <button onClick={() => addArr("experience", emptyExp())} className="w-full py-2 border border-dashed border-white/20 rounded-xl text-xs text-gray-400 hover:border-blue-500 hover:text-blue-400 flex items-center justify-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Add Experience
                </button>
              </motion.div>
            )}

            {activeTab === "skills" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <TextareaField label="Skills (pipe-separated)" value={profile.skills} onChange={(v: string) => update("skills", v)} rows={3} placeholder="Food Safety Compliance | Industrial Dishwashing | FIFO Stock Management" />
                <InputField label="Mother Tongue(s)" value={profile.motherTongue} onChange={(v: string) => update("motherTongue", v)} placeholder="KIKUYU" />
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-blue-400">Other Languages (CEFR)</p>
                  {profile.languages.map((lang, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-3 space-y-2 border border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <InputField label="Language" value={lang.name} onChange={(v: string) => updateArr("languages", i, "name", v)} placeholder="English" />
                        </div>
                        {profile.languages.length > 1 && (
                          <button onClick={() => removeArr("languages", i)} className="text-red-400 mt-4">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-5 gap-1">
                        {["listening", "reading", "spokenProduction", "spokenInteraction", "writing"].map(skill => (
                          <div key={skill}>
                            <label className="text-[10px] text-gray-500 block mb-0.5 capitalize">
                              {skill.replace(/([A-Z])/g, " $1").trim()}
                            </label>
                            <select
                              value={(lang as any)[skill]}
                              onChange={e => updateArr("languages", i, skill, e.target.value)}
                              className="w-full bg-gray-900 border border-gray-700 text-white text-xs rounded-md px-1 py-1"
                            >
                              {CEFR.map(l => <option key={l}>{l}</option>)}
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button onClick={() => addArr("languages", emptyLang())} className="w-full py-2 border border-dashed border-white/20 rounded-xl text-xs text-gray-400 hover:border-blue-500 hover:text-blue-400 flex items-center justify-center gap-1">
                    <Plus className="w-3.5 h-3.5" /> Add Language
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === "extras" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                <div>
                  <p className="text-xs font-semibold text-blue-400 mb-2">Certifications</p>
                  {profile.certifications.map((cert, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-3 space-y-2 border border-white/10 mb-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400">Cert #{i + 1}</span>
                        {profile.certifications.length > 1 && (
                          <button onClick={() => removeArr("certifications", i)} className="text-red-400">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <InputField label="Title" value={cert.title} onChange={(v: string) => updateArr("certifications", i, "title", v)} placeholder="Advanced Certificate in Business Management" />
                        <InputField label="Institution" value={cert.institution} onChange={(v: string) => updateArr("certifications", i, "institution", v)} placeholder="Kenya Institute of Management" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <InputField label="Date" value={cert.date} onChange={(v: string) => updateArr("certifications", i, "date", v)} placeholder="21/03/2007" />
                        <InputField label="Mode" value={cert.mode} onChange={(v: string) => updateArr("certifications", i, "mode", v)} placeholder="Hybrid" />
                      </div>
                      <TextareaField label="Description" value={cert.description} onChange={(v: string) => updateArr("certifications", i, "description", v)} rows={2} placeholder="Completed comprehensive training in business administration..." />
                    </div>
                  ))}
                  <button onClick={() => addArr("certifications", emptyCert())} className="w-full py-1.5 border border-dashed border-white/20 rounded-xl text-xs text-gray-400 hover:border-blue-500 hover:text-blue-400 flex items-center justify-center gap-1">
                    <Plus className="w-3.5 h-3.5" /> Add Certification
                  </button>
                </div>

                <div>
                  <p className="text-xs font-semibold text-blue-400 mb-2">Hobbies & Interests</p>
                  {profile.hobbies.map((h, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-3 space-y-2 border border-white/10 mb-3">
                      <div className="flex items-start gap-2">
                        <div className="flex-1">
                          <InputField label="Title" value={h.title} onChange={(v: string) => updateArr("hobbies", i, "title", v)} placeholder="Cooking and Recipe Experimentation" />
                        </div>
                        {profile.hobbies.length > 1 && (
                          <button onClick={() => removeArr("hobbies", i)} className="text-red-400 mt-4">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <TextareaField label="Description" value={h.description} onChange={(v: string) => updateArr("hobbies", i, "description", v)} rows={2} placeholder="Enjoys exploring traditional Kenyan recipes..." />
                    </div>
                  ))}
                  <button onClick={() => addArr("hobbies", emptyHobby())} className="w-full py-1.5 border border-dashed border-white/20 rounded-xl text-xs text-gray-400 hover:border-blue-500 hover:text-blue-400 flex items-center justify-center gap-1">
                    <Plus className="w-3.5 h-3.5" /> Add Hobby
                  </button>
                </div>

                <div>
                  <p className="text-xs font-semibold text-blue-400 mb-2">Volunteering</p>
                  {profile.volunteering.map((v, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-3 space-y-2 border border-white/10 mb-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400">Vol #{i + 1}</span>
                        {profile.volunteering.length > 1 && (
                          <button onClick={() => removeArr("volunteering", i)} className="text-red-400">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <InputField label="Title" value={v.title} onChange={(vv: string) => updateArr("volunteering", i, "title", vv)} placeholder="Volunteering Experience" />
                      <div className="grid grid-cols-3 gap-2">
                        <InputField label="Start Date" value={v.startDate} onChange={(vv: string) => updateArr("volunteering", i, "startDate", vv)} placeholder="08/05/2007" />
                        <InputField label="End Date" value={v.endDate} onChange={(vv: string) => updateArr("volunteering", i, "endDate", vv)} placeholder="07/06/2007" />
                        <InputField label="Location" value={v.location} onChange={(vv: string) => updateArr("volunteering", i, "location", vv)} placeholder="Nairobi" />
                      </div>
                      <TextareaField label="Description" value={v.description} onChange={(vv: string) => updateArr("volunteering", i, "description", vv)} rows={2} placeholder="Participated in KIM community service curriculum..." />
                    </div>
                  ))}
                  <button onClick={() => addArr("volunteering", emptyVol())} className="w-full py-1.5 border border-dashed border-white/20 rounded-xl text-xs text-gray-400 hover:border-blue-500 hover:text-blue-400 flex items-center justify-center gap-1">
                    <Plus className="w-3.5 h-3.5" /> Add Volunteering
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* RIGHT — LIVE PREVIEW */}
          <div className="lg:sticky lg:top-20 lg:h-[calc(100vh-5rem)] lg:overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden min-h-[600px]">
              <div className="px-8 pt-6 pb-4 border-b-2 border-[#003399]">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-black tracking-wide">
                      {profile.firstName.toUpperCase() || "FIRST"} {profile.lastName.toUpperCase() || "LAST"}
                    </h2>
                    <div className="mt-2 text-[11px] text-gray-700 space-y-0.5">
                      {profile.passport && <span className="mr-3"><strong>Passport:</strong> {profile.passport}</span>}
                      {profile.dob && <span className="mr-3"><strong>Date of birth:</strong> {profile.dob}</span>}
                      {profile.placeOfBirth && <span><strong>Place of birth:</strong> {profile.placeOfBirth}</span>}
                      <div>
                        {profile.nationality && <span className="mr-3"><strong>Nationality:</strong> {profile.nationality}</span>}
                        {profile.gender && <span className="mr-3"><strong>Gender:</strong> {profile.gender}</span>}
                        {profile.phone && <span><strong>Phone:</strong> {profile.phone}</span>}
                      </div>
                      {profile.email && <div><strong>Email:</strong> <span className="text-blue-600">{profile.email}</span></div>}
                      {profile.address && <div><strong>Address:</strong> {profile.address}, {profile.city}, {profile.country}</div>}
                    </div>
                  </div>
                  <div className="text-[#003399] text-xs font-bold tracking-wider">europass</div>
                </div>
              </div>

              <div className="px-8 py-4">
                {generatedContent ? (
                  <div className="text-[11px] text-gray-800 leading-relaxed whitespace-pre-wrap font-sans">
                    {generatedContent}
                  </div>
                ) : (
                  <div className="space-y-4 py-4">
                    {["ABOUT ME", "EDUCATION AND TRAINING", "WORK EXPERIENCE", "SKILLS", "LANGUAGE SKILLS", "CERTIFICATIONS", "HOBBIES AND INTERESTS", "VOLUNTEERING"].map(section => (
                      <div key={section}>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 rounded-full bg-[#003399]" />
                          <div className="text-[10px] font-bold uppercase tracking-wider text-[#003399] border-b border-gray-200 flex-1 pb-0.5">{section}</div>
                        </div>
                        <div className="h-3 bg-gray-100 rounded w-3/4 mb-1" />
                        <div className="h-3 bg-gray-100 rounded w-1/2" />
                      </div>
                    ))}
                    <div className="text-center text-xs text-gray-400 mt-6 py-4">
                      Fill in the form and click <strong>Generate</strong> to see your Europass CV
                    </div>
                  </div>
                )}
              </div>
            </div>

            {generatedContent && (
              <div className="flex gap-2 mt-3">
                <Button onClick={printPdf} className="flex-1 bg-[#003399] hover:bg-[#002277] text-white text-xs h-9">
                  <Download className="w-3.5 h-3.5 mr-1" /> Download PDF
                </Button>
                <Button onClick={downloadTxt} variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10 text-xs h-9">
                  <FileText className="w-3.5 h-3.5 mr-1" /> Download TXT
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
