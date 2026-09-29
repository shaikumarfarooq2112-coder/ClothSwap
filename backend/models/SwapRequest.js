const mongoose = require("mongoose");

const swapRequestSchema = new mongoose.Schema(
    {
        // User who sends the swap request
        requester: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // User who receives the swap request
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // Clothing item offered by requester
        offeredItem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Clothing",
            required: true
        },

        // Clothing item requested from receiver
        requestedItem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Clothing",
            required: true
        },

        // Optional message
        message: {
            type: String,
            trim: true,
            maxlength: 500,
            default: ""
        },

        // Swap request status
        status: {
            type: String,
            enum: [
                "pending",
                "accepted",
                "rejected",
                "cancelled"
            ],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("SwapRequest", swapRequestSchema);