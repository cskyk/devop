// composables/useMenu.js
import { computed } from 'vue'

export const useMenu = (role) => {
  const menu = computed(() => {
    // ------------------------------------------------
    // 1. เมนูสำหรับ ADMIN (เห็นเยอะสุด)
    // ------------------------------------------------
    if (role.value === 'admin') {
      return [
        {
          label: 'ผู้ดูแลระบบ (Administrator)',
          items: [
            { 
              label: 'จัดการผู้ใช้งาน (Users)', 
              icon: 'mdi-database', 
              to: '/' // หรือ path ที่เป็น list_admin ของคุณ
            },
            { 
              label: 'จัดการรอบการประเมิน', 
              icon: 'mdi-calendar-clock', 
              to: '/EvaluationPeriods' // หรือ path ของ EvaluationPeriods
            },
            { 
              label: 'จับคู่การประเมิน', 
              icon: 'mdi-link-variant', 
              to: '/AssignmentManager' // หรือ path ของ AssignmentManager
            },
            { 
              label: 'รายชื่อใน ระบบ', 
              icon: 'mdi-account-group', 
              to: '/list_admin' // หรือ path ของ listfromdatabase2
            },
            { 
              label: 'หมวดวิชา', 
              icon: 'mdi-shape', 
              to: '/listfromdatabase2' // หรือ path ของ listfromdatabase2
            }
          ]
        }
      ]
    }

    // ------------------------------------------------
    // 2. เมนูสำหรับ EVALUATEE (ผู้รับการประเมิน)
    // ------------------------------------------------
    else if (role.value === 'evaluatee') {
      return [
        {
          label: 'การประเมินของฉัน',
          items: [
            { 
              label: 'ส่งหลักฐาน (Submission)', 
              icon: 'mdi-file-document-arrow-right', 
              to: '/EvidenceSubmission' // หรือ path ของ EvidenceSubmission
            }
          ]
        }
      ]
    }

    // ------------------------------------------------
    // 3. กรณีอื่นๆ (User ทั่วไป หรือยังไม่ Login)
    // ------------------------------------------------
    else if (role.value === 'evaluator') {
      return [
        {
          label: 'การประเมินของฉัน',
          items: [
            { 
              label: 'ประเมินบุคลากร', 
              icon: 'mdi-badge-account', 
              to: '/evaluation_index' // หรือ path ของ EvidenceSubmission
            }
          ]
        }
      ]
    }
  })

  return { menu }
}