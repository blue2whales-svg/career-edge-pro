// Facebook Pixel helper hooks

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackPurchase(value: number, currency = "KES") {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Purchase", { value, currency });
  }
}

export function trackViewContent(contentName?: string, contentCategory?: string) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "ViewContent", {
      content_name: contentName,
      content_category: contentCategory,
    });
  }
}
