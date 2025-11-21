import React from "react";

/**
// PUBLIC_INTERFACE
 * AlertsPanel
 * Displays current price alerts in a compact list.
 * Props:
 * - loading: boolean
 * - error: string | null
 * - alerts: Array<{id, product_id, product_name, price, triggered_at}>
 */
export default function AlertsPanel({ loading, error, alerts = [] }) {
  return (
    <section className="ps-card">
      <div className="ps-card__header">
        <h2 className="ps-title">Alerts</h2>
      </div>
      <div className="ps-card__body">
        {loading && <div className="ps-state">Loading alerts…</div>}
        {error && (
          <div className="ps-state ps-error" role="alert">
            {error}
          </div>
        )}
        {!loading && !error && alerts.length === 0 && (
          <div className="ps-state">No alerts at the moment.</div>
        )}
        <ul className="ps-list">
          {alerts.map((a) => (
            <li key={a.id} className="ps-list__item">
              <div className="ps-alert">
                <div className="ps-alert__title">
                  {a.product_name || `Product #${a.product_id}`}
                </div>
                <div className="ps-alert__meta">
                  Drop to ${Number(a.price).toFixed(2)} •{" "}
                  {new Date(a.triggered_at).toLocaleString()}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
