import { reviews } from "../data/product-rating";

function ProductDetailModal({ product, isOpen, onClose, quantity, onIncrement, onDecrement, onAdd }) {
    if (!isOpen || !product) return null;

    // Filter reviews for this product
    const productReviews = reviews.filter(
        (r) => r.productid === product.id && r.isApproved
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
            {/* Backdrop */}
            <div className="absolute inset-0" onClick={onClose} />

            {/* Modal Container */}
            <div className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row max-h-[90dvh] md:max-h-[85dvh] animate-pop-in">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-cream text-ink font-bold flex items-center justify-center hover:bg-chili hover:text-white transition-colors shadow-sm"
                >
                    ✕
                </button>

                {/* Left: Product Image */}
                <div className="relative w-full md:w-1/2 h-56 md:h-full min-h-[220px] bg-charcoal shrink-0">
                    <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover"
                    />
                    <span className="absolute top-4 left-4 bg-charcoal/85 text-cream text-xs font-semibold px-2.5 py-1 rounded-full">
                        {product.category}
                    </span>
                    {/* Stamp Badge */}
                    <div className="stamp absolute bottom-4 left-4 bg-turmeric rounded-full w-14 h-14 flex flex-col items-center justify-center text-charcoal shadow-md">
                        <span className="text-sm font-extrabold leading-none">{product.rating}</span>
                        <span className="text-[10px]">★</span>
                    </div>
                </div>

                {/* Right: Info and Reviews */}
                <div className="w-full md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto scroll-thin bg-white">
                    <div className="flex flex-col h-full justify-between">
                        <div>
                            <h2 className="font-display font-bold text-2xl text-ink leading-tight mb-2">
                                {product.title}
                            </h2>
                            <p className="text-ink/60 text-sm mb-4 leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        {/* Price & Add to Cart */}
                        <div className="flex items-center justify-between border-t border-b border-ink/10 py-3 my-4">
                            <span className="text-chili text-2xl font-extrabold font-display">
                                Rs. {product.price}
                            </span>

                            {quantity > 0 ? (
                                <div className="flex items-center gap-1 bg-cream rounded-full px-1 py-1">
                                    <button
                                        onClick={onDecrement}
                                        className="w-8 h-8 rounded-full bg-white text-ink font-bold flex items-center justify-center hover:bg-chili hover:text-white transition-colors"
                                    >
                                        −
                                    </button>
                                    <span className="w-8 text-center font-semibold text-sm text-ink">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={onIncrement}
                                        className="w-8 h-8 rounded-full bg-white text-ink font-bold flex items-center justify-center hover:bg-chili hover:text-white transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={onAdd}
                                    className="bg-chili text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-chili-dark transition-colors shadow-sm"
                                >
                                    Add to Cart
                                </button>
                            )}
                        </div>

                        {/* Reviews list */}
                        <div className="mt-2">
                            <h3 className="font-display font-bold text-base text-ink mb-2">
                                Reviews ({productReviews.length})
                            </h3>
                            {productReviews.length === 0 ? (
                                <p className="text-ink/40 text-xs italic">No reviews yet.</p>
                            ) : (
                                <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1 scroll-thin">
                                    {productReviews.map((rev) => (
                                        <div key={rev.id} className="bg-cream/40 p-2.5 rounded-xl border border-ink/5">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs font-bold text-ink">{rev.username}</span>
                                                <span className="text-[10px] text-ink/40">{rev.date}</span>
                                            </div>
                                            <div className="text-[10px] text-turmeric font-semibold mb-1">
                                                ★ {rev.rating} / 5
                                            </div>
                                            <p className="text-xs text-ink/75 italic">"{rev.review}"</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetailModal;