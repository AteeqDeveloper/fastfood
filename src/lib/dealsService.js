import { api } from "./api";
import { deals as defaultInitialDeals } from "../data/deals";

const DEALS_STORAGE_KEY = "crispybites_custom_deals";

/**
 * Normalizes and determines active / expired status based on dates & flags
 */
export function evaluateDealStatus(deal) {
  if (deal.isActive === false || deal.status === "inactive") {
    return "inactive";
  }

  const now = new Date();
  if (deal.expiryDate) {
    const expiry = new Date(deal.expiryDate);
    // If expiry date has a time component, compare directly; if only YYYY-MM-DD, end of that day
    if (deal.expiryDate.length <= 10) {
      expiry.setHours(23, 59, 59, 999);
    }
    if (now > expiry) {
      return "expired";
    }
  }

  if (deal.startDate) {
    const start = new Date(deal.startDate);
    if (deal.startDate.length <= 10) {
      start.setHours(0, 0, 0, 0);
    }
    if (now < start) {
      return "scheduled";
    }
  }

  return "active";
}

/**
 * Loads deals with local fallback cache
 */
export function getLocalStoredDeals() {
  try {
    const stored = localStorage.getItem(DEALS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((d) => ({
          ...d,
          status: evaluateDealStatus(d),
        }));
      }
    }
  } catch (err) {
    console.warn("Failed to parse stored deals:", err);
  }

  // Fallback to initial default deals
  return defaultInitialDeals.map((d) => ({
    ...d,
    startDate: d.startDate || "2026-01-01",
    expiryDate: d.expiryDate || "2026-12-31",
    isActive: d.isActive !== undefined ? d.isActive : true,
    status: evaluateDealStatus(d),
  }));
}

/**
 * Saves deals list to localStorage cache
 */
export function saveLocalStoredDeals(dealsList) {
  try {
    localStorage.setItem(DEALS_STORAGE_KEY, JSON.stringify(dealsList));
  } catch (err) {
    console.warn("Failed to persist deals to localStorage:", err);
  }
}

/**
 * Fetches all deals (from Backend API if available, else localStorage)
 */
export async function fetchDealsService() {
  try {
    const { data, error } = await api.get("/deals");

    if (!error && Array.isArray(data) && data.length > 0) {
      const normalized = data.map((d) => ({
        id: d.id,
        title: d.title,
        tagline: d.tagline || "",
        description: d.description || "",
        detailedDescription: d.detailed_description || d.detailedDescription || "",
        image: d.image || "",
        items: Array.isArray(d.items) ? d.items : typeof d.items === "string" ? JSON.parse(d.items) : [],
        productIds: d.product_ids || d.productIds || [],
        price: Number(d.price),
        originalPrice: Number(d.original_price || d.originalPrice || d.price),
        discountPercent: Number(d.discount_percent || d.discountPercent || 0),
        category: d.category || "Solo Combos",
        startDate: d.start_date || d.startDate || "",
        expiryDate: d.expiry_date || d.expiryDate || "",
        validity: d.validity || "",
        badge: d.badge || "",
        isFeatured: Boolean(d.is_featured ?? d.isFeatured),
        isLimitedTime: Boolean(d.is_limited_time ?? d.isLimitedTime),
        isActive: d.is_active !== undefined ? Boolean(d.is_active) : true,
        rating: Number(d.rating || 4.9),
        ordersCount: d.orders_count || d.ordersCount || "1k+",
        status: evaluateDealStatus(d),
      }));

      saveLocalStoredDeals(normalized);
      return normalized;
    }
  } catch {
    // If backend is unreachable or network issue, fallback smoothly to localStorage
  }

  return getLocalStoredDeals();
}

/**
 * Saves or updates a deal
 */
export async function saveDealService(dealPayload, allDeals) {
  const isEdit = Boolean(dealPayload.id);
  const now = Date.now();
  const dealId = isEdit ? Number(dealPayload.id) : (Math.max(...allDeals.map((d) => d.id), 9000) + 1);

  const originalPrice = Number(dealPayload.originalPrice || dealPayload.price || 0);
  const price = Number(dealPayload.price || 0);
  const discountPercent =
    Number(dealPayload.discountPercent) ||
    (originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0);

  const formatted = {
    id: dealId,
    title: dealPayload.title.trim(),
    tagline: dealPayload.tagline?.trim() || "",
    description: dealPayload.description?.trim() || "",
    detailedDescription: dealPayload.detailedDescription?.trim() || "",
    image:
      dealPayload.image?.trim() ||
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
    items: Array.isArray(dealPayload.items)
      ? dealPayload.items.filter(Boolean)
      : typeof dealPayload.items === "string"
      ? dealPayload.items.split("\n").map((s) => s.trim()).filter(Boolean)
      : [],
    productIds: dealPayload.productIds || [],
    price,
    originalPrice,
    discountPercent,
    category: dealPayload.category || "Solo Combos",
    startDate: dealPayload.startDate || new Date().toISOString().slice(0, 10),
    expiryDate: dealPayload.expiryDate || "",
    validity:
      dealPayload.validity ||
      (dealPayload.expiryDate
        ? `Valid until ${dealPayload.expiryDate}`
        : "Daily • All Day Long"),
    badge: dealPayload.badge || (dealPayload.isFeatured ? "👑 BEST VALUE" : "🔥 POPULAR PICK"),
    isFeatured: Boolean(dealPayload.isFeatured),
    isLimitedTime: Boolean(dealPayload.isLimitedTime),
    isActive: dealPayload.isActive !== undefined ? Boolean(dealPayload.isActive) : true,
    rating: Number(dealPayload.rating || 4.9),
    ordersCount: dealPayload.ordersCount || "100+",
  };

  formatted.status = evaluateDealStatus(formatted);

  // Try writing to backend
  try {
    await api.post("/deals", formatted);
  } catch (err) {
    console.warn("Backend deal save fallback to local:", err);
  }

  // Update local cache
  let nextDeals;
  if (isEdit) {
    nextDeals = allDeals.map((d) => (d.id === formatted.id ? formatted : d));
  } else {
    nextDeals = [formatted, ...allDeals];
  }

  saveLocalStoredDeals(nextDeals);
  return { savedDeal: formatted, updatedList: nextDeals };
}

/**
 * Deletes a deal
 */
export async function deleteDealService(id, allDeals) {
  try {
    await api.delete(`/deals/${id}`);
  } catch (err) {
    console.warn("Backend deal delete fallback to local:", err);
  }

  const updatedList = allDeals.filter((d) => d.id !== Number(id));
  saveLocalStoredDeals(updatedList);
  return updatedList;
}

/**
 * Toggles active status of a deal
 */
export async function toggleDealActiveService(id, isActive, allDeals) {
  const target = allDeals.find((d) => d.id === Number(id));
  if (!target) return allDeals;

  return saveDealService({ ...target, isActive }, allDeals).then((res) => res.updatedList);
}
