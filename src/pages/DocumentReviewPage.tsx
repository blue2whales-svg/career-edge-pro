import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Download, Loader2, RefreshCw, Check, ArrowLeft, Eye, Edit3, Lock, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";
import PageLayout from "@/components/PageLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const SERVICE_LABELS: Record<string, string> = {
  cv: "Professional CV",
  "executive-cv": "Executive CV",
  "ats-cv": "ATS-Optimised CV",
  "modern-cv": "Modern CV",
  "international-cv": "International CV",
  "cover-letter": "Cover Letter",
  linkedin: "LinkedIn Profile",
  "personal-statement": "Personal Statement",
  scholarship: "Scholarship Essay",
  reference: "Reference Letter",
};

export default function DocumentReviewPage() {
  const { orderId } = useParams();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDoc, setActiveDoc] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [orderStatus, setOrderStatus] = useState<string>("pending");
  const isPaid = orderStatus === "paid";

  useEffect(() => {
    if (orderId) fetchDocuments();
  }, [orderId]);

  const fetchDocuments = async () => {
    setLoading(true);
    
    // Fetch order status
    const { data: orderData } = await supabase
      .from("orders")
      .select("status")
      .eq("id", orderId)
      .maybeSingle();
    
    if (orderData) {
      setOrderStatus(orderData.status);
    }

    const { data, error } = await supabase
      .from("generated_documents")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Fetch error:", error);
      toast({ title: "Failed to load documents", variant: "destructive" });
    } else {
      setDocuments(data || []);
      if (data && data.length > 0 && !activeDoc) {
        setActiveDoc(data[0].id);
        setEditContent(isPaid ? data[0].content : blurContent(data[0].content));
      }
    }
    setLoading(false);
  };

  const blurContent = (content: string) => {
    // Show first 200 chars, blur the rest
    return content.slice(0, 200);
  };

  const selectDoc = (doc: any) => {
    setActiveDoc(doc.id);
    setEditContent(isPaid ? doc.content : blurContent(doc.content));
  };

  const saveEdits = async () => {
    if (!activeDoc || !isPaid) return;
    setSaving(true);
    const { error } = await supabase
      .from("generated_documents")
      .update({ content: editContent, updated_at: new Date().toISOString() })
      .eq("id", activeDoc);

    if (error) {
      toast({ title: "Failed to save", variant: "destructive" });
    } else {
      toast({ title: "Changes saved ✓" });
      setDocuments((prev) =>
        prev.map((d) => (d.id === activeDoc ? { ...d, content: editContent } : d))
      );
    }
    setSaving(false);
  };

  const downloadDoc = useCallback((format: "pdf" | "docx" | "txt") => {
    if (!isPaid) {
      toast({ title: "Please complete payment to download", variant: "destructive" });
      return;
    }
    const doc = documents.find((d) => d.id === activeDoc);
    if (!doc) return;
    const label = SERVICE_LABELS[doc.service_type] || doc.service_type;

    if (format === "txt") {
      const blob = new Blob([editContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${label}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    if (format === "docx") {
      // Build a simple HTML → Word-compatible blob
      const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>${label}</title>
<style>body{font-family:Calibri,Arial,sans-serif;font-size:11pt;line-height:1.6;color:#222}h1,h2,h3{font-family:Calibri,Arial,sans-serif}h1{font-size:18pt}h2{font-size:14pt}h3{font-size:12pt}ul,ol{margin-left:20px}</style>
</head><body>${markdownToHtml(editContent)}</body></html>`;
      const blob = new Blob([html], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${label}.doc`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    if (format === "pdf") {
      // Open a print-friendly window for PDF
      const printWindow = window.open("", "_blank");
      if (!printWindow) return;
      printWindow.document.write(`<!DOCTYPE html><html><head><title>${label}</title>
<style>@page{margin:1in}body{font-family:Georgia,serif;font-size:11pt;line-height:1.7;color:#111;max-width:700px;margin:0 auto;padding:40px}h1{font-size:18pt;margin-bottom:6px}h2{font-size:14pt;border-bottom:1px solid #ddd;padding-bottom:4px}h3{font-size:12pt}ul,ol{margin-left:20px}p{margin:8px 0}</style>
</head><body>${markdownToHtml(editContent)}</body></html>`);
      printWindow.document.close();
      setTimeout(() => { printWindow.print(); }, 400);
    }
  }, [isPaid, documents, activeDoc, editContent, toast]);

  // Simple markdown → HTML converter for export
  const markdownToHtml = (md: string): string => {
    return md
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`)
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/^(.+)$/gm, (line) => {
        if (line.startsWith('<')) return line;
        return `<p>${line}</p>`;
      });
  };

  const [viewMode, setViewMode] = useState<"edit" | "preview" | "split">("split");
  const activeDocument = documents.find((d) => d.id === activeDoc);
  const isGenerating = documents.some((d) => d.status === "generating");

  return (
    <PageLayout>
      <section className="relative z-10 pt-12 pb-24 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold">
                Review Your <span className="text-gradient">Documents</span>
              </h1>
              <p className="text-sm text-muted-foreground">
                Order {orderId?.slice(0, 8).toUpperCase()}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Loading your documents...</span>
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-20">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Documents are being generated</h2>
              <p className="text-muted-foreground mb-6">
                Your AI-powered documents are being created. This usually takes 1-2 minutes.
              </p>
              <Button onClick={fetchDocuments} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" /> Refresh
              </Button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Document tabs */}
              <div className="lg:col-span-1 space-y-2">
                {documents.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => selectDoc(doc)}
                    className={`w-full rounded-xl border p-3 text-left transition-all ${
                      activeDoc === doc.id
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-sm font-medium truncate">
                        {SERVICE_LABELS[doc.service_type] || doc.service_type}
                      </span>
                    </div>
                    <div className="mt-1">
                      {doc.status === "generating" ? (
                        <span className="text-xs text-amber-400 flex items-center gap-1">
                          <Loader2 className="h-3 w-3 animate-spin" /> Generating...
                        </span>
                      ) : doc.status === "error" ? (
                        <span className="text-xs text-destructive">Error</span>
                      ) : (
                        <span className="text-xs text-emerald-400 flex items-center gap-1">
                          <Check className="h-3 w-3" /> Ready
                        </span>
                      )}
                    </div>
                  </button>
                ))}

                {isGenerating && (
                  <Button onClick={fetchDocuments} variant="outline" size="sm" className="w-full mt-2">
                    <RefreshCw className="h-3 w-3 mr-1" /> Refresh
                  </Button>
                )}
              </div>

              {/* Editor */}
              <div className="lg:col-span-3">
                {activeDocument ? (
                  <motion.div
                    key={activeDoc}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-border bg-card p-6"
                  >
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                      <h2 className="text-lg font-bold">
                        {SERVICE_LABELS[activeDocument.service_type] || activeDocument.service_type}
                      </h2>
                      <div className="flex gap-2 items-center">
                        <div className="flex rounded-lg border border-border overflow-hidden">
                          <button
                            onClick={() => setViewMode("edit")}
                            className={`px-3 py-1.5 text-xs font-medium flex items-center gap-1 transition-colors ${viewMode === "edit" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`}
                          >
                            <Edit3 className="h-3 w-3" /> Edit
                          </button>
                          <button
                            onClick={() => setViewMode("split")}
                            className={`px-3 py-1.5 text-xs font-medium transition-colors ${viewMode === "split" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`}
                          >
                            Split
                          </button>
                          <button
                            onClick={() => setViewMode("preview")}
                            className={`px-3 py-1.5 text-xs font-medium flex items-center gap-1 transition-colors ${viewMode === "preview" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`}
                          >
                            <Eye className="h-3 w-3" /> Preview
                          </button>
                        </div>
                        <Button onClick={saveEdits} disabled={saving || !isPaid} size="sm" variant="outline">
                          {saving ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Check className="h-3 w-3 mr-1" />}
                          Save
                        </Button>
                        <div className="flex gap-1">
                          <Button onClick={() => downloadDoc("pdf")} disabled={!isPaid} size="sm" className="bg-gradient-brand border-0 text-xs px-2.5">
                            {isPaid ? <Download className="h-3 w-3 mr-1" /> : <Lock className="h-3 w-3 mr-1" />}
                            PDF
                          </Button>
                          <Button onClick={() => downloadDoc("docx")} disabled={!isPaid} size="sm" variant="outline" className="text-xs px-2.5">
                            <Download className="h-3 w-3 mr-1" /> Word
                          </Button>
                        </div>
                      </div>
                    </div>

                    {!isPaid && (
                      <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 flex items-start gap-3">
                        <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-amber-300">Payment Required</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Complete your M-Pesa payment to unlock full access. You can preview a snippet below, but editing, copying, and downloading are locked until payment is confirmed.
                          </p>
                        </div>
                      </div>
                    )}

                    {activeDocument.status === "generating" ? (
                      <div className="flex items-center justify-center py-16">
                        <Loader2 className="h-6 w-6 animate-spin text-primary mr-3" />
                        <span className="text-muted-foreground">AI is writing your document...</span>
                      </div>
                    ) : (
                      <div className="relative">
                        {!isPaid && (
                          <div className="absolute inset-0 z-10 pointer-events-auto select-none" 
                            onCopy={(e) => e.preventDefault()}
                            style={{ userSelect: 'none' }}
                          />
                        )}
                        <div className={`grid gap-4 ${viewMode === "split" ? "grid-cols-2" : "grid-cols-1"} ${!isPaid ? "blur-sm opacity-60" : ""}`}
                          style={!isPaid ? { userSelect: 'none' } : {}}
                        >
                          {(viewMode === "edit" || viewMode === "split") && (
                            <Textarea
                              value={isPaid ? editContent : blurContent(editContent) + "\n\n... [Complete payment to view full document]"}
                              onChange={(e) => isPaid && setEditContent(e.target.value)}
                              readOnly={!isPaid}
                              className="min-h-[500px] bg-background border-border font-mono text-sm leading-relaxed"
                              placeholder="Your document content will appear here..."
                            />
                          )}
                          {(viewMode === "preview" || viewMode === "split") && (
                            <div className="min-h-[500px] rounded-md border border-border bg-background p-6 overflow-auto prose prose-sm dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-li:text-foreground">
                              <ReactMarkdown>{isPaid ? editContent : blurContent(editContent) + "\n\n... *Complete payment to view the full document*"}</ReactMarkdown>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <div className="text-center py-16 text-muted-foreground">
                    Select a document to review
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
