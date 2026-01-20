const express = require('express');
const router = express.Router();
const evaluatorController = require('../controllers/evaluatorController');
const auth = require('../middleware/authMiddleware');

// บังคับว่าต้อง Login และเป็น role 'evaluator' (หรือ admin)
router.use(auth('evaluator'));

// 1. ดึงรายชื่อคนที่เราต้องประเมิน
router.get('/assignments', evaluatorController.getMyAssignments);

// 2. ดึงแบบฟอร์ม + ข้อมูลคะแนนเก่า + ไฟล์แนบ (ของคนคนเดียว)
router.get('/assessments/:id', evaluatorController.getAssessmentForm);

// 3. บันทึกผลการประเมิน
router.post('/submit', evaluatorController.submitEvaluation);

module.exports = router;