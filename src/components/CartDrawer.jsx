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

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      )}

      <aside
        className={`fixed top-0 right-0 z-50 h-screen w-full sm:w-96 bg-white flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0 animate-slide-in" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-ink/10">
          <h2 className="font-display font-bold text-xl text-ink">
            Your Order
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-ink"
          >
            ✕
          </button>
        </div>

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
              onClick={onPlaceOrder}
              className="w-full bg-chili hover:bg-chili-dark transition-colors text-white font-semibold py-3 rounded-full"
            >
              {placed ? "Order Placed ✓" : "Place Order"}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

export default CartDrawer;
