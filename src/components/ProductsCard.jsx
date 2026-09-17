import { useCart } from "../context/CartContext";
import QuantityStepper from "./QuantityStepper";
import { Star, Plus, Check } from "lucide-react";
import { useState } from "react";

function ProductCard({ product, onOpenDetails }) {
  const { cart, handleAddToCart, updateQty } = useCart();
  const quantity = cart[product.id] || 0;
  const [justAdded, setJustAdded] = useState(false);

  const onAdd = (e) => {
    e.stopPropagation();
    handleAddToCart(product.id);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 800);
  };

  return (
    <div
      onClick={onOpenDetails}
      className="group relative bg-[#FFFAF0] rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 border border-[#3A2418]/10 shadow-[0_4px_20px_-4px_rgba(58,36,24,0.06)] hover:shadow-[0_16px_32px_-8px_rgba(58,36,24,0.14)] hover:border-[#C65D21]/30 flex flex-col justify-between cursor-pointer animate-pop-in"
    >
      {/* Image Container with Badges */}
      <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-[#FFF3DC]">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Ambient Dark Brown vignette on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#3A2418]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category Handcrafted Tag */}
        <span className="absolute top-3 left-3 bg-[#3A2418]/85 backdrop-blur-md text-[#FFF3DC] text-[10px] sm:text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm border border-[#FFF3DC]/20">
          {product.category}
        </span>

        {/* Rating Floating Stamp in Mustard Yellow */}
        <div className="absolute top-3 right-3 bg-[#FFFAF0]/95 backdrop-blur-md text-[#3A2418] px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md border border-[#E6A93A]/30">
          <Star className="w-3.5 h-3.5 fill-[#E6A93A] text-[#E6A93A]" />
          <span className="text-xs font-black">{product.rating || "4.9"}</span>
        </div>

        {/* Decorative Badge if available */}
        {product.badge && (
          <span className="absolute bottom-3 left-3 bg-[#66734A] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md shadow-md uppercase tracking-wider">
            {product.badge}
          </span>
        )}

        {/* Quick View Prompt on Hover */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 text-[#FFF3DC] text-[11px] font-bold bg-[#3A2418]/90 px-3 py-1 rounded-full whitespace-nowrap shadow-md">
          Details ↗
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-display font-extrabold text-lg sm:text-xl text-[#3A2418] leading-snug group-hover:text-[#C65D21] transition-colors">
            {product.title}
          </h3>

          <p className="text-[#3A2418]/70 text-xs sm:text-sm mt-2 line-clamp-2 leading-relaxed font-normal">
            {product.description}
          </p>
        </div>

        {/* Price & Add to Cart Actions */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#3A2418]/10">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#3A2418]/50 block">Price</span>
            <h4 className="text-[#C65D21] text-xl sm:text-2xl font-black font-display tracking-tight">
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
              onClick={onAdd}
              className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all flex items-center gap-1.5 shadow-md active:scale-95 ${
                justAdded
                  ? "bg-[#66734A] text-white shadow-[#66734A]/30"
                  : "bg-[#C65D21] hover:bg-[#A94B16] text-white shadow-[#C65D21]/25 hover:shadow-[#C65D21]/40 hover:-translate-y-0.5"
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;