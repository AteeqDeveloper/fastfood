const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const TOKEN_KEY = "crispybites_auth_token";
const USER_KEY = "crispybites_auth_user";

export function getToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(TOKEN_KEY) || "";
}

export function setToken(token) {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function getUser() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setUser(user) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

export function clearAuth() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event("auth-change"));
}

export async function request(endpoint, options = {}) {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMsg =
        json?.message ||
        json?.error ||
        `Request failed with status ${res.status}`;
      return { data: null, error: { message: errorMsg, status: res.status } };
    }

    // Backend returns { success: true, message: "...", data: [...] }
    const responseData = json?.data !== undefined ? json.data : json;
    return { data: responseData, error: null };
  } catch (err) {
    return {
      data: null,
      error: { message: err.message || "Network error", original: err },
    };
  }
}

export const api = {
  get: (endpoint, params) => {
    let url = endpoint;
    if (params) {
      const qs = new URLSearchParams(
        Object.entries(params).filter(
          ([, v]) => v !== undefined && v !== null && v !== ""
        )
      ).toString();
      if (qs) url += `?${qs}`;
    }
    return request(url, { method: "GET" });
  },
  post: (endpoint, body) =>
    request(endpoint, { method: "POST", body: JSON.stringify(body) }),
  patch: (endpoint, body) =>
    request(endpoint, { method: "PATCH", body: JSON.stringify(body) }),
  put: (endpoint, body) =>
    request(endpoint, { method: "PUT", body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: "DELETE" }),
};

export default api;
