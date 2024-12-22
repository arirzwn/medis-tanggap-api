import { DataTypes } from 'sequelize';
import db from '../config/Database.js'; // Mengimpor koneksi database dari config

// Mendefinisikan model 'Result' dengan tabel yang disebut 'results' (jamak)
const Result = db.define(
  'Result', // Nama model tidak jamak
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,  // Menandakan ini adalah primary key
      autoIncrement: true, // ID akan bertambah otomatis
    },
    disease: {
      type: DataTypes.STRING, // Kolom untuk nama penyakit
      allowNull: false, // Kolom ini tidak boleh kosong
    },
    explanation: {
      type: DataTypes.TEXT,  // Kolom untuk penjelasan penyakit
      allowNull: false, // Kolom ini tidak boleh kosong
    },
    treatment: {
      type: DataTypes.TEXT,  // Kolom untuk pengobatan
      allowNull: false, // Kolom ini tidak boleh kosong
    },
  },
  {
    tableName: 'results',  // Menetapkan nama tabel ke bentuk jamak (results)
    freezeTableName: true,  // Menjaga agar nama tabel tidak berubah (tidak menjadi 'Result' atau 'Results')
  }
);

export default Result; // Mengekspor model Result
