const express = require("express");
const checkAuth = require("../auth/checkAuth");

const router = express.Router();

const MessageController = require("../controllers/message");

router.post("/new", checkAuth, MessageController.create_message);
router.get("/:convoId", MessageController.get_all_messages);

module.exports = router;
