import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import cvedgeLogo from "@/assets/cvedge-logo.png";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Supabase sets the session from the URL hash automatically
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast({ title: error.message, variant: "destructive" });
    } else {
      toast({ title: "Password updated successfully!" });
      navigate("/portal");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <img src={cvedgeLogo} alt="CV Edge" className="h-12 w-auto mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Set new password</h1>
          <p className="text-sm text-muted-foreground mt-1">Enter your new password below</p>
        </div>
        <form className="space-y-4" onSubmit={handleUpdate}>
          <div className="relative">
            <Input
              placeholder="New password"
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
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-brand border-0 h-11 font-semibold"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Update Password
          </Button>
        </form>
      </div>
    </div>
  );
}
