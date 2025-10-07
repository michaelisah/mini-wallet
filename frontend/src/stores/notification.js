import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref([]);
  let nextId = 1;

  const addNotification = (notification) => {
    const id = nextId++;
    const notificationWithId = {
      id,
      type: 'info',
      duration: 5000,
      ...notification,
    };

    notifications.value.push(notificationWithId);

    // Auto-remove the notification after its duration
    if (notificationWithId.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, notificationWithId.duration);
    }

    return id;
  };

  const removeNotification = (id) => {
    const index = notifications.value.findIndex(n => n.id === id);
    if (index !== -1) {
      notifications.value.splice(index, 1);
    }
  };

  const success = (message, options = {}) => {
    return addNotification({
      type: 'success',
      title: 'Success',
      message,
      ...options,
    });
  };

  const error = (message, options = {}) => {
    return addNotification({
      type: 'error',
      title: 'Error',
      message,
      ...options,
    });
  };

  const info = (message, options = {}) => {
    return addNotification({
      type: 'info',
      title: 'Info',
      message,
      ...options,
    });
  };

  const warning = (message, options = {}) => {
    return addNotification({
      type: 'warning',
      title: 'Warning',
      message,
      ...options,
    });
  };

  // Handle transaction notifications
  const transaction = (transactionData, isSent) => {
    const { amount, commission_fee, new_balance, description } = transactionData;
    
    return addNotification({
      type: 'info',
      title: isSent ? 'Money Sent' : 'Money Received',
      message: description || (isSent ? 'Your transfer was successful' : 'You received money'),
      duration: 10000, // Longer duration for transaction notifications
      transaction: {
        ...transactionData,
        isSent,
        amount: parseFloat(amount),
        commission_fee: commission_fee ? parseFloat(commission_fee) : 0,
        new_balance: new_balance ? parseFloat(new_balance) : null,
      },
    });
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    info,
    warning,
    transaction,
  };
});
