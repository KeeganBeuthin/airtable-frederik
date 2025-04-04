<template>
  <div class="container mx-auto p-4">
    <div v-if="loading" class="text-center py-4">Loading customer details...</div>
    <div v-else-if="error" class="text-red-600 text-center py-4">
      Error: {{ error }}
    </div>
    <div v-else class="bg-white p-6 rounded shadow-md">
      <div class="flex justify-between mb-6">
        <h2 class="text-2xl font-bold">Customer Details</h2>
        <NuxtLink to="/customers" class="text-blue-600 hover:underline">Back to Customers</NuxtLink>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p class="text-gray-600 mb-1">Name</p>
          <p class="text-xl font-semibold">{{ customer.Name }}</p>
        </div>
        
        <div>
          <p class="text-gray-600 mb-1">Customer ID</p>
          <p>{{ customer['Customer ID'] }}</p>
        </div>
        
        <div>
          <p class="text-gray-600 mb-1">Email</p>
          <p>{{ customer.Email }}</p>
        </div>
        
        <div>
          <p class="text-gray-600 mb-1">Phone</p>
          <p>{{ customer.Phone }}</p>
        </div>
        
        <div class="md:col-span-2">
          <p class="text-gray-600 mb-1">Address</p>
          <p>{{ customer.Address }}</p>
        </div>
        
        <div class="md:col-span-2">
          <p class="text-gray-600 mb-1">Notes</p>
          <p>{{ customer.Notes || 'No notes' }}</p>
        </div>
      </div>
      
      <div class="mt-8">
        <h3 class="text-xl font-semibold mb-4">Customer Orders</h3>
        <p v-if="!customerOrders.length">No orders found for this customer.</p>
        <div v-else class="overflow-x-auto">
          <!-- Orders table here -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const customerId = route.params.id;
const { getCustomerById } = useCustomerService();
const { getOrders } = useOrderService();

const customer = ref({});
const customerOrders = ref([]);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    customer.value = await getCustomerById(customerId);
    
    // In a real application, you would fetch orders for this customer
    // const orders = await getOrders();
    // customerOrders.value = orders.filter(order => 
    //   order.Customer && order.Customer.includes(customerId)
    // );
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
});
</script> 