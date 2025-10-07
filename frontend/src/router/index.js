import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const routes = [
    {
        path: '/',
        name: 'Dashboard',
        component: () => import('@/views/DashboardView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/transactions',
        name: 'Transactions',
        component: () => import('@/views/TransactionsView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/transfer',
        name: 'Transfer',
        component: () => import('@/views/TransferView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/LoginView.vue'),
        meta: { guestOnly: true }
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/RegisterView.vue'),
        meta: { guestOnly: true }
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/'
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    linkActiveClass: 'active',
    scrollBehavior(to, from, savedPosition) {
        return savedPosition || { top: 0 };
    }
});

// Navigation guard
router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();
    
    // Check if the route requires authentication
    if (to.matched.some(record => record.meta.requiresAuth)) {
        // Check if user is authenticated
        const isAuthenticated = await authStore.checkAuth();
        
        if (!isAuthenticated) {
            return next({
                name: 'Login',
                query: { redirect: to.fullPath }
            });
        }
        
        return next();
    }
    
    // Check if the route is for guests only
    if (to.matched.some(record => record.meta.guestOnly)) {
        const isAuthenticated = await authStore.checkAuth();
        
        if (isAuthenticated) {
            return next({ name: 'Dashboard' });
        }
        
        return next();
    }
    
    next();
});

export default router;