const mongoose = require("mongoose");

const clothingSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true,
            enum: [
                "T-Shirts",
                "Shirts",
                "Jeans",
                "Trousers",
                "Dresses",
                "Jackets",
                "Sweaters",
                "Skirts",
                "Ethnic Wear",
                "Sportswear",
                "Other"
            ]
        },

        brand: {
            type: String,
            required: true,
            trim: true
        },

        size: {
            type: String,
            required: true
        },

        condition: {
            type: String,
            required: true,
            enum: [
                "New",
                "Like New",
                "Good",
                "Fair"
            ]
        },

        estimatedValue: {
            type: Number,
            required: true,
            min: 0
        },

        images: {
            type: [String],
            default: []
        },

        location: {
            city: {
                type: String,
                required: true
            },

            state: {
                type: String,
                required: true
            }
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        status: {
            type: String,
            enum: [
                "available",
                "pending",
                "swapped"
            ],
            default: "available"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Clothing", clothingSchema);