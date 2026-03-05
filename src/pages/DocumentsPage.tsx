import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FileText, Download } from "lucide-react";

const DOCUMENTS = [
  { name: "Resume_2024_v3.pdf", type: "CV", updated: "Mar 1, 2024", versions: 3 },
  { name: "Cover_Letter_Google.pdf", type: "Cover Letter", updated: "Feb 28, 2024", versions: 2 },
  { name: "Cover_Letter_Meta.pdf", type: "Cover Letter", updated: "Feb 25, 2024", versions: 1 },
  { name: "Portfolio_2024.pdf", type: "Portfolio", updated: "Feb 20, 2024", versions: 4 },
];

export default function DocumentsPage() {
  return (
    <div className="p-6 space-y-6 max-w-[1000px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Documents</h1>
          <p className="text-sm text-muted-foreground">Upload and manage your CVs, cover letters, and portfolios.</p>
        </div>
        <Button className="bg-gradient-brand border-0 font-medium">
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card">
        {DOCUMENTS.map((doc, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
            <FileText className="h-8 w-8 text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">{doc.name}</div>
              <div className="text-xs text-muted-foreground">{doc.type} · v{doc.versions} · Updated {doc.updated}</div>
            </div>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-primary/20 bg-gradient-brand-subtle p-5">
        <h3 className="font-semibold mb-2">✨ AI CV Tailor</h3>
        <p className="text-sm text-muted-foreground mb-3">Paste a job description to get suggestions on how to tailor your CV.</p>
        <div className="flex gap-2">
          <Input placeholder="Paste job description..." className="bg-muted/50 border-border" />
          <Button className="bg-gradient-brand border-0 shrink-0">Analyze</Button>
        </div>
      </div>
    </div>
  );
}
