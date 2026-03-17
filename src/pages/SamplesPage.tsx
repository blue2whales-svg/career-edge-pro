export default function SamplesPage() {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <iframe
        srcDoc={`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CV Templates</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
:root{--navy:#0a0f1e;--navy-card:#141c2e;--navy-border:#1e2d4a;--gold:#c9a84c;--gold-light:#e8c97a;--white:#f0f4ff;--muted:#8899bb}
*{margin:0;padding:0;box-sizing:border-box}
body{background:var(--navy);color:var(--white);font-family:'DM Sans',sans-serif;min-height:100vh}
nav{position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(10,15,30,0.95);border-bottom:1px solid var(--navy-border);display:flex;align-items:center;justify-content:space-between;padding:0 40px;height:64px}
.nav-logo{font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:700;color:var(--gold);text-decoration:none}
.nav-links{display:flex;gap:28px;align-items:center}
.nav-links a{color:var(--muted);text-decoration:none;font-size:0.88rem;font-weight:500}
.nav-links a:hover{color:var(--gold)}
.nav-cta{background:var(--gold)!important;color:#0a0f1e!important;padding:7px 18px;border-radius:6px;font-weight:600!important}
.hero{padding:110px 40px 50px;text-align:center;background:radial-gradient(ellipse 80% 50% at 50% 0%,rgba(201,168,76,0.12) 0%,transparent 70%)}
.hero-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(201,168,76,0.1);border:1px solid rgba(201,168,76,0.3);color:var(--gold);padding:6px 16px;border-radius:100px;font-size:0.78rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:22px}
.hero h1{font-family:'Playfair Display',serif;font-size:clamp(2rem,5vw,3.5rem);font-weight:900;line-height:1.1;margin-bottom:14px}
.hero h1 span{color:var(--gold)}
.hero p{color:var(--muted);font-size:1rem;max-width:540px;margin:0 auto 36px;line-height:1.7}
.hero-stats{display:flex;justify-content:center;gap:48px;flex-wrap:wrap}
.hero-stat{text-align:center}
.hero-stat .num{font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:700;color:var(--gold)}
.hero-stat .label{color:var(--muted);font-size:0.8rem;margin-top:2px}
.filters-wrap{padding:28px 40px 0;display:flex;gap:10px;flex-wrap:wrap;justify-content:center}
.filter-btn{background:transparent;border:1px solid var(--navy-border);color:var(--muted);padding:7px 16px;border-radius:100px;font-family:'DM Sans',sans-serif;font-size:0.83rem;font-weight:500;cursor:pointer;transition:all 0.2s}
.filter-btn:hover{border-color:var(--gold);color:var(--gold)}
.filter-btn.active{background:var(--gold);color:#0a0f1e;border-color:var(--gold);font-weight:600}
.section-title{font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:900;color:var(--white);padding:44px 40px 20px;display:flex;align-items:center;gap:14px}
.section-title::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,var(--navy-border),transparent)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:22px;padding:0 40px 44px}
.card{background:var(--navy-card);border:1px solid var(--navy-border);border-radius:14px;overflow:hidden;transition:transform 0.25s,border-color 0.25s,box-shadow 0.25s;cursor:pointer;position:relative}
.card:hover{transform:translateY(-4px);border-color:rgba(201,168,76,0.5);box-shadow:0 12px 40px rgba(0,0,0,0.4)}
.card-preview{height:200px;overflow:hidden;position:relative;background:#fff}
.preview-inner{transform:scale(0.4) translateY(-2px);transform-origin:top left;width:250%;pointer-events:none;user-select:none}
.card-preview-overlay{position:absolute;inset:0;z-index:2;background:linear-gradient(to bottom,transparent 40%,rgba(10,15,30,0.95) 100%)}
.card-badge{position:absolute;top:10px;right:10px;z-index:3;background:rgba(10,15,30,0.85);border:1px solid var(--gold);color:var(--gold);font-size:0.66rem;font-weight:700;padding:3px 10px;border-radius:100px;letter-spacing:0.06em;text-transform:uppercase}
.card-body{padding:16px 18px 18px}
.card-cat{display:flex;align-items:center;gap:7px;margin-bottom:5px}
.card-cat-name{font-size:0.7rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--gold)}
.card-title{font-family:'Playfair Display',serif;font-size:1rem;font-weight:700;color:var(--white);margin-bottom:5px}
.card-desc{color:var(--muted);font-size:0.8rem;line-height:1.5;margin-bottom:14px}
.card-actions{display:flex;gap:8px}
.btn-preview{flex:1;background:transparent;border:1px solid var(--navy-border);color:var(--muted);padding:8px 0;border-radius:7px;font-family:'DM Sans',sans-serif;font-size:0.8rem;font-weight:500;cursor:pointer;transition:all 0.2s}
.btn-preview:hover{border-color:var(--gold);color:var(--gold)}
.btn-use{flex:2;background:var(--gold);color:#0a0f1e;border:none;padding:8px 0;border-radius:7px;font-family:'DM Sans',sans-serif;font-size:0.8rem;font-weight:700;cursor:pointer;transition:all 0.2s}
.btn-use:hover{background:var(--gold-light)}
.section-divider{border:none;border-top:1px solid var(--navy-border);margin:4px 40px}
footer{border-top:1px solid var(--navy-border);padding:28px 40px;text-align:center;color:var(--muted);font-size:0.8rem}
footer span{color:var(--gold)}
.cv-exec-header{background:#1a1a2e;color:#fff;padding:32px 36px 22px;border-bottom:4px solid #c9a84c;text-align:center}
.cv-exec-name{font-size:28px;font-weight:700;letter-spacing:0.08em;margin-bottom:6px;color:#fff;text-transform:uppercase}
.cv-exec-title{font-size:11px;color:#c9a84c;letter-spacing:0.14em;text-transform:uppercase;font-weight:600;margin-bottom:12px}
.cv-exec-body{padding:22px 36px;background:#fff;color:#1a1a2e;font-family:Georgia,serif}
.cv-exec-section-title{font-size:10px;font-weight:900;letter-spacing:0.14em;text-transform:uppercase;color:#1a1a2e;margin-bottom:8px;padding-bottom:5px;border-bottom:2px solid #c9a84c}
.cv-exec-summary{font-size:10px;color:#333;line-height:1.6;margin-bottom:14px}
.cv-exec-job-title{font-size:11px;font-weight:700;color:#1a1a2e}
.cv-exec-job-co{font-size:10px;color:#555}
.cv-exec-skill-item{font-size:10px;color:#333;padding:3px 8px;background:#f0f0f8;border-radius:3px;margin-bottom:3px;border-left:3px solid #c9a84c}
.cv-ats-header{padding:26px 30px 14px;border-bottom:3px solid #2563eb;text-align:center;background:#f8faff}
.cv-ats-name{font-size:26px;font-weight:900;margin-bottom:4px;letter-spacing:0.06em;text-transform:uppercase;color:#111}
.cv-ats-kw{background:#eff6ff;color:#1d4ed8;border:1px solid #bfdbfe;font-size:9px;font-weight:600;padding:2px 6px;border-radius:3px}
.cv-ats-body{padding:12px 30px;background:#fff;color:#111;font-family:Arial,sans-serif}
.cv-ats-section-title{font-size:10px;font-weight:900;letter-spacing:0.14em;text-transform:uppercase;color:#1d4ed8;margin-bottom:6px;padding-bottom:4px;border-bottom:2px solid #2563eb}
.cv-mod-sidebar{background:#1e1e2f;padding:22px 14px;display:flex;flex-direction:column;gap:16px}
.cv-mod-name{font-size:14px;font-weight:900;color:#fff;margin-bottom:3px;letter-spacing:0.04em;text-transform:uppercase}
.cv-mod-job-title-s{font-size:8px;color:#c9a84c;letter-spacing:0.14em;text-transform:uppercase;font-weight:600}
.cv-mod-side-title{font-size:8px;font-weight:900;letter-spacing:0.14em;text-transform:uppercase;color:#c9a84c;margin-bottom:6px;padding-bottom:3px;border-bottom:1px solid #2d3548}
.cv-mod-bar-bg{background:#2d3548;border-radius:3px;height:3px;margin-bottom:5px}
.cv-mod-bar-fill{background:#c9a84c;height:3px;border-radius:3px}
.cv-mod-main{padding:18px 16px;background:#fff;color:#1e1e2f;font-family:'Segoe UI',sans-serif}
.cv-mod-section-title-m{font-size:9px;font-weight:900;letter-spacing:0.14em;text-transform:uppercase;color:#1e1e2f;margin-bottom:6px;display:flex;align-items:center;gap:6px}
.cv-mod-section-title-m::before{content:'';width:18px;height:2px;background:#c9a84c;border-radius:2px;flex-shrink:0}
.cl-tech-header{background:#1e293b;padding:18px 28px;display:flex;justify-content:space-between;align-items:center}
.cl-tech-accent{height:3px;background:linear-gradient(90deg,#2563eb,#7c3aed)}
.cl-tech-body{padding:20px 28px;background:#fff;color:#111;font-family:Arial,sans-serif}
.cl-tech-bitem{font-size:10px;color:#333;padding:5px 10px;background:#f0f7ff;border-left:3px solid #2563eb;margin-bottom:5px;border-radius:0 4px 4px 0}
.modal-bg{position:fixed;inset:0;z-index:999;background:rgba(5,8,18,0.93);display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity 0.2s;padding:20px}
.modal-bg.open{opacity:1;pointer-events:all}
.modal{background:var(--navy-card);border:1px solid var(--navy-border);border-radius:18px;width:100%;max-width:760px;max-height:90vh;overflow:hidden;display:flex;flex-direction:column;transform:scale(0.95);transition:transform 0.2s;box-shadow:0 40px 100px rgba(0,0,0,0.7)}
.modal-bg.open .modal{transform:scale(1)}
.modal-header{padding:18px 22px;border-bottom:1px solid var(--navy-border);display:flex;justify-content:space-between;align-items:center}
.modal-title{font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:700;color:var(--white)}
.modal-subtitle{color:var(--muted);font-size:0.8rem;margin-top:2px}
.modal-close{background:rgba(255,255,255,0.07);border:none;color:var(--muted);width:34px;height:34px;border-radius:8px;cursor:pointer;font-size:1.1rem;display:flex;align-items:center;justify-content:center}
.modal-close:hover{background:rgba(255,255,255,0.12);color:var(--white)}
.modal-preview{flex:1;overflow-y:auto;background:#e8ecf0;position:relative;padding:20px;user-select:none;-webkit-user-select:none}
.modal-doc{max-width:660px;margin:0 auto;background:#fff;box-shadow:0 4px 24px rgba(0,0,0,0.2);border-radius:4px;overflow:hidden}
.modal-watermark{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-35deg);font-size:70px;font-weight:900;color:rgba(201,168,76,0.06);pointer-events:none;z-index:5;white-space:nowrap;font-family:'Playfair Display',serif;user-select:none}
.modal-footer{padding:14px 22px;border-top:1px solid var(--navy-border);display:flex;gap:10px;align-items:center;justify-content:flex-end}
.modal-copy{flex:1;color:var(--muted);font-size:0.73rem}
</style>
</head>
<body>
<nav>
  <a class="nav-logo" href="#">CV<span style="color:#fff">Edge</span></a>
  <div class="nav-links">
    <a href="/">Home</a>
    <a href="/cv-builder">CV Builder</a>
    <a href="/samples" style="color:var(--gold)">Templates</a>
    <a href="/pricing">Pricing</a>
    <a href="/cv-builder" class="nav-cta">Get Started</a>
  </div>
</nav>

<div class="hero">
  <div class="hero-badge">✦ Premium CV Library</div>
  <h1>Pick a Template.<br><span>Land the Interview.</span></h1>
  <p>Browse our professionally crafted CV and cover letter templates. Select one and your personalised document is ready in minutes.</p>
  <div class="hero-stats">
    <div class="hero-stat"><div class="num">18+</div><div class="label">Templates Available</div></div>
    <div class="hero-stat"><div class="num">ATS</div><div class="label">Optimised</div></div>
    <div class="hero-stat"><div class="num">EU</div><div class="label">Europass Ready</div></div>
    <div class="hero-stat"><div class="num">2min</div><div class="label">Edit Time</div></div>
  </div>
</div>

<div class="filters-wrap">
  <button class="filter-btn active" onclick="filterCards('all',this)">All Templates</button>
  <button class="filter-btn" onclick="filterCards('executive',this)">Executive CV</button>
  <button class="filter-btn" onclick="filterCards('ats',this)">ATS-Optimized</button>
  <button class="filter-btn" onclick="filterCards('modern',this)">Modern Pro</button>
  <button class="filter-btn" onclick="filterCards('creative',this)">Creative</button>
  <button class="filter-btn" onclick="filterCards('minimal',this)">Minimalist</button>
  <button class="filter-btn" onclick="filterCards('cover',this)">Cover Letters</button>
</div>

<div class="section-title"><span>👔</span> Executive CV Templates</div>
<div class="grid">
  <div class="card" data-cat="executive">
    <div class="card-preview">
      <div class="preview-inner">
        <div class="cv-exec-header">
          <div class="cv-exec-name">JONATHAN ASHFORD</div>
          <div class="cv-exec-title">Chief Executive Officer · Strategic Leadership</div>
          <div style="display:flex;gap:16px;font-size:9px;color:#aab;flex-wrap:wrap;justify-content:center"><span>📧 j.ashford@email.com</span><span>📞 +44 7700 900123</span><span>📍 London, UK</span></div>
        </div>
        <div class="cv-exec-body">
          <div style="margin-bottom:16px">
            <div class="cv-exec-section-title">Executive Summary</div>
            <div class="cv-exec-summary">Visionary CEO with 18+ years driving multi-million pound transformations across FTSE 250 organisations. Proven record of scaling teams from 50 to 2,000+, orchestrating three successful IPOs, and delivering sustained double-digit revenue growth.</div>
          </div>
          <div style="margin-bottom:16px">
            <div class="cv-exec-section-title">Career Progression</div>
            <div style="margin-bottom:10px">
              <div style="display:flex;justify-content:space-between"><div><div class="cv-exec-job-title">Chief Executive Officer</div><div class="cv-exec-job-co">GlobalNex Holdings Plc</div></div><div style="font-size:9px;color:#999">2018–Present</div></div>
              <ul style="margin-top:5px;padding-left:12px"><li style="font-size:9px;color:#444;line-height:1.5;margin-bottom:2px">Spearheaded £240M digital transformation; improved margin by 18%</li><li style="font-size:9px;color:#444;line-height:1.5">Led acquisition of 3 assets, expanding to 14 countries</li></ul>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
            <div><div class="cv-exec-section-title">Core Competencies</div><div class="cv-exec-skill-item">P&amp;L Management (£500M+)</div><div class="cv-exec-skill-item">M&amp;A Strategy</div><div class="cv-exec-skill-item">Board Communication</div></div>
            <div><div class="cv-exec-section-title">Education</div><div style="font-size:10px;font-weight:700">MBA, Finance &amp; Strategy</div><div style="font-size:9px;color:#666">London Business School · 2005</div></div>
          </div>
        </div>
      </div>
      <div class="card-preview-overlay"></div>
    </div>
    <div class="card-badge">EXECUTIVE</div>
    <div class="card-body">
      <div class="card-cat"><span>👔</span><span class="card-cat-name">Executive CV</span></div>
      <div class="card-title">Executive Classic — Dark Navy</div>
      <div class="card-desc">Bold dark header with gold accents. Ideal for C-suite and Director-level roles.</div>
      <div class="card-actions">
        <button class="btn-preview" onclick="openModal('exec-classic')">👁 Preview</button>
        <button class="btn-use" onclick="window.top.location.href='/cv-builder'">✦ Select &amp; Edit</button>
      </div>
    </div>
  </div>

  <div class="card" data-cat="executive">
    <div class="card-preview">
      <div class="preview-inner">
        <div class="cv-exec-header" style="background:#2c1810;border-color:#b8860b">
          <div class="cv-exec-name">MARGARET WORTHINGTON</div>
          <div class="cv-exec-title" style="color:#b8860b">Non-Executive Director · Corporate Governance</div>
          <div style="display:flex;gap:16px;font-size:9px;color:#aab;justify-content:center"><span>📧 m.worthington@email.com</span><span>📍 Edinburgh</span></div>
        </div>
        <div class="cv-exec-body">
          <div style="margin-bottom:16px"><div class="cv-exec-section-title" style="border-color:#2c1810">Board Profile</div><div class="cv-exec-summary">Distinguished NED with 22 years of board-level experience. Championed governance reforms reducing regulatory risk exposure by £180M.</div></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
            <div><div class="cv-exec-section-title" style="border-color:#2c1810">Expertise</div><div class="cv-exec-skill-item" style="border-color:#b8860b">Corporate Governance</div><div class="cv-exec-skill-item" style="border-color:#b8860b">Risk &amp; Compliance</div></div>
            <div><div class="cv-exec-section-title" style="border-color:#2c1810">Qualifications</div><div style="font-size:10px;font-weight:700">FCA, Chartered Accountants</div><div style="font-size:9px;color:#666">Edinburgh · 2001</div></div>
          </div>
        </div>
      </div>
      <div class="card-preview-overlay"></div>
    </div>
    <div class="card-badge">EXECUTIVE</div>
    <div class="card-body">
      <div class="card-cat"><span>👔</span><span class="card-cat-name">Executive CV</span></div>
      <div class="card-title">Boardroom Edition — Deep Brown</div>
      <div class="card-desc">Rich deep-brown header with antique gold. For NED and board-level appointments.</div>
      <div class="card-actions">
        <button class="btn-preview" onclick="openModal('exec-boardroom')">👁 Preview</button>
        <button class="btn-use" onclick="window.top.location.href='/cv-builder'">✦ Select &amp; Edit</button>
      </div>
    </div>
  </div>
</div>

<hr class="section-divider">
<div class="section-title"><span>🤖</span> ATS-Optimised CV Templates</div>
<div class="grid">
  <div class="card" data-cat="ats">
    <div class="card-preview">
      <div class="preview-inner">
        <div class="cv-ats-header">
          <div class="cv-ats-name">SARAH OKEKE</div>
          <div style="font-size:9px;color:#555;margin-bottom:8px;text-align:center">sarah@email.com · +44 7900 112233 · Manchester</div>
          <div style="display:inline-flex;align-items:center;gap:5px;background:#f0fdf4;border:1px solid #86efac;color:#15803d;font-size:8px;font-weight:700;padding:2px 8px;border-radius:100px;margin-bottom:7px">✅ ATS Score: 97/100</div>
          <div style="display:flex;flex-wrap:wrap;gap:4px;justify-content:center"><span class="cv-ats-kw">Project Management</span><span class="cv-ats-kw">Agile</span><span class="cv-ats-kw">PMP Certified</span><span class="cv-ats-kw">Scrum</span></div>
        </div>
        <div class="cv-ats-body">
          <div style="margin-bottom:14px"><div class="cv-ats-section-title">Professional Summary</div><p style="font-size:10px;line-height:1.6;color:#333">Results-driven Project Manager with 10 years delivering complex technology programmes. PMP certified. 98% client satisfaction across 40+ enterprise projects.</p></div>
          <div><div class="cv-ats-section-title">Experience</div>
            <div style="margin-bottom:8px"><div style="display:flex;justify-content:space-between"><div style="font-size:10px;font-weight:700">Senior Project Manager</div><div style="font-size:8px;color:#888">2020–Present</div></div><div style="font-size:9px;color:#555">Barclays Bank · Manchester</div><ul style="padding-left:12px;margin-top:4px"><li style="font-size:9px;color:#333;line-height:1.5">Managed £12M banking migration; 3 months ahead of schedule</li></ul></div>
          </div>
        </div>
      </div>
      <div class="card-preview-overlay"></div>
    </div>
    <div class="card-badge">ATS 97%</div>
    <div class="card-body">
      <div class="card-cat"><span>🤖</span><span class="card-cat-name">ATS-Optimised</span></div>
      <div class="card-title">ATS Pro — Clean Blue</div>
      <div class="card-desc">Keyword-rich, machine-readable layout proven to pass applicant tracking systems.</div>
      <div class="card-actions">
        <button class="btn-preview" onclick="openModal('ats-pro')">👁 Preview</button>
        <button class="btn-use" onclick="window.top.location.href='/cv-builder'">✦ Select &amp; Edit</button>
      </div>
    </div>
  </div>

  <div class="card" data-cat="ats">
    <div class="card-preview">
      <div class="preview-inner">
        <div class="cv-ats-header" style="border-color:#059669;background:#f0fdf9">
          <div class="cv-ats-name">DANIEL MWANGI</div>
          <div style="font-size:9px;color:#555;margin-bottom:8px;text-align:center">daniel@email.com · Nairobi, KE</div>
          <div style="display:inline-flex;align-items:center;background:#f0fdf4;border:1px solid #86efac;color:#15803d;font-size:8px;font-weight:700;padding:2px 8px;border-radius:100px;margin-bottom:7px">✅ ATS Score: 94/100</div>
          <div style="display:flex;flex-wrap:wrap;gap:4px;justify-content:center"><span class="cv-ats-kw" style="background:#f0fdf4;color:#15803d;border-color:#86efac">KYC/AML</span><span class="cv-ats-kw" style="background:#f0fdf4;color:#15803d;border-color:#86efac">Credit Analysis</span><span class="cv-ats-kw" style="background:#f0fdf4;color:#15803d;border-color:#86efac">Banking</span></div>
        </div>
        <div class="cv-ats-body">
          <div style="margin-bottom:14px"><div class="cv-ats-section-title" style="color:#059669;border-color:#059669">Professional Summary</div><p style="font-size:10px;line-height:1.6;color:#333">Banking professional with 8 years across retail and corporate banking. Track record of exceeding targets by 120%+ while maintaining full compliance.</p></div>
        </div>
      </div>
      <div class="card-preview-overlay"></div>
    </div>
    <div class="card-badge">ATS 94%</div>
    <div class="card-body">
      <div class="card-cat"><span>🤖</span><span class="card-cat-name">ATS-Optimised</span></div>
      <div class="card-title">ATS Banking &amp; Finance</div>
      <div class="card-desc">Finance-sector keywords and compliance-ready layout. Green accent variant.</div>
      <div class="card-actions">
        <button class="btn-preview" onclick="openModal('ats-banking')">👁 Preview</button>
        <button class="btn-use" onclick="window.top.location.href='/cv-builder'">✦ Select &amp; Edit</button>
      </div>
    </div>
  </div>
</div>

<hr class="section-divider">
<div class="section-title"><span>💼</span> Modern Professional CV</div>
<div class="grid">
  <div class="card" data-cat="modern">
    <div class="card-preview">
      <div class="preview-inner">
        <div style="display:grid;grid-template-columns:180px 1fr;min-height:700px;font-family:'Segoe UI',sans-serif">
          <div class="cv-mod-sidebar">
            <div style="text-align:center"><div style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#667eea,#764ba2);border:3px solid #c9a84c;margin:0 auto 8px;display:flex;align-items:center;justify-content:center;font-size:22px">👤</div><div class="cv-mod-name">PRIYA SHARMA</div><div class="cv-mod-job-title-s">Marketing Director</div></div>
            <div><div class="cv-mod-side-title">Contact</div><div style="font-size:9px;color:#aab4cc;margin-bottom:3px">📧 priya@email.com</div><div style="font-size:9px;color:#aab4cc">📍 Mumbai, India</div></div>
            <div><div class="cv-mod-side-title">Skills</div>
              <div style="font-size:9px;color:#ccd;margin-bottom:2px">Brand Strategy</div><div class="cv-mod-bar-bg"><div class="cv-mod-bar-fill" style="width:95%"></div></div>
              <div style="font-size:9px;color:#ccd;margin-bottom:2px">Digital Marketing</div><div class="cv-mod-bar-bg"><div class="cv-mod-bar-fill" style="width:88%"></div></div>
              <div style="font-size:9px;color:#ccd;margin-bottom:2px">Analytics</div><div class="cv-mod-bar-bg"><div class="cv-mod-bar-fill" style="width:75%"></div></div>
            </div>
          </div>
          <div class="cv-mod-main">
            <div style="margin-bottom:14px"><div class="cv-mod-section-title-m">Profile</div><div style="font-size:10px;color:#444;line-height:1.6">Creative marketing leader with 12 years driving brand growth. Expert in integrated campaigns generating £45M+ incremental revenue.</div></div>
            <div><div class="cv-mod-section-title-m">Experience</div>
              <div style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;align-items:flex-start"><div><div style="font-size:11px;font-weight:700;color:#1e1e2f">Marketing Director</div><div style="font-size:9px;color:#667eea;font-weight:600">Unilever</div></div><div style="font-size:8px;color:#fff;background:#667eea;padding:2px 6px;border-radius:8px">2020–Now</div></div><ul style="padding-left:12px;margin-top:5px"><li style="font-size:9px;color:#444;line-height:1.5">Led rebranding of 4 product lines; brand equity up 34%</li></ul></div>
            </div>
          </div>
        </div>
      </div>
      <div class="card-preview-overlay"></div>
    </div>
    <div class="card-badge">MODERN</div>
    <div class="card-body">
      <div class="card-cat"><span>💼</span><span class="card-cat-name">Modern Professional</span></div>
      <div class="card-title">Modern Pro — Dark Sidebar</div>
      <div class="card-desc">Two-column layout with skill bars and dark sidebar. Elegant and distinctive.</div>
      <div class="card-actions">
        <button class="btn-preview" onclick="openModal('modern-pro')">👁 Preview</button>
        <button class="btn-use" onclick="window.top.location.href='/cv-builder'">✦ Select &amp; Edit</button>
      </div>
    </div>
  </div>
</div>

<hr class="section-divider">
<div class="section-title"><span>🎨</span> Creative &amp; Minimalist</div>
<div class="grid">
  <div class="card" data-cat="creative">
    <div class="card-preview">
      <div class="preview-inner">
        <div style="background:linear-gradient(135deg,#1a0a2e,#3d1080,#7c3aed);padding:28px 32px 22px;text-align:center">
          <div style="display:inline-block;background:rgba(255,255,255,0.15);color:#e9d5ff;font-size:8px;font-weight:600;padding:2px 10px;border-radius:100px;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:8px">Creative Portfolio</div>
          <div style="font-size:26px;font-weight:900;color:#fff;margin-bottom:3px;text-transform:uppercase">ZARA FONTAINE</div>
          <div style="font-size:11px;color:#c4b5fd;margin-bottom:12px">Brand Designer &amp; Creative Director</div>
          <div style="display:flex;gap:12px;font-size:9px;color:#ddd6fe;justify-content:center;flex-wrap:wrap"><span>✉️ zara@email.com</span><span>📍 Paris, France</span></div>
        </div>
        <div style="display:grid;grid-template-columns:160px 1fr">
          <div style="background:#f5f0ff;padding:16px 12px;border-right:2px solid #e9d5ff">
            <div style="font-size:8px;font-weight:900;letter-spacing:0.14em;text-transform:uppercase;color:#7c3aed;margin-bottom:6px">Skills</div>
            <div><span style="background:linear-gradient(90deg,#7c3aed,#a855f7);color:#fff;font-size:8px;padding:2px 8px;border-radius:100px;display:inline-block;margin-bottom:3px">Figma</span></div>
            <div><span style="background:linear-gradient(90deg,#7c3aed,#a855f7);color:#fff;font-size:8px;padding:2px 8px;border-radius:100px;display:inline-block;margin-bottom:3px">Adobe Suite</span></div>
            <div><span style="background:linear-gradient(90deg,#7c3aed,#a855f7);color:#fff;font-size:8px;padding:2px 8px;border-radius:100px;display:inline-block;margin-bottom:3px">Brand Identity</span></div>
            <div><span style="background:linear-gradient(90deg,#7c3aed,#a855f7);color:#fff;font-size:8px;padding:2px 8px;border-radius:100px;display:inline-block">UI/UX</span></div>
          </div>
          <div style="padding:16px 14px;background:#fff">
            <div style="font-size:9px;font-weight:900;letter-spacing:0.12em;text-transform:uppercase;color:#7c3aed;margin-bottom:6px">About</div>
            <div style="font-size:10px;color:#333;line-height:1.6">Award-winning creative director with 10 years building unforgettable brands. Clients include Chanel, LVMH, and Spotify.</div>
            <div style="font-size:9px;font-weight:900;letter-spacing:0.12em;text-transform:uppercase;color:#7c3aed;margin:10px 0 6px">Experience</div>
            <div style="font-size:10px;font-weight:700;color:#1a0a2e">Creative Director — Publicis</div>
            <div style="font-size:9px;color:#7c3aed">2020–Present · Paris</div>
          </div>
        </div>
      </div>
      <div class="card-preview-overlay"></div>
    </div>
    <div class="card-badge">CREATIVE</div>
    <div class="card-body">
      <div class="card-cat"><span>🎨</span><span class="card-cat-name">Creative CV</span></div>
      <div class="card-title">Creative Purple Gradient</div>
      <div class="card-desc">Bold gradient header with portfolio sidebar. Built for designers and creatives.</div>
      <div class="card-actions">
        <button class="btn-preview" onclick="openModal('creative-purple')">👁 Preview</button>
        <button class="btn-use" onclick="window.top.location.href='/cv-builder'">✦ Select &amp; Edit</button>
      </div>
    </div>
  </div>

  <div class="card" data-cat="minimal">
    <div class="card-preview">
      <div class="preview-inner">
        <div style="font-family:'Helvetica Neue',sans-serif;color:#111;background:#fff;padding:32px 36px">
          <div style="font-size:26px;font-weight:900;letter-spacing:0.14em;text-transform:uppercase;text-align:center">OLIVER HAYES</div>
          <div style="font-size:9px;color:#999;letter-spacing:0.18em;text-transform:uppercase;margin-bottom:10px;text-align:center">Strategic Consultant</div>
          <div style="width:28px;height:2px;background:#111;margin:0 auto 14px"></div>
          <div style="display:flex;gap:16px;font-size:9px;color:#777;margin-bottom:22px;flex-wrap:wrap;justify-content:center"><span>oliver@email.com</span><span>London, UK</span><span>linkedin.com/in/ohayes</span></div>
          <div style="margin-bottom:18px"><div style="font-size:8px;font-weight:900;letter-spacing:0.2em;text-transform:uppercase;color:#111;margin-bottom:8px;padding-bottom:4px;border-bottom:2px solid #111">Profile</div><p style="font-size:10px;color:#444;line-height:1.7">Management consultant with 11 years advising FTSE 100 and Fortune 500 on strategy, operations, and digital transformation. Oxford-educated. McKinsey alumni.</p></div>
          <div><div style="font-size:8px;font-weight:900;letter-spacing:0.2em;text-transform:uppercase;color:#111;margin-bottom:8px;padding-bottom:4px;border-bottom:2px solid #111">Experience</div>
            <div style="display:grid;grid-template-columns:80px 1fr;gap:10px;margin-bottom:12px"><div style="font-size:9px;color:#999">2019–Now</div><div><div style="font-size:11px;font-weight:600;color:#111">Associate Partner</div><div style="font-size:9px;color:#777">McKinsey &amp; Company · London</div><ul style="padding-left:0;margin-top:5px;list-style:none"><li style="font-size:9px;color:#444;padding-left:10px;position:relative">Led operating model redesign; delivered £95M savings</li></ul></div></div>
          </div>
        </div>
      </div>
      <div class="card-preview-overlay"></div>
    </div>
    <div class="card-badge">MINIMAL</div>
    <div class="card-body">
      <div class="card-cat"><span>⬜</span><span class="card-cat-name">Minimalist CV</span></div>
      <div class="card-title">Pure Minimalist — White Space</div>
      <div class="card-desc">Typography-first design. Whisper-quiet layout that lets your career speak.</div>
      <div class="card-actions">
        <button class="btn-preview" onclick="openModal('minimal-pure')">👁 Preview</button>
        <button class="btn-use" onclick="window.top.location.href='/cv-builder'">✦ Select &amp; Edit</button>
      </div>
    </div>
  </div>
</div>

<hr class="section-divider">
<div class="section-title"><span>✉️</span> Cover Letter Examples</div>
<div class="grid">
  <div class="card" data-cat="cover">
    <div class="card-preview">
      <div class="preview-inner">
        <div style="font-family:Georgia,serif;color:#1a1a2e;background:#fff;padding:32px 36px">
          <div style="text-align:center;font-family:Arial,sans-serif;font-size:16px;font-weight:900;color:#1a1a2e;margin-bottom:5px;letter-spacing:0.06em">CV<span style="color:#c9a84c">Edge</span></div>
          <div style="width:32px;height:3px;background:#c9a84c;margin:0 auto 18px;border-radius:2px"></div>
          <div style="font-size:9px;color:#555;margin-bottom:14px;line-height:1.6">James Adebayo<br>Lagos, Nigeria · james@email.com</div>
          <div style="font-size:11px;font-weight:900;color:#1a1a2e;margin-bottom:14px;padding:8px 12px;background:#fdf9ee;border-left:4px solid #c9a84c;border-radius:0 4px 4px 0">Re: <span style="color:#c9a84c">Senior Relationship Manager</span></div>
          <p style="font-size:10px;color:#333;line-height:1.75;margin-bottom:10px">Dear Hiring Manager,</p>
          <p style="font-size:10px;color:#333;line-height:1.75;margin-bottom:10px">I am writing to express my strong interest in the <strong style="color:#c9a84c">Senior Relationship Manager</strong> role at Standard Chartered Bank. With <strong style="color:#c9a84c">nine years of progressive experience</strong> in corporate banking, I am confident in my ability to contribute meaningfully.</p>
          <p style="font-size:10px;color:#333;line-height:1.75">In my current role, I manage a <strong style="color:#c9a84c">KES 3.8B corporate portfolio</strong> and have delivered <strong style="color:#c9a84c">131% of my annual lending target</strong> for three consecutive years.</p>
        </div>
      </div>
      <div class="card-preview-overlay"></div>
    </div>
    <div class="card-badge">COVER LETTER</div>
    <div class="card-body">
      <div class="card-cat"><span>✉️</span><span class="card-cat-name">Cover Letter</span></div>
      <div class="card-title">Banking &amp; Finance — Executive Tone</div>
      <div class="card-desc">Formal, achievement-led cover letter. Ideal for banking and corporate finance.</div>
      <div class="card-actions">
        <button class="btn-preview" onclick="openModal('cl-banking')">👁 Preview</button>
        <button class="btn-use" onclick="window.top.location.href='/cover-letter'">✦ Select &amp; Edit</button>
      </div>
    </div>
  </div>

  <div class="card" data-cat="cover">
    <div class="card-preview">
      <div class="preview-inner">
        <div class="cl-tech-header">
          <div><div style="font-size:15px;font-weight:700;color:#fff">AMARA DIALLO</div><div style="font-size:9px;color:#94a3b8;margin-top:2px">Full-Stack Software Engineer</div></div>
          <div style="text-align:right;font-size:9px;color:#94a3b8;line-height:1.6">amara@email.com<br>Paris, France</div>
        </div>
        <div class="cl-tech-accent"></div>
        <div class="cl-tech-body">
          <div style="font-size:11px;font-weight:700;margin-bottom:14px">Application: Senior Software Engineer — Payments Infrastructure</div>
          <p style="font-size:10px;color:#333;line-height:1.75;margin-bottom:10px">I am applying for the Senior Software Engineer position. With six years of backend engineering and focus on high-availability distributed systems, I am drawn to Stripe's mission.</p>
          <div class="cl-tech-bitem">Built payment engine handling 2.4M transactions/day at 99.98% uptime</div>
          <div class="cl-tech-bitem">Reduced API latency by 65% through async processing</div>
          <div class="cl-tech-bitem">Zero downtime microservices on AWS ECS for 18 months</div>
        </div>
      </div>
      <div class="card-preview-overlay"></div>
    </div>
    <div class="card-badge">COVER LETTER</div>
    <div class="card-body">
      <div class="card-cat"><span>✉️</span><span class="card-cat-name">Cover Letter</span></div>
      <div class="card-title">Tech &amp; Engineering — Achievement Focus</div>
      <div class="card-desc">Bulleted achievement format with blue accent. Perfect for technical roles.</div>
      <div class="card-actions">
        <button class="btn-preview" onclick="openModal('cl-tech')">👁 Preview</button>
        <button class="btn-use" onclick="window.top.location.href='/cover-letter'">✦ Select &amp; Edit</button>
      </div>
    </div>
  </div>
</div>

<footer>
  <div style="font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:700;color:var(--gold);margin-bottom:6px">CVEdge</div>
  <p>© 2026 CVEdge · Professional CV &amp; Cover Letter Services</p>
  <p style="margin-top:4px">Built with <span>♥</span> for job seekers worldwide.</p>
</footer>

<div class="modal-bg" id="modalBg" onclick="closeModalIfBg(event)">
  <div class="modal">
    <div class="modal-header">
      <div><div class="modal-title" id="modalTitle">Template Preview</div><div class="modal-subtitle" id="modalSubtitle">Protected Preview — CVEdge</div></div>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-preview" id="modalPreview">
      <div class="modal-watermark">CVEdge</div>
      <div class="modal-doc" id="modalDoc"></div>
    </div>
    <div class="modal-footer">
      <div class="modal-copy">🔒 Preview protected. No copying or downloading.</div>
      <button class="btn-preview" onclick="closeModal()">Close</button>
      <button class="btn-use" onclick="window.top.location.href='/cv-builder'">✦ Use This Template</button>
    </div>
  </div>
</div>

<script>
document.addEventListener('contextmenu',e=>e.preventDefault());
document.addEventListener('selectstart',e=>{if(e.target.closest('.modal-preview'))e.preventDefault();});

function filterCards(cat,btn){
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.card').forEach(card=>{
    card.style.display=(cat==='all'||card.dataset.cat===cat)?'':'none';
  });
  document.querySelectorAll('.section-title').forEach(sec=>{
    const grid=sec.nextElementSibling;
    if(grid&&grid.classList.contains('grid')){
      const vis=[...grid.querySelectorAll('.card')].some(c=>c.style.display!=='none');
      sec.style.display=(vis||cat==='all')?'':'none';
    }
  });
}

function openModal(key){
  const card=document.querySelector('[onclick*="'+key+'"]').closest('.card');
  if(!card)return;
  const title=card.querySelector('.card-title').textContent;
  const cat=card.querySelector('.card-cat-name').textContent;
  document.getElementById('modalTitle').textContent=title;
  document.getElementById('modalSubtitle').textContent=cat+' · Protected Preview';
  const preview=card.querySelector('.preview-inner').innerHTML;
  document.getElementById('modalDoc').innerHTML=preview;
  document.getElementById('modalBg').classList.add('open');
}

function closeModal(){
  document.getElementById('modalBg').classList.remove('open');
  document.getElementById('modalDoc').innerHTML='';
}

function closeModalIfBg(e){
  if(e.target===document.getElementById('modalBg'))closeModal();
}
</script>
</body>
</html>`}
        style={{ width: "100%", height: "100vh", border: "none" }}
        title="CV Templates"
        sandbox="allow-scripts"
      />
    </div>
  );
}
