import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Smartphone, Phone, CheckCircle, AlertTriangle, Loader2, MessageCircle, Circle, Send, Clock, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PAYBILL = "4561075";

const PACKAGES = [
  { value: "starter", label: "Starter — KES 1,490", amount: 1490 },
  { value: "professional", label: "Professional — KES 2,490", amount: 2490 },
  { value: "executive", label: "Executive — KES 5,490", amount: 5490 },
  { value: "cover-letter", label: "Cover Letter Only — KES 1,000", amount: 1000 },
  { value: "cv-review", label: "Expert CV Review — KES 1,000", amount: 1000 },
  { value: "global", label: "Global Assistance — KES 20,000", amount: 20000 },
  { value: "pro-monthly", label: "CV Edge Pro — KES 2,000/month", amount: 2000 },
  { value: "pro-plus", label: "CV Edge Pro Plus — KES 2,500/month", amount: 2500 },
  { value: "recruiter-basic", label: "Basic Job Post — KES 3,000", amount: 3000 },
  { value: "recruiter-featured", label: "Featured Job Post — KES 10,000", amount: 10000 },
  { value: "recruiter-pro", label: "Recruiter Pro — KES 25,000/month", amount: 25000 },
];

function formatPhoneForDisplay(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length >= 12 && digits.startsWith("254")) {
    return `0${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`;
  }
  return phone;
}

function formatPhone(input: string): string {
  let phone = input.replace(/\D/g, "");
  if (phone.startsWith("0")) phone = "254" + phone.slice(1);
  if (phone.startsWith("7")) phone = "254" + phone;
  if (!phone.startsWith("254")) phone = "254" + phone;
  return phone;
}

type ModalStep = "form" | "waiting" | "success" | "failed";
type TimelineStage = "initiated" | "prompt_sent" | "waiting_pin" | "confirmed" | "failed";

const TIMELINE_STEPS: { key: TimelineStage; label: string }[] = [
  { key: "initiated", label: "Payment initiated" },
  { key: "prompt_sent", label: "STK prompt sent to phone" },
  { key: "waiting_pin", label: "Waiting for M-Pesa PIN" },
  { key: "confirmed", label: "Payment confirmed" },
];

function TimelineIcon({ active, done, failed }: { active: boolean; done: boolean; failed: boolean }) {
  if (failed) return <AlertTriangle className="h-4 w-4 text-destructive" />;
  if (done) return <CheckCircle className="h-4 w-4 text-primary" />;
  if (active) return <Loader2 className="h-4 w-4 text-primary animate-spin" />;
  return <Circle className="h-4 w-4 text-muted-foreground/40" />;
}

function PaymentTimeline({ stage }: { stage: TimelineStage }) {
  const stageIndex = stage === "failed"
    ? TIMELINE_STEPS.findIndex(s => s.key === "waiting_pin")
    : TIMELINE_STEPS.findIndex(s => s.key === stage);

  return (
    <div className="flex flex-col gap-0 text-left">
      {TIMELINE_STEPS.map((step, i) => {
        const isFailed = stage === "failed" && i === stageIndex;
        const isDone = i < stageIndex || (stage === "confirmed" && i <= stageIndex);
        const isActive = !isFailed && i === stageIndex && stage !== "confirmed";

        return (
          <div key={step.key} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <TimelineIcon active={isActive} done={isDone} failed={isFailed} />
              {i < TIMELINE_STEPS.length - 1 && (
                <div className={`w-px h-5 ${isDone ? "bg-primary/60" : "bg-muted-foreground/20"}`} />
              )}
            </div>
            <span className={`text-xs leading-4 pb-1 ${isDone ? "text-foreground font-medium" : isActive ? "text-foreground font-medium" : isFailed ? "text-destructive font-medium" : "text-muted-foreground"}`}>
              {isFailed ? "Payment failed or timed out" : step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function PaybillCard({ orderId, amount }: { orderId: string; amount: number }) {
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-4 text-left space-y-2 text-sm">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Pay via Lipa na M-Pesa</p>
      <div className="flex justify-between">
        <span className="text-muted-foreground">1. Go to</span>
        <span className="font-medium">M-Pesa → Pay Bill</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">2. Business No:</span>
        <span className="font-mono font-bold text-primary">{PAYBILL}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">3. Account No:</span>
        <span className="font-mono font-bold text-xs">{orderId}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">4. Amount:</span>
        <span className="font-mono font-bold">KES {amount.toLocaleString()}</span>
      </div>
    </div>
  );
}

interface MpesaPaymentModalProps {
  open: boolean;
  onClose: () => void;
  defaultPackage?: string;
  onPaymentSuccess?: () => void;
}

export default function MpesaPaymentModal({ open, onClose, defaultPackage = "professional", onPaymentSuccess }: MpesaPaymentModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedPackage, setSelectedPackage] = useState(defaultPackage);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<ModalStep>("form");
  const [timelineStage, setTimelineStage] = useState<TimelineStage>("initiated");
  const [orderId, setOrderId] = useState("");
  const [checkoutRequestId, setCheckoutRequestId] = useState("");
  const [mpesaCode, setMpesaCode] = useState("");
  const [confirmedAmount, setConfirmedAmount] = useState(0);
  const [retryCountdown, setRetryCountdown] = useState(0);
  const [retryAttempt, setRetryAttempt] = useState(0);
  const [maxRetries] = useState(3);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pkg = PACKAGES.find(p => p.value === selectedPackage) || PACKAGES[1];

  useEffect(() => {
    if (open) {
      setStep("form");
      setLoading(false);
      setSelectedPackage(defaultPackage);
      setTimelineStage("initiated");
      setRetryCountdown(0);
      setRetryAttempt(0);
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [open, defaultPackage]);

  const startPolling = (crId: string) => {
    pollRef.current = setInterval(async () => {
      try {
        const { data } = await supabase
          .from("orders")
          .select("status, mpesa_receipt")
          .eq("mpesa_checkout_request_id", crId)
          .maybeSingle();

        const row = data as { status: string; mpesa_receipt: string | null } | null;
        if (row?.status === "paid") {
          clearInterval(pollRef.current!);
          clearTimeout(timeoutRef.current!);
          setMpesaCode(row.mpesa_receipt || "");
          setConfirmedAmount(pkg.amount);
          if (selectedPackage === "pro-monthly" || selectedPackage === "pro-plus") {
            localStorage.setItem("cvedge_pro", "true");
          }
          setTimelineStage("confirmed");
          setStep("success");
          onPaymentSuccess?.();
        } else if (row?.status === "failed" || row?.status === "payment_failed") {
          clearInterval(pollRef.current!);
          clearTimeout(timeoutRef.current!);
          setTimelineStage("failed");
          setStep("failed");
        }
      } catch {
        // continue polling
      }
    }, 5000);

    timeoutRef.current = setTimeout(() => {
      if (pollRef.current) clearInterval(pollRef.current);
      setTimelineStage("failed");
      setStep("failed");
    }, 120000);
  };

  const isBusyError = (data: any): boolean => {
    const code = String(data?.errorCode || data?.ResponseCode || "");
    const msg = String(data?.errorMessage || data?.ResponseDescription || "").toLowerCase();
    return code.includes("500.003") || msg.includes("busy") || code.includes("busy");
  };

  const fireStkPush = async (formattedPhone: string, generatedOrderId: string) => {
    const STK_URL = `https://wspugvdwodqdlyamxzxj.supabase.co/functions/v1/mpesa-stk-push`;
    const res = await fetch(STK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({
        phone: formattedPhone,
        amount: pkg.amount,
        packageName: pkg.label,
        orderId: generatedOrderId,
        fullName: fullName.trim(),
        email: email.trim(),
      }),
    });
    return await res.json();
  };

  const startRetryCountdown = (formattedPhone: string, generatedOrderId: string, attempt: number) => {
    let seconds = 15;
    setRetryCountdown(seconds);
    setRetryAttempt(attempt);
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      seconds -= 1;
      setRetryCountdown(seconds);
      if (seconds <= 0) {
        if (countdownRef.current) clearInterval(countdownRef.current);
        attemptStkPush(formattedPhone, generatedOrderId, attempt);
      }
    }, 1000);
  };

  const attemptStkPush = async (formattedPhone: string, generatedOrderId: string, attempt: number) => {
    try {
      const data = await fireStkPush(formattedPhone, generatedOrderId);

      if (data?.ResponseCode === "0") {
        setCheckoutRequestId(data.CheckoutRequestID || "");
        setTimelineStage("prompt_sent");
        setRetryCountdown(0);
        setRetryAttempt(0);
        toast.success("Check your phone for the M-Pesa prompt 📱");
        setTimeout(() => setTimelineStage("waiting_pin"), 3000);
        if (data.CheckoutRequestID) startPolling(data.CheckoutRequestID);
        return;
      }

      if (isBusyError(data) && attempt < maxRetries) {
        toast.error(`M-Pesa busy — retrying (${attempt}/${maxRetries})...`);
        startRetryCountdown(formattedPhone, generatedOrderId, attempt + 1);
        return;
      }

      // All retries exhausted or non-busy error
      console.error("STK push failed:", data);
      setTimelineStage("failed");
      setStep("failed");
      setRetryCountdown(0);
      toast.error("M-Pesa prompt failed. Please pay manually using Paybill below.");
    } catch (err) {
      console.error("Payment error:", err);
      if (attempt < maxRetries) {
        toast.error(`Connection error — retrying (${attempt}/${maxRetries})...`);
        startRetryCountdown(formattedPhone, generatedOrderId, attempt + 1);
        return;
      }
      setTimelineStage("failed");
      setStep("failed");
      setRetryCountdown(0);
      toast.error("Could not reach payment service. Use Paybill below.");
    }
  };

  const handleSubmit = async () => {
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const formattedPhone = formatPhone(phone);
    if (formattedPhone.length < 12) {
      toast.error("Please enter a valid Kenyan phone number");
      return;
    }

    setLoading(true);
    setRetryAttempt(0);
    setRetryCountdown(0);
    const generatedOrderId = "CVE-" + Date.now();
    setOrderId(generatedOrderId);
    setStep("waiting");
    setTimelineStage("initiated");

    await attemptStkPush(formattedPhone, generatedOrderId, 1);
    setLoading(false);
  };

  const handleClose = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="w-full max-w-[460px] rounded-2xl border border-border bg-card p-6 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={handleClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>

            {/* FORM STEP */}
            {step === "form" && (
              <>
                <h3 className="font-serif font-bold text-xl mb-1">M-Pesa Payment</h3>
                <p className="text-sm text-muted-foreground mb-6">Complete your order via M-Pesa</p>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm">Full Name *</Label>
                    <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-sm">Email Address *</Label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-sm">M-Pesa Phone Number *</Label>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0712 345 678" className="mt-1" />
                    <p className="text-xs text-muted-foreground mt-1">Kenyan number (07XX or 01XX)</p>
                  </div>
                  <div>
                    <Label className="text-sm">Package</Label>
                    <Select value={selectedPackage} onValueChange={setSelectedPackage}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PACKAGES.map((p) => (
                          <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full h-12 font-bold text-base border-0 bg-gradient-brand gold-shimmer"
                  >
                    {loading ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Processing...</>
                    ) : (
                      `Pay KES ${pkg.amount.toLocaleString()} via M-Pesa →`
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Lock className="h-3 w-3" />
                    <span>Secured by Safaricom M-Pesa</span>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Lock className="h-3 w-3 text-primary" /> Secure M-Pesa</span>
                    <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-primary" /> SSL Protected</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3 text-primary" /> 2,400+ Clients</span>
                  </div>
                  <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
                    <span>Paybill: {PAYBILL}</span>
                  </div>
                </div>
              </>
            )}

            {/* WAITING STEP */}
            {step === "waiting" && (
              <div className="py-4 space-y-5">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Phone className="h-8 w-8 text-primary animate-pulse" />
                  </div>
                  <h3 className="font-serif font-bold text-xl mb-1">📱 Check Your Phone!</h3>
                  <p className="text-sm text-muted-foreground">
                    M-Pesa prompt sent to <strong>{formatPhoneForDisplay(formatPhone(phone))}</strong>
                  </p>
                </div>

                {/* Payment Timeline */}
                <div className="rounded-xl border border-border bg-muted/20 p-4">
                  <PaymentTimeline stage={timelineStage} />
                </div>

                {retryCountdown > 0 ? (
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 text-center">
                    <p className="text-sm font-medium text-amber-400">
                      M-Pesa busy — Retrying in {retryCountdown}s… (Attempt {retryAttempt}/{maxRetries})
                    </p>
                    <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                      <div className="bg-amber-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${(retryCountdown / 15) * 100}%` }} />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.3s" }} />
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.6s" }} />
                    <span className="text-sm text-muted-foreground ml-2">Waiting for confirmation...</span>
                  </div>
                )}

                <div className="border-t border-border pt-4 mt-4">
                  <p className="text-xs text-muted-foreground mb-3">Or pay manually via Paybill:</p>
                  <PaybillCard orderId={orderId} amount={pkg.amount} />

                  <div className="flex flex-col gap-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={async () => {
                        if (!orderId) return;
                        const { data } = await supabase.from("orders").select("status, mpesa_receipt").eq("id", orderId).maybeSingle();
                        if (data?.status === "paid") {
                          setTimelineStage("confirmed");
                          setStep("success");
                          if (data.mpesa_receipt) setMpesaCode(data.mpesa_receipt);
                          onPaymentSuccess?.();
                          toast.success("Payment confirmed! 🎉");
                        } else {
                          toast.error("Payment not yet received. Please complete your M-Pesa payment and try again.");
                        }
                      }}
                      className="w-full text-sm gap-1.5"
                    >
                      <CheckCircle className="h-4 w-4" /> I Paid via Paybill
                    </Button>
                    <a
                      href={`https://wa.me/254700000000?text=Hi%20CV Edge!%20I%20need%20help%20with%20payment.%20Order:%20${orderId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="ghost" className="w-full text-sm gap-1.5 text-primary hover:text-primary/80">
                        <MessageCircle className="h-4 w-4" /> WhatsApp Help
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* SUCCESS STEP */}
            {step === "success" && (
              <div className="py-4 space-y-5">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-serif font-bold text-xl mb-1">🎉 Payment Confirmed!</h3>
                  <p className="text-sm text-primary font-semibold">
                    ✅ KES {(confirmedAmount || pkg.amount).toLocaleString()} received
                  </p>
                  {mpesaCode && (
                    <p className="text-xs text-muted-foreground mt-1">M-Pesa Code: <strong>{mpesaCode}</strong></p>
                  )}
                  <p className="text-sm text-muted-foreground mt-2">Welcome, {fullName.split(" ")[0]}!</p>
                </div>

                {/* Success Timeline */}
                <div className="rounded-xl border border-border bg-muted/20 p-4">
                  <PaymentTimeline stage="confirmed" />
                </div>

                <Button
                  onClick={() => { handleClose(); window.location.href = "/cv-builder"; }}
                  className="w-full h-12 font-bold border-0 bg-gradient-brand gold-shimmer"
                >
                  🚀 Start Building My CV →
                </Button>
              </div>
            )}

            {/* FAILED STEP */}
            {step === "failed" && (
              <div className="py-4 space-y-5">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-destructive/15 flex items-center justify-center mx-auto mb-3">
                    <AlertTriangle className="h-8 w-8 text-destructive" />
                  </div>
                  <h3 className="font-serif font-bold text-xl mb-1">⚠️ Payment Not Confirmed</h3>
                  <p className="text-sm text-muted-foreground">Don't worry — pay manually via Paybill:</p>
                </div>

                {/* Failed Timeline */}
                <div className="rounded-xl border border-border bg-muted/20 p-4">
                  <PaymentTimeline stage="failed" />
                </div>

                <PaybillCard orderId={orderId} amount={pkg.amount} />

                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    onClick={async () => {
                      if (!orderId) return;
                      const { data } = await supabase.from("orders").select("status, mpesa_receipt").eq("id", orderId).maybeSingle();
                      if (data?.status === "paid") {
                        setTimelineStage("confirmed");
                        setStep("success");
                        if (data.mpesa_receipt) setMpesaCode(data.mpesa_receipt);
                        onPaymentSuccess?.();
                        toast.success("Payment confirmed! 🎉");
                      } else {
                        toast.error("Payment not yet received. Please complete your M-Pesa payment and try again.");
                      }
                    }}
                    className="w-full text-sm gap-1.5"
                  >
                    <CheckCircle className="h-4 w-4" /> I've Paid via Paybill
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => { setStep("form"); setTimelineStage("initiated"); }}
                    className="w-full text-sm"
                  >
                    Try Again
                  </Button>
                  <a
                    href={`https://wa.me/254700000000?text=Hi%20CV Edge!%20I%20need%20help%20with%20payment.%20Order:%20${orderId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="ghost" className="w-full text-sm gap-1.5 text-primary hover:text-primary/80">
                      <MessageCircle className="h-4 w-4" /> WhatsApp: +254700000000
                    </Button>
                  </a>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
