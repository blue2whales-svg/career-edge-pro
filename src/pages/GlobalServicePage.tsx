import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Globe, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import MpesaPaymentModal from "@/components/MpesaPaymentModal";
import { trackViewContent } from "@/hooks/useFbPixel";

const FEATURES = [
  "Complete CV optimization",
  "Tailored cover letter per application",
  "Targeted job search (25 positions)",
  "Full application submission on your behalf",
  "Interview scheduling support",
  "Weekly progress reports",
  "90-day service period",
];

/* ── Animated count-up hook ── */
function useCountUp(target: number, active: boolean, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const steps = 60;
    const increment = target / steps;
    const interval = duration / steps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setValue(target); clearInterval(timer); }
      else setValue(Math.floor(start));
    }, interval);
    return () => clearInterval(timer);
  }, [active, target, duration]);
  return value;
}

/* ── Gold check icon ── */
const GoldCheck = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0 mt-0.5">
    <circle cx="9" cy="9" r="8.5" stroke="url(#gc)" strokeWidth="1" />
    <path d="M6 9.5L8 11.5L12.5 7" stroke="url(#gc)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <defs>
      <linearGradient id="gc" x1="0" y1="0" x2="18" y2="18">
        <stop stopColor="#F0C040" />
        <stop offset="1" stopColor="#B8860B" />
      </linearGradient>
    </defs>
  </svg>
);

export default function GlobalServicePage() {
  useEffect(() => { trackViewContent("Global Assistance", "Services"); }, []);
  const [paymentOpen, setPaymentOpen] = useState(false);

  const cardRef = useRef(null);
  const cardInView = useInView(cardRef, { once: true, margin: "-80px" });
  const priceDisplay = useCountUp(20000, cardInView);

  return (
    <PageLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        .gs-section { font-family: 'DM Sans', sans-serif; }

        .gs-heading {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          letter-spacing: -0.02em;
          line-height: 1.08;
        }

        .gs-card {
          background:
            radial-gradient(ellipse at 20% 0%, rgba(201,168,76,0.07) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 100%, rgba(201,168,76,0.05) 0%, transparent 60%),
            linear-gradient(160deg, #161410 0%, #0f0f0f 50%, #111009 100%);
          border: 1px solid rgba(201,168,76,0.22);
          box-shadow:
            0 0 0 1px rgba(0,0,0,0.6),
            0 32px 64px rgba(0,0,0,0.6),
            0 0 120px rgba(201,168,76,0.04),
            inset 0 1px 0 rgba(201,168,76,0.12);
          border-radius: 28px;
          position: relative;
          overflow: hidden;
        }

        .gs-card::before {
          content: '';
          position: absolute;
          top: 0; left: 15%; right: 15%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,168,76,0.6), transparent);
        }

        .gs-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: 0.4;
          border-radius: 28px;
        }

        .gs-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,168,76,0.18), transparent);
          margin: 20px 0;
        }

        .gs-price-num {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: clamp(48px, 8vw, 62px);
          letter-spacing: -0.03em;
          line-height: 1;
          background: linear-gradient(135deg, #F5D680 0%, #C9A84C 40%, #8B6914 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .gs-save-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: rgba(201,168,76,0.1);
          border: 1px solid rgba(201,168,76,0.25);
          border-radius: 100px;
          padding: 3px 10px;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.05em;
          color: #C9A84C;
        }

        .gs-btn {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #C9A84C 0%, #8B6914 50%, #C9A84C 100%) !important;
          background-size: 200% 100% !important;
          border: none !important;
          height: 56px !important;
          font-family: 'DM Sans', sans-serif !important;
          font-weight: 500 !important;
          font-size: 15px !important;
          letter-spacing: 0.04em !important;
          color: #0a0800 !important;
          border-radius: 14px !important;
          transition: background-position 0.6s ease, transform 0.2s ease, box-shadow 0.3s ease !important;
          box-shadow: 0 4px 24px rgba(201,168,76,0.25), 0 1px 0 rgba(255,255,255,0.1) inset !important;
        }

        .gs-btn::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(120deg, transparent, rgba(255,255,255,0.25), transparent);
          transform: skewX(-20deg);
          transition: left 0.7s ease;
        }

        .gs-btn:hover::before { left: 160%; }
        .gs-btn:hover {
          background-position: 100% 0 !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 8px 32px rgba(201,168,76,0.4), 0 1px 0 rgba(255,255,255,0.15) inset !important;
        }
        .gs-btn:active { transform: translateY(0px) !important; }

        .gs-feature-row {
          transition: background 0.2s ease;
          border-radius: 10px;
          padding: 9px 10px;
          margin: 0 -10px;
        }
        .gs-feature-row:hover {
          background: rgba(201,168,76,0.05);
        }

        .gs-badge-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #C9A84C;
          box-shadow: 0 0 8px rgba(201,168,76,0.8);
          animation: pulse-dot 2s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.85); }
        }

        .gs-original-price {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: rgba(255,255,255,0.25);
          text-decoration: line-through;
          text-decoration-color: rgba(255,255,255,0.2);
          letter-spacing: 0.02em;
        }
      `}</style>

      <MpesaPaymentModal open={paymentOpen} onClose={() => setPaymentOpen(false)} defaultPackage="global" />

      <section className="gs-section relative z-10 pt-16 sm:pt-24 pb-28 px-4">

        {/* Ambient background glow */}
        <div style={{
          position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)",
          width: "600px", height: "400px",
          background: "radial-gradient(ellipse, rgba(201,168,76,0.06) 0%, transparent 70%)",
          pointerEvents: "none", filter: "blur(40px)",
        }} />

        <div className="container max-w-2xl mx-auto text-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-8"
            style={{
              background: "rgba(201,168,76,0.07)",
              border: "1px solid rgba(201,168,76,0.22)",
            }}
          >
            <div className="gs-badge-dot" />
            <Globe className="h-3.5 w-3.5" style={{ color: "#C9A84C" }} />
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "11px", fontWeight: 500,
              letterSpacing: "0.14em", textTransform: "uppercase",
              color: "#C9A84C",
            }}>
              Premium Service
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            className="gs-heading mb-5"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            style={{ color: "#f5f0e8", fontSize: "clamp(40px, 6vw, 66px)" }}
          >
            Global Job Application<br />
            <em style={{ color: "#C9A84C", fontStyle: "italic" }}>Assistance</em>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300, fontSize: "15px",
              color: "rgba(245,240,232,0.42)", lineHeight: 1.7,
              maxWidth: "420px", margin: "0 auto 56px",
            }}
          >
            Let our expert team handle your entire job search —{" "}
            from CV to application submission
          </motion.p>

          {/* Card */}
          <motion.div
            ref={cardRef}
            className="gs-card p-8 sm:p-10 text-left"
            initial={{ opacity: 0, y: 40 }}
            animate={cardInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Card top row */}
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-2">
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "11px", fontWeight: 600,
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  color: "#C9A84C",
                  background: "rgba(201,168,76,0.1)",
                  border: "1px solid rgba(201,168,76,0.25)",
                  borderRadius: "100px",
                  padding: "4px 12px",
                }}>
                  🌍 Premium
                </span>
              </div>
              <div className="gs-save-pill">
                Save KSh 10,000
              </div>
            </div>

            {/* Card title */}
            <h3 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 400, fontSize: "22px",
              color: "#f5f0e8", letterSpacing: "-0.01em",
              marginBottom: "20px",
            }} className="relative z-10">
              Global Application Assistance
            </h3>

            {/* Pricing */}
            <div className="flex items-end gap-3 mb-2 relative z-10">
              <span className="gs-price-num">
                KSh {priceDisplay.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-6 relative z-10">
              <span className="gs-original-price">KSh 30,000</span>
              <span style={{
                fontSize: "11px", color: "rgba(201,168,76,0.6)",
                fontWeight: 300,
              }}>— one-time fee</span>
            </div>

            <div className="gs-divider relative z-10" />

            {/* Features */}
            <ul className="mb-8 relative z-10" style={{ listStyle: "none", padding: 0, margin: "0 0 32px" }}>
              {FEATURES.map((f, i) => (
                <motion.li
                  key={i}
                  className="gs-feature-row flex items-start gap-3"
                  initial={{ opacity: 0, x: -12 }}
                  animate={cardInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.07, ease: "easeOut" }}
                >
                  <GoldCheck />
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "14px", fontWeight: 300,
                    color: "rgba(245,240,232,0.7)",
                    lineHeight: 1.5,
                  }}>
                    {f}
                  </span>
                </motion.li>
              ))}
            </ul>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={cardInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.85 }}
              className="relative z-10"
            >
              <Button
                onClick={() => setPaymentOpen(true)}
                className="gs-btn w-full"
              >
                Apply for Global Assistance
                <ArrowRight className="ml-2 h-4 w-4" style={{ transition: "transform 0.3s ease" }} />
              </Button>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px", fontWeight: 300,
                color: "rgba(245,240,232,0.25)",
                textAlign: "center", marginTop: "12px",
                letterSpacing: "0.03em",
              }}>
                Secure payment via M-Pesa · No hidden fees
              </p>
            </motion.div>
          </motion.div>

        </div>
      </section>
    </PageLayout>
  );
}
