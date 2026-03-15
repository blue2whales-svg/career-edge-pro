import { Label } from "@/components/ui/label";
import { Crown, Briefcase, GraduationCap, Award } from "lucide-react";
import { CVData, PRICING_TIERS } from "./types";

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
  { id: "kenya", label: "🇰🇪 Kenya", desc: "Photo, DOB, marital status, nationality, references included" },
  { id: "uae", label: "🇦🇪 UAE / Dubai", desc: "Photo, DOB, visa status, nationality — Gulf recruiter standards" },
  { id: "qatar", label: "🇶🇦 Qatar / Gulf", desc: "Structured format with personal details, religion, passport info" },
  { id: "europe", label: "🇪🇺 Europe", desc: "No photo, no DOB — privacy-first, Europass-compatible" },
  { id: "australia", label: "🇦🇺 Australia", desc: "Achievement-driven, no personal details, results-focused" },
  { id: "uk", label: "🇬🇧 United Kingdom", desc: "Concise, achievement-focused, max 2 pages, British English" },
  { id: "usa", label: "🇺🇸 United States", desc: "Metrics-driven resume, 1-2 pages, American English" },
  { id: "africa", label: "🌍 Africa (Pan-African)", desc: "References, multilingual skills, cross-border experience" },
];

const TIER_ICONS: Record<string, React.ElementType> = {
  "entry-level": GraduationCap,
  "mid-level": Briefcase,
  "senior": Award,
  "executive": Crown,
};

function formatKES(amount: number) {
  return `KES ${amount.toLocaleString()}`;
}

export default function StepSettings({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-serif font-bold text-foreground">CV Settings & Pricing</h2>

      {/* Experience Level / Pricing */}
      <div className="space-y-3">
        <Label>Your Experience Level</Label>
        <p className="text-xs text-muted-foreground">Pricing is based on your career level — executives get premium, tailored CVs.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {Object.entries(PRICING_TIERS).map(([id, tier]) => {
            const Icon = TIER_ICONS[id];
            const isSelected = data.experienceLevel === id;
            return (
              <button
                key={id}
                onClick={() => onChange({ experienceLevel: id })}
                className={`relative text-left rounded-xl border p-4 transition-all ${
                  isSelected ? "border-primary bg-primary/10 ring-1 ring-primary/30" : "border-border bg-card hover:border-primary/30"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${isSelected ? "bg-primary/20" : "bg-muted"}`}>
                    <Icon className={`h-4 w-4 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold block">{tier.label}</span>
                    <p className="text-xs text-muted-foreground">{tier.desc}</p>
                  </div>
                </div>
                <div className={`mt-2 text-right text-sm font-bold ${isSelected ? "text-primary" : "text-foreground"}`}>
                  {formatKES(tier.price)}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* CV Format */}
      <div className="space-y-3">
        <Label>CV Format</Label>
        <div className="space-y-2">
          {FORMATS.map((f) => (
            <button
              key={f.id}
              onClick={() => onChange({ cvFormat: f.id })}
              className={`w-full text-left rounded-xl border p-3 sm:p-4 transition-all ${
                data.cvFormat === f.id ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/30"
              }`}
            >
              <span className="text-sm font-semibold">{f.label}</span>
              <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Target Market */}
      <div className="space-y-3">
        <Label>Target Job Market</Label>
        <p className="text-xs text-muted-foreground">Your CV will be automatically adapted to match regional recruiter expectations.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {MARKETS.map((m) => (
            <button
              key={m.id}
              onClick={() => onChange({ targetMarket: m.id })}
              className={`text-left rounded-xl border p-3 sm:p-4 transition-all ${
                data.targetMarket === m.id ? "border-primary bg-primary/10 ring-1 ring-primary/30" : "border-border bg-card hover:border-primary/30"
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
