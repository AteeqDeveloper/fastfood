import { useState } from "react";
import { supabaseClient } from "../lib/supabaseClient";

const STEPS = ["Preparing", "Out for delivery", "Delivered"];

const statusStyles = {
    Preparing: "bg-turmeric/20 text-turmeric",
    "Out for delivery": "bg-blue-100 text-blue-700",
    Delivered: "bg-basil/15 text-basil",
    Cancelled: "bg-red-100 text-red-600",
};

function OrderProgress({ status }) {
    if (status === "Cancelled") {
        return (
            <div className="flex items-center gap-2 mt-3">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                <span className="text-xs font-semibold text-red-600">
                    This order was cancelled
                </span>
            </div>
        );
    }

    const currentIndex = STEPS.indexOf(status);

    return (
        <div className="flex items-center mt-4">
            {STEPS.map((step, i) => (
                <div key={step} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center gap-1.5">
                        <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors ${i <= currentIndex
                                    ? "bg-chili text-white"
                                    : "bg-cream text-ink/30 border border-ink/10"
                                }`}
                        >
                            {i < currentIndex ? "✓" : i + 1}
                        </div>
                        <span
                            className={`text-[10px] font-semibold text-center leading-tight max-w-[64px] ${i <= currentIndex ? "text-ink" : "text-ink/30"
                                }`}
                        >
                            {step}
                        </span>
                    </div>
                    {i < STEPS.length - 1 && (
                        <div
                            className={`h-0.5 flex-1 mx-1 -mt-4 transition-colors ${i < currentIndex ? "bg-chili" : "bg-ink/10"
                                }`}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}

function TrackOrderPage() {
    const [phone, setPhone] = useState("");
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        const trimmed = phone.trim();
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
    };

    return (
        <main className="min-h-[70vh] max-w-2xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
            <div className="text-center mb-8">
                <span className="inline-block bg-chili/10 text-chili text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                    Order Tracking
                </span>
                <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-ink mb-2">
                    Track your order
                </h1>
                <p className="text-ink/60 text-sm max-w-sm mx-auto">
                    Enter the phone number you used at checkout to see your order status.
                </p>
            </div>

            <form onSubmit={handleSearch} className="flex gap-2 mb-8">
                <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="03XX-XXXXXXX"
                    required
                    className="flex-1 bg-white border border-ink/10 rounded-full px-5 py-3 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-chili shadow-sm"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-chili hover:bg-chili-dark disabled:opacity-60 transition-colors text-white font-semibold px-6 py-3 rounded-full text-sm shrink-0"
                >
                    {loading ? "Searching…" : "Track"}
                </button>
            </form>

            {error && (
                <p className="text-center text-chili text-sm font-medium mb-6">
                    Could not load orders: {error}
                </p>
            )}

            {!loading && searched && !error && orders.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-3xl mb-3">📦</p>
                    <p className="text-ink/60 text-sm">
                        No orders found for this phone number.
                    </p>
                </div>
            )}

            <div className="flex flex-col gap-4">
                {orders.map((order) => (
                    <div
                        key={order.id}
                        className="bg-white rounded-2xl border border-ink/5 shadow-sm p-5"
                    >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="font-display font-bold text-base text-ink">
                                        {order.id}
                                    </h3>
                                    <span
                                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusStyles[order.status] || "bg-cream text-ink/60"
                                            }`}
                                    >
                                        {order.status}
                                    </span>
                                </div>
                                <p className="text-ink/40 text-[11px] mt-1">
                                    {new Date(order.created_at).toLocaleString()}
                                </p>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="font-display font-extrabold text-lg text-chili">
                                    Rs. {order.total}
                                </p>
                                <p className="text-ink/40 text-xs">
                                    {order.items.reduce((s, i) => s + i.qty, 0)} items
                                </p>
                            </div>
                        </div>

                        <OrderProgress status={order.status} />

                        <div className="flex flex-wrap gap-1.5 text-xs text-ink/60 mt-4 border-t border-ink/5 pt-3">
                            {order.items.map((item) => (
                                <span
                                    key={item.id}
                                    className="bg-cream px-2.5 py-1 rounded-full"
                                >
                                    {item.title} × {item.qty}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}

export default TrackOrderPage;