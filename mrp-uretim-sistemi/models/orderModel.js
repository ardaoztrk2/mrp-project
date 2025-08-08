const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // 'Product' modeline referans veriyoruz
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
  enum: ['pending', 'completed', 'cancelled', 'shipped'], // 'shipped' değerini buraya ekleyin
  default: 'pending',
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Order", orderSchema);