import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useProPlan() {
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  useEffect(() => {
    const checkPlan = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return setLoading(false);

      const { data } = await supabase
        .from("vault_profiles")
        .select("plan, plan_expires_at")
        .eq("user_id", user.id)
        .single();

      if (data?.plan === "pro" && data?.plan_expires_at) {
        const expired = new Date(data.plan_expires_at) < new Date();
        setIsPro(!expired);
        setExpiresAt(data.plan_expires_at);
      }

      setLoading(false);
    };

    checkPlan();
  }, []);

  return { isPro, loading, expiresAt };
}
