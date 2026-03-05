import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight, Upload, FileText, Pen, Linkedin, GraduationCap,
  Shield, Globe, Award, BookOpen, Users, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

const SERVICES = [
  { id: "cv", icon: FileText, label: "Professional CV", price: "$49" },
  { id: "executive-cv", icon: Award, label: "Executive CV", price: "$199" },
  { id: "cover-letter", icon: Pen, label: "Cover Letter", price: "$29" },
  { id: "linkedin", icon: Linkedin, label: "LinkedIn Optimisation", price: "$39" },
  { id: "personal-statement", icon: BookOpen, label: "Personal Statement", price: "$79" },
  { id: "scholarship", icon: GraduationCap, label: "Scholarship Essay", price: "$99" },
  { id: "reference", icon: Users, label: "Reference Letter", price: "$39" },
  { id: "ats-cv", icon: Shield, label: "ATS-Optimised CV", price: "$59" },
  { id: "international-cv", icon: Globe, label: "International CV", price: "$69" },
];

export default function OrderPage() {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [details, setDetails] = useState("");

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const total = SERVICES.filter((s) => selectedServices.includes(s.id))
    .reduce((sum, s) => sum + parseInt(s.price.replace("$", "")), 0);

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
                <div className="grid sm:grid-cols-2 gap-3 mb-8">
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
                          <div className="text-xs text-primary font-semibold">{s.price}</div>
                        </div>
                        {selected && <Check className="h-4 w-4 text-primary shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                <h2 className="text-xl font-bold mb-5">2. Your details</h2>
                <div className="space-y-4 mb-6">
                  <Input
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 bg-card border-border"
                  />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      placeholder="Email address"
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
                <div className="rounded-xl border-2 border-dashed border-border bg-card/50 p-8 text-center mb-6">
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
                        <span className="font-semibold">{s.price}</span>
                      </div>
                    ))}
                    <div className="border-t border-border pt-3 flex items-center justify-between">
                      <span className="font-bold">Total</span>
                      <span className="text-2xl font-bold text-primary">${total}</span>
                    </div>
                  </div>
                )}

                <Button
                  className="w-full h-12 bg-gradient-brand border-0 font-semibold shadow-glow gold-shimmer text-base"
                  disabled={selectedServices.length === 0}
                >
                  Place Order <ArrowRight className="ml-2 h-4 w-4" />
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
