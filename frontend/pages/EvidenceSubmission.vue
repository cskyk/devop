<template>
  <v-container fluid class="bg-grey-lighten-5 fill-height align-start pa-6">
    
    <v-overlay :model-value="loading" class="align-center justify-center" persistent>
      <v-card class="pa-6 text-center" rounded="xl" elevation="4">
        <v-progress-circular color="indigo" indeterminate size="64" width="6"></v-progress-circular>
        <div class="mt-4 font-weight-bold text-indigo">กำลังโหลดข้อมูลการประเมิน...</div>
      </v-card>
    </v-overlay>

    <div v-if="!loading" style="width: 100%;">
      
      <v-card elevation="0" rounded="xl" class="mb-6 border overflow-hidden">
        <v-sheet class="pa-6" color="indigo-darken-2">
          <v-row align="center">
            <v-col cols="12" md="8">
              <div class="d-flex align-center">
                <v-avatar color="white" size="64" class="mr-4 elevation-2">
                  <span class="text-h5 font-weight-bold text-indigo-darken-2">{{ userInitials }}</span>
                </v-avatar>
                <div>
                  <h2 class="text-h5 font-weight-bold text-white mb-1">ส่งผลงานการประเมิน</h2>
                  <div class="text-indigo-lighten-4 text-subtitle-2 d-flex flex-wrap gap-2 align-center">
                    <v-icon icon="mdi-account-circle" size="small"></v-icon> {{ currentUser.name_th }}
                    <span class="mx-1">|</span>
                    <v-icon icon="mdi-domain" size="small"></v-icon> แผนก: {{ currentUser.dept_id || '-' }}
                    <v-chip size="small" color="amber" class="ml-2 font-weight-bold text-black">
                      {{ currentPeriodName }}
                    </v-chip>
                  </div>
                </div>
              </div>
            </v-col>
            <v-col cols="12" md="4" class="text-md-right text-left">
              <div class="text-white mb-2 font-weight-bold">ความคืบหน้าภาพรวม</div>
              <v-progress-linear
                :model-value="overallProgress"
                color="light-green-accent-3"
                height="20"
                rounded
                striped
              >
                <template v-slot:default="{ value }">
                  <span class="text-caption font-weight-bold text-black">{{ Math.ceil(value) }}%</span>
                </template>
              </v-progress-linear>
              <div class="text-caption text-indigo-lighten-4 mt-1">
                ดำเนินการเสร็จสิ้น {{ completedIndicatorsCount }} จาก {{ totalIndicatorsCount }} ตัวชี้วัด
              </div>
            </v-col>
          </v-row>
        </v-sheet>
      </v-card>

      <v-expansion-panels multiple variant="default" class="rounded-xl">
        <v-expansion-panel 
          v-for="(topic, tIndex) in evaluationData" 
          :key="topic.id" 
          elevation="0" 
          class="mb-4 border rounded-xl overflow-hidden"
          rounded="xl"
        >
          <v-expansion-panel-title class="py-4" color="white">
            <template v-slot:default="{ expanded }">
              <div class="d-flex align-center w-100">
                <v-avatar 
                  size="36" 
                  :color="isTopicComplete(topic) ? 'success' : 'indigo-lighten-5'" 
                  class="mr-3"
                >
                  <v-icon :icon="isTopicComplete(topic) ? 'mdi-check' : 'mdi-format-list-checks'" 
                    :color="isTopicComplete(topic) ? 'white' : 'indigo'">
                  </v-icon>
                </v-avatar>
                
                <div class="flex-grow-1 mr-4">
                  <div class="text-subtitle-1 font-weight-bold text-grey-darken-3">
                    {{ topic.title_th }}
                  </div>
                  <v-progress-linear
                    :model-value="getTopicPercentage(topic)"
                    :color="isTopicComplete(topic) ? 'success' : 'indigo-lighten-2'"
                    height="4"
                    rounded
                    class="mt-2"
                    style="max-width: 200px;"
                  ></v-progress-linear>
                </div>
                
                <div class="text-caption font-weight-bold px-3 py-1 bg-grey-lighten-4 rounded-pill">
                  {{ getTopicProgressText(topic) }}
                </div>
              </div>
            </template>
          </v-expansion-panel-title>

          <v-expansion-panel-text class="bg-grey-lighten-5 pt-2">
            
            <div 
              v-for="(indicator, iIndex) in topic.indicators" 
              :key="indicator.id" 
              class="bg-white rounded-lg pa-4 mb-3 border-thin"
            >
              <v-row no-gutters>
                <v-col cols="12" md="7" class="pr-md-4 mb-4 mb-md-0">
                  <div class="d-flex align-start">
                    <v-chip size="small" color="indigo" variant="flat" label class="mr-2 font-weight-bold">
                      {{ indicator.code }}
                    </v-chip>
                    <div>
                      <div class="text-body-1 font-weight-bold text-grey-darken-3 mb-1">
                        {{ indicator.name_th }}
                      </div>
                      <div class="text-body-2 text-grey-darken-1">
                        {{ indicator.description }}
                      </div>
                      
                      <div class="mt-3">
                        <div v-if="indicator.uploaded_files && indicator.uploaded_files.length > 0">
                          <div class="text-caption text-grey mb-1">ไฟล์ที่ส่งแล้ว:</div>
                          <div class="d-flex flex-wrap gap-2">
                            <v-chip 
                              v-for="file in indicator.uploaded_files" 
                              :key="file.id" 
                              color="teal" 
                              variant="tonal"
                              class="border-teal"
                              closable 
                              prepend-icon="mdi-file-document-check"
                              @click:close="deleteFile(file.id, indicator)"
                            >
                              {{ file.file_name }}
                            </v-chip>
                          </div>
                        </div>
                        <div v-else class="text-caption text-orange-darken-2 font-weight-medium d-flex align-center mt-2">
                          <v-icon icon="mdi-alert-circle-outline" size="small" start></v-icon>
                          ยังไม่ได้ส่งเอกสารหลักฐาน
                        </div>
                      </div>
                    </div>
                  </div>
                </v-col>

                <v-col cols="12" md="5">
                  <v-sheet color="grey-lighten-5" rounded="lg" class="pa-3 border-dashed h-100 d-flex flex-column justify-center">
                    
                    <div class="text-caption font-weight-bold text-grey-darken-1 mb-2">
                      <v-icon icon="mdi-cloud-upload" size="small" class="mr-1"></v-icon>
                      อัปโหลดหลักฐาน
                    </div>

                    <div class="d-flex flex-column gap-2">
                      <v-select 
                        v-if="indicator.allowed_evidence.length > 1" 
                        v-model="indicator.selectedEvidenceType"
                        :items="indicator.allowed_evidence" 
                        item-title="name_th" 
                        item-value="id" 
                        label="เลือกประเภทเอกสาร"
                        density="compact" 
                        variant="outlined" 
                        bg-color="white"
                        color="indigo"
                        hide-details
                      ></v-select>

                      <div v-else class="mb-1">
                        <v-chip size="x-small" variant="outlined" color="grey-darken-1">
                          ต้องส่ง: {{ indicator.allowed_evidence[0]?.name_th || 'เอกสารทั่วไป' }}
                        </v-chip>
                      </div>

                      <v-file-input 
                        v-model="indicator.tempFile" 
                        :loading="uploadingId === indicator.id"
                        :disabled="uploadingId === indicator.id" 
                        label="คลิกเพื่อเลือกไฟล์" 
                        placeholder="หรือลากไฟล์มาวาง"
                        prepend-icon="" 
                        prepend-inner-icon="mdi-paperclip" 
                        variant="outlined" 
                        density="compact" 
                        bg-color="white"
                        color="indigo"
                        hide-details 
                        show-size
                        @update:modelValue="handleFileUpload(indicator)" 
                      >
                        <template v-slot:selection="{ fileNames }">
                          <span class="text-indigo font-weight-bold">{{ fileNames[0] }}</span>
                        </template>
                      </v-file-input>
                    </div>

                  </v-sheet>
                </v-col>
              </v-row>
            </div>

          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

      <v-sheet 
        v-if="evaluationData.length === 0" 
        class="d-flex flex-column align-center justify-center py-12 text-center bg-transparent"
      >
        <v-icon icon="mdi-clipboard-text-off-outline" size="80" color="grey-lighten-1"></v-icon>
        <div class="text-h6 text-grey-darken-1 mt-4">ไม่พบรายการประเมิน</div>
        <div class="text-body-2 text-grey">กรุณาติดต่อผู้ดูแลระบบหากคุณคิดว่านี่คือข้อผิดพลาด</div>
      </v-sheet>

    </div>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: "EvidenceSubmission",
  data() {
    return {
      currentUser: { name_th: 'User', role: '', dept_id: '', id: null },
      currentPeriodId: null, 
      currentPeriodName: '', 
      token: '',
      loading: true,
      uploadingId: null,
      evaluationData: []
    };
  },
  computed: {
    userInitials() {
      return this.currentUser.name_th ? this.currentUser.name_th.charAt(0) : 'U';
    },
    // คำนวณจำนวนตัวชี้วัดทั้งหมด
    totalIndicatorsCount() {
      return this.evaluationData.reduce((acc, topic) => acc + (topic.indicators ? topic.indicators.length : 0), 0);
    },
    // คำนวณจำนวนตัวชี้วัดที่ส่งงานแล้ว
    completedIndicatorsCount() {
      return this.evaluationData.reduce((acc, topic) => {
        if (!topic.indicators) return acc;
        return acc + topic.indicators.filter(i => i.uploaded_files && i.uploaded_files.length > 0).length;
      }, 0);
    },
    // เปอร์เซ็นต์รวม
    overallProgress() {
      if (this.totalIndicatorsCount === 0) return 0;
      return (this.completedIndicatorsCount / this.totalIndicatorsCount) * 100;
    }
  },
  mounted() {
    this.initPage();
  },
  methods: {
    getTopicProgressText(topic) {
      if (!topic.indicators) return '0/0';
      const completed = topic.indicators.filter(i => i.uploaded_files && i.uploaded_files.length > 0).length;
      return `${completed} / ${topic.indicators.length}`;
    },
    getTopicPercentage(topic) {
      if (!topic.indicators || topic.indicators.length === 0) return 0;
      const completed = topic.indicators.filter(i => i.uploaded_files && i.uploaded_files.length > 0).length;
      return (completed / topic.indicators.length) * 100;
    },
    isTopicComplete(topic) {
      if (!topic.indicators) return false;
      const completed = topic.indicators.filter(i => i.uploaded_files && i.uploaded_files.length > 0).length;
      return completed === topic.indicators.length && topic.indicators.length > 0;
    },
    parseJwt(token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
      } catch (e) {
        return {};
      }
    },

    async initPage() {
      const token = localStorage.getItem('token');
      if (!token) {
        // ใช้ Snackbar หรือ redirect ทันทีดีกว่า alert
        this.$router.push('/login');
        return;
      }
      this.token = token;

      const userStr = localStorage.getItem('user_info');
      if (userStr) {
        try { this.currentUser = JSON.parse(userStr); } catch (e) { }
      }
      if (!this.currentUser.id) {
        const decoded = this.parseJwt(token);
        this.currentUser = {
          id: decoded.id || decoded.sub,
          name_th: decoded.name || decoded.username || 'ผู้ใช้งาน',
          dept_id: decoded.dept_id || '-',
          role: decoded.role || 'user'
        };
      }

      try {
        const periodRes = await axios.get('http://localhost:7000/api/evaluatee/current-period');
        this.currentPeriodId = periodRes.data.id;
        this.currentPeriodName = periodRes.data.period_name;
        
        await this.fetchEvaluationData();

      } catch (error) {
        console.error("Failed to get period:", error);
        this.loading = false;
      }
    },

    async fetchEvaluationData() {
      try {
        const response = await axios.get('http://localhost:7000/api/evaluatee/form-data', {
          headers: { Authorization: `Bearer ${this.token}` },
          params: { period_id: this.currentPeriodId } 
        });
        this.evaluationData = response.data;
        this.processEvaluationData();
      } catch (error) {
        console.error("Fetch Error:", error);
        if (error.response && error.response.status === 401) {
          this.$router.push('/login');
        }
      } finally {
        this.loading = false;
      }
    },

    processEvaluationData() {
      this.evaluationData.forEach(topic => {
        topic.indicators.forEach(ind => {
          ind.tempFile = null;
          // Set default evidence type if only one exists
          if (ind.allowed_evidence && ind.allowed_evidence.length === 1) {
            ind.selectedEvidenceType = ind.allowed_evidence[0].id;
          } else {
            ind.selectedEvidenceType = null;
          }
        });
      });
    },

    async handleFileUpload(indicator) {
      const file = Array.isArray(indicator.tempFile) ? indicator.tempFile[0] : indicator.tempFile;
      
      // ถ้ากด Cancel ใน File Dialog ตัว file จะเป็น null
      if (!file) {
          indicator.tempFile = null;
          return;
      }

      if (!indicator.selectedEvidenceType) {
        alert('กรุณาเลือกประเภทเอกสารก่อน'); // หรือใช้ Snackbar
        indicator.tempFile = null;
        return;
      }

      this.uploadingId = indicator.id;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('period_id', this.currentPeriodId); 
      formData.append('evaluatee_id', this.currentUser.id);
      formData.append('indicator_id', indicator.id);
      formData.append('evidence_type_id', indicator.selectedEvidenceType);

      try {
        const res = await axios.post('http://localhost:7000/api/upload/file', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${this.token}`
          }
        });
        
        if (!indicator.uploaded_files) indicator.uploaded_files = [];
        indicator.uploaded_files.push({
          id: res.data.attachment_id || res.data.id || res.data.insertId,
          file_name: file.name
        });
        indicator.tempFile = null; // Clear input

      } catch (error) {
        alert('อัปโหลดล้มเหลว: ' + (error.response?.data?.message || error.message));
        indicator.tempFile = null;
      } finally {
        this.uploadingId = null;
      }
    },

    async deleteFile(fileId, indicator) {
      if (!confirm('ต้องการลบไฟล์นี้ใช่ไหม?')) return;

      try {
        await axios.delete(`http://localhost:7000/api/upload/file/${fileId}`, {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        indicator.uploaded_files = indicator.uploaded_files.filter(f => f.id !== fileId);
      } catch (error) {
        console.error("Delete Error:", error);
        alert('ลบไฟล์ไม่สำเร็จ');
      }
    }
  }
};

definePageMeta({
  middleware: 'auth'
})
</script>

<style scoped>
/* Border Dashed สำหรับพื้นที่อัปโหลด */
.border-dashed {
  border: 2px dashed #e0e0e0 !important;
  transition: border-color 0.2s;
}

.border-dashed:hover {
  border-color: #7986CB !important; /* Indigo Lighten 2 */
}

/* Border บางๆ สำหรับ Table/Card */
.border-thin {
  border: 1px solid #eeeeee !important;
}

.border-teal {
  border: 1px solid #4DB6AC !important;
}

.gap-2 {
  gap: 8px;
}
</style>