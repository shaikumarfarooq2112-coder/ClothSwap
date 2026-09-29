const express = require("express");

const {
    createClothing,
    getAllClothing,
    getClothingById,
    updateClothing,
    deleteClothing
} = require("../controllers/clothingController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const router = express.Router();

// Get all clothing
router.get("/", getAllClothing);

// Get one clothing item
router.get("/:id", getClothingById);

// Create clothing
router.post(
    "/",
    protect,
    upload.array("images", 5),
    createClothing
);
// Update clothing
router.put("/:id", protect, updateClothing);

// Delete clothing
router.delete("/:id", protect, deleteClothing);

module.exports = router;