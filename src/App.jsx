import { useState, useMemo } from "react";
import { products } from "./data/products";
import ProductCard from "./components/ProductsCard";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import EmptyState from "./components/EmptyState";
import CartDrawer from "./components/CartDrawer";

function App() {
  const [category, setCategory] = useState("All");
  const [rating, setRating] = useState(0);
  const [priceRange, setPriceRange] = useState(1500); // <-- New State (Max price initially 1500)
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [cart, setCart] = useState({});
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filteredProducts = useMemo(() => {
    let list = products.filter((product) => {
      const categoryMatch = category === "All" || product.category === category;

      let ratingMatch = true;
      if (rating > 0) {
        ratingMatch = product.rating >= rating && product.rating < rating + 1;
      }

      // Price Match Filter logic (NEW)
      const priceMatch = product.price <= priceRange;

      const searchMatch =
        search.trim() === "" ||
        product.title.toLowerCase().includes(search.trim().toLowerCase());

      return categoryMatch && ratingMatch && priceMatch && searchMatch; // <-- Included priceMatch
    });

    if (sortBy === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === "rating-desc") list = [...list].sort((a, b) => b.rating - a.rating);

    return list;
  }, [category, rating, priceRange, search, sortBy]); // <-- Added priceRange to dependencies

  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  const cartItems = Object.entries(cart)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => ({
      ...products.find((p) => p.id === Number(id)),
      qty,
    }));

  const updateQty = (id, delta) => {
    setCart((prev) => {
      const next = { ...prev };
      const newQty = (next[id] || 0) + delta;
      if (newQty <= 0) {
        delete next[id];
      } else {
        next[id] = newQty;
      }
      return next;
    });
  };

  const resetFilters = () => {
    setCategory("All");
    setRating(0);
    setPriceRange(1500); // <-- Reset price filter
    setSearch("");
  };

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    setTimeout(() => {
      setOrderPlaced(false);
      setCart({});
      setCartOpen(false);
    }, 1400);
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header
        search={search}
        setSearch={setSearch}
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
        onFiltersClick={() => setMobileFiltersOpen(true)}
      />

      <div className="flex">
        <Sidebar
          categories={categories}
          category={category}
          setCategory={setCategory}
          rating={rating}
          setRating={setRating}
          priceRange={priceRange}       // <-- Passed prop
          setPriceRange={setPriceRange} // <-- Passed prop
          isOpen={mobileFiltersOpen}
          onClose={() => setMobileFiltersOpen(false)}
        />

        {/* Products */}
        <main className="flex-1 p-5 sm:p-8">
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
            <EmptyState onReset={resetFilters} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  quantity={cart[product.id] || 0}
                  onAdd={() => updateQty(product.id, 1)}
                  onIncrement={() => updateQty(product.id, 1)}
                  onDecrement={() => updateQty(product.id, -1)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onIncrement={(id) => updateQty(id, 1)}
        onDecrement={(id) => updateQty(id, -1)}
        onPlaceOrder={handlePlaceOrder}
        placed={orderPlaced}
      />
    </div>
  );
}

export default App;