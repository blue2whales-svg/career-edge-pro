import { useState, useEffect } from "react";

export function useIsInternational() {
  const [isInternational, setIsInternational] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((r) => r.json())
      .then((data) => {
        setIsInternational(data.country_code !== "KE");
      })
      .catch(() => setIsInternational(false))
      .finally(() => setLoading(false));
  }, []);

  return { isInternational, loading };
}
