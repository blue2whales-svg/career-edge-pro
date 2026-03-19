export interface WorkExperience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  industry: string;
  startDate: string;
  endDate: string;
  isPresent: boolean;
  employmentType: string;
  responsibilities: string[];
  achievements: string;
}

export interface Education {
  id: string;
  institution: string;
  qualification: string;
  fieldOfStudy: string;
  graduationYear: string;
  grade: string;
}

export interface CVData {
  // Step 1: Personal Details
  fullName: string;
  professionalTitle: string;
  phone: string;
  email: string;
  linkedinUrl: string;
  location: string;
  nationality: string;
  dateOfBirth: string;
  showDOB: boolean;
  maritalStatus: string;
  showMaritalStatus: boolean;
  religion: string;
  showReligion: boolean;
  passportNumber: string;
  showPassport: boolean;
  openToRelocation: boolean;

  // Step 2: Summary
  professionalSummary: string;

  // Step 3: Work Experience
  workExperience: WorkExperience[];

  // Step 4: Education
  education: Education[];

  // Step 5: Skills
  hardSkills: string[];
  softSkills: string[];

  // Step 6: Languages
  languages: { name: string; proficiency: string }[];

  // Step 7: Additional
  certifications: { name: string; issuer: string; year: string }[];
  memberships: string[];
  volunteerExperience: string;
  hobbies: string;
  references: string;
  drivingLicense: string;
  customSectionTitle: string;
  customSectionContent: string;

  // Step 8: Settings
  cvFormat: string;
  targetMarket: string;
  experienceLevel: string;
}

export const PRICING_TIERS: Record<string, { label: string; price: number; desc: string }> = {
  "entry-level": { label: "Entry Level / Fresh Graduate", price: 1490, desc: "0–2 years experience" },
  "mid-level": { label: "Mid-Level Professional", price: 2490, desc: "3–7 years experience" },
  "senior": { label: "Senior Professional", price: 2490, desc: "8–15 years experience" },
  "executive": { label: "Executive / C-Suite", price: 5490, desc: "15+ years, leadership roles" },
};

export const initialCVData: CVData = {
  fullName: "",
  professionalTitle: "",
  phone: "+254",
  email: "",
  linkedinUrl: "",
  location: "",
  nationality: "Kenyan",
  dateOfBirth: "",
  showDOB: true,
  maritalStatus: "",
  showMaritalStatus: true,
  religion: "",
  showReligion: false,
  passportNumber: "",
  showPassport: false,
  openToRelocation: false,
  professionalSummary: "",
  workExperience: [],
  education: [],
  hardSkills: [],
  softSkills: [],
  languages: [{ name: "English", proficiency: "Fluent" }, { name: "Swahili", proficiency: "Native" }],
  certifications: [],
  memberships: [],
  volunteerExperience: "",
  hobbies: "",
  references: "Available upon request",
  drivingLicense: "",
  customSectionTitle: "",
  customSectionContent: "",
  cvFormat: "chronological",
  targetMarket: "kenya",
  experienceLevel: "",
};
