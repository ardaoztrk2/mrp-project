// mrp-uretim-sistemi/controllers/productionOrderController.js
const ProductionOrder = require('../models/productionOrderModel'); // Düzeltildi
const Product = require('../models/productModel');
const WorkCenter = require('../models/workCenterModel'); // Düzeltildi
const asyncHandler = require('express-async-handler'); // Async işlemleri daha temiz yönetmek için

// @desc    Tüm üretim siparişlerini getir
// @route   GET /api/productionorders
// @access  Private
const getProductionOrders = asyncHandler(async (req, res) => {
  const productionOrders = await ProductionOrder.find({})
    .populate('product', 'name code unit') // Ürün adını, kodunu ve birimini getir
    .populate('customerOrder', 'orderNumber status'); // Müşteri sipariş numarasını ve durumunu getir (varsa)

  res.status(200).json(productionOrders);
});

// @desc    ID'ye göre üretim siparişi getir
// @route   GET /api/productionorders/:id
// @access  Private
const getProductionOrderById = asyncHandler(async (req, res) => {
  const productionOrder = await ProductionOrder.findById(req.params.id)
    .populate('product', 'name code unit routing') // Ürün adını, kodunu, birimini ve rotasyonunu getir
    .populate('customerOrder', 'orderNumber status'); // Müşteri sipariş numarasını ve durumunu getir (varsa)

  if (productionOrder) {
    // Rotasyon adımlarındaki iş merkezlerini populate et
    if (productionOrder.product && productionOrder.product.routing && productionOrder.product.routing.length > 0) {
      for (let i = 0; i < productionOrder.product.routing.length; i++) {
        productionOrder.product.routing[i].workCenter = await WorkCenter.findById(productionOrder.product.routing[i].workCenter);
      }
    }
    res.status(200).json(productionOrder);
  } else {
    res.status(404);
    throw new Error('Üretim siparişi bulunamadı');
  }
});

// @desc    Yeni üretim siparişi oluştur
// @route   POST /api/productionorders
// @access  Private
const createProductionOrder = asyncHandler(async (req, res) => {
  const { product, quantity, startDate, endDate, customerOrder, notes } = req.body;

  if (!product || !quantity || !startDate || !endDate) {
    res.status(400);
    throw new Error('Lütfen tüm zorunlu alanları doldurun.');
  }

  // Başlangıç tarihinin bitiş tarihinden önce olup olmadığını kontrol et
  if (new Date(startDate) > new Date(endDate)) {
    res.status(400);
    throw new Error('Başlangıç tarihi bitiş tarihinden sonra olamaz.');
  }

  const newProductionOrder = new ProductionOrder({
    product,
    quantity,
    startDate,
    endDate,
    customerOrder: customerOrder || null, // Müşteri siparişi varsa ata
    notes,
  });

  const createdProductionOrder = await newProductionOrder.save();
  res.status(201).json(createdProductionOrder);
});

// @desc    Üretim siparişini güncelle
// @route   PUT /api/productionorders/:id
// @access  Private
const updateProductionOrder = asyncHandler(async (req, res) => {
  const { product, quantity, startDate, endDate, status, customerOrder, notes } = req.body;

  const productionOrder = await ProductionOrder.findById(req.params.id);

  if (productionOrder) {
    if (!product || !quantity || !startDate || !endDate) {
      res.status(400);
      throw new Error('Lütfen tüm zorunlu alanları doldurun.');
    }

    // Başlangıç tarihinin bitiş tarihinden önce olup olmadığını kontrol et
    if (new Date(startDate) > new Date(endDate)) {
      res.status(400);
      throw new Error('Başlangıç tarihi bitiş tarihinden sonra olamaz.');
    }

    productionOrder.product = product;
    productionOrder.quantity = quantity;
    productionOrder.startDate = startDate;
    productionOrder.endDate = endDate;
    productionOrder.status = status || productionOrder.status; // Durum güncellenmezse mevcut kalır
    productionOrder.customerOrder = customerOrder || null;
    productionOrder.notes = notes || '';
    productionOrder.updatedAt = Date.now();

    const updatedProductionOrder = await productionOrder.save();
    res.status(200).json(updatedProductionOrder);
  } else {
    res.status(404);
    throw new Error('Üretim siparişi bulunamadı');
  }
});

// @desc    Üretim siparişini sil
// @route   DELETE /api/productionorders/:id
// @access  Private
const deleteProductionOrder = asyncHandler(async (req, res) => {
  const productionOrder = await ProductionOrder.findById(req.params.id);

  if (productionOrder) {
    await productionOrder.deleteOne(); // deleteOne() kullanarak sil
    res.status(200).json({ message: 'Üretim siparişi başarıyla silindi' });
  } else {
    res.status(404);
    throw new Error('Üretim siparişi bulunamadı');
  }
});

module.exports = {
  getProductionOrders,
  getProductionOrderById,
  createProductionOrder,
  updateProductionOrder,
  deleteProductionOrder,
};