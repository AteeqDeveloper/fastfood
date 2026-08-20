import { useState, useMemo, useEffect } from "react";
import { supabaseClient } from "./lib/supabaseClient";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import CollectionPage from "./components/CollectionPage";
import CartDrawer from "./components/CartDrawer";
import ProductDetailModal from "./components/ProductDetailModal";
import AdminDashboard from "./components/AdminDashboard";
import TrackOrderPage from "./components/TrackOrderPage";
import { deals } from "./data/deals";

const CART_STORAGE_KEY = "crispybites_cart";

// Admin is reached only via the hidden "#admin" URL hash — there's no visible
// nav link to it. Visit yoursite.com/#admin to get to the dashboard.
function getInitialPage() {
  if (typeof window !== "undefined" && window.location.hash === "#admin") {
    return "admin";
  }
  return "home";
}

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") return parsed;
    }
  } catch {
    /* ignore */
  }
  return {};
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
  const [cart, setCart] = useState(loadCart);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [lastOrder, setLastOrder] = useState(null); // { id, phone } of the most recently placed order
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

  // Hidden admin route: reacts if someone types "#admin" into the URL bar
  // while the app is already open (no reload needed).
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#admin") setPage("admin");
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Persist cart locally (cart is per-browser, not per-account)
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

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

  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  // Deals are virtual products (fixed combo IDs 9000+) merged in here so the
  // existing cart/checkout/order code works for them with no special-casing.
  const cartLookupProducts = useMemo(() => [...products, ...deals], [products]);

  const cartItems = Object.entries(cart)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => {
      const product = cartLookupProducts.find((p) => p.id === Number(id));
      if (!product) return null;
      return { ...product, qty };
    })
    .filter(Boolean);

  const drinkProducts = useMemo(
    () => products.filter((p) => p.category === "Drinks"),
    [products]
  );

  const updateQty = (id, delta) => {
    setCart((prev) => {
      const next = { ...prev };
      const newQty = (next[id] || 0) + delta;
      if (newQty <= 0) delete next[id];
      else next[id] = newQty;
      return next;
    });
  };

  const resetFilters = () => {
    setCategory("All");
    setRating(0);
    setPriceRange(1500);
    setSearch("");
  };

  // Checkout -> writes a row into Supabase `orders`
  const handlePlaceOrder = async (formData) => {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const newOrder = {
      id: `SB-${Date.now().toString().slice(-6)}`,
      customer: formData?.name?.trim() || "Guest",
      phone: formData?.phone || "",
      address: formData?.address || "",
      items: cartItems.map((item) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        qty: item.qty,
      })),
      total,
      status: "Preparing",
    };

    setPlacingOrder(true);
    const { error } = await supabaseClient.from("orders").insert(newOrder);
    setPlacingOrder(false);

    if (error) {
      alert("Could not place order: " + error.message);
      return;
    }

    setLastOrder({ id: newOrder.id, phone: newOrder.phone });
    setOrderPlaced(true);
    setCart({});
  };

  // Called from the cart drawer's confirmation screen
  const handleCloseOrderConfirmation = () => {
    setOrderPlaced(false);
    setLastOrder(null);
    setCartOpen(false);
  };

  const handleTrackLastOrder = () => {
    setTrackPrefillPhone(lastOrder?.phone || "");
    setOrderPlaced(false);
    setLastOrder(null);
    setCartOpen(false);
    setPage("track");
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

  // Admin CRUD — all backed by Supabase, local `products` state kept in sync
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
    setCart((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
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

  // Full-page admin (auth-gated inside AdminDashboard, reached only via #admin)
  if (page === "admin") {
    return (
      <AdminDashboard
        products={products}
        onAdd={handleAddProduct}
        onUpdate={handleUpdateProduct}
        onDelete={handleDeleteProduct}
        onBack={() => {
          window.location.hash = "";
          setPage("home");
        }}
      />
    );
  }

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
        placing={placingOrder}
        orderId={lastOrder?.id}
        onTrackOrder={handleTrackLastOrder}
        onCloseConfirmation={handleCloseOrderConfirmation}
        drinkProducts={drinkProducts}
        onAddItem={(id) => updateQty(id, 1)}
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