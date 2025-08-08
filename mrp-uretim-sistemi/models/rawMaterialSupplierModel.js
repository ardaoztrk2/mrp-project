// models/RawMaterialSupplier.js
const mongoose = require('mongoose');

const rawMaterialSupplierSchema = new mongoose.Schema({
    rawMaterial: { // İlişkilendirilecek hammadde
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RawMaterial', // Mevcut RawMaterial modelinize referans
        required: true
    },
    supplier: { // İlişkilendirilecek tedarikçi
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        required: true
    },
    unitPrice: { // Tedarikçiden alınacak birim fiyatı
        type: Number,
        required: true,
        min: 0
    },
    leadTime: { // Tedarik süresi (gün olarak)
        type: Number,
        required: true,
        min: 0
    },
    minimumOrderQuantity: { // Bu tedarikçiden minimum sipariş miktarı
        type: Number,
        default: 1,
        min: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Bir hammaddenin aynı tedarikçiden birden fazla kaydı olmasın
rawMaterialSupplierSchema.index({ rawMaterial: 1, supplier: 1 }, { unique: true });

rawMaterialSupplierSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const RawMaterialSupplier = mongoose.model('RawMaterialSupplier', rawMaterialSupplierSchema);

module.exports = RawMaterialSupplier;