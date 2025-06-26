const mongoose = require('mongoose');

const hypertensionRiskSchema = new mongoose.Schema({
  male: Number,
  age: Number,
  currentSmoker: Number,
  cigsPerDay: Number,
  BPMeds: Number,
  diabetes: Number,
  totChol: Number,
  sysBP: Number,
  diaBP: Number,
  BMI: Number,
  heartRate: Number,
  glucose: Number,
  Risk: Number
}, { collection: 'hypertension_risks' });

module.exports = mongoose.model('HypertensionRisk', hypertensionRiskSchema);
