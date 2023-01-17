const express = require("express");
const { createMessage, getConversationMessages } = require("../controllers/messageController");
const { isAuthenticatedUser } = require("../middleware/auth");

const router = express.Router();

router.route("/message").post(isAuthenticatedUser, createMessage);
router.route("/messages/:conversationId").get(isAuthenticatedUser, getConversationMessages);

module.exports = router;