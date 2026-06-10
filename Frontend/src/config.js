// Central API configuration for production deployments
export const API_BASE = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD
  ? 'https://snippetbox-backend.onrender.com' // Fallback production URL, customizable via VITE_API_BASE_URL env var
  : 'http://localhost:4000');

export const API_URL = `${API_BASE}/api`;
