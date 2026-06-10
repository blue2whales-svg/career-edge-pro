import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Bell, Send, Trash2, Plus, CheckCircle2 } from "lucide-react";

const JOBS_FN = "https://jxuqpxzsbkkywieughgh.supabase.co/functions/v1/manage-job-alerts";
const ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4dXFweHpzYmtreXdpZXVnaGdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3NDExMjgsImV4cCI6MjA4ODMxNzEyOH0.nzT2xXLGfhmY-ibQBqDMd790_01AihREvgc3ZR6053o";

interface Alert {
  id?: string;
  email: string;
  keywords: string[];
  markets: string[];
  include_visa: boolean;
  verified_only: boolean;
  frequency_hours: number;
  active: boolean;
  last_sent_at?: string | null;
  last_job_count?: number;
}

const MARKETS = ["Remote", "Worldwide", "Kenya", "Africa", "UK", "USA", "Germany", "Canada"];

async function callApi(action: string, requesterEmail: string, extra: any = {}) {
  const res = await fetch(JOBS_FN, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: ANON, Authorization: `Bearer ${ANON}` },
    body: JSON.stringify({ action, requesterEmail, ...extra }),
  });
  return res.json();
}

export default function PortalAlertsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [authEmail, setAuthEmail] = useState<string>("");
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [draft, setDraft] = useState<Alert | null>(null);
  const [keywordsText, setKeywordsText] = useState("");

  const refresh = async (email: string) => {
    setLoading(true);
    const r = await callApi("list", email);
    if (r.ok) setAlerts(r.alerts || []);
    else toast({ title: "Could not load alerts", description: r.error, variant: "destructive" });
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      const em = data.user?.email || "";
      setAuthEmail(em);
      if (em) await refresh(em);
      else setLoading(false);
    })();
  }, []);

  const beginEdit = (a: Alert | null) => {
    const init: Alert = a || {
      email: authEmail,
      keywords: [],
      markets: ["Remote", "Worldwide"],
      include_visa: true,
      verified_only: true,
      frequency_hours: 2,
      active: true,
    };
    setDraft(init);
    setKeywordsText(init.keywords.join(", "));
  };

  const saveDraft = async () => {
    if (!draft) return;
    const keywords = keywordsText
      .split(/[,\n]/)
      .map((k) => k.trim())
      .filter(Boolean);
    if (keywords.length === 0) {
      toast({ title: "Add at least one keyword", variant: "destructive" });
      return;
    }
    const payload = { ...draft, keywords };
    const r = await callApi("upsert", authEmail, { id: draft.id, alert: payload });
    if (r.ok) {
      toast({ title: "Alert saved", description: "You will be notified at " + payload.email });
      setDraft(null);
      await refresh(authEmail);
    } else {
      toast({ title: "Save failed", description: r.error, variant: "destructive" });
    }
  };

  const removeAlert = async (id: string) => {
    if (!confirm("Delete this alert?")) return;
    const r = await callApi("delete", authEmail, { id });
    if (r.ok) {
      toast({ title: "Alert deleted" });
      await refresh(authEmail);
    }
  };

  const sendNow = async (email: string) => {
    toast({ title: "Sending now…", description: "Check your inbox in ~1 minute." });
    const r = await callApi("send-now", authEmail, { email });
    if (r.ok) {
      toast({ title: "Sent!", description: "Digest queued for delivery." });
      await refresh(authEmail);
    } else {
      toast({ title: "Failed", description: r.error, variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
      </div>
    );
  }

  const isOwner = authEmail.toLowerCase() === "blue2whales@gmail.com";

  if (!isOwner) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-8 text-center">
          <Bell className="w-8 h-8 mx-auto text-amber-500 mb-3" />
          <h2 className="text-xl font-bold mb-2">Job Alerts</h2>
          <p className="text-sm text-muted-foreground">
            Email alerts for verified remote jobs are currently in private beta. Contact support to enable them on your account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Bell className="w-6 h-6 text-amber-500" /> Job Alerts
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Get emailed every 2 hours when new verified remote jobs match your keywords.
          </p>
        </div>
        {!draft && (
          <Button onClick={() => beginEdit(null)} className="bg-amber-500 hover:bg-amber-600 text-black font-semibold">
            <Plus className="w-4 h-4 mr-1" /> New Alert
          </Button>
        )}
      </div>

      {draft && (
        <div className="rounded-2xl border border-amber-500/30 bg-black/40 p-5 space-y-4">
          <h2 className="font-bold text-lg">{draft.id ? "Edit alert" : "Create alert"}</h2>

          <div>
            <Label>Send to email</Label>
            <Input
              value={draft.email}
              onChange={(e) => setDraft({ ...draft, email: e.target.value })}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <Label>Keywords (comma-separated)</Label>
            <textarea
              className="w-full mt-1 rounded-md border bg-background p-3 text-sm min-h-[100px]"
              value={keywordsText}
              onChange={(e) => setKeywordsText(e.target.value)}
              placeholder="digital marketing, virtual assistant, data entry, lead generation…"
            />
            <p className="text-xs text-muted-foreground mt-1">
              We match any keyword against job title, company, description and industry.
            </p>
          </div>

          <div>
            <Label>Markets</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {MARKETS.map((m) => {
                const on = draft.markets.includes(m);
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() =>
                      setDraft({
                        ...draft,
                        markets: on ? draft.markets.filter((x) => x !== m) : [...draft.markets, m],
                      })
                    }
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                      on
                        ? "bg-amber-500 text-black border-amber-500"
                        : "bg-transparent border-white/20 text-white/70 hover:border-amber-500/50"
                    }`}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <Label htmlFor="visa" className="text-sm">Include visa sponsorship</Label>
              <Switch
                id="visa"
                checked={draft.include_visa}
                onCheckedChange={(v) => setDraft({ ...draft, include_visa: v })}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <Label htmlFor="verified" className="text-sm">Verified sources only</Label>
              <Switch
                id="verified"
                checked={draft.verified_only}
                onCheckedChange={(v) => setDraft({ ...draft, verified_only: v })}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <Label htmlFor="active" className="text-sm">Alert active</Label>
              <Switch
                id="active"
                checked={draft.active}
                onCheckedChange={(v) => setDraft({ ...draft, active: v })}
              />
            </div>
            <div className="rounded-lg border p-3">
              <Label className="text-sm">Frequency (hours)</Label>
              <Input
                type="number"
                min={1}
                max={168}
                value={draft.frequency_hours}
                onChange={(e) => setDraft({ ...draft, frequency_hours: Number(e.target.value) || 2 })}
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => setDraft(null)}>Cancel</Button>
            <Button onClick={saveDraft} className="bg-amber-500 hover:bg-amber-600 text-black font-semibold">
              Save alert
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {alerts.length === 0 && !draft && (
          <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            No alerts yet. Click <strong>New Alert</strong> to get started.
          </div>
        )}

        {alerts.map((a) => (
          <div key={a.id} className="rounded-xl border border-white/10 bg-black/40 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-amber-500">{a.email}</span>
                  {a.active ? (
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Active
                    </span>
                  ) : (
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-white/60">
                      Paused
                    </span>
                  )}
                  <span className="text-[10px] text-white/60">every {a.frequency_hours}h</span>
                </div>
                <p className="text-xs text-white/70 mt-2 line-clamp-2">
                  <strong className="text-white/90">Keywords:</strong> {a.keywords.join(", ")}
                </p>
                <p className="text-xs text-white/50 mt-1">
                  Markets: {a.markets.join(", ")} {a.include_visa && "· visa OK"}
                </p>
                {a.last_sent_at && (
                  <p className="text-[11px] text-white/50 mt-1">
                    Last sent: {new Date(a.last_sent_at).toLocaleString()} · {a.last_job_count || 0} jobs
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <Button size="sm" variant="ghost" onClick={() => sendNow(a.email)} title="Send now">
                  <Send className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => beginEdit(a)}>Edit</Button>
                <Button size="sm" variant="ghost" onClick={() => removeAlert(a.id!)} className="text-red-400">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
