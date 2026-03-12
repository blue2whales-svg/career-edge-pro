import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, CreditCard, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PACKAGES = [
  { value: "starter", label: "Starter — KSh 2,500", amount: 2500 },
  { value: "professional", label: "Professional — KSh 5,500", amount: 5500 },
  { value: "executive", label: "Executive — KSh 10,500", amount: 10500 },
  { value: "cover-letter", label: "Cover Letter Only — KSh 1,500", amount: 1500 },
  { value: "cv-review", label: "Expert CV Review — KSh 2,500", amount: 2500 },
  { value: "global", label: "Global Application Assist — KSh 20,000", amount: 20000 },
  { value: "pro-monthly", label: "CVEdge Pro — KSh 1,000/month", amount: 1000 },
  { value: "recruiter-basic", label: "Basic Job Post — KSh 3,000", amount: 3000 },
  { value: "recruiter-featured", label: "Featured Job Post — KSh 10,000", amount: 10000 },
  { value: "recruiter-pro", label: "Recruiter Pro — KSh 25,000/month", amount: 25000 },
];

interface PesapalPaymentModalProps {
  open: boolean;
  onClose: () => void;
  defaultPackage?: string;
}

export default function PesapalPaymentModal({ open, onClose, defaultPackage = "professional" }: PesapalPaymentModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+254");
  const [selectedPackage, setSelectedPackage] = useState(defaultPackage);
  const [loading, setLoading] = useState(false);

  const pkg = PACKAGES.find(p => p.value === selectedPackage) || PACKAGES[1];

  const handleSubmit = async () => {
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const nameParts = fullName.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || firstName;

      const { data, error } = await supabase.functions.invoke("pesapal-payment", {
        body: {
          action: "submit-order",
          amount: pkg.amount,
          description: pkg.label,
          email: email.trim(),
          phone: phone.trim(),
          first_name: firstName,
          last_name: lastName,
        },
      });

      if (error) throw error;
      if (data?.redirect_url) {
        localStorage.setItem("cvedge_pesapal_tracking", JSON.stringify({
          order_tracking_id: data.order_tracking_id,
          merchant_reference: data.merchant_reference,
          package: selectedPackage,
        }));
        window.location.href = data.redirect_url;
      } else {
        throw new Error("No redirect URL received");
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      toast.error("Payment initiation failed. Please try again.");
    } finally {
      setLoading(false);
    }
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
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="w-full max-w-[460px] rounded-2xl border border-border bg-card p-6 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif font-bold text-xl mb-1">Secure Payment</h3>
            <p className="text-sm text-muted-foreground mb-6">Complete your order via Pesapal</p>

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
                <Label className="text-sm">Phone Number *</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+254712345678" className="mt-1" />
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
                className="w-full h-12 font-bold text-base border-0"
                style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)" }}
              >
                {loading ? "Processing..." : `Proceed to Secure Payment → KSh ${pkg.amount.toLocaleString()}`}
              </Button>

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Lock className="h-3 w-3" />
                <span>Secured by Pesapal</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Smartphone className="h-3 w-3" /> M-Pesa</span>
                <span>Airtel Money</span>
                <span className="flex items-center gap-1"><CreditCard className="h-3 w-3" /> Visa</span>
                <span>Mastercard</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
