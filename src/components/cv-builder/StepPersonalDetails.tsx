import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CVData } from "./types";

const COUNTIES = [
  "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo-Marakwet", "Embu", "Garissa",
  "Homa Bay", "Isiolo", "Kajiado", "Kakamega", "Kericho", "Kiambu", "Kilifi",
  "Kirinyaga", "Kisii", "Kisumu", "Kitui", "Kwale", "Laikipia", "Lamu", "Machakos",
  "Makueni", "Mandera", "Marsabit", "Meru", "Migori", "Mombasa", "Murang'a",
  "Nairobi", "Nakuru", "Nandi", "Narok", "Nyamira", "Nyandarua", "Nyeri",
  "Samburu", "Siaya", "Taita-Taveta", "Tana River", "Tharaka-Nithi", "Trans-Nzoia",
  "Turkana", "Uasin Gishu", "Vihiga", "Wajir", "West Pokot",
];

interface Props {
  data: CVData;
  onChange: (updates: Partial<CVData>) => void;
}

export default function StepPersonalDetails({ data, onChange }: Props) {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-serif font-bold text-foreground">Personal Details</h2>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Full Name *</Label>
          <Input value={data.fullName} onChange={(e) => onChange({ fullName: e.target.value })} placeholder="e.g. James Mwangi" />
        </div>
        <div className="space-y-1.5">
          <Label>Professional Title</Label>
          <Input value={data.professionalTitle} onChange={(e) => onChange({ professionalTitle: e.target.value })} placeholder="e.g. Senior Software Engineer" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Phone *</Label>
          <Input value={data.phone} onChange={(e) => onChange({ phone: e.target.value })} placeholder="+254 7XX XXX XXX" />
        </div>
        <div className="space-y-1.5">
          <Label>Email *</Label>
          <Input type="email" value={data.email} onChange={(e) => onChange({ email: e.target.value })} placeholder="james@email.com" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>LinkedIn URL</Label>
          <Input value={data.linkedinUrl} onChange={(e) => onChange({ linkedinUrl: e.target.value })} placeholder="linkedin.com/in/your-profile" />
        </div>
        <div className="space-y-1.5">
          <Label>Location</Label>
          <select
            value={data.location}
            onChange={(e) => onChange({ location: e.target.value })}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Select county...</option>
            {COUNTIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
            <option value="International">International</option>
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Nationality</Label>
          <Input value={data.nationality} onChange={(e) => onChange({ nationality: e.target.value })} />
        </div>
        <div className="space-y-1.5 flex items-center justify-between pt-6">
          <Label>Open to Relocation</Label>
          <Switch checked={data.openToRelocation} onCheckedChange={(v) => onChange({ openToRelocation: v })} />
        </div>
      </div>

      <div className="border-t border-border pt-4 mt-4">
        <p className="text-xs text-muted-foreground mb-3">Optional fields (toggle as needed for your target market)</p>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Date of Birth</Label>
            <Switch checked={data.showDOB} onCheckedChange={(v) => onChange({ showDOB: v })} />
          </div>
          {data.showDOB && (
            <Input type="date" value={data.dateOfBirth} onChange={(e) => onChange({ dateOfBirth: e.target.value })} />
          )}

          <div className="flex items-center justify-between">
            <Label className="text-sm">Marital Status</Label>
            <Switch checked={data.showMaritalStatus} onCheckedChange={(v) => onChange({ showMaritalStatus: v })} />
          </div>
          {data.showMaritalStatus && (
            <select
              value={data.maritalStatus}
              onChange={(e) => onChange({ maritalStatus: e.target.value })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select...</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
          )}

          <div className="flex items-center justify-between">
            <Label className="text-sm">Religion</Label>
            <Switch checked={data.showReligion} onCheckedChange={(v) => onChange({ showReligion: v })} />
          </div>
          {data.showReligion && (
            <Input value={data.religion} onChange={(e) => onChange({ religion: e.target.value })} placeholder="e.g. Christian" />
          )}

          <div className="flex items-center justify-between">
            <Label className="text-sm">Passport Number</Label>
            <Switch checked={data.showPassport} onCheckedChange={(v) => onChange({ showPassport: v })} />
          </div>
          {data.showPassport && (
            <Input value={data.passportNumber} onChange={(e) => onChange({ passportNumber: e.target.value })} placeholder="Passport number" />
          )}
        </div>
      </div>
    </div>
  );
}
