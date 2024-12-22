import { Sequelize } from 'sequelize';
import mysql2 from 'mysql2'; 

// Konfigurasi database menggunakan kredensial Files.io
const db = new Sequelize('medisTanggap_sittinglay', 'medisTanggap_sittinglay', '60400aa4d164231be1b7e96ee1d4e1dd3043c6bd', {
  host: 'j6osw.h.filess.io',
  dialect: 'mysql',
  port: 3306, // Port default MySQL
  logging: false, // Nonaktifkan logging query
  dialectModule: mysql2,
});

// Function to initialize database
const initializeDatabase = async () => {
  try {
    await db.authenticate(); // Tes koneksi ke database
    console.log('Database connection established.');

    // Sinkronisasi model dengan database
    await db.sync({
      force: false, // Tidak overwrite tabel yang ada
      alter: true,  // Update tabel sesuai model
    });

    console.log('Database connection verified successfully!');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

// Initialize database
initializeDatabase().catch((error) => {
  console.error('Failed to initialize database:', error);
});

export default db;
