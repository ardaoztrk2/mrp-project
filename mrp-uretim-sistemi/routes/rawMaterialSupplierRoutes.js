// routes/rawMaterialSupplierRoutes.js
const express = require('express');
const router = express.Router();
const RawMaterialSupplier = require("../models/rawMaterialSupplierModel"); // RawMaterialSupplier modelinizi içe aktarın
const RawMaterial = require('../models/rawMaterialModel'); // Hammadde modelinizi içe aktarın (model adınız 'RawMaterial' değilse düzeltin)
const Supplier = require('../models/suppliermodel'); // Supplier modelinizi içe aktarın


// POST yeni bir hammadde-tedarikçi ilişkisi oluştur
// POST /api/rawmaterialsuppliers
router.post('/', async (req, res) => {
    const { rawMaterial, supplier, unitPrice, leadTime, minimumOrderQuantity } = req.body;

    // Temel doğrulama
    if (!rawMaterial || !supplier || !unitPrice || leadTime === undefined) {
        return res.status(400).json({ message: 'Hammadde ID, Tedarikçi ID, Birim Fiyatı ve Tedarik Süresi gereklidir.' });
    }

    try {
        // Hammadde ve Tedarikçi ID'lerinin gerçekten var olup olmadığını kontrol et
        const existingRawMaterial = await RawMaterial.findById(rawMaterial);
        if (!existingRawMaterial) {
            return res.status(404).json({ message: 'Belirtilen hammadde bulunamadı.' });
        }

        const existingSupplier = await Supplier.findById(supplier);
        if (!existingSupplier) {
            return res.status(404).json({ message: 'Belirtilen tedarikçi bulunamadı.' });
        }

        const newRawMaterialSupplier = new RawMaterialSupplier({
            rawMaterial,
            supplier,
            unitPrice,
            leadTime,
            minimumOrderQuantity
        });
        const savedRawMaterialSupplier = await newRawMaterialSupplier.save();
        res.status(201).json(savedRawMaterialSupplier);
    } catch (error) {
        if (error.code === 11000) { // MongoDB duplicate key error (aynı hammadde-tedarikçi çifti)
            return res.status(409).json({ message: 'Bu hammadde için bu tedarikçi zaten tanımlı.' });
        }
        res.status(500).json({ message: error.message });
    }
});

// GET tüm hammadde-tedarikçi ilişkilerini getir (populate ile detaylı)
// GET /api/rawmaterialsuppliers
router.get('/', async (req, res) => {
    try {
        const rawMaterialSuppliers = await RawMaterialSupplier.find({})
            .populate('rawMaterial') // Hammadde detaylarını da getir
            .populate('supplier');    // Tedarikçi detaylarını da getir
        res.status(200).json(rawMaterialSuppliers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET tek bir hammadde-tedarikçi ilişkisini ID'ye göre getir
// GET /api/rawmaterialsuppliers/:id
router.get('/:id', async (req, res) => {
    try {
        const rawMaterialSupplier = await RawMaterialSupplier.findById(req.params.id)
            .populate('rawMaterial')
            .populate('supplier');
        if (!rawMaterialSupplier) {
            return res.status(404).json({ message: 'Hammadde-Tedarikçi ilişkisi bulunamadı.' });
        }
        res.status(200).json(rawMaterialSupplier);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT hammadde-tedarikçi ilişkisini güncelle
// PUT /api/rawmaterialsuppliers/:id
router.put('/:id', async (req, res) => {
    const { unitPrice, leadTime, minimumOrderQuantity } = req.body; // Sadece bu alanlar güncellenebilir

    try {
        const updatedRawMaterialSupplier = await RawMaterialSupplier.findByIdAndUpdate(
            req.params.id,
            { unitPrice, leadTime, minimumOrderQuantity }, // Güncellenecek alanlar
            { new: true, runValidators: true }
        )
        .populate('rawMaterial')
        .populate('supplier');

        if (!updatedRawMaterialSupplier) {
            return res.status(404).json({ message: 'Hammadde-Tedarikçi ilişkisi bulunamadı.' });
        }
        res.status(200).json(updatedRawMaterialSupplier);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE hammadde-tedarikçi ilişkisini sil
// DELETE /api/rawmaterialsuppliers/:id
router.delete('/:id', async (req, res) => {
    try {
        const deletedRawMaterialSupplier = await RawMaterialSupplier.findByIdAndDelete(req.params.id);
        if (!deletedRawMaterialSupplier) {
            return res.status(404).json({ message: 'Hammadde-Tedarikçi ilişkisi bulunamadı.' });
        }
        res.status(200).json({ message: 'Hammadde-Tedarikçi ilişkisi başarıyla silindi.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;