const db = require('../db/knex');
const path = require('path'); 
// -----------------------------------------------------------------------
// 1. ดึงรายชื่อ Assignments
// -----------------------------------------------------------------------
exports.getMyAssignments = async (req, res) => {
    try {
        const evaluatorId = req.user.id;

        // Query 1: ดึงรายชื่อ Assignment ทั้งหมด (1 ครั้ง)
        const assignments = await db('assignments')
            .join('users as u', 'assignments.evaluatee_id', 'u.id')
            .leftJoin('departments as d', 'assignments.dept_id', 'd.id')
            .join('evaluation_periods as p', 'assignments.period_id', 'p.id')
            .where('assignments.evaluator_id', evaluatorId)
            .select(
                'assignments.id',
                'assignments.period_id',
                'assignments.evaluatee_id',
                'assignments.evaluator_id',
                'u.name_th as evaluatee_name',
                'u.role as position',
                'd.name_th as department',
                'p.name_th as period_name'
            );

        // Query 2: ดึง "จำนวนข้อที่ตรวจแล้ว" ของทุกคนในรอบเดียว! (1 ครั้ง)
        // ใช้ Group By เพื่อรวบยอดมาเลยว่า คู่ (period, evaluatee) นี้ ตรวจไปกี่ข้อแล้ว
        const progressStats = await db('evaluation_results')
            .select('period_id', 'evaluatee_id')
            .count('id as count')
            .where('evaluator_id', evaluatorId)
            .groupBy('period_id', 'evaluatee_id');

        // จับคู่ข้อมูลใน JavaScript (RAM) เร็วกว่ายิง DB เยอะมาก
        const assignmentsWithStatus = assignments.map(a => {
            // ค้นหาว่าคนนี้ (a) มีประวัติการตรวจใน progressStats ไหม
            const stat = progressStats.find(p => 
                p.period_id === a.period_id && 
                p.evaluatee_id === a.evaluatee_id
            );

            const count = stat ? stat.count : 0;
            let status = 'pending';
            let progress = 0;

            if (count > 0) {
                status = 'in_progress';
                progress = 50; // หรือคำนวณ % ตามสูตร
            }

            return {
                ...a,
                evaluatee_image: null,
                status: status,
                progress: progress
            };
        });

        res.json(assignmentsWithStatus);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};
// -----------------------------------------------------------------------
// 2. ดึงแบบฟอร์ม + คะแนนเดิม + ไฟล์แนบ
// -----------------------------------------------------------------------
exports.getAssessmentForm = async (req, res) => {
    try {
        const { id } = req.params; // id นี้คือ assignment_id
        const evaluatorId = req.user.id;

        // A. Header Info
        const assignment = await db('assignments')
            .join('users as u', 'assignments.evaluatee_id', 'u.id')
            .leftJoin('departments as d', 'assignments.dept_id', 'd.id')
            .join('evaluation_periods as p', 'assignments.period_id', 'p.id')
            .where({ 'assignments.id': id, 'assignments.evaluator_id': evaluatorId })
            .select(
                'assignments.id',
                'assignments.period_id',
                'assignments.evaluatee_id',
                // 'assignments.evaluator_id', // มีค่าเท่ากับ evaluatorId อยู่แล้ว
                'u.name_th as evaluatee',
                'u.role as position',
                'd.name_th as department',
                'p.name_th as period_name'
            )
            .first();

        if (!assignment) {
            return res.status(403).json({ message: 'ไม่พบรายการ หรือไม่มีสิทธิ์เข้าถึง' });
        }

        // B. Topics & Indicators
        const topics = await db('evaluation_topics').where('active', 1).orderBy('id');
        const indicators = await db('indicators').where('active', 1).orderBy('id');
        
        // C. Existing Results
        // ✅ แก้ไข: Query ด้วย 3 คอลัมน์หลัก แทน assignment_id
        const existingResults = await db('evaluation_results')
            .where({
                period_id: assignment.period_id,
                evaluatee_id: assignment.evaluatee_id,
                evaluator_id: evaluatorId
            });

        // D. Files
        const submittedFiles = await db('attachments')
             .where('period_id', assignment.period_id)
             .andWhere('evaluatee_id', assignment.evaluatee_id);

        // E. Map Data
        const form_data = topics.map(topic => {
            return {
                id: topic.id,
                code: topic.code,
                title: topic.title_th,
                description: topic.description,
                indicators: indicators
                    .filter(ind => ind.topic_id === topic.id)
                    .map(ind => {
                        const result = existingResults.find(r => r.indicator_id === ind.id);
                        
                        const files = submittedFiles
                            .filter(f => f.indicator_id === ind.id)
                            .map(f => {
                                // ดึงชื่อไฟล์จริงๆ ที่มีตัวเลขยาวๆ จาก storage_path
                                // เช่น D:\devops\...\12345-pic.png -> จะเหลือแค่ "12345-pic.png"
                                const realFileName = path.basename(f.storage_path); 

                                return { 
                                    name: f.file_name, // ชื่อเดิมไว้โชว์สวยๆ
                                    // สร้าง URL โดยใช้ชื่อไฟล์จริง
                                    url: `http://localhost:7000/uploads/${realFileName}`, 
                                    type: f.mime_type.includes('image') ? 'image' : 'pdf' 
                                };
                            });

                        return {
                            id: ind.id,
                            code: ind.code,
                            name: ind.name_th,
                            desc: ind.description,
                            type: ind.type,
                            
                            score: result ? result.score : null,
                            yes_no_val: result ? result.value_yes_no : null,
                            note: result ? result.notes : '',
                            
                            files: files
                        };
                    })
            };
        });

        res.json({
            assignment_info: assignment,
            form_data: form_data
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

// -----------------------------------------------------------------------
// 3. บันทึกผล (Submit)
// -----------------------------------------------------------------------
exports.submitEvaluation = async (req, res) => {
    const trx = await db.transaction();
    try {
        const { assignment_id, results } = req.body;
        const evaluatorId = req.user.id;

        // ดึง info จาก assignment ก่อน เพื่อเอา period_id, evaluatee_id
        const assignment = await trx('assignments').where('id', assignment_id).first();
        if (!assignment) throw new Error('Assignment not found');

        const allIndicators = await trx('indicators').select('id', 'topic_id');

        for (const item of results) {
            const dataToSave = {
                score: item.score,
                value_yes_no: item.value_yes_no,
                notes: item.notes,
                updated_at: new Date()
            };

            // ✅ แก้ไข: Query ด้วย 3 คอลัมน์หลัก + indicator_id
            const whereCondition = {
                period_id: assignment.period_id,
                evaluatee_id: assignment.evaluatee_id,
                evaluator_id: evaluatorId,
                indicator_id: item.indicator_id
            };

            const existing = await trx('evaluation_results')
                .where(whereCondition)
                .first();

            if (existing) {
                // Update
                await trx('evaluation_results')
                    .where({ id: existing.id })
                    .update(dataToSave);
            } else {
                // Insert
                const indInfo = allIndicators.find(i => i.id === item.indicator_id);
                
                await trx('evaluation_results').insert({
                    // ❌ ตัด assignment_id ออก เพราะไม่มีใน DB
                    period_id: assignment.period_id,
                    evaluatee_id: assignment.evaluatee_id,
                    evaluator_id: evaluatorId,
                    indicator_id: item.indicator_id,
                    topic_id: indInfo ? indInfo.topic_id : null,
                    status: 'draft',
                    created_at: new Date(),
                    ...dataToSave
                });
            }
        }

        await trx.commit();
        res.json({ message: 'บันทึกข้อมูลเรียบร้อยแล้ว' });

    } catch (err) {
        await trx.rollback();
        console.error(err);
        res.status(500).json({ error: 'Save failed: ' + err.message });
    }
};