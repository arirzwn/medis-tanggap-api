import express from 'express';
import {
  getUsers,
  Register,
  Login,
  Logout,
  getUsersByRoleClinic,
  deleteClinic,
  getClinicDetail,
  updateUserData,
  updateProfile, getUser // Add this import
} from '../controllers/Users.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { refreshToken } from '../controllers/RefreshToken.js';
import { getSymptoms } from '../controllers/SymptomsController.js';
import upload from '../middleware/multerConfig.js';
import {
  getResults,
  createResult,
  getResultById,
} from '../controllers/ResultsController.js';
import Users from '../models/UserModel.js';

const router = express.Router();

// User Routes
router.get('/users', verifyToken, getUsers);
router.post('/users', Register);
router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);
router.get('/users/clinic', getUsersByRoleClinic);
router.delete('/users/clinic/:id', deleteClinic);
router.get('/users/clinic/:id', getClinicDetail);
router.put('/user/:id', upload, updateUserData);
router.put('/profile/update', verifyToken, upload, updateProfile);
router.get('/users/:id', getUser);
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await Users.findOne({
      where: {
        email: req.email,
      },
      attributes: ['id', 'name', 'email', 'phone', 'role'], // Include role
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error in /me endpoint:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Symptom Routes
router.get('/symptoms', getSymptoms); // Route untuk mengambil data gejala

// Result Routes
router.get('/results', getResults); // Route untuk mengambil semua hasil diagnosa
router.get('/results/:id', getResultById); // Route untuk mengambil hasil diagnosa berdasarkan ID

export default router;
