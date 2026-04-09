import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Loader2, Eye, EyeOff, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { usePendingUnlock } from "@/hooks/usePendingUnlock";
import cvedgeLogo from "@/assets/cvedge-logo.png";

const OWNER_EMAIL = "blue2whales@gmail.com";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [magicLoading, setMagicLoading] = useState(false);
  const [magicSent, setMagicSent] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  usePendingUnlock();

  const isOwnerEmail = email.trim().toLowerCase() === OWNER_EMAIL;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast({ title: error.message, variant: "destructive" });
    } else {
      const redirect = searchParams.get("redirect") || "/portal";
      navigate(redirect);
    }
    setLoading(false);
  };

  const handleMagicLink = async () => {
    if (!email) return;
    setMagicLoading(true);

    const redirectTo = `${window.location.origin}${searchParams.get("redirect") || "/portal"}`;
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirectTo },
    });

    if (error) {
      console.error("Magic link error:", error);
      toast({ title: "Error sending magic link email", description: error.message, variant: "destructive" });
    } else {
      setMagicSent(true);
      toast({ title: "Magic link sent! Check your email." });
    }
    setMagicLoading(false);
  };

  if (magicSent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-6 text-center">
          <img src={cvedgeLogo} alt="CV Edge" className="h-12 w-auto mx-auto mb-4" />
          <div className="p-6 rounded-xl border border-amber-500/30 bg-amber-500/5">
            <Zap className="h-10 w-10 text-amber-500 mx-auto mb-3" />
            <h2 className="text-xl font-bold mb-2">Magic link sent!</h2>
            <p className="text-sm text-muted-foreground">
              Check your inbox at <span className="font-semibold text-foreground">{email}</span> and click the link to sign in instantly.
            </p>
          </div>
          <Button variant="ghost" className="text-sm" onClick={() => setMagicSent(false)}>
            ← Back to login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <img src={cvedgeLogo} alt="CV Edge" className="h-12 w-auto mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to your CV Edge account</p>
        </div>
        <form className="space-y-4" onSubmit={handleLogin}>
          <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 bg-muted/50" />

          {isOwnerEmail && (
            <Button
              type="button"
              onClick={handleMagicLink}
              disabled={magicLoading}
              className="w-full h-11 font-semibold bg-gradient-to-r from-amber-500 to-yellow-500 text-black border-0 hover:from-amber-600 hover:to-yellow-600"
            >
              {magicLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Zap className="h-4 w-4 mr-2" />}
              ⚡ Magic Link Sign In
            </Button>
          )}

          {isOwnerEmail && (
            <div className="relative flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">or use password</span>
              <div className="flex-1 h-px bg-border" />
            </div>
          )}

          <div className="relative">
            <Input
              placeholder="Password"
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 bg-muted/50 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-xs text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-gradient-brand border-0 h-11 font-semibold">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Sign In <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
