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

export default function LiveActivityPopup() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(false);
  const [timeAgo, setTimeAgo] = useState(getTimeAgo());

  useEffect(() => {
    const initial = setTimeout(() => {
      setTimeAgo(getTimeAgo());
      setVisible(true);
    }, 5000);

    return () => clearTimeout(initial);
  }, []);

  useEffect(() => {
    if (!visible) return;

    const dismiss = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(dismiss);
  }, [visible, current]);

  useEffect(() => {
    if (visible) return;

    const next = setTimeout(() => {
      setCurrent((c) => (c + 1) % ACTIVITIES.length);
      setTimeAgo(getTimeAgo());
      setVisible(true);
    }, 8000);

    return () => clearTimeout(next);
  }, [visible]);

  const activity = ACTIVITIES[current];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed left-4 right-4 z-[70] sm:left-6 sm:right-auto sm:max-w-sm"
          style={{
            bottom: "140px",
          }}
        >
          <div className="rounded-2xl border border-border bg-card/95 shadow-2xl backdrop-blur-md">
            <div className="flex items-start gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                👋
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">
                  {activity.name} <span className="font-normal text-muted-foreground">from {activity.city}</span>
                </p>
                <p className="mt-1 text-sm text-foreground/90">{activity.action}</p>
                <p className="mt-2 text-xs text-muted-foreground">{timeAgo}</p>
              </div>

              <button
                type="button"
                onClick={() => setVisible(false)}
                className="shrink-0 text-muted-foreground transition hover:text-foreground"
                aria-label="Close popup"
              >
                ✕
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
