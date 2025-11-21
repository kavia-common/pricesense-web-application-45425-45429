# PriceSense Frontend Environment

Create a `.env` file in the project root with the following variables:

- REACT_APP_API_BASE: Base URL for backend API (default http://localhost:3001)
- REACT_APP_HEALTHCHECK_PATH: Health endpoint path relative to API base (default /)
- REACT_APP_FEATURE_FLAGS: JSON object string for toggles, e.g. `{"charts": true}`

Example:
```
REACT_APP_API_BASE=http://localhost:3001
REACT_APP_HEALTHCHECK_PATH=/
REACT_APP_FEATURE_FLAGS={"charts":true}
```

Feature flags:
- charts: Enable the ProductChart visualization (default true)
