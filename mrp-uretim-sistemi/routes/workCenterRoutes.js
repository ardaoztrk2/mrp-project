// mrp-uretim-sistemi/routes/workCenterRoutes.js
const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware'); // Yetkilendirme middleware'leri

const {
  createWorkCenter,
  getAllWorkCenters,
  getWorkCenterById,
  updateWorkCenter,
  deleteWorkCenter,
} = require('../controllers/workCenterController');

// Tüm iş merkezlerini getir ve yeni iş merkezi oluştur
router.route('/')
  .get(protect, admin, getAllWorkCenters) // Sadece adminler tüm iş merkezlerini görebilir
  .post(protect, admin, createWorkCenter); // Sadece adminler iş merkezi oluşturabilir

// Belirli bir iş merkezini ID'ye göre getir, güncelle ve sil
router.route('/:id')
  .get(protect, admin, getWorkCenterById) // Sadece adminler belirli bir iş merkezini görebilir
  .put(protect, admin, updateWorkCenter)  // Sadece adminler iş merkezini güncelleyebilir
  .delete(protect, admin, deleteWorkCenter); // Sadece adminler iş merkezini silebilir

module.exports = router;
