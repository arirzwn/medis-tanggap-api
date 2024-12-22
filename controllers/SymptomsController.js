import Symptom from '../models/SymptomModel.js'; 

// Controller untuk mengambil semua gejala
export const getSymptoms = async (req, res) => {
  try {
    // Mengambil semua data gejala dari database
    const symptoms = await Symptom.findAll();

    // Mengirim response dengan status 200 dan data gejala
    res.status(200).json(symptoms);
  } catch (error) {
    console.error("Error fetching symptoms:", error);
    res.status(500).json({ message: "Terjadi kesalahan saat mengambil data gejala" });
  }
};
