import { useMemo } from "react";
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Package,
  Zap,
  Star,
  Users,
  ArrowUpRight,
  ArrowRight,
  ShieldCheck,
  Flame,
  AlertCircle,
  Truck,
} from "lucide-react";

export default function AdminOverview({
  products = [],
  orders = [],
  reviews = [],
  onNavigateTab,
}) {
  // Computed statistics
  const stats = useMemo(() => {
    let totalRevenue = 0;
    let pendingOrders = 0;
    let activeOrders = 0;
    let completedOrders = 0;

    orders.forEach((o) => {
      if (o.status !== "Cancelled") {
        totalRevenue += Number(o.total || 0);
      }
      if (o.status === "Preparing") pendingOrders += 1;
      if (o.status === "Preparing" || o.status === "Out for delivery") activeOrders += 1;
      if (o.status === "Delivered") completedOrders += 1;
    });

    const pendingReviews = reviews.filter((r) => !r.is_approved).length;
    const avgRating =
      reviews.length > 0
        ? (reviews.reduce((s, r) => s + Number(r.rating || 0), 0) / reviews.length).toFixed(1)
        : "4.8";

    return {
      totalRevenue,
      totalOrders: orders.length,
      pendingOrders,
      activeOrders,
      completedOrders,
      pendingReviews,
      totalProducts: products.length,
      avgRating,
    };
  }, [products, orders, reviews]);

  const recentOrders = useMemo(() => {
    return [...orders].slice(0, 5);
  }, [orders]);

  const topMenuItems = useMemo(() => {
    return [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 4);
  }, [products]);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-charcoal via-charcoal-light to-charcoal text-cream p-6 sm:p-8 border border-white/10 shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-chili/20 border border-chili/30 text-chili text-xs font-bold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 fill-chili text-chili" /> Live System Active
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
              Welcome back to <span className="text-turmeric">FlameBite Admin</span>
            </h2>
            <p className="text-cream/70 text-xs sm:text-sm max-w-xl">
              Monitor real-time kitchen orders, process walk-in POS billing, manage food menu items, and review customer satisfaction ratings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigateTab("pos")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-turmeric text-charcoal hover:bg-turmeric/90 font-bold text-xs shadow-md shadow-turmeric/20 transition-transform active:scale-95"
            >
              <Zap className="w-4 h-4 fill-charcoal" /> Open POS Terminal
            </button>
            <button
              onClick={() => onNavigateTab("orders")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/10 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" /> Live Orders ({stats.activeOrders})
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white rounded-2xl p-5 border border-ink/5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/50">Total Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-basil/15 text-basil flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-ink">
              Rs. {stats.totalRevenue.toLocaleString()}
            </h3>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-basil font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Realtime calculated</span>
            </div>
          </div>
        </div>

        {/* Orders In Progress */}
        <div className="bg-white rounded-2xl p-5 border border-ink/5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/50">Active Orders</span>
            <div className="w-9 h-9 rounded-xl bg-turmeric/20 text-turmeric flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-ink">
              {stats.activeOrders}
            </h3>
            <p className="text-xs text-ink/40 mt-1.5">
              {stats.pendingOrders} preparing · {stats.activeOrders - stats.pendingOrders} in transit
            </p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-2xl p-5 border border-ink/5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/50">Menu Items</span>
            <div className="w-9 h-9 rounded-xl bg-chili/15 text-chili flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-ink">
              {stats.totalProducts}
            </h3>
            <button
              onClick={() => onNavigateTab("products")}
              className="flex items-center gap-1 text-xs text-chili font-bold mt-1.5 hover:underline"
            >
              <span>Manage catalog</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Customer Satisfaction */}
        <div className="bg-white rounded-2xl p-5 border border-ink/5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/50">Rating & Reviews</span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-ink">
                {stats.avgRating}
              </h3>
              <span className="text-xs text-ink/40 font-medium">/ 5.0</span>
            </div>
            <p className="text-xs text-ink/40 mt-1.5">
              {reviews.length} total reviews {stats.pendingReviews > 0 ? `(${stats.pendingReviews} pending)` : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Orders & Quick Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-6 border border-ink/5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-extrabold text-lg text-ink">Recent Orders</h3>
              <p className="text-xs text-ink/50">Latest customer &amp; POS orders</p>
            </div>
            <button
              onClick={() => onNavigateTab("orders")}
              className="text-xs font-bold text-chili hover:text-chili-dark flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <div className="py-12 text-center text-ink/40 text-sm">
              No orders recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-ink/5 text-ink/40 font-bold uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Items</th>
                    <th className="pb-3">Total</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/5 font-medium text-ink">
                  {recentOrders.map((order) => {
                    const statusBg =
                      order.status === "Delivered"
                        ? "bg-basil/15 text-basil"
                        : order.status === "Preparing"
                        ? "bg-turmeric/20 text-turmeric"
                        : order.status === "Out for delivery"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-red-100 text-red-600";

                    return (
                      <tr key={order.id} className="hover:bg-cream/40 transition-colors">
                        <td className="py-3 font-mono font-bold text-chili">
                          #{order.id.slice(0, 8)}
                        </td>
                        <td className="py-3">
                          <p className="font-semibold text-ink truncate max-w-[130px]">{order.customer || "Walk-in"}</p>
                          <p className="text-[10px] text-ink/40">{order.phone || "No phone"}</p>
                        </td>
                        <td className="py-3 text-ink/70">
                          {order.items?.length || 0} item{(order.items?.length || 0) > 1 ? "s" : ""}
                        </td>
                        <td className="py-3 font-bold text-ink">
                          Rs. {order.total}
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusBg}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right 1 Col: Quick Actions & Top Dishes */}
        <div className="space-y-6">
          {/* Quick Operations Card */}
          <div className="bg-white rounded-2xl p-5 border border-ink/5 shadow-sm space-y-3">
            <h3 className="font-display font-extrabold text-base text-ink">Quick Shortcuts</h3>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => onNavigateTab("pos")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-turmeric/10 hover:bg-turmeric/20 text-charcoal text-xs font-bold transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-turmeric flex items-center justify-center text-charcoal">
                    <Zap className="w-4 h-4 fill-charcoal" />
                  </div>
                  <span>New POS Bill</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-ink/40" />
              </button>

              <button
                onClick={() => onNavigateTab("products")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-chili/10 hover:bg-chili/20 text-ink text-xs font-bold transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-chili flex items-center justify-center text-white">
                    <Package className="w-4 h-4" />
                  </div>
                  <span>Add New Product</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-ink/40" />
              </button>

              <button
                onClick={() => onNavigateTab("analytics")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-basil/10 hover:bg-basil/20 text-ink text-xs font-bold transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-basil flex items-center justify-center text-white">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <span>Financial Reports</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-ink/40" />
              </button>
            </div>
          </div>

          {/* Top Rated Menu Items */}
          <div className="bg-white rounded-2xl p-5 border border-ink/5 shadow-sm space-y-3">
            <h3 className="font-display font-extrabold text-base text-ink">Popular Menu Items</h3>
            <div className="space-y-2.5">
              {topMenuItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-cream/50 transition-colors">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-10 h-10 rounded-lg object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-xs text-ink truncate">{item.title}</p>
                    <p className="text-[11px] font-bold text-chili">Rs. {item.price}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full text-amber-700 text-[10px] font-black shrink-0">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>{item.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
