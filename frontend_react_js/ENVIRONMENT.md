# PriceSense Frontend Environment

Variables to set in your .env (use .env.example as a reference):

- REACT_APP_API_BASE: Base URL for backend API (default http://localhost:3001)
- REACT_APP_HEALTHCHECK_PATH: Health endpoint path relative to API base (default /)
- REACT_APP_FEATURE_FLAGS: JSON object string for toggles. Example:
  {"charts": true}

Feature flags:
- charts: Enable the ProductChart visualization (default true)
