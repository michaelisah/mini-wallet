import './assets/main.css'

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import App from './App.vue';

const app = createApp(App);

// Use Pinia for state management
const pinia = createPinia();
app.use(pinia);

// Use the router
app.use(router);

// Mount the app
app.mount('#app');
