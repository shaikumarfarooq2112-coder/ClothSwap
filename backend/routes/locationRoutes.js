const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    getNearbyClothing,
    getLocationMatches
} = require("../controllers/locationController");


// Find clothing by city/state
router.get(
    "/nearby",
    authMiddleware,
    getNearbyClothing
);


// Find clothing by location + category
router.get(
    "/matches",
    authMiddleware,
    getLocationMatches
);


module.exports = router;