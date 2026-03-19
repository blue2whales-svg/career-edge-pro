import { useState } from "react";
import { Link } from "react-router-dom";

const CVClassic = ({ accent = "#1a1a2e" }: { accent: string }) => (
  <div
    style={{
      fontFamily: "Georgia, serif",
      fontSize: "6.5px",
      lineHeight: 1.4,
      color: "#111",
      padding: "14px 16px",
      background: "#fff",
      height: "100%",
    }}
  >
    <div
      style={{ textAlign: "center", borderBottom: `2px solid ${accent}`, paddingBottom: "8px", marginBottom: "8px" }}
    >
      <div
        style={{
          fontSize: "13px",
          fontWeight: 700,
          letterSpacing: "2px",
          textTransform: "uppercase" as const,
          color: accent,
        }}
      >
        JAMES MITCHELL
      </div>
      <div style={{ fontSize: "7px", color: "#555", marginTop: "2px" }}>Senior Marketing Manager</div>
      <div style={{ fontSize: "6px", color: "#777", marginTop: "3px" }}>
        james@email.com · +254 722 000 000 · Nairobi, Kenya
      </div>
    </div>
    <div style={{ marginBottom: "7px" }}>
      <div
        style={{
          fontSize: "7px",
          fontWeight: 700,
          textTransform: "uppercase" as const,
          letterSpacing: "1.5px",
          color: accent,
          borderBottom: `1px solid ${accent}`,
          marginBottom: "4px",
        }}
      >
        Profile
      </div>
      <div style={{ fontSize: "6px", color: "#444", lineHeight: 1.6 }}>
        Results-driven marketing professional with 8+ years of experience in brand strategy and digital marketing across
        East African markets.
      </div>
    </div>
    <div style={{ marginBottom: "7px" }}>
      <div
        style={{
          fontSize: "7px",
          fontWeight: 700,
          textTransform: "uppercase" as const,
          letterSpacing: "1.5px",
          color: accent,
          borderBottom: `1px solid ${accent}`,
          marginBottom: "4px",
        }}
      >
        Work Experience
      </div>
      <div style={{ marginBottom: "5px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "6.5px", fontWeight: 700 }}>Marketing Director</span>
          <span style={{ fontSize: "6px", color: "#777" }}>2021 – Present</span>
        </div>
        <div style={{ fontSize: "6px", color: accent, fontStyle: "italic" as const }}>Safaricom PLC, Nairobi</div>
        <div style={{ fontSize: "5.5px", color: "#555", marginTop: "2px" }}>
          • Increased brand engagement by 43%
          <br />• Led team of 12 professionals
        </div>
      </div>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "6.5px", fontWeight: 700 }}>Senior Brand Manager</span>
          <span style={{ fontSize: "6px", color: "#777" }}>2018 – 2021</span>
        </div>
        <div style={{ fontSize: "6px", color: accent, fontStyle: "italic" as const }}>Equity Bank Group</div>
      </div>
    </div>
    <div style={{ marginBottom: "7px" }}>
      <div
        style={{
          fontSize: "7px",
          fontWeight: 700,
          textTransform: "uppercase" as const,
          letterSpacing: "1.5px",
          color: accent,
          borderBottom: `1px solid ${accent}`,
          marginBottom: "4px",
        }}
      >
        Education
      </div>
      <div style={{ fontSize: "6.5px", fontWeight: 600 }}>MBA, Marketing</div>
      <div style={{ fontSize: "6px", color: "#555" }}>University of Nairobi · 2018</div>
    </div>
    <div>
      <div
        style={{
          fontSize: "7px",
          fontWeight: 700,
          textTransform: "uppercase" as const,
          letterSpacing: "1.5px",
          color: accent,
          borderBottom: `1px solid ${accent}`,
          marginBottom: "4px",
        }}
      >
        Skills
      </div>
      <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "3px" }}>
        {["Brand Strategy", "Digital Marketing", "SEO/SEM", "Leadership", "Analytics"].map((s) => (
          <span
            key={s}
            style={{
              background: `${accent}18`,
              border: `0.5px solid ${accent}40`,
              color: accent,
              fontSize: "5px",
              padding: "1px 5px",
              borderRadius: "10px",
            }}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  </div>
);

const CVSidebar = ({
  sidebarBg = "#1e293b",
  sidebarAccent = "#38bdf8",
}: {
  sidebarBg: string;
  sidebarAccent: string;
}) => (
  <div style={{ fontFamily: "Arial, sans-serif", display: "flex", height: "100%", background: "#fff" }}>
    <div
      style={{
        width: "35%",
        background: sidebarBg,
        padding: "14px 8px",
        display: "flex",
        flexDirection: "column" as const,
        gap: "8px",
      }}
    >
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          background: `${sidebarAccent}30`,
          border: `1.5px solid ${sidebarAccent}`,
          margin: "0 auto 4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ fontSize: "8px", color: sidebarAccent, fontWeight: 700 }}>JM</span>
      </div>
      <div style={{ textAlign: "center" as const }}>
        <div style={{ fontSize: "6.5px", fontWeight: 700, color: "#fff" }}>JAMES MITCHELL</div>
        <div style={{ fontSize: "5px", color: sidebarAccent, marginTop: "2px" }}>Marketing Director</div>
      </div>
      <div style={{ height: "0.5px", background: `${sidebarAccent}50` }} />
      <div style={{ fontSize: "5px", color: "#94a3b8", lineHeight: 1.8 }}>
        james@email.com
        <br />
        +254 722 000 000
        <br />
        Nairobi, Kenya
      </div>
      <div>
        <div
          style={{
            fontSize: "5px",
            fontWeight: 700,
            color: sidebarAccent,
            textTransform: "uppercase" as const,
            letterSpacing: "1px",
            marginBottom: "3px",
          }}
        >
          Skills
        </div>
        {["Brand Strategy", "Digital Marketing", "Analytics", "Leadership"].map((s) => (
          <div
            key={s}
            style={{
              fontSize: "5px",
              color: "#94a3b8",
              background: `${sidebarAccent}15`,
              padding: "1.5px 5px",
              borderRadius: "3px",
              marginBottom: "2px",
            }}
          >
            {s}
          </div>
        ))}
      </div>
    </div>
    <div style={{ flex: 1, padding: "12px 10px" }}>
      <div style={{ marginBottom: "7px" }}>
        <div
          style={{
            fontSize: "6px",
            fontWeight: 700,
            textTransform: "uppercase" as const,
            color: sidebarBg,
            borderBottom: `1px solid ${sidebarAccent}`,
            paddingBottom: "2px",
            marginBottom: "4px",
          }}
        >
          Summary
        </div>
        <div style={{ fontSize: "5.5px", color: "#444", lineHeight: 1.6 }}>
          Results-driven marketing professional with 8+ years of experience across East Africa.
        </div>
      </div>
      <div style={{ marginBottom: "7px" }}>
        <div
          style={{
            fontSize: "6px",
            fontWeight: 700,
            textTransform: "uppercase" as const,
            color: sidebarBg,
            borderBottom: `1px solid ${sidebarAccent}`,
            paddingBottom: "2px",
            marginBottom: "4px",
          }}
        >
          Experience
        </div>
        <div style={{ fontSize: "6px", fontWeight: 700 }}>Marketing Director</div>
        <div style={{ fontSize: "5.5px", color: sidebarAccent }}>Safaricom PLC · 2021–Now</div>
        <div style={{ fontSize: "5px", color: "#555", marginTop: "2px" }}>
          • Grew brand by 43%
          <br />• Led team of 12
        </div>
      </div>
      <div>
        <div
          style={{
            fontSize: "6px",
            fontWeight: 700,
            textTransform: "uppercase" as const,
            color: sidebarBg,
            borderBottom: `1px solid ${sidebarAccent}`,
            paddingBottom: "2px",
            marginBottom: "4px",
          }}
        >
          Education
        </div>
        <div style={{ fontSize: "6px", fontWeight: 600 }}>MBA, Marketing</div>
        <div style={{ fontSize: "5.5px", color: "#666" }}>University of Nairobi · 2018</div>
      </div>
    </div>
  </div>
);

const CVExecutive = ({ accent = "#c9a84c", headerBg = "#1a1a2e" }: { accent: string; headerBg: string }) => (
  <div style={{ fontFamily: "Georgia, serif", background: "#fff", height: "100%" }}>
    <div style={{ background: headerBg, padding: "14px 14px 10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "2px",
              textTransform: "uppercase" as const,
            }}
          >
            JAMES MITCHELL
          </div>
          <div
            style={{
              fontSize: "6px",
              color: accent,
              letterSpacing: "1.5px",
              textTransform: "uppercase" as const,
              marginTop: "3px",
              fontWeight: 600,
            }}
          >
            Chief Marketing Officer
          </div>
          <div style={{ fontSize: "5.5px", color: "#aab4cc", marginTop: "4px" }}>
            james@email.com · +254 722 000 000
          </div>
        </div>
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            border: `1.5px solid ${accent}`,
            background: `${accent}20`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: "7px", color: accent }}>JM</span>
        </div>
      </div>
      <div style={{ height: "1px", background: `linear-gradient(90deg, ${accent}, transparent)`, marginTop: "8px" }} />
    </div>
    <div style={{ padding: "10px 14px" }}>
      <div style={{ marginBottom: "7px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "3px" }}>
          <span
            style={{
              fontSize: "5.5px",
              fontWeight: 700,
              color: headerBg,
              textTransform: "uppercase" as const,
              letterSpacing: "1.5px",
            }}
          >
            Executive Summary
          </span>
          <div style={{ flex: 1, height: "1px", background: `linear-gradient(90deg, ${accent}, transparent)` }} />
        </div>
        <div style={{ fontSize: "5.5px", color: "#333", lineHeight: 1.7 }}>
          Visionary executive with 15+ years leading brand transformation. Proven track record driving revenue growth
          across Fortune 500 and East African markets.
        </div>
      </div>
      <div style={{ marginBottom: "7px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "3px" }}>
          <span
            style={{
              fontSize: "5.5px",
              fontWeight: 700,
              color: headerBg,
              textTransform: "uppercase" as const,
              letterSpacing: "1.5px",
            }}
          >
            Experience
          </span>
          <div style={{ flex: 1, height: "1px", background: `linear-gradient(90deg, ${accent}, transparent)` }} />
        </div>
        <div style={{ fontSize: "6px", fontWeight: 700, color: headerBg }}>Chief Marketing Officer</div>
        <div style={{ fontSize: "5.5px", color: accent, fontWeight: 600 }}>Safaricom PLC · 2020–Present</div>
        <div style={{ fontSize: "5px", color: "#444", marginTop: "2px" }}>
          • Delivered 156% revenue growth
          <br />• Built 45-person marketing division
        </div>
      </div>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "3px" }}>
          <span
            style={{
              fontSize: "5.5px",
              fontWeight: 700,
              color: headerBg,
              textTransform: "uppercase" as const,
              letterSpacing: "1.5px",
            }}
          >
            Education
          </span>
          <div style={{ flex: 1, height: "1px", background: `linear-gradient(90deg, ${accent}, transparent)` }} />
        </div>
        <div style={{ fontSize: "6px", fontWeight: 600 }}>MBA, Marketing</div>
        <div style={{ fontSize: "5.5px", color: "#666" }}>University of Nairobi · 2018</div>
      </div>
    </div>
  </div>
);

const CVATS = ({ accent = "#2563eb" }: { accent: string }) => (
  <div style={{ fontFamily: "Arial, sans-serif", background: "#fff", padding: "12px 14px", height: "100%" }}>
    <div style={{ borderBottom: `2px solid ${accent}`, paddingBottom: "7px", marginBottom: "7px" }}>
      <div style={{ fontSize: "12px", fontWeight: 700, color: "#111" }}>JAMES MITCHELL</div>
      <div style={{ fontSize: "6.5px", color: accent, fontWeight: 600, marginTop: "1px" }}>
        Senior Marketing Manager
      </div>
      <div style={{ fontSize: "5.5px", color: "#555", marginTop: "3px" }}>
        james@email.com | +254 722 000 000 | Nairobi
      </div>
    </div>
    <div style={{ marginBottom: "6px" }}>
      <div
        style={{
          fontSize: "6.5px",
          fontWeight: 700,
          color: "#111",
          textTransform: "uppercase" as const,
          marginBottom: "3px",
        }}
      >
        Professional Summary
      </div>
      <div style={{ fontSize: "5.5px", color: "#333", lineHeight: 1.7 }}>
        Marketing professional with 8+ years experience. Expertise in digital marketing, brand management, and team
        leadership. Proven track record of driving measurable results.
      </div>
    </div>
    <div style={{ marginBottom: "6px" }}>
      <div
        style={{
          fontSize: "6.5px",
          fontWeight: 700,
          color: "#111",
          textTransform: "uppercase" as const,
          marginBottom: "3px",
        }}
      >
        Work Experience
      </div>
      <div style={{ fontSize: "6px", fontWeight: 700 }}>Marketing Director | Safaricom PLC</div>
      <div style={{ fontSize: "5.5px", color: "#666" }}>Jan 2021 – Present</div>
      <div style={{ fontSize: "5.5px", color: "#444", marginTop: "2px" }}>
        • Increased brand engagement by 43%
        <br />• Led team of 12 marketing professionals
        <br />• Managed annual budget of KES 60M
      </div>
    </div>
    <div style={{ marginBottom: "6px" }}>
      <div
        style={{
          fontSize: "6.5px",
          fontWeight: 700,
          color: "#111",
          textTransform: "uppercase" as const,
          marginBottom: "3px",
        }}
      >
        Education
      </div>
      <div style={{ fontSize: "6px", fontWeight: 700 }}>MBA, Marketing | University of Nairobi</div>
      <div style={{ fontSize: "5.5px", color: "#555" }}>Graduated: 2018</div>
    </div>
    <div>
      <div
        style={{
          fontSize: "6.5px",
          fontWeight: 700,
          color: "#111",
          textTransform: "uppercase" as const,
          marginBottom: "3px",
        }}
      >
        Skills
      </div>
      <div style={{ fontSize: "5.5px", color: "#333" }}>
        Brand Strategy | Digital Marketing | SEO/SEM | Team Leadership | Data Analytics
      </div>
    </div>
  </div>
);

const CVCreative = ({
  accent = "#7c3aed",
  grad = "linear-gradient(135deg, #7c3aed, #db2777)",
}: {
  accent: string;
  grad: string;
}) => (
  <div style={{ fontFamily: "Arial, sans-serif", background: "#fff", height: "100%" }}>
    <div style={{ background: grad, padding: "14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: "11px", fontWeight: 800, color: "#fff", letterSpacing: "0.5px" }}>JAMES MITCHELL</div>
          <div style={{ fontSize: "6.5px", color: "rgba(255,255,255,0.85)", marginTop: "2px" }}>
            Senior Marketing Manager
          </div>
          <div style={{ fontSize: "5.5px", color: "rgba(255,255,255,0.65)", marginTop: "3px" }}>
            james@email.com · Nairobi
          </div>
        </div>
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            border: "1.5px solid rgba(255,255,255,0.5)",
            background: "rgba(255,255,255,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: "8px", color: "#fff", fontWeight: 700 }}>JM</span>
        </div>
      </div>
    </div>
    <div style={{ padding: "10px 12px" }}>
      <div style={{ marginBottom: "6px" }}>
        <div
          style={{
            fontSize: "6px",
            fontWeight: 700,
            color: accent,
            textTransform: "uppercase" as const,
            letterSpacing: "1.5px",
            marginBottom: "3px",
          }}
        >
          Profile
        </div>
        <div style={{ fontSize: "5.5px", color: "#444", lineHeight: 1.6 }}>
          Results-driven professional with 8+ years in brand strategy and digital marketing across East Africa.
        </div>
      </div>
      <div style={{ marginBottom: "6px" }}>
        <div
          style={{
            fontSize: "6px",
            fontWeight: 700,
            color: accent,
            textTransform: "uppercase" as const,
            letterSpacing: "1.5px",
            marginBottom: "3px",
          }}
        >
          Experience
        </div>
        <div style={{ fontSize: "6px", fontWeight: 700 }}>Marketing Director</div>
        <div style={{ fontSize: "5.5px", color: accent }}>Safaricom PLC · 2021–Present</div>
        <div style={{ fontSize: "5.5px", color: "#555", marginTop: "2px" }}>
          • Increased engagement by 43%
          <br />• Led team of 12 professionals
        </div>
      </div>
      <div style={{ marginBottom: "6px" }}>
        <div
          style={{
            fontSize: "6px",
            fontWeight: 700,
            color: accent,
            textTransform: "uppercase" as const,
            letterSpacing: "1.5px",
            marginBottom: "3px",
          }}
        >
          Skills
        </div>
        <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "3px" }}>
          {["Brand Strategy", "Digital Marketing", "SEO/SEM", "Analytics"].map((s) => (
            <span
              key={s}
              style={{
                background: `${accent}12`,
                border: `0.5px solid ${accent}40`,
                color: accent,
                fontSize: "5px",
                padding: "1.5px 6px",
                borderRadius: "10px",
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const CVMinimal = ({ accent = "#111" }: { accent: string }) => (
  <div style={{ fontFamily: "Helvetica, Arial, sans-serif", background: "#fff", padding: "14px 16px", height: "100%" }}>
    <div style={{ marginBottom: "10px" }}>
      <div style={{ fontSize: "13px", fontWeight: 800, color: "#111" }}>James Mitchell</div>
      <div style={{ fontSize: "7px", color: "#555", marginTop: "2px" }}>Senior Marketing Manager</div>
      <div style={{ fontSize: "5.5px", color: "#888", marginTop: "3px" }}>
        james@email.com · +254 722 000 000 · Nairobi
      </div>
      <div style={{ height: "0.5px", background: "#111", marginTop: "7px", opacity: 0.12 }} />
    </div>
    <div style={{ marginBottom: "7px" }}>
      <div
        style={{
          fontSize: "5.5px",
          fontWeight: 700,
          color: "#111",
          textTransform: "uppercase" as const,
          letterSpacing: "2px",
          marginBottom: "3px",
          opacity: 0.5,
        }}
      >
        Summary
      </div>
      <div style={{ fontSize: "5.5px", color: "#444", lineHeight: 1.7 }}>
        Results-driven professional with 8+ years in brand strategy and digital marketing.
      </div>
    </div>
    <div style={{ marginBottom: "7px" }}>
      <div
        style={{
          fontSize: "5.5px",
          fontWeight: 700,
          color: "#111",
          textTransform: "uppercase" as const,
          letterSpacing: "2px",
          marginBottom: "3px",
          opacity: 0.5,
        }}
      >
        Experience
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: "6.5px", fontWeight: 600 }}>Marketing Director</span>
        <span style={{ fontSize: "5.5px", color: "#999" }}>2021–Present</span>
      </div>
      <div style={{ fontSize: "5.5px", color: "#777" }}>Safaricom PLC</div>
      <div style={{ fontSize: "5.5px", color: "#555", marginTop: "2px" }}>
        • Grew brand engagement 43%
        <br />• Managed team of 12
      </div>
    </div>
    <div style={{ marginBottom: "7px" }}>
      <div
        style={{
          fontSize: "5.5px",
          fontWeight: 700,
          color: "#111",
          textTransform: "uppercase" as const,
          letterSpacing: "2px",
          marginBottom: "3px",
          opacity: 0.5,
        }}
      >
        Education
      </div>
      <div style={{ fontSize: "6.5px", fontWeight: 600 }}>MBA, Marketing — University of Nairobi</div>
    </div>
    <div>
      <div
        style={{
          fontSize: "5.5px",
          fontWeight: 700,
          color: "#111",
          textTransform: "uppercase" as const,
          letterSpacing: "2px",
          marginBottom: "3px",
          opacity: 0.5,
        }}
      >
        Skills
      </div>
      <div style={{ fontSize: "5.5px", color: "#555" }}>
        Brand Strategy · Digital Marketing · SEO/SEM · Analytics · Leadership
      </div>
    </div>
  </div>
);

type TemplateData = {
  id: number;
  name: string;
  description: string;
  category: string;
  colors: string[];
  renderCV: (color: string) => React.JSX.Element;
};

const TEMPLATES: TemplateData[] = [
  {
    id: 1,
    name: "Classic",
    description: "Timeless design for any industry",
    category: "Simple",
    colors: ["#1a1a2e", "#2563eb", "#16a34a", "#7c3aed", "#dc2626"],
    renderCV: (c) => <CVClassic accent={c} />,
  },
  {
    id: 2,
    name: "Traditional",
    description: "Conservative layout hiring managers love",
    category: "Simple",
    colors: ["#111", "#1e3a5f", "#14532d", "#4c1d95", "#7f1d1d"],
    renderCV: (c) => <CVClassic accent={c} />,
  },
  {
    id: 3,
    name: "Clean",
    description: "Minimalist with maximum readability",
    category: "Simple",
    colors: ["#2563eb", "#111", "#059669", "#9333ea", "#e11d48"],
    renderCV: (c) => <CVATS accent={c} />,
  },
  {
    id: 4,
    name: "Basic",
    description: "Simple and straightforward",
    category: "Simple",
    colors: ["#374151", "#1d4ed8", "#065f46", "#6d28d9", "#991b1b"],
    renderCV: (c) => <CVMinimal accent={c} />,
  },
  {
    id: 5,
    name: "Fresh",
    description: "Modern take on a classic format",
    category: "Simple",
    colors: ["#0891b2", "#111", "#15803d", "#7c3aed", "#be123c"],
    renderCV: (c) => <CVClassic accent={c} />,
  },
  {
    id: 6,
    name: "Elegant",
    description: "Refined style with graceful typography",
    category: "Simple",
    colors: ["#c9a84c", "#1a1a2e", "#166534", "#6b21a8", "#9f1239"],
    renderCV: (c) => <CVExecutive accent={c} headerBg="#1a1a2e" />,
  },
  {
    id: 7,
    name: "Prime ATS",
    description: "100% ATS-compatible clean layout",
    category: "ATS",
    colors: ["#2563eb", "#111", "#16a34a", "#7c3aed", "#dc2626"],
    renderCV: (c) => <CVATS accent={c} />,
  },
  {
    id: 8,
    name: "Pure ATS",
    description: "Maximum ATS score guaranteed",
    category: "ATS",
    colors: ["#111", "#1d4ed8", "#15803d", "#6d28d9", "#9f1239"],
    renderCV: (c) => <CVATS accent={c} />,
  },
  {
    id: 9,
    name: "Specialist",
    description: "Tailored for technical specialists",
    category: "ATS",
    colors: ["#0369a1", "#111", "#047857", "#7c3aed", "#b91c1c"],
    renderCV: (c) => <CVATS accent={c} />,
  },
  {
    id: 10,
    name: "ATS Pro",
    description: "Professional grade ATS optimisation",
    category: "ATS",
    colors: ["#1e40af", "#111", "#14532d", "#581c87", "#881337"],
    renderCV: (c) => <CVATS accent={c} />,
  },
  {
    id: 11,
    name: "ATS Clean",
    description: "Clean lines, ATS-friendly structure",
    category: "ATS",
    colors: ["#0284c7", "#374151", "#059669", "#9333ea", "#e11d48"],
    renderCV: (c) => <CVATS accent={c} />,
  },
  {
    id: 12,
    name: "ATS Bold",
    description: "Bold headings, fully ATS parseable",
    category: "ATS",
    colors: ["#1d4ed8", "#111827", "#065f46", "#7c2d12", "#701a75"],
    renderCV: (c) => <CVATS accent={c} />,
  },
  {
    id: 13,
    name: "Professional",
    description: "Two-column layout with sidebar",
    category: "Two-Column",
    colors: ["#1e293b", "#0f172a", "#14532d", "#3b0764", "#450a0a"],
    renderCV: (c) => <CVSidebar sidebarBg={c} sidebarAccent="#38bdf8" />,
  },
  {
    id: 14,
    name: "Corporate",
    description: "Corporate two-column design",
    category: "Two-Column",
    colors: ["#14532d", "#1e293b", "#1e3a5f", "#4c1d95", "#7f1d1d"],
    renderCV: (c) => <CVSidebar sidebarBg={c} sidebarAccent="#4ade80" />,
  },
  {
    id: 15,
    name: "Clean Split",
    description: "Clean two-column split layout",
    category: "Two-Column",
    colors: ["#0c4a6e", "#1e293b", "#14532d", "#3b0764", "#7f1d1d"],
    renderCV: (c) => <CVSidebar sidebarBg={c} sidebarAccent="#7dd3fc" />,
  },
  {
    id: 16,
    name: "Modern Split",
    description: "Contemporary split with accents",
    category: "Two-Column",
    colors: ["#312e81", "#1e293b", "#14532d", "#701a75", "#7f1d1d"],
    renderCV: (c) => <CVSidebar sidebarBg={c} sidebarAccent="#a5b4fc" />,
  },
  {
    id: 17,
    name: "Sidebar Dark",
    description: "Dark sidebar, light content area",
    category: "Two-Column",
    colors: ["#111827", "#1e293b", "#14532d", "#1c1917", "#450a0a"],
    renderCV: (c) => <CVSidebar sidebarBg={c} sidebarAccent="#f59e0b" />,
  },
  {
    id: 18,
    name: "Sidebar Light",
    description: "Light sidebar variant",
    category: "Two-Column",
    colors: ["#1e3a5f", "#1e293b", "#15803d", "#6b21a8", "#9f1239"],
    renderCV: (c) => <CVSidebar sidebarBg={c} sidebarAccent="#60a5fa" />,
  },
  {
    id: 19,
    name: "Professional Photo",
    description: "Photo CV for African markets",
    category: "Picture",
    colors: ["#1a1a2e", "#1e293b", "#14532d", "#3b0764", "#7f1d1d"],
    renderCV: (c) => <CVExecutive accent="#c9a84c" headerBg={c} />,
  },
  {
    id: 20,
    name: "Corporate Photo",
    description: "Corporate photo placement",
    category: "Picture",
    colors: ["#14532d", "#1e293b", "#1a1a2e", "#4c1d95", "#7f1d1d"],
    renderCV: (c) => <CVExecutive accent="#4ade80" headerBg={c} />,
  },
  {
    id: 21,
    name: "Creative Photo",
    description: "Creative layout with photo",
    category: "Picture",
    colors: ["#7c3aed", "#db2777", "#0891b2", "#059669", "#dc2626"],
    renderCV: (c) => <CVCreative accent={c} grad={`linear-gradient(135deg, ${c}, #db2777)`} />,
  },
  {
    id: 22,
    name: "Clean Photo",
    description: "Minimal design with photo",
    category: "Picture",
    colors: ["#2563eb", "#111", "#059669", "#7c3aed", "#dc2626"],
    renderCV: (c) => <CVExecutive accent={c} headerBg="#1a1a2e" />,
  },
  {
    id: 23,
    name: "Executive Classic",
    description: "Premium executive template",
    category: "Executive",
    colors: ["#c9a84c", "#4ade80", "#60a5fa", "#f0abfc", "#fca5a5"],
    renderCV: (c) => <CVExecutive accent={c} headerBg="#1a1a2e" />,
  },
  {
    id: 24,
    name: "Boardroom",
    description: "For C-suite and board level",
    category: "Executive",
    colors: ["#c9a84c", "#4ade80", "#60a5fa", "#f0abfc", "#fda4af"],
    renderCV: (c) => <CVExecutive accent={c} headerBg="#0f172a" />,
  },
  {
    id: 25,
    name: "C-Suite",
    description: "Top-tier executive presence",
    category: "Executive",
    colors: ["#c9a84c", "#34d399", "#38bdf8", "#a78bfa", "#fb7185"],
    renderCV: (c) => <CVExecutive accent={c} headerBg="#1e1b4b" />,
  },
  {
    id: 26,
    name: "Director",
    description: "Director-level positioning",
    category: "Executive",
    colors: ["#c9a84c", "#6ee7b7", "#7dd3fc", "#c4b5fd", "#fca5a5"],
    renderCV: (c) => <CVExecutive accent={c} headerBg="#14532d" />,
  },
  {
    id: 27,
    name: "Creative Purple",
    description: "Bold creative with gradient",
    category: "Creative",
    colors: ["#7c3aed", "#2563eb", "#db2777", "#059669", "#dc2626"],
    renderCV: (c) => <CVCreative accent={c} grad={`linear-gradient(135deg, ${c}, #db2777)`} />,
  },
  {
    id: 28,
    name: "Bold Designer",
    description: "Strong visual impact",
    category: "Creative",
    colors: ["#db2777", "#7c3aed", "#0891b2", "#059669", "#d97706"],
    renderCV: (c) => <CVCreative accent={c} grad={`linear-gradient(135deg, ${c}, #7c3aed)`} />,
  },
  {
    id: 29,
    name: "Gradient",
    description: "Eye-catching gradient header",
    category: "Creative",
    colors: ["#0891b2", "#7c3aed", "#059669", "#dc2626", "#d97706"],
    renderCV: (c) => <CVCreative accent={c} grad={`linear-gradient(135deg, ${c}, #06b6d4)`} />,
  },
  {
    id: 30,
    name: "Artistic",
    description: "Artistic flair for creative roles",
    category: "Creative",
    colors: ["#d97706", "#7c3aed", "#db2777", "#059669", "#dc2626"],
    renderCV: (c) => <CVCreative accent={c} grad={`linear-gradient(135deg, ${c}, #f59e0b)`} />,
  },
  {
    id: 31,
    name: "Portfolio",
    description: "Portfolio-style for designers",
    category: "Creative",
    colors: ["#059669", "#7c3aed", "#0891b2", "#db2777", "#d97706"],
    renderCV: (c) => <CVCreative accent={c} grad={`linear-gradient(135deg, ${c}, #10b981)`} />,
  },
  {
    id: 32,
    name: "Pure White",
    description: "Ultra clean white space design",
    category: "Minimalist",
    colors: ["#111", "#2563eb", "#059669", "#7c3aed", "#dc2626"],
    renderCV: (c) => <CVMinimal accent={c} />,
  },
  {
    id: 33,
    name: "Ultra Clean",
    description: "Nothing but pure typography",
    category: "Minimalist",
    colors: ["#374151", "#111", "#065f46", "#4c1d95", "#881337"],
    renderCV: (c) => <CVMinimal accent={c} />,
  },
  {
    id: 34,
    name: "Typography",
    description: "Typography-first design",
    category: "Minimalist",
    colors: ["#111827", "#1d4ed8", "#14532d", "#581c87", "#9f1239"],
    renderCV: (c) => <CVMinimal accent={c} />,
  },
  {
    id: 35,
    name: "Monochrome",
    description: "Black and white elegance",
    category: "Minimalist",
    colors: ["#000", "#222", "#444", "#666", "#888"],
    renderCV: (c) => <CVMinimal accent={c} />,
  },
  {
    id: 36,
    name: "Zen",
    description: "Maximum calm, minimal noise",
    category: "Minimalist",
    colors: ["#111", "#78716c", "#44403c", "#292524", "#1c1917"],
    renderCV: (c) => <CVMinimal accent={c} />,
  },
];

const CATEGORIES = ["All", "Simple", "ATS", "Two-Column", "Picture", "Executive", "Creative", "Minimalist"];

function TemplateCard({ template }: { template: TemplateData }) {
  const [activeColor, setActiveColor] = useState(0);
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column" as const }}>
      <div
        style={{
          position: "relative",
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid #e5e7eb",
          boxShadow: hovered ? "0 20px 40px rgba(0,0,0,0.12)" : "0 2px 8px rgba(0,0,0,0.06)",
          transition: "all 0.3s",
          aspectRatio: "3/4",
          background: "#fff",
          cursor: "pointer",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* CV Preview */}
        <div
          style={{
            width: "100%",
            height: "100%",
            overflow: "hidden",
            userSelect: "none" as const,
            pointerEvents: "none",
          }}
        >
          {template.renderCV(template.colors[activeColor])}
        </div>

        {/* Watermark */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            zIndex: 2,
          }}
        >
          <span
            style={{
              transform: "rotate(-35deg)",
              color: "rgba(0,0,0,0.05)",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "3px",
              whiteSpace: "nowrap" as const,
            }}
          >
            CVEDGE
          </span>
        </div>

        {/* Hover overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(2px)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.3s",
            zIndex: 3,
          }}
        >
          <Link
            to={`/cv-builder?template=${template.name.toLowerCase().replace(/ /g, "-")}&category=${template.category}`}
          >
            <button
              style={{
                padding: "10px 22px",
                borderRadius: "100px",
                fontWeight: 700,
                fontSize: "13px",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                background: "linear-gradient(135deg, #c9a84c, #e6c96a)",
                boxShadow: "0 4px 20px rgba(201,168,76,0.5)",
              }}
            >
              Use This Template
            </button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: "12px", padding: "0 2px" }}>
        <div style={{ display: "flex", gap: "5px", marginBottom: "6px" }}>
          {template.colors.map((c, i) => (
            <button
              key={i}
              onClick={() => setActiveColor(i)}
              style={{
                width: "13px",
                height: "13px",
                borderRadius: "50%",
                background: c,
                border: activeColor === i ? "2px solid #c9a84c" : "1.5px solid rgba(0,0,0,0.15)",
                outline: activeColor === i ? "2px solid #c9a84c" : "none",
                outlineOffset: "1px",
                cursor: "pointer",
                transition: "transform 0.15s",
              }}
            />
          ))}
          <div style={{ marginLeft: "auto", display: "flex", gap: "4px" }}>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 700,
                padding: "2px 6px",
                border: "1px solid #d1d5db",
                borderRadius: "4px",
                color: "#6b7280",
              }}
            >
              PDF
            </span>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 700,
                padding: "2px 6px",
                border: "1px solid #d1d5db",
                borderRadius: "4px",
                color: "#6b7280",
              }}
            >
              DOCX
            </span>
          </div>
        </div>
        <div style={{ fontWeight: 700, fontSize: "14px", color: "#111" }}>{template.name}</div>
        <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>{template.description}</div>
      </div>
    </div>
  );
}

const FAQS = [
  {
    q: "Are CVEdge templates ATS-compatible?",
    a: "Yes. All templates are tested against major ATS systems including Workday, Taleo, and Greenhouse. We use clean formatting, standard fonts, and proper heading hierarchy.",
  },
  {
    q: "Can I download my CV as PDF and Word?",
    a: "Absolutely. Every template is available in both PDF and DOCX format. PDF is ideal for direct applications; DOCX is great when employers request an editable copy.",
  },
  {
    q: "How many templates are available?",
    a: "We currently offer 36+ professionally designed templates across 8 categories: Simple, ATS, Two-Column, Picture, Executive, Creative, Minimalist, and more.",
  },
  {
    q: "Can I change the colour of any template?",
    a: "Yes! Every template comes with 5 colour variants. Switch between them with a single click before downloading.",
  },
  {
    q: "Which template is best for my industry?",
    a: "Corporate/finance: Executive or ATS. Tech: ATS or Minimalist. Creative industries: Creative or Two-Column. Entry-level: Simple or Clean.",
  },
  {
    q: "Are CVEdge templates free?",
    a: "You can build and preview your CV for free. Downloading the final PDF or DOCX requires a one-time payment from KES 500.",
  },
  {
    q: "Do templates work for international applications?",
    a: "Yes. Templates are optimised for Kenya, UAE, Qatar, UK, USA, and broader Africa. Each region has different norms — our templates account for that.",
  },
  {
    q: "Can I customise after choosing a template?",
    a: "Yes. Our CV Builder lets you customise fonts, colours, section order, and content. You're never locked into a fixed design.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #e5e7eb" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          textAlign: "left" as const,
          padding: "16px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        <span style={{ fontWeight: 600, color: "#111", fontSize: "15px" }}>{q}</span>
        <span style={{ fontSize: "20px", color: "#9ca3af", flexShrink: 0 }}>{open ? "−" : "+"}</span>
      </button>
      {open && (
        <p style={{ paddingBottom: "16px", fontSize: "14px", color: "#6b7280", lineHeight: 1.7, margin: 0 }}>{a}</p>
      )}
    </div>
  );
}

export default function SamplesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const filtered = activeCategory === "All" ? TEMPLATES : TEMPLATES.filter((t) => t.category === activeCategory);

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      {/* HERO */}
      <section
        style={{
          paddingTop: "60px",
          paddingBottom: "40px",
          textAlign: "center" as const,
          background: "linear-gradient(to bottom, #f9fafb, #fff)",
        }}
      >
        <h1 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 800, color: "#111", marginBottom: "12px" }}>
          CV <span style={{ color: "#c9a84c" }}>Templates</span>
        </h1>
        <p
          style={{ fontSize: "18px", color: "#6b7280", marginBottom: "28px", maxWidth: "500px", margin: "0 auto 28px" }}
        >
          Professionally designed templates that get you hired faster
        </p>
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            flexWrap: "wrap" as const,
            marginBottom: "28px",
          }}
        >
          <Link to="/cv-builder">
            <button
              style={{
                padding: "12px 28px",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "14px",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                background: "linear-gradient(135deg, #c9a84c, #e6c96a)",
                boxShadow: "0 4px 15px rgba(201,168,76,0.35)",
              }}
            >
              Build My CV
            </button>
          </Link>
          <Link to="/cv-builder">
            <button
              style={{
                padding: "12px 28px",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "14px",
                background: "none",
                border: "2px solid #111",
                color: "#111",
                cursor: "pointer",
              }}
            >
              Upload My CV
            </button>
          </Link>
        </div>
        <div
          style={{
            display: "flex",
            gap: "24px",
            justifyContent: "center",
            flexWrap: "wrap" as const,
            fontSize: "14px",
            color: "#6b7280",
          }}
        >
          {["36+ Templates", "ATS-Optimised", "PDF & DOCX", "Used by 10,000+ professionals"].map((s) => (
            <span key={s} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ color: "#c9a84c" }}>✓</span> {s}
            </span>
          ))}
        </div>
      </section>

      {/* STICKY FILTER */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          background: "#fff",
          borderBottom: "1px solid #f3f4f6",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 16px" }}>
          <div style={{ display: "flex", gap: "4px", overflowX: "auto" as const, padding: "12px 0" }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  flexShrink: 0,
                  padding: "6px 16px",
                  borderRadius: "100px",
                  fontSize: "13px",
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  background: activeCategory === cat ? "#1a1a2e" : "transparent",
                  color: activeCategory === cat ? "#fff" : "#6b7280",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* GRID */}
      <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "32px" }}>
          {filtered.map((t) => (
            <TemplateCard key={t.id} template={t} />
          ))}
        </div>
      </section>

      {/* CATEGORY DESCRIPTIONS */}
      <section style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 16px", borderTop: "1px solid #f3f4f6" }}>
        {[
          {
            title: "Simple & Basic CV Templates",
            cat: "Simple",
            desc: "Clean, straightforward templates that put your experience front and centre. Perfect for most industries and experience levels. Universally accepted and ATS-friendly.",
          },
          {
            title: "ATS CV Templates",
            cat: "ATS",
            desc: "Engineered for applicant tracking systems. Machine-readable formatting, standard fonts, and proper heading hierarchy to ensure your CV passes automated screening.",
          },
          {
            title: "Two-Column CV Templates",
            cat: "Two-Column",
            desc: "Make the most of your page with a two-column layout. Contact details, skills, and languages in the sidebar — experience and education in the main column.",
          },
          {
            title: "Executive CV Templates",
            cat: "Executive",
            desc: "Premium templates for senior professionals, directors, and C-suite executives. Sophisticated typography, gold accents, and authoritative layouts.",
          },
        ].map((s) => (
          <div key={s.title} style={{ marginBottom: "28px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#111", marginBottom: "8px" }}>{s.title}</h2>
            <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: 1.7, marginBottom: "8px" }}>{s.desc}</p>
            <button
              onClick={() => {
                setActiveCategory(s.cat);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#c9a84c",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              Show all {s.cat.toLowerCase()} templates →
            </button>
          </div>
        ))}
      </section>

      {/* WHY CVEDGE */}
      <section style={{ background: "#f9fafb", padding: "56px 16px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "#111",
              marginBottom: "32px",
              textAlign: "center" as const,
            }}
          >
            Why use CVEdge templates?
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "16px" }}>
            {[
              {
                icon: "✅",
                title: "ATS Optimised",
                desc: "Every template passes major ATS systems. No tables, no text boxes — clean, parseable formatting.",
              },
              {
                icon: "🤖",
                title: "AI-Powered Writing",
                desc: "Our AI rewrites your bullet points for impact with quantified achievements and action verbs.",
              },
              {
                icon: "🎨",
                title: "Fully Customisable",
                desc: "Change colours, fonts, section order, and layout. Every template bends to your needs.",
              },
              {
                icon: "🌍",
                title: "All Industries & Markets",
                desc: "Templates for Kenya, UAE, UK, USA, and broader Africa. We know local hiring norms.",
              },
              {
                icon: "📄",
                title: "PDF & DOCX Download",
                desc: "Pixel-perfect PDF or editable Word document. Both formats available.",
              },
              {
                icon: "🚀",
                title: "Free to Start",
                desc: "Build and preview your full CV for free. Only pay when you're ready to download.",
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  display: "flex",
                  gap: "12px",
                  padding: "16px",
                  background: "#fff",
                  borderRadius: "12px",
                  border: "1px solid #f3f4f6",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}
              >
                <span style={{ fontSize: "20px", flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, color: "#111", marginBottom: "4px" }}>{item.title}</div>
                  <div style={{ fontSize: "13px", color: "#6b7280" }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "56px 16px" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "#111",
              marginBottom: "32px",
              textAlign: "center" as const,
            }}
          >
            Frequently Asked Questions
          </h2>
          {FAQS.map((f) => (
            <FAQItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "64px 16px",
          textAlign: "center" as const,
          background: "linear-gradient(135deg, #1a1a2e, #2d2d4e)",
        }}
      >
        <h2 style={{ fontSize: "32px", fontWeight: 800, color: "#fff", marginBottom: "12px" }}>
          Build your CV in 15 minutes
        </h2>
        <p
          style={{ color: "#9ca3af", marginBottom: "28px", maxWidth: "400px", margin: "0 auto 28px", fontSize: "15px" }}
        >
          Choose a template, fill in your details, download a professional CV ready for any job application.
        </p>
        <Link to="/cv-builder">
          <button
            style={{
              padding: "16px 40px",
              borderRadius: "8px",
              fontWeight: 700,
              fontSize: "16px",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              background: "linear-gradient(135deg, #c9a84c, #e6c96a)",
              boxShadow: "0 8px 30px rgba(201,168,76,0.4)",
            }}
          >
            Start Building — It's Free
          </button>
        </Link>
      </section>
    </div>
  );
}
