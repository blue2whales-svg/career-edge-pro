import { Link } from "react-router-dom";

const BeforeAfterSection = () => {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.10),transparent_45%)]" />

      <div className="container relative mx-auto px-4">
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

                  <div className="border-t border-slate-200 pt-4">
                    <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-800">Skills</h4>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {["Communication", "Teamwork", "Microsoft Office"].map((skill) => (
                        <span key={skill} className="rounded-md bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 md:p-5">
                  <h5 className="text-sm font-bold uppercase tracking-wide text-red-600">Why this version struggles</h5>
                  <ul className="mt-3 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
                    <li>✕ No professional summary</li>
                    <li>✕ No measurable achievements</li>
                    <li>✕ Weak job descriptions</li>
                    <li>✕ Missing ATS keywords</li>
                    <li>✕ Poor structure and hierarchy</li>
                    <li>✕ Looks basic and forgettable</li>
                  </ul>
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

            <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[28px] border border-primary/20 bg-white shadow-[0_25px_80px_-25px_rgba(212,175,55,0.45)]">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-80" />
              <div className="absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

              <div className="relative p-5 md:p-10">
                <div className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-start md:justify-between">
                  <div className="text-left md:max-w-[70%]">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700">
                        ATS Optimised
                      </span>
                      <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
                        Recruiter Ready
                      </span>
                      <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-700">
                        Clean Executive Layout
                      </span>
                    </div>

                    <h3 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">John Kamau</h3>
                    <p className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary md:text-[13px]">
                      Senior Sales Executive • B2B Growth Specialist
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      Nairobi, Kenya • johnkamau@gmail.com • +254 712 345 678 • linkedin.com/in/johnkamau
                    </p>
                  </div>

                  <div className="self-start rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-yellow-50 px-5 py-4 text-left shadow-sm">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">ATS Match Feel</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">92%</p>
                    <p className="mt-1 text-xs text-slate-500">Structured for fast screening</p>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-[1.35fr_0.65fr]">
                  <div className="space-y-6 text-left">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-800">
                        Professional Summary
                      </h4>
                      <p className="mt-3 text-sm leading-7 text-slate-700 md:text-[15px]">
                        Results-driven sales professional with 4+ years driving B2B revenue across East African markets.
                        Proven success in exceeding targets by 35%+, expanding enterprise accounts, and managing client
                        portfolios worth over KES 120M annually.
                      </p>
                    </div>

                    <div className="border-t border-slate-200 pt-5">
                      <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-800">Experience</h4>

                      <div className="mt-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-900 md:text-[15px]">
                              Senior Sales Executive
                            </p>
                            <p className="text-sm text-slate-500">ABC Company • Nairobi, Kenya</p>
                          </div>
                          <span className="text-sm font-semibold text-primary">2020 — 2023</span>
                        </div>
                        <ul className="mt-3 list-disc pl-5 text-sm leading-7 text-slate-700">
                          <li>Grew regional revenue by 38% in 18 months through targeted B2B campaigns</li>
                          <li>Managed 45+ enterprise clients worth KES 120M annually</li>
                          <li>Mentored 6 sales reps across 3 countries, improving team performance</li>
                          <li>Strengthened retention through better account management and follow-up systems</li>
                        </ul>
                      </div>

                      <div className="mt-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-900 md:text-[15px]">Sales Intern</p>
                            <p className="text-sm text-slate-500">XYZ Ltd • Nairobi, Kenya</p>
                          </div>
                          <span className="text-sm font-semibold text-primary">2019 — 2020</span>
                        </div>
                        <ul className="mt-3 list-disc pl-5 text-sm leading-7 text-slate-700">
                          <li>Exceeded KPI by 52%, earning full-time conversion ahead of schedule</li>
                        </ul>
                      </div>
                    </div>

                    <div className="border-t border-slate-200 pt-5">
                      <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-800">Education</h4>
                      <div className="mt-3 flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900 md:text-[15px]">
                            B.Com Finance — First Class Honours
                          </p>
                          <p className="text-sm text-slate-500">University of Nairobi</p>
                        </div>
                        <span className="text-sm font-semibold text-primary">2019</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-800">Core Skills</h4>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {[
                          "B2B Sales",
                          "Client Growth",
                          "Negotiation",
                          "Revenue Growth",
                          "CRM",
                          "Lead Generation",
                          "Team Leadership",
                          "Relationship Management",
                        ].map((skill) => (
                          <span
                            key={skill}
                            className="rounded-md border border-primary/15 bg-primary/5 px-2.5 py-1 text-xs font-medium text-slate-700"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-800">Certifications</h4>
                      <div className="mt-3 space-y-2 text-sm text-slate-700">
                        <p>HubSpot Sales</p>
                        <p>Google Analytics</p>
                        <p>CRM Diploma</p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
                      <h5 className="text-sm font-bold uppercase tracking-wide text-emerald-700">
                        Why this version wins
                      </h5>
                      <ul className="mt-3 space-y-2 text-sm text-slate-700">
                        <li>✓ Strong ATS-friendly keywords</li>
                        <li>✓ Cleaner executive presentation</li>
                        <li>✓ Achievement-driven structure</li>
                        <li>✓ Easy recruiter scan flow</li>
                        <li>✓ Better first impression</li>
                        <li>✓ Built for local and abroad jobs</li>
                      </ul>
                    </div>
                  </div>
                </div>
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

            <div className="mt-6 pb-24 sm:pb-0">
              <Link to="/templates">
                <button className="relative z-50 inline-flex items-center justify-center rounded-2xl bg-gradient-brand px-8 py-4 text-sm font-bold text-primary-foreground shadow-glow transition hover:scale-[1.02] active:scale-[0.98]">
                  Upgrade My CV
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterSection;
