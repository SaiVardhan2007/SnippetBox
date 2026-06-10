// Central API configuration for production deployments
export const API_BASE = import.meta.env.PROD
  ? 'https://snippetbox-backend.onrender.com' // Replace with your production Render backend URL
  : 'http://localhost:4000';

export const API_URL = `${API_BASE}/api`;
