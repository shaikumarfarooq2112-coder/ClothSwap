const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const clothingRoutes = require("./routes/clothingRoutes");
const swapRoutes = require("./routes/swapRoutes");
const chatRoutes = require("./routes/chatRoutes");
const swapValueRoutes = require("./routes/swapValueRoutes");
const locationRoutes = require("./routes/locationRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const adminRoutes = require("./routes/adminRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/clothing", clothingRoutes);
app.use("/api/swap", swapRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/swap-value", swapValueRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Clothing Swap Marketplace API is running"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});