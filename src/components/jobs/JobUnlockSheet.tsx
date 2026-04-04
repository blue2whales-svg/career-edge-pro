import { useState, useEffect, useRef, useCallback } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  X,
  Phone,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Lock,
  Star,
  Shield,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PayPalButton } from "@/components/PayPalButton";
import { useUsdRate } from "@/hooks/useUsdRate";
import { useIsInternational } from "@/hooks/useIsInternational";

type Mode = "single" | "pro";
type Step = "form" | "waiting" | "success" | "failed" | "signup_prompt";

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

function formatPhone(input: string): string {
  let phone = input.replace(/\D/g, "");
  if (phone.startsWith("0")) phone = "254" + phone.slice(1);
  if (phone.startsWith("7")) phone = "254" + phone;
  if (!phone.startsWith("254")) phone = "254" + phone;
  return phone;
}

function formatPhoneDisplay(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length >= 12 && digits.startsWith("254")) {
    return `0${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`;
  }
  return phone;
}

export default function JobUnlockSheet({
  open,
  onClose,
  mode,
  jobTitle,
  jobId,
  company,
  tier = "verified",
  onUnlocked,
}: JobUnlockSheetProps) {
  const isInternational = tier === "international";
  const amount = mode === "pro" ? 2000 : 100;
  const label = mode === "pro" ? "CV Edge Pro — KSh 2,000/mo" : `Unlock Job — KSh ${amount}`;
  const usdRate = useUsdRate();
  const amountUsd = (amount * usdRate).toFixed(2);
  const { isInternational: isForeignUser } = useIsInternational();

  const [phone, setPhone] = useState("");
  const [savePhone, setSavePhone] = useState(false);
  const [step, setStep] = useState<Step>("form");
  const [loading, setLoading] = useState(false);
  const phoneInputRef = useRef<HTMLInputElement | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    setStep("form");
    setLoading(false);

    const savedPhone = localStorage.getItem("cvedge_mpesa_phone");
    if (savedPhone) {
      setPhone(savedPhone);
      setSavePhone(true);
    } else {
      setPhone("");
      setSavePhone(false);
    }
  }, [open]);

  useEffect(() => clearTimers, [clearTimers]);

  const handleClose = useCallback(() => {
    clearTimers();
    onClose();
  }, [clearTimers, onClose]);

  const handleSuccess = useCallback(async () => {
    clearTimers();

    if (savePhone && phone) {
      localStorage.setItem("cvedge_mpesa_phone", phone);
    }

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;

    if (userId) {
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
        await supabase
          .from("profiles")
          .update({ phone: formatPhone(phone) })
          .eq("user_id", userId);
      }
    } else {
      const pendingUnlock = {
        mode,
        jobId,
        amount,
        phone: formatPhone(phone),
        timestamp: Date.now(),
      };
      localStorage.setItem("cvedge_pending_unlock", JSON.stringify(pendingUnlock));
    }

    setStep(userId ? "success" : "signup_prompt");
    toast.success(mode === "pro" ? "🎉 Payment received! Save your access" : "✅ Payment received!");

    if (userId) {
      onUnlocked();
    }
  }, [amount, clearTimers, jobId, mode, onUnlocked, phone, savePhone]);

  const startPolling = useCallback(
    (checkoutRequestId: string) => {
      clearTimers();

      pollRef.current = setInterval(async () => {
        try {
          const { data } = await supabase
            .from("orders")
            .select("status, mpesa_receipt")
            .eq("mpesa_checkout_request_id", checkoutRequestId)
            .maybeSingle();

          if ((data as { status?: string } | null)?.status === "paid") {
            await handleSuccess();
          }
        } catch {
          // keep polling silently
        }
      }, 3000);

      timeoutRef.current = setTimeout(() => {
        clearTimers();
        setStep("failed");
      }, 60000);
    },
    [clearTimers, handleSuccess],
  );

  const handleMpesa = async () => {
    const formattedPhone = formatPhone(phone);
    if (formattedPhone.length < 12) {
      toast.error("Enter a valid Kenyan phone number");
      return;
    }

    setLoading(true);
    const generatedOrderId = `JU-${Date.now()}`;

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      const response = await fetch(`${supabaseUrl}/functions/v1/mpesa-stk-push`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          phone: formattedPhone,
          amount,
          packageName: label,
          orderId: generatedOrderId,
          fullName: "Job Unlock",
          email: "unlock@cvedge.live",
        }),
      });

      const data = await response.json();

      if (data?.ResponseCode === "0") {
        setStep("waiting");
        toast.success("Check your phone for the M-Pesa prompt 📱");

        if (data.CheckoutRequestID) {
          startPolling(data.CheckoutRequestID);
        }
      } else {
        setStep("failed");
        toast.error("M-Pesa prompt failed. Try again or use PayPal.");
      }
    } catch {
      setStep("failed");
      toast.error("Could not reach payment service.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayPalSuccess = async () => {
    await handleSuccess();
  };

  const themeColor = isInternational && mode === "single" ? "blue" : "amber";
  const gradientClass =
    themeColor === "blue"
      ? "from-blue-500 to-blue-600 text-white"
      : "from-amber-500 to-amber-600 text-black";

  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => !nextOpen && handleClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[110] bg-black/75 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          aria-describedby={undefined}
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            window.requestAnimationFrame(() => phoneInputRef.current?.focus());
          }}
          className="fixed bottom-0 left-0 right-0 z-[111] w-full max-h-[92dvh] overflow-hidden rounded-t-2xl border border-border bg-card shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom-full data-[state=open]:slide-in-from-bottom-full sm:bottom-auto sm:left-1/2 sm:right-auto sm:top-1/2 sm:w-[440px] sm:max-w-[calc(100vw-2rem)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:data-[state=closed]:zoom-out-95 sm:data-[state=open]:zoom-in-95"
        >
          <Dialog.Title className="sr-only">
            {mode === "pro" ? "Subscribe to Pro" : "Unlock This Job"}
          </Dialog.Title>

          <div className="max-h-[92dvh] overflow-y-auto overscroll-contain p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:max-h-[85vh]">
            <div className="mb-2 flex items-center justify-between">
              <button
                type="button"
                onClick={handleClose}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowRight className="h-4 w-4 rotate-180" /> Back
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Close payment sheet"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {step === "form" && (
              <div className="space-y-4">
                <div className="text-center">
                  <div
                    className={`mb-3 flex h-14 w-14 items-center justify-center rounded-full mx-auto ${
                      themeColor === "blue" ? "bg-blue-500/10" : "bg-amber-500/10"
                    }`}
                  >
                    {mode === "pro" ? (
                      <Star className={`h-7 w-7 ${themeColor === "blue" ? "text-blue-400" : "text-amber-400"}`} />
                    ) : (
                      <Lock className={`h-7 w-7 ${themeColor === "blue" ? "text-blue-400" : "text-amber-400"}`} />
                    )}
                  </div>
                  <h3 className="font-serif text-xl font-bold">
                    {mode === "pro" ? "Subscribe to Pro" : "Unlock This Job"}
                  </h3>
                  {mode === "single" && jobTitle && (
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {jobTitle} {company ? `at ${company}` : ""}
                    </p>
                  )}
                </div>

                <div
                  className={`rounded-xl border p-4 text-center ${
                    themeColor === "blue" ? "border-blue-500/20 bg-blue-500/5" : "border-amber-500/20 bg-amber-500/5"
                  }`}
                >
                  <p className={`text-3xl font-bold ${themeColor === "blue" ? "text-blue-400" : "text-amber-400"}`}>
                    KSh {amount.toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {mode === "pro" ? "per month · cancel anytime" : "one-time · never expires"}
                  </p>
                </div>

                {mode === "pro" && (
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    {[
                      "All verified Kenya employer jobs",
                      "All international + visa jobs",
                      "Unlimited CV downloads",
                      "Application tracker + job alerts",
                    ].map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <CheckCircle className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}

                <div>
                  <Label htmlFor="job-unlock-phone" className="text-sm font-medium">
                    M-Pesa Phone Number
                  </Label>
                  <Input
                    id="job-unlock-phone"
                    ref={phoneInputRef}
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    onFocus={(event) => event.target.select()}
                    placeholder="0712 345 678"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    className="mt-1 h-12 bg-background text-base touch-manipulation"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="save-phone"
                    checked={savePhone}
                    onCheckedChange={(value) => setSavePhone(!!value)}
                  />
                  <label htmlFor="save-phone" className="cursor-pointer select-none text-xs text-muted-foreground">
                    Save this number for future payments
                  </label>
                </div>

                <Button
                  onClick={handleMpesa}
                  disabled={loading || !phone.trim()}
                  className={`h-12 w-full border-0 bg-gradient-to-r font-bold shadow-lg ${gradientClass}`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                    </>
                  ) : (
                    <>
                      <Phone className="mr-2 h-4 w-4" /> Pay with M-Pesa →
                    </>
                  )}
                </Button>

                {isForeignUser && (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="h-px flex-1 bg-border" />
                      <span className="text-xs text-muted-foreground">or</span>
                      <div className="h-px flex-1 bg-border" />
                    </div>
                    <PayPalButton amountUsd={amountUsd} description={label} onSuccess={handlePayPalSuccess} />
                  </>
                )}

                <div className="flex items-center justify-center gap-3 pt-1 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Shield className="h-3 w-3" /> Secure Payment
                  </span>
                  <span className="flex items-center gap-1">
                    <Shield className="h-3 w-3" /> 2,400+ users
                  </span>
                </div>
              </div>
            )}

            {step === "waiting" && (
              <div className="space-y-5 py-4 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Phone className="h-8 w-8 animate-pulse text-primary" />
                </div>
                <h3 className="font-serif text-xl font-bold">📲 Check Your Phone</h3>
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
              <div className="space-y-5 py-4 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-bold">
                  {mode === "pro" ? "🎉 Welcome to Pro!" : "✅ Job Unlocked!"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {mode === "pro"
                    ? "All jobs are now unlocked. Explore freely!"
                    : "You can now view full details and apply."}
                </p>
                <Button onClick={handleClose} className={`h-12 w-full border-0 bg-gradient-to-r font-bold ${gradientClass}`}>
                  {mode === "pro" ? "Explore Jobs →" : "View Job Details →"}
                </Button>
              </div>
            )}

            {step === "failed" && (
              <div className="space-y-5 py-4 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/15">
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>
                <h3 className="font-serif text-xl font-bold">Payment Not Confirmed</h3>
                <p className="text-sm text-muted-foreground">Try again or use PayPal below.</p>
                <Button variant="outline" onClick={() => setStep("form")} className="w-full">
                  Try Again
                </Button>
                <PayPalButton amountUsd={amountUsd} description={label} onSuccess={handlePayPalSuccess} />
              </div>
            )}

            {step === "signup_prompt" && (
              <div className="space-y-5 py-4 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-bold">✅ Payment Received!</h3>
                <p className="text-sm text-muted-foreground">
                  Create a free account to save your unlock and access the job details anytime.
                </p>
                <Button
                  onClick={() => {
                    handleClose();
                    onUnlocked();
                    window.location.href = "/signup?redirect=/jobs";
                  }}
                  className={`h-12 w-full border-0 bg-gradient-to-r font-bold ${gradientClass}`}
                >
                  Sign Up & View Job →
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    handleClose();
                    onUnlocked();
                    window.location.href = "/login?redirect=/jobs";
                  }}
                  className="w-full text-sm text-muted-foreground"
                >
                  Already have an account? Log in
                </Button>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
