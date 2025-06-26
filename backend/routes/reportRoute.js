const express = require("express");
const router = express.Router();
const Prediction = require("../models/PredicitonSchema");
const User = require("../models/User");

// 🔹 GET Daily and Monthly Overview
router.get("/overview", async (req, res) => {
    try {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        const dailyPredictions = await Prediction.countDocuments({ createdAt: { $gte: today } });
        const monthlyPredictions = await Prediction.countDocuments({ createdAt: { $gte: monthStart } });

        const dailyUsers = await User.countDocuments({ createdAt: { $gte: today } });
        const monthlyUsers = await User.countDocuments({ createdAt: { $gte: monthStart } });

        res.json({
            dailyPredictions,
            monthlyPredictions,
            dailyUsers,
            monthlyUsers,
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to get overview" });
    }
});

// 🔹 GET Daily Prediction Report
router.get("/predictions/daily", async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const predictions = await Prediction.find({ createdAt: { $gte: today } }).populate("userId", "username email");
    res.json(predictions);
});

// 🔹 GET Monthly Prediction Report
router.get("/predictions/monthly", async (req, res) => {
    const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const predictions = await Prediction.find({ createdAt: { $gte: firstDay } }).populate("userId", "username email");
    res.json(predictions);
});


module.exports = router;
