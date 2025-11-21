import React from "react";

/**
 * Calculate percentage change between last and current price.
 */
function percentChange(current, last) {
  if (current == null || last == null || last === 0) return null;
  const diff = current - last;
  return (diff / last) * 100;
}

/**
// PUBLIC_INTERFACE
 * ProductList
 * Renders a minimalist table of products with prices and change.
 * Props:
 * - loading: boolean
 * - error: string | null
 * - products: Array<{id,name,url,current_price,last_price}>
 * - onSelect(product): function invoked when a row is clicked
 */
export default function ProductList({
  loading,
  error,
  products = [],
  onSelect,
}) {
  return (
    <section className="ps-card">
      <div className="ps-card__header">
        <h2 className="ps-title">Tracked Products</h2>
      </div>
      <div className="ps-card__body">
        {loading && <div className="ps-state">Loading products…</div>}
        {error && (
          <div className="ps-state ps-error" role="alert">
            {error}
          </div>
        )}
        {!loading && !error && products.length === 0 && (
          <div className="ps-state">No products yet. Add your first one!</div>
        )}
        {!loading && !error && products.length > 0 && (
          <div className="ps-table-wrapper">
            <table className="ps-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th className="num">Current</th>
                  <th className="num">Last</th>
                  <th className="num">% Change</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const pct = percentChange(p.current_price, p.last_price);
                  const pctText =
                    pct == null ? "—" : `${pct.toFixed(1)}%`;
                  const changeClass =
                    pct == null
                      ? ""
                      : pct < 0
                      ? "drop"
                      : pct > 0
                      ? "rise"
                      : "flat";
                  return (
                    <tr
                      key={p.id}
                      onClick={() => onSelect?.(p)}
                      className="ps-row--click"
                    >
                      <td>
                        <div className="ps-name">
                          <div className="ps-name__title">{p.name}</div>
                          {p.url && (
                            <a
                              className="ps-name__link"
                              href={p.url}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              View
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="num">${Number(p.current_price).toFixed(2)}</td>
                      <td className="num">
                        {p.last_price != null
                          ? `$${Number(p.last_price).toFixed(2)}`
                          : "—"}
                      </td>
                      <td className={`num ${changeClass}`}>{pctText}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
