import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Loader2,
  MessageSquare,
  Send,
  AlertCircle,
  Pencil,
  User,
  Headphones,
} from "lucide-react";

const TIMELINE_STEPS = [
  { key: "pending", label: "Order Received", desc: "Your order has been received and is being reviewed." },
  { key: "in_progress", label: "Specialist Working", desc: "Your dedicated specialist is crafting your document." },
  { key: "review", label: "Ready for Review", desc: "Your document is ready. Review and request revisions if needed." },
  { key: "completed", label: "Completed", desc: "Your documents are finalized and ready for download." },
];

const STATUS_ORDER = ["pending", "in_progress", "review", "completed"];

interface Message {
  id: string;
  sender_type: string;
  content: string;
  created_at: string;
}

interface RevisionRequest {
  id: string;
  description: string;
  status: string;
  created_at: string;
}

interface GeneratedDocument {
  id: string;
  service_type: string;
  content: string;
  status: string;
  created_at: string;
}

export default function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { toast } = useToast();
  const [order, setOrder] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [revisions, setRevisions] = useState<RevisionRequest[]>([]);
  const [documents, setDocuments] = useState<GeneratedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [newRevision, setNewRevision] = useState("");
  const [sendingRevision, setSendingRevision] = useState(false);
  const [activeTab, setActiveTab] = useState<"timeline" | "messages" | "documents" | "revisions">("timeline");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!orderId) return;

    const fetchAll = async () => {
      const [orderRes, messagesRes, revisionsRes, docsRes] = await Promise.all([
        supabase.from("orders").select("*").eq("id", orderId).single(),
        supabase.from("messages").select("*").eq("order_id", orderId).order("created_at", { ascending: true }),
        supabase.from("revision_requests").select("*").eq("order_id", orderId).order("created_at", { ascending: false }),
        supabase.from("generated_documents").select("*").eq("order_id", orderId).order("created_at", { ascending: false }),
      ]);

      if (orderRes.data) setOrder(orderRes.data);
      if (messagesRes.data) setMessages(messagesRes.data);
      if (revisionsRes.data) setRevisions(revisionsRes.data);
      if (docsRes.data) setDocuments(docsRes.data);
      setLoading(false);
    };

    fetchAll();

    // Realtime messages
    const channel = supabase
      .channel(`messages-${orderId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `order_id=eq.${orderId}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [orderId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !orderId) return;
    setSendingMessage(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("messages").insert({
      order_id: orderId,
      user_id: user?.id,
      sender_type: "client",
      content: newMessage.trim(),
    });
    if (error) {
      toast({ title: "Failed to send message", variant: "destructive" });
    } else {
      setNewMessage("");
    }
    setSendingMessage(false);
  };

  const submitRevision = async () => {
    if (!newRevision.trim() || !orderId) return;
    setSendingRevision(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("revision_requests").insert({
      order_id: orderId,
      user_id: user!.id,
      description: newRevision.trim(),
    });
    if (error) {
      toast({ title: "Failed to submit revision request", variant: "destructive" });
    } else {
      setNewRevision("");
      toast({ title: "Revision request submitted! Your specialist will review it shortly." });
      // Refresh revisions
      const { data } = await supabase.from("revision_requests").select("*").eq("order_id", orderId).order("created_at", { ascending: false });
      if (data) setRevisions(data);
    }
    setSendingRevision(false);
  };

  const downloadDocument = (doc: GeneratedDocument) => {
    const blob = new Blob([doc.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${doc.service_type.replace(/\s+/g, "_")}_${doc.id.slice(0, 8)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Order not found</h2>
        <Link to="/portal">
          <Button variant="outline">Back to Orders</Button>
        </Link>
      </div>
    );
  }

  const currentStepIndex = STATUS_ORDER.indexOf(order.status);

  const TABS = [
    { key: "timeline" as const, label: "Timeline", icon: Clock },
    { key: "messages" as const, label: "Messages", icon: MessageSquare, count: messages.length },
    { key: "documents" as const, label: "Documents", icon: FileText, count: documents.length },
    { key: "revisions" as const, label: "Revisions", icon: Pencil, count: revisions.length },
  ];

  return (
    <div className="p-6 sm:p-8 max-w-[900px]">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/portal"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Orders
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold">
              {order.services.join(" + ")}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Order #{order.id.slice(0, 8)} · {new Date(order.created_at).toLocaleDateString("en-KE", {
                day: "numeric", month: "long", year: "numeric",
              })}
            </p>
          </div>
          <Badge
            variant="outline"
            className={
              order.status === "completed"
                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                : order.status === "review"
                ? "bg-primary/10 text-primary border-primary/20"
                : "bg-amber-500/10 text-amber-500 border-amber-500/20"
            }
          >
            {TIMELINE_STEPS.find((s) => s.key === order.status)?.label || order.status}
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-muted/50 border border-border mb-6 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.key
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Timeline Tab */}
      {activeTab === "timeline" && (
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="space-y-0">
            {TIMELINE_STEPS.map((step, i) => {
              const isCompleted = i <= currentStepIndex;
              const isCurrent = i === currentStepIndex;
              return (
                <div key={step.key} className="flex gap-4">
                  {/* Vertical line + dot */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        isCompleted
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <span className="text-xs font-bold">{i + 1}</span>
                      )}
                    </div>
                    {i < TIMELINE_STEPS.length - 1 && (
                      <div
                        className={`w-0.5 h-16 ${
                          i < currentStepIndex ? "bg-primary" : "bg-border"
                        }`}
                      />
                    )}
                  </div>
                  {/* Content */}
                  <div className={`pb-8 ${isCurrent ? "" : ""}`}>
                    <h4
                      className={`font-semibold ${
                        isCompleted ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                      {isCurrent && (
                        <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          Current
                        </span>
                      )}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Messages Tab */}
      {activeTab === "messages" && (
        <div className="rounded-xl border border-border bg-card flex flex-col" style={{ height: "500px" }}>
          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-10">
                <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  No messages yet. Send a message to your specialist below.
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${
                    msg.sender_type === "client" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender_type === "specialist" && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Headphones className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-xl px-4 py-3 ${
                      msg.sender_type === "client"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.sender_type === "client"
                          ? "text-primary-foreground/60"
                          : "text-muted-foreground"
                      }`}
                    >
                      {new Date(msg.created_at).toLocaleTimeString("en-KE", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {msg.sender_type === "client" && (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message input */}
          <div className="border-t border-border p-4">
            <div className="flex gap-2">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message to your specialist..."
                className="min-h-[44px] max-h-[120px] bg-muted/50 border-border resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <Button
                onClick={sendMessage}
                disabled={sendingMessage || !newMessage.trim()}
                className="bg-gradient-brand border-0 shrink-0 h-11 w-11 p-0"
              >
                {sendingMessage ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === "documents" && (
        <div className="rounded-xl border border-border bg-card p-6">
          {documents.length === 0 ? (
            <div className="text-center py-10">
              <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                Your documents will appear here once your specialist has completed them.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{doc.service_type}</h4>
                      <p className="text-xs text-muted-foreground">
                        {new Date(doc.created_at).toLocaleDateString("en-KE", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                        {" · "}
                        <span
                          className={
                            doc.status === "completed"
                              ? "text-emerald-500"
                              : "text-amber-500"
                          }
                        >
                          {doc.status}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/review/${order.id}`}>
                      <Button variant="outline" size="sm" className="border-primary/30">
                        Preview
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      onClick={() => downloadDocument(doc)}
                      className="bg-gradient-brand border-0"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Revisions Tab */}
      {activeTab === "revisions" && (
        <div className="space-y-6">
          {/* Submit new revision */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Pencil className="h-4 w-4 text-primary" />
              Request a Revision
            </h3>
            <Textarea
              value={newRevision}
              onChange={(e) => setNewRevision(e.target.value)}
              placeholder="Describe what changes you'd like made to your document..."
              className="bg-muted/50 border-border min-h-[100px] mb-3"
            />
            <Button
              onClick={submitRevision}
              disabled={sendingRevision || !newRevision.trim()}
              className="bg-gradient-brand border-0 font-medium"
            >
              {sendingRevision ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Submit Revision Request
            </Button>
          </div>

          {/* Existing revisions */}
          {revisions.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-semibold mb-4">Revision History</h3>
              <div className="space-y-4">
                {revisions.map((rev) => (
                  <div key={rev.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(rev.created_at).toLocaleDateString("en-KE", {
                          day: "numeric", month: "short", year: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </span>
                      <Badge
                        variant="outline"
                        className={
                          rev.status === "completed"
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : rev.status === "in_progress"
                            ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                            : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        }
                      >
                        {rev.status === "in_progress" ? "In Progress" : rev.status.charAt(0).toUpperCase() + rev.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{rev.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
