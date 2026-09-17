import ProductCard from "./ProductsCard";
import {
  Flame,
  Clock,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Star,
  ChefHat,
  Truck,
  Heart,
  Tag,
  BadgePercent,
  UtensilsCrossed,
  MapPin,
  CheckCircle2,
} from "lucide-react";

const WHY_CHOOSE_US = [
  {
    icon: Flame,
    title: "Fresh Ingredients",
    desc: "100% prime grass-fed beef, hand-trimmed produce, and artisan brioche buns baked fresh each morning. Never frozen.",
    color: "bg-[#C65D21]/10 text-[#C65D21] border-[#C65D21]/20",
    badge: "Daily Sourced",
  },
  {
    icon: ChefHat,
    title: "Handcrafted Recipes",
    desc: "Custom cast-iron smash crusts, 48-hour fermented sourdough, and proprietary fire-simmered sauces crafted from scratch.",
    color: "bg-[#66734A]/10 text-[#66734A] border-[#66734A]/20",
    badge: "Artisan Cooked",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    desc: "Dispatched in double-wall thermal insulated carriers ensuring burgers arrive sizzling and fries stay audibly crispy.",
    color: "bg-[#E6A93A]/15 text-[#3A2418] border-[#E6A93A]/30",
    badge: "Avg 25 Mins",
  },
  {
    icon: ShieldCheck,
    title: "Quality Guaranteed",
    desc: "Every single order passes our strict kitchen quality check. If your meal isn't hot and delicious, we remake it instantly.",
    color: "bg-[#3A2418]/10 text-[#3A2418] border-[#3A2418]/20",
    badge: "100% Promise",
  },
];

const REVIEWS = [
  {
    name: "Zeeshan Ahmed",
    rating: 5,
    role: "Verified Foodie • Clifton",
    quote:
      "The Artisan Smokehouse Smash is easily the best burger in town. The cast-iron sear, smoky caramelized onions, and house blaze sauce are on another level!",
    dish: "Artisan Smokehouse Smash",
  },
  {
    name: "Ayesha Malik",
    rating: 5,
    role: "Verified Foodie • Gulshan",
    quote:
      "The wood-fired pepperoni with hot honey drizzle blew my mind. Authentic charred crust with actual chew, not like typical fast food cardboard. 10/10!",
    dish: "Wood-Fired Pepperoni & Honey",
  },
  {
    name: "Hamza Farooq",
    rating: 5,
    role: "Verified Foodie • DHA",
    quote:
      "Hand-cut rosemary fries stayed crispy even after delivery in their stamped thermal box. Nashville tenders have serious heat and crunch!",
    dish: "Nashville Tenders & Herb Fries",
  },
];

function HomePage({
  topProducts = [],
  onOpenDetails,
  onNavigate,
}) {
  return (
    <main className="flex-1 min-w-0 bg-[#FFF3DC] text-[#3A2418] bg-rustic-pattern pb-20">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24 border-b border-[#3A2418]/10">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 xl:col-span-6 z-10">
              {/* Handcrafted Badge */}
              <div className="inline-flex items-center gap-2 bg-[#FFFAF0] border border-[#C65D21]/30 px-4 py-1.5 rounded-full mb-6 shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C65D21] animate-ping" />
                <span className="text-xs font-black uppercase tracking-widest text-[#C65D21]">
                  Authentic Street Grill • Est. 2024
                </span>
              </div>

              {/* Bold Headline */}
              <h1 className="font-display font-black text-4xl sm:text-6xl xl:text-7xl text-[#3A2418] leading-[1.06] tracking-tight mb-6">
                Handcrafted Flavor, <br className="hidden sm:inline" />
                <span className="text-[#C65D21] relative inline-block">
                  Made Fresh.
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-3 text-[#E6A93A]"
                    viewBox="0 0 200 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 6C50 2 150 2 198 6"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              {/* Short Description */}
              <p className="text-[#3A2418]/80 text-base sm:text-lg max-w-xl mb-8 leading-relaxed font-medium">
                Small-batch cast-iron smash burgers, 48-hour sourdough pizzas, hand-cut russet
                fries, and secret house dips. Prepared fresh to order with genuine street-food craft.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-5">
                <button
                  onClick={() => onNavigate("menu")}
                  className="bg-[#C65D21] hover:bg-[#A94B16] active:scale-95 text-white font-extrabold px-8 py-4 rounded-full text-base sm:text-lg shadow-xl shadow-[#C65D21]/30 hover:shadow-[#C65D21]/50 transition-all flex items-center gap-3 cursor-pointer"
                >
                  <span>Order Now</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </button>

                <button
                  onClick={() => onNavigate("menu")}
                  className="bg-[#FFFAF0] hover:bg-white active:scale-95 text-[#3A2418] border-2 border-[#3A2418]/20 hover:border-[#3A2418] font-bold px-7 py-4 rounded-full text-base transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Explore Menu</span>
                  <UtensilsCrossed className="w-4 h-4 text-[#C65D21]" />
                </button>
              </div>

              {/* Trust Metrics */}
              <div className="flex flex-wrap items-center gap-6 sm:gap-8 mt-10 pt-8 border-t border-[#3A2418]/15 text-xs sm:text-sm text-[#3A2418]/80 font-semibold">
                <div className="flex items-center gap-2">
                  <span className="text-[#E6A93A] text-lg">★★★★★</span>
                  <span className="font-extrabold text-[#3A2418]">4.9 / 5.0</span>
                  <span className="text-[#3A2418]/50">(2,400+ reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#C65D21]" />
                  <span>Wood & Cast Iron</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#66734A]" />
                  <span>100% Halal Certified</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Column */}
            <div className="lg:col-span-5 xl:col-span-6 relative flex justify-center items-center">
              <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[#E6A93A]/20 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-6 -right-6 w-64 h-64 rounded-full bg-[#C65D21]/15 blur-2xl pointer-events-none" />

              <div className="relative z-10 w-full max-w-md sm:max-w-lg">
                <div className="relative rounded-3xl overflow-hidden border-4 border-[#FFFAF0] shadow-[0_25px_60px_-15px_rgba(58,36,24,0.3)] group">
                  <img
                    src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900&auto=format&fit=crop&q=80"
                    alt="CrispyBites Double Smash Burger"
                    className="w-full h-80 sm:h-96 lg:h-[28rem] object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3A2418]/80 via-transparent to-transparent" />

                  {/* Stamp Seal */}
                  <div className="absolute top-4 right-4 bg-[#FFFAF0] text-[#3A2418] border-2 border-dashed border-[#C65D21] p-3 rounded-2xl shadow-xl transform rotate-3 flex flex-col items-center">
                    <span className="text-[10px] font-black uppercase text-[#C65D21] tracking-widest">
                      CrispyBites
                    </span>
                    <span className="font-display font-black text-sm">SEALED ON IRON</span>
                  </div>

                  <div className="absolute bottom-5 left-5 right-5 text-[#FFFAF0]">
                    <span className="bg-[#C65D21] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
                      Signature Bestseller
                    </span>
                    <h3 className="font-display font-black text-xl sm:text-2xl leading-tight">
                      Double Prime Angus Smash Burger
                    </h3>
                    <p className="text-xs text-[#FFF3DC]/80 font-medium mt-1">
                      Melted Cheddar • Caramelized Onions • House Blaze Sauce
                    </p>
                  </div>
                </div>

                {/* Floating Farm Fresh Badge */}
                <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-[#FFFAF0] border border-[#3A2418]/10 p-3.5 sm:p-4 rounded-2xl shadow-xl flex items-center gap-3 z-20">
                  <div className="w-10 h-10 rounded-xl bg-[#66734A]/15 text-[#66734A] flex items-center justify-center font-bold">
                    🌿
                  </div>
                  <div>
                    <p className="text-xs font-black text-[#3A2418] uppercase tracking-wider">
                      100% Fresh Daily
                    </p>
                    <p className="text-[11px] text-[#3A2418]/60 font-medium">Never frozen meat</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. POPULAR ITEMS PREVIEW */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 border-b border-[#3A2418]/10">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-[#E6A93A]/20 border border-[#E6A93A]/40 text-[#3A2418] text-xs font-black uppercase tracking-widest px-3.5 py-1 rounded-full mb-2">
                <Star className="w-3.5 h-3.5 fill-[#E6A93A] text-[#E6A93A]" />
                Customer Favorites
              </div>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-[#3A2418] tracking-tight">
                Popular Items
              </h2>
              <p className="text-[#3A2418]/70 text-sm sm:text-base mt-1.5 font-medium">
                The dishes our foodies keep ordering again and again.
              </p>
            </div>

            <button
              onClick={() => onNavigate("menu")}
              className="flex items-center gap-2 text-sm font-extrabold text-[#C65D21] hover:text-[#A94B16] transition-colors group cursor-pointer self-start sm:self-auto"
            >
              <span>View Full Menu</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
            {topProducts.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenDetails={() => onOpenDetails(product)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SPECIAL OFFER PREVIEW BANNER */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-16 border-b border-[#3A2418]/10">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[2.5rem] bg-[#C65D21] text-white p-8 sm:p-12 overflow-hidden shadow-2xl border-2 border-[#E6A93A]/30">
            <div className="absolute -top-12 -right-12 w-80 h-80 bg-[#E6A93A]/25 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <span className="inline-flex items-center gap-2 bg-[#E6A93A] text-[#3A2418] text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider mb-4 shadow-md">
                  <BadgePercent className="w-4 h-4" />
                  Limited Deal
                </span>

                <h3 className="font-display font-black text-3xl sm:text-5xl text-white leading-tight">
                  Get 20% Off Your First Craving
                </h3>

                <p className="text-[#FFF3DC]/90 text-sm sm:text-base mt-2 max-w-lg font-medium">
                  Use promo voucher at checkout and experience CrispyBites handcrafted street flavor.
                </p>

                <div className="flex flex-wrap items-center gap-4 mt-6">
                  <button
                    onClick={() => onNavigate("offers")}
                    className="bg-[#3A2418] hover:bg-[#2A1810] text-[#FFF3DC] font-extrabold px-8 py-3.5 rounded-2xl text-sm transition-all active:scale-95 flex items-center gap-2 cursor-pointer shadow-lg border border-[#FFF3DC]/20"
                  >
                    <span>View All Offers</span>
                    <ArrowRight className="w-4 h-4 text-[#E6A93A]" />
                  </button>
                  <button
                    onClick={() => onNavigate("menu")}
                    className="bg-[#FFFAF0] text-[#3A2418] font-extrabold px-7 py-3.5 rounded-2xl text-sm transition-all active:scale-95 cursor-pointer shadow-sm hover:bg-white"
                  >
                    Order Now
                  </button>
                </div>
              </div>

              <div className="lg:col-span-4 flex justify-center">
                <div className="relative rounded-3xl overflow-hidden border-4 border-[#FFFAF0] shadow-2xl transform rotate-2 max-w-xs">
                  <img
                    src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=80"
                    alt="Loaded Feast Platter"
                    className="w-full h-52 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-[#E6A93A] text-[#3A2418] font-display font-black text-xs px-2.5 py-1 rounded-full uppercase tracking-wider">
                    20% OFF
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. WHY CHOOSE CRISPYBITES */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 border-b border-[#3A2418]/10">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-black uppercase tracking-widest text-[#C65D21] bg-[#C65D21]/10 px-4 py-1.5 rounded-full inline-block mb-3 border border-[#C65D21]/20">
              The CrispyBites Standard
            </span>
            <h2 className="font-display font-black text-3xl sm:text-5xl text-[#3A2418] tracking-tight">
              Why Choose CrispyBites
            </h2>
            <p className="text-[#3A2418]/70 text-sm sm:text-base mt-2 font-medium">
              We never take shortcuts. Every element is crafted to bring maximum crunch and grill flavor.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
            {WHY_CHOOSE_US.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-[#FFFAF0] rounded-3xl p-6 sm:p-7 border border-[#3A2418]/10 shadow-[0_4px_20px_-4px_rgba(58,36,24,0.06)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className={`w-12 h-12 rounded-2xl ${item.color} border flex items-center justify-center`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md bg-[#3A2418]/5 text-[#3A2418]/70 border border-[#3A2418]/10">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="font-display font-black text-lg sm:text-xl text-[#3A2418] mb-2 leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-[#3A2418]/70 text-xs sm:text-sm leading-relaxed font-medium">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. CUSTOMER REVIEWS PREVIEW */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-black uppercase tracking-widest text-[#E6A93A] bg-[#E6A93A]/20 px-4 py-1.5 rounded-full inline-block mb-3 border border-[#E6A93A]/40 text-[#3A2418]">
              Street Cred
            </span>
            <h2 className="font-display font-black text-3xl sm:text-5xl text-[#3A2418] tracking-tight">
              Loved by 15,000+ Foodies
            </h2>
            <p className="text-[#3A2418]/70 text-sm sm:text-base mt-2 font-medium">
              Real reviews from verified diners across town.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-7">
            {REVIEWS.map((rev) => (
              <div
                key={rev.name}
                className="bg-[#FFFAF0] rounded-3xl p-7 border border-[#3A2418]/10 shadow-[0_4px_20px_-4px_rgba(58,36,24,0.06)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-[#E6A93A] mb-4">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#E6A93A]" />
                    ))}
                    <span className="text-xs font-black text-[#3A2418] ml-1.5">5.0</span>
                  </div>

                  <p className="text-[#3A2418]/85 text-sm sm:text-base leading-relaxed italic font-medium">
                    "{rev.quote}"
                  </p>

                  <div className="mt-4 inline-block bg-[#FFF3DC] px-3 py-1 rounded-full text-[11px] font-bold text-[#C65D21] border border-[#C65D21]/20">
                    Ordered: {rev.dish}
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-[#3A2418]/10 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-[#C65D21] text-white font-display font-black text-sm flex items-center justify-center shadow-md">
                    {rev.name[0]}
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm sm:text-base text-[#3A2418]">
                      {rev.name}
                    </h4>
                    <p className="text-xs text-[#3A2418]/50 font-semibold">{rev.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default HomePage;