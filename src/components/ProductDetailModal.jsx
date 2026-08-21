import { useState, useEffect } from "react";
import { supabaseClient } from "../lib/supabaseClient";
import { useCart } from "../context/CartContext";
import QuantityStepper from "./QuantityStepper";

function ProductDetailModal({ product, isOpen, onClose }) {
    const { cart, handleAddToCart, updateQty } = useCart();
    const quantity = product ? cart[product.id] || 0 : 0;

    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewForm, setReviewForm] = useState({ username: "", review: "", rating: "5" });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (!isOpen || !product) return;

        let cancelled = false;
        setReviewsLoading(true);
        setShowReviewForm(false);
        setSubmitted(false);
        setReviewForm({ username: "", review: "", rating: "5" });

        supabaseClient
            .from("reviews")
            .select("*")
            .eq("product_id", product.id)
            .eq("is_approved", true)
            .order("created_at", { ascending: false })
            .then(({ data, error }) => {
                if (cancelled) return;
                if (!error) setReviews(data || []);
                setReviewsLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [isOpen, product]);

    if (!isOpen || !product) return null;

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!reviewForm.username.trim() || !reviewForm.review.trim()) return;

        setSubmitting(true);
        const { error } = await supabaseClient.from("reviews").insert({
            product_id: product.id,
            username: reviewForm.username.trim(),
            review: reviewForm.review.trim(),
            rating: Number(reviewForm.rating),
            is_approved: false,
        });
        setSubmitting(false);

        if (!error) {
            setSubmitted(true);
            setShowReviewForm(false);
        }
    };

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
                                <QuantityStepper
                                    quantity={quantity}
                                    onIncrement={() => updateQty(product.id, 1)}
                                    onDecrement={() => updateQty(product.id, -1)}
                                    label={product.title}
                                    size="md"
                                />
                            ) : (
                                <button
                                    onClick={() => handleAddToCart(product.id)}
                                    className="bg-chili text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-chili-dark transition-colors shadow-sm"
                                >
                                    Add to Cart
                                </button>
                            )}
                        </div>

                        {/* Reviews list */}
                        <div className="mt-2">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-display font-bold text-base text-ink">
                                    Reviews ({reviews.length})
                                </h3>
                                {!showReviewForm && !submitted && (
                                    <button
                                        onClick={() => setShowReviewForm(true)}
                                        className="text-xs font-semibold text-chili hover:text-chili-dark transition-colors"
                                    >
                                        + Write a review
                                    </button>
                                )}
                            </div>

                            {submitted && (
                                <div className="bg-basil/10 border border-basil/30 text-basil text-xs font-medium rounded-xl px-3 py-2.5 mb-3">
                                    Thanks! Your review was submitted and will show up once approved.
                                </div>
                            )}

                            {showReviewForm && (
                                <form
                                    onSubmit={handleSubmitReview}
                                    className="bg-cream/50 border border-ink/10 rounded-xl p-3 mb-3 flex flex-col gap-2"
                                >
                                    <input
                                        type="text"
                                        value={reviewForm.username}
                                        onChange={(e) =>
                                            setReviewForm((f) => ({ ...f, username: e.target.value }))
                                        }
                                        placeholder="Your name"
                                        required
                                        className="w-full bg-white rounded-lg px-3 py-2 text-xs text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-chili"
                                    />
                                    <textarea
                                        value={reviewForm.review}
                                        onChange={(e) =>
                                            setReviewForm((f) => ({ ...f, review: e.target.value }))
                                        }
                                        placeholder="What did you think?"
                                        rows={2}
                                        required
                                        className="w-full bg-white rounded-lg px-3 py-2 text-xs text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-chili resize-none"
                                    />
                                    <div className="flex items-center gap-2">
                                        <label className="text-[10px] font-semibold text-ink/50 uppercase">
                                            Rating
                                        </label>
                                        <select
                                            value={reviewForm.rating}
                                            onChange={(e) =>
                                                setReviewForm((f) => ({ ...f, rating: e.target.value }))
                                            }
                                            className="bg-white rounded-lg px-2 py-1 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-chili"
                                        >
                                            {[5, 4, 3, 2, 1].map((n) => (
                                                <option key={n} value={n}>
                                                    {n} ★
                                                </option>
                                            ))}
                                        </select>
                                        <div className="flex-1" />
                                        <button
                                            type="button"
                                            onClick={() => setShowReviewForm(false)}
                                            className="text-xs font-semibold text-ink/50 hover:text-ink px-2"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="bg-chili hover:bg-chili-dark disabled:opacity-60 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
                                        >
                                            {submitting ? "Sending..." : "Submit"}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {reviewsLoading ? (
                                <p className="text-ink/40 text-xs italic">Loading reviews...</p>
                            ) : reviews.length === 0 ? (
                                <p className="text-ink/40 text-xs italic">No reviews yet.</p>
                            ) : (
                                <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1 scroll-thin">
                                    {reviews.map((rev) => (
                                        <div key={rev.id} className="bg-cream/40 p-2.5 rounded-xl border border-ink/5">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs font-bold text-ink">{rev.username}</span>
                                                <span className="text-[10px] text-ink/40">
                                                    {new Date(rev.created_at).toLocaleDateString()}
                                                </span>
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