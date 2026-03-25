import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Job } from "@/data/jobs";

interface FeaturedCategoriesProps {
  jobs: Job[];
  onFilterChange: (params: { search?: string; industry?: string; market?: string }) => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

const categories = [
  {
    icon: "🇰🇪",
    title: "Kenya Jobs",
    subtitle: "Fresh local opportunities in Nairobi, Mombasa & more",
    filter: { market: "Kenya" },
    countFn: (jobs: Job[]) => jobs.filter((j) => j.market === "Kenya").length,
  },
  {
    icon: "🏨",
    title: "Dubai & Gulf Jobs",
    subtitle: "Hotels, construction, healthcare & more — tax-free",
    filter: { industry: "🔥 Hot Abroad", market: "UAE" },
    countFn: (jobs: Job[]) =>
      jobs.filter((j) => ["UAE", "Qatar", "Saudi Arabia", "Oman"].includes(j.market)).length,
  },
  {
    icon: "🚢",
    title: "Cruise Ship Jobs",
    subtitle: "Global cruise lines actively recruiting",
    filter: { search: "cruise" },
    countFn: (jobs: Job[]) =>
      jobs.filter((j) => j.title.toLowerCase().includes("cruise") || j.tag?.includes("Cruise")).length,
  },
  {
    icon: "🌍",
    title: "Remote Jobs",
    subtitle: "Work globally from anywhere in Africa",
    filter: { search: "remote" },
    countFn: (jobs: Job[]) =>
      jobs.filter((j) => j.type?.toLowerCase().includes("remote") || j.title.toLowerCase().includes("remote") || j.category === "Remote Jobs").length,
  },
  {
    icon: "✈️",
    title: "Visa Sponsorship",
    subtitle: "Employers offering work permits & relocation",
    filter: { search: "visa" },
    countFn: (jobs: Job[]) =>
      jobs.filter((j) => j.visa_sponsorship || j.tag?.includes("Visa")).length,
  },
  {
    icon: "🏥",
    title: "Healthcare Jobs",
    subtitle: "Nursing, medical & healthcare roles abroad",
    filter: { industry: "Healthcare" },
    countFn: (jobs: Job[]) => jobs.filter((j) => j.industry === "Healthcare").length,
  },
];

export function FeaturedCategories({ jobs, onFilterChange }: FeaturedCategoriesProps) {
  return (
    <section className="relative z-10 pb-6 px-4">
      <div className="container max-w-5xl mx-auto">
        <p className="text-[13px] font-semibold mb-3 text-primary">
          ⭐ Featured Opportunities
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((cat, i) => {
            const count = cat.countFn(jobs);
            return (
              <motion.div
                key={cat.title}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={i}
                className="rounded-xl p-4 cursor-pointer transition-all duration-300 border border-primary/20 bg-primary/5 hover:border-primary/40"
                onClick={() => onFilterChange(cat.filter)}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="text-[10px] font-mono font-semibold rounded-full px-2 py-0.5 bg-primary/10 text-primary">
                    ⭐ Featured
                  </span>
                </div>
                <h3 className="font-semibold text-sm mb-1">{cat.title}</h3>
                <p className="text-xs text-muted-foreground mb-3">{cat.subtitle}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-mono">{count} jobs live</span>
                  <Button variant="ghost" size="sm" className="text-xs h-7 px-2 gap-1 text-primary">
                    Browse <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
