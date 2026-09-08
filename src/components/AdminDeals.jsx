import { useState, useMemo } from "react";
import {
  Flame,
  Plus,
  Search,
  SlidersHorizontal,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Tag,
  Star,
  Eye,
  AlertTriangle,
  X,
  Check,
  Calendar,
  Layers,
  Percent,
  TrendingDown,
  Gift,
} from "lucide-react";

const CATEGORIES = ["Solo Combos", "Sharing & Family", "Flash Deals", "Budget Bites"];

const BADGES = [
  "🔥 POPULAR PICK",
  "👑 BEST VALUE",
  "⚡ FAST SELLER",
  "🌙 MIDNIGHT SPECIAL",
  "🎉 MEGA FEAST",
  "🎓 STUDENT PICK",
  "⭐ CHEF'S CHOICE",
  "🍕 PIZZA LOVERS",
  "🔥 SPICY HIT",
];

const emptyDealForm = {
  id: null,
  title: "",
  tagline: "",
  description: "",
  detailedDescription: "",
  image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
  category: "Solo Combos",
  price: "",
  originalPrice: "",
  discountPercent: "",
  startDate: new Date().toISOString().slice(0, 10),
  expiryDate: "",
  badge: "🔥 POPULAR PICK",
  isFeatured: false,
  isLimitedTime: false,
  isActive: true,
  items: [""],
  selectedProductIds: [],
};

export default function AdminDeals({
  deals = [],
  products = [],
  onSaveDeal,
  onDeleteDeal,
  onToggleActive,
}) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All"); // "All" | "active" | "expired" | "inactive"
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState(emptyDealForm);
  const [customItemInput, setCustomItemInput] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [previewDeal, setPreviewDeal] = useState(null);

  // Statistics
  const stats = useMemo(() => {
    const total = deals.length;
    const active = deals.filter((d) => d.status === "active").length;
    const expired = deals.filter((d) => d.status === "expired").length;
    const inactive = deals.filter((d) => d.status === "inactive").length;
    const featured = deals.filter((d) => d.isFeatured).length;
    return { total, active, expired, inactive, featured };
  }, [deals]);

  // Filtered deals
  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      const matchCat =
        selectedCategory === "All" || deal.category === selectedCategory;
      const matchStatus =
        selectedStatus === "All" ||
        (selectedStatus === "active" && deal.status === "active") ||
        (selectedStatus === "expired" && deal.status === "expired") ||
        (selectedStatus === "inactive" && deal.status === "inactive");
      const matchSearch =
        !search.trim() ||
        deal.title.toLowerCase().includes(search.trim().toLowerCase()) ||
        deal.description.toLowerCase().includes(search.trim().toLowerCase()) ||
        deal.items.some((i) => i.toLowerCase().includes(search.trim().toLowerCase()));

      return matchCat && matchStatus && matchSearch;
    });
  }, [deals, selectedCategory, selectedStatus, search]);

  const handleOpenCreate = () => {
    setFormData({
      ...emptyDealForm,
      startDate: new Date().toISOString().slice(0, 10),
    });
    setCustomItemInput("");
    setModalOpen(true);
  };

  const handleOpenEdit = (deal) => {
    setFormData({
      id: deal.id,
      title: deal.title,
      tagline: deal.tagline || "",
      description: deal.description || "",
      detailedDescription: deal.detailedDescription || "",
      image: deal.image || "",
      category: deal.category || "Solo Combos",
      price: deal.price || "",
      originalPrice: deal.originalPrice || deal.price || "",
      discountPercent: deal.discountPercent || "",
      startDate: deal.startDate || "",
      expiryDate: deal.expiryDate || "",
      badge: deal.badge || "🔥 POPULAR PICK",
      isFeatured: Boolean(deal.isFeatured),
      isLimitedTime: Boolean(deal.isLimitedTime),
      isActive: deal.isActive !== undefined ? Boolean(deal.isActive) : true,
      items: deal.items && deal.items.length > 0 ? deal.items : [""],
      selectedProductIds: deal.productIds || [],
    });
    setCustomItemInput("");
    setModalOpen(true);
  };

  // Toggle included product from catalog & auto-calculate original price
  const handleToggleProduct = (product) => {
    const isSelected = formData.selectedProductIds.includes(product.id);
    let nextIds;
    let nextItems = [...formData.items].filter(Boolean);

    if (isSelected) {
      nextIds = formData.selectedProductIds.filter((id) => id !== product.id);
      nextItems = nextItems.filter((line) => !line.includes(product.title));
    } else {
      nextIds = [...formData.selectedProductIds, product.id];
      nextItems = [...nextItems, `1x ${product.title}`];
    }

    // Calculate sum of selected products
    const selectedProductsList = products.filter((p) => nextIds.includes(p.id));
    const autoOriginalPrice = selectedProductsList.reduce((sum, p) => sum + Number(p.price || 0), 0);

    setFormData((prev) => {
      const origPrice = autoOriginalPrice > 0 ? autoOriginalPrice : prev.originalPrice;
      const numPrice = Number(prev.price) || 0;
      const calcDiscount =
        origPrice > numPrice && origPrice > 0
          ? Math.round(((origPrice - numPrice) / origPrice) * 100)
          : prev.discountPercent;

      return {
        ...prev,
        selectedProductIds: nextIds,
        items: nextItems.length > 0 ? nextItems : [""],
        originalPrice: origPrice || prev.originalPrice,
        discountPercent: calcDiscount || prev.discountPercent,
      };
    });
  };

  const handleAddCustomItem = () => {
    if (!customItemInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items.filter(Boolean), customItemInput.trim()],
    }));
    setCustomItemInput("");
  };

  const handleRemoveItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, idx) => idx !== index),
    }));
  };

  const handlePriceChange = (field, val) => {
    const num = val === "" ? "" : Number(val);
    setFormData((prev) => {
      const next = { ...prev, [field]: num };
      const orig = field === "originalPrice" ? num : Number(prev.originalPrice) || 0;
      const prc = field === "price" ? num : Number(prev.price) || 0;
      if (orig > 0 && prc > 0 && orig >= prc) {
        next.discountPercent = Math.round(((orig - prc) / orig) * 100);
      }
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Please enter a deal title.");
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      alert("Please enter a valid deal price.");
      return;
    }

    const payload = {
      ...formData,
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice || formData.price),
      discountPercent: Number(formData.discountPercent || 0),
      items: formData.items.filter(Boolean),
    };

    onSaveDeal(payload);
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Main Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-ink tracking-tight flex items-center gap-2">
            <Flame className="w-6 h-6 text-chili" />
            Deals &amp; Combos Management
          </h2>
          <p className="text-ink/60 text-xs sm:text-sm font-medium mt-0.5">
            Configure meal bundles, set discount prices, schedule expiry dates, and manage POS &amp; storefront deals.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 bg-chili hover:bg-chili-dark active:scale-95 text-white font-extrabold px-5 py-2.5 rounded-2xl text-xs sm:text-sm shadow-md shadow-chili/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Create New Deal</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 border border-ink/5 shadow-sm">
          <p className="text-[11px] font-bold text-ink/40 uppercase tracking-wider">Total Deals</p>
          <p className="font-display font-black text-2xl text-ink mt-1">{stats.total}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-basil/20 shadow-sm bg-gradient-to-br from-white to-basil/5">
          <p className="text-[11px] font-bold text-basil uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Active in Store &amp; POS
          </p>
          <p className="font-display font-black text-2xl text-basil mt-1">{stats.active}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-red-200 shadow-sm bg-gradient-to-br from-white to-red-50/50">
          <p className="text-[11px] font-bold text-red-600 uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Expired Deals
          </p>
          <p className="font-display font-black text-2xl text-red-600 mt-1">{stats.expired}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-turmeric/20 shadow-sm bg-gradient-to-br from-white to-turmeric/5">
          <p className="text-[11px] font-bold text-charcoal uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-turmeric" /> Featured Specials
          </p>
          <p className="font-display font-black text-2xl text-charcoal mt-1">{stats.featured}</p>
        </div>
      </div>

      {/* Filters & Controls */}
      <div className="bg-white rounded-2xl p-4 border border-ink/5 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto scroll-thin pb-1 md:pb-0">
            {[
              { id: "All", label: "All Deals", count: stats.total },
              { id: "active", label: "Active", count: stats.active },
              { id: "expired", label: "Expired", count: stats.expired },
              { id: "inactive", label: "Disabled", count: stats.inactive },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  selectedStatus === tab.id
                    ? "bg-charcoal text-white shadow-sm"
                    : "bg-cream text-ink/60 hover:text-ink"
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] opacity-70">({tab.count})</span>
              </button>
            ))}
          </div>

          {/* Search & Category Filter */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink/40 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search deals..."
                className="w-full bg-cream rounded-full pl-8 pr-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-chili border border-ink/5"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-cream text-xs font-bold rounded-full px-3 py-1.5 border border-ink/5 focus:outline-none focus:ring-2 focus:ring-chili"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Deals Grid / Table */}
      {filteredDeals.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-ink/5 shadow-sm">
          <Tag className="w-12 h-12 text-ink/20 mx-auto mb-3" />
          <h3 className="font-display font-bold text-lg text-ink">No deals found</h3>
          <p className="text-xs text-ink/50 mt-1 max-w-sm mx-auto">
            No deals matched your active filters or search criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredDeals.map((deal) => {
            const savings = Math.max(0, (deal.originalPrice || deal.price) - deal.price);
            const isExpired = deal.status === "expired";
            const isInactive = deal.status === "inactive" || !deal.isActive;

            return (
              <div
                key={deal.id}
                className={`bg-white rounded-3xl border overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                  isExpired
                    ? "border-red-200 opacity-80"
                    : isInactive
                    ? "border-ink/10 opacity-60"
                    : deal.isFeatured
                    ? "border-turmeric/40 ring-1 ring-turmeric/20"
                    : "border-ink/5"
                }`}
              >
                <div>
                  {/* Top Image Banner */}
                  <div className="relative h-36 w-full overflow-hidden bg-charcoal">
                    <img
                      src={deal.image}
                      alt={deal.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />

                    {/* Status Pill Top-Left */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      {isExpired ? (
                        <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Clock className="w-3 h-3" /> EXPIRED
                        </span>
                      ) : isInactive ? (
                        <span className="bg-charcoal/80 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> DISABLED
                        </span>
                      ) : (
                        <span className="bg-basil text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> ACTIVE
                        </span>
                      )}

                      {deal.discountPercent > 0 && (
                        <span className="bg-chili text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                          {deal.discountPercent}% OFF
                        </span>
                      )}
                    </div>

                    {/* Featured / Badge Top-Right */}
                    <div className="absolute top-2.5 right-2.5">
                      {deal.badge && (
                        <span className="bg-turmeric text-charcoal text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                          {deal.badge}
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-2 left-3 right-3 text-white">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-turmeric">
                        {deal.category}
                      </span>
                      <h4 className="font-display font-black text-lg text-white leading-tight truncate">
                        {deal.title}
                      </h4>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3">
                    <p className="text-ink/60 text-xs line-clamp-2 font-medium">
                      {deal.description}
                    </p>

                    {/* Items Checklist Preview */}
                    <div className="bg-cream/70 rounded-2xl p-2.5 border border-ink/5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-ink/40 mb-1">
                        Included in Combo:
                      </p>
                      <ul className="space-y-0.5">
                        {deal.items.slice(0, 3).map((item, idx) => (
                          <li
                            key={idx}
                            className="text-xs text-ink/80 font-semibold flex items-center gap-1.5 truncate"
                          >
                            <span className="text-basil text-[10px]">✓</span>
                            <span className="truncate">{item}</span>
                          </li>
                        ))}
                        {deal.items.length > 3 && (
                          <li className="text-[10px] text-chili font-bold pt-0.5">
                            + {deal.items.length - 3} more item(s)
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Schedule / Validity Date info */}
                    <div className="flex items-center justify-between text-[11px] text-ink/60 font-medium pt-1 border-t border-ink/5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-ink/40" />
                        {deal.expiryDate ? `Expires: ${deal.expiryDate}` : "No expiry date"}
                      </span>
                      <span className="font-bold text-ink/40">ID: #{deal.id}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Controls & Price */}
                <div className="p-4 bg-cream/30 border-t border-ink/5 flex items-center justify-between gap-2">
                  <div>
                    {deal.originalPrice > deal.price && (
                      <span className="text-ink/35 text-[11px] line-through block font-bold">
                        Rs. {deal.originalPrice}
                      </span>
                    )}
                    <span className="text-chili text-xl font-black font-display leading-none">
                      Rs. {deal.price}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Quick Active Toggle */}
                    <button
                      onClick={() => onToggleActive(deal.id, !deal.isActive)}
                      title={deal.isActive ? "Deactivate deal" : "Activate deal"}
                      className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                        deal.isActive
                          ? "bg-basil/10 border-basil/20 text-basil hover:bg-basil hover:text-white"
                          : "bg-ink/5 border-ink/10 text-ink/40 hover:bg-ink/10"
                      }`}
                    >
                      {deal.isActive ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => handleOpenEdit(deal)}
                      className="p-2 bg-charcoal hover:bg-chili text-white rounded-xl transition-all shadow-sm"
                      title="Edit Deal"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => setDeleteConfirmId(deal.id)}
                      className="p-2 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-xl transition-all border border-red-200"
                      title="Delete Deal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* CREATE / EDIT DEAL MODAL */}
      {/* ========================================================================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92dvh] flex flex-col shadow-2xl overflow-hidden animate-pop-in">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-ink/10 flex items-center justify-between bg-cream/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-chili text-white flex items-center justify-center shadow-md">
                  <Flame className="w-4 h-4" />
                </div>
                <h3 className="font-display font-black text-xl text-ink">
                  {formData.id ? "Edit Deal & Combo" : "Create New Deal"}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-cream text-ink flex items-center justify-center hover:bg-chili hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto scroll-thin space-y-4 flex-1">
              {/* Title & Tagline */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-ink/70 mb-1">
                    Deal Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Burger & Chill Combo"
                    className="w-full bg-cream rounded-xl px-3.5 py-2 text-xs font-semibold border border-ink/10 focus:ring-2 focus:ring-chili focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink/70 mb-1">
                    Tagline (Subtitle)
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    placeholder="e.g. Best for 1-2 People"
                    className="w-full bg-cream rounded-xl px-3.5 py-2 text-xs font-semibold border border-ink/10 focus:ring-2 focus:ring-chili focus:outline-none"
                  />
                </div>
              </div>

              {/* Category & Badge */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-ink/70 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-cream rounded-xl px-3.5 py-2 text-xs font-semibold border border-ink/10 focus:ring-2 focus:ring-chili focus:outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink/70 mb-1">
                    Promotional Badge
                  </label>
                  <select
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full bg-cream rounded-xl px-3.5 py-2 text-xs font-semibold border border-ink/10 focus:ring-2 focus:ring-chili focus:outline-none"
                  >
                    {BADGES.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-ink/70 mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Appealing short overview of this combo deal..."
                  className="w-full bg-cream rounded-xl px-3.5 py-2 text-xs font-semibold border border-ink/10 focus:ring-2 focus:ring-chili focus:outline-none"
                />
              </div>

              {/* Image URL & Preview */}
              <div>
                <label className="block text-xs font-bold text-ink/70 mb-1">
                  Deal Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 bg-cream rounded-xl px-3.5 py-2 text-xs font-semibold border border-ink/10 focus:ring-2 focus:ring-chili focus:outline-none"
                  />
                  {formData.image && (
                    <div className="w-10 h-10 rounded-xl overflow-hidden border shrink-0 bg-charcoal">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80";
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Product Bundling Selector from live Menu */}
              <div className="bg-cream/60 rounded-2xl p-3.5 border border-ink/5 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-ink/70 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-chili" />
                    Quick Bundle Products from Menu
                  </label>
                  <span className="text-[10px] text-ink/40 font-semibold">
                    (Auto-adds items &amp; computes original cost)
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto scroll-thin p-1 bg-white rounded-xl border border-ink/5">
                  {products.map((p) => {
                    const isSelected = formData.selectedProductIds?.includes(p.id);
                    return (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() => handleToggleProduct(p)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                          isSelected
                            ? "bg-chili text-white border-chili shadow-sm"
                            : "bg-cream/80 text-ink/80 border-ink/5 hover:bg-cream"
                        }`}
                      >
                        <span>{isSelected ? "✓" : "+"}</span>
                        <span>{p.title}</span>
                        <span className="opacity-70">(Rs. {p.price})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Included Items Checklist & Custom Line Items */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-ink/70">
                  Included Items in Deal ({formData.items.filter(Boolean).length})
                </label>
                <div className="space-y-1.5 max-h-32 overflow-y-auto scroll-thin">
                  {formData.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-basil font-bold text-xs">✓</span>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const next = [...formData.items];
                          next[idx] = e.target.value;
                          setFormData({ ...formData, items: next });
                        }}
                        placeholder="e.g. 1x Soft Drink (500ml)"
                        className="flex-1 bg-cream rounded-xl px-3 py-1.5 text-xs font-semibold border border-ink/10 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-red-500 hover:text-red-700 text-xs px-2 py-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={customItemInput}
                    onChange={(e) => setCustomItemInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCustomItem();
                      }
                    }}
                    placeholder="Add item (e.g. 1x Garlic Dip Cup)..."
                    className="flex-1 bg-cream rounded-xl px-3 py-1.5 text-xs font-semibold border border-ink/10 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomItem}
                    className="bg-charcoal text-white text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-chili transition-colors"
                  >
                    + Add Item
                  </button>
                </div>
              </div>

              {/* Pricing & Discounts */}
              <div className="grid sm:grid-cols-3 gap-3 bg-cream/40 p-3 rounded-2xl border border-ink/5">
                <div>
                  <label className="block text-xs font-bold text-ink/70 mb-1">
                    Original Total (Rs.)
                  </label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => handlePriceChange("originalPrice", e.target.value)}
                    placeholder="e.g. 1200"
                    className="w-full bg-white rounded-xl px-3.5 py-2 text-xs font-semibold border border-ink/10 focus:ring-2 focus:ring-chili focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-chili mb-1">
                    Deal Discounted Price *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => handlePriceChange("price", e.target.value)}
                    placeholder="e.g. 899"
                    className="w-full bg-white rounded-xl px-3.5 py-2 text-xs font-bold text-chili border border-chili/30 focus:ring-2 focus:ring-chili focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-basil mb-1">
                    Discount %
                  </label>
                  <input
                    type="number"
                    value={formData.discountPercent}
                    onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
                    placeholder="e.g. 25"
                    className="w-full bg-white rounded-xl px-3.5 py-2 text-xs font-bold text-basil border border-basil/20 focus:outline-none"
                  />
                </div>
              </div>

              {/* Schedule Dates & Expiry */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-ink/70 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full bg-cream rounded-xl px-3.5 py-2 text-xs font-semibold border border-ink/10 focus:outline-none"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-ink/70">
                      Expiry Date
                    </label>
                    {formData.expiryDate && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, expiryDate: "" })}
                        className="text-[10px] text-chili font-bold"
                      >
                        Clear Expiry
                      </button>
                    )}
                  </div>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full bg-cream rounded-xl px-3.5 py-2 text-xs font-semibold border border-ink/10 focus:outline-none"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-ink/5 text-xs font-bold text-ink/80">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-chili rounded accent-chili"
                  />
                  <span>Deal is Active</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 text-turmeric rounded accent-turmeric"
                  />
                  <span>Featured on Top</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.isLimitedTime}
                    onChange={(e) => setFormData({ ...formData, isLimitedTime: e.target.checked })}
                    className="w-4 h-4 text-chili rounded accent-chili"
                  />
                  <span>Limited Time Offer</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-ink/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2 rounded-full text-xs font-bold text-ink/70 hover:text-ink hover:bg-cream transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-chili hover:bg-chili-dark text-white font-extrabold px-6 py-2.5 rounded-full text-xs shadow-md shadow-chili/25 transition-all"
                >
                  {formData.id ? "Save Changes" : "Create Deal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4 animate-pop-in">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display font-black text-lg text-ink">Delete this deal?</h4>
              <p className="text-xs text-ink/60 mt-1">
                This will remove the deal from the storefront and POS billing system immediately.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-full text-xs font-bold text-ink/70 hover:bg-cream"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteDeal(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-5 py-2 rounded-full shadow-md"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
