import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { CVData } from "./types";

interface Props {
  data: CVData;
  onChange: (updates: Partial<CVData>) => void;
}

const LANGUAGE_SUGGESTIONS = [
  "English", "Swahili", "Kikuyu", "Luo", "Kalenjin", "Kamba", "Somali",
  "Arabic", "French", "German", "Mandarin", "Spanish", "Portuguese",
];

const PROFICIENCY_LEVELS = ["Basic", "Conversational", "Fluent", "Native"];

export default function StepLanguages({ data, onChange }: Props) {
  const langs = data.languages;

  const update = (idx: number, updates: Partial<{ name: string; proficiency: string }>) => {
    onChange({ languages: langs.map((l, i) => (i === idx ? { ...l, ...updates } : l)) });
  };

  const add = () => onChange({ languages: [...langs, { name: "", proficiency: "Conversational" }] });
  const remove = (idx: number) => onChange({ languages: langs.filter((_, i) => i !== idx) });

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-serif font-bold text-foreground">Languages</h2>

      {langs.map((lang, i) => (
        <div key={i} className="flex items-end gap-3">
          <div className="flex-1 space-y-1.5">
            <Label>Language</Label>
            <Input
              list="lang-suggestions"
              value={lang.name}
              onChange={(e) => update(i, { name: e.target.value })}
              placeholder="e.g. Swahili"
            />
          </div>
          <div className="w-40 space-y-1.5">
            <Label>Proficiency</Label>
            <select
              value={lang.proficiency}
              onChange={(e) => update(i, { proficiency: e.target.value })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {PROFICIENCY_LEVELS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <Button onClick={() => remove(i)} variant="ghost" size="icon" className="text-destructive shrink-0 mb-0.5">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}

      <datalist id="lang-suggestions">
        {LANGUAGE_SUGGESTIONS.map((l) => <option key={l} value={l} />)}
      </datalist>

      <Button onClick={add} variant="outline" size="sm">
        <Plus className="h-4 w-4 mr-1" /> Add Language
      </Button>
    </div>
  );
}
