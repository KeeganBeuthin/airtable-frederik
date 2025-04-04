<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Products</h2>
    <div v-if="loading" class="text-center py-4">Loading products...</div>
    <div v-else-if="error" class="text-red-600 text-center py-4">
      Error loading products: {{ error }}
    </div>
    <div v-else>
      <div class="flex mb-4">
        <div class="mr-2">
          <label class="block text-sm font-medium text-gray-700">Filter by Type</label>
          <select v-model="typeFilter" class="border p-2 rounded">
            <option value="">All Types</option>
            <option v-for="type in productTypes" :key="type" :value="type">{{ type }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Filter by Available</label>
          <select v-model="availableFilter" class="border p-2 rounded">
            <option value="">All</option>
            <option value="true">Available</option>
            <option value="false">Not Available</option>
          </select>
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white">
          <thead>
            <tr class="bg-gray-100">
              <th class="px-4 py-2 text-left">Product ID</th>
              <th class="px-4 py-2 text-left">Type</th>
              <th class="px-4 py-2 text-left">Material</th>
              <th class="px-4 py-2 text-left">Color</th>
              <th class="px-4 py-2 text-left">Price</th>
              <th class="px-4 py-2 text-left">Lead Time</th>
              <th class="px-4 py-2 text-left">Available</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in filteredProducts" :key="product.id" class="border-b">
              <td class="px-4 py-2">{{ product['Product ID'] }}</td>
              <td class="px-4 py-2">{{ product['Product Type'] }}</td>
              <td class="px-4 py-2">{{ product.Material }}</td>
              <td class="px-4 py-2">{{ product.Color }}</td>
              <td class="px-4 py-2">{{ formatCurrency(product['Unit Price']) }}</td>
              <td class="px-4 py-2">{{ product['Lead Time'] }} days</td>
              <td class="px-4 py-2">
                <span :class="product.Available ? 'text-green-600' : 'text-red-600'">
                  {{ product.Available ? 'Yes' : 'No' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
const { getProducts } = useProductService();
const products = ref([]);
const loading = ref(true);
const error = ref(null);
const typeFilter = ref('');
const availableFilter = ref('');

const productTypes = computed(() => {
  const types = new Set();
  products.value.forEach(product => {
    if (product['Product Type']) types.add(product['Product Type']);
  });
  return [...types];
});

const filteredProducts = computed(() => {
  return products.value.filter(product => {
    // Type filter
    if (typeFilter.value && product['Product Type'] !== typeFilter.value) {
      return false;
    }
    
    // Available filter
    if (availableFilter.value === 'true' && !product.Available) {
      return false;
    }
    
    if (availableFilter.value === 'false' && product.Available) {
      return false;
    }
    
    return true;
  });
});

const formatCurrency = (value) => {
  if (!value) return '$0.00';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};

onMounted(async () => {
  try {
    products.value = await getProducts();
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
});
</script> 