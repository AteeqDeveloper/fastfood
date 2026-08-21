import { useCart } from "../context/CartContext";
import QuantityStepper from "./QuantityStepper";
import { Star, Flame, Plus } from "lucide-react";

function ProductCard({ product, onOpenDetails }) {
  const { cart, handleAddToCart, updateQty } = useCart();
  const quantity = cart[product.id] || 0;

  return (
    <div
      onClick={onOpenDetails}
      className="group relative bg-white rounded-3xl shadow-sm hover:shadow-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1.5 border border-ink/5 flex flex-col justify-between cursor-pointer animate-pop-in"
    >
      {/* Image Container with Badges */}
      <div className="relative h-52 w-full overflow-hidden bg-cream">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
        />

        {/* Ambient Gradient Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category Pill */}
        <span className="absolute top-3.5 left-3.5 bg-charcoal/80 backdrop-blur-md text-cream text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
          {product.category}
        </span>

        {/* Rating Floating Pill */}
        <div className="absolute top-3.5 right-3.5 bg-white/90 backdrop-blur-md text-charcoal px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md border border-white/50">
          <Star className="w-3.5 h-3.5 fill-turmeric text-turmeric" />
          <span className="text-xs font-black">{product.rating}</span>
        </div>

        {/* Quick View Prompt on Hover */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 text-white text-xs font-bold bg-charcoal/80 backdrop-blur-md px-3.5 py-1.5 rounded-full whitespace-nowrap shadow-lg">
          Tap for Details &amp; Reviews ↗
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-display font-extrabold text-lg text-ink leading-snug group-hover:text-chili transition-colors">
            {product.title}
          </h3>

          <p className="text-ink/60 text-xs mt-1.5 line-clamp-2 leading-relaxed font-medium">
            {product.description}
          </p>
        </div>

        {/* Price & Cart Actions */}
        <div className="flex justify-between items-center mt-5 pt-3 border-t border-ink/5">
          <div>
            <span className="text-[10px] uppercase font-bold text-ink/40 block -mb-0.5">Price</span>
            <h4 className="text-chili text-xl font-black font-display tracking-tight">
              Rs. {product.price}
            </h4>
          </div>

          {quantity > 0 ? (
            <div onClick={(e) => e.stopPropagation()}>
              <QuantityStepper
                quantity={quantity}
                onIncrement={() => updateQty(product.id, 1)}
                onDecrement={() => updateQty(product.id, -1)}
                label={product.title}
                size="md"
              />
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(product.id);
              }}
              className="bg-chili hover:bg-chili-dark active:scale-95 text-white px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-chili/20 hover:shadow-chili/30"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;