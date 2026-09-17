import { useState } from "react";
import { useCart } from "../context/CartContext";
import QuantityStepper from "./QuantityStepper";
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Bike,
  ShieldCheck,
  MessageCircle,
  Clock,
  Sparkles,
  Copy,
} from "lucide-react";

const WHATSAPP_NUMBER = "923001234567";

function CartPage({ onNavigate, onPrefillTrack }) {
  const {
    cartItems,
    updateQty,
    handlePlaceOrder,
    placingOrder,
    orderPlaced,
    lastOrder,
  } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [copied, setCopied] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deliveryFee = subtotal >= 2000 || subtotal === 0 ? 0 : 150;
  const grandTotal = subtotal + deliveryFee;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Please enter your name";
    if (!formData.phone.trim()) {
      errs.phone = "Phone number is required";
    } else if (!/^[0-9+\-\s]{7,15}$/.test(formData.phone.trim())) {
      errs.phone = "Enter a valid phone number";
    }
    if (!formData.address.trim()) {
      errs.address = "Delivery address is required";
    } else if (formData.address.trim().length < 8) {
      errs.address = "Please provide complete street / house details";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    if (!validate()) return;
    handlePlaceOrder(formData);
  };

  const handleWhatsAppOrder = () => {
    if (!validate()) return;
    const lines = [
      "🍔 *CrispyBites Order Submission*",
      "",
      ...cartItems.map(
        (item) => `• ${item.title} x${item.qty} — Rs. ${item.price * item.qty}`
      ),
      "",
      `Subtotal: Rs. ${subtotal}`,
      `Delivery: ${deliveryFee === 0 ? "FREE" : `Rs. ${deliveryFee}`}`,
      `*Grand Total: Rs. ${grandTotal}*`,
      "",
      `Customer: ${formData.name}`,
      `Phone: ${formData.phone}`,
      `Address: ${formData.address}`,
      formData.notes ? `Note: ${formData.notes}` : "",
    ];
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      lines.filter(Boolean).join("\n")
    )}`;
    window.open(url, "_blank");
  };

  const handleCopyOrderId = () => {
    if (!lastOrder?.id) return;
    navigator.clipboard.writeText(lastOrder.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Order Success Screen
  if (orderPlaced && lastOrder) {
    return (
      <main className="min-h-screen bg-[#FFF3DC] text-[#3A2418] bg-rustic-pattern py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto bg-[#FFFAF0] rounded-3xl p-8 sm:p-12 shadow-2xl border border-[#3A2418]/10 text-center">
          <div className="w-20 h-20 bg-[#66734A]/15 text-[#66734A] rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          <span className="text-xs font-black uppercase tracking-widest text-[#66734A] bg-[#66734A]/10 px-3.5 py-1 rounded-full inline-block mb-3">
            Grill Fired Up!
          </span>

          <h1 className="font-display font-black text-3xl sm:text-4xl text-[#3A2418] mb-3">
            Order Placed Successfully!
          </h1>

          <p className="text-[#3A2418]/70 text-sm sm:text-base mb-8 leading-relaxed font-medium">
            Our pitmasters have received your order and are searing your meal fresh on the iron.
            Estimated landing time: <strong className="text-[#C65D21]">25 mins</strong>.
          </p>

          {/* Order ID Pill */}
          <div className="bg-[#FFF3DC] rounded-2xl p-4 mb-8 border border-[#3A2418]/15 flex items-center justify-between">
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold text-[#3A2418]/50 block">Your Order ID</span>
              <span className="font-mono font-black text-lg text-[#3A2418]">{lastOrder.id}</span>
            </div>
            <button
              onClick={handleCopyOrderId}
              className="bg-[#FFFAF0] hover:bg-white text-[#3A2418] border border-[#3A2418]/20 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? "Copied! ✓" : "Copy"}</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                if (onPrefillTrack) onPrefillTrack(lastOrder.phone || lastOrder.id);
                onNavigate("track");
              }}
              className="bg-[#C65D21] hover:bg-[#A94B16] text-white font-extrabold px-8 py-3.5 rounded-2xl text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <Bike className="w-4 h-4" />
              <span>Track Live Status</span>
            </button>

            <button
              onClick={() => onNavigate("menu")}
              className="bg-[#FFFAF0] hover:bg-white text-[#3A2418] border border-[#3A2418]/20 font-bold px-6 py-3.5 rounded-2xl text-sm transition-all active:scale-95 cursor-pointer"
            >
              Explore More Dishes
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Empty Cart Screen
  if (cartItems.length === 0) {
    return (
      <main className="min-h-[75vh] bg-[#FFF3DC] text-[#3A2418] bg-rustic-pattern flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-[#FFFAF0] rounded-3xl p-8 sm:p-12 text-center shadow-xl border border-[#3A2418]/10">
          <div className="w-20 h-20 rounded-full bg-[#FFF3DC] text-[#3A2418]/40 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="font-display font-black text-2xl text-[#3A2418] mb-2">
            Your Cart is Empty
          </h2>
          <p className="text-[#3A2418]/70 text-sm mb-8 leading-relaxed font-medium">
            Looks like you haven't added any cast-iron smash burgers or sourdough pizzas yet.
          </p>
          <button
            onClick={() => onNavigate("menu")}
            className="bg-[#C65D21] hover:bg-[#A94B16] text-white font-extrabold px-8 py-3.5 rounded-full text-sm shadow-lg shadow-[#C65D21]/30 transition-all active:scale-95 cursor-pointer inline-flex items-center gap-2"
          >
            <span>Browse CrispyBites Menu</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    );
  }

  // Active Cart & Checkout Form
  return (
    <main className="min-h-screen bg-[#FFF3DC] text-[#3A2418] bg-rustic-pattern py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-2xl mx-auto">
        {/* Page Title */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#C65D21] bg-[#C65D21]/10 px-3.5 py-1 rounded-full inline-block mb-2 border border-[#C65D21]/20">
              Your Foodie Basket
            </span>
            <h1 className="font-display font-black text-3xl sm:text-5xl text-[#3A2418] tracking-tight">
              Review & Checkout
            </h1>
          </div>
          <button
            onClick={() => onNavigate("menu")}
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[#3A2418]/70 hover:text-[#C65D21] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Add More Items</span>
          </button>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Itemized Cart Items */}
          <div className="lg:col-span-7 bg-[#FFFAF0] rounded-3xl p-6 sm:p-8 shadow-xl border border-[#3A2418]/10 space-y-4">
            <h2 className="font-display font-black text-xl text-[#3A2418] pb-4 border-b border-[#3A2418]/10 flex items-center justify-between">
              <span>Order Items ({cartItems.reduce((s, i) => s + i.qty, 0)})</span>
              <span className="text-xs font-bold text-[#66734A]">Freshly Prepared</span>
            </h2>

            <div className="divide-y divide-[#3A2418]/10">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shrink-0 border border-[#3A2418]/10 bg-[#FFF3DC]"
                    />
                    <div>
                      <h3 className="font-display font-extrabold text-base sm:text-lg text-[#3A2418] leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#3A2418]/60 mt-0.5 font-medium line-clamp-1">
                        {item.category}
                      </p>
                      <p className="font-display font-black text-sm sm:text-base text-[#C65D21] mt-1">
                        Rs. {item.price} each
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <QuantityStepper
                      quantity={item.qty}
                      onIncrement={() => updateQty(item.id, 1)}
                      onDecrement={() => updateQty(item.id, -1)}
                      label={item.title}
                      size="sm"
                    />

                    <span className="font-display font-black text-base text-[#3A2418] min-w-[70px] text-right">
                      Rs. {item.price * item.qty}
                    </span>

                    <button
                      onClick={() => updateQty(item.id, -item.qty)}
                      className="text-[#3A2418]/40 hover:text-red-600 transition-colors p-1 cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#3A2418]/10 flex items-center justify-between text-xs text-[#3A2418]/60">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#66734A]" />
                <span>100% Halal Ingredients Guaranteed</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#C65D21]" />
                <span>Dispatched hot in 25 mins</span>
              </span>
            </div>
          </div>

          {/* Right Column: Checkout Form & Summary */}
          <div className="lg:col-span-5 space-y-6">
            {/* Delivery Details Form */}
            <div className="bg-[#FFFAF0] rounded-3xl p-6 sm:p-8 shadow-xl border border-[#3A2418]/10">
              <h3 className="font-display font-black text-xl text-[#3A2418] mb-4 pb-3 border-b border-[#3A2418]/10">
                Delivery Details
              </h3>

              <form onSubmit={handleCheckout} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#3A2418] uppercase tracking-wider mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Zeeshan Ahmed"
                    className="w-full bg-[#FFF3DC] border border-[#3A2418]/15 rounded-2xl px-4 py-2.5 text-sm font-semibold text-[#3A2418] focus:outline-none focus:ring-2 focus:ring-[#C65D21]"
                  />
                  {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3A2418] uppercase tracking-wider mb-1">
                    Phone Number (for rider) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="03001234567"
                    className="w-full bg-[#FFF3DC] border border-[#3A2418]/15 rounded-2xl px-4 py-2.5 text-sm font-semibold text-[#3A2418] focus:outline-none focus:ring-2 focus:ring-[#C65D21]"
                  />
                  {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3A2418] uppercase tracking-wider mb-1">
                    Delivery Address *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="House/Apartment #, Street, Area, Landmark"
                    className="w-full bg-[#FFF3DC] border border-[#3A2418]/15 rounded-2xl p-3 text-sm font-semibold text-[#3A2418] focus:outline-none focus:ring-2 focus:ring-[#C65D21]"
                  />
                  {errors.address && <p className="text-red-600 text-xs mt-1">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3A2418] uppercase tracking-wider mb-1">
                    Special Cooking Instructions (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="e.g. Extra sauce, no onions, ring doorbell"
                    className="w-full bg-[#FFF3DC] border border-[#3A2418]/15 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#3A2418] focus:outline-none focus:ring-2 focus:ring-[#C65D21]"
                  />
                </div>

                {/* Bill Breakdown */}
                <div className="pt-4 border-t border-[#3A2418]/10 space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between text-[#3A2418]/80 font-medium">
                    <span>Subtotal</span>
                    <span>Rs. {subtotal}</span>
                  </div>
                  <div className="flex justify-between text-[#3A2418]/80 font-medium">
                    <span>Delivery Fee</span>
                    <span>{deliveryFee === 0 ? "FREE" : `Rs. ${deliveryFee}`}</span>
                  </div>
                  {deliveryFee === 0 && (
                    <p className="text-[11px] text-[#66734A] font-bold">
                      ✓ Free Delivery unlocked (orders over Rs. 2,000)
                    </p>
                  )}
                  <div className="flex justify-between font-display font-black text-xl text-[#3A2418] pt-2 border-t border-[#3A2418]/10">
                    <span>Grand Total</span>
                    <span className="text-[#C65D21]">Rs. {grandTotal}</span>
                  </div>
                </div>

                {/* Primary Place Order Button */}
                <button
                  type="submit"
                  disabled={placingOrder}
                  className="w-full bg-[#C65D21] hover:bg-[#A94B16] text-white font-extrabold py-4 rounded-2xl text-base shadow-lg shadow-[#C65D21]/30 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 mt-4"
                >
                  <Bike className="w-5 h-5" />
                  <span>{placingOrder ? "Firing up grill..." : "Place Order (Cash on Delivery)"}</span>
                </button>

                {/* WhatsApp Order Alternative */}
                <button
                  type="button"
                  onClick={handleWhatsAppOrder}
                  className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold py-3.5 rounded-2xl text-sm transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-transparent" />
                  <span>Order Directly via WhatsApp</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default CartPage;
