import { DataTypes, Sequelize } from 'sequelize';
import db from '../config/Database.js';

// Ensure the phone column type is STRING
const Users = db.define(
  'users',
  {
    name: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    refresh_token: {
      type: DataTypes.TEXT,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'user', // 'user' or 'admin'
      allowNull: false,
    },
    images: {
      type: DataTypes.STRING, // Kolom untuk menyimpan URL atau nama file gambar
      allowNull: true, // Kolom ini opsional, bisa kosong
    },
  },
  {
    freezeTableName: true,
  }
);

export default Users;
