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
  ChefHat,
  PackageCheck,
  ShoppingBag,
  ExternalLink,
  MessageCircle,
} from "lucide-react";

const STEPS = [
  { id: "Preparing", label: "Grill Fired Up", desc: "Kitchen is grilling your order fresh", icon: Flame },
  { id: "Out for delivery", label: "Rider on the Road", desc: "Dispatched in thermal insulated packaging", icon: Bike },
  { id: "Delivered", label: "Delivered", desc: "Landed hot & crisp at your doorstep", icon: CheckCircle2 },
];

const statusStyles = {
  Preparing: "bg-turmeric/15 text-charcoal border-turmeric/40",
  "Out for delivery": "bg-blue-100 text-blue-800 border-blue-200",
  Delivered: "bg-basil/15 text-basil border-basil/30",
  Cancelled: "bg-red-100 text-red-600 border-red-200",
};

function OrderTimeline({ status }) {
  if (status === "Cancelled") {
    return (
      <div className="flex items-center gap-2 mt-4 bg-red-50 border border-red-200 p-3 rounded-2xl">
        <XCircle className="w-5 h-5 text-red-600 shrink-0" />
        <div>
          <p className="text-xs font-bold text-red-700">This order was cancelled</p>
          <p className="text-[11px] text-red-600/70">
            Please contact our helpline at 0300-1234567 for any assistance.
          </p>
        </div>
      </div>
    );
  }

  const currentIndex = STEPS.findIndex((s) => s.id === status);
  const activeStep = currentIndex >= 0 ? currentIndex : 0;

  return (
    <div className="my-6 py-4 px-2">
      <div className="relative flex items-center justify-between">
        {/* Connecting Progress Track Line */}
        <div className="absolute top-5 left-8 right-8 h-1 bg-ink/10 -z-0 rounded-full">
          <div
            className="h-full bg-chili transition-all duration-500 rounded-full"
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
          const isPending = i > activeStep;

          return (
            <div key={step.id} className="flex flex-col items-center text-center relative z-10">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md ${
                  isDone
                    ? "bg-basil text-white scale-95"
                    : isCurrent
                    ? "bg-chili text-white ring-4 ring-chili/20 scale-110 animate-bounce"
                    : "bg-white text-ink/30 border border-ink/10"
                }`}
              >
                {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </div>

              <span
                className={`text-xs font-bold mt-2.5 max-w-[90px] leading-tight ${
                  isCurrent ? "text-chili" : isDone ? "text-ink" : "text-ink/40"
                }`}
              >
                {step.label}
              </span>
              <span className="text-[10px] text-ink/40 max-w-[90px] hidden sm:block mt-0.5 font-medium">
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
  const [phone, setPhone] = useState(initialPhone);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const runSearch = useCallback(async (rawPhone) => {
    const trimmed = rawPhone.trim();
    if (!trimmed) return;

    setLoading(true);
    setError("");
    setSearched(true);

    const { data, error: fetchError } = await supabaseClient
      .from("orders")
      .select("*")
      .eq("phone", trimmed)
      .order("created_at", { ascending: false });

    setLoading(false);

    if (fetchError) {
      setError(fetchError.message);
      setOrders([]);
      return;
    }
    setOrders(data || []);
  }, []);

  useEffect(() => {
    if (initialPhone.trim()) {
      runSearch(initialPhone);
    }
  }, [initialPhone, runSearch]);

  const handleSearch = (e) => {
    e.preventDefault();
    runSearch(phone);
  };

  return (
    <main className="min-h-[75vh] max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
      {/* Header Banner */}
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 bg-chili/10 border border-chili/20 text-chili text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-3 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-chili animate-pulse" />
          Live Kitchen Tracking
        </span>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-ink tracking-tight mb-3">
          Track Your Craving
        </h1>
        <p className="text-ink/60 text-sm sm:text-base max-w-md mx-auto font-medium">
          Enter the phone number you used at checkout to see your live order status from the grill.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white rounded-3xl p-3 shadow-lg border border-ink/5 mb-10">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 03001234567"
              required
              className="w-full bg-cream/60 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-chili"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-chili hover:bg-chili-dark active:scale-95 disabled:opacity-60 transition-all text-white font-extrabold px-8 py-3.5 rounded-2xl text-sm shadow-md shadow-chili/25"
          >
            {loading ? "Searching..." : "Track Order →"}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-semibold text-center p-4 rounded-2xl mb-8">
          Could not load orders: {error}
        </div>
      )}

      {!loading && searched && !error && orders.length === 0 && (
        <div className="bg-white rounded-3xl border border-ink/5 p-12 text-center shadow-sm">
          <p className="text-4xl mb-3">📦</p>
          <h3 className="font-display font-bold text-lg text-ink mb-1">No Orders Found</h3>
          <p className="text-ink/60 text-sm max-w-xs mx-auto font-medium">
            We couldn't find any orders for <span className="font-bold text-ink">{phone}</span>. Please verify your number.
          </p>
        </div>
      )}

      {/* Orders List */}
      <div className="flex flex-col gap-6">
        {orders.map((order) => {
          const itemCount = order.items.reduce((s, i) => s + (i.qty || 1), 0);

          return (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-ink/5 shadow-md hover:shadow-xl transition-all duration-300 p-6 sm:p-8"
            >
              {/* Order Card Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-ink/5">
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="font-display font-extrabold text-lg sm:text-xl text-ink">
                      Order #{order.id}
                    </h3>
                    <span
                      className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
                        statusStyles[order.status] || "bg-cream text-ink/60"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-ink/40 text-xs mt-1 font-medium">
                    Placed on {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-ink/40 uppercase block">Total Bill</span>
                  <p className="font-display font-black text-2xl text-chili">
                    Rs. {order.total}
                  </p>
                  <p className="text-ink/40 text-xs font-semibold">{itemCount} items</p>
                </div>
              </div>

              {/* Progress Timeline */}
              <OrderTimeline status={order.status} />

              {/* Delivery Info Box */}
              {order.address && (
                <div className="bg-cream/60 rounded-2xl p-4 flex items-start gap-3 my-4 border border-ink/5">
                  <MapPin className="w-5 h-5 text-chili shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-ink">Delivery Destination</p>
                    <p className="text-xs text-ink/70 mt-0.5 font-medium">{order.address}</p>
                  </div>
                </div>
              )}

              {/* Itemized Order Pills */}
              <div className="mt-4 pt-4 border-t border-ink/5">
                <p className="text-[10px] uppercase font-bold text-ink/40 tracking-wider mb-2.5">
                  Dishes in this order:
                </p>
                <div className="flex flex-wrap gap-2">
                  {order.items.map((item) => (
                    <span
                      key={item.id || item.title}
                      className="bg-cream px-3 py-1.5 rounded-full text-xs font-bold text-ink border border-ink/5 flex items-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-chili" />
                      <span>{item.title}</span>
                      <span className="text-chili">×{item.qty}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Customer Support CTA */}
              <div className="mt-6 pt-4 border-t border-ink/5 flex flex-wrap items-center justify-between gap-3 text-xs text-ink/60">
                <span>Need help with your order?</span>
                <div className="flex items-center gap-2">
                  <a
                    href="tel:03001234567"
                    className="flex items-center gap-1.5 bg-cream hover:bg-ink/10 text-ink font-bold px-3 py-1.5 rounded-full transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-chili" />
                    <span>Call Kitchen</span>
                  </a>
                  <a
                    href={`https://wa.me/923001234567?text=Hi%20CrispyBites!%20Need%20help%20with%20Order%20${order.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 bg-basil/10 hover:bg-basil/20 text-basil font-bold px-3 py-1.5 rounded-full transition-colors"
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
    </main>
  );
}

export default TrackOrderPage;