const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');

// Tüm ürünleri getir
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('rawMaterials.rawMaterial');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Yeni ürün oluştur
router.post('/', async (req, res) => {
  const { name, code, stock, unit, unitPrice, rawMaterials } = req.body;
  const product = new Product({
    name,
    code,
    stock,
    unit,
    unitPrice,
    rawMaterials
  });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ID ile ürün getir
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('rawMaterials.rawMaterial');
    if (!product) return res.status(404).json({ message: 'Ürün bulunamadı' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ürünü güncelle
router.patch('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('rawMaterials.rawMaterial');
    if (!updatedProduct) return res.status(404).json({ message: 'Ürün bulunamadı' });
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Ürünü sil
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: 'Ürün bulunamadı' });
    res.status(200).json({ message: 'Ürün başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;