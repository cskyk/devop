import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    user: null
  }),
  getters: {
    isLogged: (s) => !!s.token,
  },
  actions: {
    // 1. ตอนบันทึก (Login)
    setAuth(token, user) {
      this.token = token
      this.user = user
      if (process.client) {
        // ✅ เปลี่ยนชื่อ Key ตรงนี้
        localStorage.setItem('token', token)
        localStorage.setItem('user_info', JSON.stringify(user || null))
      }
    },

    // 2. ตอนดึงข้อมูลกลับมา (Refresh หน้าเว็บ)
    hydrateFromStorage() {
      if (!process.client) return

      // ✅ เปลี่ยนชื่อ Key ตอนดึง
      const t = localStorage.getItem('token')
      const u = localStorage.getItem('user_info')

      if (t) {
        this.token = t
        try { 
          this.user = u ? JSON.parse(u) : null 
        } catch { 
          this.user = null 
        }
      }
    },

    // 3. ตอนออกจากระบบ (Logout)
    logout() {
      this.token = null
      this.user = null
      if (process.client) {
        // ✅ เปลี่ยนชื่อ Key ตอนลบ
        localStorage.removeItem('token')
        localStorage.removeItem('user_info')
      }
    }
  }
})