const User = require("../models/User");
const Clothing = require("../models/Clothing");
const SwapRequest = require("../models/SwapRequest");

// ==========================================
// GET ADMIN DASHBOARD
// ==========================================
const getAdminDashboard = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();

        const totalListings = await Clothing.countDocuments();

        const availableListings = await Clothing.countDocuments({
            status: "available"
        });

        const swappedListings = await Clothing.countDocuments({
            status: "swapped"
        });

        const totalSwapRequests = await SwapRequest.countDocuments();

        const pendingRequests = await SwapRequest.countDocuments({
            status: "pending"
        });

        const acceptedRequests = await SwapRequest.countDocuments({
            status: "accepted"
        });

        const rejectedRequests = await SwapRequest.countDocuments({
            status: "rejected"
        });

        res.json({
            message: "Admin dashboard loaded successfully",

            statistics: {
                totalUsers,
                totalListings,
                availableListings,
                swappedListings,
                totalSwapRequests,
                pendingRequests,
                acceptedRequests,
                rejectedRequests
            }
        });

    } catch (error) {
        console.error("Admin dashboard error:", error);

        res.status(500).json({
            message: "Failed to load admin dashboard",
            error: error.message
        });
    }
};


// ==========================================
// GET ALL USERS
// ==========================================
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.json({
            count: users.length,
            users
        });

    } catch (error) {
        console.error("Get users error:", error);

        res.status(500).json({
            message: "Failed to fetch users",
            error: error.message
        });
    }
};


// ==========================================
// GET ALL CLOTHING LISTINGS
// ==========================================
const getAllListings = async (req, res) => {
    try {
        const listings = await Clothing.find()
            .populate("owner", "name email location")
            .sort({ createdAt: -1 });

        res.json({
            count: listings.length,
            listings
        });

    } catch (error) {
        console.error("Get listings error:", error);

        res.status(500).json({
            message: "Failed to fetch listings",
            error: error.message
        });
    }
};


// ==========================================
// REMOVE CLOTHING LISTING
// ==========================================
const removeListing = async (req, res) => {
    try {
        const listing = await Clothing.findById(req.params.id);

        if (!listing) {
            return res.status(404).json({
                message: "Clothing listing not found"
            });
        }

        await listing.deleteOne();

        res.json({
            message: "Clothing listing removed successfully"
        });

    } catch (error) {
        console.error("Remove listing error:", error);

        res.status(500).json({
            message: "Failed to remove listing",
            error: error.message
        });
    }
};


// ==========================================
// GET ALL SWAP REQUESTS
// ==========================================
const getAllSwapRequests = async (req, res) => {
    try {
        const requests = await SwapRequest.find()
            .populate("requester", "name email")
            .populate("receiver", "name email")
            .populate("offeredItem")
            .populate("requestedItem")
            .sort({ createdAt: -1 });

        res.json({
            count: requests.length,
            requests
        });

    } catch (error) {
        console.error("Get swap requests error:", error);

        res.status(500).json({
            message: "Failed to fetch swap requests",
            error: error.message
        });
    }
};


module.exports = {
    getAdminDashboard,
    getAllUsers,
    getAllListings,
    removeListing,
    getAllSwapRequests
};