const db = require('../db/knex');
const bcrypt = require('bcrypt'); // อย่าลืม npm install bcryptjs
// ==========================================
// ส่วนที่ 1: จัดการปีการประเมิน (Evaluation Periods)
// ==========================================

exports.getAllPeriods = async (req, res) => {
    try {
        const periods = await db('evaluation_periods').orderBy('id', 'desc');
        res.json(periods);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.createPeriod = async (req, res) => {
    try {
        const { code, name_th, buddhist_year, start_date, end_date, is_active } = req.body;
         if (is_active == 1) {
            await db('evaluation_periods').update({ is_active: 0 });
        }
        // สร้างปีใหม่ (Default active = 0 ไปก่อน เดี๋ยวค่อยสั่งเปิด)
        await db('evaluation_periods').insert({
            code,
            name_th,
            buddhist_year,
            start_date,
            end_date,
            is_active: is_active ? 1 : 0,
        });
        res.json({ message: "สร้างปีการประเมินเรียบร้อย" });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.editPeriod = async (req,res) => {
    try {
        const { id } = req.params;
        const { code, name_th, buddhist_year, start_date, end_date, is_active } = req.body;
        if (is_active == 1) {
            await db('evaluation_periods').update({ is_active: 0 });
        }
        await db('evaluation_periods').where({ id: id }).update({
            code,
            name_th,       
            buddhist_year,
            start_date,
            end_date,
            is_active: is_active ? 1 : 0
        });
        res.json({ message: "แก้ไขรอบการประเมินเรียบร้อย" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.togglePeriodStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body; // รับค่า 1 หรือ 0

        // ถ้าสั่งเปิด (1) ต้องปิดปีอื่นก่อน (Business Logic: เปิดได้ทีละปี)
        if (is_active == 1) {
            await db('evaluation_periods').update({ is_active: 0 });
        }

        await db('evaluation_periods').where('id', id).update({ is_active });
        res.json({ message: "อัปเดตสถานะเรียบร้อย" });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.deletePeriod = async (req,res) => {
    try{
        await db('evaluation_periods').where('id', req.params.id).del();
        res.json({ message: "ลบสำเร็จ" });
    }catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// ==========================================
// ส่วนที่ 2: จัดการจับคู่ (Assignments)
// ==========================================

// ดึงรายการจับคู่ (Assignment List)
exports.getAssignments = async (req, res) => {
    try {
        // const { period_id } = req.query; 

        let query = db('assignments as a')
            // Join เอาข้อมูลคนประเมิน
            .join('users as evaluator', 'a.evaluator_id', 'evaluator.id')
            // Join เอาข้อมูลคนถูกประเมิน
            .join('users as evaluatee', 'a.evaluatee_id', 'evaluatee.id')
            // ✅ Join เอาชื่อแผนก (ของคนถูกประเมิน)
            .leftJoin('departments as d', 'evaluatee.department_id', 'd.id') 
            .select(
                'a.id',
                'a.period_id',
                'a.evaluator_id',
                'evaluator.name_th as evaluator_name',
                'evaluator.role as evaluator_role', // ✅ ต้องมี: ไว้โชว์ตำแหน่ง (Head/Teacher)
                'a.evaluatee_id',
                'evaluatee.name_th as evaluatee_name',
                'd.name_th as evaluatee_dept'       // ✅ ต้องมี: ไว้โชว์ชื่อแผนกในตาราง
            )
            .orderBy('a.id', 'desc');

        // ถ้ามีการส่ง period_id มากรอง ก็ใส่ Where
        // if (period_id) {
        //     query = query.where('a.period_id', period_id);
        // }

        const assignments = await query;
        res.json(assignments);

    } catch (err) { 
        console.error("Get Assignments Error:", err);
        res.status(500).json({ error: err.message }); 
    }
};

// สร้างการจับคู่ (Assign)
exports.createAssignment = async (req, res) => {
    try {
        const { period_id, evaluator_id, evaluatee_id } = req.body;

        // 1. Validation: ห้ามคนเดียวกันตรวจตัวเอง
        if (evaluator_id == evaluatee_id) {
            return res.status(400).json({ message: "ไม่สามารถจับคู่ตรวจตัวเองได้" });
        }

        // 2. เช็คก่อนว่าคู่นี้เคยจับไปหรือยัง (กันซ้ำ)
        const exists = await db('assignments')
            .where({ period_id, evaluator_id, evaluatee_id })
            .first();

        if (exists) {
            return res.status(400).json({ message: "คู่นี้ถูกจับคู่ไปแล้ว" });
        }

        // 3. ดึงแผนกของครูผู้ถูกประเมิน (Evaluatee) มาเตรียมไว้
        // ต้องเลือก department_id ออกมาให้ชัดเจน
        const evaluatee = await db('users')
            .where('id', evaluatee_id)
            .select('department_id') 
            .first();

        // 4. Insert ลงตาราง assignments
        await db('assignments').insert({
            period_id,
            evaluator_id,
            evaluatee_id,
            // ✅ แก้จุดที่ 1: ใช้ evaluatee.department_id (ตามชื่อในตาราง Users)
            // ✅ แก้จุดที่ 2: ถ้าไม่มีแผนก ให้ใส่ null (อย่าใส่ '-' เพราะ dept_id เป็นตัวเลข)
            dept_id: evaluatee?.department_id || null, 
            created_at: new Date()
        });

        res.json({ message: "จับคู่สำเร็จ" });
    } catch (err) { 
        console.error("Create Assignment Error:", err);
        res.status(500).json({ error: err.message }); 
    }
};

exports.editAssignment = async (req, res) => {
    try {
        const { period_id, evaluator_id, evaluatee_id } = req.body;
        const id_edit = req.params.id;

        // 1. Validation: ห้ามคนเดียวกันตรวจตัวเอง
        if (evaluator_id == evaluatee_id) {
            return res.status(400).json({ message: "ไม่สามารถจับคู่ตรวจตัวเองได้" });
        }

        // 2. เช็คก่อนว่าคู่นี้เคยจับไปหรือยัง (กันซ้ำ)
        const exists = await db('assignments')
            .where({ period_id, evaluator_id, evaluatee_id })
            .first();

        if (exists) {
            return res.status(400).json({ message: "คู่นี้ถูกจับคู่ไปแล้ว" });
        }

        // 3. ดึงแผนกของครูผู้ถูกประเมิน (Evaluatee) มาเตรียมไว้
        // ต้องเลือก department_id ออกมาให้ชัดเจน
        const evaluatee = await db('users')
            .where('id', evaluatee_id)
            .select('department_id') 
            .first();

        // 4. Insert ลงตาราง assignments
        await db('assignments').where('id',id_edit).update({
            period_id,
            evaluator_id,
            evaluatee_id,
            dept_id: evaluatee?.department_id || null, 
        });

        res.json({ message: "จับคู่สำเร็จ" });
    } catch (err) { 
        console.error("Create Assignment Error:", err);
        res.status(500).json({ error: err.message }); 
    }
}

exports.deleteAssignment = async (req, res) => {
    try {
        await db('assignments').where('id', req.params.id).del();
        res.json({ message: "ยกเลิกการจับคู่แล้ว" });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getEvaluators = async (req, res) => {
    try {
        const users = await db('users')
            .where('role', 'evaluator') // 1. ใส่ quote ให้ 'evaluator'
            .where('status', 'active')  // (แนะนำ) ควรดึงเฉพาะคนที่ Active
            .orderBy('department_id', 'asc') // 2. เรียงตามแผนกก่อน (กลุ่มเดียวกันจะได้อยู่ใกล้กัน)
            .orderBy('id', 'asc')       // 3. ถ้าแผนกเดียวกัน ให้เรียงตามชื่อ ก-ฮ
            .select('id', 'name_th', 'department_id', 'role'); // เลือกเฉพาะที่ใช้
            res.json(users);
    } catch (err) { res.status(500).json({ error: err.message }); }
}

exports.getEvaluatees = async (req, res) => {
    try {
        const users = await db('users')
            .whereIn('role', ['evaluatee', 'user']) // เผื่อบางคนเป็น user ธรรมดา
            .where('status', 'active')
            .orderBy('department_id', 'asc') // เรียงตามแผนก
            .orderBy('id', 'asc')       // เรียงตามชื่อ
            .select('id', 'name_th', 'department_id', 'role');

        res.json(users);
    } catch (err) { res.status(500).json({ error: err.message }); }
}

// ==========================================
// ส่วนที่ 3: Helper ดึงรายชื่อคน (User List)
// ==========================================

// ดึง User ทั้งหมด
exports.getAllUsers = async (req, res) => {
    try {
        const users = await db('users').select('id', 'email', 'name_th', 'role', 'status', 'created_at').orderBy('id', 'asc');
        res.json(users);
    } catch (err) { res.status(500).json({ error: err.message }); }
};


// ดึง department_id
exports.getAllDepartments = async (req, res) => {
  try {
    const data_departments = await db('departments').select('*');
    // ✅ แก้เป็น: ส่ง Array ออกไปเลย ไม่ต้องห่อ
    res.json(data_departments); 
  } catch (error) {
    res.status(500).json({ status: 'Error', message: error.message });
  }
}

// ดึง org_group_id
exports.getAllOrgGroups = async (req, res) => {
  try {
    const data_org_groups = await db('org_groups').select('*');
    // ✅ แก้เป็น: ส่ง Array ออกไปเลย
    res.json(data_org_groups);
  } catch (error) {
    res.status(500).json({ status: 'Error', message: error.message });
  }
}
// สร้าง User ใหม่
exports.createUser = async (req, res) => {
    try {
        const { email, password_hash, name_th, role, status, department_id, org_group_id } = req.body;
        
        const hashedPassword = await bcrypt.hash(password_hash, 10);
        
        // ✅ แก้ไขตรงนี้: แปลงค่า 0 หรือ '' ให้เป็น null ก่อนบันทึก
        // ถ้า department_id มีค่า และไม่ใช่ '0' ให้ใช้ค่านั้น, ถ้าไม่ใช่ ให้เป็น null
        const deptToSave = (department_id && department_id != '0') ? department_id : null;
        
        // ทำเหมือนกันกับ org_group_id (ถ้ามี FK เหมือนกัน)
        const orgToSave = (org_group_id && org_group_id != '0') ? org_group_id : null;

        await db('users').insert({
            email,
            password_hash: hashedPassword,
            name_th,
            role,
            status,
            department_id: deptToSave, // ใช้ตัวแปรที่แปลงแล้ว
            org_group_id: orgToSave,   // ใช้ตัวแปรที่แปลงแล้ว
            created_at: new Date()
        });
        res.json({ message: "User created" });
    } catch (err) { 
        // Log Error ออกมาดูชัดๆ
        console.error(err);
        res.status(500).json({ error: err.message }); 
    }
};

// แก้ไข
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, password_hash, name_th, role, status, department_id, org_group_id } = req.body;
        
        // ✅ แปลงค่าเหมือนกัน
        const deptToSave = (department_id && department_id != '0') ? department_id : null;
        const orgToSave = (org_group_id && org_group_id != '0') ? org_group_id : null;

        const updateData = { 
            email, 
            name_th, 
            role, 
            status,
            department_id: deptToSave, // อัปเดตด้วยค่าที่แปลงแล้ว
            org_group_id: orgToSave
        };
        
        if (password_hash && password_hash.trim() !== '') {
            updateData.password_hash = await bcrypt.hash(password_hash, 10);
        }

        await db('users').where('id', id).update(updateData);
        res.json({ message: "User updated" });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// ลบ User
exports.deleteUser = async (req, res) => {
    try {
        await db('users').where('id', req.params.id).del();
        res.json({ message: "User deleted" });
    } catch (err) { res.status(500).json({ error: err.message }); }
};
// exports.getEvaluators = async (req, res) => {
//     // สมมติว่า role 'evaluator' หรือ 'admin' เป็นคนประเมินได้
//     const users = await db('users')
//         .whereIn('role', 'evaluator')
//         .select('id', 'name_th');
//     res.json(users);
// };

// exports.getEvaluatees = async (req, res) => {
//     // ครูทุกคน
//     const users = await db('users')
//         .where('role', 'user')
//         .select('id', 'name_th', 'dept_id');
//     res.json(users);
// };