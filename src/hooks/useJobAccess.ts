import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "../integrations/supabase/client";

const FREE_UNLOCK_KEY = "cvedge_free_unlocks_used";
const MAX_FREE_UNLOCKS = 3;

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
  if (!isKenya || visaSponsorship) return "international";
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
  const [freeUnlockedJobs, setFreeUnlockedJobs] = useState<string[]>(getFreeUnlockedJobs);
  const [checking, setChecking] = useState(true);
  const [hasProSubscription, setHasProSubscription] = useState(false);
  const [dbUnlockedJobIds, setDbUnlockedJobIds] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const { employers: verifiedEmployers } = useVerifiedEmployers();

  const sessionSocialProof = useMemo(() => Math.floor(Math.random() * 9) + 2, []);

  const loadAccess = useCallback(async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      setChecking(false);
      return;
    }
    const uid = userData.user.id;
    setUserId(uid);

    // Check active Pro subscription
    const { data: subs } = await supabase
      .from("subscriptions")
      .select("id, expires_at, status")
      .eq("user_id", uid)
      .eq("status", "active")
      .limit(1);

    if (subs && subs.length > 0) {
      const sub = subs[0] as any;
      if (new Date(sub.expires_at) > new Date()) {
        setHasProSubscription(true);
      }
    }

    // Load individually unlocked jobs
    const { data: unlocks } = await supabase
      .from("job_unlocks")
      .select("job_id")
      .eq("user_id", uid);

    if (unlocks) {
      setDbUnlockedJobIds(unlocks.map((u: any) => u.job_id));
    }

    setChecking(false);
  }, []);

  useEffect(() => {
    loadAccess();
  }, [loadAccess]);

  const refreshAccess = useCallback(() => {
    loadAccess();
  }, [loadAccess]);

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

  const isJobDbUnlocked = useCallback(
    (jobId: string) => dbUnlockedJobIds.includes(jobId),
    [dbUnlockedJobIds]
  );

  const freeUnlocksRemaining = Math.max(0, MAX_FREE_UNLOCKS - freeUnlockedJobs.length);
  const canUseFreeUnlock = freeUnlocksRemaining > 0;

  // Determine if a specific job is accessible
  const hasJobAccess = useCallback(
    (jobKey: string, jobId: string, tier: JobTier) => {
      if (tier === "free") return true;
      if (hasProSubscription) return true;
      if (isJobFreeUnlocked(jobKey)) return true;
      if (isJobDbUnlocked(jobId)) return true;
      return false;
    },
    [hasProSubscription, isJobFreeUnlocked, isJobDbUnlocked]
  );

  const getJobTierFn = useCallback(
    (company: string, market?: string, visa?: boolean) =>
      getJobTier(company, market, visa, verifiedEmployers),
    [verifiedEmployers]
  );

  return {
    checking,
    hasProSubscription,
    canUseFreeUnlock,
    useFreeUnlock,
    isJobFreeUnlocked,
    isJobDbUnlocked,
    freeUnlocksRemaining,
    sessionSocialProof,
    getJobTier: getJobTierFn,
    verifiedEmployers,
    hasJobAccess,
    refreshAccess,
    userId,
  };
}
