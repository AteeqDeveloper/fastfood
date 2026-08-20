import ProductCard from "./ProductsCard";
import Carousel from "./Carousel";
import DealsSection from "./DealsSection";
import useReveal from "../hooks/useReveal";
import { deals } from "../data/deals";

function HomePage({
    topProducts,
    categories,
    onExplore,
    onCategorySelect,
    cart,
    onAdd,
    onIncrement,
    onDecrement,
    onOpenDetails,
}) {
    const steps = [
        {
            n: "01",
            title: "Pick your craving",
            copy: "Browse the full menu — burgers, shawarma, pizza — filtered by rating, price, or category.",
        },
        {
            n: "02",
            title: "We fire up the grill",
            copy: "Every order is cooked fresh, not reheated. No dish leaves the kitchen early.",
        },
        {
            n: "03",
            title: "It lands at your door",
            copy: "Add your address at checkout and track it landing hot, wrapped, and stamped.",
        },
    ];

    const [picksRef, picksVisible] = useReveal();
    const [dealsRef, dealsVisible] = useReveal();
    const [stepsRef, stepsVisible] = useReveal();

    return (
        <main className="flex-1 min-w-0">
            {/* HERO */}
            <section className="relative bg-charcoal text-cream overflow-hidden">
                <div className="max-w-screen-2xl mx-auto px-5 sm:px-8 pt-14 pb-20 sm:pt-20 sm:pb-28 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
                    <div className="relative z-10">
                        <span className="inline-block bg-chili/15 border border-chili/40 text-chili text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-5">
                            Karachi's grill-first kitchen
                        </span>
                        <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] mb-5">
                            Street food,
                            <br />
                            plated <span className="text-chili">properly.</span>
                        </h1>
                        <p className="text-cream/70 text-base sm:text-lg max-w-md mb-8 leading-relaxed">
                            Smash burgers, charcoal shawarma, and stone-baked pizza — cooked to
                            order and rated by the people who actually ate them.
                        </p>
                        <div className="flex flex-wrap items-center gap-4">
                            <button
                                onClick={onExplore}
                                className="bg-chili hover:bg-chili-dark transition-colors text-white font-semibold px-6 py-3 rounded-full text-sm sm:text-base"
                            >
                                Explore the Menu
                            </button>
                            <div className="flex items-center gap-2 text-sm text-cream/60">
                                <span className="text-turmeric">★★★★★</span>
                                <span>4.6 average across every dish</span>
                            </div>
                        </div>
                    </div>

                    {/* Rotating carousel of today's top-rated picks */}
                    {topProducts.length > 0 && (
                        <div className="relative z-10 w-full">
                            <Carousel
                                items={topProducts.map((p) => ({
                                    id: p.id,
                                    image: p.image,
                                    title: p.title,
                                    rating: p.rating,
                                    subtitle: "Today's highest-rated pick",
                                }))}
                            />
                        </div>
                    )}
                </div>
            </section>

            {/* CATEGORY STRIP */}
            <section className="max-w-screen-2xl mx-auto px-5 sm:px-8 -mt-8 relative z-20">
                <div className="bg-white rounded-2xl shadow-md p-4 sm:p-5 flex flex-wrap gap-3 justify-center sm:justify-between">
                    {categories
                        .filter((c) => c !== "All")
                        .map((cat) => (
                            <button
                                key={cat}
                                onClick={() => onCategorySelect(cat)}
                                className="flex-1 min-w-[100px] text-center px-3 py-2.5 rounded-xl text-sm font-semibold text-ink/80 hover:bg-cream hover:text-chili transition-colors"
                            >
                                {cat}
                            </button>
                        ))}
                    <button
                        onClick={onExplore}
                        className="flex-1 min-w-[100px] text-center px-3 py-2.5 rounded-xl text-sm font-semibold bg-cream text-chili hover:bg-chili hover:text-white transition-colors"
                    >
                        View All →
                    </button>
                </div>
            </section>

            {/* TODAY'S PICKS */}
            <section
                ref={picksRef}
                className={`max-w-screen-2xl mx-auto px-5 sm:px-8 pt-16 pb-4 reveal ${picksVisible ? "reveal-visible" : ""
                    }`}
            >
                <div className="flex items-end justify-between mb-6">
                    <div>
                        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-ink">
                            Today's Picks
                        </h2>
                        <p className="text-ink/60 text-sm mt-1">
                            The four dishes our customers rate highest.
                        </p>
                    </div>
                    <button
                        onClick={onExplore}
                        className="hidden sm:block text-sm font-semibold text-chili hover:text-chili-dark transition-colors shrink-0"
                    >
                        See full menu →
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                    {topProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            quantity={cart[product.id] || 0}
                            onAdd={() => onAdd(product.id)}
                            onIncrement={() => onIncrement(product.id)}
                            onDecrement={() => onDecrement(product.id)}
                            onOpenDetails={() => onOpenDetails(product)}
                        />
                    ))}
                </div>
            </section>

            {/* TODAY'S DEALS — combo bundles, priced better than ordering separately */}
            <div
                ref={dealsRef}
                className={`reveal ${dealsVisible ? "reveal-visible" : ""}`}
            >
                <DealsSection
                    deals={deals}
                    cart={cart}
                    onAdd={onAdd}
                    onIncrement={onIncrement}
                    onDecrement={onDecrement}
                />
            </div>

            {/* HOW IT WORKS */}
            <section
                ref={stepsRef}
                className={`max-w-screen-2xl mx-auto px-5 sm:px-8 py-16 reveal ${stepsVisible ? "reveal-visible" : ""
                    }`}
            >
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-ink mb-10 text-center">
                    From craving to doorstep
                </h2>
                <div className="grid sm:grid-cols-3 gap-8">
                    {steps.map((step, i) => (
                        <div
                            key={step.n}
                            className={`flex flex-col items-center text-center reveal ${stepsVisible ? "reveal-visible" : ""
                                }`}
                            style={{ animationDelay: stepsVisible ? `${i * 0.15}s` : "0s" }}
                        >
                            <div className="stamp bg-cream w-16 h-16 rounded-full flex items-center justify-center font-display font-extrabold text-lg text-ink mb-4">
                                {step.n}
                            </div>
                            <h3 className="font-display font-bold text-base text-ink mb-1.5">
                                {step.title}
                            </h3>
                            <p className="text-ink/60 text-sm max-w-[240px]">{step.copy}</p>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}

export default HomePage;