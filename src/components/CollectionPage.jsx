import ProductCard from "./ProductsCard";
import Sidebar from "./Sidebar";
import EmptyState from "./EmptyState";
import { SlidersHorizontal, ArrowUpDown, Sparkles, Flame } from "lucide-react";

const CATEGORY_ICONS = {
  All: "✨",
  Burger: "🍔",
  Shawarma: "🌯",
  Pizza: "🍕",
  Sides: "🍟",
  Drinks: "🥤",
  Deal: "🏷️",
};

function CollectionPage({
  categories,
  category,
  setCategory,
  rating,
  setRating,
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
  filteredProducts,
  onOpenDetails,
  mobileFiltersOpen,
  onCloseMobileFilters,
  onResetFilters,
}) {
  return (
    <div className="flex min-h-screen bg-cream">
      {/* Sidebar Filter Rail */}
      <Sidebar
        categories={categories}
        category={category}
        setCategory={setCategory}
        rating={rating}
        setRating={setRating}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        isOpen={mobileFiltersOpen}
        onClose={onCloseMobileFilters}
        onReset={onResetFilters}
      />

      <main className="flex-1 min-w-0 p-5 sm:p-8 max-w-screen-2xl mx-auto w-full">
        {/* Page Banner */}
        <div className="relative rounded-3xl bg-charcoal text-cream p-6 sm:p-8 mb-8 overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-80 h-80 bg-chili/25 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-white/10 text-cream text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-2">
                <Flame className="w-3.5 h-3.5 fill-chili text-chili" />
                Live Grill Menu
              </div>
              <h1 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight">
                {category === "All" ? "Full Street Menu" : `${category} Collection`}
              </h1>
              <p className="text-cream/60 text-xs sm:text-sm mt-1 max-w-md font-medium">
                Freshly smashed burgers, charcoal-roasted shawarma, and stone-baked pizza.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-chili text-white font-display font-black text-sm px-4 py-2 rounded-2xl shadow-md">
                {filteredProducts.length} {filteredProducts.length === 1 ? "Dish" : "Dishes"} Available
              </span>
            </div>
          </div>
        </div>

        {/* Quick Category Chips Strip (Horizontal for Easy Mobile & Desktop Access) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scroll-thin">
          {categories.map((cat) => {
            const isActive = category === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`shrink-0 px-4 py-2 rounded-2xl text-xs font-extrabold transition-all duration-300 flex items-center gap-2 ${
                  isActive
                    ? "bg-chili text-white shadow-lg shadow-chili/25 scale-105"
                    : "bg-white hover:bg-cream text-ink/70 hover:text-ink border border-ink/5"
                }`}
              >
                <span>{CATEGORY_ICONS[cat] || "🍽️"}</span>
                <span>{cat}</span>
              </button>
            );
          })}
        </div>

        {/* Action / Sorting Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8 bg-white p-3.5 rounded-2xl shadow-sm border border-ink/5">
          <div className="flex items-center gap-2">
            <button
              onClick={onCloseMobileFilters ? () => onCloseMobileFilters(true) : undefined}
              className="lg:hidden flex items-center gap-1.5 bg-cream hover:bg-ink/10 text-ink font-bold text-xs px-3.5 py-2 rounded-xl transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-chili" />
              <span>Filters</span>
            </button>

            <span className="text-xs text-ink/60 font-semibold">
              Showing <span className="text-ink font-bold">{filteredProducts.length}</span> items
            </span>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-ink/40 hidden sm:inline flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3" /> Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-cream border border-ink/10 rounded-xl px-3.5 py-2 text-xs font-bold text-ink focus:outline-none focus:ring-2 focus:ring-chili cursor-pointer"
            >
              <option value="default">Featured Dishes</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Rating: Highest First</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <EmptyState onReset={onResetFilters} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenDetails={() => onOpenDetails(product)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default CollectionPage;