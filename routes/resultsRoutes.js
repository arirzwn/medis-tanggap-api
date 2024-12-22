import express from 'express';
import { getResults, getResultById, createResult } from '../controllers/resultController.js';

const router = express.Router();

// Rute untuk mendapatkan semua hasil diagnosa
router.get('/results', getResults);

// Rute untuk mendapatkan hasil diagnosa berdasarkan ID
router.get('/results/:id', getResultById);

// Rute untuk membuat hasil diagnosa baru
router.post('/results', createResult);

export default router;
