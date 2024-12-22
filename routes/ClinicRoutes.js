import express from 'express';
import upload from '../middleware/multerConfig.js';
import { addClinic, getClinics,handleAccept,rejectClinic,getDetailPengajuan   } from '../controllers/ClinicController.js';

const router = express.Router();

router.post('/add', upload, addClinic);
router.get('/clinics', getClinics);
router.put('/clinics/accept/:clinicId', handleAccept); 
router.delete('/clinics/reject/:clinicId', rejectClinic);
router.get('/detail-pengajuan/:id', getDetailPengajuan);
export default router;
