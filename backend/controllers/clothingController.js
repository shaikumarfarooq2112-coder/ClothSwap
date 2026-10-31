const Clothing = require("../models/Clothing");

// CREATE CLOTHING
const createClothing = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            brand,
            size,
            condition,
            estimatedValue,
            city,
            state,
            images
        } = req.body;

        if (
            !title ||
            !description ||
            !category ||
            !brand ||
            !size ||
            !condition ||
            estimatedValue === undefined ||
            !city ||
            !state
        ) {
            return res.status(400).json({
                message: "Please provide all required clothing details"
            });
        }

        const uploadedImages = req.files
    ? req.files.map(file => `/uploads/${file.filename}`)
    : [];

const clothing = await Clothing.create({
    title,
    description,
    category,
    brand,
    size,
    condition,
    estimatedValue,
    images: uploadedImages,
    location: {
        city,
        state
    },
    owner: req.user.userId
});

        res.status(201).json({
            message: "Clothing listed successfully",
            clothing
        });

    } catch (error) {
       console.error("CREATE CLOTHING ERROR:", error);

       res.status(500).json({
           message: "Server error while creating clothing listing",
           error: error.message
        });
    }
};


// GET ALL CLOTHING
const getAllClothing = async (req, res) => {
    try {
        const clothing = await Clothing.find({
            status: "available"
        })
        .populate("owner", "name email location")
        .sort({ createdAt: -1 });

        res.json({
            count: clothing.length,
            clothing
        });

    } catch (error) {
        console.error("Get clothing error:", error);

        res.status(500).json({
            message: "Server error while fetching clothing"
        });
    }
};


// GET SINGLE CLOTHING
const getClothingById = async (req, res) => {
    try {
        const clothing = await Clothing.findById(req.params.id)
            .populate("owner", "name email location");

        if (!clothing) {
            return res.status(404).json({
                message: "Clothing item not found"
            });
        }

        res.json(clothing);

    } catch (error) {
        console.error("Get clothing by ID error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};



// UPDATE CLOTHING
const updateClothing = async (req, res) => {
    try {
        const clothing = await Clothing.findById(req.params.id);

        if (!clothing) {
            return res.status(404).json({
                message: "Clothing item not found"
            });
        }

        // Only owner can update
        if (clothing.owner.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "You can only update your own listing"
            });
        }

        // Update only the fields provided
        const allowedFields = [
            "title",
            "description",
            "category",
            "brand",
            "size",
            "condition",
            "estimatedValue"
        ];

        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                clothing[field] = req.body[field];
            }
        });

        // Update location only if provided
        if (req.body.city !== undefined) {
            clothing.location.city = req.body.city;
        }

        if (req.body.state !== undefined) {
            clothing.location.state = req.body.state;
        }

        // Add newly uploaded images without deleting old images
        if (req.files && req.files.length > 0) {
            const uploadedImages = req.files.map(
                file => `/uploads/${file.filename}`
            );

            clothing.images = [
                ...clothing.images,
                ...uploadedImages
            ];
        }

        await clothing.save();

        res.json({
            message: "Clothing listing updated successfully",
            clothing
        });

    } catch (error) {
        console.error("Update clothing error:", error);

        res.status(500).json({
            message: "Server error while updating clothing",
            error: error.message
        });
    }
};



// DELETE CLOTHING
const deleteClothing = async (req, res) => {
    try {
        const clothing = await Clothing.findById(req.params.id);

        if (!clothing) {
            return res.status(404).json({
                message: "Clothing item not found"
            });
        }

        // Only owner can delete
        if (clothing.owner.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "You can only delete your own listing"
            });
        }

        await clothing.deleteOne();

        res.json({
            message: "Clothing listing deleted successfully"
        });

    } catch (error) {
        console.error("Delete clothing error:", error);

        res.status(500).json({
            message: "Server error while deleting clothing"
        });
    }
};


module.exports = {
    createClothing,
    getAllClothing,
    getClothingById,
    updateClothing,
    deleteClothing
};