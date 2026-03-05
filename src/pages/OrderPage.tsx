import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight, Upload, FileText, Pen, Linkedin, GraduationCap,
  Shield, Globe, Award, BookOpen, Users, Check, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link, useNavigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

const SERVICES = [
  { id: "cv", icon: FileText, label: "Professional CV", price: 49 },
  { id: "executive-cv", icon: Award, label: "Executive CV", price: 199 },
  { id: "cover-letter", icon: Pen, label: "Cover Letter", price: 29 },
  { id: "linkedin", icon: Linkedin, label: "LinkedIn Optimisation", price: 39 },
  { id: "personal-statement", icon: BookOpen, label: "Personal Statement", price: 79 },
  { id: "scholarship", icon: GraduationCap, label: "Scholarship Essay", price: 99 },
  { id: "reference", icon: Users, label: "Reference Letter", price: 39 },
  { id: "ats-cv", icon: Shield, label: "ATS-Optimised CV", price: 59 },
  { id: "international-cv", icon: Globe, label: "International CV", price: 69 },
];

export default function OrderPage() {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const total = SERVICES.filter((s) => selectedServices.includes(s.id))
    .reduce((sum, s) => sum + s.price, 0);

  const handleSubmit = async () => {
    if (selectedServices.length === 0) {
      toast({ title: "Select at least one service", variant: "destructive" });
      return;
    }
    if (!name.trim() || !email.trim()) {
      toast({ title: "Name and email are required", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get current user if logged in
      const { data: { user } } = await supabase.auth.getUser();

      // Save order to database
      const { data: order, error } = await supabase.from("orders").insert({
        user_id: user?.id || null,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        services: selectedServices,
        details: details.trim() || null,
        total_amount: total,
        status: "pending",
      }).select().single();

      if (error) throw error;

      // Trigger Zapier webhook (non-blocking)
      supabase.functions.invoke("notify-zapier", {
        body: { order },
      }).catch(console.error);

      setOrderId(order.id);
      setOrderPlaced(true);
      toast({ title: "Order placed successfully! 🎉" });
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
              <div className="w-20 h-20 rounded-full bg-gradient-brand flex items-center justify-center mx-auto mb-6">
                <Check className="h-10 w-10 text-primary-foreground" />
              </div>
              <h1 className="text-3xl sm:text-5xl font-serif font-bold mb-4">
                Order <span className="text-gradient">Confirmed!</span>
              </h1>
              <p className="text-muted-foreground mb-2">Your order has been received. We'll start working on it immediately.</p>
              <p className="text-sm font-mono text-primary mb-8">Order ID: {orderId.slice(0, 8).toUpperCase()}</p>
              
              <div className="rounded-xl border border-border bg-card p-6 text-left mb-8">
                <h3 className="font-semibold mb-3">What happens next?</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-3">
                    <span className="text-primary font-bold">1.</span>
                    <span>A specialist will be assigned to your order within 30 minutes</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-primary font-bold">2.</span>
                    <span>You'll receive a WhatsApp message to confirm details</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-primary font-bold">3.</span>
                    <span>Your documents will be delivered same-day</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/">
                  <Button variant="outline" className="border-primary/30">Back to Home</Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-gradient-brand border-0 font-semibold gold-shimmer">
                    Create Account to Track Orders
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative z-10 pt-12 sm:pt-20 pb-10 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={0}
            className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold leading-[1.08] mb-4"
          >
            Start your <span className="text-gradient">order</span>
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={1}
            className="text-base text-muted-foreground max-w-xl mx-auto"
          >
            Select your services, fill in your details, and we'll get to work immediately.
          </motion.p>
        </div>
      </section>

      {/* Order Form */}
      <section className="relative z-10 pb-24 px-4">
        <div className="container max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Services Selection */}
            <div className="lg:col-span-3">
              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2}>
                <h2 className="text-xl font-bold mb-5">1. Choose your services</h2>
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {SERVICES.map((s) => {
                    const selected = selectedServices.includes(s.id);
                    return (
                      <button
                        key={s.id}
                        onClick={() => toggleService(s.id)}
                        className={`rounded-xl border p-4 flex items-center gap-3 text-left transition-all duration-200 ${
                          selected
                            ? "border-primary bg-primary/10 shadow-glow-sm"
                            : "border-border bg-card hover:border-primary/30"
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          selected ? "bg-gradient-brand" : "bg-muted"
                        }`}>
                          <s.icon className={`h-4 w-4 ${selected ? "text-primary-foreground" : "text-muted-foreground"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{s.label}</div>
                          <div className="text-xs text-primary font-semibold">${s.price}</div>
                        </div>
                        {selected && <Check className="h-4 w-4 text-primary shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                <h2 className="text-xl font-bold mb-5">2. Your details</h2>
                <div className="space-y-4 mb-6">
                  <Input
                    placeholder="Full name *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 bg-card border-border"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      placeholder="Email address *"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 bg-card border-border"
                    />
                    <Input
                      placeholder="WhatsApp number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-12 bg-card border-border"
                    />
                  </div>
                  <Textarea
                    placeholder="Tell us about the role/scholarship you're targeting, your experience level, and any special instructions..."
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    className="min-h-[120px] bg-card border-border"
                  />
                </div>

                <h2 className="text-xl font-bold mb-3">3. Upload existing documents</h2>
                <div className="rounded-xl border-2 border-dashed border-border bg-card/50 p-8 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-1">Drag & drop your existing CV, or click to browse</p>
                  <p className="text-xs text-muted-foreground">PDF, DOC, DOCX — Max 10MB</p>
                </div>
              </motion.div>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-2">
              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3}
                className="rounded-2xl border border-primary/20 bg-card p-6 sticky top-24"
              >
                <h3 className="font-bold text-lg mb-4">Order Summary</h3>
                {selectedServices.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4">Select services to get started</p>
                ) : (
                  <div className="space-y-3 mb-6">
                    {SERVICES.filter((s) => selectedServices.includes(s.id)).map((s) => (
                      <div key={s.id} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{s.label}</span>
                        <span className="font-semibold">${s.price}</span>
                      </div>
                    ))}
                    <div className="border-t border-border pt-3 flex items-center justify-between">
                      <span className="font-bold">Total</span>
                      <span className="text-2xl font-bold text-primary">${total}</span>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleSubmit}
                  disabled={selectedServices.length === 0 || isSubmitting}
                  className="w-full h-12 bg-gradient-brand border-0 font-semibold shadow-glow gold-shimmer text-base"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      Place Order <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

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
                    <span>Pay after review</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
