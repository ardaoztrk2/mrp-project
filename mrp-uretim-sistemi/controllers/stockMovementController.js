const asyncHandler = require('express-async-handler');
const StockMovement = require('../models/stockMovementModel');
const Product = require('../models/productModel'); 
const RawMaterial = require('../models/rawMaterialModel'); 

// @desc    Yeni stok hareketi ekle
// @route   POST /api/stock-movements
// @access  Private (Admin)
const addStockMovement = asyncHandler(async (req, res) => {
    const { material, materialType, type, quantity, notes, sourceDocument } = req.body;

    if (!material || !materialType || !type || !quantity) {
        res.status(400);
        throw new Error('Lütfen tüm zorunlu alanları doldurun: material, materialType, type, quantity');
    }

    if (quantity <= 0) {
        res.status(400);
        throw new Error('Miktar pozitif bir sayı olmalıdır.');
    }

    let materialItem;
    if (materialType === 'RawMaterial') {
        materialItem = await RawMaterial.findById(material);
    } else if (materialType === 'Product') {
        materialItem = await Product.findById(material);
    } else {
        res.status(400);
        throw new Error('Geçersiz malzeme tipi belirtildi: ' + materialType);
    }

    if (!materialItem) {
        res.status(404);
        throw new Error('Belirtilen malzeme bulunamadı.');
    }

    if (type === 'in') {
        materialItem.currentStock += quantity;
    } else if (type === 'out') {
        if (materialItem.currentStock < quantity) {
            res.status(400);
            throw new Error('Yetersiz stok. Mevcut stok: ' + materialItem.currentStock);
        }
        materialItem.currentStock -= quantity;
    } else {
        res.status(400);
        throw new Error('Geçersiz hareket tipi belirtildi: ' + type + '. "in" veya "out" olmalı.');
    }

    await materialItem.save();

    const stockMovement = await StockMovement.create({
        material,
        materialType,
        type,
        quantity,
        notes,
        sourceDocument,
        user: req.user ? req.user._id : null
    });

    res.status(201).json(stockMovement);
});

// @desc    Tüm stok hareketlerini getir
// @route   GET /api/stock-movements
// @access  Private (Admin)
const getStockMovements = asyncHandler(async (req, res) => {
    // material alanını populate ederken, refPath kullanıldığı için
    // material'ın name ve unit gibi alanlarına erişebilmek için
    // popülasyon sonrası veriyi manipüle etmemiz gerekiyor.
    const stockMovements = await StockMovement.find({})
        .populate({
            path: 'material',
            select: 'name unit' // Sadece 'name' ve 'unit' alanlarını çekiyoruz
        })
        .populate('user', 'name');

    // Frontend'in beklediği formatta veriyi hazırlayalım
    const formattedMovements = stockMovements.map(movement => {
        // Eğer material populate edilmemişse veya null ise (nadiren olabilir)
        // veya name/unit alanı yoksa 'Bilinmiyor' dönecektir
        const materialName = movement.material ? movement.material.name : 'Bilinmiyor';
        const materialUnit = movement.material ? movement.material.unit : '-'; // Varsayılan birim

        return {
            _id: movement._id,
            materialId: movement.material ? movement.material._id : null, // Frontend'de lazım olabilir
            materialName: materialName, // Populate edilmiş material'dan adı al
            materialType: movement.materialType,
            type: movement.type,
            quantity: movement.quantity,
            unit: materialUnit, // Populate edilmiş material'dan birimi al
            date: movement.toDateString ? movement.date.toDateString() : movement.date, // Tarihi düzgün formatla
            notes: movement.notes,
            user: movement.user ? movement.user.name : 'Bilinmiyor' // Kullanıcı adını al
        };
    });

    res.status(200).json(formattedMovements);
});

// @desc    Belirli bir stok hareketini getir
// @route   GET /api/stock-movements/:id
// @access  Private (Admin)
const getStockMovementById = asyncHandler(async (req, res) => {
    const stockMovement = await StockMovement.findById(req.params.id)
        .populate({
            path: 'material',
            select: 'name unit'
        })
        .populate('user', 'name');

    if (stockMovement) {
        // Tek bir hareket için de aynı formatlamayı yapabiliriz
        const materialName = stockMovement.material ? stockMovement.material.name : 'Bilinmiyor';
        const materialUnit = stockMovement.material ? stockMovement.material.unit : '-';

        const formattedMovement = {
            _id: stockMovement._id,
            materialId: stockMovement.material ? stockMovement.material._id : null,
            materialName: materialName,
            materialType: stockMovement.materialType,
            type: stockMovement.type,
            quantity: stockMovement.quantity,
            unit: materialUnit,
            date: stockMovement.date.toDateString ? stockMovement.date.toDateString() : stockMovement.date,
            notes: stockMovement.notes,
            user: stockMovement.user ? stockMovement.user.name : 'Bilinmiyor'
        };
        res.status(200).json(formattedMovement);
    } else {
        res.status(404);
        throw new Error('Stok hareketi bulunamadı.');
    }
});


module.exports = {
    addStockMovement,
    getStockMovements,
    getStockMovementById
};