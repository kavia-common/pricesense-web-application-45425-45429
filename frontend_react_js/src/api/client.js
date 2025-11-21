import axios from "axios";

/**
 * Determine API base URL from env with fallback.
 */
const API_BASE =
  process.env.REACT_APP_API_BASE?.trim() || "http://localhost:3001";

/**
 * Feature flags parsing with safe defaults.
 */
function parseFeatureFlags() {
  try {
    if (process.env.REACT_APP_FEATURE_FLAGS) {
      return JSON.parse(process.env.REACT_APP_FEATURE_FLAGS);
    }
  } catch (_) {
    // ignore parse errors and use defaults
  }
  return { charts: true };
}

export const featureFlags = parseFeatureFlags();

/**
// PUBLIC_INTERFACE
 * createApiClient
 * Creates a configured axios instance with baseURL and interceptors.
 * Returns the axios instance.
 */
export function createApiClient() {
  const instance = axios.create({
    baseURL: API_BASE,
    headers: { "Content-Type": "application/json" },
    timeout: 15000,
  });

  // Basic error interceptor to normalize error shape
  instance.interceptors.response.use(
    (res) => res,
    (error) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Network or server error";
      return Promise.reject({
        message,
        status: error?.response?.status,
        data: error?.response?.data,
      });
    }
  );
  return instance;
}

const api = createApiClient();

/**
 * HEALTHCHECK
 */
// PUBLIC_INTERFACE
export async function healthcheck() {
  const path = process.env.REACT_APP_HEALTHCHECK_PATH || "/";
  const res = await api.get(path);
  return res.data;
}

/**
 * PRODUCTS
 */
// PUBLIC_INTERFACE
export async function fetchProducts(query = "") {
  const res = await api.get("/products", {
    params: query ? { q: query } : undefined,
  });
  return res.data;
}

// PUBLIC_INTERFACE
export async function addProduct(payload) {
  const res = await api.post("/products", payload);
  return res.data;
}

/**
 * ALERTS
 */
// PUBLIC_INTERFACE
export async function fetchAlerts() {
  const res = await api.get("/alerts");
  return res.data;
}

/**
 * PRICE HISTORY
 */
// PUBLIC_INTERFACE
export async function fetchPriceHistory(productId) {
  const res = await api.get(`/products/${productId}/history`);
  return res.data;
}
