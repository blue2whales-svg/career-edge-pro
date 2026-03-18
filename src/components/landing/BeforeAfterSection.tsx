import React from "react";

const missingItems = [
  "No professional summary",
  "No quantified achievements",
  "No LinkedIn / profile link",
  "No certifications listed",
  "Weak, generic skill set",
  "No visual hierarchy",
];

const addedItems = [
  "Powerful professional summary",
  "Quantified achievements with real numbers",
  "LinkedIn & full contact details",
  "Industry-relevant certifications",
  "ATS-optimised keyword skills",
  "Clean two-column visual layout",
];

export default function BeforeAfterSection() {
  return (
    <section style={{ background: "#0d0d0d", padding: "72px 24px", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500&family=EB+Garamond:wght@400;500&display=swap');
        .cvbefore-doc { background: #f8f7f4; padding: 24px 22px; font-family: 'Times New Roman', serif; border-radius: 10px; overflow: hidden; }
        .cvafter-doc { background: #fff; display: grid; grid-template-columns: 110px 1fr; border-radius: 10px; overflow: hidden; }
        .cvafter-sidebar { background: #1a2a3a; padding: 20px 12px; }
        .cvafter-main { padding: 20px 20px; }
        .cv-m-bullet { font-size: 8.5px; color: #555; margin: 0 0 3px; padding-left: 12px; position: relative; line-height: 1.5; }
        .cv-m-bullet::before { content: '▸'; position: absolute; left: 0; color: #c9a84c; font-size: 8px; }
        .cv-b-bullet { font-size: 8.5px; color: #888; margin: 0 0 2px; padding-left: 10px; line-height: 1.5; }
        .cv-missing-item { display: flex; align-items: center; gap: 6px; font-size: 8.5px; color: #c0392b; margin-bottom: 3px; font-family: 'DM Sans', sans-serif; }
        .cv-missing-item::before { content: '✕'; font-size: 9px; flex-shrink: 0; }
        .cv-added-item { display: flex; align-items: center; gap: 6px; font-size: 8.5px; color: #1a7a40; margin-bottom: 3px; font-family: 'DM Sans', sans-serif; }
        .cv-added-item::before { content: '✓'; font-size: 9px; font-weight: 700; flex-shrink: 0; }
        @media (max-width: 640px) {
          .cvafter-doc { grid-template-columns: 90px 1fr !important; }
          .cv-stage { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Headline */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(24px, 3.5vw, 42px)",
            color: "#f0ead8",
            fontWeight: 400,
            margin: "0 0 10px",
          }}
        >
          See the difference a <em style={{ color: "#c9a84c" }}>professional CV</em> makes
        </h2>
        <p style={{ color: "#666", fontSize: 14, fontWeight: 300, margin: 0, letterSpacing: "0.03em" }}>
          Our experts transform ordinary CVs into interview-winning documents
        </p>
      </div>

      {/* Cards Grid */}
      <div
        className="cv-stage"
        style={{ display: "grid", gridTemplateColumns: "1fr 1.55fr", gap: 28, maxWidth: 980, margin: "0 auto" }}
      >
        {/* ── BEFORE ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              fontSize: 11,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontWeight: 500,
              padding: "5px 14px",
              borderRadius: 20,
              width: "fit-content",
              background: "#1e1e1e",
              color: "#888",
              border: "1px solid #2a2a2a",
            }}
          >
            <span
              style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor", display: "inline-block" }}
            />
            Before CVEdge
          </span>
          <div
            style={{
              position: "relative",
              borderRadius: 10,
              boxShadow: "0 20px 60px rgba(200,50,50,0.18), 0 8px 24px rgba(0,0,0,0.7)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -14,
                right: -14,
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "#c0392b",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 15,
                fontWeight: 700,
                zIndex: 10,
                border: "2.5px solid #0d0d0d",
              }}
            >
              ✕
            </div>
            <div className="cvbefore-doc">
              <p style={{ fontSize: 15, fontWeight: "bold", color: "#222", textAlign: "center", margin: "0 0 2px" }}>
                John Kamau
              </p>
              <p style={{ textAlign: "center", fontSize: 9, color: "#888", margin: "0 0 12px" }}>
                johnkamau@gmail.com | 0712 345 678 | Nairobi
              </p>
              <hr style={{ border: "none", borderTop: "1.5px solid #ccc", margin: "0 0 9px" }} />
              <p
                style={{
                  fontSize: 9.5,
                  fontWeight: "bold",
                  color: "#222",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  margin: "0 0 4px",
                }}
              >
                Objective
              </p>
              <p style={{ fontSize: 8.5, color: "#777", lineHeight: 1.6, margin: "0 0 9px" }}>
                I am looking for a job where I can use my skills and grow in a company that values hard work and
                dedication.
              </p>
              <hr style={{ border: "none", borderTop: "1.5px solid #ccc", margin: "0 0 9px" }} />
              <p
                style={{
                  fontSize: 9.5,
                  fontWeight: "bold",
                  color: "#222",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  margin: "0 0 4px",
                }}
              >
                Work Experience
              </p>
              <p style={{ fontSize: 9, fontWeight: "bold", color: "#555", margin: "0 0 2px" }}>
                Sales Executive – ABC Company (2020–2023)
              </p>
              {[
                "Did sales and marketing",
                "Helped grow the business",
                "Worked with the team on tasks",
                "Was responsible for customer service",
              ].map((b) => (
                <p key={b} className="cv-b-bullet">
                  • {b}
                </p>
              ))}
              <hr style={{ border: "none", borderTop: "1.5px solid #ccc", margin: "9px 0" }} />
              <p
                style={{
                  fontSize: 9.5,
                  fontWeight: "bold",
                  color: "#222",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  margin: "0 0 4px",
                }}
              >
                Education
              </p>
              <p style={{ fontSize: 8.5, color: "#777", margin: "0 0 9px" }}>
                Bachelor of Commerce – University of Nairobi (2019)
              </p>
              <hr style={{ border: "none", borderTop: "1.5px solid #ccc", margin: "0 0 9px" }} />
              <p
                style={{
                  fontSize: 9.5,
                  fontWeight: "bold",
                  color: "#222",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  margin: "0 0 6px",
                }}
              >
                Skills
              </p>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 12 }}>
                {["Communication", "Teamwork", "Microsoft Office"].map((s) => (
                  <span
                    key={s}
                    style={{ fontSize: 8, color: "#999", background: "#eee", padding: "2px 6px", borderRadius: 2 }}
                  >
                    {s}
                  </span>
                ))}
              </div>
              {/* Missing list */}
              <div
                style={{ padding: "10px 12px", background: "#fff0f0", borderRadius: 6, border: "1px solid #f5c0c0" }}
              >
                <p
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    color: "#c0392b",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    margin: "0 0 6px",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Missing elements
                </p>
                {missingItems.map((item) => (
                  <div key={item} className="cv-missing-item">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── AFTER ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              fontSize: 11,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontWeight: 500,
              padding: "5px 14px",
              borderRadius: 20,
              width: "fit-content",
              background: "#1c160a",
              color: "#c9a84c",
              border: "1px solid #c9a84c55",
            }}
          >
            <span
              style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor", display: "inline-block" }}
            />
            After CVEdge ✓
          </span>
          <div
            style={{
              position: "relative",
              borderRadius: 10,
              boxShadow: "0 20px 80px rgba(201,168,76,0.22), 0 8px 32px rgba(0,0,0,0.7)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -14,
                right: -14,
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "#27ae60",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 15,
                fontWeight: 700,
                zIndex: 10,
                border: "2.5px solid #0d0d0d",
              }}
            >
              ✓
            </div>
            <div className="cvafter-doc">
              {/* Sidebar */}
              <div className="cvafter-sidebar">
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#c9a84c,#e8c96a)",
                    margin: "0 auto 14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 18,
                    color: "#fff",
                    fontWeight: 600,
                  }}
                >
                  JK
                </div>
                {[
                  {
                    title: "Contact",
                    items: ["john.kamau@email.com", "+254 712 345 678", "Nairobi, Kenya"],
                    extra: { "linkedin.com/in/johnkamau": "#c9a84c" },
                  },
                ].map((sec) => (
                  <div key={sec.title} style={{ marginBottom: 14 }}>
                    <div
                      style={{
                        fontSize: 8,
                        textTransform: "uppercase" as const,
                        letterSpacing: "0.12em",
                        color: "#c9a84c",
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 500,
                        marginBottom: 6,
                        paddingBottom: 3,
                        borderBottom: "1px solid #c9a84c44",
                      }}
                    >
                      {sec.title}
                    </div>
                    {sec.items.map((i) => (
                      <p
                        key={i}
                        style={{ fontSize: 8, color: "#aab8c5", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {i}
                      </p>
                    ))}
                    {Object.entries(sec.extra || {}).map(([k, v]) => (
                      <p
                        key={k}
                        style={{
                          fontSize: 8,
                          color: v as string,
                          lineHeight: 1.7,
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        {k}
                      </p>
                    ))}
                  </div>
                ))}
                <div style={{ marginBottom: 14 }}>
                  <div
                    style={{
                      fontSize: 8,
                      textTransform: "uppercase" as const,
                      letterSpacing: "0.12em",
                      color: "#c9a84c",
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 500,
                      marginBottom: 6,
                      paddingBottom: 3,
                      borderBottom: "1px solid #c9a84c44",
                    }}
                  >
                    Core Skills
                  </div>
                  {["B2B Sales", "CRM Tools", "Negotiation", "Team Leadership", "Data Analysis", "Revenue Growth"].map(
                    (s) => (
                      <span
                        key={s}
                        style={{
                          fontSize: 7.5,
                          color: "#c9a84c",
                          background: "#c9a84c15",
                          border: "1px solid #c9a84c33",
                          padding: "2px 6px",
                          borderRadius: 2,
                          margin: "2px 2px 0 0",
                          display: "inline-block",
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        {s}
                      </span>
                    ),
                  )}
                </div>
                <div style={{ marginBottom: 14 }}>
                  <div
                    style={{
                      fontSize: 8,
                      textTransform: "uppercase" as const,
                      letterSpacing: "0.12em",
                      color: "#c9a84c",
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 500,
                      marginBottom: 6,
                      paddingBottom: 3,
                      borderBottom: "1px solid #c9a84c44",
                    }}
                  >
                    Certifications
                  </div>
                  <p
                    style={{
                      fontSize: 8,
                      color: "#dde6ed",
                      fontWeight: 500,
                      fontFamily: "'DM Sans', sans-serif",
                      lineHeight: 1.7,
                    }}
                  >
                    HubSpot Sales Certified
                  </p>
                  <p style={{ fontSize: 8, color: "#aab8c5", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.7 }}>
                    Google Analytics
                  </p>
                  <p style={{ fontSize: 8, color: "#aab8c5", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.7 }}>
                    CIM Diploma
                  </p>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 8,
                      textTransform: "uppercase" as const,
                      letterSpacing: "0.12em",
                      color: "#c9a84c",
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 500,
                      marginBottom: 6,
                      paddingBottom: 3,
                      borderBottom: "1px solid #c9a84c44",
                    }}
                  >
                    Languages
                  </div>
                  <p style={{ fontSize: 8, color: "#aab8c5", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.7 }}>
                    English – Fluent
                  </p>
                  <p style={{ fontSize: 8, color: "#aab8c5", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.7 }}>
                    Kiswahili – Native
                  </p>
                </div>
              </div>
              {/* Main */}
              <div className="cvafter-main">
                <p
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 19,
                    color: "#1a2a3a",
                    fontWeight: 700,
                    margin: "0 0 2px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  John Kamau
                </p>
                <p
                  style={{
                    fontSize: 9,
                    color: "#c9a84c",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    fontWeight: 500,
                    margin: "0 0 10px",
                  }}
                >
                  Senior Sales Executive · B2B Growth Specialist
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    flexWrap: "wrap" as const,
                    marginBottom: 10,
                    paddingBottom: 10,
                    borderBottom: "1.5px solid #1a2a3a18",
                  }}
                >
                  {["📍 Nairobi, Kenya", "✉ john.kamau@email.com", "🔗 linkedin.com/in/johnkamau"].map((c) => (
                    <span key={c} style={{ fontSize: 8, color: "#888" }}>
                      {c}
                    </span>
                  ))}
                </div>
                <p
                  style={{
                    fontSize: 8,
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.12em",
                    color: "#1a2a3a",
                    fontWeight: 700,
                    margin: "10px 0 5px",
                    paddingBottom: 3,
                    borderBottom: "1.5px solid #1a2a3a22",
                  }}
                >
                  Professional Summary
                </p>
                <p
                  style={{
                    fontFamily: "'EB Garamond', serif",
                    fontSize: 10,
                    color: "#555",
                    lineHeight: 1.7,
                    margin: "0 0 2px",
                  }}
                >
                  Results-driven sales professional with 4+ years driving B2B revenue across East African markets.
                  Consistent record of exceeding targets by 35%+ and managing client portfolios worth KES 120M annually.
                </p>
                <p
                  style={{
                    fontSize: 8,
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.12em",
                    color: "#1a2a3a",
                    fontWeight: 700,
                    margin: "10px 0 5px",
                    paddingBottom: 3,
                    borderBottom: "1.5px solid #1a2a3a22",
                  }}
                >
                  Experience
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 1 }}>
                  <span style={{ fontSize: 9, fontWeight: 600, color: "#1a2a3a" }}>Senior Sales Executive</span>
                  <span style={{ fontSize: 8, color: "#c9a84c", fontWeight: 500 }}>2020 – 2023</span>
                </div>
                <p style={{ fontSize: 8, color: "#888", margin: "0 0 4px", fontStyle: "italic" }}>
                  ABC Company · Nairobi, Kenya
                </p>
                {[
                  <>
                    Grew regional revenue by <strong style={{ color: "#1a2a3a" }}>38%</strong> in 18 months through
                    targeted B2B campaigns
                  </>,
                  <>
                    Managed <strong style={{ color: "#1a2a3a" }}>45+ enterprise clients</strong> worth KES 120M annually
                  </>,
                  <>
                    Mentored <strong style={{ color: "#1a2a3a" }}>6 sales reps</strong> across 3 counties, hitting 110%
                    of team quota
                  </>,
                ].map((b, i) => (
                  <p key={i} className="cv-m-bullet">
                    {b}
                  </p>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", margin: "8px 0 1px" }}>
                  <span style={{ fontSize: 9, fontWeight: 600, color: "#1a2a3a" }}>Sales Intern</span>
                  <span style={{ fontSize: 8, color: "#c9a84c", fontWeight: 500 }}>2019 – 2020</span>
                </div>
                <p style={{ fontSize: 8, color: "#888", margin: "0 0 4px", fontStyle: "italic" }}>
                  XYZ Ltd · Nairobi, Kenya
                </p>
                <p className="cv-m-bullet">
                  Exceeded KPIs by <strong style={{ color: "#1a2a3a" }}>52%</strong>, converted to full-time ahead of
                  schedule
                </p>
                <p
                  style={{
                    fontSize: 8,
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.12em",
                    color: "#1a2a3a",
                    fontWeight: 700,
                    margin: "10px 0 5px",
                    paddingBottom: 3,
                    borderBottom: "1.5px solid #1a2a3a22",
                  }}
                >
                  Education
                </p>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 9, fontWeight: 600, color: "#1a2a3a" }}>
                    B.Com Finance – First Class Honours
                  </span>
                  <span style={{ fontSize: 8, color: "#c9a84c", fontWeight: 500 }}>2019</span>
                </div>
                <p style={{ fontSize: 8, color: "#888", margin: "0 0 10px", fontStyle: "italic" }}>
                  University of Nairobi
                </p>
                {/* Added list */}
                <div
                  style={{ padding: "10px 12px", background: "#f0fff5", borderRadius: 6, border: "1px solid #a8e6c0" }}
                >
                  <p
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      color: "#1a7a40",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      margin: "0 0 6px",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    What CVEdge added
                  </p>
                  {addedItems.map((item) => (
                    <div key={item} className="cv-added-item">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
