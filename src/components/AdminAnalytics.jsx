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
} from "recharts";
import { DollarSign, ShoppingBag, Star, Package } from "lucide-react";
import { countReviews } from "../data/product-rating";

// Sample sales trend — no live order history exists yet in this app, so this
// stays illustrative until real orders are tracked. Everything else below
// (ratings, categories, top dishes) is computed from your actual product data.
const sampleRevenueByDay = [
    { day: "Mon", revenue: 68400 },
    { day: "Tue", revenue: 71200 },
    { day: "Wed", revenue: 64800 },
    { day: "Thu", revenue: 79600 },
    { day: "Fri", revenue: 96200 },
    { day: "Sat", revenue: 112400 },
    { day: "Sun", revenue: 98900 },
];

const ranges = ["Today", "7 Days", "30 Days"];

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

function AdminAnalytics({ products }) {
    const [range, setRange] = useState("7 Days");

    const avgRating = useMemo(() => {
        if (products.length === 0) return "0.0";
        return (
            products.reduce((s, p) => s + Number(p.rating), 0) / products.length
        ).toFixed(1);
    }, [products]);

    const avgPrice = useMemo(() => {
        if (products.length === 0) return 0;
        return Math.round(products.reduce((s, p) => s + p.price, 0) / products.length);
    }, [products]);

    const categoryPerformance = useMemo(() => {
        const byCat = {};
        products.forEach((p) => {
            byCat[p.category] = (byCat[p.category] || 0) + 1;
        });
        return Object.entries(byCat).map(([category, count]) => ({ category, count }));
    }, [products]);

    const topDishes = useMemo(() => {
        return [...products]
            .sort((a, b) => Number(b.rating) - Number(a.rating))
            .slice(0, 5)
            .map((p) => ({ ...p, reviews: countReviews(p.id) }));
    }, [products]);

    const totalRevenue = sampleRevenueByDay.reduce((s, d) => s + d.revenue, 0);

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

            {/* KPI row — ratings and pricing are real, revenue is sample */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard
                    icon={Package}
                    label="Total Products"
                    value={products.length}
                    sub="Live from your menu"
                />
                <KpiCard
                    icon={Star}
                    label="Avg. Rating"
                    value={avgRating}
                    sub="Live from your menu"
                />
                <KpiCard
                    icon={DollarSign}
                    label="Avg. Price"
                    value={`Rs. ${avgPrice}`}
                    sub="Live from your menu"
                />
                <KpiCard
                    icon={ShoppingBag}
                    label="Sample Revenue"
                    value={`Rs. ${totalRevenue.toLocaleString()}`}
                    sub="Sample data — no order history yet"
                />
            </div>

            {/* Revenue chart (sample) */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                        <CardTitle className="text-base">Revenue trend</CardTitle>
                        <CardDescription>Sample data, current week</CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-chili/10 text-chili">
                        {range}
                    </Badge>
                </CardHeader>
                <CardContent>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={sampleRevenueByDay} margin={{ left: -20, right: 10 }}>
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
                                    tick={{ fontSize: 12, fill: "#a3a3a3" }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: "#a3a3a3" }}
                                    tickFormatter={(v) => `${v / 1000}k`}
                                />
                                <Tooltip
                                    formatter={(value) => [`Rs. ${value.toLocaleString()}`, "Revenue"]}
                                    contentStyle={{ borderRadius: 8, border: "1px solid #e5e5e5", fontSize: 12 }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#e4572e" strokeWidth={2} fill="url(#rev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <div className="grid lg:grid-cols-5 gap-6">
                {/* Top dishes — real product data */}
                <Card className="lg:col-span-3">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Top rated dishes</CardTitle>
                        <CardDescription>From your current menu</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {topDishes.length === 0 ? (
                            <p className="text-sm text-ink/40 py-6 text-center">No products yet.</p>
                        ) : (
                            <div className="flex flex-col divide-y divide-ink/5">
                                {topDishes.map((dish, i) => (
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
                                            <p className="text-xs text-ink/40">{dish.reviews} reviews</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Category breakdown — real product data */}
                <Card className="lg:col-span-2">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Menu by category</CardTitle>
                        <CardDescription>Number of dishes per category</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-48">
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
        </div>
    );
}

export default AdminAnalytics;