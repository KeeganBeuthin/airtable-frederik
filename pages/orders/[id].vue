<template>
  <div class="container mx-auto p-4">
    <div v-if="loading" class="text-center py-4">Loading order details...</div>
    <div v-else-if="error" class="text-red-600 text-center py-4">
      Error: {{ error }}
    </div>
    <div v-else class="bg-white p-6 rounded shadow-md">
      <div class="flex justify-between mb-6">
        <h2 class="text-2xl font-bold">Order Details</h2>
        <NuxtLink to="/orders" class="text-blue-600 hover:underline">Back to Orders</NuxtLink>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <p class="text-gray-600 mb-1">Order ID</p>
          <p class="text-xl font-semibold">{{ order['Order ID'] }}</p>
        </div>
        
        <div>
          <p class="text-gray-600 mb-1">Customer</p>
          <p>
            <NuxtLink 
              :to="`/customers/${getCustomerId(order.Customer)}`" 
              class="text-blue-600 hover:underline"
            >
              {{ getCustomerName(order.Customer) }}
            </NuxtLink>
          </p>
        </div>
        
        <div>
          <p class="text-gray-600 mb-1">Order Date</p>
          <p>{{ formatDate(order['Order Date']) }}</p>
        </div>
        
        <div>
          <p class="text-gray-600 mb-1">Status</p>
          <div class="flex items-center">
            <span :class="getStatusClass(order.Status)" class="mr-2">
              {{ order.Status }}
            </span>
            <button 
              @click="showStatusModal = true" 
              class="text-sm bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
            >
              Update
            </button>
          </div>
        </div>
        
        <div>
          <p class="text-gray-600 mb-1">Total Amount</p>
          <p class="font-semibold">{{ formatCurrency(order['Total Amount']) }}</p>
        </div>
        
        <div>
          <p class="text-gray-600 mb-1">Payment Status</p>
          <p>{{ order['Payment Status'] }}</p>
        </div>
        
        <div>
          <p class="text-gray-600 mb-1">Installation Required</p>
          <p>{{ order['Installation Required'] ? 'Yes' : 'No' }}</p>
        </div>
        
        <div v-if="order['Installation Required']">
          <p class="text-gray-600 mb-1">Installation Date</p>
          <p>{{ formatDate(order['Installation Date']) }}</p>
        </div>
      </div>
      
      <div class="border-t pt-6">
        <h3 class="text-xl font-semibold mb-4">Order Items</h3>
        <div v-if="!order.items || !order.items.length" class="text-gray-600">
          No items in this order.
        </div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full bg-white">
            <thead>
              <tr class="bg-gray-100">
                <th class="px-4 py-2 text-left">Item</th>
                <th class="px-4 py-2 text-left">Product</th>
                <th class="px-4 py-2 text-left">Dimensions</th>
                <th class="px-4 py-2 text-left">Quantity</th>
                <th class="px-4 py-2 text-left">Price</th>
                <th class="px-4 py-2 text-left">Subtotal</th>
                <th class="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in order.items" :key="item.id" class="border-b">
                <td class="px-4 py-2">{{ item['Item ID'] }}</td>
                <td class="px-4 py-2">{{ getProductName(item.Product) }}</td>
                <td class="px-4 py-2">{{ item.Width }}" × {{ item.Height }}"</td>
                <td class="px-4 py-2">{{ item.Quantity }}</td>
                <td class="px-4 py-2">{{ formatCurrency(item['Item Price']) }}</td>
                <td class="px-4 py-2">{{ formatCurrency(item.Subtotal) }}</td>
                <td class="px-4 py-2">{{ item.Status }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Status update modal -->
      <div v-if="showStatusModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div class="bg-white rounded p-6 max-w-md w-full">
          <h3 class="text-lg font-semibold mb-4">Update Order Status</h3>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              New Status
            </label>
            <select v-model="newStatus" class="w-full p-2 border rounded">
              <option value="New">New</option>
              <option value="Processing">Processing</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Shipping">Shipping</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div class="flex justify-end space-x-2">
            <button 
              @click="showStatusModal = false" 
              class="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button 
              @click="updateStatus" 
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              :disabled="statusUpdating"
            >
              {{ statusUpdating ? 'Updating...' : 'Update' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const orderId = route.params.id;
const { getOrderById, updateOrderStatus } = useOrderService();

const order = ref({});
const loading = ref(true);
const error = ref(null);
const showStatusModal = ref(false);
const newStatus = ref('');
const statusUpdating = ref(false);

const formatDate = (dateString) => {
  if (!dateString) return 'Not scheduled';
  return new Date(dateString).toLocaleDateString();
};

const formatCurrency = (value) => {
  if (!value) return '$0.00';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};

const getCustomerId = (customerIds) => {
  if (!customerIds || !customerIds.length) return '';
  return customerIds[0];
};

const getCustomerName = (customerIds) => {
  if (!customerIds || !customerIds.length) return 'Unknown';
  // In a real app, we'd have a customer lookup here
  return customerIds[0];
};

const getProductName = (productIds) => {
  if (!productIds || !productIds.length) return 'Unknown';
  // In a real app, we'd have a product lookup here
  return productIds[0];
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

const updateStatus = async () => {
  statusUpdating.value = true;
  try {
    await updateOrderStatus(orderId, newStatus.value);
    order.value.Status = newStatus.value;
    showStatusModal.value = false;
  } catch (e) {
    alert('Error updating status: ' + e.message);
  } finally {
    statusUpdating.value = false;
  }
};

onMounted(async () => {
  try {
    order.value = await getOrderById(orderId);
    newStatus.value = order.value.Status;
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
});
</script> 