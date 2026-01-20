<template>
 <div>
    <h1>Exam 08</h1>
    <p>{{ message }}</p>
    <li v-for="item in student"  :key="item.id">
        {{ item.id }} - {{ item.code }} - {{ item.name_th }} - {{ item.created_at }}
    </li>
 </div>   
</template>

<script setup>
import axios from "axios";
import {ref,onMounted} from "vue";

const message = ref("Hello Vue 3")
// const name = ref("");
const student = ref([])
console.log(student)
onMounted(async() => {
    const { data } = await axios.get(
    "http://localhost:7000/api/users/list_all"
)
student.value = data.list
})
</script>