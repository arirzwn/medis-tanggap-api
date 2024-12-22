const express = require('express');
const router = express.Router();
const symptomController = require('../controllers/SymptomsController');

// Mendefinisikan route untuk mengambil gejala
router.get('/symptoms', symptomController.getSymptoms);

module.exports = router;
