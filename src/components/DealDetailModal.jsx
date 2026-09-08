import { useCart } from "../context/CartContext";
import QuantityStepper from "./QuantityStepper";
import {
  X,
  Sparkles,
  Flame,
  Clock,
  CheckCircle2,
  ShieldCheck,
  ShoppingBag,
  Plus,
  Tag,
  Star,
  Zap,
} from "lucide-react";

function DealDetailModal({ deal, isOpen, onClose }) {
  const { cart, handleAddToCart, updateQty } = useCart();

  if (!isOpen || !deal) return null;

  const quantity = cart[deal.id] || 0;
  const originalPrice = deal.originalPrice || deal.price;
  const savings = Math.max(0, originalPrice - deal.price);
  const discountPercent =
    deal.discountPercent ||
    (originalPrice > deal.price
      ? Math.round(((originalPrice - deal.price) / originalPrice) * 100)
      : 0);

  const handleClaim = () => {
    handleAddToCart(deal.id);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-3xl bg-white rounded-3xl sm:rounded-[2rem] overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row max-h-[92dvh] md:max-h-[85dvh] animate-pop-in border border-ink/10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-30 w-9 h-9 rounded-full bg-charcoal/80 text-white flex items-center justify-center hover:bg-chili hover:scale-105 active:scale-95 transition-all shadow-md backdrop-blur-sm"
          aria-label="Close deal modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Deal Visual */}
        <div className="relative w-full md:w-5/12 h-56 sm:h-64 md:h-auto min-h-[220px] bg-charcoal shrink-0 overflow-hidden">
          <img
            src={deal.image}
            alt={deal.title}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/20 to-transparent" />

          {/* Badges Overlay */}
          <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 z-10">
            {deal.badge && (
              <span className="bg-turmeric text-charcoal text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md inline-flex items-center gap-1">
                <Flame className="w-3 h-3 fill-charcoal" />
                {deal.badge}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="bg-chili text-white text-xs font-black px-3 py-1 rounded-full shadow-lg inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Bottom on Image */}
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <span className="text-white/80 text-xs font-bold uppercase tracking-wider bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/15">
              {deal.category}
            </span>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-white mt-2 leading-tight drop-shadow-md">
              {deal.title}
            </h3>
            {deal.tagline && (
              <p className="text-turmeric text-xs sm:text-sm font-bold mt-0.5 drop-shadow">
                {deal.tagline}
              </p>
            )}
          </div>
        </div>

        {/* Right: Deal Content & Actions */}
        <div className="w-full md:w-7/12 p-5 sm:p-7 flex flex-col justify-between overflow-y-auto scroll-thin bg-white">
          <div className="space-y-4 sm:space-y-5">
            {/* Validity & Schedule Notice */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-turmeric/10 border border-turmeric/25 text-charcoal rounded-2xl px-3.5 py-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-chili shrink-0" />
                <span className="text-xs font-bold tracking-tight">
                  {deal.validity || "Promotional Deal"}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {deal.status === "expired" ? (
                  <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                    EXPIRED
                  </span>
                ) : (
                  <span className="bg-basil text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                    ACTIVE
                  </span>
                )}
                {deal.expiryDate && (
                  <span className="text-[10px] text-ink/60 font-semibold">
                    (Valid until {deal.expiryDate})
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-ink/40 mb-1.5">
                Combo Overview
              </h4>
              <p className="text-ink/80 text-sm leading-relaxed font-medium">
                {deal.detailedDescription || deal.description}
              </p>
            </div>

            {/* What's Included */}
            {deal.items && deal.items.length > 0 && (
              <div className="bg-cream/70 rounded-2xl p-4 border border-ink/5">
                <div className="flex items-center justify-between mb-2.5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-ink/70 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-chili" />
                    What's Included in This Deal:
                  </h4>
                  <span className="text-[11px] font-bold text-chili bg-chili/10 px-2 py-0.5 rounded-full">
                    {deal.items.length} Items
                  </span>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {deal.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 text-xs font-semibold text-ink/90 bg-white/80 p-2 rounded-xl border border-ink/5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-basil shrink-0" />
                      <span className="truncate">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quality & Delivery Badges */}
            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-ink/5 text-[11px] text-ink/60 font-semibold text-center">
              <div className="bg-cream/40 p-2 rounded-xl flex flex-col items-center">
                <ShieldCheck className="w-4 h-4 text-basil mb-1" />
                <span>100% Halal</span>
              </div>
              <div className="bg-cream/40 p-2 rounded-xl flex flex-col items-center">
                <Flame className="w-4 h-4 text-chili mb-1" />
                <span>Cooked Fresh</span>
              </div>
              <div className="bg-cream/40 p-2 rounded-xl flex flex-col items-center">
                <Zap className="w-4 h-4 text-turmeric mb-1" />
                <span>Instant Prep</span>
              </div>
            </div>
          </div>

          {/* Pricing & CTA footer */}
          <div className="pt-5 mt-5 border-t border-ink/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-chili text-2xl sm:text-3xl font-black font-display tracking-tight">
                  Rs. {deal.price}
                </span>
                {originalPrice > deal.price && (
                  <span className="text-ink/40 text-sm sm:text-base line-through font-bold">
                    Rs. {originalPrice}
                  </span>
                )}
              </div>
              {savings > 0 && (
                <p className="text-basil font-extrabold text-xs flex items-center gap-1 mt-0.5">
                  <span>✓ You save Rs. {savings} ({discountPercent}% OFF)</span>
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              {quantity > 0 ? (
                <div className="flex items-center gap-3 bg-cream p-1.5 rounded-full border border-chili/20 shadow-sm">
                  <QuantityStepper
                    quantity={quantity}
                    onIncrement={() => updateQty(deal.id, 1)}
                    onDecrement={() => updateQty(deal.id, -1)}
                    label={deal.title}
                    size="md"
                  />
                  <span className="text-xs font-black text-ink pr-3">
                    In Cart
                  </span>
                </div>
              ) : (
                <button
                  onClick={handleClaim}
                  className="w-full sm:w-auto bg-chili hover:bg-chili-dark active:scale-95 text-white font-extrabold px-6 py-3 rounded-full text-sm shadow-lg shadow-chili/25 hover:shadow-chili/40 transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Claim This Deal</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DealDetailModal;
