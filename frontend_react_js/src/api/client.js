import axios from "axios";

/**
 * Determine API base URL from env with fallback.
 * Uses REACT_APP_API_BASE to allow deployment-time configuration.
 * Example: http://localhost:3001 or https://api.pricesense.app
 */
const API_BASE =
  (process.env.REACT_APP_API_BASE && process.env.REACT_APP_API_BASE.trim()) ||
  "http://localhost:3001";

/**
 * Feature flags parsing with safe defaults.
 * Set REACT_APP_FEATURE_FLAGS='{"charts":true}'
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
 * Uses REACT_APP_HEALTHCHECK_PATH to support custom health route; defaults to "/".
 */
// PUBLIC_INTERFACE
export async function healthcheck() {
  const path =
    (process.env.REACT_APP_HEALTHCHECK_PATH &&
      process.env.REACT_APP_HEALTHCHECK_PATH.trim()) ||
    "/";
  const res = await api.get(path);
  return res.data;
}

/**
 * PRODUCTS
 * Aligned to backend routes:
 * - GET /products
 * - POST /products
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
 * Aligned to backend route: GET /alerts
 */
// PUBLIC_INTERFACE
export async function fetchAlerts() {
  const res = await api.get("/alerts");
  return res.data;
}

/**
 * PRICE HISTORY
 * Aligned to backend route: GET /products/{product_id}/history
 */
// PUBLIC_INTERFACE
export async function fetchPriceHistory(productId) {
  if (productId == null) {
    return [];
  }
  const res = await api.get(`/products/${productId}/history`);
  // Graceful handling: ensure array
  return Array.isArray(res.data) ? res.data : res.data?.items || [];
}

/**
// PUBLIC_INTERFACE
 * deleteProduct
 * Delete a product by id. Expects backend to return 204 No Content.
 */
export async function deleteProduct(productId) {
  if (productId == null) {
    throw new Error("productId is required");
  }
  // Accept both 204 No Content (preferred) and 200 OK with or without body.
  // Some backends might return 200 and a JSON confirmation; normalize to success boolean.
  try {
    const res = await api.delete(`/products/${productId}`);
    // If axios doesn't throw, request reached server. Validate status class.
    if (res && (res.status === 204 || res.status === 200)) {
      return true;
    }
    // Fallback: treat any 2xx as success
    if (res && String(res.status).startsWith("2")) {
      return true;
    }
    throw new Error(`Unexpected response status: ${res?.status ?? "unknown"}`);
  } catch (err) {
    // Normalize axios interceptor shaped error or generic error
    const message =
      err?.message ||
      err?.data?.message ||
      "Failed to delete product due to network or server error";
    throw new Error(message);
  }
}
