import { useState, useMemo } from "react";
import { useCart } from "../context/CartContext";
import { deals as initialDeals } from "../data/deals";
import {
  Tag,
  Flame,
  Star,
  Clock,
  Plus,
  Check,
  ArrowRight,
  Sparkles,
  Users,
  Copy,
  Percent,
} from "lucide-react";

const OFFER_FILTERS = [
  "All Offers",
  "Burger Deals",
  "Family Deals",
  "Combo Meals",
  "Weekend Offers",
];

function OffersPage({ onExploreMenu, onNavigate }) {
  const { handleAddToCart, cart } = useCart();
  const [selectedFilter, setSelectedFilter] = useState("All Offers");
  const [copiedVoucher, setCopiedVoucher] = useState(false);
  const [addedId, setAddedId] = useState(null);

  const handleCopyCode = () => {
    navigator.clipboard.writeText("CRISPY20");
    setCopiedVoucher(true);
    setTimeout(() => setCopiedVoucher(false), 2000);
  };

  const onAddDeal = (dealId) => {
    handleAddToCart(dealId);
    setAddedId(dealId);
    setTimeout(() => setAddedId(null), 1000);
  };

  const filteredDeals = useMemo(() => {
    if (selectedFilter === "All Offers") return initialDeals;
    if (selectedFilter === "Burger Deals") {
      return initialDeals.filter(
        (d) =>
          d.title.toLowerCase().includes("burger") ||
          d.category.toLowerCase().includes("solo")
      );
    }
    if (selectedFilter === "Family Deals") {
      return initialDeals.filter(
        (d) =>
          d.category.toLowerCase().includes("family") ||
          d.title.toLowerCase().includes("pack") ||
          d.title.toLowerCase().includes("family")
      );
    }
    if (selectedFilter === "Combo Meals") {
      return initialDeals.filter(
        (d) =>
          d.title.toLowerCase().includes("combo") ||
          d.title.toLowerCase().includes("trio")
      );
    }
    if (selectedFilter === "Weekend Offers") {
      return initialDeals.filter(
        (d) => d.isLimitedTime || d.validity.toLowerCase().includes("sunday")
      );
    }
    return initialDeals;
  }, [selectedFilter]);

  return (
    <main className="min-h-screen bg-[#FFF3DC] text-[#3A2418] bg-rustic-pattern pb-24">
      {/* 1. Hero Header Banner */}
      <section className="bg-[#3A2418] text-[#FFF3DC] pt-12 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b-2 border-[#C65D21]/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C65D21]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#E6A93A]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-screen-2xl mx-auto relative z-10 text-center max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-[#FFFAF0]/10 border border-[#FFF3DC]/20 px-4 py-1.5 rounded-full mb-4">
            <Tag className="w-4 h-4 text-[#E6A93A]" />
            <span className="text-xs font-black uppercase tracking-widest text-[#E6A93A]">
              Exclusive Handcrafted Savings
            </span>
          </div>

          <h1 className="font-display font-black text-4xl sm:text-6xl text-[#FFFAF0] tracking-tight leading-tight mb-4">
            Special Offers & Combos
          </h1>

          <p className="text-[#FFF3DC]/80 text-base sm:text-lg font-medium leading-relaxed">
            Feast for less. From single smash combos to full family street platters, every deal is
            bundled with extra love and secret house dips.
          </p>
        </div>
      </section>

      {/* 2. Promo Voucher Banner */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-[#C65D21] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#E6A93A]/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="bg-[#E6A93A] text-[#3A2418] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-2 shadow-sm">
              Limited First Order Deal
            </span>
            <h3 className="font-display font-black text-2xl sm:text-3xl">
              Get 20% Off Your Entire Feast
            </h3>
            <p className="text-[#FFF3DC]/90 text-xs sm:text-sm mt-1 max-w-lg font-medium">
              Use promo code during checkout on your first order. Valid across all menu items!
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleCopyCode}
              className="bg-[#FFFAF0] text-[#3A2418] border-2 border-dashed border-[#E6A93A] px-5 py-3 rounded-2xl font-mono font-black text-lg tracking-widest flex items-center gap-2.5 cursor-pointer shadow-md active:scale-95 transition-all"
            >
              <span>CRISPY20</span>
              <span className="text-[10px] font-sans font-extrabold bg-[#E6A93A] text-[#3A2418] px-2 py-0.5 rounded uppercase">
                {copiedVoucher ? "COPIED! ✓" : "COPY CODE"}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. Filter Navigation Pills */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          {OFFER_FILTERS.map((f) => {
            const isActive = selectedFilter === f;
            return (
              <button
                key={f}
                onClick={() => setSelectedFilter(f)}
                className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-200 cursor-pointer shadow-sm ${
                  isActive
                    ? "bg-[#C65D21] text-white shadow-[#C65D21]/30 scale-105"
                    : "bg-[#FFFAF0] text-[#3A2418] hover:bg-[#FFF3DC] border border-[#3A2418]/10"
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Deals Grid */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredDeals.map((deal) => {
            const inCart = (cart[deal.id] || 0) > 0;
            const isJustAdded = addedId === deal.id;

            return (
              <div
                key={deal.id}
                className="bg-[#FFFAF0] rounded-3xl overflow-hidden border border-[#3A2418]/10 shadow-[0_4px_20px_-4px_rgba(58,36,24,0.06)] hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image & Discount Badge */}
                <div className="relative h-56 w-full overflow-hidden bg-[#FFF3DC]">
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3A2418]/80 via-transparent to-transparent" />

                  {/* Discount Stamp in Mustard Yellow */}
                  <span className="absolute top-3 left-3 bg-[#E6A93A] text-[#3A2418] text-xs font-black px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                    SAVE {deal.discountPercent}%
                  </span>

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 bg-[#FFFAF0]/95 px-2.5 py-1 rounded-full text-xs font-black text-[#3A2418] flex items-center gap-1 shadow-md">
                    <Star className="w-3.5 h-3.5 fill-[#E6A93A] text-[#E6A93A]" />
                    <span>{deal.rating}</span>
                  </div>

                  {/* Tagline */}
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className="text-[11px] font-bold text-[#FFF3DC]/90 uppercase tracking-wider">
                      {deal.tagline}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-display font-black text-xl text-[#3A2418] leading-tight">
                      {deal.title}
                    </h3>

                    <p className="text-xs text-[#3A2418]/70 mt-2 line-clamp-2 leading-relaxed font-medium">
                      {deal.description}
                    </p>

                    {/* Included Items Checklist */}
                    <div className="mt-4 pt-3 border-t border-[#3A2418]/10">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#3A2418]/50 mb-2">
                        Bundle Includes:
                      </p>
                      <ul className="space-y-1 text-xs text-[#3A2418]/80 font-semibold">
                        {deal.items.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <span className="text-[#C65D21] font-bold">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#3A2418]/10">
                    <div>
                      <span className="text-xs line-through text-[#3A2418]/40 font-bold block">
                        Rs. {deal.originalPrice}
                      </span>
                      <span className="font-display font-black text-2xl text-[#C65D21]">
                        Rs. {deal.price}
                      </span>
                    </div>

                    <button
                      onClick={() => onAddDeal(deal.id)}
                      className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer ${
                        isJustAdded || inCart
                          ? "bg-[#66734A] text-white shadow-[#66734A]/30"
                          : "bg-[#C65D21] hover:bg-[#A94B16] text-white shadow-[#C65D21]/25 hover:shadow-[#C65D21]/40"
                      }`}
                    >
                      {isJustAdded || inCart ? (
                        <>
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>{isJustAdded ? "Added!" : "In Cart"}</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 stroke-[3]" />
                          <span>Claim Deal</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

export default OffersPage;
