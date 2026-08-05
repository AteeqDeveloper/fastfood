import { useEffect, useRef, useState } from "react";

// Returns a ref to attach to an element, and whether it's currently visible.
// Once revealed, it stays revealed (no re-hide on scroll away).
function useReveal(options = { threshold: 0.15 }) {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.disconnect();
            }
        }, options);

        observer.observe(node);
        return () => observer.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return [ref, isVisible];
}

export default useReveal;