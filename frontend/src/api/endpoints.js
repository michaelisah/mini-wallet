import apiClient from './axios';

export default {
    // Auth endpoints
    auth: {
        login(credentials) {
            return apiClient.post('/login', credentials);
        },
        register(userData) {
            return apiClient.post('/register', userData);
        },
        logout() {
            return apiClient.post('/logout');
        },
        getUser() {
            return apiClient.get('/user');
        }
    },
    
    // Transaction endpoints
    transactions: {
        getAll(params = {}) {
            return apiClient.get('/transactions', { params });
        },
        create(transactionData) {
            return apiClient.post('/transactions', transactionData);
        },
        getTransaction(id) {
            return apiClient.get(`/transactions/${id}`);
        },
        getStats() {
            return apiClient.get('/transactions/stats');
        }
    },
    
    // User endpoints
    users: {
        search(query) {
            return apiClient.get('/users/search', { params: { query } });
        },
        getProfile() {
            return apiClient.get('/users/profile');
        }
    }
};