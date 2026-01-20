<script setup>
import { onMounted } from 'vue'
import  {useAuthStore}  from '~/stores/auth'

const authStore = useAuthStore()

// ✅ พอเปิดเว็บมาปุ๊บ ให้ดึงข้อมูลจาก LocalStorage มาใส่ Store ทันที
onMounted(() => {
  authStore.hydrateFromStorage()
})
</script>
<template>
  <v-app>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </v-app>
</template>