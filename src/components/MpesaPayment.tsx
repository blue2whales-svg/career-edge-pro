import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"

type Status = "idle" | "sending" | "waiting" | "success" | "failed"

interface Props {
  amount: number
  reference: string
  description: string
  onSuccess?: (code: string) => void
}

export default function MpesaPayment({ amount, reference, description, onSuccess }: Props) {
  const [phone,      setPhone]      = useState("")
  const [status,     setStatus]     = useState<Status>("idle")
  const [error,      setError]      = useState("")
  const [mpesaCode,  setMpesaCode]  = useState("")
  const [checkoutId, setCheckoutId] = useState("")

  useEffect(() => {
    if (!checkoutId) return
    const channel = supabase
      .channel("mpesa-status")
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "mpesa_transactions",
        filter: `checkout_id=eq.${checkoutId}`,
      }, (payload) => {
        const row = payload.new as any
        if (row.status === "success") {
          setStatus("success")
          setMpesaCode(row.mpesa_code)
          onSuccess?.(row.mpesa_code)
        } else if (row.status === "failed") {
          setStatus("failed")
          setError("Payment was cancelled or failed. Please try again.")
        }
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [checkoutId])

  const handlePay = async () => {
    setError("")
    if (!phone.match(/^(07|01|2547|2541)\d{8}$/)) {
      setError("Enter a valid Safaricom number e.g. 0712345678")
      return
    }
    setStatus("sending")
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mpesa-stk-push`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
            Authorization: `Bearer ${session?.access_token ?? import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ phone, amount, reference, description }),
        }
      )
      const data = await res.json()
      if (data.ResponseCode === "0") {
        setCheckoutId(data.CheckoutRequestID)
        setStatus("waiting")
      } else {
        setStatus("idle")
        setError(data.errorMessage ?? "Could not initiate payment. Check phone number.")
      }
    } catch (e) {
      setStatus("idle")
      setError("Network error. Please try again.")
    }
  }

  if (status === "success") return (
    <div style={{ textAlign: "center", padding: "24px" }}>
      <div style={{ fontSize: 48 }}>✅</div>
      <h3>Payment Received!</h3>
      <p style={{ color: "#5f5e5a" }}>M-Pesa code: <strong>{mpesaCode}</strong></p>
    </div>
  )

  return (
    <div style={{ maxWidth: 380, margin: "0 auto", padding: 24 }}>
      <h3 style={{ marginBottom: 4 }}>Pay with M-Pesa</h3>
      <p style={{ color: "#5f5e5a", marginBottom: 20, fontSize: 14 }}>
        Amount: <strong>KES {amount.toLocaleString()}</strong>
      </p>
      {status === "waiting" ? (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📱</div>
          <p>Check your phone <strong>{phone}</strong></p>
          <p style={{ fontSize: 13, color: "#888" }}>Enter your M-Pesa PIN on the prompt. This page updates automatically.</p>
        </div>
      ) : (
        <>
          <input
            type="tel"
            placeholder="M-Pesa number e.g. 0712345678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{ width: "100%", padding: "12px 14px", marginBottom: 12, border: "1.5px solid #ddd", borderRadius: 8, fontSize: 15 }}
          />
          {error && <p style={{ color: "#c0392b", fontSize: 13, marginBottom: 10 }}>{error}</p>}
          <button
            onClick={handlePay}
            disabled={status === "sending"}
            style={{ width: "100%", padding: "13px", background: "#0f6e56", color: "white", border: "none", borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: "pointer" }}
          >
            {status === "sending" ? "Sending..." : `Pay KES ${amount.toLocaleString()}`}
          </button>
        </>
      )}
    </div>
  )
}
