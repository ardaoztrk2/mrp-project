const express = require('express');
const router = express.Router();
const {
    addStockMovement,
    getStockMovements,
    getStockMovementById
} = require('../controllers/stockMovementController'); // Yeni controller'ımızı import ediyoruz

// Eğer yetkilendirme (authentication) ve admin kontrolü kullanıyorsanız, buraya middleware'leri ekleyin
// const { protect, admin } = require('../middleware/authMiddleware');

// Stok Hareketi API rotaları
router.post('/', addStockMovement); // Admin veya yetkili kullanıcı ekleyebilir
router.get('/', getStockMovements); // Tüm stok hareketlerini listele
router.get('/:id', getStockMovementById); // Belirli bir stok hareketini ID'ye göre getir

// Eğer yetkilendirme kullanıyorsanız, yukarıdaki satırları aşağıdaki gibi değiştirebilirsiniz:
// router.post('/', protect, admin, addStockMovement);
// router.get('/', protect, admin, getStockMovements);
// router.get('/:id', protect, admin, getStockMovementById);


module.exports = router;