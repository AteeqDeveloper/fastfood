import { useState, useMemo, useEffect } from "react";
import { supabaseClient } from "./lib/supabaseClient";
import { CartProvider } from "./context/CartContext";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import CollectionPage from "./components/CollectionPage";
import CartDrawer from "./components/CartDrawer";
import ProductDetailModal from "./components/ProductDetailModal";
import AdminDashboard from "./components/AdminDashboard";
import TrackOrderPage from "./components/TrackOrderPage";
import DrinkPromptModal from "./components/DrinkPromptModal";
import Footer from "./components/Footer";

function getInitialPage() {
  if (typeof window !== "undefined") {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    if (path === "/admin" || path === "/admin/" || hash === "#admin" || hash === "#/admin") {
      return "admin";
    }
  }
  return "home";
}

function Storefront({
  page,
  setPage,
  products,
  productsLoading,
  productsError,
  category,
  setCategory,
  rating,
  setRating,
  priceRange,
  setPriceRange,
  search,
  setSearch,
  sortBy,
  setSortBy,
  filteredProducts,
  categories,
  topProducts,
  mobileFiltersOpen,
  setMobileFiltersOpen,
  cartOpen,
  setCartOpen,
  selectedProduct,
  detailModalOpen,
  setDetailModalOpen,
  openProductDetails,
  resetFilters,
  trackPrefillPhone,
  setTrackPrefillPhone,
}) {
  return (
    <div className="min-h-screen bg-cream flex flex-col justify-between">
      <div>
        <Header
          search={search}
          setSearch={setSearch}
          onCartClick={() => setCartOpen(true)}
          onFiltersClick={() => setMobileFiltersOpen(true)}
          page={page}
          onNavigate={setPage}
        />

        {productsError && page !== "track" && (
          <div className="bg-red-50 text-red-600 text-sm font-medium text-center py-2 px-4">
            Could not load menu: {productsError}
          </div>
        )}

        {page === "track" ? (
          <TrackOrderPage initialPhone={trackPrefillPhone} />
        ) : productsLoading ? (
          <div className="flex items-center justify-center py-32">
            <p className="text-ink/40 text-sm font-medium">Loading menu…</p>
          </div>
        ) : page === "home" ? (
          <HomePage
            topProducts={topProducts}
            categories={categories}
            onExplore={() => setPage("collection")}
            onCategorySelect={(cat) => {
              setCategory(cat);
              setPage("collection");
            }}
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
            onOpenDetails={openProductDetails}
            mobileFiltersOpen={mobileFiltersOpen}
            onCloseMobileFilters={() => setMobileFiltersOpen(false)}
            onResetFilters={resetFilters}
          />
        )}
      </div>

      <Footer onNavigate={setPage} />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onTrackOrder={() => {
          setCartOpen(false);
          setPage("track");
        }}
        onCloseConfirmation={() => setCartOpen(false)}
      />

      <ProductDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        product={selectedProduct}
      />

      <DrinkPromptModal />
    </div>
  );
}

function App() {
  const [page, setPage] = useState(getInitialPage); // "home" | "collection" | "track" | "admin"
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");

  const [category, setCategory] = useState("All");
  const [rating, setRating] = useState(0);
  const [priceRange, setPriceRange] = useState(1500);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [trackPrefillPhone, setTrackPrefillPhone] = useState("");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // Load products from Supabase
  const fetchProducts = async () => {
    setProductsLoading(true);
    const { data, error } = await supabaseClient
      .from("products")
      .select("*")
      .order("id", { ascending: true });
    if (error) {
      setProductsError(error.message);
    } else {
      setProductsError("");
      setProducts(data || []);
    }
    setProductsLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleNavigate = (newPage) => {
    setPage(newPage);
    if (typeof window !== "undefined") {
      if (newPage === "admin") {
        window.history.pushState({}, "", "/admin");
      } else if (window.location.pathname === "/admin") {
        window.history.pushState({}, "", "/");
      }
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      setPage(getInitialPage());
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filteredProducts = useMemo(() => {
    let list = products.filter((product) => {
      const categoryMatch = category === "All" || product.category === category;
      let ratingMatch = true;
      if (rating > 0) ratingMatch = product.rating >= rating;
      const priceMatch = product.price <= priceRange;
      const searchMatch =
        search.trim() === "" ||
        product.title.toLowerCase().includes(search.trim().toLowerCase());
      return categoryMatch && ratingMatch && priceMatch && searchMatch;
    });

    if (sortBy === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === "rating-desc")
      list = [...list].sort((a, b) => b.rating - a.rating);

    return list;
  }, [products, category, rating, priceRange, search, sortBy]);

  const topProducts = useMemo(
    () => [...products].sort((a, b) => b.rating - a.rating).slice(0, 4),
    [products]
  );

  const resetFilters = () => {
    setCategory("All");
    setRating(0);
    setPriceRange(1500);
    setSearch("");
  };

  const openProductDetails = (product) => {
    setSelectedProduct(product);
    setDetailModalOpen(true);
  };

  // Admin CRUD
  const handleAddProduct = async (payload) => {
    const { data, error } = await supabaseClient
      .from("products")
      .insert(payload)
      .select()
      .single();
    if (error) {
      alert("Could not add product: " + error.message);
      return;
    }
    setProducts((prev) => [...prev, data]);
  };

  const handleUpdateProduct = async (id, payload) => {
    const { data, error } = await supabaseClient
      .from("products")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) {
      alert("Could not update product: " + error.message);
      return;
    }
    setProducts((prev) => prev.map((p) => (p.id === id ? data : p)));
  };

  const handleDeleteProduct = async (id) => {
    const { error } = await supabaseClient.from("products").delete().eq("id", id);
    if (error) {
      alert("Could not delete product: " + error.message);
      return;
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  useEffect(() => {
    if (page === "home" && search.trim() !== "") {
      setPage("collection");
    }
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  const anyOverlayOpen = mobileFiltersOpen || cartOpen || detailModalOpen;

  useEffect(() => {
    if (anyOverlayOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [anyOverlayOpen]);

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

  // Full-page admin
  if (page === "admin") {
    return (
      <AdminDashboard
        products={products}
        onAdd={handleAddProduct}
        onUpdate={handleUpdateProduct}
        onDelete={handleDeleteProduct}
        onBack={() => {
          window.history.pushState({}, "", "/");
          setPage("home");
        }}
      />
    );
  }

  return (
    <CartProvider products={products}>
      <Storefront
        page={page}
        setPage={handleNavigate}
        products={products}
        productsLoading={productsLoading}
        productsError={productsError}
        category={category}
        setCategory={setCategory}
        rating={rating}
        setRating={setRating}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        search={search}
        setSearch={setSearch}
        sortBy={sortBy}
        setSortBy={setSortBy}
        filteredProducts={filteredProducts}
        categories={categories}
        topProducts={topProducts}
        mobileFiltersOpen={mobileFiltersOpen}
        setMobileFiltersOpen={setMobileFiltersOpen}
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
        selectedProduct={selectedProduct}
        detailModalOpen={detailModalOpen}
        setDetailModalOpen={setDetailModalOpen}
        openProductDetails={openProductDetails}
        resetFilters={resetFilters}
        trackPrefillPhone={trackPrefillPhone}
        setTrackPrefillPhone={setTrackPrefillPhone}
      />
    </CartProvider>
  );
}

export default App;