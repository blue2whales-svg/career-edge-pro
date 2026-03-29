import { useState, useEffect, useCallback } from "react";
import { supabase } from "../integrations/supabase/client";

const STORAGE_KEY = "cvedge_jobs_unlocked";
const FREE_UNLOCK_KEY = "cvedge_free_unlock_used";
const FREE_UNLOCK_JOB_KEY = "cvedge_free_unlock_job";

function getUnlockedFromStorage(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function getFreeUnlockUsed(): boolean {
  try {
    return localStorage.getItem(FREE_UNLOCK_KEY) === "true";
  } catch {
    return true;
  }
}

function getFreeUnlockJobKey(): string | null {
  try {
    return localStorage.getItem(FREE_UNLOCK_JOB_KEY);
  } catch {
    return null;
  }
}

export function useJobAccess() {
  const [isUnlocked, setIsUnlocked] = useState(getUnlockedFromStorage);
  const [freeUnlockUsed, setFreeUnlockUsed] = useState(getFreeUnlockUsed);
  const [freeUnlockJobKey, setFreeUnlockJobKey] = useState<string | null>(getFreeUnlockJobKey);
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
    localStorage.setItem(FREE_UNLOCK_KEY, "true");
    localStorage.setItem(FREE_UNLOCK_JOB_KEY, jobKey);
    setFreeUnlockUsed(true);
    setFreeUnlockJobKey(jobKey);
  }, []);

  const isJobFreeUnlocked = useCallback((jobKey: string) => {
    return freeUnlockJobKey === jobKey;
  }, [freeUnlockJobKey]);

  const canUseFreeUnlock = !freeUnlockUsed && !isUnlocked;

  return {
    isUnlocked,
    checking,
    markUnlocked,
    canUseFreeUnlock,
    useFreeUnlock,
    isJobFreeUnlocked,
  };
}
