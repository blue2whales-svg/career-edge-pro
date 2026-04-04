import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Gift, Copy, Share2, Users, TrendingUp, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageLayout from "@/components/PageLayout";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function ReferralsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const referralLink = useMemo(() => {
    if (!userId) return "";
    return `https://cvedge.live/signup?ref=${userId.slice(0, 8)}`;
  }, [userId]);

  useEffect(() => {
    const load = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) { navigate("/login"); return; }
      setUserId(user.user.id);

      const { data } = await supabase
        .from("referrals")
        .select("*")
        .eq("referrer_id", user.user.id)
        .order("created_at", { ascending: false });

      setReferrals(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const stats = {
    total: referrals.length,
    converted: referrals.filter((r) => r.status === "converted").length,
    credits: referrals.filter((r) => r.status === "converted").reduce((sum: number, r: any) => sum + (r.credit_amount || 200), 0),
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({ title: "Copied!", description: "Referral link copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`Check out CV Edge — the best platform for job seekers in Kenya & abroad! Sign up here: ${referralLink}`)}`, "_blank");
  };

  return (
    <PageLayout>
      <section className="relative z-10 pt-16 sm:pt-24 pb-16 px-4">
        <div className="container max-w-4xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <div className="text-center mb-10">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                <Gift className="h-8 w-8 text-amber-400" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-2">Refer & Earn</h1>
              <p className="text-muted-foreground">Earn KSh 200 for every friend who makes their first payment</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: "Friends Invited", value: stats.total, icon: <Users className="h-5 w-5" /> },
                { label: "Converted", value: stats.converted, icon: <TrendingUp className="h-5 w-5" /> },
                { label: "Credits Earned", value: `KSh ${stats.credits}`, icon: <Gift className="h-5 w-5" /> },
              ].map((s, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-4 text-center">
                  <div className="flex justify-center mb-2 text-primary">{s.icon}</div>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Referral Link */}
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-6 mb-8">
              <h3 className="font-semibold mb-3">Your Referral Link</h3>
              <div className="flex gap-2">
                <Input value={referralLink} readOnly className="bg-background font-mono text-xs" />
                <Button onClick={handleCopy} variant="outline" className="shrink-0 gap-1.5 border-amber-500/30 text-amber-400">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleWhatsApp} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 flex-1">
                  <Share2 className="h-4 w-4" /> Share on WhatsApp
                </Button>
                <Button onClick={() => {
                  window.open(`mailto:?subject=Check out CV Edge&body=Sign up here: ${referralLink}`, "_blank");
                }} variant="outline" className="gap-2 flex-1">
                  <ExternalLink className="h-4 w-4" /> Email
                </Button>
              </div>
            </div>

            {/* How it works */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-semibold mb-4">How It Works</h3>
              <div className="space-y-3">
                {[
                  "Share your unique referral link with friends",
                  "They sign up and make their first payment (CV order or Pro)",
                  "You earn KSh 200 credit per converted referral",
                  "Use credits against Pro subscription or any CV purchase",
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-sm text-muted-foreground">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
