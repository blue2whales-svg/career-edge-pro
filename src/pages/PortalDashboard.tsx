import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Clock,
  CheckCircle2,
  FileText,
  Loader2,
  Package,
} from "lucide-react";

interface Order {
  id: string;
  name: string;
  email: string;
  services: string[];
  status: string;
  total_amount: number;
  created_at: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: "Pending", color: "bg-amber-500/10 text-amber-500 border-amber-500/20", icon: Clock },
  in_progress: { label: "In Progress", color: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: Loader2 },
  review: { label: "Ready for Review", color: "bg-primary/10 text-primary border-primary/20", icon: FileText },
  completed: { label: "Completed", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", icon: CheckCircle2 },
};

export default function PortalDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) setOrders(data);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const getStatusConfig = (status: string) =>
    STATUS_CONFIG[status] || STATUS_CONFIG.pending;

  return (
    <div className="p-6 sm:p-8 max-w-[1000px]">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold">My Orders</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track your orders, download documents, and communicate with your specialist.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Orders", value: orders.length, icon: Package },
          { label: "In Progress", value: orders.filter((o) => o.status === "in_progress").length, icon: Loader2 },
          { label: "Ready for Review", value: orders.filter((o) => o.status === "review").length, icon: FileText },
          { label: "Completed", value: orders.filter((o) => o.status === "completed").length, icon: CheckCircle2 },
        ].map((stat, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4">
            <stat.icon className="h-5 w-5 text-primary mb-2" />
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Orders list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Place your first order and your specialist will get to work immediately.
          </p>
          <Link to="/order">
            <Button className="bg-gradient-brand border-0 font-semibold shadow-glow gold-shimmer">
              Order Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const config = getStatusConfig(order.status);
            return (
              <Link
                key={order.id}
                to={`/portal/order/${order.id}`}
                className="block rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold truncate">
                        {order.services.join(" + ")}
                      </h3>
                      <Badge variant="outline" className={config.color}>
                        {config.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Order #{order.id.slice(0, 8)}</span>
                      <span>·</span>
                      <span>{new Date(order.created_at).toLocaleDateString("en-KE", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}</span>
                      <span>·</span>
                      <span className="text-primary font-medium">
                        KES {order.total_amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
