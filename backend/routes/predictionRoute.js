const express = require("express");
const router = express.Router();

const {
  createPrediction,
  getAllPredictions,
  getPredictionsByUser,
  getPredictionById
} = require("../controllers/PredictControll");
const { authenticateUser } = require("../middleware/authMiddleware");
const Prediction = require("../models/PredicitonSchema");


router.post("/", authenticateUser, createPrediction);

router.get("/user/:userId", getPredictionsByUser);

// Step 1: STATS route (muhiim u ah charts)
router.get("/stats", async (req, res) => {
  try {
    const all = await Prediction.find();

    const stats = {
      total: all.length,
      highRisk: all.filter(p => p.prediction === 1).length,
      lowRisk: all.filter(p => p.prediction === 0).length,
      male: all.filter(p => p.male === 1).length,
      female: all.filter(p => p.male === 0).length,
      smokers: all.filter(p => p.currentSmoker === 1).length,
      nonSmokers: all.filter(p => p.currentSmoker === 0).length,
      avgAge: (all.reduce((acc, p) => acc + p.age, 0) / all.length).toFixed(1),
      avgBMI: (all.reduce((acc, p) => acc + p.BMI, 0) / all.length).toFixed(1),
      avgGlucose: (all.reduce((acc, p) => acc + p.glucose, 0) / all.length).toFixed(1),
      avgHeartRate: (all.reduce((acc, p) => acc + p.heartRate, 0) / all.length).toFixed(1)
    };

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch prediction statistics" });
  }
});



router.get("/me", authenticateUser, getPredictionsByUser); //user prediction route 


router.get("/all", getAllPredictions);

router.get("/:id", getPredictionById);


// router.get("/user/:userId", getPredictionsByUser);

module.exports = router;
