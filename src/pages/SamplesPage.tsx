import { useState, useCallback, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Upload, Check, ChevronRight, ArrowRight, Sparkles,
  Shield, Zap, Globe, Palette, Download, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import PageLayout from "@/components/PageLayout";
import { TemplateCard } from "@/components/samples/TemplateCard";
import {
  CV_TEMPLATES,
  TEMPLATE_CATEGORIES,
  CATEGORY_DESCRIPTIONS,
  TEMPLATE_FAQ,
} from "@/data/cv-templates";

const TRUST_STATS = [
  "36+ Templates",
  "ATS-Optimised",
  "PDF & DOCX",
  "Used by 10,000+ professionals",
];

const WHY_POINTS = [
  { icon: Shield, title: "ATS-Optimised", desc: "Every template passes all major Applicant Tracking Systems" },
  { icon: Sparkles, title: "AI-Powered", desc: "Smart content suggestions and keyword optimization built in" },
  { icon: Palette, title: "Fully Customisable", desc: "Change colours, fonts, and layout to match your brand" },
  { icon: Globe, title: "All Industries", desc: "Templates for finance, tech, healthcare, creative, and more" },
  { icon: Download, title: "PDF & DOCX Export", desc: "Download in both formats for maximum compatibility" },
  { icon: Zap, title: "Free to Start", desc: "Browse, preview, and begin building at no cost" },
];

const GUIDE_CATEGORIES = [
  { label: "Simple", desc: "Best for traditional industries — law, finance, government. Clean layouts that emphasise substance over style.", color: "#1a2332" },
  { label: "Modern", desc: "Two-column and sidebar designs for tech, startups, and progressive companies. Balance form and function.", color: "#2563eb" },
  { label: "Creative", desc: "Bold colours and unique layouts for designers, marketers, and artists. Stand out from the stack.", color: "#7c3aed" },
  { label: "Professional", desc: "Executive-level templates for C-suite, directors, and senior leaders. Command authority at first glance.", color: "#c9a94e" },
];

export default function SamplesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const tabsRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);

  // Sticky tabs detection
  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsSticky(!entry.isIntersecting),
      { threshold: 1, rootMargin: "-1px 0px 0px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const filtered = activeCategory === "All"
    ? CV_TEMPLATES
    : CV_TEMPLATES.filter((t) => t.category === activeCategory);

  return (
    <PageLayout>
      {/* Page uses a white/light background */}
      <div className="bg-white text-gray-900 min-h-screen">

        {/* HERO */}
        <section className="relative pt-20 pb-16 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white" />
          <div className="container max-w-5xl mx-auto relative z-10 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-900 mb-4"
            >
              CV Templates
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-lg sm:text-xl text-gray-500 max-w-xl mx-auto mb-8"
            >
              Professionally designed templates that get you hired faster
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center justify-center gap-3 mb-10"
            >
              <Link to="/cv-builder">
                <Button size="lg" className="bg-gradient-brand border-0 text-primary-foreground font-semibold shadow-lg gold-shimmer">
                  <FileText className="w-4 h-4 mr-2" />Build My CV
                </Button>
              </Link>
              <Link to="/cv-builder">
                <Button size="lg" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                  <Upload className="w-4 h-4 mr-2" />Upload My CV
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
              className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-gray-400"
            >
              {TRUST_STATS.map((s) => (
                <span key={s} className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-green-500" />{s}
                </span>
              ))}
            </motion.div>
          </div>
        </section>

        {/* STICKY FILTER TABS */}
        <div ref={tabsRef} />
        <div className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b transition-shadow ${isSticky ? "shadow-md" : "border-gray-100"}`}>
          <div className="container max-w-6xl mx-auto px-4">
            <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide -mx-4 px-4">
              {TEMPLATE_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? "text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  style={activeCategory === cat ? { background: "linear-gradient(135deg, hsl(43 55% 54%), hsl(43 60% 70%))", color: "#0f1b2d" } : {}}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* TEMPLATE GRID */}
        <section className="container max-w-6xl mx-auto px-4 py-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-5 sm:gap-8"
            >
              {filtered.map((t, i) => (
                <TemplateCard key={t.id} template={t} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No templates in this category yet.</p>
            </div>
          )}
        </section>

        {/* CATEGORY DESCRIPTION SECTIONS */}
        <section className="container max-w-5xl mx-auto px-4 py-12 space-y-12">
          {Object.entries(CATEGORY_DESCRIPTIONS).map(([cat, data]) => (
            <div key={cat} className="border-b border-gray-100 pb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{data.title}</h2>
              <p className="text-gray-500 leading-relaxed mb-4 max-w-3xl">{data.description}</p>
              <button
                onClick={() => { setActiveCategory(cat); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
                style={{ color: "hsl(43 55% 54%)" }}
              >
                Show all {cat.toLowerCase()} templates <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </section>

        {/* WHY CVEdge */}
        <section className="bg-gray-50 py-20 px-4">
          <div className="container max-w-5xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-4">
              Why use CVEdge templates?
            </h2>
            <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">
              Every template is crafted by professional CV writers and tested against real ATS systems.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {WHY_POINTS.map((p) => (
                <div key={p.title} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: "hsl(43 55% 54% / 0.1)" }}>
                    <p.icon className="w-5 h-5" style={{ color: "hsl(43 55% 54%)" }} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{p.title}</h3>
                  <p className="text-sm text-gray-500">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW TO CHOOSE */}
        <section className="container max-w-5xl mx-auto px-4 py-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-4">
            How to choose the right template
          </h2>
          <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">
            Match your template to your industry and career level for maximum impact.
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            {GUIDE_CATEGORIES.map((g) => (
              <div key={g.label} className="rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="w-full h-2 rounded-full mb-4" style={{ background: g.color }} />
                <h3 className="font-bold text-lg text-gray-900 mb-2">{g.label}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{g.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-gray-50 py-20 px-4">
          <div className="container max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="space-y-3">
              {TEMPLATE_FAQ.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="bg-white rounded-xl border border-gray-100 px-6 shadow-sm">
                  <AccordionTrigger className="text-left text-gray-900 font-semibold hover:no-underline py-5">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-500 pb-5 leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-20 px-4">
          <div className="container max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl p-10 sm:p-14"
              style={{ background: "linear-gradient(135deg, #0f1b2d, #1a2332)" }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                Build your CV in <span style={{ color: "hsl(43 55% 54%)" }}>15 minutes</span>
              </h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Choose a template, fill in your details, and download your professional CV today.
              </p>
              <Link to="/cv-builder">
                <Button size="lg" className="bg-gradient-brand border-0 text-primary-foreground font-semibold shadow-lg gold-shimmer text-base px-8">
                  Build My CV Now <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-500" />4.9/5 rating</span>
                <span>•</span>
                <span>No credit card required</span>
                <span>•</span>
                <span>ATS-tested</span>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
