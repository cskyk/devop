const router = require('express').Router();
const express = require('express');
const auth  = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

// ทุก Route ในนี้ต้องเป็น Admin เท่านั้น!
router.use(auth('admin'));

// --- 1. จัดการประกาศปีการศึกษา (Periods) ---
router.get('/periods', adminController.getAllPeriods);
router.post('/periods', adminController.createPeriod);
router.put('/periods/:id', adminController.editPeriod)
router.put('/periods/:id/status', adminController.togglePeriodStatus);
router.delete('/periods/:id', adminController.deletePeriod)



// --- 2. จัดการจับคู่ (Assignments) ---
router.get('/assignments', adminController.getAssignments); // ดูรายการจับคู่
router.post('/assignments', adminController.createAssignment); // สร้างการจับคู่
router.put('/assignments/:id', adminController.editAssignment) // แก้ไขการจับคู่
router.delete('/assignments/:id', adminController.deleteAssignment); // ยกเลิกคู่

// --- Users (Helpers for Dropdown) ---
router.get('/users/evaluators', adminController.getEvaluators);
router.get('/users/evaluatees', adminController.getEvaluatees);


// --- 3. จัดการ Users (ถ้าจะดึงรายชื่อมาทำ Dropdown) ---
// ดึงผู้ใช้ทั้งหมด
router.get('/users', adminController.getAllUsers); 
// สร้างผู้ใช้ใหม่
router.post('/users', adminController.createUser);
// แก้ไขผู้ใช้
router.put('/users/:id', adminController.updateUser);
// ลบผู้ใช้
router.delete('/users/:id', adminController.deleteUser);
// ออฟชั่นเลือก
router.get('/departments', adminController.getAllDepartments)
router.get('/org-groups', adminController.getAllOrgGroups)


module.exports = router;