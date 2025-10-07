<template>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Page header -->
    <div class="w-full relative float-start bg-white shadow">
      <div class="px-4 sm:px-6 lg:mx-auto lg:max-w-6xl lg:px-8">
        <div class="py-6 flex justify-center items-center lg:border-gray-200">
          <div class="min-w-0 flex-1">
            <div class="flex items-center">
              <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                Send Money
              </h1>
            </div>
          </div>
          <div class="mt-4 flex md:mt-0 md:ml-4">
            <router-link
              to="/transactions"
              class="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              View All Transactions
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div class="w-full relative float-start py-8 flex justify-center">
      <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div class="w-full relative float-start bg-white shadow sm:rounded-lg pb-5">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="w-full relative float-start text-lg font-medium leading-6 pb-3 text-gray-900">Transfer Details</h3>

            <!-- Error Alert -->
            <div v-if="transferError" class="w-full relative float-start py-4 rounded-md bg-red-50">
              <div class="flex">
                <div class="flex-shrink-0 px-3">
                  <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-red-800">
                    {{ transferError }}
                  </h3>
                </div>
              </div>
            </div>

            <form class="w-full relative float-start mt-6 space-y-6" @submit.prevent="handleTransfer">
              <!-- Recipient Selection -->
              <div class="relative float-start w-full flex flex-col gap-3 py-2">
                <label for="recipient" class="block text-sm font-medium text-gray-700">Recipient</label>
                <div class="mt-1 relative">
                  <input
                    type="text"
                    id="recipient"
                    class="p-2 border text-black"
                    v-model="form.recipientQuery"
                    @focus="showRecipients = true"
                    @blur="hideRecipients"
                    autocomplete="off"
                    :class="[errors.recipient ? 'border-red-300' : 'border-gray-300', 'block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm']"
                    placeholder="Search by name or email"
                  />
                  <p v-if="errors.recipient" class="mt-2 text-sm text-red-600">{{ errors.recipient }}</p>

                  <!-- Recipient Dropdown -->
                  <div v-if="showRecipients && filteredRecipients.length > 0" class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    <div
                      v-for="recipient in filteredRecipients"
                      :key="recipient.id"
                      @mousedown="selectRecipient(recipient)"
                      class="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white"
                    >
                      <div class="flex items-center gap-2">
                        <div class="h-8 w-8 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span class="text-indigo-600 font-medium">{{ recipient.name.charAt(0) }}</span>
                        </div>
                        <div class="ml-3">
                          <p class="font-medium">{{ recipient.name }}</p>
                          <p class="text-xs text-gray-500">{{ recipient.email }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Selected Recipient -->
                <div v-if="form.recipient" class="mt-2 flex items-center gap-2">
                  <div class="h-10 w-10 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span class="text-indigo-600 font-medium">{{ form.recipient.name.charAt(0) }}</span>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">{{ form.recipient.name }}</p>
                    <p class="text-xs text-gray-500">{{ form.recipient.email }}</p>
                  </div>
                  <button
                    type="button"
                    @click="form.recipient = null; form.recipientQuery = ''"
                    class="ml-auto text-gray-400 hover:text-gray-500"
                  >
                    <span class="sr-only">Remove</span>
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Amount -->
              <div class="relative float-start w-full flex flex-col gap-3 py-2">
                <label for="amount" class="block text-sm font-medium text-gray-700">Amount</label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="text"
                    id="amount"
                    class="p-2 border text-black"
                    v-model="form.amount"
                    @input="formatAmount"
                    :class="[errors.amount ? 'border-red-300' : 'border-gray-300', 'pl-7 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm']"
                    placeholder="0.00"
                  />
                </div>
                <p v-if="errors.amount" class="mt-2 text-sm text-red-600">{{ errors.amount }}</p>
                <p class="mt-1 text-xs text-gray-500">Available balance: {{ formatCurrency(authStore.user?.balance || 0) }}</p>

                <!-- Fee Information -->
                <div v-if="form.amount && parseFloat(form.amount) > 0" class="mt-4 p-3 bg-gray-50 rounded-md flex flex-col gap-2">
                  <div class="flex justify-between text-sm text-gray-600">
                    <span>Amount to send:</span>
                    <span class="font-medium">{{ formatCurrency(parseFloat(form.amount)) }}</span>
                  </div>
                  <div class="flex justify-between text-sm text-gray-600 mt-1">
                    <span>Transaction fee ({{ feePercentage }}%):</span>
                    <span class="font-medium">{{ formatCurrency(calculateFee(parseFloat(form.amount))) }}</span>
                  </div>
                  <div class="flex justify-between text-sm font-semibold text-gray-900 mt-2 pt-2 border-t border-gray-200">
                    <span>Total to debit:</span>
                    <span>{{ formatCurrency(calculateTotal(parseFloat(form.amount))) }}</span>
                  </div>
                </div>
              </div>

              <!-- Description -->
              <div class="relative float-start w-full flex flex-col gap-3 py-2">
                <label for="description" class="block text-sm font-medium text-gray-700">Description (Optional)</label>
                <div class="mt-1">
                  <textarea
                    id="description"
                    v-model="form.description"
                    rows="3"
                    style="color:#000000;"
                    class="block w-full rounded-md border border-gray-200 border-gray p-3 shadow-sm sm:text-sm"
                    placeholder="What's this transfer for?"
                    :class="[errors.amount ? 'border-red-300' : 'border-gray-300', 'pl-7 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm']"
                  />
                </div>
                <p v-if="errors.description" class="mt-2 text-sm text-red-600">{{ errors.description }}</p>
              </div>

              <div class="flex justify-end space-x-3 pt-4 relative float-start w-full gap-3">
                <router-link
                  to="/"
                  class="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Cancel
                </router-link>
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ isSubmitting ? 'Sending...' : 'Send Money' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Recent Transfers -->
        <div class="w-full relative float-start pt-8">
          <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 class="text-lg font-medium leading-6 text-gray-900">Recent Transfers</h3>
            </div>
            <div class="divide-y divide-gray-200">
              <div v-if="recentTransfers.length === 0" class="px-4 py-5 sm:p-6 text-center">
                <p class="text-sm text-gray-500">No recent transfers found.</p>
              </div>
              <div v-else v-for="transfer in recentTransfers" :key="transfer.id" class="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div class="flex items-center gap-2">
                  <div class="h-10 w-10 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span class="text-indigo-600 font-medium">
                      {{ transfer.otherParty?.name?.charAt(0) || 'U' }}
                    </span>
                  </div>
                  <div class="ml-4 flex-1 min-w-0">
                    <p class="text-sm font-medium text-indigo-600 truncate">
                      {{ transfer.isSent ? 'To: ' + (transfer.otherParty?.name || 'Unknown') : 'From: ' + (transfer.otherParty?.name || 'Unknown') }}
                    </p>
                    <p class="text-sm text-gray-500 truncate">{{ transfer.description || 'No description' }}</p>
                  </div>
                  <div class="ml-4 flex-shrink-0">
                    <p class="text-sm font-medium" :class="transfer.isSent ? 'text-red-600' : 'text-green-600'">
                      {{ transfer.isSent ? '-' : '' }}{{ formatCurrency(transfer.amount) }}
                    </p>
                    <p class="text-xs text-gray-500">{{ formatDate(transfer.created_at) }}</p>
                  </div>
                </div>
              </div>
              <div v-if="recentTransfers.length > 0" class="px-4 py-3 text-right sm:px-6">
                <router-link to="/transactions" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  View all transactions
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useTransactionStore } from '@/stores/transaction';
import api from '@/api/endpoints';

const router = useRouter();
const authStore = useAuthStore();
const transactionStore = useTransactionStore();

// Form state
const form = ref({
  recipient: null,
  recipientQuery: '',
  amount: '',
  description: ''
});

// UI state
const isSubmitting = ref(false);
const transferError = ref('');
const showRecipients = ref(false);
const errors = ref({
  recipient: '',
  amount: '',
  description: ''
});

// Recipients from API
const recipients = ref([]);
const isSearching = ref(false);

// Watch for recipient query changes and search
watch(() => form.value.recipientQuery, async (newQuery) => {
  if (newQuery && newQuery.length >= 2) {
    isSearching.value = true;
    try {
      const response = await api.users.search(newQuery);
      recipients.value = response.data;
      showRecipients.value = true;
    } catch (error) {
      console.error('Error searching users:', error);
      recipients.value = [];
    } finally {
      isSearching.value = false;
    }
  } else {
    recipients.value = [];
    showRecipients.value = false;
  }
});

// Filter recipients based on search query
const filteredRecipients = computed(() => {
  return recipients.value;
});

// Recent transfers (in a real app, this would come from an API)
const recentTransfers = computed(() => {
  return transactionStore.formattedTransactions
    .filter(t => t.isSent)
    .slice(0, 3);
});

// Fee percentage (in a real app, this would come from an API or config)
const feePercentage = 1.5; // 1.5% fee

// Calculate fee for a given amount
const calculateFee = (amount) => {
  return (amount * feePercentage) / 100;
};

// Calculate total amount (amount + fee)
const calculateTotal = (amount) => {
  return amount + calculateFee(amount);
};

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount || 0);
};

const hideRecipients = () => {
  setTimeout(() => { showRecipients.value = false }, 200)
}
// Format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Format amount as user types
const formatAmount = (event) => {
  // Remove all non-digit characters except decimal point
  let value = event.target.value.replace(/[^\d.]/g, '');

  // Ensure only one decimal point
  const decimalSplit = value.split('.');
  if (decimalSplit.length > 2) {
    value = decimalSplit[0] + '.' + decimalSplit.slice(1).join('');
  }

  // Limit to 2 decimal places
  if (decimalSplit.length === 2 && decimalSplit[1].length > 2) {
    value = decimalSplit[0] + '.' + decimalSplit[1].substring(0, 2);
  }

  form.value.amount = value;
};

// Select a recipient
const selectRecipient = (recipient) => {
  form.value.recipient = recipient;
  form.value.recipientQuery = '';
  showRecipients.value = false;
};

// Validate form
const validateForm = () => {
  let isValid = true;
  errors.value = { recipient: '', amount: '', description: '' };

  // Validate recipient
  if (!form.value.recipient) {
    errors.value.recipient = 'Please select a recipient';
    isValid = false;
  }

  // Validate amount
  if (!form.value.amount) {
    errors.value.amount = 'Please enter an amount';
    isValid = false;
  } else if (isNaN(parseFloat(form.value.amount)) || parseFloat(form.value.amount) <= 0) {
    errors.value.amount = 'Please enter a valid amount';
    isValid = false;
  } else {
    const amount = parseFloat(form.value.amount);
    const totalAmount = calculateTotal(amount);

    if (totalAmount > (authStore.user?.balance || 0)) {
      errors.value.amount = `Insufficient funds. Total amount including fee: ${formatCurrency(totalAmount)}`;
      isValid = false;
    }
  }

  // Validate description (optional)
  const maxDescriptionLength = 50; // Maximum allowed characters for description
  if (form.value.description) {
    if (form.value.description.length > maxDescriptionLength) {
      errors.value.description = `Description must be ${maxDescriptionLength} characters or less`;
      isValid = false;
    } else if (/^\s*$/.test(form.value.description)) {
      errors.value.description = 'Description cannot be just whitespace';
      isValid = false;
    }
  }

  return isValid;
};

// Handle form submission
const handleTransfer = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;
  transferError.value = '';

  try {
    const transferData = {
      recipient_id: form.value.recipient.id,
      amount: parseFloat(form.value.amount),
      description: form.value.description || null
    };

    // Call the API to create the transaction
    await transactionStore.createTransaction(transferData);

    // Update user balance in auth store
    await authStore.checkAuth();

    // Reset form
    form.value = {
      recipient: null,
      recipientQuery: '',
      amount: '',
      description: ''
    };

    // Show success message
    alert('Transfer successful!');

    // Redirect to transactions page
    router.push('/transactions');
  } catch (error) {
    console.error('Transfer error:', error);
    transferError.value = error.response?.data?.message || 'An error occurred while processing your transfer. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
};

// Fetch recent transactions on component mount
onMounted(() => {
  if (transactionStore.transactions.length === 0) {
    transactionStore.fetchTransactions();
  }
});
</script>
