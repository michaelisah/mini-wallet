import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/api/endpoints';
import { useAuthStore } from './auth';

export const useTransactionStore = defineStore('transaction', () => {
    const transactions = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const currentBalance = ref(0);
    const stats = ref({
        totalSent: 0,
        totalReceived: 0,
        transactionCount: 0
    });
    const pagination = ref({
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0
    });

    // Getter for formatted transactions with additional data
    const formattedTransactions = computed(() => {
        const authStore = useAuthStore();

        return transactions.value.map(transaction => ({
            ...transaction,
            formattedAmount: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(transaction.amount),
            formattedDate: new Date(transaction.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            isSent: transaction.sender_id === authStore.user?.id,
            otherParty: transaction.sender_id === authStore.user?.id
                ? transaction.recipient
                : transaction.sender
        }));
    });

    // Get all transactions with pagination
    const fetchTransactions = async (page = 1) => {
        loading.value = true;
        error.value = null;

        try {
            const response = await api.transactions.getAll({ page });
            transactions.value = response.data.transactions.data;
            currentBalance.value = response.data.balance;

            // Update pagination info
            const { current_page, last_page, per_page, total } = response.data.transactions;
            pagination.value = { current_page, last_page, per_page, total };

            return response.data;
        } catch (err) {
            error.value = err.response?.data?.message || 'Failed to fetch transactions';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    // Create a new transaction
    const createTransaction = async (transactionData) => {
        loading.value = true;
        error.value = null;

        try {
            const response = await api.transactions.create(transactionData);

            // Add the new transaction to the beginning of the list
            transactions.value.unshift(response.data.transaction);

            // Update the current balance
            currentBalance.value = response.data.new_balance;

            // Update pagination total
            pagination.value.total += 1;

            return response.data;
        } catch (err) {
            error.value = err.response?.data?.message || 'Transaction failed. Please try again.';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    // Get a single transaction by ID
    const getTransaction = async (id) => {
        try {
            const response = await api.transactions.getTransaction(id);
            return response.data;
        } catch (err) {
            error.value = err.response?.data?.message || 'Failed to fetch transaction details';
            throw err;
        }
    };

    // Get user's current balance
    const fetchBalance = async () => {
        try {
            const response = await api.transactions.getAll();
            currentBalance.value = response.data.balance;
            return currentBalance.value;
        } catch (err) {
            console.error('Failed to fetch balance:', err);
            throw err;
        }
    };

    // Get transaction statistics
    const fetchStats = async () => {
        try {
            const response = await api.transactions.getStats();
            return response.data;
        } catch (err) {
            console.error('Failed to fetch stats:', err);
            throw err;
        }
    };

    // Handle new transaction from WebSocket
    const handleNewTransaction = (transactionData) => {
        const authStore = useAuthStore();
        const isCurrentUserInvolved =
            transactionData.sender_id === authStore.user?.id ||
            transactionData.recipient_id === authStore.user?.id;

        if (isCurrentUserInvolved) {
            // Add new transaction to the beginning of the list
            transactions.value = [transactionData, ...transactions.value];

            // Update current balance if it's the current user's transaction
            if (transactionData.sender_id === authStore.user?.id) {
                currentBalance.value = transactionData.balance_after_sender;
                // Update stats for sent transaction
                stats.value.totalSent = (stats.value.totalSent || 0) + parseFloat(transactionData.amount);
            } else if (transactionData.recipient_id === authStore.user?.id) {
                currentBalance.value = transactionData.balance_after_recipient;
                // Update stats for received transaction
                stats.value.totalReceived = (stats.value.totalReceived || 0) + parseFloat(transactionData.amount);
            }

            // Update transaction count
            stats.value.transactionCount = (stats.value.transactionCount || 0) + 1;

            // If we're keeping a limited number of recent transactions
            if (transactions.value.length > 50) {
                transactions.value = transactions.value.slice(0, 50);
            }
        }
    };

    // Set stats from API response
    const setStats = (apiStats) => {
        stats.value = {
            totalSent: parseFloat(apiStats.total_sent || 0),
            totalReceived: parseFloat(apiStats.total_received || 0),
            transactionCount: parseInt(apiStats.transaction_count || 0, 10)
        };
    };

    return {
        // State
        transactions,
        loading,
        error,
        currentBalance,
        stats,
        pagination,
        
        // Getters
        formattedTransactions,
        
        // Actions
        fetchStats,
        fetchTransactions,
        createTransaction,
        getTransaction,
        fetchBalance,
        handleNewTransaction,
        setStats,
        
        // For backward compatibility
        ...(import.meta.env.DEV ? {
            // These are internal functions, only exposed in development for debugging
            _setStats: setStats,
            _handleNewTransaction: handleNewTransaction
        } : {})
    };
}, {
    persist: true
});
