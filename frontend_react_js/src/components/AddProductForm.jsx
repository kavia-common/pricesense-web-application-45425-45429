import React, { useState } from "react";

/**
// PUBLIC_INTERFACE
 * AddProductForm
 * Minimalist form to add a new tracked product.
 * Props:
 * - onSubmit(formData: {name: string, url?: string})
 * - loading: boolean
 * - error: string | null
 */
export default function AddProductForm({ onSubmit, loading, error }) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit?.({ name: name.trim(), url: url.trim() || undefined });
  };

  return (
    <section className="ps-card">
      <div className="ps-card__header">
        <h2 className="ps-title">Add Product</h2>
      </div>
      <div className="ps-card__body">
        {error && (
          <div className="ps-state ps-error" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="ps-form">
          <label className="ps-label">
            Name
            <input
              type="text"
              className="ps-input"
              placeholder="Product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label className="ps-label">
            URL (optional)
            <input
              type="url"
              className="ps-input"
              placeholder="https://example.com/product"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </label>
          <div className="ps-actions">
            <button className="ps-button" type="submit" disabled={loading}>
              {loading ? "Adding…" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
