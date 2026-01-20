<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const authStore = useAuthStore()

const assignmentId = route.query.id 
const evidenceDialog = ref(false)
const currentIndicator = ref(null)
const currentFile = ref(null)

const openPanels = ref([]) 

// --- Logic ส่วนเดิม ---
const { data: apiResponse, pending, refresh } = await useFetch(
    `${config.public.apiBase}/api/evaluator/assessments/${assignmentId}`, 
    { headers: { Authorization: `Bearer ${authStore.token}` } }
)

const assignmentInfo = computed(() => apiResponse.value?.assignment_info || {})
const evaluationForm = computed(() => apiResponse.value?.form_data || [])

const progress = computed(() => {
    if (!evaluationForm.value.length) return 0
    let total = 0, filled = 0
    evaluationForm.value.forEach(t => t.indicators.forEach(i => {
        total++
        if ((i.type === 'score_1_4' && i.score) || (i.type === 'yes_no' && i.yes_no_val !== null && i.yes_no_val !== undefined)) filled++
    }))
    return total === 0 ? 0 : Math.round((filled / total) * 100)
})

const progressColor = computed(() => {
    if(progress.value < 50) return 'error'
    if(progress.value < 80) return 'warning'
    return 'success'
})

const openEvidence = (indicator) => {
  currentIndicator.value = indicator
  currentFile.value = indicator.files && indicator.files.length > 0 ? indicator.files[0] : null
  evidenceDialog.value = true
}

const submitEvaluation = async () => {
    if (!assignmentId) return alert('Error: Missing Assignment ID')

    try {
        const results = []
        if (evaluationForm.value) {
            evaluationForm.value.forEach(topic => {
                if (topic.indicators) {
                    topic.indicators.forEach(item => {
                        const hasScore = item.score !== undefined && item.score !== null
                        const hasYesNo = item.yes_no_val !== undefined && item.yes_no_val !== null
                        const hasNote = item.note && item.note.trim() !== ''

                        if (hasScore || hasYesNo || hasNote) {
                            results.push({
                                indicator_id: Number(item.id), 
                                score: hasScore ? Number(item.score) : null,
                                value_yes_no: hasYesNo ? item.yes_no_val : null, 
                                notes: item.note || '' 
                            })
                        }
                    })
                }
            })
        }

        const payload = {
            assignment_id: Number(assignmentId),
            results: results,
            status: progress.value === 100 ? 'completed' : 'in_progress'
        }

        await $fetch(`${config.public.apiBase}/api/evaluator/submit`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${authStore.token}`,
                'Content-Type': 'application/json' 
            },
            body: payload
        })

        alert('บันทึกข้อมูลเรียบร้อย!')
        router.push('/assess-hybrid') 

    } catch (err) {
        console.error("Submit Error:", err)
        let errorMsg = err.response?._data?.message || err.message
        alert(`บันทึกไม่สำเร็จ:\n${errorMsg}`)
    }
}
</script>

<template>
    <div v-if="pending" class="d-flex flex-column justify-center align-center h-screen bg-grey-lighten-5">
        <v-progress-circular indeterminate color="indigo" size="64" width="6"></v-progress-circular>
        <div class="mt-4 text-grey-darken-1 font-weight-medium animate-pulse">กำลังเตรียมแบบประเมิน...</div>
    </div>

    <v-container v-else class="pb-16 bg-grey-lighten-5 fill-height align-start" fluid>
        <v-row justify="center">
            <v-col cols="12" xl="9">
                
                <v-card class="mb-6 rounded-xl overflow-hidden shadow-soft" elevation="0">
                    <div class="header-bg px-6 py-8">
                        <div class="d-flex flex-column flex-md-row align-center">
                            <div class="position-relative mr-md-8 mb-4 mb-md-0">
                                <v-avatar color="white" size="100" class="elevation-3 border-white">
                                    <span class="text-indigo-darken-3 text-h3 font-weight-black">
                                        {{ assignmentInfo.evaluatee?.charAt(0) }}
                                    </span>
                                </v-avatar>
                                <v-badge 
                                    :color="progress === 100 ? 'success' : 'amber'" 
                                    :icon="progress === 100 ? 'mdi-check' : 'mdi-pencil'"
                                    location="bottom end"
                                    offset-x="10"
                                    offset-y="10"
                                    class="position-absolute bottom-0 right-0"
                                ></v-badge>
                            </div>

                            <div class="flex-grow-1 text-center text-md-left text-white">
                                <div class="d-flex align-center justify-center justify-md-start mb-1 opacity-90">
                                    <v-icon icon="mdi-account-details-outline" size="small" class="mr-2"></v-icon>
                                    <span class="text-overline font-weight-bold">แบบประเมินประสิทธิภาพ</span>
                                </div>
                                <h1 class="text-h4 font-weight-bold mb-2">{{ assignmentInfo.evaluatee }}</h1>
                                <div class="d-flex flex-wrap justify-center justify-md-start gap-3 opacity-90">
                                    <v-chip size="small" color="white" variant="outlined" class="font-weight-medium">
                                        <v-icon start icon="mdi-briefcase-variant-outline"></v-icon>
                                        {{ assignmentInfo.position }}
                                    </v-chip>
                                    <v-chip size="small" color="white" variant="outlined" class="font-weight-medium">
                                        <v-icon start icon="mdi-domain"></v-icon>
                                        {{ assignmentInfo.department }}
                                    </v-chip>
                                </div>
                            </div>

                            <div class="ml-md-8 mt-4 mt-md-0 d-flex flex-column align-center">
                                <v-progress-circular 
                                    :model-value="progress" 
                                    :color="progressColor" 
                                    size="80" 
                                    width="8" 
                                    bg-color="rgba(255,255,255,0.15)"
                                    class="text-h6 font-weight-bold text-white"
                                >
                                    {{ progress }}%
                                </v-progress-circular>
                            </div>
                        </div>
                    </div>
                    <v-progress-linear :model-value="progress" :color="progressColor" height="4"></v-progress-linear>
                </v-card>

                <v-expansion-panels v-model="openPanels" multiple variant="popout" class="pa-0 gap-4">
                    <v-expansion-panel 
                        v-for="topic in evaluationForm" 
                        :key="topic.id" 
                        class="rounded-xl border-none shadow-sm mb-4"
                        bg-color="white"
                    >
                        <v-expansion-panel-title class="py-4">
                            <template v-slot:default="{ expanded }">
                                <div class="d-flex align-center w-100">
                                    <v-avatar :color="expanded ? 'indigo' : 'grey-lighten-4'" size="42" class="mr-4 transition-colors">
                                        <span :class="expanded ? 'text-white' : 'text-grey-darken-3'" class="font-weight-bold text-body-1">{{ topic.code }}</span>
                                    </v-avatar>
                                    <div>
                                        <div class="text-h6 font-weight-bold text-grey-darken-3">{{ topic.title }}</div>
                                        <div class="text-caption text-grey">
                                            {{ topic.indicators.length }} หัวข้อการประเมิน
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </v-expansion-panel-title>

                        <v-expansion-panel-text class="pa-0">
                            <div v-for="(item, idx) in topic.indicators" :key="item.id" class="position-relative">
                                <v-divider v-if="idx > 0" class="border-opacity-50 mx-4"></v-divider>
                                
                                <div class="d-flex flex-column flex-lg-row pa-6 gap-6">
                                    <div class="flex-grow-1" style="flex-basis: 60%;">
                                        <div class="d-flex align-start">
                                            <v-chip size="x-small" label color="grey-darken-3" class="mr-3 mt-1 font-weight-bold">
                                                {{ item.code }}
                                            </v-chip>
                                            <div>
                                                <h3 class="text-subtitle-1 font-weight-bold text-grey-darken-4 mb-2">
                                                    {{ item.name }}
                                                </h3>
                                                <p class="text-body-2 text-grey-darken-1 mb-4" style="line-height: 1.7;">
                                                    {{ item.desc }}
                                                </p>
                                                
                                                <v-btn 
                                                    v-if="item.files && item.files.length > 0" 
                                                    variant="tonal" 
                                                    color="indigo" 
                                                    size="small" 
                                                    rounded="pill"
                                                    class="text-none"
                                                    prepend-icon="mdi-paperclip"
                                                    @click="openEvidence(item)"
                                                >
                                                    ดูหลักฐานแนบ ({{ item.files.length }})
                                                </v-btn>
                                            </div>
                                        </div>
                                    </div>

                                    <div style="flex-basis: 40%; min-width: 300px;">
                                        <v-sheet class="bg-grey-lighten-5 rounded-lg pa-5 border border-dashed">
                                            
                                            <div v-if="item.type === 'score_1_4'">
                                                <div class="d-flex justify-space-between align-center mb-6">
                                                    <span class="text-caption font-weight-bold text-grey text-uppercase ls-1">คะแนนประเมิน</span>
                                                    <v-chip :color="item.score ? 'indigo' : 'grey'" variant="flat" size="small" class="font-weight-bold">
                                                        {{ item.score || '-' }} / 4
                                                    </v-chip>
                                                </div>
                                                
                                                <v-slider
                                                    v-model="item.score"
                                                    :min="1" :max="4" :step="1"
                                                    show-ticks="always" step-size="1"
                                                    color="indigo-accent-2"
                                                    track-color="grey-lighten-2"
                                                    track-size="6"
                                                    thumb-label="always"
                                                    hide-details
                                                    class="mb-2"
                                                >
                                                    <template v-slot:thumb-label="{ modelValue }">
                                                        <span class="text-body-2 font-weight-bold">{{ modelValue }}</span>
                                                    </template>
                                                </v-slider>
                                                <div class="d-flex justify-space-between text-caption text-medium-emphasis px-1">
                                                    <span>ต้องปรับปรุง</span>
                                                    <span>ดีเยี่ยม</span>
                                                </div>
                                            </div>

                                            <div v-else-if="item.type === 'yes_no'">
                                                <div class="text-caption font-weight-bold text-grey text-uppercase ls-1 mb-3">ผลการประเมิน</div>
                                                <div class="d-flex gap-2">
                                                    <v-btn 
                                                        :variant="item.yes_no_val === 1 ? 'flat' : 'outlined'" 
                                                        :color="item.yes_no_val === 1 ? 'success' : 'grey'" 
                                                        class="flex-1 rounded-lg"
                                                        height="45"
                                                        @click="item.yes_no_val = 1"
                                                    >
                                                        <v-icon start>mdi-check-circle-outline</v-icon> ผ่าน
                                                    </v-btn>
                                                    <v-btn 
                                                        :variant="item.yes_no_val === 0 ? 'flat' : 'outlined'" 
                                                        :color="item.yes_no_val === 0 ? 'error' : 'grey'" 
                                                        class="flex-1 rounded-lg"
                                                        height="45"
                                                        @click="item.yes_no_val = 0"
                                                    >
                                                        <v-icon start>mdi-close-circle-outline</v-icon> ไม่ผ่าน
                                                    </v-btn>
                                                </div>
                                            </div>

                                            <v-textarea
                                                v-model="item.note"
                                                rows="1" auto-grow
                                                variant="solo"
                                                density="compact"
                                                bg-color="white"
                                                placeholder="ความคิดเห็นเพิ่มเติม..."
                                                hide-details
                                                class="mt-4 shadow-sm"
                                            >
                                                <template v-slot:prepend-inner>
                                                    <v-icon size="small" color="grey">mdi-comment-text-outline</v-icon>
                                                </template>
                                            </v-textarea>
                                        </v-sheet>
                                    </div>
                                </div>
                            </div>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-col>
        </v-row>

        <v-app-bar location="bottom" height="88" class="px-0 border-t" color="white" elevation="3">
             <v-container class="py-0 d-flex align-center mw-1200">
                <div class="d-none d-sm-flex align-center">
                    <v-icon icon="mdi-chart-donut" color="indigo" size="large" class="mr-3"></v-icon>
                    <div>
                        <div class="text-caption text-grey-darken-1 font-weight-bold text-uppercase ls-1">ความคืบหน้า</div>
                        <div class="text-h6 font-weight-black text-indigo line-height-1">
                            {{ progress }}<span class="text-body-2 text-grey">%</span>
                        </div>
                    </div>
                </div>
                
                <v-spacer></v-spacer>
                
                <v-btn variant="text" color="grey-darken-1" class="mr-2" rounded="xl" @click="router.back()">
                    ยกเลิก
                </v-btn>
                <v-btn 
                    color="indigo-darken-2" 
                    height="50"
                    rounded="xl" 
                    elevation="4" 
                    prepend-icon="mdi-content-save-check"
                    class="px-8 font-weight-bold text-body-1"
                    @click="submitEvaluation"
                >
                    บันทึกการประเมิน
                </v-btn>
             </v-container>
        </v-app-bar>

        <v-dialog v-model="evidenceDialog" max-width="1000" transition="dialog-bottom-transition">
             <v-card class="rounded-xl overflow-hidden bg-white">
                <v-toolbar color="grey-lighten-5" class="border-b pl-2 pr-4" height="64">
                    <v-btn icon="mdi-close" variant="text" @click="evidenceDialog = false" color="grey-darken-1"></v-btn>
                    <div>
                        <div class="text-caption text-indigo font-weight-bold">{{ currentIndicator?.code }}</div>
                        <div class="text-subtitle-1 font-weight-bold text-truncate" style="max-width: 300px;">
                             หลักฐานประกอบ
                        </div>
                    </div>
                    <v-spacer></v-spacer>
                    <v-btn v-if="currentFile" :href="currentFile.url" target="_blank" variant="tonal" color="indigo" rounded="pill" prepend-icon="mdi-download">
                        Download
                    </v-btn>
                </v-toolbar>

                <v-card-text class="pa-0 d-flex flex-column flex-md-row" style="height: 70vh;">
                    <div class="w-100 w-md-25 border-e bg-grey-lighten-5 d-flex flex-column">
                        <div class="pa-4 text-caption font-weight-bold text-grey text-uppercase ls-1">
                            Files ({{ currentIndicator?.files.length }})
                        </div>
                        <v-list density="compact" class="bg-transparent flex-grow-1 overflow-y-auto px-2">
                            <v-list-item 
                                v-for="(file, i) in currentIndicator?.files" :key="i" 
                                :value="file" 
                                rounded="lg" 
                                class="mb-1"
                                :active="currentFile === file"
                                color="indigo"
                                @click="currentFile = file"
                            >
                                <template v-slot:prepend>
                                    <v-icon :color="file.type === 'pdf' ? 'red-lighten-1' : 'blue-lighten-1'">
                                        {{ file.type === 'pdf' ? 'mdi-file-pdf-box' : 'mdi-image' }}
                                    </v-icon>
                                </template>
                                <v-list-item-title class="font-weight-medium text-body-2">{{ file.name }}</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </div>

                    <div class="flex-grow-1 bg-grey-darken-4 d-flex align-center justify-center position-relative overflow-hidden">
                        <div v-if="!currentFile" class="text-center opacity-60">
                            <v-icon size="64" color="white" class="mb-3">mdi-file-find-outline</v-icon>
                            <div class="text-white">เลือกไฟล์เพื่อดูตัวอย่าง</div>
                        </div>
                        
                        <v-img v-else-if="currentFile.type === 'image'" :src="currentFile.url" max-height="100%" contain class="w-100 h-100"></v-img>
                        <iframe v-else-if="currentFile.type === 'pdf'" :src="currentFile.url" width="100%" height="100%" style="border: none;"></iframe>
                        
                        <div v-else class="text-center text-white">
                            <v-icon size="48" color="amber">mdi-file-alert-outline</v-icon>
                            <div class="mt-2 text-body-2">ไม่สามารถแสดงตัวอย่างไฟล์นี้ได้</div>
                        </div>
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>

    </v-container>
</template>

<style scoped>
.header-bg {
    background: linear-gradient(120deg, #3949AB 0%, #1E88E5 100%);
}
.border-white {
    border: 4px solid white !important;
}
.shadow-soft {
    box-shadow: 0 4px 20px rgba(0,0,0,0.08) !important;
}
.shadow-sm {
    box-shadow: 0 2px 8px rgba(0,0,0,0.04) !important;
}
.ls-1 {
    letter-spacing: 1px;
}
.mw-1200 {
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
}
.gap-4 {
    gap: 16px;
}
.gap-2 {
    gap: 8px;
}
.transition-colors {
    transition: background-color 0.3s ease, color 0.3s ease;
}
.line-height-1 {
    line-height: 1;
}
</style>