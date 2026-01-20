const router = require('express').Router();
const multer = require('multer');
const path = require('path')
const fs = require("fs")
const uploadctrl = require('../controllers/uploadController')
const auth = require("../middleware/authMiddleware")

//set up storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log('Uploading file :', file.originalname)
        console.log('Uploading to directory :', path.join(__dirname, "../uploads"))
        console.log('Current __dirbane :', __dirname)
        const uploadDir = path.join(__dirname, "../uploads")
        console.log('Resolved uploadDir:', uploadDir)
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir)
        }
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });
router.post("/file",auth("evaluatee"), upload.single("file"),uploadctrl.uploadcontroller)
router.delete("/file/:id",auth("evaluatee"),uploadctrl.deleteController)
module.exports = router;