export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    // Log the error to console
    console.error('Vue Error:', error);
    console.error('Component:', instance);
    console.error('Error Info:', info);
    
    // In production, you would send this to an error tracking service
    // like Sentry, LogRocket, etc.
  };
  
  // Handle Nuxt errors
  nuxtApp.hook('vue:error', (error, instance, info) => {
    // Same error handling as above
  });
  
  // Return nothing - this plugin doesn't expose anything
}); 