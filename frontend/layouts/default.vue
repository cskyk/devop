<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMenu } from '~/composables/useMenu'
import { useAuthStore } from '~/stores/auth'

const router = useRouter()
const drawer = ref(true)
const authStore = useAuthStore()

// ดึง Role จาก Store
const role = computed(() => authStore.user?.role || '')

// เรียกใช้ Composable
const { menu } = useMenu(role)

// ข้อมูลโปรไฟล์
const userProfile = computed(() => ({
  name: authStore.user?.name_th || 'Guest',
  email: authStore.user?.email || '',
  initials: (authStore.user?.name_th || 'G').charAt(0)
}))

onMounted(() => {
  authStore.hydrateFromStorage()
})

// ฟังก์ชัน Logout
const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <v-app class="modern-theme">
    <!-- Sidebar Navigation -->
    <v-navigation-drawer 
      v-model="drawer" 
      width="280" 
      class="sidebar-custom elevation-3"
    >
      <!-- Logo Section -->
      <div class="pa-6 d-flex align-center justify-start">
        <div class="logo-gradient d-flex align-center justify-center rounded-xl mr-3">
          <v-icon icon="mdi-shield-check" color="white" size="28"></v-icon>
        </div>
        <div>
          <div class="text-h6 font-weight-black logo-text">VEC Eval</div>
          <div class="text-caption text-grey-darken-1 font-weight-medium">System v1.0</div>
        </div>
      </div>

      <v-divider class="divider-custom mx-5 mb-2"></v-divider>

      <!-- Menu List -->
      <v-list density="compact" nav class="px-3">
        <template v-for="(section, i) in menu" :key="i">
          <div 
            v-if="section.label" 
            class="px-4 py-3 text-caption text-uppercase text-grey font-weight-black ls-wider mt-2"
          >
            {{ section.label }}
          </div>
          
          <v-list-item
            v-for="(it, j) in section.items"
            :key="j"
            :to="it.to"
            :prepend-icon="it.icon"
            :title="it.label"
            rounded="xl"
            class="mb-2 menu-item-modern"
            active-class="menu-item-active"
          >
            <template v-slot:prepend>
              <v-icon class="menu-icon"></v-icon>
            </template>
          </v-list-item>
        </template>
      </v-list>

      <!-- Logout Button -->
      <template v-slot:append>
        <div class="pa-4">
          <v-card 
            rounded="xl" 
            class="pa-4 logout-card" 
            elevation="0"
          >
            <div class="d-flex align-center mb-3">
              <v-avatar color="gradient-primary" size="40" class="mr-3">
                <span class="text-subtitle-2 font-weight-bold text-white">{{ userProfile.initials }}</span>
              </v-avatar>
              <div class="flex-grow-1">
                <div class="text-body-2 font-weight-bold text-truncate">{{ userProfile.name }}</div>
                <div class="text-caption text-grey text-truncate">{{ role }}</div>
              </div>
            </div>
            <v-btn 
              block 
              color="error" 
              variant="flat" 
              prepend-icon="mdi-logout-variant" 
              @click="logout"
              class="font-weight-bold text-none"
              rounded="lg"
              size="small"
            >
              ออกจากระบบ
            </v-btn>
          </v-card>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- App Bar -->
    <v-app-bar 
      color="white" 
      elevation="0" 
      class="app-bar-custom px-2" 
      height="72"
    >
      <v-btn
        icon
        @click="drawer = !drawer"
        class="ml-2"
        variant="text"
        rounded="lg"
      >
        <v-icon color="grey-darken-3">mdi-menu</v-icon>
      </v-btn>
      
      <div class="ml-4">
        <div class="text-body-1 font-weight-black text-grey-darken-4">
          ระบบประเมินบุคลากร
        </div>
        <div class="text-caption text-grey">
          VEC Skills Evaluation Platform
        </div>
      </div>

      <v-spacer />

      <!-- Notification Bell -->
      <v-btn icon variant="text" class="mr-2" rounded="lg">
        <v-badge color="error" content="3" dot>
          <v-icon color="grey-darken-2">mdi-bell-outline</v-icon>
        </v-badge>
      </v-btn>

      <!-- Search Button -->
      <v-btn icon variant="text" class="mr-2" rounded="lg">
        <v-icon color="grey-darken-2">mdi-magnify</v-icon>
      </v-btn>

      <!-- Profile Menu -->
      <v-menu 
        location="bottom end" 
        transition="slide-y-transition" 
        offset="12"
        rounded="xl"
      >
        <template v-slot:activator="{ props }">
          <v-btn 
            v-bind="props" 
            variant="text" 
            class="mr-3 profile-btn"
            rounded="xl"
          >
            <v-avatar 
              color="gradient-primary" 
              size="40" 
              class="mr-2"
            >
              <span class="text-subtitle-2 font-weight-bold text-white">{{ userProfile.initials }}</span>
            </v-avatar>
            <div class="text-left d-none d-sm-block">
              <div class="text-body-2 font-weight-bold">{{ userProfile.name }}</div>
              <div class="text-caption text-grey">{{ role }}</div>
            </div>
            <v-icon class="ml-2" size="20">mdi-chevron-down</v-icon>
          </v-btn>
        </template>

        <v-card width="280" elevation="8" rounded="xl" class="pa-2">
          <v-list class="transparent py-0">
            <v-list-item class="px-4 py-3">
              <template v-slot:prepend>
                <v-avatar color="gradient-primary" size="48" class="mr-2">
                  <span class="text-h6 font-weight-bold text-white">{{ userProfile.initials }}</span>
                </v-avatar>
              </template>
              <v-list-item-title class="font-weight-bold">{{ userProfile.name }}</v-list-item-title>
              <v-list-item-subtitle class="text-caption mt-1">{{ userProfile.email }}</v-list-item-subtitle>
            </v-list-item>
            
            <v-divider class="my-2"></v-divider>
            
            <v-list-item 
              prepend-icon="mdi-account-circle" 
              title="โปรไฟล์" 
              rounded="lg"
              class="mx-2 my-1"
            ></v-list-item>
            
            <v-list-item 
              prepend-icon="mdi-cog" 
              title="ตั้งค่า" 
              rounded="lg"
              class="mx-2 my-1"
            ></v-list-item>
            
            <v-divider class="my-2"></v-divider>
            
            <v-list-item 
              prepend-icon="mdi-logout-variant" 
              title="ออกจากระบบ" 
              @click="logout"
              class="mx-2 my-1 text-error"
              rounded="lg"
            ></v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </v-app-bar>

    <!-- Main Content -->
    <v-main class="main-content">
      <v-container fluid class="py-8 px-6 px-md-8 main-container">
        <router-view /> 
      </v-container>
      
      <v-footer color="transparent" class="text-caption text-center text-grey-darken-1 py-6 mt-8">
        <v-spacer />
        <div>
          <strong>© 2025 VEC Skills</strong> · Evaluation System
          <span class="mx-2">•</span>
          <span class="text-primary">Powered by KruOak</span>
        </div>
        <v-spacer />
      </v-footer>
    </v-main>
  </v-app>
</template>

<style scoped>
/* Import Modern Font */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

/* Theme Base */
.modern-theme {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
}

/* Sidebar Styling */
.sidebar-custom {
  background: linear-gradient(180deg, #ffffff 0%, #f8f9fc 100%) !important;
  border-right: 1px solid rgba(0, 0, 0, 0.08) !important;
}

/* Logo Gradient */
.logo-gradient {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.logo-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
}

/* Divider */
.divider-custom {
  opacity: 0.15;
  border-color: #000;
}

/* Menu Items */
.menu-item-modern {
  color: #6b7280 !important;
  font-weight: 500 !important;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 4px;
}

.menu-item-modern:hover {
  color: #1f2937 !important;
  background: linear-gradient(90deg, rgba(102, 126, 234, 0.08) 0%, transparent 100%) !important;
  transform: translateX(4px);
}

.menu-item-modern .menu-icon {
  transition: all 0.25s ease;
}

.menu-item-modern:hover .menu-icon {
  transform: scale(1.1);
}

/* Active Menu Item */
.menu-item-active {
  background: linear-gradient(135deg, #667eea 0%, #2fe3ff 100%) !important;
  color: white !important;
  font-weight: 700 !important;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.menu-item-active .v-icon {
  color: white !important;
}

/* Logout Card */
.logout-card {
  background: linear-gradient(135deg, #f8f9fc 0%, #e9ecf5 100%);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

/* App Bar */
.app-bar-custom {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08) !important;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95) !important;
}

.profile-btn {
  border: 1px solid rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
}

.profile-btn:hover {
  background: #f8f9fc !important;
  border-color: rgba(102, 126, 234, 0.3);
}

/* Main Content */
.main-content {
  background: linear-gradient(180deg, #f8f9fc 0%, #ffffff 100%);
}

.main-container {
  max-width: 1600px;
  margin: 0 auto;
}

/* Gradient Avatar */
.gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #5fc7ff 100%);
}

/* Utility Classes */
.ls-wider {
  letter-spacing: 1.2px;
}

/* Smooth Transitions */
* {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #3aa5e8 100%);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #5ee7f6;
}
</style>