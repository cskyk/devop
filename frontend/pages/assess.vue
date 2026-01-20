<script setup>
import { ref, computed } from 'vue'

// --------------------------------------------------------
// 1. MOCK DATA (จำลองข้อมูลให้ตรงกับ Database ของคุณ)
// --------------------------------------------------------

// ข้อมูลการจับคู่ (Assignments)
const assignmentInfo = ref({
  id: 6, // จาก table assignments
  evaluator: 'อ.สมชาย ใจดี',
  evaluatee: 'นายรักเรียน เพียรศึกษา',
  period: 'ภาคเรียนที่ 2/2567',
  department: 'เทคโนโลยีสารสนเทศ'
})

// ข้อมูล Topics และ Indicators (อ้างอิงจากรูป Table ของคุณ)
const evaluationForm = ref([
  {
    id: 1,
    code: 'TOP1', // จาก table evaluation_topics
    title: 'ด้านการจัดการเรียนการสอน',
    description: 'คุณภาพการวางแผนการสอน สื่อการสอน การวัดผล และผลสัมฤทธิ์',
    indicators: [
      { 
        id: 1, 
        code: 'T1-PLAN', // จาก table indicators
        name: 'แผนการจัดการเรียนรู้', 
        desc: 'แผนการสอนสอดคล้องมาตรฐานและตัวชี้วัด', 
        type: 'score_1_4', // ตาม DB
        score: null,
        note: '' 
      },
      { 
        id: 2, 
        code: 'T1-MEDIA', 
        name: 'สื่อการเรียนรู้', 
        desc: 'ใบงาน/แบบฝึก/มัลติมีเดียเหมาะสมกับผู้เรียน', 
        type: 'score_1_4', 
        score: null,
        note: ''
      },
      { 
        id: 4, 
        code: 'T1-REFLECT', 
        name: 'บันทึกหลังการสอน', 
        desc: 'สะท้อนผลและการปรับปรุงแผนการสอน', 
        type: 'yes_no', // ตาม DB
        yes_no_val: null, // เก็บค่า yes/no แยกตาม structure
        note: ''
      }
    ]
  },
  {
    id: 2,
    code: 'TOP2',
    title: 'ด้านการบริหารจัดการชั้นเรียน',
    description: 'การจัดบรรยากาศ กฎระเบียบ การดูแล/ให้คำปรึกษา',
    indicators: [
      { id: 6, code: 'T2-CHART', name: 'แผนภูมิ/ตาราง', desc: 'แผนผังที่นั่ง กฎห้องเรียน ตารางเวร', type: 'yes_no', yes_no_val: null, note: '' },
      { id: 7, code: 'T2-HOMEVISIT', name: 'บันทึกการเยี่ยมบ้าน', desc: 'ร่วมมือผู้ปกครอง/ประสานเครือข่าย', type: 'yes_no', yes_no_val: null, note: '' },
      { id: 9, code: 'T2-ACT', name: 'โครงการ/กิจกรรม', desc: 'กิจกรรมส่งเสริมการเรียนรู้และคุณลักษณะ', type: 'score_1_4', score: null, note: '' }
    ]
  }
])

// --------------------------------------------------------
// 2. LOGIC การคำนวณ
// --------------------------------------------------------

// คำนวณความคืบหน้า (%)
const progress = computed(() => {
  let totalItems = 0
  let filledItems = 0
  
  evaluationForm.value.forEach(topic => {
    topic.indicators.forEach(item => {
      totalItems++
      // เช็คว่ากรอกหรือยัง (แยกตามประเภท)
      if (item.type === 'score_1_4' && item.score !== null) filledItems++
      else if (item.type === 'yes_no' && item.yes_no_val !== null) filledItems++
    })
  })
  
  return totalItems === 0 ? 0 : Math.round((filledItems / totalItems) * 100)
})

// ฟังก์ชันบันทึก
const submitEvaluation = () => {
  // แปลงข้อมูลให้อยู่ในรูปที่จะส่งเข้า table evaluation_results
  const resultsToSave = []
  
  evaluationForm.value.forEach(topic => {
    topic.indicators.forEach(item => {
      // สร้าง Object ให้ตรงกับ fields ใน database
      if (item.score !== null || item.yes_no_val !== null) {
        resultsToSave.push({
          assignment_id: assignmentInfo.value.id,
          topic_id: topic.id,
          indicator_id: item.id,
          score: item.score,        // ลง column score
          value_yes_no: item.yes_no_val, // ลง column value_yes_no
          notes: item.note          // ลง column notes
        })
      }
    })
  })

  console.log('ข้อมูลที่จะส่งไป API (Insert ลง evaluation_results):')
  console.log(JSON.stringify(resultsToSave, null, 2))
  alert(`เตรียมบันทึกข้อมูล ${resultsToSave.length} รายการ เรียบร้อย!`)
}

// เปิด Panel ทั้งหมดไว้ก่อน (0, 1 คือ index ของ array)
const openPanels = ref([0, 1])
</script>

<template>
  <v-container class="pb-10">
    
    <v-card class="mb-6" elevation="2" rounded="lg">
      <div class="bg-indigo-darken-2 pa-6">
        <div class="d-flex align-center">
          <v-avatar color="white" size="64" class="mr-4 elevation-2">
            <span class="text-indigo-darken-2 font-weight-bold text-h5">
              {{ assignmentInfo.evaluatee.charAt(0) }}
            </span>
          </v-avatar>
          <div>
            <div class="text-h5 font-weight-bold text-white">
              {{ assignmentInfo.evaluatee }}
            </div>
            <div class="text-subtitle-1 text-indigo-lighten-4 mt-1">
              <v-icon icon="mdi-domain" size="small" class="mr-1"/> 
              {{ assignmentInfo.department }}
            </div>
          </div>
        </div>
      </div>
      
      <div class="pa-4 bg-white">
        <div class="d-flex justify-space-between text-caption mb-2">
          <span class="text-grey-darken-1">ความคืบหน้าการประเมิน ({{ progress }}%)</span>
          <span class="font-weight-bold text-indigo">{{ progress }}%</span>
        </div>
        <v-progress-linear
          :model-value="progress"
          color="indigo"
          height="10"
          rounded
          striped
        ></v-progress-linear>
      </div>
    </v-card>

    <v-expansion-panels v-model="openPanels" multiple variant="inset" class="mb-6">
      
      <v-expansion-panel
        v-for="(topic, index) in evaluationForm"
        :key="topic.id"
        elevation="1"
        bg-color="white"
      >
        <v-expansion-panel-title class="text-subtitle-1 font-weight-bold py-4">
          <span class="text-indigo mr-2">{{ topic.code }}:</span> {{ topic.title }}
        </v-expansion-panel-title>

        <v-expansion-panel-text>
          <div class="text-body-2 text-grey-darken-1 mb-4 bg-grey-lighten-4 pa-3 rounded">
            คำอธิบาย: {{ topic.description }}
          </div>
          
          <div 
            v-for="(indicator, i) in topic.indicators" 
            :key="indicator.id" 
            class="py-5 border-b"
          >
            <v-row no-gutters>
              <v-col cols="12" md="7" class="pr-md-4 mb-3 mb-md-0">
                <div class="d-flex align-start">
                  <v-chip size="x-small" color="grey-darken-2" variant="flat" class="mr-3 mt-1 font-weight-bold">
                    {{ indicator.code }}
                  </v-chip>
                  <div>
                    <div class="text-body-1 font-weight-medium text-grey-darken-3">
                      {{ indicator.name }}
                    </div>
                    <div class="text-caption text-grey-darken-1 mt-1">
                      {{ indicator.desc }}
                    </div>
                    
                    <v-btn
                      variant="text"
                      density="compact"
                      color="primary"
                      prepend-icon="mdi-paperclip"
                      class="px-0 mt-2"
                      size="small"
                    >
                      ดูหลักฐานแนบ (Evidence)
                    </v-btn>
                  </div>
                </div>
              </v-col>

              <v-col cols="12" md="5" class="d-flex flex-column align-end justify-center">
                
                <div v-if="indicator.type === 'score_1_4'" class="w-100 d-flex flex-column align-end">
                   <div class="mb-1 text-caption text-grey">ระดับคะแนน</div>
                   <v-btn-toggle
                      v-model="indicator.score"
                      color="indigo-darken-1"
                      mandatory
                      divided
                      variant="outlined"
                      density="comfortable"
                    >
                      <v-btn :value="1">1</v-btn>
                      <v-btn :value="2">2</v-btn>
                      <v-btn :value="3">3</v-btn>
                      <v-btn :value="4">4</v-btn>
                   </v-btn-toggle>
                </div>

                <div v-else-if="indicator.type === 'yes_no'" class="w-100 d-flex flex-column align-end">
                  <div class="mb-1 text-caption text-grey">ผลการประเมิน</div>
                  <v-btn-toggle
                      v-model="indicator.yes_no_val"
                      mandatory
                      density="comfortable"
                      rounded="xl"
                    >
                      <v-btn value="yes" color="success" variant="tonal" prepend-icon="mdi-check">ผ่าน/มี</v-btn>
                      <v-btn value="no" color="error" variant="tonal" prepend-icon="mdi-close">ไม่ผ่าน/ไม่มี</v-btn>
                   </v-btn-toggle>
                </div>

                <v-text-field
                  v-model="indicator.note"
                  placeholder="บันทึกเพิ่มเติม (Notes)..."
                  variant="underlined"
                  density="compact"
                  hide-details
                  class="w-100 mt-2 text-caption"
                  prepend-inner-icon="mdi-comment-outline"
                ></v-text-field>

              </v-col>
            </v-row>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-footer app border class="bg-white pa-4" elevation="3">
      <v-row justify="end" no-gutters class="w-100">
        <v-col cols="12" sm="4" md="3">
           <v-btn 
            block 
            color="indigo-darken-1" 
            size="large" 
            prepend-icon="mdi-content-save"
            @click="submitEvaluation"
            :disabled="progress < 100"
          >
            บันทึกการประเมิน
          </v-btn>
        </v-col>
      </v-row>
    </v-footer>

  </v-container>
</template>

<style scoped>
/* ปรับแต่งเล็กน้อย */
.v-expansion-panel-title--active {
  color: #3949AB; /* indigo-darken-1 */
}
</style>