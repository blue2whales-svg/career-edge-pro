import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, Download, Trash2, Eye, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PageLayout from "@/components/PageLayout";
import { toast } from "sonner";

interface VaultFile {
  id: string;
  name: string;
  size: number;
  type: string;
  category: string;
  uploadDate: string;
  data: string; // base64
}

const CATEGORIES = ["All", "CVs", "Cover Letters", "Certificates", "Passport & ID"];

const getVaultFiles = (): VaultFile[] => {
  try { return JSON.parse(localStorage.getItem("cvedge_vault_files") || "[]"); }
  catch { return []; }
};

export default function VaultPage() {
  const [files, setFiles] = useState<VaultFile[]>(getVaultFiles);
  const [category, setCategory] = useState("All");
  const [previewFile, setPreviewFile] = useState<VaultFile | null>(null);
  const [uploadCategory, setUploadCategory] = useState("CVs");

  useEffect(() => { localStorage.setItem("cvedge_vault_files", JSON.stringify(files)); }, [files]);

  const filtered = category === "All" ? files : files.filter(f => f.category === category);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { toast.error("File too large (max 10MB)"); return; }
    if (!file.name.match(/\.(pdf|docx|jpg|jpeg|png)$/i)) { toast.error("Only PDF, DOCX, JPG, PNG allowed"); return; }

    const reader = new FileReader();
    reader.onload = () => {
      const newFile: VaultFile = {
        id: Date.now().toString(),
        name: file.name,
        size: file.size,
        type: file.type,
        category: uploadCategory,
        uploadDate: new Date().toISOString().split("T")[0],
        data: reader.result as string,
      };
      setFiles(prev => [...prev, newFile]);
      toast.success(`${file.name} uploaded to vault`);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const downloadFile = (file: VaultFile) => {
    const a = document.createElement("a");
    a.href = file.data;
    a.download = file.name;
    a.click();
  };

  const deleteFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    toast.success("File deleted");
  };

  const formatSize = (bytes: number) => bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  const CATEGORY_COLORS: Record<string, string> = {
    "CVs": "bg-blue-500/15 text-blue-400", "Cover Letters": "bg-cyan-500/15 text-cyan-400",
    "Certificates": "bg-yellow-500/15 text-yellow-400", "Passport & ID": "bg-red-500/15 text-red-400",
  };

  return (
    <PageLayout>
      <Dialog open={!!previewFile} onOpenChange={open => !open && setPreviewFile(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{previewFile?.name}</DialogTitle></DialogHeader>
          {previewFile?.type.startsWith("image/") ? (
            <img src={previewFile.data} alt={previewFile.name} className="w-full rounded-lg" />
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <FileText className="h-16 w-16 mx-auto mb-3 text-muted-foreground/30" />
              <p className="text-sm">Preview not available for this file type</p>
              <Button onClick={() => previewFile && downloadFile(previewFile)} variant="outline" className="mt-3">Download to view</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <section className="relative z-10 pt-16 sm:pt-24 pb-24 px-4">
        <div className="container max-w-5xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-1">Document <span className="text-gradient">Vault</span></h1>
          <p className="text-sm text-muted-foreground mb-8">Your career documents, safe and organized</p>

          {/* Upload */}
          <div className="rounded-2xl border border-border bg-card p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
              <div className="flex-1">
                <p className="text-sm font-medium mb-2">Upload a document</p>
                <Select value={uploadCategory} onValueChange={setUploadCategory}>
                  <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.filter(c => c !== "All").map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <label className="cursor-pointer">
                <Button asChild className="bg-gradient-brand border-0 font-semibold gap-1.5">
                  <span><Upload className="h-4 w-4" /> Upload File</span>
                </Button>
                <input type="file" accept=".pdf,.docx,.jpg,.jpeg,.png" onChange={handleUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto mb-6 pb-1">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${category === c ? "bg-gradient-brand text-primary-foreground" : "border border-border bg-card text-muted-foreground hover:text-foreground"}`}>
                {c} {c !== "All" && `(${files.filter(f => f.category === c).length})`}
              </button>
            ))}
          </div>

          {/* Files Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 rounded-2xl border border-border bg-card">
              <FolderOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground text-sm">No documents yet</p>
              <p className="text-xs text-muted-foreground mt-1">Upload your first document to get started</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(file => (
                <motion.div key={file.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition-all">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatSize(file.size)} · {file.uploadDate}</p>
                      <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full mt-1 ${CATEGORY_COLORS[file.category] || "bg-muted text-muted-foreground"}`}>{file.category}</span>
                    </div>
                  </div>
                  <div className="flex gap-1.5 mt-3">
                    <Button size="sm" variant="outline" onClick={() => downloadFile(file)} className="text-xs flex-1 gap-1"><Download className="h-3 w-3" /> Download</Button>
                    <Button size="sm" variant="outline" onClick={() => setPreviewFile(file)} className="text-xs gap-1"><Eye className="h-3 w-3" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => deleteFile(file.id)} className="text-xs text-destructive"><Trash2 className="h-3 w-3" /></Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
