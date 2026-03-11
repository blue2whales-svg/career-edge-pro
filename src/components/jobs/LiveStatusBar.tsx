import { useState, useEffect } from "react";

interface LiveStatusBarProps {
  jobCount: number;
  isRefreshing: boolean;
  onRefresh: () => void;
}

export function LiveStatusBar({ jobCount, isRefreshing, onRefresh }: LiveStatusBarProps) {
  const [minutesAgo, setMinutesAgo] = useState(0);
  const [mountTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setMinutesAgo(Math.floor((Date.now() - mountTime) / 60000));
    }, 60000);
    return () => clearInterval(interval);
  }, [mountTime]);

  // Hourly auto-refresh
  useEffect(() => {
    const interval = setInterval(() => {
      onRefresh();
      setMinutesAgo(0);
    }, 3600000);
    return () => clearInterval(interval);
  }, [onRefresh]);

  return (
    <div
      className="flex flex-wrap items-center justify-between gap-2 rounded-lg px-4 py-2.5 text-[13px]"
      style={{
        background: "rgba(34,197,94,0.05)",
        border: "1px solid rgba(34,197,94,0.15)",
      }}
    >
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </span>
        <span style={{ color: "#22c55e" }}>Live</span>
        <span className="text-muted-foreground">• Jobs updating hourly</span>
      </div>
      <div className="flex items-center gap-3 text-muted-foreground">
        <span>
          {isRefreshing ? "🔄 Refreshing jobs..." : `🔄 Last refreshed: ${minutesAgo === 0 ? "just now" : `${minutesAgo} min ago`}`}
        </span>
        <span>📊 {jobCount} live jobs found</span>
      </div>
    </div>
  );
}
