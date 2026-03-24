import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Upload,
  FileText,
  Pen,
  Linkedin,
  GraduationCap,
  Shield,
  Globe,
  Award,
  BookOpen,
  Users,
  Check,
  Loader2,
  X,
  Clock,
  Phone,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  WifiOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import PageLayout from "@/components/PageLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ServiceQuestions from "@/components/order/ServiceQuestions";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

const SERVICES = [
  {
    id: "cv",
    icon: FileText,
    label: "Professional CV",
    price: 1490,
    desc: "Corporate standard — clean layout trusted by HR managers",
  },
  {
    id: "executive-cv",
    icon: Award,
    label: "Executive CV",
    price: 2500,
    desc: "C-suite ready — highlights leadership, P&L, and board experience",
  },
  {
    id: "cover-letter",
    icon: Pen,
    label: "Cover Letter",
    price: 900,
    desc: "Tailored to the role — compelling story that gets you shortlisted",
  },
  {
    id: "linkedin",
    icon: Linkedin,
    label: "LinkedIn Optimisation",
    price: 2000,
    desc: "Keyword-rich profile that attracts recruiters and opportunities",
  },
  {
    id: "personal-statement",
    icon: BookOpen,
    label: "Personal Statement",
    price: 3000,
    desc: "UCAS & postgrad ready — showcases your academic passion",
  },
  {
    id: "scholarship",
    icon: GraduationCap,
    label: "Scholarship Essay",
    price: 3000,
    desc: "Chevening, Mastercard, DAAD — winning narratives that fund dreams",
  },
  {
    id: "reference",
    icon: Users,
    label: "Reference Letter",
    price: 800,
    desc: "Professional draft your referee can sign with confidence",
  },
  {
    id: "ats-cv",
    icon: Shield,
    label: "ATS-Optimised CV",
    price: 1490,
    desc: "Beats applicant tracking systems — keyword-matched for online portals",
  },
  {
    id: "modern-cv",
    icon: FileText,
    label: "Modern CV",
    price: 1200,
    desc: "Visual impact — contemporary design for tech, creative & startups",
  },
  {
    id: "international-cv",
    icon: Globe,
    label: "International CV",
    price: 2500,
    desc: "Formatted for Gulf, UK, EU — adapts photo, layout & conventions",
  },
  {
    id: "europass-cv",
    icon: Globe,
    label: "Europass CV",
    price: 3000,
    desc: "Professional Europass CV designed to European job market standards. Perfect for EU, UK and international applications.",
  },
  {
    id: "europass-cover-letter",
    icon: Globe,
    label: "Europass Cover Letter",
    price: 1500,
    desc: "Professionally written Europass Cover Letter tailored to European employer expectations.",
  },
  {
    id: "cv-review",
    icon: Check,
    label: "CV Review & Critique",
    price: 1000,
    desc: "Expert feedback on your current CV — detailed critique with actionable improvements.",
  },
];
function formatKES(amount: number) {
  return `KES ${amount.toLocaleString()}`;
}
function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("254") && cleaned.length === 12) {
    return cleaned;
  }
  if (cleaned.startsWith("0") && cleaned.length === 10) {
    return "254" + cleaned.slice(1);
  }
  if ((cleaned.startsWith("7") || cleaned.startsWith("1")) && cleaned.length === 9) {
    return "254" + cleaned;
  }
  return cleaned;
}

const PACKAGE_MAP: Record<string, { services: string[]; label: string; price: number }> = {
  starter: { services: ["cv"], label: "Starter Package", price: 1490 },
  professional: { services: ["cv", "cover-letter", "linkedin"], label: "Professional Package", price: 2490 },
  executive: { services: ["executive-cv", "cover-letter", "linkedin"], label: "Executive Package", price: 5490 },
  international: { services: ["ats-cv", "cover-letter", "linkedin"], label: "✈️ Going Abroad Package", price: 4490 },
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
  const [paymentError, setPaymentError] = useState<"credentials" | "network" | "generic" | null>(null);
  const [retryingPayment, setRetryingPayment] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});
  const [autoRetryCountdown, setAutoRetryCountdown] = useState(0);
  const [autoRetryAttempt, setAutoRetryAttempt] = useState(0);
  const maxAutoRetries = 3;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const autoRetryTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const jobFromQuery = searchParams.get("job_title");
  const companyFromQuery = searchParams.get("company");
  const packageParam = searchParams.get("package");
  const isPackageMode = !!(packageParam && PACKAGE_MAP[packageParam]);

  useEffect(() => {
    const pkg = searchParams.get("package");
    const singleService = searchParams.get("service");
    if (pkg && PACKAGE_MAP[pkg]) {
      setSelectedServices(PACKAGE_MAP[pkg].services);
      // Auto-set 2 pages for international package
      if (pkg === "international") {
        setFormValues((prev) => ({ ...prev, cvPages: "2" }));
      }
    } else if (singleService) {
      setSelectedServices((prev) => (prev.includes(singleService) ? prev : [...prev, singleService]));
    }
    // Pre-fill job title if coming from jobs board
    if (jobFromQuery) {
      setFormValues((prev) => ({ ...prev, jobTitle: jobFromQuery, targetCompany: companyFromQuery || "" }));
    }
  }, [searchParams]);

  const toggleService = (id: string) => {
    setSelectedServices((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const subtotal = SERVICES.filter((s) => selectedServices.includes(s.id)).reduce((sum, s) => sum + s.price, 0);
  // If coming from a package, use the package price; otherwise use subtotal
  const total = isPackageMode && packageParam ? PACKAGE_MAP[packageParam].price : subtotal;

  const handleFormChange = (key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    const valid = selected.filter((f) => f.size <= 10 * 1024 * 1024);
    if (valid.length < selected.length) {
      toast({ title: "Some files exceed 10MB and were skipped", variant: "destructive" });
    }
    setFiles((prev) => [...prev, ...valid]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const checkPaymentStatus = async (id: string) => {
    setPaymentChecking(true);
    const { data } = await supabase.from("orders").select("status").eq("id", id).maybeSingle();

    if (data?.status === "paid") {
      setPaymentConfirmed(true);
      toast({ title: "Payment confirmed! 🎉" });
    } else {
      toast({ title: "Payment not yet received. Please complete your M-Pesa payment and try again.", variant: "destructive" });
    }
    setPaymentChecking(false);
  };

  const handleSubmit = async () => {
    if (selectedServices.length === 0) {
      toast({ title: "Select at least one service", variant: "destructive" });
      return;
    }

    const errors: Record<string, boolean> = {};
    if (!name.trim()) errors.name = true;
    if (!email.trim()) errors.email = true;
    if (!phone.trim()) errors.phone = true;

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      // Scroll to first error
      if (errors.name) nameRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      else if (errors.email) emailRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      else if (errors.phone) phoneRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      // Clear errors after animation
      setTimeout(() => setValidationErrors({}), 3000);
      return;
    }
    setValidationErrors({});

    setIsSubmitting(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Combine all form values into details JSON
      const allDetails = JSON.stringify(formValues);

      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          user_id: user?.id || null,
          name: name.trim(),
          email: email.trim(),
          phone: formatPhone(phone.trim()) || null,
          services: selectedServices,
          details: allDetails,
          total_amount: total,
          status: "pending",
          job_title: formValues.jobTitle?.trim() || formValues.coverLetterRole?.trim() || null,
          experience: formValues.experience?.trim() || null,
          skills: formValues.skills?.trim() || null,
          education: formValues.education?.trim() || null,
        } as any)
        .select()
        .single();

      if (error) throw error;

      if (files.length > 0) {
        for (const file of files) {
          const filePath = `${order.id}/${Date.now()}-${file.name}`;
          const { error: uploadError } = await supabase.storage.from("order-documents").upload(filePath, file);
          if (uploadError) console.error("Upload error:", uploadError);
        }
      }

      setOrderId(order.id);
      setOrderPlaced(true);

      // Auto-retry STK push helper
      const isBusyError = (data: any): boolean => {
        const code = String(data?.errorCode || data?.ResponseCode || "");
        const msg = String(data?.errorMessage || data?.ResponseDescription || "").toLowerCase();
        return code.includes("500.003") || msg.includes("busy") || code.includes("busy");
      };

      const fireStkPush = async () => {
        const { data: stkData, error: stkError } = await supabase.functions.invoke("mpesa-stk-push", {
          body: {
            orderId: order.id,
            phone: formatPhone(phone.trim()),
            amount: total,
            packageName: isPackageMode && packageParam ? PACKAGE_MAP[packageParam].label : selectedServices.join(", "),
            fullName: name.trim(),
            email: email.trim(),
          },
        });
        return { stkData, stkError };
      };

      const attemptStk = async (attempt: number) => {
        try {
          const { stkData, stkError } = await fireStkPush();

          if (stkError) {
            if (attempt < maxAutoRetries) {
              toast({ title: `Connection error — retrying (${attempt}/${maxAutoRetries})…`, variant: "destructive" });
              await countdownAndRetry(attempt + 1);
              return;
            }
            setPaymentError("network");
            toast({ title: "Could not reach the payment service. Use the manual M-Pesa option below.", variant: "destructive" });
            return;
          }

          if (stkData?.ResponseCode === "0") {
            setStkSent(true);
            setPaymentError(null);
            setAutoRetryCountdown(0);
            setAutoRetryAttempt(0);
            toast({ title: "Check your phone for the M-Pesa payment prompt 📱" });
            return;
          }

          const errorCode = stkData?.errorCode || "";
          if (isBusyError(stkData) && attempt < maxAutoRetries) {
            toast({ title: `M-Pesa busy — retrying (${attempt}/${maxAutoRetries})…`, variant: "destructive" });
            await countdownAndRetry(attempt + 1);
            return;
          }

          // Non-retryable or exhausted retries
          if (errorCode.includes("1001") || errorCode.includes("credentials")) {
            setPaymentError("credentials");
            toast({ title: "Payment service configuration issue. Please pay manually via M-Pesa below.", variant: "destructive" });
          } else if (isBusyError(stkData)) {
            setPaymentError("network");
            toast({ title: "M-Pesa is still busy after retries. Please pay manually below.", variant: "destructive" });
          } else {
            setPaymentError("generic");
            toast({ title: "M-Pesa request failed. Please try again or pay manually.", variant: "destructive" });
          }
        } catch (err) {
          if (attempt < maxAutoRetries) {
            toast({ title: `Error — retrying (${attempt}/${maxAutoRetries})…`, variant: "destructive" });
            await countdownAndRetry(attempt + 1);
            return;
          }
          setPaymentError("network");
          toast({ title: "Could not reach payment service. Try the manual option below.", variant: "destructive" });
        }
      };

      const countdownAndRetry = (nextAttempt: number): Promise<void> => {
        return new Promise((resolve) => {
          let seconds = 15;
          setAutoRetryCountdown(seconds);
          setAutoRetryAttempt(nextAttempt);
          if (autoRetryTimerRef.current) clearInterval(autoRetryTimerRef.current);
          autoRetryTimerRef.current = setInterval(() => {
            seconds -= 1;
            setAutoRetryCountdown(seconds);
            if (seconds <= 0) {
              if (autoRetryTimerRef.current) clearInterval(autoRetryTimerRef.current);
              attemptStk(nextAttempt).then(resolve);
            }
          }, 1000);
        });
      };

      await attemptStk(1);

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
                  <p className="text-sm text-muted-foreground mb-2">
                    Your AI-powered documents are being generated now!
                  </p>
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
                    <p className="text-xs text-muted-foreground">
                      Browse open roles and apply instantly with your new professional CV.
                    </p>
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
                  <p className="text-sm font-mono text-primary mb-6">Order ID: {orderId.slice(0, 8).toUpperCase()}</p>

                  {/* Auto-retry countdown */}
                  {autoRetryCountdown > 0 && (
                    <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-center mb-6">
                      <p className="text-sm font-medium text-amber-400">
                        M-Pesa busy — Retrying in {autoRetryCountdown}s… (Attempt {autoRetryAttempt}/{maxAutoRetries})
                      </p>
                      <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                        <div className="bg-amber-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${(autoRetryCountdown / 15) * 100}%` }} />
                      </div>
                    </div>
                  )}

                  {/* Contextual error banner */}
                  {paymentError && (
                    <div
                      className={`rounded-xl border p-4 text-left mb-6 ${
                        paymentError === "credentials"
                          ? "border-destructive/30 bg-destructive/5"
                          : paymentError === "network"
                            ? "border-amber-500/30 bg-amber-500/5"
                            : "border-muted bg-muted/30"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {paymentError === "network" ? (
                          <WifiOff className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="text-sm font-semibold text-foreground mb-1">
                            {paymentError === "credentials"
                              ? "Automatic payment unavailable"
                              : paymentError === "network"
                                ? "M-Pesa is temporarily busy"
                                : "Payment prompt failed"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {paymentError === "credentials"
                              ? "The automatic M-Pesa prompt couldn't be sent due to a configuration issue. Please use the manual payment steps below — your order is safe."
                              : paymentError === "network"
                                ? "Safaricom's servers are experiencing high traffic. You can retry in a moment or pay manually below."
                                : "Something went wrong sending the M-Pesa prompt. Please retry or use the manual payment option."}
                          </p>
                          {paymentError !== "credentials" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="mt-3 border-primary/30 text-xs"
                              disabled={retryingPayment}
                              onClick={async () => {
                                setRetryingPayment(true);
                                try {
                                  const { data: stkData, error: stkError } = await supabase.functions.invoke(
                                    "mpesa-stk-push",
                                    {
                                      body: {
                                        orderId,
                                        phone: formatPhone(phone.trim()),
                                        amount: total,
                                        packageName:
                                          isPackageMode && packageParam
                                            ? PACKAGE_MAP[packageParam].label
                                            : selectedServices.join(", "),
                                        fullName: name.trim(),
                                        email: email.trim(),
                                      },
                                    },
                                  );
                                  if (!stkError && stkData?.ResponseCode === "0") {
                                    setStkSent(true);
                                    setPaymentError(null);
                                    toast({ title: "Check your phone for the M-Pesa prompt 📱" });
                                  } else {
                                    toast({
                                      title: "Still unable to send prompt. Please pay manually.",
                                      variant: "destructive",
                                    });
                                  }
                                } catch {
                                  toast({ title: "Could not reach payment service.", variant: "destructive" });
                                } finally {
                                  setRetryingPayment(false);
                                }
                              }}
                            >
                              {retryingPayment ? (
                                <>
                                  <Loader2 className="mr-1.5 h-3 w-3 animate-spin" /> Retrying…
                                </>
                              ) : (
                                <>
                                  <RefreshCw className="mr-1.5 h-3 w-3" /> Retry M-Pesa Prompt
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="rounded-xl border border-border bg-card p-6 text-left mb-6">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" /> M-Pesa Payment
                    </h3>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      {stkSent && !paymentError ? (
                        <>
                          <p>📱 Check your phone for the M-Pesa prompt and enter your PIN.</p>
                          <p>Once payment is complete, click the button below to confirm.</p>
                        </>
                      ) : (
                        <>
                          <p className="font-medium text-foreground">Pay manually via M-Pesa:</p>
                          <div className="space-y-1">
                            <p>1. Go to M-Pesa → Lipa na M-Pesa → Pay Bill</p>
                            <p>
                              2. Business Number: <span className="font-mono text-primary">4561075</span>
                            </p>
                            <p>
                              3. Account Number:{" "}
                              <span className="font-mono text-primary">{orderId.slice(0, 12).toUpperCase()}</span>
                            </p>
                            <p>
                              4. Amount: <span className="font-semibold text-primary">{formatKES(total)}</span>
                            </p>
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
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking...
                        </>
                      ) : (
                        <>
                          Confirm Payment Now <Check className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                    <Link to="/">
                      <Button variant="outline" className="border-primary/30">
                        Back to Home
                      </Button>
                    </Link>
                  </div>

                  <p className="text-xs text-muted-foreground mt-4">
                    Your documents are being generated in the background. Once payment is confirmed, you'll get full
                    access to edit and download them.
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
      <section className="relative z-10 pt-8 sm:pt-16 pb-6 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
            className="text-2xl sm:text-5xl lg:text-6xl font-serif font-bold leading-[1.08] mb-3"
          >
            Start your <span className="text-gradient">order</span>
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto"
          >
            Select your services, fill in your details, and pay via M-Pesa. We'll get to work immediately.
          </motion.p>
        </div>
      </section>

      {/* Order Form */}
      <section className="relative z-10 pb-32 md:pb-40 px-4">
        <div className="container max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-3">
              {/* Job context banner */}
              {jobFromQuery && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  custom={1}
                  className="rounded-xl border border-primary/20 bg-gradient-brand-subtle p-3 sm:p-4 mb-4 flex items-start gap-3"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-semibold leading-snug">CV tailored for: {jobFromQuery}</p>
                    {companyFromQuery && <p className="text-[11px] text-muted-foreground">at {companyFromQuery}</p>}
                    <p className="text-[11px] text-muted-foreground mt-0.5">Choose your preferred CV type below</p>
                  </div>
                </motion.div>
              )}

              {/* Recommended bundle when coming from a job */}
              {jobFromQuery && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  custom={1.5}
                  className="rounded-xl border border-accent/40 bg-accent/5 p-3 sm:p-4 mb-4"
                >
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Sparkles className="h-4 w-4 text-primary shrink-0" />
                    <p className="text-xs sm:text-sm font-semibold">Recommended Bundle</p>
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      Most Popular
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mb-3">
                    Add a Cover Letter + LinkedIn for{" "}
                    <span className="font-semibold text-foreground">3× more callbacks</span>.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    {[
                      { id: "cover-letter", label: "Cover Letter", price: 1500 },
                      { id: "linkedin", label: "LinkedIn", price: 2000 },
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
                          {alreadySelected ? <Check className="h-3 w-3" /> : <span className="text-primary">+</span>}
                          {item.label} · {formatKES(item.price)}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* International Bundle Promo — only show when not in package mode */}
              {!isPackageMode && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  custom={1.8}
                  className="rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-card to-accent/5 p-4 sm:p-5 mb-5 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg">
                    Save KES 2,000
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-5 w-5 text-primary shrink-0" />
                    <h3 className="text-sm sm:text-base font-bold">✈️ Going Abroad?</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 leading-relaxed">
                    Get our{" "}
                    <span className="font-semibold text-foreground">
                      ATS CV (international standard) + Cover Letter + LinkedIn Revamp
                    </span>{" "}
                    — keyword-optimised for global portals, 2 professional pages, and a comprehensive LinkedIn makeover.
                  </p>
                   <div className="flex items-center gap-3 mb-3">
                     <span className="text-xs text-muted-foreground line-through">KES 6,500</span>
                     <span className="text-lg font-bold text-primary">KES 4,490</span>
                   </div>
                  {packageParam === "international" ? (
                    <div className="inline-flex items-center gap-1.5 rounded-lg border border-primary bg-primary/10 px-4 py-2 text-xs font-semibold text-primary">
                      <Check className="h-3.5 w-3.5" /> Bundle Selected
                    </div>
                  ) : (
                    <Link to="/order?package=international">
                      <Button size="sm" className="bg-gradient-brand border-0 font-semibold text-xs gold-shimmer">
                        <Globe className="mr-1.5 h-3.5 w-3.5" /> Get International Bundle
                      </Button>
                    </Link>
                  )}
                </motion.div>
              )}

              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2}>
                {/* Package Mode: Show selected package summary instead of service list */}
                {isPackageMode && packageParam ? (
                  <div className="mb-6">
                    <div className="rounded-xl border border-primary/20 bg-gradient-brand-subtle p-4 sm:p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          {packageParam === "international" ? (
                            <Globe className="h-4 w-4 text-primary" />
                          ) : (
                            <Award className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div>
                          <h2 className="text-base sm:text-lg font-bold">{PACKAGE_MAP[packageParam].label}</h2>
                          <p className="text-lg font-bold text-primary">{formatKES(PACKAGE_MAP[packageParam].price)}</p>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        {PACKAGE_MAP[packageParam].services.map((sId) => {
                          const svc = SERVICES.find((s) => s.id === sId);
                          return svc ? (
                            <div key={sId} className="flex items-center gap-2 text-sm">
                              <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                              <span className="text-muted-foreground">{svc.label}</span>
                            </div>
                          ) : null;
                        })}
                        {packageParam === "international" && (
                          <div className="flex items-center gap-2 text-sm">
                            <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                            <span className="text-muted-foreground">2-page international standard format</span>
                          </div>
                        )}
                      </div>
                      <Link to="/order" className="inline-block mt-3">
                        <button className="text-xs text-primary underline underline-offset-2 hover:text-primary/80">
                          Change package / pick individual services
                        </button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-lg sm:text-xl font-bold mb-4">1. Choose your CV type & services</h2>
                    <div className="grid grid-cols-1 gap-2 sm:gap-3 mb-6">
                      {SERVICES.map((s) => {
                        const selected = selectedServices.includes(s.id);
                        return (
                          <button
                            key={s.id}
                            onClick={() => toggleService(s.id)}
                            className={`rounded-xl border p-3 sm:p-4 flex items-center gap-3 text-left transition-all duration-200 ${
                              selected
                                ? "border-primary bg-primary/10 shadow-glow-sm ring-2 ring-primary/30"
                                : "border-border bg-card hover:border-primary/30"
                            }`}
                          >
                            <div
                              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 ${
                                selected ? "bg-gradient-brand" : "bg-muted"
                              }`}
                            >
                              <s.icon
                                className={`h-4 w-4 sm:h-5 sm:w-5 ${selected ? "text-primary-foreground" : "text-muted-foreground"}`}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-xs sm:text-sm">{s.label}</div>
                              <div className="text-[10px] sm:text-[11px] text-muted-foreground leading-tight mt-0.5 line-clamp-2">
                                {s.desc}
                              </div>
                              <div className="text-xs text-primary font-bold mt-0.5">{formatKES(s.price)}</div>
                            </div>
                            <div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                                selected ? "border-primary bg-primary" : "border-muted-foreground/30 bg-transparent"
                              }`}
                            >
                              {selected && <Check className="h-3.5 w-3.5 text-primary-foreground" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}

                <h2 className="text-lg sm:text-xl font-bold mb-4">{isPackageMode ? "1" : "2"}. Your details</h2>
                <div className="space-y-4 mb-6">
                  <div>
                    <Input
                      ref={nameRef}
                      placeholder="Full name *"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setValidationErrors((prev) => ({ ...prev, name: false }));
                      }}
                      className={cn(
                        "h-12 bg-card border-border transition-all",
                        validationErrors.name && "border-destructive ring-2 ring-destructive/30 animate-bounce-subtle",
                      )}
                    />
                    {validationErrors.name && (
                      <p className="text-xs text-destructive mt-1 animate-pulse font-medium">⚠ Full name is required</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Input
                        ref={emailRef}
                        placeholder="Email address *"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setValidationErrors((prev) => ({ ...prev, email: false }));
                        }}
                        className={cn(
                          "h-12 bg-card border-border transition-all",
                          validationErrors.email &&
                            "border-destructive ring-2 ring-destructive/30 animate-bounce-subtle",
                        )}
                      />
                      {validationErrors.email && (
                        <p className="text-xs text-destructive mt-1 animate-pulse font-medium">
                          ⚠ Email address is required
                        </p>
                      )}
                    </div>
                    <div>
                      <div>
  <div className="flex gap-2">
    <Input
      ref={phoneRef}
      placeholder="M-Pesa number *"
      value={phone}
      onChange={(e) => {
        setPhone(e.target.value);
        setValidationErrors((prev) => ({ ...prev, phone: false }));
      }}
      className={cn(
        "h-12 bg-card border-border transition-all",
        validationErrors.phone &&
          "border-destructive ring-2 ring-destructive/30 animate-bounce-subtle",
      )}
    />
  </div>
                          ref={phoneRef}
                          placeholder="M-Pesa number *"
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value);
                            setValidationErrors((prev) => ({ ...prev, phone: false }));
                          }}
                          className={cn(
                            "h-12 bg-card border-border transition-all",
                            validationErrors.phone &&
                              "border-destructive ring-2 ring-destructive/30 animate-bounce-subtle",
                          )}
                        />
                      </div>
                      {validationErrors.phone && (
                        <p className="text-xs text-destructive mt-1 animate-pulse font-medium">
                          ⚠ M-Pesa number is required for payment
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {selectedServices.length > 0 && (
                  <>
                    <h2 className="text-lg sm:text-xl font-bold mb-4">
                      {isPackageMode ? "2" : "3"}. Service-specific details
                    </h2>
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

                <h2 className="text-lg sm:text-xl font-bold mb-3">
                  {isPackageMode ? (selectedServices.length > 0 ? "3" : "2") : selectedServices.length > 0 ? "4" : "3"}.
                  Upload documents <span className="text-xs font-normal text-muted-foreground">(optional)</span>
                </h2>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const droppedFiles = Array.from(e.dataTransfer.files);
                    const valid = droppedFiles.filter((f) => f.size <= 10 * 1024 * 1024);
                    setFiles((prev) => [...prev, ...valid]);
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
                      <div
                        key={i}
                        className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm"
                      >
                        <FileText className="h-4 w-4 text-primary shrink-0" />
                        <span className="truncate flex-1">{f.name}</span>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {(f.size / 1024 / 1024).toFixed(1)}MB
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(i);
                          }}
                          className="text-muted-foreground hover:text-destructive"
                        >
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
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={3}
                className="rounded-2xl border border-primary/20 bg-card p-6 sticky top-24 z-[60]"
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
                    {isPackageMode && packageParam && (
                      <div className="flex items-center justify-between text-sm text-primary">
                        <span className="font-medium">📦 Package Price</span>
                        <span className="font-semibold">{formatKES(PACKAGE_MAP[packageParam].price)}</span>
                      </div>
                    )}
                    <div className="border-t border-border pt-3 flex items-center justify-between">
                      <span className="font-bold">Total</span>
                      <div className="text-right">
                        {isPackageMode && subtotal > total && (
                          <span className="text-xs text-muted-foreground line-through block">
                            {formatKES(subtotal)}
                          </span>
                        )}
                        <span className="text-2xl font-bold text-primary">{formatKES(total)}</span>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleSubmit}
                  disabled={
                    selectedServices.length === 0 || !name.trim() || !email.trim() || !phone.trim() || isSubmitting
                  }
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
              <>
                Pay Now <ArrowRight className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
      {/* Spacer so content isn't hidden behind sticky bar on mobile */}
      <div className="h-20 lg:hidden" />
    </PageLayout>
  );
}
