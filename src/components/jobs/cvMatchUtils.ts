// Deterministic hash-based CV match score
export function hashJobId(id: string): number {
  let hash = 0;
  const str = id || "default";
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getCVMatchScore(jobKey: string): number {
  return 40 + (hashJobId(jobKey) % 55);
}

export function getScoreConfig(score: number) {
  if (score >= 80) {
    return {
      label: "Strong Match",
      bg: "rgba(34,197,94,0.15)",
      border: "#22c55e",
      text: "#22c55e",
      gradient: "from-green-500 to-emerald-400",
    };
  }
  if (score >= 50) {
    return {
      label: "Good Match",
      bg: "rgba(234,179,8,0.15)",
      border: "#eab308",
      text: "#eab308",
      gradient: "from-yellow-500 to-orange-400",
    };
  }
  return {
    label: "Needs Upgrade",
    bg: "rgba(239,68,68,0.15)",
    border: "#ef4444",
    text: "#ef4444",
    gradient: "from-red-500 to-orange-500",
  };
}

export function getSubScores(overall: number) {
  return {
    skills: Math.min(99, overall + 8),
    experience: Math.max(0, overall - 5),
    atsKeywords: Math.max(0, overall - 18),
    documentQuality: Math.max(0, overall - 22),
  };
}
