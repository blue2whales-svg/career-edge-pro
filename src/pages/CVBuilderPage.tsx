import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";

const templates = [
  { id: "executive", label: "Executive" },
  { id: "clean", label: "Clean" },
  { id: "sidebar", label: "Sidebar" },
  { id: "minimal", label: "Minimal" },
  { id: "creative", label: "Creative" },
  { id: "corporate", label: "Corporate" },
];

function ExecutiveThumb() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#fff",
        fontFamily: "Georgia, serif",
        fontSize: 6,
        overflow: "hidden",
      }}
    >
      <div style={{ background: "#1a2a3a", padding: "10px 12px 8px", textAlign: "center" }}>
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "#c9a84c",
            margin: "0 auto 4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 8,
            fontWeight: "bold",
          }}
        >
          JM
        </div>
        <div style={{ color: "#c9a84c", fontSize: 8, fontWeight: "bold", letterSpacing: 1 }}>JAMES MITCHELL</div>
        <div style={{ color: "#aab8c5", fontSize: 5.5, marginTop: 1 }}>Chief Marketing Officer</div>
        <div style={{ color: "#6b7f8d", fontSize: 4.5, marginTop: 2 }}>
          james@email.com · +254 712 345 678 · Nairobi
        </div>
      </div>
      <div style={{ padding: "6px 10px" }}>
        <div style={{ height: 1, background: "linear-gradient(90deg,#c9a84c,transparent)", marginBottom: 4 }} />
        <div
          style={{
            fontSize: 5,
            fontWeight: "bold",
            color: "#1a2a3a",
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 2,
          }}
        >
          Professional Summary
        </div>
        <div style={{ fontSize: 4.5, color: "#555", lineHeight: 1.6 }}>
          Results-driven executive with 12+ years leading brand strategy across East African markets. Proven track
          record growing revenue by 43% and managing teams of 30+.
        </div>
        <div style={{ height: 1, background: "linear-gradient(90deg,#c9a84c,transparent)", margin: "4px 0" }} />
        <div
          style={{
            fontSize: 5,
            fontWeight: "bold",
            color: "#1a2a3a",
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 2,
          }}
        >
          Experience
        </div>
        <div style={{ fontSize: 5, fontWeight: "bold", color: "#1a2a3a" }}>CMO — Safaricom PLC</div>
        <div style={{ fontSize: 4, color: "#c9a84c", marginBottom: 1 }}>2018 – Present · Nairobi, Kenya</div>
        <div style={{ fontSize: 4.5, color: "#555", lineHeight: 1.5 }}>
          · Grew brand revenue by KES 2.3B through integrated campaigns
        </div>
        <div style={{ fontSize: 4.5, color: "#555", lineHeight: 1.5 }}>
          · Led rebranding initiative reaching 14M+ customers nationally
        </div>
        <div style={{ fontSize: 4.5, color: "#555", lineHeight: 1.5 }}>
          · Managed annual marketing budget of KES 500M
        </div>
        <div style={{ height: 1, background: "linear-gradient(90deg,#c9a84c,transparent)", margin: "4px 0" }} />
        <div
          style={{
            fontSize: 5,
            fontWeight: "bold",
            color: "#1a2a3a",
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 2,
          }}
        >
          Education
        </div>
        <div style={{ fontSize: 4.5, color: "#333" }}>MBA, Marketing — University of Nairobi · 2012</div>
        <div style={{ fontSize: 4.5, color: "#333" }}>B.Com — Strathmore University · 2008</div>
        <div style={{ height: 1, background: "linear-gradient(90deg,#c9a84c,transparent)", margin: "4px 0" }} />
        <div
          style={{
            fontSize: 5,
            fontWeight: "bold",
            color: "#1a2a3a",
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 2,
          }}
        >
          Skills
        </div>
        <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
          {["Brand Strategy", "P&L Management", "Team Leadership", "Digital Marketing", "CRM"].map((s) => (
            <span
              key={s}
              style={{ fontSize: 4, background: "#1a2a3a", color: "#c9a84c", padding: "1px 4px", borderRadius: 2 }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function CleanThumb() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#fff",
        fontFamily: "Arial, sans-serif",
        fontSize: 6,
        overflow: "hidden",
      }}
    >
      <div style={{ borderBottom: "2px solid #2563eb", padding: "8px 12px 6px" }}>
        <div style={{ fontSize: 10, fontWeight: "bold", color: "#111" }}>SARAH ODHIAMBO</div>
        <div style={{ fontSize: 5.5, color: "#2563eb", marginTop: 1 }}>Financial Analyst · CPA-K</div>
        <div style={{ fontSize: 4.5, color: "#666", marginTop: 2 }}>
          sarah.odhiambo@email.com · 0722 000 111 · Nairobi, Kenya · linkedin.com/in/sarahodhiambo
        </div>
      </div>
      <div style={{ padding: "5px 12px" }}>
        <div
          style={{
            fontSize: 5.5,
            fontWeight: "bold",
            color: "#2563eb",
            textTransform: "uppercase",
            borderBottom: "1px solid #2563eb",
            paddingBottom: 1,
            marginBottom: 3,
          }}
        >
          Professional Summary
        </div>
        <div style={{ fontSize: 4.5, color: "#444", lineHeight: 1.6, marginBottom: 4 }}>
          CPA-certified Financial Analyst with 6 years driving financial planning and budget optimisation for leading
          Kenyan corporations. Reduced costs by 18% and improved forecasting accuracy by 30%.
        </div>
        <div
          style={{
            fontSize: 5.5,
            fontWeight: "bold",
            color: "#2563eb",
            textTransform: "uppercase",
            borderBottom: "1px solid #2563eb",
            paddingBottom: 1,
            marginBottom: 3,
          }}
        >
          Experience
        </div>
        <div style={{ fontSize: 5, fontWeight: "bold", color: "#111" }}>Senior Financial Analyst — KCB Group</div>
        <div style={{ fontSize: 4, color: "#888", marginBottom: 1 }}>Jan 2020 – Present</div>
        <div style={{ fontSize: 4.5, color: "#555", lineHeight: 1.5 }}>
          · Prepared monthly P&L reports for executive board review
        </div>
        <div style={{ fontSize: 4.5, color: "#555", lineHeight: 1.5 }}>
          · Reduced operational costs by KES 12M through process automation
        </div>
        <div style={{ fontSize: 4.5, color: "#555", lineHeight: 1.5 }}>
          · Built financial models for 3 major acquisition assessments
        </div>
        <div
          style={{
            fontSize: 5.5,
            fontWeight: "bold",
            color: "#2563eb",
            textTransform: "uppercase",
            borderBottom: "1px solid #2563eb",
            paddingBottom: 1,
            margin: "4px 0 3px",
          }}
        >
          Education
        </div>
        <div style={{ fontSize: 4.5, color: "#444" }}>
          B.Com (Finance) — University of Nairobi · First Class Honours · 2018
        </div>
        <div
          style={{
            fontSize: 5.5,
            fontWeight: "bold",
            color: "#2563eb",
            textTransform: "uppercase",
            borderBottom: "1px solid #2563eb",
            paddingBottom: 1,
            margin: "4px 0 3px",
          }}
        >
          Skills
        </div>
        <div style={{ fontSize: 4.5, color: "#444" }}>
          Financial Modelling · Excel & Power BI · IFRS Reporting · SAP · Budget Planning · Audit
        </div>
      </div>
    </div>
  );
}

function SidebarThumb() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#fff",
        fontFamily: "Arial, sans-serif",
        fontSize: 6,
        overflow: "hidden",
        display: "flex",
      }}
    >
      <div style={{ width: "38%", background: "#1e293b", padding: "10px 7px", flexShrink: 0 }}>
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: "#38bdf8",
            margin: "0 auto 4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 8,
            fontWeight: "bold",
          }}
        >
          DK
        </div>
        <div style={{ color: "#f1f5f9", fontSize: 5.5, fontWeight: "bold", textAlign: "center", marginBottom: 5 }}>
          David Kamau
        </div>
        <div
          style={{
            fontSize: 4,
            color: "#94a3b8",
            fontWeight: "bold",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            marginBottom: 2,
          }}
        >
          Contact
        </div>
        <div style={{ fontSize: 4, color: "#cbd5e1", lineHeight: 1.6 }}>david@email.com</div>
        <div style={{ fontSize: 4, color: "#cbd5e1", lineHeight: 1.6 }}>0733 456 789</div>
        <div style={{ fontSize: 4, color: "#cbd5e1", lineHeight: 1.6 }}>Nairobi, Kenya</div>
        <div style={{ height: 1, background: "#334155", margin: "5px 0" }} />
        <div
          style={{
            fontSize: 4,
            color: "#94a3b8",
            fontWeight: "bold",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            marginBottom: 2,
          }}
        >
          Skills
        </div>
        {["React / Next.js", "Node.js", "TypeScript", "PostgreSQL", "AWS", "Docker"].map((s) => (
          <div key={s} style={{ fontSize: 4, color: "#cbd5e1", lineHeight: 1.7 }}>
            · {s}
          </div>
        ))}
        <div style={{ height: 1, background: "#334155", margin: "5px 0" }} />
        <div
          style={{
            fontSize: 4,
            color: "#94a3b8",
            fontWeight: "bold",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            marginBottom: 2,
          }}
        >
          Education
        </div>
        <div style={{ fontSize: 4, color: "#e2e8f0", lineHeight: 1.5 }}>BSc Computer Science</div>
        <div style={{ fontSize: 3.5, color: "#94a3b8" }}>UoN · 2019</div>
      </div>
      <div style={{ flex: 1, padding: "10px 8px" }}>
        <div style={{ fontSize: 8, fontWeight: "bold", color: "#1e293b" }}>Software Engineer</div>
        <div style={{ fontSize: 4.5, color: "#38bdf8", marginBottom: 5 }}>
          Full-Stack Developer · 5 Years Experience
        </div>
        <div
          style={{
            fontSize: 4,
            fontWeight: "bold",
            color: "#1e293b",
            textTransform: "uppercase",
            borderBottom: "1px solid #e2e8f0",
            paddingBottom: 1,
            marginBottom: 3,
          }}
        >
          Summary
        </div>
        <div style={{ fontSize: 4, color: "#555", lineHeight: 1.6, marginBottom: 4 }}>
          Full-stack engineer building scalable SaaS products for East African fintech startups. Shipped 8 production
          apps with 100K+ users.
        </div>
        <div
          style={{
            fontSize: 4,
            fontWeight: "bold",
            color: "#1e293b",
            textTransform: "uppercase",
            borderBottom: "1px solid #e2e8f0",
            paddingBottom: 1,
            marginBottom: 3,
          }}
        >
          Experience
        </div>
        <div style={{ fontSize: 4.5, fontWeight: "bold", color: "#1e293b" }}>Lead Engineer — M-Kopa Solar</div>
        <div style={{ fontSize: 3.5, color: "#888", marginBottom: 1 }}>2021 – Present</div>
        <div style={{ fontSize: 4, color: "#555", lineHeight: 1.5 }}>· Built IoT dashboard serving 200K+ devices</div>
        <div style={{ fontSize: 4, color: "#555", lineHeight: 1.5 }}>
          · Reduced API latency by 65% via Redis caching
        </div>
        <div style={{ fontSize: 4, color: "#555", lineHeight: 1.5 }}>· Led team of 6 engineers across 3 countries</div>
        <div style={{ fontSize: 4.5, fontWeight: "bold", color: "#1e293b", marginTop: 3 }}>
          Software Engineer — Andela
        </div>
        <div style={{ fontSize: 3.5, color: "#888", marginBottom: 1 }}>2019 – 2021</div>
        <div style={{ fontSize: 4, color: "#555", lineHeight: 1.5 }}>
          · Delivered React components for US fintech client
        </div>
        <div style={{ fontSize: 4, color: "#555", lineHeight: 1.5 }}>
          · Maintained 99.9% uptime on payment microservices
        </div>
      </div>
    </div>
  );
}

function MinimalThumb() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#fafafa",
        fontFamily: "'Georgia', serif",
        fontSize: 6,
        overflow: "hidden",
        padding: "12px 14px",
      }}
    >
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 12, fontWeight: "bold", color: "#111", letterSpacing: -0.5 }}>Grace Wanjiru</div>
        <div style={{ fontSize: 5.5, color: "#888", marginTop: 1 }}>UX Designer & Product Strategist</div>
        <div style={{ fontSize: 4.5, color: "#aaa", marginTop: 2 }}>
          grace@email.com · 0700 123 456 · Nairobi · behance.net/gracewanjiru
        </div>
      </div>
      <div style={{ height: "0.5px", background: "#ddd", marginBottom: 6 }} />
      <div style={{ fontSize: 4.5, color: "#888", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 3 }}>
        About
      </div>
      <div style={{ fontSize: 4.5, color: "#444", lineHeight: 1.7, marginBottom: 6 }}>
        Product designer with 7 years crafting intuitive digital experiences for fintech and healthtech. Led design
        systems adopted by teams of 50+. Passionate about human-centred design in emerging markets.
      </div>
      <div style={{ fontSize: 4.5, color: "#888", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 3 }}>
        Experience
      </div>
      <div style={{ marginBottom: 4 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 5, fontWeight: "bold", color: "#222" }}>Lead Product Designer — Flutterwave</span>
          <span style={{ fontSize: 4, color: "#999" }}>2021–Present</span>
        </div>
        <div style={{ fontSize: 4.5, color: "#666", lineHeight: 1.6 }}>
          · Redesigned checkout flow — increased conversion by 34%
        </div>
        <div style={{ fontSize: 4.5, color: "#666", lineHeight: 1.6 }}>
          · Built and maintained design system across 4 product teams
        </div>
      </div>
      <div style={{ marginBottom: 4 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 5, fontWeight: "bold", color: "#222" }}>UX Designer — Jumia Kenya</span>
          <span style={{ fontSize: 4, color: "#999" }}>2018–2021</span>
        </div>
        <div style={{ fontSize: 4.5, color: "#666", lineHeight: 1.6 }}>· Improved mobile app NPS from 42 to 71</div>
        <div style={{ fontSize: 4.5, color: "#666", lineHeight: 1.6 }}>
          · Delivered 20+ A/B test designs for marketplace features
        </div>
      </div>
      <div style={{ height: "0.5px", background: "#ddd", marginBottom: 5 }} />
      <div style={{ fontSize: 4.5, color: "#888", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 3 }}>
        Skills
      </div>
      <div style={{ fontSize: 4.5, color: "#555" }}>
        Figma · Prototyping · User Research · Design Systems · Usability Testing · Webflow
      </div>
    </div>
  );
}

function CreativeThumb() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#fff",
        fontFamily: "Arial, sans-serif",
        fontSize: 6,
        overflow: "hidden",
      }}
    >
      <div style={{ background: "linear-gradient(135deg,#7c3aed,#db2777)", padding: "10px 12px 8px" }}>
        <div style={{ fontSize: 10, fontWeight: "bold", color: "#fff", letterSpacing: 0.5 }}>Brian Otieno</div>
        <div style={{ fontSize: 5.5, color: "#f0abfc", marginTop: 1 }}>Creative Director & Brand Consultant</div>
        <div style={{ fontSize: 4, color: "#e9d5ff", marginTop: 2 }}>
          brian@studio.co · 0711 987 654 · Nairobi · @brianotieno
        </div>
      </div>
      <div style={{ padding: "6px 12px" }}>
        <div
          style={{
            fontSize: 5,
            fontWeight: "bold",
            color: "#7c3aed",
            textTransform: "uppercase",
            letterSpacing: 1,
            borderLeft: "2px solid #7c3aed",
            paddingLeft: 4,
            marginBottom: 3,
          }}
        >
          Profile
        </div>
        <div style={{ fontSize: 4.5, color: "#444", lineHeight: 1.6, marginBottom: 5 }}>
          Award-winning creative director with 10 years shaping brand identities for Fortune 500 companies and African
          startups. Winner of 3 Loeries Awards. Specialises in visual storytelling that converts.
        </div>
        <div
          style={{
            fontSize: 5,
            fontWeight: "bold",
            color: "#db2777",
            textTransform: "uppercase",
            letterSpacing: 1,
            borderLeft: "2px solid #db2777",
            paddingLeft: 4,
            marginBottom: 3,
          }}
        >
          Experience
        </div>
        <div style={{ fontSize: 5, fontWeight: "bold", color: "#1a1a1a" }}>Creative Director — Ogilvy Africa</div>
        <div style={{ fontSize: 4, color: "#db2777", marginBottom: 1 }}>2019 – Present</div>
        <div style={{ fontSize: 4.5, color: "#555", lineHeight: 1.5 }}>
          · Led 12-person creative team across 6 African markets
        </div>
        <div style={{ fontSize: 4.5, color: "#555", lineHeight: 1.5 }}>· Won Loeries Gold for Equity Bank campaign</div>
        <div style={{ fontSize: 4.5, color: "#555", lineHeight: 1.5 }}>
          · Managed client relationships worth $2M annually
        </div>
        <div style={{ fontSize: 5, fontWeight: "bold", color: "#1a1a1a", marginTop: 3 }}>
          Senior Designer — McCann Nairobi
        </div>
        <div style={{ fontSize: 4, color: "#db2777", marginBottom: 1 }}>2016 – 2019</div>
        <div style={{ fontSize: 4.5, color: "#555", lineHeight: 1.5 }}>
          · Designed brand identity for 20+ regional clients
        </div>
        <div
          style={{
            fontSize: 5,
            fontWeight: "bold",
            color: "#7c3aed",
            textTransform: "uppercase",
            letterSpacing: 1,
            borderLeft: "2px solid #7c3aed",
            paddingLeft: 4,
            margin: "4px 0 3px",
          }}
        >
          Skills
        </div>
        <div style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          {["Adobe CC", "Brand Identity", "Art Direction", "Typography", "Motion Design"].map((s) => (
            <span
              key={s}
              style={{
                fontSize: 4,
                background: "#f5f3ff",
                color: "#7c3aed",
                padding: "1px 4px",
                borderRadius: 2,
                border: "0.5px solid #ddd8fe",
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

function CorporateThumb() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#fff",
        fontFamily: "Arial, sans-serif",
        fontSize: 6,
        overflow: "hidden",
      }}
    >
      <div style={{ background: "#14532d", padding: "10px 12px 8px" }}>
        <div style={{ fontSize: 10, fontWeight: "bold", color: "#fff" }}>LINDA MWANGI</div>
        <div style={{ fontSize: 5.5, color: "#86efac", marginTop: 1 }}>
          Head of Operations | Supply Chain & Logistics
        </div>
        <div style={{ fontSize: 4, color: "#bbf7d0", marginTop: 2 }}>
          linda.mwangi@email.com · +254 720 111 222 · Nairobi, Kenya
        </div>
      </div>
      <div style={{ height: 2, background: "linear-gradient(90deg,#c9a84c,#eab308,#c9a84c)" }} />
      <div style={{ padding: "6px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
          <div style={{ width: 40, height: "0.5px", background: "#14532d" }} />
          <div
            style={{ fontSize: 5, fontWeight: "bold", color: "#14532d", textTransform: "uppercase", letterSpacing: 1 }}
          >
            Executive Summary
          </div>
          <div style={{ flex: 1, height: "0.5px", background: "#14532d" }} />
        </div>
        <div style={{ fontSize: 4.5, color: "#444", lineHeight: 1.6, marginBottom: 4 }}>
          Operations leader with 15 years optimising supply chains for East Africa's largest FMCG companies. Delivered
          KES 80M in annual savings through procurement transformation and vendor consolidation.
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
          <div style={{ width: 40, height: "0.5px", background: "#14532d" }} />
          <div
            style={{ fontSize: 5, fontWeight: "bold", color: "#14532d", textTransform: "uppercase", letterSpacing: 1 }}
          >
            Career History
          </div>
          <div style={{ flex: 1, height: "0.5px", background: "#14532d" }} />
        </div>
        <div style={{ fontSize: 5, fontWeight: "bold", color: "#14532d" }}>Head of Operations — Bidco Africa</div>
        <div style={{ fontSize: 4, color: "#888", marginBottom: 1 }}>2017 – Present · Nairobi</div>
        <div style={{ fontSize: 4.5, color: "#555", lineHeight: 1.5 }}>
          · Oversaw 14-country distribution network across East & Central Africa
        </div>
        <div style={{ fontSize: 4.5, color: "#555", lineHeight: 1.5 }}>
          · Reduced logistics costs by 22% through fleet optimisation
        </div>
        <div style={{ fontSize: 4.5, color: "#555", lineHeight: 1.5 }}>
          · Managed annual procurement budget of KES 2.4B
        </div>
        <div style={{ fontSize: 5, fontWeight: "bold", color: "#14532d", marginTop: 3 }}>
          Logistics Manager — Unilever Kenya
        </div>
        <div style={{ fontSize: 4, color: "#888", marginBottom: 1 }}>2011 – 2017</div>
        <div style={{ fontSize: 4.5, color: "#555", lineHeight: 1.5 }}>
          · Led cross-functional team of 40 across warehousing & distribution
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, margin: "4px 0 2px" }}>
          <div style={{ width: 40, height: "0.5px", background: "#14532d" }} />
          <div
            style={{ fontSize: 5, fontWeight: "bold", color: "#14532d", textTransform: "uppercase", letterSpacing: 1 }}
          >
            Core Competencies
          </div>
          <div style={{ flex: 1, height: "0.5px", background: "#14532d" }} />
        </div>
        <div style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          {["Supply Chain", "Procurement", "P&L", "Vendor Management", "ERP Systems", "Team Leadership"].map((s) => (
            <span
              key={s}
              style={{
                fontSize: 4,
                background: "#f0fdf4",
                color: "#14532d",
                padding: "1px 4px",
                borderRadius: 2,
                border: "0.5px solid #86efac",
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

const THUMB_MAP: Record<string, JSX.Element> = {
  executive: <ExecutiveThumb />,
  clean: <CleanThumb />,
  sidebar: <SidebarThumb />,
  minimal: <MinimalThumb />,
  creative: <CreativeThumb />,
  corporate: <CorporateThumb />,
};

export default function CVBuilderPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <PageLayout>
      <section className="relative z-10 pt-12 pb-24 px-4">
        <div className="container max-w-5xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-center mb-3">
            Choose your <span className="text-gradient">template</span>
          </h1>
          <p className="text-center text-muted-foreground text-sm mb-10">
            Pick a design — then fill in your details and download your CV instantly.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelected(t.id)}
                className={`rounded-2xl border overflow-hidden text-left transition-all duration-200 group ${
                  selected === t.id
                    ? "border-primary shadow-glow ring-2 ring-primary/30"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <div style={{ height: 260, overflow: "hidden", position: "relative", background: "#f8f8f8" }}>
                  {THUMB_MAP[t.id]}
                </div>
                <div
                  className={`px-4 py-3 flex items-center justify-between ${selected === t.id ? "bg-primary/10" : "bg-card"}`}
                >
                  <span className="font-semibold text-sm">{t.label}</span>
                  {selected === t.id && <span className="text-xs text-primary font-mono">Selected ✓</span>}
                </div>
              </button>
            ))}
          </div>
          {selected && (
            <div className="mt-10 text-center">
              <Button
                onClick={() => navigate(`/cv-builder/${selected}`)}
                className="bg-gradient-brand border-0 font-semibold px-10 h-12 shadow-glow gold-shimmer"
              >
                Use {templates.find((t) => t.id === selected)?.label} Template →
              </Button>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
