const express = require("express");
const checkAuth = require("../auth/checkAuth");

const router = express.Router();

const MessageController = require("../controllers/message");

module.exports = router;
