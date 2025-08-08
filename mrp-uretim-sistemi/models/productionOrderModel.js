// mrp-uretim-sistemi/models/ProductionOrder.js
const mongoose = require('mongoose');

const productionOrderSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Hangi ürünün üretileceği
    required: true,
  },
  quantity: {
    type: Number,
    required: [true, 'Üretim miktarı zorunludur'],
    min: [1, 'Üretim miktarı en az 1 olmalıdır'],
  },
  startDate: { // Üretimin başlama tarihi planı
    type: Date,
    required: [true, 'Başlangıç tarihi zorunludur'],
  },
  endDate: { // Üretimin bitiş tarihi planı
    type: Date,
    required: [true, 'Bitiş tarihi zorunludur'],
  },
  status: {
    type: String,
    enum: ['planned', 'in-progress', 'completed', 'cancelled', 'on-hold'], // Üretim siparişi durumları
    default: 'planned',
  },
  // Bu üretim siparişinin hangi müşteri siparişinden geldiği (isteğe bağlı)
  customerOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: false, // Her üretim siparişi bir müşteri siparişinden gelmeyebilir (örn: stok için üretim)
  },
  notes: {
    type: String,
    trim: true,
  },
  // Üretim siparişi için tahmini iş yükü (kapasite planlaması için)
  // Bu alan, ürünün rotasyon adımlarından dinamik olarak hesaplanabilir.
  // Şimdilik sadece bir placeholder olarak ekliyoruz, hesaplama mantığı daha sonra eklenecek.
  estimatedWorkload: {
    type: Number,
    default: 0,
    min: 0,
  },
  estimatedWorkloadUnit: {
    type: String,
    enum: ['saat', 'dakika'],
    default: 'saat',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Kaydetme öncesi veya güncelleme öncesi estimatedWorkload hesaplama (isteğe bağlı, daha sonra eklenebilir)
// productionOrderSchema.pre('save', async function(next) {
//   // Bu kısımda ürünün rotasyon bilgilerine göre estimatedWorkload...
// });

module.exports = mongoose.model("ProductionOrder", productionOrderSchema);