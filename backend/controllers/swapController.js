const SwapRequest = require("../models/SwapRequest");
const Clothing = require("../models/Clothing");

// ==========================================
// CREATE SWAP REQUEST
// ==========================================
const createSwapRequest = async (req, res) => {
    try {
        const {
            receiver,
            offeredItem,
            requestedItem,
            message
        } = req.body;

        // Check required fields
        if (!receiver || !offeredItem || !requestedItem) {
            return res.status(400).json({
                message: "receiver, offeredItem and requestedItem are required"
            });
        }

        // Find requested clothing
        const requestedClothing = await Clothing.findById(requestedItem);

        if (!requestedClothing) {
            return res.status(404).json({
                message: "Requested clothing item not found"
            });
        }

        // Find offered clothing
        const offeredClothing = await Clothing.findById(offeredItem);

        if (!offeredClothing) {
            return res.status(404).json({
                message: "Offered clothing item not found"
            });
        }

        // Check offered item belongs to logged-in user
        if (
            offeredClothing.owner.toString() !==
            req.user.userId.toString()
        ) {
            return res.status(403).json({
                message: "You can only offer your own clothing item"
            });
        }

        // User cannot request their own item
        if (
            requestedClothing.owner.toString() ===
            req.user.userId.toString()
        ) {
            return res.status(400).json({
                message: "You cannot request your own clothing item"
            });
        }

        // Check receiver is actually the owner
        if (
            requestedClothing.owner.toString() !==
            receiver.toString()
        ) {
            return res.status(400).json({
                message: "Receiver must be the owner of the requested clothing item"
            });
        }

        // Check both items are available
        if (offeredClothing.status !== "available") {
            return res.status(400).json({
                message: "Your offered clothing item is not available"
            });
        }

        if (requestedClothing.status !== "available") {
            return res.status(400).json({
                message: "Requested clothing item is not available"
            });
        }

        // Create swap request
        const swapRequest = await SwapRequest.create({
            requester: req.user.userId,
            receiver: receiver,
            offeredItem: offeredItem,
            requestedItem: requestedItem,
            message: message || "",
            status: "pending"
        });

        // Return populated request
        const populatedRequest = await SwapRequest.findById(
            swapRequest._id
        )
            .populate("requester", "name email")
            .populate("receiver", "name email")
            .populate("offeredItem")
            .populate("requestedItem");

        res.status(201).json({
            message: "Swap request sent successfully",
            swapRequest: populatedRequest
        });

    } catch (error) {
        console.error(
            "Create swap request error:",
            error
        );

        res.status(500).json({
            message: "Failed to create swap request",
            error: error.message
        });
    }
};


// ==========================================
// GET INCOMING REQUESTS
// ==========================================
const getIncomingRequests = async (req, res) => {
    try {
        const requests = await SwapRequest.find({
            receiver: req.user.userId
        })
            .populate("requester", "name email location")
            .populate("receiver", "name email location")
            .populate("offeredItem")
            .populate("requestedItem")
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: requests.length,
            requests: requests
        });

    } catch (error) {
        console.error(
            "Get incoming requests error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch incoming requests",
            error: error.message
        });
    }
};


// ==========================================
// GET SENT REQUESTS
// ==========================================
const getSentRequests = async (req, res) => {
    try {
        const requests = await SwapRequest.find({
            requester: req.user.userId
        })
            .populate("requester", "name email location")
            .populate("receiver", "name email location")
            .populate("offeredItem")
            .populate("requestedItem")
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: requests.length,
            requests: requests
        });

    } catch (error) {
        console.error(
            "Get sent requests error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch sent requests",
            error: error.message
        });
    }
};


// ==========================================
// GET SWAP REQUEST BY ID
// GET /api/swap/:id
// ==========================================
const getSwapRequestById = async (req, res) => {
    try {
        const swapRequest = await SwapRequest.findById(req.params.id)
            .populate("requester", "name email location")
            .populate("receiver", "name email location")
            .populate("offeredItem")
            .populate("requestedItem");

        if (!swapRequest) {
            return res.status(404).json({
                message: "Swap request not found"
            });
        }

        const currentUserId = req.user.userId.toString();

        const requesterId =
            swapRequest.requester?._id?.toString() ||
            swapRequest.requester?.toString();

        const receiverId =
            swapRequest.receiver?._id?.toString() ||
            swapRequest.receiver?.toString();

        // Only users involved in this swap can view it
        if (
            requesterId !== currentUserId &&
            receiverId !== currentUserId
        ) {
            return res.status(403).json({
                message: "You are not part of this swap request"
            });
        }

        res.status(200).json({
            swapRequest
        });

    } catch (error) {
        console.error(
            "Get swap request by ID error:",
            error
        );

        res.status(500).json({
            message: "Failed to get swap request",
            error: error.message
        });
    }
};


// ==========================================
// ACCEPT SWAP REQUEST
// ==========================================
const acceptSwapRequest = async (req, res) => {
    try {
        const request = await SwapRequest.findOne({
            _id: req.params.id,
            receiver: req.user.userId
        });

        if (!request) {
            return res.status(404).json({
                message: "Swap request not found"
            });
        }

        // Make sure request is pending
        if (request.status !== "pending") {
            return res.status(400).json({
                message: `Request is already ${request.status}`
            });
        }

        // Accept request
        request.status = "accepted";

        await request.save();

        // Mark both clothes as swapped
        await Clothing.findByIdAndUpdate(
            request.offeredItem,
            {
                status: "swapped"
            }
        );

        await Clothing.findByIdAndUpdate(
            request.requestedItem,
            {
                status: "swapped"
            }
        );

        // Populate response
        const populatedRequest = await SwapRequest.findById(
            request._id
        )
            .populate("requester", "name email")
            .populate("receiver", "name email")
            .populate("offeredItem")
            .populate("requestedItem");

        res.status(200).json({
            message: "Swap request accepted",
            swapRequest: populatedRequest
        });

    } catch (error) {
        console.error(
            "Accept swap request error:",
            error
        );

        res.status(500).json({
            message: "Failed to accept swap request",
            error: error.message
        });
    }
};


// ==========================================
// REJECT SWAP REQUEST
// ==========================================
const rejectSwapRequest = async (req, res) => {
    try {
        const request = await SwapRequest.findOne({
            _id: req.params.id,
            receiver: req.user.userId
        });

        if (!request) {
            return res.status(404).json({
                message: "Swap request not found"
            });
        }

        // Make sure request is pending
        if (request.status !== "pending") {
            return res.status(400).json({
                message: `Request is already ${request.status}`
            });
        }

        // Reject request
        request.status = "rejected";

        await request.save();

        res.status(200).json({
            message: "Swap request rejected",
            swapRequest: request
        });

    } catch (error) {
        console.error(
            "Reject swap request error:",
            error
        );

        res.status(500).json({
            message: "Failed to reject swap request",
            error: error.message
        });
    }
};


// ==========================================
// EXPORT ALL FUNCTIONS
// ==========================================
module.exports = {
    createSwapRequest,
    getIncomingRequests,
    getSentRequests,
    getSwapRequestById,
    acceptSwapRequest,
    rejectSwapRequest
};