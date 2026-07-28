import { useState } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
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
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Star,
  Receipt,
  Flame,
} from "lucide-react";

// ---- Mock data (stands in for live order/sales data) ----
const revenueByDay = [
  { day: "Mon", revenue: 68400, orders: 92 },
  { day: "Tue", revenue: 71200, orders: 97 },
  { day: "Wed", revenue: 64800, orders: 88 },
  { day: "Thu", revenue: 79600, orders: 104 },
  { day: "Fri", revenue: 96200, orders: 131 },
  { day: "Sat", revenue: 112400, orders: 152 },
  { day: "Sun", revenue: 98900, orders: 138 },
];

const categoryPerformance = [
  { category: "Burger", orders: 312 },
  { category: "Shawarma", orders: 208 },
  { category: "Pizza", orders: 271 },
  { category: "Sides", orders: 94 },
];

const topDishes = [
  { title: "BBQ Smash Burger", category: "Burger", rating: 4.9, orders: 214, revenue: 192286 },
  { title: "Arabic Shawarma", category: "Shawarma", rating: 4.9, orders: 189, revenue: 132111 },
  { title: "Classic Beef Burger", category: "Burger", rating: 4.8, orders: 176, revenue: 131824 },
  { title: "Chicken Fajita Pizza", category: "Pizza", rating: 4.8, orders: 121, revenue: 181379 },
  { title: "Crispy Zinger Burger", category: "Burger", rating: 4.7, orders: 158, revenue: 110442 },
];

const recentOrders = [
  { id: "#SB-4821", customer: "Ayesha Khan", items: 3, total: 2247, status: "Delivered" },
  { id: "#SB-4820", customer: "Bilal Ahmed", items: 1, total: 749, status: "Preparing" },
  { id: "#SB-4819", customer: "Sara Malik", items: 4, total: 3196, status: "Delivered" },
  { id: "#SB-4818", customer: "Hamza Iqbal", items: 2, total: 1398, status: "Out for delivery" },
  { id: "#SB-4817", customer: "Fatima Noor", items: 2, total: 1198, status: "Delivered" },
  { id: "#SB-4816", customer: "Usman Tariq", items: 1, total: 1499, status: "Cancelled" },
];

const statusStyles = {
  Delivered: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  Preparing: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  "Out for delivery": "bg-blue-100 text-blue-700 hover:bg-blue-100",
  Cancelled: "bg-red-100 text-red-700 hover:bg-red-100",
};

const ranges = ["Today", "7 Days", "30 Days"];

function KpiCard({ icon: Icon, label, value, delta, positive }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-neutral-500 font-medium">{label}</p>
            <p className="text-2xl font-bold text-neutral-900 mt-1">{value}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-orange-600" />
          </div>
        </div>
        <div className="flex items-center gap-1 mt-3">
          {positive ? (
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-red-600" />
          )}
          <span
            className={`text-xs font-semibold ${
              positive ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {delta}
          </span>
          <span className="text-xs text-neutral-400">vs last period</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [range, setRange] = useState("7 Days");
  const totalRevenue = revenueByDay.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = revenueByDay.reduce((s, d) => s + d.orders, 0);
  const avgOrderValue = Math.round(totalRevenue / totalOrders);

  return (
    <div className="min-h-screen bg-neutral-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
                SpicyBites Dashboard
              </h1>
              <p className="text-sm text-neutral-500">
                Live kitchen &amp; sales overview
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-white border border-neutral-200 rounded-full p-1 self-start sm:self-auto">
            {ranges.map((r) => (
              <Button
                key={r}
                size="sm"
                variant={range === r ? "default" : "ghost"}
                onClick={() => setRange(r)}
                className={`rounded-full h-8 px-3 text-xs ${
                  range === r
                    ? "bg-orange-600 hover:bg-orange-700"
                    : "text-neutral-500"
                }`}
              >
                {r}
              </Button>
            ))}
          </div>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KpiCard
            icon={DollarSign}
            label="Revenue"
            value={`Rs. ${totalRevenue.toLocaleString()}`}
            delta="+12.4%"
            positive
          />
          <KpiCard
            icon={ShoppingBag}
            label="Orders"
            value={totalOrders}
            delta="+8.1%"
            positive
          />
          <KpiCard
            icon={Receipt}
            label="Avg. Order Value"
            value={`Rs. ${avgOrderValue}`}
            delta="-2.3%"
            positive={false}
          />
          <KpiCard
            icon={Star}
            label="Avg. Rating"
            value="4.6"
            delta="+0.2"
            positive
          />
        </div>

        {/* Revenue chart */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base">Revenue Trend</CardTitle>
              <CardDescription>Daily revenue, current week</CardDescription>
            </div>
            <Badge variant="secondary" className="bg-orange-50 text-orange-700">
              {range}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueByDay} margin={{ left: -20, right: 10 }}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ea580c" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#ea580c" stopOpacity={0} />
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
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #e5e5e5",
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#ea580c"
                    strokeWidth={2}
                    fill="url(#rev)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Top dishes */}
          <Card className="lg:col-span-3">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Top Performing Dishes</CardTitle>
              <CardDescription>Ranked by orders this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col divide-y divide-neutral-100">
                {topDishes.map((dish, i) => (
                  <div key={dish.title} className="flex items-center gap-3 py-3">
                    <span className="w-6 text-sm font-semibold text-neutral-400">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-neutral-900 truncate">
                        {dish.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          {dish.category}
                        </Badge>
                        <span className="flex items-center gap-0.5 text-xs text-amber-600 font-medium">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          {dish.rating}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-neutral-900">
                        Rs. {dish.revenue.toLocaleString()}
                      </p>
                      <p className="text-xs text-neutral-400">{dish.orders} orders</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Category breakdown */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Orders by Category</CardTitle>
              <CardDescription>This week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryPerformance} layout="vertical" margin={{ left: 10 }}>
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="category"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#525252" }}
                      width={70}
                    />
                    <Tooltip
                      cursor={{ fill: "#fafafa" }}
                      contentStyle={{ borderRadius: 8, fontSize: 12 }}
                    />
                    <Bar dataKey="orders" fill="#ea580c" radius={[0, 6, 6, 0]} barSize={18} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent orders */}
        <Card className="mt-6">
          <CardHeader className="pb-2">
            <Tabs defaultValue="all">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Recent Orders</CardTitle>
                  <CardDescription>Latest checkouts across all channels</CardDescription>
                </div>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                </TabsList>
              </div>
            </Tabs>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-center">Items</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium text-neutral-900">
                      {order.id}
                    </TableCell>
                    <TableCell className="text-neutral-600">{order.customer}</TableCell>
                    <TableCell className="text-center text-neutral-600">
                      {order.items}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-neutral-900">
                      Rs. {order.total.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge className={statusStyles[order.status]} variant="secondary">
                        {order.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Separator className="my-6" />
        <p className="text-center text-xs text-neutral-400">
          SpicyBites Admin · figures shown are sample data
        </p>
      </div>
    </div>
  );
}
