import { Star, RotateCcw, SlidersHorizontal, Sparkles } from "lucide-react";

const CATEGORY_ICONS = {
  All: "✨",
  Burger: "🍔",
  Shawarma: "🌯",
  Pizza: "🍕",
  Sides: "🍟",
  Drinks: "🥤",
  Deal: "🏷️",
};

function Sidebar({
  categories,
  category,
  setCategory,
  rating,
  setRating,
  priceRange,
  setPriceRange,
  isOpen,
  onClose,
  onReset,
}) {
  const ratingOptions = [
    { value: 4.5, label: "4.5+ Top Rated" },
    { value: 4, label: "4.0+ Stars" },
    { value: 3, label: "3.0+ Stars" },
    { value: 0, label: "All Ratings" },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-pop-in"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:sticky top-0 lg:top-[72px] left-0 z-50 lg:z-10
          h-dvh lg:h-[calc(100dvh-72px)] w-80 lg:w-72 shrink-0
          bg-white lg:bg-transparent p-6 lg:py-8 lg:px-4 overflow-y-auto scroll-thin
          transition-transform duration-300 shadow-2xl lg:shadow-none
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        `}
      >
        <div className="bg-white lg:rounded-3xl lg:p-6 lg:shadow-sm lg:border lg:border-ink/5 flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-ink/5">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-chili" />
              <h2 className="font-display font-extrabold text-lg text-ink">Filters</h2>
            </div>

            <div className="flex items-center gap-2">
              {onReset && (
                <button
                  onClick={onReset}
                  className="text-xs font-bold text-chili hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              )}
              <button
                onClick={onClose}
                className="lg:hidden w-7 h-7 rounded-full bg-cream text-ink flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-ink/40 mb-3">
              Categories
            </h3>
            <div className="flex flex-col gap-1.5">
              {categories.map((cat) => {
                const isActive = category === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all text-left ${
                      isActive
                        ? "bg-chili text-white shadow-md shadow-chili/25"
                        : "bg-cream/60 hover:bg-cream text-ink/80 hover:text-ink"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">{CATEGORY_ICONS[cat] || "🍽️"}</span>
                      <span>{cat}</span>
                    </span>
                    {isActive && <span className="text-white text-xs">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-ink/40">
                Max Budget
              </h3>
              <span className="font-display font-black text-sm text-chili bg-chili/10 px-2.5 py-0.5 rounded-full">
                Rs. {priceRange}
              </span>
            </div>

            <div className="px-1">
              <input
                type="range"
                min="400"
                max="2000"
                step="50"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-chili h-2 bg-cream rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-ink/40 mt-1.5 font-bold">
                <span>Rs. 400</span>
                <span>Rs. 2000</span>
              </div>
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-ink/40 mb-2.5">
              Minimum Rating
            </h3>
            <div className="flex flex-col gap-1.5">
              {ratingOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setRating(opt.value)}
                  className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    rating === opt.value
                      ? "bg-turmeric/20 text-charcoal border border-turmeric"
                      : "bg-transparent text-ink/60 hover:bg-cream"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {opt.value > 0 && <Star className="w-3.5 h-3.5 fill-turmeric text-turmeric" />}
                    <span>{opt.label}</span>
                  </span>
                  {rating === opt.value && <span className="text-xs">✓</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;