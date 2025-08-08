// mrp-uretim-sistemi/controllers/rawMaterialController.js
const RawMaterial = require('../models/rawMaterialModel');

// Tüm hammaddeleri getir
const getAllRawMaterials = async (req, res) => {
  try {
    const rawMaterials = await RawMaterial.find({});
    res.status(200).json(rawMaterials);
  } catch (error) {
    console.error("Hammaddeler alınırken hata:", error);
    res.status(500).json({
      message: "Hammaddeler alınamadı",
      error: error.message
    });
  }
};

// Yeni hammadde oluştur
const createRawMaterial = async (req, res) => {
  // Frontend'den gelen 'currentStock' alanını yakalıyoruz. 'code' alanı zorunlu değil.
  const { name, currentStock, unit } = req.body;

  // Sadece name, currentStock ve unit alanlarının varlığını kontrol ediyoruz
  if (!name || currentStock == null || !unit) {
    return res.status(400).json({
      message: "Lütfen tüm zorunlu alanları (Ad, Stok, Birim) doldurun."
    });
  }

  try {
    const newRawMaterial = await RawMaterial.create({
      name,
      currentStock, // modeldeki 'currentStock' alanına atama yapıyoruz
      unit
    });
    res.status(201).json({
      message: "Hammadde başarıyla eklendi.",
      rawMaterial: newRawMaterial
    });
  } catch (error) {
    console.error("Hammadde oluşturulurken hata:", error);
    res.status(500).json({
      message: "Hammadde oluşturulamadı",
      error: error.message
    });
  }
};

// Belirli bir hammaddeyi ID'ye göre getir
const getRawMaterialById = async (req, res) => {
  try {
    const rawMaterial = await RawMaterial.findById(req.params.id);
    if (!rawMaterial) {
      return res.status(404).json({
        message: "Hammadde bulunamadı."
      });
    }
    res.status(200).json(rawMaterial);
  } catch (error) {
    console.error("Hammadde alınırken hata:", error);
    res.status(500).json({
      message: "Hammadde alınamadı",
      error: error.message
    });
  }
};

// Hammaddeyi güncelle
const updateRawMaterial = async (req, res) => {
  const {
    id
  } = req.params;
  const {
    name,
    currentStock, // Güncelleme işlemi için de 'currentStock' kullanıyoruz
    unit,
    code
  } = req.body;

  try {
    const rawMaterial = await RawMaterial.findById(id);
    if (!rawMaterial) {
      return res.status(404).json({
        message: "Hammadde bulunamadı."
      });
    }

    if (code && code !== rawMaterial.code) {
      const rawMaterialWithNewCode = await RawMaterial.findOne({
        code
      });
      if (rawMaterialWithNewCode && rawMaterialWithNewCode._id.toString() !== id) {
        return res.status(400).json({
          message: "Bu hammadde kodu zaten başka bir hammaddeye ait."
        });
      }
    }

    rawMaterial.name = name || rawMaterial.name;
    // Güncelleme işleminde 'stock' yerine 'currentStock' kullanıyoruz
    rawMaterial.currentStock = currentStock !== undefined && currentStock !== null ? currentStock : rawMaterial.currentStock;
    rawMaterial.unit = unit || rawMaterial.unit;
    rawMaterial.code = code || rawMaterial.code;

    await rawMaterial.save();
    res.status(200).json({
      message: "Hammadde başarıyla güncellendi.",
      rawMaterial
    });
  } catch (error) {
    console.error("Hammadde güncellenirken hata:", error);
    res.status(500).json({
      message: "Hammadde güncellenemedi",
      error: error.message
    });
  }
};


// Hammaddeyi sil
const deleteRawMaterial = async (req, res) => {
  const {
    id
  } = req.params;
  try {
    const rawMaterial = await RawMaterial.findById(id);
    if (!rawMaterial) {
      return res.status(404).json({
        message: "Hammadde bulunamadı."
      });
    }
    await RawMaterial.deleteOne({
      _id: id
    });
    res.status(200).json({
      message: "Hammadde başarıyla silindi."
    });
  } catch (error) {
    console.error("Hammadde silinirken hata:", error);
    res.status(500).json({
      message: "Hammadde silinemedi",
      error: error.message
    });
  }
};

module.exports = {
  getAllRawMaterials,
  createRawMaterial,
  getRawMaterialById,
  updateRawMaterial,
  deleteRawMaterial,
};
