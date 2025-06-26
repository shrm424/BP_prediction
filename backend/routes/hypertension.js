const express = require('express');
const router = express.Router();
const HypertensionRisk = require('../models/HypertensionRisk');

router.get('/all', async (req, res) => {
  try {
    const risks = await HypertensionRisk.find({});
    res.json(risks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch data' });
  }
});

module.exports = router;
