<template>
  <div>
    <h2>เลือกหมวด (code) จากฐานข้อมูล</h2>
    <select v-model="selectedCode">
      <option value="">-- เลือก --</option>
      <option
        v-for="c in categories"
        :key="c.id"
        :value="c.role"
      >
        {{ c.id }} - {{ c.role }}
      </option>
    </select>
    <button @click="showData">Load Data</button>

    <table v-if="result.length">
      <h1>ผลลัพธ์ที่ดึงตาม</h1>
      <tr>
        <th>id</th>
        <th>email</th>
        <th>name_th</th>
        <th>role</th>
        <th>status</th>
      </tr>
      <tr v-for="item in result" :key="item.id">
        <td>{{ item.id }}</td>
        <td>{{ item.email }}</td>
        <td>{{ item.name_th }}</td>
        <td>{{ item.role }}</td>
        <td>{{ item.status }}</td>
      </tr>
    </table>
  </div>
</template>

<style scoped>
/* * "scoped" หมายความว่า CSS นี้
 * จะมีผลแค่กับไฟล์ component นี้เท่านั้น 
 */

table {
  /* ทำให้เส้นขอบตารางรวมเป็นเส้นเดียว */
  border-collapse: collapse; 
  /* ดันตารางให้ห่างจากปุ่มหน่อย */
  margin-top: 20px; 
  width: 100%; /* ทำให้ตารางเต็มความกว้าง */
}

th, td {
  /* นี่คือส่วนที่เพิ่ม "ความห่าง" ที่คุณต้องการ */
  padding: 8px 12px; /* (8px บนล่าง, 12px ซ้ายขวา) */
  
  /* อันนี้แค่เพิ่มเส้นขอบให้ดูง่ายขึ้น */
  border: 1px solid #ccc; 
  text-align: left;
}

h1 {
    font-size: 1.5rem; /* ลดขนาด H1 ให้พอดีหน่อย */
}
</style>
<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const categories = ref([]);    // เก็บรายการทั้งหมด (ใช้เติม dropdown)
const selectedCode = ref("");  // code ที่เลือกจาก UI
const result = ref([]);        // ผลลัพธ์ที่ดึงตาม code

// โหลดรายการทั้งหมดมาเติม dropdown ตอนเปิดหน้า
onMounted(async () => {
  const { data } = await axios.get(
    "http://localhost:7000/api/users/list_all_users" // ไม่ส่ง code => ได้ list ทั้งหมด
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
    "http://localhost:7000/api/users/listusers?role=" + selectedCode.value );

  // data.list เป็น array อยู่แล้ว
  result.value = data.list;
};
</script>