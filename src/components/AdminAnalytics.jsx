import { useMemo, useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Cell,
} from "recharts";
import { DollarSign, ShoppingBag, Star, Receipt } from "lucide-react";

const ranges = ["7 Days", "30 Days", "All Time"];

const STATUS_COLORS = {
    Preparing: "#f2a93b",
    "Out for delivery": "#3b82f6",
    Delivered: "#4c9a63",
    Cancelled: "#ef4444",
};

function KpiCard({ icon: Icon, label, value, sub }) {
    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm text-ink/50 font-medium">{label}</p>
                        <p className="text-2xl font-bold text-ink mt-1">{value}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-chili/10 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-chili" />
                    </div>
                </div>
                {sub && <p className="text-xs text-ink/40 mt-3">{sub}</p>}
            </CardContent>
        </Card>
    );
}

function rangeToDays(range) {
    if (range === "7 Days") return 7;
    if (range === "30 Days") return 30;
    return null; // All Time
}

function AdminAnalytics({ products, orders = [] }) {
    const [range, setRange] = useState("7 Days");

    const days = rangeToDays(range);

    const rangeOrders = useMemo(() => {
        if (!days) return orders;
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        return orders.filter((o) => new Date(o.created_at) >= cutoff);
    }, [orders, days]);

    const completedOrders = useMemo(
        () => rangeOrders.filter((o) => o.status !== "Cancelled"),
        [rangeOrders]
    );

    const totalRevenue = useMemo(
        () => completedOrders.reduce((s, o) => s + Number(o.total || 0), 0),
        [completedOrders]
    );

    const avgOrderValue = completedOrders.length
        ? Math.round(totalRevenue / completedOrders.length)
        : 0;

    const avgRating = useMemo(() => {
        if (products.length === 0) return "0.0";
        return (
            products.reduce((s, p) => s + Number(p.rating), 0) / products.length
        ).toFixed(1);
    }, [products]);

    const categoryPerformance = useMemo(() => {
        const byCat = {};
        products.forEach((p) => {
            byCat[p.category] = (byCat[p.category] || 0) + 1;
        });
        return Object.entries(byCat).map(([category, count]) => ({ category, count }));
    }, [products]);

    // Revenue trend built from real orders, bucketed by calendar day
    const revenueByDay = useMemo(() => {
        const bucketDays = days || 14; // "All Time" still shows a readable trailing window
        const buckets = [];
        for (let i = bucketDays - 1; i >= 0; i--) {
            const d = new Date();
            d.setHours(0, 0, 0, 0);
            d.setDate(d.getDate() - i);
            buckets.push({
                key: d.toDateString(),
                day: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
                revenue: 0,
                orders: 0,
            });
        }
        const byKey = Object.fromEntries(buckets.map((b) => [b.key, b]));
        rangeOrders.forEach((o) => {
            if (o.status === "Cancelled") return;
            const key = new Date(o.created_at).toDateString();
            if (byKey[key]) {
                byKey[key].revenue += Number(o.total || 0);
                byKey[key].orders += 1;
            }
        });
        return buckets;
    }, [rangeOrders, days]);

    // Status breakdown across the selected range
    const statusBreakdown = useMemo(() => {
        const counts = { Preparing: 0, "Out for delivery": 0, Delivered: 0, Cancelled: 0 };
        rangeOrders.forEach((o) => {
            if (counts[o.status] !== undefined) counts[o.status] += 1;
        });
        return Object.entries(counts).map(([status, count]) => ({ status, count }));
    }, [rangeOrders]);

    // Top dishes by real order volume (falls back to menu ratings if no orders yet)
    const topDishesByOrders = useMemo(() => {
        const tally = {};
        rangeOrders.forEach((o) => {
            if (o.status === "Cancelled") return;
            (o.items || []).forEach((item) => {
                if (!tally[item.title]) {
                    tally[item.title] = { title: item.title, qty: 0, revenue: 0 };
                }
                tally[item.title].qty += item.qty;
                tally[item.title].revenue += item.price * item.qty;
            });
        });
        return Object.values(tally)
            .sort((a, b) => b.qty - a.qty)
            .slice(0, 5);
    }, [rangeOrders]);

    const hasOrderData = rangeOrders.length > 0;
    const topRatedFallback = [...products]
        .sort((a, b) => Number(b.rating) - Number(a.rating))
        .slice(0, 5);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-end">
                <div className="flex items-center gap-1 bg-white border border-ink/10 rounded-full p-1">
                    {ranges.map((r) => (
                        <Button
                            key={r}
                            size="sm"
                            variant={range === r ? "default" : "ghost"}
                            onClick={() => setRange(r)}
                            className={`rounded-full h-8 px-3 text-xs ${range === r ? "bg-chili hover:bg-chili-dark" : "text-ink/50"
                                }`}
                        >
                            {r}
                        </Button>
                    ))}
                </div>
            </div>

            {/* KPI row — all computed from real orders + real menu data */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard
                    icon={DollarSign}
                    label="Revenue"
                    value={`Rs. ${totalRevenue.toLocaleString()}`}
                    sub={`${range} · excludes cancelled orders`}
                />
                <KpiCard
                    icon={ShoppingBag}
                    label="Orders"
                    value={rangeOrders.length}
                    sub={`${range} · live from your orders`}
                />
                <KpiCard
                    icon={Receipt}
                    label="Avg. Order Value"
                    value={`Rs. ${avgOrderValue}`}
                    sub="Live from your orders"
                />
                <KpiCard
                    icon={Star}
                    label="Avg. Menu Rating"
                    value={avgRating}
                    sub="Live from your menu"
                />
            </div>

            {/* Revenue chart — real orders */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                        <CardTitle className="text-base">Revenue trend</CardTitle>
                        <CardDescription>
                            {hasOrderData ? "From your real orders" : "No orders in this range yet"}
                        </CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-chili/10 text-chili">
                        {range}
                    </Badge>
                </CardHeader>
                <CardContent>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueByDay} margin={{ left: -20, right: 10 }}>
                                <defs>
                                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#e4572e" stopOpacity={0.35} />
                                        <stop offset="100%" stopColor="#e4572e" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                <XAxis
                                    dataKey="day"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: "#a3a3a3" }}
                                    interval="preserveStartEnd"
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: "#a3a3a3" }}
                                    tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)}
                                />
                                <Tooltip
                                    formatter={(value, name) =>
                                        name === "revenue"
                                            ? [`Rs. ${value.toLocaleString()}`, "Revenue"]
                                            : [value, "Orders"]
                                    }
                                    contentStyle={{ borderRadius: 8, border: "1px solid #e5e5e5", fontSize: 12 }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#e4572e" strokeWidth={2} fill="url(#rev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <div className="grid lg:grid-cols-5 gap-6">
                {/* Top dishes — by real order volume, falls back to menu ratings */}
                <Card className="lg:col-span-3">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                            {hasOrderData ? "Best selling dishes" : "Top rated dishes"}
                        </CardTitle>
                        <CardDescription>
                            {hasOrderData
                                ? "Ranked by units ordered"
                                : "No orders yet — showing top rated menu items"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {hasOrderData && topDishesByOrders.length > 0 ? (
                            <div className="flex flex-col divide-y divide-ink/5">
                                {topDishesByOrders.map((dish, i) => (
                                    <div key={dish.title} className="flex items-center gap-3 py-3">
                                        <span className="w-6 text-sm font-semibold text-ink/30">
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-ink truncate">{dish.title}</p>
                                            <p className="text-xs text-ink/40 mt-0.5">{dish.qty} sold</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-sm font-bold text-ink">
                                                Rs. {dish.revenue.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : topRatedFallback.length === 0 ? (
                            <p className="text-sm text-ink/40 py-6 text-center">No products yet.</p>
                        ) : (
                            <div className="flex flex-col divide-y divide-ink/5">
                                {topRatedFallback.map((dish, i) => (
                                    <div key={dish.id} className="flex items-center gap-3 py-3">
                                        <span className="w-6 text-sm font-semibold text-ink/30">
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-ink truncate">{dish.title}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                                    {dish.category}
                                                </Badge>
                                                <span className="flex items-center gap-0.5 text-xs text-turmeric font-medium">
                                                    <Star className="w-3 h-3 fill-turmeric text-turmeric" />
                                                    {dish.rating}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-sm font-bold text-ink">Rs. {dish.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Order status breakdown — real orders */}
                <Card className="lg:col-span-2">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Orders by status</CardTitle>
                        <CardDescription>{range}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {hasOrderData ? (
                            <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={statusBreakdown} layout="vertical" margin={{ left: 10 }}>
                                        <XAxis type="number" hide allowDecimals={false} />
                                        <YAxis
                                            type="category"
                                            dataKey="status"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 11, fill: "#525252" }}
                                            width={90}
                                        />
                                        <Tooltip cursor={{ fill: "#fafafa" }} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                                        <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={16}>
                                            {statusBreakdown.map((entry) => (
                                                <Cell key={entry.status} fill={STATUS_COLORS[entry.status]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <p className="text-sm text-ink/40 py-10 text-center">
                                No orders in this range yet.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Menu by category — always from real menu data */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base">Menu by category</CardTitle>
                    <CardDescription>Number of dishes per category</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-40">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryPerformance} layout="vertical" margin={{ left: 10 }}>
                                <XAxis type="number" hide allowDecimals={false} />
                                <YAxis
                                    type="category"
                                    dataKey="category"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: "#525252" }}
                                    width={70}
                                />
                                <Tooltip cursor={{ fill: "#fafafa" }} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                                <Bar dataKey="count" fill="#e4572e" radius={[0, 6, 6, 0]} barSize={18} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default AdminAnalytics;