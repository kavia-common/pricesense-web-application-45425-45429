# PriceSense Frontend (React)

Minimal React UI to track products, view price history, and see alerts.

## API Integration

The app talks to the backend using environment-configured base URL and paths aligned with the backend OpenAPI:

- GET /products
- POST /products
- GET /alerts
- GET /products/{product_id}/history
- Health: GET /

Configure the base URL with REACT_APP_API_BASE. The health path can be overridden by REACT_APP_HEALTHCHECK_PATH (defaults to "/").

Example .env (do not commit):

```
REACT_APP_API_BASE=http://localhost:3001
REACT_APP_HEALTHCHECK_PATH=/
REACT_APP_FEATURE_FLAGS={"charts":true}
```

## Getting Started

Install and run:

- npm install
- npm start

Open http://localhost:3000.

## Scripts

- npm start – Dev server
- npm test – Tests
- npm run build – Production build

## Notes on Empty States

The UI gracefully handles:
- No products: shows “No products yet. Add your first one!”
- No alerts: shows “No alerts at the moment.”
- No history: chart shows “No price history yet.”
- Backend unreachable: navbar health indicator turns red; list and alerts show error messages.

## Styling

See src/App.css for minimalist theme variables and components.

## Learn More

React docs: https://react.dev
