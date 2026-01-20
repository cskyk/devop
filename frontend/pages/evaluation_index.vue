<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { computed } from 'vue'

const router = useRouter()
const config = useRuntimeConfig()
const authStore = useAuthStore()

// ดึงข้อมูล
const { data: assignments, pending, error } = await useFetch(`${config.public.apiBase}/api/evaluator/assignments`, {
    headers: { Authorization: `Bearer ${authStore.token}` }
})

const items = computed(() => assignments.value || [])

// ไปหน้าประเมิน
const selectEvaluatee = (id) => {
    router.push(`/assess-hybrid?id=${id}`)
}

// Helper: Config สำหรับสถานะ
const getStatusConfig = (status) => {
    switch (status) {
        case 'completed':
            return { color: 'emerald', icon: 'mdi-check-circle', label: 'ประเมินแล้ว', bg: 'bg-green-lighten-5' }
        case 'in_progress':
            return { color: 'amber', icon: 'mdi-clock-outline', label: 'กำลังดำเนินการ', bg: 'bg-amber-lighten-5' }
        default:
            return { color: 'blue-grey', icon: 'mdi-circle-outline', label: 'รอการประเมิน', bg: 'bg-grey-lighten-4' }
    }
}

// Helper: สุ่มสี Avatar จากชื่อ (เพื่อความสวยงามถ้าไม่มีรูป)
const getAvatarColor = (name) => {
    const colors = ['indigo', 'deep-purple', 'cyan', 'teal', 'blue']
    const index = name ? name.charCodeAt(0) % colors.length : 0
    return colors[index]
}
</script>

<template>
  <v-container fluid class="bg-slate-50 fill-height align-start pa-6">
    <v-row justify="center">
      <v-col cols="12" xl="10">
        
        <div class="d-flex flex-wrap align-center justify-space-between mb-8">
            <div>
                <h1 class="text-h4 font-weight-bold text-indigo-darken-3">
                    <v-icon icon="mdi-account-star-outline" start class="mb-1"></v-icon>
                    รายการประเมิน
                </h1>
                <p class="text-subtitle-1 text-grey-darken-1 mt-1">
                    เลือกบุคลากรที่ต้องการประเมินในรอบปัจจุบัน
                </p>
            </div>
            
            <v-card width="300" elevation="0" rounded="pill" border class="mt-4 mt-sm-0">
                <v-text-field
                    density="compact"
                    variant="plain"
                    label="ค้นหารายชื่อ..."
                    prepend-inner-icon="mdi-magnify"
                    single-line
                    hide-details
                    class="px-4 py-1"
                ></v-text-field>
            </v-card>
        </div>

        <div v-if="pending" class="py-12 text-center">
            <v-progress-circular indeterminate color="indigo" size="64" width="6"></v-progress-circular>
            <div class="mt-4 text-grey-darken-2 font-weight-medium">กำลังโหลดรายชื่อ...</div>
        </div>

        <v-alert
            v-else-if="error"
            type="error"
            variant="tonal"
            icon="mdi-alert-circle"
            title="เกิดข้อผิดพลาด"
            text="ไม่สามารถเชื่อมต่อข้อมูลได้ กรุณาลองใหม่อีกครั้ง"
            class="mb-6 rounded-xl"
        ></v-alert>

        <div v-else-if="items.length === 0" class="text-center py-16">
            <v-avatar color="grey-lighten-4" size="120" class="mb-6">
                <v-icon icon="mdi-clipboard-check-outline" size="60" color="grey-lighten-1"></v-icon>
            </v-avatar>
            <h3 class="text-h6 text-grey-darken-2">ไม่มีรายการที่ต้องประเมิน</h3>
            <p class="text-caption text-grey">คุณได้ดำเนินการครบถ้วนแล้ว หรือยังไม่มีรายการเข้ามา</p>
        </div>

        <v-row v-else>
          <v-col v-for="(item, index) in items" :key="item.id" cols="12" sm="6" md="4" lg="3">
            <v-hover v-slot="{ isHovering, props }">
                <v-card
                    v-bind="props"
                    class="h-100 card-transition cursor-pointer position-relative overflow-visible"
                    :elevation="isHovering ? 8 : 1"
                    rounded="xl"
                    border
                    @click="selectEvaluatee(item.id)"
                >
                    <div class="status-badge">
                        <v-chip 
                            :color="getStatusConfig(item.status).color" 
                            variant="flat" 
                            size="small" 
                            class="font-weight-bold elevation-2"
                        >
                            <v-icon start size="small">{{ getStatusConfig(item.status).icon }}</v-icon>
                            {{ getStatusConfig(item.status).label }}
                        </v-chip>
                    </div>

                    <v-card-item class="pt-8 pb-2 text-center">
                        <v-avatar size="80" :color="`${getAvatarColor(item.evaluatee_name)}-lighten-5`" class="elevation-1 mb-4 avatar-border">
                             <span :class="`text-h4 font-weight-black text-${getAvatarColor(item.evaluatee_name)}-darken-2`">
                                {{ item.evaluatee_name?.charAt(0) }}
                             </span>
                        </v-avatar>

                        <div class="text-h6 font-weight-bold text-blue-grey-darken-4 text-truncate px-2">
                            {{ item.evaluatee_name }}
                        </div>
                        <div class="text-body-2 text-indigo-darken-1 font-weight-medium mb-1">
                            {{ item.position }}
                        </div>
                        <div class="text-caption text-grey mb-4">
                            <v-icon icon="mdi-domain" size="x-small" class="mr-1"></v-icon>
                            {{ item.department }}
                        </div>
                        
                        <v-divider class="mb-3 border-opacity-50"></v-divider>

                        <div class="d-flex justify-space-between align-center px-2">
                            <div class="text-caption text-grey-darken-1">
                                <span class="font-weight-bold">รอบ:</span> {{ item.period_name }}
                            </div>
                            <v-btn 
                                icon="mdi-arrow-right" 
                                variant="tonal" 
                                size="small" 
                                :color="isHovering ? 'indigo' : 'grey'"
                            ></v-btn>
                        </div>
                    </v-card-item>

                    <v-overlay
                        :model-value="isHovering"
                        contained
                        scrim="indigo-darken-4"
                        class="align-center justify-center"
                    >
                        <v-btn 
                            color="white" 
                            prepend-icon="mdi-pencil-box-outline" 
                            class="text-indigo-darken-3 font-weight-bold px-6"
                            rounded="pill"
                            elevation="4"
                        >
                            เริ่มประเมิน
                        </v-btn>
                    </v-overlay>
                </v-card>
            </v-hover>
          </v-col>
        </v-row>

      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
/* Background */
.bg-slate-50 {
    background-color: #F8FAFC !important;
}

/* Card Transitions */
.card-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    background: white;
}

.card-transition:hover {
    transform: translateY(-6px);
}

/* Floating Status Badge */
.status-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 2;
}

/* Avatar Border */
.avatar-border {
    border: 3px solid white;
    box-shadow: 0 0 0 1px rgba(0,0,0,0.05);
}

/* Overlay Customization */
:deep(.v-overlay__scrim) {
    opacity: 0.1 !important; /* จางๆ เพื่อให้ยังเห็นข้อมูลข้างหลัง */
}
</style>