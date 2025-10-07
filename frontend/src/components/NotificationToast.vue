<template>
  <div v-if="notification" class="fixed bottom-4 right-4 z-50">
    <div class="bg-white rounded-lg shadow-lg p-4 w-80 transition-all duration-300 transform"
         :class="[notificationClass, { 'translate-x-0 opacity-100': isVisible, 'translate-x-full opacity-0': !isVisible }]">
      <div class="flex items-start gap-2">
        <div class="flex-shrink-0 pt-0.5">
          <svg v-if="notificationType === 'success'" class="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg v-else-if="notificationType === 'error'" class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg v-else class="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="ml-3 w-0 flex-1 pt-0.5 flex gap-2 flex-col">
          <p class="text-sm font-medium text-gray-900">{{ notification.title }}</p>
          <p class="mt-1 text-sm text-gray-500">{{ notification.message }}</p>
          <div v-if="notification.transaction" class="mt-2 text-xs text-gray-500 flex flex-col gap-2">
            <div class="flex justify-between">
              <span>Amount:</span>
              <span :class="notification.transaction.isSent ? 'text-red-600' : 'text-green-600'">
                {{ notification.transaction.isSent ? '-' : '' }}{{ formatCurrency(notification.transaction.amount) }}
              </span>
            </div>
            <div v-if="notification.transaction.isSent && notification.transaction.commission_fee" class="flex justify-between">
              <span>Fee:</span>
              <span class="text-gray-600">-{{ formatCurrency(notification.transaction.commission_fee) }}</span>
            </div>
            <div v-if="notification.transaction.new_balance" class="mt-1 pt-1 border-t border-gray-100">
              <div class="flex justify-between">
                <span>New Balance:</span>
                <span class="font-medium">{{ formatCurrency(notification.transaction.new_balance) }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="ml-4 flex-shrink-0 flex">
          <button @click="close" class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none">
            <span class="sr-only">Close</span>
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  notification: {
    type: Object,
    default: null
  },
  duration: {
    type: Number,
    default: 5000
  }
});

const emit = defineEmits(['close']);
const isVisible = ref(false);
let timeoutId = null;

const notificationType = computed(() => props.notification?.type || 'info');

const notificationClass = computed(() => {
  const base = 'border-l-4 ';
  switch (notificationType.value) {
    case 'success':
      return base + 'border-green-500';
    case 'error':
      return base + 'border-red-500';
    case 'warning':
      return base + 'border-yellow-500';
    default:
      return base + 'border-blue-500';
  }
});

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

const close = () => {
  isVisible.value = false;
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
  // Wait for the animation to complete before emitting the close event
  setTimeout(() => {
    emit('close');
  }, 300);
};

onMounted(() => {
  // Show the notification with a slight delay for the animation
  setTimeout(() => {
    isVisible.value = true;
  }, 10);

  // Auto-close the notification after the specified duration
  if (props.duration > 0) {
    timeoutId = setTimeout(() => {
      close();
    }, props.duration);
  }
});

onBeforeUnmount(() => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
});
</script>
