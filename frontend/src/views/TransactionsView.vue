<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="py-8">
      <!-- Page header -->
      <div class="relative float-start w-full sm:items-center pb-5 flex">
        <div class="sm:flex-auto">
          <h1 class="text-2xl font-semibold text-gray-900 mb-2">Transactions</h1>
          <p class="mt-2 text-sm text-gray-700">
            A list of all your transactions including amount, date, and status.
          </p>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <router-link
            to="/transfer"
            class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            New Transfer
          </router-link>
        </div>
      </div>

      <!-- Filters -->
      <div class="relative float-start w-full mt-6 py-5">
        <div class="bg-white shadow rounded-lg p-4">
          <div class="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4 lg:grid-cols-4">
            <!-- Type Filter -->
            <div class="flex flex-col gap-2">
              <label for="type" class="relative float-start w-full block text-sm font-medium text-gray-700">Type</label>
              <select
                id="type"
                v-model="filters.type"
                style="color:#000000;"
                class="mt-1 block relative float-start w-full rounded-md border border-gray-200 py-2 pl-3 pr-10 text-base  sm:text-sm"
              >
                <option :value="null">All Types</option>
                <option value="sent">Sent</option>
                <option value="received">Received</option>
              </select>
            </div>

            <!-- Date Range -->
            <div class="flex flex-col gap-2">
              <label for="date-range" class="relative float-start w-full block text-sm font-medium text-gray-700">Date Range</label>
              <select
                id="date-range"
                v-model="filters.dateRange"
                style="color:#000000;"
                class="mt-1 block relative float-start w-full rounded-md border py-2 pl-3 pr-10 text-base border-gray-200  sm:text-sm"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>

            <!-- Status -->
            <div class="flex flex-col gap-2">
              <label for="status" class="relative float-start w-full  block text-sm font-medium text-gray-700">Status</label>
              <select
                id="status"
                v-model="filters.status"
                style="color:#000000;"
                class="mt-1 block relative float-start w-full rounded-md border py-2 pl-3 pr-10 text-base border-gray-200  sm:text-sm"
              >
                <option :value="null">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <!-- Search -->
            <div class="flex flex-col gap-2">
              <label for="search" class="relative float-start w-full block text-sm font-medium text-gray-700 mb-4">Search</label>
              <div class="relative float-start w-full mt-1 py-2 rounded-md border">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  v-model="filters.search"
                  class="block w-full pl-10 sm:text-sm rounded-md text-black"
                  placeholder="Search transactions..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Transactions Table -->
      <div class="relative float-start w-full mt-8 flex flex-col py-5">
        <div class="w-full relative float-start overflow-x-auto">
          <div class="inline-block min-w-full py-2 align-middle px-2">
            <div class="overflow-hidden shadow md:rounded-lg">
              <table class="min-w-full divide-y divide-gray-300">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      <button type="button" class="group inline-flex" @click="sortBy('created_at')">
                        Transaction
                        <span class="ml-2 flex-none rounded text-gray-400">
                          <span v-if="sort.column === 'created_at'" class="flex-none rounded bg-gray-100 text-gray-900 group-hover:bg-gray-200">
                            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path v-if="sort.direction === 'asc'" fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                              <path v-else fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                            </svg>
                          </span>
                          <span v-else class="opacity-0 group-hover:opacity-100">
                            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                            </svg>
                          </span>
                        </span>
                      </button>
                    </th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      <button type="button" class="group inline-flex" @click="sortBy('amount')">
                        Amount
                        <span class="ml-2 flex-none rounded text-gray-400">
                          <span v-if="sort.column === 'amount'" class="flex-none rounded bg-gray-100 text-gray-900 group-hover:bg-gray-200">
                            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path v-if="sort.direction === 'asc'" fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                              <path v-else fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                            </svg>
                          </span>
                          <span v-else class="opacity-0 group-hover:opacity-100">
                            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                            </svg>
                          </span>
                        </span>
                      </button>
                    </th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      <button type="button" class="group inline-flex" @click="sortBy('created_at')">
                        Date
                        <span class="ml-2 flex-none rounded text-gray-400">
                          <span v-if="sort.column === 'created_at'" class="flex-none rounded bg-gray-100 text-gray-900 group-hover:bg-gray-200">
                            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path v-if="sort.direction === 'asc'" fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                              <path v-else fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                            </svg>
                          </span>
                          <span v-else class="opacity-0 group-hover:opacity-100">
                            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                            </svg>
                          </span>
                        </span>
                      </button>
                    </th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Fee</th>
                    <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span class="sr-only">View</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                  <tr v-if="isLoading">
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
                  <tr v-else-if="filteredTransactions.length === 0">
                    <td colspan="5" class="px-3 py-4 text-sm text-gray-500 text-center">
                      No transactions found matching your criteria.
                    </td>
                  </tr>
                  <tr v-for="transaction in paginatedTransactions" v-else :key="transaction.id" class="hover:bg-gray-50">
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
                          <div class="text-gray-500 truncate max-w-[200px]" :title="transaction.description">{{ transaction.description || 'No description' }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm" :class="transaction.isSent ? 'text-red-600' : 'text-green-600'">
                      <div class="font-medium">
                        {{ transaction.isSent ? '-' : '' }}{{ formatCurrency(transaction.amount) }}
                      </div>
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {{ formatDate(transaction.created_at) }}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm">
                      <span :class="getStatusBadgeClass(transaction.status)">
                        {{ transaction.status }}
                      </span>
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

      <!-- Pagination -->
      <div class="relative float-start w-full mt-5 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div class="flex flex-1 justify-between sm:hidden">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            @click="currentPage++"
            :disabled="currentPage >= totalPages"
            class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
              to <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredTransactions.length) }}</span>
              of <span class="font-medium">{{ filteredTransactions.length }}</span> results
            </p>
          </div>
          <div>
            <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                :class="{
                  'opacity-50 cursor-not-allowed': currentPage === 1,
                  'hover:bg-gray-50': currentPage > 1
                }"
                class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0"
              >
                <span class="sr-only">Previous</span>
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
                </svg>
              </button>

              <template v-for="page in visiblePages" :key="page">
                <button
                  v-if="page === '...'"
                  disabled
                  class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"
                >
                  {{ page }}
                </button>
                <button
                  v-else
                  @click="currentPage = page"
                  :class="{
                    'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600': currentPage === page,
                    'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0': currentPage !== page
                  }"
                  class="relative inline-flex items-center px-4 py-2 text-sm font-semibold"
                >
                  {{ page }}
                </button>
              </template>

              <button
                @click="currentPage++"
                :disabled="currentPage >= totalPages"
                :class="{
                  'opacity-50 cursor-not-allowed': currentPage >= totalPages,
                  'hover:bg-gray-50': currentPage < totalPages
                }"
                class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0"
              >
                <span class="sr-only">Next</span>
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTransactionStore } from '@/stores/transaction';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const transactionStore = useTransactionStore();

// State
const isLoading = ref(true);
const currentPage = ref(1);
const itemsPerPage = 10;

// Initialize filters with query parameters
const filters = ref({
  type: route.query.type || null, // 'sent' or 'received'
  dateRange: route.query.dateRange || 'all', // 'all', 'today', 'week', 'month', 'year'
  status: route.query.status || null, // 'completed', 'pending', 'failed'
  search: route.query.search || ''
});

// Sorting
const sort = ref({
  column: 'created_at',
  direction: 'desc' // 'asc' or 'desc'
});

// Watch for filter changes and update URL
watch(
  () => filters.value,
  (newFilters) => {
    // Update URL with the new filters
    const query = { ...route.query };
    
    // Only add non-default values to the query
    if (newFilters.type) query.type = newFilters.type;
    else delete query.type;
    
    if (newFilters.dateRange !== 'all') query.dateRange = newFilters.dateRange;
    else delete query.dateRange;
    
    if (newFilters.status) query.status = newFilters.status;
    else delete query.status;
    
    if (newFilters.search) query.search = newFilters.search;
    else delete query.search;
    
    // Update URL without triggering navigation
    router.replace({ query });
    
    // Fetch transactions with the updated filters
    fetchTransactions();
  },
  { deep: true }
);

// Watch for route query changes
watch(
  () => route.query,
  (newQuery) => {
    // Update filters when URL query changes
    filters.value = {
      type: newQuery.type || null,
      dateRange: newQuery.dateRange || 'all',
      status: newQuery.status || null,
      search: newQuery.search || ''
    };
  },
  { immediate: true }
);

// Fetch transactions with current filters
const fetchTransactions = async () => {
  try {
    isLoading.value = true;
    
    // Prepare query parameters
    const query = {
      page: currentPage.value,
      ...(filters.value.type && { is_sent: filters.value.type === 'sent' }),
      ...(filters.value.status && { status: filters.value.status }),
      ...(filters.value.search && { search: filters.value.search }),
      sort_by: sort.value.column,
      sort_order: sort.value.direction
    };
    
    await transactionStore.fetchTransactions(query);
  } catch (error) {
    console.error('Error fetching transactions:', error);
  } finally {
    isLoading.value = false;
  }
};

// Initial fetch
onMounted(() => {
  fetchTransactions();
});

// Apply filters and sorting to transactions
const filteredTransactions = computed(() => {
  return transactionStore.formattedTransactions.filter(transaction => {
    // Filter by type (sent/received)
    if (filters.value.type === 'sent' && !transaction.isSent) return false;
    if (filters.value.type === 'received' && transaction.isSent) return false;

    // Filter by date range
    const transactionDate = new Date(transaction.created_at);
    const now = new Date();

    if (filters.value.dateRange === 'today') {
      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);
      if (transactionDate < startOfDay) return false;
    } else if (filters.value.dateRange === 'week') {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      if (transactionDate < startOfWeek) return false;
    } else if (filters.value.dateRange === 'month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      if (transactionDate < startOfMonth) return false;
    } else if (filters.value.dateRange === 'year') {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      if (transactionDate < startOfYear) return false;
    }

    // Filter by status
    if (filters.value.status && transaction.status.toLowerCase() !== filters.value.status) {
      return false;
    }

    // Search filter
    if (filters.value.search) {
      const searchTerm = filters.value.search.toLowerCase();
      const searchFields = [
        transaction.otherParty?.name || '',
        transaction.description || '',
        transaction.amount.toString(),
        transaction.status
      ];

      if (!searchFields.some(field => field.toLowerCase().includes(searchTerm))) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    // Apply sorting
    let comparison = 0;
    const aValue = a[sort.value.column];
    const bValue = b[sort.value.column];

    if (aValue > bValue) {
      comparison = 1;
    } else if (aValue < bValue) {
      comparison = -1;
    }

    return sort.value.direction === 'asc' ? comparison : -comparison;
  });
});

// Pagination
const totalPages = computed(() => {
  return Math.ceil(filteredTransactions.value.length / itemsPerPage);
});

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredTransactions.value.slice(start, end);
});

const visiblePages = computed(() => {
  const pages = [];
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2));
  let endPage = startPage + maxVisiblePages - 1;

  if (endPage > totalPages.value) {
    endPage = totalPages.value;
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  if (startPage > 1) {
    pages.push(1);
    if (startPage > 2) {
      pages.push('...');
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (endPage < totalPages.value) {
    if (endPage < totalPages.value - 1) {
      pages.push('...');
    }
    pages.push(totalPages.value);
  }

  return pages;
});

// Watch for filter changes and reset to first page
watch([() => filters.value, () => sort.value], () => {
  currentPage.value = 1;
});

// Methods
function sortBy(column) {
  if (sort.value.column === column) {
    sort.value.direction = sort.value.direction === 'asc' ? 'desc' : 'asc';
  } else {
    sort.value.column = column;
    sort.value.direction = 'asc';
  }
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount || 0);
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getStatusBadgeClass(status) {
  const statusClasses = {
    completed: 'inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800',
    pending: 'inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800',
    failed: 'inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800'
  };

  return statusClasses[status.toLowerCase()] || 'inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800';
}
</script>
