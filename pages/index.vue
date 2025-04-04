<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">Curtain and Blinds Dashboard</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white p-6 rounded shadow-md">
        <h2 class="text-xl font-semibold mb-2">Orders</h2>
        <p class="text-3xl font-bold">{{ orderCount }}</p>
        <NuxtLink to="/orders" class="text-blue-600 hover:underline block mt-2">
          View All Orders →
        </NuxtLink>
      </div>
      
      <div class="bg-white p-6 rounded shadow-md">
        <h2 class="text-xl font-semibold mb-2">Customers</h2>
        <p class="text-3xl font-bold">{{ customerCount }}</p>
        <NuxtLink to="/customers" class="text-blue-600 hover:underline block mt-2">
          View All Customers →
        </NuxtLink>
      </div>
      
      <div class="bg-white p-6 rounded shadow-md">
        <h2 class="text-xl font-semibold mb-2">Products</h2>
        <p class="text-3xl font-bold">{{ productCount }}</p>
        <NuxtLink to="/products" class="text-blue-600 hover:underline block mt-2">
          View All Products →
        </NuxtLink>
      </div>
    </div>
    
    <div class="bg-white rounded shadow-md p-6">
      <h2 class="text-2xl font-bold mb-4">Recent Orders</h2>
      <OrderList />
    </div>
  </div>
</template>

<script setup>
const { getOrders } = useOrderService();
const { getCustomers } = useCustomerService();
const { getProducts } = useProductService();

const orders = ref([]);
const customers = ref([]);
const products = ref([]);

const orderCount = computed(() => orders.value.length);
const customerCount = computed(() => customers.value.length);
const productCount = computed(() => products.value.length);

onMounted(async () => {
  try {
    [orders.value, customers.value, products.value] = await Promise.all([
      getOrders(),
      getCustomers(),
      getProducts()
    ]);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  }
});
</script> 