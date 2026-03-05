import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ACTIVITY_ENTRIES = [
  { name: "Priya", city: "Mumbai", action: "just got an interview at Google" },
  { name: "James", city: "London", action: "applied to 3 jobs" },
  { name: "Sofia", city: "São Paulo", action: "received an offer" },
  { name: "Amara", city: "Lagos", action: "just got an interview at Meta" },
  { name: "Chen", city: "Shanghai", action: "uploaded a new CV" },
  { name: "Fatima", city: "Dubai", action: "generated a cover letter" },
  { name: "Liam", city: "Toronto", action: "moved to interview stage" },
  { name: "Aisha", city: "Nairobi", action: "applied to 5 roles" },
  { name: "Marco", city: "Berlin", action: "received a screening call" },
  { name: "Yuki", city: "Tokyo", action: "tracked a new application" },
  { name: "David", city: "New York", action: "got an offer from Stripe" },
  { name: "Maria", city: "Mexico City", action: "applied to 2 jobs" },
  { name: "Oluwaseun", city: "Abuja", action: "generated AI cover letter" },
  { name: "Emma", city: "Sydney", action: "moved to offer stage" },
  { name: "Raj", city: "Bangalore", action: "uploaded portfolio" },
  { name: "Ines", city: "Paris", action: "applied to a startup" },
  { name: "Carlos", city: "Buenos Aires", action: "got an interview at Amazon" },
  { name: "Nina", city: "Cape Town", action: "received 2 responses" },
  { name: "Ahmed", city: "Cairo", action: "set up Zapier automation" },
  { name: "Sven", city: "Stockholm", action: "tracked 4 applications" },
  { name: "Mei", city: "Singapore", action: "generated CV summary" },
  { name: "Diego", city: "Manila", action: "applied to a remote role" },
  { name: "Sarah", city: "Dublin", action: "got an interview at Shopify" },
  { name: "Kwame", city: "Accra", action: "uploaded new documents" },
  { name: "Anna", city: "Warsaw", action: "moved to screening stage" },
  { name: "Omar", city: "Riyadh", action: "applied to 6 jobs today" },
  { name: "Lisa", city: "Amsterdam", action: "received an offer" },
  { name: "Tariq", city: "Karachi", action: "generated a tailored CV" },
  { name: "Julia", city: "Lisbon", action: "tracked a deadline" },
  { name: "Kofi", city: "Kumasi", action: "applied to a fintech role" },
  { name: "Elena", city: "Madrid", action: "got a response from Netflix" },
  { name: "Hassan", city: "Istanbul", action: "applied to 2 companies" },
  { name: "Chloe", city: "Melbourne", action: "uploaded a cover letter" },
  { name: "Budi", city: "Jakarta", action: "set up auto follow-ups" },
  { name: "Grace", city: "Vancouver", action: "moved to final round" },
  { name: "Ravi", city: "Delhi", action: "applied to a FAANG company" },
  { name: "Lena", city: "Munich", action: "received interview invite" },
  { name: "Chidi", city: "Port Harcourt", action: "generated 3 cover letters" },
  { name: "Alex", city: "Chicago", action: "tracked an offer deadline" },
  { name: "Mia", city: "Oslo", action: "applied to her dream job" },
  { name: "Javier", city: "Bogotá", action: "got an interview at Uber" },
  { name: "Zara", city: "Lahore", action: "uploaded a new portfolio" },
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
  const [onlineCount, setOnlineCount] = useState(() => 2400 + Math.floor(Math.random() * 800));

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
              {onlineCount.toLocaleString()} online globally
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
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card/60 surface-glass px-4 py-3">
      <div className="flex items-center gap-2 shrink-0">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
        </span>
        <span className="text-sm font-mono text-muted-foreground">
          {onlineCount.toLocaleString()} online
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
