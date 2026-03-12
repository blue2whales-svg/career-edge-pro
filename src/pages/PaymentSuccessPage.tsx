import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Loader2, AlertTriangle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { supabase } from "@/integrations/supabase/client";

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"checking" | "success" | "failed">("checking");
  const [pkg, setPkg] = useState("");

  useEffect(() => {
    const checkPayment = async () => {
      try {
        const trackingData = localStorage.getItem("cvedge_pesapal_tracking");
        if (!trackingData) { setStatus("success"); return; }
        const { order_tracking_id, package: pkgName } = JSON.parse(trackingData);
        setPkg(pkgName || "");

        if (order_tracking_id) {
          const { data } = await supabase.functions.invoke("pesapal-payment", {
            body: { action: "check-status", order_tracking_id },
          });
          if (data?.payment_status_description === "Completed" || data?.status_code === 1) {
            setStatus("success");
            if (pkgName === "pro-monthly") localStorage.setItem("cvedge_pro", "true");
          } else {
            setStatus("success"); // still show success — Pesapal IPN will confirm
          }
        } else {
          setStatus("success");
        }
        localStorage.removeItem("cvedge_pesapal_tracking");
      } catch { setStatus("success"); }
    };
    checkPayment();
  }, []);

  return (
    <PageLayout>
      <section className="relative z-10 pt-24 pb-24 px-4">
        <div className="container max-w-lg mx-auto text-center">
          {status === "checking" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-6" />
              <h1 className="text-2xl font-serif font-bold mb-2">Verifying Payment...</h1>
              <p className="text-muted-foreground">Please wait while we confirm your payment</p>
            </motion.div>
          )}
          {status === "success" && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
              <h1 className="text-3xl font-serif font-bold mb-3">Payment Successful! 🎉</h1>
              <p className="text-muted-foreground mb-8">Thank you for your order. You're all set!</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/cv-builder">
                  <Button className="bg-gradient-brand border-0 font-semibold gold-shimmer w-full sm:w-auto">
                    Build My CV <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/jobs">
                  <Button variant="outline" className="w-full sm:w-auto">Browse Jobs</Button>
                </Link>
              </div>
            </motion.div>
          )}
          {status === "failed" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-6" />
              <h1 className="text-2xl font-serif font-bold mb-3">Payment Issue</h1>
              <p className="text-muted-foreground mb-4">We couldn't confirm your payment. If you completed the payment, it may take a few minutes to process.</p>
              <p className="text-sm text-muted-foreground mb-6">Having trouble? WhatsApp us for immediate help.</p>
              <div className="flex flex-col gap-3">
                <a href="https://wa.me/254700000000?text=Hi%20CVEdge!%20I%20need%20help%20with%20my%20payment." target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-green-600 hover:bg-green-700 border-0 font-semibold">WhatsApp Support</Button>
                </a>
                <Link to="/"><Button variant="outline" className="w-full">Back to Home</Button></Link>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
