// routes/supplierRoutes.js
const express = require('express');
const router = express.Router();
const Supplier = require("../models/suppliermodel"); // Supplier modelinizi içe aktarın

// GET tüm tedarikçileri getir
// GET /api/suppliers
router.get('/', async (req, res) => {
    try {
        const suppliers = await Supplier.find({});
        res.status(200).json(suppliers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET tek bir tedarikçiyi ID'ye göre getir
// GET /api/suppliers/:id
router.get('/:id', async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) {
            return res.status(404).json({ message: 'Tedarikçi bulunamadı.' });
        }
        res.status(200).json(supplier);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST yeni tedarikçi oluştur
// POST /api/suppliers
router.post('/', async (req, res) => {
    const { name, contactPerson, phone, email, address } = req.body;

    // Temel doğrulama
    if (!name) {
        return res.status(400).json({ message: 'Tedarikçi adı gereklidir.' });
    }

    try {
        const newSupplier = new Supplier({
            name,
            contactPerson,
            phone,
            email,
            address
        });
        const savedSupplier = await newSupplier.save();
        res.status(201).json(savedSupplier);
    } catch (error) {
        // Hata mesajlarını daha açıklayıcı yapabiliriz (örn. benzersizlik hatası)
        if (error.code === 11000) { // MongoDB duplicate key error code
            return res.status(409).json({ message: 'Bu isimde bir tedarikçi zaten mevcut.' });
        }
        res.status(500).json({ message: error.message });
    }
});

// PUT tedarikçiyi ID'ye göre güncelle
// PUT /api/suppliers/:id
router.put('/:id', async (req, res) => {
    try {
        const updatedSupplier = await Supplier.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } // new: true güncellenmiş belgeyi döndürür, runValidators: true şema doğrulamalarını çalıştırır
        );
        if (!updatedSupplier) {
            return res.status(404).json({ message: 'Tedarikçi bulunamadı.' });
        }
        res.status(200).json(updatedSupplier);
    } catch (error) {
        if (error.code === 11000) { // MongoDB duplicate key error code (eğer ismi güncelliyorsa)
            return res.status(409).json({ message: 'Bu isimde bir tedarikçi zaten mevcut.' });
        }
        res.status(500).json({ message: error.message });
    }
});

// DELETE tedarikçiyi ID'ye göre sil
// DELETE /api/suppliers/:id
router.delete('/:id', async (req, res) => {
    try {
        const deletedSupplier = await Supplier.findByIdAndDelete(req.params.id);
        if (!deletedSupplier) {
            return res.status(404).json({ message: 'Tedarikçi bulunamadı.' });
        }
        res.status(200).json({ message: 'Tedarikçi başarıyla silindi.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;