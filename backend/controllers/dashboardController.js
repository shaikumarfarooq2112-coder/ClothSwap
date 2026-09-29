const User = require("../models/User");
const Clothing = require("../models/Clothing");
const SwapRequest = require("../models/SwapRequest");

// ==========================================
// USER DASHBOARD
// ==========================================
const getDashboard = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.id;

        // Get user
        const user = await User.findById(userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // User's clothing listings
        const myClothing = await Clothing.find({
            owner: userId
        }).sort({ createdAt: -1 });

        // Sent swap requests
        const sentRequests = await SwapRequest.find({
            requester: userId
        })
            .populate("receiver", "name email")
            .populate("offeredItem")
            .populate("requestedItem")
            .sort({ createdAt: -1 });

        // Incoming swap requests
        const incomingRequests = await SwapRequest.find({
            receiver: userId
        })
            .populate("requester", "name email")
            .populate("offeredItem")
            .populate("requestedItem")
            .sort({ createdAt: -1 });

        // Statistics
        const totalListings = myClothing.length;

        const availableListings = myClothing.filter(
            item => item.status === "available"
        ).length;

        const swappedListings = myClothing.filter(
            item => item.status === "swapped"
        ).length;

        const pendingSentRequests = sentRequests.filter(
            request => request.status === "pending"
        ).length;

        const pendingIncomingRequests = incomingRequests.filter(
            request => request.status === "pending"
        ).length;

        const acceptedSwaps = sentRequests.filter(
            request => request.status === "accepted"
        ).length;

        res.json({
            message: "Dashboard data fetched successfully",

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                location: user.location,
                role: user.role
            },

            statistics: {
                totalListings,
                availableListings,
                swappedListings,
                pendingSentRequests,
                pendingIncomingRequests,
                acceptedSwaps
            },

            myClothing,

            sentRequests,

            incomingRequests
        });

    } catch (error) {
        console.error("Dashboard error:", error);

        res.status(500).json({
            message: "Failed to load dashboard",
            error: error.message
        });
    }
};

module.exports = {
    getDashboard
};