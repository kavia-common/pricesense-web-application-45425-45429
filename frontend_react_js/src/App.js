import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import "./index.css";
import Navbar from "./components/Navbar";
import ProductList from "./components/ProductList";
import AddProductForm from "./components/AddProductForm";
import AlertsPanel from "./components/AlertsPanel";
import ProductChart from "./components/ProductChart";
import {
  featureFlags,
  fetchProducts,
  fetchAlerts,
  addProduct,
  fetchPriceHistory,
  deleteProduct,
} from "./api/client";

/**
// PUBLIC_INTERFACE
 * App
 * PriceSense dashboard: top navbar with search, main content with products,
 * responsive sidebar with add form and alerts, and optional charts.
 */
function App() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [prodLoading, setProdLoading] = useState(false);
  const [prodError, setProdError] = useState(null);

  const [alerts, setAlerts] = useState([]);
  const [alertsLoading, setAlertsLoading] = useState(false);
  const [alertsError, setAlertsError] = useState(null);

  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState(null);

  // transient user messages
  const [toast, setToast] = useState(null);

  const [selected, setSelected] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const chartsEnabled = useMemo(() => !!featureFlags?.charts, []);

  const reloadProducts = async (q = "") => {
    setProdLoading(true);
    setProdError(null);
    try {
      const data = await fetchProducts(q);
      setProducts(Array.isArray(data) ? data : data?.items || []);
    } catch (e) {
      setProdError(e?.message || "Failed to load products");
    } finally {
      setProdLoading(false);
    }
  };

  const reloadAlerts = async () => {
    setAlertsLoading(true);
    setAlertsError(null);
    try {
      const data = await fetchAlerts();
      setAlerts(Array.isArray(data) ? data : data?.items || []);
    } catch (e) {
      setAlertsError(e?.message || "Failed to load alerts");
    } finally {
      setAlertsLoading(false);
    }
  };

  const loadHistory = async (product) => {
    if (!product) {
      setHistory([]);
      return;
    }
    setHistoryLoading(true);
    try {
      const data = await fetchPriceHistory(product.id);
      const list = Array.isArray(data) ? data : data?.items || [];
      // Normalize fields to { timestamp, price }
      const norm = list
        .filter((h) => h != null)
        .map((h) => ({
          timestamp: h.timestamp || h.created_at || h.time || h.ts,
          price: Number(h.price ?? h.value ?? 0),
        }))
        .filter((h) => h.timestamp && !Number.isNaN(h.price));
      setHistory(norm);
    } catch (e) {
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    reloadProducts();
    reloadAlerts();
  }, []);

  useEffect(() => {
    if (selected) {
      loadHistory(selected);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id]);

  const handleAdd = async (form) => {
    setAddError(null);
    setAddLoading(true);
    try {
      await addProduct(form);
      await reloadProducts(query);
      setSelected(null);
      setToast({ type: "success", message: "Product added." });
    } catch (e) {
      setAddError(e?.message || "Failed to add product");
      setToast({
        type: "error",
        message: e?.message || "Failed to add product",
      });
    } finally {
      setAddLoading(false);
      // auto-clear toast after a short time
      setTimeout(() => setToast(null), 2500);
    }
  };

  const handleDelete = async (product) => {
    if (!product) return;
    const ok = window.confirm(`Remove "${product.name}" from tracking?`);
    if (!ok) return;

    // optimistic UI update
    const prev = products;
    setProducts((cur) => cur.filter((p) => p.id !== product.id));
    if (selected?.id === product.id) {
      setSelected(null);
    }
    try {
      await deleteProduct(product.id); // handle 204 or 200
      setToast({ type: "success", message: "Product removed." });
    } catch (e) {
      // revert on failure
      setProducts(prev);
      setToast({
        type: "error",
        message:
          e?.message ||
          "Failed to remove product. Please check your network or try again.",
      });
    } finally {
      setTimeout(() => setToast(null), 2500);
    }
  };

  return (
    <div className="ps-app">
      <Navbar
        onSearch={(q) => {
          setQuery(q);
          reloadProducts(q);
        }}
      />

      <main className="ps-layout">
        <div className="ps-main">
          {toast && (
            <div
              className={`ps-state ${toast.type === "error" ? "ps-error" : ""}`}
              role={toast.type === "error" ? "alert" : "status"}
              aria-live="polite"
              style={{ marginBottom: 8 }}
            >
              {toast.message}
            </div>
          )}
          <ProductList
            loading={prodLoading}
            error={prodError}
            products={products}
            onSelect={setSelected}
            onDelete={handleDelete}
          />
          {chartsEnabled && (
            <ProductChart
              product={selected}
              data={history}
              enabled={chartsEnabled}
              loading={historyLoading}
            />
          )}
        </div>
        <aside className="ps-sidebar">
          <AddProductForm
            onSubmit={handleAdd}
            loading={addLoading}
            error={addError}
          />
          <AlertsPanel
            loading={alertsLoading}
            error={alertsError}
            alerts={alerts}
          />
        </aside>
      </main>
    </div>
  );
}

export default App;
