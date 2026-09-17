import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import {
  Flame,
  Menu,
  X,
  ShoppingBag,
  Home,
  UtensilsCrossed,
  Tag,
  Truck,
  PhoneCall,
  Heart,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", page: "home", icon: Home },
  { label: "Menu", page: "menu", icon: UtensilsCrossed },
  { label: "About", page: "about", icon: Heart },
  { label: "Offers", page: "offers", icon: Tag, isHot: true },
  { label: "Track Order", page: "track", icon: Truck },
  { label: "Contact", page: "contact", icon: PhoneCall },
];

function Header({
  page,
  onNavigate,
  onCartClick,
}) {
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleNavClick = (targetPage) => {
    setMobileMenuOpen(false);
    onNavigate(targetPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 bg-[#3A2418] text-[#FFF3DC] transition-all duration-300 border-b border-[#C65D21]/20 ${
          scrolled ? "shadow-[0_10px_30px_-5px_rgba(58,36,24,0.4)]" : "shadow-md"
        }`}
      >
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-3 sm:gap-6 px-4 sm:px-6 lg:px-8 py-3.5">
          {/* 1. CrispyBites Brand Logo with Food Emblem */}
          <button
            onClick={() => handleNavClick("home")}
            className="flex items-center gap-2.5 sm:gap-3 group text-left cursor-pointer shrink-0"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#C65D21] flex items-center justify-center shadow-lg shadow-[#C65D21]/30 group-hover:scale-105 transition-transform shrink-0 border border-[#FFF3DC]/20">
              <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFFAF0] fill-[#FFFAF0]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-xl sm:text-2xl tracking-tight leading-none text-[#FFFAF0]">
                  Crispy<span className="text-[#C65D21]">Bites</span>
                </span>
                <span className="hidden sm:inline-block text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#E6A93A] text-[#3A2418] tracking-wider">
                  Artisan
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-bold text-[#FFF3DC]/60 tracking-wider uppercase mt-0.5">
               Street Food
              </p>
            </div>
          </button>

          {/* 2. Desktop Navigation Links (Home | Menu | About | Offers | Track Order | Contact) */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#4A3123]/70 px-3 py-1.5 rounded-full border border-[#FFF3DC]/10 shadow-inner">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = page === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => handleNavClick(item.page)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                    isActive
                      ? "bg-[#C65D21] text-white shadow-md shadow-[#C65D21]/30 scale-[1.02]"
                      : "text-[#FFF3DC]/80 hover:text-[#FFF3DC] hover:bg-[#FFF3DC]/10"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 opacity-80" />
                  <span>{item.label}</span>
                  {item.isHot && (
                    <span className="bg-[#E6A93A] text-[#3A2418] text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider animate-pulse">
                      Hot
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* 3. Right: Cart Button & Mobile Hamburger Menu */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Cart Button */}
            <button
              onClick={() => handleNavClick("cart")}
              className={`relative flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer ${
                page === "cart"
                  ? "bg-[#A94B16] text-white ring-2 ring-[#E6A93A]"
                  : "bg-[#C65D21] hover:bg-[#A94B16] text-white shadow-[#C65D21]/30 hover:shadow-[#C65D21]/40"
              }`}
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="bg-[#E6A93A] text-[#3A2418] text-[11px] sm:text-xs font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pop-in">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-2xl bg-[#4A3123] border border-[#FFF3DC]/15 flex items-center justify-center text-[#FFF3DC] hover:text-white hover:bg-[#4A3123]/80 active:scale-95 transition-all cursor-pointer"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-[#E6A93A]" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Down Menu Drawer */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out border-t ${
            mobileMenuOpen
              ? "max-h-[36rem] opacity-100 border-[#FFF3DC]/10 bg-[#3A2418] shadow-2xl"
              : "max-h-0 opacity-0 border-transparent pointer-events-none"
          }`}
        >
          <div className="max-w-screen-2xl mx-auto px-4 py-4 flex flex-col gap-2">
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#FFF3DC]/50 px-3 mb-1">
              CrispyBites Navigation
            </p>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = page === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => handleNavClick(item.page)}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-extrabold transition-all text-left cursor-pointer ${
                    isActive
                      ? "bg-[#C65D21] text-white shadow-md shadow-[#C65D21]/30"
                      : "bg-[#4A3123]/70 hover:bg-[#C65D21] text-[#FFF3DC] hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-[#E6A93A]" />
                    <span>{item.label}</span>
                    {item.isHot && (
                      <span className="bg-[#E6A93A] text-[#3A2418] text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                        Hot
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[#FFF3DC]/40">→</span>
                </button>
              );
            })}

            {/* Cart shortcut in mobile menu */}
            <button
              onClick={() => handleNavClick("cart")}
              className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-extrabold transition-all text-left cursor-pointer mt-1 ${
                page === "cart"
                  ? "bg-[#C65D21] text-white shadow-md"
                  : "bg-[#4A3123]/90 text-[#E6A93A] hover:bg-[#C65D21] hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4" />
                <span>View Cart & Checkout</span>
              </div>
              <span className="bg-[#E6A93A] text-[#3A2418] text-xs font-black px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Backdrop overlay for mobile menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}

export default Header;