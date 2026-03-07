import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, MessageSquare, Headphones, User } from "lucide-react";

interface Message {
  id: string;
  order_id: string;
  sender_type: string;
  content: string;
  created_at: string;
  order_services?: string[];
}

export default function PortalMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (!error && data) setMessages(data);
      setLoading(false);
    };
    fetchMessages();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 max-w-[900px]">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold">Messages</h1>
        <p className="text-sm text-muted-foreground mt-1">
          All conversations with your specialists across orders.
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
          <p className="text-sm text-muted-foreground">
            Messages from your specialists will appear here. You can also message them from your order detail page.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className="rounded-xl border border-border bg-card p-4 flex gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.sender_type === "specialist" ? "bg-primary/10" : "bg-muted"
              }`}>
                {msg.sender_type === "specialist" ? (
                  <Headphones className="h-4 w-4 text-primary" />
                ) : (
                  <User className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">
                    {msg.sender_type === "specialist" ? "Your Specialist" : "You"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(msg.created_at).toLocaleDateString("en-KE", {
                      day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
