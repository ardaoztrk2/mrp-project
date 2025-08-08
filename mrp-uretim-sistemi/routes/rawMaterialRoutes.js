// mrp-uretim-sistemi/routes/rawMaterialRoutes.js
const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const {
  getAllRawMaterials,
  createRawMaterial,
  getRawMaterialById, // <<<<<<<<<< BU SATIRI EKLEYİN
  updateRawMaterial,  // <<<<<<<<<< BU SATIRI EKLEYİN
  deleteRawMaterial,  // <<<<<<<<<< BU SATIRI EKLEYİN
} = require("../controllers/rawMaterialController");

// Tüm hammaddeleri getir ve yeni hammadde oluştur rotaları
router.route("/")
  .get(protect, getAllRawMaterials) // Tüm kullanıcılar hammaddeleri görebilir
  .post(protect, admin, createRawMaterial); // Sadece adminler hammadde oluşturabilir

// Belirli bir hammaddeyi ID'ye göre getir, güncelle ve sil rotaları
router.route("/:id")
  .get(protect, getRawMaterialById) // <<<<<<<<<< BU SATIRI EKLEYİN
  .put(protect, admin, updateRawMaterial) // <<<<<<<<<< Sadece adminler hammadde güncelleyebilir
  .delete(protect, admin, deleteRawMaterial); // <<<<<<<<<< Sadece adminler hammadde silebilir

module.exports = router;
