// models/SymptomModel.js
import { DataTypes } from 'sequelize';
import db from '../config/Database.js';

const Symptom = db.define(
  'symptom', // Nama model tidak jamak (Singular)
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: false, // Nama tabel akan menjadi jamak (symptoms)
  }
);

export default Symptom;
