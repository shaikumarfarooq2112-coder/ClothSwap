const Clothing = require("../models/Clothing");

// ==========================================
// FIND CLOTHES BY LOCATION
// ==========================================
const getNearbyClothing = async (req, res) => {
    try {
        const { city, state } = req.query;

        if (!city && !state) {
            return res.status(400).json({
                message: "Please provide city or state"
            });
        }

        const filter = {
            status: "available"
        };

        // City filter
        if (city) {
            filter["location.city"] = {
                $regex: city,
                $options: "i"
            };
        }

        // State filter
        if (state) {
            filter["location.state"] = {
                $regex: state,
                $options: "i"
            };
        }

        const clothing = await Clothing.find(filter)
            .populate("owner", "name email location")
            .sort({ createdAt: -1 });

        res.json({
            message: "Nearby clothing found successfully",
            count: clothing.length,
            clothing
        });

    } catch (error) {
        console.error("Location search error:", error);

        res.status(500).json({
            message: "Failed to find nearby clothing",
            error: error.message
        });
    }
};


// ==========================================
// FIND CLOTHES BY CATEGORY + LOCATION
// ==========================================
const getLocationMatches = async (req, res) => {
    try {
        const {
            city,
            state,
            category
        } = req.query;

        const filter = {
            status: "available"
        };

        if (city) {
            filter["location.city"] = {
                $regex: city,
                $options: "i"
            };
        }

        if (state) {
            filter["location.state"] = {
                $regex: state,
                $options: "i"
            };
        }

        if (category) {
            filter.category = {
                $regex: category,
                $options: "i"
            };
        }

        const clothing = await Clothing.find(filter)
            .populate("owner", "name email location")
            .sort({ createdAt: -1 });

        res.json({
            message: "Location matches found successfully",
            count: clothing.length,
            clothing
        });

    } catch (error) {
        console.error("Location match error:", error);

        res.status(500).json({
            message: "Failed to find location matches",
            error: error.message
        });
    }
};


module.exports = {
    getNearbyClothing,
    getLocationMatches
};