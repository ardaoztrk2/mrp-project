const mongoose = require("mongoose");

const rawMaterialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    // required: true, // Frontend'de olmadığı için zorunlu olmaktan çıkarıldı
    unique: true,
  },
  currentStock: { // <<-- İsim 'currentStock' olarak DÜZELTİLDİ
    type: Number,
    default: 0,
  },
  unit: {
    type: String,
    required: true,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model("RawMaterial", rawMaterialSchema);
