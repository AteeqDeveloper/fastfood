import { createContext, useContext, useState, useMemo, useEffect, useCallback } from "react";
import { supabaseClient } from "../lib/supabaseClient";
import { deals } from "../data/deals";

const CART_STORAGE_KEY = "crispybites_cart";

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

const CartContext = createContext(null);

export function CartProvider({ products, children }) {
  const [cart, setCart] = useState(loadCart);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [lastOrder, setLastOrder] = useState(null); // { id, phone }

  const [drinkPromptOpen, setDrinkPromptOpen] = useState(false);
  const [drinkPromptProduct, setDrinkPromptProduct] = useState(null);

  // Persist cart locally
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  // Deals are virtual products (fixed combo IDs 9000+) merged in so the
  // existing cart/checkout/order code works for them with no special-casing.
  const cartLookupProducts = useMemo(() => [...products, ...deals], [products]);

  const cartItems = useMemo(
    () =>
      Object.entries(cart)
        .filter(([, qty]) => qty > 0)
        .map(([id, qty]) => {
          const product = cartLookupProducts.find((p) => p.id === Number(id));
          if (!product) return null;
          return { ...product, qty };
        })
        .filter(Boolean),
    [cart, cartLookupProducts]
  );

  const drinkProducts = useMemo(
    () => products.filter((p) => p.category === "Drinks"),
    [products]
  );

  const updateQty = useCallback((id, delta) => {
    setCart((prev) => {
      const next = { ...prev };
      const newQty = (next[id] || 0) + delta;
      if (newQty <= 0) delete next[id];
      else next[id] = newQty;
      return next;
    });
  }, []);

  // "Add to Cart" action — adds the item, then optionally prompts for a drink
  const handleAddToCart = useCallback(
    (id) => {
      const product = cartLookupProducts.find((p) => p.id === id);
      const alreadyHasDrink = cartItems.some((i) => i.category === "Drinks");

      updateQty(id, 1);

      if (
        product &&
        product.category !== "Drinks" &&
        product.category !== "Deal" &&
        drinkProducts.length > 0 &&
        !alreadyHasDrink
      ) {
        setDrinkPromptProduct(product);
        setDrinkPromptOpen(true);
      }
    },
    [cartLookupProducts, cartItems, drinkProducts, updateQty]
  );

  const handleSelectDrink = useCallback(
    (drinkId) => {
      updateQty(drinkId, 1);
      setDrinkPromptOpen(false);
    },
    [updateQty]
  );

  const handleSkipDrinkPrompt = useCallback(() => setDrinkPromptOpen(false), []);

  // Checkout → writes a row into Supabase `orders`
  const handlePlaceOrder = useCallback(
    async (formData) => {
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
    },
    [cartItems]
  );

  const value = useMemo(
    () => ({
      cart,
      cartItems,
      cartCount,
      updateQty,
      handleAddToCart,
      handlePlaceOrder,
      placingOrder,
      orderPlaced,
      setOrderPlaced,
      lastOrder,
      setLastOrder,
      drinkProducts,
      drinkPromptOpen,
      setDrinkPromptOpen,
      drinkPromptProduct,
      handleSelectDrink,
      handleSkipDrinkPrompt,
    }),
    [
      cart,
      cartItems,
      cartCount,
      updateQty,
      handleAddToCart,
      handlePlaceOrder,
      placingOrder,
      orderPlaced,
      lastOrder,
      drinkProducts,
      drinkPromptOpen,
      drinkPromptProduct,
      handleSelectDrink,
      handleSkipDrinkPrompt,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
