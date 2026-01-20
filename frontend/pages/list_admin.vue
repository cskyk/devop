<template>
  <v-container fluid class="bg-grey-lighten-5 fill-height align-start pa-6">
    <v-row justify="center">
      <v-col cols="12">
        
        <div class="mb-6 d-flex align-center justify-space-between">
          <div>
            <h1 class="text-h4 font-weight-black text-red-darken-4">
              <v-icon icon="mdi-shield-account" class="mr-2"></v-icon>
              User Management
            </h1>
            <p class="text-body-1 text-grey-darken-1 ml-1">จัดการรายชื่อผู้ใช้งานและสิทธิ์การเข้าถึง</p>
          </div>
          <v-btn 
            color="red-darken-3" 
            prepend-icon="mdi-plus" 
            size="large" 
            class="text-none elevation-4 rounded-lg font-weight-bold"
            @click="add"
          >
            Add User
          </v-btn>
        </div>

        <v-card class="rounded-xl elevation-3 border-thin">
          <v-data-table 
            :headers="headers" 
            :items="users" 
            :loading="loading" 
            hover 
            density="comfortable"
            class="user-table"
          >
            <template v-slot:loading>
              <v-skeleton-loader type="table-row@5" color="red-lighten-5"></v-skeleton-loader>
            </template>

            <template v-slot:item.email="{ item }">
              <div class="d-flex align-center py-2">
                <v-avatar color="red-lighten-5" size="42" class="mr-3 text-red-darken-4 font-weight-bold border-red">
                  {{ item.name_th ? item.name_th.charAt(0) : 'U' }}
                </v-avatar>
                <div>
                  <div class="font-weight-bold text-body-2 text-grey-darken-3">{{ item.name_th }}</div>
                  <div class="text-caption text-grey">{{ item.email }}</div>
                </div>
              </div>
            </template>

            <template v-slot:item.role="{ value }">
              <v-chip 
                :color="getRoleColor(value)" 
                size="small" 
                variant="flat" 
                class="font-weight-bold text-capitalize"
              >
                {{ value }}
              </v-chip>
            </template>

            <template v-slot:item.department_id="{ value }">
              <div class="text-body-2">
                <v-icon icon="mdi-domain" size="x-small" color="red-lighten-2" class="mr-1"></v-icon>
                {{ getDepartmentName(value) }}
              </div>
            </template>

             <template v-slot:item.org_group_id="{ value }">
              <span class="text-caption text-grey-darken-1">
                {{ getOrgGroupName(value) }}
              </span>
            </template>

            <template v-slot:item.status="{ value }">
              <v-chip 
                :color="value === 'active' ? 'green-darken-1' : 'grey'" 
                :variant="value === 'active' ? 'tonal' : 'outlined'"
                size="x-small" 
                class="font-weight-bold text-uppercase"
                prepend-icon="mdi-circle-medium"
              >
                {{ value }}
              </v-chip>
            </template>

            <template v-slot:item.created_at="{ value }">
              <span class="text-caption text-grey">{{ new Date(value).toLocaleDateString('th-TH') }}</span>
            </template>

            <template v-slot:item.actions="{ item }">
              <div class="d-flex justify-end">
                <v-btn icon="mdi-pencil" size="small" color="grey-darken-3" variant="text" @click="edit(item)" class="mr-1"></v-btn>
                <v-btn icon="mdi-trash-can" size="small" color="red-accent-4" variant="text" @click="remove(item.id)"></v-btn>
              </div>
            </template>

            <template v-slot:no-data>
              <div class="pa-8 text-center">
                <v-icon icon="mdi-file-remove-outline" size="60" color="red-lighten-3" class="mb-2"></v-icon>
                <div class="text-h6 text-grey-darken-1 mb-2">ไม่พบข้อมูลในระบบ</div>
                <v-btn prepend-icon="mdi-refresh" rounded="pill" color="red-darken-2" variant="outlined" @click="fetchData">
                  Reload Data
                </v-btn>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="600" persistent transition="dialog-bottom-transition">
      <v-card rounded="xl" class="overflow-hidden">
        <div class="dialog-header px-6 py-4 d-flex align-center justify-space-between">
          <div class="d-flex align-center text-white">
            <v-avatar color="white" size="40" class="mr-3">
              <v-icon color="red-darken-3" size="24">
                {{ isEditing ? 'mdi-pencil' : 'mdi-account-plus' }}
              </v-icon>
            </v-avatar>
            <div>
              <div class="text-h6 font-weight-bold">{{ isEditing ? 'Edit User' : 'New User' }}</div>
              <div class="text-caption opacity-90">{{ isEditing ? 'แก้ไขข้อมูลสมาชิก' : 'เพิ่มสมาชิกใหม่' }}</div>
            </div>
          </div>
          <v-btn icon="mdi-close" variant="text" color="white" density="compact" @click="dialog = false"></v-btn>
        </div>

        <v-card-text class="pa-6 bg-white">
          <v-form ref="form">
            <v-row>
              <v-col cols="12"><div class="text-subtitle-2 text-red-darken-4 mb-1 border-bottom-red">Account Credentials</div></v-col>
              
              <v-col cols="12" sm="6">
                <v-text-field 
                  v-model="formModel.email" 
                  label="Email Address" 
                  prepend-inner-icon="mdi-email-outline"
                  variant="outlined" 
                  color="red-darken-2"
                  density="comfortable"
                  hide-details="auto"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12" sm="6">
                <v-text-field 
                  v-model="formModel.password_hash" 
                  label="Password" 
                  :type="visible ? 'text' : 'password'"
                  :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" 
                  @click:append-inner="visible = !visible"
                  prepend-inner-icon="mdi-lock-outline" 
                  variant="outlined" 
                  color="red-darken-2"
                  density="comfortable"
                  :placeholder="isEditing ? 'เว้นว่างไว้หากไม่เปลี่ยน' : ''"
                  hide-details="auto"
                ></v-text-field>
              </v-col>

              <v-col cols="12" class="mt-2"><div class="text-subtitle-2 text-red-darken-4 mb-1 border-bottom-red">Personal Information</div></v-col>

              <v-col cols="12">
                <v-text-field 
                  v-model="formModel.name_th" 
                  label="Full Name (Thai)" 
                  prepend-inner-icon="mdi-account-details-outline"
                  variant="outlined" 
                  color="red-darken-2"
                  density="comfortable"
                  hide-details="auto"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-select 
                  v-model="formModel.department_id" 
                  label="Department" 
                  :items="departmentList"
                  item-title="name_th" 
                  item-value="id" 
                  prepend-inner-icon="mdi-domain" 
                  variant="outlined" 
                  color="red-darken-2"
                  density="comfortable" 
                  clearable
                  hide-details="auto"
                ></v-select>
              </v-col>

              <v-col cols="12" sm="6">
                <v-select 
                  v-model="formModel.org_group_id" 
                  label="Org Group" 
                  :items="orgGroupList"
                  item-title="name_th" 
                  item-value="id" 
                  prepend-inner-icon="mdi-office-building-cog" 
                  variant="outlined"
                  color="red-darken-2"
                  density="comfortable" 
                  clearable
                  hide-details="auto"
                ></v-select>
              </v-col>

              <v-col cols="12" class="mt-2"><div class="text-subtitle-2 text-red-darken-4 mb-1 border-bottom-red">Permissions & Status</div></v-col>

              <v-col cols="12" sm="6">
                <v-select 
                  v-model="formModel.role" 
                  label="Role" 
                  :items="['admin', 'evaluatee', 'evaluator']"
                  prepend-inner-icon="mdi-badge-account-outline" 
                  variant="outlined" 
                  color="red-darken-2"
                  density="comfortable"
                  hide-details="auto"
                ></v-select>
              </v-col>

              <v-col cols="12" sm="6">
                <v-select 
                  v-model="formModel.status" 
                  label="Status" 
                  :items="['active', 'disabled']"
                  prepend-inner-icon="mdi-toggle-switch-outline" 
                  variant="outlined" 
                  color="red-darken-2"
                  density="comfortable"
                  hide-details="auto"
                >
                  <template v-slot:selection="{ item }">
                    <span :class="item.value === 'active' ? 'text-green-darken-2' : 'text-grey'">
                      {{ item.title }}
                    </span>
                  </template>
                </v-select>
              </v-col>

            </v-row>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-4 bg-grey-lighten-5">
          <v-btn text="Cancel" variant="text" color="grey-darken-1" size="large" @click="dialog = false"></v-btn>
          <v-spacer></v-spacer>
          <v-btn 
            :text="isEditing ? 'Update Changes' : 'Create User'"
            color="red-darken-3" 
            variant="elevated" 
            rounded="lg" 
            class="px-6 font-weight-bold"
            size="large"
            @click="save"
            elevation="2"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

definePageMeta({ middleware: 'auth' })

const router = useRouter()
const users = ref([])
const loading = ref(false)
const dialog = ref(false)
const visible = ref(false)
const departmentList = ref([])
const orgGroupList = ref([])

// Headers
const headers = [
  { title: 'USER INFORMATION', key: 'email', align: 'start' },
  { title: 'ROLE', key: 'role', align: 'start' },
  { title: 'DEPARTMENT', key: 'department_id', align: 'start' },
  { title: 'ORG GROUP', key: 'org_group_id', align: 'start' },
  { title: 'STATUS', key: 'status', align: 'center', width: '100' },
  { title: 'CREATED', key: 'created_at', align: 'end', width: '120' },
  { title: '', key: 'actions', align: 'end', sortable: false, width: '100' },
]

const formModel = ref({
  id: null, email: '', name_th: '', password_hash: '',
  status: 'active', role: 'evaluatee',
  department_id: null, org_group_id: null
})

const isEditing = computed(() => !!formModel.value.id)

function resetForm() {
  formModel.value = {
    id: null, email: '', name_th: '', password_hash: '',
    status: 'active', role: 'evaluatee',
    department_id: null, org_group_id: null
  }
}

// --- Helper Functions ---

const getRoleColor = (role) => {
  switch (role) {
    case 'admin': return 'red-darken-4'; // Admin สีแดงเข้มสุด
    case 'evaluator': return 'orange-darken-4';
    case 'evaluatee': return 'blue-grey-lighten-2';
    default: return 'grey';
  }
}

const getDepartmentName = (id) => {
  if (!id || departmentList.value.length === 0) return '-';
  const dept = departmentList.value.find(d => d.id === id);
  return dept ? dept.name_th : '-';
}

const getOrgGroupName = (id) => {
  if (!id || orgGroupList.value.length === 0) return '-';
  const org = orgGroupList.value.find(o => o.id === id);
  return org ? org.name_th : '-';
}

// --- Core Logic (เหมือนเดิม) ---
async function checkAuth() {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user_info');
  if (!token) { router.push('/login'); return false; }
  if (userStr) {
    const user = JSON.parse(userStr);
    if (user.role !== 'admin') { router.push('/'); return false; }
  }
  return true;
}

const fetchData = async () => {
  loading.value = true;
  try {
    const token = localStorage.getItem('token');
    const { data } = await axios.get("http://localhost:7000/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    users.value = data;
  } catch (error) { console.error("Error:", error); } finally { loading.value = false; }
}

const fetchMasterData = async () => {
  try {
    const token = localStorage.getItem('token');
    const [deptRes, orgRes] = await Promise.all([
      axios.get("http://localhost:7000/api/admin/departments", { headers: { Authorization: `Bearer ${token}` } }),
      axios.get("http://localhost:7000/api/admin/org-groups", { headers: { Authorization: `Bearer ${token}` } })
    ]);
    departmentList.value = deptRes.data;
    orgGroupList.value = orgRes.data;
  } catch (error) { console.error("Error master data:", error); }
}

onMounted(() => {
  checkAuth().then(isAuth => {
    if (isAuth) {
      fetchData();
      fetchMasterData();
    }
  });
})

function add() { resetForm(); dialog.value = true; }
function edit(item) { formModel.value = { ...item, password_hash: '' }; dialog.value = true; }

async function remove(id) {
  if (!confirm("Confirm deletion?")) return;
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:7000/api/admin/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    await fetchData();
  } catch (error) { alert('Failed: ' + error.message); }
}

async function save() {
  try {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const baseUrl = "http://localhost:7000/api/admin/users";
    
    if (isEditing.value) {
      await axios.put(`${baseUrl}/${formModel.value.id}`, formModel.value, { headers });
    } else {
      await axios.post(baseUrl, formModel.value, { headers });
    }
    dialog.value = false;
    await fetchData();
  } catch (error) { alert('Failed: ' + (error.response?.data?.message || error.message)); }
}
</script>

<style scoped>
/* Gradient สีแดงสำหรับ Dialog Header */
.dialog-header {
  background: linear-gradient(135deg, #B71C1C 0%, #D32F2F 50%, #EF5350 100%);
}

/* เส้นขอบ Avatar */
.border-red {
  border: 1px solid #FFCDD2;
}

/* เส้นใต้หัวข้อในฟอร์ม */
.border-bottom-red {
  border-bottom: 2px solid #FFCDD2;
  padding-bottom: 4px;
}

/* ปรับหัวตารางให้เป็นสีแดงเข้ม */
.user-table :deep(th) {
  font-size: 0.8rem !important;
  font-weight: 800 !important;
  color: #B71C1C !important; /* Red Darken 4 */
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.user-table :deep(td) {
  font-size: 0.875rem !important;
  color: #212121;
}
</style>