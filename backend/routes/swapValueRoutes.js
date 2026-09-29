const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    calculateSwapValue,
    compareSwapValues
} = require("../controllers/swapValueController");


// Calculate estimated value
router.post(
    "/calculate",
    authMiddleware,
    calculateSwapValue
);


// Compare two clothing items
router.post(
    "/compare",
    authMiddleware,
    compareSwapValues
);


module.exports = router;