function Sidebar({
  categories,
  category,
  setCategory,
  rating,
  setRating,
  priceRange,     // <-- New Prop
  setPriceRange,  // <-- New Prop
  isOpen,
  onClose,
}) {
  const ratingOptions = [
    { value: 4, label: "4+ Stars" },
    { value: 3, label: "3+ Stars" },
    { value: 2, label: "2+ Stars" },
    { value: 1, label: "1+ Stars" },
    { value: 0, label: "All Ratings" },
  ];

  return (
    <>
      {/* backdrop on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:sticky top-0 lg:top-[64px] left-0 z-50 lg:z-0
          h-screen lg:h-[calc(100vh-64px)] w-72 lg:w-64 shrink-0
          bg-white lg:bg-transparent p-5 overflow-y-auto scroll-thin
          transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        `}
      >
        <div className="flex items-center justify-between mb-6 lg:mb-5">
          <h2 className="font-display font-bold text-xl text-ink">Filters</h2>
          <button
            onClick={onClose}
            className="lg:hidden w-8 h-8 rounded-full bg-cream flex items-center justify-center text-ink"
          >
            ✕
          </button>
        </div>

        {/* Category */}
        <h3 className="font-semibold text-sm uppercase tracking-wide text-ink/60 mb-3">
          Category
        </h3>
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold border-2 transition-colors ${category === cat
                  ? "bg-chili border-chili text-white"
                  : "bg-transparent border-ink/15 text-ink/70 hover:border-chili/50"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Price Range Filter (NEW SECTION) */}
        <h3 className="font-semibold text-sm uppercase tracking-wide text-ink/60 mb-3">
          Max Price: <span className="text-chili font-bold font-display">Rs. {priceRange}</span>
        </h3>
        <div className="mb-8 px-1">
          <input
            type="range"
            min="400"
            max="1500"
            step="50"
            value={priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value))}
            className="w-full accent-chili h-2 bg-ink/10 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-ink/40 mt-1 font-medium">
            <span>Rs. 400</span>
            <span>Rs. 1500</span>
          </div>
        </div>

        {/* Rating */}
        <h3 className="font-semibold text-sm uppercase tracking-wide text-ink/60 mb-3">
          Rating
        </h3>
        <div className="flex flex-col gap-2">
          {ratingOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setRating(opt.value)}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${rating === opt.value
                  ? "bg-turmeric/20 text-ink border border-turmeric"
                  : "bg-transparent text-ink/70 border border-transparent hover:bg-cream"
                }`}
            >
              {opt.value > 0 ? `⭐ ${opt.label}` : opt.label}
            </button>
          ))}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;