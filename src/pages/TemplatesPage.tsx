import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, FileText, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";

export interface TemplatePersonExperience {
  role: string;
  company: string;
  dates: string;
  bullets: string[];
}

export interface TemplatePersonEducation {
  degree: string;
  school: string;
  year: string;
}

export interface TemplatePerson {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string[];
  experience: TemplatePersonExperience[];
  education: TemplatePersonEducation[];
  certifications: string[];
  languages: string[];
}

export interface TemplateInfo {
  id: string;
  name: string;
  category: string;
  description: string;
  colors: string[];
  person: TemplatePerson;
  layout: "single" | "sidebar" | "two-column" | "photo";
}

export const PEOPLE: TemplatePerson[] = [
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
          "Managed annual marketing budget of KES 50M",
        ],
      },
      {
        role: "Marketing Officer",
        company: "Nation Media Group",
        dates: "2015 – 2018",
        bullets: ["Coordinated print and digital advertising campaigns", "Supported launch of 3 new product lines"],
      },
    ],
    education: [
      { degree: "MBA, Marketing", school: "Strathmore University", year: "2018" },
      { degree: "BSc Business Administration", school: "University of Nairobi", year: "2015" },
    ],
    certifications: ["Google Analytics Certified", "HubSpot Content Marketing", "Facebook Blueprint"],
    languages: ["English (Fluent)", "Swahili (Native)", "French (Intermediate)"],
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
          "Developed mobile-first interfaces for field agents",
        ],
      },
      {
        role: "Junior Developer",
        company: "iHub Nairobi",
        dates: "2015 – 2017",
        bullets: [
          "Built internal tools and dashboards for startup clients",
          "Contributed to open-source projects on GitHub",
        ],
      },
    ],
    education: [
      { degree: "BSc Computer Science", school: "JKUAT", year: "2017" },
      { degree: "AWS Solutions Architect", school: "Amazon Web Services", year: "2020" },
    ],
    certifications: ["AWS Certified Solutions Architect", "Google Cloud Professional", "MongoDB Certified Developer"],
    languages: ["English (Fluent)", "Swahili (Native)", "German (Basic)"],
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
          "Supported audit engagements across 5 industries",
        ],
      },
      {
        role: "Accounts Assistant",
        company: "Kenya Revenue Authority",
        dates: "2016 – 2018",
        bullets: ["Processed tax returns for SME clients", "Reconciled accounts and prepared financial summaries"],
      },
    ],
    education: [
      { degree: "BCom Finance", school: "University of Nairobi", year: "2018" },
      { degree: "CPA-K Certification", school: "KASNEB", year: "2019" },
    ],
    certifications: ["CPA-K", "CFA Level 1", "IFRS Specialist Certificate"],
    languages: ["English (Fluent)", "Swahili (Native)", "Arabic (Basic)"],
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
          "Rolled out performance management system across 6 regions",
        ],
      },
      {
        role: "HR Officer",
        company: "Safaricom PLC",
        dates: "2013 – 2015",
        bullets: [
          "Supported onboarding of 200+ new hires per year",
          "Administered employee benefits and payroll processes",
        ],
      },
    ],
    education: [
      { degree: "MBA, Human Resources", school: "Strathmore University", year: "2015" },
      { degree: "BA Psychology", school: "University of Nairobi", year: "2012" },
    ],
    certifications: ["SHRM-SCP Certified", "CHRP Kenya", "Coaching & Mentoring Certificate"],
    languages: ["English (Fluent)", "Swahili (Native)", "Somali (Native)"],
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
          "Coordinated with county governments and regulators",
        ],
      },
      {
        role: "Site Engineer",
        company: "China Roads & Bridges",
        dates: "2014 – 2017",
        bullets: [
          "Supervised road construction projects worth KES 200M",
          "Ensured compliance with KENHA standards and specifications",
        ],
      },
    ],
    education: [
      { degree: "BSc Civil Engineering", school: "University of Nairobi", year: "2016" },
      { degree: "PMP Certification", school: "PMI", year: "2018" },
    ],
    certifications: ["PMP Certified", "Prince2 Practitioner", "Agile Scrum Master"],
    languages: ["English (Fluent)", "Swahili (Native)", "Kikuyu (Native)"],
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
        bullets: [
          "Created visual campaigns reaching 10M+ consumers",
          "Developed packaging designs for FMCG products",
          "Produced motion graphics for digital and TV channels",
        ],
      },
      {
        role: "Junior Designer",
        company: "Pixels & Ink Studio",
        dates: "2016 – 2018",
        bullets: [
          "Designed logos and brand assets for 30+ SMEs",
          "Built social media content calendars and visual systems",
        ],
      },
    ],
    education: [
      { degree: "BA Graphic Design", school: "USIU-Africa", year: "2018" },
      { degree: "Certificate UI/UX Design", school: "Google UX Design Certificate", year: "2021" },
    ],
    certifications: ["Adobe Certified Expert", "Google UX Design Certificate", "Canva Certified Creator"],
    languages: ["English (Fluent)", "Swahili (Native)", "French (Intermediate)"],
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
          "Managed 3PL relationships and SLA compliance",
        ],
      },
      {
        role: "Warehouse Supervisor",
        company: "Unilever Kenya",
        dates: "2013 – 2016",
        bullets: ["Supervised warehouse team of 40 staff", "Achieved 99.8% order fulfilment accuracy"],
      },
    ],
    education: [
      { degree: "BSc Mechanical Engineering", school: "University of Nairobi", year: "2015" },
      { degree: "Lean Six Sigma Black Belt", school: "ASQ", year: "2018" },
    ],
    certifications: ["Lean Six Sigma Black Belt", "APICS CPIM", "ISO 9001 Lead Auditor"],
    languages: ["English (Fluent)", "Swahili (Native)", "Kikuyu (Native)"],
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
          "Delivered weekly insights reports to product teams",
        ],
      },
      {
        role: "Research Analyst",
        company: "Kenya National Bureau of Statistics",
        dates: "2017 – 2019",
        bullets: [
          "Supported national household survey data analysis",
          "Produced statistical reports for government policy use",
        ],
      },
    ],
    education: [
      { degree: "MSc Data Science", school: "Strathmore University", year: "2019" },
      { degree: "BSc Mathematics", school: "University of Nairobi", year: "2017" },
    ],
    certifications: [
      "TensorFlow Developer Certificate",
      "AWS Machine Learning Specialty",
      "Tableau Desktop Specialist",
    ],
    languages: ["English (Fluent)", "Swahili (Native)", "Luo (Native)"],
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
          "Developed route-to-market strategy for rural distributors",
        ],
      },
      {
        role: "Territory Sales Rep",
        company: "Procter & Gamble Kenya",
        dates: "2013 – 2016",
        bullets: ["Consistently exceeded quarterly targets by 15–20%", "Built relationships with 200+ retail outlets"],
      },
    ],
    education: [
      { degree: "BBA Marketing", school: "Moi University", year: "2015" },
      { degree: "Diploma Sales Management", school: "KIM", year: "2016" },
    ],
    certifications: ["Salesforce Certified Sales Cloud", "Challenger Sale Certified", "KIM Sales Leadership Award"],
    languages: ["English (Fluent)", "Swahili (Native)", "Kalenjin (Native)"],
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
          "Advised on competition law and sector-specific regulations",
        ],
      },
      {
        role: "Legal Intern",
        company: "Office of the Attorney General",
        dates: "2016 – 2017",
        bullets: [
          "Assisted in drafting legislative instruments",
          "Conducted legal research for state advisory opinions",
        ],
      },
    ],
    education: [
      { degree: "LLB (Hons)", school: "University of Nairobi", year: "2016" },
      { degree: "KSL Diploma", school: "Kenya School of Law", year: "2017" },
    ],
    certifications: ["LSK Practicing Certificate", "ICPAK Affiliate Member", "CIARB Membership"],
    languages: ["English (Fluent)", "Swahili (Native)", "French (Intermediate)"],
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
        bullets: [
          "Coordinated across 12 departments with 400+ staff",
          "Implemented electronic health records system",
          "Managed procurement of medical supplies worth KES 200M",
        ],
      },
      {
        role: "Health Records Officer",
        company: "Kenyatta National Hospital",
        dates: "2015 – 2017",
        bullets: ["Maintained patient records for 1,000+ daily visits", "Ensured compliance with MoH data standards"],
      },
    ],
    education: [
      { degree: "MPH", school: "University of Nairobi", year: "2017" },
      { degree: "BSc Health Systems Management", school: "JKUAT", year: "2014" },
    ],
    certifications: ["AHIMA Certified", "Kenya Health Informatics Certificate", "ISO 15189 Quality Management"],
    languages: ["English (Fluent)", "Swahili (Native)", "Kikuyu (Native)"],
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
          "Led accessibility audit improving WCAG compliance to AA standard",
        ],
      },
      {
        role: "Web Designer",
        company: "Craft Silicon",
        dates: "2016 – 2018",
        bullets: [
          "Designed interfaces for mobile banking apps",
          "Produced wireframes and prototypes for client presentations",
        ],
      },
    ],
    education: [
      { degree: "BA Design", school: "USIU-Africa", year: "2018" },
      { degree: "Google UX Design Certificate", school: "Coursera", year: "2020" },
    ],
    certifications: ["Certified Usability Analyst", "Google UX Design Certificate", "Figma Advanced Certification"],
    languages: ["English (Fluent)", "Swahili (Native)", "Kikuyu (Native)"],
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
          "Prepared bills of quantities and tender documents",
        ],
      },
      {
        role: "Graduate Engineer",
        company: "Kenya Urban Roads Authority",
        dates: "2015 – 2017",
        bullets: [
          "Assisted in road condition surveys and reporting",
          "Supported site supervision of urban road projects",
        ],
      },
    ],
    education: [
      { degree: "BSc Civil Engineering", school: "University of Nairobi", year: "2017" },
      { degree: "EBK Licensed Engineer", school: "Engineers Board of Kenya", year: "2018" },
    ],
    certifications: ["EBK Licensed Engineer", "FIDIC Contracts Specialist", "AutoCAD Civil 3D Certified"],
    languages: ["English (Fluent)", "Swahili (Native)", "Luo (Native)"],
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
          "Led ward infection control committee",
        ],
      },
      {
        role: "Community Nurse",
        company: "Amref Health Africa",
        dates: "2014 – 2016",
        bullets: [
          "Delivered maternal and child health services in rural communities",
          "Trained 50+ community health workers in basic care",
        ],
      },
    ],
    education: [
      { degree: "BSc Nursing", school: "KMTC Nairobi", year: "2016" },
      { degree: "ACLS Certification", school: "AHA Kenya", year: "2019" },
    ],
    certifications: ["ACLS Certified", "NCK Licensed Nurse", "Wound Care Certified Practitioner"],
    languages: ["English (Fluent)", "Swahili (Native)", "Kikuyu (Native)"],
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
        bullets: [
          "Taught Form 1–4 Mathematics and Physics classes",
          "Served as class teacher and games master",
          "Introduced coding club with 80+ active members",
        ],
      },
      {
        role: "Student Teacher",
        company: "Kenyatta University Practice Schools",
        dates: "2014 – 2015",
        bullets: ["Completed teaching practice in 2 national schools", "Received commendation from school boards"],
      },
    ],
    education: [
      { degree: "BEd Mathematics & Physics", school: "Kenyatta University", year: "2015" },
      { degree: "KNEC Examiner Certificate", school: "Kenya National Examinations Council", year: "2017" },
    ],
    certifications: ["TSC Registered Teacher", "KNEC Examiner", "Cambridge CELTA Certificate"],
    languages: ["English (Fluent)", "Swahili (Native)", "Kamba (Native)"],
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
          "Produced documentary series on coastal communities",
        ],
      },
      {
        role: "Editorial Assistant",
        company: "Daily Nation",
        dates: "2015 – 2017",
        bullets: [
          "Researched and fact-checked stories for print and online",
          "Assisted senior editors with layout and production",
        ],
      },
    ],
    education: [
      { degree: "BA Mass Communication", school: "USIU-Africa", year: "2017" },
      { degree: "Diploma in Broadcast Journalism", school: "KBC School of Journalism", year: "2015" },
    ],
    certifications: ["AJEA Member", "Google News Initiative Certified", "Reuters Journalism Training Certificate"],
    languages: ["English (Fluent)", "Swahili (Native)", "Arabic (Intermediate)"],
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
          "Managed payroll for 800+ employees",
        ],
      },
      {
        role: "Audit Trainee",
        company: "PricewaterhouseCoopers Kenya",
        dates: "2016 – 2018",
        bullets: [
          "Supported statutory audits across banking and manufacturing sectors",
          "Performed substantive testing and control assessments",
        ],
      },
    ],
    education: [
      { degree: "BCom Accounting", school: "Moi University", year: "2018" },
      { degree: "CPA-K", school: "KASNEB", year: "2020" },
    ],
    certifications: ["CPA-K", "ICPAK Member", "QuickBooks ProAdvisor"],
    languages: ["English (Fluent)", "Swahili (Native)", "Kalenjin (Native)"],
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
          "Trained 40 community volunteers in psychosocial support",
        ],
      },
      {
        role: "Social Work Intern",
        company: "Kenya Red Cross",
        dates: "2014 – 2016",
        bullets: [
          "Assisted in emergency response operations in flood-affected areas",
          "Coordinated food distribution for 5,000+ displaced persons",
        ],
      },
    ],
    education: [
      { degree: "BSW Social Work", school: "Maseno University", year: "2016" },
      { degree: "Diploma Counselling Psychology", school: "Kenya Institute of Professional Counselling", year: "2018" },
    ],
    certifications: ["KCSW Registered Social Worker", "Trauma-Focused CBT Certified", "Project Management for NGOs"],
    languages: ["English (Fluent)", "Swahili (Native)", "Luo (Native)"],
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
          "Conducted energy audits identifying savings of KES 30M",
        ],
      },
      {
        role: "Electrical Technician",
        company: "PowerGen Renewable Energy",
        dates: "2016 – 2018",
        bullets: ["Installed off-grid solar systems in rural Kenya", "Trained local technicians in system maintenance"],
      },
    ],
    education: [
      { degree: "BSc Electrical Engineering", school: "University of Nairobi", year: "2018" },
      { degree: "EBK Licensed Engineer", school: "Engineers Board of Kenya", year: "2019" },
    ],
    certifications: ["EBK Licensed Engineer", "OSHA 30-Hour Certified", "Solar Energy International Certificate"],
    languages: ["English (Fluent)", "Swahili (Native)", "Luo (Native)"],
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
        bullets: [
          "Sourced printing materials for 5 daily publications",
          "Reduced procurement cycle time by 35%",
          "Managed supplier performance reviews quarterly",
        ],
      },
      {
        role: "Purchasing Assistant",
        company: "Nakumatt Holdings",
        dates: "2014 – 2016",
        bullets: [
          "Processed purchase orders for 200+ product categories",
          "Coordinated with warehouse teams on inventory replenishment",
        ],
      },
    ],
    education: [
      { degree: "BCom Procurement", school: "JKUAT", year: "2016" },
      { degree: "CIPS Level 6", school: "Chartered Institute of Procurement", year: "2019" },
    ],
    certifications: ["CIPS Level 6 Diploma", "SAP MM Certified", "Public Procurement Certificate PPRA"],
    languages: ["English (Fluent)", "Swahili (Native)", "Kikuyu (Native)"],
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
          "Coordinated with structural and MEP engineers on complex builds",
        ],
      },
      {
        role: "Architectural Assistant",
        company: "Clive Wilkins & Partners",
        dates: "2013 – 2015",
        bullets: [
          "Produced architectural drawings and 3D visualizations",
          "Supported site visits and client presentation preparation",
        ],
      },
    ],
    education: [
      { degree: "BArch Architecture", school: "University of Nairobi", year: "2015" },
      { degree: "AAK Registered Architect", school: "Architectural Association of Kenya", year: "2016" },
    ],
    certifications: ["AAK Registered Architect", "LEED Green Associate", "Revit BIM Professional"],
    languages: ["English (Fluent)", "Swahili (Native)", "Kikuyu (Native)"],
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
          "Delivered nutrition education sessions for diabetes management",
        ],
      },
      {
        role: "Community Nutritionist",
        company: "World Food Programme Kenya",
        dates: "2016 – 2018",
        bullets: [
          "Implemented nutrition programs in arid and semi-arid regions",
          "Monitored nutritional status of 10,000+ beneficiaries",
        ],
      },
    ],
    education: [
      { degree: "BSc Food Nutrition & Dietetics", school: "Kenyatta University", year: "2018" },
      { degree: "Registered Nutritionist", school: "Kenya Nutritionists & Dieticians Institute", year: "2019" },
    ],
    certifications: [
      "KNDI Registered Nutritionist",
      "Sports Nutrition Certificate ISSN",
      "Diabetes Educator Certificate",
    ],
    languages: ["English (Fluent)", "Swahili (Native)", "Kikuyu (Native)"],
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
          "Established last-mile delivery partnerships in 3 new regions",
        ],
      },
      {
        role: "Customs Agent",
        company: "Kenya Revenue Authority",
        dates: "2012 – 2014",
        bullets: [
          "Processed import and export documentation daily",
          "Advised traders on customs tariff classification",
        ],
      },
    ],
    education: [
      { degree: "BSc Logistics & Supply Chain", school: "Technical University of Mombasa", year: "2014" },
      { degree: "Diploma Customs & Freight", school: "Kenya Revenue Authority", year: "2015" },
    ],
    certifications: ["CILT Diploma in Logistics", "KRA Customs Agent Licensed", "IATA Cargo Agent Certified"],
    languages: ["English (Fluent)", "Swahili (Native)", "Somali (Native)", "Arabic (Intermediate)"],
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
        bullets: [
          "Managed Google Ads budget of KES 2M monthly",
          "Increased email open rates from 12% to 28%",
          "Produced weekly performance reports for senior management",
        ],
      },
      {
        role: "Communications Intern",
        company: "UNICEF Kenya",
        dates: "2018 – 2019",
        bullets: [
          "Supported production of advocacy materials and reports",
          "Assisted in social media management and content scheduling",
        ],
      },
    ],
    education: [
      { degree: "BA Communication & PR", school: "Egerton University", year: "2019" },
      { degree: "Digital Marketing Diploma", school: "CIM Kenya", year: "2020" },
    ],
    certifications: ["Google Ads Certified", "HubSpot Inbound Marketing", "CIM Digital Marketing Diploma"],
    languages: ["English (Fluent)", "Swahili (Native)", "Kalenjin (Native)"],
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
          "Implemented ITIL service desk framework reducing ticket resolution time",
        ],
      },
      {
        role: "IT Technician",
        company: "Nation Media Group",
        dates: "2015 – 2017",
        bullets: [
          "Maintained newsroom IT systems for 24/7 broadcasting operations",
          "Installed and configured network equipment across 3 floors",
        ],
      },
    ],
    education: [
      { degree: "BSc Information Technology", school: "Strathmore University", year: "2017" },
      { degree: "Microsoft Azure Administrator", school: "Microsoft Certified", year: "2020" },
    ],
    certifications: ["Microsoft Azure Administrator", "CompTIA Security+", "ITIL v4 Foundation"],
    languages: ["English (Fluent)", "Swahili (Native)", "Kikuyu (Native)"],
  },
];

export const TEMPLATES: TemplateInfo[] = [
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
    id: "ats-banner",
    name: "ATS Banner",
    category: "ATS",
    description: "Gold banner sections, navy prestige design",
    colors: ["#c9a84c", "#0f172a", "#1e3a5f", "#374151", "#2d3748"],
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

function SectionLabel({
  children,
  color,
  borderColor,
}: {
  children: React.ReactNode;
  color: string;
  borderColor: string;
}) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 800,
        color,
        textTransform: "uppercase",
        letterSpacing: 1.5,
        borderBottom: `2px solid ${borderColor}`,
        paddingBottom: 4,
        marginBottom: 6,
        marginTop: 10,
      }}
    >
      {children}
    </div>
  );
}

// ─── ATS MINI PREVIEWS — each with its own distinct look ─────────────────────

function MiniATSPro({ p }: { p: TemplatePerson }) {
  const acc = "#1e40af";
  const SH = ({ label }: { label: string }) => (
    <div style={{ display: "flex", alignItems: "center", margin: "8px 0 4px" }}>
      <span
        style={{
          background: acc,
          color: "#fff",
          fontSize: 6,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: 1,
          padding: "1.5px 6px",
          borderRadius: 2,
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <div style={{ flex: 1, height: 0.5, background: "#e2e8f0", marginLeft: 5 }} />
    </div>
  );
  return (
    <div
      style={{
        width: "100%",
        background: "#fff",
        fontFamily: "Arial, sans-serif",
        fontSize: 7.5,
        borderLeft: "5px solid #1e40af",
        padding: "16px 14px",
      }}
    >
      {/* CENTRED header */}
      <div style={{ textAlign: "center", marginBottom: 10 }}>
        <div
          style={{
            fontSize: 17,
            fontWeight: 900,
            color: "#0f172a",
            letterSpacing: 2,
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          {p.name}
        </div>
        <div
          style={{
            fontSize: 7.5,
            color: acc,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
            marginTop: 3,
          }}
        >
          {p.title}
        </div>
        <div style={{ fontSize: 6.5, color: "#94a3b8", marginTop: 4 }}>
          {p.email} · {p.phone} · {p.location}
        </div>
      </div>
      <div style={{ height: 1.5, background: acc, marginBottom: 2 }} />
      {/* LEFT-ALIGNED body */}
      <SH label="Professional Summary" />
      <div style={{ fontSize: 7, color: "#475569", lineHeight: 1.6, marginBottom: 4 }}>{p.summary}</div>
      <SH label="Work Experience" />
      {p.experience.slice(0, 2).map((exp, i) => (
        <div key={i} style={{ marginBottom: 7 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 700, fontSize: 7.5, color: "#0f172a" }}>
              {exp.role} — {exp.company}
            </span>
            <span style={{ fontSize: 6.5, color: "#94a3b8" }}>{exp.dates}</span>
          </div>
          {exp.bullets.slice(0, 2).map((b, j) => (
            <div
              key={j}
              style={{ fontSize: 6.5, color: "#475569", paddingLeft: 9, position: "relative", lineHeight: 1.5 }}
            >
              <span style={{ position: "absolute", left: 0, color: acc, fontSize: 7 }}>▸</span>
              {b}
            </div>
          ))}
        </div>
      ))}
      <SH label="Core Skills" />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {p.skills.map((s) => (
          <span
            key={s}
            style={{
              fontSize: 6,
              background: "#eff6ff",
              color: acc,
              border: "1px solid #bfdbfe",
              borderRadius: 2,
              padding: "1px 5px",
              fontWeight: 600,
            }}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

function MiniATSClassic({ p }: { p: TemplatePerson }) {
  const SH = ({ label }: { label: string }) => (
    <div
      style={{
        fontSize: 7.5,
        fontWeight: 900,
        color: "#0f172a",
        textTransform: "uppercase",
        letterSpacing: 2,
        borderBottom: "1.5px solid #0f172a",
        paddingBottom: 2,
        margin: "8px 0 4px",
      }}
    >
      {label}
    </div>
  );
  return (
    <div
      style={{
        width: "100%",
        background: "#fff",
        fontFamily: "Arial, sans-serif",
        fontSize: 7.5,
        padding: "16px 16px",
      }}
    >
      {/* CENTRED header */}
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <div style={{ fontSize: 18, fontWeight: 900, color: "#0f172a", letterSpacing: -0.3, lineHeight: 1 }}>
          {p.name}
        </div>
        <div style={{ fontSize: 7, color: "#475569", letterSpacing: 2, textTransform: "uppercase", marginTop: 3 }}>
          {p.title}
        </div>
        <div style={{ height: 1, background: "#e2e8f0", margin: "5px auto", width: "60%" }} />
        <div style={{ fontSize: 6.5, color: "#94a3b8" }}>
          {p.email} · {p.phone} · {p.location}
        </div>
      </div>
      {/* LEFT-ALIGNED body */}
      <SH label="Experience" />
      {p.experience.slice(0, 2).map((exp, i) => (
        <div key={i} style={{ marginBottom: 7 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 700, fontSize: 8, color: "#0f172a" }}>{exp.role}</span>
            <span style={{ fontSize: 6.5, color: "#6b7280" }}>{exp.dates}</span>
          </div>
          <div style={{ fontSize: 7, color: "#64748b", marginBottom: 1 }}>{exp.company}</div>
          {exp.bullets.slice(0, 2).map((b, j) => (
            <div
              key={j}
              style={{ fontSize: 6.5, color: "#475569", paddingLeft: 8, position: "relative", lineHeight: 1.5 }}
            >
              <span style={{ position: "absolute", left: 0, color: "#94a3b8" }}>–</span>
              {b}
            </div>
          ))}
        </div>
      ))}
      <SH label="Skills" />
      <div style={{ fontSize: 7, color: "#475569" }}>{p.skills.join(", ")}</div>
    </div>
  );
}

function MiniATSModern({ p }: { p: TemplatePerson }) {
  const acc = "#1e40af";
  const SH = ({ label }: { label: string }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 4, margin: "8px 0 4px" }}>
      <div style={{ width: 5, height: 5, borderRadius: "50%", background: acc, flexShrink: 0 }} />
      <span style={{ fontSize: 7, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, color: "#0f172a" }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 0.5, background: "#e2e8f0" }} />
    </div>
  );
  return (
    <div style={{ width: "100%", background: "#fafafa", fontFamily: "Arial, sans-serif", fontSize: 7.5 }}>
      {/* LEFT-ALIGNED dark header */}
      <div style={{ background: "#1e293b", padding: "12px 14px" }}>
        <div style={{ fontSize: 15, fontWeight: 900, color: "#f8fafc", letterSpacing: 0.5 }}>{p.name}</div>
        <div style={{ fontSize: 7, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1.5, marginTop: 2 }}>
          {p.title}
        </div>
      </div>
      <div
        style={{
          background: "#f1f5f9",
          padding: "3px 14px",
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <span style={{ fontSize: 6.5, color: "#64748b" }}>{p.email}</span>
        <span style={{ fontSize: 6.5, color: "#cbd5e1" }}>·</span>
        <span style={{ fontSize: 6.5, color: "#64748b" }}>{p.phone}</span>
        <span style={{ fontSize: 6.5, color: "#cbd5e1" }}>·</span>
        <span style={{ fontSize: 6.5, color: "#64748b" }}>{p.location}</span>
      </div>
      <div style={{ padding: "6px 14px 12px" }}>
        <SH label="Summary" />
        <div style={{ fontSize: 7, color: "#475569", lineHeight: 1.6, marginBottom: 2 }}>{p.summary}</div>
        <SH label="Experience" />
        {p.experience.slice(0, 2).map((exp, i) => (
          <div key={i} style={{ marginBottom: 7 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: 700, fontSize: 7.5, color: "#0f172a" }}>{exp.role}</span>
              <span style={{ fontSize: 6.5, color: "#94a3b8" }}>{exp.dates}</span>
            </div>
            <div style={{ fontSize: 7, color: "#64748b", marginBottom: 1 }}>{exp.company}</div>
            {exp.bullets.slice(0, 2).map((b, j) => (
              <div
                key={j}
                style={{ fontSize: 6.5, color: "#475569", paddingLeft: 10, position: "relative", lineHeight: 1.5 }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: 2,
                    top: 4,
                    width: 3,
                    height: 3,
                    borderRadius: "50%",
                    background: acc,
                    display: "inline-block",
                  }}
                />
                {b}
              </div>
            ))}
          </div>
        ))}
        <SH label="Skills" />
        <div style={{ fontSize: 7, color: "#475569" }}>{p.skills.join(", ")}</div>
      </div>
    </div>
  );
}

function MiniATSExecutive({ p }: { p: TemplatePerson }) {
  const SH = ({ label }: { label: string }) => (
    <div
      style={{
        fontSize: 6.5,
        fontWeight: 900,
        textTransform: "uppercase",
        letterSpacing: 2.5,
        color: "#94a3b8",
        margin: "9px 0 4px",
      }}
    >
      {label}
    </div>
  );
  return (
    <div
      style={{
        width: "100%",
        background: "#fff",
        fontFamily: "Arial, sans-serif",
        fontSize: 7.5,
        padding: "16px 16px",
      }}
    >
      {/* LEFT-ALIGNED header */}
      <div style={{ marginBottom: 6 }}>
        <div
          style={{
            fontSize: 17,
            fontWeight: 900,
            color: "#0f172a",
            letterSpacing: -0.5,
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          {p.name}
        </div>
        <div style={{ fontSize: 7, color: "#64748b", letterSpacing: 2.5, textTransform: "uppercase", marginTop: 4 }}>
          {p.title}
        </div>
        <div
          style={{
            height: 1,
            background: "linear-gradient(90deg,#0f172a 40%,transparent)",
            marginTop: 5,
            marginBottom: 4,
          }}
        />
        <div style={{ fontSize: 6.5, color: "#94a3b8", display: "flex", gap: 8 }}>
          <span>{p.email}</span>
          <span>{p.phone}</span>
          <span>{p.location}</span>
        </div>
      </div>
      {/* LEFT-ALIGNED body */}
      <SH label="Professional Summary" />
      <div
        style={{
          fontSize: 7,
          color: "#475569",
          lineHeight: 1.7,
          borderLeft: "2px solid #e2e8f0",
          paddingLeft: 6,
          marginBottom: 2,
        }}
      >
        {p.summary}
      </div>
      <SH label="Experience" />
      {p.experience.slice(0, 2).map((exp, i) => (
        <div key={i} style={{ marginBottom: 7 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 900, fontSize: 8, color: "#0f172a" }}>{exp.role}</span>
            <span style={{ fontSize: 6.5, color: "#94a3b8" }}>{exp.dates}</span>
          </div>
          <div style={{ fontSize: 7, color: "#475569", fontStyle: "italic", marginBottom: 1 }}>{exp.company}</div>
          {exp.bullets.slice(0, 2).map((b, j) => (
            <div
              key={j}
              style={{ fontSize: 6.5, color: "#475569", paddingLeft: 7, position: "relative", lineHeight: 1.5 }}
            >
              <span style={{ position: "absolute", left: 0, color: "#0f172a", fontSize: 9, lineHeight: 1.2 }}>·</span>
              {b}
            </div>
          ))}
        </div>
      ))}
      <SH label="Skills" />
      <div style={{ fontSize: 7, color: "#475569" }}>{p.skills.join(", ")}</div>
    </div>
  );
}

// ─── MAIN MINI CV PREVIEW ─────────────────────────────────────────────────────
function MiniCVPreview({ template }: { template: TemplateInfo }) {
  const p = template.person;
  const accent = template.colors[0];
  const isExecutive = template.category === "Executive";
  const isCreative = template.category === "Creative";
  const isMinimalist = template.category === "Minimalist";

  // ── Route ATS templates to their own distinct mini previews ──
  if (template.id === "ats-pro") return <MiniATSPro p={p} />;
  if (template.id === "ats-classic") return <MiniATSClassic p={p} />;
  if (template.id === "ats-modern") return <MiniATSModern p={p} />;
  if (template.id === "ats-executive") return <MiniATSExecutive p={p} />;

  if (template.layout === "sidebar") {
    return (
      <div style={{ display: "flex", width: "100%", fontFamily: "Georgia, serif", background: "#fff" }}>
        <div style={{ width: "34%", background: "#1e293b", padding: "22px 14px", color: "#fff", flexShrink: 0 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: accent,
              margin: "0 auto 10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 800,
              color: "#fff",
            }}
          >
            {p.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 800,
              textAlign: "center",
              color: "#fff",
              lineHeight: 1.2,
              marginBottom: 3,
            }}
          >
            {p.name}
          </div>
          <div
            style={{
              fontSize: 9,
              color: accent,
              textAlign: "center",
              textTransform: "uppercase",
              letterSpacing: 1,
              fontWeight: 700,
              marginBottom: 14,
            }}
          >
            {p.title}
          </div>
          <div style={{ fontSize: 8, color: "#94a3b8", marginBottom: 2 }}>✉ {p.email}</div>
          <div style={{ fontSize: 8, color: "#94a3b8", marginBottom: 2 }}>☎ {p.phone}</div>
          <div style={{ fontSize: 8, color: "#94a3b8", marginBottom: 12 }}>⌖ {p.location}</div>
          <div style={{ height: 1, background: "#334155", marginBottom: 8 }} />
          <div
            style={{
              fontSize: 9,
              color: accent,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 6,
            }}
          >
            Skills
          </div>
          {p.skills.map((s, i) => (
            <div key={i} style={{ marginBottom: 5 }}>
              <div style={{ fontSize: 8, color: "#cbd5e1", marginBottom: 2 }}>{s}</div>
              <div style={{ height: 3, background: "#334155", borderRadius: 2 }}>
                <div
                  style={{ height: "100%", width: `${88 - ((i * 9) % 38)}%`, background: accent, borderRadius: 2 }}
                />
              </div>
            </div>
          ))}
          <div style={{ height: 1, background: "#334155", margin: "8px 0" }} />
          <div
            style={{
              fontSize: 9,
              color: accent,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 5,
            }}
          >
            Education
          </div>
          {p.education.map((e, i) => (
            <div key={i} style={{ marginBottom: 5 }}>
              <div style={{ fontSize: 8, fontWeight: 700, color: "#e2e8f0", lineHeight: 1.3 }}>{e.degree}</div>
              <div style={{ fontSize: 7, color: "#94a3b8" }}>
                {e.school} · {e.year}
              </div>
            </div>
          ))}
        </div>
        <div style={{ flex: 1, padding: "22px 16px", background: "#fff" }}>
          <SectionLabel color="#0f172a" borderColor={accent}>
            Profile
          </SectionLabel>
          <div style={{ fontSize: 9, color: "#475569", lineHeight: 1.6, marginBottom: 2 }}>{p.summary}</div>
          <SectionLabel color="#0f172a" borderColor={accent}>
            Work Experience
          </SectionLabel>
          {p.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 9 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: "#0f172a", lineHeight: 1.2 }}>{exp.role}</span>
                <span style={{ fontSize: 8, color: accent, fontWeight: 600 }}>{exp.dates}</span>
              </div>
              <div style={{ fontSize: 9, color: "#64748b", fontWeight: 600, marginBottom: 2 }}>{exp.company}</div>
              {exp.bullets.map((b, j) => (
                <div
                  key={j}
                  style={{ fontSize: 8, color: "#475569", lineHeight: 1.5, paddingLeft: 10, position: "relative" }}
                >
                  <span style={{ position: "absolute", left: 2 }}>•</span>
                  {b}
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
      <div style={{ width: "100%", fontFamily: "Georgia, serif", background: "#fff" }}>
        <div style={{ background: accent, padding: "18px 20px 14px" }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: "#fff", letterSpacing: -0.5, lineHeight: 1 }}>
            {p.name}
          </div>
          <div
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.88)",
              textTransform: "uppercase",
              letterSpacing: 2,
              fontWeight: 600,
              marginTop: 4,
            }}
          >
            {p.title}
          </div>
          <div style={{ fontSize: 8, color: "rgba(255,255,255,0.65)", marginTop: 5 }}>
            {p.email} · {p.phone} · {p.location}
          </div>
        </div>
        <div style={{ display: "flex" }}>
          <div style={{ flex: 1, padding: "14px 16px" }}>
            <SectionLabel color={accent} borderColor={accent}>
              Profile
            </SectionLabel>
            <div style={{ fontSize: 9, color: "#475569", lineHeight: 1.6, marginBottom: 2 }}>{p.summary}</div>
            <SectionLabel color={accent} borderColor={accent}>
              Work Experience
            </SectionLabel>
            {p.experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#0f172a" }}>{exp.role}</span>
                  <span style={{ fontSize: 8, color: "#64748b" }}>{exp.dates}</span>
                </div>
                <div style={{ fontSize: 9, color: accent, fontWeight: 600, marginBottom: 3 }}>{exp.company}</div>
                {exp.bullets.map((b, j) => (
                  <div
                    key={j}
                    style={{ fontSize: 8, color: "#475569", lineHeight: 1.5, paddingLeft: 10, position: "relative" }}
                  >
                    <span style={{ position: "absolute", left: 2 }}>•</span>
                    {b}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ width: "32%", background: "#f8fafc", padding: "14px 12px", borderLeft: `3px solid ${accent}` }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 800,
                color: accent,
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 6,
              }}
            >
              Skills
            </div>
            {p.skills.map((s, i) => (
              <div
                key={i}
                style={{
                  fontSize: 9,
                  color: "#334155",
                  lineHeight: 1.8,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: accent,
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                {s}
              </div>
            ))}
            <div style={{ height: 1, background: "#e2e8f0", margin: "8px 0" }} />
            <div
              style={{
                fontSize: 10,
                fontWeight: 800,
                color: accent,
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 6,
              }}
            >
              Education
            </div>
            {p.education.map((e, i) => (
              <div key={i} style={{ marginBottom: 5 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: "#0f172a", lineHeight: 1.3 }}>{e.degree}</div>
                <div style={{ fontSize: 8, color: "#64748b" }}>
                  {e.school} · {e.year}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (template.layout === "photo") {
    return (
      <div style={{ width: "100%", fontFamily: "Georgia, serif", background: "#fff" }}>
        <div style={{ background: "#1e293b", padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: accent,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              fontWeight: 800,
              color: "#fff",
              border: "3px solid rgba(255,255,255,0.2)",
            }}
          >
            {p.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", letterSpacing: -0.3, lineHeight: 1 }}>
              {p.name}
            </div>
            <div
              style={{
                fontSize: 10,
                color: accent,
                textTransform: "uppercase",
                letterSpacing: 1.5,
                fontWeight: 700,
                marginTop: 4,
              }}
            >
              {p.title}
            </div>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.55)", marginTop: 4 }}>
              {p.email} · {p.phone} · {p.location}
            </div>
          </div>
        </div>
        <div style={{ height: 3, background: `linear-gradient(90deg, ${accent}, ${accent}60)` }} />
        <div style={{ padding: "10px 16px" }}>
          <SectionLabel color="#0f172a" borderColor={accent}>
            Profile
          </SectionLabel>
          <div style={{ fontSize: 9, color: "#475569", lineHeight: 1.6, marginBottom: 2 }}>{p.summary}</div>
          <SectionLabel color="#0f172a" borderColor={accent}>
            Work Experience
          </SectionLabel>
          {p.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: "#0f172a" }}>{exp.role}</span>
                <span style={{ fontSize: 8, color: accent, fontWeight: 600 }}>{exp.dates}</span>
              </div>
              <div style={{ fontSize: 9, color: accent, fontWeight: 600, marginBottom: 3 }}>{exp.company}</div>
              {exp.bullets.map((b, j) => (
                <div
                  key={j}
                  style={{ fontSize: 8, color: "#475569", lineHeight: 1.5, paddingLeft: 10, position: "relative" }}
                >
                  <span style={{ position: "absolute", left: 2 }}>•</span>
                  {b}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isATS) {
    const id = template.id;

    if (id === "ats-pro") {
      return (
        <div style={{ width: "100%", fontFamily: "Arial, sans-serif", background: "#fff" }}>
          <div style={{ display: "flex", background: "#0f172a" }}>
            <div style={{ width: 6, background: "#c9a84c", flexShrink: 0 }} />
            <div style={{ padding: "18px 18px 14px 14px", flex: 1 }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", letterSpacing: -0.5, lineHeight: 1 }}>{p.name.toUpperCase()}</div>
              <div style={{ fontSize: 10, color: "#c9a84c", fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, margin: "4px 0 7px" }}>{p.title}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, fontSize: 8, color: "rgba(255,255,255,0.6)" }}>
                <span>{p.email}</span><span>{p.phone}</span><span>{p.location}</span>
              </div>
            </div>
          </div>
          <div style={{ padding: "10px 16px" }}>
            {[["PROFESSIONAL PROFILE", p.summary], null].map((_, si) => si === 0 ? (
              <div key={si}>
                <div style={{ fontSize: 9, fontWeight: 800, color: "#0f172a", textTransform: "uppercase", letterSpacing: 2, marginBottom: 3 }}>PROFESSIONAL PROFILE</div>
                <div style={{ width: 36, height: 2, background: "#c9a84c", marginBottom: 6 }} />
                <div style={{ fontSize: 8, color: "#475569", lineHeight: 1.6, marginBottom: 10 }}>{p.summary}</div>
                <div style={{ fontSize: 9, fontWeight: 800, color: "#0f172a", textTransform: "uppercase", letterSpacing: 2, marginBottom: 3 }}>WORK EXPERIENCE</div>
                <div style={{ width: 36, height: 2, background: "#c9a84c", marginBottom: 8 }} />
                {p.experience.map((exp, i) => (
                  <div key={i} style={{ marginBottom: 9, paddingBottom: 9, borderBottom: i < p.experience.length - 1 ? "0.5px solid #f1f5f9" : "none" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontSize: 9.5, fontWeight: 800, color: "#0f172a" }}>{exp.role}</span>
                      <span style={{ fontSize: 7.5, background: "#0f172a", color: "#c9a84c", padding: "1px 7px", borderRadius: 3, fontWeight: 700 }}>{exp.dates}</span>
                    </div>
                    <div style={{ fontSize: 8.5, color: "#c9a84c", fontWeight: 700, margin: "2px 0 4px" }}>{exp.company}</div>
                    {exp.bullets.map((b, j) => <div key={j} style={{ fontSize: 8, color: "#334155", paddingLeft: 10, position: "relative", lineHeight: 1.65 }}><span style={{ position: "absolute", left: 2, color: "#c9a84c", fontWeight: 900 }}>›</span>{b}</div>)}
                  </div>
                ))}
                <div style={{ fontSize: 9, fontWeight: 800, color: "#0f172a", textTransform: "uppercase", letterSpacing: 2, marginBottom: 3 }}>EDUCATION</div>
                <div style={{ width: 36, height: 2, background: "#c9a84c", marginBottom: 7 }} />
                {p.education.map((e, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", background: "#f8fafc", padding: "5px 8px", borderRadius: 3, borderLeft: "3px solid #c9a84c", marginBottom: 4 }}><div><div style={{ fontSize: 9, fontWeight: 800, color: "#0f172a" }}>{e.degree}</div><div style={{ fontSize: 7.5, color: "#64748b" }}>{e.school}</div></div><div style={{ fontSize: 7.5, color: "#c9a84c", fontWeight: 700 }}>{e.year}</div></div>)}
                <div style={{ fontSize: 9, fontWeight: 800, color: "#0f172a", textTransform: "uppercase", letterSpacing: 2, margin: "8px 0 3px" }}>SKILLS</div>
                <div style={{ width: 36, height: 2, background: "#c9a84c", marginBottom: 7 }} />
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 9 }}>{p.skills.map((s, i) => <span key={i} style={{ fontSize: 7.5, background: "#0f172a", color: "#c9a84c", padding: "2px 8px", borderRadius: 3, fontWeight: 700 }}>{s}</span>)}</div>
                <div style={{ fontSize: 9, fontWeight: 800, color: "#0f172a", textTransform: "uppercase", letterSpacing: 2, marginBottom: 3 }}>CERTIFICATIONS</div>
                <div style={{ width: 36, height: 2, background: "#c9a84c", marginBottom: 6 }} />
                {p.certifications.map((c, i) => <div key={i} style={{ fontSize: 8, color: "#334155", lineHeight: 1.8, display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 4, height: 4, background: "#c9a84c", borderRadius: "50%", flexShrink: 0 }} />{c}</div>)}
                <div style={{ fontSize: 9, fontWeight: 800, color: "#0f172a", textTransform: "uppercase", letterSpacing: 2, margin: "8px 0 6px" }}>LANGUAGES</div>
                <div style={{ width: 36, height: 2, background: "#c9a84c", marginBottom: 7 }} />
                <div style={{ display: "flex", gap: 14 }}>{p.languages.map((l, i) => <div key={i} style={{ fontSize: 8, color: "#334155" }}>{l}</div>)}</div>
              </div>
            ) : null)}
          </div>
        </div>
      );
    }

    if (id === "ats-classic") {
      return (
        <div style={{ width: "100%", fontFamily: "Arial, sans-serif", background: "#fff" }}>
          <div style={{ padding: "20px 22px 14px", textAlign: "center", borderBottom: "2.5px solid #0f172a" }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: "#0f172a", letterSpacing: 1 }}>{p.name.toUpperCase()}</div>
            <div style={{ fontSize: 9.5, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: 2.5, margin: "5px 0 7px" }}>{p.title}</div>
            <div style={{ display: "flex", justifyContent: "center", gap: 12, fontSize: 8, color: "#64748b", flexWrap: "wrap" }}>
              <span>{p.email}</span><span>·</span><span>{p.phone}</span><span>·</span><span>{p.location}</span>
            </div>
          </div>
          <div style={{ padding: "10px 20px" }}>
            {["PROFESSIONAL SUMMARY","PROFESSIONAL EXPERIENCE","EDUCATION","SKILLS","CERTIFICATIONS","LANGUAGES"].map((sec, si) => (
              <div key={si}>
                <div style={{ fontSize: 9, fontWeight: 800, color: "#0f172a", textTransform: "uppercase", letterSpacing: 2, borderBottom: "1.5px solid #0f172a", paddingBottom: 3, marginBottom: 6, marginTop: si > 0 ? 10 : 0 }}>{sec}</div>
                {si === 0 && <div style={{ fontSize: 8, color: "#475569", lineHeight: 1.65, marginBottom: 2 }}>{p.summary}</div>}
                {si === 1 && p.experience.map((exp, i) => <div key={i} style={{ marginBottom: 9 }}><div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 9.5, fontWeight: 800, color: "#0f172a" }}>{exp.role}</span><span style={{ fontSize: 8, color: "#475569", fontStyle: "italic" }}>{exp.dates}</span></div><div style={{ fontSize: 8.5, color: "#475569", fontWeight: 700, margin: "2px 0 4px" }}>{exp.company}</div>{exp.bullets.map((b, j) => <div key={j} style={{ fontSize: 8, color: "#334155", paddingLeft: 12, position: "relative", lineHeight: 1.65 }}><span style={{ position: "absolute", left: 3 }}>•</span>{b}</div>)}</div>)}
                {si === 2 && p.education.map((e, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}><div><div style={{ fontSize: 9, fontWeight: 800, color: "#0f172a" }}>{e.degree}</div><div style={{ fontSize: 7.5, color: "#64748b" }}>{e.school}</div></div><div style={{ fontSize: 8, color: "#475569", fontStyle: "italic" }}>{e.year}</div></div>)}
                {si === 3 && <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{p.skills.map((s, i) => <span key={i} style={{ fontSize: 7.5, background: "#f8fafc", color: "#334155", padding: "2px 8px", borderRadius: 2, border: "1px solid #e2e8f0", fontWeight: 600 }}>{s}</span>)}</div>}
                {si === 4 && <div style={{ fontSize: 8, color: "#475569", lineHeight: 1.8 }}>{p.certifications.join(" · ")}</div>}
                {si === 5 && <div style={{ fontSize: 8, color: "#475569" }}>{p.languages.join(" · ")}</div>}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (id === "ats-modern") {
      return (
        <div style={{ width: "100%", fontFamily: "Arial, sans-serif", background: "#fff" }}>
          <div style={{ background: "#1e40af", padding: "18px 22px 14px", textAlign: "center" }}>
            <div style={{ fontSize: 23, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{p.name}</div>
            <div style={{ fontSize: 9.5, color: "#93c5fd", fontWeight: 600, textTransform: "uppercase", letterSpacing: 2, margin: "5px 0 8px" }}>{p.title}</div>
            <div style={{ display: "flex", justifyContent: "center", gap: 12, fontSize: 8, color: "rgba(255,255,255,0.65)", flexWrap: "wrap" }}>
              <span>{p.email}</span><span>|</span><span>{p.phone}</span><span>|</span><span>{p.location}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
              {p.skills.slice(0, 3).map((s, i) => <span key={i} style={{ fontSize: 7.5, background: "rgba(255,255,255,0.15)", color: "#fff", padding: "2px 9px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.25)" }}>{s}</span>)}
            </div>
          </div>
          <div style={{ padding: "10px 20px" }}>
            {["PROFILE","WORK EXPERIENCE","EDUCATION","SKILLS","CERTIFICATIONS","LANGUAGES"].map((sec, si) => (
              <div key={si}>
                <div style={{ fontSize: 9, fontWeight: 800, color: "#1e40af", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4, marginTop: si > 0 ? 10 : 0 }}>{sec}</div>
                <div style={{ height: 1.5, background: "#dbeafe", marginBottom: 7 }} />
                {si === 0 && <div style={{ fontSize: 8, color: "#475569", lineHeight: 1.65 }}>{p.summary}</div>}
                {si === 1 && p.experience.map((exp, i) => <div key={i} style={{ marginBottom: 9 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: 9.5, fontWeight: 800, color: "#0f172a" }}>{exp.role}</span><span style={{ fontSize: 7.5, background: "#dbeafe", color: "#1e40af", padding: "1px 7px", borderRadius: 3, fontWeight: 700 }}>{exp.dates}</span></div><div style={{ fontSize: 8.5, color: "#1e40af", fontWeight: 700, margin: "2px 0 4px" }}>{exp.company}</div>{exp.bullets.map((b, j) => <div key={j} style={{ fontSize: 8, color: "#334155", paddingLeft: 10, position: "relative", lineHeight: 1.65 }}><span style={{ position: "absolute", left: 2, color: "#1e40af" }}>›</span>{b}</div>)}</div>)}
                {si === 2 && p.education.map((e, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}><div><div style={{ fontSize: 9, fontWeight: 800, color: "#0f172a" }}>{e.degree}</div><div style={{ fontSize: 7.5, color: "#64748b" }}>{e.school}</div></div><div style={{ fontSize: 8, color: "#1e40af", fontWeight: 700 }}>{e.year}</div></div>)}
                {si === 3 && <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{p.skills.map((s, i) => <span key={i} style={{ fontSize: 7.5, background: "#dbeafe", color: "#1e40af", padding: "2px 8px", borderRadius: 4, fontWeight: 700 }}>{s}</span>)}</div>}
                {si === 4 && <div style={{ fontSize: 8, color: "#475569", lineHeight: 1.8 }}>{p.certifications.join(" · ")}</div>}
                {si === 5 && <div style={{ fontSize: 8, color: "#475569" }}>{p.languages.join(" · ")}</div>}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (id === "ats-executive") {
      return (
        <div style={{ width: "100%", fontFamily: "Arial, sans-serif", background: "#fff" }}>
          <div style={{ background: "#0f172a", padding: "20px 22px 16px" }}>
            <div style={{ fontSize: 9, color: "#c9a84c", fontWeight: 700, textTransform: "uppercase", letterSpacing: 4, marginBottom: 5 }}>Curriculum Vitae</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: "#fff", letterSpacing: 1.5, textTransform: "uppercase" }}>{p.name}</div>
            <div style={{ fontSize: 9.5, color: "#c9a84c", fontWeight: 600, textTransform: "uppercase", letterSpacing: 2.5, margin: "5px 0 9px" }}>{p.title}</div>
            <div style={{ display: "flex", gap: 6, marginBottom: 8 }}><div style={{ height: 2, background: "#c9a84c", flex: 1 }} /><div style={{ height: 2, background: "rgba(201,168,76,0.3)", flex: 1 }} /><div style={{ height: 2, background: "rgba(201,168,76,0.1)", flex: 1 }} /></div>
            <div style={{ display: "flex", gap: 14, fontSize: 8, color: "rgba(255,255,255,0.55)", flexWrap: "wrap" }}><span>{p.email}</span><span>{p.phone}</span><span>{p.location}</span></div>
          </div>
          <div style={{ padding: "10px 22px" }}>
            {["Executive Summary","Leadership Experience","Education","Core Competencies","Certifications","Languages"].map((sec, si) => (
              <div key={si}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, margin: `${si > 0 ? 10 : 0}px 0 5px` }}><div style={{ width: 3, height: 13, background: "#c9a84c", borderRadius: 2 }} /><div style={{ fontSize: 9, fontWeight: 800, color: "#0f172a", textTransform: "uppercase", letterSpacing: 2 }}>{sec}</div></div>
                {si === 0 && <div style={{ fontSize: 8, color: "#475569", lineHeight: 1.65, paddingLeft: 10 }}>{p.summary}</div>}
                {si === 1 && <div style={{ paddingLeft: 10 }}>{p.experience.map((exp, i) => <div key={i} style={{ marginBottom: 9 }}><div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 9.5, fontWeight: 800, color: "#0f172a" }}>{exp.role}</span><span style={{ fontSize: 8, color: "#c9a84c", fontWeight: 800 }}>{exp.dates}</span></div><div style={{ fontSize: 8.5, color: "#c9a84c", fontWeight: 700, margin: "2px 0 4px" }}>{exp.company}</div>{exp.bullets.map((b, j) => <div key={j} style={{ fontSize: 8, color: "#334155", paddingLeft: 10, position: "relative", lineHeight: 1.65 }}><span style={{ position: "absolute", left: 2, color: "#c9a84c" }}>◆</span>{b}</div>)}</div>)}</div>}
                {si === 2 && <div style={{ paddingLeft: 10 }}>{p.education.map((e, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}><div><div style={{ fontSize: 9, fontWeight: 800, color: "#0f172a" }}>{e.degree}</div><div style={{ fontSize: 7.5, color: "#64748b" }}>{e.school}</div></div><div style={{ fontSize: 8, color: "#c9a84c", fontWeight: 800 }}>{e.year}</div></div>)}</div>}
                {si === 3 && <div style={{ display: "flex", flexWrap: "wrap", gap: 4, paddingLeft: 10 }}>{p.skills.map((s, i) => <span key={i} style={{ fontSize: 7.5, background: "#0f172a", color: "#c9a84c", padding: "2px 9px", borderRadius: 3, fontWeight: 700, border: "1px solid rgba(201,168,76,0.3)" }}>{s}</span>)}</div>}
                {si === 4 && <div style={{ fontSize: 8, color: "#475569", lineHeight: 1.8, paddingLeft: 10 }}>{p.certifications.join(" · ")}</div>}
                {si === 5 && <div style={{ fontSize: 8, color: "#475569", paddingLeft: 10 }}>{p.languages.join(" · ")}</div>}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // ats-banner
    return (
      <div style={{ width: "100%", fontFamily: "Arial, sans-serif", background: "#fff" }}>
        <div style={{ background: "#0f172a", padding: "18px 22px 14px" }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#fff", letterSpacing: 1, textTransform: "uppercase", textAlign: "center" }}>{p.name}</div>
          <div style={{ fontSize: 9.5, color: "#c9a84c", fontWeight: 700, textTransform: "uppercase", letterSpacing: 2.5, margin: "5px 0 8px", textAlign: "center" }}>{p.title}</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 12, fontSize: 8, color: "rgba(255,255,255,0.6)", flexWrap: "wrap" }}>
            <span>{p.email}</span><span>·</span><span>{p.phone}</span><span>·</span><span>{p.location}</span>
          </div>
        </div>
        <div style={{ padding: "0 18px 12px" }}>
          {["PROFESSIONAL SUMMARY","EXPERIENCE","EDUCATION","CORE SKILLS","LANGUAGES & CERTIFICATIONS"].map((sec, si) => (
            <div key={si}>
              <div style={{ background: "#c9a84c", margin: "10px -18px 7px", padding: "4px 18px" }}>
                <div style={{ fontSize: 9, fontWeight: 800, color: "#0f172a", textTransform: "uppercase", letterSpacing: 2 }}>{sec}</div>
              </div>
              {si === 0 && <div style={{ fontSize: 8, color: "#475569", lineHeight: 1.65 }}>{p.summary}</div>}
              {si === 1 && p.experience.map((exp, i) => <div key={i} style={{ marginBottom: 9 }}><div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 9.5, fontWeight: 800, color: "#0f172a" }}>{exp.role}</span><span style={{ fontSize: 8, color: "#64748b" }}>{exp.dates}</span></div><div style={{ fontSize: 8.5, color: "#c9a84c", fontWeight: 700, margin: "2px 0 4px" }}>{exp.company}</div>{exp.bullets.map((b, j) => <div key={j} style={{ fontSize: 8, color: "#334155", paddingLeft: 10, position: "relative", lineHeight: 1.65 }}><span style={{ position: "absolute", left: 2, color: "#c9a84c" }}>◆</span>{b}</div>)}</div>)}
              {si === 2 && p.education.map((e, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}><div><div style={{ fontSize: 9, fontWeight: 800, color: "#0f172a" }}>{e.degree}</div><div style={{ fontSize: 7.5, color: "#64748b" }}>{e.school}</div></div><div style={{ fontSize: 8, color: "#c9a84c", fontWeight: 700 }}>{e.year}</div></div>)}
              {si === 3 && <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{p.skills.map((s, i) => <span key={i} style={{ fontSize: 7.5, background: "#0f172a", color: "#c9a84c", padding: "2px 9px", borderRadius: 3, fontWeight: 700 }}>{s}</span>)}</div>}
              {si === 4 && <div style={{ fontSize: 8, color: "#475569", lineHeight: 1.9 }}>{[...p.certifications, ...p.languages].join(" · ")}</div>}
            </div>
          ))}
        </div>
      </div>
    );
  }
```

Then delete the old single-layout code that starts with:
```
  const headerBg = isExecutive ? ...
  const headerText = headerBg === "#fff" ? "#0f172a" : "#fff";
  const accentOnHeader = isExecutive ? "#c9a84c" : isCreative ? "#fff" : accent;
  const bodyAccent = isExecutive ? "#c9a84c" : accent;
  const sectionLabelColor = isMinimalist ? "#9ca3af" : "#0f172a";

  return (
    <div style={{ width: "100%", fontFamily: "Georgia, serif", background: "#fff" }}>
      <div
        style={{
          background: headerBg,
          padding: "12px 16px",
          borderBottom: isMinimalist ? `2px solid ${accent}` : "none",
        }}
      >
        <div
          style={{
            fontSize: isExecutive ? 24 : 22,
            fontWeight: 900,
            color: headerText,
            letterSpacing: isExecutive ? 3 : -0.3,
            lineHeight: 1,
          }}
        >
          {isExecutive ? p.name.toUpperCase() : p.name}
        </div>
        <div
          style={{
            fontSize: 11,
            color: accentOnHeader,
            textTransform: "uppercase",
            letterSpacing: isExecutive ? 3 : 1.5,
            fontWeight: 600,
            marginTop: 4,
          }}
        >
          {p.title}
        </div>
        <div style={{ fontSize: 8, color: headerBg === "#fff" ? "#64748b" : "rgba(255,255,255,0.6)", marginTop: 5 }}>
          {p.email} · {p.phone} · {p.location}
        </div>
      </div>
      {isExecutive && <div style={{ height: 3, background: "linear-gradient(90deg,#c9a84c,#f0d080,#c9a84c)" }} />}
      <div style={{ padding: "10px 16px" }}>
        <SectionLabel color={sectionLabelColor} borderColor={bodyAccent}>
          {isExecutive ? "Executive Summary" : "Profile"}
        </SectionLabel>
        <div style={{ fontSize: 9, color: "#475569", lineHeight: 1.6, marginBottom: 2 }}>{p.summary}</div>
        <SectionLabel color={sectionLabelColor} borderColor={bodyAccent}>
          {isExecutive ? "Leadership Experience" : "Work Experience"}
        </SectionLabel>
        {p.experience.map((exp, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#0f172a", flex: 1, lineHeight: 1.2 }}>
                {exp.role}
              </span>
              <span style={{ fontSize: 8, color: bodyAccent, fontWeight: 600, flexShrink: 0, marginLeft: 8 }}>
                {exp.dates}
              </span>
            </div>
            <div style={{ fontSize: 9, color: bodyAccent, fontWeight: 600, marginBottom: 3 }}>{exp.company}</div>
            {exp.bullets.map((b, j) => (
              <div
                key={j}
                style={{ fontSize: 8, color: "#475569", lineHeight: 1.5, paddingLeft: 10, position: "relative" }}
              >
                <span style={{ position: "absolute", left: 2 }}>•</span>
                {b}
              </div>
            ))}
          </div>
        ))}
        <SectionLabel color={sectionLabelColor} borderColor={bodyAccent}>
          Education
        </SectionLabel>
        {p.education.map((e, i) => (
          <div key={i} style={{ fontSize: 9, color: "#334155", marginBottom: 3 }}>
            <span style={{ fontWeight: 700 }}>{e.degree}</span> — {e.school} · {e.year}
          </div>
        ))}
        <SectionLabel color={sectionLabelColor} borderColor={bodyAccent}>
          Skills
        </SectionLabel>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 2 }}>
          {p.skills.map((s, i) => (
            <span
              key={i}
              style={{
                fontSize: 8,
                background: isExecutive ? "#0f172a" : isMinimalist ? "#f3f4f6" : `${accent}15`,
                color: isExecutive ? "#c9a84c" : isMinimalist ? "#374151" : accent,
                padding: "2px 7px",
                borderRadius: 3,
                border: `1px solid ${isExecutive ? "#c9a84c40" : isMinimalist ? "#e5e7eb" : accent + "40"}`,
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

function TemplateCard({ template }: { template: TemplateInfo }) {
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.4);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        setScale(w / 600);
      }
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, boxShadow: "0 12px 40px -8px hsl(43 55% 54% / 0.3)" }}
      transition={{ duration: 0.25 }}
      className="group cursor-pointer rounded-xl border border-border bg-card overflow-hidden"
      onClick={() => navigate(`/cv-editor/${template.id}`)}
    >
      <div ref={containerRef} className="relative aspect-[3/4] bg-white overflow-hidden">
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 600,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            pointerEvents: "none",
          }}
        >
          <MiniCVPreview template={template} />
        </div>
        <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button size="sm" className="bg-gradient-brand border-0 font-semibold gold-shimmer">
            Use This Template
          </Button>
        </div>
      </div>
      <div className="p-3 space-y-2">
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
        <div>
          <h3 className="font-bold text-sm text-foreground">{template.name}</h3>
          <p className="text-xs text-muted-foreground">{template.description}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate = useNavigate();
  const filtered = activeCategory === "All" ? TEMPLATES : TEMPLATES.filter((t) => t.category === activeCategory);

  return (
    <PageLayout>
      <div className="relative z-10">
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
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {["36+ Templates", "ATS-Optimised", "PDF & DOCX", "Used by 10,000+ professionals"].map((badge) => (
              <span key={badge} className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-primary" /> {badge}
              </span>
            ))}
          </div>
        </section>
        <div className="sticky top-16 z-30 surface-glass border-b border-border/30 py-3">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeCategory === cat ? "bg-gradient-brand text-primary-foreground shadow-glow-sm" : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
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
