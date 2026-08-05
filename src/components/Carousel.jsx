import { useState, useEffect, useRef, useCallback } from "react";

function Carousel({ items, interval = 4000 }) {
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
    <div className="relative w-full max-w-sm mx-auto lg:mx-0">
      <div className="relative rounded-3xl overflow-hidden shadow-2xl rotate-2">
        <div className="relative h-72 w-full">
          {items.map((item, i) => (
            <div
              key={item.id ?? i}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                i === index ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="font-display font-bold text-lg text-cream">
                  {item.title}
                </p>
                <p className="text-cream/70 text-xs">
                  {item.subtitle || "Today's highest-rated pick"}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Prev / Next controls */}
        {items.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-charcoal/60 hover:bg-charcoal/80 text-cream flex items-center justify-center text-sm transition-colors"
            >
              ‹
            </button>
            <button
              onClick={next}
              aria-label="Next"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-charcoal/60 hover:bg-charcoal/80 text-cream flex items-center justify-center text-sm transition-colors"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Rating stamp badge, follows the active slide */}
      {items[index]?.rating && (
        <div className="stamp absolute -top-5 -right-4 bg-turmeric text-charcoal rounded-full w-20 h-20 flex flex-col items-center justify-center shadow-md -rotate-6">
          <span className="text-base font-extrabold leading-none">
            {items[index].rating}
          </span>
          <span className="text-[10px] font-semibold">TOP RATED</span>
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
                i === index ? "w-6 bg-chili" : "w-2 bg-ink/20 hover:bg-ink/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Carousel;