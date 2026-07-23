function Header({
  search,
  setSearch,
  cartCount,
  onCartClick,
  onFiltersClick,
  page,
  onNavigate,
}) {
  return (
    <header className="sticky top-0 z-30 bg-charcoal text-cream">
      <div className="flex items-center gap-3 px-4 sm:px-6 py-3">
        {/* Filters trigger - mobile only, collection page only */}
        {page === "collection" && (
          <button
            onClick={onFiltersClick}
            className="lg:hidden shrink-0 w-10 h-10 rounded-full bg-charcoal-light flex items-center justify-center"
            aria-label="Open filters"
          >
            ☰
          </button>
        )}

        {/* Brand */}
        <button
          onClick={() => onNavigate("home")}
          className="shrink-0 flex items-baseline gap-1 mr-2"
        >
          <span className="font-display font-extrabold text-xl sm:text-2xl tracking-tight">
            Crispy<span className="text-chili">Bites</span>
          </span>
        </button>

        {/* Nav links - desktop */}
        <nav className="hidden md:flex items-center gap-1 mr-2">
          <button
            onClick={() => onNavigate("home")}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${page === "home"
                ? "bg-chili text-white"
                : "text-cream/70 hover:text-cream"
              }`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate("collection")}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${page === "collection"
                ? "bg-chili text-white"
                : "text-cream/70 hover:text-cream"
              }`}
          >
            Menu
          </button>
        </nav>

        {/* Search */}
        <div className="flex-1 min-w-0 max-w-xl">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-light/80 text-sm">
              🔍
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search burgers, pizza, shawarma..."
              className="w-full min-w-0 bg-cream text-ink placeholder:text-ink/40 rounded-full pl-9 pr-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-chili"
            />
          </div>
        </div>

        {/* Cart */}
        <button
          onClick={onCartClick}
          className="relative shrink-0 flex items-center gap-2 bg-chili hover:bg-chili-dark transition-colors px-3 sm:px-4 py-2 rounded-full font-semibold text-sm"
        >
          <span>🛒</span>
          <span className="hidden sm:inline">Cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-turmeric text-charcoal text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Nav links - mobile */}
      <nav className="md:hidden flex items-center gap-2 px-4 pb-2.5 -mt-0.5">
        <button
          onClick={() => onNavigate("home")}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${page === "home"
              ? "bg-chili text-white"
              : "bg-charcoal-light text-cream/70"
            }`}
        >
          Home
        </button>
        <button
          onClick={() => onNavigate("collection")}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${page === "collection"
              ? "bg-chili text-white"
              : "bg-charcoal-light text-cream/70"
            }`}
        >
          Menu
        </button>
      </nav>
    </header>
  );
}

export default Header;