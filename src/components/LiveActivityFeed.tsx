import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ACTIVITY_ENTRIES = [
  { name: "Wanjiru", city: "Nairobi", action: "just ordered a Professional CV" },
  { name: "Ochieng", city: "Kisumu", action: "downloaded his CV" },
  { name: "Amina", city: "Mombasa", action: "ordered ATS CV" },
  { name: "Kamau", city: "Nakuru", action: "received interview invite" },
  { name: "Akinyi", city: "Nairobi", action: "ordered Cover Letter" },
  { name: "Kipchoge", city: "Eldoret", action: "ordered Executive CV" },
  { name: "Njeri", city: "Thika", action: "ordered Chevening Essay" },
  { name: "Otieno", city: "Kisumu", action: "ordered LinkedIn rewrite" },
  { name: "Muthoni", city: "Nairobi", action: "received her CV in 2 hours" },
  { name: "Hassan", city: "Mombasa", action: "ordered Full Application Bundle" },
  { name: "Chebet", city: "Eldoret", action: "ordered Commonwealth Scholarship essay" },
  { name: "Odhiambo", city: "Nairobi", action: "ordered ATS-Friendly CV" },
  { name: "Wambui", city: "Nyeri", action: "ordered Personal Statement" },
  { name: "Brian", city: "Nairobi", action: "ordered CV + Cover Letter package" },
  { name: "Faith", city: "Nakuru", action: "received interview invite at Safaricom" },
  { name: "Kevin", city: "Nairobi", action: "ordered Rush Delivery upgrade" },
  { name: "Gloria", city: "Mombasa", action: "ordered Cover Letter for KCB" },
  { name: "Dennis", city: "Kisumu", action: "ordered MasterCard Foundation essay" },
  { name: "Lucy", city: "Nairobi", action: "ordered Erasmus Motivation Letter" },
  { name: "Victor", city: "Eldoret", action: "ordered ATS CV for tech role" },
  { name: "Sharon", city: "Nairobi", action: "downloaded her Cover Letter" },
  { name: "Peter", city: "Nakuru", action: "ordered Executive CV + Bio" },
  { name: "Mercy", city: "Thika", action: "ordered Scholarship Essay bundle" },
  { name: "James", city: "Nairobi", action: "ordered Chevening essays" },
  { name: "Christine", city: "Mombasa", action: "received her CV — 5-star review" },
  { name: "Collins", city: "Kisumu", action: "ordered Professional CV" },
  { name: "Lilian", city: "Nairobi", action: "ordered Reference Letter" },
  { name: "Michael", city: "Eldoret", action: "ordered Fulbright Personal Statement" },
  { name: "Nancy", city: "Nakuru", action: "upgraded to Executive tier" },
  { name: "Daniel", city: "Nairobi", action: "ordered CV for Equity Bank role" },
];

const TIME_LABELS = ["just now", "1m ago", "2m ago", "3m ago", "5m ago", "8m ago"];

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface LiveActivityFeedProps {
  variant?: "landing" | "sidebar";
}

export function LiveActivityFeed({ variant = "landing" }: LiveActivityFeedProps) {
  const [entries] = useState(() => shuffleArray(ACTIVITY_ENTRIES));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [onlineCount, setOnlineCount] = useState(() => 80 + Math.floor(Math.random() * 70));

  const nextEntry = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % entries.length);
  }, [entries.length]);

  useEffect(() => {
    const interval = setInterval(nextEntry, 4000);
    return () => clearInterval(interval);
  }, [nextEntry]);

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount((prev) => prev + Math.floor(Math.random() * 11) - 5);
    }, 8000 + Math.random() * 4000);
    return () => clearInterval(interval);
  }, []);

  const current = entries[currentIndex];
  const timeLabel = TIME_LABELS[Math.floor(Math.random() * TIME_LABELS.length)];

  if (variant === "sidebar") {
    return (
      <div className="px-3 py-3">
        <div className="rounded-lg bg-muted/50 border border-border p-3 space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-muted-foreground font-mono">
              {onlineCount.toLocaleString()} viewing CVEdge
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={currentIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="text-xs text-muted-foreground leading-relaxed"
            >
              <span className="text-foreground font-medium">{current.name}</span>{" "}
              from {current.city} {current.action} · {timeLabel}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 rounded-xl border border-primary/20 bg-card/60 surface-glass px-4 py-3">
      <div className="flex items-center gap-2 shrink-0">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
        </span>
        <span className="text-sm font-mono text-primary">
          {onlineCount.toLocaleString()} viewing now
        </span>
      </div>
      <div className="h-4 w-px bg-border" />
      <div className="overflow-hidden flex-1 min-w-0">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentIndex}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="text-sm text-muted-foreground truncate"
          >
            <span className="text-foreground font-medium">{current.name}</span>{" "}
            from {current.city} {current.action}{" "}
            <span className="text-primary">· {timeLabel}</span>
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
