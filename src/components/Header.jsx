import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import {
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Flame,
  Menu,
  X,
  Home,
  UtensilsCrossed,
  Truck,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", page: "home", icon: Home },
  { label: "Menu", page: "collection", icon: UtensilsCrossed },
  { label: "Track Order", page: "track", icon: Truck },
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close mobile menu on ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleNavClick = (targetPage) => {
    onNavigate(targetPage);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-charcoal/95 backdrop-blur-md text-cream border-b border-white/10 shadow-lg">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-6 lg:px-8 py-3">
          {/* Left: Brand & Mobile Filter Button */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Filters trigger - mobile only, collection page only */}
            {page === "collection" && (
              <button
                onClick={onFiltersClick}
                className="lg:hidden shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-charcoal-light flex items-center justify-center hover:bg-chili transition-colors border border-white/10 active:scale-95"
                aria-label="Open filters"
              >
                <SlidersHorizontal className="w-4 h-4 text-turmeric" />
              </button>
            )}

            {/* Brand */}
            <button
              onClick={() => handleNavClick("home")}
              className="flex items-center gap-2 group text-left"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-chili flex items-center justify-center shadow-md shadow-chili/30 group-hover:scale-105 transition-transform shrink-0">
                <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-white" />
              </div>
              <span className="font-display font-black text-lg sm:text-2xl tracking-tight leading-none">
                Crispy<span className="text-chili">Bites</span>
              </span>
            </button>
          </div>

          {/* Center: Desktop Nav links (hidden on tablet/mobile) */}
          <nav className="hidden lg:flex items-center gap-1 bg-charcoal-light/80 p-1 rounded-full border border-white/10 shrink-0">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.page}
                onClick={() => handleNavClick(item.page)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  page === item.page
                    ? "bg-chili text-white shadow-md shadow-chili/25 scale-[1.02]"
                    : "text-cream/70 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Search bar - expands flexibly */}
          <div className="flex-1 min-w-0 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-1 sm:mx-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink/40 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search menu..."
                className="w-full bg-cream/95 text-ink placeholder:text-ink/40 rounded-xl sm:rounded-2xl pl-8 sm:pl-9 pr-3 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-chili focus:bg-white shadow-inner transition-all"
              />
            </div>
          </div>

          {/* Right: Cart Button & Hamburger Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Cart Button */}
            <button
              onClick={onCartClick}
              className="relative flex items-center gap-1.5 sm:gap-2 bg-chili hover:bg-chili-dark active:scale-95 transition-all px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm text-white shadow-md shadow-chili/25"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden md:inline">Cart</span>
              {cartCount > 0 && (
                <span className="bg-turmeric text-charcoal text-[10px] sm:text-xs font-black w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-md animate-pop-in">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Hamburger Button - visible on tablet & mobile (< 1024px) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-charcoal-light border border-white/10 flex items-center justify-center text-cream hover:text-white hover:bg-charcoal-light/90 active:scale-95 transition-all"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-chili" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown / Slide-down Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out border-t ${
            mobileMenuOpen
              ? "max-h-96 opacity-100 border-white/10 bg-charcoal/98 shadow-2xl"
              : "max-h-0 opacity-0 border-transparent pointer-events-none"
          }`}
        >
          <div className="max-w-screen-2xl mx-auto px-4 py-4 flex flex-col gap-2">
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-cream/40 px-3 mb-1">
              Navigation
            </p>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = page === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => handleNavClick(item.page)}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                    isActive
                      ? "bg-chili text-white shadow-md shadow-chili/25"
                      : "bg-charcoal-light/70 text-cream/80 hover:bg-charcoal-light hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 opacity-80" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <span className="text-xs">●</span>}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Backdrop overlay for mobile menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}

export default Header;