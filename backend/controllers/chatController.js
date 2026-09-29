const Chat = require("../models/Chat");
const SwapRequest = require("../models/SwapRequest");

// ==========================================
// SEND MESSAGE
// POST /api/chat
// ==========================================
const sendMessage = async (req, res) => {
    try {
        const {
            receiver,
            swapRequest,
            message
        } = req.body;

        // Check required fields
        if (!receiver || !swapRequest || !message) {
            return res.status(400).json({
                message: "receiver, swapRequest and message are required"
            });
        }

        // Check swap request
        const request = await SwapRequest.findById(swapRequest);

        if (!request) {
            return res.status(404).json({
                message: "Swap request not found"
            });
        }

        // Only users involved in the swap can chat
        const currentUser = req.user.userId.toString();

        if (
            request.requester.toString() !== currentUser &&
            request.receiver.toString() !== currentUser
        ) {
            return res.status(403).json({
                message: "You are not part of this swap"
            });
        }

        // Check receiver belongs to this swap
        if (
            request.requester.toString() !== receiver &&
            request.receiver.toString() !== receiver
        ) {
            return res.status(403).json({
                message: "Invalid receiver"
            });
        }

        // Create message
        const chat = await Chat.create({
            sender: req.user.userId,
            receiver,
            swapRequest,
            message
        });

        // Return populated message
        const populatedChat = await Chat.findById(chat._id)
            .populate("sender", "name email")
            .populate("receiver", "name email");

        res.status(201).json({
            message: "Message sent successfully",
            chat: populatedChat
        });

    } catch (error) {
        console.error("Send message error:", error);

        res.status(500).json({
            message: "Failed to send message",
            error: error.message
        });
    }
};


// ==========================================
// GET CHAT MESSAGES
// GET /api/chat/:swapRequestId
// ==========================================
const getMessages = async (req, res) => {
    try {
        const swapRequestId = req.params.swapRequestId;

        // Find swap request
        const request = await SwapRequest.findById(
            swapRequestId
        );

        if (!request) {
            return res.status(404).json({
                message: "Swap request not found"
            });
        }

        // Only requester or receiver can view chat
        const currentUser = req.user.userId.toString();

        if (
            request.requester.toString() !== currentUser &&
            request.receiver.toString() !== currentUser
        ) {
            return res.status(403).json({
                message: "You are not part of this swap"
            });
        }

        // Get messages
        const messages = await Chat.find({
            swapRequest: swapRequestId
        })
            .populate("sender", "name email")
            .populate("receiver", "name email")
            .sort({ createdAt: 1 });

        res.status(200).json({
            count: messages.length,
            messages
        });

    } catch (error) {
        console.error("Get messages error:", error);

        res.status(500).json({
            message: "Failed to fetch messages",
            error: error.message
        });
    }
};


// ==========================================
// MARK MESSAGE AS READ
// PUT /api/chat/:id/read
// ==========================================
const markAsRead = async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.id);

        if (!chat) {
            return res.status(404).json({
                message: "Message not found"
            });
        }

        // Only receiver can mark message as read
        if (
            chat.receiver.toString() !==
            req.user.userId.toString()
        ) {
            return res.status(403).json({
                message: "Only the receiver can mark this message as read"
            });
        }

        chat.read = true;

        await chat.save();

        res.json({
            message: "Message marked as read",
            chat
        });

    } catch (error) {
        console.error("Mark read error:", error);

        res.status(500).json({
            message: "Failed to mark message as read",
            error: error.message
        });
    }
};


module.exports = {
    sendMessage,
    getMessages,
    markAsRead
};