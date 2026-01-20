// middleware/auth.js
import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  // ✅ 1. ถ้าเป็น Server ให้ปล่อยผ่านไปก่อน (เพราะอ่าน LocalStorage ไม่ได้)
  if (process.server) return

  const authStore = useAuthStore()

  // 2. พอถึงมือ Client (Browser) ถ้า Store โล่ง ให้ลองฮึ๊บดึงจาก Storage ดู
  if (process.client && !authStore.token) {
    authStore.hydrateFromStorage()
  }

  // 3. ถ้าดึงแล้วยังไม่มีของ -> แสดงว่าไม่ได้ล็อกอินจริง -> ดีดออก
  if (!authStore.isLogged) {
    return navigateTo('/login')
  }

  // 4. เช็ค Role (Logic เดิมของคุณ)
  const role = (authStore.user?.role || '').toLowerCase() // แปลงเป็นตัวเล็กกันพลาด
  if (to.path.startsWith('/admin') && role !== 'admin') {
     return navigateTo('/')
  }
})