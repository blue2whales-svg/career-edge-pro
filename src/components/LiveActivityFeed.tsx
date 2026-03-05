import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ACTIVITY_ENTRIES = [
  { name: "Chidi", city: "Lagos", action: "just ordered an Executive CV" },
  { name: "Sara", city: "Dubai", action: "downloaded her CV" },
  { name: "James", city: "London", action: "ordered ATS CV" },
  { name: "Amara", city: "Nairobi", action: "received interview invite" },
  { name: "Mohammed", city: "Riyadh", action: "upgraded to Elite" },
  { name: "Priya", city: "Mumbai", action: "ordered Cover Letter" },
  { name: "Tunde", city: "Abuja", action: "ordered Chevening Essay" },
  { name: "Sophie", city: "Berlin", action: "ordered Erasmus Motivation Letter" },
  { name: "David", city: "Houston", action: "ordered Executive CV" },
  { name: "Fatima", city: "Abu Dhabi", action: "downloaded LinkedIn rewrite" },
  { name: "Kwame", city: "Accra", action: "ordered Commonwealth Scholarship essay" },
  { name: "Aisha", city: "Islamabad", action: "ordered Fulbright Personal Statement" },
  { name: "Carlos", city: "São Paulo", action: "ordered International CV" },
  { name: "Yemi", city: "Abuja", action: "just got Chevening interview" },
  { name: "Ngozi", city: "Enugu", action: "ordered Full Application Bundle" },
  { name: "Grace", city: "Accra", action: "downloaded her Cover Letter" },
  { name: "Ravi", city: "Bangalore", action: "ordered ATS-Friendly CV" },
  { name: "Elena", city: "Madrid", action: "ordered CV Translation" },
  { name: "Hassan", city: "Istanbul", action: "upgraded to Edge Pro" },
  { name: "Mei", city: "Singapore", action: "ordered LinkedIn Profile Optimisation" },
  { name: "Oluwaseun", city: "Port Harcourt", action: "ordered Professional CV" },
  { name: "Anna", city: "Warsaw", action: "received her DAAD essay" },
  { name: "Omar", city: "Jeddah", action: "ordered Executive Bio" },
  { name: "Liam", city: "Toronto", action: "ordered CV + Cover Letter package" },
  { name: "Chloe", city: "Melbourne", action: "ordered Australia Awards essay" },
  { name: "Budi", city: "Jakarta", action: "ordered Professional Reference Letter" },
  { name: "Nina", city: "Cape Town", action: "received interview invite at Deloitte" },
  { name: "Marco", city: "Munich", action: "ordered DAAD Motivation Letter" },
  { name: "Suki", city: "Manila", action: "ordered Scholarship Essay bundle" },
  { name: "Ahmed", city: "Cairo", action: "downloaded his Executive CV" },
  { name: "Zara", city: "Lahore", action: "ordered Personal Statement" },
  { name: "Chen", city: "Shanghai", action: "ordered International CV" },
  { name: "Emeka", city: "Lagos", action: "ordered Rush Delivery upgrade" },
  { name: "Maria", city: "Mexico City", action: "ordered Cover Letter for Amazon" },
  { name: "Tariq", city: "Karachi", action: "ordered MasterCard Foundation essay" },
  { name: "Julia", city: "Lisbon", action: "ordered Erasmus Motivation Letter" },
  { name: "Kofi", city: "Kumasi", action: "ordered ATS CV for fintech role" },
  { name: "Sarah", city: "Dublin", action: "received her CV in 2 hours" },
  { name: "Diego", city: "Buenos Aires", action: "ordered Executive CV + Bio" },
  { name: "Lena", city: "Stockholm", action: "ordered Swedish Institute essay" },
  { name: "Adebayo", city: "Ibadan", action: "ordered Chevening essays" },
  { name: "Emma", city: "Sydney", action: "downloaded her Cover Letter" },
  { name: "Raj", city: "Delhi", action: "ordered Gates Cambridge essay" },
  { name: "Ines", city: "Paris", action: "ordered CV Editing & Proofreading" },
  { name: "Alex", city: "Chicago", action: "ordered Knight-Hennessy essays" },
  { name: "Mia", city: "Oslo", action: "ordered Professional CV package" },
  { name: "Javier", city: "Bogotá", action: "ordered International CV" },
  { name: "Khalid", city: "Dubai", action: "upgraded to Executive tier" },
  { name: "Wanjiru", city: "Nairobi", action: "ordered Commonwealth essay" },
  { name: "Lisa", city: "Amsterdam", action: "received her CV — 5-star review" },
  { name: "Chinonso", city: "Owerri", action: "ordered Full Application Bundle" },
  { name: "Sven", city: "Copenhagen", action: "ordered Orange Knowledge essay" },
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
  const [onlineCount, setOnlineCount] = useState(() => 180 + Math.floor(Math.random() * 170));

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