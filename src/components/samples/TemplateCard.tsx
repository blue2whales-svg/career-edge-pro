import { useState } from "react";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { Link } from "react-router-dom";
import type { CVTemplate } from "@/data/cv-templates";
import { MiniCVPreview } from "./MiniCVPreview";

interface TemplateCardProps {
  template: CVTemplate;
  index: number;
}

export function TemplateCard({ template, index }: TemplateCardProps) {
  const [activeColor, setActiveColor] = useState(template.colors[0]);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.5), duration: 0.35 }}
      className="group flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Card preview */}
      <div
        className="relative rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-shadow duration-300 cursor-pointer bg-gray-50"
        onContextMenu={(e) => e.preventDefault()}
        style={{ userSelect: "none" }}
      >
        {/* CV Preview */}
        <div className="p-3 pb-2">
          <MiniCVPreview template={template} accentColor={activeColor} />
        </div>

        {/* Hover overlay */}
        <motion.div
          initial={false}
          animate={{ opacity: hovered ? 1 : 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center pointer-events-none"
          style={{ pointerEvents: hovered ? "auto" : "none" }}
        >
          <Link
            to={`/cv-builder?template=${template.id}`}
            className="px-5 py-2.5 rounded-lg font-semibold text-sm shadow-lg transition-transform hover:scale-105"
            style={{ background: "linear-gradient(135deg, hsl(43 55% 54%), hsl(43 60% 70%))", color: "#0f1b2d" }}
          >
            Use This Template
          </Link>
        </motion.div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between px-3 pb-2.5 pt-1">
          {/* Color dots */}
          <div className="flex gap-1.5">
            {template.colors.map((c) => (
              <button
                key={c}
                onClick={(e) => { e.stopPropagation(); setActiveColor(c); }}
                className="w-4 h-4 rounded-full border-2 transition-transform hover:scale-110"
                style={{
                  background: c,
                  borderColor: c === activeColor ? c : "transparent",
                  boxShadow: c === activeColor ? `0 0 0 2px white, 0 0 0 3px ${c}` : "none",
                }}
              />
            ))}
          </div>

          {/* Format badges */}
          <div className="flex gap-1">
            <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-red-50 text-red-600 border border-red-100">PDF</span>
            <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100">DOCX</span>
          </div>
        </div>
      </div>

      {/* Template info */}
      <div className="mt-2.5 px-0.5">
        <h3 className="font-bold text-sm text-gray-900">{template.name}</h3>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{template.description}</p>
      </div>
    </motion.div>
  );
}
