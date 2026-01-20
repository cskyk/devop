<script setup>
import { ref, computed } from 'vue'

// --------------------------------------------------------
// 1. MOCK DATA: ไฟล์ที่ถูกส่งมา (Submissions)
// จำลองว่า ดึงมาจากตาราง Submission ที่ Join กับ Indicators แล้ว
// --------------------------------------------------------
const evaluateeInfo = { name: 'นายรักเรียน เพียรศึกษา', position: 'ครูผู้ช่วย' }

const submittedFiles = ref([
  {
    id: 101,
    name: 'แผนการสอน_Week1-4.pdf',
    type: 'pdf',
    url: 'https://example.com/plan.pdf', // ลิงก์ไฟล์จำลอง
    status: 'pending', // pending, graded
    // ไฟล์นี้ใช้ตอบโจทย์ตัวชี้วัดไหนบ้าง? (Relation)
    related_indicators: [
      { id: 1, code: 'T1-PLAN', name: 'แผนการจัดการเรียนรู้', type: 'score_1_4', score: null, note: '' },
      { id: 4, code: 'T1-REFLECT', name: 'บันทึกหลังการสอน', type: 'yes_no', yes_no_val: null, note: '' }
    ]
  },
  {
    id: 102,
    name: 'รูปถ่าย_บรรยากาศในชั้นเรียน.jpg',
    type: 'image',
    url: 'https://placehold.co/600x400',
    status: 'pending',
    related_indicators: [
      { id: 6, code: 'T2-CHART', name: 'การจัดป้ายนิเทศ/ตารางเวร', type: 'yes_no', yes_no_val: null, note: '' },
      { id: 2, code: 'T1-MEDIA', name: 'สื่อการเรียนรู้', type: 'score_1_4', score: null, note: '' }
    ]
  },
  {
    id: 103,
    name: 'เกียรติบัตร_อบรมAI.pdf',
    type: 'pdf',
    url: '',
    status: 'graded', // ตรวจเสร็จแล้ว
    related_indicators: [
      { id: 10, code: 'T3-CERT', name: 'การพัฒนาตนเอง', type: 'yes_no', yes_no_val: 'yes', note: 'ดีมาก พัฒนาตรงสาย' }
    ]
  }
])

// --------------------------------------------------------
// 2. Logic การเปิดหน้าต่างตรวจงาน (Review Dialog)
// --------------------------------------------------------
const dialog = ref(false)
const currentFile = ref(null)

// ฟังก์ชันเปิดหน้าตรวจ
const openReview = (file) => {
  currentFile.value = file
  dialog.value = true
}

// ฟังก์ชันบันทึกคะแนนของไฟล์นี้
const saveScoreForFile = () => {
  // Update status เป็นตรวจแล้ว
  currentFile.value.status = 'graded'
  
  // จำลองการยิง API
  const payload = {
    file_id: currentFile.value.id,
    results: currentFile.value.related_indicators.map(i => ({
      indicator_id: i.id,
      score: i.score,
      yes_no: i.yes_no_val,
      note: i.note
    }))
  }
  console.log('Saving...', payload)
  
  dialog.value = false
  // showSnackbar('บันทึกผลการตรวจเรียบร้อย', 'success')
}

// Helper: เช็คว่าไฟล์นี้ตรวจครบทุกข้อหรือยัง
const isFileComplete = (file) => {
  return file.related_indicators.every(i => 
    (i.type === 'score_1_4' && i.score) || 
    (i.type === 'yes_no' && i.yes_no_val)
  )
}
</script>

<template>
  <v-container>
    <div class="mb-6">
      <h1 class="text-h5 font-weight-bold">ตรวจหลักฐานการปฏิบัติงาน</h1>
      <p class="text-grey">ผู้รับการประเมิน: <span class="text-primary font-weight-bold">{{ evaluateeInfo.name }}</span></p>
    </div>

    <v-row>
      <v-col 
        v-for="file in submittedFiles" 
        :key="file.id" 
        cols="12" sm="6" md="4" lg="3"
      >
        <v-card 
          hover 
          border 
          @click="openReview(file)"
          :color="file.status === 'graded' ? 'green-lighten-5' : 'white'"
        >
          <div class="bg-grey-lighten-3 d-flex align-center justify-center" style="height: 140px;">
            <v-icon size="64" :color="file.type === 'pdf' ? 'red' : 'indigo'">
              {{ file.type === 'pdf' ? 'mdi-file-pdf-box' : 'mdi-image' }}
            </v-icon>
          </div>

          <v-card-item>
            <div class="text-subtitle-2 text-truncate">{{ file.name }}</div>
            <div class="text-caption text-grey mt-1">
              เกี่ยวข้องกับ {{ file.related_indicators.length }} ตัวชี้วัด
            </div>
          </v-card-item>

          <v-divider></v-divider>
          
          <v-card-actions>
            <v-chip size="x-small" :color="file.status === 'graded' ? 'success' : 'warning'" variant="flat">
              {{ file.status === 'graded' ? 'ตรวจแล้ว' : 'รอตรวจ' }}
            </v-chip>
            <v-spacer></v-spacer>
            <v-btn size="small" variant="text" color="primary">ตรวจงาน</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>


    <v-dialog 
      v-model="dialog" 
      fullscreen 
      transition="dialog-bottom-transition"
    >
      <v-card class="bg-grey-lighten-4">
        <v-toolbar color="indigo-darken-2" density="compact">
          <v-btn icon="mdi-close" @click="dialog = false"></v-btn>
          <v-toolbar-title class="text-subtitle-1">
            กำลังตรวจ: {{ currentFile?.name }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn variant="text" prepend-icon="mdi-content-save" @click="saveScoreForFile">
            บันทึกผลตรวจ
          </v-btn>
        </v-toolbar>

        <v-row no-gutters class="h-100" style="height: calc(100vh - 48px) !important;">
          
          <v-col cols="12" md="7" class="h-100 bg-black d-flex align-center justify-center relative">
            <v-img 
              v-if="currentFile?.type === 'image'"
              :src="currentFile.url"
              max-height="90%"
              contain
            ></v-img>

            <div v-else class="text-center text-white">
              <v-icon size="100" color="white">mdi-file-document-outline</v-icon>
              <div class="mt-4">ตัวอย่างไฟล์ PDF Viewer</div>
              <v-btn class="mt-2" variant="outlined" color="white" :href="currentFile?.url" target="_blank">
                เปิดไฟล์ในแท็บใหม่
              </v-btn>
            </div>
          </v-col>

          <v-col cols="12" md="5" class="h-100 bg-white overflow-y-auto">
            <div class="pa-6">
              <div class="text-h6 font-weight-bold mb-4 d-flex align-center">
                <v-icon color="indigo" class="mr-2">mdi-check-decagram</v-icon>
                ตัวชี้วัดที่เกี่ยวข้อง
              </div>

              <v-card
                v-for="(indicator, i) in currentFile?.related_indicators"
                :key="i"
                variant="outlined"
                class="mb-4 border-indigo"
              >
                <div class="bg-indigo-lighten-5 pa-3 text-subtitle-2 font-weight-bold text-indigo-darken-2">
                  {{ indicator.code }}: {{ indicator.name }}
                </div>
                
                <div class="pa-4">
                  <div v-if="indicator.type === 'score_1_4'">
                    <div class="text-caption mb-2">คะแนนคุณภาพ</div>
                    <v-slider
                      v-model="indicator.score"
                      :min="1"
                      :max="4"
                      :step="1"
                      thumb-label="always"
                      color="indigo"
                      track-color="grey-lighten-2"
                      show-ticks="always"
                      tick-size="4"
                    ></v-slider>
                    <div class="d-flex justify-space-between text-caption text-grey">
                      <span>ปรับปรุง (1)</span>
                      <span>ดีเยี่ยม (4)</span>
                    </div>
                  </div>

                  <div v-else-if="indicator.type === 'yes_no'">
                    <div class="text-caption mb-2">ผลการประเมิน</div>
                    <v-btn-toggle v-model="indicator.yes_no_val" density="compact" color="primary" mandatory class="w-100">
                      <v-btn value="yes" class="flex-grow-1" prepend-icon="mdi-check">ผ่าน</v-btn>
                      <v-btn value="no" class="flex-grow-1" prepend-icon="mdi-close">ไม่ผ่าน</v-btn>
                    </v-btn-toggle>
                  </div>

                  <v-textarea
                    v-model="indicator.note"
                    label="ความคิดเห็น / ข้อเสนอแนะ"
                    rows="2"
                    variant="underlined"
                    class="mt-3"
                    density="compact"
                  ></v-textarea>
                </div>
              </v-card>

              <v-divider class="my-6"></v-divider>

              <v-btn block size="large" color="success" @click="saveScoreForFile">
                ยืนยันผลการตรวจไฟล์นี้
              </v-btn>

            </div>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<style scoped>
/* ทำให้ Scrollbar ในฝั่งขวาดูสวยงาม */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #bdbdbd;
  border-radius: 4px;
}
</style>