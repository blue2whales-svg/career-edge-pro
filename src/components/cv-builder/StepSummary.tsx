import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CVData } from "./types";

interface Props {
  data: CVData;
  onChange: (updates: Partial<CVData>) => void;
}

export default function StepSummary({ data, onChange }: Props) {
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();
  const charCount = data.professionalSummary.length;

  const generateSummary = async () => {
    if (!data.professionalTitle) {
      toast({ title: "Enter your professional title first", variant: "destructive" });
      return;
    }
    setGenerating(true);
    try {
      const { data: result, error } = await supabase.functions.invoke("generate-summary", {
        body: {
          role: data.professionalTitle,
          experience: data.workExperience.length > 0
            ? data.workExperience.map((w) => `${w.jobTitle} at ${w.company}`).join(", ")
            : "",
          skills: data.hardSkills.join(", "),
        },
      });
      if (error) throw error;
      onChange({ professionalSummary: result.summary });
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to generate summary", variant: "destructive" });
    }
    setGenerating(false);
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-serif font-bold text-foreground">Professional Summary</h2>

      <div className="rounded-xl border border-border bg-muted/30 p-4">
        <p className="text-sm text-muted-foreground">
          💡 <strong>Tips for a great summary:</strong> Lead with your years of experience and core expertise.
          Mention 2-3 key achievements. Keep it between 150-300 words. Use action verbs and quantify results where possible.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Your Professional Summary</Label>
          <span className={`text-xs ${charCount < 150 ? "text-amber-400" : charCount > 300 ? "text-destructive" : "text-emerald-400"}`}>
            {charCount} characters {charCount < 150 ? "(too short)" : charCount > 300 ? "(consider trimming)" : "✓"}
          </span>
        </div>
        <Textarea
          value={data.professionalSummary}
          onChange={(e) => onChange({ professionalSummary: e.target.value })}
          rows={8}
          placeholder="Results-driven marketing professional with 7+ years of experience in digital strategy and brand management across East Africa..."
          className="bg-background border-border"
        />
      </div>

      <Button onClick={generateSummary} disabled={generating} variant="outline" className="gap-2">
        {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-primary" />}
        Generate Summary
      </Button>
    </div>
  );
}
