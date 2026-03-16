import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ACTIVITIES = [
  { name: "James", city: "Nairobi", action: "just ordered a Professional CV" },
  { name: "Aisha", city: "Dubai", action: "just downloaded her CV" },
  { name: "Brian", city: "London", action: "just ordered Going Abroad package" },
  { name: "Grace", city: "Toronto", action: "just got her cover letter" },
  { name: "Ahmed", city: "Doha", action: "just ordered an Executive CV" },
  { name: "Linda", city: "Sydney", action: "just downloaded her LinkedIn profile" },
  { name: "Peter", city: "Berlin", action: "just ordered a Starter CV" },
  { name: "Fatima", city: "Riyadh", action: "just received her ATS report" },
];

function getTimeAgo() {
  return `${Math.floor(Math.random() * 5) + 1} min ago`;
}

export function LiveActivityPopup() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show first popup after 5s
    const initial = setTimeout(() => setVisible(true), 5000);
    return () => clearTimeout(initial);
  }, []);

  useEffect(() => {
    if (!visible) return;
    // Auto-dismiss after 4s
    const dismiss = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(dismiss);
  }, [visible, current]);

  useEffect(() => {
    if (visible) return;
    // Show next after 8s gap
    const next = setTimeout(() => {
      setCurrent((c) => (c + 1) % ACTIVITIES.length);
      setVisible(true);
    }, 8000);
    return () => clearTimeout(next);
  }, [visible]);

  const activity = ACTIVITIES[current];

  return (
    <div className="fixed bottom-6 left-6 z-50 max-w-xs pointer-events-none">
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: -10 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="rounded-xl border border-border bg-card p-3.5 shadow-lg pointer-events-auto"
            style={{ background: "hsl(222 40% 7%)" }}
          >
            <div className="flex items-start gap-3">
              <span className="relative mt-1 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block absolute inset-0 animate-ping opacity-75" />
              </span>
              <div>
                <p className="text-sm text-foreground leading-snug">
                  <strong>{activity.name}</strong> from {activity.city} {activity.action}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{getTimeAgo()}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
