const Clothing = require("../models/Clothing");

// ==========================================
// CALCULATE SWAP VALUE
// ==========================================
const calculateSwapValue = async (req, res) => {
    try {
        const {
            brand,
            category,
            condition,
            estimatedValue
        } = req.body;

        let value = Number(estimatedValue) || 0;

        // Brand adjustment
        const premiumBrands = [
            "Nike",
            "Adidas",
            "Levi's",
            "Puma",
            "Zara",
            "H&M"
        ];

        if (premiumBrands.includes(brand)) {
            value = value * 1.10;
        }

        // Condition adjustment
        if (condition === "Good") {
            value = value * 0.90;
        } else if (condition === "Fair") {
            value = value * 0.70;
        } else if (condition === "Poor") {
            value = value * 0.40;
        }

        // Category adjustment
        const premiumCategories = [
            "Jackets",
            "Dresses",
            "Sportswear"
        ];

        if (premiumCategories.includes(category)) {
            value = value * 1.05;
        }

        value = Math.round(value);

        res.json({
            message: "Swap value calculated successfully",
            details: {
                brand,
                category,
                condition
            },
            estimatedSwapValue: value
        });

    } catch (error) {
        console.error("Swap value error:", error);

        res.status(500).json({
            message: "Failed to calculate swap value",
            error: error.message
        });
    }
};


// ==========================================
// COMPARE TWO CLOTHING ITEMS
// ==========================================
const compareSwapValues = async (req, res) => {
    try {
        const {
            offeredItem,
            requestedItem
        } = req.body;

        const offered = await Clothing.findById(offeredItem);
        const requested = await Clothing.findById(requestedItem);

        if (!offered || !requested) {
            return res.status(404).json({
                message: "One or both clothing items not found"
            });
        }

        const offeredValue = Number(
            offered.estimatedValue
        );

        const requestedValue = Number(
            requested.estimatedValue
        );

        const difference =
            Math.abs(offeredValue - requestedValue);

        let recommendation;

        if (difference <= 500) {
            recommendation = "Fair swap";
        } else if (offeredValue > requestedValue) {
            recommendation =
                "Offered item has higher value";
        } else {
            recommendation =
                "Requested item has higher value";
        }

        res.json({
            message: "Swap values compared successfully",

            offeredItem: {
                title: offered.title,
                estimatedValue: offeredValue
            },

            requestedItem: {
                title: requested.title,
                estimatedValue: requestedValue
            },

            valueDifference: difference,

            recommendation
        });

    } catch (error) {
        console.error(
            "Compare swap values error:",
            error
        );

        res.status(500).json({
            message: "Failed to compare swap values",
            error: error.message
        });
    }
};


module.exports = {
    calculateSwapValue,
    compareSwapValues
};