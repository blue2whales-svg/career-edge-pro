import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Briefcase, FileCheck, Globe, Palette, Sparkles, Minimize2, Mail,
  Eye, ArrowRight, Shield, Lock
} from "lucide-react";
import { SamplePreviewModal } from "@/components/samples/SamplePreviewModal";

const CATEGORIES = [
  {
    id: "executive",
    label: "Executive CV",
    icon: Briefcase,
    desc: "C-suite and senior leadership — bold, authoritative formatting",
    builderFormat: "chronological",
    builderLevel: "executive",
    preview: {
      name: "Margaret Wanjiku Kamau",
      title: "Chief Financial Officer",
      sections: [
        { heading: "Professional Summary", lines: ["Visionary finance leader with 18+ years driving P&L growth across East Africa and the Gulf. Led $120M budget portfolios and built high-performance teams of 40+. Deep expertise in IFRS, treasury management, and strategic M&A advisory."] },
        { heading: "Experience", lines: ["CFO — Safaricom PLC, Nairobi (2019–Present)", "VP Finance — Equity Group Holdings (2014–2019)", "Senior Finance Manager — Deloitte East Africa (2009–2014)"] },
        { heading: "Education", lines: ["MBA Finance — Strathmore Business School", "CPA(K) — KASNEB", "BSc Accounting — University of Nairobi"] },
        { heading: "Core Competencies", lines: ["Strategic Financial Planning • M&A Due Diligence • IFRS Compliance • Board Reporting • Treasury & Risk Management • Team Leadership"] },
      ],
    },
  },
  {
    id: "ats",
    label: "ATS-Optimized CV",
    icon: FileCheck,
    desc: "Keyword-rich, clean format that passes every applicant tracking system",
    builderFormat: "chronological",
    builderLevel: "mid-level",
    preview: {
      name: "Brian Ochieng Otieno",
      title: "Software Engineer",
      sections: [
        { heading: "Professional Summary", lines: ["Results-driven software engineer with 5+ years building scalable web applications. Proficient in React, Node.js, TypeScript, and cloud platforms (AWS, GCP). Proven track record reducing deployment time by 60% through CI/CD automation."] },
        { heading: "Technical Skills", lines: ["Languages: TypeScript, Python, Java, SQL", "Frameworks: React, Next.js, Express, Django", "Tools: Docker, Kubernetes, Jenkins, GitHub Actions"] },
        { heading: "Experience", lines: ["Software Engineer — Andela, Remote (2021–Present)", "Junior Developer — Cellulant, Nairobi (2019–2021)"] },
        { heading: "Education", lines: ["BSc Computer Science — Jomo Kenyatta University"] },
      ],
    },
  },
  {
    id: "europass",
    label: "Europass CV",
    icon: Globe,
    desc: "EU-standard format accepted across all European countries",
    builderFormat: "europass",
    builderLevel: "mid-level",
    preview: {
      name: "Amina Hassan Mohamed",
      title: "Clinical Nurse Specialist",
      sections: [
        { heading: "Personal Information", lines: ["Nationality: Kenyan • Date of Birth: 12/03/1990 • Gender: Female", "Address: Nairobi, Kenya • Phone: +254 712 345 678"] },
        { heading: "Professional Summary", lines: ["Dedicated clinical nurse with 6 years in critical care and emergency medicine. Seeking opportunities in Germany's healthcare sector. BLS/ACLS certified with B2 German proficiency."] },
        { heading: "Work Experience", lines: ["Clinical Nurse — Kenyatta National Hospital (2018–Present)", "Staff Nurse — Aga Khan University Hospital (2016–2018)"] },
        { heading: "Language Skills", lines: ["English: C2 (Native) • Swahili: C2 (Native) • German: B2 (Upper Intermediate)"] },
      ],
    },
  },
  {
    id: "modern",
    label: "Modern Professional CV",
    icon: Sparkles,
    desc: "Contemporary layout with clean sections and subtle design touches",
    builderFormat: "modern",
    builderLevel: "mid-level",
    preview: {
      name: "David Kipchoge Maina",
      title: "Marketing Manager",
      sections: [
        { heading: "About Me", lines: ["Creative marketing strategist with 7 years driving brand growth across FMCG and tech sectors. Launched 12+ campaigns generating KES 50M+ in revenue. Expert in digital marketing, brand positioning, and consumer insights."] },
        { heading: "Key Achievements", lines: ["• Grew social media following by 340% in 18 months", "• Led rebranding project that increased market share by 15%", "• Managed annual marketing budget of KES 25M"] },
        { heading: "Experience", lines: ["Marketing Manager — Unilever Kenya (2020–Present)", "Brand Executive — Safaricom PLC (2017–2020)"] },
        { heading: "Education", lines: ["MSc Marketing — United States International University"] },
      ],
    },
  },
  {
    id: "creative",
    label: "Creative CV",
    icon: Palette,
    desc: "Bold, visual layout for designers, creatives, and media professionals",
    builderFormat: "creative",
    builderLevel: "mid-level",
    preview: {
      name: "Wambui Njeri Gathoni",
      title: "UI/UX Designer & Brand Strategist",
      sections: [
        { heading: "Profile", lines: ["Award-winning designer blending Kenyan aesthetics with global design trends. 5+ years crafting digital experiences for startups and NGOs. Skilled in Figma, Adobe Suite, and design thinking methodology."] },
        { heading: "Portfolio Highlights", lines: ["• M-Shamba App — 500K+ downloads, featured on Google Play", "• Kenya Wildlife Trust rebrand — 200% engagement increase", "• Nairobi Design Week 2023 speaker"] },
        { heading: "Skills", lines: ["Figma • Adobe XD • Illustrator • Prototyping • User Research • Design Systems"] },
        { heading: "Education", lines: ["BA Design — University of Nairobi • Google UX Certificate"] },
      ],
    },
  },
  {
    id: "minimalist",
    label: "Minimalist CV",
    icon: Minimize2,
    desc: "Clean, no-frills format that lets your experience speak for itself",
    builderFormat: "minimalist",
    builderLevel: "entry-level",
    preview: {
      name: "James Mwangi Karanja",
      title: "Accountant",
      sections: [
        { heading: "Summary", lines: ["Detail-oriented accountant with 3 years in financial reporting, tax compliance, and audit support. CPA Section 4 candidate with strong Excel and QuickBooks skills."] },
        { heading: "Experience", lines: ["Accounts Assistant — PKF Kenya (2021–Present)", "Intern Auditor — KPMG East Africa (2020–2021)"] },
        { heading: "Education", lines: ["BCom Accounting — Kenyatta University", "CPA Section 4 — KASNEB (In Progress)"] },
        { heading: "Skills", lines: ["Financial Reporting • Tax Compliance • QuickBooks • Advanced Excel • IFRS"] },
      ],
    },
  },
  {
    id: "cover-letter",
    label: "Cover Letter Examples",
    icon: Mail,
    desc: "Professionally crafted cover letters for various industries",
    builderFormat: "chronological",
    builderLevel: "mid-level",
    isCoverLetter: true,
    preview: {
      name: "Faith Akinyi Odhiambo",
      title: "Application for Senior HR Manager — Safaricom PLC",
      sections: [
        { heading: "", lines: ["Dear Hiring Manager,", "I am writing to express my strong interest in the Senior HR Manager position at Safaricom PLC. With 8 years of progressive experience in human resource management across the telecommunications and banking sectors, I bring a proven track record of building high-performing teams and driving organizational culture transformation."] },
        { heading: "", lines: ["In my current role at KCB Group, I spearheaded a talent acquisition strategy that reduced time-to-hire by 40% and improved retention rates by 25%. I also designed and launched an employee wellness programme that was recognized as a best practice by the Kenya Institute of Human Resource Management."] },
        { heading: "", lines: ["I am particularly drawn to Safaricom's mission of transforming lives through technology, and I am confident that my expertise in strategic HR, labour relations, and change management would make an immediate and lasting impact on your team."] },
        { heading: "", lines: ["I look forward to discussing how I can contribute to Safaricom's continued success.", "Warm regards,", "Faith Akinyi Odhiambo"] },
      ],
    },
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.4 },
  }),
};

export default function SamplesPage() {
  const [previewItem, setPreviewItem] = useState<typeof CATEGORIES[0] | null>(null);

  return (
    <PageLayout
      title="CV Samples & Cover Letter Examples"
      description="Browse professionally crafted CV templates and cover letter examples. See the quality before you order."
    >
      <div className="container max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-6"
          >
            <Shield className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-mono text-primary">Real samples from our professional writers</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-serif font-bold mb-4"
          >
            CV Samples & <span className="text-gradient">Cover Letter Examples</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Preview real CVs crafted by our experts. Choose a template and get a similar CV from our editorial team — tailored to your career.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={i}
            >
              <Card className="group relative border-border/40 bg-card/60 backdrop-blur-sm hover:border-primary/40 transition-all duration-300 h-full flex flex-col overflow-hidden">
                {/* Icon header strip */}
                <div className="h-1.5 bg-gradient-brand w-full" />
                <CardContent className="p-6 flex flex-col flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <cat.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base leading-tight">{cat.label}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{cat.desc}</p>
                    </div>
                  </div>

                  {/* Preview snippet */}
                  <div className="flex-1 rounded-lg border border-border/30 bg-background/50 p-3 mb-4 relative overflow-hidden">
                    <p className="text-[10px] font-semibold text-foreground/80 truncate">{cat.preview.name}</p>
                    <p className="text-[9px] text-primary truncate">{cat.preview.title}</p>
                    <div className="mt-1.5 space-y-0.5">
                      {cat.preview.sections.slice(0, 2).map((s, si) => (
                        <p key={si} className="text-[8px] text-muted-foreground truncate">{s.lines[0]?.slice(0, 60)}…</p>
                      ))}
                    </div>
                    {/* Fade overlay */}
                    <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-background/90 to-transparent flex items-end justify-center pb-1">
                      <Lock className="w-3 h-3 text-muted-foreground/50" />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs border-primary/30 hover:bg-primary/5"
                      onClick={() => setPreviewItem(cat)}
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      Preview
                    </Button>
                    <Link
                      to={cat.isCoverLetter ? "/cover-letter" : `/cv-builder?template=${cat.id}`}
                      className="flex-1"
                    >
                      <Button
                        size="sm"
                        className="w-full text-xs bg-gradient-brand border-0 font-semibold shadow-glow-sm gold-shimmer"
                      >
                        Use Template
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mt-16 p-8 rounded-2xl border border-primary/20 bg-gradient-brand-subtle"
        >
          <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-3">
            Want a CV Like These? <span className="text-gradient">We'll Write It For You.</span>
          </h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto text-sm">
            Select any template above and our professional writers will craft a similar CV tailored to your career — delivered same day via M-Pesa.
          </p>
          <Link to="/order">
            <Button size="lg" className="bg-gradient-brand border-0 font-semibold shadow-glow gold-shimmer">
              Order My CV Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </PageLayout>
  );

  // Modal rendered via state
  return (
    <>
      <PageLayout title="CV Samples" description="Browse CV samples">
        {/* content above */}
      </PageLayout>
      {previewItem && (
        <SamplePreviewModal item={previewItem} onClose={() => setPreviewItem(null)} />
      )}
    </>
  );
}
