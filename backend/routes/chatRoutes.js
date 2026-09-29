const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    sendMessage,
    getMessages,
    markAsRead
} = require("../controllers/chatController");


// Send message
router.post(
    "/",
    authMiddleware,
    sendMessage
);


// Get messages for a swap
router.get(
    "/:swapRequestId",
    authMiddleware,
    getMessages
);


// Mark message as read
router.put(
    "/:id/read",
    authMiddleware,
    markAsRead
);


module.exports = router;