import Rujukan from '../models/RujukanModel.js';
import { Op } from 'sequelize';

export const getRujukan = async (req, res) => {
  try {
    const rujukan = await Rujukan.findAll();
    res.json(rujukan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTotalRujukan = async (req, res) => {
  try {
    // Menghitung total rujukan
    const totalRujukan = await Rujukan.count();
    // Mengembalikan jumlah total rujukan sebagai JSON
    res.json({ total: totalRujukan });
  } catch (error) {
    // Menangani error dan mengembalikan pesan kesalahan
    res.status(500).json({ message: error.message });
  }
};


export const getRujukanById = async (req, res) => {
  try {
    const rujukan = await Rujukan.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (rujukan) {
      res.json(rujukan);
    } else {
      res.status(404).json({ message: 'Rujukan not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const generateRujukanNumber = async () => {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');

  const lastRujukan = await Rujukan.findOne({
    where: {
      createdAt: {
        [Op.gte]: new Date(today.setHours(0, 0, 0, 0)),
      },
    },
    order: [['createdAt', 'DESC']],
  });

  const sequence = lastRujukan
    ? parseInt(lastRujukan.no_rujukan.split('-')[1]) + 1
    : 1;
  return `RJ${dateStr}-${String(sequence).padStart(4, '0')}`;
};

export const createRujukan = async (req, res) => {
  try {
    const data = req.body;
    console.log('Received data in controller:', data);

    // Generate unique rujukan number
    data.no_rujukan = await generateRujukanNumber();

    // Validate data structure
    const requiredFields = [
      'no_rujukan',
      'tanggal',
      'rs_tujuan',
      'no_kartu',
      'name_patient',
      'gender',
      'birthday_date',
      'address',
      'diagnosis',
      'doctor',
    ];

    const missingFields = requiredFields.filter((field) => !data[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(', ')}`,
      });
    }

    // Clean and validate the data
    const cleanData = {
      no_rujukan: data.no_rujukan.trim(),
      tanggal: new Date(data.tanggal).toISOString().split('T')[0],
      rs_tujuan: data.rs_tujuan.trim(),
      no_kartu: data.no_kartu.trim(),
      name_patient: data.name_patient.trim(),
      gender: data.gender,
      birthday_date: new Date(data.birthday_date).toISOString().split('T')[0],
      address: data.address.trim(),
      diagnosis: data.diagnosis.trim(),
      description: data.description ? data.description.trim() : null,
      doctor: data.doctor.trim(),
    };

    // Additional validation
    if (!['Laki-laki', 'Perempuan'].includes(cleanData.gender)) {
      return res.status(400).json({
        message: 'Gender must be either "Laki-laki" or "Perempuan"',
      });
    }

    // Log the cleaned data
    console.log('Creating rujukan with data:', cleanData);

    const rujukan = await Rujukan.create(cleanData);

    return res.status(201).json({
      message: 'Rujukan Created',
      data: rujukan,
    });
  } catch (error) {
    console.error('Detailed error:', error);
    return res.status(400).json({
      message: `Error creating rujukan: ${error.message}`,
      details: error.errors?.map((e) => e.message),
    });
  }
};

export const updateRujukan = async (req, res) => {
  try {
    // Get existing rujukan first
    const existingRujukan = await Rujukan.findOne({
      where: { id: req.params.id },
    });

    if (!existingRujukan) {
      return res.status(404).json({ message: 'Rujukan not found' });
    }

    // If no_rujukan is empty in request, use existing no_rujukan
    if (!req.body.no_rujukan) {
      req.body.no_rujukan = existingRujukan.no_rujukan;
    }

    const updated = await Rujukan.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (updated[0] === 1) {
      const rujukan = await Rujukan.findOne({
        where: { id: req.params.id },
      });
      res.json({
        message: 'Rujukan Updated',
        data: rujukan,
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteRujukan = async (req, res) => {
  try {
    const deleted = await Rujukan.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (deleted) {
      res.json({ message: 'Rujukan Deleted' });
    } else {
      res.status(404).json({ message: 'Rujukan not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getTodayRujukanCount = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get all rujukan for today
    const todayRujukan = await Rujukan.findAll({
      where: {
        createdAt: {
          [Op.gte]: today,
          [Op.lt]: tomorrow,
        },
      },
      order: [['no_rujukan', 'DESC']],
      limit: 1,
    });

    let nextSequence = 1;
    if (todayRujukan && todayRujukan.length > 0) {
      const lastRujukan = todayRujukan[0];
      const lastNumberStr = lastRujukan.no_rujukan.split('-')[1];
      nextSequence = parseInt(lastNumberStr) + 1;
    }

    console.log('Next sequence number:', nextSequence); // Debug log

    res.json({
      count: todayRujukan.length,
      nextSequence: nextSequence,
    });
  } catch (error) {
    console.error('Error in getTodayRujukanCount:', error);
    res.status(500).json({ message: error.message });
  }
};
