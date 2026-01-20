<template>
    <div><button @click="listData">CLICK</button> Count is: {{ count }}</div>
    <div><button @click="listData2">CLICK2</button> Count is: {{ count }}</div>
</template>
<script setup>

import { ref } from "vue";
import axios from "axios";
const count = ref(0);

const listData = async () => {
    const data = await axios.get('http://localhost:7000/api/health?name=hello&age=20')
    console.log(data.data)
    console.log(data);
    count.value++
    // = data.total;
    // console.log("Count is:", count.value);
};

const listData2 = async () => {
    const data2 = await axios.get('http://localhost:7000/api/users/list?code=CAT01')
    console.log(data2.data)
    console.log(data2);
    count.value++
    // = data2.total;
    // console.log("Count is:", count.value);
};
</script>