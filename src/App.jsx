import { useState, useMemo, useEffect } from "react";
import { supabaseClient } from "./lib/supabaseClient";
import {
  fetchDealsService,
  saveDealService,
  deleteDealService,
  toggleDealActiveService,
} from "./lib/dealsService";
import { CartProvider } from "./context/CartContext";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import MenuPage from "./components/MenuPage";
import AboutPage from "./components/AboutPage";
import OffersPage from "./components/OffersPage";
import ContactPage from "./components/ContactPage";
import CartPage from "./components/CartPage";
import CollectionPage from "./components/CollectionPage";
import DealsPage from "./components/DealsPage";
import CartDrawer from "./components/CartDrawer";
import ProductDetailModal from "./components/ProductDetailModal";
import AdminDashboard from "./components/AdminDashboard";
import TrackOrderPage from "./components/TrackOrderPage";
import DrinkPromptModal from "./components/DrinkPromptModal";
import Footer from "./components/Footer";
import { DEFAULT_PRODUCTS } from "./data/defaultProducts";

function getInitialPage() {
  if (typeof window !== "undefined") {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    if (path.startsWith("/admin") || hash.includes("admin")) return "admin";
    if (path.startsWith("/menu") || hash.includes("menu")) return "menu";
    if (path.startsWith("/about") || hash.includes("about")) return "about";
    if (
      path.startsWith("/offers") ||
      path.startsWith("/deals") ||
      hash.includes("offers") ||
      hash.includes("deals")
    )
      return "offers";
    if (path.startsWith("/track") || hash.includes("track")) return "track";
    if (path.startsWith("/contact") || hash.includes("contact")) return "contact";
    if (path.startsWith("/cart") || hash.includes("cart")) return "cart";
  }
  return "home";
}

function Storefront({
  page,
  setPage,
  products,
  deals,
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
          onCartClick={() => setPage("cart")}
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
        ) : page === "offers" || page === "deals" ? (
          <OffersPage onExploreMenu={() => setPage("menu")} onNavigate={setPage} />
        ) : page === "about" ? (
          <AboutPage onNavigate={setPage} />
        ) : page === "contact" ? (
          <ContactPage />
        ) : page === "cart" ? (
          <CartPage onNavigate={setPage} onPrefillTrack={setTrackPrefillPhone} />
        ) : page === "menu" ? (
          <MenuPage
            products={products.length > 0 ? products : DEFAULT_PRODUCTS}
            onOpenDetails={openProductDetails}
            initialCategory={category}
          />
        ) : (
          <HomePage
            topProducts={
              topProducts.length > 0
                ? topProducts
                : DEFAULT_PRODUCTS.filter((p) => p.isPopular)
            }
            onOpenDetails={openProductDetails}
            onNavigate={setPage}
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
  const [page, setPage] = useState(getInitialPage); // "home" | "collection" | "track" | "deals" | "admin"
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [deals, setDeals] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
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

  // Load products and deals
  const fetchProducts = async () => {
    try {
      const { data, error } = await supabaseClient
        .from("products")
        .select("*")
        .order("id", { ascending: true });
      if (error || !data || data.length === 0) {
        setProducts(DEFAULT_PRODUCTS);
      } else {
        setProducts(data);
      }
    } catch {
      setProducts(DEFAULT_PRODUCTS);
    }
  };

  const fetchDeals = async () => {
    const loadedDeals = await fetchDealsService();
    setDeals(loadedDeals || []);
  };

  useEffect(() => {
    fetchProducts();
    fetchDeals();
  }, []);

  const handleNavigate = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (typeof window !== "undefined") {
      const path = newPage === "home" ? "/" : `/${newPage}`;
      window.history.pushState({}, "", path);
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

  // Admin Product CRUD
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

  // Admin Deals CRUD
  const handleSaveDeal = async (payload) => {
    const res = await saveDealService(payload, deals);
    setDeals(res.updatedList);
  };

  const handleDeleteDeal = async (id) => {
    const next = await deleteDealService(id, deals);
    setDeals(next);
  };

  const handleToggleDealActive = async (id, isActive) => {
    const next = await toggleDealActiveService(id, isActive, deals);
    setDeals(next);
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
        deals={deals}
        onAdd={handleAddProduct}
        onUpdate={handleUpdateProduct}
        onDelete={handleDeleteProduct}
        onSaveDeal={handleSaveDeal}
        onDeleteDeal={handleDeleteDeal}
        onToggleDealActive={handleToggleDealActive}
        onBack={() => {
          window.history.pushState({}, "", "/");
          setPage("home");
        }}
      />
    );
  }

  return (
    <CartProvider products={products} deals={deals}>
      <Storefront
        page={page}
        setPage={handleNavigate}
        products={products}
        deals={deals}
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