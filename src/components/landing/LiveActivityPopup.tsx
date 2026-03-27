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
    const initial = setTimeout(() => setVisible(true), 99999999);
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

  return null;
}
