import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "../integrations/supabase/client";

const STORAGE_KEY = "cvedge_jobs_unlocked";
const FREE_UNLOCK_KEY = "cvedge_free_unlocks_used";
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

// Cache verified employers in memory per session
let verifiedEmployersCache: string[] | null = null;

async function fetchVerifiedEmployers(): Promise<string[]> {
  if (verifiedEmployersCache) return verifiedEmployersCache;
  const { data } = await supabase
    .from("verified_employers")
    .select("employer_name")
    .eq("verified", true);
  verifiedEmployersCache = (data || []).map((e: any) => e.employer_name.toLowerCase());
  return verifiedEmployersCache;
}

export type JobTier = "free" | "verified" | "international";

export function getJobTier(
  company: string,
  market: string | undefined,
  visaSponsorship: boolean | undefined,
  verifiedNames: string[]
): JobTier {
  const isKenya = !market || market === "Kenya";
  const isInternational = !isKenya;
  
  if (isInternational || visaSponsorship) return "international";
  
  // Kenya job — check if company is verified
  const companyLower = company.toLowerCase();
  const isVerified = verifiedNames.some(
    (name) => companyLower.includes(name) || name.includes(companyLower)
  );
  
  return isVerified ? "verified" : "free";
}

export function useVerifiedEmployers() {
  const [employers, setEmployers] = useState<string[]>(verifiedEmployersCache || []);
  const [loading, setLoading] = useState(!verifiedEmployersCache);

  useEffect(() => {
    fetchVerifiedEmployers().then((names) => {
      setEmployers(names);
      setLoading(false);
    });
  }, []);

  return { employers, loading };
}

export function useJobAccess() {
  const [isUnlocked, setIsUnlocked] = useState(getUnlockedFromStorage);
  const [freeUnlockedJobs, setFreeUnlockedJobs] = useState<string[]>(getFreeUnlockedJobs);
  const [checking, setChecking] = useState(true);
  const [hasProSubscription, setHasProSubscription] = useState(false);
  const { employers: verifiedEmployers } = useVerifiedEmployers();

  // Session-randomized social proof number
  const sessionSocialProof = useMemo(() => Math.floor(Math.random() * 49) + 32, []);

  useEffect(() => {
    const check = async () => {
      if (getUnlockedFromStorage()) {
        setIsUnlocked(true);
        setChecking(false);
        return;
      }

      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        // Check paid orders
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

        // Check active Pro subscription
        const { data: subs } = await supabase
          .from("subscriptions")
          .select("id, expires_at")
          .eq("user_id", userData.user.id)
          .eq("status", "active")
          .limit(1);

        if (subs && subs.length > 0) {
          const sub = subs[0] as any;
          if (new Date(sub.expires_at) > new Date()) {
            setHasProSubscription(true);
            setIsUnlocked(true);
            localStorage.setItem(STORAGE_KEY, "true");
          }
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

  const isJobFreeUnlocked = useCallback(
    (jobKey: string) => freeUnlockedJobs.includes(jobKey),
    [freeUnlockedJobs]
  );

  const freeUnlocksRemaining = Math.max(0, MAX_FREE_UNLOCKS - freeUnlockedJobs.length);
  const canUseFreeUnlock = freeUnlocksRemaining > 0 && !isUnlocked;

  const getJobTierFn = useCallback(
    (company: string, market?: string, visa?: boolean) =>
      getJobTier(company, market, visa, verifiedEmployers),
    [verifiedEmployers]
  );

  return {
    isUnlocked,
    checking,
    markUnlocked,
    canUseFreeUnlock,
    useFreeUnlock,
    isJobFreeUnlocked,
    freeUnlocksRemaining,
    hasProSubscription,
    sessionSocialProof,
    getJobTier: getJobTierFn,
    verifiedEmployers,
  };
}
