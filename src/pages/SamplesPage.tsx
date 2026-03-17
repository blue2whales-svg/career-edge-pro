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
