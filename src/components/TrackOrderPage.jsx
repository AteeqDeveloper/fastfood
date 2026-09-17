import { useState, useEffect, useCallback } from "react";
import { supabaseClient } from "../lib/supabaseClient";
import {
  Search,
  Clock,
  Bike,
  CheckCircle2,
  XCircle,
  PhoneCall,
  MapPin,
  Flame,
  PackageCheck,
  ShoppingBag,
  MessageCircle,
  Sparkles,
  Check,
} from "lucide-react";

const STEPS = [
  { id: "Confirmed", label: "Confirmed", desc: "Order received & billed", icon: PackageCheck },
  { id: "Preparing", label: "Preparing", desc: "Cast iron searing your meal fresh", icon: Flame },
  { id: "Out for delivery", label: "Out for Delivery", desc: "Rider on road in thermal bag", icon: Bike },
  { id: "Delivered", label: "Delivered", desc: "Landed hot at your door", icon: CheckCircle2 },
];

const statusStyles = {
  Confirmed: "bg-[#FFF3DC] text-[#3A2418] border-[#3A2418]/20",
  Preparing: "bg-[#E6A93A]/20 text-[#3A2418] border-[#E6A93A]/40",
  "Out for delivery": "bg-[#C65D21]/15 text-[#C65D21] border-[#C65D21]/30",
  Delivered: "bg-[#66734A]/20 text-[#66734A] border-[#66734A]/30",
  Cancelled: "bg-red-100 text-red-600 border-red-200",
};

// Built-in sample mock order if user tests with sample IDs
const SAMPLE_ORDER = {
  id: "CB-8492",
  customer: "Zeeshan Ahmed",
  phone: "03001234567",
  address: "House 24-B, 5th Street, Phase 6 DHA, Karachi",
  items: [
    { title: "Artisan Smokehouse Smash", qty: 2, price: 850 },
    { title: "Hand-Cut Rosemary Sea Salt Fries", qty: 1, price: 360 },
    { title: "Handcrafted Smoked Peach Iced Tea", qty: 2, price: 320 },
  ],
  total: 2700,
  status: "Preparing",
  created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
};

function OrderTimeline({ status, onStepChange }) {
  if (status === "Cancelled") {
    return (
      <div className="flex items-center gap-2 mt-4 bg-red-50 border border-red-200 p-4 rounded-2xl">
        <XCircle className="w-5 h-5 text-red-600 shrink-0" />
        <div>
          <p className="text-xs font-bold text-red-700">This order was cancelled</p>
          <p className="text-[11px] text-red-600/70">
            Please contact our kitchen helpline at 0300-1234567 for assistance.
          </p>
        </div>
      </div>
    );
  }

  const currentIndex = STEPS.findIndex(
    (s) => s.id.toLowerCase() === (status || "").toLowerCase()
  );
  const activeStep = currentIndex >= 0 ? currentIndex : 1;

  return (
    <div className="my-8 py-2 px-2">
      <div className="relative flex items-center justify-between">
        {/* Connecting Progress Track Line */}
        <div className="absolute top-5 left-8 right-8 h-1.5 bg-[#3A2418]/10 rounded-full">
          <div
            className="h-full bg-[#C65D21] transition-all duration-500 rounded-full"
            style={{
              width: `${(activeStep / (STEPS.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Step Nodes */}
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const isDone = i < activeStep;
          const isCurrent = i === activeStep;

          return (
            <div
              key={step.id}
              onClick={() => onStepChange && onStepChange(step.id)}
              className="flex flex-col items-center text-center relative z-10 cursor-pointer group"
            >
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md ${
                  isDone
                    ? "bg-[#66734A] text-white scale-95"
                    : isCurrent
                    ? "bg-[#C65D21] text-white ring-4 ring-[#C65D21]/25 scale-110 shadow-lg animate-bounce"
                    : "bg-[#FFFAF0] text-[#3A2418]/30 border border-[#3A2418]/15"
                }`}
              >
                {isDone ? <Check className="w-5 h-5 stroke-[3]" /> : <Icon className="w-5 h-5" />}
              </div>

              <span
                className={`text-xs font-black mt-3 max-w-[90px] leading-tight ${
                  isCurrent ? "text-[#C65D21]" : isDone ? "text-[#3A2418]" : "text-[#3A2418]/40"
                }`}
              >
                {step.label}
              </span>
              <span className="text-[10px] text-[#3A2418]/50 max-w-[90px] hidden sm:block mt-0.5 font-medium">
                {step.desc}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TrackOrderPage({ initialPhone = "" }) {
  const [query, setQuery] = useState(initialPhone || "CB-8492");
  const [orders, setOrders] = useState([SAMPLE_ORDER]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(true);

  const runSearch = useCallback(async (rawQuery) => {
    const trimmed = rawQuery.trim();
    if (!trimmed) return;

    setLoading(true);
    setError("");
    setSearched(true);

    // If matches sample order
    if (trimmed.toUpperCase() === "CB-8492" || trimmed === "03001234567") {
      setOrders([SAMPLE_ORDER]);
      setLoading(false);
      return;
    }

    // Try finding by ID or phone in Supabase
    const isIdSearch = trimmed.startsWith("CB-") || trimmed.startsWith("SB-");
    let queryBuilder = supabaseClient.from("orders").select("*");

    if (isIdSearch) {
      queryBuilder = queryBuilder.eq("id", trimmed);
    } else {
      queryBuilder = queryBuilder.eq("phone", trimmed);
    }

    const { data, error: fetchError } = await queryBuilder.order("created_at", {
      ascending: false,
    });

    setLoading(false);

    if (fetchError) {
      setError(fetchError.message);
      setOrders([]);
      return;
    }

    if (data && data.length > 0) {
      setOrders(data);
    } else {
      // If none found in DB, return sample with entered query for friendly demo
      setOrders([
        {
          ...SAMPLE_ORDER,
          id: trimmed.toUpperCase().startsWith("CB-") ? trimmed.toUpperCase() : `CB-${trimmed.slice(-4) || "9001"}`,
          phone: trimmed,
        },
      ]);
    }
  }, []);

  useEffect(() => {
    if (initialPhone.trim()) {
      setQuery(initialPhone);
      runSearch(initialPhone);
    }
  }, [initialPhone, runSearch]);

  const handleSearch = (e) => {
    e.preventDefault();
    runSearch(query);
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  return (
    <main className="min-h-screen bg-[#FFF3DC] text-[#3A2418] bg-rustic-pattern py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header Banner */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 bg-[#C65D21]/10 border border-[#C65D21]/20 text-[#C65D21] text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-3 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#C65D21] animate-pulse" />
            Live Kitchen Tracking
          </span>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-[#3A2418] tracking-tight mb-3">
            Track Your Craving
          </h1>
          <p className="text-[#3A2418]/70 text-sm sm:text-base max-w-md mx-auto font-medium">
            Enter your Order ID (e.g. <strong>CB-8492</strong>) or phone number to see live grill progression.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="bg-[#FFFAF0] rounded-3xl p-3 sm:p-4 shadow-xl border border-[#3A2418]/10 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#3A2418]/40" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Order ID (CB-8492) or Phone (03001234567)"
                required
                className="w-full bg-[#FFF3DC] rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-[#3A2418] placeholder:text-[#3A2418]/40 focus:outline-none focus:ring-2 focus:ring-[#C65D21]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#C65D21] hover:bg-[#A94B16] active:scale-95 disabled:opacity-60 transition-all text-white font-extrabold px-8 py-3.5 rounded-2xl text-sm shadow-md shadow-[#C65D21]/25 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? "Searching..." : "Track Order →"}
            </button>
          </form>

          {/* Sample quick test pill */}
          <div className="mt-3 pt-2 border-t border-[#3A2418]/10 flex items-center justify-between px-2 text-xs text-[#3A2418]/60">
            <span>Quick Test:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setQuery("CB-8492");
                  runSearch("CB-8492");
                }}
                className="text-[#C65D21] font-bold hover:underline cursor-pointer"
              >
                Sample Order CB-8492
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-semibold text-center p-4 rounded-2xl mb-8">
            Could not load orders: {error}
          </div>
        )}

        {/* Orders List */}
        <div className="flex flex-col gap-6">
          {orders.map((order) => {
            const itemCount = (order.items || []).reduce(
              (s, i) => s + (i.qty || 1),
              0
            );

            return (
              <div
                key={order.id}
                className="bg-[#FFFAF0] rounded-3xl border border-[#3A2418]/10 shadow-xl p-6 sm:p-8"
              >
                {/* Order Card Header */}
                <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-[#3A2418]/10">
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="font-display font-black text-xl sm:text-2xl text-[#3A2418]">
                        Order #{order.id}
                      </h3>
                      <span
                        className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
                          statusStyles[order.status] || "bg-[#FFF3DC] text-[#3A2418]/70"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-[#3A2418]/50 text-xs mt-1 font-medium">
                      Placed on {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold text-[#3A2418]/40 uppercase block">
                      Total Bill
                    </span>
                    <p className="font-display font-black text-2xl text-[#C65D21]">
                      Rs. {order.total}
                    </p>
                    <p className="text-[#3A2418]/50 text-xs font-semibold">{itemCount} items</p>
                  </div>
                </div>

                {/* Progress Timeline: Confirmed -> Preparing -> Out for Delivery -> Delivered */}
                <OrderTimeline
                  status={order.status}
                  onStepChange={(newSt) => handleUpdateStatus(order.id, newSt)}
                />

                {/* Interactive Status Switcher Demo Pill */}
                <div className="bg-[#FFF3DC] rounded-2xl p-3 border border-[#3A2418]/10 flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
                  <span className="text-[#3A2418]/60">Simulate Order Progress:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {STEPS.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => handleUpdateStatus(order.id, s.id)}
                        className={`px-3 py-1 rounded-xl text-xs transition-all cursor-pointer ${
                          order.status === s.id
                            ? "bg-[#C65D21] text-white shadow-sm"
                            : "bg-[#FFFAF0] text-[#3A2418] hover:bg-white border border-[#3A2418]/10"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Delivery Destination */}
                {order.address && (
                  <div className="bg-[#FFF3DC]/60 rounded-2xl p-4 flex items-start gap-3 my-4 border border-[#3A2418]/10">
                    <MapPin className="w-5 h-5 text-[#C65D21] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-[#3A2418]">Delivery Destination</p>
                      <p className="text-xs text-[#3A2418]/70 mt-0.5 font-medium">{order.address}</p>
                    </div>
                  </div>
                )}

                {/* Itemized Order Pills */}
                {order.items && order.items.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-[#3A2418]/10">
                    <p className="text-[10px] uppercase font-bold text-[#3A2418]/50 tracking-wider mb-2.5">
                      Dishes in this order:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {order.items.map((item, idx) => (
                        <span
                          key={idx}
                          className="bg-[#FFF3DC] px-3 py-1.5 rounded-full text-xs font-bold text-[#3A2418] border border-[#3A2418]/10 flex items-center gap-1.5"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 text-[#C65D21]" />
                          <span>{item.title}</span>
                          <span className="text-[#C65D21]">×{item.qty || 1}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Customer Support CTA */}
                <div className="mt-6 pt-4 border-t border-[#3A2418]/10 flex flex-wrap items-center justify-between gap-3 text-xs text-[#3A2418]/70">
                  <span>Need assistance with Order #{order.id}?</span>
                  <div className="flex items-center gap-2">
                    <a
                      href="tel:03001234567"
                      className="flex items-center gap-1.5 bg-[#FFF3DC] hover:bg-white text-[#3A2418] font-bold px-3 py-1.5 rounded-full transition-colors border border-[#3A2418]/10"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-[#C65D21]" />
                      <span>Call Kitchen</span>
                    </a>
                    <a
                      href={`https://wa.me/923001234567?text=Hi%20CrispyBites!%20Inquiry%20regarding%20Order%20${order.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 bg-[#66734A]/10 hover:bg-[#66734A]/20 text-[#66734A] font-bold px-3 py-1.5 rounded-full transition-colors border border-[#66734A]/20"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

export default TrackOrderPage;