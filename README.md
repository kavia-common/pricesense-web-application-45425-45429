# PriceSense Monorepo Workspace

This workspace contains:
- frontend_react_js: React frontend for PriceSense
- backend: FastAPI backend (in sibling workspace: pricesense-web-application-45425-45430/backend)

Quick start:
1) Backend: see backend/README.md in its workspace for setup, env, and endpoints.
2) Frontend: see frontend_react_js/README.md for environment variables and running locally.

Key env for frontend:
- REACT_APP_API_BASE=http://localhost:3001
- REACT_APP_HEALTHCHECK_PATH=/
- REACT_APP_FEATURE_FLAGS={"charts":true}