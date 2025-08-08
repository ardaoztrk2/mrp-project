// mrp-uretim-sistemi/routes/productionOrderRoutes.js
const express = require('express');
const {
  getProductionOrders,
  getProductionOrderById,
  createProductionOrder,
  updateProductionOrder,
  deleteProductionOrder,
} = require('../controllers/productionOrderController');
const { protect, admin } = require('../middleware/authMiddleware'); // Yetkilendirme middleware'leri

const router = express.Router();

// Tüm üretim siparişlerini getir ve yeni üretim siparişi oluştur
// Her iki işlem de yetkilendirme gerektirir (protect)
router.route('/')
  .get(protect, getProductionOrders)
  .post(protect, createProductionOrder);

// Belirli bir üretim siparişini getir, güncelle veya sil
// Her üç işlem de yetkilendirme gerektirir (protect)
router.route('/:id')
  .get(protect, getProductionOrderById)
  .put(protect, updateProductionOrder)
  .delete(protect, deleteProductionOrder); // Silme işlemi için admin yetkisi de eklenebilir

module.exports = router;
