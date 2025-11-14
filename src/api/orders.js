import api from './index.js';

export const ordersAPI = {
  // Get all orders with filters
  getAllOrders: async (params = {}) => {
    try {
      const response = await api.get('/admin/orders', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await api.put(`/admin/orders/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },
    // NEW: Get order analytics
  getOrderAnalytics: async (days = 7) => {
    try {
      const response = await api.get(`/order/analytics?days=${days}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order analytics:', error);
      throw error;
    }
  }
};