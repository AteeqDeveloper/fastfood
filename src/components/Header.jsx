import { useCart } from "../context/CartContext";
import { Search, ShoppingBag, SlidersHorizontal, Flame } from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", page: "home" },
  { label: "Menu", page: "collection" },
  { label: "Track Order", page: "track" },
];

function Header({
  search,
  setSearch,
  onCartClick,
  onFiltersClick,
  page,
  onNavigate,
}) {
  const { cartCount } = useCart();

  return (
    <header className="sticky top-0 z-30 bg-charcoal/95 backdrop-blur-md text-cream border-b border-white/10 shadow-lg">
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-3 px-4 sm:px-8 py-3.5">
        {/* Filters trigger - mobile only, collection page only */}
        {page === "collection" && (
          <button
            onClick={onFiltersClick}
            className="lg:hidden shrink-0 w-10 h-10 rounded-2xl bg-charcoal-light flex items-center justify-center hover:bg-chili transition-colors"
            aria-label="Open filters"
          >
            <SlidersHorizontal className="w-4 h-4 text-turmeric" />
          </button>
        )}

        {/* Brand */}
        <button
          onClick={() => onNavigate("home")}
          className="shrink-0 flex items-center gap-2 mr-2 group"
        >
          <div className="w-9 h-9 rounded-2xl bg-chili flex items-center justify-center shadow-md shadow-chili/30 group-hover:scale-105 transition-transform">
            <Flame className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="font-display font-black text-xl sm:text-2xl tracking-tight">
            Crispy<span className="text-chili">Bites</span>
          </span>
        </button>

        {/* Nav links - desktop */}
        <nav className="hidden md:flex items-center gap-1.5 mr-2 bg-charcoal-light/70 p-1 rounded-full border border-white/5">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                page === item.page
                  ? "bg-chili text-white shadow-md shadow-chili/25"
                  : "text-cream/70 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Search */}
        <div className="flex-1 min-w-0 max-w-lg">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search burgers, pizza, shawarma..."
              className="w-full min-w-0 bg-cream/90 text-ink placeholder:text-ink/40 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-chili focus:bg-white shadow-inner"
            />
          </div>
        </div>

        {/* Cart Button */}
        <button
          onClick={onCartClick}
          className="relative shrink-0 flex items-center gap-2 bg-chili hover:bg-chili-dark active:scale-95 transition-all px-4 sm:px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm text-white shadow-md shadow-chili/25"
        >
          <ShoppingBag className="w-4 h-4" />
          <span className="hidden sm:inline">Cart</span>
          {cartCount > 0 && (
            <span className="bg-turmeric text-charcoal text-xs font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pop-in">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Nav links - mobile sub-bar */}
      <nav className="md:hidden flex items-center gap-2 px-4 pb-3 -mt-0.5 overflow-x-auto scroll-thin">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.page}
            onClick={() => onNavigate(item.page)}
            className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
              page === item.page
                ? "bg-chili text-white shadow-sm"
                : "bg-charcoal-light text-cream/70 hover:text-white"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
}

export default Header;