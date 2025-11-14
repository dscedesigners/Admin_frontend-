import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getCustomers = async () => {
    const response = await apiClient.get('/customers');
    return response.data;
};

export const getCustomerById = async (id) => {
    const response = await apiClient.get(`/customers/${id}`);
    return response.data;
};

export const getOrders = async () => {
    const response = await apiClient.get('/orders');
    return response.data;
};

export const getOrderById = async (id) => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
};

export const getVendors = async () => {
    const response = await apiClient.get('/vendors');
    return response.data;
};

export const getVendorById = async (id) => {
    const response = await apiClient.get(`/vendors/${id}`);
    return response.data;
};

export const getDashboardData = async () => {
    const response = await apiClient.get('/dashboard');
    return response.data;
};

// Export apiClient as named export and default export
export { apiClient };
export default apiClient;