import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PageLayout from "@/components/PageLayout";

// ── CV MINI DOCUMENT COMPONENTS ──────────────────────────────────────────────
// Each is a real HTML/CSS CV scaled down to fit the card

const CVClassic = ({ accent = "#1a1a2e" }: { accent?: string }) => (
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
        style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: accent }}
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
          textTransform: "uppercase",
          letterSpacing: "1.5px",
          color: accent,
          borderBottom: `1px solid ${accent}`,
          marginBottom: "4px",
        }}
      >
        Profile
      </div>
      <div style={{ fontSize: "6px", color: "#444", lineHeight: 1.6 }}>
        Results-driven marketing professional with 8+ years of experience in brand strategy, digital marketing, and team
        leadership across East African markets.
      </div>
    </div>
    <div style={{ marginBottom: "7px" }}>
      <div
        style={{
          fontSize: "7px",
          fontWeight: 700,
          textTransform: "uppercase",
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
        <div style={{ fontSize: "6px", color: accent, fontStyle: "italic" }}>Safaricom PLC, Nairobi</div>
        <div style={{ fontSize: "5.5px", color: "#555", marginTop: "2px" }}>
          • Increased brand engagement by 43% through digital campaigns
          <br />• Led a team of 12 marketing professionals
          <br />• Managed annual budget of KES 60M
        </div>
      </div>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "6.5px", fontWeight: 700 }}>Senior Brand Manager</span>
          <span style={{ fontSize: "6px", color: "#777" }}>2018 – 2021</span>
        </div>
        <div style={{ fontSize: "6px", color: accent, fontStyle: "italic" }}>Equity Bank Group</div>
        <div style={{ fontSize: "5.5px", color: "#555", marginTop: "2px" }}>
          • Grew 28% increase in customer acquisition
          <br />• Launched 5 successful product campaigns
        </div>
      </div>
    </div>
    <div style={{ marginBottom: "7px" }}>
      <div
        style={{
          fontSize: "7px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "1.5px",
          color: accent,
          borderBottom: `1px solid ${accent}`,
          marginBottom: "4px",
        }}
      >
        Education
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: "6.5px", fontWeight: 600 }}>MBA, Marketing</span>
        <span style={{ fontSize: "6px", color: "#777" }}>2016 – 2018</span>
      </div>
      <div style={{ fontSize: "6px", color: "#555" }}>University of Nairobi</div>
    </div>
    <div>
      <div
        style={{
          fontSize: "7px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "1.5px",
          color: accent,
          borderBottom: `1px solid ${accent}`,
          marginBottom: "4px",
        }}
      >
        Skills
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "3px" }}>
        {["Brand Strategy", "Digital Marketing", "SEO/SEM", "Team Leadership", "Analytics"].map((s) => (
          <span
            key={s}
            style={{
              background: `${accent}15`,
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
  accent = "#1e293b",
  sidebarBg = "#1e293b",
  sidebarAccent = "#38bdf8",
}: {
  accent?: string;
  sidebarBg?: string;
  sidebarAccent?: string;
}) => (
  <div style={{ fontFamily: "'Helvetica Neue', sans-serif", display: "flex", height: "100%", background: "#fff" }}>
    <div
      style={{
        width: "35%",
        background: sidebarBg,
        padding: "14px 10px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          background: `${sidebarAccent}30`,
          border: `1.5px solid ${sidebarAccent}`,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ fontSize: "8px", color: sidebarAccent, fontWeight: 700 }}>JM</span>
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "7px", fontWeight: 700, color: "#fff", letterSpacing: "0.5px" }}>JAMES MITCHELL</div>
        <div style={{ fontSize: "5.5px", color: sidebarAccent, marginTop: "2px" }}>Marketing Director</div>
      </div>
      <div style={{ height: "0.5px", background: `${sidebarAccent}50` }} />
      <div>
        <div
          style={{
            fontSize: "5.5px",
            fontWeight: 700,
            color: sidebarAccent,
            textTransform: "uppercase",
            letterSpacing: "1px",
            marginBottom: "4px",
          }}
        >
          Contact
        </div>
        <div style={{ fontSize: "5px", color: "#cbd5e1", lineHeight: 1.8 }}>
          james@email.com
          <br />
          +254 722 000 000
          <br />
          Nairobi, Kenya
        </div>
      </div>
      <div>
        <div
          style={{
            fontSize: "5.5px",
            fontWeight: 700,
            color: sidebarAccent,
            textTransform: "uppercase",
            letterSpacing: "1px",
            marginBottom: "4px",
          }}
        >
          Skills
        </div>
        {["Brand Strategy", "Digital Marketing", "Analytics", "Leadership", "SEO/SEM"].map((s) => (
          <div
            key={s}
            style={{
              fontSize: "5px",
              color: "#94a3b8",
              background: `${sidebarAccent}15`,
              padding: "2px 6px",
              borderRadius: "3px",
              marginBottom: "2px",
              border: `0.5px solid ${sidebarAccent}25`,
            }}
          >
            {s}
          </div>
        ))}
      </div>
      <div>
        <div
          style={{
            fontSize: "5.5px",
            fontWeight: 700,
            color: sidebarAccent,
            textTransform: "uppercase",
            letterSpacing: "1px",
            marginBottom: "4px",
          }}
        >
          Languages
        </div>
        <div style={{ fontSize: "5px", color: "#94a3b8" }}>
          English · Fluent
          <br />
          Swahili · Native
        </div>
      </div>
    </div>
    <div style={{ flex: 1, padding: "14px 12px" }}>
      <div style={{ marginBottom: "8px" }}>
        <div
          style={{
            fontSize: "6px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "1.2px",
            color: accent,
            borderBottom: `1px solid ${sidebarAccent}`,
            paddingBottom: "2px",
            marginBottom: "4px",
          }}
        >
          Summary
        </div>
        <div style={{ fontSize: "5.5px", color: "#444", lineHeight: 1.6 }}>
          Results-driven marketing professional with 8+ years of experience in brand strategy and digital marketing
          across East Africa.
        </div>
      </div>
      <div style={{ marginBottom: "8px" }}>
        <div
          style={{
            fontSize: "6px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "1.2px",
            color: accent,
            borderBottom: `1px solid ${sidebarAccent}`,
            paddingBottom: "2px",
            marginBottom: "4px",
          }}
        >
          Experience
        </div>
        <div style={{ marginBottom: "5px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "6px", fontWeight: 700, color: accent }}>Marketing Director</span>
            <span style={{ fontSize: "5.5px", color: "#999" }}>2021–Now</span>
          </div>
          <div style={{ fontSize: "5.5px", color: sidebarAccent }}>Safaricom PLC</div>
          <div style={{ fontSize: "5px", color: "#555", marginTop: "2px" }}>
            • Grew brand by 43%
            <br />• Led team of 12
          </div>
        </div>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "6px", fontWeight: 700, color: accent }}>Brand Manager</span>
            <span style={{ fontSize: "5.5px", color: "#999" }}>2018–21</span>
          </div>
          <div style={{ fontSize: "5.5px", color: sidebarAccent }}>Equity Bank</div>
          <div style={{ fontSize: "5px", color: "#555", marginTop: "2px" }}>• 28% customer growth</div>
        </div>
      </div>
      <div>
        <div
          style={{
            fontSize: "6px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "1.2px",
            color: accent,
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

const CVCreative = ({
  accent = "#7c3aed",
  grad = "linear-gradient(135deg, #7c3aed, #db2777)",
}: {
  accent?: string;
  grad?: string;
}) => (
  <div style={{ fontFamily: "'Helvetica Neue', sans-serif", background: "#fff", height: "100%" }}>
    <div style={{ background: grad, padding: "16px", position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: "12px", fontWeight: 800, color: "#fff", letterSpacing: "1px" }}>JAMES MITCHELL</div>
          <div style={{ fontSize: "7px", color: "rgba(255,255,255,0.85)", marginTop: "2px" }}>
            Senior Marketing Manager
          </div>
          <div style={{ fontSize: "5.5px", color: "rgba(255,255,255,0.65)", marginTop: "4px" }}>
            james@email.com · +254 722 000 000 · Nairobi
          </div>
        </div>
        <div
          style={{
            width: "36px",
            height: "36px",
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
    <div style={{ padding: "10px 14px" }}>
      <div style={{ marginBottom: "7px" }}>
        <div
          style={{
            fontSize: "6.5px",
            fontWeight: 700,
            color: accent,
            textTransform: "uppercase",
            letterSpacing: "1.5px",
            marginBottom: "3px",
          }}
        >
          Profile
        </div>
        <div style={{ fontSize: "5.5px", color: "#444", lineHeight: 1.6 }}>
          Results-driven marketing professional with 8+ years experience in brand strategy and digital marketing across
          East Africa.
        </div>
      </div>
      <div style={{ marginBottom: "7px" }}>
        <div
          style={{
            fontSize: "6.5px",
            fontWeight: 700,
            color: accent,
            textTransform: "uppercase",
            letterSpacing: "1.5px",
            marginBottom: "3px",
          }}
        >
          Experience
        </div>
        <div style={{ marginBottom: "5px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "6.5px", fontWeight: 700 }}>Marketing Director</span>
            <span style={{ fontSize: "5.5px", color: "#999" }}>2021 – Present</span>
          </div>
          <div style={{ fontSize: "6px", color: accent }}>Safaricom PLC, Nairobi</div>
          <div style={{ fontSize: "5.5px", color: "#555", marginTop: "2px" }}>
            • Increased engagement by 43%
            <br />• Led team of 12 professionals
          </div>
        </div>
      </div>
      <div style={{ marginBottom: "7px" }}>
        <div
          style={{
            fontSize: "6.5px",
            fontWeight: 700,
            color: accent,
            textTransform: "uppercase",
            letterSpacing: "1.5px",
            marginBottom: "3px",
          }}
        >
          Skills
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "3px" }}>
          {["Brand Strategy", "Digital Marketing", "SEO/SEM", "Analytics", "Leadership"].map((s) => (
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
      <div>
        <div
          style={{
            fontSize: "6.5px",
            fontWeight: 700,
            color: accent,
            textTransform: "uppercase",
            letterSpacing: "1.5px",
            marginBottom: "3px",
          }}
        >
          Education
        </div>
        <div style={{ fontSize: "6.5px", fontWeight: 600 }}>MBA, Marketing</div>
        <div style={{ fontSize: "5.5px", color: "#666" }}>University of Nairobi · 2018</div>
      </div>
    </div>
  </div>
);

const CVMinimal = ({ accent = "#111" }: { accent?: string }) => (
  <div
    style={{
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      background: "#fff",
      padding: "16px 18px",
      height: "100%",
    }}
  >
    <div style={{ marginBottom: "10px" }}>
      <div style={{ fontSize: "14px", fontWeight: 800, color: "#111", letterSpacing: "0.5px" }}>James Mitchell</div>
      <div style={{ fontSize: "7px", color: "#555", marginTop: "2px" }}>Senior Marketing Manager</div>
      <div style={{ fontSize: "5.5px", color: "#888", marginTop: "3px" }}>
        james@email.com · +254 722 000 000 · Nairobi, Kenya
      </div>
      <div style={{ height: "0.5px", background: "#111", marginTop: "8px", opacity: 0.15 }} />
    </div>
    <div style={{ marginBottom: "8px" }}>
      <div
        style={{
          fontSize: "6px",
          fontWeight: 700,
          color: "#111",
          textTransform: "uppercase",
          letterSpacing: "2px",
          marginBottom: "4px",
          opacity: 0.5,
        }}
      >
        Summary
      </div>
      <div style={{ fontSize: "5.5px", color: "#444", lineHeight: 1.7 }}>
        Results-driven professional with 8+ years in brand strategy and digital marketing.
      </div>
    </div>
    <div style={{ marginBottom: "8px" }}>
      <div
        style={{
          fontSize: "6px",
          fontWeight: 700,
          color: "#111",
          textTransform: "uppercase",
          letterSpacing: "2px",
          marginBottom: "4px",
          opacity: 0.5,
        }}
      >
        Experience
      </div>
      <div style={{ marginBottom: "5px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "6.5px", fontWeight: 600 }}>Marketing Director</span>
          <span style={{ fontSize: "5.5px", color: "#999" }}>2021 – Present</span>
        </div>
        <div style={{ fontSize: "5.5px", color: "#777" }}>Safaricom PLC</div>
        <div style={{ fontSize: "5.5px", color: "#555", marginTop: "2px" }}>
          • Grew brand engagement 43%
          <br />• Managed team of 12
        </div>
      </div>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "6.5px", fontWeight: 600 }}>Brand Manager</span>
          <span style={{ fontSize: "5.5px", color: "#999" }}>2018–2021</span>
        </div>
        <div style={{ fontSize: "5.5px", color: "#777" }}>Equity Bank Group</div>
      </div>
    </div>
    <div style={{ marginBottom: "8px" }}>
      <div
        style={{
          fontSize: "6px",
          fontWeight: 700,
          color: "#111",
          textTransform: "uppercase",
          letterSpacing: "2px",
          marginBottom: "4px",
          opacity: 0.5,
        }}
      >
        Education
      </div>
      <div style={{ fontSize: "6.5px", fontWeight: 600 }}>MBA, Marketing — University of Nairobi</div>
      <div style={{ fontSize: "5.5px", color: "#888" }}>2016 – 2018</div>
    </div>
    <div>
      <div
        style={{
          fontSize: "6px",
          fontWeight: 700,
          color: "#111",
          textTransform: "uppercase",
          letterSpacing: "2px",
          marginBottom: "4px",
          opacity: 0.5,
        }}
      >
        Skills
      </div>
      <div style={{ fontSize: "5.5px", color: "#555" }}>
        Brand Strategy · Digital Marketing · SEO/SEM · Analytics · Team Leadership
      </div>
    </div>
  </div>
);

const CVExecutive = ({ accent = "#c9a84c", headerBg = "#1a1a2e" }: { accent?: string; headerBg?: string }) => (
  <div style={{ fontFamily: "Georgia, serif", background: "#fff", height: "100%" }}>
    <div style={{ background: headerBg, padding: "16px 16px 12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div
            style={{
              fontSize: "12px",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            JAMES MITCHELL
          </div>
          <div
            style={{
              fontSize: "6.5px",
              color: accent,
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginTop: "3px",
              fontWeight: 600,
            }}
          >
            Chief Marketing Officer
          </div>
          <div style={{ fontSize: "5.5px", color: "#aab4cc", marginTop: "5px" }}>
            james@email.com · +254 722 000 000 · Nairobi
          </div>
        </div>
        <div
          style={{
            width: "36px",
            height: "36px",
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
      <div style={{ height: "1px", background: `linear-gradient(90deg, ${accent}, transparent)`, marginTop: "10px" }} />
    </div>
    <div style={{ padding: "10px 16px" }}>
      <div style={{ marginBottom: "7px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
          <span
            style={{
              fontSize: "6px",
              fontWeight: 700,
              color: headerBg,
              textTransform: "uppercase",
              letterSpacing: "1.5px",
            }}
          >
            Executive Summary
          </span>
          <div style={{ flex: 1, height: "1px", background: `linear-gradient(90deg, ${accent}, transparent)` }} />
        </div>
        <div style={{ fontSize: "5.5px", color: "#333", lineHeight: 1.7 }}>
          Visionary marketing executive with 15+ years leading brand transformation across Fortune 500 companies and
          East African markets. Proven track record of driving revenue growth.
        </div>
      </div>
      <div style={{ marginBottom: "7px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
          <span
            style={{
              fontSize: "6px",
              fontWeight: 700,
              color: headerBg,
              textTransform: "uppercase",
              letterSpacing: "1.5px",
            }}
          >
            Experience
          </span>
          <div style={{ flex: 1, height: "1px", background: `linear-gradient(90deg, ${accent}, transparent)` }} />
        </div>
        <div style={{ marginBottom: "5px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "6.5px", fontWeight: 700, color: headerBg }}>Chief Marketing Officer</span>
            <span style={{ fontSize: "5.5px", color: "#999" }}>2020 – Present</span>
          </div>
          <div style={{ fontSize: "6px", color: accent, fontWeight: 600 }}>Safaricom PLC</div>
          <div style={{ fontSize: "5.5px", color: "#444", marginTop: "2px" }}>
            • Delivered 156% revenue growth
            <br />• Built 45-person marketing division
          </div>
        </div>
      </div>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
          <span
            style={{
              fontSize: "6px",
              fontWeight: 700,
              color: headerBg,
              textTransform: "uppercase",
              letterSpacing: "1.5px",
            }}
          >
            Skills
          </span>
          <div style={{ flex: 1, height: "1px", background: `linear-gradient(90deg, ${accent}, transparent)` }} />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "3px" }}>
          {["P&L Management", "Brand Strategy", "Board Relations", "M&A"].map((s) => (
            <span
              key={s}
              style={{
                background: `${accent}15`,
                border: `0.5px solid ${accent}50`,
                color: headerBg,
                fontSize: "5px",
                padding: "1.5px 5px",
                borderRadius: "3px",
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

const CVATS = ({ accent = "#2563eb" }: { accent?: string }) => (
  <div style={{ fontFamily: "Arial, sans-serif", background: "#fff", padding: "14px 16px", height: "100%" }}>
    <div style={{ borderBottom: `2px solid ${accent}`, paddingBottom: "8px", marginBottom: "8px" }}>
      <div style={{ fontSize: "12px", fontWeight: 700, color: "#111" }}>JAMES MITCHELL</div>
      <div style={{ fontSize: "7px", color: accent, fontWeight: 600, marginTop: "1px" }}>Senior Marketing Manager</div>
      <div style={{ fontSize: "5.5px", color: "#555", marginTop: "3px" }}>
        james@email.com | +254 722 000 000 | Nairobi, Kenya | linkedin.com/in/james
      </div>
    </div>
    <div style={{ marginBottom: "7px" }}>
      <div style={{ fontSize: "7px", fontWeight: 700, color: "#111", textTransform: "uppercase", marginBottom: "3px" }}>
        Professional Summary
      </div>
      <div style={{ fontSize: "5.5px", color: "#333", lineHeight: 1.7 }}>
        Marketing professional with 8+ years experience. Expertise in digital marketing, brand management, and team
        leadership. Proven track record of driving measurable business results.
      </div>
    </div>
    <div style={{ marginBottom: "7px" }}>
      <div style={{ fontSize: "7px", fontWeight: 700, color: "#111", textTransform: "uppercase", marginBottom: "3px" }}>
        Work Experience
      </div>
      <div style={{ marginBottom: "4px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "6.5px", fontWeight: 700 }}>Marketing Director | Safaricom PLC</span>
          <span style={{ fontSize: "5.5px" }}>Jan 2021 – Present</span>
        </div>
        <div style={{ fontSize: "5.5px", color: "#444", marginTop: "2px" }}>
          • Increased brand engagement by 43% through digital campaigns
          <br />• Led cross-functional team of 12 marketing professionals
          <br />• Managed annual marketing budget of KES 60M
        </div>
      </div>
    </div>
    <div style={{ marginBottom: "7px" }}>
      <div style={{ fontSize: "7px", fontWeight: 700, color: "#111", textTransform: "uppercase", marginBottom: "3px" }}>
        Education
      </div>
      <div style={{ fontSize: "6.5px", fontWeight: 700 }}>MBA, Marketing | University of Nairobi</div>
      <div style={{ fontSize: "5.5px", color: "#555" }}>Graduated: 2018</div>
    </div>
    <div>
      <div style={{ fontSize: "7px", fontWeight: 700, color: "#111", textTransform: "uppercase", marginBottom: "3px" }}>
        Core Competencies
      </div>
      <div style={{ fontSize: "5.5px", color: "#333" }}>
        Brand Strategy | Digital Marketing | SEO/SEM | Team Leadership | Data Analytics | Campaign Management
      </div>
    </div>
  </div>
);

// ── TEMPLATE DATA ─────────────────────────────────────────────────────────────

type Template = {
  id: number;
  name: string;
  description: string;
  category: string;
  colors: string[];
  component: (color: string) => React.ReactNode;
};

const TEMPLATES: Template[] = [
  // Simple
  {
    id: 1,
    name: "Classic",
    description: "Timeless design for any industry",
    category: "Simple",
    colors: ["#1a1a2e", "#2563eb", "#16a34a", "#7c3aed", "#dc2626"],
    component: (c: string) => <CVClassic accent={c} />,
  },
  {
    id: 2,
    name: "Traditional",
    description: "Conservative layout hiring managers love",
    category: "Simple",
    colors: ["#111", "#1e3a5f", "#14532d", "#4c1d95", "#7f1d1d"],
    component: (c: string) => <CVClassic accent={c} />,
  },
  {
    id: 3,
    name: "Clean",
    description: "Minimalist approach with maximum readability",
    category: "Simple",
    colors: ["#2563eb", "#111", "#059669", "#9333ea", "#e11d48"],
    component: (c: string) => <CVATS accent={c} />,
  },
  {
    id: 4,
    name: "Basic",
    description: "Simple and straightforward",
    category: "Simple",
    colors: ["#374151", "#1d4ed8", "#065f46", "#6d28d9", "#991b1b"],
    component: (c: string) => <CVMinimal accent={c} />,
  },
  {
    id: 5,
    name: "Fresh",
    description: "Modern take on a classic format",
    category: "Simple",
    colors: ["#0891b2", "#111", "#15803d", "#7c3aed", "#be123c"],
    component: (c: string) => <CVClassic accent={c} />,
  },
  {
    id: 6,
    name: "Elegant",
    description: "Refined style with graceful typography",
    category: "Simple",
    colors: ["#c9a84c", "#1a1a2e", "#166534", "#6b21a8", "#9f1239"],
    component: (c: string) => <CVExecutive accent={c} headerBg="#1a1a2e" />,
  },
  // ATS
  {
    id: 7,
    name: "Prime ATS",
    description: "100% ATS-compatible, clean layout",
    category: "ATS",
    colors: ["#2563eb", "#111", "#16a34a", "#7c3aed", "#dc2626"],
    component: (c: string) => <CVATS accent={c} />,
  },
  {
    id: 8,
    name: "Pure ATS",
    description: "Maximum ATS score guaranteed",
    category: "ATS",
    colors: ["#111", "#1d4ed8", "#15803d", "#6d28d9", "#9f1239"],
    component: (c: string) => <CVATS accent={c} />,
  },
  {
    id: 9,
    name: "Specialist",
    description: "Tailored for technical specialists",
    category: "ATS",
    colors: ["#0369a1", "#111", "#047857", "#7c3aed", "#b91c1c"],
    component: (c: string) => <CVATS accent={c} />,
  },
  {
    id: 10,
    name: "ATS Pro",
    description: "Professional grade ATS optimisation",
    category: "ATS",
    colors: ["#1e40af", "#111", "#14532d", "#581c87", "#881337"],
    component: (c: string) => <CVATS accent={c} />,
  },
  {
    id: 11,
    name: "ATS Clean",
    description: "Clean lines, ATS-friendly structure",
    category: "ATS",
    colors: ["#0284c7", "#374151", "#059669", "#9333ea", "#e11d48"],
    component: (c: string) => <CVATS accent={c} />,
  },
  {
    id: 12,
    name: "ATS Bold",
    description: "Bold headings, fully ATS parseable",
    category: "ATS",
    colors: ["#1d4ed8", "#111827", "#065f46", "#7c2d12", "#701a75"],
    component: (c: string) => <CVATS accent={c} />,
  },
  // Two-Column
  {
    id: 13,
    name: "Professional",
    description: "Two-column layout with sidebar",
    category: "Two-Column",
    colors: ["#1e293b", "#0f172a", "#14532d", "#3b0764", "#450a0a"],
    component: (c: string) => <CVSidebar sidebarBg={c} sidebarAccent="#38bdf8" accent={c} />,
  },
  {
    id: 14,
    name: "Corporate",
    description: "Corporate two-column design",
    category: "Two-Column",
    colors: ["#14532d", "#1e293b", "#1e3a5f", "#4c1d95", "#7f1d1d"],
    component: (c: string) => <CVSidebar sidebarBg={c} sidebarAccent="#4ade80" accent={c} />,
  },
  {
    id: 15,
    name: "Clean Split",
    description: "Clean two-column split layout",
    category: "Two-Column",
    colors: ["#0c4a6e", "#1e293b", "#14532d", "#3b0764", "#7f1d1d"],
    component: (c: string) => <CVSidebar sidebarBg={c} sidebarAccent="#7dd3fc" accent={c} />,
  },
  {
    id: 16,
    name: "Modern Split",
    description: "Contemporary split with accents",
    category: "Two-Column",
    colors: ["#312e81", "#1e293b", "#14532d", "#701a75", "#7f1d1d"],
    component: (c: string) => <CVSidebar sidebarBg={c} sidebarAccent="#a5b4fc" accent={c} />,
  },
  {
    id: 17,
    name: "Sidebar Dark",
    description: "Dark sidebar, light content area",
    category: "Two-Column",
    colors: ["#111827", "#1e293b", "#14532d", "#1c1917", "#450a0a"],
    component: (c: string) => <CVSidebar sidebarBg={c} sidebarAccent="#f59e0b" accent={c} />,
  },
  {
    id: 18,
    name: "Sidebar Light",
    description: "Light sidebar variant",
    category: "Two-Column",
    colors: ["#1e3a5f", "#1e293b", "#15803d", "#6b21a8", "#9f1239"],
    component: (c: string) => <CVSidebar sidebarBg={c} sidebarAccent="#60a5fa" accent={c} />,
  },
  // Picture
  {
    id: 19,
    name: "Professional Photo",
    description: "Photo CV for African markets",
    category: "Picture",
    colors: ["#1a1a2e", "#1e293b", "#14532d", "#3b0764", "#7f1d1d"],
    component: (c: string) => <CVExecutive accent="#c9a84c" headerBg={c} />,
  },
  {
    id: 20,
    name: "Corporate Photo",
    description: "Corporate photo placement",
    category: "Picture",
    colors: ["#14532d", "#1e293b", "#1a1a2e", "#4c1d95", "#7f1d1d"],
    component: (c: string) => <CVExecutive accent="#4ade80" headerBg={c} />,
  },
  {
    id: 21,
    name: "Creative Photo",
    description: "Creative layout with photo",
    category: "Picture",
    colors: ["#7c3aed", "#db2777", "#0891b2", "#059669", "#dc2626"],
    component: (c: string) => <CVCreative accent={c} grad={`linear-gradient(135deg, ${c}, #db2777)`} />,
  },
  {
    id: 22,
    name: "Clean Photo",
    description: "Minimal design with photo",
    category: "Picture",
    colors: ["#2563eb", "#111", "#059669", "#7c3aed", "#dc2626"],
    component: (c: string) => <CVExecutive accent={c} headerBg="#1a1a2e" />,
  },
  // Executive
  {
    id: 23,
    name: "Executive Classic",
    description: "Premium executive template",
    category: "Executive",
    colors: ["#c9a84c", "#4ade80", "#60a5fa", "#f0abfc", "#fca5a5"],
    component: (c: string) => <CVExecutive accent={c} headerBg="#1a1a2e" />,
  },
  {
    id: 24,
    name: "Boardroom",
    description: "For C-suite and board level",
    category: "Executive",
    colors: ["#c9a84c", "#4ade80", "#60a5fa", "#f0abfc", "#fda4af"],
    component: (c: string) => <CVExecutive accent={c} headerBg="#0f172a" />,
  },
  {
    id: 25,
    name: "C-Suite",
    description: "Top-tier executive presence",
    category: "Executive",
    colors: ["#c9a84c", "#34d399", "#38bdf8", "#a78bfa", "#fb7185"],
    component: (c: string) => <CVExecutive accent={c} headerBg="#1e1b4b" />,
  },
  {
    id: 26,
    name: "Director",
    description: "Director-level positioning",
    category: "Executive",
    colors: ["#c9a84c", "#6ee7b7", "#7dd3fc", "#c4b5fd", "#fca5a5"],
    component: (c: string) => <CVExecutive accent={c} headerBg="#14532d" />,
  },
  // Creative
  {
    id: 27,
    name: "Creative Purple",
    description: "Bold creative with purple gradient",
    category: "Creative",
    colors: ["#7c3aed", "#2563eb", "#db2777", "#059669", "#dc2626"],
    component: (c: string) => <CVCreative accent={c} grad={`linear-gradient(135deg, ${c}, #db2777)`} />,
  },
  {
    id: 28,
    name: "Bold Designer",
    description: "Strong visual impact",
    category: "Creative",
    colors: ["#db2777", "#7c3aed", "#0891b2", "#059669", "#d97706"],
    component: (c: string) => <CVCreative accent={c} grad={`linear-gradient(135deg, ${c}, #7c3aed)`} />,
  },
  {
    id: 29,
    name: "Gradient",
    description: "Eye-catching gradient header",
    category: "Creative",
    colors: ["#0891b2", "#7c3aed", "#059669", "#dc2626", "#d97706"],
    component: (c: string) => <CVCreative accent={c} grad={`linear-gradient(135deg, ${c}, #06b6d4)`} />,
  },
  {
    id: 30,
    name: "Artistic",
    description: "Artistic flair for creative roles",
    category: "Creative",
    colors: ["#d97706", "#7c3aed", "#db2777", "#059669", "#dc2626"],
    component: (c: string) => <CVCreative accent={c} grad={`linear-gradient(135deg, ${c}, #f59e0b)`} />,
  },
  {
    id: 31,
    name: "Portfolio",
    description: "Portfolio-style for designers",
    category: "Creative",
    colors: ["#059669", "#7c3aed", "#0891b2", "#db2777", "#d97706"],
    component: (c: string) => <CVCreative accent={c} grad={`linear-gradient(135deg, ${c}, #10b981)`} />,
  },
  // Minimalist
  {
    id: 32,
    name: "Pure White",
    description: "Ultra clean white space design",
    category: "Minimalist",
    colors: ["#111", "#2563eb", "#059669", "#7c3aed", "#dc2626"],
    component: (c: string) => <CVMinimal accent={c} />,
  },
  {
    id: 33,
    name: "Ultra Clean",
    description: "Nothing but pure typography",
    category: "Minimalist",
    colors: ["#374151", "#111", "#065f46", "#4c1d95", "#881337"],
    component: (c: string) => <CVMinimal accent={c} />,
  },
  {
    id: 34,
    name: "Typography",
    description: "Typography-first design",
    category: "Minimalist",
    colors: ["#111827", "#1d4ed8", "#14532d", "#581c87", "#9f1239"],
    component: (c: string) => <CVMinimal accent={c} />,
  },
  {
    id: 35,
    name: "Monochrome",
    description: "Black and white elegance",
    category: "Minimalist",
    colors: ["#000", "#222", "#444", "#666", "#888"],
    component: (c: string) => <CVMinimal accent={c} />,
  },
  {
    id: 36,
    name: "Zen",
    description: "Maximum calm, minimal noise",
    category: "Minimalist",
    colors: ["#111", "#78716c", "#44403c", "#292524", "#1c1917"],
    component: (c: string) => <CVMinimal accent={c} />,
  },
];

const CATEGORIES = ["All", "Simple", "ATS", "Two-Column", "Picture", "Executive", "Creative", "Minimalist"];

const ACCENT_COLORS: Record<string, string> = {
  All: "#c9a84c",
  Simple: "#2563eb",
  ATS: "#16a34a",
  "Two-Column": "#1e293b",
  Picture: "#7c3aed",
  Executive: "#c9a84c",
  Creative: "#db2777",
  Minimalist: "#111",
};

// ── TEMPLATE CARD ─────────────────────────────────────────────────────────────

function TemplateCard({ template }: { template: Template }) {
  const [activeColor, setActiveColor] = useState(0);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Card */}
      <div
        className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 bg-white"
        style={{ aspectRatio: "3/4" }}
      >
        {/* Scaled CV Preview */}
        <div className="w-full h-full overflow-hidden" style={{ userSelect: "none", pointerEvents: "none" }}>
          <div style={{ transform: "scale(1)", transformOrigin: "top left", width: "100%", height: "100%" }}>
            {template.component(template.colors[activeColor])}
          </div>
        </div>

        {/* Hover overlay */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}
          style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)" }}
        >
          <Link to="/cv-builder">
            <button
              className="px-5 py-2.5 rounded-full font-semibold text-sm text-white transition-all duration-200 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #c9a84c, #e6c96a)",
                boxShadow: "0 4px 20px rgba(201,168,76,0.5)",
              }}
            >
              Use This Template
            </button>
          </Link>
        </div>

        {/* CVEdge watermark */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center" style={{ zIndex: 5 }}>
          <span
            style={{
              transform: "rotate(-35deg)",
              color: "rgba(0,0,0,0.06)",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "3px",
              whiteSpace: "nowrap",
            }}
          >
            CVEDGE
          </span>
        </div>
      </div>

      {/* Card footer */}
      <div className="mt-3 px-1 flex items-start justify-between gap-2">
        <div>
          <div style={{ display: "flex", gap: "5px", marginBottom: "6px" }}>
            {template.colors.map((c, i) => (
              <button
                key={i}
                onClick={() => setActiveColor(i)}
                className="rounded-full transition-all duration-200 hover:scale-125"
                style={{
                  width: "12px",
                  height: "12px",
                  background: c,
                  border: activeColor === i ? "2px solid #c9a84c" : "1.5px solid rgba(0,0,0,0.15)",
                  outline: activeColor === i ? "1.5px solid #c9a84c" : "none",
                  outlineOffset: "1px",
                }}
              />
            ))}
          </div>
          <div className="font-bold text-sm text-gray-900">{template.name}</div>
          <div className="text-xs text-gray-500 mt-0.5">{template.description}</div>
        </div>
        <div className="flex gap-1 mt-1 shrink-0">
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border border-gray-300 text-gray-600">PDF</span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border border-gray-300 text-gray-600">DOCX</span>
        </div>
      </div>
    </motion.div>
  );
}

// ── FAQ ───────────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: "Are CVEdge templates ATS-compatible?",
    a: "Yes. All our templates are tested against major ATS systems including Workday, Taleo, and Greenhouse. We use clean formatting, standard fonts, and proper heading hierarchy.",
  },
  {
    q: "Can I download my CV as a PDF and Word document?",
    a: "Absolutely. Every template is available in both PDF and DOCX format. PDF is ideal for direct applications; DOCX is great when employers request an editable copy.",
  },
  {
    q: "How many templates are available?",
    a: "We currently offer 36+ professionally designed templates across 8 categories: Simple, ATS, Two-Column, Picture, Executive, Creative, Minimalist, and Google Docs formats.",
  },
  {
    q: "Can I change the colour of any template?",
    a: "Yes! Every template comes with 5 colour variants. You can switch between them with a single click before downloading.",
  },
  {
    q: "Which template is best for my industry?",
    a: "For corporate/finance: Executive or ATS templates. For tech: ATS or Minimalist. For creative industries: Creative or Two-Column. For entry-level: Simple or Clean.",
  },
  {
    q: "Are CVEdge templates free?",
    a: "You can build and preview your CV for free. Downloading the final PDF or DOCX requires a one-time payment starting from KES 500.",
  },
  {
    q: "Do the templates work for international job applications?",
    a: "Yes. We have templates optimised for Kenya, UAE, Qatar, UK, USA, and other African markets. Each region has different norms — our templates account for that.",
  },
  {
    q: "Can I customise the template after choosing it?",
    a: "Yes. Our CV Builder lets you customise fonts, colours, section order, and content. You're not locked into a fixed design.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full text-left py-4 flex items-center justify-between gap-4 hover:text-yellow-700 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold text-gray-900 text-sm sm:text-base">{q}</span>
        <span className="text-xl text-gray-400 shrink-0">{open ? "−" : "+"}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="pb-4 text-sm text-gray-600 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── PAGE ──────────────────────────────────────────────────────────────────────

export default function SamplesPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All" ? TEMPLATES : TEMPLATES.filter((t) => t.category === activeCategory);

  return (
    <PageLayout>
      <div className="bg-white min-h-screen">
        {/* HERO */}
        <section className="pt-16 pb-10 px-4 text-center bg-gradient-to-b from-gray-50 to-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
              CV <span style={{ color: "#c9a84c" }}>Templates</span>
            </h1>
            <p className="text-lg text-gray-500 mb-8 max-w-xl mx-auto">
              Professionally designed templates that get you hired faster
            </p>
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              <Link to="/cv-builder">
                <button
                  className="px-7 py-3 rounded-lg font-semibold text-white text-sm shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  style={{ background: "linear-gradient(135deg, #c9a84c, #e6c96a)" }}
                >
                  Build My CV
                </button>
              </Link>
              <Link to="/cv-builder">
                <button className="px-7 py-3 rounded-lg font-semibold text-sm border-2 border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white transition-all">
                  Upload My CV
                </button>
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              {["36+ Templates", "ATS-Optimised", "PDF & DOCX", "Used by 10,000+ professionals"].map((s) => (
                <span key={s} className="flex items-center gap-1.5">
                  <span style={{ color: "#c9a84c" }}>✓</span> {s}
                </span>
              ))}
            </div>
          </motion.div>
        </section>

        {/* STICKY FILTER TABS */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? "text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                  style={activeCategory === cat ? { background: "#1a1a2e" } : {}}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* TEMPLATE GRID */}
        <section className="container max-w-7xl mx-auto px-4 py-10">
          <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            <AnimatePresence>
              {filtered.map((t) => (
                <TemplateCard key={t.id} template={t} />
              ))}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* CATEGORY SECTIONS */}
        <section className="container max-w-4xl mx-auto px-4 py-10 border-t border-gray-100">
          {[
            {
              title: "Simple & Basic CV Templates",
              desc: "Clean, straightforward templates that put your experience front and centre. Perfect for most industries and experience levels. These templates are universally accepted and ATS-friendly.",
            },
            {
              title: "ATS CV Templates",
              desc: "Engineered for applicant tracking systems. These templates use machine-readable formatting, standard fonts, and proper heading hierarchy to ensure your CV passes automated screening.",
            },
            {
              title: "Two-Column CV Templates",
              desc: "Make the most of your page space with a two-column layout. Contact details, skills, and languages in the sidebar — experience and education in the main column.",
            },
            {
              title: "Executive CV Templates",
              desc: "Premium templates for senior professionals, directors, and C-suite executives. Command attention with sophisticated typography, gold accents, and authoritative layouts.",
            },
          ].map((s) => (
            <div key={s.title} className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{s.title}</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-2">{s.desc}</p>
              <button
                onClick={() => setActiveCategory(s.title.split(" ")[0])}
                className="text-sm font-semibold hover:underline"
                style={{ color: "#c9a84c" }}
              >
                Show all {s.title.split(" ")[0].toLowerCase()} templates →
              </button>
            </div>
          ))}
        </section>

        {/* WHY CVEDGE */}
        <section className="bg-gray-50 py-14 px-4">
          <div className="container max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Why use CVEdge templates?</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  icon: "✅",
                  title: "ATS Optimised",
                  desc: "Every template passes major ATS systems. No tables, no text boxes — just clean, parseable formatting.",
                },
                {
                  icon: "🤖",
                  title: "AI-Powered Writing",
                  desc: "Our AI rewrites your bullet points for impact. Quantified achievements, action verbs, keyword optimisation.",
                },
                {
                  icon: "🎨",
                  title: "Fully Customisable",
                  desc: "Change colours, fonts, section order, and layout. Every template is flexible to your needs.",
                },
                {
                  icon: "🌍",
                  title: "All Industries & Markets",
                  desc: "Templates designed for Kenya, UAE, UK, USA, and broader Africa. We know what local hiring managers expect.",
                },
                {
                  icon: "📄",
                  title: "PDF & DOCX Download",
                  desc: "Download your CV as a pixel-perfect PDF or editable Word document. Both formats available.",
                },
                {
                  icon: "🚀",
                  title: "Free to Start",
                  desc: "Build and preview your full CV for free. Only pay when you're ready to download.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <span className="text-xl shrink-0">{item.icon}</span>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">{item.title}</div>
                    <div className="text-sm text-gray-500">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW TO CHOOSE */}
        <section className="container max-w-4xl mx-auto px-4 py-14">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How to choose the right template</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                title: "Simple",
                for: "Fresh graduates, career changers, most industries",
                tip: "When in doubt, pick Simple. Clean templates get the most callbacks because nothing distracts from your experience.",
              },
              {
                title: "Modern / Two-Column",
                for: "Mid-career professionals, tech, finance, consulting",
                tip: "Two-column templates signal organisation and attention to detail. Great for roles requiring strong analytical skills.",
              },
              {
                title: "Creative",
                for: "Designers, marketers, content creators, agency roles",
                tip: "Show personality — but keep it readable. A creative template is only effective if the content inside is strong.",
              },
              {
                title: "Executive",
                for: "Directors, C-suite, senior managers, board roles",
                tip: "Gold accents and authoritative typography communicate seniority. Use executive templates when applying for leadership positions.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-5 rounded-xl border border-gray-200 hover:border-yellow-400 transition-colors"
              >
                <div className="font-bold text-gray-900 mb-1">{item.title}</div>
                <div className="text-xs text-gray-500 mb-2 italic">Best for: {item.for}</div>
                <div className="text-sm text-gray-600">{item.tip}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-gray-50 py-14 px-4">
          <div className="container max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
            {FAQS.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-16 px-4 text-center" style={{ background: "linear-gradient(135deg, #1a1a2e, #2d2d4e)" }}>
          <h2 className="text-3xl font-bold text-white mb-3">Build your CV in 15 minutes</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Choose a template, fill in your details, and download a professional CV ready for any job application.
          </p>
          <Link to="/cv-builder">
            <button
              className="px-10 py-4 rounded-lg font-bold text-white text-base shadow-2xl hover:scale-105 transition-all"
              style={{
                background: "linear-gradient(135deg, #c9a84c, #e6c96a)",
                boxShadow: "0 8px 30px rgba(201,168,76,0.4)",
              }}
            >
              Start Building — It's Free
            </button>
          </Link>
        </section>
      </div>
    </PageLayout>
  );
}
