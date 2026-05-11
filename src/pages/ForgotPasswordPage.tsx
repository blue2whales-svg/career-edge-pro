import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import cvedgeLogo from "@/assets/cvedge-logo.png";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const { toast } = useToast();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setErrorMsg(null);
    setDebugInfo(null);

    // Always send the reset link back to the production domain so the
    // recovery URL works regardless of which preview/sandbox sent it.
    const redirectTo = "https://cvedge.live/reset-password";

    const startedAt = Date.now();
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });
      const ms = Date.now() - startedAt;

      // Log full response so nothing is silently swallowed.
      console.log("[forgot-password] response", { data, error, ms, redirectTo, email });

      if (error) {
        const msg = `${error.message}${(error as any).status ? ` (status ${(error as any).status})` : ""}`;
        setErrorMsg(msg);
        setDebugInfo(JSON.stringify({ error, ms, redirectTo }, null, 2));
        toast({ title: "Reset failed", description: msg, variant: "destructive" });
      } else {
        setSent(true);
        setDebugInfo(JSON.stringify({ data, ms, redirectTo }, null, 2));
        toast({ title: "Reset email requested", description: `Sent to ${email}` });
      }
    } catch (err: any) {
      console.error("[forgot-password] threw", err);
      const msg = err?.message || String(err);
      setErrorMsg(`Network/JS error: ${msg}`);
      setDebugInfo(JSON.stringify({ err: msg }, null, 2));
      toast({ title: "Unexpected error", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <img src={cvedgeLogo} alt="CV Edge" className="h-12 w-auto mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Reset your password</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        {sent ? (
          <div className="text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
              <Mail className="h-7 w-7 text-green-500" />
            </div>
            <p className="text-sm text-muted-foreground">
              Check your email for a password reset link. It may take a minute to arrive.
            </p>
            <Link to="/login">
              <Button variant="outline" className="mt-2">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sign In
              </Button>
            </Link>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleReset}>
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 bg-muted/50"
            />
            {errorMsg && (
              <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                <p className="font-semibold">Error:</p>
                <p className="break-words">{errorMsg}</p>
              </div>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-brand border-0 h-11 font-semibold"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Send Reset Link
            </Button>
            {debugInfo && (
              <details className="text-xs text-muted-foreground">
                <summary className="cursor-pointer">Debug response</summary>
                <pre className="mt-2 whitespace-pre-wrap break-all bg-muted/40 p-2 rounded">{debugInfo}</pre>
              </details>
            )}
          </form>
        )}

        {!sent && (
          <p className="text-center text-sm text-muted-foreground">
            <Link to="/login" className="text-primary hover:underline">
              <ArrowLeft className="inline h-3 w-3 mr-1" />Back to Sign In
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
