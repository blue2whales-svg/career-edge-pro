import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight, Upload, FileText, Pen, Linkedin, GraduationCap,
  Shield, Globe, Award, BookOpen, Users, Check, Loader2, X, Clock, Phone, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ServiceQuestions from "@/components/order/ServiceQuestions";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

const SERVICES = [
  { id: "cv", icon: FileText, label: "Professional CV", price: 2500, desc: "Corporate standard — clean layout trusted by HR managers" },
  { id: "executive-cv", icon: Award, label: "Executive CV", price: 4500, desc: "C-suite ready — highlights leadership, P&L, and board experience" },
  { id: "cover-letter", icon: Pen, label: "Cover Letter", price: 1500, desc: "Tailored to the role — compelling story that gets you shortlisted" },
  { id: "linkedin", icon: Linkedin, label: "LinkedIn Optimisation", price: 2000, desc: "Keyword-rich profile that attracts recruiters and opportunities" },
  { id: "personal-statement", icon: BookOpen, label: "Personal Statement", price: 3500, desc: "UCAS & postgrad ready — showcases your academic passion" },
  { id: "scholarship", icon: GraduationCap, label: "Scholarship Essay", price: 4000, desc: "Chevening, Mastercard, DAAD — winning narratives that fund dreams" },
  { id: "reference", icon: Users, label: "Reference Letter", price: 2000, desc: "Professional draft your referee can sign with confidence" },
  { id: "ats-cv", icon: Shield, label: "ATS-Optimised CV", price: 3000, desc: "Beats applicant tracking systems — keyword-matched for online portals" },
  { id: "modern-cv", icon: FileText, label: "Modern CV", price: 3000, desc: "Visual impact — contemporary design for tech, creative & startups" },
  { id: "international-cv", icon: Globe, label: "International CV", price: 3500, desc: "Formatted for Gulf, UK, EU — adapts photo, layout & conventions" },
];

function formatKES(amount: number) {
  return `KES ${amount.toLocaleString()}`;
}

const PACKAGE_MAP: Record<string, string[]> = {
  starter: ["cv"],
  professional: ["cv", "cover-letter", "linkedin"],
  executive: ["executive-cv", "cover-letter", "linkedin"],
};

export default function OrderPage() {
  const [searchParams] = useSearchParams();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [stkSent, setStkSent] = useState(false);
  const [paymentChecking, setPaymentChecking] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const jobFromQuery = searchParams.get("job_title");
  const companyFromQuery = searchParams.get("company");

  useEffect(() => {
    const pkg = searchParams.get("package");
    const singleService = searchParams.get("service");
    if (pkg && PACKAGE_MAP[pkg]) {
      setSelectedServices(PACKAGE_MAP[pkg]);
    } else if (singleService) {
      setSelectedServices((prev) => prev.includes(singleService) ? prev : [...prev, singleService]);
    }
    // Pre-fill job title if coming from jobs board
    if (jobFromQuery) {
      setFormValues((prev) => ({ ...prev, jobTitle: jobFromQuery, targetCompany: companyFromQuery || "" }));
    }
  }, [searchParams]);

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const total = SERVICES.filter((s) => selectedServices.includes(s.id))
    .reduce((sum, s) => sum + s.price, 0);

  const handleFormChange = (key: string, value: string) => {
    setFormValues(prev => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    const valid = selected.filter(f => f.size <= 10 * 1024 * 1024);
    if (valid.length < selected.length) {
      toast({ title: "Some files exceed 10MB and were skipped", variant: "destructive" });
    }
    setFiles(prev => [...prev, ...valid]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const checkPaymentStatus = async (id: string) => {
    setPaymentChecking(true);
    const { data } = await supabase
      .from("orders")
      .select("status")
      .eq("id", id)
      .maybeSingle();

    if (data?.status === "paid") {
      setPaymentConfirmed(true);
      toast({ title: "Payment confirmed! 🎉" });
    } else {
      toast({ title: "Payment not yet received. Please check your phone and try again.", variant: "destructive" });
    }
    setPaymentChecking(false);
  };

  const handleSubmit = async () => {
    if (selectedServices.length === 0) {
      toast({ title: "Select at least one service", variant: "destructive" });
      return;
    }
    if (!name.trim() || !email.trim()) {
      toast({ title: "Name and email are required", variant: "destructive" });
      return;
    }
    if (!phone.trim()) {
      toast({ title: "M-Pesa phone number is required for payment", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      // Combine all form values into details JSON
      const allDetails = JSON.stringify(formValues);

      const { data: order, error } = await supabase.from("orders").insert({
        user_id: user?.id || null,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        services: selectedServices,
        details: allDetails,
        total_amount: total,
        status: "pending",
        job_title: formValues.jobTitle?.trim() || formValues.coverLetterRole?.trim() || null,
        experience: formValues.experience?.trim() || null,
        skills: formValues.skills?.trim() || null,
        education: formValues.education?.trim() || null,
      } as any).select().single();

      if (error) throw error;

      if (files.length > 0) {
        for (const file of files) {
          const filePath = `${order.id}/${Date.now()}-${file.name}`;
          const { error: uploadError } = await supabase.storage
            .from("order-documents")
            .upload(filePath, file);
          if (uploadError) console.error("Upload error:", uploadError);
        }
      }

      setOrderId(order.id);
      setOrderPlaced(true);

      // Trigger M-Pesa STK Push
      try {
        const { data: stkData, error: stkError } = await supabase.functions.invoke("mpesa-stk-push", {
          body: { orderId: order.id, phone: phone.trim(), amount: total },
        });

        if (stkError) {
          console.error("STK push error:", stkError);
          toast({ title: "M-Pesa prompt could not be sent. Please use the manual payment option below.", variant: "destructive" });
        } else if (stkData?.ResponseCode === "0") {
          setStkSent(true);
          toast({ title: "Check your phone for the M-Pesa payment prompt 📱" });
        } else {
          console.error("STK response:", stkData);
          toast({ title: "M-Pesa request failed. Please try again or pay manually.", variant: "destructive" });
        }
      } catch (stkErr) {
        console.error("STK invoke error:", stkErr);
        toast({ title: "Could not reach payment service. Try the manual option below.", variant: "destructive" });
      }

      // Trigger Zapier webhook (background)
      supabase.functions.invoke("notify-zapier", { body: { order } }).catch(console.error);

      // Trigger AI document generation (background)
      supabase.functions.invoke("generate-cv", { body: { orderId: order.id } }).catch(console.error);

    } catch (error: any) {
      console.error("Order error:", error);
      toast({ title: "Something went wrong", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderPlaced) {
    return (
      <PageLayout>
        <section className="relative z-10 pt-24 pb-32 px-4">
          <div className="container max-w-xl mx-auto text-center">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
              {paymentConfirmed ? (
                <>
                  <div className="w-20 h-20 rounded-full bg-gradient-brand flex items-center justify-center mx-auto mb-6">
                    <Check className="h-10 w-10 text-primary-foreground" />
                  </div>
                  <h1 className="text-3xl sm:text-5xl font-serif font-bold mb-4">
                    Payment <span className="text-gradient">Confirmed!</span>
                  </h1>
                  <p className="text-sm text-muted-foreground mb-2">Your AI-powered documents are being generated now!</p>
                  <p className="text-sm font-mono text-primary mb-8">Order ID: {orderId.slice(0, 8).toUpperCase()}</p>

                  <div className="rounded-xl border border-border bg-card p-6 text-left mb-8">
                    <h3 className="font-semibold mb-3">What happens next?</h3>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <div className="flex items-start gap-3">
                        <span className="text-primary font-bold">1.</span>
                        <span>AI is generating your documents right now (1-2 min)</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-primary font-bold">2.</span>
                        <span>Review and edit your documents on the next page</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-primary font-bold">3.</span>
                        <span>Download your polished, ready-to-use documents</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 mb-6 text-left">
                    <h3 className="font-semibold text-sm mb-1">🚀 Your CV is ready — now put it to work!</h3>
                    <p className="text-xs text-muted-foreground">Browse open roles and apply instantly with your new professional CV.</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link to="/jobs">
                      <Button className="bg-gradient-brand border-0 font-semibold gold-shimmer">
                        Browse Jobs & Apply <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link to={`/review/${orderId}`}>
                      <Button variant="outline" className="border-primary/30">
                        Review Your Documents
                      </Button>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center mx-auto mb-6">
                    <Clock className="h-10 w-10 text-amber-400" />
                  </div>
                  <h1 className="text-3xl sm:text-5xl font-serif font-bold mb-4">
                    Awaiting <span className="text-gradient">Payment</span>
                  </h1>
                  <p className="text-sm text-muted-foreground mb-2">
                    {stkSent
                      ? "An M-Pesa payment prompt has been sent to your phone. Please enter your PIN to complete payment."
                      : "Complete your M-Pesa payment to unlock your documents."}
                  </p>
                  <p className="text-sm font-mono text-primary mb-8">Order ID: {orderId.slice(0, 8).toUpperCase()}</p>

                  <div className="rounded-xl border border-amber-500/20 bg-card p-6 text-left mb-6">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" /> M-Pesa Payment
                    </h3>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      {stkSent ? (
                        <>
                          <p>📱 Check your phone for the M-Pesa prompt and enter your PIN.</p>
                          <p>Once payment is complete, click the button below to confirm.</p>
                        </>
                      ) : (
                        <>
                          <p className="font-medium text-foreground">Manual Payment:</p>
                          <div className="space-y-1">
                            <p>1. Go to M-Pesa → Lipa na M-Pesa → Pay Bill</p>
                            <p>2. Business Number: <span className="font-mono text-primary">{import.meta.env.VITE_MPESA_SHORTCODE || "174379"}</span></p>
                            <p>3. Account Number: <span className="font-mono text-primary">{orderId.slice(0, 12).toUpperCase()}</span></p>
                            <p>4. Amount: <span className="font-semibold text-primary">{formatKES(total)}</span></p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      onClick={() => checkPaymentStatus(orderId)}
                      disabled={paymentChecking}
                      className="bg-gradient-brand border-0 font-semibold gold-shimmer"
                    >
                      {paymentChecking ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking...</>
                      ) : (
                        <>I've Paid — Confirm Payment <Check className="ml-2 h-4 w-4" /></>
                      )}
                    </Button>
                    <Link to="/">
                      <Button variant="outline" className="border-primary/30">Back to Home</Button>
                    </Link>
                  </div>

                  <p className="text-xs text-muted-foreground mt-4">
                    Your documents are being generated in the background. Once payment is confirmed, you'll get full access to edit and download them.
                  </p>
                </>
              )}
            </motion.div>
          </div>
        </section>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative z-10 pt-12 sm:pt-20 pb-10 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={0}
            className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold leading-[1.08] mb-4"
          >
            Start your <span className="text-gradient">order</span>
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={1}
            className="text-base text-muted-foreground max-w-xl mx-auto"
          >
            Select your services, fill in your details, and pay via M-Pesa. We'll get to work immediately.
          </motion.p>
        </div>
      </section>

      {/* Order Form */}
      <section className="relative z-10 pb-24 px-4">
        <div className="container max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-3">
              {/* Job context banner */}
              {jobFromQuery && (
                <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1}
                  className="rounded-xl border border-primary/20 bg-gradient-brand-subtle p-4 mb-6 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">CV tailored for: {jobFromQuery}</p>
                    {companyFromQuery && <p className="text-xs text-muted-foreground">at {companyFromQuery}</p>}
                    <p className="text-xs text-muted-foreground mt-0.5">CV pre-selected · add more services below to boost your application</p>
                  </div>
                </motion.div>
              )}

              {/* Recommended bundle when coming from a job */}
              {jobFromQuery && (
                <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1.5}
                  className="rounded-xl border border-accent/40 bg-accent/5 p-4 mb-6"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <p className="text-sm font-semibold">Recommended Bundle</p>
                    <span className="ml-auto text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full">Most Popular</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Applicants who add a Cover Letter + LinkedIn see <span className="font-semibold text-foreground">3× more interview callbacks</span>.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "cover-letter", label: "Cover Letter", price: 1500 },
                      { id: "linkedin", label: "LinkedIn Optimisation", price: 2000 },
                    ].map((item) => {
                      const alreadySelected = selectedServices.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          onClick={() => !alreadySelected && toggleService(item.id)}
                          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                            alreadySelected
                              ? "border-primary bg-primary/10 text-primary cursor-default"
                              : "border-border bg-card hover:border-primary/40 hover:bg-primary/5"
                          }`}
                        >
                          {alreadySelected ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <span className="text-primary">+</span>
                          )}
                          {item.label} · {formatKES(item.price)}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2}>
                <h2 className="text-xl font-bold mb-5">1. Choose your services</h2>
                <div className="grid grid-cols-1 gap-3 mb-8">
                  {SERVICES.map((s) => {
                    const selected = selectedServices.includes(s.id);
                    return (
                      <button
                        key={s.id}
                        onClick={() => toggleService(s.id)}
                        className={`rounded-xl border p-4 flex items-center gap-3 text-left transition-all duration-200 ${
                          selected
                            ? "border-primary bg-primary/10 shadow-glow-sm ring-2 ring-primary/30"
                            : "border-border bg-card hover:border-primary/30"
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                          selected ? "bg-gradient-brand" : "bg-muted"
                        }`}>
                          <s.icon className={`h-5 w-5 ${selected ? "text-primary-foreground" : "text-muted-foreground"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm">{s.label}</div>
                          <div className="text-xs text-primary font-bold">{formatKES(s.price)}</div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                          selected
                            ? "border-primary bg-primary"
                            : "border-muted-foreground/30 bg-transparent"
                        }`}>
                          {selected && <Check className="h-3.5 w-3.5 text-primary-foreground" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <h2 className="text-xl font-bold mb-5">2. Your details</h2>
                <div className="space-y-4 mb-6">
                  <Input
                    placeholder="Full name *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 bg-card border-border"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      placeholder="Email address *"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 bg-card border-border"
                    />
                    <div className="flex gap-2">
                      <div className="rounded-lg border border-border bg-card px-3 flex items-center text-sm text-muted-foreground shrink-0">
                        +254
                      </div>
                      <Input
                        placeholder="M-Pesa number *"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="h-12 bg-card border-border"
                      />
                    </div>
                  </div>
                </div>

                {selectedServices.length > 0 && (
                  <>
                    <h2 className="text-xl font-bold mb-5">3. Service-specific details</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                      The more detail you provide, the better your AI-generated documents will be.
                    </p>
                    <div className="mb-6">
                      <ServiceQuestions
                        selectedServices={selectedServices}
                        values={formValues}
                        onChange={handleFormChange}
                      />
                    </div>
                  </>
                )}

                <h2 className="text-xl font-bold mb-3">
                  {selectedServices.length > 0 ? "4" : "3"}. Upload existing documents
                </h2>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const droppedFiles = Array.from(e.dataTransfer.files);
                    const valid = droppedFiles.filter(f => f.size <= 10 * 1024 * 1024);
                    setFiles(prev => [...prev, ...valid]);
                  }}
                  className="rounded-xl border-2 border-dashed border-border bg-card/50 p-8 text-center cursor-pointer hover:border-primary/40 transition-colors"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-1">Drag & drop your existing CV, or click to browse</p>
                  <p className="text-xs text-muted-foreground">PDF, DOC, DOCX — Max 10MB</p>
                </div>
                {files.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {files.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm">
                        <FileText className="h-4 w-4 text-primary shrink-0" />
                        <span className="truncate flex-1">{f.name}</span>
                        <span className="text-xs text-muted-foreground shrink-0">{(f.size / 1024 / 1024).toFixed(1)}MB</span>
                        <button onClick={(e) => { e.stopPropagation(); removeFile(i); }} className="text-muted-foreground hover:text-destructive">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-2">
              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3}
                className="rounded-2xl border border-primary/20 bg-card p-6 sticky top-24"
              >
                <h3 className="font-bold text-lg mb-4">Order Summary</h3>
                {selectedServices.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4">Select services to get started</p>
                ) : (
                  <div className="space-y-3 mb-6">
                    {SERVICES.filter((s) => selectedServices.includes(s.id)).map((s) => (
                      <div key={s.id} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{s.label}</span>
                        <span className="font-semibold">{formatKES(s.price)}</span>
                      </div>
                    ))}
                    <div className="border-t border-border pt-3 flex items-center justify-between">
                      <span className="font-bold">Total</span>
                      <span className="text-2xl font-bold text-primary">{formatKES(total)}</span>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleSubmit}
                  disabled={selectedServices.length === 0 || !name.trim() || !email.trim() || !phone.trim() || isSubmitting}
                  className="w-full h-12 bg-gradient-brand border-0 font-semibold shadow-glow gold-shimmer text-base"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      Pay via M-Pesa <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
                {selectedServices.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    ↑ Select at least one service to continue
                  </p>
                )}
                {selectedServices.length > 0 && (!name.trim() || !email.trim() || !phone.trim()) && (
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Fill in your name, email, and M-Pesa number to continue
                  </p>
                )}

                <div className="mt-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                  <p className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                    📱 You'll receive an M-Pesa STK push to confirm payment
                  </p>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="h-3 w-3 text-primary" />
                    <span>Same-day delivery</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="h-3 w-3 text-primary" />
                    <span>Satisfaction guaranteed</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="h-3 w-3 text-primary" />
                    <span>Instant M-Pesa payment</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile sticky bottom bar */}
      <div className="fixed bottom-16 left-0 right-0 z-30 lg:hidden border-t border-border/60 bg-card/95 backdrop-blur-xl px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">
              {selectedServices.length === 0
                ? "No services selected"
                : `${selectedServices.length} service${selectedServices.length > 1 ? "s" : ""}`}
            </p>
            <p className="text-lg font-bold text-primary truncate">{formatKES(total)}</p>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={selectedServices.length === 0 || !name.trim() || !email.trim() || !phone.trim() || isSubmitting}
            className="h-11 px-6 bg-gradient-brand border-0 font-semibold shadow-glow gold-shimmer shrink-0"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>Pay Now <ArrowRight className="ml-1 h-4 w-4" /></>
            )}
          </Button>
        </div>
      </div>
      {/* Spacer so content isn't hidden behind sticky bar on mobile */}
      <div className="h-20 lg:hidden" />
    </PageLayout>
  );
}
