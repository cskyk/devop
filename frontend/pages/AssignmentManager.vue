<template>
  <v-container fluid class="bg-grey-lighten-4 fill-height align-start pa-6">
    
    <v-row class="mb-2">
      <v-col cols="12">
        <div>
          <h1 class="text-h4 font-weight-bold text-indigo-darken-2">
            <v-icon icon="mdi-account-switch" start class="mb-1"></v-icon>
            จับคู่การประเมิน
          </h1>
          <div class="text-subtitle-1 text-medium-emphasis mt-1">
            กำหนดผู้ประเมิน (Evaluator) ให้กับพนักงาน (Evaluatee) ในแต่ละรอบ
          </div>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="4" lg="3">
        <v-card elevation="0" rounded="xl" border class="sticky-card">
          <v-sheet 
            :color="isEditing ? 'amber-lighten-5' : 'indigo-lighten-5'" 
            class="pa-4 d-flex align-center border-b"
          >
            <v-icon 
              :icon="isEditing ? 'mdi-file-edit-outline' : 'mdi-link-plus'" 
              :color="isEditing ? 'amber-darken-3' : 'indigo'" 
              size="large" 
              class="mr-3"
            ></v-icon>
            <div>
              <div class="text-subtitle-1 font-weight-bold" :class="isEditing ? 'text-amber-darken-4' : 'text-indigo-darken-2'">
                {{ isEditing ? 'แก้ไขการจับคู่' : 'สร้างการจับคู่ใหม่' }}
              </div>
              <div class="text-caption text-medium-emphasis">
                {{ isEditing ? 'กำลังแก้ไขข้อมูล ID: ' + editingId : 'ระบุคู่ประเมินที่ต้องการ' }}
              </div>
            </div>
          </v-sheet>

          <v-card-text class="pa-4 d-flex flex-column gap-3">
            
            <v-select
              v-model="selectedPeriod"
              :items="periods"
              item-title="name_th"
              item-value="id"
              label="รอบการประเมิน"
              variant="outlined"
              color="indigo"
              bg-color="white"
              prepend-inner-icon="mdi-calendar-clock"
              density="comfortable"
              hide-details="auto"
              class="mb-2"
              rounded="lg"
            ></v-select>

            <v-divider class="border-dashed my-2"></v-divider>

            <div class="position-relative">
              <label class="text-caption font-weight-bold text-indigo ml-1 mb-1 d-block">
                <v-icon icon="mdi-gavel" size="small" class="mr-1"></v-icon> ผู้ประเมิน (Evaluator)
              </label>
              <v-autocomplete
                v-model="form.evaluator_id"
                :items="evaluators"
                item-title="name_th"
                item-value="id"
                placeholder="ค้นหาชื่อผู้ประเมิน..."
                variant="outlined"
                color="indigo"
                base-color="indigo-lighten-2"
                bg-color="indigo-lighten-5"
                density="comfortable"
                hide-details="auto"
                clearable
              >
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props" lines="two">
                    <template v-slot:subtitle>
                      <v-chip size="x-small" color="indigo" variant="flat" class="mt-1">
                        {{ item.raw.role }}
                      </v-chip>
                    </template>
                  </v-list-item>
                </template>
              </v-autocomplete>
            </div>

            <div class="d-flex justify-center my-n2" style="z-index: 1;">
              <v-icon icon="mdi-arrow-down-bold" color="grey-lighten-1"></v-icon>
            </div>

            <div>
              <label class="text-caption font-weight-bold text-amber-darken-3 ml-1 mb-1 d-block">
                <v-icon icon="mdi-account-school" size="small" class="mr-1"></v-icon> ผู้รับการประเมิน (Evaluatee)
              </label>
              <v-autocomplete
                v-model="form.evaluatee_id"
                :items="evaluatees"
                item-title="name_th"
                item-value="id"
                placeholder="ค้นหาพนักงาน..."
                variant="outlined"
                color="amber-darken-3"
                base-color="amber-lighten-2"
                bg-color="amber-lighten-5"
                density="comfortable"
                hide-details="auto"
                clearable
                :custom-filter="filterByDept"
              >
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props" lines="two">
                    <template v-slot:subtitle>
                      <span class="text-caption text-grey">
                        <v-icon icon="mdi-domain" size="x-small" start></v-icon>
                        {{ item.raw.dept_name || 'ไม่ระบุแผนก' }}
                      </span>
                    </template>
                  </v-list-item>
                </template>
              </v-autocomplete>
            </div>

            <div class="mt-4 d-flex flex-column gap-2">
              <v-btn
                block
                :color="isEditing ? 'amber-darken-3' : 'indigo-darken-1'"
                height="48"
                rounded="pill"
                elevation="2"
                :prepend-icon="isEditing ? 'mdi-content-save-edit' : 'mdi-plus'"
                :disabled="!isValidForm || loading"
                :loading="submitting"
                class="font-weight-bold text-none"
                @click="saveAssignment"
              >
                {{ isEditing ? 'บันทึกการแก้ไข' : 'เพิ่มรายการจับคู่' }}
              </v-btn>

              <v-slide-y-transition>
                <v-btn
                  v-if="isEditing"
                  block
                  variant="text"
                  color="grey-darken-1"
                  height="40"
                  rounded="pill"
                  prepend-icon="mdi-close"
                  @click="cancelEdit"
                >
                  ยกเลิก
                </v-btn>
              </v-slide-y-transition>
            </div>

          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="8" lg="9">
        <v-card elevation="0" rounded="xl" border>
          <v-data-table
            :headers="headers"
            :items="filteredAssignments"
            :search="search"
            density="comfortable"
            hover
            class="header-bold-table"
          >
            <template v-slot:top>
              <div class="d-flex flex-wrap align-center pa-4 pb-2 gap-4">
                <div>
                  <div class="text-h6 font-weight-bold text-grey-darken-3">รายการจับคู่</div>
                  <div class="text-caption text-grey">
                    ทั้งหมด {{ filteredAssignments.length }} คู่ ในรอบปัจจุบัน
                  </div>
                </div>
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="search"
                  prepend-inner-icon="mdi-magnify"
                  placeholder="ค้นหาชื่อ, ตำแหน่ง..."
                  single-line
                  hide-details
                  density="compact"
                  variant="outlined"
                  bg-color="grey-lighten-5"
                  color="indigo"
                  style="max-width: 300px; min-width: 200px;"
                  rounded="pill"
                ></v-text-field>
              </div>
              <v-divider></v-divider>
            </template>

            <template v-slot:item.evaluator="{ item }">
              <div class="d-flex align-center py-2">
                <v-avatar color="indigo-lighten-5" size="40" class="mr-3 border-indigo-thin">
                  <span class="text-indigo-darken-2 font-weight-bold text-body-2">
                    {{ getInitials(item.evaluator_name) }}
                  </span>
                </v-avatar>
                <div>
                  <div class="font-weight-bold text-grey-darken-3">{{ item.evaluator_name }}</div>
                  <v-chip size="x-small" color="indigo" variant="tonal" class="mt-1">
                    {{ item.evaluator_role }}
                  </v-chip>
                </div>
              </div>
            </template>

            <template v-slot:item.arrow>
              <v-icon color="grey-lighten-1" size="small">mdi-arrow-right-thin</v-icon>
            </template>

            <template v-slot:item.evaluatee="{ item }">
              <div class="d-flex align-center py-2">
                <v-avatar color="amber-lighten-5" size="40" class="mr-3 border-amber-thin">
                  <span class="text-amber-darken-3 font-weight-bold text-body-2">
                    {{ getInitials(item.evaluatee_name) }}
                  </span>
                </v-avatar>
                <div>
                  <div class="font-weight-bold text-grey-darken-3">{{ item.evaluatee_name }}</div>
                  <div class="text-caption text-grey d-flex align-center mt-1">
                    <v-icon icon="mdi-domain" size="x-small" class="mr-1"></v-icon>
                    {{ item.evaluatee_dept || '-' }}
                  </div>
                </div>
              </div>
            </template>

            <template v-slot:item.actions="{ item }">
              <div class="d-flex justify-end">
                <v-tooltip text="แก้ไข" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon="mdi-pencil-outline"
                      variant="text"
                      color="amber-darken-3"
                      density="comfortable"
                      @click="editAssignment(item)"
                    ></v-btn>
                  </template>
                </v-tooltip>
                
                <v-tooltip text="ลบรายการ" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon="mdi-trash-can-outline"
                      variant="text"
                      color="red-lighten-1"
                      density="comfortable"
                      @click="confirmDelete(item)"
                    ></v-btn>
                  </template>
                </v-tooltip>
              </div>
            </template>

            <template v-slot:no-data>
              <div class="pa-8 text-center">
                <v-icon icon="mdi-account-off-outline" size="64" color="grey-lighten-2" class="mb-3"></v-icon>
                <div class="text-h6 text-grey-darken-1">ไม่พบข้อมูลการจับคู่</div>
                <div class="text-caption text-grey">กรุณาเลือก "รอบการประเมิน" หรือเพิ่มรายการใหม่</div>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="deleteDialog" max-width="400" persistent>
      <v-card rounded="xl" class="pa-4 text-center">
        <v-icon icon="mdi-alert-circle-outline" color="red-lighten-1" size="64" class="mb-2 mx-auto"></v-icon>
        <v-card-title class="text-h6 font-weight-bold">ยืนยันการลบ?</v-card-title>
        <v-card-text class="text-body-2 text-grey-darken-1">
          คุณต้องการลบการจับคู่นี้ใช่หรือไม่?<br>
          <div class="mt-2 p-2 bg-grey-lighten-4 rounded text-caption">
            {{ itemToDelete?.evaluator_name }} <v-icon icon="mdi-arrow-right" size="x-small"></v-icon> {{ itemToDelete?.evaluatee_name }}
          </div>
        </v-card-text>
        <v-card-actions class="justify-center mt-2">
          <v-btn variant="text" color="grey" rounded="pill" class="px-4" @click="deleteDialog = false">ยกเลิก</v-btn>
          <v-btn variant="flat" color="red-lighten-1" rounded="pill" class="px-6" @click="executeDelete">ลบรายการ</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      location="top right"
      variant="flat"
      rounded="pill"
      transition="slide-x-reverse-transition"
    >
      <div class="d-flex align-center">
        <v-icon :icon="snackbar.icon" start class="mr-2"></v-icon>
        {{ snackbar.message }}
      </div>
    </v-snackbar>

  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue';
import axios from 'axios';

definePageMeta({
  middleware: 'auth'
})

// --- State ---
const periods = ref([]);
const evaluators = ref([]);
const evaluatees = ref([]);
const assignments = ref([]);

const selectedPeriod = ref(null);
const form = ref({ evaluator_id: null, evaluatee_id: null });
const search = ref('');
const loading = ref(false);
const submitting = ref(false);

const isEditing = ref(false);
const editingId = ref(null);

// Dialogs & UI
const deleteDialog = ref(false);
const itemToDelete = ref(null);
const snackbar = reactive({
  show: false,
  message: '',
  color: 'success',
  icon: 'mdi-check-circle'
});

const headers = [
  { title: 'ผู้ประเมิน (Evaluator)', key: 'evaluator', width: '40%' },
  { title: '', key: 'arrow', align: 'center', sortable: false, width: '50px' },
  { title: 'ผู้รับการประเมิน (Evaluatee)', key: 'evaluatee', width: '40%' },
  { title: '', key: 'actions', align: 'end', sortable: false },
];

// --- Computed ---
const filteredAssignments = computed(() => {
  if (!selectedPeriod.value) return [];
  return assignments.value.filter(a => a.period_id === selectedPeriod.value);
});

const isValidForm = computed(() => {
  return selectedPeriod.value && form.value.evaluator_id && form.value.evaluatee_id;
});

// --- Helpers ---
const filterByDept = (itemTitle, queryText, item) => {
  const textName = item.raw.name_th ? item.raw.name_th.toLowerCase() : '';
  const textDept = item.raw.dept_name ? item.raw.dept_name.toLowerCase() : '';
  const searchText = queryText.toLowerCase();
  return textName.includes(searchText) || textDept.includes(searchText);
};

const getInitials = (name) => {
  if (!name) return '?';
  return name.charAt(0);
};

const showNotify = (msg, type = 'success') => {
  snackbar.message = msg;
  snackbar.color = type === 'success' ? 'teal-darken-2' : 'red-darken-2';
  snackbar.icon = type === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle';
  snackbar.show = true;
};

// --- API ---
const getAuthHeader = () => {
  return { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
};

const fetchData = async () => {
  loading.value = true;
  try {
    const header = getAuthHeader();
    const [resPeriods, resEvaluators, resEvaluatees, resAssignments] = await Promise.all([
      axios.get('http://localhost:7000/api/admin/periods', header),
      axios.get('http://localhost:7000/api/admin/users/evaluators', header),
      axios.get('http://localhost:7000/api/admin/users/evaluatees', header),
      axios.get('http://localhost:7000/api/admin/assignments', header)
    ]);

    periods.value = resPeriods.data;
    evaluators.value = resEvaluators.data;
    evaluatees.value = resEvaluatees.data;
    assignments.value = resAssignments.data;

    // Auto-select Active Period
    const activePeriod = periods.value.find(p => p.is_active === 1 || p.active === 1);
    if (activePeriod && !selectedPeriod.value) {
      selectedPeriod.value = activePeriod.id;
    }

  } catch (error) {
    showNotify('ไม่สามารถโหลดข้อมูลได้', 'error');
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// --- CRUD Actions ---
const saveAssignment = async () => {
  if (!isValidForm.value) return;
  submitting.value = true;
  
  try {
    const payload = {
      period_id: selectedPeriod.value,
      evaluator_id: form.value.evaluator_id,
      evaluatee_id: form.value.evaluatee_id
    };

    if (isEditing.value) {
      await axios.put(`http://localhost:7000/api/admin/assignments/${editingId.value}`, payload, getAuthHeader());
      showNotify('แก้ไขข้อมูลเรียบร้อย');
    } else {
      await axios.post('http://localhost:7000/api/admin/assignments', payload, getAuthHeader());
      showNotify('เพิ่มรายการจับคู่สำเร็จ');
    }
    
    // Refresh List
    const res = await axios.get('http://localhost:7000/api/admin/assignments', getAuthHeader());
    assignments.value = res.data;
    cancelEdit(); 

  } catch (error) {
    showNotify(error.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึก', 'error');
  } finally {
    submitting.value = false;
  }
};

const editAssignment = (item) => {
  isEditing.value = true;
  editingId.value = item.id;
  form.value = {
    evaluator_id: item.evaluator_id,
    evaluatee_id: item.evaluatee_id
  };
  selectedPeriod.value = item.period_id;
};

const cancelEdit = () => {
  isEditing.value = false;
  editingId.value = null;
  form.value = { evaluator_id: null, evaluatee_id: null };
};

const confirmDelete = (item) => {
  itemToDelete.value = item;
  deleteDialog.value = true;
};

const executeDelete = async () => {
  if (!itemToDelete.value) return;
  try {
    await axios.delete(`http://localhost:7000/api/admin/assignments/${itemToDelete.value.id}`, getAuthHeader());
    
    // Update local state instead of full reload for smoother UX
    assignments.value = assignments.value.filter(a => a.id !== itemToDelete.value.id);
    
    showNotify('ลบรายการเรียบร้อย');
    if (editingId.value === itemToDelete.value.id) cancelEdit();
    
  } catch (error) {
    showNotify('ไม่สามารถลบรายการได้', 'error');
  } finally {
    deleteDialog.value = false;
    itemToDelete.value = null;
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
/* ทำให้ Header ของตารางดูหนาและชัดเจนขึ้น */
.header-bold-table :deep(thead th) {
  font-weight: 600 !important;
  color: #333 !important;
  font-size: 0.9rem !important;
  background-color: #f9fafb !important;
}

/* Sticky Card Logic: ทำให้ฟอร์มด้านซ้ายตามติดหน้าจอ */
.sticky-card {
  position: sticky;
  top: 24px; /* ปรับระยะห่างจากขอบบนตามต้องการ */
  z-index: 10;
}

/* Custom border styling for avatars */
.border-indigo-thin {
  border: 2px solid #E8EAF6 !important; /* Indigo 50 */
}
.border-amber-thin {
  border: 2px solid #FFF8E1 !important; /* Amber 50 */
}
</style>