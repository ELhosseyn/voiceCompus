import api from './api';

const suggestionService = {
  // Get all suggestions
  getAllSuggestions: async () => {
    try {
      const response = await api.get('/suggestions');
      // Handle Laravel API resource collection format which may include a data property
      return response.data.data || response.data || [];
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      // Return empty array in case of error to prevent filter issues
      return [];
    }
  },

  // Get suggestion by ID
  getSuggestionById: async (id) => {
    try {
      const response = await api.get(`/suggestions/${id}`);
      // Handle Laravel API resource format which may include a data property
      return response.data.data || response.data || null;
    } catch (error) {
      console.error(`Error fetching suggestion with ID ${id}:`, error);
      return null;
    }
  },

  // Create a new suggestion
  createSuggestion: async (suggestionData) => {
    try {
      const response = await api.post('/suggestions', suggestionData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        console.error('Validation errors:', error.response.data.errors);
      } else if (error.response && error.response.data) {
        console.error('Error creating suggestion:', error.response.data);
      } else {
        console.error('Error creating suggestion:', error.message);
      }
      throw error;
    }
  },

  // Update a suggestion
  updateSuggestion: async (id, suggestionData) => {
    try {
      const response = await api.put(`/suggestions/${id}`, suggestionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update suggestion status
  updateSuggestionStatus: async (id, status) => {
    try {
      const response = await api.patch(`/suggestions/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Vote for a suggestion
  voteSuggestion: async (id) => {
    try {
      const response = await api.post(`/suggestions/${id}/vote`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete a suggestion
  deleteSuggestion: async (id) => {
    try {
      const response = await api.delete(`/suggestions/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default suggestionService;
