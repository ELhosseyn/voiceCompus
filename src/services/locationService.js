import api from './api';

const locationService = {
  // Get all locations
  getAllLocations: async () => {
    try {
      const response = await api.get('/locations');
      // Handle Laravel API resource collection format which may include a data property
      return response.data.data || response.data || [];
    } catch (error) {
      console.error('Error fetching locations:', error);
      // Return empty array in case of error
      return [];
    }
  },

  // Get location by ID
  getLocationById: async (id) => {
    try {
      const response = await api.get(`/locations/${id}`);
      // Handle Laravel API resource format which may include a data property
      return response.data.data || response.data || null;
    } catch (error) {
      console.error(`Error fetching location with ID ${id}:`, error);
      return null;
    }
  },

  // Create a new location (admin only)
  createLocation: async (locationData) => {
    try {
      const response = await api.post('/locations', locationData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update a location (admin only)
  updateLocation: async (id, locationData) => {
    try {
      const response = await api.put(`/locations/${id}`, locationData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete a location (admin only)
  deleteLocation: async (id) => {
    try {
      const response = await api.delete(`/locations/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default locationService;
