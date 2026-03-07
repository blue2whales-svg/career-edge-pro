import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Download, FileText, Loader2 } from "lucide-react";

interface Doc {
  id: string;
  order_id: string;
  service_type: string;
  content: string;
  status: string;
  created_at: string;
}

export default function PortalDocuments() {
  const [documents, setDocuments] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocs = async () => {
      const { data, error } = await supabase
        .from("generated_documents")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) setDocuments(data);
      setLoading(false);
    };
    fetchDocs();
  }, []);

  const downloadDocument = (doc: Doc) => {
    const blob = new Blob([doc.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${doc.service_type.replace(/\s+/g, "_")}_${doc.id.slice(0, 8)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 max-w-[900px]">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold">My Documents</h1>
        <p className="text-sm text-muted-foreground mt-1">
          All your career documents in one place. Download anytime.
        </p>
      </div>

      {documents.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No documents yet</h3>
          <p className="text-sm text-muted-foreground">
            Your completed documents will appear here for download.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-5 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">{doc.service_type}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(doc.created_at).toLocaleDateString("en-KE", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                    {" · "}
                    <span className={doc.status === "completed" ? "text-emerald-500" : "text-amber-500"}>
                      {doc.status}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link to={`/review/${doc.order_id}`}>
                  <Button variant="outline" size="sm" className="border-primary/30">Preview</Button>
                </Link>
                <Button size="sm" onClick={() => downloadDocument(doc)} className="bg-gradient-brand border-0">
                  <Download className="h-4 w-4 mr-1" /> Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
