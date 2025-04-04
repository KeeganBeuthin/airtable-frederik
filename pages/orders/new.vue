<template>
  <div class="container mx-auto p-4">
    <div class="bg-white p-6 rounded shadow-md">
      <div class="flex justify-between mb-6">
        <h2 class="text-2xl font-bold">Create New Order</h2>
        <NuxtLink to="/orders" class="text-blue-600 hover:underline">Back to Orders</NuxtLink>
      </div>
      
      <form @submit.prevent="submitForm">
        <!-- Step 1: Customer Information -->
        <div v-if="currentStep === 1">
          <h3 class="text-lg font-semibold mb-4">Step 1: Customer Information</h3>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Select Customer
            </label>
            <select v-model="order.customerId" class="w-full p-2 border rounded" required>
              <option value="">Select a Customer</option>
              <option v-for="customer in customers" :key="customer.id" :value="customer.id">
                {{ customer.Name }} ({{ customer['Customer ID'] }})
              </option>
            </select>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Order Date
              </label>
              <input
                v-model="order.orderDate"
                type="date"
                class="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Payment Status
              </label>
              <select v-model="order.paymentStatus" class="w-full p-2 border rounded" required>
                <option value="Unpaid">Unpaid</option>
                <option value="Partial">Partial</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
          </div>
          
          <div class="mt-4">
            <div class="flex items-center">
              <input
                id="installationRequired"
                v-model="order.installationRequired"
                type="checkbox"
                class="h-4 w-4 border-gray-300 rounded mr-2"
              />
              <label for="installationRequired" class="text-sm font-medium text-gray-700">
                Installation Required
              </label>
            </div>
          </div>
          
          <div v-if="order.installationRequired" class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Installation Date
            </label>
            <input
              v-model="order.installationDate"
              type="date"
              class="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              v-model="order.notes"
              class="w-full p-2 border rounded"
              rows="3"
            ></textarea>
          </div>
        </div>
        
        <!-- Step 2: Order Items -->
        <div v-if="currentStep === 2">
          <h3 class="text-lg font-semibold mb-4">Step 2: Add Order Items</h3>
          
          <div v-for="(item, index) in orderItems" :key="index" class="p-4 border rounded mb-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Product
                </label>
                <select v-model="item.productId" class="w-full p-2 border rounded" required>
                  <option value="">Select a Product</option>
                  <option v-for="product in availableProducts" :key="product.id" :value="product.id">
                    {{ product['Product Type'] }} - {{ product.Material }} ({{ product.Color }})
                  </option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  v-model.number="item.quantity"
                  type="number"
                  min="1"
                  class="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Width (inches)
                </label>
                <input
                  v-model.number="item.width"
                  type="number"
                  step="0.01"
                  min="0"
                  class="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Height (inches)
                </label>
                <input
                  v-model.number="item.height"
                  type="number"
                  step="0.01"
                  min="0"
                  class="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Custom Options
                </label>
                <input
                  v-model="item.customOptions"
                  type="text"
                  class="w-full p-2 border rounded"
                  placeholder="e.g. Blackout, Cordless"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Item Price
                </label>
                <input
                  v-model.number="item.price"
                  type="number"
                  step="0.01"
                  min="0"
                  class="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
            
            <div class="mt-4 flex justify-end">
              <button
                v-if="orderItems.length > 1"
                type="button"
                @click="removeItem(index)"
                class="text-red-600 hover:text-red-800"
              >
                Remove Item
              </button>
            </div>
          </div>
          
          <div class="mt-4">
            <button
              type="button"
              @click="addItem"
              class="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            >
              Add Another Item
            </button>
          </div>
        </div>
        
        <!-- Step 3: Review -->
        <div v-if="currentStep === 3">
          <h3 class="text-lg font-semibold mb-4">Step 3: Review Order</h3>
          
          <div class="mb-6">
            <h4 class="font-medium mb-2">Customer Information</h4>
            <div class="bg-gray-50 p-4 rounded">
              <p><strong>Customer:</strong> {{ getCustomerName(order.customerId) }}</p>
              <p><strong>Order Date:</strong> {{ formatDate(order.orderDate) }}</p>
              <p><strong>Payment Status:</strong> {{ order.paymentStatus }}</p>
              <p><strong>Installation Required:</strong> {{ order.installationRequired ? 'Yes' : 'No' }}</p>
              <p v-if="order.installationRequired"><strong>Installation Date:</strong> {{ formatDate(order.installationDate) }}</p>
              <p v-if="order.notes"><strong>Notes:</strong> {{ order.notes }}</p>
            </div>
          </div>
          
          <div>
            <h4 class="font-medium mb-2">Order Items</h4>
            <div class="overflow-x-auto">
              <table class="min-w-full bg-white">
                <thead>
                  <tr class="bg-gray-100">
                    <th class="px-4 py-2 text-left">Product</th>
                    <th class="px-4 py-2 text-left">Dimensions</th>
                    <th class="px-4 py-2 text-left">Quantity</th>
                    <th class="px-4 py-2 text-left">Price</th>
                    <th class="px-4 py-2 text-left">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in orderItems" :key="index" class="border-b">
                    <td class="px-4 py-2">{{ getProductName(item.productId) }}</td>
                    <td class="px-4 py-2">{{ item.width }}" × {{ item.height }}"</td>
                    <td class="px-4 py-2">{{ item.quantity }}</td>
                    <td class="px-4 py-2">{{ formatCurrency(item.price) }}</td>
                    <td class="px-4 py-2">{{ formatCurrency(item.price * item.quantity) }}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="bg-gray-50">
                    <td colspan="4" class="px-4 py-2 text-right font-semibold">Total:</td>
                    <td class="px-4 py-2 font-semibold">{{ formatCurrency(orderTotal) }}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
        
        <div class="mt-6 flex justify-between">
          <button
            v-if="currentStep > 1"
            type="button"
            @click="currentStep--"
            class="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            Previous
          </button>
          
          <div>
            <button
              v-if="currentStep < 3"
              type="button"
              @click="currentStep++"
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Next
            </button>
            
            <button
              v-else
              type="submit"
              class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              :disabled="submitting"
            >
              {{ submitting ? 'Creating Order...' : 'Create Order' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
const router = useRouter();
const route = useRoute();
const { getCustomers } = useCustomerService();
const { getProducts } = useProductService();
const { createOrder } = useOrderService();

const customers = ref([]);
const products = ref([]);
const loading = ref(true);
const currentStep = ref(1);
const submitting = ref(false);

const order = ref({
  customerId: route.query.customer || '',
  orderDate: new Date().toISOString().split('T')[0],
  status: 'New',
  paymentStatus: 'Unpaid',
  installationRequired: false,
  installationDate: '',
  notes: ''
});

const orderItems = ref([
  {
    productId: '',
    quantity: 1,
    width: null,
    height: null,
    customOptions: '',
    price: 0
  }
]);

const orderTotal = computed(() => {
  return orderItems.value.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
});

const availableProducts = computed(() => {
  return products.value.filter(product => product.Available);
});

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString();
};

const formatCurrency = (value) => {
  if (!value) return '$0.00';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};

const getCustomerName = (customerId) => {
  const customer = customers.value.find(c => c.id === customerId);
  return customer ? customer.Name : 'Unknown';
};

const getProductName = (productId) => {
  const product = products.value.find(p => p.id === productId);
  return product ? `${product['Product Type']} - ${product.Material} (${product.Color})` : 'Unknown';
};

const addItem = () => {
  orderItems.value.push({
    productId: '',
    quantity: 1,
    width: null,
    height: null,
    customOptions: '',
    price: 0
  });
};

const removeItem = (index) => {
  orderItems.value.splice(index, 1);
};

const submitForm = async () => {
  submitting.value = true;
  try {
    const orderData = {
      'Customer': [order.value.customerId],
      'Order Date': order.value.orderDate,
      'Status': order.value.status,
      'Payment Status': order.value.paymentStatus,
      'Installation Required': order.value.installationRequired,
      'Installation Date': order.value.installationDate,
      'Notes': order.value.notes
    };
    
    const itemsData = orderItems.value.map(item => ({
      'Product': [item.productId],
      'Quantity': item.quantity,
      'Width': item.width,
      'Height': item.height,
      'Custom Options': item.customOptions ? [item.customOptions] : [],
      'Item Price': item.price,
      'Status': 'Ordered'
    }));
    
    await createOrder(orderData, itemsData);
    router.push('/orders');
  } catch (error) {
    alert('Error creating order: ' + error.message);
  } finally {
    submitting.value = false;
  }
};

onMounted(async () => {
  try {
    [customers.value, products.value] = await Promise.all([
      getCustomers(),
      getProducts()
    ]);
  } catch (error) {
    console.error('Error fetching data:', error);
    alert('Error loading data. Please try again.');
  } finally {
    loading.value = false;
  }
});
</script>