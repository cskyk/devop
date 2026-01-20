// controllers/evaluateeController.js
const db = require('../db/knex')

exports.getEvaluationForm = async (req, res) => {
    try {
        // 1. รับค่าจาก Token (req.user) และ Query String
        const evaluateeId = req.user.id;
        const periodId = req.query.period_id || 1;

        // 2. ใช้ Knex Query Builder แทน Raw SQL
        const rows = await db('evaluation_topics as t')
            .select(
                't.id as topic_id',
                't.title_th as topic_title',
                'i.id as indicator_id',
                'i.code as indicator_code',
                'i.name_th as indicator_name',
                'i.description as indicator_desc',
                'et.id as evidence_type_id',
                'et.name_th as evidence_type_name',
                'a.id as file_id',
                'a.file_name',
                'a.storage_path'
            )
            .join('indicators as i', 'i.topic_id', 't.id')
            .join('indicator_evidence as ie', 'ie.indicator_id', 'i.id')
            .join('evidence_types as et', 'et.id', 'ie.evidence_type_id')
            // Left Join แบบมีเงื่อนไขซ้อน (Complex Join Condition)
            .leftJoin('attachments as a', function() {
                this.on('a.indicator_id', '=', 'i.id')
                    .andOnVal('a.evaluatee_id', '=', evaluateeId) // เทียบกับค่าตัวแปร
                    .andOnVal('a.period_id', '=', periodId)       // เทียบกับค่าตัวแปร
            })
            .where('t.active', 1)
            .andWhere('i.active', 1)
            .orderBy(['t.id', 'i.id', 'et.id']);

        // 4. แปลงข้อมูล (Logic เดิมใช้ได้เลย แต่ปรับปรุงให้อ่านง่ายขึ้นเล็กน้อย)
        const result = [];

        for (const row of rows) {
            // 4.1 จัดการ Topic
            let topic = result.find(t => t.id === row.topic_id);
            if (!topic) {
                topic = {
                    id: row.topic_id,
                    title_th: row.topic_title,
                    indicators: []
                };
                result.push(topic);
            }

            // 4.2 จัดการ Indicator
            let indicator = topic.indicators.find(ind => ind.id === row.indicator_id);
            if (!indicator) {
                indicator = {
                    id: row.indicator_id,
                    code: row.indicator_code,
                    name_th: row.indicator_name,
                    description: row.indicator_desc,
                    allowed_evidence: [],
                    uploaded_files: []
                };
                topic.indicators.push(indicator);
            }

            // 4.3 จัดการ Allowed Evidence (กันซ้ำ)
            if (row.evidence_type_id) {
                const typeExists = indicator.allowed_evidence.some(e => e.id === row.evidence_type_id);
                if (!typeExists) {
                    indicator.allowed_evidence.push({
                        id: row.evidence_type_id,
                        name_th: row.evidence_type_name
                    });
                }
            }

            // 4.4 จัดการ Uploaded Files (กันซ้ำ)
            if (row.file_id) {
                const fileExists = indicator.uploaded_files.some(f => f.id === row.file_id);
                if (!fileExists) {
                    indicator.uploaded_files.push({
                        id: row.file_id,
                        file_name: row.file_name,
                        storage_path: row.storage_path
                    });
                }
            }
        }

        // 5. ส่ง JSON กลับ
        res.json(result);

    } catch (error) {
        console.error("Get Form Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
exports.getCurrentPeriod = async (req, res) => {
    try {
        // 1. ลองหาปีที่ active = 1 ก่อน
        let period = await db('evaluation_periods')
            .where('is_active', 1)
            .first();

        // 2. ถ้าไม่มี active เลย ให้เอาปีล่าสุด (ID มากสุด)
        // if (!period) {
        //     period = await db('evaluation_periods')
        //         .orderBy('id', 'desc')
        //         .first();
        // }

        if (!period) {
            return res.status(404).json({ message: "No period found" });
        }

        res.json(period);

    } catch (error) {
        console.error("Get Period Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};