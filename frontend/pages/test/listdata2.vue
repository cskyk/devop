<template>
  <button @click="showData">Load Users</button>

  <table v-if="users.length">
    <tr>
      <th>Code</th>
      <th>Name (TH)</th>
    </tr>
    <tr v-for="u in users" :key="u.code">
      <td>{{ u.code }}</td>
      <td>{{ u.name_th }}</td>
    </tr>
  </table>
</template>


<script setup>
import { ref } from "vue";
import axios from "axios";
// import { ContentDoc } from "#components";

const users = ref([]);

const showData = async () => {
  console.log("Button clicked");
  const response  = await axios.get(
    "http://localhost:7000/api/users/list?code=CAT08"
  );
  console.log("RAW DATA:", response.data.list);
  // กรณีที่ backend ส่ง { list: { code, name_th, ... } }
  // แปลงให้เป็น array 1 ตัว
//   users.value = [data.list];
 console.log("DATA LIST:", response.data.list);
  users.value =[response.data.list];
};
</script>