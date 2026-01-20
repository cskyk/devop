<template>
  <div>
    <h2>เลือกหมวด (code) จากฐานข้อมูล</h2>
    <!-- dropdown เลือก code -->
    <select v-model="selectedCode">
      <option value="">-- เลือก code --</option>
      <option
        v-for="c in categories"
        :key="c.code"
        :value="c.code"
      >
        {{ c.code }} - {{ c.name_th }}
      </option>
    </select>
    <button @click="showData">Load Data</button>
    <!-- แสดงผล -->
    <table v-if="result.length">
        <h1>ผลลัพธ์ที่ดึงตาม</h1>
      <tr>
        <th>Code</th>
        <th>Name (TH)</th>
      </tr>
      <tr v-for="item in result" :key="item.code">
        <td>{{ item.code }}</td>
        <td>{{ item.name_th }}</td>
      </tr>
    </table>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const categories = ref([]);    // เก็บรายการทั้งหมด (ใช้เติม dropdown)
const selectedCode = ref("");  // code ที่เลือกจาก UI
const result = ref([]);        // ผลลัพธ์ที่ดึงตาม code

// โหลดรายการทั้งหมดมาเติม dropdown ตอนเปิดหน้า
onMounted(async () => {
  const { data } = await axios.get(
    "http://localhost:7000/api/users/list_all" // ไม่ส่ง code => ได้ list ทั้งหมด
  );
  categories.value = data.list; // เป็น array อยู่แล้ว
});

// กดปุ่มแล้วดึงตาม code ที่เลือก
const showData = async () => {
  if (!selectedCode.value) {
    alert("กรุณาเลือก code ก่อน");
    return;
  }

//   const { data } = await axios.get(
//     "http://localhost:7000/api/users/list",
//     { params: { code: selectedCode.value } }
//   );
   const { data } = await axios.get(
    "http://localhost:7000/api/users/list?code=" + selectedCode.value );

  // data.list เป็น array อยู่แล้ว
  result.value = [data.list];
};
</script>