<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Orders</h2>
    <div v-if="loading" class="text-center py-4">Loading orders...</div>
    <div v-else-if="error" class="text-red-600 text-center py-4">
      Error loading orders: {{ error }}
    </div>
    <div v-else>
      <div class="mb-4">
        <NuxtLink to="/orders/new" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Create New Order
        </NuxtLink>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white">
          <thead>
            <tr class="bg-gray-100">
              <th class="px-4 py-2 text-left">Order ID</th>
              <th class="px-4 py-2 text-left">Customer</th>
              <th class="px-4 py-2 text-left">Date</th>
              <th class="px-4 py-2 text-left">Status</th>
              <th class="px-4 py-2 text-left">Total</th>
              <th class="px-4 py-2 text-left">Payment</th>
              <th class="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id" class="border-b">
              <td class="px-4 py-2">{{ order['Order ID'] }}</td>
              <td class="px-4 py-2">
                {{ getCustomerName(order.Customer) }}
              </td>
              <td class="px-4 py-2">{{ formatDate(order['Order Date']) }}</td>
              <td class="px-4 py-2">
                <span :class="getStatusClass(order.Status)">
                  {{ order.Status }}
                </span>
              </td>
              <td class="px-4 py-2">{{ formatCurrency(order['Total Amount']) }}</td>
              <td class="px-4 py-2">{{ order['Payment Status'] }}</td>
              <td class="px-4 py-2">
                <NuxtLink :to="`/orders/${order.id}`" class="text-blue-600 hover:underline">
                  View
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
const { getOrders } = useOrderService();
const orders = ref([]);
const loading = ref(true);
const error = ref(null);

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString();
};

const formatCurrency = (value) => {
  if (!value) return '$0.00';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};

const getCustomerName = (customerIds) => {
  if (!customerIds || !customerIds.length) return 'Unknown';
  // In a real app, we'd have a customer lookup here
  return customerIds[0];
};

const getStatusClass = (status) => {
  const statusClasses = {
    'New': 'text-blue-600',
    'Processing': 'text-yellow-600',
    'Manufacturing': 'text-orange-600',
    'Shipping': 'text-purple-600',
    'Delivered': 'text-green-600',
    'Cancelled': 'text-red-600'
  };
  
  return statusClasses[status] || 'text-gray-600';
};

onMounted(async () => {
  try {
    orders.value = await getOrders();
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
});
</script> 