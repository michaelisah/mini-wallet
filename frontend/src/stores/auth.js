import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/api/endpoints';

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null);
    const isAuthenticated = ref(false);
    const loading = ref(false);
    const error = ref(null);

    // Getter for user's full name
    const fullName = computed(() => {
        return user.value ? user.value.name : '';
    });

    // Check if user is authenticated
    const checkAuth = async () => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            isAuthenticated.value = false;
            return false;
        }

        try {
            const response = await api.auth.getUser();
            user.value = response.data;
            isAuthenticated.value = true;
            return true;
        } catch (err) {
            localStorage.removeItem('auth_token');
            isAuthenticated.value = false;
            return false;
        }
    };

    // Login user
    const login = async (credentials) => {
        loading.value = true;
        error.value = null;

        try {
            const response = await api.auth.login(credentials);
            const { access_token, user_data } = response.data;

            localStorage.setItem('auth_token', access_token);
            user.value = user_data;
            isAuthenticated.value = true;

            return true;
        } catch (err) {
            error.value = err.response?.data?.message || 'Login failed. Please check your credentials.';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    // Register new user
    const register = async (userData) => {
        loading.value = true;
        error.value = null;

        try {
            const response = await api.auth.register(userData);
            const { token, user: userDataResponse } = response.data;

            localStorage.setItem('auth_token', token);
            user.value = userDataResponse;
            isAuthenticated.value = true;

            return true;
        } catch (err) {
            error.value = err.response?.data?.message || 'Registration failed. Please try again.';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    // Logout user
    const logout = async () => {
        try {
            await api.auth.logout();
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            localStorage.removeItem('auth_token');
            user.value = null;
            isAuthenticated.value = false;
        }
    };

    return {
        user,
        isAuthenticated,
        loading,
        error,
        fullName,
        checkAuth,
        login,
        register,
        logout,
    };
}, {
    persist: true // Persist state in localStorage
});
