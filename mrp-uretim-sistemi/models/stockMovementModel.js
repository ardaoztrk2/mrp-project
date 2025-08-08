const mongoose = require('mongoose');

const stockMovementSchema = mongoose.Schema(
    {
        material: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'materialType' // materialType alanındaki modele referans verecek
        },
        materialType: { // Hangi modele referans verdiğimizi tutar (RawMaterial veya Product)
            type: String,
            required: true,
            enum: ['RawMaterial', 'Product'] // Sadece bu iki tipi kabul et
        },
        type: { // Hareketin türü: 'in' (giriş) veya 'out' (çıkış)
            type: String,
            required: true,
            enum: ['in', 'out']
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        date: {
            type: Date,
            default: Date.now
        },
        // Bu hareketin kaynağı (opsiyonel: sipariş, üretim emri, satın alma vb.)
        sourceDocument: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order' // Veya 'PurchaseOrder', 'ProductionOrder' vb. olabilir
            // Bu alana hangi modelden geldiğini belirtmek için ayrıca bir sourceDocumentType alanı ekleyebilirsiniz.
        },
        notes: {
            type: String,
            default: ''
        },
        user: { // Hareketi yapan kullanıcı (isteğe bağlı)
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true // createdAt ve updatedAt alanlarını otomatik ekler
    }
);

// Mongoose OverwriteModelError hatasını önlemek için kontrol ediyoruz
module.exports = mongoose.models.StockMovement || mongoose.model('StockMovement', stockMovementSchema);