import { useEffect, useRef } from "react";

const CLIENT_ID = "ASvZxlycc0mvVHXje_8fUtWyROnqCVeL4gY7LD3NB9qjeUJ_zHoWsVP05p97du5taM5QDcPN0OAD_TQ6";

interface Props {
  amountUsd: string;
  description: string;
  onSuccess?: (details: any) => void;
}

export function PayPalButton({ amountUsd, description, onSuccess }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendered = useRef(false);

  useEffect(() => {
    if (rendered.current) return;

    const existingScript = document.getElementById("paypal-sdk");

    const renderButton = () => {
      if (!containerRef.current) return;
      containerRef.current.innerHTML = "";
      rendered.current = true;

      (window as any).paypal
        .Buttons({
          style: {
            layout: "vertical",
            color: "gold",
            shape: "rect",
            label: "pay",
            height: 48,
          },
          createOrder: (_data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [
                {
                  description,
                  amount: {
                    currency_code: "USD",
                    value: amountUsd,
                  },
                },
              ],
            });
          },
          onApprove: async (_data: any, actions: any) => {
            const details = await actions.order.capture();
            onSuccess?.(details);
          },
          onError: (err: any) => {
            console.error("PayPal error", err);
          },
        })
        .render(containerRef.current);
    };

    if (existingScript) {
      renderButton();
    } else {
      const script = document.createElement("script");
      script.id = "paypal-sdk";
      script.src = `https://www.paypal.com/sdk/js?client-id=${CLIENT_ID}&currency=USD`;
      script.onload = renderButton;
      document.body.appendChild(script);
    }
  }, [amountUsd, description]);

  return <div ref={containerRef} className="w-full mt-2" />;
}
