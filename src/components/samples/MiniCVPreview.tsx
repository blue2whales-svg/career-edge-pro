import { memo } from "react";
import type { CVTemplate } from "@/data/cv-templates";

interface MiniCVPreviewProps {
  template: CVTemplate;
  accentColor?: string;
}

/** Renders a tiny realistic CV document in pure HTML/CSS */
function MiniCVPreviewInner({ template, accentColor }: MiniCVPreviewProps) {
  const color = accentColor || template.colors[0];

  if (template.layout === "sidebar" || template.layout === "two-column") {
    return <TwoColumnCV color={color} template={template} />;
  }
  if (template.layout === "photo") {
    return <PhotoCV color={color} template={template} />;
  }
  return <SingleColumnCV color={color} template={template} />;
}

function SingleColumnCV({ color, template }: { color: string; template: CVTemplate }) {
  const isExecutive = template.style === "executive";
  const isAts = template.style === "ats";

  return (
    <div className="w-full aspect-[3/4] bg-white rounded-sm overflow-hidden text-left p-3 flex flex-col" style={{ fontSize: "5px", lineHeight: 1.5 }}>
      {/* Header */}
      <div className="mb-2 pb-1.5" style={{ borderBottom: `1.5px solid ${color}` }}>
        <div className="font-bold text-[9px] tracking-wide" style={{ color: isExecutive ? color : "#111" }}>
          JAMES MITCHELL
        </div>
        <div className="text-[5.5px] mt-0.5" style={{ color }}>
          Senior Marketing Manager
        </div>
        <div className="text-[4px] text-gray-400 mt-0.5">
          james@email.com · +254 712 345 678 · Nairobi, Kenya
        </div>
      </div>

      {/* Summary */}
      <div className="mb-1.5">
        <div className="font-bold text-[5px] uppercase tracking-widest mb-0.5" style={{ color }}>
          {isAts ? "Professional Summary" : "Profile"}
        </div>
        <div className="text-[4.5px] text-gray-600 leading-relaxed">
          Results-driven marketing professional with 8+ years of experience in brand strategy, digital marketing, and team leadership across East African markets.
        </div>
      </div>

      {/* Experience */}
      <div className="mb-1.5 flex-1">
        <div className="font-bold text-[5px] uppercase tracking-widest mb-0.5" style={{ color }}>
          Work Experience
        </div>
        <div className="mb-1">
          <div className="flex justify-between items-baseline">
            <span className="font-bold text-[5px] text-gray-800">Marketing Director</span>
            <span className="text-[4px] text-gray-400">2021 – Present</span>
          </div>
          <div className="text-[4px] text-gray-500 italic">Safaricom PLC, Nairobi</div>
          <div className="text-[4.5px] text-gray-600 mt-0.5 space-y-px">
            <div>• Increased brand engagement by 43% through digital campaigns</div>
            <div>• Led a team of 12 marketing professionals</div>
            <div>• Managed annual budget of KES 50M</div>
          </div>
        </div>
        <div>
          <div className="flex justify-between items-baseline">
            <span className="font-bold text-[5px] text-gray-800">Senior Brand Manager</span>
            <span className="text-[4px] text-gray-400">2018 – 2021</span>
          </div>
          <div className="text-[4px] text-gray-500 italic">Equity Bank Group</div>
          <div className="text-[4.5px] text-gray-600 mt-0.5 space-y-px">
            <div>• Drove 28% increase in customer acquisition</div>
            <div>• Launched 5 successful product campaigns</div>
          </div>
        </div>
      </div>

      {/* Education */}
      <div className="mb-1">
        <div className="font-bold text-[5px] uppercase tracking-widest mb-0.5" style={{ color }}>
          Education
        </div>
        <div className="text-[4.5px] text-gray-700 font-semibold">MBA, Marketing — University of Nairobi</div>
        <div className="text-[4px] text-gray-400">2015 – 2017</div>
      </div>

      {/* Skills */}
      <div>
        <div className="font-bold text-[5px] uppercase tracking-widest mb-0.5" style={{ color }}>
          Skills
        </div>
        <div className="flex flex-wrap gap-0.5">
          {["Brand Strategy", "Digital Marketing", "SEO/SEM", "Team Leadership", "Analytics"].map((s) => (
            <span key={s} className="text-[4px] px-1 py-px rounded-sm" style={{ background: `${color}15`, color }}>
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function TwoColumnCV({ color, template }: { color: string; template: CVTemplate }) {
  const isSidebar = template.layout === "sidebar";
  const isDark = template.id === "sidebar-dark" || template.style === "creative";

  return (
    <div className="w-full aspect-[3/4] bg-white rounded-sm overflow-hidden flex" style={{ fontSize: "5px", lineHeight: 1.5 }}>
      {/* Sidebar */}
      <div
        className="w-[35%] p-2 flex flex-col"
        style={{ background: isDark ? color : `${color}10`, color: isDark ? "#fff" : color }}
      >
        {/* Avatar circle */}
        {template.layout === "sidebar" && (
          <div className="w-6 h-6 rounded-full mx-auto mb-1.5" style={{ background: isDark ? "rgba(255,255,255,0.15)" : `${color}25` }} />
        )}
        <div className="font-bold text-[6px] text-center mb-0.5" style={{ color: isDark ? "#fff" : "#111" }}>
          JAMES
        </div>
        <div className="font-bold text-[6px] text-center mb-1.5" style={{ color: isDark ? "#fff" : "#111" }}>
          MITCHELL
        </div>

        <div className="text-[4.5px] font-bold uppercase tracking-widest mb-0.5 opacity-70">Contact</div>
        <div className="text-[4px] opacity-80 mb-1.5 space-y-px">
          <div>james@email.com</div>
          <div>+254 712 345 678</div>
          <div>Nairobi, Kenya</div>
        </div>

        <div className="text-[4.5px] font-bold uppercase tracking-widest mb-0.5 opacity-70">Skills</div>
        <div className="text-[4px] opacity-80 space-y-px mb-1.5">
          <div>• Brand Strategy</div>
          <div>• Digital Marketing</div>
          <div>• Team Leadership</div>
          <div>• Data Analytics</div>
          <div>• SEO / SEM</div>
        </div>

        <div className="text-[4.5px] font-bold uppercase tracking-widest mb-0.5 opacity-70">Languages</div>
        <div className="text-[4px] opacity-80 space-y-px">
          <div>English — Fluent</div>
          <div>Swahili — Native</div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-2.5 text-left">
        <div className="font-bold text-[5px] uppercase tracking-widest mb-0.5" style={{ color }}>Profile</div>
        <div className="text-[4.5px] text-gray-600 mb-1.5">
          Results-driven marketing professional with 8+ years in brand strategy and digital marketing across East Africa.
        </div>

        <div className="font-bold text-[5px] uppercase tracking-widest mb-0.5" style={{ color }}>Experience</div>
        <div className="mb-1">
          <div className="font-bold text-[5px] text-gray-800">Marketing Director</div>
          <div className="text-[4px] text-gray-400">Safaricom PLC · 2021 – Present</div>
          <div className="text-[4.5px] text-gray-600 mt-0.5 space-y-px">
            <div>• Increased engagement by 43%</div>
            <div>• Led team of 12 professionals</div>
            <div>• Managed KES 50M budget</div>
          </div>
        </div>
        <div className="mb-1">
          <div className="font-bold text-[5px] text-gray-800">Senior Brand Manager</div>
          <div className="text-[4px] text-gray-400">Equity Bank · 2018 – 2021</div>
          <div className="text-[4.5px] text-gray-600 mt-0.5 space-y-px">
            <div>• Drove 28% customer growth</div>
            <div>• Launched 5 campaigns</div>
          </div>
        </div>

        <div className="font-bold text-[5px] uppercase tracking-widest mb-0.5" style={{ color }}>Education</div>
        <div className="text-[4.5px] text-gray-700 font-semibold">MBA — University of Nairobi</div>
        <div className="text-[4px] text-gray-400">2015 – 2017</div>
      </div>
    </div>
  );
}

function PhotoCV({ color, template }: { color: string; template: CVTemplate }) {
  return (
    <div className="w-full aspect-[3/4] bg-white rounded-sm overflow-hidden text-left" style={{ fontSize: "5px", lineHeight: 1.5 }}>
      {/* Photo header band */}
      <div className="flex items-center gap-2 p-2.5 pb-2" style={{ borderBottom: `1.5px solid ${color}` }}>
        <div className="w-8 h-8 rounded-full shrink-0" style={{ background: `${color}25` }}>
          <div className="w-full h-full rounded-full flex items-center justify-center text-[8px] font-bold" style={{ color }}>
            JM
          </div>
        </div>
        <div>
          <div className="font-bold text-[8px] text-gray-900">JAMES MITCHELL</div>
          <div className="text-[5.5px]" style={{ color }}>Senior Marketing Manager</div>
          <div className="text-[4px] text-gray-400">james@email.com · +254 712 345 678</div>
        </div>
      </div>

      <div className="p-2.5 pt-1.5">
        <div className="font-bold text-[5px] uppercase tracking-widest mb-0.5" style={{ color }}>Profile</div>
        <div className="text-[4.5px] text-gray-600 mb-1.5">
          Marketing professional with 8+ years of brand strategy experience in East African markets.
        </div>

        <div className="font-bold text-[5px] uppercase tracking-widest mb-0.5" style={{ color }}>Experience</div>
        <div className="mb-1">
          <div className="flex justify-between">
            <span className="font-bold text-[5px] text-gray-800">Marketing Director</span>
            <span className="text-[4px] text-gray-400">2021 – Present</span>
          </div>
          <div className="text-[4px] text-gray-500 italic">Safaricom PLC</div>
          <div className="text-[4.5px] text-gray-600 mt-0.5 space-y-px">
            <div>• Increased engagement by 43%</div>
            <div>• Led team of 12 professionals</div>
          </div>
        </div>

        <div className="font-bold text-[5px] uppercase tracking-widest mb-0.5" style={{ color }}>Education</div>
        <div className="text-[4.5px] text-gray-700 font-semibold">MBA — University of Nairobi</div>
        <div className="text-[4px] text-gray-400">2015 – 2017</div>

        <div className="font-bold text-[5px] uppercase tracking-widest mb-0.5 mt-1.5" style={{ color }}>Skills</div>
        <div className="flex flex-wrap gap-0.5">
          {["Brand Strategy", "Digital Marketing", "Analytics", "SEO"].map((s) => (
            <span key={s} className="text-[4px] px-1 py-px rounded-sm" style={{ background: `${color}15`, color }}>
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export const MiniCVPreview = memo(MiniCVPreviewInner);
