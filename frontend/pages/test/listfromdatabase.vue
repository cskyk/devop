<template>
  <div>
    <v-sheet border rounded>
      <v-data-table
        :headers="headers"
        :hide-default-footer="userdata.length < 11"
        :items="userdata"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>
              <v-icon color="medium-emphasis" icon="mdi-book-multiple" size="x-small" start></v-icon>

              ข้อมูลรายชื่อ ผู้ใช้ทั้งหมด
            </v-toolbar-title>

            <v-btn
              class="me-2"
              prepend-icon="mdi-plus"
              rounded="lg"
              text="Add a Book"
              border
              @click="add"
            ></v-btn>
          </v-toolbar>
        </template>

        <template v-slot:item.title="{ value }">
          <v-chip :text="value" border="thin opacity-25" prepend-icon="mdi-book" label>
            <template v-slot:prepend>
              <v-icon color="medium-emphasis"></v-icon>
            </template>
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <div class="d-flex ga-2 justify-end">
            <v-icon color="medium-emphasis" icon="mdi-pencil" size="small" @click="edit(item.id)"></v-icon>

            <v-icon color="medium-emphasis" icon="mdi-delete" size="small" @click="remove(item.id)"></v-icon>
          </div>
        </template>

        <template v-slot:no-data>
          <v-btn
            prepend-icon="mdi-backup-restore"
            rounded="lg"
            text="Reset data"
            variant="text"
            border
            @click="reset"
          ></v-btn>
        </template>
      </v-data-table>
    </v-sheet>

    <v-dialog v-model="dialog" max-width="500">
      <v-card
        :subtitle="`${isEditing ? 'Update' : 'Create'} your favorite book`"
        :title="`${isEditing ? 'Edit' : 'Add'} a Book`"
      >
        <template v-slot:text>
          <v-row>
            <v-col cols="12">
               <v-text-field v-model="formModel.email" label="อีเมล"></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field v-model="formModel.id" label="id" readonly ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-select v-model="formModel.name_th"  label="ชื่อ"></v-select>
            </v-col>

            <v-col cols="12" md="6">
              <v-select v-model="formModel.role" label="บทบาท"></v-select>
            </v-col>

            <v-col cols="12" md="6">
              <v-select v-model="formModel.status" label="สถานะ"></v-select>
            </v-col>
          </v-row>
        </template>

        <v-divider></v-divider>

        <v-card-actions class="bg-surface-light">
          <v-btn text="Cancel" variant="plain" @click="dialog = false"></v-btn>

          <v-spacer></v-spacer>

          <v-btn text="Save" @click="save"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup>
  import { onMounted, ref, shallowRef, toRef } from 'vue'
  import  axios  from 'axios'

  const currentYear = new Date().getFullYear()

  function createNewRecord () {
    return {
      email: '',
      name_th: '',
      role: '',
      status:'',
    //   updated_at: set,
    }
  }

  const userdata = ref([])
  const formModel = ref(createNewRecord())
  const dialog = shallowRef(false)
  const isEditing = toRef(() => !!formModel.value.id)
//   const categories = ref([])

  const headers = [
    { title: 'ID', key: 'id', align: 'start' },
    { title: 'email', key: 'email' },
    { title: 'ชื่อ', key: 'name_th' },
    { title: 'บทบาท', key: 'role', align: 'end' },
    { title: 'สถานะ', key: 'status', align: 'end' },
    { title: 'department_id', key: 'department_id', align: 'end' },
    { title: 'org_group_id', key: 'org_group_id', align: 'end' },
    { title: 'วันที่สร้าง', key: 'created_at', align: 'end', sortable: false },
    { title: 'แก้ไขวันที่', key: 'updated_at', align: 'end', sortable: false },
    { title: 'Actions', key: 'actions', align: 'end', sortable: false },
  ]

  onMounted(async() => {
    reset()
  const { data } = await axios.get(
    "http://localhost:7000/api/users/list_all_users" // ไม่ส่ง code => ได้ list ทั้งหมด
  );
  userdata.value = data.list; // เป็น array อยู่แล้ว
  })

  function add () {
    formModel.value = createNewRecord()
    dialog.value = true
  }

  function edit (id) {
    const found = userdata.value.find(book => book.id === id)

    formModel.value = {
      id: found.id,
      email: found.email,
      name_th: found.name_th,
      role: found.role,
      created_at: found.created_at,
      status: found.status,
    }

    dialog.value = true
  }

  function remove (id) {
    const index = userdata.value.findIndex(book => book.id === id)
    userdata.value.splice(index, 1)
  }

  function save () {
    if (isEditing.value) {
      const index = userdata.value.findIndex(book => book.id === formModel.value.id)
      userdata.value[index] = formModel.value
    } else {
      formModel.value.id = userdata.value.length + 1
      userdata.value.push(formModel.value)
    }

    dialog.value = false
  }

  function reset () {
    dialog.value = false
    formModel.value = createNewRecord()
    userdata.value = [
      { id: 1, email: 'To Kill a Mockingbird', name_th: 'Harper Lee', role: 'Fiction', status: 1960, created_at: 281 },
      { id: 2, email: '1984', name_th: 'George Orwell', role: 'Dystopian', status: 1949, created_at: 328 },
    ]
  }
</script>