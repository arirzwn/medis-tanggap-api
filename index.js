import express from 'express';
import dotenv from 'dotenv';
import db from './config/Database.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path'; // Mengimpor path untuk penanganan path file
import { fileURLToPath } from 'url'; // Mengimpor fileURLToPath untuk mendapatkan __dirname
import router from './routes/index.js'; // Mengimpor router untuk rute aplikasi

// Import all models
import Users from './models/UserModel.js';
import Clinic from './models/ClinicModel.js'; // Model Clinic
import Rujukan from './models/RujukanModel.js';

// Import routes
import ArticleRoute from './routes/ArticleRoutes.js'; // Import ArticleRoute
import RujukanRoute from './routes/RujukanRoutes.js'; // Import RujukanRoute
import ClinicRoute from './routes/ClinicRoutes.js'; // Import ClinicRoute

dotenv.config(); // Memuat variabel lingkungan dari file .env

const app = express();
const PORT = process.env.PORT || 5000;

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup middleware in correct order
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

const allowedOrigins = [
  'http://localhost:3000',
  'https://medis-tanggap-fe.vercel.app',
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Mengizinkan kredensial
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Middleware setup
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database initialization
(async () => {
  try {
    await db.authenticate();
    console.log('Database Connected...');
    // Hapus sync() di sini karena sudah ditangani di Database.js
  } catch (error) {
    console.error('Database initialization error:', error);
  }
})();

// Routes
app.use('/api', ArticleRoute);
app.use('/api', RujukanRoute);
app.use('/api', ClinicRoute);
app.use(router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
