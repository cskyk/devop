// nuxt.config.ts
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  // ✅ 1. เพิ่มบรรทัดนี้ครับ (ปิดโหมด Server เพื่อให้ Browser ทำงาน 100%)
  // จะทำให้ปัญหา Refresh แล้วหา LocalStorage ไม่เจอ หายไปทันที
  ssr: false, 

  nitro: {
    compatibilityDate: '2025-10-12', 
  },

  modules: ['@pinia/nuxt'],
  pinia: {
    autoImports: ['defineStore', 'storeToRefs']
  },
  devtools: { enabled: false },
  runtimeConfig: {
    public: {
       apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:7000'
    }
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  css: [
    'vuetify/styles',
    '@mdi/font/css/materialdesignicons.min.css', 
    '~/assets/css/tailwind.css'
  ],

  build: { transpile: ['vuetify'] },
  vite: {
    ssr: { noExternal: ['vuetify'] },
    plugins: [vuetify({ autoImport: true })],
    vue: { template: { transformAssetUrls } }
  }
})