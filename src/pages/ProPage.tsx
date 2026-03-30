import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import MpesaPaymentModal from "@/components/MpesaPaymentModal";
import { trackViewContent } from "@/hooks/useFbPixel";

const BENEFITS = [
  "Unlimited CV edits & generations",
  "Unlimited ATS scans",
  "Priority job alerts by email",
  "Interview preparation tools",
  "Saved job matches",
  "Document vault (unlimited storage)",
  "Cover letter generator (unlimited)",
  "Early access to new features",
];

/* ── Animated count-up hook ── */
function useCountUp(target: number, active: boolean, duration = 1200) {
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

/* ── Amber check icon ── */
const AmberCheck = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0 mt-0.5">
    <circle cx="9" cy="9" r="8.5" stroke="url(#ac)" strokeWidth="1" />
    <path d="M6 9.5L8 11.5L12.5 7" stroke="url(#ac)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <defs>
      <linearGradient id="ac" x1="0" y1="0" x2="18" y2="18">
        <stop stopColor="#F5A623" />
        <stop offset="1" stopColor="#C27A0E" />
      </linearGradient>
    </defs>
  </svg>
);

export default function ProPage() {
  useEffect(() => { trackViewContent("CV Edge Pro", "Subscription"); }, []);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const isPro = localStorage.getItem("cvedge_pro") === "true";

  const cardRef = useRef(null);
  const cardInView = useInView(cardRef, { once: true, margin: "-80px" });
  const priceDisplay = useCountUp(2000, cardInView);

  return (
    <PageLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        .pro-section { font-family: 'DM Sans', sans-serif; }

        .pro-heading {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          letter-spacing: -0.02em;
          line-height: 1.08;
        }

        .pro-card {
          background:
            radial-gradient(ellipse at 15% 0%, rgba(212,146,42,0.09) 0%, transparent 55%),
            radial-gradient(ellipse at 85% 100%, rgba(212,146,42,0.06) 0%, transparent 55%),
            linear-gradient(160deg, #141209 0%, #0f0f0e 50%, #131108 100%);
          border: 1px solid rgba(212,146,42,0.22);
          box-shadow:
            0 0 0 1px rgba(0,0,0,0.6),
            0 32px 64px rgba(0,0,0,0.6),
            0 0 120px rgba(212,146,42,0.05),
            inset 0 1px 0 rgba(212,146,42,0.14);
          border-radius: 28px;
          position: relative;
          overflow: hidden;
        }

        /* Top shimmer line */
        .pro-card::before {
          content: '';
          position: absolute;
          top: 0; left: 10%; right: 10%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(212,146,42,0.7), transparent);
        }

        /* Grain texture */
        .pro-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: 0.4;
          border-radius: 28px;
        }

        .pro-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(212,146,42,0.18), transparent);
          margin: 20px 0;
        }

        .pro-price-num {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: clamp(52px, 9vw, 68px);
          letter-spacing: -0.03em;
          line-height: 1;
          background: linear-gradient(135deg, #F9D87A 0%, #D4922A 45%, #9A6010 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .pro-per-month {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 300;
          color: rgba(245,240,232,0.35);
          letter-spacing: 0.04em;
          margin-bottom: 2px;
        }

        .pro-popular-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(212,146,42,0.12);
          border: 1px solid rgba(212,146,42,0.28);
          border-radius: 100px;
          padding: 4px 12px;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.08em;
          color: #D4922A;
        }

        .pro-btn {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #D4922A 0%, #9A6010 50%, #D4922A 100%) !important;
          background-size: 200% 100% !important;
          border: none !important;
          height: 56px !important;
          font-family: 'DM Sans', sans-serif !important;
          font-weight: 500 !important;
          font-size: 15px !important;
          letter-spacing: 0.04em !important;
          color: #0a0700 !important;
          border-radius: 14px !important;
          transition: background-position 0.6s ease, transform 0.2s ease, box-shadow 0.3s ease !important;
          box-shadow: 0 4px 24px rgba(212,146,42,0.28), 0 1px 0 rgba(255,255,255,0.1) inset !important;
        }

        .pro-btn::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(120deg, transparent, rgba(255,255,255,0.22), transparent);
          transform: skewX(-20deg);
          transition: left 0.7s ease;
        }

        .pro-btn:hover::before { left: 160%; }
        .pro-btn:hover {
          background-position: 100% 0 !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 8px 32px rgba(212,146,42,0.42), 0 1px 0 rgba(255,255,255,0.15) inset !important;
        }
        .pro-btn:active { transform: translateY(0px) !important; }

        .pro-feature-row {
          transition: background 0.2s ease, border-left-color 0.2s ease;
          border-radius: 10px;
          border-left: 2px solid transparent;
          padding: 9px 10px 9px 12px;
          margin: 0 -10px;
        }
        .pro-feature-row:hover {
          background: rgba(212,146,42,0.05);
          border-left-color: rgba(212,146,42,0.4);
        }

        .pro-badge-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #D4922A;
          box-shadow: 0 0 8px rgba(212,146,42,0.9);
          animation: pro-pulse 2s ease-in-out infinite;
        }
        @keyframes pro-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        .pro-star-pulse {
          animation: star-glow 2.5s ease-in-out infinite;
        }
        @keyframes star-glow {
          0%, 100% { filter: drop-shadow(0 0 3px rgba(212,146,42,0.6)); opacity: 1; }
          50% { filter: drop-shadow(0 0 8px rgba(212,146,42,0.9)); opacity: 0.85; }
        }

        .pro-already-pill {
          background: rgba(34,197,94,0.08);
          border: 1px solid rgba(34,197,94,0.25);
          border-radius: 16px;
          padding: 18px 20px;
          text-align: center;
        }
      `}</style>

      <MpesaPaymentModal open={paymentOpen} onClose={() => setPaymentOpen(false)} defaultPackage="pro-monthly" />

      <section className="pro-section relative z-10 pt-16 sm:pt-24 pb-28 px-4">

        {/* Ambient glow */}
        <div style={{
          position: "absolute", top: "8%", left: "50%", transform: "translateX(-50%)",
          width: "560px", height: "380px",
          background: "radial-gradient(ellipse, rgba(212,146,42,0.07) 0%, transparent 70%)",
          pointerEvents: "none", filter: "blur(50px)",
        }} />

        <div className="container max-w-xl mx-auto text-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-8"
            style={{
              background: "rgba(212,146,42,0.07)",
              border: "1px solid rgba(212,146,42,0.22)",
            }}
          >
            <div className="pro-badge-dot" />
            <Star className="h-3.5 w-3.5 pro-star-pulse" style={{ color: "#D4922A", fill: "#D4922A" }} />
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "11px", fontWeight: 500,
              letterSpacing: "0.14em", textTransform: "uppercase",
              color: "#D4922A",
            }}>
              Premium Membership
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            className="pro-heading mb-5"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            style={{ color: "#f5f0e8", fontSize: "clamp(42px, 6vw, 68px)" }}
          >
            CV Edge{" "}
            <em style={{ color: "#D4922A", fontStyle: "italic" }}>Pro</em>
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
              maxWidth: "400px", margin: "0 auto 56px",
            }}
          >
            Unlock unlimited access to all CV Edge tools. Build, scan, and optimize without limits.
          </motion.p>

          {/* Card */}
          <motion.div
            ref={cardRef}
            className="pro-card p-8 sm:p-10 text-left"
            initial={{ opacity: 0, y: 40 }}
            animate={cardInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Card header row */}
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 pro-star-pulse" style={{ color: "#D4922A", fill: "#D4922A" }} />
                <span style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "17px", fontWeight: 400,
                  color: "#f5f0e8", letterSpacing: "0.01em",
                }}>
                  CV Edge Pro
                </span>
              </div>
              <div className="pro-popular-pill">
                ✦ Most Popular
              </div>
            </div>

            {/* Pricing */}
            <div className="flex items-end gap-2 mb-1 relative z-10">
              <span className="pro-price-num">
                KSh {priceDisplay.toLocaleString()}
              </span>
            </div>
            <p className="pro-per-month mb-6 relative z-10">per month · billed monthly</p>

            <div className="pro-divider relative z-10" />

            {/* Benefits */}
            <ul className="mb-8 relative z-10" style={{ listStyle: "none", padding: 0, margin: "0 0 32px" }}>
              {BENEFITS.map((b, i) => (
                <motion.li
                  key={i}
                  className="pro-feature-row flex items-start gap-3"
                  initial={{ opacity: 0, x: -12 }}
                  animate={cardInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.07, ease: "easeOut" }}
                >
                  <AmberCheck />
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "14px", fontWeight: 300,
                    color: "rgba(245,240,232,0.7)",
                    lineHeight: 1.5,
                  }}>
                    {b}
                  </span>
                </motion.li>
              ))}
            </ul>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={cardInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="relative z-10"
            >
              {isPro ? (
                <div className="pro-already-pill">
                  <p style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "14px", fontWeight: 500,
                    color: "rgba(134,239,172,0.9)",
                  }}>
                    ✅ You're a Pro member — enjoy unlimited access
                  </p>
                </div>
              ) : (
                <>
                  <Button
                    onClick={() => setPaymentOpen(true)}
                    className="pro-btn w-full"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Upgrade to Pro — KSh 2,000/month
                  </Button>
                  <p style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "11px", fontWeight: 300,
                    color: "rgba(245,240,232,0.22)",
                    textAlign: "center", marginTop: "12px",
                    letterSpacing: "0.04em",
                  }}>
                    Cancel anytime · No long-term commitment · Secure via M-Pesa
                  </p>
                </>
              )}
            </motion.div>
          </motion.div>

        </div>
      </section>
    </PageLayout>
  );
}
