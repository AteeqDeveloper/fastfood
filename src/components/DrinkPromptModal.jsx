import { useCart } from "../context/CartContext";

function DrinkPromptModal() {
    const {
        drinkPromptOpen,
        handleSkipDrinkPrompt,
        handleSelectDrink,
        drinkProducts,
        drinkPromptProduct,
    } = useCart();

    if (!drinkPromptOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            {/* Backdrop — clicking it just skips, same as "No thanks" */}
            <div className="absolute inset-0" onClick={handleSkipDrinkPrompt} />

            <div className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl z-10 animate-pop-in">
                <button
                    onClick={handleSkipDrinkPrompt}
                    className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-cream text-ink font-bold flex items-center justify-center hover:bg-chili hover:text-white transition-colors shadow-sm"
                    aria-label="Skip"
                >
                    ✕
                </button>

                <div className="p-6">
                    <span className="inline-block bg-chili/10 text-chili text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                        🥤 Optional
                    </span>
                    <h2 className="font-display font-bold text-xl text-ink leading-tight mb-1.5">
                        Add a drink?
                    </h2>
                    <p className="text-ink/60 text-sm mb-5">
                        {drinkPromptProduct?.title
                            ? `Since you added ${drinkPromptProduct.title}, want something cold to go with it? Totally up to you.`
                            : "Want something cold with that? Totally up to you."}
                    </p>

                    <div className="flex flex-col gap-2.5 mb-5 max-h-72 overflow-y-auto scroll-thin pr-1">
                        {drinkProducts.map((drink) => (
                            <button
                                key={drink.id}
                                onClick={() => handleSelectDrink(drink.id)}
                                className="flex items-center gap-3 bg-cream/60 hover:bg-cream border border-ink/5 hover:border-chili/30 rounded-2xl p-2.5 transition-colors text-left"
                            >
                                <img
                                    src={drink.image}
                                    alt={drink.title}
                                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-ink truncate">{drink.title}</p>
                                    <p className="text-chili text-sm font-bold">Rs. {drink.price}</p>
                                </div>
                                <span className="shrink-0 bg-chili text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                                    + Add
                                </span>
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleSkipDrinkPrompt}
                        className="w-full text-ink/50 hover:text-ink font-semibold py-2.5 rounded-full text-sm transition-colors"
                    >
                        No thanks, skip
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DrinkPromptModal;