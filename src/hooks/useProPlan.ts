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

      // Check if user has a paid order (pro access via CV purchase)
      const { data: orders } = await supabase
        .from("orders")
        .select("id, created_at")
        .eq("user_id", user.id)
        .eq("status", "paid")
        .limit(1);

      if (orders && orders.length > 0) {
        setIsPro(true);
      }

      setLoading(false);
    };

    checkPlan();
  }, []);

  return { isPro, loading, expiresAt };
}
