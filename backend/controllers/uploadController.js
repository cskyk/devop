const db = require('../db/knex')
const fs = require('fs'); // อย่าลืม import fs
exports.uploadcontroller = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({ message: "No file uploaded." });
        }

        const { period_id, evaluatee_id, indicator_id, evidence_type_id } = req.body;
        const id = await db('attachments').insert({
            period_id: Number(period_id),
            evaluatee_id: evaluatee_id,
            indicator_id: Number(indicator_id),
            evidence_type_id: Number(evidence_type_id),
            file_name: req.file.originalname,
            mime_type: req.file.mimetype,
            size_bytes: req.file.size,
            storage_path: req.file.path
        });
        res.send({
            message: "Flie uploaded successfilly.",
            id: id,
            fileInfo: req.file
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
}
exports.deleteController = async (req, res) => {
    try {
        const fileId = req.params.id;
        const userId = req.user.id; // ดึง ID คนลบมาจาก Token

        // 1. หาข้อมูลไฟล์ก่อน (ต้องเช็คด้วยว่าเป็นเจ้าของไฟล์ไหม เพื่อความปลอดภัย)
        const file = await db('attachments')
            .where({ id: fileId, evaluatee_id: userId }) 
            .first();

        if (!file) {
            return res.status(404).json({ message: "File not found or unauthorized" });
        }

        // 2. (Optional) ลบไฟล์ออกจาก Harddisk
        if (file.storage_path && fs.existsSync(file.storage_path)) {
            try {
                fs.unlinkSync(file.storage_path);
            } catch (err) {
                console.error("File delete error:", err);
                // ไม่ต้อง return error เพราะเราจะลบใน DB ต่อ
            }
        }

        // 3. ลบ Record ใน Database
        await db('attachments').where({ id: fileId }).del();

        res.json({ message: "Deleted successfully" });

    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};