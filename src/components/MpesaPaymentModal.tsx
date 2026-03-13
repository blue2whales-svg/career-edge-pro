import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Smartphone, Phone, CheckCircle, AlertTriangle, Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PACKAGES = [
  { value: "starter", label: "Starter — KES 2,500", amount: 2500 },
  { value: "professional", label: "Professional — KES 5,500", amount: 5500 },
  { value: "executive", label: "Executive — KES 10,500", amount: 10500 },
  { value: "cover-letter", label: "Cover Letter Only — KES 1,500", amount: 1500 },
  { value: "cv-review", label: "Expert CV Review — KES 2,500", amount: 2500 },
  { value: "global", label: "Global Assistance — KES 20,000", amount: 20000 },
  { value: "pro-monthly", label: "CVEdge Pro — KES 2,000/month", amount: 2000 },
  { value: "pro-plus", label: "CVEdge Pro Plus — KES 2,500/month", amount: 2500 },
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

interface MpesaPaymentModalProps {
  open: boolean;
  onClose: () => void;
  defaultPackage?: string;
}

export default function MpesaPaymentModal({ open, onClose, defaultPackage = "professional" }: MpesaPaymentModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedPackage, setSelectedPackage] = useState(defaultPackage);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<ModalStep>("form");
  const [orderId, setOrderId] = useState("");
  const [checkoutRequestId, setCheckoutRequestId] = useState("");
  const [mpesaCode, setMpesaCode] = useState("");
  const [confirmedAmount, setConfirmedAmount] = useState(0);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pkg = PACKAGES.find(p => p.value === selectedPackage) || PACKAGES[1];

  // Reset when modal opens
  useEffect(() => {
    if (open) {
      setStep("form");
      setLoading(false);
      setSelectedPackage(defaultPackage);
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
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
          setStep("success");
        } else if (row?.status === "failed") {
          clearInterval(pollRef.current!);
          clearTimeout(timeoutRef.current!);
          setStep("failed");
        }
      } catch {
        // continue polling
      }
    }, 5000);

    timeoutRef.current = setTimeout(() => {
      if (pollRef.current) clearInterval(pollRef.current);
      // Don't auto-fail, stay on waiting screen
    }, 120000);
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
    const generatedOrderId = "CVE-" + Date.now();
    setOrderId(generatedOrderId);

    try {
      const STK_URL = "https://wspugvdwodqdlyamxzxj.supabase.co/functions/v1/mpesa-stk-push";

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
        }),
      });

      const data = await res.json();

      if (data?.ResponseCode === "0") {
        setCheckoutRequestId(data.CheckoutRequestID || "");
        setStep("waiting");
        toast.success("Check your phone for the M-Pesa prompt 📱");
        if (data.CheckoutRequestID) {
          startPolling(data.CheckoutRequestID);
        }
      } else {
        console.error("STK push failed:", data);
        setStep("failed");
        toast.error("M-Pesa request failed. Please try the manual option.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      setStep("failed");
      toast.error("Could not reach payment service.");
    } finally {
      setLoading(false);
    }
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
                  <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Smartphone className="h-3 w-3" /> M-Pesa</span>
                    <span>Paybill: 4561075</span>
                  </div>
                </div>
              </>
            )}

            {/* WAITING STEP */}
            {step === "waiting" && (
              <div className="text-center py-4 space-y-5">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Phone className="h-8 w-8 text-primary animate-pulse" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl mb-1">📱 Check Your Phone!</h3>
                  <p className="text-sm text-muted-foreground">
                    M-Pesa prompt sent to <strong>{formatPhoneForDisplay(formatPhone(phone))}</strong>
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Enter your M-Pesa PIN to confirm</p>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.3s" }} />
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.6s" }} />
                  <span className="text-sm text-muted-foreground ml-2">Waiting for confirmation...</span>
                </div>

                <div className="border-t border-border pt-4 mt-4">
                  <p className="text-xs text-muted-foreground mb-3">Or pay manually:</p>
                  <div className="rounded-xl border border-border bg-muted/30 p-4 text-left space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Paybill:</span>
                      <span className="font-mono font-bold">4561075</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Account:</span>
                      <span className="font-mono font-bold text-xs">{orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="font-mono font-bold">KES {pkg.amount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setStep("success");
                        toast.success("Thank you! We'll verify your payment shortly.");
                      }}
                      className="w-full text-sm gap-1.5"
                    >
                      <CheckCircle className="h-4 w-4" /> I Paid Manually
                    </Button>
                    <a
                      href="https://wa.me/254700000000?text=Hi%20CVEdge!%20I%20need%20help%20with%20my%20payment.%20Order:%20"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="ghost" className="w-full text-sm gap-1.5 text-green-500 hover:text-green-400">
                        <MessageCircle className="h-4 w-4" /> WhatsApp Help
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* SUCCESS STEP */}
            {step === "success" && (
              <div className="text-center py-4 space-y-5">
                <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl mb-1">🎉 Payment Confirmed!</h3>
                  <p className="text-sm text-green-500 font-semibold">
                    ✅ KES {(confirmedAmount || pkg.amount).toLocaleString()} received
                  </p>
                  {mpesaCode && (
                    <p className="text-xs text-muted-foreground mt-1">M-Pesa Code: <strong>{mpesaCode}</strong></p>
                  )}
                  <p className="text-sm text-muted-foreground mt-2">Welcome, {fullName.split(" ")[0]}!</p>
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
              <div className="text-center py-4 space-y-5">
                <div className="w-16 h-16 rounded-full bg-yellow-500/15 flex items-center justify-center mx-auto">
                  <AlertTriangle className="h-8 w-8 text-yellow-500" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl mb-1">⚠️ Payment Not Confirmed</h3>
                  <p className="text-sm text-muted-foreground">Pay manually via M-Pesa:</p>
                </div>

                <div className="rounded-xl border border-border bg-muted/30 p-4 text-left space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Paybill:</span>
                    <span className="font-mono font-bold">4561075</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account:</span>
                    <span className="font-mono font-bold text-xs">{orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-mono font-bold">KES {pkg.amount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStep("success");
                      toast.success("Thank you! We'll verify your payment shortly.");
                    }}
                    className="w-full text-sm gap-1.5"
                  >
                    <CheckCircle className="h-4 w-4" /> I've Paid Manually
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setStep("form")}
                    className="w-full text-sm"
                  >
                    Try Again
                  </Button>
                  <a
                    href="https://wa.me/254700000000?text=Hi%20CVEdge!%20I%20need%20help%20with%20payment.%20Order:%20"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="ghost" className="w-full text-sm gap-1.5 text-green-500 hover:text-green-400">
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
