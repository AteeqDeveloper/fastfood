import { useState, useMemo, useEffect } from "react";
import { supabaseClient } from "../lib/supabaseClient";
import AdminSidebar, { ADMIN_NAV_ITEMS } from "./AdminSidebar";
import AdminOverview from "./AdminOverview";
import AdminAnalytics from "./AdminAnalytics";
import AdminLogin from "./AdminLogin";
import AdminPOS from "./AdminPOS";
import AdminUsers from "./AdminUsers";
import AdminSettings from "./AdminSettings";
import AdminProfile from "./AdminProfile";
import {
  ShoppingBag,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  MessageSquareText,
  Star,
  Zap,
  Menu,
  ChevronRight,
  ExternalLink,
  Search,
  Flame,
  Plus,
} from "lucide-react";

const CATEGORIES = ["Burger", "Shawarma", "Pizza", "Sides", "Drinks"];

const emptyForm = {
  title: "",
  description: "",
  price: "",
  category: "Burger",
  image: "",
  rating: "4.5",
};

const ORDER_STATUSES = ["Preparing", "Out for delivery", "Delivered", "Cancelled"];

const orderStatusStyles = {
  Preparing: "bg-turmeric/20 text-turmeric",
  "Out for delivery": "bg-blue-100 text-blue-700",
  Delivered: "bg-basil/15 text-basil",
  Cancelled: "bg-red-100 text-red-600",
};

const ORDER_STATUS_ICONS = {
  Preparing: Clock,
  "Out for delivery": Truck,
  Delivered: CheckCircle2,
  Cancelled: XCircle,
};

function StarRow({ rating }) {
  const full = Math.round(Number(rating));
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`w-3 h-3 ${n <= full ? "fill-turmeric text-turmeric" : "fill-transparent text-ink/15"}`}
        />
      ))}
    </span>
  );
}

function AdminDashboard({ products, onAdd, onUpdate, onDelete, onBack }) {
  // ---- Auth ----
  const [session, setSession] = useState(null);
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    // Safety fallback: if Supabase takes more than 3s, proceed to login screen
    const timeout = setTimeout(() => {
      if (isMounted) setSessionChecked(true);
    }, 3000);

    supabaseClient.auth
      .getSession()
      .then(({ data, error }) => {
        if (isMounted) {
          clearTimeout(timeout);
          setSession(data?.session || null);
          setSessionChecked(true);
        }
      })
      .catch((err) => {
        if (isMounted) {
          clearTimeout(timeout);
          console.warn("Session check failed, defaulting to login", err);
          setSession(null);
          setSessionChecked(true);
        }
      });

    const { data: listener } = supabaseClient.auth.onAuthStateChange(
      (_event, newSession) => {
        if (isMounted) {
          setSession(newSession);
          setSessionChecked(true);
        }
      }
    );

    return () => {
      isMounted = false;
      clearTimeout(timeout);
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  const handleSignOut = async () => {
    await supabaseClient.auth.signOut();
  };

  // ---- Navigation & Mobile Sidebar ----
  const [tab, setTab] = useState("dashboard"); // "dashboard" | "pos" | "products" | "orders" | "analytics" | "reviews" | "users" | "settings" | "profile"
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [imagePreviewError, setImagePreviewError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ---- Orders ----
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderStatusFilter, setOrderStatusFilter] = useState("All");
  const [orderSearch, setOrderSearch] = useState("");

  const fetchOrders = async () => {
    setOrdersLoading(true);
    const { data, error } = await supabaseClient
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setOrders(data || []);
    setOrdersLoading(false);
  };

  const handleUpdateOrderStatus = async (id, status) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    const { error } = await supabaseClient.from("orders").update({ status }).eq("id", id);
    if (error) showToast("Could not update order status", "error");
  };

  // ---- Reviews ----
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewFilter, setReviewFilter] = useState("All"); // "All" | "Pending" | "Approved"

  const fetchReviews = async () => {
    setReviewsLoading(true);
    const { data, error } = await supabaseClient
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setReviews(data || []);
    setReviewsLoading(false);
  };

  const handleApproveReview = async (id) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, is_approved: true } : r)));
    const { error } = await supabaseClient.from("reviews").update({ is_approved: true }).eq("id", id);
    if (error) showToast("Could not approve review", "error");
  };

  const handleRejectReview = async (id) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, is_approved: false } : r)));
    const { error } = await supabaseClient.from("reviews").update({ is_approved: false }).eq("id", id);
    if (error) showToast("Could not update review", "error");
  };

  const handleDeleteReview = async (id) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    const { error } = await supabaseClient.from("reviews").delete().eq("id", id);
    if (error) showToast("Could not delete review", "error");
    else showToast("Review deleted", "error");
  };

  useEffect(() => {
    if (!session) return;
    fetchOrders();
    fetchReviews();
  }, [session]); // eslint-disable-line react-hooks/exhaustive-deps

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = filterCat === "All" || p.category === filterCat;
      const matchSearch =
        !search.trim() ||
        p.title.toLowerCase().includes(search.trim().toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, filterCat, search]);

  const stats = useMemo(() => {
    const total = products.length;
    const avgPrice =
      total === 0
        ? 0
        : Math.round(products.reduce((s, p) => s + p.price, 0) / total);
    const byCat = {};
    products.forEach((p) => {
      byCat[p.category] = (byCat[p.category] || 0) + 1;
    });
    return { total, avgPrice, byCat };
  }, [products]);

  const pendingReviewsCount = reviews.filter((r) => !r.is_approved).length;

  const orderStats = useMemo(() => {
    const counts = { Preparing: 0, "Out for delivery": 0, Delivered: 0, Cancelled: 0 };
    let revenue = 0;
    orders.forEach((o) => {
      if (counts[o.status] !== undefined) counts[o.status] += 1;
      if (o.status !== "Cancelled") revenue += Number(o.total || 0);
    });
    return { total: orders.length, counts, revenue };
  }, [orders]);

  const activeOrdersCount = (orderStats.counts.Preparing || 0) + (orderStats.counts["Out for delivery"] || 0);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const statusMatch = orderStatusFilter === "All" || o.status === orderStatusFilter;
      const q = orderSearch.trim().toLowerCase();
      const searchMatch =
        !q ||
        o.id?.toLowerCase().includes(q) ||
        o.customer?.toLowerCase().includes(q) ||
        o.phone?.toLowerCase().includes(q);
      return statusMatch && searchMatch;
    });
  }, [orders, orderStatusFilter, orderSearch]);

  const reviewStats = useMemo(() => {
    const approved = reviews.filter((r) => r.is_approved);
    const avgRating = approved.length
      ? (approved.reduce((s, r) => s + Number(r.rating), 0) / approved.length).toFixed(1)
      : "0.0";
    return { total: reviews.length, pending: pendingReviewsCount, approved: approved.length, avgRating };
  }, [reviews, pendingReviewsCount]);

  const filteredReviews = useMemo(() => {
    if (reviewFilter === "Pending") return reviews.filter((r) => !r.is_approved);
    if (reviewFilter === "Approved") return reviews.filter((r) => r.is_approved);
    return reviews;
  }, [reviews, reviewFilter]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    if (field === "image") setImagePreviewError(false);
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title required";
    if (!form.description.trim()) e.description = "Description required";
    if (!form.price || Number(form.price) <= 0) e.price = "Valid price required";
    if (!form.image.trim()) e.image = "Image URL required";
    if (!form.rating || Number(form.rating) < 0 || Number(form.rating) > 5)
      e.rating = "Rating 0–5";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      category: form.category,
      image: form.image.trim(),
      rating: Number(form.rating),
    };

    setSubmitting(true);
    if (editingId) {
      await onUpdate(editingId, payload);
      showToast("Product updated successfully");
    } else {
      await onAdd(payload);
      showToast("Product added successfully");
    }
    setSubmitting(false);
    setForm(emptyForm);
    setEditingId(null);
    setImagePreviewError(false);
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setForm({
      title: product.title,
      description: product.description,
      price: String(product.price),
      category: product.category,
      image: product.image,
      rating: String(product.rating),
    });
    setErrors({});
    setImagePreviewError(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
    setImagePreviewError(false);
  };

  const handleDelete = async (id) => {
    await onDelete(id);
    setConfirmDelete(null);
    if (editingId === id) cancelEdit();
    showToast("Product deleted", "error");
  };

  // ---- Current Tab Meta Information ----
  const currentNavItem = useMemo(() => {
    return ADMIN_NAV_ITEMS.find((item) => item.id === tab) || ADMIN_NAV_ITEMS[0];
  }, [tab]);

  // ---- Auth Gate ----
  if (!sessionChecked) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-ink/40 text-sm font-medium animate-pulse">Checking session…</p>
      </div>
    );
  }

  if (!session) {
    return <AdminLogin onBack={onBack} />;
  }

  return (
    <div className="min-h-screen bg-cream/60 flex">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-[200] px-5 py-3 rounded-xl shadow-xl text-sm font-semibold animate-pop-in ${
            toast.type === "error" ? "bg-red-500 text-white" : "bg-basil text-white"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Modern Fixed Left Sidebar Component */}
      <AdminSidebar
        currentTab={tab}
        onSelectTab={setTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        session={session}
        onSignOut={handleSignOut}
        onBackToStorefront={onBack}
        pendingReviewsCount={pendingReviewsCount}
        activeOrdersCount={activeOrdersCount}
      />

      {/* Main Admin Content Area (Positioned cleanly right of the fixed sidebar on desktop) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 xl:pl-72 min-h-screen">
        {/* Mobile / Tablet Top Header Bar (hidden on desktop lg:hidden) */}
        <header className="lg:hidden sticky top-0 z-30 bg-charcoal text-cream border-b border-white/10 px-4 py-3 shadow-md flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-9 h-9 rounded-xl bg-charcoal-light border border-white/10 flex items-center justify-center text-cream hover:text-white active:scale-95 transition-all"
              aria-label="Open sidebar navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-chili to-turmeric flex items-center justify-center text-white shrink-0">
                <Flame className="w-4 h-4 fill-white text-white" />
              </div>
              <h1 className="font-display font-black text-sm tracking-tight truncate">
                Crispy<span className="text-chili">Bites</span> <span className="text-cream/60 font-medium">/ {currentNavItem.label}</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onBack}
              className="px-2.5 py-1.5 rounded-lg bg-charcoal-light hover:bg-white/10 text-[11px] font-bold text-cream/80 border border-white/10 flex items-center gap-1"
              title="Back to Customer Storefront"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Storefront</span>
            </button>
          </div>
        </header>

        {/* Desktop Top Sub-Header Breadcrumb Bar */}
        <div className="hidden lg:flex items-center justify-between px-8 py-4 bg-white/60 backdrop-blur-md border-b border-ink/5 sticky top-0 z-20">
          <div className="flex items-center gap-2 text-xs font-semibold text-ink/50">
            <span>Admin</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-ink font-bold text-sm">{currentNavItem.label}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cream border border-ink/5 text-xs font-medium text-ink/70">
              <span className="w-2 h-2 rounded-full bg-basil animate-pulse" />
              <span>Realtime Server Connected</span>
            </div>

            <button
              onClick={onBack}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-charcoal hover:bg-chili text-white text-xs font-bold transition-colors shadow-sm"
              title="Return to Customer Storefront"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Storefront</span>
            </button>
          </div>
        </div>

        {/* Dynamic Main Body Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {tab === "dashboard" && (
            <AdminOverview
              products={products}
              orders={orders}
              reviews={reviews}
              onNavigateTab={setTab}
            />
          )}

          {tab === "pos" && (
            <AdminPOS
              products={products}
              session={session}
              onOrderCompleted={fetchOrders}
            />
          )}

          {tab === "analytics" && (
            <AdminAnalytics products={products} orders={orders} />
          )}

          {tab === "users" && (
            <AdminUsers session={session} />
          )}

          {tab === "settings" && (
            <AdminSettings />
          )}

          {tab === "profile" && (
            <AdminProfile
              session={session}
              onSignOut={handleSignOut}
              onBackToStorefront={onBack}
            />
          )}

          {tab === "orders" && (
            <div className="flex flex-col gap-5">
              {/* Stat cards */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-ink/5">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-ink/40" />
                    <p className="text-ink/50 text-xs font-semibold uppercase tracking-wide">
                      Total
                    </p>
                  </div>
                  <p className="font-display font-extrabold text-2xl text-ink mt-1">
                    {orderStats.total}
                  </p>
                </div>
                {ORDER_STATUSES.map((status) => {
                  const Icon = ORDER_STATUS_ICONS[status];
                  return (
                    <div
                      key={status}
                      className="bg-white rounded-2xl p-4 shadow-sm border border-ink/5"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-ink/40" />
                        <p className="text-ink/50 text-xs font-semibold uppercase tracking-wide truncate">
                          {status}
                        </p>
                      </div>
                      <p className="font-display font-extrabold text-2xl text-ink mt-1">
                        {orderStats.counts[status]}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40 text-sm">
                    🔍
                  </span>
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search by order ID, customer, or phone..."
                    className="w-full bg-white border border-ink/10 rounded-full pl-9 pr-4 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-chili"
                  />
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {["All", ...ORDER_STATUSES].map((status) => (
                    <button
                      key={status}
                      onClick={() => setOrderStatusFilter(status)}
                      className={`shrink-0 px-3.5 py-2 rounded-full text-xs font-semibold border-2 transition-colors ${
                        orderStatusFilter === status
                          ? "bg-chili border-chili text-white shadow-sm"
                          : "bg-white border-ink/10 text-ink/60 hover:border-chili/40"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {ordersLoading ? (
                <p className="text-ink/40 text-sm text-center py-12">Loading orders…</p>
              ) : orders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-ink/5 p-12 text-center">
                  <p className="text-3xl mb-2">🧾</p>
                  <p className="text-ink/60 text-sm">
                    No orders yet. They'll show up here as soon as a customer checks out.
                  </p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-ink/5 p-12 text-center">
                  <p className="text-3xl mb-2">🔍</p>
                  <p className="text-ink/60 text-sm">No orders match your filters.</p>
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-ink/5 shadow-sm p-4 sm:p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-display font-bold text-sm sm:text-base text-ink">
                            #{order.id.slice(0, 10)}
                          </h3>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              orderStatusStyles[order.status] || "bg-cream text-ink/60"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <p className="text-ink/60 text-xs mt-1">
                          {order.customer} · {order.phone || "no phone"}
                        </p>
                        {order.address && (
                          <p className="text-ink/40 text-xs mt-0.5 max-w-md">
                            {order.address}
                          </p>
                        )}
                        <p className="text-ink/30 text-[10px] mt-1">
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

                    <div className="flex flex-wrap gap-1.5 text-xs text-ink/60 mb-3 border-t border-ink/5 pt-3">
                      {order.items.map((item) => (
                        <span
                          key={item.id}
                          className="bg-cream px-2.5 py-1 rounded-full"
                        >
                          {item.title} × {item.qty}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {ORDER_STATUSES.map((status) => (
                        <button
                          key={status}
                          onClick={() => handleUpdateOrderStatus(order.id, status)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-colors ${
                            order.status === status
                              ? "bg-chili border-chili text-white"
                              : "bg-transparent border-ink/15 text-ink/60 hover:border-chili/50"
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === "reviews" && (
            <div className="flex flex-col gap-5">
              {/* Stat cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-ink/5">
                  <div className="flex items-center gap-2">
                    <MessageSquareText className="w-4 h-4 text-ink/40" />
                    <p className="text-ink/50 text-xs font-semibold uppercase tracking-wide">
                      Total
                    </p>
                  </div>
                  <p className="font-display font-extrabold text-2xl text-ink mt-1">
                    {reviewStats.total}
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-ink/5">
                  <p className="text-ink/50 text-xs font-semibold uppercase tracking-wide">
                    Pending
                  </p>
                  <p className="font-display font-extrabold text-2xl text-turmeric mt-1">
                    {reviewStats.pending}
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-ink/5">
                  <p className="text-ink/50 text-xs font-semibold uppercase tracking-wide">
                    Approved
                  </p>
                  <p className="font-display font-extrabold text-2xl text-basil mt-1">
                    {reviewStats.approved}
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-ink/5">
                  <p className="text-ink/50 text-xs font-semibold uppercase tracking-wide">
                    Avg. Rating
                  </p>
                  <p className="font-display font-extrabold text-2xl text-chili mt-1">
                    {reviewStats.avgRating}
                  </p>
                </div>
              </div>

              {/* Filter tabs */}
              <div className="flex items-center gap-1.5">
                {["All", "Pending", "Approved"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setReviewFilter(f)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border-2 transition-colors ${
                      reviewFilter === f
                        ? "bg-chili border-chili text-white shadow-sm"
                        : "bg-white border-ink/10 text-ink/60 hover:border-chili/40"
                    }`}
                  >
                    {f}
                    {f === "Pending" && reviewStats.pending > 0 && ` (${reviewStats.pending})`}
                  </button>
                ))}
              </div>

              {reviewsLoading ? (
                <p className="text-ink/40 text-sm text-center py-12">Loading reviews…</p>
              ) : reviews.length === 0 ? (
                <div className="bg-white rounded-2xl border border-ink/5 p-12 text-center">
                  <p className="text-3xl mb-2">💬</p>
                  <p className="text-ink/60 text-sm">No reviews yet.</p>
                </div>
              ) : filteredReviews.length === 0 ? (
                <div className="bg-white rounded-2xl border border-ink/5 p-12 text-center">
                  <p className="text-3xl mb-2">🔍</p>
                  <p className="text-ink/60 text-sm">No reviews match this filter.</p>
                </div>
              ) : (
                filteredReviews.map((rev) => {
                  const product = products.find((p) => p.id === rev.product_id);
                  return (
                    <div
                      key={rev.id}
                      className={`bg-white rounded-2xl border shadow-sm p-4 sm:p-5 ${
                        rev.is_approved ? "border-ink/5" : "border-turmeric ring-1 ring-turmeric/20"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm text-ink">
                              {rev.username}
                            </span>
                            <StarRow rating={rev.rating} />
                            <span className="text-turmeric text-xs font-semibold">
                              {rev.rating}
                            </span>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                rev.is_approved
                                  ? "bg-basil/15 text-basil"
                                  : "bg-turmeric/20 text-turmeric"
                              }`}
                            >
                              {rev.is_approved ? "Approved" : "Pending"}
                            </span>
                          </div>
                          <p className="text-ink/40 text-xs mt-0.5">
                            on {product ? product.title : `Product #${rev.product_id}`}
                          </p>
                        </div>
                      </div>
                      <p className="text-ink/70 text-sm mb-3">{rev.review}</p>
                      <div className="flex gap-1.5">
                        {!rev.is_approved ? (
                          <button
                            onClick={() => handleApproveReview(rev.id)}
                            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-basil/15 text-basil hover:bg-basil/25 transition-colors"
                          >
                            Approve
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRejectReview(rev.id)}
                            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-cream text-ink/60 hover:bg-turmeric/20 transition-colors"
                          >
                            Unapprove
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteReview(rev.id)}
                          className="px-3 py-1.5 rounded-full text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {tab === "products" && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-ink/5">
                  <p className="text-ink/50 text-xs font-semibold uppercase tracking-wide">
                    Total Items
                  </p>
                  <p className="font-display font-extrabold text-2xl text-ink mt-1">
                    {stats.total}
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-ink/5">
                  <p className="text-ink/50 text-xs font-semibold uppercase tracking-wide">
                    Avg. Price
                  </p>
                  <p className="font-display font-extrabold text-2xl text-chili mt-1">
                    Rs. {stats.avgPrice}
                  </p>
                </div>
                {Object.entries(stats.byCat)
                  .slice(0, 2)
                  .map(([cat, count]) => (
                    <div
                      key={cat}
                      className="bg-white rounded-2xl p-4 shadow-sm border border-ink/5"
                    >
                      <p className="text-ink/50 text-xs font-semibold uppercase tracking-wide">
                        {cat}
                      </p>
                      <p className="font-display font-extrabold text-2xl text-ink mt-1">
                        {count}
                      </p>
                    </div>
                  ))}
              </div>

              <div className="grid lg:grid-cols-[380px_1fr] gap-6 items-start">
                {/* FORM */}
                <div className="bg-white rounded-2xl shadow-md border border-ink/5 p-5 sm:p-6 sticky top-20">
                  <h2 className="font-display font-bold text-lg text-ink mb-4">
                    {editingId ? "Edit Product" : "Add New Product"}
                  </h2>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide text-ink/60 mb-1.5">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={form.title}
                        onChange={handleChange("title")}
                        placeholder="e.g. Classic Beef Burger"
                        className={`w-full bg-cream rounded-xl px-4 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 ${
                          errors.title ? "ring-2 ring-chili" : "focus:ring-chili"
                        }`}
                      />
                      {errors.title && (
                        <p className="text-chili text-xs mt-1">{errors.title}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide text-ink/60 mb-1.5">
                        Description *
                      </label>
                      <textarea
                        value={form.description}
                        onChange={handleChange("description")}
                        placeholder="Short description of the dish..."
                        rows={3}
                        className={`w-full bg-cream rounded-xl px-4 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 resize-none ${
                          errors.description ? "ring-2 ring-chili" : "focus:ring-chili"
                        }`}
                      />
                      {errors.description && (
                        <p className="text-chili text-xs mt-1">{errors.description}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide text-ink/60 mb-1.5">
                          Price (Rs) *
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={form.price}
                          onChange={handleChange("price")}
                          placeholder="749"
                          className={`w-full bg-cream rounded-xl px-4 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 ${
                            errors.price ? "ring-2 ring-chili" : "focus:ring-chili"
                          }`}
                        />
                        {errors.price && (
                          <p className="text-chili text-xs mt-1">{errors.price}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide text-ink/60 mb-1.5">
                          Rating *
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="5"
                          step="0.1"
                          value={form.rating}
                          onChange={handleChange("rating")}
                          placeholder="4.5"
                          className={`w-full bg-cream rounded-xl px-4 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 ${
                            errors.rating ? "ring-2 ring-chili" : "focus:ring-chili"
                          }`}
                        />
                        {errors.rating && (
                          <p className="text-chili text-xs mt-1">{errors.rating}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide text-ink/60 mb-1.5">
                        Category *
                      </label>
                      <select
                        value={form.category}
                        onChange={handleChange("category")}
                        className="w-full bg-cream rounded-xl px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-chili"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide text-ink/60 mb-1.5">
                        Image URL *
                      </label>
                      <input
                        type="url"
                        value={form.image}
                        onChange={handleChange("image")}
                        placeholder="https://images.unsplash.com/..."
                        className={`w-full bg-cream rounded-xl px-4 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 ${
                          errors.image ? "ring-2 ring-chili" : "focus:ring-chili"
                        }`}
                      />
                      {errors.image && (
                        <p className="text-chili text-xs mt-1">{errors.image}</p>
                      )}
                      {form.image && !imagePreviewError && (
                        <img
                          src={form.image}
                          alt="Preview"
                          className="mt-2 w-full h-28 object-cover rounded-xl border border-ink/10"
                          onError={() => setImagePreviewError(true)}
                        />
                      )}
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 bg-chili hover:bg-chili-dark disabled:opacity-60 transition-colors text-white font-semibold py-2.5 rounded-full text-sm shadow-md shadow-chili/25"
                      >
                        {submitting
                          ? "Saving..."
                          : editingId
                          ? "Update Product"
                          : "Add Product"}
                      </button>
                      {editingId && (
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="px-4 py-2.5 rounded-full text-sm font-semibold border-2 border-ink/15 text-ink/70 hover:border-chili/50 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* PRODUCT LIST */}
                <div>
                  <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40 text-sm">
                        🔍
                      </span>
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search products..."
                        className="w-full bg-white border border-ink/10 rounded-full pl-9 pr-4 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-chili"
                      />
                    </div>
                    <select
                      value={filterCat}
                      onChange={(e) => setFilterCat(e.target.value)}
                      className="bg-white border border-ink/10 rounded-full px-4 py-2.5 text-sm font-medium text-ink focus:outline-none focus:ring-2 focus:ring-chili"
                    >
                      <option value="All">All Categories</option>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {filtered.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-ink/5 p-12 text-center">
                      <p className="text-3xl mb-2">🍽️</p>
                      <p className="text-ink/60 text-sm">No products found.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {filtered.map((product) => (
                        <div
                          key={product.id}
                          className={`bg-white rounded-2xl border shadow-sm p-3 sm:p-4 flex gap-3 sm:gap-4 items-center transition-all ${
                            editingId === product.id
                              ? "border-chili ring-2 ring-chili/20"
                              : "border-ink/5 hover:border-ink/15"
                          }`}
                        >
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-sm sm:text-base text-ink truncate">
                                {product.title}
                              </h3>
                              <span className="text-[10px] font-semibold bg-cream text-ink/60 px-2 py-0.5 rounded-full shrink-0">
                                {product.category}
                              </span>
                            </div>
                            <p className="text-ink/50 text-xs mt-0.5 line-clamp-1">
                              {product.description}
                            </p>
                            <div className="flex items-center gap-3 mt-1.5">
                              <span className="text-chili font-bold text-sm">
                                Rs. {product.price}
                              </span>
                              <span className="text-turmeric text-xs font-semibold">
                                ★ {product.rating}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-1.5 shrink-0">
                            <button
                              onClick={() => startEdit(product)}
                              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-cream text-ink hover:bg-turmeric/30 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => setConfirmDelete(product.id)}
                              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-pop-in">
            <h3 className="font-display font-bold text-lg text-ink mb-2">
              Delete product?
            </h3>
            <p className="text-ink/60 text-sm mb-5">
              This action cannot be undone. The product will be removed from the menu catalog.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 rounded-full text-sm font-semibold border-2 border-ink/15 text-ink/70 hover:border-ink/30 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 py-2.5 rounded-full text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;