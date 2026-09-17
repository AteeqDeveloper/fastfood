import {
  Flame,
  Clock,
  ShieldCheck,
  ChefHat,
  Award,
  Heart,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  UtensilsCrossed,
  MapPin,
  Leaf,
} from "lucide-react";

function AboutPage({ onNavigate }) {
  return (
    <main className="min-h-screen bg-[#FFF3DC] text-[#3A2418] bg-rustic-pattern pb-20">
      {/* 1. Page Hero Banner */}
      <section className="bg-[#3A2418] text-[#FFF3DC] pt-12 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b-2 border-[#C65D21]/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C65D21]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#E6A93A]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-screen-2xl mx-auto relative z-10 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-[#FFFAF0]/10 border border-[#FFF3DC]/20 px-4 py-1.5 rounded-full mb-4">
            <Flame className="w-4 h-4 text-[#C65D21]" />
            <span className="text-xs font-black uppercase tracking-widest text-[#E6A93A]">
              Authentic Handcrafted Kitchen
            </span>
          </div>

          <h1 className="font-display font-black text-4xl sm:text-6xl text-[#FFFAF0] tracking-tight leading-tight mb-4">
            The Story Behind <br />
            <span className="text-[#C65D21]">CrispyBites</span>
          </h1>

          <p className="text-[#FFF3DC]/80 text-base sm:text-lg leading-relaxed font-medium">
            We started with a simple obsession: what if fast food was treated like culinary craft?
            No shortcuts, no microwave reheats, just searing cast iron, pure passion, and real ingredients.
          </p>
        </div>
      </section>

      {/* 2. The CrispyBites Story & Craftsmanship */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-[#FFFAF0] rounded-3xl p-6 sm:p-12 shadow-xl border border-[#3A2418]/10 grid lg:grid-cols-12 gap-10 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-black uppercase tracking-widest text-[#C65D21] bg-[#C65D21]/10 px-3.5 py-1 rounded-full inline-block border border-[#C65D21]/20">
              Our Journey • Est. 2024
            </span>

            <h2 className="font-display font-black text-3xl sm:text-4xl text-[#3A2418] leading-snug">
              Born from a Cast-Iron Skillet & A Refusal to Compromise
            </h2>

            <p className="text-[#3A2418]/80 text-sm sm:text-base leading-relaxed font-medium">
              In 2024, our founders noticed that street-style fast food had lost its soul. Patties
              were factory pre-cooked, bread arrived frozen in plastic bags, and sauces tasted like
              syrup. We envisioned a kitchen that combined the lightning speed of modern fast food
              with the soul and smoky aromatics of true street grilling.
            </p>

            <p className="text-[#3A2418]/80 text-sm sm:text-base leading-relaxed font-medium">
              We took heavy cast iron, heated it screaming hot, pressed prime seasoned beef into
              ultra-thin, lacy-edged patties, and watched the juices bubble and caramelize. Today,
              CrispyBites brings that raw grill flavor to thousands of Karachi foodies every day.
            </p>

            {/* Key Craft Highlights */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#3A2418]/10 text-xs sm:text-sm font-bold">
              <div className="flex items-center gap-2 text-[#3A2418]">
                <span className="w-2 h-2 rounded-full bg-[#C65D21]" />
                <span>Cast-Iron Smash Technique</span>
              </div>
              <div className="flex items-center gap-2 text-[#3A2418]">
                <span className="w-2 h-2 rounded-full bg-[#66734A]" />
                <span>48-Hour Sourdough Ferment</span>
              </div>
              <div className="flex items-center gap-2 text-[#3A2418]">
                <span className="w-2 h-2 rounded-full bg-[#E6A93A]" />
                <span>House-Simmered Sauces</span>
              </div>
              <div className="flex items-center gap-2 text-[#3A2418]">
                <span className="w-2 h-2 rounded-full bg-[#3A2418]" />
                <span>Zero Microwave Shortcuts</span>
              </div>
            </div>
          </div>

          {/* Right Imagery Collage */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-4">
              <div className="rounded-3xl overflow-hidden border-2 border-[#3A2418]/15 shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80"
                  alt="Cast-iron smashed burger"
                  className="w-full h-48 sm:h-60 object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="bg-[#3A2418] text-[#FFF3DC] p-5 rounded-3xl text-center border border-[#FFF3DC]/15">
                <p className="font-display font-black text-3xl text-[#E6A93A]">15,000+</p>
                <p className="text-xs font-bold text-[#FFF3DC]/70 mt-1 uppercase tracking-wider">
                  Handcrafted Burgers Served
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-6">
              <div className="bg-[#C65D21] text-white p-5 rounded-3xl text-center shadow-lg">
                <p className="font-display font-black text-3xl">100%</p>
                <p className="text-xs font-bold text-white/80 mt-1 uppercase tracking-wider">
                  Halal & Fresh Daily
                </p>
              </div>
              <div className="rounded-3xl overflow-hidden border-2 border-[#3A2418]/15 shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80"
                  alt="Wood fired artisan pizza"
                  className="w-full h-48 sm:h-60 object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Our Handcrafted Philosophy */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs font-black uppercase tracking-widest text-[#66734A] bg-[#66734A]/10 px-4 py-1.5 rounded-full inline-block mb-3 border border-[#66734A]/20">
            Our Culinary Code
          </span>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-[#3A2418] tracking-tight">
            How We Craft Every Dish
          </h2>
          <p className="text-[#3A2418]/70 text-sm sm:text-base mt-2 font-medium">
            Precision, heat, and artisanal care guide every single bite.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-[#FFFAF0] rounded-3xl p-8 border border-[#3A2418]/10 shadow-[0_4px_20px_-4px_rgba(58,36,24,0.06)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#C65D21]/15 text-[#C65D21] flex items-center justify-center mb-6">
                <Flame className="w-7 h-7" />
              </div>
              <h3 className="font-display font-black text-xl text-[#3A2418] mb-3">
                1. High-Heat Iron Searing
              </h3>
              <p className="text-[#3A2418]/70 text-sm leading-relaxed font-medium">
                Our flat-top iron griddles are calibrated to 420°F. When fresh, hand-portioned Angus
                beef hits the iron, it instantly forms the legendary Maillard crust that locks inside
                the rich, savory juices.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#3A2418]/10 text-xs font-bold text-[#C65D21]">
              Result: Smoky crunch on the outside, ultra-tender center.
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#FFFAF0] rounded-3xl p-8 border border-[#3A2418]/10 shadow-[0_4px_20px_-4px_rgba(58,36,24,0.06)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#66734A]/15 text-[#66734A] flex items-center justify-center mb-6">
                <Leaf className="w-7 h-7" />
              </div>
              <h3 className="font-display font-black text-xl text-[#3A2418] mb-3">
                2. Farm-Fresh Ingredients
              </h3>
              <p className="text-[#3A2418]/70 text-sm leading-relaxed font-medium">
                We partner with local organic farms for vine-ripened tomatoes, crisp romaine lettuce,
                and pungent purple cabbage. Our Russet potatoes are peeled and hand-cut every morning
                for that genuine skin-on crunch.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#3A2418]/10 text-xs font-bold text-[#66734A]">
              Result: Vibrant crispness and natural, wholesome flavors.
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#FFFAF0] rounded-3xl p-8 border border-[#3A2418]/10 shadow-[0_4px_20px_-4px_rgba(58,36,24,0.06)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#E6A93A]/20 text-[#3A2418] flex items-center justify-center mb-6">
                <ChefHat className="w-7 h-7 text-[#C65D21]" />
              </div>
              <h3 className="font-display font-black text-xl text-[#3A2418] mb-3">
                3. Signature Secret Sauces
              </h3>
              <p className="text-[#3A2418]/70 text-sm leading-relaxed font-medium">
                Store-bought mayonnaise has no place in our kitchen. We simmer our smoky BBQ for 4
                hours, whip fresh garlic toum with virgin olive oil, and infuse raw wildflower honey
                with smoked red chilies daily.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#3A2418]/10 text-xs font-bold text-[#C65D21]">
              Result: Distinctive flavor profiles you won't taste anywhere else.
            </div>
          </div>
        </div>
      </section>

      {/* 4. Why Choose CrispyBites Section */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-[#3A2418] text-[#FFF3DC] rounded-3xl p-8 sm:p-14 border border-[#FFF3DC]/15 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <span className="text-xs font-black uppercase tracking-widest text-[#E6A93A] bg-[#FFF3DC]/10 px-3.5 py-1 rounded-full inline-block mb-3">
                The CrispyBites Standard
              </span>
              <h2 className="font-display font-black text-3xl sm:text-5xl text-[#FFFAF0] leading-tight mb-4">
                Why CrispyBites Hits Different
              </h2>
              <p className="text-[#FFF3DC]/80 text-sm sm:text-base leading-relaxed mb-6 font-medium">
                We believe food should feel like a celebration. When you order from CrispyBites, you
                get handcrafted food made by people who love the grill.
              </p>
              <div className="space-y-3 text-xs sm:text-sm font-semibold">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#C65D21] shrink-0" />
                  <span>Sealed thermal insulated packaging so orders land audibly crisp & hot</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#66734A] shrink-0" />
                  <span>100% Halal certified prime beef cuts and fresh chicken</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#E6A93A] shrink-0" />
                  <span>Average 25-minute kitchen-to-doorstep dispatch guarantee</span>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onNavigate("menu")}
                  className="bg-[#C65D21] hover:bg-[#A94B16] text-white font-extrabold px-8 py-3.5 rounded-full text-sm sm:text-base shadow-lg transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore Our Menu</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate("contact")}
                  className="bg-[#FFFAF0] hover:bg-white text-[#3A2418] font-bold px-7 py-3.5 rounded-full text-sm sm:text-base transition-all active:scale-95 cursor-pointer shadow-sm"
                >
                  <span>Get in Touch</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="rounded-3xl overflow-hidden border-4 border-[#FFFAF0] shadow-2xl max-w-sm">
                <img
                  src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80"
                  alt="CrispyBites artisan food"
                  className="w-full h-80 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AboutPage;
