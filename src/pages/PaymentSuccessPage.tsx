import { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Sparkles, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { trackPurchase } from "@/hooks/useFbPixel";

export default function PaymentSuccessPage() {
  useEffect(() => {
    trackPurchase(0, "KES");
    // Mark jobs as unlocked after successful payment
    try {
      localStorage.setItem("cvedge_jobs_unlocked", "true");
    } catch {}
  }, []);

  return (
    <PageLayout>
      <section className="relative z-10 pt-24 pb-12 px-4">
        <div className="container max-w-lg mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-serif font-bold mb-3">Payment Successful! 🎉</h1>
            <p className="text-muted-foreground mb-8">Thank you for your order. All jobs are now unlocked!</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/cv-builder">
                <Button className="bg-gradient-brand border-0 font-semibold gold-shimmer w-full sm:w-auto">
                  Build My CV <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/jobs">
                <Button variant="outline" className="w-full sm:w-auto">Browse Jobs (Unlocked)</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Upsell Section */}
      <section className="relative z-10 pb-24 px-4">
        <div className="container max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-2xl border border-primary/20 bg-gradient-brand-subtle p-6 sm:p-8 space-y-6"
          >
            <div className="text-center">
              <Sparkles className="h-8 w-8 text-primary mx-auto mb-3" />
              <h2 className="text-2xl font-serif font-bold mb-2">Upgrade Your CV Further 🚀</h2>
              <p className="text-sm text-muted-foreground">Stand out even more with these add-ons</p>
            </div>

            <div className="space-y-3">
              <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold">Premium CV Upgrade</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Executive formatting, achievement metrics, keyword optimization</p>
                </div>
                <Link to="/order?service=cv_premium">
                  <Button size="sm" className="bg-gradient-brand border-0 font-semibold shrink-0">
                    KES 800
                  </Button>
                </Link>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold">Cover Letter Add-on</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Tailored cover letter matching your CV and target role</p>
                </div>
                <Link to="/order?service=cover_letter">
                  <Button size="sm" className="bg-gradient-brand border-0 font-semibold shrink-0">
                    KES 400
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 pt-2">
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Shield className="h-3 w-3" /> Secure Payment via M-Pesa & PayPal
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
