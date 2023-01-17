const express = require("express");
const { createConversation, getUserConversation } = require("../controllers/conversationController");
const { isAuthenticatedUser } = require("../middleware/auth");

const router = express.Router();

router.route("/conversation").post(isAuthenticatedUser, createConversation);
router.route("/conversations/:userId").get(isAuthenticatedUser, getUserConversation);

module.exports = router;