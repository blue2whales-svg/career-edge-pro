// @ts-nocheck
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategoryCounts } from "@/hooks/useJobs";

interface FeaturedCategoriesProps {
  onFilterChange: (filters: any) => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

const categories = [
  {
    icon: "🇰🇪",
    title: "Kenya Jobs",
    subtitle: "Fresh local opportunities in Nairobi, Mombasa & more",
    filter: { market: "kenya" },
    countKey: "Kenya Jobs",
  },
  {
    icon: "🏨",
    title: "Dubai & Gulf Jobs",
    subtitle: "Hotels, construction, healthcare & more — tax-free",
    filter: { market: "uae" },
    countKey: "Gulf Jobs",
  },
  {
    icon: "🚢",
    title: "Cruise Ship Jobs",
    subtitle: "Global cruise lines actively recruiting",
    filter: { market: "cruise" },
    countKey: "Cruise Jobs",
  },
  {
    icon: "🌍",
    title: "Remote Jobs",
    subtitle: "Work globally from anywhere in Africa",
    filter: { market: "remote" },
    countKey: "Remote Jobs",
  },
  {
    icon: "✈️",
    title: "Visa Sponsorship",
    subtitle: "Employers offering work permits & relocation",
    filter: { visaOnly: true },
    countKey: "Visa Sponsorship",
  },
  {
    icon: "🏥",
    title: "Healthcare Jobs",
    subtitle: "Nursing, medical & healthcare roles abroad",
    filter: { industry: "Healthcare" },
    countKey: "Healthcare Jobs",
  },
];

export function FeaturedCategories({ onFilterChange }: FeaturedCategoriesProps) {
  const { data: counts, isLoading } = useCategoryCounts();
  return (
    <section className="relative z-10 pb-6 px-4">
      <div className="container max-w-5xl mx-auto">
        <p className="text-[13px] font-semibold mb-3 text-primary">⭐ Featured Opportunities</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((cat, i) => {
            const count = counts?.[cat.countKey] ?? 0;
            return (
              <motion.div
                key={cat.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
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
                  {isLoading ? (
                    <Skeleton className="h-4 w-16" />
                  ) : (
                    <span className="text-xs text-muted-foreground font-mono">{count} jobs live</span>
                  )}
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
