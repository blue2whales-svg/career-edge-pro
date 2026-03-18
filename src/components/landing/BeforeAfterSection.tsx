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

const skills = ["B2B Sales", "CRM Tools", "Negotiation", "Team Leadership", "Data Analysis", "Revenue Growth"];

export default function BeforeAfterSection() {
  return (
    <section className="cvba-wrap">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500&family=EB+Garamond:wght@400;500&display=swap');
        .cvba-wrap { background: #0d0d0d; padding: 72px 24px; font-family: 'DM Sans', sans-serif; }
        .cvba-headline { text-align: center; margin-bottom: 48px; }
        .cvba-headline h2 { font-family: 'Playfair Display', serif; font-size: clamp(24px, 3.5vw, 42px); color: #f0ead8; font-weight: 400; margin: 0 0 10px; }
        .cvba-headline h2 em { color: #c9a84c; font-style: italic; }
        .cvba-headline p { color: #666; font-size: 14px; font-weight: 300; margin: 0; letter-spacing: 0.03em; }
        .cvba-stage { display: grid; grid-template-columns: 1fr 1.55fr; gap: 28px; max-width: 980px; margin: 0 auto; align-items: start; }
        .cvba-col { display: flex; flex-direction: column; gap: 12px; }
        .cvba-tag { display: inline-flex; align-items: center; gap: 7px; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 500; padding: 5px 14px; border-radius: 20px; width: fit-content; }
        .cvba-tag-before { background: #1e1e1e; color: #888; border: 1px solid #2a2a2a; }
        .cvba-tag-after { background: #1c160a; color: #c9a84c; border: 1px solid #c9a84c55; }
        .cvba-tag-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; display: inline-block; }
        .cvba-outer { position: relative; border-radius: 10px; }
        .cvba-outer-before { box-shadow: 0 20px 60px rgba(200,50,50,0.2), 0 8px 24px rgba(0,0,0,0.7); }
        .cvba-outer-after { box-shadow: 0 20px 80px rgba(201,168,76,0.24), 0 8px 32px rgba(0,0,0,0.7); }
        .cvba-badge { position: absolute; top: -14px; right: -14px; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 700; z-index: 10; border: 2.5px solid #0d0d0d; }
        .cvba-badge-x { background: #c0392b; color: #fff; }
        .cvba-badge-check { background: #27ae60; color: #fff; }
        .cvba-before-doc { background: #f8f7f4; padding: 24px 22px; font-family: 'Times New Roman', serif; border-radius: 10px; overflow: hidden; }
        .cvba-b-name { font-size: 15px; font-weight: bold; color: #222; text-align: center; margin: 0 0 2px; }
        .cvba-b-contact { text-align: center; font-size: 9px; color: #888; margin: 0 0 12px; }
        .cvba-b-hr { border: none; border-top: 1.5px solid #ccc; margin: 0 0 9px; }
        .cvba-b-sec { font-size: 9.5px; font-weight: bold; color: #222; text-transform: uppercase; letter-spacing: 0.07em; margin: 0 0 4px; }
        .cvba-b-body { font-size: 8.5px; color: #777; line-height: 1.6; margin: 0 0 9px; }
        .cvba-b-job { font-size: 9px; font-weight: bold; color: #555; margin: 0 0 2px; }
        .cvba-b-bullet { font-size: 8.5px; color: #888; margin: 0 0 2px; padding-left: 10px; line-height: 1.5; }
        .cvba-b-skills { display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 12px; }
        .cvba-b-skill { font-size: 8px; color: #999; background: #eee; padding: 2px 6px; border-radius: 2px; }
        .cvba-missing-box { padding: 10px 12px; background: #fff0f0; border-radius: 6px; border: 1px solid #f5c0c0; }
        .cvba-missing-title { font-size: 9px; font-weight: 700; color: #c0392b; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 6px; font-family: 'DM Sans', sans-serif; }
        .cvba-missing-item { display: flex; align-items: center; gap: 6px; font-size: 8.5px; color: #c0392b; margin-bottom: 3px; font-family: 'DM Sans', sans-serif; }
        .cvba-missing-item::before { content: '✕'; font-size: 9px; flex-shrink: 0; }
        .cvba-after-doc { background: #fff; display: grid; grid-template-columns: 110px 1fr; border-radius: 10px; overflow: hidden; }
        .cvba-sidebar { background: #1a2a3a; padding: 20px 12px; }
        .cvba-avatar { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, #c9a84c, #e8c96a); margin: 0 auto 14px; display: flex; align-items: center; justify-content: center; font-family: 'Playfair Display', serif; font-size: 18px; color: #fff; font-weight: 600; }
        .cvba-s-sec { font-size: 8px; text-transform: uppercase; letter-spacing: 0.12em; color: #c9a84c; font-family: 'DM Sans', sans-serif; font-weight: 500; margin: 0 0 6px; padding-bottom: 3px; border-bottom: 1px solid #c9a84c44; }
        .cvba-s-gap { margin-bottom: 14px; }
        .cvba-s-item { font-size: 8px; color: #aab8c5; line-height: 1.7; font-family: 'DM Sans', sans-serif; margin: 0; }
        .cvba-s-item-gold { font-size: 8px; color: #c9a84c; line-height: 1.7; font-family: 'DM Sans', sans-serif; margin: 0; }
        .cvba-s-item-light { font-size: 8px; color: #dde6ed; font-weight: 500; line-height: 1.7; font-family: 'DM Sans', sans-serif; margin: 0; }
        .cvba-s-skill { font-size: 7.5px; color: #c9a84c; background: #c9a84c15; border: 1px solid #c9a84c33; padding: 2px 6px; border-radius: 2px; margin: 2px 2px 0 0; display: inline-block; font-family: 'DM Sans', sans-serif; }
        .cvba-main { padding: 20px; }
        .cvba-m-name { font-family: 'Playfair Display', serif; font-size: 19px; color: #1a2a3a; font-weight: 700; margin: 0 0 2px; }
        .cvba-m-title { font-size: 9px; color: #c9a84c; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 500; margin: 0 0 10px; }
        .cvba-m-contacts { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1.5px solid #1a2a3a18; }
        .cvba-m-contact { font-size: 8px; color: #888; }
        .cvba-m-sec { font-size: 8px; text-transform: uppercase; letter-spacing: 0.12em; color: #1a2a3a; font-weight: 700; margin: 10px 0 5px; padding-bottom: 3px; border-bottom: 1.5px solid #1a2a3a22; }
        .cvba-m-summary { font-family: 'EB Garamond', serif; font-size: 10px; color: #555; line-height: 1.7; margin: 0 0 2px; }
        .cvba-m-jobrow { display: flex; justify-content: space-between; margin-bottom: 1px; }
        .cvba-m-jobtitle { font-size: 9px; font-weight: 600; color: #1a2a3a; }
        .cvba-m-jobdate { font-size: 8px; color: #c9a84c; font-weight: 500; }
        .cvba-m-jobco { font-size: 8px; color: #888; margin: 0 0 4px; font-style: italic; }
        .cvba-m-bullet { font-size: 8.5px; color: #555; margin: 0 0 3px; padding-left: 12px; position: relative; line-height: 1.5; }
        .cvba-m-bullet::before { content: '▸'; position: absolute; left: 0; color: #c9a84c; font-size: 8px; }
        .cvba-m-hl { color: #1a2a3a; font-weight: 600; }
        .cvba-added-box { padding: 10px 12px; background: #f0fff5; border-radius: 6px; border: 1px solid #a8e6c0; margin-top: 10px; }
        .cvba-added-title { font-size: 9px; font-weight: 700; color: #1a7a40; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 6px; font-family: 'DM Sans', sans-serif; }
        .cvba-added-item { display: flex; align-items: center; gap: 6px; font-size: 8.5px; color: #1a7a40; margin-bottom: 3px; font-family: 'DM Sans', sans-serif; }
        .cvba-added-item::before { content: '✓'; font-size: 9px; font-weight: 700; flex-shrink: 0; }
        @media (max-width: 640px) {
          .cvba-stage { grid-template-columns: 1fr; }
          .cvba-after-doc { grid-template-columns: 90px 1fr; }
        }
      `}</style>

      <div className="cvba-headline">
        <h2>
          See the difference a <em>professional CV</em> makes
        </h2>
        <p>Our experts transform ordinary CVs into interview-winning documents</p>
      </div>

      <div className="cvba-stage">
        {/* BEFORE */}
        <div className="cvba-col">
          <span className="cvba-tag cvba-tag-before">
            <span className="cvba-tag-dot" />
            Before CVEdge
          </span>
          <div className="cvba-outer cvba-outer-before">
            <div className="cvba-badge cvba-badge-x">✕</div>
            <div className="cvba-before-doc">
              <p className="cvba-b-name">John Kamau</p>
              <p className="cvba-b-contact">johnkamau@gmail.com | 0712 345 678 | Nairobi</p>
              <hr className="cvba-b-hr" />
              <p className="cvba-b-sec">Objective</p>
              <p className="cvba-b-body">
                I am looking for a job where I can use my skills and grow in a company that values hard work and
                dedication.
              </p>
              <hr className="cvba-b-hr" />
              <p className="cvba-b-sec">Work Experience</p>
              <p className="cvba-b-job">Sales Executive – ABC Company (2020–2023)</p>
              <p className="cvba-b-bullet">• Did sales and marketing</p>
              <p className="cvba-b-bullet">• Helped grow the business</p>
              <p className="cvba-b-bullet">• Worked with the team on tasks</p>
              <p className="cvba-b-bullet">• Was responsible for customer service</p>
              <hr className="cvba-b-hr" />
              <p className="cvba-b-sec">Education</p>
              <p className="cvba-b-body">Bachelor of Commerce – University of Nairobi (2019)</p>
              <hr className="cvba-b-hr" />
              <p className="cvba-b-sec">Skills</p>
              <div className="cvba-b-skills">
                <span className="cvba-b-skill">Communication</span>
                <span className="cvba-b-skill">Teamwork</span>
                <span className="cvba-b-skill">Microsoft Office</span>
              </div>
              <div className="cvba-missing-box">
                <p className="cvba-missing-title">Missing elements</p>
                {missingItems.map((item) => (
                  <div key={item} className="cvba-missing-item">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AFTER */}
        <div className="cvba-col">
          <span className="cvba-tag cvba-tag-after">
            <span className="cvba-tag-dot" />
            After CVEdge ✓
          </span>
          <div className="cvba-outer cvba-outer-after">
            <div className="cvba-badge cvba-badge-check">✓</div>
            <div className="cvba-after-doc">
              <div className="cvba-sidebar">
                <div className="cvba-avatar">JK</div>
                <div className="cvba-s-gap">
                  <div className="cvba-s-sec">Contact</div>
                  <p className="cvba-s-item">john.kamau@email.com</p>
                  <p className="cvba-s-item">+254 712 345 678</p>
                  <p className="cvba-s-item">Nairobi, Kenya</p>
                  <p className="cvba-s-item-gold">linkedin.com/in/johnkamau</p>
                </div>
                <div className="cvba-s-gap">
                  <div className="cvba-s-sec">Core Skills</div>
                  {skills.map((s) => (
                    <span key={s} className="cvba-s-skill">
                      {s}
                    </span>
                  ))}
                </div>
                <div className="cvba-s-gap">
                  <div className="cvba-s-sec">Certifications</div>
                  <p className="cvba-s-item-light">HubSpot Sales Certified</p>
                  <p className="cvba-s-item">Google Analytics</p>
                  <p className="cvba-s-item">CIM Diploma</p>
                </div>
                <div>
                  <div className="cvba-s-sec">Languages</div>
                  <p className="cvba-s-item">English – Fluent</p>
                  <p className="cvba-s-item">Kiswahili – Native</p>
                </div>
              </div>

              <div className="cvba-main">
                <p className="cvba-m-name">John Kamau</p>
                <p className="cvba-m-title">Senior Sales Executive · B2B Growth Specialist</p>
                <div className="cvba-m-contacts">
                  <span className="cvba-m-contact">Nairobi, Kenya</span>
                  <span className="cvba-m-contact">john.kamau@email.com</span>
                  <span className="cvba-m-contact">linkedin.com/in/johnkamau</span>
                </div>
                <p className="cvba-m-sec">Professional Summary</p>
                <p className="cvba-m-summary">
                  Results-driven sales professional with 4+ years driving B2B revenue across East African markets.
                  Consistent record of exceeding targets by 35%+ and managing client portfolios worth KES 120M annually.
                </p>
                <p className="cvba-m-sec">Experience</p>
                <div className="cvba-m-jobrow">
                  <span className="cvba-m-jobtitle">Senior Sales Executive</span>
                  <span className="cvba-m-jobdate">2020 – 2023</span>
                </div>
                <p className="cvba-m-jobco">ABC Company · Nairobi, Kenya</p>
                <p className="cvba-m-bullet">
                  Grew regional revenue by <strong className="cvba-m-hl">38%</strong> in 18 months through targeted B2B
                  campaigns
                </p>
                <p className="cvba-m-bullet">
                  Managed <strong className="cvba-m-hl">45+ enterprise clients</strong> worth KES 120M annually
                </p>
                <p className="cvba-m-bullet">
                  Mentored <strong className="cvba-m-hl">6 sales reps</strong> across 3 counties, hitting 110% of team
                  quota
                </p>
                <div className="cvba-m-jobrow" style={{ marginTop: 8 }}>
                  <span className="cvba-m-jobtitle">Sales Intern</span>
                  <span className="cvba-m-jobdate">2019 – 2020</span>
                </div>
                <p className="cvba-m-jobco">XYZ Ltd · Nairobi, Kenya</p>
                <p className="cvba-m-bullet">
                  Exceeded KPIs by <strong className="cvba-m-hl">52%</strong>, converted to full-time ahead of schedule
                </p>
                <p className="cvba-m-sec">Education</p>
                <div className="cvba-m-jobrow">
                  <span className="cvba-m-jobtitle">B.Com Finance – First Class Honours</span>
                  <span className="cvba-m-jobdate">2019</span>
                </div>
                <p className="cvba-m-jobco">University of Nairobi</p>
                <div className="cvba-added-box">
                  <p className="cvba-added-title">What CVEdge added</p>
                  {addedItems.map((item) => (
                    <div key={item} className="cvba-added-item">
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
