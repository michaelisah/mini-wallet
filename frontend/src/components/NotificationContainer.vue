<template>
  <div class="fixed bottom-4 right-4 z-50 space-y-4">
    <NotificationToast
      v-for="notification in notifications"
      :key="notification.id"
      :notification="notification"
      :duration="notification.duration"
      @close="removeNotification(notification.id)"
    />
  </div>
</template>

<script setup>
import { useNotificationStore } from '@/stores/notification';
import NotificationToast from './NotificationToast.vue';

const store = useNotificationStore();
const { notifications, removeNotification } = store;
</script>
