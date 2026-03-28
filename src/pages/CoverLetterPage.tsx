import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Copy, Download, RefreshCw, Edit3, Save, ArrowRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PageLayout from "@/components/PageLayout";
import { trackViewContent } from "@/hooks/useFbPixel";
import MpesaPaymentModal from "@/components/MpesaPaymentModal";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

export default function CoverLetterPage() {
  useEffect(() => { trackViewContent("Cover Letter", "Services"); }, []);
  const [searchParams] = useSearchParams();
  const [jobTitle, setJobTitle] = useState(searchParams.get("job_title") || "");
  const [company, setCompany] = useState(searchParams.get("company") || "");
  const [location, setLocation] = useState("");
  const [name, setName] = useState("");
  const [tone, setTone] = useState("Professional");
  const [targetMarket, setTargetMarket] = useState("International");
  const [experience, setExperience] = useState("");
  const [letter, setLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedLetter, setEditedLetter] = useState("");
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const generate = async () => {
    if (!jobTitle || !company || !name || !experience) {
      toast.error("Please fill in all required fields");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-generate", {
        body: { type: "cover-letter", data: { jobTitle, company, location, name, tone, targetMarket, experience } },
      });
      if (error) throw error;
      setLetter(data.content);
      setEditedLetter(data.content);
      toast.success("Cover letter generated!");
    } catch (e: any) {
      toast.error(e.message || "Generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!isPaid) { setPaymentOpen(true); return; }
    navigator.clipboard.writeText(editing ? editedLetter : letter);
    toast.success("Copied to clipboard!");
  };

  const downloadFile = () => {
    if (!isPaid) { setPaymentOpen(true); return; }
    const content = editing ? editedLetter : letter;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CoverLetter_${company}_${jobTitle}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded!");
  };

  // Get preview of letter (first 2 paragraphs)
  const getLetterPreview = (text: string) => {
    if (isPaid) return text;
    const paragraphs = text.split("\n\n");
    return paragraphs.slice(0, 2).join("\n\n");
  };

  return (
    <PageLayout>
      <MpesaPaymentModal open={paymentOpen} onClose={() => setPaymentOpen(false)} defaultPackage="cover-letter" />
      <section className="relative z-10 pt-16 sm:pt-24 pb-10 px-4">
        <div className="container max-w-6xl mx-auto">
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={0}
            className="text-3xl sm:text-5xl font-serif font-bold mb-3 text-center">
            AI Cover Letter <span className="text-gradient">Generator</span>
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={1}
            className="text-muted-foreground text-center mb-10 max-w-xl mx-auto">
            Generate a tailored, ATS-optimized cover letter in seconds
          </motion.p>

          <div className="grid lg:grid-cols-5 gap-6">
            {/* Form - fully editable */}
            <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4">
              <div><Label>Job Title *</Label><Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="Software Engineer" className="mt-1" /></div>
              <div><Label>Company Name *</Label><Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Google" className="mt-1" /></div>
              <div><Label>Location</Label><Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Dubai, UAE" className="mt-1" /></div>
              <div><Label>Your Name *</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" className="mt-1" /></div>
              <div>
                <Label>Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Professional">Professional</SelectItem>
                    <SelectItem value="Confident">Confident</SelectItem>
                    <SelectItem value="Enthusiastic">Enthusiastic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Target Market</Label>
                <Select value={targetMarket} onValueChange={setTargetMarket}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Kenya", "East Africa", "Gulf/Dubai", "UK/Europe", "North America", "Australia", "International"].map(m => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Experience Summary *</Label>
                <Textarea value={experience} onChange={(e) => setExperience(e.target.value)} rows={6} placeholder="Summarize your relevant experience..." className="mt-1" />
              </div>
              <Button onClick={generate} disabled={loading} className="w-full h-12 font-bold border-0 bg-gradient-brand gold-shimmer">
                {loading ? "Generating..." : "✨ Generate My Cover Letter"}
              </Button>
            </div>

            {/* Preview panel with payment gate */}
            <div className="lg:col-span-3 space-y-4">
              <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 min-h-[400px]">
                {!letter && !loading && (
                  <div className="flex flex-col items-center justify-center h-full text-center py-20 border-2 border-dashed border-border/50 rounded-xl">
                    <FileText className="h-12 w-12 text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground text-sm">Your cover letter will appear here</p>
                  </div>
                )}
                {loading && (
                  <div className="space-y-3 animate-pulse">
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className="h-4 bg-muted rounded" style={{ width: `${60 + Math.random() * 40}%` }} />
                    ))}
                  </div>
                )}
                {letter && !loading && (
                  <div>
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      <span className="text-xs bg-green-500/15 text-green-500 border border-green-500/30 px-2 py-0.5 rounded-full">✅ Generated</span>
                      {!isPaid && (
                        <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Lock className="h-3 w-3" /> Preview
                        </span>
                      )}
                      <div className="flex gap-1.5 ml-auto">
                        {isPaid && (
                          <Button size="sm" variant="outline" onClick={() => setEditing(!editing)} className="text-xs gap-1">
                            {editing ? <Save className="h-3 w-3" /> : <Edit3 className="h-3 w-3" />}
                            {editing ? "Save" : "Edit"}
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={copyToClipboard} className="text-xs gap-1">
                          {!isPaid && <Lock className="h-3 w-3" />}
                          <Copy className="h-3 w-3" /> Copy
                        </Button>
                        <Button size="sm" variant="outline" onClick={downloadFile} className="text-xs gap-1">
                          {!isPaid && <Lock className="h-3 w-3" />}
                          <Download className="h-3 w-3" /> Download
                        </Button>
                        <Button size="sm" variant="outline" onClick={generate} className="text-xs gap-1"><RefreshCw className="h-3 w-3" /> Regenerate</Button>
                      </div>
                    </div>

                    {isPaid ? (
                      editing ? (
                        <Textarea value={editedLetter} onChange={(e) => setEditedLetter(e.target.value)} rows={20} className="font-serif text-sm leading-relaxed" />
                      ) : (
                        <div className="bg-white/5 rounded-xl p-6 font-serif text-sm leading-relaxed whitespace-pre-wrap">{letter}</div>
                      )
                    ) : (
                      /* Gated preview */
                      <div
                        className="relative"
                        style={{ userSelect: "none", WebkitUserSelect: "none" }}
                        onContextMenu={(e) => e.preventDefault()}
                      >
                        <div className="bg-white/5 rounded-xl p-6 font-serif text-sm leading-relaxed whitespace-pre-wrap">
                          {getLetterPreview(letter)}
                        </div>
                        {/* Blur fade */}
                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-card via-card/80 to-transparent rounded-b-xl" />
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                          <div className="flex items-center gap-2 bg-muted/80 border border-border text-xs px-4 py-2 rounded-full">
                            <Lock className="h-3.5 w-3.5 text-primary" />
                            <span className="text-muted-foreground">Unlock full cover letter after payment</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Unlock CTA (unpaid) */}
              {letter && !isPaid && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-primary/20 p-6"
                  style={{ background: "linear-gradient(135deg, hsl(222 47% 6%), hsl(222 40% 9%))" }}
                >
                  <h3 className="font-serif font-bold text-base mb-2">Unlock Your Full Cover Letter</h3>
                  <p className="text-xs text-muted-foreground mb-4">Get the complete letter with all sections, plus download as PDF and editable DOCX.</p>
                  <Button onClick={() => setPaymentOpen(true)} className="w-full h-11 font-bold border-0 bg-gradient-brand gold-shimmer text-sm">
                    Unlock Now — Pay via M-Pesa <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <p className="text-[10px] text-muted-foreground text-center mt-3">Paybill 4561075 · Instant delivery</p>
                </motion.div>
              )}

              {/* Upsell after payment */}
              {letter && isPaid && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-3">Want a human expert to perfect this?</p>
                  <Button onClick={() => setPaymentOpen(true)} className="bg-gradient-brand border-0 font-semibold gold-shimmer">
                    Upgrade to Professional — KSh 5,500 <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
