import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useProPlan() {
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  useEffect(() => {
    const checkPlan = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return setLoading(false);

      // Check by user_id first
      const { data: ordersByUserId } = await supabase
        .from("orders")
        .select("id, created_at")
        .eq("user_id", user.id)
        .eq("status", "paid")
        .limit(1);

      if (ordersByUserId && ordersByUserId.length > 0) {
        setIsPro(true);
        setLoading(false);
        return;
      }

      // Fallback: check by email (covers guest payments)
      const { data: ordersByEmail } = await supabase
        .from("orders")
        .select("id, created_at")
        .eq("email", user.email)
        .eq("status", "paid")
        .limit(1);

      if (ordersByEmail && ordersByEmail.length > 0) {
        setIsPro(true);
      }

      setLoading(false);
    };

    checkPlan();
  }, []);

  return { isPro, loading, expiresAt };
}
