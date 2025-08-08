const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  stock: {
    type: Number,
    default: 0
  },
  unit: {
    type: String,
    required: true
  },
  unitPrice: {
    type: Number,
    default: 0
  },
  rawMaterials: [{ // Ürünün hammaddeleri (BOM - Bill of Materials)
    rawMaterial: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RawMaterial', // 'RawMaterial' modeline referans
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model("Product", productSchema);