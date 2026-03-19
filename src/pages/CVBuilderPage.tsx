import { useState } from "react";
import { useNavigate } fimport { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";

const templates = [
  { id: "traditional", label: "Traditional" },
  { id: "centered", label: "Centered" },
  { id: "twocol", label: "Two Column" },
  { id: "sidebar", label: "Sidebar" },
  { id: "minimal", label: "Minimal" },
  { id: "executive", label: "Executive" },
];

const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.";
const lorem2 = "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.";

function TraditionalThumb() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#fff", fontFamily: "Times New Roman, serif", fontSize: 5.5, padding: "14px 16px", overflow: "hidden", color: "#222" }}>
      <div style={{ textAlign: "center", marginBottom: 6 }}>
        <div style={{ fontSize: 11, fontWeight: "bold", letterSpacing: 0.5 }}>Christopher Carter, Accountant</div>
        <div style={{ fontSize: 4.5, color: "#555", marginTop: 1 }}>Bulatovskiy 53, 346992, Rostov-on-Don · Russia · +8-928-913-70-34 · christopher@gmail.com</div>
      </div>
      <div style={{ borderTop: "1.5px solid #222", borderBottom: "1.5px solid #222", padding: "2px 0", marginBottom: 5 }} />
      <div style={{ fontSize: 5.5, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>Profile</div>
      <div style={{ fontSize: 4.5, color: "#444", lineHeight: 1.7, marginBottom: 5 }}>{lorem} {lorem2}</div>
      <div style={{ borderTop: "0.5px solid #888", marginBottom: 4 }} />
      <div style={{ fontSize: 5.5, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>Education</div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 1 }}>
        <div><div style={{ fontSize: 5, fontWeight: "bold" }}>UX/UI courses, British Design High School</div><div style={{ fontSize: 4, color: "#666", fontStyle: "italic" }}>Participant</div></div>
        <div style={{ fontSize: 4, color: "#666", textAlign: "right" }}>Moscow, Russia<br />01/06/2021 — 01/06/2021</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <div><div style={{ fontSize: 5, fontWeight: "bold" }}>Institute of Art &amp; Design</div><div style={{ fontSize: 4, color: "#666", fontStyle: "italic" }}>Analyst, 2nd year (drop out)</div></div>
        <div style={{ fontSize: 4, color: "#666", textAlign: "right" }}>Rostov-on-Don, Russia<br />01/09/2016 — 30/05/2019</div>
      </div>
      <div style={{ borderTop: "0.5px solid #888", marginBottom: 4 }} />
      <div style={{ fontSize: 5.5, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>Experience</div>
      <div style={{ marginBottom: 3 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontSize: 5, fontWeight: "bold" }}>UX designer, Pentagram Group</div>
          <div style={{ fontSize: 4, color: "#666" }}>Moscow, Russia</div>
        </div>
        <div style={{ fontSize: 4, color: "#888", marginBottom: 1 }}>May 2021 — Present time</div>
        <div style={{ fontSize: 4.5, color: "#444", lineHeight: 1.6 }}>{lorem}</div>
        <div style={{ fontSize: 4.5, color: "#444", lineHeight: 1.6, marginTop: 1 }}>· Lorem ipsum dolor sit amet, consectetur</div>
        <div style={{ fontSize: 4.5, color: "#444", lineHeight: 1.6 }}>· Cras et metus a risus elementum facilisis</div>
      </div>
      <div style={{ marginBottom: 3 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontSize: 5, fontWeight: "bold" }}>Graphic designer, Grizzly Agency</div>
          <div style={{ fontSize: 4, color: "#666" }}>Rostov-on-Don, Russia</div>
        </div>
        <div style={{ fontSize: 4, color: "#888", marginBottom: 1 }}>Oct 2021 — Apr 2021</div>
        <div style={{ fontSize: 4.5, color: "#444", lineHeight: 1.6 }}>{lorem2}</div>
      </div>
      <div style={{ marginBottom: 4 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontSize: 5, fontWeight: "bold" }}>Flash animator &amp; graphic designer, Chulakon Studio</div>
          <div style={{ fontSize: 4, color: "#666" }}>Rostov-on-Don, Russia</div>
        </div>
        <div style={{ fontSize: 4, color: "#888", marginBottom: 1 }}>Nov 2019 — Aug 2021</div>
        <div style={{ fontSize: 4.5, color: "#444", lineHeight: 1.6 }}>{lorem}</div>
      </div>
      <div style={{ borderTop: "0.5px solid #888", marginBottom: 4 }} />
      <div style={{ fontSize: 5.5, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>Skills</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px 8px", marginBottom: 4 }}>
        {[["UI design","Perfectly"],["Front-end development","Good"],["Branding & Identity","Very good"],["Sleeping","Normal"],["Wayfinding systems","Good"]].map(([sk, lv]) => (
          <div key={sk} style={{ display: "flex", justifyContent: "space-between", fontSize: 4.5 }}>
            <span style={{ color: "#333" }}>{sk}</span><span style={{ color: "#888" }}>{lv}</span>
          </div>
        ))}
      </div>
      <div style={{ borderTop: "0.5px solid #888", marginBottom: 3 }} />
      <div style={{ fontSize: 5.5, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>Languages</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px 8px", marginBottom: 4 }}>
        {[["English","Perfectly"],["Russian","Good"]].map(([l, lv]) => (
          <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 4.5 }}>
            <span>{l}</span><span style={{ color: "#888" }}>{lv}</span>
          </div>
        ))}
      </div>
      <div style={{ borderTop: "0.5px solid #888", marginBottom: 3 }} />
      <div style={{ fontSize: 5.5, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>Hobbies</div>
      <div style={{ fontSize: 4.5, color: "#444" }}>Swimming, Watching TV shows, 3D printing, Skateboarding</div>
      <div style={{ borderTop: "0.5px solid #888", marginTop: 4, paddingTop: 3 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2, fontSize: 4 }}>
          <div><div style={{ color: "#888" }}>DOB / Place of birth</div><div>04/07/1969</div><div>Rostov-on-Don, Russia</div></div>
          <div><div style={{ color: "#888" }}>Marital status</div><div>Married</div></div>
          <div><div style={{ color: "#888" }}>Nationality / Gender</div><div>Russian / Male</div></div>
        </div>
      </div>
    </div>
  );
}

function CenteredThumb() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#fff", fontFamily: "Georgia, serif", fontSize: 5.5, padding: "14px 18px", overflow: "hidden", color: "#222" }}>
      <div style={{ textAlign: "center", marginBottom: 6 }}>
        <div style={{ fontSize: 13, fontFamily: "Georgia, serif", color: "#111" }}>Tiffany Giroux</div>
        <div style={{ fontSize: 6, color: "#555", marginTop: 1 }}>Freight &amp; Logistics Analyst</div>
        <div style={{ fontSize: 4.5, color: "#777", marginTop: 1 }}>18 Harmony Drive, Orlando, Florida 27267</div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 4.5, color: "#555", marginTop: 3, paddingTop: 2, borderTop: "0.5px solid #ccc" }}>
          <span>001 415 370 5567</span><span>tiffgiroux@hotmail.com</span>
        </div>
      </div>
      <div style={{ textAlign: "center", fontSize: 6, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 2, borderTop: "1px solid #999", borderBottom: "1px solid #999", padding: "2px 0", marginBottom: 4 }}>Profile</div>
      <div style={{ fontSize: 4.5, color: "#444", lineHeight: 1.7, fontStyle: "italic", marginBottom: 5 }}>A highly skilled and organised Logistics, Distribution and Supply Chain professional with additional experience within bookkeeping and accounting. I have developed a wide range of skills to assist me in achieving challenging individual and organisational goals. Possessing a resilient approach and analytical mind, able to work with detailed components through to the big picture, I have managed multiple systems and process development projects to facilitate increased effectiveness and reduced costs across all previous roles.</div>
      <div style={{ textAlign: "center", fontSize: 6, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 2, borderTop: "1px solid #999", borderBottom: "1px solid #999", padding: "2px 0", marginBottom: 4 }}>Experience</div>
      <div style={{ marginBottom: 4 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontSize: 5, fontWeight: "bold" }}>❖ Freight Audit &amp; Logistics Analyst · Ford</div>
          <div style={{ fontSize: 4, color: "#666" }}>July 2018 · Current · Detroit, USA</div>
        </div>
        <div style={{ fontSize: 4.5, color: "#444", lineHeight: 1.6, marginTop: 1 }}>{lorem}</div>
        <div style={{ fontSize: 4.5, color: "#444", lineHeight: 1.6, marginTop: 1, fontStyle: "italic" }}>· Improved efficiencies and achieved cost reductions of 13% across all freight activity</div>
      </div>
      <div style={{ marginBottom: 4 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontSize: 5, fontWeight: "bold" }}>❖ Senior Logistics Business Analyst · Honda</div>
          <div style={{ fontSize: 4, color: "#666" }}>May 2012 · June 2014</div>
        </div>
        <div style={{ fontSize: 4.5, color: "#444", lineHeight: 1.6, marginTop: 1 }}>{lorem2}</div>
        <div style={{ fontSize: 4.5, color: "#444", lineHeight: 1.6, marginTop: 1, fontStyle: "italic" }}>· Implemented business process improvements leading to savings of over 50 man-hours per month</div>
        <div style={{ fontSize: 4.5, color: "#444", lineHeight: 1.6, fontStyle: "italic" }}>· Met all project deadlines, budget and quality expectations.</div>
      </div>
      <div style={{ marginBottom: 4 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontSize: 5, fontWeight: "bold" }}>❖ Senior Logistics Coordinator · Honda</div>
          <div style={{ fontSize: 4, color: "#666" }}>May 2011 · May 2012</div>
        </div>
        <div style={{ fontSize: 4.5, color: "#444", lineHeight: 1.6, marginTop: 1 }}>{lorem}</div>
      </div>
      <div style={{ textAlign: "center", fontSize: 6, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 2, borderTop: "1px solid #999", borderBottom: "1px solid #999", padding: "2px 0", marginBottom: 4 }}>Education</div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
        <div style={{ fontSize: 5, fontWeight: "bold" }}>❖ Postgraduate Diploma Management Studies</div>
        <div style={{ fontSize: 4, color: "#666" }}>September 2009 · September 2010</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <div style={{ fontSize: 5, fontWeight: "bold" }}>❖ Management Studies, University of Hertfordshire, Bedford</div>
        <div style={{ fontSize: 4, color: "#666" }}>September 2007 · September 2009</div>
      </div>
      <div style={{ textAlign: "center", fontSize: 6, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 2, borderTop: "1px solid #999", borderBottom: "1px solid #999", padding: "2px 0", marginBottom: 4 }}>References</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
        <div><div style={{ fontSize: 5, fontWeight: "bold" }}>Mr. John Smith</div><div style={{ fontSize: 4, color: "#666" }}>Senior Manager, Ford Motor</div><div style={{ fontSize: 4, color: "#666" }}>john.smith@ford.com</div></div>
        <div><div style={{ fontSize: 5, fontWeight: "bold" }}>Ms. Angela Brown</div><div style={{ fontSize: 4, color: "#666" }}>Director, Honda Logistics</div><div style={{ fontSize: 4, color: "#666" }}>a.brown@honda.com</div></div>
      </div>
    </div>
  );
}

function TwoColThumb() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#fff", fontFamily: "Arial, sans-serif", fontSize: 5.5, overflow: "hidden" }}>
      <div style={{ background: "#1a3a5c", padding: "10px 14px 8px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: "900", color: "#4a9fd4", textTransform: "uppercase", letterSpacing: 1 }}>HERMAN WALTON</div>
          <div style={{ fontSize: 7, fontWeight: "bold", color: "#fff", marginTop: 1 }}>FINANCIAL ANALYST</div>
          <div style={{ fontSize: 4, color: "#aac8e0", marginTop: 2 }}>Market Street 12, New York, 1021, The USA · (412) 479-6342 · example@gmail.com</div>
        </div>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#4a9fd4", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 9, fontWeight: "bold" }}>HW</div>
      </div>
      <div style={{ padding: "6px 14px", display: "grid", gridTemplateColumns: "1fr", gap: 4 }}>
        <div>
          <div style={{ fontSize: 6, fontWeight: "bold", color: "#1a3a5c", textTransform: "uppercase", letterSpacing: 1, borderBottom: "1.5px solid #1a3a5c", paddingBottom: 1, marginBottom: 2 }}>Summary</div>
          <div style={{ fontSize: 4.5, color: "#444", lineHeight: 1.6 }}>Experienced and driven Financial Analyst with an impressive background of managing multi-million dollar budgets while providing analysis and account support within product development departments. Worked to reduce business expenses and develop logical and advantageous operating plan budgets. Experience creating quarterly accruals based on trends and forecasted expenses.</div>
        </div>
        <div>
          <div style={{ fontSize: 6, fontWeight: "bold", color: "#1a3a5c", textTransform: "uppercase", letterSpacing: 1, borderBottom: "1.5px solid #1a3a5c", paddingBottom: 1, marginBottom: 2 }}>Professional Experience</div>
          <div style={{ fontSize: 5, fontWeight: "bold", color: "#222" }}>Financial Analyst, GEO Corp.</div>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 4, color: "#888" }}>Financial Analyst, GEO Corp.</span><span style={{ fontSize: 4, color: "#888" }}>Jan 2012 — Present</span></div>
          <div style={{ fontSize: 4.5, color: "#444", lineHeight: 1.6 }}>· Created budgets and ensured that labor and material costs were decreased by 15 percent.</div>
          <div style={{ fontSize: 4.5, color: "#444", lineHeight: 1.6 }}>· Created financial reports on completed projects, indicating advantageous results.</div>
          <div style={{ fontSize: 4.5, color: "#444", lineHeight: 1.6 }}>· Generated financial statements including cash flow charts and balance sheets.</div>
          <div style={{ fontSize: 5, fontWeight: "bold", color: "#222", marginTop: 3 }}>Financial Analyst, Sisca Enterprises</div>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 4, color: "#888" }}>Financial Analyst, Sisca Enterprises</span><span style={{ fontSize: 4, color: "#888" }}>Feb 2008 — Dec 2012</span></div>
          <div style={{ fontSize: 4.5, color: "#444", lineHeight: 1.6 }}>· Provide reports, ad-hoc analysis, annual operations plan budgets, monthly cash forecasts, and revenue forecasts.</div>
          <div style={{ fontSize: 4.5, color: "#444", lineHeight: 1.6 }}>· Analysed supplier contracts and advised in negotiations.</div>
          <div style={{ fontSize: 4.5, color: "#444", lineHeight: 1.6 }}>· Created weekly labor finance reports and presented the results to management.</div>
        </div>
        <div>
          <div style={{ fontSize: 6, fontWeight: "bold", color: "#1a3a5c", textTransform: "uppercase", letterSpacing: 1, borderBottom: "1.5px solid #1a3a5c", paddingBottom: 1, marginBottom: 2 }}>Education</div>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 5, fontWeight: "bold" }}>Diploma in Computer Engineering</span><span style={{ fontSize: 4, color: "#888" }}>Aug 2006 — Oct 2008</span></div>
          <div style={{ fontSize: 4, color: "#666" }}>University of Arizona · Graduated with High Honors.</div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}><span style={{ fontSize: 5, fontWeight: "bold" }}>Bachelor in Computer Engineering</span><span style={{ fontSize: 4, color: "#888" }}>Aug 2004 — Oct 2006</span></div>
          <div style={{ fontSize: 4, color: "#666" }}>University of Arizona · Graduated with High Honors.</div>
        </div>
        <div>
          <div style={{ fontSize: 6, fontWeight: "bold", color: "#1a3a5c", textTransform: "uppercase", letterSpacing: 1, borderBottom: "1.5px solid #1a3a5c", paddingBottom: 1, marginBottom: 2 }}>Technical Skills</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 1.5 }}>
            {["Solution Strategies","Analytical Thinker","Innovation","Agile Methodologies","Effective Team leader","Market Assessment","Collaboration","Creative Problem Solving","Customer-centric Selling","Trend Analysis","Source Control","Networking"].map(s => (
              <div key={s} style={{ fontSize: 3.5, color: "#444", background: "#f0f4f8", padding: "1px 3px", borderRadius: 1 }}>{s}</div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 6, fontWeight: "bold", color: "#1a3a5c", textTransform: "uppercase", letterSpacing: 1, borderBottom: "1.5px solid #1a3a5c", paddingBottom: 1, marginBottom: 2 }}>Additional Information</div>
          <div style={{ fontSize: 4.5, color: "#444" }}>· Languages: English, French</div>
          <div style={{ fontSize: 4.5, color: "#444" }}>· Certificates: Financial Analyst License</div>
          <div style={{ fontSize: 4.5, color: "#444" }}>· Awards/Activities: Most Innovative Employer of the Year (2011), Overall Best Employee Division Two (2009)</div>
        </div>
      </div>
    </div>
  );
}

function SidebarThumb() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#fff", fontFamily: "Arial, sans-serif", fontSize: 5.5, overflow: "hidden", display: "flex" }}>
      <div style={{ width: "36%", background: "#2d3748", padding: "12px 8px", flexShrink: 0 }}>
        <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#63b3ed", margin: "0 auto 5px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 9, fontWeight: "bold" }}>DK</div>
        <div style={{ color: "#f7fafc", fontSize: 6, fontWeight: "bold", textAlign: "center", marginBottom: 6 }}>David Kimani</div>
        <div style={{ fontSize: 4, color: "#90cdf4", fontWeight: "bold", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>Contact</div>
        <div style={{ fontSize: 3.5, color: "#cbd5e0", lineHeight: 1.7 }}>david.kimani@email.com</div>
        <div style={{ fontSize: 3.5, color: "#cbd5e0", lineHeight: 1.7 }}>+254 722 345 678</div>
        <div style={{ fontSize: 3.5, color: "#cbd5e0", lineHeight: 1.7 }}>Nairobi, Kenya</div>
        <div style={{ fontSize: 3.5, color: "#90cdf4", lineHeight: 1.7 }}>linkedin.com/in/davidkimani</div>
        <div style={{ height: 0.5, background: "#4a5568", margin: "5px 0" }} />
        <div style={{ fontSize: 4, color: "#90cdf4", fontWeight: "bold", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>Education</div>
        <div style={{ fontSize: 3.5, color: "#e2e8f0", lineHeight: 1.5, fontWeight: "bold" }}>BSc. Computer Science</div>
        <div style={{ fontSize: 3.5, color: "#a0aec0", lineHeight: 1.5 }}>University of Nairobi</div>
        <div style={{ fontSize: 3.5, color: "#a0aec0", lineHeight: 1.5 }}>2016 – 2020 · First Class</div>
        <div style={{ height: 0.5, background: "#4a5568", margin: "5px 0" }} />
        <div style={{ fontSize: 4, color: "#90cdf4", fontWeight: "bold", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>Skills</div>
        {["React & Next.js","TypeScript","Node.js / Express","PostgreSQL & Redis","Docker & Kubernetes","AWS & GCP","REST & GraphQL APIs","CI/CD Pipelines"].map(s => (
          <div key={s} style={{ fontSize: 3.5, color: "#cbd5e0", lineHeight: 1.7 }}>· {s}</div>
        ))}
        <div style={{ height: 0.5, background: "#4a5568", margin: "5px 0" }} />
        <div style={{ fontSize: 4, color: "#90cdf4", fontWeight: "bold", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>Languages</div>
        <div style={{ fontSize: 3.5, color: "#cbd5e0", lineHeight: 1.7 }}>English — Fluent</div>
        <div style={{ fontSize: 3.5, color: "#cbd5e0", lineHeight: 1.7 }}>Kiswahili — Native</div>
        <div style={{ height: 0.5, background: "#4a5568", margin: "5px 0" }} />
        <div style={{ fontSize: 4, color: "#90cdf4", fontWeight: "bold", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>Certifications</div>
        <div style={{ fontSize: 3.5, color: "#cbd5e0", lineHeight: 1.7 }}>AWS Solutions Architect</div>
        <div style={{ fontSize: 3.5, color: "#cbd5e0", lineHeight: 1.7 }}>Google Cloud Professional</div>
        <div style={{ fontSize: 3.5, color: "#cbd5e0", lineHeight: 1.7 }}>Meta React Developer</div>
      </div>
      <div style={{ flex: 1, padding: "12px 10px" }}>
        <div style={{ fontSize: 9, fontWeight: "bold", color: "#1a202c", letterSpacing: -0.3 }}>Software Engineer</div>
        <div style={{ fontSize: 5, color: "#63b3ed", marginBottom: 5 }}>Full-Stack Developer · 5 Years Experience</div>
        <div style={{ fontSize: 4, fontWeight: "bold", color: "#2d3748", textTransform: "uppercase", letterSpacing: 1, borderBottom: "1px solid #e2e8f0", paddingBottom: 1, marginBottom: 3 }}>Professional Summary</div>
        <div style={{ fontSize: 4, color: "#4a5568", lineHeight: 1.6, marginBottom: 5 }}>Innovative full-stack engineer with 5 years building scalable SaaS products for East African fintech and edtech companies. Shipped 8 production apps serving 100K+ users. Passionate about clean code, developer experience, and engineering culture.</div>
        <div style={{ fontSize: 4, fontWeight: "bold", color: "#2d3748", textTransform: "uppercase", letterSpacing: 1, borderBottom: "1px solid #e2e8f0", paddingBottom: 1, marginBottom: 3 }}>Work Experience</div>
        <div style={{ fontSize: 4.5, fontWeight: "bold", color: "#1a202c" }}>Lead Software Engineer — M-Kopa Solar</div>
        <div style={{ fontSize: 3.5, color: "#718096", marginBottom: 1 }}>February 2022 – Present · Nairobi, Kenya</div>
        <div style={{ fontSize: 4, color: "#4a5568", lineHeight: 1.5 }}>· Architected IoT monitoring dashboard serving 200K+ connected devices across 5 countries</div>
        <div style={{ fontSize: 4, color: "#4a5568", lineHeight: 1.5 }}>· Reduced API response time by 65% through Redis caching and query optimisation</div>
        <div style={{ fontSize: 4, color: "#4a5568", lineHeight: 1.5 }}>· Led team of 6 engineers, implementing agile ceremonies and code review culture</div>
        <div style={{ fontSize: 4, color: "#4a5568", lineHeight: 1.5 }}>· Migrated monolith to microservices, improving deployment frequency by 4x</div>
        <div style={{ fontSize: 4.5, fontWeight: "bold", color: "#1a202c", marginTop: 3 }}>Software Engineer — Andela</div>
        <div style={{ fontSize: 3.5, color: "#718096", marginBottom: 1 }}>June 2020 – January 2022 · Remote (Lagos, Nigeria)</div>
        <div style={{ fontSize: 4, color: "#4a5568", lineHeight: 1.5 }}>· Delivered React component library for US-based fintech client (Series B, $40M raised)</div>
        <div style={{ fontSize: 4, color: "#4a5568", lineHeight: 1.5 }}>· Maintained 99.9% uptime SLA on payment processing microservices</div>
        <div style={{ fontSize: 4, color: "#4a5568", lineHeight: 1.5 }}>· Mentored 3 junior engineers, improving their output velocity by 40%</div>
        <div style={{ fontSize: 4.5, fontWeight: "bold", color: "#1a202c", marginTop: 3 }}>Junior Developer — Safaricom PLC</div>
        <div style={{ fontSize: 3.5, color: "#718096", marginBottom: 1 }}>August 2019 – May 2020 · Nairobi, Kenya</div>
        <div style={{ fontSize: 4, color: "#4a5568", lineHeight: 1.5 }}>· Built internal tools using React and Node.js for operations team of 200+</div>
        <div style={{ fontSize: 4, color: "#4a5568", lineHeight: 1.5 }}>· Contributed to M-Pesa developer portal serving 50K+ API integrators</div>
        <div style={{ fontSize: 4, fontWeight: "bold", color: "#2d3748", textTransform: "uppercase", letterSpacing: 1, borderBottom: "1px solid #e2e8f0", paddingBottom: 1, margin: "4px 0 2px" }}>Key Projects</div>
        <div style={{ fontSize: 4, color: "#4a5568", lineHeight: 1.5 }}>· PayLink Africa — P2P payments app, 40K monthly active users</div>
        <div style={{ fontSize: 4, color: "#4a5568", lineHeight: 1.5 }}>· EduBridge — LMS platform used by 120 Kenyan secondary schools</div>
      </div>
    </div>
  );
}

function MinimalThumb() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#fff", fontFamily: "Helvetica, Arial, sans-serif", fontSize: 5.5, padding: "16px 18px", overflow: "hidden", color: "#111" }}>
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 14, fontWeight: "300", color: "#111", letterSpacing: 2, textTransform: "uppercase" }}>Grace Wanjiru</div>
        <div style={{ fontSize: 5.5, color: "#666", marginTop: 2, letterSpacing: 1 }}>UX Designer & Product Strategist</div>
        <div style={{ display: "flex", gap: 8, marginTop: 3, fontSize: 4, color: "#999" }}>
          <span>grace@email.com</span><span>·</span><span>0700 123 456</span><span>·</span><span>Nairobi</span><span>·</span><span>behance.net/gracewanjiru</span>
        </div>
      </div>
      <div style={{ height: 0.5, background: "#e0e0e0", marginBottom: 7 }} />
      <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: "0 12px", marginBottom: 5 }}>
        <div style={{ fontSize: 4, color: "#999", textTransform: "uppercase", letterSpacing: 1, paddingTop: 1 }}>Profile</div>
        <div style={{ fontSize: 4.5, color: "#444", lineHeight: 1.7 }}>Product designer with 7 years crafting intuitive digital experiences for fintech and healthtech companies across East Africa. Led design systems adopted by cross-functional teams of 50+. Passionate about human-centred design and accessibility in emerging markets.</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: "0 12px", marginBottom: 5 }}>
        <div style={{ fontSize: 4, color: "#999", textTransform: "uppercase", letterSpacing: 1, paddingTop: 1 }}>Experience</div>
        <div>
          <div style={{ marginBottom: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 5, fontWeight: "bold", color: "#111" }}>Lead Product Designer — Flutterwave</span>
              <span style={{ fontSize: 4, color: "#999" }}>2021 – Present</span>
            </div>
            <div style={{ fontSize: 4, color: "#888", marginBottom: 1 }}>Lagos, Nigeria (Remote)</div>
            <div style={{ fontSize: 4.5, color: "#555", lineHeight: 1.6 }}>· Redesigned checkout flow increasing conversion rate by 34% across 12 African markets</div>
            <div style={{ fontSize: 4.5, color: "#555", lineHeight: 1.6 }}>· Built and maintained Figma design system adopted by 4 product teams (200+ components)</div>
            <div style={{ fontSize: 4.5, color: "#555", lineHeight: 1.6 }}>· Conducted 60+ user interviews informing product roadmap decisions</div>
          </div>
          <div style={{ marginBottom: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 5, fontWeight: "bold", color: "#111" }}>Senior UX Designer — Jumia Kenya</span>
              <span style={{ fontSize: 4, color: "#999" }}>2018 – 2021</span>
            </div>
            <div style={{ fontSize: 4, color: "#888", marginBottom: 1 }}>Nairobi, Kenya</div>
            <div style={{ fontSize: 4.5, color: "#555", lineHeight: 1.6 }}>· Improved mobile app NPS score from 42 to 71 through iterative UX improvements</div>
            <div style={{ fontSize: 4.5, color: "#555", lineHeight: 1.6 }}>· Delivered 20+ A/B test designs, lifting add-to-cart rate by 18%</div>
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 5, fontWeight: "bold", color: "#111" }}>UI Designer — Andela</span>
              <span style={{ fontSize: 4, color: "#999" }}>2016 – 2018</span>
            </div>
            <div style={{ fontSize: 4.5, color: "#555", lineHeight: 1.6 }}>· Designed internal dashboards and developer portal for global engineering teams</div>
          </div>
        </div>
      </div>
      <div style={{ height: 0.5, background: "#e0e0e0", marginBottom: 5 }} />
      <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: "0 12px", marginBottom: 5 }}>
        <div style={{ fontSize: 4, color: "#999", textTransform: "uppercase", letterSpacing: 1 }}>Education</div>
        <div>
          <div style={{ fontSize: 5, fontWeight: "bold", color: "#111" }}>BA Industrial Design — University of Nairobi</div>
          <div style={{ fontSize: 4, color: "#888" }}>2012 – 2016 · Upper Second Class Honours</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: "0 12px", marginBottom: 5 }}>
        <div style={{ fontSize: 4, color: "#999", textTransform: "uppercase", letterSpacing: 1 }}>Skills</div>
        <div style={{ fontSize: 4.5, color: "#555" }}>Figma · Sketch · Adobe XD · Prototyping · Usability Testing · Design Systems · Webflow · User Research · Information Architecture</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: "0 12px" }}>
        <div style={{ fontSize: 4, color: "#999", textTransform: "uppercase", letterSpacing: 1 }}>Awards</div>
        <div style={{ fontSize: 4.5, color: "#555" }}>Design4Africa Finalist 2022 · Google UX Certificate 2021 · Awwwards Honorable Mention 2020</div>
      </div>
    </div>
  );
}

function ExecutiveThumb() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#fff", fontFamily: "Georgia, serif", fontSize: 5.5, overflow: "hidden" }}>
      <div style={{ background: "#0f172a", padding: "12px 14px 10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: "bold", color: "#f8fafc", letterSpacing: 0.5 }}>JAMES MITCHELL</div>
            <div style={{ fontSize: 6, color: "#c9a84c", marginTop: 1, letterSpacing: 1 }}>CHIEF EXECUTIVE OFFICER</div>
            <div style={{ fontSize: 4, color: "#94a3b8", marginTop: 3 }}>james.mitchell@email.com · +1 (415) 555-0192 · San Francisco, CA · linkedin.com/in/jamesmitchell</div>
          </div>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#c9a84c", display: "flex", alignItems: "center", justifyContent: "center", color: "#0f172a", fontSize: 9, fontWeight: "bold", flexShrink: 0 }}>JM</div>
        </div>
      </div>
      <div style={{ height: 2, background: "linear-gradient(90deg, #c9a84c, #f0d080, #c9a84c)" }} />
      <div style={{ padding: "7px 14px" }}>
        <div style={{ fontSize: 5, fontWeight: "bold", color: "#0f172a", textTransform: "uppercase", letterSpacing: 1.5, borderBottom: "0.5px solid #c9a84c", paddingBottom: 1, marginBottom: 3 }}>Executive Summary</div>
        <div style={{ fontSize: 4.5, color: "#334155", lineHeight: 1.7, marginBottom: 5 }}>Visionary CEO with 20+ years leading global technology companies from startup to IPO. Raised $340M across 4 funding rounds. Built and scaled teams from 5 to 2,000+ across 18 countries. Known for driving product innovation, operational excellence, and shareholder value creation.</div>
        <div style={{ fontSize: 5, fontWeight: "bold", color: "#0f172a", textTransform: "uppercase", letterSpacing: 1.5, borderBottom: "0.5px solid #c9a84c", paddingBottom: 1, marginBottom: 3 }}>Leadership Experience</div>
        <div style={{ marginBottom: 4 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 5.5, fontWeight: "bold", color: "#0f172a" }}>Chief Executive Officer — TechVenture Africa</span>
            <span style={{ fontSize: 4, color: "#c9a84c" }}>2018 – Present</span>
          </div>
          <div style={{ fontSize: 4, color: "#94a3b8", marginBottom: 2 }}>Nairobi, Kenya · Series C · $120M ARR</div>
          <div style={{ fontSize: 4.5, color: "#475569", lineHeight: 1.5 }}>· Scaled company from 12 to 850 employees across 8 African markets</div>
          <div style={{ fontSize: 4.5, color: "#475569", lineHeight: 1.5 }}>· Led $85M Series C fundraising round (2021) — largest in East African tech history</div>
          <div style={{ fontSize: 4.5, color: "#475569", lineHeight: 1.5 }}>· Grew ARR from $4M to $120M in 5 years through product expansion and M&A</div>
          <div style={{ fontSize: 4.5, color: "#475569", lineHeight: 1.5 }}>· Negotiated strategic partnerships with Visa, Mastercard, and IFC</div>
        </div>
        <div style={{ marginBottom: 4 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 5.5, fontWeight: "bold", color: "#0f172a" }}>Managing Director — Google Africa</span>
            <span style={{ fontSize: 4, color: "#c9a84c" }}>2014 – 2018</span>
          </div>
          <div style={{ fontSize: 4, color: "#94a3b8", marginBottom: 2 }}>Lagos, Nigeria</div>
          <div style={{ fontSize: 4.5, color: "#475569", lineHeight: 1.5 }}>· Led Google's Sub-Saharan Africa operations across 20 countries, $2B revenue</div>
          <div style={{ fontSize: 4.5, color: "#475569", lineHeight: 1.5 }}>· Launched Google for Startups Africa — supported 500+ companies in 4 years</div>
        </div>
        <div style={{ fontSize: 5, fontWeight: "bold", color: "#0f172a", textTransform: "uppercase", letterSpacing: 1.5, borderBottom: "0.5px solid #c9a84c", paddingBottom: 1, marginBottom: 3 }}>Board Positions</div>
        <div style={{ fontSize: 4.5, color: "#475569", lineHeight: 1.7 }}>Non-Executive Director — Equity Bank Group (2020–Present)</div>
        <div style={{ fontSize: 4.5, color: "#475569", lineHeight: 1.7 }}>Advisory Board — Techstars Africa (2019–Present)</div>
        <div style={{ fontSize: 4.5, color: "#475569", lineHeight: 1.7 }}>Board Member — Kenya ICT Authority (2022–Present)</div>
        <div style={{ fontSize: 5, fontWeight: "bold", color: "#0f172a", textTransform: "uppercase", letterSpacing: 1.5, borderBottom: "0.5px solid #c9a84c", paddingBottom: 1, margin: "4px 0 3px" }}>Education</div>
        <div style={{ fontSize: 4.5, color: "#334155" }}>MBA, Harvard Business School · 2004 · Baker Scholar (Top 5%)</div>
        <div style={{ fontSize: 4.5, color: "#334155" }}>BSc Engineering, MIT · 2001 · Summa Cum Laude</div>
        <div style={{ fontSize: 5, fontWeight: "bold", color: "#0f172a", textTransform: "uppercase", letterSpacing: 1.5, borderBottom: "0.5px solid #c9a84c", paddingBottom: 1, margin: "4px 0 3px" }}>Core Competencies</div>
        <div style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          {["P&L Management","M&A","Fundraising","Board Relations","Strategy","Scaling Teams","GTM","Partnerships","IPO Readiness"].map(s => (
            <span key={s} style={{ fontSize: 3.5, background: "#0f172a", color: "#c9a84c", padding: "1px 5px", borderRadius: 2 }}>{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

const THUMB_MAP: Record<string, JSX.Element> = {
  traditional: <TraditionalThumb />,
  centered: <CenteredThumb />,
  twocol: <TwoColThumb />,
  sidebar: <SidebarThumb />,
  minimal: <MinimalThumb />,
  executive: <ExecutiveThumb />,
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
                className={`rounded-2xl border overflow-hidden text-left transition-all duration-200 ${
                  selected === t.id
                    ? "border-primary shadow-glow ring-2 ring-primary/30"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <div style={{ height: 280, overflow: "hidden", position: "relative", background: "#f8f8f8" }}>
                  {THUMB_MAP[t.id]}
                </div>
                <div className={`px-4 py-3 flex items-center justify-between ${selected === t.id ? "bg-primary/10" : "bg-card"}`}>
                  <span className="font-semibold text-sm">{t.label}</span>
                  {selected === t.id && <span className="text-xs text-primary font-mono">Selected ✓</span>}
                </div>
              </button>
            ))}
          </div>
          {selected && (
            <div className="mt-10 text-center">
              <Button
                onClick={() => navigate(`/cv-editor/${selected}`)}
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
rom "react-router-dom";
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
