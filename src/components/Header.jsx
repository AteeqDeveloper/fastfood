function Header({ search, setSearch, cartCount, onCartClick, onFiltersClick }) {
  return (
    <header className="sticky top-0 z-30 bg-charcoal text-cream">
      <div className="flex items-center gap-3 px-4 sm:px-6 py-3">
        {/* Filters trigger - mobile only */}
        <button
          onClick={onFiltersClick}
          className="lg:hidden shrink-0 w-10 h-10 rounded-full bg-charcoal-light flex items-center justify-center"
          aria-label="Open filters"
        >
          ☰
        </button>

        {/* Brand */}
        <div className="shrink-0 flex items-baseline gap-1 mr-2">
          <span className="font-display font-extrabold text-xl sm:text-2xl tracking-tight">
            Spicy<span className="text-chili">Bites</span>
          </span>
        </div>

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
    </header>
  );
}

export default Header;