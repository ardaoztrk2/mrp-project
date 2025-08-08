const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, // Her tedarikçinin benzersiz bir adı olmalı
        trim: true
    },
    contactPerson: { // İlgili kişi
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    address: {
        type: String,
        trim: true
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

// Kaydetme veya güncelleme öncesi updatedAt'ı otomatik güncelle
supplierSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Supplier = mongoose.model('Supplier', supplierSchema);

module.exports = Supplier;