import React, { useEffect, useState } from "react";
import { healthcheck } from "../api/client";

/**
// PUBLIC_INTERFACE
 * Navbar
 * A top navigation bar with search, app title, and backend health indicator.
 * Props:
 * - onSearch(query: string): callback when user submits a search.
 */
export default function Navbar({ onSearch }) {
  const [query, setQuery] = useState("");
  const [healthy, setHealthy] = useState(null);

  useEffect(() => {
    let mounted = true;
    healthcheck()
      .then(() => mounted && setHealthy(true))
      .catch(() => mounted && setHealthy(false));
    return () => {
      mounted = false;
    };
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    onSearch?.(query.trim());
  };

  return (
    <header className="ps-navbar">
      <div className="ps-navbar__brand">PriceSense</div>
      <form className="ps-navbar__search" onSubmit={onSubmit} role="search">
        <input
          aria-label="Search products"
          type="search"
          className="ps-input"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="ps-button" type="submit">
          Search
        </button>
      </form>
      <div
        className={`ps-health ${
          healthy == null ? "pending" : healthy ? "ok" : "down"
        }`}
        aria-label="Backend health status"
        title={
          healthy == null
            ? "Checking..."
            : healthy
            ? "Backend reachable"
            : "Backend unreachable"
        }
      />
    </header>
  );
}
