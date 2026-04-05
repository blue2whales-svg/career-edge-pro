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
  const { toast } = useToast();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast({ title: error.message, variant: "destructive" });
    } else {
      setSent(true);
    }
    setLoading(false);
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
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-brand border-0 h-11 font-semibold"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Send Reset Link
            </Button>
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
