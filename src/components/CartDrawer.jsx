import { useState, useEffect } from "react";

function CartDrawer({
  isOpen,
  onClose,
  items,
  onIncrement,
  onDecrement,
  onPlaceOrder,
  placed,
}) {
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", address: "" });
  const [errors, setErrors] = useState({});

  // Reset checkout form whenever the drawer closes
  useEffect(() => {
    if (!isOpen) {
      setShowForm(false);
      setFormData({ name: "", phone: "", address: "" });
      setErrors({});
    }
  }, [isOpen]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9+\-\s]{7,15}$/.test(formData.phone.trim())) {
      newErrors.phone = "Enter a valid phone number";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Delivery address is required";
    } else if (formData.address.trim().length < 10) {
      newErrors.address = "Please add a more complete address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = () => {
    if (!validate()) return;
    onPlaceOrder(formData);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      )}

      <aside
        className={`fixed top-0 right-0 z-50 h-dvh w-full sm:w-96 bg-white flex flex-col transition-transform duration-300 ${isOpen ? "translate-x-0 animate-slide-in" : "translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-ink/10">
          <h2 className="font-display font-bold text-xl text-ink">
            {showForm ? "Delivery Details" : "Your Order"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-ink"
          >
            ✕
          </button>
        </div>

        {!showForm ? (
          <>
            {/* CART VIEW */}
            <div className="flex-1 overflow-y-auto scroll-thin px-5 py-4">
              {items.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-3xl mb-3">🛒</p>
                  <p className="text-ink/60 text-sm">Your cart is empty.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-lg shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-ink truncate">
                          {item.title}
                        </h3>
                        <p className="text-chili font-bold text-sm mt-0.5">
                          Rs. {item.price * item.qty}
                        </p>
                        <div className="flex items-center gap-1 mt-1.5">
                          <button
                            onClick={() => onDecrement(item.id)}
                            className="w-6 h-6 rounded-full bg-cream text-ink font-bold flex items-center justify-center hover:bg-chili hover:text-white transition-colors text-xs"
                          >
                            −
                          </button>
                          <span className="w-6 text-center text-sm font-semibold">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => onIncrement(item.id)}
                            className="w-6 h-6 rounded-full bg-cream text-ink font-bold flex items-center justify-center hover:bg-chili hover:text-white transition-colors text-xs"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-ink/10 px-5 py-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-ink/60 text-sm font-medium">Total</span>
                  <span className="font-display font-extrabold text-xl text-ink">
                    Rs. {total}
                  </span>
                </div>
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full bg-chili hover:bg-chili-dark transition-colors text-white font-semibold py-3 rounded-full"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            {/* CHECKOUT FORM VIEW */}
            <div className="flex-1 overflow-y-auto scroll-thin px-5 py-4">
              <button
                onClick={() => setShowForm(false)}
                className="text-sm font-semibold text-ink/60 hover:text-chili transition-colors mb-5 flex items-center gap-1"
              >
                ← Back to cart
              </button>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-ink/60 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={handleChange("name")}
                    placeholder="Your name"
                    className="w-full bg-cream rounded-xl px-4 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-chili"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-ink/60 mb-1.5">
                    Phone Number <span className="text-chili">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange("phone")}
                    placeholder="03XX-XXXXXXX"
                    className={`w-full bg-cream rounded-xl px-4 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 ${errors.phone ? "ring-2 ring-chili" : "focus:ring-chili"
                      }`}
                  />
                  {errors.phone && (
                    <p className="text-chili text-xs font-medium mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-ink/60 mb-1.5">
                    Delivery Address <span className="text-chili">*</span>
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={handleChange("address")}
                    placeholder="House #, street, area, city"
                    rows={3}
                    className={`w-full bg-cream rounded-xl px-4 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 resize-none ${errors.address ? "ring-2 ring-chili" : "focus:ring-chili"
                      }`}
                  />
                  {errors.address && (
                    <p className="text-chili text-xs font-medium mt-1">{errors.address}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-ink/10 px-5 py-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-ink/60 text-sm font-medium">Total</span>
                <span className="font-display font-extrabold text-xl text-ink">
                  Rs. {total}
                </span>
              </div>
              <button
                onClick={handleConfirm}
                disabled={placed}
                className="w-full bg-chili hover:bg-chili-dark disabled:opacity-70 transition-colors text-white font-semibold py-3 rounded-full"
              >
                {placed ? "Order Placed ✓" : "Confirm Order"}
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

export default CartDrawer;