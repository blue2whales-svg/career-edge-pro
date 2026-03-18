import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

export function BeforeAfterSection() {
  return (
    <section className="relative z-10 py-24 px-4">
      <div className="container max-w-5xl mx-auto">
        <motion.p
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          className="text-primary font-mono text-sm text-center mb-3 tracking-wider uppercase"
        >
          The CVEdge Difference
        </motion.p>
        <motion.h2
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
          className="text-3xl sm:text-5xl font-serif font-bold text-center mb-4"
        >
          See the difference a <span className="text-gradient">professional CV</span> makes
        </motion.h2>
        <motion.p
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
          className="text-muted-foreground text-center mb-12 max-w-xl mx-auto"
        >
          Our experts transform ordinary CVs into interview-winning documents.
        </motion.p>

        <div className="grid sm:grid-cols-2 gap-6">
          {/* Before — ugly CV */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3}
            className="rounded-xl border border-destructive/20 bg-card overflow-hidden relative"
          >
            <div className="absolute top-3 right-3 z-10 text-[10px] font-mono bg-destructive/10 text-destructive px-2 py-0.5 rounded-full border border-destructive/20">
              Before CVEdge
            </div>

            {/* Realistic bad CV */}
            <div className="bg-white text-gray-900 p-5 sm:p-6 m-3 rounded-lg" style={{ fontSize: "11px", lineHeight: 1.6, fontFamily: "Times New Roman, serif" }}>
              <div className="text-center mb-3">
                <div className="text-lg font-normal text-gray-800">john doe</div>
                <div className="text-xs text-gray-500">email: johndoe@gmail.com | phone: 0712345678</div>
              </div>

              <div className="mb-3">
                <div className="font-bold text-xs text-gray-700 mb-1">OBJECTIVE</div>
                <p className="text-gray-600">I am looking for a job where I can use my skills and grow in a company that values hard work and dedication.</p>
              </div>

              <div className="mb-3">
                <div className="font-bold text-xs text-gray-700 mb-1">WORK EXPERIENCE</div>
                <div className="mb-2">
                  <div className="text-gray-800">Office Assistant - Some Company (2019-2022)</div>
                  <ul className="list-disc ml-4 text-gray-600 space-y-0.5">
                    <li>Did administrative tasks</li>
                    <li>Helped customers with their questions</li>
                    <li>Worked on various projects</li>
                    <li>Was responsible for filing documents</li>
                  </ul>
                </div>
                <div>
                  <div className="text-gray-800">Intern - Another Company (2018-2019)</div>
                  <ul className="list-disc ml-4 text-gray-600 space-y-0.5">
                    <li>Assisted in daily operations</li>
                    <li>Helped the team with tasks</li>
                  </ul>
                </div>
              </div>

              <div className="mb-3">
                <div className="font-bold text-xs text-gray-700 mb-1">EDUCATION</div>
                <div className="text-gray-600">Bachelors Degree - Some University (2018)</div>
              </div>

              <div>
                <div className="font-bold text-xs text-gray-700 mb-1">SKILLS</div>
                <div className="text-gray-600">Microsoft Word, Communication, Teamwork, Hardworking, Fast Learner</div>
              </div>
            </div>

            <div className="px-4 pb-4 space-y-1.5 text-xs text-destructive/80">
              <p>✗ No professional summary</p>
              <p>✗ Weak action verbs</p>
              <p>✗ No ATS keywords</p>
              <p>✗ Poor formatting & no metrics</p>
            </div>
          </motion.div>

          {/* After — polished CV */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={4}
            className="rounded-xl border border-primary/30 overflow-hidden relative"
            style={{ background: "linear-gradient(135deg, hsl(222 40% 7%), hsl(222 35% 9%))" }}
          >
            <div className="absolute top-3 right-3 z-10 text-[10px] font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
              After CVEdge ✓
            </div>

            {/* Realistic polished CV */}
            <div className="bg-white text-gray-900 m-3 rounded-lg overflow-hidden" style={{ fontSize: "11px", lineHeight: 1.6 }}>
              {/* Professional header */}
              <div className="px-5 sm:px-6 pt-5 pb-3" style={{ borderBottom: "2px solid hsl(43 55% 54%)" }}>
                <div className="text-xl font-bold tracking-wide text-gray-900" style={{ fontFamily: "'Georgia', serif" }}>
                  JOHN DOE
                </div>
                <div className="text-xs font-semibold mt-0.5" style={{ color: "hsl(43 55% 54%)" }}>
                  Senior Marketing Manager | Brand Strategy Expert
                </div>
                <div className="flex flex-wrap gap-x-3 text-[10px] text-gray-400 mt-1.5">
                  <span>john.doe@email.com</span>
                  <span>+254 712 345 678</span>
                  <span>Nairobi, Kenya</span>
                  <span>linkedin.com/in/johndoe</span>
                </div>
              </div>

              <div className="flex">
                {/* Sidebar */}
                <div className="w-[35%] p-4 text-[10px]" style={{ background: "#f8f9fa" }}>
                  <div className="font-bold uppercase tracking-widest text-[9px] mb-1.5" style={{ color: "hsl(43 55% 54%)" }}>
                    Core Skills
                  </div>
                  <div className="space-y-1 text-gray-600 mb-3">
                    {["Brand Strategy", "Digital Marketing", "SEO / SEM", "Team Leadership", "Data Analytics", "CRM Management", "Budget Planning"].map((s) => (
                      <div key={s} className="flex items-center gap-1">
                        <div className="w-1 h-1 rounded-full" style={{ background: "hsl(43 55% 54%)" }} />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>

                  <div className="font-bold uppercase tracking-widest text-[9px] mb-1.5" style={{ color: "hsl(43 55% 54%)" }}>
                    Certifications
                  </div>
                  <div className="text-gray-600 space-y-1 mb-3">
                    <div>Google Analytics</div>
                    <div>HubSpot Inbound</div>
                    <div>CIM Diploma</div>
                  </div>

                  <div className="font-bold uppercase tracking-widest text-[9px] mb-1.5" style={{ color: "hsl(43 55% 54%)" }}>
                    Languages
                  </div>
                  <div className="text-gray-600 space-y-1">
                    <div>English — Fluent</div>
                    <div>Swahili — Native</div>
                  </div>
                </div>

                {/* Main content */}
                <div className="flex-1 p-4">
                  <div className="font-bold uppercase tracking-widest text-[9px] mb-1.5" style={{ color: "hsl(43 55% 54%)" }}>
                    Professional Summary
                  </div>
                  <p className="text-[10.5px] text-gray-600 mb-3 leading-relaxed">
                    Results-driven marketing professional with 8+ years of experience in brand strategy, digital campaigns, and team leadership. 
                    Proven track record of increasing revenue by 43% and managing cross-functional teams of 12+ across East African markets.
                  </p>

                  <div className="font-bold uppercase tracking-widest text-[9px] mb-1.5" style={{ color: "hsl(43 55% 54%)" }}>
                    Work Experience
                  </div>
                  <div className="mb-2.5">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-[11px] text-gray-800">Marketing Director</span>
                      <span className="text-[9px] text-gray-400">2021 – Present</span>
                    </div>
                    <div className="text-[10px] italic text-gray-500">Safaricom PLC, Nairobi</div>
                    <ul className="mt-1 text-[10.5px] text-gray-600 space-y-0.5">
                      <li className="flex gap-1"><span>•</span><span><strong className="text-gray-800">Increased revenue by 43%</strong> through integrated digital marketing campaigns</span></li>
                      <li className="flex gap-1"><span>•</span><span><strong className="text-gray-800">Led a team of 12</strong> marketing professionals across 3 departments</span></li>
                      <li className="flex gap-1"><span>•</span><span>Managed annual marketing budget of <strong className="text-gray-800">KES 50M</strong></span></li>
                    </ul>
                  </div>
                  <div>
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-[11px] text-gray-800">Senior Brand Manager</span>
                      <span className="text-[9px] text-gray-400">2018 – 2021</span>
                    </div>
                    <div className="text-[10px] italic text-gray-500">Equity Bank Group</div>
                    <ul className="mt-1 text-[10.5px] text-gray-600 space-y-0.5">
                      <li className="flex gap-1"><span>•</span><span>Drove <strong className="text-gray-800">28% increase</strong> in customer acquisition</span></li>
                      <li className="flex gap-1"><span>•</span><span>Launched <strong className="text-gray-800">5 successful</strong> product campaigns</span></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 pb-4 pt-1 space-y-1.5 text-xs text-primary/90">
              <p>✓ Powerful professional summary</p>
              <p>✓ Achievement-focused with real metrics</p>
              <p>✓ ATS-optimised keywords highlighted</p>
              <p>✓ Executive two-column formatting</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
