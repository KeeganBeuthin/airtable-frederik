<template>
  <div class="container mx-auto p-4">
    <div class="bg-white p-6 rounded shadow-md">
      <div class="flex justify-between mb-6">
        <h2 class="text-2xl font-bold">Measurements</h2>
        <NuxtLink to="/measurements/new" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add Measurement
        </NuxtLink>
      </div>
      
      <div v-if="loading" class="text-center py-4">Loading measurements...</div>
      <div v-else-if="error" class="text-red-600 text-center py-4">
        Error: {{ error }}
      </div>
      <div v-else-if="measurements.length === 0" class="text-center py-4">
        No measurements found.
      </div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full bg-white">
          <thead>
            <tr class="bg-gray-100">
              <th class="px-4 py-2 text-left">ID</th>
              <th class="px-4 py-2 text-left">Order</th>
              <th class="px-4 py-2 text-left">Room</th>
              <th class="px-4 py-2 text-left">Window Description</th>
              <th class="px-4 py-2 text-left">Dimensions</th>
              <th class="px-4 py-2 text-left">Measured By</th>
              <th class="px-4 py-2 text-left">Date</th>
              <th class="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="measurement in measurements" :key="measurement.id" class="border-b">
              <td class="px-4 py-2">{{ measurement['Measurement ID'] }}</td>
              <td class="px-4 py-2">
                <NuxtLink 
                  v-if="measurement.Order && measurement.Order.length" 
                  :to="`/orders/${measurement.Order[0]}`"
                  class="text-blue-600 hover:underline"
                >
                  View Order
                </NuxtLink>
                <span v-else>-</span>
              </td>
              <td class="px-4 py-2">{{ measurement.Room }}</td>
              <td class="px-4 py-2">{{ measurement['Window Description'] }}</td>
              <td class="px-4 py-2">{{ measurement.Width }}" × {{ measurement.Height }}"</td>
              <td class="px-4 py-2">{{ measurement['Measured By'] }}</td>
              <td class="px-4 py-2">{{ formatDate(measurement['Date Measured']) }}</td>
              <td class="px-4 py-2">
                <NuxtLink 
                  :to="`/measurements/${measurement.id}`"
                  class="text-blue-600 hover:underline"
                >
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
const measurements = ref([]);
const loading = ref(true);
const error = ref(null);

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString();
};

// Create a service function to get measurements
const getMeasurements = async () => {
  try {
    const response = await $fetch('/api/airtable/Measurements');
    return response;
  } catch (error) {
    console.error('Error fetching measurements:', error);
    throw error;
  }
};

onMounted(async () => {
  try {
    measurements.value = await getMeasurements();
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
});
</script> 