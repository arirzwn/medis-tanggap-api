import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Membuat folder 'uploads/' jika belum ada
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Folder penyimpanan file
  },
  filename: (req, file, cb) => {
    // Menambahkan timestamp agar nama file unik
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// Filter untuk memeriksa tipe file yang diizinkan
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']; // Jenis file yang diterima
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // File diterima
  } else {
    cb(new Error('Tipe file tidak valid. Hanya JPEG, PNG, dan PDF yang diperbolehkan.'), false); // File ditolak
  }
};

// Batas ukuran file maksimum (5MB)
const maxSize = 5 * 1024 * 1024; // 5MB

// Inisialisasi middleware multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: maxSize },
}).fields([
  { name: 'ktp_owner', maxCount: 1 }, // Nama field untuk KTP
  { name: 'operation_license', maxCount: 1 }, // Nama field untuk Surat Izin
  { name: 'images', maxCount: 1 }, // Nama field untuk Gambar (maksimal 5 file)
]);

// Ekspor middleware untuk digunakan di router
export default upload;
