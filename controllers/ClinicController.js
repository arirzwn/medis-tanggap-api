import Clinic from '../models/ClinicModel.js';
import User from '../models/UserModel.js';

// Fungsi untuk menambahkan klinik
const addClinic = async (req, res) => {
  try {
    const { clinic_name, address, user_id } = req.body;

    if (!req.files || !req.files.ktp_owner || !req.files.operation_license) {
      return res.status(400).json({ message: "KTP dan Surat Izin harus di-upload" });
    }

    const ktpOwnerFile = req.files.ktp_owner[0];
    const operationLicenseFile = req.files.operation_license[0];

    const newClinic = await Clinic.create({
      clinic_name,
      address,
      ktp_owner: ktpOwnerFile.filename,
      operation_license: operationLicenseFile.filename,
      user_id,
    });

    res.status(201).json({
      message: 'Klinik berhasil ditambahkan!',
      data: newClinic,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Gagal menambahkan klinik', error: error.message });
  }
};

// Fungsi untuk mengambil daftar klinik
const getClinics = async (req, res) => {
  try {
    const clinics = await Clinic.findAll();

    res.status(200).json({
      message: 'Data klinik berhasil diambil',
      data: clinics,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Gagal mengambil data klinik', error: error.message });
  }
};

// Fungsi untuk menerima klinik dan mengubah role pengguna
const handleAccept = async (req, res) => {
  const { clinicId } = req.params; // Mengambil clinicId dari parameter URL

  try {
    // Ambil data klinik berdasarkan ID
    const clinic = await Clinic.findByPk(clinicId);

    if (!clinic) {
      return res.status(404).json({ message: 'Klinik tidak ditemukan' });
    }

    // Ambil user_id dari data klinik
    const userId = clinic.user_id;

    // Cari pengguna berdasarkan user_id
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    }

    // Ubah role pengguna menjadi 'clinic'
    user.role = 'clinic';
    await user.save();  // Simpan perubahan ke database

    // Kirim respon sukses
    return res.status(200).json({ message: 'Role pengguna berhasil diubah menjadi clinic' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Terjadi kesalahan saat mengubah role pengguna' });
  }
};

const rejectClinic = async (req, res) => {
  try {
    const { clinicId } = req.params; // Menggunakan clinicId sebagai parameter

    // Cari klinik berdasarkan ID (menggunakan findByPk untuk Sequelize)
    const clinic = await Clinic.findByPk(clinicId);

    if (!clinic) {
      return res.status(404).json({ message: 'Klinik tidak ditemukan' });
    }

    // Menghapus klinik yang ditolak
    await clinic.destroy(); // Menghapus entri menggunakan destroy

    return res.status(200).json({ message: 'Klinik berhasil ditolak dan dihapus' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Terjadi kesalahan saat menghapus klinik' });
  }
};

// Fungsi untuk mendapatkan detail pengajuan klinik berdasarkan ID
const getDetailPengajuan = async (req, res) => {
  try {
    const clinicId = req.params.id; // Mendapatkan ID dari parameter URL

    // Mengambil data klinik beserta data user yang mengajukan klinik (jika diperlukan)
    const clinic = await Clinic.findOne({
      where: { id: clinicId },
      include: [
        {
          model: User,
          as: 'user', // pastikan relasi antara Clinic dan User sudah diatur dengan benar di model
          attributes: ['id', 'name', 'email'], // Ambil informasi user yang relevan
        }
      ]
    });

    // Jika klinik tidak ditemukan
    if (!clinic) {
      return res.status(404).json({ message: 'Klinik tidak ditemukan' });
    }

    // Mengirimkan data klinik sebagai respons
    res.json(clinic);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};




export { addClinic, getClinics, handleAccept, rejectClinic,getDetailPengajuan };
