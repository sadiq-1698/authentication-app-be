const express = require("express");
const checkAuth = require("../auth/checkAuth");

const router = express.Router();

const ConversationController = require("../controllers/conversation");

module.exports = router;
