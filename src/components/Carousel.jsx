import { useState, useEffect, useRef, useCallback } from "react";
import { Star, ChevronLeft, ChevronRight, Flame } from "lucide-react";

function Carousel({ items, interval = 4500 }) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  const goTo = useCallback(
    (i) => {
      setIndex(((i % items.length) + items.length) % items.length);
    },
    [items.length]
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  // Autoplay
  useEffect(() => {
    if (items.length <= 1) return;
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, interval);
    return () => clearInterval(timerRef.current);
  }, [items.length, interval]);

  if (!items || items.length === 0) return null;

  return (
    <div className="relative w-full max-w-md mx-auto lg:mx-0">
      {/* Decorative Glow Behind Carousel */}
      <div className="absolute -inset-2 bg-gradient-to-r from-chili/30 via-turmeric/20 to-chili/30 rounded-[2.5rem] blur-2xl opacity-70 group-hover:opacity-100 transition-opacity" />

      {/* Main Glass/Frame Card */}
      <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-cream/15 bg-charcoal-light">
        <div className="relative h-80 sm:h-96 w-full">
          {items.map((item, i) => (
            <div
              key={item.id ?? i}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                i === index
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              
              {/* Deep Contrast Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-transparent" />

              {/* Slide Content */}
              <div className="absolute bottom-5 left-5 right-5">
                <span className="inline-flex items-center gap-1 bg-turmeric/20 border border-turmeric/40 text-turmeric text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-2">
                  <Flame className="w-3 h-3 fill-turmeric" />
                  Today's Chef Choice
                </span>
                <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white leading-tight mb-1">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 text-cream/70 text-xs">
                  <span className="flex items-center gap-0.5 text-turmeric font-bold">
                    <Star className="w-3.5 h-3.5 fill-turmeric" />
                    {item.rating} Rating
                  </span>
                  <span>•</span>
                  <span>Cooked to Order</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Prev / Next controls */}
        {items.length > 1 && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 z-20">
            <button
              onClick={prev}
              aria-label="Previous"
              className="w-8 h-8 rounded-full bg-charcoal/70 hover:bg-chili text-white flex items-center justify-center text-sm backdrop-blur-md transition-all shadow-md active:scale-90"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              aria-label="Next"
              className="w-8 h-8 rounded-full bg-charcoal/70 hover:bg-chili text-white flex items-center justify-center text-sm backdrop-blur-md transition-all shadow-md active:scale-90"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Floating Rating Badge */}
      {items[index]?.rating && (
        <div className="absolute -top-4 -left-4 bg-turmeric text-charcoal rounded-2xl px-3.5 py-2 flex items-center gap-1.5 shadow-xl border-2 border-white rotate-[-4deg] animate-pop-in">
          <Star className="w-4 h-4 fill-charcoal text-charcoal" />
          <span className="text-sm font-black">{items[index].rating}</span>
          <span className="text-[10px] font-black uppercase text-charcoal/70">TOP RATED</span>
        </div>
      )}

      {/* Dot indicators */}
      {items.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index ? "w-8 bg-chili" : "w-2 bg-charcoal/20 hover:bg-charcoal/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Carousel;