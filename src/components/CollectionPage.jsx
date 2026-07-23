import ProductCard from "./ProductsCard";
import Sidebar from "./Sidebar";
import EmptyState from "./EmptyState";

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
  cart,
  onAdd,
  onIncrement,
  onDecrement,
  onOpenDetails,
  mobileFiltersOpen,
  onCloseMobileFilters,
  onResetFilters,
}) {
  return (
    <div className="flex">
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
      />

      <main className="flex-1 min-w-0 p-5 sm:p-8 max-w-screen-2xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <p className="text-ink/60 text-sm font-medium">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "dish" : "dishes"} found
          </p>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-ink/15 rounded-full px-4 py-2 text-sm font-medium text-ink focus:outline-none focus:ring-2 focus:ring-chili self-start sm:self-auto"
          >
            <option value="default">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Rating: Highest First</option>
          </select>
        </div>

        {filteredProducts.length === 0 ? (
          <EmptyState onReset={onResetFilters} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
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
        )}
      </main>
    </div>
  );
}

export default CollectionPage;