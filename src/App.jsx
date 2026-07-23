import { useState, useMemo, useEffect } from "react";
import { products } from "./data/products";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import CollectionPage from "./components/CollectionPage";
import CartDrawer from "./components/CartDrawer";
import ProductDetailModal from "./components/ProductDetailModal";

function App() {
  const [page, setPage] = useState("home"); // "home" | "collection"

  const [category, setCategory] = useState("All");
  const [rating, setRating] = useState(0);
  const [priceRange, setPriceRange] = useState(1500);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [cart, setCart] = useState({});
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Product detail modal state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filteredProducts = useMemo(() => {
    let list = products.filter((product) => {
      const categoryMatch = category === "All" || product.category === category;

      let ratingMatch = true;
      if (rating > 0) {
        ratingMatch = product.rating >= rating;
      }

      const priceMatch = product.price <= priceRange;

      const searchMatch =
        search.trim() === "" ||
        product.title.toLowerCase().includes(search.trim().toLowerCase());

      return categoryMatch && ratingMatch && priceMatch && searchMatch;
    });

    if (sortBy === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === "rating-desc") list = [...list].sort((a, b) => b.rating - a.rating);

    return list;
  }, [category, rating, priceRange, search, sortBy]);

  // Top-rated dishes shown on the home page
  const topProducts = useMemo(
    () => [...products].sort((a, b) => b.rating - a.rating).slice(0, 4),
    []
  );

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
    setPriceRange(1500);
    setSearch("");
  };

  const handlePlaceOrder = (customerDetails) => {
    setOrderPlaced(true);
    setTimeout(() => {
      setOrderPlaced(false);
      setCart({});
      setCartOpen(false);
    }, 1400);
  };

  const openProductDetails = (product) => {
    setSelectedProduct(product);
    setDetailModalOpen(true);
  };

  const goToCollection = () => setPage("collection");

  const handleCategorySelect = (cat) => {
    setCategory(cat);
    setPage("collection");
  };

  // Typing a search on the home page should jump straight to results
  useEffect(() => {
    if (page === "home" && search.trim() !== "") {
      setPage("collection");
    }
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  const anyOverlayOpen = mobileFiltersOpen || cartOpen || detailModalOpen;

  // Lock background scroll while any drawer/modal is open (mobile + desktop)
  useEffect(() => {
    if (anyOverlayOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [anyOverlayOpen]);

  // Close the topmost overlay on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key !== "Escape") return;
      if (detailModalOpen) setDetailModalOpen(false);
      else if (cartOpen) setCartOpen(false);
      else if (mobileFiltersOpen) setMobileFiltersOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [detailModalOpen, cartOpen, mobileFiltersOpen]);

  return (
    <div className="min-h-screen bg-cream">
      <Header
        search={search}
        setSearch={setSearch}
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
        onFiltersClick={() => setMobileFiltersOpen(true)}
        page={page}
        onNavigate={setPage}
      />

      {page === "home" ? (
        <HomePage
          topProducts={topProducts}
          categories={categories}
          onExplore={goToCollection}
          onCategorySelect={handleCategorySelect}
          cart={cart}
          onAdd={(id) => updateQty(id, 1)}
          onIncrement={(id) => updateQty(id, 1)}
          onDecrement={(id) => updateQty(id, -1)}
          onOpenDetails={openProductDetails}
        />
      ) : (
        <CollectionPage
          categories={categories}
          category={category}
          setCategory={setCategory}
          rating={rating}
          setRating={setRating}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          sortBy={sortBy}
          setSortBy={setSortBy}
          filteredProducts={filteredProducts}
          cart={cart}
          onAdd={(id) => updateQty(id, 1)}
          onIncrement={(id) => updateQty(id, 1)}
          onDecrement={(id) => updateQty(id, -1)}
          onOpenDetails={openProductDetails}
          mobileFiltersOpen={mobileFiltersOpen}
          onCloseMobileFilters={() => setMobileFiltersOpen(false)}
          onResetFilters={resetFilters}
        />
      )}

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onIncrement={(id) => updateQty(id, 1)}
        onDecrement={(id) => updateQty(id, -1)}
        onPlaceOrder={handlePlaceOrder}
        placed={orderPlaced}
      />

      <ProductDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        product={selectedProduct}
        quantity={selectedProduct ? cart[selectedProduct.id] || 0 : 0}
        onAdd={() => updateQty(selectedProduct.id, 1)}
        onIncrement={() => updateQty(selectedProduct.id, 1)}
        onDecrement={() => updateQty(selectedProduct.id, -1)}
      />
    </div>
  );
}

export default App;