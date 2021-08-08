const express = require("express");
const checkAuth = require("../auth/checkAuth");

const router = express.Router();

const ConversationController = require("../controllers/conversation");

router.post("/new", checkAuth, ConversationController.new_conversation);
router.get("/all", checkAuth, ConversationController.my_conversations);

module.exports = router;
