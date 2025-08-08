// models/PurchaseOrderItem.js
const mongoose = require('mongoose');

const purchaseOrderItemSchema = new mongoose.Schema({
    purchaseOrder: { // Hangi satınalma siparişine ait olduğu
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PurchaseOrder',
        required: true
    },
    rawMaterial: { // Hangi hammadde olduğu
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RawMaterial', // Mevcut RawMaterial modelinize referans
        required: true
    },
    quantity: { // Sipariş edilen miktar
        type: Number,
        required: true,
        min: 1
    },
    unitPrice: { // O anda sipariş edilen birim fiyatı
        type: Number,
        required: true,
        min: 0
    },
    subtotal: { // quantity * unitPrice
        type: Number,
        default: 0
    },
    receivedQuantity: { // Bu kalemden ne kadarının teslim alındığı
        type: Number,
        default: 0
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

purchaseOrderItemSchema.pre('save', function(next) {
    this.subtotal = this.quantity * this.unitPrice; // Alt toplamı otomatik hesapla
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.models.PurchaseOrderItem || mongoose.model('PurchaseOrderItem', purchaseOrderItemSchema);