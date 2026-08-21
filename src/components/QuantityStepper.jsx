/**
 * Shared +/−/quantity stepper used by ProductCard, DealsSection,
 * ProductDetailModal, and CartDrawer. Accepts an optional `size` prop
 * ("sm" for compact cart rows, "md" default for cards / modals).
 */
function QuantityStepper({ quantity, onIncrement, onDecrement, label = "item", size = "md" }) {
  const btnClass =
    size === "sm"
      ? "w-6 h-6 text-xs"
      : "w-7 h-7 text-sm";

  const countClass =
    size === "sm"
      ? "w-6 text-sm"
      : "w-6 text-sm";

  return (
    <div className="flex items-center gap-1 bg-cream rounded-full px-1 py-1">
      <button
        onClick={onDecrement}
        className={`${btnClass} rounded-full bg-white text-ink font-bold flex items-center justify-center hover:bg-chili hover:text-white transition-colors`}
        aria-label={`Remove one ${label}`}
      >
        −
      </button>
      <span className={`${countClass} text-center font-semibold`}>
        {quantity}
      </span>
      <button
        onClick={onIncrement}
        className={`${btnClass} rounded-full bg-white text-ink font-bold flex items-center justify-center hover:bg-chili hover:text-white transition-colors`}
        aria-label={`Add one more ${label}`}
      >
        +
      </button>
    </div>
  );
}

export default QuantityStepper;
