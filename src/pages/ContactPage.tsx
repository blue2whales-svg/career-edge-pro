import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageCircle, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import PageLayout from "@/components/PageLayout";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().max(20).optional(),
  subject: z.string().trim().min(1, "Subject is required").max(200),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

const CONTACT_CHANNELS = [
  {
    icon: Mail,
    label: "Email Us",
    value: "support@cvedge.live",
    href: "mailto:support@cvedge.live",
    desc: "We respond within 2 hours during business hours",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+254 793 919 962",
    href: "https://wa.me/254793919962",
    desc: "Chat with us instantly — we're always online",
  },
  {
    icon: Clock,
    label: "Working Hours",
    value: "Mon – Sun, 7 AM – 10 PM EAT",
    href: null,
    desc: "Same-day delivery on most services",
  },
];

export default function ContactPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    
    // Simulate a short delay for UX
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    toast({ title: "Message sent!", description: "We'll get back to you shortly via email or WhatsApp." });
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    setLoading(false);
  };

  return (
    <PageLayout>
      <section className="relative z-10 py-16 sm:py-24 px-4">
        <div className="container max-w-5xl mx-auto">
          {/* Header */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} className="text-center mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-6">
              <Mail className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-mono text-primary">Get in touch</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold mb-4">
              Contact <span className="text-gradient">Us</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Have a question about our services? Need a custom quote? We're here to help — reach out anytime.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-10">
            {/* Contact Channels */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1} className="lg:col-span-2 space-y-5">
              {CONTACT_CHANNELS.map((ch) => (
                <div key={ch.label} className="rounded-xl border border-border/60 bg-card/50 p-5 surface-glass">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <ch.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm mb-0.5">{ch.label}</h3>
                      {ch.href ? (
                        <a
                          href={ch.href}
                          target={ch.href.startsWith("http") ? "_blank" : undefined}
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80 transition-colors text-sm font-medium"
                        >
                          {ch.value}
                        </a>
                      ) : (
                        <p className="text-sm font-medium text-foreground">{ch.value}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">{ch.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Contact Form */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2} className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="rounded-xl border border-border/60 bg-card/50 p-6 sm:p-8 surface-glass space-y-5">
                <h2 className="font-semibold text-lg mb-1">Send us a message</h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Jane Doe" />
                    {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="jane@example.com" />
                    {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone (optional)</Label>
                    <Input id="phone" name="phone" value={form.phone} onChange={handleChange} placeholder="+254 7XX XXX XXX" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input id="subject" name="subject" value={form.subject} onChange={handleChange} placeholder="CV writing inquiry" />
                    {errors.subject && <p className="text-xs text-destructive">{errors.subject}</p>}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help you..."
                  />
                  {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
                </div>

                <Button type="submit" disabled={loading} className="bg-gradient-brand border-0 font-semibold shadow-glow-sm gold-shimmer w-full sm:w-auto px-8">
                  {loading ? "Sending…" : "Send Message"}
                  <Send className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
