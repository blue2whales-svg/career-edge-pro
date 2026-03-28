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
import { Link, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import PageLayout from "@/components/PageLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { trackPurchase, trackViewContent } from "@/hooks/useFbPixel";
import ServiceQuestions from "@/components/order/ServiceQuestions";
import { useIsInternational } from "@/hooks/useIsInternational";
import { useUsdRate } from "@/hooks/useUsdRate";
import { PayPalButton } from "@/components/PayPalButton";

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
  if (cleaned.startsWith("254") && cleaned.length === 12) return cleaned;
  if (cleaned.startsWith("0") && cleaned.length === 10) return "254" + cleaned.slice(1);
  if ((cleaned.startsWith("7") || cleaned.startsWith("1")) && cleaned.length === 9) return "254" + cleaned;
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
  const [checkoutRequestId, setCheckoutRequestId] = useState("");
  const [documentsGenerating, setDocumentsGenerating] = useState(false);
  const [documentsGenerated, setDocumentsGenerated] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const { isInternational } = useIsInternational();
  const usdRate = useUsdRate();

  const jobFromQuery = searchParams.get("job_title");
  const companyFromQuery = searchParams.get("company");
  const packageParam = searchParams.get("package");
  const isPackageMode = !!(packageParam && PACKAGE_MAP[packageParam]);

  useEffect(() => {
    trackViewContent("Order", "Checkout");
    const pkg = searchParams.get("package");
    const singleService = searchParams.get("service");
    if (pkg && PACKAGE_MAP[pkg]) {
      setSelectedServices(PACKAGE_MAP[pkg].services);
      if (pkg === "international") setFormValues((prev) => ({ ...prev, cvPages: "2" }));
    } else if (singleService) {
      setSelectedServices((prev) => (prev.includes(singleService) ? prev : [...prev, singleService]));
    }
    if (jobFromQuery) {
      setFormValues((prev) => ({ ...prev, jobTitle: jobFromQuery, targetCompany: companyFromQuery || "" }));
    }
  }, [searchParams, jobFromQuery, companyFromQuery]);

  const toggleService = (id: string) => {
    setSelectedServices((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const subtotal = SERVICES.filter((s) => selectedServices.includes(s.id)).reduce((sum, s) => sum + s.price, 0);
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

  const runGenerateCv = async (formattedPhone?: string) => {
    try {
      setDocumentsGenerating(true);
      const phoneToUse = formattedPhone || formatPhone(phone.trim());
      const { error } = await supabase.functions.invoke("generate-cv", {
        body: {
          orderId,
          customer: { name: name.trim(), email: email.trim(), phone: phoneToUse },
          services: selectedServices,
          details: formValues,
        },
      });
      if (error) {
        console.error("generate-cv error:", error);
        toast({ title: "Payment confirmed, but document generation is delayed.", description: "Please wait a bit and refresh the review page shortly." });
        return;
      }
      setDocumentsGenerated(true);
    } catch (genErr) {
      console.error("generate-cv invoke failed:", genErr);
      toast({ title: "Payment confirmed, but document generation is delayed.", description: "Please wait a bit and refresh the review page shortly." });
    } finally {
      setDocumentsGenerating(false);
    }
  };

  const checkPaymentStatus = async () => {
    try {
      setPaymentChecking(true);
      if (!checkoutRequestId) {
        toast({ title: "Payment not yet linked", description: "Please complete the M-Pesa prompt on your phone first.", variant: "destructive" });
        return;
      }
      const response: any = await (supabase as any)
        .from("payments")
        .select("status, mpesa_code")
        .eq("checkout_request_id", checkoutRequestId)
        .maybeSingle();
      const data = response?.data;
      const error = response?.error;
      if (error) {
        console.warn("Payments query failed:", error);
        toast({ title: "Payment check temporarily unavailable.", description: "Please wait a few seconds and try again." });
        return;
      }
      if (data?.status === "COMPLETED") {
        setPaymentConfirmed(true);
        trackPurchase(total, "KES");
        if (!documentsGenerated && !documentsGenerating) await runGenerateCv();
        toast({ title: "Payment confirmed! 🎉", description: data?.mpesa_code ? `Receipt: ${data.mpesa_code}` : undefined });
      } else {
        toast({ title: "Payment not yet received. Please check your phone and try again.", variant: "destructive" });
      }
    } catch (err) {
      console.error("Payment status check error:", err);
    } finally {
      setPaymentChecking(false);
    }
  };

  const handleSubmit = async () => {
    if (selectedServices.length === 0) {
      toast({ title: "Select at least one service", variant: "destructive" });
      return;
    }
    const errors: Record<string, boolean> = {};
    if (!name.trim()) errors.name = true;
    if (!email.trim()) errors.email = true;
    if (!isInternational && !phone.trim()) errors.phone = true;
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      if (errors.name) nameRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      else if (errors.email) emailRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      else if (errors.phone) phoneRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      setTimeout(() => setValidationErrors({}), 3000);
      return;
    }
    setValidationErrors({});
    setIsSubmitting(true);
    try {
      const formattedPhone = formatPhone(phone.trim());
      const paymentRef = crypto.randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase();
      if (files.length > 0) {
        for (const file of files) {
          const filePath = `${paymentRef}/${Date.now()}-${file.name}`;
          const { error: uploadError } = await supabase.storage.from("order-documents").upload(filePath, file);
          if (uploadError) console.error("Upload error:", uploadError);
        }
      }
      setOrderId(paymentRef);
      setOrderPlaced(true);
      try {
        const { data: stkData, error: stkError } = await supabase.functions.invoke("mpesa-stk-push", {
          body: {
            phone: formattedPhone,
            amount: total,
            accountReference: paymentRef,
            transactionDesc: isPackageMode && packageParam ? PACKAGE_MAP[packageParam].label : selectedServices.join(", "),
          },
        });
        if (stkError) {
          console.error("STK push error:", stkError);
          setPaymentError("network");
          toast({ title: "Could not reach the payment service. Use the manual M-Pesa option below.", variant: "destructive" });
        } else if (stkData?.success === true) {
          setStkSent(true);
          setPaymentError(null);
          setCheckoutRequestId(stkData.checkoutRequestId || "");
          toast({ title: "Check your phone for the M-Pesa payment prompt 📱" });
        } else {
          console.error("STK response:", stkData);
          const errorCode = stkData?.errorCode || "";
          if (errorCode.includes("1001") || errorCode.includes("credentials")) {
            setPaymentError("credentials");
            toast({ title: "Payment service configuration issue. Please pay manually via M-Pesa below.", variant: "destructive" });
          } else if (errorCode.includes("500.003") || errorCode.includes("busy")) {
            setPaymentError("network");
            toast({ title: "M-Pesa is busy right now. Please retry in a moment or pay manually.", variant: "destructive" });
          } else {
            setPaymentError("generic");
            toast({ title: "M-Pesa request failed. Please try again or pay manually.", variant: "destructive" });
          }
        }
      } catch (stkErr) {
        console.error("STK invoke error:", stkErr);
        setPaymentError("network");
        toast({ title: "Could not reach payment service. Try the manual option below.", variant: "destructive" });
      }
      supabase.functions.invoke("notify-zapier", {
        body: {
          order: {
            id: paymentRef,
            name: name.trim(),
            email: email.trim(),
            phone: formattedPhone,
            services: selectedServices,
            details: formValues,
            total_amount: total,
            status: "pending",
          },
        },
      }).catch(console.error);
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
                    {documentsGenerating ? "Your AI-powered documents are being generated now..." : "Your AI-powered documents are being generated now!"}
                  </p>
                  <p className="text-sm font-mono text-primary mb-8">Order ID: {orderId.slice(0, 8).toUpperCase()}</p>
                  <di
