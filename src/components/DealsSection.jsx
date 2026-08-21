import { useCart } from "../context/CartContext";
import QuantityStepper from "./QuantityStepper";
import { Sparkles, Check, Plus, Flame } from "lucide-react";

function DealsSection({ deals }) {
  const { cart, handleAddToCart, updateQty } = useCart();

  if (!deals || deals.length === 0) return null;

  return (
    <section className="relative max-w-screen-2xl mx-auto px-5 sm:px-8 py-16 overflow-hidden">
      {/* Background Decor Ambient Mesh */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-turmeric/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-chili/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 bg-chili/10 border border-chili/20 text-chili text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-3 shadow-sm">
            <Flame className="w-3.5 h-3.5 fill-chili text-chili animate-pulse" />
            Limited Time Offers
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-ink tracking-tight">
            Combo Deals &amp; Steals
          </h2>
          <p className="text-ink/60 text-sm sm:text-base mt-1.5 max-w-md font-medium">
            Bundled meals crafted to save you money without compromising on flavor.
          </p>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deals.map((deal) => {
          const quantity = cart[deal.id] || 0;
          const savings = (deal.originalPrice || deal.price) - deal.price;

          return (
            <div
              key={deal.id}
              className="group bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1.5 overflow-hidden border border-ink/5 flex flex-col justify-between"
            >
              {/* Image & Badges */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-charcoal">
                <img
                  src={deal.image}
                  alt={deal.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />

                {savings > 0 && (
                  <span className="absolute top-3.5 left-3.5 bg-chili text-white text-xs font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    SAVE Rs. {savings}
                  </span>
                )}

                <span className="absolute top-3.5 right-3.5 bg-turmeric text-charcoal text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                  BEST COMBO
                </span>

                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="font-display font-extrabold text-xl text-white leading-tight drop-shadow-md">
                    {deal.title}
                  </h3>
                </div>
              </div>

              {/* Deal Body */}
              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  <p className="text-ink/60 text-xs sm:text-sm mb-4 leading-relaxed font-medium">
                    {deal.description}
                  </p>

                  <div className="bg-cream/60 rounded-2xl p-3.5 border border-ink/5 mb-5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-ink/40 mb-2">
                      What's Inside:
                    </p>
                    <ul className="space-y-1.5 text-xs text-ink/80 font-semibold">
                      {deal.items.map((line) => (
                        <li key={line} className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-basil/15 text-basil flex items-center justify-center text-[10px] shrink-0 font-bold">
                            ✓
                          </span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-ink/5">
                  <div>
                    {deal.originalPrice > deal.price && (
                      <span className="text-ink/35 text-xs line-through block font-medium">
                        Rs. {deal.originalPrice}
                      </span>
                    )}
                    <span className="text-chili text-2xl font-black font-display tracking-tight">
                      Rs. {deal.price}
                    </span>
                  </div>

                  {quantity > 0 ? (
                    <QuantityStepper
                      quantity={quantity}
                      onIncrement={() => updateQty(deal.id, 1)}
                      onDecrement={() => updateQty(deal.id, -1)}
                      label={deal.title}
                      size="md"
                    />
                  ) : (
                    <button
                      onClick={() => handleAddToCart(deal.id)}
                      className="bg-chili hover:bg-chili-dark active:scale-95 text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-md shadow-chili/20 hover:shadow-chili/30 flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Claim Deal</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default DealsSection;