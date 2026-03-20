import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, FileText, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";

/* ── Template data with realistic content ── */
interface TemplateInfo {
  id: string;
  name: string;
  category: string;
  description: string;
  colors: string[];
  person: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    skills: string[];
    experience: { role: string; company: string; dates: string; bullets: string[] }[];
    education: { degree: string; school: string; year: string }[];
  };
  layout: "single" | "sidebar" | "two-column" | "photo";
}

const PEOPLE = [
  {
    name: "James Mitchell",
    title: "Senior Marketing Manager",
    email: "james@email.com",
    phone: "+254 722 000 111",
    location: "Nairobi, Kenya",
    summary:
      "Results-driven marketing professional with 8+ years of experience in brand strategy and digital marketing. Expert in leading cross-functional teams, increasing ROI by 45%, and managing multi-million shilling campaigns across East Africa.",
    skills: ["Digital Marketing", "Brand Strategy", "SEO/SEM", "Data Analytics", "Team Leadership", "Content Strategy"],
    experience: [
      {
        role: "Marketing Director",
        company: "Safaricom PLC",
        dates: "2021 – Present",
        bullets: [
          "Increased brand engagement by 67% through integrated digital campaigns",
          "Managed a team of 12 marketing professionals across 3 departments",
          "Led rebranding initiative that boosted market share by 15%",
        ],
      },
      {
        role: "Senior Brand Manager",
        company: "Kenya Red Cross",
        dates: "2018 – 2021",
        bullets: [
          "Developed award-winning awareness campaign reaching 2M+ people",
          "Grew social media following by 340% in 18 months",
        ],
      },
    ],
    education: [
      { degree: "MBA, Marketing", school: "Strathmore University", year: "2018" },
      { degree: "BSc Business Administration", school: "University of Nairobi", year: "2015" },
    ],
  },
  {
    name: "Sarah Wanjiku",
    title: "Software Engineer",
    email: "sarah.w@email.com",
    phone: "+254 733 000 222",
    location: "Nairobi, Kenya",
    summary:
      "Full-stack software engineer with 6+ years building scalable web applications. Specialized in React, Node.js, and cloud architecture. Passionate about clean code and mentoring junior developers.",
    skills: ["React", "TypeScript", "Node.js", "AWS", "Python", "PostgreSQL"],
    experience: [
      {
        role: "Senior Software Engineer",
        company: "Andela",
        dates: "2020 – Present",
        bullets: [
          "Architected microservices platform handling 1M+ daily transactions",
          "Reduced API response times by 60% through optimization",
          "Mentored 8 junior developers in modern web technologies",
        ],
      },
      {
        role: "Software Developer",
        company: "Twiga Foods",
        dates: "2017 – 2020",
        bullets: [
          "Built supply chain management system for 5,000+ vendors",
          "Implemented real-time tracking reducing delivery delays by 35%",
        ],
      },
    ],
    education: [{ degree: "BSc Computer Science", school: "JKUAT", year: "2017" }],
  },
  {
    name: "David Ochieng",
    title: "Financial Analyst",
    email: "david.o@email.com",
    phone: "+254 711 000 333",
    location: "Mombasa, Kenya",
    summary:
      "Detail-oriented financial analyst with 5+ years of experience in corporate finance and investment analysis. CPA-K certified with expertise in financial modeling, risk assessment, and strategic planning.",
    skills: ["Financial Modeling", "Risk Analysis", "SAP", "Excel Advanced", "CPA-K", "IFRS"],
    experience: [
      {
        role: "Senior Financial Analyst",
        company: "Equity Bank",
        dates: "2021 – Present",
        bullets: [
          "Managed portfolio analysis for KES 5B+ investment fund",
          "Developed financial models that improved forecast accuracy by 30%",
          "Led quarterly reporting for board of directors",
        ],
      },
      {
        role: "Financial Analyst",
        company: "Deloitte East Africa",
        dates: "2018 – 2021",
        bullets: [
          "Conducted due diligence for 15+ M&A transactions",
          "Prepared valuation reports for companies worth KES 2B+",
        ],
      },
    ],
    education: [
      { degree: "BCom Finance", school: "University of Nairobi", year: "2018" },
      { degree: "CPA-K Certification", school: "KASNEB", year: "2019" },
    ],
  },
  {
    name: "Amina Hassan",
    title: "Human Resources Director",
    email: "amina.h@email.com",
    phone: "+254 700 000 444",
    location: "Nairobi, Kenya",
    summary:
      "Strategic HR leader with 10+ years driving organizational excellence across East Africa. Expert in talent acquisition, employee engagement, and change management for Fortune 500 companies.",
    skills: ["Talent Acquisition", "HRIS Systems", "Change Management", "Labour Law", "L&D", "Compensation"],
    experience: [
      {
        role: "HR Director",
        company: "Unilever Kenya",
        dates: "2019 – Present",
        bullets: [
          "Reduced employee turnover by 40% through engagement programs",
          "Led digital transformation of HR processes for 2,000+ employees",
          "Implemented DEI strategy increasing diversity metrics by 55%",
        ],
      },
      {
        role: "HR Manager",
        company: "KCB Group",
        dates: "2015 – 2019",
        bullets: [
          "Managed recruitment for 500+ hires annually",
          "Developed leadership pipeline program for high-potential employees",
        ],
      },
    ],
    education: [{ degree: "MBA, Human Resources", school: "Strathmore University", year: "2015" }],
  },
  {
    name: "Peter Kamau",
    title: "Project Manager",
    email: "peter.k@email.com",
    phone: "+254 722 000 555",
    location: "Nakuru, Kenya",
    summary:
      "PMP-certified project manager with 7+ years delivering complex infrastructure and IT projects on time and within budget. Proven track record managing teams of 50+ and budgets exceeding KES 500M.",
    skills: ["PMP Certified", "Agile/Scrum", "MS Project", "Risk Management", "Stakeholder Mgmt", "Budgeting"],
    experience: [
      {
        role: "Senior Project Manager",
        company: "Kenya Power",
        dates: "2020 – Present",
        bullets: [
          "Managed KES 800M smart grid implementation project",
          "Delivered 12 projects on time with 98% client satisfaction",
          "Led cross-functional team of 45 engineers and technicians",
        ],
      },
      {
        role: "Project Manager",
        company: "Huawei Kenya",
        dates: "2017 – 2020",
        bullets: [
          "Oversaw 4G network rollout across 15 counties",
          "Reduced project costs by 20% through resource optimization",
        ],
      },
    ],
    education: [
      { degree: "BSc Civil Engineering", school: "University of Nairobi", year: "2016" },
      { degree: "PMP Certification", school: "PMI", year: "2018" },
    ],
  },
  {
    name: "Grace Muthoni",
    title: "Graphic Designer",
    email: "grace.m@email.com",
    phone: "+254 733 000 666",
    location: "Nairobi, Kenya",
    summary:
      "Award-winning graphic designer with 5+ years creating stunning visual identities for global brands. Proficient in Adobe Creative Suite with a keen eye for typography and color theory.",
    skills: ["Adobe Photoshop", "Illustrator", "Figma", "UI/UX Design", "Branding", "Motion Graphics"],
    experience: [
      {
        role: "Lead Designer",
        company: "Ogilvy Africa",
        dates: "2021 – Present",
        bullets: [
          "Designed brand identity for 20+ major African brands",
          "Won 3 Loeries Awards for creative excellence",
          "Managed design team of 6 across Nairobi and Lagos offices",
        ],
      },
      {
        role: "Graphic Designer",
        company: "Scanad Kenya",
        dates: "2018 – 2021",
        bullets: ["Created visual campaigns reaching 10M+ consumers", "Developed packaging designs for FMCG products"],
      },
    ],
    education: [{ degree: "BA Graphic Design", school: "USIU-Africa", year: "2018" }],
  },
  {
    name: "Michael Njoroge",
    title: "Operations Manager",
    email: "michael.n@email.com",
    phone: "+254 700 000 777",
    location: "Nairobi, Kenya",
    summary:
      "Operations expert with 8+ years optimizing supply chains and logistics across East Africa. Skilled in lean management, process improvement, and leading teams of 100+.",
    skills: ["Supply Chain", "Lean Six Sigma", "ERP Systems", "Logistics", "Team Leadership", "Quality Control"],
    experience: [
      {
        role: "Operations Manager",
        company: "DHL East Africa",
        dates: "2019 – Present",
        bullets: [
          "Optimized logistics network reducing delivery times by 25%",
          "Managed operations budget of KES 1.2B annually",
          "Implemented lean processes saving KES 50M per year",
        ],
      },
      {
        role: "Supply Chain Lead",
        company: "Bidco Africa",
        dates: "2016 – 2019",
        bullets: [
          "Coordinated supply chain for 200+ SKUs across 5 countries",
          "Reduced inventory costs by 18% through JIT implementation",
        ],
      },
    ],
    education: [
      { degree: "BSc Mechanical Engineering", school: "University of Nairobi", year: "2015" },
      { degree: "Lean Six Sigma Black Belt", school: "ASQ", year: "2018" },
    ],
  },
  {
    name: "Faith Akinyi",
    title: "Data Scientist",
    email: "faith.a@email.com",
    phone: "+254 711 000 888",
    location: "Nairobi, Kenya",
    summary:
      "Data scientist with 4+ years leveraging machine learning and statistical analysis to drive business decisions. Experienced in building predictive models that increased revenue by 25% for fintech companies.",
    skills: ["Python", "Machine Learning", "SQL", "TensorFlow", "Tableau", "Statistics"],
    experience: [
      {
        role: "Data Scientist",
        company: "M-KOPA Solar",
        dates: "2021 – Present",
        bullets: [
          "Built credit scoring model serving 3M+ customers",
          "Developed churn prediction system reducing attrition by 30%",
          "Created automated reporting dashboards for C-suite",
        ],
      },
      {
        role: "Data Analyst",
        company: "Safaricom M-Pesa",
        dates: "2019 – 2021",
        bullets: [
          "Analyzed transaction patterns for 30M+ mobile money users",
          "Built fraud detection algorithms saving KES 200M annually",
        ],
      },
    ],
    education: [
      { degree: "MSc Data Science", school: "Strathmore University", year: "2019" },
      { degree: "BSc Mathematics", school: "University of Nairobi", year: "2017" },
    ],
  },
  {
    name: "Robert Kipchoge",
    title: "Sales Director",
    email: "robert.k@email.com",
    phone: "+254 722 000 999",
    location: "Eldoret, Kenya",
    summary:
      "High-performing sales leader with 9+ years consistently exceeding targets across B2B and B2C markets. Built and managed sales teams generating KES 2B+ in annual revenue.",
    skills: ["Sales Strategy", "CRM (Salesforce)", "Negotiation", "Business Dev", "Team Building", "Revenue Growth"],
    experience: [
      {
        role: "Sales Director",
        company: "BAT Kenya",
        dates: "2020 – Present",
        bullets: [
          "Grew regional revenue by 35% year-over-year",
          "Built sales team from 15 to 45 representatives",
          "Secured 20+ enterprise contracts worth KES 500M+",
        ],
      },
      {
        role: "Regional Sales Manager",
        company: "Coca-Cola Beverages Africa",
        dates: "2016 – 2020",
        bullets: [
          "Managed Rift Valley region achieving 120% of target",
          "Launched 3 new product lines generating KES 300M first year",
        ],
      },
    ],
    education: [{ degree: "BBA Marketing", school: "Moi University", year: "2015" }],
  },
  {
    name: "Linda Chebet",
    title: "Legal Counsel",
    email: "linda.c@email.com",
    phone: "+254 733 000 100",
    location: "Nairobi, Kenya",
    summary:
      "Corporate lawyer with 7+ years of experience in commercial law, M&A, and regulatory compliance across East Africa. Admitted to the Kenya Bar with a proven track record in high-value transactions.",
    skills: ["Corporate Law", "M&A", "Compliance", "Contract Drafting", "Litigation", "Due Diligence"],
    experience: [
      {
        role: "Senior Legal Counsel",
        company: "Cytonn Investments",
        dates: "2020 – Present",
        bullets: [
          "Led legal due diligence for KES 10B+ real estate transactions",
          "Drafted and reviewed 200+ commercial contracts annually",
          "Managed regulatory compliance across 4 East African jurisdictions",
        ],
      },
      {
        role: "Associate Lawyer",
        company: "Anjarwalla & Khanna",
        dates: "2017 – 2020",
        bullets: [
          "Handled M&A transactions totalling KES 5B+",
          "Represented clients in commercial arbitration proceedings",
        ],
      },
    ],
    education: [
      { degree: "LLB (Hons)", school: "University of Nairobi", year: "2016" },
      { degree: "KSL Diploma", school: "Kenya School of Law", year: "2017" },
    ],
  },
  {
    name: "John Mwangi",
    title: "Healthcare Administrator",
    email: "john.mw@email.com",
    phone: "+254 700 000 200",
    location: "Nairobi, Kenya",
    summary:
      "Healthcare administration professional with 6+ years managing hospital operations and improving patient care outcomes. Experienced in budget management, staff coordination, and healthcare policy implementation.",
    skills: ["Hospital Management", "Healthcare Policy", "Budget Management", "Patient Care", "HMIS", "Compliance"],
    experience: [
      {
        role: "Hospital Administrator",
        company: "Aga Khan Hospital",
        dates: "2020 – Present",
        bullets: [
          "Managed daily operations for 350-bed facility",
          "Improved patient satisfaction scores by 28%",
          "Reduced operational costs by KES 40M annually",
        ],
      },
      {
        role: "Operations Coordinator",
        company: "Nairobi Hospital",
        dates: "2017 – 2020",
        bullets: ["Coordinated across 12 departments with 400+ staff", "Implemented electronic health records system"],
      },
    ],
    education: [{ degree: "MPH", school: "University of Nairobi", year: "2017" }],
  },
  {
    name: "Christine Njeri",
    title: "UX/UI Designer",
    email: "christine.n@email.com",
    phone: "+254 711 000 300",
    location: "Nairobi, Kenya",
    summary:
      "Creative UX/UI designer with 5+ years crafting intuitive digital experiences for mobile-first audiences across Africa. Passionate about user research and accessibility.",
    skills: ["Figma", "User Research", "Prototyping", "Design Systems", "HTML/CSS", "Usability Testing"],
    experience: [
      {
        role: "Senior UX Designer",
        company: "Flutterwave",
        dates: "2021 – Present",
        bullets: [
          "Redesigned payment flow increasing conversions by 40%",
          "Created design system used across 5 product teams",
          "Conducted user research with 500+ participants across 4 countries",
        ],
      },
      {
        role: "UI Designer",
        company: "Africa's Talking",
        dates: "2018 – 2021",
        bullets: [
          "Designed developer dashboard serving 100K+ users",
          "Built component library reducing development time by 50%",
        ],
      },
    ],
    education: [{ degree: "BA Design", school: "USIU-Africa", year: "2018" }],
  },
  {
    name: "Brian Otieno",
    title: "Civil Engineer",
    email: "brian.o@email.com",
    phone: "+254 722 111 001",
    location: "Kisumu, Kenya",
    summary:
      "Licensed civil engineer with 6+ years delivering infrastructure projects across East Africa. Specialized in structural design, project supervision, and quality assurance for road and building construction.",
    skills: [
      "AutoCAD",
      "Structural Design",
      "Project Supervision",
      "FIDIC Contracts",
      "MS Project",
      "Quality Assurance",
    ],
    experience: [
      {
        role: "Senior Civil Engineer",
        company: "Kenya National Highways Authority",
        dates: "2020 – Present",
        bullets: [
          "Supervised construction of 120km highway valued at KES 4B",
          "Managed team of 25 engineers and 200+ contractors",
          "Reduced project completion time by 15% through lean scheduling",
        ],
      },
      {
        role: "Civil Engineer",
        company: "Strabag Kenya",
        dates: "2017 – 2020",
        bullets: [
          "Designed structural drawings for 8 commercial buildings",
          "Conducted geotechnical surveys across 12 sites",
        ],
      },
    ],
    education: [
      { degree: "BSc Civil Engineering", school: "University of Nairobi", year: "2017" },
      { degree: "EBK Licensed Engineer", school: "Engineers Board of Kenya", year: "2018" },
    ],
  },
  {
    name: "Mercy Wambui",
    title: "Registered Nurse",
    email: "mercy.w@email.com",
    phone: "+254 733 111 002",
    location: "Nairobi, Kenya",
    summary:
      "Compassionate registered nurse with 7+ years of clinical experience in busy hospital environments. Expert in critical care, patient assessment, and multidisciplinary team collaboration.",
    skills: ["Critical Care", "Patient Assessment", "IV Therapy", "Wound Management", "ACLS Certified", "EMR Systems"],
    experience: [
      {
        role: "Senior Nurse",
        company: "Kenyatta National Hospital",
        dates: "2019 – Present",
        bullets: [
          "Managed care for 30+ patients daily in ICU setting",
          "Trained 15 junior nurses in critical care protocols",
          "Reduced medication errors by 40% through double-check system",
        ],
      },
      {
        role: "Staff Nurse",
        company: "Nairobi Women's Hospital",
        dates: "2016 – 2019",
        bullets: [
          "Provided post-operative care for 1,000+ surgical patients",
          "Achieved 98% patient satisfaction score over 3 years",
        ],
      },
    ],
    education: [
      { degree: "BSc Nursing", school: "KMTC Nairobi", year: "2016" },
      { degree: "ACLS Certification", school: "AHA Kenya", year: "2019" },
    ],
  },
  {
    name: "Samuel Mutua",
    title: "Secondary School Teacher",
    email: "samuel.m@email.com",
    phone: "+254 711 111 003",
    location: "Machakos, Kenya",
    summary:
      "Dedicated educator with 8+ years inspiring students in Mathematics and Physics. Proven track record of improving student performance with innovative teaching methods and mentorship programs.",
    skills: ["Mathematics", "Physics", "Curriculum Development", "Student Mentorship", "KNEC Examiner", "E-Learning"],
    experience: [
      {
        role: "Head of Mathematics Department",
        company: "Alliance High School",
        dates: "2019 – Present",
        bullets: [
          "Improved KCSE Mathematics mean grade from C+ to B+",
          "Developed digital learning resources used by 500+ students",
          "Mentored 3 students to national mathematics olympiad",
        ],
      },
      {
        role: "Mathematics Teacher",
        company: "Machakos Boys High School",
        dates: "2015 – 2019",
        bullets: ["Taught Form 1–4 Mathematics and Physics classes", "Served as class teacher and games master"],
      },
    ],
    education: [
      { degree: "BEd Mathematics & Physics", school: "Kenyatta University", year: "2015" },
      { degree: "KNEC Examiner Certificate", school: "Kenya National Examinations Council", year: "2017" },
    ],
  },
  {
    name: "Aisha Mohamed",
    title: "Journalist & Media Producer",
    email: "aisha.m@email.com",
    phone: "+254 700 111 004",
    location: "Mombasa, Kenya",
    summary:
      "Award-winning broadcast journalist with 6+ years covering politics, business, and human interest stories across East Africa. Experienced in TV, radio, and digital media production.",
    skills: [
      "Broadcast Journalism",
      "Video Production",
      "Scriptwriting",
      "Social Media",
      "Adobe Premiere",
      "Interviewing",
    ],
    experience: [
      {
        role: "Senior Reporter",
        company: "NTV Kenya",
        dates: "2020 – Present",
        bullets: [
          "Produced 200+ news segments reaching 5M+ viewers weekly",
          "Won AJEA Award for Investigative Journalism 2022",
          "Led team of 4 journalists covering national elections",
        ],
      },
      {
        role: "News Reporter",
        company: "Radio Citizen",
        dates: "2017 – 2020",
        bullets: [
          "Anchored morning drive news bulletins reaching 2M listeners",
          "Covered 3 East African heads of state summits",
        ],
      },
    ],
    education: [{ degree: "BA Mass Communication", school: "USIU-Africa", year: "2017" }],
  },
  {
    name: "Daniel Kiprop",
    title: "Accountant & Tax Consultant",
    email: "daniel.k@email.com",
    phone: "+254 722 111 005",
    location: "Eldoret, Kenya",
    summary:
      "CPA-K qualified accountant with 5+ years in financial reporting, tax compliance, and audit. Experienced in both public practice and corporate environments across multiple sectors.",
    skills: ["CPA-K", "Tax Compliance", "Financial Reporting", "IFRS", "QuickBooks", "Internal Audit"],
    experience: [
      {
        role: "Tax Consultant",
        company: "KPMG East Africa",
        dates: "2021 – Present",
        bullets: [
          "Managed tax compliance for 30+ corporate clients",
          "Identified KES 80M in tax savings through legal optimization",
          "Prepared transfer pricing documentation for multinationals",
        ],
      },
      {
        role: "Accountant",
        company: "Brookside Dairy",
        dates: "2018 – 2021",
        bullets: [
          "Prepared monthly management accounts for KES 2B turnover company",
          "Led year-end audit process with zero material misstatements",
        ],
      },
    ],
    education: [
      { degree: "BCom Accounting", school: "Moi University", year: "2018" },
      { degree: "CPA-K", school: "KASNEB", year: "2020" },
    ],
  },
  {
    name: "Pauline Adhiambo",
    title: "Social Worker & Counsellor",
    email: "pauline.a@email.com",
    phone: "+254 733 111 006",
    location: "Kisumu, Kenya",
    summary:
      "Dedicated social worker with 6+ years supporting vulnerable communities across Western Kenya. Certified counsellor specializing in trauma, gender-based violence, and youth empowerment programs.",
    skills: ["Trauma Counselling", "Community Development", "GBV Response", "Program Management", "M&E", "Fundraising"],
    experience: [
      {
        role: "Senior Social Worker",
        company: "UNHCR Kenya",
        dates: "2020 – Present",
        bullets: [
          "Supported 2,000+ refugees through resettlement programs",
          "Designed GBV response program serving 500 women annually",
          "Managed KES 15M program budget with 100% accountability",
        ],
      },
      {
        role: "Counsellor",
        company: "Kisumu County Government",
        dates: "2016 – 2020",
        bullets: [
          "Provided trauma counselling to 300+ GBV survivors annually",
          "Facilitated youth empowerment workshops across 5 sub-counties",
        ],
      },
    ],
    education: [
      { degree: "BSW Social Work", school: "Maseno University", year: "2016" },
      { degree: "Diploma Counselling Psychology", school: "Kenya Institute of Professional Counselling", year: "2018" },
    ],
  },
  {
    name: "Victor Omondi",
    title: "Electrical Engineer",
    email: "victor.o@email.com",
    phone: "+254 722 111 007",
    location: "Nairobi, Kenya",
    summary:
      "Certified electrical engineer with 5+ years designing and maintaining power systems for commercial and industrial facilities. Experienced in renewable energy and smart building systems.",
    skills: [
      "AutoCAD Electrical",
      "PLC Programming",
      "Solar Systems",
      "Power Distribution",
      "Project Management",
      "OSHA",
    ],
    experience: [
      {
        role: "Electrical Engineer",
        company: "Kenya Power",
        dates: "2020 – Present",
        bullets: [
          "Designed power distribution systems for 50+ commercial buildings",
          "Supervised installation of 2MW solar farm in Garissa",
          "Reduced energy costs by 30% through smart metering implementation",
        ],
      },
      {
        role: "Junior Engineer",
        company: "Schneider Electric Kenya",
        dates: "2018 – 2020",
        bullets: [
          "Installed and commissioned industrial automation systems",
          "Maintained electrical systems for 20+ factory clients",
        ],
      },
    ],
    education: [
      { degree: "BSc Electrical Engineering", school: "University of Nairobi", year: "2018" },
      { degree: "EBK Licensed Engineer", school: "Engineers Board of Kenya", year: "2019" },
    ],
  },
  {
    name: "Esther Kamau",
    title: "Procurement Manager",
    email: "esther.k@email.com",
    phone: "+254 733 111 008",
    location: "Nairobi, Kenya",
    summary:
      "CIPS-certified procurement professional with 7+ years managing strategic sourcing and supply chain operations for large organizations. Expert in vendor management and cost reduction.",
    skills: [
      "Strategic Sourcing",
      "CIPS Certified",
      "Vendor Management",
      "Contract Negotiation",
      "SAP MM",
      "Cost Reduction",
    ],
    experience: [
      {
        role: "Procurement Manager",
        company: "East African Breweries",
        dates: "2019 – Present",
        bullets: [
          "Managed procurement spend of KES 3B annually",
          "Negotiated contracts saving KES 200M over 3 years",
          "Onboarded 50+ pre-qualified vendors across East Africa",
        ],
      },
      {
        role: "Procurement Officer",
        company: "Nation Media Group",
        dates: "2016 – 2019",
        bullets: ["Sourced printing materials for 5 daily publications", "Reduced procurement cycle time by 35%"],
      },
    ],
    education: [
      { degree: "BCom Procurement", school: "JKUAT", year: "2016" },
      { degree: "CIPS Level 6", school: "Chartered Institute of Procurement", year: "2019" },
    ],
  },
  {
    name: "George Njuguna",
    title: "Architect",
    email: "george.n@email.com",
    phone: "+254 711 111 009",
    location: "Nairobi, Kenya",
    summary:
      "Registered architect with 8+ years designing award-winning residential and commercial spaces. Passionate about sustainable architecture and innovative design solutions for African urban environments.",
    skills: ["AutoCAD", "SketchUp", "Revit BIM", "Sustainable Design", "Project Management", "3D Rendering"],
    experience: [
      {
        role: "Principal Architect",
        company: "Triad Architects",
        dates: "2019 – Present",
        bullets: [
          "Designed mixed-use development worth KES 2B in Westlands",
          "Won AIA Kenya Award for Sustainable Design 2022",
          "Led team of 8 architects and 12 technicians",
        ],
      },
      {
        role: "Architect",
        company: "Symbion Kenya",
        dates: "2015 – 2019",
        bullets: [
          "Designed 15+ residential projects across Nairobi",
          "Managed building permit approvals for 20+ projects",
        ],
      },
    ],
    education: [
      { degree: "BArch Architecture", school: "University of Nairobi", year: "2015" },
      { degree: "AAK Registered Architect", school: "Architectural Association of Kenya", year: "2016" },
    ],
  },
  {
    name: "Tabitha Mwangi",
    title: "Nutritionist & Dietitian",
    email: "tabitha.mw@email.com",
    phone: "+254 700 111 010",
    location: "Nairobi, Kenya",
    summary:
      "Registered nutritionist with 5+ years providing evidence-based dietary guidance for hospitals, corporates, and individuals. Specialized in clinical nutrition, weight management, and sports nutrition.",
    skills: [
      "Clinical Nutrition",
      "Diet Planning",
      "Sports Nutrition",
      "Public Health",
      "SPSS",
      "Nutrition Counselling",
    ],
    experience: [
      {
        role: "Senior Nutritionist",
        company: "Aga Khan University Hospital",
        dates: "2020 – Present",
        bullets: [
          "Managed nutrition care for 50+ inpatients daily",
          "Developed hospital nutrition policy adopted organization-wide",
          "Conducted nutrition research published in 2 peer-reviewed journals",
        ],
      },
      {
        role: "Nutritionist",
        company: "AAR Healthcare",
        dates: "2018 – 2020",
        bullets: [
          "Provided dietary counselling to 200+ outpatients monthly",
          "Designed corporate wellness nutrition programs for 5 companies",
        ],
      },
    ],
    education: [
      { degree: "BSc Food Nutrition & Dietetics", school: "Kenyatta University", year: "2018" },
      { degree: "Registered Nutritionist", school: "Kenya Nutritionists & Dieticians Institute", year: "2019" },
    ],
  },
  {
    name: "Hassan Abdi",
    title: "Logistics & Supply Chain Manager",
    email: "hassan.a@email.com",
    phone: "+254 722 111 011",
    location: "Mombasa, Kenya",
    summary:
      "Supply chain expert with 9+ years managing end-to-end logistics operations at Kenya's largest port. Specialized in customs clearance, freight forwarding, and regional distribution across East Africa.",
    skills: [
      "Freight Forwarding",
      "Customs Clearance",
      "Warehouse Management",
      "SAP TM",
      "INCOTERMS",
      "Risk Management",
    ],
    experience: [
      {
        role: "Logistics Manager",
        company: "Bollore Logistics Kenya",
        dates: "2018 – Present",
        bullets: [
          "Managed clearance of 10,000+ containers annually at Mombasa Port",
          "Reduced clearance turnaround time from 7 to 3 days",
          "Oversaw warehouse operations with KES 500M inventory value",
        ],
      },
      {
        role: "Freight Coordinator",
        company: "Kuehne + Nagel Kenya",
        dates: "2014 – 2018",
        bullets: [
          "Coordinated air and sea freight for 100+ corporate clients",
          "Managed customs documentation for regulated goods",
        ],
      },
    ],
    education: [
      { degree: "BSc Logistics & Supply Chain", school: "Technical University of Mombasa", year: "2014" },
      { degree: "Diploma Customs & Freight", school: "Kenya Revenue Authority", year: "2015" },
    ],
  },
  {
    name: "Vivian Cherop",
    title: "Marketing & Communications Officer",
    email: "vivian.c@email.com",
    phone: "+254 733 111 012",
    location: "Nakuru, Kenya",
    summary:
      "Creative marketing professional with 4+ years building brand awareness and driving customer engagement through digital and traditional channels. Skilled in content creation and campaign management.",
    skills: ["Content Marketing", "Social Media", "Google Ads", "Canva", "Email Marketing", "Brand Management"],
    experience: [
      {
        role: "Marketing Officer",
        company: "Nakuru County Government",
        dates: "2021 – Present",
        bullets: [
          "Grew county social media following from 5K to 80K in 2 years",
          "Managed communications for 3 major county investment forums",
          "Produced award-winning tourism campaign reaching 500K+ people",
        ],
      },
      {
        role: "Digital Marketing Executive",
        company: "Jumia Kenya",
        dates: "2019 – 2021",
        bullets: ["Managed Google Ads budget of KES 2M monthly", "Increased email open rates from 12% to 28%"],
      },
    ],
    education: [{ degree: "BA Communication & PR", school: "Egerton University", year: "2019" }],
  },
  {
    name: "Newton Karanja",
    title: "IT Systems Administrator",
    email: "newton.k@email.com",
    phone: "+254 711 111 013",
    location: "Nairobi, Kenya",
    summary:
      "Microsoft-certified IT professional with 6+ years managing enterprise IT infrastructure. Expert in network administration, cybersecurity, and cloud migration for organizations with 500+ users.",
    skills: ["Windows Server", "Azure Cloud", "Network Security", "Active Directory", "ITIL", "VMware"],
    experience: [
      {
        role: "Senior IT Administrator",
        company: "Co-operative Bank of Kenya",
        dates: "2020 – Present",
        bullets: [
          "Managed IT infrastructure for 150+ branch network",
          "Led migration of 500+ users to Microsoft Azure cloud",
          "Reduced system downtime by 75% through proactive monitoring",
        ],
      },
      {
        role: "IT Support Engineer",
        company: "Safaricom PLC",
        dates: "2017 – 2020",
        bullets: [
          "Provided Tier 2 support for 3,000+ internal users",
          "Deployed endpoint security across 200+ devices",
        ],
      },
    ],
    education: [
      { degree: "BSc Information Technology", school: "Strathmore University", year: "2017" },
      { degree: "Microsoft Azure Administrator", school: "Microsoft Certified", year: "2020" },
    ],
  },
];

const TEMPLATES: TemplateInfo[] = [
  {
    id: "classic",
    name: "Classic",
    category: "Simple",
    description: "Timeless design for any industry",
    colors: ["#c9a84c", "#1a2332", "#059669", "#7c3aed", "#475569"],
    person: PEOPLE[0],
    layout: "single",
  },
  {
    id: "traditional",
    name: "Traditional",
    category: "Simple",
    description: "Conservative layout preferred by hiring managers",
    colors: ["#1a2332", "#1e40af", "#059669", "#7c3aed", "#dc2626"],
    person: PEOPLE[1],
    layout: "single",
  },
  {
    id: "clean",
    name: "Clean",
    category: "Simple",
    description: "Minimalist approach with maximum readability",
    colors: ["#2563eb", "#1a2332", "#059669", "#9333ea", "#f43f5e"],
    person: PEOPLE[2],
    layout: "single",
  },
  {
    id: "basic",
    name: "Basic",
    category: "Simple",
    description: "Straightforward and professional",
    colors: ["#1f2937", "#2563eb", "#059669", "#7c3aed", "#dc2626"],
    person: PEOPLE[3],
    layout: "single",
  },
  {
    id: "executive-classic",
    name: "Executive",
    category: "Executive",
    description: "Commanding presence for C-level roles",
    colors: ["#c9a84c", "#1a2332", "#0f172a", "#78716c", "#92400e"],
    person: PEOPLE[4],
    layout: "single",
  },
  {
    id: "sidebar",
    name: "Sidebar",
    category: "Two-Column",
    description: "Modern sidebar layout with clear hierarchy",
    colors: ["#38bdf8", "#1e293b", "#059669", "#9333ea", "#f43f5e"],
    person: PEOPLE[5],
    layout: "sidebar",
  },
  {
    id: "minimal",
    name: "Minimal",
    category: "Minimalist",
    description: "Clean lines, maximum impact",
    colors: ["#111827", "#374151", "#6b7280", "#9ca3af", "#d1d5db"],
    person: PEOPLE[6],
    layout: "single",
  },
  {
    id: "ats-pro",
    name: "ATS Pro",
    category: "ATS",
    description: "Engineered to pass all ATS scanners",
    colors: ["#1a2332", "#1e40af", "#334155", "#475569", "#111827"],
    person: PEOPLE[7],
    layout: "single",
  },
  {
    id: "two-column",
    name: "Two-Column",
    category: "Two-Column",
    description: "Balanced layout for experienced professionals",
    colors: ["#1a2332", "#2563eb", "#059669", "#9333ea", "#dc2626"],
    person: PEOPLE[8],
    layout: "two-column",
  },
  {
    id: "creative",
    name: "Creative",
    category: "Creative",
    description: "Bold design for creative professionals",
    colors: ["#7c3aed", "#ec4899", "#2563eb", "#f59e0b", "#059669"],
    person: PEOPLE[9],
    layout: "single",
  },
  {
    id: "picture",
    name: "Picture",
    category: "Picture",
    description: "Photo header with professional layout",
    colors: ["#1a2332", "#2563eb", "#059669", "#9333ea", "#dc2626"],
    person: PEOPLE[10],
    layout: "photo",
  },
  {
    id: "modern",
    name: "Modern",
    category: "Simple",
    description: "Contemporary design that stands out",
    colors: ["#0ea5e9", "#1a2332", "#059669", "#a855f7", "#f43f5e"],
    person: PEOPLE[11],
    layout: "single",
  },
  {
    id: "ats-classic",
    name: "ATS Classic",
    category: "ATS",
    description: "Pure ATS-safe single column format",
    colors: ["#1a2332", "#2d3748", "#1e3a5f", "#374151", "#111827"],
    person: PEOPLE[12],
    layout: "single",
  },
  {
    id: "ats-modern",
    name: "ATS Modern",
    category: "ATS",
    description: "Clean and ATS-friendly with subtle style",
    colors: ["#1e40af", "#1a2332", "#334155", "#475569", "#111827"],
    person: PEOPLE[13],
    layout: "single",
  },
  {
    id: "ats-executive",
    name: "ATS Executive",
    category: "ATS",
    description: "Senior-level ATS optimized format",
    colors: ["#0f172a", "#1e3a5f", "#1a2332", "#374151", "#2d3748"],
    person: PEOPLE[14],
    layout: "single",
  },
  {
    id: "two-column-pro",
    name: "Two-Column Pro",
    category: "Two-Column",
    description: "Bold header with two balanced columns",
    colors: ["#c9a84c", "#1a2332", "#2563eb", "#059669", "#7c3aed"],
    person: PEOPLE[15],
    layout: "two-column",
  },
  {
    id: "two-column-creative",
    name: "Two-Column Creative",
    category: "Two-Column",
    description: "Colorful sidebar with clean content area",
    colors: ["#7c3aed", "#2563eb", "#059669", "#ec4899", "#f59e0b"],
    person: PEOPLE[16],
    layout: "sidebar",
  },
  {
    id: "picture-classic",
    name: "Picture Classic",
    category: "Picture",
    description: "Elegant layout with professional photo",
    colors: ["#1a2332", "#2563eb", "#059669", "#7c3aed", "#dc2626"],
    person: PEOPLE[17],
    layout: "photo",
  },
  {
    id: "picture-modern",
    name: "Picture Modern",
    category: "Picture",
    description: "Contemporary photo header design",
    colors: ["#0ea5e9", "#1a2332", "#059669", "#a855f7", "#f43f5e"],
    person: PEOPLE[18],
    layout: "photo",
  },
  {
    id: "executive-gold",
    name: "Executive Gold",
    category: "Executive",
    description: "Black and gold prestige design",
    colors: ["#c9a84c", "#b8960c", "#d4a843", "#f0d080", "#92400e"],
    person: PEOPLE[19],
    layout: "single",
  },
  {
    id: "executive-navy",
    name: "Executive Navy",
    category: "Executive",
    description: "Deep navy with silver accents",
    colors: ["#1e3a5f", "#1a2332", "#0f172a", "#2d4a6e", "#374151"],
    person: PEOPLE[20],
    layout: "single",
  },
  {
    id: "creative-bold",
    name: "Creative Bold",
    category: "Creative",
    description: "Vibrant colors for creative professionals",
    colors: ["#ec4899", "#8b5cf6", "#06b6d4", "#f59e0b", "#10b981"],
    person: PEOPLE[21],
    layout: "single",
  },
  {
    id: "creative-minimal",
    name: "Creative Minimal",
    category: "Creative",
    description: "Subtle creativity with artistic spacing",
    colors: ["#6366f1", "#8b5cf6", "#ec4899", "#06b6d4", "#f59e0b"],
    person: PEOPLE[22],
    layout: "single",
  },
  {
    id: "minimalist-pro",
    name: "Minimalist Pro",
    category: "Minimalist",
    description: "Ultra clean with perfect white space",
    colors: ["#111827", "#374151", "#4b5563", "#6b7280", "#9ca3af"],
    person: PEOPLE[23],
    layout: "single",
  },
  {
    id: "modern-dark",
    name: "Modern Dark",
    category: "Simple",
    description: "Dark header with clean light body",
    colors: ["#0f172a", "#1e293b", "#1a2332", "#2d3748", "#374151"],
    person: PEOPLE[24],
    layout: "single",
  },
];

const CATEGORIES = ["All", "Simple", "ATS", "Two-Column", "Picture", "Executive", "Creative", "Minimalist"];

/* ── Mini CV Preview Component ── */
function MiniCVPreview({ template }: { template: TemplateInfo }) {
  const p = template.person;
  const accentColor = template.colors[0];

  if (template.layout === "sidebar") {
    return (
      <div style={{ display: "flex", width: "100%", height: "100%", fontFamily: "'Inter', sans-serif", fontSize: 5.5 }}>
        <div style={{ width: "34%", background: "#1e293b", padding: "14px 8px", color: "#fff" }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: accentColor,
              margin: "0 auto 6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 9,
              fontWeight: 700,
              color: "#1e293b",
            }}
          >
            {p.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div style={{ fontSize: 6, fontWeight: 700, textAlign: "center", marginBottom: 2 }}>{p.name}</div>
          <div
            style={{
              fontSize: 4.5,
              color: accentColor,
              textAlign: "center",
              textTransform: "uppercase",
              letterSpacing: 0.3,
              marginBottom: 8,
            }}
          >
            {p.title}
          </div>
          <div style={{ fontSize: 4, color: "#94a3b8", marginBottom: 2 }}>{p.email}</div>
          <div style={{ fontSize: 4, color: "#94a3b8", marginBottom: 2 }}>{p.phone}</div>
          <div style={{ fontSize: 4, color: "#94a3b8", marginBottom: 8 }}>{p.location}</div>
          <div style={{ height: 0.5, background: "#334155", marginBottom: 6 }} />
          <div
            style={{
              fontSize: 4,
              color: accentColor,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 0.3,
              marginBottom: 3,
            }}
          >
            Skills
          </div>
          {p.skills.map((s, i) => (
            <div key={i} style={{ fontSize: 4, color: "#cbd5e1", lineHeight: 1.5 }}>
              • {s}
            </div>
          ))}
          <div style={{ height: 0.5, background: "#334155", margin: "6px 0" }} />
          <div
            style={{
              fontSize: 4,
              color: accentColor,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 0.3,
              marginBottom: 3,
            }}
          >
            Education
          </div>
          {p.education.map((e, i) => (
            <div key={i} style={{ marginBottom: 3 }}>
              <div style={{ fontSize: 4, fontWeight: 600, color: "#e2e8f0" }}>{e.degree}</div>
              <div style={{ fontSize: 3.5, color: "#94a3b8" }}>
                {e.school} · {e.year}
              </div>
            </div>
          ))}
        </div>
        <div style={{ flex: 1, padding: "14px 10px", background: "#fff" }}>
          <div
            style={{
              fontSize: 4,
              fontWeight: 700,
              color: "#1e293b",
              textTransform: "uppercase",
              letterSpacing: 0.4,
              borderBottom: `0.5px solid ${accentColor}`,
              paddingBottom: 2,
              marginBottom: 4,
            }}
          >
            Profile
          </div>
          <div style={{ fontSize: 4.5, color: "#475569", lineHeight: 1.5, marginBottom: 8 }}>{p.summary}</div>
          <div
            style={{
              fontSize: 4,
              fontWeight: 700,
              color: "#1e293b",
              textTransform: "uppercase",
              letterSpacing: 0.4,
              borderBottom: `0.5px solid ${accentColor}`,
              paddingBottom: 2,
              marginBottom: 4,
            }}
          >
            Work Experience
          </div>
          {p.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 5, fontWeight: 700, color: "#0f172a" }}>{exp.role}</span>
                <span style={{ fontSize: 3.5, color: accentColor }}>{exp.dates}</span>
              </div>
              <div style={{ fontSize: 4, color: "#64748b", marginBottom: 2 }}>{exp.company}</div>
              {exp.bullets.map((b, j) => (
                <div key={j} style={{ fontSize: 4, color: "#475569", lineHeight: 1.4, paddingLeft: 6 }}>
                  • {b}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (template.layout === "two-column") {
    return (
      <div style={{ display: "flex", width: "100%", height: "100%", fontFamily: "'Inter', sans-serif", fontSize: 5.5 }}>
        <div style={{ flex: 1, padding: "14px 10px", background: "#fff" }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: "#0f172a", letterSpacing: 0.3 }}>{p.name}</div>
          <div
            style={{
              fontSize: 5.5,
              color: accentColor,
              textTransform: "uppercase",
              letterSpacing: 0.5,
              marginBottom: 6,
              fontWeight: 600,
            }}
          >
            {p.title}
          </div>
          <div style={{ fontSize: 4, color: "#64748b", marginBottom: 8 }}>
            {p.email} · {p.phone} · {p.location}
          </div>
          <div
            style={{
              fontSize: 4,
              fontWeight: 700,
              color: "#0f172a",
              textTransform: "uppercase",
              letterSpacing: 0.4,
              borderBottom: `0.5px solid ${accentColor}`,
              paddingBottom: 2,
              marginBottom: 4,
            }}
          >
            Profile
          </div>
          <div style={{ fontSize: 4.5, color: "#475569", lineHeight: 1.5, marginBottom: 8 }}>{p.summary}</div>
          <div
            style={{
              fontSize: 4,
              fontWeight: 700,
              color: "#0f172a",
              textTransform: "uppercase",
              letterSpacing: 0.4,
              borderBottom: `0.5px solid ${accentColor}`,
              paddingBottom: 2,
              marginBottom: 4,
            }}
          >
            Work Experience
          </div>
          {p.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 5, fontWeight: 700, color: "#0f172a" }}>{exp.role}</span>
                <span style={{ fontSize: 3.5, color: "#999" }}>{exp.dates}</span>
              </div>
              <div style={{ fontSize: 4, color: accentColor, fontWeight: 600, marginBottom: 2 }}>{exp.company}</div>
              {exp.bullets.map((b, j) => (
                <div key={j} style={{ fontSize: 4, color: "#475569", lineHeight: 1.4, paddingLeft: 6 }}>
                  • {b}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ width: "32%", background: "#f8fafc", padding: "14px 8px", borderLeft: `1px solid #e2e8f0` }}>
          <div
            style={{
              fontSize: 4,
              fontWeight: 700,
              color: "#0f172a",
              textTransform: "uppercase",
              letterSpacing: 0.3,
              marginBottom: 4,
            }}
          >
            Skills
          </div>
          {p.skills.map((s, i) => (
            <div key={i} style={{ fontSize: 4, color: "#475569", lineHeight: 1.5 }}>
              • {s}
            </div>
          ))}
          <div style={{ height: 0.5, background: "#e2e8f0", margin: "6px 0" }} />
          <div
            style={{
              fontSize: 4,
              fontWeight: 700,
              color: "#0f172a",
              textTransform: "uppercase",
              letterSpacing: 0.3,
              marginBottom: 4,
            }}
          >
            Education
          </div>
          {p.education.map((e, i) => (
            <div key={i} style={{ marginBottom: 3 }}>
              <div style={{ fontSize: 4, fontWeight: 600, color: "#0f172a" }}>{e.degree}</div>
              <div style={{ fontSize: 3.5, color: "#64748b" }}>
                {e.school} · {e.year}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Single / photo layout
  const isExecutive = template.category === "Executive";
  const isCreative = template.category === "Creative";
  const isPhoto = template.layout === "photo";
  const headerBg = isExecutive ? "#0f172a" : isCreative ? accentColor : isPhoto ? "#1a2332" : "#fff";
  const headerText = headerBg === "#fff" ? "#0f172a" : "#fff";
  const accentOnHeader = isExecutive ? "#c9a84c" : isCreative ? "#fff" : accentColor;

  return (
    <div
      style={{ width: "100%", height: "100%", fontFamily: "'Inter', sans-serif", fontSize: 5.5, background: "#fff" }}
    >
      <div
        style={{
          background: headerBg,
          padding: isPhoto ? "12px 12px 12px 12px" : "14px 12px",
          display: "flex",
          alignItems: isPhoto ? "center" : "flex-start",
          gap: isPhoto ? 8 : 0,
        }}
      >
        {isPhoto && (
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: accentOnHeader,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 10,
              fontWeight: 700,
              color: headerBg,
              flexShrink: 0,
            }}
          >
            {p.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
        )}
        <div>
          <div
            style={{
              fontSize: isExecutive ? 11 : 10,
              fontWeight: 800,
              color: headerText,
              letterSpacing: isExecutive ? 1 : 0.3,
            }}
          >
            {isExecutive ? p.name.toUpperCase() : p.name}
          </div>
          <div
            style={{
              fontSize: 5,
              color: accentOnHeader,
              textTransform: "uppercase",
              letterSpacing: isExecutive ? 1.5 : 0.5,
              marginTop: 1,
              fontWeight: 600,
            }}
          >
            {p.title}
          </div>
          <div
            style={{ fontSize: 3.5, color: headerBg === "#fff" ? "#64748b" : "rgba(255,255,255,0.6)", marginTop: 3 }}
          >
            {p.email} · {p.phone} · {p.location}
          </div>
        </div>
      </div>
      {isExecutive && <div style={{ height: 1.5, background: "linear-gradient(90deg,#c9a84c,#f0d080,#c9a84c)" }} />}
      <div style={{ padding: "10px 12px" }}>
        <div
          style={{
            fontSize: 4,
            fontWeight: 700,
            color: isExecutive ? "#0f172a" : isCreative ? accentColor : "#0f172a",
            textTransform: "uppercase",
            letterSpacing: 0.4,
            borderBottom: `0.5px solid ${isExecutive ? "#c9a84c" : accentColor}`,
            paddingBottom: 2,
            marginBottom: 3,
          }}
        >
          {isExecutive ? "Executive Summary" : "Profile"}
        </div>
        <div style={{ fontSize: 4.5, color: "#475569", lineHeight: 1.5, marginBottom: 7 }}>{p.summary}</div>
        <div
          style={{
            fontSize: 4,
            fontWeight: 700,
            color: isExecutive ? "#0f172a" : isCreative ? accentColor : "#0f172a",
            textTransform: "uppercase",
            letterSpacing: 0.4,
            borderBottom: `0.5px solid ${isExecutive ? "#c9a84c" : accentColor}`,
            paddingBottom: 2,
            marginBottom: 3,
          }}
        >
          {isExecutive ? "Leadership Experience" : "Work Experience"}
        </div>
        {p.experience.map((exp, i) => (
          <div key={i} style={{ marginBottom: 5 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 5, fontWeight: 700, color: "#0f172a" }}>{exp.role}</span>
              <span style={{ fontSize: 3.5, color: isExecutive ? "#c9a84c" : "#999" }}>{exp.dates}</span>
            </div>
            <div
              style={{ fontSize: 4, color: isExecutive ? "#c9a84c" : accentColor, fontWeight: 600, marginBottom: 1 }}
            >
              {exp.company}
            </div>
            {exp.bullets.map((b, j) => (
              <div key={j} style={{ fontSize: 4, color: "#475569", lineHeight: 1.4, paddingLeft: 6 }}>
                • {b}
              </div>
            ))}
          </div>
        ))}
        <div
          style={{
            fontSize: 4,
            fontWeight: 700,
            color: isExecutive ? "#0f172a" : isCreative ? accentColor : "#0f172a",
            textTransform: "uppercase",
            letterSpacing: 0.4,
            borderBottom: `0.5px solid ${isExecutive ? "#c9a84c" : accentColor}`,
            paddingBottom: 2,
            marginBottom: 3,
            marginTop: 4,
          }}
        >
          Education
        </div>
        {p.education.map((e, i) => (
          <div key={i} style={{ fontSize: 4.5, color: "#334155", marginBottom: 2 }}>
            <span style={{ fontWeight: 600 }}>{e.degree}</span> — {e.school} · {e.year}
          </div>
        ))}
        <div
          style={{
            fontSize: 4,
            fontWeight: 700,
            color: isExecutive ? "#0f172a" : isCreative ? accentColor : "#0f172a",
            textTransform: "uppercase",
            letterSpacing: 0.4,
            borderBottom: `0.5px solid ${isExecutive ? "#c9a84c" : accentColor}`,
            paddingBottom: 2,
            marginBottom: 3,
            marginTop: 4,
          }}
        >
          Skills
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {p.skills.map((s, i) => (
            <span
              key={i}
              style={{
                fontSize: 3.5,
                background: isExecutive ? "#0f172a" : `${accentColor}15`,
                color: isExecutive ? "#c9a84c" : accentColor,
                padding: "1px 5px",
                borderRadius: 2,
                border: `0.5px solid ${isExecutive ? "#c9a84c" : accentColor}40`,
                fontWeight: 600,
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Template Card ── */
function TemplateCard({ template }: { template: TemplateInfo }) {
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, boxShadow: "0 12px 40px -8px hsl(43 55% 54% / 0.3)" }}
      transition={{ duration: 0.25 }}
      className="group cursor-pointer rounded-xl border border-border bg-card overflow-hidden"
      onClick={() => navigate(`/cv-editor/${template.id}`)}
    >
      {/* CV Preview */}
      <div className="relative aspect-[3/4] bg-white overflow-hidden">
        <div className="absolute inset-0 scale-[1] origin-top-left">
          <MiniCVPreview template={template} />
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button size="sm" className="bg-gradient-brand border-0 font-semibold gold-shimmer">
            Use This Template
          </Button>
        </div>
      </div>

      {/* Card footer */}
      <div className="p-3 space-y-2">
        {/* Color swatches */}
        <div className="flex items-center gap-1.5">
          {template.colors.map((color, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedColor(i);
              }}
              className="w-4 h-4 rounded-full border-2 transition-all"
              style={{
                backgroundColor: color,
                borderColor: i === selectedColor ? "hsl(43 55% 54%)" : "transparent",
                transform: i === selectedColor ? "scale(1.2)" : "scale(1)",
              }}
            />
          ))}
          <div className="ml-auto flex items-center gap-1">
            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-primary/10 text-primary flex items-center gap-0.5">
              <FileText className="h-2.5 w-2.5" />
              PDF
            </span>
            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-primary/10 text-primary flex items-center gap-0.5">
              <FileDown className="h-2.5 w-2.5" />
              DOCX
            </span>
          </div>
        </div>

        {/* Name & description */}
        <div>
          <h3 className="font-bold text-sm text-foreground">{template.name}</h3>
          <p className="text-xs text-muted-foreground">{template.description}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main Page ── */
export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate = useNavigate();

  const filtered = activeCategory === "All" ? TEMPLATES : TEMPLATES.filter((t) => t.category === activeCategory);

  return (
    <PageLayout>
      <div className="relative z-10">
        {/* Hero */}
        <section className="py-16 md:py-20 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            CV <span className="text-gradient">Templates</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
            Professionally designed templates that get you hired faster
          </p>
          <div className="flex items-center justify-center gap-4 mb-8">
            <Button
              onClick={() => navigate("/cv-editor/classic")}
              className="bg-gradient-brand border-0 font-semibold shadow-glow gold-shimmer h-12 px-8 text-base"
            >
              Build My CV
            </Button>
            <Button
              variant="outline"
              className="border-primary/40 text-primary hover:bg-primary/10 h-12 px-8 text-base font-semibold"
              onClick={() => navigate("/order")}
            >
              Upload My CV
            </Button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {["36+ Templates", "ATS-Optimised", "PDF & DOCX", "Used by 10,000+ professionals"].map((badge) => (
              <span key={badge} className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-primary" /> {badge}
              </span>
            ))}
          </div>
        </section>

        {/* Category filter */}
        <div className="sticky top-16 z-30 surface-glass border-b border-border/30 py-3">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? "bg-gradient-brand text-primary-foreground shadow-glow-sm"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Template grid */}
        <section className="container max-w-6xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              No templates in this category yet. More coming soon!
            </div>
          )}
        </section>
      </div>
    </PageLayout>
  );
}
