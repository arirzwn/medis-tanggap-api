import Users from '../models/UserModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';

export const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ['id', 'name', 'phone', 'email'],
    });
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getUser = async (req, res) => {
  try {
    // Ambil ID pengguna dari request, misalnya dari `req.params.id`
    const { id } = req.params;

    // Query database untuk mendapatkan pengguna berdasarkan ID
    const user = await Users.findOne({
      where: { id }, // Kondisi pencarian berdasarkan ID
      attributes: ['id', 'name', 'phone', 'email', 'role', 'images'], // Atribut yang ingin diambil
    });

    // Periksa apakah pengguna ditemukan
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Kembalikan data pengguna
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const Register = async (req, res) => {
  const { name, email, phone, password, confirmPassword } = req.body;
  if (password !== confirmPassword)
    return res
      .status(400)
      .json({ msg: 'Password dan Confirm Password Tidak Cocok' });

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  try {
    await Users.create({
      name: name,
      phone: phone,
      email: email,
      password: hashPassword,
    });
    res.json({ msg: 'Register Berhasil' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const Login = async (req, res) => {
  try {
    const user = await Users.findAll({
      where: {
        email: req.body.email,
      },
    });

    const match = await bcrypt.compare(req.body.password, user[0].password);
    if (!match) return res.status(400).json({ msg: 'Wrong Password' });

    const userId = user[0].id;
    const name = user[0].name;
    const phone = user[0].phone;
    const email = user[0].email;
    const role = user[0].role;

    const accessToken = jwt.sign(
      { userId, name, phone, email, role },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: '24h',
      }
    );

    const refreshToken = jwt.sign(
      { userId, name, phone, email, role },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: '7d',
      }
    );

    await Users.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: userId,
        },
      }
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
    });

    // Include user data in response
    res.json({
      accessToken,
      user: {
        id: userId,
        name,
        email,
        phone,
        role,
      },
    });
  } catch (error) {
    res.status(404).json({ msg: 'Email tidak ditemukan' });
  }
};

export const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);

  const user = await Users.findAll({
    where: {
      refresh_token: refreshToken,
    },
  });

  if (!user[0]) return res.sendStatus(204);

  const userId = user[0].id;
  await Users.update(
    { refresh_token: null },
    {
      where: {
        id: userId,
      },
    }
  );

  res.clearCookie('refreshToken');
  return res.sendStatus(200);
};

export const getUsersByRoleClinic = async (req, res) => {
  try {
    // Query untuk mendapatkan user dengan role "clinic"
    const clinicUsers = await Users.findAll({
      where: { role: 'clinic' }, // Filter berdasarkan role
      attributes: ['id', 'name', 'email', 'phone', 'createdAt', 'updatedAt'], // Pilih kolom yang ingin ditampilkan
    });

    // Cek jika tidak ada data
    if (clinicUsers.length === 0) {
      return res
        .status(404)
        .json({ message: 'No users with the role "clinic" found.' });
    }

    // Kembalikan data
    return res.status(200).json({
      message: 'Clinic users retrieved successfully',
      data: clinicUsers,
    });
  } catch (error) {
    console.error('Error fetching clinic users:', error);
    return res.status(500).json({
      message: 'Failed to retrieve clinic users',
      error: error.message,
    });
  }
};

export const deleteClinic = async (req, res) => {
  const { id } = req.params; // Ambil ID dari parameter URL

  try {
    // Cek apakah data dengan ID tersebut ada di UsersData
    const clinic = await Users.findOne({ where: { id } });
    if (!clinic) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }

    // Hapus data dari tabel UsersData
    await Users.destroy({ where: { id } });

    return res.status(200).json({ message: 'Data berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting data:', error);
    return res.status(500).json({
      message: 'Gagal menghapus data',
      error: error.message,
    });
  }
};

export const getClinicDetail = async (req, res) => {
  const { id } = req.params; // Ambil ID dari parameter URL

  try {
    // Cek apakah data dengan ID tersebut ada di UsersData (model Users)
    const clinic = await Users.findOne({ where: { id } });

    // Jika data klinik ditemukan
    if (!clinic) {
      return res.status(404).json({ message: 'Klinik tidak ditemukan' });
    }

    // Mengembalikan data klinik yang ditemukan
    return res.status(200).json({
      message: 'Data klinik ditemukan',
      data: clinic, // Menampilkan data klinik
    });
  } catch (error) {
    console.error('Error fetching clinic data:', error);
    return res.status(500).json({
      message: 'Gagal mengambil data klinik',
      error: error.message,
    });
  }
};

export const updateUserData = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    // Pastikan file yang di-upload ada (images)
    if (!req.files || !req.files.images) {
      return res.status(400).json({ message: 'Gambar harus di-upload' });
    }

    const imageFile = req.files.images[0]; // Mengakses file gambar pertama

    // Dapatkan user ID dari parameter atau session (sesuaikan dengan aplikasi Anda)
    const userId = req.params.id;

    // Cari user berdasarkan ID
    const user = await Users.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    // Jika ada file baru yang di-upload, hapus file lama (jika ada)
    if (imageFile && user.images) {
      const oldImagePath = path.join('uploads', user.images);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath); // Menghapus file lama
      }
    }

    // Update data user
    await user.update({
      name,
      email,
      phone,
      images: imageFile.filename, // Simpan nama file gambar yang baru
    });

    res.status(200).json({
      message: 'Data user berhasil diperbarui',
      data: user,
    });
  } catch (error) {
    console.error('Error:', error);
    res
      .status(500)
      .json({ message: 'Gagal memperbarui data user', error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, email } = req.body; // Add email to destructuring
    const userEmail = req.email; // Email from JWT token

    const user = await Users.findOne({
      where: { email: userEmail },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Data yang akan diperbarui
    let updateData = {
      name,
      phone,
      email, // Include email in update data
    };

    // Menangani upload gambar jika ada
    if (req.files && req.files.images) {
      if (user.images) {
        const oldImagePath = path.join('uploads', user.images);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.images = req.files.images[0].filename;
    }

    // Update data pengguna
    await user.update(updateData);

    res.status(200).json({
      message: 'Profile updated successfully',
      data: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        images: user.images,
      },
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      message: 'Failed to update profile',
      error: error.message,
    });
  }
};
