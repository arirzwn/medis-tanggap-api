import { Sequelize } from 'sequelize';
import db from '../config/Database.js';

const { DataTypes } = Sequelize;

const Rujukan = db.define(
  'rujukan',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    no_rujukan: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'Nomor rujukan sudah digunakan',
      },
      validate: {
        notEmpty: {
          msg: 'Nomor rujukan tidak boleh kosong',
        },
      },
    },
    tanggal: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    rs_tujuan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    no_kartu: {
      // NIK
      type: DataTypes.STRING,
      allowNull: false,
    },
    name_patient: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM('Laki-laki', 'Perempuan'),
      allowNull: false,
    },
    birthday_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    diagnosis: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    doctor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Rujukan;
