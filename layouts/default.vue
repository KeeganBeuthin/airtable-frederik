<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-md">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center py-4">
          <NuxtLink to="/" class="text-xl font-bold">Window Treatments</NuxtLink>
          
          <div class="flex space-x-6">
            <NuxtLink to="/" class="hover:text-blue-600">Dashboard</NuxtLink>
            <NuxtLink to="/customers" class="hover:text-blue-600">Customers</NuxtLink>
            <NuxtLink to="/products" class="hover:text-blue-600">Products</NuxtLink>
            <NuxtLink to="/orders" class="hover:text-blue-600">Orders</NuxtLink>
            <NuxtLink to="/measurements" class="hover:text-blue-600">Measurements</NuxtLink>
          </div>
        </div>
      </div>
    </nav>
    
    <main class="py-6">
      <slot />
    </main>
    
    <footer class="bg-white py-4 border-t">
      <div class="container mx-auto px-4 text-center text-gray-600">
        &copy; {{ new Date().getFullYear() }} Window Treatment Management
      </div>
    </footer>
  </div>
</template> 