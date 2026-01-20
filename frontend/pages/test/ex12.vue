<template>
 <div>
    <h1>Exam 08</h1>
    <p>{{ message }}</p>
    <li v-for="item in student"  :key="item.id">
        {{ item.id }} - {{ item.name }} - {{ item.age }} - {{ item.major }}
    </li>
 </div>   
</template>

<script setup>
import {ref,onMounted} from "vue";

const message = ref("Hello Vue 3")
const name = ref("");
// const student = {
//     XD1:{id:1, name:"Alice",age:23,major:"Mathematucs"},
//     XD2:{id:2, name:"Bob",age:23,major:"Mathematucs"},
//     XD3:{id:3, name:"Charlie",age:19,major:"Mathematucs"}
// }
// onMounted(() => {
//     name.value = 1+4
// })
const student = {1:{id:1,name:"ex",age:"20",major:"XD"}}
console.log(student)
</script>