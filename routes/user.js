const express = require("express");
const checkAuth = require("../auth/checkAuth");

const router = express.Router();

const UserController = require("../controllers/user");

module.exports = router;
