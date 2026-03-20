import { useState } from "react"
import MpesaPayment from "./MpesaPayment"

interface Props {
  amount: number
  reference: string
  description: string
  onSuccess?: (code: string) => void
}

export default function MpesaModal({ amount, reference, description, onSuccess }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          background: "#0f6e56", color: "white", border: "none",
          borderRadius: 8, padding: "12px 24px", fontSize: 15,
          fontWeight: 600, cursor: "pointer", width: "100%"
        }}
      >
        Pay with M-Pesa
      </button>

      {open && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false) }}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 9999
          }}
        >
          <div style={{
            background: "white", borderRadius: 16, padding: 32,
            width: "90%", maxWidth: 420, position: "relative"
          }}>
            <button
              onClick={() => setOpen(false)}
              style={{
                position: "absolute", top: 12, right: 16,
                background: "none", border: "none", fontSize: 22,
                cursor: "pointer", color: "#888"
              }}
            >✕</button>
            <MpesaPayment
              amount={amount}
              reference={reference}
              description={description}
              onSuccess={(code) => {
                onSuccess?.(code)
                setTimeout(() => setOpen(false), 3000)
              }}
            />
          </div>
        </div>
      )}
    </>
  )
}
