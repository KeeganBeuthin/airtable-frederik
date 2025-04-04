<template>
  <div class="container mx-auto p-4">
    <div v-if="loading" class="text-center py-4">Loading product details...</div>
    <div v-else-if="error" class="text-red-600 text-center py-4">
      Error: {{ error }}
    </div>
    <div v-else class="bg-white p-6 rounded shadow-md">
      <div class="flex justify-between mb-6">
        <h2 class="text-2xl font-bold">Product Details</h2>
        <NuxtLink to="/products" class="text-blue-600 hover:underline">Back to Products</NuxtLink>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p class="text-gray-600 mb-1">Product ID</p>
          <p class="text-xl font-semibold">{{ product['Product ID'] }}</p>
        </div>
        
        <div>
          <p class="text-gray-600 mb-1">Product Type</p>
          <p>{{ product['Product Type'] }}</p>
        </div>
        
        <div>
          <p class="text-gray-600 mb-1">Material</p>
          <p>{{ product.Material }}</p>
        </div>
        
        <div>
          <p class="text-gray-600 mb-1">Color</p>
          <p>{{ product.Color }}</p>
        </div>
        
        <div>
          <p class="text-gray-600 mb-1">Width Range</p>
          <p>{{ formatRange(product['Width Range']) }}</p>
        </div>
        
        <div>
          <p class="text-gray-600 mb-1">Height Range</p>
          <p>{{ formatRange(product['Height Range']) }}</p>
        </div>
        
        <div>
          <p class="text-gray-600 mb-1">Unit Price</p>
          <p>{{ formatCurrency(product['Unit Price']) }}</p>
        </div>
        
        <div>
          <p class="text-gray-600 mb-1">Lead Time</p>
          <p>{{ product['Lead Time'] }} days</p>
        </div>
        
        <div>
          <p class="text-gray-600 mb-1">Available</p>
          <p :class="product.Available ? 'text-green-600' : 'text-red-600'">
            {{ product.Available ? 'Yes' : 'No' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const productId = route.params.id;
const { getProductById } = useProductService();

const product = ref({});
const loading = ref(true);
const error = ref(null);

const formatCurrency = (value) => {
  if (!value) return '$0.00';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};

const formatRange = (range) => {
  if (!range) return 'Not specified';
  return `${range} inches`;
};

onMounted(async () => {
  try {
    product.value = await getProductById(productId);
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
});
</script> 