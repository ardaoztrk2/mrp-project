const express = require('express');
const router = express.Router();
const Order = require('../models/orderModel');
const Product = require('../models/productModel');

// Tüm siparişleri getir
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('product');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Yeni sipariş oluştur
router.post('/', async (req, res) => {
  console.log("Gelen body:", req.body); // 🔍 Log ekle

  const { customerName, product, quantity, orderDate, status } = req.body;
  const order = new Order({
    customerName,
    product,
    quantity,
    orderDate,
    status
  });

  try {
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ID ile sipariş getir
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('product');
    if (!order) return res.status(404).json({ message: 'Sipariş bulunamadı' });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Siparişi güncelle
// DÜZELTİLDİ: 'patch' yerine 'put' metodu kullanıldı
router.put('/:id', async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('product');
    if (!updatedOrder) return res.status(404).json({ message: 'Sipariş bulunamadı' });
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Siparişi sil
router.delete('/:id', async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) return res.status(404).json({ message: 'Sipariş bulunamadı' });
    res.status(200).json({ message: 'Sipariş başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
