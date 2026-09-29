const express = require("express");

const router = express.Router();

// Authentication middleware
const authMiddleware = require("../middleware/authMiddleware");

// Swap controller functions
const {
    createSwapRequest,
    getIncomingRequests,
    getSentRequests,
    getSwapRequestById,
    acceptSwapRequest,
    rejectSwapRequest
} = require("../controllers/swapController");


// ==========================================
// CREATE SWAP REQUEST
// POST /api/swap
// ==========================================
router.post(
    "/",
    authMiddleware,
    createSwapRequest
);


// ==========================================
// GET INCOMING REQUESTS
// GET /api/swap/incoming
// ==========================================
router.get(
    "/incoming",
    authMiddleware,
    getIncomingRequests
);


// ==========================================
// GET SENT REQUESTS
// GET /api/swap/sent
// ==========================================
router.get(
    "/sent",
    authMiddleware,
    getSentRequests
);


// ==========================================
// GET SWAP REQUEST BY ID
// GET /api/swap/:id
// ==========================================
router.get(
    "/:id",
    authMiddleware,
    getSwapRequestById
);


// ==========================================
// ACCEPT SWAP REQUEST
// PUT /api/swap/:id/accept
// ==========================================
router.put(
    "/:id/accept",
    authMiddleware,
    acceptSwapRequest
);


// ==========================================
// REJECT SWAP REQUEST
// PUT /api/swap/:id/reject
// ==========================================
router.put(
    "/:id/reject",
    authMiddleware,
    rejectSwapRequest
);


module.exports = router;