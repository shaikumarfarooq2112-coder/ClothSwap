const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    getDashboard
} = require("../controllers/dashboardController");

// Get logged-in user's dashboard
router.get(
    "/",
    authMiddleware,
    getDashboard
);

module.exports = router;