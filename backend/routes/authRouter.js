const router = require('express').Router();
const usersController = require("../controllers/authController");

router.post("/login", usersController.login)
// router.post("/register", usersController.register)

module.exports = router;