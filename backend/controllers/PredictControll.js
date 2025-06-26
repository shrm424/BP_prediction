const Prediction = require("../models/PredicitonSchema");
const generateRecomendation = require("../utils/recommender")

const createPrediction = async (req, res) => {
  try {
    const {
      male,
      age,
      currentSmoker,
      cigsPerDay,
      BPMeds,
      diabetes,
      totChol,
      sysBP,
      diaBP,
      BMI,
      heartRate,
      glucose,
      prediction,
      model,        
      accuracy      
    } = req.body;

    const userId = req.user.id;

    const recommendation = await generateRecomendation({
      ...req.body,
      prediction: prediction > 0 ? "Risk" : "No Risk"
    });

    const newPrediction = new Prediction({
      male,
      age,
      currentSmoker,
      cigsPerDay,
      BPMeds,
      diabetes,
      totChol,
      sysBP,
      diaBP,
      BMI,
      heartRate,
      glucose,
      prediction,
      model,        
      accuracy,     
      recommendation,
      userId
    });

    const saved = await newPrediction.save();
    return res.status(201).json({
      message: "Successfully created a new prediction",
      data: { id: saved._id }
    });
  } catch (err) {
    console.error("Prediction failed:", err);
    return res.status(500).json({ msg: "Prediction failed", error: err.message });
  }
};


// Optional: get all predictions for admin or user
const getAllPredictions = async (req, res) => {
  try {
    const predictions = await Prediction.find().sort({ createdAt: -1 });
    return res.status(200).json(predictions);
  } catch (err) {
    return res.status(500).json({ msg: "Failed to fetch predictions" });
  }
};

getPredictionsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const predictions = await Prediction.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(predictions);
  } catch (err) {
    console.error("Prediction Fetch Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};




const getPredictionById = async (req, res) => {
  try {
    const { id } = req.params;

    const prediction = await Prediction.findById(id);

    if (!prediction) {
      return res.status(404).json({ msg: "Prediction not found" });
    }

    return res.status(200).json(prediction);
  } catch (error) {
    console.error("Error fetching prediction:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};


module.exports = {
  getPredictionById,
  createPrediction,
  getAllPredictions,
  getPredictionsByUser
};
