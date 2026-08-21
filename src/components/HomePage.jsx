import ProductCard from "./ProductsCard";
import Carousel from "./Carousel";
import DealsSection from "./DealsSection";
import useReveal from "../hooks/useReveal";
import { deals } from "../data/deals";
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
  Smile,
} from "lucide-react";

const CATEGORY_ICONS = {
  Burger: "🍔",
  Shawarma: "🌯",
  Pizza: "🍕",
  Sides: "🍟",
  Drinks: "🥤",
  Deal: "🏷️",
};

const STATS = [
  { value: "15,000+", label: "Happy Foodies Served", icon: Heart },
  { value: "25 Mins", label: "Average Delivery Time", icon: Clock },
  { value: "4.9 ★", label: "Average Dish Rating", icon: Star },
  { value: "100%", label: "Halal & Fresh Ingredients", icon: ShieldCheck },
];

const FEATURES = [
  {
    icon: Flame,
    title: "100% Charcoal Grilled",
    desc: "Authentic high-heat grill sear locking in smoky juices, never reheated.",
    color: "from-chili/15 to-chili/5 text-chili",
  },
  {
    icon: ChefHat,
    title: "Secret House Sauces",
    desc: "Signature garlic toum, chipotle blaze, and tangy BBQ made fresh daily.",
    color: "from-turmeric/15 to-turmeric/5 text-turmeric",
  },
  {
    icon: Truck,
    title: "Insulated Hot Landing",
    desc: "Stamped foil-wrapped thermal packaging so burgers land crisp and piping hot.",
    color: "from-basil/15 to-basil/5 text-basil",
  },
  {
    icon: Sparkles,
    title: "Honest Customer Ratings",
    desc: "Every single rating is vetted and approved from real people who ordered.",
    color: "from-purple-500/15 to-purple-500/5 text-purple-600",
  },
];

const REVIEWS = [
  {
    name: "Zeeshan Ahmed",
    rating: 5,
    role: "Verified Foodie • Clifton",
    quote:
      "The BBQ Smash Burger is easily top 3 in Karachi. The smoky sear and house sauce are insane!",
  },
  {
    name: "Ayesha Malik",
    rating: 5,
    role: "Verified Foodie • Gulshan",
    quote:
      "Arabic Shawarma with the garlic dip is authentic street food heaven. Delivered in 20 mins hot!",
  },
  {
    name: "Hamza Farooq",
    rating: 5,
    role: "Verified Foodie • DHA",
    quote:
      "Stone-baked Fajita Pizza has the crispiest crust and stretchy cheese. The packaging kept it totally fresh.",
  },
];

function HomePage({
  topProducts,
  categories,
  onExplore,
  onCategorySelect,
  onOpenDetails,
}) {
  const [picksRef, picksVisible] = useReveal();
  const [dealsRef, dealsVisible] = useReveal();
  const [featuresRef, featuresVisible] = useReveal();
  const [stepsRef, stepsVisible] = useReveal();
  const [reviewsRef, reviewsVisible] = useReveal();

  const steps = [
    {
      n: "01",
      title: "Pick your craving",
      copy: "Browse juicy smash burgers, charcoal shawarma, and stone-baked pizza filtered by rating.",
    },
    {
      n: "02",
      title: "We fire up the grill",
      copy: "Every single order is cooked fresh from scratch. No batch reheating, no microwave shortcuts.",
    },
    {
      n: "03",
      title: "Lands hot at your door",
      copy: "Track your bike rider live and enjoy your meal fresh, stamped, and steaming hot.",
    },
  ];

  return (
    <main className="flex-1 min-w-0 overflow-hidden">
      {/* ========================================================================= */}
      {/* HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative bg-charcoal text-cream overflow-hidden pt-12 pb-24 sm:pt-20 sm:pb-32">
        {/* Glow ambient background orbs */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-chili/25 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-turmeric/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-screen-2xl mx-auto px-5 sm:px-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-8 items-center relative z-10">
          <div>
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 px-4 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-chili animate-pulse" />
              <span className="text-cream text-xs font-black uppercase tracking-widest">
                Karachi's Grill-First Kitchen
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl leading-[1.02] tracking-tight mb-6">
              Street food, <br />
              plated <span className="text-chili inline-block">properly.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-cream/70 text-base sm:text-lg max-w-lg mb-8 leading-relaxed font-medium">
              Smash burgers, charcoal shawarma, and stone-baked pizza — cooked to order and rated
              by the people who actually ate them.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onExplore}
                className="bg-chili hover:bg-chili-dark active:scale-95 text-white font-extrabold px-8 py-4 rounded-full text-base sm:text-lg shadow-xl shadow-chili/30 hover:shadow-chili/50 transition-all flex items-center gap-2"
              >
                <span>Explore the Menu</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={onExplore}
                className="bg-white/10 hover:bg-white/20 active:scale-95 text-cream border border-white/15 font-bold px-6 py-4 rounded-full text-sm sm:text-base backdrop-blur-md transition-all"
              >
                View Today's Deals 🏷️
              </button>
            </div>

            {/* Mini Trust Badges */}
            <div className="flex flex-wrap items-center gap-6 mt-10 pt-8 border-t border-white/10 text-xs sm:text-sm text-cream/70">
              <div className="flex items-center gap-2">
                <span className="text-turmeric text-lg">★★★★★</span>
                <span className="font-bold text-white">4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-chili" />
                <span>25-Min Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-basil" />
                <span>100% Halal</span>
              </div>
            </div>
          </div>

          {/* Hero Carousel Showcase */}
          {topProducts.length > 0 && (
            <div className="w-full flex justify-center lg:justify-end">
              <Carousel
                items={topProducts.map((p) => ({
                  id: p.id,
                  image: p.image,
                  title: p.title,
                  rating: p.rating,
                }))}
              />
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FLOATING LIVE STATS BAR */}
      {/* ========================================================================= */}
      <section className="max-w-screen-2xl mx-auto px-5 sm:px-8 -mt-10 sm:-mt-14 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl border border-ink/5 p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map(({ value, label, icon: Icon }) => (
            <div key={label} className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-chili/10 text-chili flex items-center justify-center shrink-0">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="font-display font-black text-2xl sm:text-3xl text-ink leading-tight">
                  {value}
                </p>
                <p className="text-ink/50 text-xs font-semibold">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* CATEGORY EXPLORER STRIP */}
      {/* ========================================================================= */}
      <section className="max-w-screen-2xl mx-auto px-5 sm:px-8 pt-16 pb-4">
        <div className="text-center mb-8">
          <span className="text-xs font-black uppercase tracking-widest text-chili bg-chili/10 px-3.5 py-1 rounded-full inline-block mb-2">
            Categories
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-ink">
            What are you craving today?
          </h2>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          {categories
            .filter((c) => c !== "All")
            .map((cat) => (
              <button
                key={cat}
                onClick={() => onCategorySelect(cat)}
                className="group bg-white hover:bg-charcoal text-ink hover:text-white rounded-2xl shadow-sm hover:shadow-xl border border-ink/5 px-5 py-3.5 flex items-center gap-3 transition-all duration-300 active:scale-95"
              >
                <span className="text-2xl group-hover:scale-125 transition-transform duration-300">
                  {CATEGORY_ICONS[cat] || "🍴"}
                </span>
                <div className="text-left">
                  <p className="font-display font-bold text-sm leading-tight">{cat}</p>
                  <p className="text-[11px] text-ink/40 group-hover:text-cream/60 font-semibold">
                    Explore menu →
                  </p>
                </div>
              </button>
            ))}

          <button
            onClick={onExplore}
            className="bg-chili hover:bg-chili-dark text-white rounded-2xl shadow-md px-6 py-3.5 flex items-center gap-2 text-sm font-extrabold transition-all active:scale-95"
          >
            <span>View Full Menu</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* TODAY'S TOP PICKS */}
      {/* ========================================================================= */}
      <section
        ref={picksRef}
        className={`max-w-screen-2xl mx-auto px-5 sm:px-8 pt-16 pb-8 reveal ${
          picksVisible ? "reveal-visible" : ""
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 bg-turmeric/15 border border-turmeric/30 text-charcoal text-xs font-black uppercase tracking-widest px-3.5 py-1 rounded-full mb-2">
              <Star className="w-3.5 h-3.5 fill-turmeric text-turmeric" />
              Customer Favorites
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-ink tracking-tight">
              Top Rated Dishes
            </h2>
            <p className="text-ink/60 text-sm sm:text-base mt-1.5 font-medium">
              The dishes our diners order on repeat.
            </p>
          </div>

          <button
            onClick={onExplore}
            className="hidden sm:flex items-center gap-1.5 text-sm font-extrabold text-chili hover:text-chili-dark transition-colors"
          >
            <span>Browse all dishes</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {topProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenDetails={() => onOpenDetails(product)}
            />
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* TODAY'S DEALS */}
      {/* ========================================================================= */}
      <div ref={dealsRef} className={`reveal ${dealsVisible ? "reveal-visible" : ""}`}>
        <DealsSection deals={deals} />
      </div>

      {/* ========================================================================= */}
      {/* WHY CRISPYBITES / CULINARY HIGHLIGHTS */}
      {/* ========================================================================= */}
      <section
        ref={featuresRef}
        className={`max-w-screen-2xl mx-auto px-5 sm:px-8 py-16 reveal ${
          featuresVisible ? "reveal-visible" : ""
        }`}
      >
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-chili bg-chili/10 px-3.5 py-1 rounded-full inline-block mb-2">
            The CrispyBites Standard
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-ink tracking-tight">
            Why our food hits different
          </h2>
          <p className="text-ink/60 text-sm sm:text-base mt-2 font-medium">
            We don't take shortcuts. Every element is crafted to bring maximum crunch and authentic
            grill aroma.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-ink/5 flex flex-col justify-between hover:-translate-y-1"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feat.color} flex items-center justify-center mb-4`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-ink mb-2 leading-snug">
                    {feat.title}
                  </h3>
                  <p className="text-ink/60 text-xs sm:text-sm leading-relaxed font-medium">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* PROMO VOUCHER BANNER */}
      {/* ========================================================================= */}
      <section className="max-w-screen-2xl mx-auto px-5 sm:px-8 py-6">
        <div className="relative rounded-[2.5rem] bg-gradient-to-r from-charcoal via-charcoal-light to-charcoal text-cream p-8 sm:p-12 overflow-hidden shadow-2xl border border-white/10">
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-chili/25 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-turmeric text-charcoal text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider mb-3">
                <Tag className="w-3.5 h-3.5" />
                First Order Special
              </div>
              <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-white leading-tight">
                Get Rs. 200 Off Your First Craving
              </h3>
              <p className="text-cream/70 text-sm sm:text-base mt-2 max-w-lg font-medium">
                Use voucher code at checkout and experience Karachi's favorite smash grill today.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <div className="bg-white/10 border border-white/20 px-5 py-3 rounded-2xl font-mono font-black text-xl text-turmeric tracking-widest select-all">
                CRISPY200
              </div>
              <button
                onClick={onExplore}
                className="bg-chili hover:bg-chili-dark text-white font-extrabold px-6 py-3.5 rounded-2xl text-sm transition-all shadow-lg shadow-chili/30 active:scale-95"
              >
                Order Now →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* REVIEWS & FOODIE COMMUNITY */}
      {/* ========================================================================= */}
      <section
        ref={reviewsRef}
        className={`max-w-screen-2xl mx-auto px-5 sm:px-8 py-16 reveal ${
          reviewsVisible ? "reveal-visible" : ""
        }`}
      >
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-chili bg-chili/10 px-3.5 py-1 rounded-full inline-block mb-2">
            Social Proof
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-ink tracking-tight">
            Loved by 15,000+ Karachites
          </h2>
          <p className="text-ink/60 text-sm sm:text-base mt-2 font-medium">
            Real feedback from verified orders across town.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {REVIEWS.map((rev) => (
            <div
              key={rev.name}
              className="bg-white rounded-3xl p-6 shadow-sm border border-ink/5 flex flex-col justify-between"
            >
              <div>
                <div className="flex text-turmeric text-sm mb-3">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="text-ink/80 text-sm leading-relaxed italic font-medium">
                  "{rev.quote}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-ink/5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cream font-display font-extrabold text-sm text-chili flex items-center justify-center">
                  {rev.name[0]}
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-ink">{rev.name}</h4>
                  <p className="text-[11px] text-ink/40 font-semibold">{rev.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* HOW IT WORKS / STEPS */}
      {/* ========================================================================= */}
      <section
        ref={stepsRef}
        className={`max-w-screen-2xl mx-auto px-5 sm:px-8 py-16 reveal ${
          stepsVisible ? "reveal-visible" : ""
        }`}
      >
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-chili bg-chili/10 px-3.5 py-1 rounded-full inline-block mb-2">
            The Flow
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-ink tracking-tight">
            From craving to doorstep
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div
              key={step.n}
              className="bg-white rounded-3xl p-8 text-center border border-ink/5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center hover:-translate-y-1"
            >
              <div className="w-16 h-16 rounded-2xl bg-chili/10 text-chili font-display font-black text-2xl flex items-center justify-center mb-5">
                {step.n}
              </div>
              <h3 className="font-display font-extrabold text-lg text-ink mb-2">
                {step.title}
              </h3>
              <p className="text-ink/60 text-xs sm:text-sm leading-relaxed font-medium max-w-xs">
                {step.copy}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default HomePage;