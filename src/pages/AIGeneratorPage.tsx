import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, ArrowRight, Copy } from "lucide-react";
import { useState } from "react";

export default function AIGeneratorPage() {
  const [generated, setGenerated] = useState(false);

  return (
    <div className="p-6 space-y-6 max-w-[900px]">
      <div>
        <h1 className="text-2xl font-bold">Cover Letter Studio</h1>
        <p className="text-sm text-muted-foreground">Get a tailored cover letter or CV summary crafted by our specialists — in minutes.</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Request Cover Letter</h2>
        </div>
        <Input placeholder="Paste job URL or title..." className="bg-muted/50 border-border h-11" />
        <Textarea placeholder="Or paste the full job description here..." className="bg-muted/50 border-border min-h-[120px]" />
        <Button
          onClick={() => setGenerated(true)}
          className="bg-gradient-brand border-0 font-medium"
        >
          Get My Cover Letter <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {generated && (
        <div className="rounded-xl border border-primary/20 bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Your Cover Letter</h3>
            <Button variant="outline" size="sm">
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </Button>
          </div>
          <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
            <p>Dear Hiring Manager,</p>
            <p>I am writing to express my strong interest in the position at your company. With my background in software engineering and passion for building exceptional user experiences, I believe I would be an excellent fit for your team.</p>
            <p>Throughout my career, I have demonstrated a commitment to delivering high-quality solutions that drive business results. My experience with modern web technologies, combined with my collaborative approach, makes me uniquely positioned to contribute to your organization's goals.</p>
            <p>I would welcome the opportunity to discuss how my skills and experience align with your team's needs. Thank you for considering my application.</p>
            <p>Best regards,<br />Demo User</p>
          </div>
        </div>
      )}
    </div>
  );
}
