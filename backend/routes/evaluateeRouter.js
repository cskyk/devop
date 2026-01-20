// routes/evaluatee.js
const express = require('express');
const router = express.Router();
const evaluateeController = require('../controllers/evaluateeController'); // เดี๋ยวเราไปสร้างไฟล์นี้กัน
const auth  = require('../middleware/authMiddleware'); // สมมติว่านายมี Middleware เช็ค Token

// 1. Route สำหรับดึงโจทย์และสถานะการส่งงาน (GET /api/evaluatee/form-data)
// ยิงมาที่: http://localhost:7000/api/evaluatee/form-data
// console.log('Controller:', evaluateeController);
// console.log('Function:', evaluateeController.getEvaluationForm); // <--- น่าจะเป็น undefined
// console.log('Middleware:', verifyToken); // <--- หรืออันนี้ undefined
router.get('/form-data', auth("evaluatee"), evaluateeController.getEvaluationForm);

router.get('/current-period', evaluateeController.getCurrentPeriod);
// 2. Route สำหรับอัปโหลดไฟล์ (POST /api/evaluatee/upload)
// ยิงมาที่: http://localhost:7000/api/evaluatee/upload
// (ส่วน Upload นายอาจจะทำ Multer แยกไว้ เดี๋ยวค่อยมาเติม)
// router.post('/upload', verifyToken, uploadMiddleware, evaluateeController.uploadFile);

module.exports = router;