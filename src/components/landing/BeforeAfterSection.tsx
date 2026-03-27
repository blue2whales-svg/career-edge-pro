const BeforeAfterSection = () => {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.10),transparent_45%)]" />

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            CV Transformation
          </div>

          <h2 className="mt-5 text-3xl font-bold leading-tight text-foreground md:text-5xl">
            From <span className="text-red-400">overlooked</span> to{" "}
            <span className="text-primary">interview-ready</span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">
            CV Edge transforms weak, ordinary CVs into premium documents built for serious employers in Kenya and
            abroad.
          </p>

          <div className="mt-5 inline-flex items-center rounded-full border border-border bg-card/60 px-4 py-2 text-xs text-foreground shadow-glow-sm md:text-sm">
            Recruiters scan a CV in seconds. Make yours impossible to ignore.
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="relative rounded-3xl border border-red-500/20 bg-card/70 p-4 shadow-2xl backdrop-blur md:p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="inline-flex items-center rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-300">
                Before: Gets Ignored
              </span>

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-white shadow-lg">
                ✕
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border bg-white">
              <div className="min-h-[520px] p-6 text-left text-[11px] text-slate-800 md:min-h-[560px] md:text-xs">
                <div className="text-center">
                  <h3 className="text-lg font-bold text-slate-900">John Kamau</h3>
                  <p className="mt-1 text-[10px] text-slate-500">johnkamau@gmail.com | 0712 345 678 | Nairobi</p>
                </div>

                <div className="mt-5 border-t pt-3">
                  <h4 className="font-bold uppercase tracking-wide text-slate-900">Objective</h4>
                  <p className="mt-2 text-slate-600">
                    I am looking for a job where I can use my skills and grow in a company that values hard work and
                    dedication.
                  </p>
                </div>

                <div className="mt-5 border-t pt-3">
                  <h4 className="font-bold uppercase tracking-wide text-slate-900">Work Experience</h4>
                  <div className="mt-2">
                    <p className="font-semibold text-slate-800">Sales Executive – ABC Company</p>
                    <ul className="mt-2 list-disc pl-4 text-slate-600">
                      <li>Did sales and marketing</li>
                      <li>Helped grow the business</li>
                      <li>Worked with the team on tasks</li>
                      <li>Was responsible for customer service</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-5 border-t pt-3">
                  <h4 className="font-bold uppercase tracking-wide text-slate-900">Education</h4>
                  <p className="mt-2 text-slate-600">Bachelor of Commerce – University of Nairobi</p>
                </div>

                <div className="mt-5 border-t pt-3">
                  <h4 className="font-bold uppercase tracking-wide text-slate-900">Skills</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="rounded bg-slate-100 px-2 py-1 text-slate-600">Communication</span>
                    <span className="rounded bg-slate-100 px-2 py-1 text-slate-600">Teamwork</span>
                    <span className="rounded bg-slate-100 px-2 py-1 text-slate-600">Microsoft Office</span>
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
                  <h5 className="font-bold uppercase tracking-wide text-red-600">Why this CV gets skipped</h5>
                  <ul className="mt-3 space-y-2 text-slate-700">
                    <li>✕ No professional summary</li>
                    <li>✕ No measurable achievements</li>
                    <li>✕ Weak job descriptions</li>
                    <li>✕ Poor formatting and structure</li>
                    <li>✕ Missing recruiter keywords</li>
                    <li>✕ Not optimized for ATS</li>
                    <li>✕ Looks ordinary and forgettable</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl border border-primary/20 bg-card/70 p-4 shadow-2xl backdrop-blur md:p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                After: Interview-Ready
              </span>

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
                ✓
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-primary/20 bg-white shadow-xl">
              <div className="grid min-h-[520px] md:min-h-[560px] md:grid-cols-[140px_1fr]">
                <div className="bg-slate-900 px-4 py-6 text-white">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-bold text-slate-900">
                    JK
                  </div>

                  <div className="mt-6">
                    <h4 className="text-[11px] font-bold uppercase tracking-wide text-primary">Contact</h4>
                    <div className="mt-2 space-y-1 text-[11px] text-slate-300">
                      <p>johnkamau@gmail.com</p>
                      <p>+254 712 345 678</p>
                      <p>Nairobi, Kenya</p>
                      <p>linkedin.com/in/johnkamau</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-[11px] font-bold uppercase tracking-wide text-primary">Core Skills</h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {[
                        "B2B Sales",
                        "Client Growth",
                        "Negotiation",
                        "Team Leadership",
                        "Data Analysis",
                        "Revenue Growth",
                      ].map((skill) => (
                        <span
                          key={skill}
                          className="rounded border border-primary/20 bg-primary/10 px-2 py-1 text-[10px] text-primary"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-[11px] font-bold uppercase tracking-wide text-primary">Certifications</h4>
                    <div className="mt-2 space-y-1 text-[11px] text-slate-300">
                      <p>HubSpot Sales</p>
                      <p>Google Analytics</p>
                      <p>CRM Diploma</p>
                    </div>
                  </div>
                </div>

                <div className="px-5 py-6 text-left text-[11px] text-slate-800 md:px-6 md:text-xs">
                  <div className="border-b pb-3">
                    <h3 className="text-2xl font-bold text-slate-900">John Kamau</h3>
                    <p className="mt-1 font-semibold uppercase tracking-wide text-primary">
                      Senior Sales Executive • B2B Growth Specialist
                    </p>
                    <p className="mt-2 text-slate-500">
                      Nairobi, Kenya • johnkamau@gmail.com • linkedin.com/in/johnkamau
                    </p>
                  </div>

                  <div className="mt-4 border-b pb-4">
                    <h4 className="font-bold uppercase tracking-wide text-slate-900">Professional Summary</h4>
                    <p className="mt-2 text-slate-700">
                      Results-driven sales professional with 4+ years driving B2B revenue across East African markets.
                      Confident record of exceeding targets by 35%+ and managing client portfolios worth over KES 120M
                      annually.
                    </p>
                  </div>

                  <div className="mt-4 border-b pb-4">
                    <h4 className="font-bold uppercase tracking-wide text-slate-900">Experience</h4>

                    <div className="mt-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900">Senior Sales Executive</p>
                          <p className="text-slate-500">ABC Company • Nairobi, Kenya</p>
                        </div>
                        <span className="font-semibold text-primary">2020 – 2023</span>
                      </div>

                      <ul className="mt-2 list-disc pl-4 text-slate-700">
                        <li>Grew regional revenue by 38% in 18 months through targeted B2B campaigns</li>
                        <li>Managed 45+ enterprise clients worth KES 120M annually</li>
                        <li>Mentored 6 sales reps across 3 countries, lifting team KPIs</li>
                      </ul>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900">Sales Intern</p>
                          <p className="text-slate-500">XYZ Ltd • Nairobi, Kenya</p>
                        </div>
                        <span className="font-semibold text-primary">2019 – 2020</span>
                      </div>

                      <ul className="mt-2 list-disc pl-4 text-slate-700">
                        <li>Exceeded KPI by 52%, converted to full-time ahead of schedule</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 border-b pb-4">
                    <h4 className="font-bold uppercase tracking-wide text-slate-900">Education</h4>
                    <div className="mt-2 flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">B.Com Finance — First Class Honours</p>
                        <p className="text-slate-500">University of Nairobi</p>
                      </div>
                      <span className="font-semibold text-primary">2019</span>
                    </div>
                  </div>

                  <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                    <h5 className="font-bold uppercase tracking-wide text-emerald-700">What makes this CV strong</h5>
                    <ul className="mt-3 space-y-2 text-slate-700">
                      <li>✓ Powerful professional summary</li>
                      <li>✓ Achievement-driven work experience</li>
                      <li>✓ ATS-friendly recruiter keywords</li>
                      <li>✓ Clean premium layout</li>
                      <li>✓ Stronger contact and LinkedIn presentation</li>
                      <li>✓ Easy for recruiters to scan in seconds</li>
                      <li>✓ Built for local and abroad opportunities</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-3xl text-center">
          <p className="text-base font-medium text-foreground md:text-lg">
            Your experience deserves a CV that opens doors.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            ATS-friendly • Professional layout • Built for serious employers • Ready in 24 hours
          </p>

          <div className="mt-6">
            <button className="inline-flex items-center justify-center rounded-2xl bg-gradient-brand px-6 py-3 text-sm font-bold text-primary-foreground shadow-glow transition hover:scale-[1.02]">
              Upgrade My CV
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterSection;
