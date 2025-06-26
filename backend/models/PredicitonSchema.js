const mongoose = require('mongoose');

const PredictionSchema = new mongoose.Schema({
  male: { type: Number, required: true },
  age: { type: Number, required: true },
  currentSmoker: { type: Number, required: true },
  cigsPerDay: { type: Number, required: true },
  BPMeds: { type: Number, required: true },
  diabetes: { type: Number, required: true },
  totChol: { type: Number, required: true },
  sysBP: { type: Number, required: true },
  diaBP: { type: Number, required: true },
  BMI: { type: Number, required: true },
  heartRate: { type: Number, required: true },
  glucose: { type: Number, required: true },

  prediction: { type: Number, required: true },
  recommendation: { type: String, required: true }, 

  model: { type: String, required: true },       
  accuracy: { type: String, required: true },    


  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
}, { timestamps: true });

module.exports = mongoose.model('Prediction', PredictionSchema);
