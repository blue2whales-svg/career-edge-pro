import { useState } from "react";
import { useProPlan } from "@/hooks/useProPlan";

const SUPABASE_URL = "https://wspugvdwodqdlyamxzxj.supabase.co/functions/v1/ats-checker";
const SUPABASE_ANON_KEY = "sb_publishable_nhGjJgV7MxzzyZLkStxzIA_DXY-lMFS";

const gradeColor = (grade) => {
  if (grade === "A") return "text-green-500";
  if (grade === "B") return "text-blue-500";
  if (grade === "C") return "text-yellow-500";
  return "text-red-500";
};

const statusColor = (status) => {
  if (status === "good") return "bg-green-500";
  if (status === "warning") return "bg-yellow-500";
  return "bg-red-500";
};

export default function ATSCheckerPage() {
  const { isPro, loading: planLoading } = useProPlan();
  const [cvText, setCvText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shared, setShared] = useState(false);

  // ── PRO GATE ──────────────────────────────────────────
  if (planLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Checking your plan...</p>
      </div>
    );
  }

  if (!isPro) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="text-5xl">🔒</div>
        <h2 className="text-2xl font-bold">ATS Checker is a Pro Feature</h2>
        <p className="text-muted-foreground max-w-md">
          Upgrade to CV Edge Pro to check your CV against ATS systems,
          get a score, see critical issues and keyword gaps.
        </p>
        <a
          href="/pro"
          className="rounded-xl bg-gradient-brand px-8 py-3 font-semibold text-primary-foreground shadow-glow transition-opacity hover:opacity-90"
        >
          Upgrade to Pro →
        </a>
        <p className="text-xs text-muted-foreground">KES 499/month • Cancel anytime</p>
      </div>
    );
  }
  // ── END GATE ──────────────────────────────────────────

  const handleAnalyze = async () => {
    if (!cvText.trim() || cvText.trim().length < 50) {
      setError("Please paste at least 50 characters of your CV.");
      return;
    }
    if (!emailSubmitted) {
      setError("Please enter your email to unlock your results.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(SUPABASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ cvText, jobDescription, email }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = () => {
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setEmailSubmitted(true);
  };

  const handleShare = async () => {
    if (!result) return;
    const text = `I just scored ${result.score}/100 (Grade ${result.grade}) on my ATS Check! 🎯\nSee how your CV scores at https://cvedge.live/ats-checker`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "My ATS Score — CV Edge", text });
      } else {
        await navigator.clipboard.writeText(text);
        setShared(true);
        setTimeout(() => setShared(false), 3000);
      }
    } catch {
      await navigator.clipboard.writeText(text);
      setShared(true);
      setTimeout(() => setShared(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Free ATS Check
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight md:text-5xl">Check if your CV passes ATS screening</h1>

          <p className="mt-4 text-sm text-muted-foreground md:text-base">
            Paste your CV, add an optional job description, and get an instant AI-powered ATS score with clear feedback
            on what is helping or hurting your chances.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* LEFT SIDE */}
          <div className="space-y-5">
            <div className="rounded-2xl border border-border bg-card/70 p-4 shadow-sm md:p-6">
              <label className="mb-2 block text-sm font-semibold">Paste your CV text</label>
              <textarea
                className="w-full h-52 rounded-xl border bg-background p-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Paste your full CV text here (minimum 50 characters)..."
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Tip: paste the full content of your CV for the most accurate result.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card/70 p-4 shadow-sm md:p-6">
              <label className="mb-2 block text-sm font-semibold">Optional job description</label>
              <textarea
                className="w-full h-24 rounded-xl border bg-background p-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Paste the job description to get a more targeted match score..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
              <p className="mt-2 text-xs text-muted-foreground">This helps compare your CV against a specific role.</p>
            </div>

            {!emailSubmitted ? (
              <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 shadow-sm md:p-6">
                <p className="text-sm font-semibold">📧 Unlock your full ATS report</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Enter your email to view your results and receive a copy. No spam.
                </p>

                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <input
                    type="email"
                    className="flex-1 rounded-xl border bg-background p-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleEmailSubmit()}
                  />
                  <button
                    onClick={handleEmailSubmit}
                    className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    Unlock Results
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-500 shadow-sm">
                ✅ Email saved — results will be sent to <strong>{email}</strong>
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-brand px-6 py-4 text-base font-semibold text-primary-foreground shadow-glow transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Analyzing your CV..." : "Analyze My CV ✅"}
            </button>

            {error && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-500">{error}</div>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-5">
            <div className="rounded-2xl border border-border bg-card/70 p-4 shadow-sm md:p-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">What you will get</h2>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li>• ATS score and grade</li>
                <li>• Verdict on your current CV strength</li>
                <li>• Critical issues hurting your performance</li>
                <li>• Improvements to raise your chances</li>
                <li>• Keyword match feedback</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card/70 p-4 shadow-sm md:p-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Why this matters</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Many CVs are rejected before a recruiter ever reads them. ATS tools often scan structure, keywords,
                readability, and relevance first. A strong score helps you compete more seriously.
              </p>
            </div>
          </div>
        </div>

        {result && (
          <div className="mt-10 space-y-6">
            {/* HERO RESULT CARD */}
            <div className="premium-card premium-glass rounded-[28px] border border-primary/20 bg-card/70 p-5 shadow-[0_25px_80px_-25px_rgba(212,175,55,0.35)] md:p-8">
              <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
                <div className="rounded-2xl border border-border bg-background/60 p-5 text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">ATS Match Score</p>
                  <div className="mt-4 text-6xl font-black text-foreground">{result.score}</div>
                  <div className="text-sm text-muted-foreground">/100</div>

                  <div className={`mt-4 text-5xl font-black ${gradeColor(result.grade)}`}>{result.grade}</div>
                  <div className="text-sm text-muted-foreground">Grade</div>

                  <button
                    onClick={handleShare}
                    className="mt-5 inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-semibold transition-colors hover:bg-muted"
                  >
                    {shared ? "✅ Copied to clipboard!" : "📤 Share My Score"}
                  </button>
                </div>

                <div className="flex flex-col justify-center">
                  <p className="text-sm leading-7 text-muted-foreground">{result.verdict}</p>

                  {result.score >= 90 ? (
                    <div className="mt-5 rounded-2xl border border-green-500/30 bg-green-500/10 p-5">
                      <p className="text-lg font-bold text-green-500">🎉 Excellent ATS readiness</p>
                      <p className="mt-2 text-sm text-green-400">
                        Your CV is strong, polished, and ATS-friendly. You are in a strong position to compete for
                        serious roles.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-5 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-5">
                      <p className="text-lg font-bold text-yellow-500">
                        {result.score >= 70 ? "⚠️ Good foundation, but not there yet" : "❗ Your CV needs attention"}
                      </p>
                      <p className="mt-2 text-sm text-yellow-400">
                        {result.score >= 70
                          ? "Your CV has potential, but some weaknesses may still reduce your visibility."
                          : "Your CV may be filtered before recruiters ever read it."}
                      </p>

                      <ul className="mt-4 space-y-2">
                        {result.critical?.slice(0, 3).map((c, i) => (
                          <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                            <span className="text-yellow-500">→</span>
                            {c.title}
                          </li>
                        ))}
                      </ul>

                      {/* EXISTING CONVERSION DESTINATION KEPT SAFE */}
                      <a
                        href="https://cvedge.live/optimize"
                        className="mt-5 inline-block w-full rounded-xl bg-primary px-6 py-3 text-center font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                      >
                        🚀 Optimize My CV Now
                      </a>

                      <p className="mt-3 text-center text-xs text-muted-foreground">
                        Get a professionally rewritten CV built for ATS and serious employers.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* SCORE BREAKDOWN */}
            <div className="rounded-2xl border border-border bg-card/70 p-5 md:p-6">
              <h2 className="text-lg font-bold">Score Breakdown</h2>
              <div className="mt-4 space-y-4">
                {result.metrics?.map((m, i) => (
                  <div key={i}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span>{m.name}</span>
                      <span className="font-semibold">{m.score}/100</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className={`h-2 rounded-full ${statusColor(m.status)}`} style={{ width: `${m.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CRITICAL ISSUES */}
            {result.critical?.length > 0 && (
              <div className="rounded-2xl border border-red-500/30 bg-card/70 p-5 md:p-6">
                <h2 className="text-lg font-bold text-red-500">⚠️ Critical Issues</h2>
                <div className="mt-4 space-y-4">
                  {result.critical.map((c, i) => (
                    <div key={i}>
                      <div className="text-sm font-semibold">{c.title}</div>
                      <div className="text-sm text-muted-foreground">{c.detail}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* IMPROVEMENTS */}
            {result.improvements?.length > 0 && (
              <div className="rounded-2xl border border-yellow-500/30 bg-card/70 p-5 md:p-6">
                <h2 className="text-lg font-bold text-yellow-500">💡 Improvements</h2>
                <div className="mt-4 space-y-4">
                  {result.improvements.map((item, i) => (
                    <div key={i}>
                      <div className="text-sm font-semibold">{item.title}</div>
                      <div className="text-sm text-muted-foreground">{item.detail}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STRENGTHS */}
            {result.strengths?.length > 0 && (
              <div className="rounded-2xl border border-green-500/30 bg-card/70 p-5 md:p-6">
                <h2 className="text-lg font-bold text-green-500">✅ Strengths</h2>
                <div className="mt-4 space-y-4">
                  {result.strengths.map((s, i) => (
                    <div key={i}>
                      <div className="text-sm font-semibold">{s.title}</div>
                      <div className="text-sm text-muted-foreground">{s.detail}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* KEYWORDS */}
            <div className="rounded-2xl border border-border bg-card/70 p-5 md:p-6">
              <h2 className="text-lg font-bold">🔑 Keywords</h2>

              <div className="mt-4">
                <div className="mb-2 text-sm font-semibold text-green-500">Found</div>
                <div className="flex flex-wrap gap-2">
                  {result.keywords_found?.map((k, i) => (
                    <span key={i} className="rounded px-2 py-1 text-xs text-green-500 bg-green-500/10">
                      {k}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <div className="mb-2 text-sm font-semibold text-red-500">Missing</div>
                <div className="flex flex-wrap gap-2">
                  {result.keywords_missing?.map((k, i) => (
                    <span key={i} className="rounded px-2 py-1 text-xs text-red-500 bg-red-500/10">
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* FINAL CTA STRIP */}
            {result.score < 90 && (
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 text-center md:p-6">
                <p className="text-lg font-bold">Your CV may be costing you interviews.</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Let CV Edge professionally optimize it for ATS, recruiters, and serious opportunities.
                </p>
                <a
                  href="https://cvedge.live/optimize"
                  className="mt-5 inline-block rounded-xl bg-gradient-brand px-6 py-3 font-semibold text-primary-foreground shadow-glow transition-opacity hover:opacity-90"
                >
                  Fix My CV Professionally
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
