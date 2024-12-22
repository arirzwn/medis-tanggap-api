import { DataTypes } from 'sequelize';
import db from '../config/Database.js'; // Mengimpor koneksi database dari config
import User from './UserModel.js'; // Mengimpor model User

// Mendefinisikan model 'Clinic' dengan tabel 'clinics' (jamak)
const Clinic = db.define(
  'Clinic', // Nama model (tidak jamak)
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Menandakan ini adalah primary key
      autoIncrement: true, // ID akan bertambah otomatis
    },
    clinic_name: {
      type: DataTypes.STRING, // Kolom untuk nama klinik
      allowNull: false, // Kolom ini tidak boleh kosong
    },
    address: {
      type: DataTypes.TEXT, // Kolom untuk alamat klinik
      allowNull: false, // Kolom ini tidak boleh kosong
    },
    ktp_owner: {
      type: DataTypes.STRING, // Kolom untuk nama file gambar KTP penanggung jawab
      allowNull: false, // Kolom ini tidak boleh kosong
    },
    operation_license: {
      type: DataTypes.STRING, // Kolom untuk nama file gambar surat izin operasi
      allowNull: false, // Kolom ini tidak boleh kosong
    },
    user_id: {
      type: DataTypes.INTEGER, // Foreign key ke tabel 'users'
      allowNull: false, // Tidak boleh kosong
      references: {
        model: User, // Referensi ke model User
        key: 'id', // Mengacu pada kolom 'id' di tabel users
      },
      onUpdate: 'CASCADE', // Aksi jika FK diperbarui
      onDelete: 'CASCADE', // Aksi jika FK dihapus
    },
  },
  {
    tableName: 'clinics', // Menetapkan nama tabel ke bentuk jamak (clinics)
    freezeTableName: true, // Menjaga agar nama tabel tidak berubah
    timestamps: true, // Menambahkan kolom 'createdAt' dan 'updatedAt' otomatis
  }
);

// Relasi antara Clinic dan User (many-to-one)
Clinic.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

export default Clinic; // Mengekspor model Clinic
