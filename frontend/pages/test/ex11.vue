<template>
 <div>
    <h1>Exam 08</h1>
    <p>{{ message }}</p>
    <h1>name1 = {{ name.name }}</h1>
    <h1>name2 = {{ name.age }}</h1>
    <h1>name3 = {{ name.major }}</h1>
 </div>   
</template>

<script setup>
import {ref,onMounted} from "vue";

const message = ref("Hello Vue 3")
const name = ref("");
const student = [
    {id:1, name:"Alice",age:23,major:"Mathematucs"},
    {id:2, name:"Bob",age:23,major:"Mathematucs"},
    {id:3, name:"Charlie",age:19,major:"Mathematucs"}
]
// onMounted(() => {
//     name.value = 1+4
// })
console.log(student)
name.value = student[2]
</script>