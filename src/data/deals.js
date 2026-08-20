// Deals are self-contained combo bundles — not tied to specific product rows in
// Supabase. They flow through the same cart system as real products (App.jsx
// merges this list in for cart lookups), so ordering, checkout, tracking, and
// the admin Orders tab all "just work" with no extra code.
//
// IDs are kept in a high range (9000+) so they never collide with real
// Supabase product IDs.
export const deals = [
    {
        id: 9001,
        title: "Burger & Chill Combo",
        description: "Any classic burger paired with a chilled soft drink.",
        image:
            "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
        items: ["1x Classic Burger", "1x Soft Drink (500ml)"],
        price: 799,
        originalPrice: 899,
        category: "Deal",
    },
    {
        id: 9002,
        title: "Pizza Party Pack",
        description: "One large pizza with two chilled drinks — built for sharing.",
        image:
            "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80",
        items: ["1x Large Pizza", "2x Soft Drinks (500ml)"],
        price: 1599,
        originalPrice: 1799,
        category: "Deal",
    },
    {
        id: 9003,
        title: "Shawarma Duo Deal",
        description: "Two shawarmas of your choice at a friendlier combo price.",
        image:
            "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800&q=80",
        items: ["2x Shawarma (any kind)"],
        price: 899,
        originalPrice: 998,
        category: "Deal",
    },
];