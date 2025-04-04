<template>
  <div class="container mx-auto p-4">
    <div class="bg-white p-6 rounded shadow-md">
      <div class="flex justify-between mb-6">
        <h2 class="text-2xl font-bold">Add New Customer</h2>
        <NuxtLink to="/customers" class="text-blue-600 hover:underline">Back to Customers</NuxtLink>
      </div>
      
      <form @submit.prevent="submitForm">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Customer ID
            </label>
            <input
              v-model="customer['Customer ID']"
              type="text"
              class="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              v-model="customer.Name"
              type="text"
              class="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              v-model="customer.Email"
              type="email"
              class="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              v-model="customer.Phone"
              type="tel"
              class="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              v-model="customer.Address"
              class="w-full p-2 border rounded"
              rows="3"
              required
            ></textarea>
          </div>
          
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              v-model="customer.Notes"
              class="w-full p-2 border rounded"
              rows="3"
            ></textarea>
          </div>
        </div>
        
        <div class="mt-6">
          <button
            type="submit"
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            :disabled="submitting"
          >
            {{ submitting ? 'Saving...' : 'Save Customer' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
const router = useRouter();
const { createCustomer } = useCustomerService();

const customer = ref({
  'Customer ID': '',
  'Name': '',
  'Email': '',
  'Phone': '',
  'Address': '',
  'Notes': ''
});

const submitting = ref(false);

const submitForm = async () => {
  submitting.value = true;
  try {
    await createCustomer(customer.value);
    router.push('/customers');
  } catch (error) {
    alert('Error creating customer: ' + error.message);
  } finally {
    submitting.value = false;
  }
};
</script>