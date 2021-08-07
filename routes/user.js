const express = require("express");
const checkAuth = require("../auth/checkAuth");

const router = express.Router();

const UserController = require("../controllers/user");

router.post("/register", UserController.register_new_user);
router.post("/login", UserController.user_login);

module.exports = router;
