const categories = [
  {
    icon: "🇰🇪",
    title: "Kenya Jobs",
    subtitle: "Fresh local opportunities in Nairobi, Mombasa & more",
    filter: { market: "kenya" } as Partial<JobFilters>,
    countKey: "Kenya Jobs",
  },
  {
    icon: "🏨",
    title: "Dubai & Gulf Jobs",
    subtitle: "Hotels, construction, healthcare & more — tax-free",
    filter: { market: "uae" } as Partial<JobFilters>,
    countKey: "Gulf Jobs",
  },
  {
    icon: "🚢",
    title: "Cruise Ship Jobs",
    subtitle: "Global cruise lines actively recruiting",
    filter: { market: "cruise" } as Partial<JobFilters>,
    countKey: "Cruise Jobs",
  },
  {
    icon: "🌍",
    title: "Remote Jobs",
    subtitle: "Work globally from anywhere in Africa",
    filter: { market: "remote" } as Partial<JobFilters>,
    countKey: "Remote Jobs",
  },
  {
    icon: "✈️",
    title: "Visa Sponsorship",
    subtitle: "Employers offering work permits & relocation",
    filter: { visaOnly: true } as Partial<JobFilters>,
    countKey: "Visa Sponsorship",
  },
  {
    icon: "🏥",
    title: "Healthcare Jobs",
    subtitle: "Nursing, medical & healthcare roles abroad",
    filter: { industry: "Healthcare" } as Partial<JobFilters>,
    countKey: "Healthcare Jobs",
  },
];
