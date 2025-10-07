<template>
  <div class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="relative float-start py-3 w-full">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create a new account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          {{ ' ' }}
          <router-link to="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
            sign in to your account
          </router-link>
        </p>
      </div>

      <!-- Error Alert -->
      <div v-if="authStore.error" class="rounded-md bg-red-50 p-4 relative float-start py-3 w-full">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">
              {{ authStore.error }}
            </h3>
          </div>
        </div>
      </div>

      <form class="mt-8 space-y-6 relative float-start py-3 w-full" @submit.prevent="handleRegister">
        <div class="rounded-md shadow-sm -space-y-px relative float-start w-full">
          <div>
            <label for="name" class="sr-only">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              autocomplete="name"
              required
              v-model="form.name"
              :class="[errors.name ? 'border-red-300' : 'border-gray-300', 'appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm']"
              placeholder="Full Name"
            />
            <p v-if="errors.name" class="mt-2 text-sm text-red-600">{{ errors.name }}</p>
          </div>
          <div>
            <label for="email-address" class="sr-only">Email address</label>
            <input
              id="email-address"
              name="email"
              type="email"
              autocomplete="email"
              required
              v-model="form.email"
              :class="[errors.email ? 'border-red-300' : 'border-gray-300', 'appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm']"
              placeholder="Email address"
            />
            <p v-if="errors.email" class="mt-2 text-sm text-red-600">{{ errors.email }}</p>
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="new-password"
              required
              v-model="form.password"
              :class="[errors.password ? 'border-red-300' : 'border-gray-300', 'appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm']"
              placeholder="Password"
            />
            <p v-if="errors.password" class="mt-2 text-sm text-red-600">{{ errors.password }}</p>
          </div>
          <div>
            <label for="password_confirmation" class="sr-only">Confirm Password</label>
            <input
              id="password_confirmation"
              name="password_confirmation"
              type="password"
              autocomplete="new-password"
              required
              v-model="form.password_confirmation"
              :class="[errors.password_confirmation ? 'border-red-300' : 'border-gray-300', 'appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm']"
              placeholder="Confirm Password"
            />
            <p v-if="errors.password_confirmation" class="mt-2 text-sm text-red-600">{{ errors.password_confirmation }}</p>
          </div>
        </div>

        <div class="flex items-center relative float-start py-3 w-full gap-3">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            v-model="form.terms"
            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label for="terms" class="ml-2 block text-sm text-gray-900">
            I agree to the {{ ' ' }}
            <a href="#" class="text-indigo-600 hover:text-indigo-500">Terms</a>
            {{ ' ' }}and{{ ' ' }}
            <a href="#" class="text-indigo-600 hover:text-indigo-500">Privacy Policy</a>
          </label>
        </div>
        <p v-if="errors.terms" class="text-sm text-red-600 relative float-start py-3 w-full">{{ errors.terms }}</p>

        <div class=" relative float-start py-3 w-full">
          <button
            type="submit"
            :disabled="authStore.loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg v-if="authStore.loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
              </svg>
            </span>
            {{ authStore.loading ? 'Creating account...' : 'Sign up' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  terms: false,
});

const errors = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  terms: '',
});

const validateForm = () => {
  let isValid = true;

  // Reset errors
  errors.value = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    terms: '',
  };

  // Name validation
  if (!form.value.name) {
    errors.value.name = 'Full name is required';
    isValid = false;
  }

  // Email validation
  if (!form.value.email) {
    errors.value.email = 'Email is required';
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(form.value.email)) {
    errors.value.email = 'Please enter a valid email address';
    isValid = false;
  }

  // Password validation
  if (!form.value.password) {
    errors.value.password = 'Password is required';
    isValid = false;
  } else if (form.value.password.length < 8) {
    errors.value.password = 'Password must be at least 8 characters';
    isValid = false;
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.value.password)) {
    errors.value.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    isValid = false;
  }

  // Confirm password validation
  if (form.value.password !== form.value.password_confirmation) {
    errors.value.password_confirmation = 'Passwords do not match';
    isValid = false;
  }

  // Terms validation
  if (!form.value.terms) {
    errors.value.terms = 'You must agree to the terms and conditions';
    isValid = false;
  }

  return isValid;
};

const handleRegister = async () => {
  if (!validateForm()) return;

  try {
    await authStore.register({
      name: form.value.name,
      email: form.value.email,
      password: form.value.password,
      password_confirmation: form.value.password_confirmation,
    });

    // Redirect to dashboard after successful registration
    router.push('/');
  } catch (error) {
    console.error('Registration error:', error);
  }
};

// Clear any existing errors when component is mounted
onMounted(() => {
  authStore.error = null;
});
</script>
