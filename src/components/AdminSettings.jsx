import { useState } from "react";
import {
  Settings,
  Store,
  Printer,
  Bell,
  CreditCard,
  Check,
  Save,
  Sliders,
  DollarSign,
  Clock,
  Shield,
} from "lucide-react";

export default function AdminSettings() {
  const [storeName, setStoreName] = useState("FlameBite Fast Food & Grill");
  const [currency, setCurrency] = useState("PKR (Rs.)");
  const [taxPercent, setTaxPercent] = useState("0");
  const [deliveryFee, setDeliveryFee] = useState("150");
  const [autoPrintReceipt, setAutoPrintReceipt] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [orderAcceptance, setOrderAcceptance] = useState(true);
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-black text-2xl text-ink">Store &amp; System Settings</h2>
          <p className="text-xs sm:text-sm text-ink/50 mt-0.5">
            Configure restaurant information, currency, POS printer options, tax rates, and alert sounds.
          </p>
        </div>
      </div>

      {savedToast && (
        <div className="bg-basil text-white px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg animate-pop-in">
          <Check className="w-4 h-4" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Store Profile Card */}
        <div className="bg-white rounded-2xl p-6 border border-ink/5 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-ink/5">
            <Store className="w-5 h-5 text-chili" />
            <h3 className="font-display font-bold text-base text-ink">General Store Information</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink/60 mb-1.5">
                Restaurant Name
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full bg-cream rounded-xl px-4 py-2.5 text-xs sm:text-sm text-ink focus:outline-none focus:ring-2 focus:ring-chili"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink/60 mb-1.5">
                Currency Format
              </label>
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-cream rounded-xl px-4 py-2.5 text-xs sm:text-sm text-ink focus:outline-none focus:ring-2 focus:ring-chili"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink/60 mb-1.5">
                Sales Tax (%)
              </label>
              <input
                type="number"
                value={taxPercent}
                onChange={(e) => setTaxPercent(e.target.value)}
                className="w-full bg-cream rounded-xl px-4 py-2.5 text-xs sm:text-sm text-ink focus:outline-none focus:ring-2 focus:ring-chili"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink/60 mb-1.5">
                Standard Delivery Charge (Rs)
              </label>
              <input
                type="number"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(e.target.value)}
                className="w-full bg-cream rounded-xl px-4 py-2.5 text-xs sm:text-sm text-ink focus:outline-none focus:ring-2 focus:ring-chili"
              />
            </div>
          </div>
        </div>

        {/* Hardware & POS Options */}
        <div className="bg-white rounded-2xl p-6 border border-ink/5 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-ink/5">
            <Printer className="w-5 h-5 text-turmeric" />
            <h3 className="font-display font-bold text-base text-ink">POS &amp; Thermal Printer Preferences</h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-cream/50 hover:bg-cream transition-colors cursor-pointer">
              <div>
                <p className="font-bold text-xs sm:text-sm text-ink">Auto-Print Kitchen Slip on POS Checkout</p>
                <p className="text-[11px] text-ink/50">Automatically trigger browser thermal receipt dialog when bill is finalized</p>
              </div>
              <input
                type="checkbox"
                checked={autoPrintReceipt}
                onChange={(e) => setAutoPrintReceipt(e.target.checked)}
                className="w-5 h-5 accent-chili cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-cream/50 hover:bg-cream transition-colors cursor-pointer">
              <div>
                <p className="font-bold text-xs sm:text-sm text-ink">Audio Notification on New Orders</p>
                <p className="text-[11px] text-ink/50">Play chime sound when a customer places an online order</p>
              </div>
              <input
                type="checkbox"
                checked={soundAlerts}
                onChange={(e) => setSoundAlerts(e.target.checked)}
                className="w-5 h-5 accent-chili cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-cream/50 hover:bg-cream transition-colors cursor-pointer">
              <div>
                <p className="font-bold text-xs sm:text-sm text-ink">Accepting Online Orders</p>
                <p className="text-[11px] text-ink/50">Enable or disable ordering on customer storefront</p>
              </div>
              <input
                type="checkbox"
                checked={orderAcceptance}
                onChange={(e) => setOrderAcceptance(e.target.checked)}
                className="w-5 h-5 accent-chili cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-chili hover:bg-chili-dark text-white font-bold text-sm shadow-md shadow-chili/25 transition-transform active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save All Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
