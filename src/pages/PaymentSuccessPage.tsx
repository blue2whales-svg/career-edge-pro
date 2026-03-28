import { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { trackPurchase } from "@/hooks/useFbPixel";

export default function PaymentSuccessPage() {
  useEffect(() => { trackPurchase(0, "KES"); }, []);
  return (
    <PageLayout>
      <section className="relative z-10 pt-24 pb-24 px-4">
        <div className="container max-w-lg mx-auto text-center">
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
        </div>
      </section>
    </PageLayout>
  );
}
