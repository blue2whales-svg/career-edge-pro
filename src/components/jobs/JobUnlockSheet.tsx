import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Phone, CheckCircle, AlertTriangle, Loader2, Lock,
  Star, Shield, ArrowRight, MessageCircle, Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PayPalButton } from "@/components/PayPalButton";
import { useUsdRate } from "@/hooks/useUsdRate";

type Mode = "single" | "pro";
type Step = "form" | "waiting" | "success" | "failed";

interface JobUnlockSheetProps {
  open: boolean;
  onClose: () => void;
  mode: Mode;
  jobTitle?: string;
  jobId?: string;
  company?: string;
  tier?: "verified" | "international";
  onUnlocked: () => void;
}

const PAYBILL = "4561075";

function formatPhone(input: string): string {
  let phone = input.replace(/\D/g, "");
  if (phone.startsWith("0")) phone = "254" + phone.slice(1);
  if (phone.startsWith("7")) phone = "254" + phone;
  if (!phone.startsWith("254")) phone = "254" + phone;
  return phone;
}

function formatPhoneDisplay(phone: string) {
  const d = phone.replace(/\D/g, "");
  if (d.length >= 12 && d.startsWith("254")) return `0${d.slice(3, 6)} ${d.slice(6, 9)} ${d.slice(9)}`;
  return phone;
}

export default function JobUnlockSheet({
  open, onClose, mode, jobTitle, jobId, company, tier = "verified", onUnlocked,
}: JobUnlockSheetProps) {
  const isInternational = tier === "international";
  const amount = mode === "pro" ? 1000 : isInternational ? 199 : 99;
  const label = mode === "pro" ? "CV Edge Pro — KSh 1,000/mo" : `Unlock Job — KSh ${amount}`;
  const usdRate = useUsdRate();
  const amountUsd = (amount * usdRate).toFixed(2);

  const [phone, setPhone] = useState("");
  const [savePhone, setSavePhone] = useState(true);
  const [step, setStep] = useState<Step>("form");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [checkoutRequestId, setCheckoutRequestId] = useState("");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load saved phone
  useEffect(() => {
    if (!open) return;
    setStep("form");
    setLoading(false);
    const saved = localStorage.getItem("cvedge_mpesa_phone");
    if (saved) setPhone(saved);
  }, [open]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleSuccess = useCallback(async () => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    if (!userId) { toast.error("Not logged in"); return; }

    if (mode === "single" && jobId) {
      await supabase.from("job_unlocks").insert({
        user_id: userId,
        job_id: jobId,
        unlock_type: "single",
        amount_paid: amount,
        currency: "KES",
      });
    }

    if (mode === "pro") {
      await supabase.from("subscriptions").insert({
        user_id: userId,
        plan: "pro",
        status: "active",
        billing_cycle: "monthly",
        amount: 1000,
        currency: "KES",
      });
    }

    if (savePhone && phone) {
      localStorage.setItem("cvedge_mpesa_phone", phone);
      await supabase.from("profiles").update({ phone: formatPhone(phone) }).eq("user_id", userId);
    }

    setStep("success");
    toast.success(mode === "pro" ? "🎉 Welcome to Pro! All jobs unlocked" : "✅ Job unlocked! Apply now");
    onUnlocked();
  }, [mode, jobId, amount, phone, savePhone, onUnlocked]);

  const startPolling = useCallback((crId: string) => {
    pollRef.current = setInterval(async () => {
      try {
        const { data } = await supabase
          .from("orders")
          .select("status, mpesa_receipt")
          .eq("mpesa_checkout_request_id", crId)
          .maybeSingle();
        if ((data as any)?.status === "paid") {
          await handleSuccess();
        }
      } catch { /* keep polling */ }
    }, 3000);
    timeoutRef.current = setTimeout(() => {
      if (pollRef.current) clearInterval(pollRef.current);
      setStep("failed");
    }, 60000);
  }, [handleSuccess]);

  const handleMpesa = async () => {
    const formatted = formatPhone(phone);
    if (formatted.length < 12) { toast.error("Enter a valid Kenyan phone number"); return; }
    setLoading(true);

    const generatedOrderId = "JU-" + Date.now();
    setOrderId(generatedOrderId);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      const res = await fetch(`${supabaseUrl}/functions/v1/mpesa-stk-push`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseKey}` },
        body: JSON.stringify({
          phone: formatted,
          amount,
          packageName: label,
          orderId: generatedOrderId,
          fullName: "Job Unlock",
          email: "unlock@cvedge.live",
        }),
      });
      const data = await res.json();

      if (data?.ResponseCode === "0") {
        setCheckoutRequestId(data.CheckoutRequestID || "");
        setStep("waiting");
        toast.success("Check your phone for the M-Pesa prompt 📱");
        if (data.CheckoutRequestID) startPolling(data.CheckoutRequestID);
      } else {
        setStep("failed");
        toast.error("M-Pesa prompt failed. Try again or use PayPal.");
      }
    } catch {
      setStep("failed");
      toast.error("Could not reach payment service.");
    }
    setLoading(false);
  };

  const handlePayPalSuccess = async () => {
    await handleSuccess();
  };

  const handleClose = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    onClose();
  };

  const themeColor = isInternational && mode === "single" ? "blue" : "amber";
  const gradientClass = themeColor === "blue"
    ? "from-blue-500 to-blue-600 text-white"
    : "from-amber-500 to-amber-600 text-black";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full sm:max-w-[440px] rounded-t-2xl sm:rounded-2xl border border-border bg-card p-6 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={handleClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>

            {step === "form" && (
              <div className="space-y-4">
                {/* Header */}
                <div className="text-center">
                  <div className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-3 ${
                    themeColor === "blue" ? "bg-blue-500/10" : "bg-amber-500/10"
                  }`}>
                    {mode === "pro" ? <Star className={`h-7 w-7 ${themeColor === "blue" ? "text-blue-400" : "text-amber-400"}`} /> : <Lock className={`h-7 w-7 ${themeColor === "blue" ? "text-blue-400" : "text-amber-400"}`} />}
                  </div>
                  <h3 className="font-serif font-bold text-xl">
                    {mode === "pro" ? "Subscribe to Pro" : "Unlock This Job"}
                  </h3>
                  {mode === "single" && jobTitle && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{jobTitle} {company ? `at ${company}` : ""}</p>
                  )}
                </div>

                {/* Amount */}
                <div className={`rounded-xl border p-4 text-center ${
                  themeColor === "blue" ? "border-blue-500/20 bg-blue-500/5" : "border-amber-500/20 bg-amber-500/5"
                }`}>
                  <p className={`text-3xl font-bold ${themeColor === "blue" ? "text-blue-400" : "text-amber-400"}`}>
                    KSh {amount}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {mode === "pro" ? "per month · cancel anytime" : "one-time · never expires"}
                  </p>
                </div>

                {/* Pro features */}
                {mode === "pro" && (
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    {["All verified Kenya employer jobs", "All international + visa jobs", "Unlimited CV downloads", "Application tracker + job alerts"].map((f, i) => (
                      <li key={i} className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-amber-400 shrink-0" />{f}</li>
                    ))}
                  </ul>
                )}

                {/* M-Pesa phone */}
                <div>
                  <Label className="text-sm">M-Pesa Phone Number</Label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0712 345 678"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    className="mt-1"
                  />
                </div>

                {/* Save phone */}
                <div className="flex items-center gap-2">
                  <Checkbox checked={savePhone} onCheckedChange={(v) => setSavePhone(!!v)} id="save-phone" />
                  <label htmlFor="save-phone" className="text-xs text-muted-foreground cursor-pointer">
                    Save this number for future payments
                  </label>
                </div>

                {/* M-Pesa CTA */}
                <Button
                  onClick={handleMpesa}
                  disabled={loading || !phone.trim()}
                  className={`w-full h-12 font-bold border-0 bg-gradient-to-r ${gradientClass} shadow-lg`}
                >
                  {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending...</> : (
                    <><Phone className="h-4 w-4 mr-2" /> Pay with M-Pesa → </>
                  )}
                </Button>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">or</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* PayPal */}
                <PayPalButton
                  amountUsd={amountUsd}
                  description={label}
                  onSuccess={handlePayPalSuccess}
                />

                <div className="flex items-center justify-center gap-3 text-[10px] text-muted-foreground pt-1">
                  <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> M-Pesa & PayPal</span>
                  <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> 2,400+ users</span>
                </div>
              </div>
            )}

            {step === "waiting" && (
              <div className="py-4 space-y-5 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Phone className="h-8 w-8 text-primary animate-pulse" />
                </div>
                <h3 className="font-serif font-bold text-xl">📲 Check Your Phone</h3>
                <p className="text-sm text-muted-foreground">
                  Approve the M-Pesa prompt on <strong>{formatPhoneDisplay(formatPhone(phone))}</strong>
                </p>
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Waiting for payment...</span>
                </div>
                <p className="text-xs text-muted-foreground">This may take up to 60 seconds</p>
              </div>
            )}

            {step === "success" && (
              <div className="py-4 space-y-5 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-serif font-bold text-xl">
                  {mode === "pro" ? "🎉 Welcome to Pro!" : "✅ Job Unlocked!"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {mode === "pro" ? "All jobs are now unlocked. Explore freely!" : "You can now view full details and apply."}
                </p>
                <Button onClick={handleClose} className={`w-full h-12 font-bold border-0 bg-gradient-to-r ${gradientClass}`}>
                  {mode === "pro" ? "Explore Jobs →" : "View Job Details →"}
                </Button>
              </div>
            )}

            {step === "failed" && (
              <div className="py-4 space-y-5 text-center">
                <div className="w-16 h-16 rounded-full bg-destructive/15 flex items-center justify-center mx-auto">
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>
                <h3 className="font-serif font-bold text-xl">Payment Not Confirmed</h3>
                <p className="text-sm text-muted-foreground">Try again or use PayPal below.</p>
                <Button variant="outline" onClick={() => setStep("form")} className="w-full">
                  Try Again
                </Button>
                <PayPalButton amountUsd={amountUsd} description={label} onSuccess={handlePayPalSuccess} />
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
