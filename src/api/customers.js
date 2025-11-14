import api from './index.js';


export const customersAPI = {
  // Get all customers with pagination and filters
  getAllCustomers: async (params = {}) => {
    try {
      const response = await api.get('/admin/customers', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  // Get customer details by ID
  getCustomerDetails: async (customerId) => {
    try {
      const response = await api.get(`/admin/customers/${customerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer details:', error);
      throw error;
    }
  },

  // Toggle customer active status
  toggleCustomerStatus: async (customerId) => {
    try {
      const response = await api.put(`/admin/customers/${customerId}/toggle-status`);
      return response.data;
    } catch (error) {
      console.error('Error toggling customer status:', error);
      throw error;
    }
  }
};