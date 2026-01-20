<template>
  <v-container>
    <v-overlay :model-value="loading" class="align-center justify-center">
      <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <v-row class="mb-4">
      <v-col cols="12">
        <div class="d-flex align-center">
          <v-avatar color="primary" class="mr-3">
            <span class="white--text text-h6">{{ userInitials }}</span>
          </v-avatar>
          <div>
            <h2 class="text-h5 font-weight-bold">ส่งผลงานการประเมิน</h2>
            <div class="text-caption grey--text">
              ผู้รับการประเมิน: {{ currentUser.name_th }} | แผนก: {{ currentUser.dept_id || '-' }}
            </div>
          </div>
        </div>
      </v-col>
    </v-row>

    <div v-if="!loading">
      <v-card v-for="(topic, tIndex) in evaluationData" :key="topic.id" class="mb-4" elevation="2">
        <v-card-title class="grey lighten-4 py-3 bg-grey-lighten-4">
          <span class="text-subtitle-1 font-weight-bold primary--text">
            {{ topic.title_th }}
          </span>
        </v-card-title>

        <v-card-text class="pa-0">
          <v-list lines="two">
            <template v-for="(indicator, iIndex) in topic.indicators" :key="indicator.id">
              <v-list-item>
                
                <div class="mb-2">
                  <v-list-item-title class="font-weight-medium mb-1 text-wrap">
                    <v-chip size="x-small" color="primary" label class="mr-2">
                      {{ indicator.code }}
                    </v-chip>
                    {{ indicator.name_th }}
                  </v-list-item-title>
                  
                  <v-list-item-subtitle class="text-wrap">
                    {{ indicator.description }}
                  </v-list-item-subtitle>

                  <div v-if="indicator.uploaded_files && indicator.uploaded_files.length > 0" class="d-flex flex-wrap gap-2 mt-2">
                    <v-chip
                      v-for="file in indicator.uploaded_files"
                      :key="file.id"
                      color="success"
                      variant="tonal"
                      size="small"
                      closable
                      @click:close="deleteFile(file.id)"
                    >
                      <template v-slot:prepend>
                        <v-icon icon="mdi-file-check" start></v-icon>
                      </template>
                      {{ file.file_name }}
                    </v-chip>
                  </div>
                </div>

                <template v-slot:append>
                  <div class="d-flex align-center mt-2" style="width: 100%; min-width: 350px; gap: 10px;">
                    
                    <v-select
                      v-if="indicator.allowed_evidence.length > 1"
                      v-model="indicator.selectedEvidenceType"
                      :items="indicator.allowed_evidence"
                      item-title="name_th"
                      item-value="id"
                      label="เลือกประเภท"
                      density="compact"
                      variant="outlined"
                      hide-details
                      style="width: 160px;"
                    ></v-select>

                    <div v-else class="text-right d-flex flex-column align-end justify-center" style="width: 140px;">
                      <span class="text-caption text-medium-emphasis">สิ่งที่ต้องส่ง:</span>
                      <v-chip size="x-small" variant="tonal" color="grey-darken-2">
                        {{ indicator.allowed_evidence[0]?.name_th || 'เอกสาร' }}
                      </v-chip>
                    </div>

                    <v-file-input
                      v-model="indicator.tempFile"
                      :loading="uploadingId === indicator.id"
                      :disabled="uploadingId === indicator.id"
                      label="เลือกไฟล์..."
                      prepend-icon=""
                      prepend-inner-icon="mdi-paperclip"
                      variant="outlined"
                      density="compact"
                      hide-details
                      single-line
                      @update:modelValue="handleFileUpload(indicator)"
                      style="flex: 1;"
                    ></v-file-input>
                  </div>
                </template>

              </v-list-item>
              <v-divider v-if="iIndex < topic.indicators.length - 1"></v-divider>
            </template>
          </v-list>
        </v-card-text>
      </v-card>
      
      <v-alert v-if="evaluationData.length === 0" type="info" variant="tonal" class="mt-4">
        ไม่พบรายการประเมินสำหรับปีการศึกษานี้
      </v-alert>
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
      token: '',
      loading: false,
      uploadingId: null,
      evaluationData: []
    };
  },
  computed: {
    userInitials() {
      return this.currentUser.name_th ? this.currentUser.name_th.charAt(0) : 'U';
    }
  },
  mounted() {
    this.initPage();
  },
  methods: {
    // Helper: แกะข้อมูลจาก Token (JWT Decode) ใช้เมื่อไม่มีข้อมูลใน LocalStorage
    parseJwt(token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
      } catch (e) {
        console.error("Invalid Token:", e);
        return {};
      }
    },

    async initPage() {
      const token = localStorage.getItem('token');
      // ไม่เช็ค user_info แล้ว เช็คแค่ Token พอ
      if (!token) {
        alert('กรุณาเข้าสู่ระบบก่อน');
        this.$router.push('/login');
        return;
      }

      this.token = token;

      // พยายามดึงข้อมูล User จาก LocalStorage ก่อน
      const userStr = localStorage.getItem('user_info');
      if (userStr) {
        try {
            this.currentUser = JSON.parse(userStr);
        } catch (e) {
            console.warn("User info corrupted, decoding token instead.");
        }
      } 
      
      // ถ้าไม่มีข้อมูล User หรือ Parse พัง ให้แกะจาก Token เอา
      if (!this.currentUser.id) {
        console.log("Decoding user info from Token...");
        const decoded = this.parseJwt(token);
        
        // ปรับ Mapping ตรงนี้ให้ตรงกับไส้ใน Token ของคุณ
        this.currentUser = {
          id: decoded.id || decoded.sub, 
          name_th: decoded.name || decoded.username || 'ผู้ใช้งาน',
          dept_id: decoded.dept_id || '-',
          role: decoded.role || 'user'
        };
      }

      // เริ่มโหลดข้อมูล
      await this.fetchEvaluationData();
    },

    async fetchEvaluationData() {
      this.loading = true;
      try {
        // แก้ URL ให้ตรงกับ Backend Router (evaluatee)
        const response = await axios.get('http://localhost:7000/api/evaluatee/form-data', {
          headers: { Authorization: `Bearer ${this.token}` },
          params: { period_id: 1 } 
        });

        this.evaluationData = response.data;
        this.processEvaluationData();

      } catch (error) {
        console.error("Fetch Error:", error);
        if (error.response && error.response.status === 401) {
            alert('Session หมดอายุ กรุณา Login ใหม่');
            localStorage.removeItem('token'); // ลบ Token ที่เสียออก
            this.$router.push('/login');
        }
      } finally {
        this.loading = false; // ปิด Loading เสมอ ไม่ว่าจะ Error หรือไม่
      }
    },

    processEvaluationData() {
      this.evaluationData.forEach(topic => {
        topic.indicators.forEach(ind => {
          ind.tempFile = null;
          // Auto Select ถ้ามีช้อยส์เดียว
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
      if (!file) return;

      if (!indicator.selectedEvidenceType) {
        alert('กรุณาเลือกประเภทเอกสารก่อน');
        indicator.tempFile = null;
        return;
      }

      this.uploadingId = indicator.id;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('period_id', 1);
      formData.append('evaluatee_id', this.currentUser.id);
      formData.append('indicator_id', indicator.id);
      formData.append('evidence_type_id', indicator.selectedEvidenceType);

      try {
        // ยิง Upload ไปที่ Evaluatee Router
        const res = await axios.post('http://localhost:7000/api/upload/file', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${this.token}`
          }
        });

        // Update UI: เพิ่มไฟล์เข้า List
        if (!indicator.uploaded_files) indicator.uploaded_files = [];
        indicator.uploaded_files.push({
          id: res.data.attachment_id || Date.now(),
          file_name: file.name
        });

        indicator.tempFile = null;

      } catch (error) {
        console.error(error);
        alert('อัปโหลดล้มเหลว: ' + (error.response?.data?.message || error.message));
        indicator.tempFile = null;
      } finally {
        this.uploadingId = null;
      }
    },

    async deleteFile(fileId) {
       if(!confirm('ต้องการลบไฟล์นี้ใช่ไหม?')) return;
       // เพิ่ม Code ลบไฟล์ตรงนี้ถ้า Backend พร้อม
       console.log('Mock Delete ID:', fileId);
       // ถ้าจะลบออกจากหน้าจอเล่นๆ
       // logic ลบจาก array evaluationData...
    }
  }
};
</script>