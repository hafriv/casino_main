// Placeholder for API calls
// Use Vite environment variable VITE_API_BASE to allow switching the API base
// without changing frontend code. Default to '' so production uses relative
// paths (e.g. /api/...). During development Vite will proxy /api to the
// backend (see vite.config.js) so the same relative paths work.

const API_BASE_URL = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE !== undefined
  ? import.meta.env.VITE_API_BASE
  : '';

export const api = {
  // Example
  getHealth: async () => {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return response.json();
  },

  // Add more endpoints here (login, register, games, etc.) using the same
  // API_BASE_URL so the frontend doesn't need to know about backend host/port.
};
