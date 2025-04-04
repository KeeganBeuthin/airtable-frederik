// https://nuxt.com/docs/api/configuration/nuxt-config
import 'dotenv/config';

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr: true,
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],
  runtimeConfig: {
    // Server-only env variables
    airtableApiKey: process.env.AIRTABLE_API_KEY,
    airtableBaseId: process.env.AIRTABLE_BASE_ID,
    
    // Public variables
    public: {
      apiBase: '/api'
    }
  }
})
