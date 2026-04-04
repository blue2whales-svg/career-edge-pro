import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * After login/signup, check if there's a pending job unlock from a pre-auth payment
 * and record it in the database.
 */
export function usePendingUnlock() {
  useEffect(() => {
    const processPending = async () => {
      const raw = localStorage.getItem("cvedge_pending_unlock");
      if (!raw) return;

      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      if (!userId) return;

      try {
        const pending = JSON.parse(raw);
        // Only process if less than 24 hours old
        if (Date.now() - pending.timestamp > 86400000) {
          localStorage.removeItem("cvedge_pending_unlock");
          return;
        }

        if (pending.mode === "single" && pending.jobId) {
          await supabase.from("job_unlocks").insert({
            user_id: userId,
            job_id: pending.jobId,
            unlock_type: "single",
            amount_paid: pending.amount,
            currency: "KES",
          });
        }

        if (pending.mode === "pro") {
          await supabase.from("subscriptions").insert({
            user_id: userId,
            plan: "pro",
            status: "active",
            billing_cycle: "monthly",
            amount: 1000,
            currency: "KES",
          });
        }

        if (pending.phone) {
          await supabase.from("profiles").update({ phone: pending.phone }).eq("user_id", userId);
        }

        localStorage.removeItem("cvedge_pending_unlock");
      } catch {
        localStorage.removeItem("cvedge_pending_unlock");
      }
    };

    processPending();
  }, []);
}
