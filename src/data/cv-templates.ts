export interface CVTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  colors: string[];
  layout: "single" | "two-column" | "sidebar" | "photo";
  style: "classic" | "modern" | "creative" | "minimal" | "executive" | "ats";
}

export const TEMPLATE_CATEGORIES = [
  "All",
  "Simple",
  "ATS",
  "Two-Column",
  "Picture",
  "Executive",
  "Creative",
  "Minimalist",
  "Europass",
  "Google Docs",
] as const;

export const CV_TEMPLATES: CVTemplate[] = [
  // Simple (6)
  { id: "classic", name: "Classic", category: "Simple", description: "Timeless design that works for any industry", colors: ["#1a2332", "#2563eb", "#059669", "#9333ea", "#dc2626"], layout: "single", style: "classic" },
  { id: "traditional", name: "Traditional", category: "Simple", description: "Conservative layout preferred by hiring managers", colors: ["#1a2332", "#1e40af", "#065f46", "#7c3aed", "#b91c1c"], layout: "single", style: "classic" },
  { id: "clean", name: "Clean", category: "Simple", description: "Minimalist approach with maximum readability", colors: ["#374151", "#3b82f6", "#10b981", "#8b5cf6", "#ef4444"], layout: "single", style: "minimal" },
  { id: "basic", name: "Basic", category: "Simple", description: "Straightforward and professional", colors: ["#1f2937", "#2563eb", "#047857", "#7c3aed", "#dc2626"], layout: "single", style: "classic" },
  { id: "fresh", name: "Fresh", category: "Simple", description: "Modern take on the classic CV format", colors: ["#0ea5e9", "#2563eb", "#059669", "#a855f7", "#f43f5e"], layout: "single", style: "modern" },
  { id: "elegant", name: "Elegant", category: "Simple", description: "Sophisticated design with refined typography", colors: ["#c9a94e", "#1a2332", "#374151", "#78716c", "#92400e"], layout: "single", style: "classic" },

  // ATS (6)
  { id: "prime-ats", name: "Prime ATS", category: "ATS", description: "Engineered to pass all ATS scanners", colors: ["#1a2332", "#1e40af", "#374151", "#4b5563", "#111827"], layout: "single", style: "ats" },
  { id: "pure-ats", name: "Pure ATS", category: "ATS", description: "Zero-distraction format for maximum parsability", colors: ["#111827", "#1e3a5f", "#374151", "#1f2937", "#0f172a"], layout: "single", style: "ats" },
  { id: "specialist", name: "Specialist", category: "ATS", description: "Industry-specific keyword optimization", colors: ["#1e40af", "#111827", "#059669", "#7c3aed", "#b91c1c"], layout: "single", style: "ats" },
  { id: "ats-pro", name: "ATS Pro", category: "ATS", description: "Advanced formatting for technical roles", colors: ["#0f172a", "#1e40af", "#334155", "#475569", "#1a2332"], layout: "single", style: "ats" },
  { id: "ats-clean", name: "ATS Clean", category: "ATS", description: "Clean lines optimized for machine reading", colors: ["#374151", "#1e3a5f", "#111827", "#4b5563", "#0f172a"], layout: "single", style: "ats" },
  { id: "ats-bold", name: "ATS Bold", category: "ATS", description: "Bold headers with ATS-safe structure", colors: ["#1a2332", "#dc2626", "#111827", "#1e40af", "#047857"], layout: "single", style: "ats" },

  // Two-Column (6)
  { id: "professional", name: "Professional", category: "Two-Column", description: "Balanced two-column layout for experienced professionals", colors: ["#1a2332", "#2563eb", "#059669", "#9333ea", "#dc2626"], layout: "two-column", style: "modern" },
  { id: "corporate", name: "Corporate", category: "Two-Column", description: "Enterprise-ready design with sidebar navigation", colors: ["#0f172a", "#1e40af", "#334155", "#7c3aed", "#b91c1c"], layout: "sidebar", style: "modern" },
  { id: "clean-split", name: "Clean Split", category: "Two-Column", description: "Elegant split layout with clear hierarchy", colors: ["#374151", "#0ea5e9", "#059669", "#a855f7", "#f43f5e"], layout: "two-column", style: "modern" },
  { id: "modern-split", name: "Modern Split", category: "Two-Column", description: "Contemporary asymmetric design", colors: ["#2563eb", "#0f172a", "#059669", "#9333ea", "#dc2626"], layout: "two-column", style: "modern" },
  { id: "sidebar-dark", name: "Sidebar Dark", category: "Two-Column", description: "Dark sidebar with light content area", colors: ["#0f172a", "#1a2332", "#1e3a5f", "#334155", "#111827"], layout: "sidebar", style: "modern" },
  { id: "sidebar-light", name: "Sidebar Light", category: "Two-Column", description: "Light sidebar with professional contrast", colors: ["#e2e8f0", "#1a2332", "#3b82f6", "#059669", "#9333ea"], layout: "sidebar", style: "modern" },

  // Picture (4)
  { id: "professional-photo", name: "Professional Photo", category: "Picture", description: "Photo header with professional layout", colors: ["#1a2332", "#2563eb", "#059669", "#9333ea", "#dc2626"], layout: "photo", style: "modern" },
  { id: "corporate-photo", name: "Corporate Photo", category: "Picture", description: "Corporate style with photo placement", colors: ["#0f172a", "#1e40af", "#334155", "#7c3aed", "#b91c1c"], layout: "photo", style: "classic" },
  { id: "creative-photo", name: "Creative Photo", category: "Picture", description: "Creative layout with prominent photo", colors: ["#7c3aed", "#ec4899", "#2563eb", "#059669", "#f59e0b"], layout: "photo", style: "creative" },
  { id: "clean-photo", name: "Clean Photo", category: "Picture", description: "Minimalist design with tasteful photo area", colors: ["#374151", "#6b7280", "#1a2332", "#2563eb", "#059669"], layout: "photo", style: "minimal" },

  // Executive (4)
  { id: "executive-classic", name: "Executive Classic", category: "Executive", description: "Commanding presence for C-level professionals", colors: ["#c9a94e", "#1a2332", "#0f172a", "#78716c", "#92400e"], layout: "single", style: "executive" },
  { id: "boardroom", name: "Boardroom", category: "Executive", description: "Board-level sophistication and authority", colors: ["#1a2332", "#c9a94e", "#374151", "#0f172a", "#78716c"], layout: "single", style: "executive" },
  { id: "c-suite", name: "C-Suite", category: "Executive", description: "Designed for CEO, CFO, and CTO positions", colors: ["#0f172a", "#b45309", "#1a2332", "#c9a94e", "#374151"], layout: "two-column", style: "executive" },
  { id: "director", name: "Director", category: "Executive", description: "Strategic leadership presentation", colors: ["#1e3a5f", "#c9a94e", "#0f172a", "#374151", "#1a2332"], layout: "single", style: "executive" },

  // Creative (5)
  { id: "creative-purple", name: "Creative Purple", category: "Creative", description: "Bold purple accents for creative professionals", colors: ["#7c3aed", "#a855f7", "#6d28d9", "#4f46e5", "#8b5cf6"], layout: "two-column", style: "creative" },
  { id: "bold-designer", name: "Bold Designer", category: "Creative", description: "Eye-catching design for visual professionals", colors: ["#ec4899", "#f43f5e", "#8b5cf6", "#2563eb", "#f59e0b"], layout: "sidebar", style: "creative" },
  { id: "gradient", name: "Gradient", category: "Creative", description: "Smooth gradient headers for modern creatives", colors: ["#2563eb", "#7c3aed", "#ec4899", "#059669", "#f59e0b"], layout: "two-column", style: "creative" },
  { id: "artistic", name: "Artistic", category: "Creative", description: "Artistic layout for design portfolios", colors: ["#f59e0b", "#ec4899", "#7c3aed", "#2563eb", "#059669"], layout: "sidebar", style: "creative" },
  { id: "portfolio", name: "Portfolio", category: "Creative", description: "Showcase your work with style", colors: ["#0ea5e9", "#6366f1", "#ec4899", "#f59e0b", "#10b981"], layout: "two-column", style: "creative" },

  // Minimalist (5)
  { id: "pure-white", name: "Pure White", category: "Minimalist", description: "Ultra-clean white space design", colors: ["#111827", "#374151", "#6b7280", "#9ca3af", "#d1d5db"], layout: "single", style: "minimal" },
  { id: "ultra-clean", name: "Ultra Clean", category: "Minimalist", description: "Nothing but the essentials", colors: ["#1f2937", "#374151", "#4b5563", "#6b7280", "#111827"], layout: "single", style: "minimal" },
  { id: "typography", name: "Typography", category: "Minimalist", description: "Type-driven design with careful spacing", colors: ["#0f172a", "#334155", "#64748b", "#94a3b8", "#1e293b"], layout: "single", style: "minimal" },
  { id: "monochrome", name: "Monochrome", category: "Minimalist", description: "Single-color elegance", colors: ["#1a2332", "#334155", "#475569", "#64748b", "#0f172a"], layout: "single", style: "minimal" },
  { id: "zen", name: "Zen", category: "Minimalist", description: "Peaceful, balanced layout with breathing room", colors: ["#374151", "#6b7280", "#1f2937", "#4b5563", "#111827"], layout: "single", style: "minimal" },
];

export const CATEGORY_DESCRIPTIONS: Record<string, { title: string; description: string }> = {
  Simple: {
    title: "Simple & Basic CV Templates",
    description: "Clean, straightforward designs that let your experience speak for itself. Perfect for traditional industries like finance, law, healthcare, and government. These templates prioritize readability and professional appearance.",
  },
  ATS: {
    title: "ATS-Optimised CV Templates",
    description: "Engineered specifically to pass Applicant Tracking Systems. These templates use ATS-safe formatting, standard section headers, and clean structure to ensure your CV gets past the robots and into human hands.",
  },
  "Two-Column": {
    title: "Two-Column CV Templates",
    description: "Modern layouts that maximize space with elegant dual-column designs. Ideal for professionals with diverse skills who want to showcase both technical competencies and career achievements side by side.",
  },
  Executive: {
    title: "Executive CV Templates",
    description: "Premium designs crafted for senior leadership, C-suite executives, and board-level professionals. These templates convey authority, strategic thinking, and decades of proven leadership.",
  },
  Creative: {
    title: "Creative CV Templates",
    description: "Bold, eye-catching designs for creative professionals in design, marketing, media, and the arts. Stand out from the crowd while maintaining professional standards.",
  },
  Minimalist: {
    title: "Minimalist CV Templates",
    description: "Less is more. These templates use generous white space, refined typography, and clean lines to create a sophisticated, modern impression that appeals to forward-thinking employers.",
  },
};

export const TEMPLATE_FAQ = [
  {
    q: "What CV template format is best?",
    a: "For most job applications, an ATS-optimised single-column template is the safest choice. If you're in a creative field, two-column or creative templates can help you stand out. Executive roles benefit from premium, authoritative designs.",
  },
  {
    q: "Are these CV templates free to use?",
    a: "You can preview all templates for free and start building your CV with any template. Premium features like PDF/DOCX export and ATS optimization are available with our professional packages.",
  },
  {
    q: "Can I change my CV template later?",
    a: "Yes! Your content is saved separately from the template. You can switch between any of our 36+ templates at any time without losing your information.",
  },
  {
    q: "Are these templates ATS-friendly?",
    a: "All our templates are designed with ATS compatibility in mind. Our dedicated ATS templates are specifically engineered to achieve the highest parse rates across all major Applicant Tracking Systems.",
  },
  {
    q: "What file formats can I download?",
    a: "Every template is available in both PDF and DOCX formats. PDF ensures pixel-perfect rendering, while DOCX allows further editing in Microsoft Word or Google Docs.",
  },
  {
    q: "Do I need to create an account?",
    a: "You can browse and preview all templates without an account. Creating an account lets you save your progress and access your CV from any device.",
  },
  {
    q: "How do I choose the right template for my industry?",
    a: "Finance, law, and government roles prefer Simple or ATS templates. Tech and startups work well with Modern or Two-Column. Creative industries can use our Creative templates. Executive roles should use our Executive collection.",
  },
  {
    q: "Can I customise the colours and fonts?",
    a: "Yes. Every template supports custom colour themes and font selections. You can match your CV to your personal brand or industry conventions.",
  },
];
