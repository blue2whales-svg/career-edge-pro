export interface Job {
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  industry: string;
  market: string;
  posted: string;
  featured?: boolean;
  hot?: boolean;
  tag?: string;
  apply_url?: string;
  description?: string;
  hot_score?: number;
  category?: string;
  country?: string;
  visa_sponsorship?: boolean;
  verified?: boolean;
  source?: string;
  source_label?: string;
  posted_at?: string;
  discovered_at?: string;
  is_active?: boolean;
}

export const INDUSTRIES = [
  "All", "🔥 Hot Abroad", "Cruise & Hospitality", "Domestic & Housekeeping", "Technology", "Finance", "Healthcare",
  "Engineering", "Marketing", "Education", "Legal", "Sales", "Operations",
  "Consulting", "Oil & Gas", "NGO", "Government",
];

export const MARKETS = [
  "All Markets", "UAE", "Qatar", "Oman", "Saudi Arabia", "UK", "USA",
  "Nigeria", "Kenya", "South Africa", "Germany", "Canada", "Australia", "India",
];

export const JOB_CATEGORIES = [
  "All Categories",
  "Kenya Jobs",
  "Gulf Jobs",
  "Cruise Jobs",
  "Remote Jobs",
  "Healthcare Jobs",
  "Engineering Jobs",
  "Construction Jobs",
  "Hospitality Jobs",
  "Drivers & Logistics",
];

export const FEATURED_JOBS: Job[] = [
  {
    title: "Guest Entertainment Host",
    company: "Royal Caribbean International",
    location: "At Sea — Global",
    salary: "KES 410,000–580,000/mo + tips",
    type: "Contract",
    industry: "Cruise & Hospitality",
    market: "UAE",
    posted: "38 min ago",
    featured: true, hot: true, tag: "🚢 Cruise Line",
    hot_score: 85, category: "Cruise Jobs",
    source: "platform_seed", source_label: "CV Edge",
  },
  {
    title: "Ship Restaurant Manager",
    company: "MSC Cruises",
    location: "At Sea — Mediterranean",
    salary: "KES 515,000–710,000/mo",
    type: "Contract",
    industry: "Cruise & Hospitality",
    market: "UAE",
    posted: "1 hour ago",
    featured: true, hot: true, tag: "🚢 Cruise Line",
    hot_score: 80, category: "Cruise Jobs",
    source: "platform_seed", source_label: "CV Edge",
  },
  {
    title: "Live-in Housemaid – Executive Villa",
    company: "Gulf Recruitment Services",
    location: "Dubai, UAE",
    salary: "KES 65,000–90,000/mo + housing",
    type: "Full-time",
    industry: "Domestic & Housekeeping",
    market: "UAE",
    posted: "2 hours ago",
    featured: true, hot: true, tag: "🔥 Gulf Hot",
    hot_score: 75, category: "Gulf Jobs",
    source: "platform_seed", source_label: "CV Edge",
  },
  {
    title: "Hotel Concierge",
    company: "Marriott International",
    location: "Doha, Qatar",
    salary: "KES 195,000–260,000/mo",
    type: "Full-time",
    industry: "Cruise & Hospitality",
    market: "Qatar",
    posted: "4 hours ago",
    featured: true, hot: true, tag: "🔥 Gulf Hot",
    hot_score: 70, category: "Gulf Jobs",
    source: "platform_seed", source_label: "CV Edge",
  },
  {
    title: "Registered Nurse",
    company: "Cleveland Clinic Abu Dhabi",
    location: "Abu Dhabi, UAE",
    salary: "KES 325,000–455,000/mo tax-free",
    type: "Full-time",
    industry: "Healthcare",
    market: "UAE",
    posted: "3 hours ago",
    featured: true, hot: true, tag: "🔥 Gulf Hot",
    hot_score: 90, category: "Healthcare Jobs",
    source: "platform_seed", source_label: "CV Edge",
  },
  {
    title: "Software Developer (Remote)",
    company: "Andela",
    location: "Remote — Africa",
    salary: "KES 390,000–650,000/mo",
    type: "Full-time",
    industry: "Technology",
    market: "Kenya",
    posted: "5 hours ago",
    featured: true, hot: true, tag: "🌍 Remote",
    hot_score: 72, category: "Remote Jobs",
    source: "platform_seed", source_label: "CV Edge",
  },
];

// Static fallback jobs
export const JOBS: Job[] = [
  ...FEATURED_JOBS,
  {
    title: "Spa Therapist – Onboard",
    company: "Celebrity Cruises",
    location: "At Sea — Caribbean",
    salary: "KES 260,000–390,000/mo + tips",
    type: "Contract",
    industry: "Cruise & Hospitality",
    market: "USA",
    posted: "6 hours ago",
    hot: true, tag: "🚢 Cruise Line", category: "Cruise Jobs",
    source: "platform_seed", source_label: "CV Edge",
  },
  {
    title: "Executive Chef",
    company: "Hilton Hotels",
    location: "Riyadh, Saudi Arabia",
    salary: "KES 455,000–650,000/mo tax-free",
    type: "Full-time",
    industry: "Cruise & Hospitality",
    market: "Saudi Arabia",
    posted: "8 hours ago",
    hot: true, tag: "🔥 Gulf Hot", category: "Gulf Jobs",
    source: "platform_seed", source_label: "CV Edge",
  },
  {
    title: "Civil Engineer",
    company: "AECOM",
    location: "Lusail, Qatar",
    salary: "KES 520,000–780,000/mo",
    type: "Full-time",
    industry: "Engineering",
    market: "Qatar",
    posted: "12 hours ago",
    hot: true, tag: "🔥 Gulf Hot", category: "Engineering Jobs",
    source: "platform_seed", source_label: "CV Edge",
  },
  {
    title: "Nanny / Childminder",
    company: "Private Employer",
    location: "Dubai, UAE",
    salary: "KES 55,000–85,000/mo + housing",
    type: "Full-time",
    industry: "Domestic & Housekeeping",
    market: "UAE",
    posted: "1 day ago",
    hot: true, tag: "🔥 Gulf Hot", category: "Gulf Jobs",
    source: "platform_seed", source_label: "CV Edge",
  },
  {
    title: "Customer Service Agent",
    company: "Safaricom PLC",
    location: "Nairobi, Kenya",
    salary: "KES 45,000–65,000/mo",
    type: "Full-time",
    industry: "Operations",
    market: "Kenya",
    posted: "1 day ago",
    category: "Kenya Jobs",
    source: "platform_seed", source_label: "CV Edge",
  },
  {
    title: "Marketing Manager",
    company: "Jumia Group",
    location: "Nairobi, Kenya",
    salary: "KES 120,000–180,000/mo",
    type: "Full-time",
    industry: "Marketing",
    market: "Kenya",
    posted: "2 days ago",
    category: "Kenya Jobs",
    source: "platform_seed", source_label: "CV Edge",
  },
  {
    title: "Heavy Vehicle Driver",
    company: "Al Futtaim Group",
    location: "Dubai, UAE",
    salary: "KES 85,000–130,000/mo",
    type: "Full-time",
    industry: "Operations",
    market: "UAE",
    posted: "1 day ago",
    tag: "🔥 Gulf Hot", category: "Drivers & Logistics",
    source: "platform_seed", source_label: "CV Edge",
  },
  {
    title: "Project Manager — Construction",
    company: "Saudi Binladin Group",
    location: "Jeddah, Saudi Arabia",
    salary: "KES 650,000–910,000/mo",
    type: "Full-time",
    industry: "Engineering",
    market: "Saudi Arabia",
    posted: "2 days ago",
    hot: true, tag: "🔥 Gulf Hot", category: "Construction Jobs",
    source: "platform_seed", source_label: "CV Edge",
  },
];
