<template>
  <v-container fluid class="bg-grey-lighten-4 h-screen">
    
    <v-card class="mb-4 elevation-2" rounded="lg">
       <div class="d-flex align-center pa-4 bg-indigo-darken-2">
          <v-avatar color="white" class="mr-3" size="48">
             <v-icon color="indigo-darken-2" icon="mdi-shape-plus" size="large"></v-icon>
          </v-avatar>
          <div>
            <div class="text-h6 font-weight-bold">ระบบจัดการหมวดหมู่วิชาชีพ</div>
            <div class="text-caption text-indigo-lighten-4">Vocational Categories Management</div>
          </div>
          <v-spacer></v-spacer>
          <v-btn color="error" variant="flat" prepend-icon="mdi-logout" @click="logout" size="small" class="text-capitalize">
            ออกจากระบบ
          </v-btn>
       </div>
    </v-card>

    <v-card elevation="2" rounded="lg">
      <v-data-table
        :headers="headers"
        :items="categories"
        :search="search"
        :loading="loading"
        hover
        class="rounded-lg"
      >
        <template v-slot:top>
          <v-toolbar flat color="white" class="px-2 pt-2">
             <v-text-field
                v-model="search"
                density="compact"
                variant="outlined"
                label="ค้นหาชื่อ หรือ รหัส..."
                prepend-inner-icon="mdi-magnify"
                hide-details
                single-line
                style="max-width: 350px;"
                class="mr-4 ml-2"
                rounded="lg"
                color="indigo"
                bg-color="grey-lighten-5"
              ></v-text-field>
              
              <v-spacer></v-spacer>
              
              <v-btn
                color="indigo-darken-1"
                variant="flat"
                prepend-icon="mdi-plus-circle"
                rounded="lg"
                height="40"
                class="mr-2 text-capitalize"
                @click="add"
              >
                เพิ่มหมวดหมู่ใหม่
              </v-btn>
          </v-toolbar>
        </template>

        <template v-slot:item.code="{ value }">
           <v-chip color="indigo" variant="tonal" label size="small" class="font-weight-bold">
             <v-icon start icon="mdi-barcode" size="x-small"></v-icon>
             {{ value }}
           </v-chip>
        </template>
        
        <template v-slot:item.name_th="{ value }">
           <span class="text-body-2 font-weight-medium text-grey-darken-3">{{ value }}</span>
        </template>

        <template v-slot:item.actions="{ item }">
          <div class="d-flex justify-end">
             <v-tooltip text="แก้ไข" location="top">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" icon="mdi-pencil" variant="text" color="amber-darken-2" density="comfortable" @click="edit(item.id)"></v-btn>
                </template>
             </v-tooltip>
             
             <v-tooltip text="ลบข้อมูล" location="top">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" icon="mdi-delete" variant="text" color="red-lighten-1" density="comfortable" @click="remove(item.id)"></v-btn>
                </template>
             </v-tooltip>
          </div>
        </template>

        <template v-slot:no-data>
           <div class="pa-8 text-center text-grey">
             <v-icon size="64" class="mb-2 text-grey-lighten-2">mdi-database-search-outline</v-icon>
             <div class="text-h6 text-grey-darken-1">ไม่พบข้อมูล</div>
             <div class="text-caption mb-4">ลองกดโหลดข้อมูลใหม่อีกครั้ง</div>
             <v-btn color="indigo" variant="outlined" rounded="lg" prepend-icon="mdi-refresh" @click="fetchData">โหลดข้อมูลใหม่</v-btn>
           </div>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" max-width="500px" transition="dialog-top-transition">
      <v-card rounded="xl" elevation="10">
        <v-toolbar :color="isEditing ? 'amber-darken-1' : 'indigo-darken-1'" class="px-2">
           <v-toolbar-title class="text-subtitle-1 font-weight-bold ml-2 text-white">
             <v-icon :icon="isEditing ? 'mdi-pencil-box-multiple' : 'mdi-plus-box-multiple'" start></v-icon>
             {{ isEditing ? 'แก้ไขข้อมูลหมวดหมู่' : 'เพิ่มหมวดหมู่ใหม่' }}
           </v-toolbar-title>
           <v-btn icon="mdi-close" variant="text" color="white" @click="dialog = false"></v-btn>
        </v-toolbar>

        <v-card-text class="pa-6">
           <v-row dense>
             <v-col cols="12">
               <div class="text-subtitle-2 font-weight-bold mb-1 text-grey-darken-2">รหัสหมวดหมู่</div>
               <v-text-field
                 v-model="formModel.code"
                 placeholder="ตัวอย่าง: CAT01"
                 variant="outlined"
                 color="indigo"
                 density="comfortable"
                 prepend-inner-icon="mdi-barcode-scan"
                 rounded="lg"
               ></v-text-field>
             </v-col>
             
             <v-col cols="12">
               <div class="text-subtitle-2 font-weight-bold mb-1 text-grey-darken-2">ชื่อหมวดหมู่ (ภาษาไทย)</div>
               <v-text-field
                 v-model="formModel.name_th"
                 placeholder="ตัวอย่าง: อุตสาหกรรม"
                 variant="outlined"
                 color="indigo"
                 density="comfortable"
                 prepend-inner-icon="mdi-format-list-text"
                 rounded="lg"
               ></v-text-field>
             </v-col>
           </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-4 bg-grey-lighten-5">
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" class="px-4" rounded="lg" @click="dialog = false">ยกเลิก</v-btn>
          <v-btn
            :color="isEditing ? 'amber-darken-2' : 'indigo-darken-1'"
            variant="flat"
            width="140"
            rounded="lg"
            prepend-icon="mdi-content-save-check"
            @click="save"
          >
            {{ isEditing ? 'อัปเดตข้อมูล' : 'บันทึกข้อมูล' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup>
import { onMounted, ref, shallowRef, toRef } from 'vue'
import { useRouter } from 'vue-router' 
import axios from 'axios'

const router = useRouter()
const search = ref('') // ตัวแปรสำหรับค้นหา
const loading = ref(false) // ตัวแปร Loading

function createNewRecord() {
  return {
    code: '',
    name_th: '',
  }
}

const formModel = ref(createNewRecord())
const dialog = shallowRef(false)
const isEditing = toRef(() => !!formModel.value.id)
const categories = ref([]); 

// ปรับ Header ให้สวยงามและจัดตำแหน่ง
const headers = [
  { title: 'ลำดับ (ID)', key: 'id', align: 'start', width: '100px' },
  { title: 'รหัสหมวดหมู่ (CODE)', key: 'code', align: 'start', width: '150px' },
  { title: 'ชื่อหมวดหมู่', key: 'name_th', align: 'start' },
  { title: 'วันที่สร้าง', key: 'created_at', align: 'end', width: '200px' },
  { title: 'จัดการ', key: 'actions', align: 'end', sortable: false, width: '120px' },
]

// --- 1. Fetch Data ---
const fetchData = async () => {
  loading.value = true
  try {
    // *หมายเหตุ: ตรวจสอบ URL API อีกครั้งว่าใช้ path ไหนแน่ ระหว่าง 'users/list_all' หรือ 'cat/list_all'
    const { data } = await axios.get("http://localhost:7000/api/users/list_all");
    categories.value = data.list; 
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    router.push('/login')
    return
  }
  await fetchData(); 
})

function add() {
  formModel.value = createNewRecord()
  dialog.value = true
}

async function edit(id) {
  const found = categories.value.find(c => c.id === id)
  if(found) {
    formModel.value = {
        id: found.id,
        code: found.code,
        name_th: found.name_th,
        created_at: found.created_at,
    }
    dialog.value = true
  }
}

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

async function remove(id) {
  const ok = confirm("คุณต้องการลบข้อมูลนี้ใช่หรือไม่?")
  if (!ok) return
  
  loading.value = true
  try {
    await axios.delete(`http://localhost:7000/api/cat/catdelete/${id}`)
    await fetchData(); 
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

async function save() {
  try {
    if (isEditing.value) {
        await axios.put("http://localhost:7000/api/cat/updateCatigory", formModel.value)
    } else {
        await axios.post("http://localhost:7000/api/cat/createCatigory", formModel.value)
    }
    await fetchData();
    dialog.value = false
  } catch (error) {
    console.error(error)
  }
}
</script>