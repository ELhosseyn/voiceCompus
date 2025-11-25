import api from './api';

const departmentService = {
  // Get all departments
  getAllDepartments: async () => {
    try {
      const response = await api.get('/departments');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get department by ID
  getDepartmentById: async (id) => {
    try {
      const response = await api.get(`/departments/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create a new department (admin only)
  createDepartment: async (departmentData) => {
    try {
      const response = await api.post('/departments', departmentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update a department (admin only)
  updateDepartment: async (id, departmentData) => {
    try {
      const response = await api.put(`/departments/${id}`, departmentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete a department (admin only)
  deleteDepartment: async (id) => {
    try {
      const response = await api.delete(`/departments/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default departmentService;
