import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { CVData } from "./types";

interface Props {
  data: CVData;
  onChange: (updates: Partial<CVData>) => void;
}

const SUGGESTED_HARD_SKILLS = [
  "Microsoft Office", "Data Analysis", "Project Management", "Digital Marketing",
  "Financial Reporting", "M-Pesa Integration", "Python", "SQL", "Customer Relationship Management",
  "Supply Chain Management", "AutoCAD", "Social Media Marketing", "Accounting (QuickBooks)",
];

const SUGGESTED_SOFT_SKILLS = [
  "Leadership", "Communication", "Teamwork", "Problem Solving", "Time Management",
  "Adaptability", "Critical Thinking", "Negotiation", "Attention to Detail", "Conflict Resolution",
];

function TagInput({ label, tags, suggestions, onAdd, onRemove }: {
  label: string;
  tags: string[];
  suggestions: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
}) {
  const [input, setInput] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      if (!tags.includes(input.trim())) onAdd(input.trim());
      setInput("");
    }
  };

  const availableSuggestions = suggestions.filter((s) => !tags.includes(s));

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-1 pr-1">
            {tag}
            <button onClick={() => onRemove(tag)} className="hover:text-destructive">
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a skill and press Enter..."
      />
      {availableSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          <span className="text-xs text-muted-foreground mr-1">Suggestions:</span>
          {availableSuggestions.slice(0, 6).map((s) => (
            <button
              key={s}
              onClick={() => onAdd(s)}
              className="text-xs px-2 py-0.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function StepSkills({ data, onChange }: Props) {
  const totalSkills = data.hardSkills.length + data.softSkills.length;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-serif font-bold text-foreground">Skills</h2>

      {totalSkills < 5 && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3">
          <p className="text-sm text-amber-400">⚠️ ATS Warning: Add at least 5 skills to improve your ATS score.</p>
        </div>
      )}

      <TagInput
        label="Hard Skills (Technical)"
        tags={data.hardSkills}
        suggestions={SUGGESTED_HARD_SKILLS}
        onAdd={(s) => onChange({ hardSkills: [...data.hardSkills, s] })}
        onRemove={(s) => onChange({ hardSkills: data.hardSkills.filter((t) => t !== s) })}
      />

      <TagInput
        label="Soft Skills"
        tags={data.softSkills}
        suggestions={SUGGESTED_SOFT_SKILLS}
        onAdd={(s) => onChange({ softSkills: [...data.softSkills, s] })}
        onRemove={(s) => onChange({ softSkills: data.softSkills.filter((t) => t !== s) })}
      />
    </div>
  );
}
