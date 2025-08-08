// models/PurchaseOrder.js
const mongoose = require('mongoose');

const purchaseOrderSchema = new mongoose.Schema({
    orderNumber: { // Otomatik oluşturulabilir veya manuel verilebilir
        type: String,
        unique: true,
        trim: true
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        required: true
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    deliveryDateExpected: { // Beklenen teslim tarihi
        type: Date
    },
    status: {
        type: String,
        enum: ['Pending', 'Ordered', 'Partially Received', 'Received', 'Cancelled'], // Durumlar
        default: 'Pending'
    },
    totalAmount: { // Tüm sipariş kalemlerinin toplamı
        type: Number,
        default: 0
    },
    notes: {
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

purchaseOrderSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const PurchaseOrder = mongoose.model('PurchaseOrder', purchaseOrderSchema);

module.exports = PurchaseOrder;