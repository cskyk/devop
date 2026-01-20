<template>
  <v-container fluid class="bg-grey-lighten-5 fill-height align-start pa-6">
    <v-row justify="center">
      <v-col cols="12" xl="10">
        
        <v-row class="mb-4 align-center">
          <v-col cols="12" md="8">
            <div class="d-flex align-center">
              <v-avatar color="teal-lighten-5" size="56" class="mr-4 elevation-1">
                <v-icon icon="mdi-calendar-sync" color="teal-darken-1" size="32"></v-icon>
              </v-avatar>
              <div>
                <h1 class="text-h4 font-weight-bold text-blue-grey-darken-3">
                  รอบการประเมิน
                </h1>
                <div class="text-subtitle-1 text-grey-darken-1 mt-1 font-weight-medium">
                  Evaluation Periods Management
                </div>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="4" class="text-md-right">
            <v-btn
              color="teal-darken-1"
              prepend-icon="mdi-plus-circle"
              elevation="4"
              height="48"
              rounded="xl"
              class="text-capitalize px-6 font-weight-bold btn-gradient"
              @click="openDialog()"
            >
              เปิดรอบประเมินใหม่
            </v-btn>
          </v-col>
        </v-row>

        <v-card elevation="0" rounded="xl" class="border-thin overflow-hidden shadow-card">
          <v-data-table
            :headers="headers"
            :items="periods"
            :loading="loading"
            hover
            class="modern-table py-2"
            item-value="id"
          >
            <template v-slot:loading>
              <v-skeleton-loader type="table-row@5" class="px-4"></v-skeleton-loader>
            </template>

            <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
              <tr class="bg-grey-lighten-4">
                <template v-for="column in columns" :key="column.key">
                  <th class="text-uppercase font-weight-bold text-grey-darken-2 py-4" :style="`width: ${column.width}; text-align: ${column.align}`">
                    {{ column.title }}
                  </th>
                </template>
              </tr>
            </template>

            <template v-slot:item.code="{ item }">
              <div class="d-flex align-center">
                <v-avatar color="teal-lighten-5" size="32" class="mr-3">
                  <span class="text-teal-darken-2 font-weight-bold text-caption">{{ item.code.split('/')[0] }}</span>
                </v-avatar>
                <div>
                  <div class="font-weight-bold text-body-2 text-blue-grey-darken-3">{{ item.code }}</div>
                  <div class="text-caption text-grey">Code</div>
                </div>
              </div>
            </template>

            <template v-slot:item.period_date="{ item }">
              <div class="py-3">
                <div class="d-flex align-center mb-1">
                  <v-icon icon="mdi-play-circle-outline" size="small" color="success" class="mr-2"></v-icon>
                  <span class="text-caption font-weight-bold text-grey-darken-2" style="width: 60px;">START</span>
                  <span class="text-body-2 font-weight-medium ml-2">{{ formatDate(item.start_date) }}</span>
                </div>
                <div class="d-flex align-center">
                  <v-icon icon="mdi-stop-circle-outline" size="small" color="error" class="mr-2"></v-icon>
                  <span class="text-caption font-weight-bold text-grey-darken-2" style="width: 60px;">END</span>
                  <span class="text-body-2 font-weight-medium ml-2">{{ formatDate(item.end_date) }}</span>
                </div>
              </div>
            </template>

            <template v-slot:item.is_active="{ item }">
              <v-switch
                v-model="item.is_active"
                :model-value="item.is_active === 1 || item.is_active === true"
                color="teal-accent-4"
                hide-details
                density="compact"
                inset
                class="d-inline-flex"
                :loading="item.toggling"
                @update:model-value="toggleStatus(item)"
              >
                <template v-slot:thumb="{ model }">
                   <v-icon size="x-small" :color="model ? 'teal' : 'grey'">
                    {{ model ? 'mdi-check' : 'mdi-close' }}
                   </v-icon>
                </template>
              </v-switch>
            </template>

            <template v-slot:item.actions="{ item }">
              <div class="d-flex justify-end">
                <v-btn 
                  icon="mdi-pencil" 
                  variant="text" 
                  color="blue-grey-lighten-2" 
                  density="comfortable"
                  class="action-btn mr-1"
                  @click="openDialog(item)"
                ></v-btn>
                <v-btn 
                  icon="mdi-trash-can" 
                  variant="text" 
                  color="red-lighten-3" 
                  density="comfortable"
                  class="action-btn-delete"
                  @click="confirmDelete(item)"
                ></v-btn>
              </div>
            </template>

            <template v-slot:no-data>
              <div class="pa-10 text-center">
                <v-img src="https://cdn-icons-png.flaticon.com/512/7486/7486747.png" width="120" class="mx-auto mb-4 opacity-50"></v-img>
                <div class="text-h6 text-grey-darken-1 font-weight-light">ยังไม่มีข้อมูลรอบการประเมิน</div>
                <v-btn variant="text" color="teal" class="mt-2" @click="openDialog()">+ สร้างรายการแรก</v-btn>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="550px" persistent transition="dialog-bottom-transition">
      <v-card rounded="xl" elevation="24">
        <div class="dialog-header-gradient pa-6">
          <div class="text-overline text-white opacity-80 mb-1">EVALUATION PERIOD</div>
          <div class="text-h5 font-weight-bold text-white">
             <v-icon icon="mdi-file-document-edit-outline" start></v-icon>
             {{ isEditing ? 'แก้ไขข้อมูล' : 'สร้างรอบใหม่' }}
          </div>
        </div>
        
        <v-card-text class="pa-6 pt-8">
          <v-form ref="form" v-model="valid" @submit.prevent="savePeriod">
            <v-row dense>
              <v-col cols="12" sm="6">
                <div class="text-caption font-weight-bold text-grey-darken-1 mb-1 ml-1">รหัสรอบ (Code)</div>
                <v-text-field
                  v-model="formModel.code"
                  placeholder="เช่น 1/2568"
                  variant="outlined"
                  density="comfortable"
                  color="teal"
                  bg-color="grey-lighten-5"
                  class="rounded-lg-input"
                  :rules="[v => !!v || 'Required']"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <div class="text-caption font-weight-bold text-grey-darken-1 mb-1 ml-1">ปีงบประมาณ (พ.ศ.)</div>
                <v-text-field
                  v-model="formModel.buddhist_year"
                  type="number"
                  variant="outlined"
                  density="comfortable"
                  color="teal"
                  bg-color="grey-lighten-5"
                  class="rounded-lg-input"
                  :rules="[v => !!v || 'Required']"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <div class="text-caption font-weight-bold text-grey-darken-1 mb-1 ml-1">ชื่อรอบการประเมิน</div>
                <v-text-field
                  v-model="formModel.name_th"
                  placeholder="ระบุชื่อเต็มของรอบการประเมิน"
                  variant="outlined"
                  density="comfortable"
                  color="teal"
                  bg-color="grey-lighten-5"
                  class="rounded-lg-input"
                  :rules="[v => !!v || 'Required']"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-divider class="my-3"></v-divider>
                <div class="d-flex align-center mb-3">
                    <v-icon icon="mdi-calendar-range" color="teal" class="mr-2"></v-icon>
                    <span class="text-subtitle-2 font-weight-bold">ช่วงเวลาดำเนินการ</span>
                </div>
                <v-row dense>
                  <v-col cols="6">
                    <v-text-field
                      v-model="formModel.start_date"
                      type="date"
                      label="วันเริ่มต้น"
                      variant="outlined"
                      density="comfortable"
                      color="teal"
                      hide-details="auto"
                      :rules="[v => !!v || 'Required']"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="formModel.end_date"
                      type="date"
                      label="วันสิ้นสุด"
                      variant="outlined"
                      density="comfortable"
                      color="teal"
                      hide-details="auto"
                      :rules="[v => !!v || 'Required']"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="12" class="mt-4">
                <v-card 
                    variant="flat" 
                    :color="formModel.is_active ? 'teal-lighten-5' : 'grey-lighten-4'" 
                    class="pa-4 rounded-lg transition-swing border-dashed"
                >
                  <v-checkbox
                    v-model="formModel.is_active"
                    color="teal-darken-2"
                    hide-details
                    density="compact"
                    class="mt-0"
                  >
                    <template v-slot:label>
                      <div :class="formModel.is_active ? 'text-teal-darken-3' : 'text-grey-darken-1'">
                        <div class="font-weight-bold text-body-2">Active Status</div>
                        <div class="text-caption">เปิดใช้งานรอบนี้ทันทีที่บันทึก</div>
                      </div>
                    </template>
                  </v-checkbox>
                </v-card>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-6 pt-0">
          <v-btn 
            variant="text" 
            color="grey-darken-1" 
            height="48"
            rounded="lg"
            class="px-4"
            @click="dialog = false"
          >
            ยกเลิก
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn 
            variant="flat" 
            color="teal-darken-1" 
            height="48"
            class="px-8 btn-gradient"
            rounded="lg"
            :loading="loading"
            @click="savePeriod"
          >
            {{ isEditing ? 'บันทึกการเปลี่ยนแปลง' : 'ยืนยันสร้าง' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="400" persistent>
      <v-card rounded="xl" class="pa-6 text-center">
        <v-avatar color="red-lighten-5" size="80" class="mb-4">
            <v-icon icon="mdi-delete-outline" color="red-lighten-1" size="40"></v-icon>
        </v-avatar>
        <h3 class="text-h6 font-weight-bold text-blue-grey-darken-3">ต้องการลบใช่หรือไม่?</h3>
        <p class="text-body-2 text-grey mb-6 mt-2">
            ข้อมูลรอบ <b>{{ itemToDelete?.code }}</b> จะหายไปถาวร <br>ไม่สามารถกู้คืนได้
        </p>
        <div class="d-flex justify-center gap-2">
          <v-btn variant="text" color="grey" rounded="pill" class="px-6" height="44" @click="deleteDialog = false">ยกเลิก</v-btn>
          <v-btn variant="flat" color="red-accent-2" rounded="pill" class="px-6" height="44" elevation="4" @click="executeDelete">ยืนยันลบ</v-btn>
        </div>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      location="bottom right"
      variant="flat"
      rounded="lg"
      content-class="elevation-4"
      min-width="300"
    >
      <div class="d-flex align-center">
        <v-icon :icon="snackbar.icon" start size="small" class="mr-2"></v-icon>
        <span class="font-weight-medium">{{ snackbar.message }}</span>
      </div>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue';
import axios from 'axios';

// --- State Variables ---
const periods = ref([]);
const loading = ref(false);
const dialog = ref(false);
const valid = ref(false);
const deleteDialog = ref(false);
const itemToDelete = ref(null);

// Snackbar State
const snackbar = reactive({
  show: false,
  message: '',
  color: 'success',
  icon: 'mdi-check-circle'
});

const formModel = ref(initialFormState());

function initialFormState() {
  return {
    id: null,
    code: '',
    name_th: '',
    buddhist_year: new Date().getFullYear() + 543,
    start_date: '',
    end_date: '',
    is_active: false
  };
}

// --- Table Configuration ---
const headers = [
  { title: 'รหัสรอบ (Code)', key: 'code', align: 'start', width: '20%' },
  { title: 'ชื่อรอบการประเมิน', key: 'name_th', minWidth: '25%' },
  { title: 'ช่วงเวลา (Timeline)', key: 'period_date', sortable: false, minWidth: '30%' },
  { title: 'สถานะ', key: 'is_active', align: 'center', width: '15%' },
  { title: 'จัดการ', key: 'actions', align: 'end', sortable: false, width: '10%' },
];

const isEditing = computed(() => !!formModel.value.id);

// --- Helper: Notify ---
const showNotify = (msg, type = 'success') => {
  snackbar.message = msg;
  snackbar.color = type === 'success' ? 'teal-darken-3' : 'red-darken-2';
  snackbar.icon = type === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle';
  snackbar.show = true;
};

// --- API Methods (Logic เดิม) ---
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

const fetchPeriods = async () => {
  loading.value = true;
  try {
    const res = await axios.get('http://localhost:7000/api/admin/periods', getAuthHeader());
    periods.value = res.data.map(p => ({ ...p, toggling: false })); 
  } catch (error) {
    showNotify('ไม่สามารถดึงข้อมูลได้', 'error');
  } finally {
    loading.value = false;
  }
};

const savePeriod = async () => {
  if (!formModel.value.code || !formModel.value.name_th) return;

  loading.value = true;
  try {
    const payload = { ...formModel.value };
    payload.is_active = payload.is_active ? 1 : 0; 

    if (isEditing.value) {
      await axios.put(`http://localhost:7000/api/admin/periods/${payload.id}`, payload, getAuthHeader());
      showNotify('แก้ไขข้อมูลสำเร็จ');
    } else {
      await axios.post('http://localhost:7000/api/admin/periods', payload, getAuthHeader());
      showNotify('สร้างรอบการประเมินสำเร็จ');
    }
    dialog.value = false;
    fetchPeriods();
  } catch (error) {
    showNotify(error.response?.data?.message || 'บันทึกไม่สำเร็จ', 'error');
  } finally {
    loading.value = false;
  }
};

const confirmDelete = (item) => {
  itemToDelete.value = item;
  deleteDialog.value = true;
};

const executeDelete = async () => {
  if (!itemToDelete.value) return;
  try {
    await axios.delete(`http://localhost:7000/api/admin/periods/${itemToDelete.value.id}`, getAuthHeader());
    showNotify('ลบข้อมูลเรียบร้อยแล้ว');
    fetchPeriods();
  } catch (error) {
    showNotify('ลบไม่สำเร็จ: ' + error.message, 'error');
  } finally {
    deleteDialog.value = false;
    itemToDelete.value = null;
  }
};

const toggleStatus = async (item) => {
  item.toggling = true;
  try {
    await axios.put(`http://localhost:7000/api/admin/periods/${item.id}/status`, { 
      is_active: item.is_active 
    }, getAuthHeader());
    
    showNotify('อัปเดตสถานะสำเร็จ');
    fetchPeriods(); 
  } catch (error) {
    showNotify('เปลี่ยนสถานะไม่สำเร็จ', 'error');
    item.is_active = !item.is_active; 
  } finally {
    item.toggling = false;
  }
};

// --- Helpers ---
const openDialog = (item = null) => {
  if (item) {
    formModel.value = { 
      ...item,
      start_date: item.start_date ? item.start_date.split('T')[0] : '',
      end_date: item.end_date ? item.end_date.split('T')[0] : '',
      is_active: item.is_active === 1 || item.is_active === true
    };
  } else {
    formModel.value = initialFormState();
  }
  dialog.value = true;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
};

onMounted(() => {
  fetchPeriods();
});

definePageMeta({
  middleware: 'auth'
});
</script>

<style scoped>
/* Gradient Backgrounds */
.btn-gradient {
  background: linear-gradient(135deg, #00897B 0%, #00695C 100%) !important;
  color: white !important;
}

.dialog-header-gradient {
  background: linear-gradient(135deg, #26A69A 0%, #00695C 100%);
}

/* Shadows */
.shadow-card {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05) !important;
}

/* Modern Inputs */
.rounded-lg-input :deep(.v-field__outline__start) {
  border-radius: 8px 0 0 8px !important;
}
.rounded-lg-input :deep(.v-field__outline__end) {
  border-radius: 0 8px 8px 0 !important;
}

/* Table Actions */
.action-btn:hover {
  background-color: #ECEFF1;
  color: #00695C !important;
}
.action-btn-delete:hover {
  background-color: #FFEBEE;
  color: #D32F2F !important;
}

.modern-table :deep(tbody tr:hover) {
    background-color: #F9FAFB !important;
    transition: background-color 0.2s ease;
}

.border-dashed {
    border-style: dashed !important;
}

.border-thin {
    border: 1px solid rgba(0,0,0,0.05);
}
</style>