<template>
  <v-app>
    <v-main class="bg-grey-lighten-3">
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="6" lg="4">
            
            <v-card class="elevation-12 rounded-xl pa-4">
              
              <div class="text-center my-4">
                <h2 class="text-h4 font-weight-bold text-primary">Welcome</h2>
                <p class="text-subtitle-1 text-grey">
                  {{ isLogin ? 'Login to system' : 'Register new user' }}
                </p>
              </div>

              <v-window v-model="step">
                
                <v-window-item :value="1">
                  <v-form ref="loginForm" @submit.prevent="handleLogin">
                    <v-text-field
                      v-model="loginData.email"
                      prepend-inner-icon="mdi-email"
                      label="Email"
                      variant="outlined"
                      class="mb-2"
                      color="primary"
                    ></v-text-field>

                    <v-text-field
                      v-model="loginData.password"
                      prepend-inner-icon="mdi-lock"
                      label="Password"
                      variant="outlined"
                      :type="showPass ? 'text' : 'password'"
                      :append-inner-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append-inner="showPass = !showPass"
                      class="mb-2"
                      color="primary"
                    ></v-text-field>

                    <v-btn
                      block
                      color="primary"
                      size="large"
                      class="rounded-lg font-weight-bold mt-4"
                      elevation="4"
                      type="submit"
                      :loading="loading"
                    >
                      Login
                    </v-btn>

                    <div class="text-center mt-6">
                      <span class="text-body-2 text-grey">Don't have an account? </span>
                      <a 
                        href="#" 
                        class="text-decoration-none text-primary font-weight-bold"
                        @click.prevent="step = 2"
                      >
                        Register
                      </a>
                    </div>
                  </v-form>
                </v-window-item>

                <v-window-item :value="2">
                  <v-form ref="registerForm" @submit.prevent="handleRegister">
                    
                    <v-text-field
                      v-model="regData.email"
                      prepend-inner-icon="mdi-email"
                      label="Email"
                      variant="outlined"
                      density="compact"
                      class="mb-2"
                      color="secondary"
                    ></v-text-field>

                    <v-text-field
                      v-model="regData.password"
                      prepend-inner-icon="mdi-lock"
                      label="Password"
                      variant="outlined"
                      density="compact"
                      type="password"
                      class="mb-2"
                      color="secondary"
                    ></v-text-field>

                    <v-text-field
                      v-model="regData.name_th"
                      prepend-inner-icon="mdi-account"
                      label="Name (TH)"
                      variant="outlined"
                      density="compact"
                      class="mb-2"
                      color="secondary"
                    ></v-text-field>

                    <v-text-field
                      v-model="regData.department_id"
                      prepend-inner-icon="mdi-domain"
                      label="Department ID"
                      variant="outlined"
                      density="compact"
                      class="mb-2"
                      color="secondary"
                    ></v-text-field>

                    <v-text-field
                      v-model="regData.org_group_id"
                      prepend-inner-icon="mdi-office-building"
                      label="Org Group ID"
                      variant="outlined"
                      density="compact"
                      class="mb-4"
                      color="secondary"
                    ></v-text-field>

                    <v-btn
                      block
                      color="secondary"
                      size="large"
                      class="rounded-lg font-weight-bold"
                      elevation="4"
                      type="submit"
                      :loading="loading"
                    >
                      Create User
                    </v-btn>

                    <div class="text-center mt-6">
                      <span class="text-body-2 text-grey">Back to login? </span>
                      <a 
                        href="#" 
                        class="text-decoration-none text-secondary font-weight-bold"
                        @click.prevent="step = 1"
                      >
                        Login
                      </a>
                    </div>
                  </v-form>
                </v-window-item>

              </v-window>
            </v-card>

            <v-snackbar v-model="snackbar.show" :color="snackbar.color" location="top">
              {{ snackbar.text }}
              <template v-slot:actions>
                <v-btn variant="text" @click="snackbar.show = false">Close</v-btn>
              </template>
            </v-snackbar>

          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import axios from 'axios'

// --- State Variables ---
const step = ref(1)
const showPass = ref(false)
const loading = ref(false)
const isLogin = computed(() => step.value === 1)

// ข้อมูลสำหรับ Login
const loginData = reactive({
  email: '',
  password: ''
})

// ข้อมูลสำหรับ Register (เพิ่ม field ตาม JSON)
const regData = reactive({
  email: '',
  password: '',
  name_th: '',
  department_id: '',
  org_group_id: ''
})

// แจ้งเตือน (Snackbar)
const snackbar = reactive({
  show: false,
  text: '',
  color: 'success'
})

// --- Functions ---

// 1. ฟังก์ชัน Login
const handleLogin = async () => {
  loading.value = true
  try {
    // ยิง API Login
    const response = await axios.post('http://localhost:7000/api/auth/login', {
      email: loginData.email,
      password: loginData.password
    })

    console.log('Login Success:', response.data)
    showSnackbar('Login Successful!', 'success')
    
    // ตรงนี้อาจจะเก็บ Token ลง LocalStorage
    // localStorage.setItem('token', response.data.token)

  } catch (error) {
    console.error('Login Error:', error)
    showSnackbar('Login Failed: ' + (error.response?.data?.message || error.message), 'error')
  } finally {
    loading.value = false
  }
}

// 2. ฟังก์ชัน Register (Create User)
const handleRegister = async () => {
  loading.value = true
  try {
    // เตรียมข้อมูล Payload
    const payload = {
      email: regData.email,
      // ปกติเราส่ง password ธรรมดา ถ้า Backend บังคับชื่อ field 'password_hash' ให้เปลี่ยน key ด้านล่างนี้
      password: regData.password, 
      // password_hash: regData.password, // <--- ใช้บรรทัดนี้แทนถ้า API บังคับชื่อ key นี้
      name_th: regData.name_th,
      department_id: regData.department_id,
      org_group_id: regData.org_group_id
    }

    // ยิง API Create
    const response = await axios.post('http://localhost:7000/api/users/create', payload)

    console.log('Register Success:', response.data)
    showSnackbar('User Created Successfully!', 'success')
    
    // สร้างเสร็จแล้ว สลับไปหน้า Login
    setTimeout(() => {
      step.value = 1
    }, 1500)

  } catch (error) {
    console.error('Register Error:', error)
    showSnackbar('Registration Failed: ' + (error.response?.data?.message || error.message), 'error')
  } finally {
    loading.value = false
  }
}

// Helper แสดงแจ้งเตือน
const showSnackbar = (text, color) => {
  snackbar.text = text
  snackbar.color = color
  snackbar.show = true
}
</script>