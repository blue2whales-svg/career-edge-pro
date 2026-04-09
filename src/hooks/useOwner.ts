import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const OWNER_EMAIL = "blue2whales@gmail.com";

export function useOwner() {
  const [isOwner, setIsOwner] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
        setIsOwner(data.user.email === OWNER_EMAIL);
      }
      setLoading(false);
    };
    check();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        setIsOwner(session.user.email === OWNER_EMAIL);
      } else {
        setIsOwner(false);
        setUserId(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { isOwner, userId, loading };
}
