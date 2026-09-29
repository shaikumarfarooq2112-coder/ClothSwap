const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
    getAdminDashboard,
    getAllUsers,
    getAllListings,
    removeListing,
    getAllSwapRequests
} = require("../controllers/adminController");

router.get(
    "/dashboard",
    authMiddleware,
    adminMiddleware,
    getAdminDashboard
);

router.get(
    "/users",
    authMiddleware,
    adminMiddleware,
    getAllUsers
);

router.get(
    "/listings",
    authMiddleware,
    adminMiddleware,
    getAllListings
);

router.delete(
    "/listings/:id",
    authMiddleware,
    adminMiddleware,
    removeListing
);

router.get(
    "/swaps",
    authMiddleware,
    adminMiddleware,
    getAllSwapRequests
);

module.exports = router;