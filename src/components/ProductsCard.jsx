import { countReviews } from "../data/product-rating";

function ProductCard({ product, quantity, onAdd, onIncrement, onDecrement, onOpenDetails }) {
  const reviewCount = countReviews(product.id);

  return (
    <div
      onClick={onOpenDetails}
      className="group bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 animate-pop-in cursor-pointer"
    >
      {/* Image + stamp badge */}
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />

        <span className="absolute top-3 left-3 bg-charcoal/85 text-cream text-xs font-semibold px-2.5 py-1 rounded-full">
          {product.category}
        </span>

        {/* Signature stamp element */}
        <div className="stamp absolute -bottom-4 right-3 bg-turmeric rounded-full w-14 h-14 flex flex-col items-center justify-center text-charcoal shadow-md">
          <span className="text-sm font-extrabold leading-none">
            {product.rating}
          </span>
          <span className="text-[10px]">★</span>
        </div>
      </div>

      <div className="p-4 pt-6">
        <h2 className="font-display font-bold text-lg text-ink leading-snug">
          {product.title}
        </h2>

        <p className="text-ink/60 text-sm mt-1.5 line-clamp-2">
          {product.description}
        </p>

        <p className="text-ink/40 text-xs mt-2">
          {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
        </p>

        <div className="flex justify-between items-center mt-4">
          <h3 className="text-chili text-xl font-extrabold font-display">
            Rs. {product.price}
          </h3>

          {quantity > 0 ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 bg-cream rounded-full px-1 py-1"
            >
              <button
                onClick={onDecrement}
                className="w-7 h-7 rounded-full bg-white text-ink font-bold flex items-center justify-center hover:bg-chili hover:text-white transition-colors"
                aria-label={`Remove one ${product.title}`}
              >
                −
              </button>
              <span className="w-6 text-center font-semibold text-sm">
                {quantity}
              </span>
              <button
                onClick={onIncrement}
                className="w-7 h-7 rounded-full bg-white text-ink font-bold flex items-center justify-center hover:bg-chili hover:text-white transition-colors"
                aria-label={`Add one more ${product.title}`}
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAdd();
              }}
              className="bg-chili text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-chili-dark transition-colors"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;