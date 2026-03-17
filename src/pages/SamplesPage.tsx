export default function SamplesPage() {
  const html = String.raw`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CV Templates & Examples — CVEdge</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root {
    --navy: #0a0f1e; --navy-mid: #111827; --navy-card: #141c2e;
    --navy-border: #1e2d4a; --gold: #c9a84c; --gold-light: #e8c97a;
    --gold-dim: #7a6230; --white: #f0f4ff; --muted: #8899bb; --accent-blue: #2563eb;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: var(--navy); color: var(--white); font-family: 'DM Sans', sans-serif; min-height: 100vh; overflow-x: hidden; }
  nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; background: rgba(10,15,30,0.92); backdrop-filter: blur(12px); border-bottom: 1px solid var(--navy-border); display: flex; align-items: center; justify-content: space-between; padding: 0 40px; height: 64px; }
  .nav-logo { font-family: 'Playfair Display', serif; font-size: 1.5rem; font-weight: 700; color: var(--gold); text-decoration: none; letter-spacing: 0.02em; }
  .nav-links { display: flex; gap: 32px; align-items: center; }
  .nav-links a { color: var(--muted); text-decoration: none; font-size: 0.9rem; font-weight: 500; transition: color 0.2s; }
  .nav-links a:hover, .nav-links a.active { color: var(--gold); }
  .nav-cta { background: var(--gold); color: var(--navy) !important; padding: 8px 20px; border-radius: 6px; font-weight: 600 !important; }
  .hero { padding: 120px 40px 60px; text-align: center; background: radial-gradient(ellipse 80% 50% at 50% 0%, rgba(201,168,76,0.12) 0%, transparent 70%); }
  .hero-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.3); color: var(--gold); padding: 6px 16px; border-radius: 100px; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 24px; }
  .hero h1 { font-family: 'Playfair Display', serif; font-size: clamp(2.2rem, 5vw, 3.8rem); font-weight: 900; line-height: 1.1; margin-bottom: 16px; }
  .hero h1 span { color: var(--gold); }
  .hero p { color: var(--muted); font-size: 1.1rem; max-width: 560px; margin: 0 auto 40px; line-height: 1.7; }
  .hero-stats { display: flex; justify-content: center; gap: 48px; flex-wrap: wrap; }
  .hero-stat { text-align: center; }
  .hero-stat .num { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 700; color: var(--gold); }
  .hero-stat .label { color: var(--muted); font-size: 0.82rem; margin-top: 2px; }
  .filters-wrap { padding: 32px 40px 0; display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
  .filter-btn { background: transparent; border: 1px solid var(--navy-border); color: var(--muted); padding: 8px 18px; border-radius: 100px; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 500; cursor: pointer; transition: all 0.2s; }
  .filter-btn:hover { border-color: var(--gold); color: var(--gold); }
  .filter-btn.active { background: var(--gold); color: var(--navy); border-color: var(--gold); font-weight: 600; }
  .section-title { font-family: 'Playfair Display', serif; font-size: 1.5rem; font-weight: 900; color: var(--white); padding: 52px 40px 22px; display: flex; align-items: center; gap: 14px; letter-spacing: 0.01em; }
  .section-title::after { content: ''; flex: 1; height: 1px; background: linear-gradient(90deg, var(--navy-border), transparent); }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; padding: 0 40px 48px; }
  .card { background: var(--navy-card); border: 1px solid var(--navy-border); border-radius: 14px; overflow: hidden; transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s; cursor: pointer; position: relative; }
  .card:hover { transform: translateY(-4px); border-color: rgba(201,168,76,0.5); box-shadow: 0 12px 40px rgba(0,0,0,0.4); }
  .card-preview { height: 220px; overflow: hidden; position: relative; background: #fff; }
  .card-preview .preview-inner { transform: scale(0.42) translateY(-2px); transform-origin: top left; width: 238%; pointer-events: none; user-select: none; }
  .card-preview-overlay { position: absolute; inset: 0; z-index: 2; background: linear-gradient(to bottom, transparent 40%, rgba(10,15,30,0.95) 100%); }
  .card-badge { position: absolute; top: 10px; right: 10px; z-index: 3; background: rgba(10,15,30,0.8); border: 1px solid var(--gold); color: var(--gold); font-size: 0.68rem; font-weight: 700; padding: 3px 10px; border-radius: 100px; letter-spacing: 0.06em; text-transform: uppercase; }
  .card-body { padding: 18px 20px 20px; }
  .card-cat { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
  .card-cat-name { font-size: 0.72rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--gold); }
  .card-title { font-family: 'Playfair Display', serif; font-size: 1.05rem; font-weight: 700; color: var(--white); margin-bottom: 6px; }
  .card-desc { color: var(--muted); font-size: 0.82rem; line-height: 1.5; margin-bottom: 16px; }
  .card-actions { display: flex; gap: 8px; }
  .btn-preview { flex: 1; background: transparent; border: 1px solid var(--navy-border); color: var(--muted); padding: 9px 0; border-radius: 7px; font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 500; cursor: pointer; transition: all 0.2s; }
  .btn-preview:hover { border-color: var(--gold); color: var(--gold); }
  .btn-use { flex: 2; background: var(--gold); color: var(--navy); border: none; padding: 9px 0; border-radius: 7px; font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 700; cursor: pointer; transition: all 0.2s; }
  .btn-use:hover { background: var(--gold-light); }
  .modal-bg { position: fixed; inset: 0; z-index: 999; background: rgba(5,8,18,0.92); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: opacity 0.2s; padding: 20px; }
  .modal-bg.open { opacity: 1; pointer-events: all; }
  .modal { background: var(--navy-card); border: 1px solid var(--navy-border); border-radius: 18px; width: 100%; max-width: 800px; max-height: 92vh; overflow: hidden; display: flex; flex-direction: column; transform: scale(0.95); transition: transform 0.2s; box-shadow: 0 40px 100px rgba(0,0,0,0.7); }
  .modal-bg.open .modal { transform: scale(1); }
  .modal-header { padding: 20px 24px; border-bottom: 1px solid var(--navy-border); display: flex; justify-content: space-between; align-items: center; }
  .modal-title { font-family: 'Playfair Display', serif; font-size: 1.2rem; font-weight: 700; color: var(--white); }
  .modal-subtitle { color: var(--muted); font-size: 0.82rem; margin-top: 2px; }
  .modal-close { background: rgba(255,255,255,0.07); border: none; color: var(--muted); width: 36px; height: 36px; border-radius: 8px; cursor: pointer; font-size: 1.2rem; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
  .modal-close:hover { background: rgba(255,255,255,0.12); color: var(--white); }
  .modal-preview { flex: 1; overflow-y: auto; background: #e8ecf0; position: relative; padding: 24px; user-select: none; -webkit-user-select: none; }
  .modal-preview-doc { max-width: 680px; margin: 0 auto; background: #fff; box-shadow: 0 4px 24px rgba(0,0,0,0.2); border-radius: 4px; overflow: hidden; }
  .modal-watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-35deg); font-size: 80px; font-weight: 900; color: rgba(201,168,76,0.07); pointer-events: none; z-index: 5; letter-spacing: 0.1em; white-space: nowrap; font-family: 'Playfair Display', serif; user-select: none; }
  .modal-footer { padding: 16px 24px; border-top: 1px solid var(--navy-border); display: flex; gap: 12px; align-items: center; justify-content: flex-end; }
  .modal-copy-notice { flex: 1; color: var(--muted); font-size: 0.75rem; }
  .section-divider { border: none; border-top: 1px solid var(--navy-border); margin: 8px 40px; }
  footer { border-top: 1px solid var(--navy-border); padding: 32px 40px; text-align: center; color: var(--muted); font-size: 0.82rem; }
  footer span { color: var(--gold); }
  .cv-executive { font-family: 'Georgia', serif; color: #1a1a2e; background: #fff; }
  .cv-exec-header { background: #1a1a2e; color: #fff; padding: 40px 40px 28px; border-bottom: 5px solid #c9a84c; text-align: center; }
  .cv-exec-name { font-size: 34px; font-weight: 700; letter-spacing: 0.08em; margin-bottom: 8px; color: #fff; text-transform: uppercase; font-family: 'Georgia', serif; }
  .cv-exec-title { font-size: 13px; color: #c9a84c; letter-spacing: 0.16em; text-transform: uppercase; font-weight: 600; margin-bottom: 16px; }
  .cv-exec-contact { display: flex; gap: 20px; font-size: 11px; color: #aab; flex-wrap: wrap; justify-content: center; }
  .cv-exec-body { padding: 28px 40px; }
  .cv-exec-section { margin-bottom: 22px; }
  .cv-exec-section-title { font-size: 12px; font-weight: 900; letter-spacing: 0.14em; text-transform: uppercase; color: #1a1a2e; margin-bottom: 10px; padding-bottom: 7px; border-bottom: 2px solid #c9a84c; }
  .cv-exec-summary { font-size: 12px; color: #333; line-height: 1.65; }
  .cv-exec-job { margin-bottom: 14px; }
  .cv-exec-job-header { display: flex; justify-content: space-between; }
  .cv-exec-job-title { font-size: 13px; font-weight: 700; color: #1a1a2e; }
  .cv-exec-job-company { font-size: 12px; color: #555; }
  .cv-exec-job-date { font-size: 11px; color: #999; }
  .cv-exec-bullets { margin-top: 6px; padding-left: 14px; }
  .cv-exec-bullets li { font-size: 11px; color: #444; line-height: 1.5; margin-bottom: 3px; }
  .cv-exec-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .cv-exec-skill-item { font-size: 11px; color: #333; padding: 4px 10px; background: #f0f0f8; border-radius: 3px; margin-bottom: 4px; border-left: 3px solid #c9a84c; }
  .cv-ats { font-family: 'Arial', sans-serif; color: #111; background: #fff; }
  .cv-ats-header { padding: 32px 36px 18px; border-bottom: 3px solid #2563eb; text-align: center; background: linear-gradient(180deg, #f8faff 0%, #fff 100%); }
  .cv-ats-name { font-size: 30px; font-weight: 900; margin-bottom: 5px; letter-spacing: 0.06em; text-transform: uppercase; color: #111; }
  .cv-ats-contact { font-size: 11px; color: #555; margin-bottom: 12px; text-align: center; }
  .cv-ats-keywords { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; }
  .cv-ats-kw { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; font-size: 10px; font-weight: 600; padding: 3px 8px; border-radius: 3px; }
  .cv-ats-body { padding: 16px 36px; }
  .cv-ats-section { margin-bottom: 18px; }
  .cv-ats-section-title { font-size: 11px; font-weight: 900; letter-spacing: 0.14em; text-transform: uppercase; color: #1d4ed8; margin-bottom: 8px; padding-bottom: 5px; border-bottom: 2px solid #2563eb; }
  .cv-ats-p { font-size: 11px; line-height: 1.6; color: #333; }
  .cv-ats-job { margin-bottom: 12px; }
  .cv-ats-jrow { display: flex; justify-content: space-between; }
  .cv-ats-jname { font-size: 12px; font-weight: 700; }
  .cv-ats-jdate { font-size: 10px; color: #888; }
  .cv-ats-jco { font-size: 11px; color: #555; }
  .cv-ats-li { font-size: 10.5px; color: #333; line-height: 1.55; margin-bottom: 2px; }
  .cv-ats-skills { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 4px; }
  .cv-ats-skill { border: 1px solid #d1d5db; padding: 2px 8px; border-radius: 2px; font-size: 10px; color: #374151; }
  .cv-ats-score { display: inline-flex; align-items: center; gap: 6px; background: #f0fdf4; border: 1px solid #86efac; color: #15803d; font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 100px; margin-bottom: 10px; }
  .cv-modern { font-family: 'Segoe UI', sans-serif; color: #1e1e2f; background: #fff; display: grid; grid-template-columns: 220px 1fr; min-height: 900px; }
  .cv-mod-sidebar { background: #1e1e2f; padding: 28px 18px; display: flex; flex-direction: column; gap: 20px; }
  .cv-mod-photo { width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #667eea, #764ba2); border: 3px solid #c9a84c; margin: 0 auto 4px; display: flex; align-items: center; justify-content: center; font-size: 28px; }
  .cv-mod-name { font-size: 17px; font-weight: 900; color: #fff; margin-bottom: 4px; letter-spacing: 0.04em; text-transform: uppercase; }
  .cv-mod-title { font-size: 10px; color: #c9a84c; letter-spacing: 0.14em; text-transform: uppercase; font-weight: 600; }
  .cv-mod-side-title { font-size: 9px; font-weight: 900; letter-spacing: 0.16em; text-transform: uppercase; color: #c9a84c; margin-bottom: 8px; padding-bottom: 4px; border-bottom: 1px solid #2d3548; }
  .cv-mod-contact-item { font-size: 10px; color: #aab4cc; margin-bottom: 4px; }
  .cv-mod-skill-bar { margin-bottom: 7px; }
  .cv-mod-skill-name { font-size: 10px; color: #ccd; margin-bottom: 3px; }
  .cv-mod-bar-bg { background: #2d3548; border-radius: 3px; height: 4px; }
  .cv-mod-bar-fill { background: #c9a84c; height: 4px; border-radius: 3px; }
  .cv-mod-main { padding: 24px 22px; }
  .cv-mod-section-title { font-size: 11px; font-weight: 900; letter-spacing: 0.14em; text-transform: uppercase; color: #1e1e2f; margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
  .cv-mod-section-title::before { content: ''; width: 22px; height: 3px; background: #c9a84c; border-radius: 2px; flex-shrink: 0; }
  .cv-mod-job-title { font-size: 12px; font-weight: 700; color: #1e1e2f; }
  .cv-mod-job-co { font-size: 11px; color: #667eea; font-weight: 600; }
  .cv-mod-job-date { font-size: 10px; color: #fff; background: #667eea; padding: 2px 8px; border-radius: 10px; }
  .cv-mod-li { font-size: 10.5px; color: #444; line-height: 1.5; margin-bottom: 2px; }
  .cv-minimal { font-family: 'Helvetica Neue', sans-serif; color: #111; background: #fff; padding: 40px 44px; }
  .cv-min-name { font-size: 30px; font-weight: 900; letter-spacing: 0.14em; text-transform: uppercase; text-align: center; }
  .cv-min-title { font-size: 11px; color: #999; letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 14px; text-align: center; }
  .cv-min-divider { width: 32px; height: 2px; background: #111; margin: 0 auto 16px; }
  .cv-min-contact { display: flex; gap: 20px; font-size: 10px; color: #777; margin-bottom: 28px; flex-wrap: wrap; justify-content: center; }
  .cv-min-section-title { font-size: 9.5px; font-weight: 900; letter-spacing: 0.22em; text-transform: uppercase; color: #111; margin-bottom: 12px; padding-bottom: 5px; border-bottom: 2px solid #111; }
  .cv-min-job { margin-bottom: 14px; display: grid; grid-template-columns: 100px 1fr; gap: 12px; }
  .cv-min-date { font-size: 10px; color: #999; }
  .cv-min-job-title { font-size: 12px; font-weight: 600; color: #111; margin-bottom: 2px; }
  .cv-min-job-co { font-size: 10px; color: #777; margin-bottom: 6px; }
  .cv-min-li { font-size: 10.5px; color: #444; line-height: 1.6; margin-bottom: 2px; padding-left: 12px; position: relative; }
  .cv-min-li::before { content: '—'; position: absolute; left: 0; color: #bbb; }
  .cl-sales { font-family: 'Georgia', serif; color: #1a1a2e; background: #fff; padding: 40px 44px; }
  .cl-highlight { color: #c9a84c; font-weight: 700; }
  .cl-tech { font-family: 'Arial', sans-serif; color: #111; background: #fff; }
  .cl-tech-header { background: #1e293b; padding: 24px 36px; display: flex; justify-content: space-between; align-items: center; }
  .cl-tech-header-name { font-size: 18px; font-weight: 700; color: #fff; }
  .cl-tech-header-role { font-size: 11px; color: #94a3b8; margin-top: 2px; }
  .cl-tech-accent { height: 3px; background: linear-gradient(90deg, #2563eb, #7c3aed); }
  .cl-tech-body { padding: 28px 36px; }
  .cl-tech-p { font-size: 11px; color: #333; line-height: 1.75; margin-bottom: 14px; }
  .cl-tech-bitem { font-size: 11px; color: #333; padding: 6px 12px; background: #f0f7ff; border-left: 3px solid #2563eb; margin-bottom: 6px; border-radius: 0 4px 4px 0; line-height: 1.5; }
  @media (max-width: 640px) { nav { padding: 0 20px; } .nav-links { display: none; } .hero { padding: 90px 20px 40px; } .grid { padding: 0 20px 36px; grid-template-columns: 1fr; } }
</style>
</head>
<body>`;
  <nav>
  <a class="nav-logo" href="#">CV<span style="color:#fff">Edge</span></a>
  <div class="nav-links">
    <a href="/">Home</a>
    <a href="/cv-builder">CV Builder</a>
    <a href="/samples" class="active">Templates</a>
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
    <div class="hero-stat"><div class="num">ATS</div><div class="label">Optimised by Default</div></div>
    <div class="hero-stat"><div class="num">EU</div><div class="label">Europass Compliant</div></div>
    <div class="hero-stat"><div class="num">2min</div><div class="label">Average Edit Time</div></div>
  </div>
</div>

<div class="filters-wrap">
  <button class="filter-btn active" onclick="filterCards('all', this)">All Templates</button>
  <button class="filter-btn" onclick="filterCards('executive', this)">Executive CV</button>
  <button class="filter-btn" onclick="filterCards('ats', this)">ATS-Optimized</button>
  <button class="filter-btn" onclick="filterCards('modern', this)">Modern Professional</button>
  <button class="filter-btn" onclick="filterCards('creative', this)">Creative</button>
  <button class="filter-btn" onclick="filterCards('minimal', this)">Minimalist</button>
  <button class="filter-btn" onclick="filterCards('cover', this)">Cover Letters</button>
</div>

<div class="section-title"><span>👔</span> Executive CV Templates</div>
<div class="grid">
  <div class="card" data-cat="executive">
    <div class="card-preview">
      <div class="preview-inner">
        <div class="cv-executive">
          <div class="cv-exec-header">
            <div class="cv-exec-name">JONATHAN ASHFORD</div>
            <div class="cv-exec-title">Chief Executive Officer · Strategic Leadership</div>
            <div class="cv-exec-contact"><span>📧 j.ashford@email.com</span><span>📞 +44 7700 900123</span><span>📍 London, UK</span></div>
          </div>
          <div class="cv-exec-body">
            <div class="cv-exec-section">
              <div class="cv-exec-section-title">Executive Summary</div>
              <div class="cv-exec-summary">Visionary CEO with 18+ years driving multi-million pound transformations across FTSE 250 organisations. Proven record of scaling teams from 50 to 2,000+, orchestrating three successful IPOs, and delivering sustained double-digit revenue growth.</div>
            </div>
            <div class="cv-exec-section">
              <div class="cv-exec-section-title">Career Progression</div>
              <div class="cv-exec-job">
                <div class="cv-exec-job-header">
                  <div><div class="cv-exec-job-title">Chief Executive Officer</div><div class="cv-exec-job-company">GlobalNex Holdings Plc</div></div>
                  <div class="cv-exec-job-date">2018 – Present</div>
                </div>
                <ul class="cv-exec-bullets">
                  <li>Spearheaded £240M digital transformation programme, improving margin by 18%</li>
                  <li>Led acquisition of three strategic assets, expanding to 14 countries</li>
                </ul>
              </div>
            </div>
            <div class="cv-exec-two-col">
              <div class="cv-exec-section">
                <div class="cv-exec-section-title">Core Competencies</div>
                <div class="cv-exec-skill-item">P&L Management (£500M+)</div>
                <div class="cv-exec-skill-item">M&A Strategy & Integration</div>
                <div class="cv-exec-skill-item">Board-Level Communication</div>
              </div>
              <div class="cv-exec-section">
                <div class="cv-exec-section-title">Education</div>
                <div>MBA, Finance & Strategy</div>
                <div style="font-size:11px;color:#666">London Business School · 2005</div>
              </div>
            </div>
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
        <button class="btn-use" onclick="window.top.location.href='/cv-builder'">✦ Select & Edit</button>
      </div>
    </div>
  </div>

  <div class="card" data-cat="executive">
    <div class="card-preview">
      <div class="preview-inner">
        <div class="cv-executive">
          <div class="cv-exec-header" style="background:#2c1810;border-color:#b8860b">
            <div class="cv-exec-name">MARGARET WORTHINGTON</div>
            <div class="cv-exec-title" style="color:#b8860b">Non-Executive Director · Corporate Governance</div>
            <div class="cv-exec-contact"><span>📧 m.worthington@email.com</span><span>📍 Edinburgh, UK</span></div>
          </div>
          <div class="cv-exec-body">
            <div class="cv-exec-section">
              <div class="cv-exec-section-title" style="border-color:#2c1810">Board Profile</div>
              <div class="cv-exec-summary">Distinguished NED with 22 years of board-level experience across financial services, healthcare, and technology sectors. Championed governance reforms that reduced regulatory risk exposure by £180M.</div>
            </div>
            <div class="cv-exec-two-col">
              <div class="cv-exec-section">
                <div class="cv-exec-section-title" style="border-color:#2c1810">Expertise</div>
                <div class="cv-exec-skill-item" style="border-color:#b8860b">Corporate Governance</div>
                <div class="cv-exec-skill-item" style="border-color:#b8860b">Risk & Compliance</div>
              </div>
              <div class="cv-exec-section">
                <div class="cv-exec-section-title" style="border-color:#2c1810">Qualifications</div>
                <div>FCA, Institute of Chartered Accountants</div>
                <div style="font-size:11px;color:#666">Edinburgh · 2001</div>
              </div>
            </div>
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
        <button class="btn-use" onclick="window.top.location.href='/cv-builder'">✦ Select & Edit</button>
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
        <div class="cv-ats">
          <div class="cv-ats-header">
            <div class="cv-ats-name">SARAH OKEKE</div>
            <div class="cv-ats-contact">sarah@email.com · +44 7900 112233 · Manchester, UK</div>
            <div class="cv-ats-score">✅ ATS Score: 97/100</div>
            <div class="cv-ats-keywords">
              <span class="cv-ats-kw">Project Management</span><span class="cv-ats-kw">Agile</span>
              <span class="cv-ats-kw">Stakeholder Engagement</span><span class="cv-ats-kw">PMP Certified</span>
            </div>
          </div>
          <div class="cv-ats-body">
            <div class="cv-ats-section">
              <div class="cv-ats-section-title">Professional Summary</div>
              <p class="cv-ats-p">Results-driven Project Manager with 10 years delivering complex technology programmes. PMP and Prince2 certified. 98% client satisfaction score across 40+ enterprise projects.</p>
            </div>
            <div class="cv-ats-section">
              <div class="cv-ats-section-title">Work Experience</div>
              <div class="cv-ats-job">
                <div class="cv-ats-jrow"><div class="cv-ats-jname">Senior Project Manager</div><div class="cv-ats-jdate">Jan 2020 – Present</div></div>
                <div class="cv-ats-jco">Barclays Bank Plc · Manchester</div>
                <ul style="padding-left:14px;margin-top:5px">
                  <li class="cv-ats-li">Managed £12M core banking migration; delivered 3 months ahead of schedule</li>
                  <li class="cv-ats-li">Implemented Agile framework reducing time-to-market by 40%</li>
                </ul>
              </div>
            </div>
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
        <button class="btn-use" onclick="window.top.location.href='/cv-builder'">✦ Select & Edit</button>
      </div>
    </div>
  </div>

  <div class="card" data-cat="ats">
    <div class="card-preview">
      <div class="preview-inner">
        <div class="cv-ats">
          <div class="cv-ats-header" style="border-color:#059669">
            <div class="cv-ats-name">DANIEL MWANGI</div>
            <div class="cv-ats-contact">daniel@email.com · +254 722 000111 · Nairobi, KE</div>
            <div class="cv-ats-score" style="background:#f0fdf4;border-color:#86efac;color:#15803d">✅ ATS Score: 94/100</div>
            <div class="cv-ats-keywords">
              <span class="cv-ats-kw" style="background:#f0fdf4;color:#15803d;border-color:#86efac">KYC/AML</span>
              <span class="cv-ats-kw" style="background:#f0fdf4;color:#15803d;border-color:#86efac">Credit Analysis</span>
              <span class="cv-ats-kw" style="background:#f0fdf4;color:#15803d;border-color:#86efac">Retail Banking</span>
            </div>
          </div>
          <div class="cv-ats-body">
            <div class="cv-ats-section">
              <div class="cv-ats-section-title" style="color:#059669">Professional Summary</div>
              <p class="cv-ats-p">Dedicated banking professional with 8 years across retail and corporate banking. Proven track record of exceeding sales targets by 120%+ while maintaining full regulatory compliance.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="card-preview-overlay"></div>
    </div>
    <div class="card-badge">ATS 94%</div>
    <div class="card-body">
      <div class="card-cat"><span>🤖</span><span class="card-cat-name">ATS-Optimised</span></div>
      <div class="card-title">ATS Banking & Finance</div>
      <div class="card-desc">Finance-sector keywords and compliance-ready layout. Green accent variant.</div>
      <div class="card-actions">
        <button class="btn-preview" onclick="openModal('ats-banking')">👁 Preview</button>
        <button class="btn-use" onclick="window.top.location.href='/cv-builder'">✦ Select & Edit</button>
      </div>
    </div>
  </div>
</div>

<hr class="section-divider">
<div class="section-title"><span>💼</span> Modern Professional CV Templates</div>
<div class="grid">
  <div class="card" data-cat="modern">
    <div class="card-preview">
      <div class="preview-inner">
        <div class="cv-modern">
          <div class="cv-mod-sidebar">
            <div><div class="cv-mod-photo">👤</div><div><div class="cv-mod-name">PRIYA SHARMA</div><div class="cv-mod-title">Marketing Director</div></div></div>
            <div><div class="cv-mod-side-title">Contact</div>
              <div class="cv-mod-contact-item">📧 priya@email.com</div>
              <div class="cv-mod-contact-item">📍 Mumbai, India</div>
            </div>
            <div><div class="cv-mod-side-title">Key Skills</div>
              <div class="cv-mod-skill-bar"><div class="cv-mod-skill-name">Brand Strategy</div><div class="cv-mod-bar-bg"><div class="cv-mod-bar-fill" style="width:95%"></div></div></div>
              <div class="cv-mod-skill-bar"><div class="cv-mod-skill-name">Digital Marketing</div><div class="cv-mod-bar-bg"><div class="cv-mod-bar-fill" style="width:88%"></div></div></div>
              <div class="cv-mod-skill-bar"><div class="cv-mod-skill-name">Data Analytics</div><div class="cv-mod-bar-bg"><div class="cv-mod-bar-fill" style="width:75%"></div></div></div>
            </div>
          </div>
          <div class="cv-mod-main">
            <div style="margin-bottom:18px"><div class="cv-mod-section-title">Profile</div><div style="font-size:11px;color:#444;line-height:1.65">Creative marketing leader with 12 years driving brand growth. Expert in integrated campaigns generating £45M+ in incremental revenue.</div></div>
            <div><div class="cv-mod-section-title">Experience</div>
              <div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;align-items:flex-start"><div><div class="cv-mod-job-title">Marketing Director — APAC</div><div class="cv-mod-job-co">Unilever</div></div><div class="cv-mod-job-date">2020–Now</div></div><ul style="padding-left:14px;margin-top:6px"><li class="cv-mod-li">Led rebranding of 4 core product lines; brand equity up 34%</li></ul></div>
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
        <button class="btn-use" onclick="window.top.location.href='/cv-builder'">✦ Select & Edit</button>
      </div>
    </div>
  </div>
</div>

<hr class="section-divider">
<div class="section-title"><span>🎨</span> Creative & Minimalist CV Templates</div>
<div class="grid">
  <div class="card" data-cat="creative">
    <div class="card-preview">
      <div class="preview-inner">
        <div class="cv-creative" style="font-family:Georgia,sans-serif;color:#1a0a2e;background:#fff">
          <div style="background:linear-gradient(135deg,#1a0a2e,#3d1080,#7c3aed);padding:36px 40px 28px;text-align:center">
            <div style="display:inline-block;background:rgba(255,255,255,0.15);color:#e9d5ff;font-size:10px;font-weight:600;padding:3px 12px;border-radius:100px;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:10px">Creative Portfolio</div>
            <div style="font-size:32px;font-weight:900;color:#fff;margin-bottom:4px;letter-spacing:0.06em;text-transform:uppercase">ZARA FONTAINE</div>
            <div style="font-size:13px;color:#c4b5fd;margin-bottom:16px">Brand Designer & Creative Director</div>
            <div style="display:flex;gap:14px;font-size:10px;color:#ddd6fe;justify-content:center;flex-wrap:wrap"><span>✉️ zara@zarafontaine.design</span><span>📍 Paris, France</span></div>
          </div>
          <div style="display:grid;grid-template-columns:200px 1fr">
            <div style="background:#f5f0ff;padding:20px 16px;border-right:2px solid #e9d5ff">
              <div style="font-size:9px;font-weight:900;letter-spacing:0.16em;text-transform:uppercase;color:#7c3aed;margin-bottom:8px">Design Skills</div>
              <div><span style="background:linear-gradient(90deg,#7c3aed,#a855f7);color:#fff;font-size:9.5px;padding:3px 10px;border-radius:100px;margin-bottom:4px;display:inline-block">Figma</span></div>
              <div style="margin-top:4px"><span style="background:linear-gradient(90deg,#7c3aed,#a855f7);color:#fff;font-size:9.5px;padding:3px 10px;border-radius:100px;display:inline-block">Adobe Suite</span></div>
              <div style="margin-top:4px"><span style="background:linear-gradient(90deg,#7c3aed,#a855f7);color:#fff;font-size:9.5px;padding:3px 10px;border-radius:100px;display:inline-block">Brand Identity</span></div>
            </div>
            <div style="padding:20px 22px">
              <div style="font-size:11px;font-weight:900;letter-spacing:0.14em;text-transform:uppercase;color:#7c3aed;margin-bottom:8px">About</div>
              <div style="font-size:11px;color:#333;line-height:1.65">Award-winning creative director with 10 years building unforgettable brands. Clients include Chanel, LVMH, and Spotify.</div>
            </div>
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
        <button class="btn-use" onclick="window.top.location.href='/cv-builder'">✦ Select & Edit</button>
      </div>
    </div>
  </div>

  <div class="card" data-cat="minimal">
    <div class="card-preview">
      <div class="preview-inner">
        <div class="cv-minimal">
          <div class="cv-min-name">OLIVER HAYES</div>
          <div class="cv-min-title">Strategic Consultant</div>
          <div class="cv-min-divider"></div>
          <div class="cv-min-contact"><span>oliver@email.com</span><span>London, UK</span></div>
          <div style="margin-bottom:22px"><div class="cv-min-section-title">Profile</div><p style="font-size:11px;color:#444;line-height:1.7">Management consultant with 11 years advising FTSE 100 and Fortune 500 on strategy, operations, and digital transformation. Oxford-educated. McKinsey alumni.</p></div>
          <div><div class="cv-min-section-title">Experience</div>
            <div class="cv-min-job"><div class="cv-min-date">2019–Now</div><div><div class="cv-min-job-title">Associate Partner</div><div class="cv-min-job-co">McKinsey & Company · London</div><ul style="padding-left:0;margin-top:6px;list-style:none"><li class="cv-min-li">Led 14-week operating model redesign; delivered £95M savings</li></ul></div></div>
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
        <button class="btn-use" onclick="window.top.location.href='/cv-builder'">✦ Select & Edit</button>
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
        <div class="cl-sales">
          <div style="text-align:center;font-family:Arial,sans-serif;font-size:20px;font-weight:900;color:#1a1a2e;margin-bottom:6px;letter-spacing:0.06em">CV<span style="color:#c9a84c">Edge</span></div>
          <div style="width:40px;height:3px;background:#c9a84c;margin:0 auto 24px;border-radius:2px"></div>
          <div style="font-size:11px;color:#555;margin-bottom:20px;line-height:1.6">James Adebayo<br>Lagos, Nigeria · james@email.com</div>
          <div style="font-size:14px;font-weight:900;color:#1a1a2e;margin-bottom:18px;padding:10px 14px;background:#fdf9ee;border-left:4px solid #c9a84c;border-radius:0 4px 4px 0">Re: <span style="color:#c9a84c">Senior Relationship Manager — Corporate Banking</span></div>
          <p style="font-size:11px;color:#333;line-height:1.75;margin-bottom:14px">Dear Hiring Manager,</p>
          <p style="font-size:11px;color:#333;line-height:1.75;margin-bottom:14px">I am writing to express my strong interest in the <span class="cl-highlight">Senior Relationship Manager</span> role at Standard Chartered Bank. With <span class="cl-highlight">nine years of progressive experience</span> in corporate banking and a consistent record of exceeding portfolio growth targets, I am confident in my ability to contribute meaningfully to your Lagos Corporate division.</p>
          <p style="font-size:11px;color:#333;line-height:1.75">In my current role at Zenith Bank, I manage a <span class="cl-highlight">KES 3.8B corporate portfolio</span> and have delivered <span class="cl-highlight">131% of my annual lending target</span> for three consecutive years.</p>
        </div>
      </div>
      <div class="card-preview-overlay"></div>
    </div>
    <div class="card-badge">COVER LETTER</div>
    <div class="card-body">
      <div class="card-cat"><span>✉️</span><span class="card-cat-name">Cover Letter</span></div>
      <div class="card-title">Banking & Finance — Executive Tone</div>
      <div class="card-desc">Formal, achievement-led cover letter. Ideal for banking and corporate finance applications.</div>
      <div class="card-actions">
        <button class="btn-preview" onclick="openModal('cl-banking')">👁 Preview</button>
        <button class="btn-use" onclick="window.top.location.href='/cover-letter'">✦ Select & Edit</button>
      </div>
    </div>
  </div>

  <div class="card" data-cat="cover">
    <div class="card-preview">
      <div class="preview-inner">
        <div class="cl-tech">
          <div class="cl-tech-header">
            <div><div class="cl-tech-header-name">AMARA DIALLO</div><div class="cl-tech-header-role">Full-Stack Software Engineer</div></div>
            <div style="text-align:right;font-size:10px;color:#94a3b8;line-height:1.6">amara@email.com<br>Paris, France</div>
          </div>
          <div class="cl-tech-accent"></div>
          <div class="cl-tech-body">
            <div style="font-size:13px;font-weight:700;margin-bottom:18px">Application: Senior Software Engineer — Payments Infrastructure</div>
            <p class="cl-tech-p">I am applying for the Senior Software Engineer position on your Payments Infrastructure team. With six years of backend engineering experience and a deep focus on high-availability distributed systems, I am drawn to Stripe's mission.</p>
            <div style="margin:12px 0">
              <div class="cl-tech-bitem">Built payment processing engine handling 2.4M transactions/day at 99.98% uptime</div>
              <div class="cl-tech-bitem">Reduced API latency by 65% through async processing and Redis caching</div>
              <div class="cl-tech-bitem">Designed fault-tolerant microservices on AWS ECS; zero downtime in 18 months</div>
            </div>
          </div>
        </div>
      </div>
      <div class="card-preview-overlay"></div>
    </div>
    <div class="card-badge">COVER LETTER</div>
    <div class="card-body">
      <div class="card-cat"><span>✉️</span><span class="card-cat-name">Cover Letter</span></div>
      <div class="card-title">Tech & Engineering — Achievement Focus</div>
      <div class="card-desc">Bulleted achievement format with blue accent. Perfect for technical and engineering roles.</div>
      <div class="card-actions">
        <button class="btn-preview" onclick="openModal('cl-tech')">👁 Preview</button>
        <button class="btn-use" onclick="window.top.location.href='/cover-letter'">✦ Select & Edit</button>
      </div>
    </div>
  </div>
</div>

<footer>
  <div style="font-family:'Playfair Display',serif;font-size:1.3rem;font-weight:700;color:var(--gold);margin-bottom:8px">CVEdge</div>
  <p>© 2026 CVEdge · Professional CV & Cover Letter Services · All templates copy-protected.</p>
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
      <div class="modal-preview-doc" id="modalDoc"></div>
    </div>
    <div class="modal-footer">
      <div class="modal-copy-notice">🔒 Preview protected. No copying or downloading.</div>
      <button class="btn-preview" onclick="closeModal()">Close</button>
      <button class="btn-use" onclick="window.top.location.href='/cv-builder'">✦ Select & Edit This Template</button>
    </div>
  </div>
</div>

</body>
</html>`;

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <iframe
        srcDoc={html}
        style={{ width: "100%", height: "100vh", border: "none" }}
        title="CV Templates"
        sandbox="allow-scripts"
      />
    </div>
  );
}

