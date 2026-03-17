import { useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Section {
  heading: string;
  lines: string[];
}

interface PreviewData {
  name: string;
  title: string;
  sections: Section[];
}

interface SamplePreviewModalProps {
  item: {
    id: string;
    label: string;
    isCoverLetter?: boolean;
    preview: PreviewData;
  };
  onClose: () => void;
}

export function SamplePreviewModal({ item, onClose }: SamplePreviewModalProps) {
  // Copy protection
  const blockCopy = useCallback((e: Event) => e.preventDefault(), []);
  const blockKeys = useCallback((e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === "c" || e.key === "a" || e.key === "x")) {
      e.preventDefault();
    }
  }, []);

  useEffect(() => {
    document.addEventListener("copy", blockCopy);
    document.addEventListener("keydown", blockKeys);
    return () => {
      document.removeEventListener("copy", blockCopy);
      document.removeEventListener("keydown", blockKeys);
    };
  }, [blockCopy, blockKeys]);

  const { preview } = item;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-border/40 bg-card shadow-2xl"
          onClick={(e) => e.stopPropagation()}
          onContextMenu={(e) => e.preventDefault()}
          style={{ userSelect: "none", WebkitUserSelect: "none" }}
        >
          {/* Close */}
          <button onClick={onClose} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-background/80 border border-border/40 flex items-center justify-center hover:bg-background transition-colors">
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="p-6 pb-4 border-b border-border/30">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 mb-3">
              <Shield className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-mono text-primary">Protected preview</span>
            </div>
            <h2 className="text-lg font-serif font-bold">{item.label} — Sample</h2>
          </div>

          {/* CV Preview content */}
          <div className="p-6 relative">
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 overflow-hidden">
              <span
                className="text-primary/[0.06] text-6xl sm:text-8xl font-serif font-bold whitespace-nowrap"
                style={{ transform: "rotate(-25deg)" }}
              >
                CVEdge Preview
              </span>
            </div>

            {/* Name & title (visible) */}
            <div className="mb-4 relative z-20">
              <h3 className="text-xl font-serif font-bold text-foreground">{preview.name}</h3>
              <p className="text-sm text-primary font-medium">{preview.title}</p>
            </div>

            {/* First section — visible */}
            {preview.sections.length > 0 && (
              <div className="mb-4 relative z-20">
                {preview.sections[0].heading && (
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/70 border-b border-primary/20 pb-1 mb-2">
                    {preview.sections[0].heading}
                  </h4>
                )}
                {preview.sections[0].lines.map((line, li) => (
                  <p key={li} className="text-xs text-muted-foreground leading-relaxed">{line}</p>
                ))}
              </div>
            )}

            {/* Remaining sections — blurred */}
            <div className="relative z-20">
              <div className="filter blur-[3px] opacity-60 pointer-events-none">
                {preview.sections.slice(1).map((section, si) => (
                  <div key={si} className="mb-3">
                    {section.heading && (
                      <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/70 border-b border-border/20 pb-1 mb-1.5">
                        {section.heading}
                      </h4>
                    )}
                    {section.lines.map((line, li) => (
                      <p key={li} className="text-xs text-muted-foreground leading-relaxed">
                        {"•".repeat(Math.min(line.length, 60))}
                      </p>
                    ))}
                  </div>
                ))}
              </div>

              {/* Lock overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-card via-card/80 to-transparent">
                <Lock className="w-6 h-6 text-primary/60 mb-2" />
                <p className="text-xs text-muted-foreground font-medium">Full content available after order</p>
              </div>
            </div>
          </div>

          {/* CTA Footer */}
          <div className="p-6 pt-4 border-t border-border/30 bg-gradient-brand-subtle flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 text-center sm:text-left">
              <p className="text-sm font-semibold">Want a CV like this?</p>
              <p className="text-xs text-muted-foreground">Our writers will craft one tailored to your career</p>
            </div>
            <Link to={item.isCoverLetter ? "/cover-letter" : `/order?template=${item.id}`}>
              <Button size="sm" className="bg-gradient-brand border-0 font-semibold shadow-glow-sm gold-shimmer">
                Order This Style
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
