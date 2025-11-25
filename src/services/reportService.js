import api from './api';

const reportService = {
  // Get all reports
  getAllReports: async () => {
    try {
      const response = await api.get('/reports');
      // Handle Laravel API resource collection format which may include a data property
      return response.data.data || response.data || [];
    } catch (error) {
      console.error('Error fetching reports:', error);
      // Return empty array in case of error to prevent filter issues
      return [];
    }
  },

  // Get report by ID
  getReportById: async (id) => {
    try {
      const response = await api.get(`/reports/${id}`);
      // Handle Laravel API resource format which may include a data property
      return response.data.data || response.data || null;
    } catch (error) {
      console.error(`Error fetching report with ID ${id}:`, error);
      return null;
    }
  },

  // Create a new report
  createReport: async (reportData) => {
    try {
      const response = await api.post('/reports', reportData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update a report
  updateReport: async (id, reportData) => {
    try {
      const response = await api.put(`/reports/${id}`, reportData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update report status
  updateReportStatus: async (id, status) => {
    try {
      const response = await api.patch(`/reports/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add comment to a report
  addComment: async (id, comment) => {
    try {
      const response = await api.post(`/reports/${id}/comments`, { comment });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete a report
  deleteReport: async (id) => {
    try {
      const response = await api.delete(`/reports/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default reportService;
