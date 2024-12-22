import express from 'express';
import {
  getRujukan,
  getRujukanById,
  createRujukan,
  updateRujukan,
  deleteRujukan,
  getTodayRujukanCount,
  getTotalRujukan
} from '../controllers/RujukanController.js';

const router = express.Router();

router.get('/rujukan/count/today', getTodayRujukanCount);
router.get('/rujukan', getRujukan);
router.get('/rujukan/:id', getRujukanById);
router.post('/rujukan', createRujukan);
router.patch('/rujukan/:id', updateRujukan);
router.delete('/rujukan/:id', deleteRujukan);
router.get("/total-rujukan", getTotalRujukan);

export default router;
