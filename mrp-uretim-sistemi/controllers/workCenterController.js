// mrp-uretim-sistemi/controllers/workCenterController.js
const WorkCenter = require('../models/workCenterModel'); // Düzeltildi

/**
 * @desc Yeni bir iş merkezi oluştur
 * @route POST /api/workcenters
 * @access Private/Admin
 */
const createWorkCenter = async (req, res) => {
  try {
    const { name, code, description, capacity, capacityUnit, machineCount, personnelCount, isActive } = req.body;

    // Gerekli alanların kontrolü
    if (!name || !code || capacity === undefined || !capacityUnit) {
      return res.status(400).json({ message: 'Lütfen iş merkezi adı, kodu, kapasitesi ve birimini girin.' });
    }

    // Benzersizlik kontrolü
    const workCenterExists = await WorkCenter.findOne({ $or: [{ name }, { code }] });
    if (workCenterExists) {
      return res.status(400).json({ message: 'Bu iş merkezi adı veya kodu zaten mevcut.' });
    }

    const newWorkCenter = new WorkCenter({
      name,
      code,
      description,
      capacity,
      capacityUnit,
      machineCount,
      personnelCount,
      isActive,
    });

    const savedWorkCenter = await newWorkCenter.save();
    res.status(201).json(savedWorkCenter);
  } catch (error) {
    console.error('İş merkezi oluşturulurken hata:', error);
    res.status(500).json({ message: 'İş merkezi oluşturulurken sunucu hatası.', error: error.message });
  }
};

/**
 * @desc Tüm iş merkezlerini getir
 * @route GET /api/workcenters
 * @access Private/Admin
 */
const getAllWorkCenters = async (req, res) => {
  try {
    const workCenters = await WorkCenter.find({});
    res.status(200).json(workCenters);
  } catch (error) {
    console.error('İş merkezleri alınırken hata:', error);
    res.status(500).json({ message: 'İş merkezleri alınırken sunucu hatası.', error: error.message });
  }
};

/**
 * @desc ID'ye göre bir iş merkezi getir
 * @route GET /api/workcenters/:id
 * @access Private/Admin
 */
const getWorkCenterById = async (req, res) => {
  try {
    const workCenter = await WorkCenter.findById(req.params.id);
    if (!workCenter) {
      return res.status(404).json({ message: 'İş merkezi bulunamadı.' });
    }
    res.status(200).json(workCenter);
  } catch (error) {
    console.error('İş merkezi alınırken hata:', error);
    res.status(500).json({ message: 'İş merkezi alınırken sunucu hatası.', error: error.message });
  }
};

/**
 * @desc Bir iş merkezini güncelle
 * @route PUT /api/workcenters/:id
 * @access Private/Admin
 */
const updateWorkCenter = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, description, capacity, capacityUnit, machineCount, personnelCount, isActive } = req.body;

    const workCenter = await WorkCenter.findById(id);
    if (!workCenter) {
      return res.status(404).json({ message: 'İş merkezi bulunamadı.' });
    }

    // Eğer kod veya isim değiştiriliyorsa benzersizlik kontrolü
    if (name && name !== workCenter.name) {
        const nameExists = await WorkCenter.findOne({ name });
        if (nameExists && nameExists._id.toString() !== id) {
            return res.status(400).json({ message: 'Bu iş merkezi adı zaten mevcut.' });
        }
    }
    if (code && code !== workCenter.code) {
        const codeExists = await WorkCenter.findOne({ code });
        if (codeExists && codeExists._id.toString() !== id) {
            return res.status(400).json({ message: 'Bu iş merkezi kodu zaten mevcut.' });
        }
    }

    workCenter.name = name || workCenter.name;
    workCenter.code = code || workCenter.code;
    workCenter.description = description !== undefined ? description : workCenter.description;
    workCenter.capacity = capacity !== undefined ? capacity : workCenter.capacity;
    workCenter.capacityUnit = capacityUnit || workCenter.capacityUnit;
    workCenter.machineCount = machineCount !== undefined ? machineCount : workCenter.machineCount;
    workCenter.personnelCount = personnelCount !== undefined ? personnelCount : workCenter.personnelCount;
    workCenter.isActive = isActive !== undefined ? isActive : workCenter.isActive;

    const updatedWorkCenter = await workCenter.save();
    res.status(200).json(updatedWorkCenter);
  } catch (error) {
    console.error('İş merkezi güncellenirken hata:', error);
    res.status(500).json({ message: 'İş merkezi güncellenirken sunucu hatası.', error: error.message });
  }
};

/**
 * @desc Bir iş merkezini sil
 * @route DELETE /api/workcenters/:id
 * @access Private/Admin
 */
const deleteWorkCenter = async (req, res) => {
  try {
    const workCenter = await WorkCenter.findById(req.params.id);
    if (!workCenter) {
      return res.status(404).json({ message: 'İş merkezi bulunamadı.' });
    }

    await WorkCenter.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'İş merkezi başarıyla silindi.' });
  } catch (error) {
    console.error('İş merkezi silinirken hata:', error);
    res.status(500).json({ message: 'İş merkezi silinirken sunucu hatası.', error: error.message });
  }
};

module.exports = {
  createWorkCenter,
  getAllWorkCenters,
  getWorkCenterById,
  updateWorkCenter,
  deleteWorkCenter,
};