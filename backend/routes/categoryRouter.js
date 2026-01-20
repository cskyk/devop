const router = require('express').Router();

const categoryController = require("../controllers/categoryController");

router.get("/list_all", categoryController.list_all);
router.post("/createCatigory",categoryController.createCategory)
router.put("/updateCatigory",categoryController.updateCategory)
router.delete("/catdelete/:id",categoryController.catdelete)

module.exports = router;