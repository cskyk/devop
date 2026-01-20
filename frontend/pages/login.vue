<template>
  <v-app>
    <v-main class="milgram-bg">
      <div class="hex-overlay"></div>
      
      <v-container class="fill-height position-relative" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="10" md="8" lg="5" xl="4">

            <v-card class="milgram-card elevation-0" rounded="0">
              
              <div class="system-bar d-flex justify-space-between px-4 py-1">
                <span class="text-caption font-weight-bold font-mono">SYS: ONLINE</span>
                <span class="text-caption font-weight-bold font-mono">VERDICT_PENDING...</span>
              </div>

              <div class="card-header-strip"></div>

              <v-card-text class="pa-sm-10 pa-6">
                
                <div class="text-center mb-10 position-relative">
                  <div class="hex-avatar-container mx-auto mb-4">
                    <div class="hex-content d-flex align-center justify-center">
                      <v-icon size="48" color="indigo-darken-4">
                        {{ isLogin ? 'mdi-fingerprint' : 'mdi-account-plus-outline' }}
                      </v-icon>
                    </div>
                  </div>
                  
                  <h1 class="text-h4 font-weight-black text-indigo-darken-4 mb-2 text-uppercase ls-2">
                    {{ isLogin ? 'Access System' : 'Prisoner Reg.' }}
                  </h1>
                  <p class="text-body-2 text-grey-darken-1 font-mono">
                    {{ isLogin ? 'IDENTIFY YOURSELF TO PROCEED' : 'REGISTER NEW SUBJECT DATA' }}
                  </p>
                </div>

                <v-window v-model="step" class="overflow-visible">

                  <v-window-item :value="1">
                    <v-form ref="loginForm" @submit.prevent="handleLogin">
                      
                      <div class="input-label font-mono">USER_ID (EMAIL)</div>
                      <v-text-field 
                        v-model="loginData.email" 
                        prepend-inner-icon="mdi-barcode-scan" 
                        variant="outlined" 
                        color="indigo-darken-4"
                        density="comfortable"
                        class="mb-2 milgram-input"
                        hide-details="auto"
                      ></v-text-field>

                      <div class="input-label font-mono mt-4">PASSCODE</div>
                      <v-text-field 
                        v-model="loginData.password" 
                        prepend-inner-icon="mdi-lock-outline" 
                        variant="outlined" 
                        color="indigo-darken-4"
                        density="comfortable"
                        :type="showPass ? 'text' : 'password'"
                        :append-inner-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append-inner="showPass = !showPass" 
                        class="mb-8 milgram-input"
                        hide-details="auto"
                      ></v-text-field>

                      <v-btn 
                        block 
                        color="indigo-darken-4" 
                        size="x-large" 
                        class="rounded-0 font-weight-bold text-uppercase milgram-btn" 
                        type="submit" 
                        :loading="loading"
                        height="56"
                        flat
                      >
                        <v-icon start class="mr-2">mdi-login</v-icon>
                        Connect
                      </v-btn>

                      <div class="text-center mt-8 pt-4 border-t-dashed">
                        <span class="text-caption font-mono text-grey-darken-1">NO RECORD FOUND?</span>
                        <br>
                        <v-btn 
                          variant="text" 
                          color="indigo-darken-4" 
                          class="font-weight-bold px-4 mt-1 rounded-0"
                          @click="step = 2"
                        >
                          [ INITIATE REGISTRATION ]
                        </v-btn>
                      </div>
                    </v-form>
                  </v-window-item>

                  <v-window-item :value="2">
                    <v-form ref="registerForm" @submit.prevent="handleRegister">

                      <v-row dense>
                        <v-col cols="12">
                          <div class="input-label font-mono">EMAIL</div>
                          <v-text-field 
                            v-model="regData.email" 
                            prepend-inner-icon="mdi-email-outline" 
                            variant="outlined" 
                            density="compact" 
                            color="indigo-darken-4"
                            class="milgram-input"
                          ></v-text-field>
                        </v-col>
                        
                        <v-col cols="12">
                          <div class="input-label font-mono">PASSWORD</div>
                          <v-text-field 
                            v-model="regData.password" 
                            prepend-inner-icon="mdi-lock-outline" 
                            variant="outlined" 
                            density="compact" 
                            type="password" 
                            color="indigo-darken-4"
                            class="milgram-input"
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12">
                          <div class="input-label font-mono">SUBJECT NAME (TH)</div>
                          <v-text-field 
                            v-model="regData.name_th" 
                            prepend-inner-icon="mdi-account-outline" 
                            variant="outlined" 
                            density="compact" 
                            color="indigo-darken-4"
                            class="milgram-input"
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="6">
                          <div class="input-label font-mono">DEPARTMENT</div>
                          <v-select 
                            v-model="regData.department_id" 
                            :items="data_departments" 
                            item-title="name_th"
                            item-value="id" 
                            variant="outlined"
                            density="compact" 
                            color="indigo-darken-4"
                            :loading="loadingData"
                            class="milgram-input"
                          ></v-select>
                        </v-col>

                        <v-col cols="12" sm="6">
                          <div class="input-label font-mono">ORG GROUP</div>
                          <v-select 
                            v-model="regData.org_group_id" 
                            :items="org_groups" 
                            item-title="name_th" 
                            item-value="id"
                            variant="outlined" 
                            density="compact"
                            color="indigo-darken-4"
                            :loading="loadingData"
                            class="milgram-input"
                          ></v-select>
                        </v-col>
                      </v-row>

                      <v-btn 
                        block 
                        color="amber-accent-4" 
                        size="x-large" 
                        class="rounded-0 font-weight-bold mt-4 milgram-btn text-black" 
                        type="submit" 
                        :loading="loading"
                        height="56"
                        flat
                      >
                         <v-icon start class="mr-2">mdi-account-plus</v-icon>
                        Submit Data
                      </v-btn>

                      <div class="text-center mt-6">
                        <v-btn 
                          variant="text" 
                          color="grey-darken-3" 
                          class="font-weight-bold px-2"
                          @click="step = 1"
                        >
                          <v-icon start>mdi-arrow-left</v-icon> Return to Login
                        </v-btn>
                      </div>
                    </v-form>
                  </v-window-item>

                </v-window>
              </v-card-text>
              
              <div class="card-footer-deco"></div>
            </v-card>

            <v-snackbar 
              v-model="snackbar.show" 
              :color="snackbar.color === 'success' ? 'indigo-darken-3' : 'red-darken-4'" 
              location="bottom center"
              variant="flat"
              rounded="0"
              elevation="0"
              class="milgram-snackbar"
            >
              <div class="d-flex align-center font-mono">
                <v-icon :icon="snackbar.color === 'success' ? 'mdi-check-decagram' : 'mdi-alert-octagon'" class="mr-3"></v-icon>
                <span class="text-uppercase">{{ snackbar.text }}</span>
              </div>
            </v-snackbar>

          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: false
})

const router = useRouter()
const authStore = useAuthStore()

// --- State Variables ---
const step = ref(1)
const showPass = ref(false)
const loading = ref(false)
const loadingData = ref(false)
const isLogin = computed(() => step.value === 1)

const data_departments = ref([])
const org_groups = ref([])

const loginData = reactive({
  email: '',
  password: ''
})

const regData = reactive({
  email: '',
  password: '',
  name_th: '',
  department_id: null,
  org_group_id: null
})

const snackbar = reactive({
  show: false,
  text: '',
  color: 'success'
})

// --- Functions (Logic เดิม) ---
const fetchDropdownData = async () => {
  loadingData.value = true
  try {
    const [deptRes, orgRes] = await Promise.all([
      axios.get('http://localhost:7000/api/users/departments_show_all'),
      axios.get('http://localhost:7000/api/users/org_groups_show_all')
    ])
    data_departments.value = deptRes.data.data_departments
    org_groups.value = orgRes.data.data_org_groups
  } catch (error) {
    console.error('Error fetching dropdown data:', error)
    showSnackbar('System Error: Cannot fetch departments', 'error')
  } finally {
    loadingData.value = false
  }
}

onMounted(() => {
  fetchDropdownData()
})

const handleLogin = async () => {
  loading.value = true
  try {
    const response = await axios.post('http://localhost:7000/api/auth/login', {
      email: loginData.email,
      password: loginData.password
    })

    authStore.setAuth(response.data.token, response.data.user)
    showSnackbar('Access Granted. Welcome.', 'success')

    const role = authStore.user?.role
    if (role === 'admin') await router.push('/')
    else if (role === 'evaluatee') await router.push('/EvidenceSubmission')  
    else if (role === 'evaluator') await router.push('/evaluation_index') 
    else await router.push('/')

  } catch (error) {
    console.error('Login Error:', error)
    showSnackbar('Access Denied: ' + (error.response?.data?.message || error.message), 'error')
  } finally {
    loading.value = false
  }
}

const handleRegister = async () => {
  loading.value = true
  try {
    const payload = {
      email: regData.email,
      password: regData.password,
      name_th: regData.name_th,
      department_id: regData.department_id,
      org_group_id: regData.org_group_id
    }
    const response = await axios.post('http://localhost:7000/api/users/create', payload)
    showSnackbar('Registration Complete. Awaiting Approval.', 'success')
    setTimeout(() => { step.value = 1 }, 1500)
  } catch (error) {
    console.error('Register Error:', error)
    showSnackbar('Registration Failed: ' + (error.response?.data?.message || error.message), 'error')
  } finally {
    loading.value = false
  }
}

const showSnackbar = (text, color) => {
  snackbar.text = text
  snackbar.color = color
  snackbar.show = true
}
</script>

<style scoped>
/* Font Styling */
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;700&display=swap');

.font-mono {
  font-family: 'Roboto Mono', monospace !important;
}

.ls-2 {
  letter-spacing: 2px !important;
}

/* Background - Milgram Aesthetic */
.milgram-bg {
  background-color: #0a0a12;
  background-image: 
    linear-gradient(30deg, #1A237E 12%, transparent 12.5%, transparent 87%, #1A237E 87.5%, #1A237E),
    linear-gradient(150deg, #1A237E 12%, transparent 12.5%, transparent 87%, #1A237E 87.5%, #1A237E),
    linear-gradient(30deg, #1A237E 12%, transparent 12.5%, transparent 87%, #1A237E 87.5%, #1A237E),
    linear-gradient(150deg, #1A237E 12%, transparent 12.5%, transparent 87%, #1A237E 87.5%, #1A237E),
    linear-gradient(60deg, #101018 25%, transparent 25.5%, transparent 75%, #101018 75%, #101018),
    linear-gradient(60deg, #101018 25%, transparent 25.5%, transparent 75%, #101018 75%, #101018);
  background-size: 80px 140px;
  background-position: 0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px;
  /* Dark sterile filter */
  position: relative;
}

.hex-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(10,10,18,0.4) 0%, rgba(10,10,18,0.95) 100%);
  z-index: 0;
}

/* Card Styling - Sterile & Sharp */
.milgram-card {
  background: #ffffff !important;
  border: 1px solid #e0e0e0;
  position: relative;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.5) !important;
  z-index: 1;
}

.system-bar {
  background: #000;
  color: #fff;
  letter-spacing: 1px;
}

.card-header-strip {
  height: 4px;
  background: repeating-linear-gradient(
    45deg,
    #1A237E,
    #1A237E 10px,
    #283593 10px,
    #283593 20px
  );
}

.card-footer-deco {
  height: 10px;
  background: #000;
  width: 100%;
  border-top: 2px solid #FFD600; /* Yellow Caution line */
}

/* Hexagon Avatar */
.hex-avatar-container {
  width: 80px;
  height: 80px;
  background: #1A237E; /* Navy */
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  padding: 2px;
}

.hex-content {
  width: 100%;
  height: 100%;
  background: #fff;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
}

/* Form Elements */
.input-label {
  font-size: 0.75rem;
  font-weight: bold;
  color: #1A237E;
  margin-bottom: 4px;
  letter-spacing: 1px;
}

.milgram-input :deep(.v-field__outline__start),
.milgram-input :deep(.v-field__outline__end),
.milgram-input :deep(.v-field__outline__notch) {
  border-radius: 0 !important; /* Sharp corners */
}

.milgram-btn {
  border: 1px solid transparent;
  transition: all 0.3s;
  letter-spacing: 2px;
}

.milgram-btn:hover {
  transform: translateY(-2px);
  box-shadow: 4px 4px 0px rgba(0,0,0,0.8);
}

.border-t-dashed {
  border-top: 1px dashed #bdbdbd;
}

/* Responsive */
@media (max-width: 600px) {
  .milgram-card {
    height: 100vh;
    border: none;
  }
}
</style>