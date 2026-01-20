<template>
    <div>
        <v-sheet border rounded>
            <v-data-table :headers="headers" :hide-default-footer="categories.length < 11" :items="categories">
                <template v-slot:top>
                    <v-toolbar flat>
                        <v-toolbar-title>
                            <v-icon color="medium-emphasis" icon="mdi-book-multiple" size="x-small" start></v-icon>

                            Popular categories
                        </v-toolbar-title>

                        <v-btn class="me-2" prepend-icon="mdi-plus" rounded="lg" text="Add a Book" border
                            @click="add"></v-btn>
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

                        <v-icon color="medium-emphasis" icon="mdi-delete" size="small"
                            @click="remove(item.id)"></v-icon>
                    </div>
                    <v-dialog v-model="confirmModal" max-width="500">
                        <input type="checkbox" id="confirm-modal" class="modal-toggle" />
                        <div class="modal">
                            <div class="modal-box">
                                <h3 class="font-bold text-lg">ยืนยันการลบข้อมูล</h3>
                                <p class="py-4">คุณต้องการลบข้อมูลนี้หรือไม่?</p>
                                <div class="modal-action">
                                    <button class="btn btn-error" @click="remove">ลบ</button>
                                    <button class="btn" @click="confirmModal = false">ยกเลิก</button>
                                </div>
                            </div>
                        </div>
                    </v-dialog>
                </template>

                <template v-slot:no-data>
                    <v-btn prepend-icon="mdi-backup-restore" rounded="lg" text="Reset data" variant="text" border
                        @click="reset"></v-btn>
                </template>
            </v-data-table>
        </v-sheet>
        <v-dialog v-model="dialog" max-width="500">
            <v-card :subtitle="`${isEditing ? 'Update' : 'Create'} your favorite book`"
                :title="`${isEditing ? 'Edit' : 'Add'} a Book`">
                <template v-slot:text>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="formModel.id" label="id" readonly></v-text-field>
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field v-model="formModel.code" label="code"></v-text-field>
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field v-model="formModel.name_th" label="ชื่อไทย"></v-text-field>
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field v-model="formModel.created_at" label="สร้างเมื่อ" readonly></v-text-field>
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
import axios from 'axios'
const currentYear = new Date().getFullYear()

function createNewRecord() {
    return {
        title: '',
        author: '',
        genre: '',
        year: currentYear,
        pages: 1,
    }
}

//   const books = ref([])
const formModel = ref(createNewRecord())
const dialog = shallowRef(false)
const isEditing = toRef(() => !!formModel.value.id)
const categories = ref([]);    // เก็บรายการทั้งหมด 
const confirmModal = ref(false)
const deleteId = ref(null)

function openConfirm(id) {
    deleteId.value = id
    confirmModal.value = true
}

const headers = [
    { title: 'ID', key: 'id', align: 'start' },
    { title: 'CODE', key: 'code' },
    { title: 'ชื่อไทย', key: 'name_th' },
    { title: 'วันที่สร้าง', key: 'created_at', align: 'end' },
    { title: 'Pages', key: 'pages', align: 'end' },
    { title: 'Actions', key: 'actions', align: 'end', sortable: false },
]

onMounted(async () => {
    reset()
    const { data } = await axios.get(
        "http://localhost:7000/api/users/list_all" // ไม่ส่ง code => ได้ list ทั้งหมด
    );
    categories.value = data.list; // เป็น array อยู่แล้ว
})

function add() {
    formModel.value = createNewRecord()
    dialog.value = true
}

function edit(id) {
    const found = categories.value.find(book => book.id === id)

    formModel.value = {
        id: found.id,
        code: found.code,
        name_th: found.name_th,
        created_at: found.created_at,
        year: found.year,
        pages: found.pages,
    }

    dialog.value = true
}

// async function remove(id) {
//     const ok = confirm("แน่ใจนะหนุ่มว่าจะลบ?")
//     if (!ok) return
//     console.log(id)
//     //http://localhost:7000/api/cat/catdelete/13
//     const { data } = await axios.delete(`http://localhost:7000/api/cat/catdelete/${id}`)
//     console.log("Response -> ", data)
//     // const index = categories.value.findIndex(catid => catid.id === id)
//     // categories.value.splice(index, 1)
// }

function save() {
    if (isEditing.value) {
        const index = categories.value.findIndex(book => book.id === formModel.value.id)
        categories.value[index] = formModel.value
    } else {
        formModel.value.id = categories.value.length + 1
        categories.value.push(formModel.value)
    }

    dialog.value = false
}

function reset() {
    dialog.value = false
    formModel.value = createNewRecord()
    categories.value = [
        { id: 1, code: 'To Kill a Mockingbird', name_th: 'Harper Lee', created_at: 'Fiction', year: 1960, pages: 281 },
        { id: 2, code: '1984', name_th: 'George Orwell', created_at: 'Dystopian', year: 1949, pages: 328 },
    ]
}
</script>