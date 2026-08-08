import { useState, useMemo, useEffect } from "react";
import { supabaseClient } from "../lib/supabaseClient";
import AdminAnalytics from "./AdminAnalytics";
import AdminLogin from "./AdminLogin";

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

function AdminDashboard({ products, onAdd, onUpdate, onDelete, onBack }) {
  // ---- Auth ----
  const [session, setSession] = useState(null);
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setSessionChecked(true);
    });
    const { data: listener } = supabaseClient.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabaseClient.auth.signOut();
  };

  // ---- Tabs ----
  const [tab, setTab] = useState("products"); // "products" | "orders" | "reviews" | "analytics"
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

  // ---- Auth gate ----
  if (!sessionChecked) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-ink/40 text-sm font-medium">Checking session…</p>
      </div>
    );
  }

  if (!session) {
    return <AdminLogin onBack={onBack} />;
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-[200] px-5 py-3 rounded-xl shadow-lg text-sm font-semibold animate-pop-in ${toast.type === "error"
            ? "bg-red-500 text-white"
            : "bg-basil text-white"
            }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-30 bg-charcoal text-cream">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="w-9 h-9 rounded-full bg-charcoal-light flex items-center justify-center hover:bg-chili transition-colors"
              aria-label="Back"
            >
              ←
            </button>
            <div>
              <h1 className="font-display font-extrabold text-lg sm:text-xl tracking-tight">
                Admin <span className="text-chili">Dashboard</span>
              </h1>
              <p className="text-cream/50 text-xs hidden sm:block">
                {session.user?.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 bg-charcoal-light rounded-full p-1">
              <button
                onClick={() => setTab("products")}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${tab === "products" ? "bg-chili text-white" : "text-cream/60 hover:text-cream"
                  }`}
              >
                Products
              </button>
              <button
                onClick={() => setTab("orders")}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${tab === "orders" ? "bg-chili text-white" : "text-cream/60 hover:text-cream"
                  }`}
              >
                Orders
              </button>
              <button
                onClick={() => setTab("reviews")}
                className={`relative px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${tab === "reviews" ? "bg-chili text-white" : "text-cream/60 hover:text-cream"
                  }`}
              >
                Reviews
                {pendingReviewsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-turmeric text-charcoal text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {pendingReviewsCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setTab("analytics")}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${tab === "analytics" ? "bg-chili text-white" : "text-cream/60 hover:text-cream"
                  }`}
              >
                Analytics
              </button>
            </div>
            <button
              onClick={handleSignOut}
              className="text-xs font-semibold bg-charcoal-light hover:bg-chili text-cream/80 hover:text-white px-3 py-1.5 rounded-full transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Tab switcher - mobile */}
        <div className="sm:hidden flex items-center gap-2 px-4 pb-3 -mt-1 overflow-x-auto">
          <button
            onClick={() => setTab("products")}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${tab === "products" ? "bg-chili text-white" : "bg-charcoal-light text-cream/60"
              }`}
          >
            Products
          </button>
          <button
            onClick={() => setTab("orders")}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${tab === "orders" ? "bg-chili text-white" : "bg-charcoal-light text-cream/60"
              }`}
          >
            Orders
          </button>
          <button
            onClick={() => setTab("reviews")}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${tab === "reviews" ? "bg-chili text-white" : "bg-charcoal-light text-cream/60"
              }`}
          >
            Reviews {pendingReviewsCount > 0 && `(${pendingReviewsCount})`}
          </button>
          <button
            onClick={() => setTab("analytics")}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${tab === "analytics" ? "bg-chili text-white" : "bg-charcoal-light text-cream/60"
              }`}
          >
            Analytics
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {tab === "analytics" ? (
          <AdminAnalytics products={products} />
        ) : tab === "orders" ? (
          <div className="flex flex-col gap-3">
            {ordersLoading ? (
              <p className="text-ink/40 text-sm text-center py-12">Loading orders…</p>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-ink/5 p-12 text-center">
                <p className="text-3xl mb-2">🧾</p>
                <p className="text-ink/60 text-sm">
                  No orders yet. They'll show up here as soon as a customer checks out.
                </p>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-ink/5 shadow-sm p-4 sm:p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-display font-bold text-sm sm:text-base text-ink">
                          {order.id}
                        </h3>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${orderStatusStyles[order.status] || "bg-cream text-ink/60"
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
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-colors ${order.status === status
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
        ) : tab === "reviews" ? (
          <div className="flex flex-col gap-3">
            {reviewsLoading ? (
              <p className="text-ink/40 text-sm text-center py-12">Loading reviews…</p>
            ) : reviews.length === 0 ? (
              <div className="bg-white rounded-2xl border border-ink/5 p-12 text-center">
                <p className="text-3xl mb-2">💬</p>
                <p className="text-ink/60 text-sm">No reviews yet.</p>
              </div>
            ) : (
              reviews.map((rev) => {
                const product = products.find((p) => p.id === rev.product_id);
                return (
                  <div
                    key={rev.id}
                    className={`bg-white rounded-2xl border shadow-sm p-4 sm:p-5 ${rev.is_approved ? "border-ink/5" : "border-turmeric"
                      }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm text-ink">
                            {rev.username}
                          </span>
                          <span className="text-turmeric text-xs font-semibold">
                            ★ {rev.rating}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${rev.is_approved
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
        ) : (
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
                      className={`w-full bg-cream rounded-xl px-4 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 ${errors.title ? "ring-2 ring-chili" : "focus:ring-chili"
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
                      className={`w-full bg-cream rounded-xl px-4 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 resize-none ${errors.description ? "ring-2 ring-chili" : "focus:ring-chili"
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
                        className={`w-full bg-cream rounded-xl px-4 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 ${errors.price ? "ring-2 ring-chili" : "focus:ring-chili"
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
                        className={`w-full bg-cream rounded-xl px-4 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 ${errors.rating ? "ring-2 ring-chili" : "focus:ring-chili"
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
                      className={`w-full bg-cream rounded-xl px-4 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 ${errors.image ? "ring-2 ring-chili" : "focus:ring-chili"
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
                      className="flex-1 bg-chili hover:bg-chili-dark disabled:opacity-60 transition-colors text-white font-semibold py-2.5 rounded-full text-sm"
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
                        className={`bg-white rounded-2xl border shadow-sm p-3 sm:p-4 flex gap-3 sm:gap-4 items-center transition-all ${editingId === product.id
                          ? "border-chili ring-2 ring-chili/20"
                          : "border-ink/5"
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
      </div>

      {/* Delete confirm modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-pop-in">
            <h3 className="font-display font-bold text-lg text-ink mb-2">
              Delete product?
            </h3>
            <p className="text-ink/60 text-sm mb-5">
              This action cannot be undone. The product will be removed from the
              menu.
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