// mrp-uretim-sistemi/models/WorkCenter.js
const mongoose = require('mongoose');

// İş Merkezi Şeması
const workCenterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'İş merkezi adı zorunludur'],
    unique: true, // İş merkezi adları benzersiz olmalı
    trim: true,
  },
  code: {
    type: String,
    required: [true, 'İş merkezi kodu zorunludur'],
    unique: true, // İş merkezi kodları benzersiz olmalı
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  // Günlük/haftalık kapasite (örn: saat, adet)
  // Bu, daha sonra kapasite yükleme raporlarında kullanılacak temel kapasite değeridir.
  capacity: {
    type: Number,
    required: [true, 'Kapasite zorunludur'],
    min: [0, 'Kapasite negatif olamaz'],
  },
  capacityUnit: { // Kapasite birimi (örn: saat/gün, adet/gün)
    type: String,
    required: [true, 'Kapasite birimi zorunludur'],
    enum: ['saat/gün', 'adet/gün', 'saat/hafta', 'adet/hafta', 'dakika/ürün', 'saat/ürün'], // Örnek birimler
    default: 'saat/gün',
  },
  // İş merkezine atanmış makine sayısı (isteğe bağlı)
  machineCount: {
    type: Number,
    default: 0,
    min: [0, 'Makine sayısı negatif olamaz'],
  },
  // İş merkezine atanmış personel sayısı (isteğe bağlı)
  personnelCount: {
    type: Number,
    default: 0,
    min: [0, 'Personel sayısı negatif olamaz'],
  },
  isActive: { // İş merkezinin aktif olup olmadığı
    type: Boolean,
    default: true,
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

workCenterSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const WorkCenter = mongoose.model('WorkCenter', workCenterSchema);

module.exports = WorkCenter;