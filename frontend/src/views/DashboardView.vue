<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="py-8">
      <!-- Welcome Section -->
      <div class="pb-5 border-b relative float-start w-full border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h3 class="text-2xl leading-6 font-medium text-gray-900">
          Welcome back, {{ authStore.user?.name }}
        </h3>
        <div class="mt-3 sm:mt-0 sm:ml-4">
          <router-link
            to="/transfer"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            New Transfer
          </router-link>
        </div>
      </div>

      <!-- Stats -->
      <div class="mt-5 relative py-5 float-start w-full grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <!-- Balance Card -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1 px-2">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Available Balance</dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">
                      {{ formatCurrency(transactionStore.currentBalance) }}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-4 sm:px-6">
            <div class="text-sm">
              <router-link to="/transactions" class="font-medium text-indigo-600 hover:text-indigo-500">View all transactions<span class="sr-only">View transactions</span></router-link>
            </div>
          </div>
        </div>

        <!-- Total Sent -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-red-500 rounded-md p-3">
                <svg class="h-6 w-6 text-white transform -rotate-45" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1 px-2">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Total Sent</dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">
                      {{ formatCurrency(stats.totalSent) }}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-4 sm:px-6">
            <div class="text-sm">
              <router-link to="/transactions?type=sent" class="font-medium text-indigo-600 hover:text-indigo-500">View sent transactions<span class="sr-only">View sent transactions</span></router-link>
            </div>
          </div>
        </div>

        <!-- Total Received -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <svg class="h-6 w-6 text-white transform rotate-225" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
              </div>
              <div class="ml-5 w-0 flex-1 px-2">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Total Received</dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">
                      {{ formatCurrency(stats.totalReceived) }}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-4 sm:px-6">
            <div class="text-sm">
              <router-link to="/transactions?type=received" class="font-medium text-indigo-600 hover:text-indigo-500">View received transactions<span class="sr-only">View received transactions</span></router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Transactions -->
      <div class="py-5 relative float-start w-full">
        <div class="sm:flex sm:items-center">
          <div class="sm:flex-auto">
            <h2 class="text-lg font-medium text-gray-900">Recent Transactions</h2>
            <p class="mt-2 text-sm text-gray-700">A list of your recent transactions including details.</p>
          </div>
          <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <router-link
              to="/transactions"
              class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              View all
            </router-link>
          </div>
        </div>

        <div class="mt-8 flex w-full flex-col py-5">
          <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 align-middle px-2">
              <div class="overflow-hidden shadow ring-1 ring-gray ring-opacity-5 md:rounded-lg">
                <table class="min-w-full divide-y divide-gray-300">
                  <thead class="bg-gray-50">
                    <tr>
                      <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Transaction</th>
                      <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                      <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
                      <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Fee</th>
                      <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span class="sr-only">View</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 bg-white">
                    <tr v-if="transactionStore.loading">
                      <td colspan="5" class="px-3 py-4 text-sm text-gray-500 text-center">
                        <div class="flex justify-center">
                          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Loading transactions...
                        </div>
                      </td>
                    </tr>
                    <tr v-else-if="recentTransactions.length === 0">
                      <td colspan="5" class="px-3 py-4 text-sm text-gray-500 text-center">
                        No transactions found.
                      </td>
                    </tr>
                    <tr v-for="transaction in recentTransactions" :key="transaction.id" class="hover:bg-gray-50">
                      <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div class="flex items-center gap-2">
                          <div class="h-10 w-10 flex-shrink-0">
                            <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                              <span class="text-indigo-600 font-medium">
                                {{ transaction.otherParty?.name?.charAt(0) || 'U' }}
                              </span>
                            </div>
                          </div>
                          <div class="ml-4">
                            <div class="font-medium text-gray-900">
                              {{ transaction.isSent ? 'To: ' + (transaction.otherParty?.name || 'Unknown') : 'From: ' + (transaction.otherParty?.name || 'Unknown') }}
                            </div>
                            <div class="text-gray-500 truncate max-w-[200px]">{{ transaction.description || 'No description' }}</div>
                          </div>
                        </div>
                      </td>
                      <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {{ new Date(transaction.created_at).toLocaleDateString() }}
                      </td>
                      <td class="whitespace-nowrap px-3 py-4 text-sm">
                        <span class="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                          {{ transaction.status }}
                        </span>
                      </td>
                      <td class="whitespace-nowrap px-3 py-4 text-sm" :class="transaction.isSent ? 'text-red-600' : 'text-green-600'">
                        {{ transaction.isSent ? '-' : '' }}{{ formatCurrency(transaction.amount) }}
                      </td>
                      <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {{ transaction.isSent ? formatCurrency(transaction.commission_fee || 0) : '-' }}
                      </td>
                      <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <router-link :to="`/transactions/${transaction.id}`" class="text-indigo-600 hover:text-indigo-900">
                          View<span class="sr-only">, {{ transaction.id }}</span>
                        </router-link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useTransactionStore } from '@/stores/transaction';

const authStore = useAuthStore();
const transactionStore = useTransactionStore();

// Fetch transactions and stats when component is mounted
onMounted(async () => {
  try {
    // Fetch stats from backend
    const statsData = await transactionStore.fetchStats();
    transactionStore.setStats(statsData);

    // Fetch recent transactions
    await transactionStore.fetchTransactions();
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  }
});

// Use computed property to access stats from the store
const stats = computed(() => transactionStore.stats);

// Get recent transactions (first 5)
const recentTransactions = computed(() => {
  return transactionStore.formattedTransactions.slice(0, 5);
});

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount || 0);
};
</script>
