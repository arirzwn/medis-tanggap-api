import Result from '../models/ResultModel.js'; 

// Controller untuk mengambil semua hasil diagnosa
export const getResults = async (req, res) => {
  try {
    const results = await Result.findAll();
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching results:", error);
    res.status(500).json({ message: "Terjadi kesalahan saat mengambil data hasil diagnosa" });
  }
};

// Controller untuk mendapatkan hasil diagnosa berdasarkan ID
export const getResultById = async (req, res) => {
    const { id } = req.params;
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID tidak valid" });
    }
  
    try {
      const result = await Result.findOne({ where: { id: id } });
  
      if (!result) {
        return res.status(404).json({ message: "Hasil diagnosa tidak ditemukan" });
      }
  
      res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching result:", error);
      res.status(500).json({ message: "Terjadi kesalahan saat mengambil data hasil diagnosa" });
    }
  };
  

// Controller untuk membuat hasil diagnosa baru
export const createResult = async (req, res) => {
  const { diseaseName, description, treatment } = req.body;

  try {
    const newResult = await Result.create({ diseaseName, description, treatment });
    res.status(201).json(newResult);
  } catch (error) {
    console.error("Error creating result:", error);
    res.status(500).json({ message: "Terjadi kesalahan saat menyimpan hasil diagnosa" });
  }
};
