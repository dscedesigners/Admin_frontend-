import api from './index.js';

export const productsAPI = {
  // Get all products
  getAllProducts: async () => {
    try {
      const response = await api.get('/product/getproducts');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get single product
  getProduct: async (productId) => {
    try {
      const response = await api.get(`/product/getproduct/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Get top products
  getTopProducts: async (limit = 5) => {
    try {
      const response = await api.get(`/product/top?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching top products:', error);
      throw error;
    }
  },

  // Get product statistics
  getProductStats: async () => {
    try {
      const response = await api.get('/product/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching product stats:', error);
      throw error;
    }
  }
};