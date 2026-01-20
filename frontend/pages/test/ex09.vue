<template>
 <div>
    <h1>Exam 08</h1>
    <p>{{ message }}</p>
    <h1>name = {{ name }}</h1>
 </div>   
</template>

<script setup>
import {ref,onMounted} from "vue";

const message = ref("Hello Vue 3")
const name = ref("");
name.value = "Ex Ppsspp"
</script>