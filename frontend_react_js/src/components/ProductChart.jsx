import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

/**
// PUBLIC_INTERFACE
 * ProductChart
 * Shows price history for a selected product.
 * Props:
 * - product: {id, name}
 * - data: Array<{timestamp, price}>
 * - enabled: boolean (feature flag)
 */
export default function ProductChart({ product, data = [], enabled = true }) {
  if (!enabled) {
    return null;
  }
  return (
    <section className="ps-card">
      <div className="ps-card__header">
        <h2 className="ps-title">{product ? product.name : "Price Trend"}</h2>
      </div>
      <div className="ps-card__body" style={{ height: 280 }}>
        {!product ? (
          <div className="ps-state">Select a product to see its trend.</div>
        ) : data.length === 0 ? (
          <div className="ps-state">No price history yet.</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
              <defs>
                <linearGradient id="psLine" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#F3F4F6" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(t) => new Date(t).toLocaleDateString()}
                tick={{ fill: "#6B7280", fontSize: 12 }}
              />
              <YAxis
                tick={{ fill: "#6B7280", fontSize: 12 }}
                tickFormatter={(v) => `$${Number(v).toFixed(0)}`}
              />
              <Tooltip
                labelFormatter={(l) => new Date(l).toLocaleString()}
                formatter={(v) => [`$${Number(v).toFixed(2)}`, "Price"]}
                contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB" }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#10B981"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
