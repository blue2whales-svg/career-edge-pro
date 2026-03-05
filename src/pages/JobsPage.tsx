import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search, MapPin, Briefcase, ArrowRight, Clock, Building2, DollarSign, Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

const INDUSTRIES = [
  "All", "Technology", "Finance", "Healthcare", "Engineering", "Marketing",
  "Education", "Legal", "Sales", "Operations", "Consulting", "NGO", "Government",
];

const MARKETS = [
  "All Markets", "UK", "USA", "UAE", "Nigeria", "Kenya", "South Africa",
  "Germany", "Canada", "Australia", "India",
];

const JOBS = [
  {
    title: "Senior Software Engineer",
    company: "Top Tech Firm",
    location: "London, UK",
    salary: "$120k–$160k",
    type: "Full-time",
    industry: "Technology",
    market: "UK",
    posted: "2 hours ago",
  },
  {
    title: "Financial Analyst",
    company: "Global Investment Bank",
    location: "Dubai, UAE",
    salary: "$85k–$110k",
    type: "Full-time",
    industry: "Finance",
    market: "UAE",
    posted: "5 hours ago",
  },
  {
    title: "Marketing Director",
    company: "Consumer Brand",
    location: "Lagos, Nigeria",
    salary: "₦15M–₦25M",
    type: "Full-time",
    industry: "Marketing",
    market: "Nigeria",
    posted: "1 day ago",
  },
  {
    title: "Data Scientist",
    company: "AI Startup",
    location: "Berlin, Germany",
    salary: "€75k–€95k",
    type: "Full-time",
    industry: "Technology",
    market: "Germany",
    posted: "3 hours ago",
  },
  {
    title: "Healthcare Administrator",
    company: "Private Hospital Group",
    location: "Nairobi, Kenya",
    salary: "KES 200k–350k/mo",
    type: "Full-time",
    industry: "Healthcare",
    market: "Kenya",
    posted: "12 hours ago",
  },
  {
    title: "Product Manager",
    company: "SaaS Company",
    location: "New York, USA",
    salary: "$130k–$170k",
    type: "Full-time",
    industry: "Technology",
    market: "USA",
    posted: "6 hours ago",
  },
  {
    title: "Civil Engineer",
    company: "Construction Corp",
    location: "Johannesburg, SA",
    salary: "R45k–R65k/mo",
    type: "Full-time",
    industry: "Engineering",
    market: "South Africa",
    posted: "1 day ago",
  },
  {
    title: "Management Consultant",
    company: "Big 4 Advisory",
    location: "Toronto, Canada",
    salary: "C$95k–C$130k",
    type: "Full-time",
    industry: "Consulting",
    market: "Canada",
    posted: "4 hours ago",
  },
  {
    title: "HR Business Partner",
    company: "Multinational Corp",
    location: "Mumbai, India",
    salary: "₹18L–₹28L",
    type: "Full-time",
    industry: "Operations",
    market: "India",
    posted: "8 hours ago",
  },
];

export default function JobsPage() {
  const [search, setSearch] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All");

  const filtered = JOBS.filter((job) => {
    const matchSearch = job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase());
    const matchIndustry = selectedIndustry === "All" || job.industry === selectedIndustry;
    return matchSearch && matchIndustry;
  });

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative z-10 pt-16 sm:pt-24 pb-10 px-4">
        <div className="container max-w-5xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}
            className="inline-flex items-center gap-2 rounded-full border border-brand-red/20 bg-brand-red/5 px-4 py-1.5 mb-6"
          >
            <Briefcase className="h-3.5 w-3.5 text-brand-red" />
            <span className="text-xs font-mono text-brand-red">Jobs Board</span>
          </motion.div>
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={1}
            className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold leading-[1.08] mb-5"
          >
            Find your next role.{" "}
            <span className="text-gradient">Get the CV to match.</span>
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={2}
            className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            Browse opportunities across 13 industries and 10 global markets. When you find the right role, we'll craft the perfect CV for it.
          </motion.p>

          {/* Search */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3}
            className="max-w-xl mx-auto relative"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search job title or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-13 pl-12 bg-card border-border text-base"
            />
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="relative z-10 pb-6 px-4">
        <div className="container max-w-5xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {INDUSTRIES.map((ind) => (
              <button
                key={ind}
                onClick={() => setSelectedIndustry(ind)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedIndustry === ind
                    ? "bg-gradient-brand text-primary-foreground"
                    : "border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="relative z-10 pb-24 px-4">
        <div className="container max-w-5xl mx-auto">
          <div className="space-y-3">
            {filtered.map((job, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i % 4}
                className="group rounded-xl border border-border bg-card p-5 sm:p-6 hover:border-primary/30 hover:shadow-glow-sm transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-brand-subtle flex items-center justify-center shrink-0 mt-0.5">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-base sm:text-lg">{job.title}</h3>
                        <p className="text-sm text-muted-foreground">{job.company}</p>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" /> {job.salary}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {job.posted}
                          </span>
                          <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-mono">
                            {job.industry}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Link to="/order" className="shrink-0">
                    <Button className="w-full sm:w-auto bg-gradient-brand border-0 font-semibold gold-shimmer">
                      Get CV for this role <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No jobs found matching your search. Try a different filter.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-20 px-4">
        <div className="container max-w-3xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="rounded-2xl border border-primary/20 bg-gradient-brand-subtle p-10 sm:p-14"
          >
            <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4">
              Don't see your dream role? <span className="text-gradient">We'll still help.</span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Order a CV tailored to any role or industry. Share the job description and we'll craft the perfect application.
            </p>
            <Link to="/order">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-brand border-0 font-semibold h-13 px-10 shadow-glow gold-shimmer">
                Order Custom CV <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
