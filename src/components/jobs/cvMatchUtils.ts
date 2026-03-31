// Job signal badges — data-driven from real job fields
export function getJobBadges(job: {
  hot_score?: number;
  visa_sponsorship?: boolean;
  market?: string;
  category?: string;
  hot?: boolean;
}): { label: string; emoji: string; color: string; border: string; bg: string }[] {
  const badges = [];

  // High Demand
  if ((job.hot_score && job.hot_score >= 65) || job.hot) {
    badges.push({
      label: "High Demand",
      emoji: "🔥",
      color: "#f97316",
      border: "#f97316",
      bg: "rgba(249,115,22,0.12)",
    });
  }

  // Visa Sponsored
  if (job.visa_sponsorship) {
    badges.push({
      label: "Visa Sponsored",
      emoji: "✈️",
      color: "#38bdf8",
      border: "#38bdf8",
      bg: "rgba(56,189,248,0.12)",
    });
  }

  // Market-based
  const intlMarkets = [
    "UAE",
    "Qatar",
    "Saudi Arabia",
    "UK",
    "Canada",
    "Australia",
    "Germany",
    "Netherlands",
    "France",
    "Europe",
  ];
  if (job.market && intlMarkets.includes(job.market)) {
    badges.push({
      label: "International Role",
      emoji: "🌍",
      color: "#a78bfa",
      border: "#a78bfa",
      bg: "rgba(167,139,250,0.12)",
    });
  }

  // Cruise
  if (job.category === "Cruise Jobs" || job.market === "Cruise") {
    badges.push({
      label: "Cruise Line",
      emoji: "🚢",
      color: "#22d3ee",
      border: "#22d3ee",
      bg: "rgba(34,211,238,0.12)",
    });
  }

  // Remote
  if (job.market === "Remote" || job.category === "Remote Jobs") {
    badges.push({
      label: "Remote",
      emoji: "💻",
      color: "#4ade80",
      border: "#4ade80",
      bg: "rgba(74,222,128,0.12)",
    });
  }

  // Kenya local
  if (job.market === "Kenya") {
    badges.push({
      label: "Kenya",
      emoji: "🇰🇪",
      color: "#86efac",
      border: "#86efac",
      bg: "rgba(134,239,172,0.12)",
    });
  }

  return badges;
}
