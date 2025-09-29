// Placeholder for API calls

const API_BASE_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001';

export const api = {

  // Example

  getHealth: async () => {

    const response = await fetch(`${API_BASE_URL}/api/health`);

    return response.json();

  },

};

// For future: login, register, getGames, etc.
