<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Notification Container -->
    <NotificationContainer />
    <!-- Navigation -->
    <nav class="bg-white shadow-sm flex justify-center items-center">
      <div class="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex gap-5">
            <div class="flex-shrink-0 flex items-center gap-2">
              <img alt="Pimono" src="/logo.png" style="max-width: 30px;"/>
              <router-link to="/" class="text-xl font-bold text-indigo-600">
                Mini Wallet
              </router-link>
            </div>
            <div class="hidden sm:ml-6 gap-3 sm:flex sm:space-x-8">
              <router-link
                to="/"
                class="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
                exact-active-class="border-indigo-500 text-gray-900 border-b-2"
                exact
              >
                Dashboard
              </router-link>
              <router-link
                to="/transactions"
                class="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
                exact-active-class="border-indigo-500 text-gray-900 border-b-2"
              >
                Transactions
              </router-link>
              <router-link
                to="/transfer"
                class="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
                exact-active-class="border-indigo-500 text-gray-900 border-b-2"
              >
                Transfer Money
              </router-link>
            </div>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:items-center">
            <div class="ml-3 relative" v-if="isAuthenticated">
              <div class="flex gap-3 items-center">
                <span class="text-sm font-medium text-gray-700 mr-4">
                  {{ user.name }}
                </span>
                <button
                  @click="logout"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign out
                </button>
              </div>
            </div>
            <div v-else class="flex gap-3 items-center">
              <router-link
                to="/login"
                class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign in
              </router-link>
              <router-link
                to="/register"
                class="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign up
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Mobile menu -->
    <div class="sm:hidden" id="mobile-menu">
      <div class="pt-2 pb-3 space-y-1">
        <router-link
          to="/"
          class="bg-indigo-50 border-indigo-500 text-indigo-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          active-class="bg-indigo-50 border-indigo-500 text-indigo-700"
          exact
        >
          Dashboard
        </router-link>
        <router-link
          to="/transactions"
          class="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          active-class="bg-indigo-50 border-indigo-500 text-indigo-700"
        >
          Transactions
        </router-link>
        <router-link
          to="/transfer"
          class="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          active-class="bg-indigo-50 border-indigo-500 text-indigo-700"
        >
          Transfer Money
        </router-link>
        <div v-if="isAuthenticated" class="pt-4 pb-3 border-t border-gray-200">
          <div class="flex items-center px-4">
            <div class="flex-shrink-0">
              <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <span class="text-indigo-600 font-medium">{{ userInitials }}</span>
              </div>
            </div>
            <div class="ml-3">
              <div class="text-base font-medium text-gray-800">{{ user.name }}</div>
              <div class="text-sm font-medium text-gray-500">{{ user.email }}</div>
            </div>
          </div>
          <div class="mt-3 space-y-1">
            <button
              @click="logout"
              class="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main content -->
      <div class="flex justify-center items-center">
          <main class="max-w-7xl w-full mx-auto py-6 sm:px-6 lg:px-0">
              <router-view v-slot="{ Component }">
                  <transition name="fade" mode="out-in">
                      <component :is="Component" />
                  </transition>
              </router-view>
          </main>
      </div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from './stores/auth';
import { useNotificationStore } from './stores/notification';
import NotificationContainer from '@/components/NotificationContainer.vue';
import { pusher } from './composables/usePusher';
import {useTransactionStore} from "@/stores/transaction.js";

const router = useRouter();
const authStore = useAuthStore();
const transactionStore = useTransactionStore();


const isAuthenticated = computed(() => authStore.isAuthenticated);
const user = computed(() => authStore.user);
const notificationStore = useNotificationStore();

const userInitials = computed(() => {
  if (!authStore.user?.name) return '';
  return authStore.user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
});

const logout = async () => {
  await authStore.logout();
  router.push('/login');
};
// Watch for authentication changes to initialize Pusher
watch(
  () => authStore.isAuthenticated,
  async (isAuthenticated) => {
    if (isAuthenticated && authStore.user?.id) {
      // Initialize Pusher when user is authenticated
      try {
        // Listen for transaction events
        pusher.listen(authStore.user.id, (data) => {
          console.log('Received transaction event:', data);
          const { transaction, new_balance } = data;
          const isSent = transaction.sender_id === authStore.user.id;

          // Update notification store
          notificationStore.transaction({
            ...transaction,
            new_balance: isSent ? new_balance.sender : new_balance.receiver,
          }, isSent);

          // Update transaction store with the new transaction
          transactionStore.handleNewTransaction({
            ...transaction,
            balance_after_sender: new_balance.sender,
            balance_after_recipient: new_balance.receiver
          });

          // Update user balance in the auth store
          if (isSent) {
            authStore.user.balance = new_balance.sender;
          } else {
            authStore.user.balance = new_balance.receiver;
          }
        });
      } catch (error) {
        console.error('Error initializing Pusher:', error);
        notificationStore.error('Failed to initialize real-time updates');
      }
    }
  },
  { immediate: true }
);


// Check authentication status on app load
onMounted(async () => {
  if (localStorage.getItem('auth_token')) {
    try {
      await authStore.checkAuth();
    } catch (error) {
      console.error('Auth check failed:', error);
      notificationStore.error('Failed to verify your session. Please log in again.');
      authStore.logout();
      router.push('/login');
    }
  }
});
</script>

<style>
/* Page transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Router link active state */
.router-link-active {
  @apply border-indigo-500 text-gray-900;
}

/* Form styles */
.form-input,
.form-select,
.form-textarea {
  @apply mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm;
}

.form-checkbox {
  @apply h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500;
}

/* Button styles */
.btn {
  @apply inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500;
}

.btn-secondary {
  @apply bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-indigo-500;
}

.btn-danger {
  @apply bg-red-600 hover:bg-red-700 focus:ring-red-500;
}

/* Alert styles */
.alert {
  @apply p-4 mb-4 rounded-md;
}

.alert-success {
  @apply bg-green-50 text-green-800;
}

.alert-error {
  @apply bg-red-50 text-red-800;
}

.alert-warning {
  @apply bg-yellow-50 text-yellow-800;
}

.alert-info {
  @apply bg-blue-50 text-blue-800;
}
</style>
