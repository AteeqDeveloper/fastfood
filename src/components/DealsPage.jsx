import { useState, useMemo, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { deals as initialDeals } from "../data/deals";
import DealDetailModal from "./DealDetailModal";
import QuantityStepper from "./QuantityStepper";
import {
  Flame,
  Clock,
  Sparkles,
  Tag,
  Search,
  SlidersHorizontal,
  Plus,
  Eye,
  Check,
  Copy,
  Gift,
  Zap,
  Star,
  ShieldCheck,
  Percent,
  CheckCircle2,
  UtensilsCrossed,
  ArrowRight,
  TrendingDown,
} from "lucide-react";

const CATEGORY_TABS = [
  { id: "All", label: "All Deals", icon: "✨" },
  { id: "Solo Combos", label: "Solo Combos", icon: "🍔" },
  { id: "Sharing & Family", label: "Sharing & Family", icon: "🍕" },
  { id: "Flash Deals", label: "Flash Deals", icon: "⚡" },
  { id: "Budget Bites", label: "Budget Bites (Under Rs. 1000)", icon: "🏷️" },
];

function DealsPage({ deals = initialDeals, onExploreMenu }) {
  const { cart, handleAddToCart, updateQty } = useCart();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recommended");
  const [selectedDealForModal, setSelectedDealForModal] = useState(null);
  const [voucherCopied, setVoucherCopied] = useState(false);

  const sourceDeals = useMemo(() => {
    return deals && deals.length > 0 ? deals : initialDeals;
  }, [deals]);

  // Live countdown timer for the daily flash deal
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 42, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyVoucher = (code) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setVoucherCopied(true);
      setTimeout(() => setVoucherCopied(false), 2500);
    }
  };

  // Filter and sort deals
  const filteredDeals = useMemo(() => {
    let result = sourceDeals.filter((deal) => {
      // Hide disabled / inactive deals for customer
      if (deal.isActive === false || deal.status === "inactive") return false;

      // Category filter
      let categoryMatch = true;
      if (selectedCategory === "Budget Bites") {
        categoryMatch = deal.price <= 1000 || deal.category === "Budget Bites";
      } else if (selectedCategory !== "All") {
        categoryMatch = deal.category === selectedCategory;
      }

      // Search filter
      const q = searchQuery.trim().toLowerCase();
      const searchMatch =
        !q ||
        deal.title.toLowerCase().includes(q) ||
        deal.description?.toLowerCase().includes(q) ||
        deal.category?.toLowerCase().includes(q) ||
        (deal.items && deal.items.some((item) => item.toLowerCase().includes(q)));

      return categoryMatch && searchMatch;
    });

    // Sorting
    if (sortBy === "discount-high") {
      result = [...result].sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
    } else if (sortBy === "price-low") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating-high") {
      result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [sourceDeals, selectedCategory, searchQuery, sortBy]);

  // Featured deal for showcase banner
  const featuredDeal = initialDeals.find((d) => d.id === 9002) || initialDeals[0];

  return (
    <main className="flex-1 min-w-0 bg-cream pb-20">
      {/* ========================================================================= */}
      {/* HERO SECTION WITH AMBIENT LIGHTING & FLASH VOUCHER */}
      {/* ========================================================================= */}
      <section className="relative bg-charcoal text-cream overflow-hidden pt-10 pb-16 sm:pt-14 sm:pb-20 border-b border-white/10">
        {/* Glow Ambient Orbs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-chili/25 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-turmeric/15 rounded-full blur-[90px] pointer-events-none" />

        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12">
            {/* Left Headline */}
            <div className="max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 px-4 py-1.5 rounded-full mb-4">
                <Flame className="w-4 h-4 text-chili animate-pulse" />
                <span className="text-cream text-xs font-black uppercase tracking-widest">
                  Exclusive Savings &amp; Combos
                </span>
              </div>

              <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.08] mb-4">
                Massive Flavor, <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-turmeric via-chili to-orange-400">
                  Unbeatable Steals.
                </span>
              </h1>

              <p className="text-cream/70 text-sm sm:text-base lg:text-lg font-medium leading-relaxed mb-6 max-w-xl">
                Bundled meals, family feast boxes, and late-night flash discounts crafted to save you up to 35% on Karachi's favorite grill.
              </p>

              {/* Quick Perks Strip */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-cream/80 font-bold">
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                  <Percent className="w-3.5 h-3.5 text-turmeric" />
                  <span>Up to 30% Off Regular Price</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                  <Clock className="w-3.5 h-3.5 text-chili" />
                  <span>Freshly Made to Order</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5 text-basil" />
                  <span>100% Halal Ingredients</span>
                </div>
              </div>
            </div>

            {/* Right: Live Flash Voucher Widget */}
            <div className="w-full sm:w-auto min-w-[300px] sm:min-w-[360px] bg-charcoal-light/90 border border-white/15 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-md relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-chili/20 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider bg-chili text-white px-2.5 py-1 rounded-full shadow-md">
                  <Zap className="w-3 h-3 fill-white" />
                  Today's Flash Voucher
                </span>
                <span className="text-[11px] font-extrabold text-turmeric flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
                </span>
              </div>

              <h3 className="font-display font-black text-xl sm:text-2xl text-white mb-1">
                Save Extra Rs. 200
              </h3>
              <p className="text-cream/60 text-xs font-medium mb-4">
                Use code at checkout on any combo or meal order above Rs. 999.
              </p>

              {/* Copyable code box */}
              <div className="flex items-center justify-between bg-black/40 border border-white/20 rounded-2xl p-2.5 sm:p-3">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-turmeric" />
                  <span className="font-mono font-black text-base sm:text-lg text-turmeric tracking-wider select-all">
                    CRISPY200
                  </span>
                </div>
                <button
                  onClick={() => handleCopyVoucher("CRISPY200")}
                  className={`flex items-center gap-1.5 text-xs font-black px-3.5 py-2 rounded-xl transition-all ${
                    voucherCopied
                      ? "bg-basil text-white shadow-md"
                      : "bg-white/10 hover:bg-white/20 text-cream active:scale-95"
                  }`}
                  aria-label="Copy voucher code"
                >
                  {voucherCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FILTER, SEARCH & SORT CONTROLS BAR */}
      {/* ========================================================================= */}
      <section className="sticky top-[61px] z-30 bg-cream/95 backdrop-blur-md border-b border-ink/10 py-4 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto scroll-thin pb-1 md:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
            {CATEGORY_TABS.map((tab) => {
              const isActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                    isActive
                      ? "bg-chili text-white shadow-md shadow-chili/25 scale-[1.02]"
                      : "bg-white text-ink/70 hover:text-ink hover:bg-white/80 border border-ink/5"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search & Sort Container */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink/40 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search deals..."
                className="w-full bg-white text-ink placeholder:text-ink/40 rounded-full pl-8 pr-3 py-2 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-chili border border-ink/10 shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Select */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white text-ink text-xs sm:text-sm font-bold rounded-full pl-3.5 pr-8 py-2 border border-ink/10 focus:outline-none focus:ring-2 focus:ring-chili shadow-sm cursor-pointer"
              >
                <option value="recommended">Featured Deals</option>
                <option value="discount-high">Highest Discount %</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating-high">Top Rated ⭐</option>
              </select>
              <SlidersHorizontal className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* DEALS LISTING SECTION */}
      {/* ========================================================================= */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header summary info */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-ink tracking-tight">
              {selectedCategory === "All" ? "All Active Deals" : selectedCategory}
            </h2>
            <span className="bg-turmeric/20 text-charcoal text-xs font-black px-2.5 py-0.5 rounded-full">
              {filteredDeals.length} Available
            </span>
          </div>

          {(selectedCategory !== "All" || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="text-xs font-bold text-chili hover:text-chili-dark transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Empty State if no deals match */}
        {filteredDeals.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-ink/5 shadow-sm max-w-lg mx-auto my-12">
            <div className="w-16 h-16 rounded-full bg-chili/10 text-chili flex items-center justify-center mx-auto mb-4">
              <Tag className="w-8 h-8" />
            </div>
            <h3 className="font-display font-black text-xl text-ink mb-2">
              No matching deals found
            </h3>
            <p className="text-ink/60 text-sm font-medium mb-6">
              We couldn't find any deals matching "{searchQuery}". Try selecting a different category or clearing search.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="bg-chili hover:bg-chili-dark text-white text-xs font-extrabold px-6 py-3 rounded-full transition-all shadow-md shadow-chili/25"
            >
              Show All Deals
            </button>
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredDeals.map((deal) => {
              const quantity = cart[deal.id] || 0;
              const originalPrice = deal.originalPrice || deal.price;
              const savings = Math.max(0, originalPrice - deal.price);
              const discountPercent =
                deal.discountPercent ||
                (originalPrice > deal.price
                  ? Math.round(((originalPrice - deal.price) / originalPrice) * 100)
                  : 0);

              return (
                <div
                  key={deal.id}
                  className={`group bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 overflow-hidden flex flex-col justify-between border ${
                    deal.isFeatured
                      ? "border-chili/30 ring-1 ring-chili/20"
                      : "border-ink/5"
                  }`}
                >
                  {/* Card Image Area */}
                  <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-charcoal">
                    <img
                      src={deal.image}
                      alt={deal.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out cursor-pointer"
                      onClick={() => setSelectedDealForModal(deal)}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 z-10">
                      {discountPercent > 0 && (
                        <span className="bg-chili text-white text-xs font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          {discountPercent}% OFF
                        </span>
                      )}
                      {deal.badge && (
                        <span className="bg-turmeric text-charcoal text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md inline-block">
                          {deal.badge}
                        </span>
                      )}
                    </div>

                    {/* Expiry Pill */}
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white z-10">
                      <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-bold border border-white/10">
                        <Clock className="w-3 h-3 text-turmeric" />
                        <span>{deal.validity || "Daily Offer"}</span>
                      </div>
                      {deal.rating && (
                        <span className="bg-black/60 backdrop-blur-md text-turmeric text-[11px] font-black px-2 py-1 rounded-lg border border-white/10 flex items-center gap-1">
                          ★ {deal.rating}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
                    <div>
                      {/* Title & Tagline */}
                      <div className="mb-2">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-chili bg-chili/10 px-2 py-0.5 rounded-full inline-block mb-1.5">
                          {deal.category}
                        </span>
                        <h3
                          onClick={() => setSelectedDealForModal(deal)}
                          className="font-display font-extrabold text-xl text-ink leading-tight group-hover:text-chili transition-colors cursor-pointer"
                        >
                          {deal.title}
                        </h3>
                        {deal.tagline && (
                          <p className="text-ink/45 text-xs font-semibold mt-0.5">
                            {deal.tagline}
                          </p>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-ink/60 text-xs sm:text-sm mb-4 leading-relaxed font-medium line-clamp-2">
                        {deal.description}
                      </p>

                      {/* Items Preview Chips */}
                      {deal.items && deal.items.length > 0 && (
                        <div className="bg-cream/60 rounded-2xl p-3 border border-ink/5 mb-5">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-ink/40 mb-1.5">
                            Combo Includes:
                          </p>
                          <ul className="space-y-1">
                            {deal.items.slice(0, 3).map((item, idx) => (
                              <li
                                key={idx}
                                className="text-xs text-ink/80 font-semibold flex items-center gap-1.5 truncate"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-basil shrink-0" />
                                <span className="truncate">{item}</span>
                              </li>
                            ))}
                            {deal.items.length > 3 && (
                              <li className="text-[11px] text-chili font-extrabold pt-0.5">
                                + {deal.items.length - 3} more items included
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Price & Action Buttons */}
                    <div className="pt-4 border-t border-ink/5">
                      <div className="flex items-baseline justify-between mb-3.5">
                        <div>
                          {originalPrice > deal.price && (
                            <span className="text-ink/35 text-xs line-through block font-bold">
                              Rs. {originalPrice}
                            </span>
                          )}
                          <span className="text-chili text-2xl font-black font-display tracking-tight">
                            Rs. {deal.price}
                          </span>
                        </div>
                        {savings > 0 && (
                          <span className="bg-basil/15 text-basil text-[11px] font-black px-2.5 py-1 rounded-full">
                            Save Rs. {savings}
                          </span>
                        )}
                      </div>

                      {/* Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedDealForModal(deal)}
                          className="flex-1 bg-cream hover:bg-cream-dark/20 text-ink/80 hover:text-ink font-bold text-xs py-2.5 px-3 rounded-full border border-ink/10 transition-all flex items-center justify-center gap-1.5 active:scale-95"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details</span>
                        </button>

                        {quantity > 0 ? (
                          <div className="shrink-0 bg-cream p-1 rounded-full border border-chili/20">
                            <QuantityStepper
                              quantity={quantity}
                              onIncrement={() => updateQty(deal.id, 1)}
                              onDecrement={() => updateQty(deal.id, -1)}
                              label={deal.title}
                              size="sm"
                            />
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddToCart(deal.id)}
                            className="flex-1 bg-chili hover:bg-chili-dark active:scale-95 text-white font-extrabold text-xs py-2.5 px-3 rounded-full transition-all shadow-md shadow-chili/20 hover:shadow-chili/35 flex items-center justify-center gap-1.5"
                          >
                            <Plus className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Claim Deal</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* WHY ORDER COMBOS TRUST BANNER */}
      {/* ========================================================================= */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 border border-ink/5 shadow-md">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-black uppercase tracking-widest text-chili bg-chili/10 px-3.5 py-1 rounded-full inline-block mb-2">
              Combo Perks
            </span>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-ink tracking-tight">
              Why our combos hit harder
            </h3>
            <p className="text-ink/60 text-xs sm:text-sm font-medium mt-1">
              Every deal is designed to save you money without compromising on fresh ingredients.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left">
            <div className="bg-cream/40 p-5 rounded-2xl border border-ink/5 flex flex-col items-center sm:items-start">
              <div className="w-10 h-10 rounded-xl bg-chili/10 text-chili flex items-center justify-center mb-3">
                <TrendingDown className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-sm text-ink mb-1">
                Guaranteed Max Savings
              </h4>
              <p className="text-ink/60 text-xs leading-relaxed font-medium">
                Save an average of Rs. 350 to Rs. 1,200 compared to ordering a la carte.
              </p>
            </div>

            <div className="bg-cream/40 p-5 rounded-2xl border border-ink/5 flex flex-col items-center sm:items-start">
              <div className="w-10 h-10 rounded-xl bg-turmeric/15 text-turmeric flex items-center justify-center mb-3">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-sm text-ink mb-1">
                Craft Dips &amp; Sides Included
              </h4>
              <p className="text-ink/60 text-xs leading-relaxed font-medium">
                Every combo comes with complimentary craft dipping sauces and hot sides.
              </p>
            </div>

            <div className="bg-cream/40 p-5 rounded-2xl border border-ink/5 flex flex-col items-center sm:items-start">
              <div className="w-10 h-10 rounded-xl bg-basil/15 text-basil flex items-center justify-center mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-sm text-ink mb-1">
                25-Min Hot Landing
              </h4>
              <p className="text-ink/60 text-xs leading-relaxed font-medium">
                Packed in foil-stamped thermal boxes so burgers and fries land crispy and piping hot.
              </p>
            </div>

            <div className="bg-cream/40 p-5 rounded-2xl border border-ink/5 flex flex-col items-center sm:items-start">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-3">
                <Gift className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-sm text-ink mb-1">
                Customizable Options
              </h4>
              <p className="text-ink/60 text-xs leading-relaxed font-medium">
                Swap drinks or request spice levels in special instructions at checkout.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* DEAL DETAIL MODAL */}
      {/* ========================================================================= */}
      <DealDetailModal
        deal={selectedDealForModal}
        isOpen={!!selectedDealForModal}
        onClose={() => setSelectedDealForModal(null)}
      />
    </main>
  );
}

export default DealsPage;
