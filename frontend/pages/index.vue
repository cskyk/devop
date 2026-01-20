<!-- pages/dashboard/index.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()
const stats = ref({ uploads: 0, evaluations: 0, score: 0 })
const loading = ref(true)

onMounted(async () => {
  // โหลดข้อมูลตัวอย่าง
  setTimeout(() => {
    stats.value = { uploads: 12, evaluations: 5, score: 88 }
    loading.value = false
  }, 800)
})

function logout() {
  auth.logout()
  navigateTo('/login')
}

definePageMeta({
  middleware: 'auth'
})
</script>

<template>
  <v-app>
    <!-- NAVBAR -->

    <!-- MAIN CONTENT -->
    <v-main class="bg-grey-lighten-4">
      <v-container class="py-8">
        <!-- Greeting Section -->
        <div class="mb-8">
          <h1 class="text-h4 font-weight-bold mb-2">
            สวัสดี {{ auth.user?.name || 'ผู้ใช้' }} 👋
          </h1>
          <p class="text-subtitle-1 text-grey-darken-1">
            ยินดีต้อนรับสู่ระบบประเมินมาตรฐานฝีมือแรงงาน
          </p>
        </div>

        <!-- Stats Cards -->
        <v-row v-if="!loading" class="mb-8">
          <v-col cols="12" sm="6" md="4">
            <v-card 
              class="pa-4" 
              elevation="2"
              hover
            >
              <div class="d-flex align-center justify-space-between">
                <div>
                  <p class="text-subtitle-2 text-grey-darken-1 mb-1">ไฟล์หลักฐาน</p>
                  <h2 class="text-h3 font-weight-bold text-indigo">{{ stats.uploads }}</h2>
                </div>
                <v-avatar color="indigo-lighten-5" size="56">
                  <v-icon icon="mdi-file-document" color="indigo" size="32" />
                </v-avatar>
              </div>
              <v-divider class="my-3" />
              <div class="d-flex align-center">
                <v-icon icon="mdi-trending-up" color="success" size="20" class="mr-1" />
                <span class="text-caption text-success">+3 เอกสารใหม่</span>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="4">
            <v-card 
              class="pa-4" 
              elevation="2"
              hover
            >
              <div class="d-flex align-center justify-space-between">
                <div>
                  <p class="text-subtitle-2 text-grey-darken-1 mb-1">การประเมินทั้งหมด</p>
                  <h2 class="text-h3 font-weight-bold text-green">{{ stats.evaluations }}</h2>
                </div>
                <v-avatar color="green-lighten-5" size="56">
                  <v-icon icon="mdi-clipboard-check" color="green" size="32" />
                </v-avatar>
              </div>
              <v-divider class="my-3" />
              <div class="d-flex align-center">
                <v-icon icon="mdi-clock-outline" color="warning" size="20" class="mr-1" />
                <span class="text-caption text-grey-darken-1">2 รอตรวจสอบ</span>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="4">
            <v-card 
              class="pa-4" 
              elevation="2"
              hover
            >
              <div class="d-flex align-center justify-space-between">
                <div>
                  <p class="text-subtitle-2 text-grey-darken-1 mb-1">คะแนนเฉลี่ย</p>
                  <h2 class="text-h3 font-weight-bold text-deep-orange">{{ stats.score }}</h2>
                </div>
                <v-avatar color="deep-orange-lighten-5" size="56">
                  <v-icon icon="mdi-chart-line" color="deep-orange" size="32" />
                </v-avatar>
              </div>
              <v-divider class="my-3" />
              <div class="d-flex align-center">
                <v-progress-linear
                  :model-value="stats.score"
                  color="deep-orange"
                  height="6"
                  rounded
                />
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Loading State -->
        <v-row v-else class="mb-8">
          <v-col v-for="i in 3" :key="i" cols="12" sm="6" md="4">
            <v-skeleton-loader type="card" />
          </v-col>
        </v-row>

        <!-- Quick Actions -->
        <v-card elevation="2" class="mb-6">
          <v-card-title class="d-flex align-center">
            <v-icon icon="mdi-lightning-bolt" class="mr-2" color="primary" />
            การดำเนินการด่วน
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6" md="3">
                <v-btn
                  block
                  color="primary"
                  size="large"
                  prepend-icon="mdi-plus-circle"
                  variant="flat"
                >
                  เพิ่มหลักฐาน
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-btn
                  block
                  color="secondary"
                  size="large"
                  prepend-icon="mdi-table"
                  variant="flat"
                >
                  ตารางประเมิน
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-btn
                  block
                  color="info"
                  size="large"
                  prepend-icon="mdi-book-open"
                  variant="tonal"
                >
                  คู่มือระบบ
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-btn
                  block
                  color="success"
                  size="large"
                  prepend-icon="mdi-download"
                  variant="tonal"
                >
                  ดาวน์โหลดรายงาน
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Recent Activity -->
        <v-card elevation="2">
          <v-card-title class="d-flex align-center">
            <v-icon icon="mdi-history" class="mr-2" color="primary" />
            กิจกรรมล่าสุด
          </v-card-title>
          <v-divider />
          <v-list>
            <v-list-item
              v-for="i in 3"
              :key="i"
              prepend-icon="mdi-file-check"
            >
              <v-list-item-title>อัพโหลดเอกสารหลักฐานสำเร็จ</v-list-item-title>
              <v-list-item-subtitle>{{ i }} ชั่วโมงที่แล้ว</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
      </v-container>
    </v-main>

    <!-- FOOTER -->
    <v-footer class="bg-grey-lighten-3" app>
      <v-row no-gutters>
        <v-col class="text-center" cols="12">
          <span class="text-caption text-grey-darken-1">
            © 2025 VEC Skills Platform | Powered by KruOak
          </span>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>