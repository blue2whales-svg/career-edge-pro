import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";

export default function ChatPrompt() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 18000); // 18s
    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const hideTimer = setTimeout(() => setVisible(false), 12000); // auto-hide after 12s
    return () => clearTimeout(hideTimer);
  }, [visible]);

  const openTawk = () => {
    if (typeof window !== "undefined" && (window as any).Tawk_API?.maximize) {
      (window as any).Tawk_API.maximize();
    }
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="fixed bottom-32 right-4 md:bottom-24 md:right-6 z-[60] max-w-[280px] cursor-pointer"
          onClick={openTawk}
        >
          <div className="relative bg-primary text-primary-foreground rounded-2xl rounded-br-sm px-4 py-3 shadow-xl">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setVisible(false);
              }}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-background text-foreground flex items-center justify-center shadow-md hover:bg-accent transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-start gap-2.5">
              <MessageCircle className="w-5 h-5 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold leading-tight">Hey there! 👋</p>
                <p className="text-xs opacity-90 mt-1 leading-snug">
                  Need help with your CV or career docs? Chat with us now!
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
