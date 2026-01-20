const router = require('express').Router();

const usersController = require("../controllers/usersController");
const auth = require("../middleware/authMiddleware")
// ,auth("admin","evaluatee")
router.get("/list", usersController.list);
router.get("/list_all", usersController.list_all);
router.get("/list_users_all_admin", usersController.list_users_all_admin);

router.get("/list_all_users", usersController.list_all_users)
router.get("/listusers", usersController.listrole);

router.put("/usersedit", usersController.usersedit)
router.post("/createadmin", usersController.createadmin)
router.delete("/deleteusers/:id", usersController.deleteusers)

router.get('/list_users_all_evaluator', usersController.list_users_all_evaluator)
router.post("/createevaluator", usersController.createevaluator)

router.get('/list_users_all_evaluatee', usersController.list_users_all_evaluatee)
router.post("/createevaluatee", usersController.createevaluatee)

router.get('/departments_show_all', usersController.departments_show_all)
router.get('/org_groups_show_all', usersController.org_groups_show_all)

// router.get("/", usersController.get);
router.get("/list2", usersController.list2);
router.get("/list3", usersController.list3);
router.post("/create", usersController.create)
// router.post("/create", usersController.create)
router.delete("/delete1/:id" , usersController.delete1)
router.delete("/delete2" , usersController.delete2)
router.put("/update/:id", usersController.update)


router.get("/", usersController.get);
module.exports = router;