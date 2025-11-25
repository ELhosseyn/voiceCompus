import api from './api';

const categoryService = {
  // Get all categories
  getAllCategories: async () => {
    try {
      const response = await api.get('/categories');
      // Handle Laravel API resource collection format which may include a data property
      return response.data.data || response.data || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Return empty array in case of error
      return [];
    }
  },

  // Get category by ID
  getCategoryById: async (id) => {
    try {
      const response = await api.get(`/categories/${id}`);
      // Handle Laravel API resource format which may include a data property
      return response.data.data || response.data || null;
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error);
      return null;
    }
  },

  // Create a new category (admin only)
  createCategory: async (categoryData) => {
    try {
      const response = await api.post('/categories', categoryData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update a category (admin only)
  updateCategory: async (id, categoryData) => {
    try {
      const response = await api.put(`/categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete a category (admin only)
  deleteCategory: async (id) => {
    try {
      const response = await api.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default categoryService;
