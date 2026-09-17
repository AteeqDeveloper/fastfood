export const CATEGORIES = [
  "All",
  "Burgers",
  "Pizza",
  "Fried Chicken",
  "Sandwiches",
  "Fries",
  "Snacks",
  "Drinks",
];

export const CATEGORY_IMAGES = {
  All: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=80",
  Burgers: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80",
  Pizza: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80",
  "Fried Chicken": "https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=80",
  Sandwiches: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=500&auto=format&fit=crop&q=80",
  Fries: "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&auto=format&fit=crop&q=80",
  Snacks: "https://images.unsplash.com/photo-1548340748-6d2b7d7da280?w=500&auto=format&fit=crop&q=80",
  Drinks: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=80",
  // Legacy aliases
  Burger: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80",
  Shawarma: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=500&auto=format&fit=crop&q=80",
  Sides: "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&auto=format&fit=crop&q=80",
};

export const DEFAULT_CATEGORY_IMAGE =
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=80";

export function getCategoryImage(category) {
  return CATEGORY_IMAGES[category] || DEFAULT_CATEGORY_IMAGE;
}
