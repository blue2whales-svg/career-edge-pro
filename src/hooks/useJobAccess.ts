import { useState, useEffect, useCallback } from "react";
import { supabase } from "../integrations/supabase/client";

const STORAGE_KEY = "cvedge_jobs_unlocked";
const FREE_UNLOCK_KEY = "cvedge_free_unlocks_used"; // stores JSON array of job keys
const MAX_FREE_UNLOCKS = 3;

function getUnlockedFromStorage(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function getFreeUnlockedJobs(): string[] {
  try {
    const raw = localStorage.getItem(FREE_UNLOCK_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useJobAccess() {
  const [isUnlocked, setIsUnlocked] = useState(getUnlockedFromStorage);
  const [freeUnlockedJobs, setFreeUnlockedJobs] = useState<string[]>(getFreeUnlockedJobs);
  const [checking, setChecking] = useState(true);

  // Check Supabase for any paid order by this user
  useEffect(() => {
    const check = async () => {
      if (getUnlockedFromStorage()) {
        setIsUnlocked(true);
        setChecking(false);
        return;
      }

      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        const { data: orders } = await supabase
          .from("orders")
          .select("id")
          .eq("user_id", userData.user.id)
          .eq("status", "paid")
          .limit(1);

        if (orders && orders.length > 0) {
          localStorage.setItem(STORAGE_KEY, "true");
          setIsUnlocked(true);
        }
      }
      setChecking(false);
    };
    check();
  }, []);

  const markUnlocked = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "true");
    setIsUnlocked(true);
  }, []);

  const useFreeUnlock = useCallback((jobKey: string) => {
    setFreeUnlockedJobs((prev) => {
      if (prev.includes(jobKey)) return prev;
      const updated = [...prev, jobKey];
      localStorage.setItem(FREE_UNLOCK_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isJobFreeUnlocked = useCallback((jobKey: string) => {
    return freeUnlockedJobs.includes(jobKey);
  }, [freeUnlockedJobs]);

  const freeUnlocksRemaining = Math.max(0, MAX_FREE_UNLOCKS - freeUnlockedJobs.length);
  const canUseFreeUnlock = freeUnlocksRemaining > 0 && !isUnlocked;

  return {
    isUnlocked,
    checking,
    markUnlocked,
    canUseFreeUnlock,
    useFreeUnlock,
    isJobFreeUnlocked,
    freeUnlocksRemaining,
  };
}
