import { useState, useEffect } from "react";

export function useUsdRate() {
  const [rate, setRate] = useState<number>(0.0077);

  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/KES")
      .then((r) => r.json())
      .then((data) => {
        if (data?.rates?.USD) setRate(data.rates.USD);
      })
      .catch(() => {});
  }, []);

  return rate;
}
