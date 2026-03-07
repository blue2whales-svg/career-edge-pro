import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { CVData } from "./types";

interface Props {
  data: CVData;
  onChange: (updates: Partial<CVData>) => void;
}

const MEMBERSHIPS = [
  "Law Society of Kenya (LSK)", "Institution of Engineers of Kenya (IEK)",
  "ICPAK", "Kenya Medical Practitioners & Dentists Council (KMPDC)",
  "Kenya Institute of Management (KIM)", "Marketing Society of Kenya (MSK)",
  "Institute of Human Resource Management (IHRM)", "Kenya Institute of Planners (KIP)",
];

export default function StepAdditional({ data, onChange }: Props) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ certs: true });

  const toggle = (key: string) => setOpenSections((p) => ({ ...p, [key]: !p[key] }));

  const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
    <div className="border border-border rounded-xl overflow-hidden">
      <button onClick={() => toggle(id)} className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
        <span className="text-sm font-semibold">{title}</span>
        {openSections[id] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {openSections[id] && <div className="p-4 pt-0 space-y-3">{children}</div>}
    </div>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-serif font-bold text-foreground">Additional Sections</h2>
      <p className="text-sm text-muted-foreground">All sections below are optional. Add what's relevant to your profile.</p>

      <Section id="certs" title="Certifications & Licenses">
        {data.certifications.map((cert, i) => (
          <div key={i} className="flex gap-2 items-end">
            <Input className="flex-1" value={cert.name} onChange={(e) => {
              const updated = [...data.certifications];
              updated[i] = { ...cert, name: e.target.value };
              onChange({ certifications: updated });
            }} placeholder="Certification name" />
            <Input className="w-32" value={cert.issuer} onChange={(e) => {
              const updated = [...data.certifications];
              updated[i] = { ...cert, issuer: e.target.value };
              onChange({ certifications: updated });
            }} placeholder="Issuer" />
            <Input className="w-20" value={cert.year} onChange={(e) => {
              const updated = [...data.certifications];
              updated[i] = { ...cert, year: e.target.value };
              onChange({ certifications: updated });
            }} placeholder="Year" />
            <Button variant="ghost" size="icon" className="text-destructive shrink-0" onClick={() =>
              onChange({ certifications: data.certifications.filter((_, idx) => idx !== i) })
            }><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() =>
          onChange({ certifications: [...data.certifications, { name: "", issuer: "", year: "" }] })
        }><Plus className="h-3 w-3 mr-1" /> Add Certification</Button>
      </Section>

      <Section id="memberships" title="Professional Memberships">
        <div className="flex flex-wrap gap-2">
          {MEMBERSHIPS.map((m) => (
            <button
              key={m}
              onClick={() => {
                const has = data.memberships.includes(m);
                onChange({ memberships: has ? data.memberships.filter((x) => x !== m) : [...data.memberships, m] });
              }}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                data.memberships.includes(m) ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/30"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </Section>

      <Section id="volunteer" title="Volunteer Experience">
        <Textarea value={data.volunteerExperience} onChange={(e) => onChange({ volunteerExperience: e.target.value })} rows={3} placeholder="Describe your volunteer work..." className="bg-background" />
      </Section>

      <Section id="hobbies" title="Hobbies & Interests">
        <Input value={data.hobbies} onChange={(e) => onChange({ hobbies: e.target.value })} placeholder="e.g. Marathon running, Photography, Community mentorship" />
      </Section>

      <Section id="driving" title="Driving License">
        <select value={data.drivingLicense} onChange={(e) => onChange({ drivingLicense: e.target.value })}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
          <option value="">None</option>
          <option value="Class A">Class A (Motorcycle)</option>
          <option value="Class B">Class B (Light Vehicle)</option>
          <option value="Class C">Class C (Heavy Vehicle)</option>
          <option value="Class D">Class D (Articulated)</option>
        </select>
      </Section>

      <Section id="references" title="References">
        <Textarea value={data.references} onChange={(e) => onChange({ references: e.target.value })} rows={2} placeholder="Available upon request" className="bg-background" />
      </Section>
    </div>
  );
}
