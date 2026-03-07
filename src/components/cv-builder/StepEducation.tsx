import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { CVData, Education } from "./types";

interface Props {
  data: CVData;
  onChange: (updates: Partial<CVData>) => void;
}

const QUALIFICATIONS = [
  "KCSE", "KCPE", "Certificate", "Diploma", "Higher Diploma",
  "Bachelor's Degree", "Postgraduate Diploma", "Master's Degree", "PhD", "Professional Certificate",
];

const INSTITUTIONS = [
  "University of Nairobi (UoN)", "Jomo Kenyatta University (JKUAT)", "Kenyatta University (KU)",
  "Strathmore University", "Mt. Kenya University (MKU)", "Daystar University", "USIU-Africa",
  "KCA University", "Kenya Coast National Polytechnic", "KMTC",
  "Moi University", "Egerton University", "Maseno University", "Multimedia University",
  "Cooperative University", "Technical University of Kenya", "Technical University of Mombasa",
];

function createEmptyEdu(): Education {
  return { id: crypto.randomUUID(), institution: "", qualification: "", fieldOfStudy: "", graduationYear: "", grade: "" };
}

export default function StepEducation({ data, onChange }: Props) {
  const items = data.education;

  const update = (id: string, updates: Partial<Education>) => {
    onChange({ education: items.map((e) => (e.id === id ? { ...e, ...updates } : e)) });
  };

  const add = () => onChange({ education: [...items, createEmptyEdu()] });
  const remove = (id: string) => onChange({ education: items.filter((e) => e.id !== id) });

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-serif font-bold text-foreground">Education</h2>

      {items.length === 0 && (
        <div className="text-center py-8 border border-dashed border-border rounded-xl">
          <p className="text-muted-foreground mb-3">No education added yet</p>
          <Button onClick={add} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" /> Add Education
          </Button>
        </div>
      )}

      {items.map((edu, index) => (
        <div key={edu.id} className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted-foreground">Qualification {index + 1}</span>
            <Button onClick={() => remove(edu.id)} variant="ghost" size="sm" className="text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Institution *</Label>
              <Input
                list="institutions-list"
                value={edu.institution}
                onChange={(e) => update(edu.id, { institution: e.target.value })}
                placeholder="Start typing..."
              />
              <datalist id="institutions-list">
                {INSTITUTIONS.map((i) => <option key={i} value={i} />)}
              </datalist>
            </div>
            <div className="space-y-1.5">
              <Label>Qualification *</Label>
              <select
                value={edu.qualification}
                onChange={(e) => update(edu.id, { qualification: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select...</option>
                {QUALIFICATIONS.map((q) => <option key={q} value={q}>{q}</option>)}
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Field of Study</Label>
              <Input value={edu.fieldOfStudy} onChange={(e) => update(edu.id, { fieldOfStudy: e.target.value })} placeholder="e.g. Computer Science" />
            </div>
            <div className="space-y-1.5">
              <Label>Graduation Year</Label>
              <Input value={edu.graduationYear} onChange={(e) => update(edu.id, { graduationYear: e.target.value })} placeholder="e.g. 2022" />
            </div>
            <div className="space-y-1.5">
              <Label>Grade / GPA</Label>
              <Input value={edu.grade} onChange={(e) => update(edu.id, { grade: e.target.value })} placeholder="e.g. First Class Honours" />
            </div>
          </div>
        </div>
      ))}

      {items.length > 0 && (
        <Button onClick={add} variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-1" /> Add Another Qualification
        </Button>
      )}
    </div>
  );
}
