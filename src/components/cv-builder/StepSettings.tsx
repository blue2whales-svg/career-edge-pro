import { Label } from "@/components/ui/label";
import { CVData } from "./types";

interface Props {
  data: CVData;
  onChange: (updates: Partial<CVData>) => void;
}

const FORMATS = [
  { id: "chronological", label: "Chronological", desc: "Most recent experience first — best for steady career progression" },
  { id: "functional", label: "Functional", desc: "Skills-focused — best for career changers or gaps" },
  { id: "combination", label: "Combination", desc: "Skills + chronological — best for experienced professionals" },
];

const MARKETS = [
  { id: "kenya", label: "🇰🇪 Kenya Local", desc: "Photo, DOB, marital status, nationality included" },
  { id: "gulf", label: "🇶🇦 Gulf (Qatar/UAE/Saudi)", desc: "Photo, DOB, religion, passport, nationality required" },
  { id: "uk-europe", label: "🇬🇧 UK / Europe", desc: "No photo, no DOB, no religion — anti-discrimination laws" },
  { id: "australia-canada", label: "🇦🇺 Australia / Canada", desc: "No personal details, LinkedIn, 2-page max" },
  { id: "usa", label: "🇺🇸 USA", desc: "No photo, 1-page preferred, called 'Resume'" },
];

export default function StepSettings({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-serif font-bold text-foreground">CV Settings</h2>

      <div className="space-y-3">
        <Label>CV Format</Label>
        <div className="space-y-2">
          {FORMATS.map((f) => (
            <button
              key={f.id}
              onClick={() => onChange({ cvFormat: f.id })}
              className={`w-full text-left rounded-xl border p-4 transition-all ${
                data.cvFormat === f.id ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/30"
              }`}
            >
              <span className="text-sm font-semibold">{f.label}</span>
              <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label>Target Market</Label>
        <p className="text-xs text-muted-foreground">This auto-adjusts which personal details appear on your CV.</p>
        <div className="space-y-2">
          {MARKETS.map((m) => (
            <button
              key={m.id}
              onClick={() => onChange({ targetMarket: m.id })}
              className={`w-full text-left rounded-xl border p-4 transition-all ${
                data.targetMarket === m.id ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/30"
              }`}
            >
              <span className="text-sm font-semibold">{m.label}</span>
              <p className="text-xs text-muted-foreground mt-0.5">{m.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
