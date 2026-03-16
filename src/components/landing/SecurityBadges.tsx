import { Lock, ShieldCheck, Users } from "lucide-react";

const BADGES = [
  { icon: Lock, label: "Secure M-Pesa Payment" },
  { icon: ShieldCheck, label: "SSL Protected" },
  { icon: Users, label: "Trusted by 2,400+ Clients" },
];

export function SecurityBadges({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-4 ${className}`}>
      {BADGES.map((b, i) => (
        <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <b.icon className="h-3.5 w-3.5 text-primary" />
          <span>{b.label}</span>
        </div>
      ))}
    </div>
  );
}
