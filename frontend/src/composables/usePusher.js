import { ref, onMounted, onUnmounted } from 'vue';
import Pusher from 'pusher-js';
import Echo from 'laravel-echo';

// Pusher configuration
const PUSHER_APP_KEY = import.meta.env.VITE_PUSHER_APP_KEY || '';
const PUSHER_APP_CLUSTER = import.meta.env.VITE_PUSHER_APP_CLUSTER || 'mt1';
const PUSHER_APP_HOST = import.meta.env.VITE_PUSHER_HOST ?
    `https://${import.meta.env.VITE_PUSHER_HOST}` :
    `https://${PUSHER_APP_CLUSTER}.pusher.com`;

// Initialize Pusher
export function usePusher() {
    const echo = ref(null);
    const isConnected = ref(false);
    const notifications = ref([]);

    const initialize = () => {
        if (!PUSHER_APP_KEY) {
            console.warn('Pusher app key is not set. Real-time features will be disabled.');
            return;
        }

        // Initialize Pusher
        window.Pusher = Pusher;

        // Initialize Echo
        echo.value = new Echo({
            broadcaster: 'pusher',
            key: PUSHER_APP_KEY,
            authEndpoint: 'http://localhost:8000/broadcasting/auth',
            auth: {
                headers: {
                    'Authorization': 'Bearer '+ localStorage.getItem('auth_token')
                }
            },
            wsHost: new URL(PUSHER_APP_HOST).hostname,
            wsPort: import.meta.env.VITE_PUSHER_PORT || 80,
            wssPort: import.meta.env.VITE_PUSHER_PORT || 443,
            forceTLS: (import.meta.env.VITE_PUSHER_SCHEME || 'https') === 'https',
            enabledTransports: ['ws', 'wss'],
            cluster: PUSHER_APP_CLUSTER,
        });

        // Set connection status
        echo.value.connector.pusher.connection.bind('connected', () => {
            isConnected.value = true;
            console.log('Pusher connected');
        });

        echo.value.connector.pusher.connection.bind('error', (err) => {
            console.error('Pusher connection error:', err);
        });

        echo.value.connector.pusher.connection.bind('disconnected', () => {
            isConnected.value = false;
            console.log('Pusher disconnected');
        });

        return echo.value;
    };

    // Listen for private channel events
    const listenForPrivateChannel = (channelName, event, callback) => {
        if (!echo.value) {
            console.error('Echo not initialized');
            return null;
        }

        console.log(`Subscribing to private channel: ${channelName}`);
        const channel = echo.value.private(channelName);
        channel.listen(event, callback);

        channel.subscribed(() => {
            console.log(`Successfully subscribed to ${channelName}`);
        }).error((error) => {
            console.error(`Error subscribing to ${channelName}:`, error);
        });

        return () => {
            console.log(`Unsubscribing from ${channelName}`);
            channel.stopListening(event, callback);
        };
    };

    // Clean up on component unmount
    onUnmounted(() => {
        if (echo.value) {
            echo.value.disconnect();
        }
    });

    return {
        echo,
        isConnected,
        notifications,
        initialize,
        listenForPrivateChannel,
    };
}

// Export a singleton instance
export const pusher = {
    instance: null,

    getInstance() {
        if (!this.instance) {
            this.instance = usePusher();
            this.instance.initialize();
        }
        return this.instance;
    },

    listen(userId, callback) {
        const instance = this.getInstance();
        return instance.listenForPrivateChannel(`users.${userId}`, '.money.transferred', (data) => {
            callback(data);
        });
    }
};

export default usePusher;
