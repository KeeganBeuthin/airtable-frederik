<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Customers</h2>
    <div v-if="loading" class="text-center py-4">Loading customers...</div>
    <div v-else-if="error" class="text-red-600 text-center py-4">
      Error loading customers: {{ error }}
    </div>
    <div v-else>
      <div class="mb-4">
        <NuxtLink to="/customers/new" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add New Customer
        </NuxtLink>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white">
          <thead>
            <tr class="bg-gray-100">
              <th class="px-4 py-2 text-left">Name</th>
              <th class="px-4 py-2 text-left">Email</th>
              <th class="px-4 py-2 text-left">Phone</th>
              <th class="px-4 py-2 text-left">Address</th>
              <th class="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="customer in customers" :key="customer.id" class="border-b">
              <td class="px-4 py-2">{{ customer.Name }}</td>
              <td class="px-4 py-2">{{ customer.Email }}</td>
              <td class="px-4 py-2">{{ customer.Phone }}</td>
              <td class="px-4 py-2">{{ customer.Address }}</td>
              <td class="px-4 py-2">
                <NuxtLink :to="`/customers/${customer.id}`" class="text-blue-600 hover:underline mr-2">
                  View
                </NuxtLink>
                <NuxtLink :to="`/orders/new?customer=${customer.id}`" class="text-green-600 hover:underline">
                  New Order
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
const { getCustomers } = useCustomerService();
const customers = ref([]);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    customers.value = await getCustomers();
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
});
</script> 