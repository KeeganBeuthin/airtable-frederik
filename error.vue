<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="max-w-md w-full bg-white rounded shadow-md p-8 text-center">
      <h1 class="text-3xl font-bold text-red-600 mb-4">{{ error.statusCode }}</h1>
      <p class="text-xl mb-6">{{ error.message }}</p>
      <button 
        @click="handleError" 
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Go back home
      </button>
    </div>
  </div>
</template>

<script setup>
const error = useError();
const handleError = () => clearError({ redirect: '/' });
</script> 