import { useEffect, useState } from "react";

const BeforeAfterSection = () => {
  const [score, setScore] = useState(65);

  useEffect(() => {
    let start = 65;
    const end = 92;

    const timer = setInterval(() => {
      start += 1;
      setScore(start);

      if (start >= end) {
        clearInterval(timer);
      }
    }, 30);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.10),transparent_45%)]" />

      <div className="container relative mx-auto px-4">
        {/* SECTION HEADER */}

        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            ATS CV Upgrade
          </div>

          <h2 className="mt-5 text-3xl font-bold leading-tight text-foreground md:text-5xl">
            One CV gets skipped. The other gets <span className="text-primary">shortlisted.</span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">
            Most candidates do not just want a beautiful CV. They want a clean, modern, ATS-friendly document that looks
            serious to employers in Kenya and abroad.
          </p>

          <div className="mt-5 inline-flex items-center rounded-full border border-border bg-card/60 px-4 py-2 text-xs text-foreground shadow-glow-sm md:text-sm">
            ATS-friendly • Recruiter-clean • Premium structure • Built to win attention fast
          </div>
        </div>

        {/* SECTION BODY */}

        <div className="mx-auto mt-12 flex max-w-5xl flex-col gap-8">
          {/* BEFORE */}

          <div className="relative overflow-hidden rounded-[28px] border border-red-500/20 bg-card/70 p-4 shadow-2xl backdrop-blur md:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <span className="inline-flex items-center rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-300">
                  Before: Basic CV
                </span>

                <p className="mt-2 text-sm text-muted-foreground">Looks ordinary. Feels weak. Easy to ignore.</p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-lg text-white shadow-lg">
                ✕
              </div>
            </div>

            <div className="rounded-[24px] border border-border bg-white p-5 shadow-xl md:p-8">
              <div className="mx-auto max-w-3xl">
                <div className="border-b border-slate-200 pb-4 text-center">
                  <h3 className="text-xl font-bold text-slate-900 md:text-2xl">John Kamau</h3>

                  <p className="mt-1 text-xs text-slate-500 md:text-sm">johnkamau@gmail.com • 0712 345 678 • Nairobi</p>
                </div>

                <div className="mt-5 space-y-5 text-left">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-800">Objective</h4>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      I am looking for a job where I can use my skills and grow in a company that values hard work and
                      dedication.
                    </p>
                  </div>

                  <div className="border-t border-slate-200 pt-4">
                    <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-800">Work Experience</h4>

                    <div className="mt-2">
                      <p className="text-sm font-semibold text-slate-800">Sales Executive — ABC Company</p>

                      <ul className="mt-2 list-disc pl-5 text-sm leading-6 text-slate-600">
                        <li>Did sales and marketing</li>
                        <li>Helped grow the business</li>
                        <li>Worked with the team on tasks</li>
                        <li>Was responsible for customer service</li>
                      </ul>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-4">
                    <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-800">Education</h4>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Bachelor of Commerce — University of Nairobi
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AFTER */}

          <div className="relative overflow-hidden rounded-[28px] border border-primary/20 bg-card/70 p-4 shadow-2xl backdrop-blur md:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                  After: Premium ATS CV
                </span>

                <p className="mt-2 text-sm text-muted-foreground">
                  Cleaner. Stronger. Built to impress recruiters fast.
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-lg text-white shadow-lg">
                ✓
              </div>
            </div>

            {/* PREMIUM CARD */}

            <div className="premium-card premium-glass relative mx-auto max-w-4xl overflow-hidden rounded-[28px] border border-primary/20 bg-white shadow-[0_25px_80px_-25px_rgba(212,175,55,0.45)]">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-80" />

              <div className="relative p-6 md:p-10">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 border-b border-slate-200 pb-6">
                  <div>
                    <h3 className="text-3xl font-bold text-slate-900 md:text-4xl">John Kamau</h3>

                    <p className="mt-2 text-sm text-slate-500">Senior Sales Executive • B2B Growth Specialist</p>
                  </div>

                  {/* ATS SCORE */}

                  <div className="ats-badge rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-yellow-50 px-5 py-4 text-left">
                    <p className="text-xs font-bold uppercase tracking-wide text-primary">ATS Match Feel</p>

                    <p className="mt-1 text-2xl font-bold text-slate-900">{score}%</p>

                    <p className="text-xs text-slate-500">Structured for fast screening</p>
                  </div>
                </div>

                <p className="mt-6 text-sm text-slate-700 leading-7">
                  Results-driven sales professional with 4+ years driving B2B revenue across East African markets.
                  Proven success in exceeding targets by 35%+, expanding enterprise accounts and managing client
                  portfolios worth over KES 120M annually.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}

          <div className="mx-auto mt-2 max-w-3xl text-center">
            <p className="text-base font-medium text-foreground md:text-lg">
              Your experience deserves a CV that opens doors.
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              ATS-friendly • Premium layout • Built for serious employers • Ready in 24 hours
            </p>

            <div className="mt-6">
              <button className="inline-flex items-center justify-center rounded-2xl bg-gradient-brand px-6 py-3 text-sm font-bold text-primary-foreground shadow-glow transition hover:scale-[1.02]">
                Upgrade My CV
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterSection;
