import { useState, useMemo } from "react";
import ProductCard from "./ProductsCard";
import {
  Search,
  SlidersHorizontal,
  Flame,
  ArrowUpDown,
  UtensilsCrossed,
  Filter,
  Star,
  Sparkles,
} from "lucide-react";
import { getCategoryImage } from "../data/categories";

const MENU_CATEGORIES = [
  "All",
  "Burgers",
  "Pizza",
  "Fried Chicken",
  "Sandwiches",
  "Fries",
  "Snacks",
  "Drinks",
];

function MenuPage({
  products = [],
  onOpenDetails,
  initialCategory = "All",
}) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [minRating, setMinRating] = useState(0);

  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => {
      const matchCategory =
        selectedCategory === "All" ||
        p.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch =
        search.trim() === "" ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchRating = minRating === 0 || p.rating >= minRating;
      return matchCategory && matchSearch && matchRating;
    });

    if (sortBy === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === "rating-desc") list = [...list].sort((a, b) => b.rating - a.rating);

    return list;
  }, [products, selectedCategory, search, sortBy, minRating]);

  return (
    <main className="min-h-screen bg-[#FFF3DC] text-[#3A2418] bg-rustic-pattern pb-24">
      {/* 1. Menu Hero Banner */}
      <section className="bg-[#3A2418] text-[#FFF3DC] pt-12 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b-2 border-[#C65D21]/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C65D21]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-screen-2xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#FFFAF0]/10 border border-[#FFF3DC]/20 px-3.5 py-1.5 rounded-full mb-3">
                <Flame className="w-4 h-4 text-[#C65D21]" />
                <span className="text-xs font-black uppercase tracking-widest text-[#E6A93A]">
                  Fresh Off The Iron
                </span>
              </div>
              <h1 className="font-display font-black text-4xl sm:text-6xl text-[#FFFAF0] tracking-tight">
                Our Handcrafted Menu
              </h1>
              <p className="text-[#FFF3DC]/80 text-sm sm:text-base mt-2 max-w-xl font-medium">
                Every burger is smashed on cast iron, sourdough pizzas wood-fired, and potatoes
                cut fresh by hand daily. Cooked to order with authentic street passion.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="bg-[#C65D21] text-white font-display font-black text-sm px-4 py-2.5 rounded-2xl shadow-lg border border-[#FFF3DC]/20">
                {filteredProducts.length} Dishes Available
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Category Filter Rail */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7 relative z-20">
        <div className="bg-[#FFFAF0] rounded-3xl p-3 sm:p-4 shadow-xl border border-[#3A2418]/10 flex items-center gap-2 sm:gap-3 overflow-x-auto scroll-thin">
          {MENU_CATEGORIES.map((cat) => {
            const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`group shrink-0 px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all duration-200 flex items-center gap-2.5 cursor-pointer ${
                  isActive
                    ? "bg-[#C65D21] text-white shadow-md shadow-[#C65D21]/30 scale-105"
                    : "bg-[#FFF3DC] hover:bg-[#FFF3DC]/80 text-[#3A2418] border border-[#3A2418]/10"
                }`}
              >
                {cat !== "All" && (
                  <div className="w-6 h-6 rounded-lg overflow-hidden shrink-0 shadow-inner bg-[#3A2418]/10">
                    <img
                      src={getCategoryImage(cat)}
                      alt={cat}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Search & Sort Controls */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="bg-[#FFFAF0] rounded-2xl p-4 border border-[#3A2418]/10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3A2418]/45 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search burgers, pizzas, tenders..."
              className="w-full bg-[#FFF3DC] border border-[#3A2418]/15 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm font-semibold text-[#3A2418] placeholder:text-[#3A2418]/40 focus:outline-none focus:ring-2 focus:ring-[#C65D21]"
            />
          </div>

          {/* Filters & Sorting */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            {/* Rating Filter */}
            <div className="flex items-center gap-1.5 text-xs font-bold bg-[#FFF3DC] px-3 py-2 rounded-xl border border-[#3A2418]/10">
              <Star className="w-3.5 h-3.5 fill-[#E6A93A] text-[#E6A93A]" />
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="bg-transparent text-[#3A2418] focus:outline-none font-bold cursor-pointer"
              >
                <option value={0}>All Ratings</option>
                <option value={4.8}>4.8+ Stars</option>
                <option value={4.9}>4.9+ Stars</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs font-bold bg-[#FFF3DC] px-3 py-2 rounded-xl border border-[#3A2418]/10">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#C65D21]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-[#3A2418] focus:outline-none font-bold cursor-pointer"
              >
                <option value="default">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Highest Rated</option>
              </select>
            </div>

            {(search || minRating > 0 || sortBy !== "default" || selectedCategory !== "All") && (
              <button
                onClick={() => {
                  setSearch("");
                  setMinRating(0);
                  setSortBy("default");
                  setSelectedCategory("All");
                }}
                className="text-xs font-extrabold text-[#C65D21] hover:underline cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 4. Products Grid */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenDetails={() => onOpenDetails(product)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-[#FFFAF0] rounded-3xl border border-[#3A2418]/10 p-12 text-center max-w-md mx-auto mt-8 shadow-sm">
            <p className="text-4xl mb-3">🍳</p>
            <h3 className="font-display font-black text-xl text-[#3A2418]">No dishes found</h3>
            <p className="text-[#3A2418]/60 text-sm mt-1 mb-6 font-medium">
              We couldn't find items matching your search. Try adjusting the category or keyword.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearch("");
                setMinRating(0);
              }}
              className="bg-[#C65D21] text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-md cursor-pointer active:scale-95"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default MenuPage;
