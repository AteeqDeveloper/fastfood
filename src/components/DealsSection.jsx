function DealsSection({ deals, cart, onAdd, onIncrement, onDecrement }) {
    if (!deals || deals.length === 0) return null;

    return (
        <section className="max-w-screen-2xl mx-auto px-5 sm:px-8 py-14">
            <div className="mb-6">
                <span className="inline-block bg-basil/10 text-basil text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-2">
                    Limited time
                </span>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-ink">
                    Today's Deals
                </h2>
                <p className="text-ink/60 text-sm mt-1">
                    Bundled combos, priced better than ordering separately.
                </p>
            </div>

            <div className="flex gap-5 overflow-x-auto scroll-thin pb-3 -mx-1 px-1">
                {deals.map((deal) => {
                    const quantity = cart[deal.id] || 0;
                    const savings = (deal.originalPrice || deal.price) - deal.price;

                    return (
                        <div
                            key={deal.id}
                            className="shrink-0 w-72 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-ink/5"
                        >
                            <div className="relative h-36">
                                <img
                                    src={deal.image}
                                    alt={deal.title}
                                    className="w-full h-full object-cover"
                                />
                                {savings > 0 && (
                                    <span className="absolute top-3 left-3 bg-chili text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                                        SAVE Rs. {savings}
                                    </span>
                                )}
                            </div>

                            <div className="p-4">
                                <h3 className="font-display font-bold text-base text-ink mb-1 leading-snug">
                                    {deal.title}
                                </h3>
                                <p className="text-ink/50 text-xs mb-2.5 leading-relaxed">
                                    {deal.description}
                                </p>

                                <ul className="text-ink/60 text-xs mb-3 space-y-0.5">
                                    {deal.items.map((line) => (
                                        <li key={line}>• {line}</li>
                                    ))}
                                </ul>

                                <div className="flex items-center justify-between gap-2">
                                    <div className="min-w-0">
                                        {deal.originalPrice > deal.price && (
                                            <span className="text-ink/30 text-xs line-through mr-1.5">
                                                Rs. {deal.originalPrice}
                                            </span>
                                        )}
                                        <span className="text-chili text-lg font-extrabold font-display">
                                            Rs. {deal.price}
                                        </span>
                                    </div>

                                    {quantity > 0 ? (
                                        <div className="flex items-center gap-1 bg-cream rounded-full px-1 py-1 shrink-0">
                                            <button
                                                onClick={() => onDecrement(deal.id)}
                                                className="w-7 h-7 rounded-full bg-white text-ink font-bold flex items-center justify-center hover:bg-chili hover:text-white transition-colors"
                                                aria-label={`Remove one ${deal.title}`}
                                            >
                                                −
                                            </button>
                                            <span className="w-6 text-center font-semibold text-sm">
                                                {quantity}
                                            </span>
                                            <button
                                                onClick={() => onIncrement(deal.id)}
                                                className="w-7 h-7 rounded-full bg-white text-ink font-bold flex items-center justify-center hover:bg-chili hover:text-white transition-colors"
                                                aria-label={`Add one more ${deal.title}`}
                                            >
                                                +
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => onAdd(deal.id)}
                                            className="shrink-0 bg-chili text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-chili-dark transition-colors"
                                        >
                                            Add Deal
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