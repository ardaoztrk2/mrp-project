// mrp-uretim-sistemi/controllers/orderController.js
const Order = require('../models/orderModel');
const Product = require("../models/productModel");
const RawMaterial = require("../models/rawMaterialModel");

// Tüm siparişleri getir
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("product")
      .populate({
        path: "customRawMaterials.rawMaterial",
        model: "RawMaterial",
        select: "name unit",
      })
      .sort({ orderDate: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Siparişleri alırken hata:", error);
    res.status(500).json({ message: "Siparişler alınamadı", error: error.message });
  }
};

// Belirli bir siparişi ID'ye göre getir
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("product")
      .populate({
        path: "customRawMaterials.rawMaterial",
        model: "RawMaterial",
        select: "name unit",
      });
    if (!order) {
      return res.status(404).json({ message: "Sipariş bulunamadı." });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error("Sipariş alınırken hata:", error);
    res.status(500).json({ message: "Sipariş alınamadı", error: error.message });
  }
};

// Yeni sipariş oluştur
const createOrder = async (req, res) => {
  const { customerName, product, quantity, customRawMaterials } = req.body;

  if (!customerName || !product || quantity === undefined) {
    return res.status(400).json({ message: "Lütfen tüm gerekli alanları doldurun: Müşteri Adı, Ürün ve Miktar." });
  }

  try {
    // Hammadde stok kontrolü
    let rawMaterialsToUse = [];
    if (customRawMaterials && customRawMaterials.length > 0) {
      rawMaterialsToUse = customRawMaterials;
    } else {
      const productDetails = await Product.findById(product);
      if (!productDetails) {
        return res.status(404).json({ message: "Ürün bulunamadı." });
      }
      if (!productDetails.rawMaterials || productDetails.rawMaterials.length === 0) {
        console.warn(`Ürün ${productDetails.name} için BOM bulunamadı.`);
        rawMaterialsToUse = [];
      } else {
        rawMaterialsToUse = productDetails.rawMaterials;
      }
    }

    if (rawMaterialsToUse.length > 0) {
      for (const item of rawMaterialsToUse) {
        if (!item.rawMaterial || item.quantity === undefined) {
          return res.status(400).json({ message: "Hammadde bilgisi eksik (rawMaterial veya quantity)." });
        }
        const rawMaterial = await RawMaterial.findById(item.rawMaterial);
        if (!rawMaterial || rawMaterial.currentStock < (item.quantity * quantity)) {
          return res.status(400).json({ message: `Yetersiz hammadde stoğu: ${rawMaterial ? rawMaterial.name : "Bilinmeyen Hammadde"}` });
        }
      }

      for (const item of rawMaterialsToUse) {
        await RawMaterial.findByIdAndUpdate(
          item.rawMaterial,
          { $inc: { currentStock: -(item.quantity * quantity) } },
          { new: true }
        );
      }
    }

    const newOrder = await Order.create({ customerName, product, quantity, customRawMaterials });
    res.status(201).json({ message: "Sipariş başarıyla oluşturuldu.", order: newOrder });
  } catch (error) {
    console.error("Sipariş oluşturulurken hata:", error);
    res.status(500).json({ message: "Sipariş oluşturulamadı", error: error.message });
  }
};

// Sipariş güncelle
const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { customerName, productId, quantity, status, customRawMaterials } = req.body;

  try {
    const order = await Order.findById(id).populate("product");

    if (!order) {
      return res.status(404).json({ message: "Sipariş bulunamadı." });
    }

    // Değerleri alıyoruz
    const oldProductId = order.product ? order.product._id.toString() : null;
    const oldQuantity = order.quantity;
    const newQuantity = quantity !== undefined ? quantity : oldQuantity;
    const isProductChanged = productId && productId !== oldProductId;
    const isQuantityChanged = newQuantity !== oldQuantity;

    // Eğer ürün veya miktar değişiyorsa stok yönetimi yap
    if (isProductChanged || isQuantityChanged) {
      // 1. Yeni ürün için yeterli stok var mı diye kontrol et (ÖNCELİKLE)
      let newRawMaterialsToUse = [];
      const newProductId = isProductChanged ? productId : oldProductId;
      
      const newProduct = await Product.findById(newProductId);
      if (!newProduct) {
        return res.status(404).json({ message: "Yeni ürün bulunamadı." });
      }

      if (customRawMaterials && customRawMaterials.length > 0) {
        newRawMaterialsToUse = customRawMaterials;
      } else {
        newRawMaterialsToUse = newProduct.rawMaterials;
      }

      if (newRawMaterialsToUse.length > 0) {
        for (const item of newRawMaterialsToUse) {
          if (!item.rawMaterial || item.quantity === undefined) {
            return res.status(400).json({ message: "Hammadde bilgisi eksik." });
          }
          const rawMaterial = await RawMaterial.findById(item.rawMaterial);
          if (!rawMaterial || rawMaterial.currentStock < (item.quantity * newQuantity)) {
            return res.status(400).json({ message: `Yetersiz hammadde stoğu: ${rawMaterial ? rawMaterial.name : "Bilinmeyen Hammadde"}` });
          }
        }
      }

      // 2. Stok yeterliyse, eski ürünün hammaddelerini stoğa iade et
      const oldRawMaterials = order.customRawMaterials && order.customRawMaterials.length > 0
        ? order.customRawMaterials
        : oldProduct?.rawMaterials;

      if (oldRawMaterials) {
        for (const item of oldRawMaterials) {
          if (item.rawMaterial && item.quantity) {
            await RawMaterial.findByIdAndUpdate(
              item.rawMaterial,
              { $inc: { currentStock: item.quantity * oldQuantity } },
              { new: true }
            );
          }
        }
      }

      // 3. Yeni ürünün hammaddelerini stoktan düş
      if (newRawMaterialsToUse.length > 0) {
        for (const item of newRawMaterialsToUse) {
          await RawMaterial.findByIdAndUpdate(
            item.rawMaterial,
            { $inc: { currentStock: -(item.quantity * newQuantity) } },
            { new: true }
          );
        }
      }
    }

    // 4. Sipariş bilgilerini güncelle
    order.customerName = customerName !== undefined ? customerName : order.customerName;
    order.product = productId !== undefined ? productId : oldProductId;
    order.quantity = newQuantity;
    order.status = status !== undefined ? status : order.status;
    order.customRawMaterials = customRawMaterials !== undefined ? customRawMaterials : order.customRawMaterials;

    await order.save();
    res.status(200).json({ message: "Sipariş başarıyla güncellendi.", order });
  } catch (error) {
    console.error("Sipariş güncellenirken hata:", error);
    res.status(500).json({ message: "Sipariş güncellenemedi", error: error.message });
  }
};

// Sipariş sil
const deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id).populate("product");

    if (!order) {
      return res.status(404).json({ message: "Sipariş bulunamadı." });
    }

    const materialsToReturn = order.customRawMaterials && order.customRawMaterials.length > 0
      ? order.customRawMaterials
      : order.product?.rawMaterials;

    if (materialsToReturn) {
      for (const item of materialsToReturn) {
        if (item.rawMaterial && item.quantity) {
          await RawMaterial.findByIdAndUpdate(
            item.rawMaterial,
            { $inc: { currentStock: item.quantity * order.quantity } },
            { new: true }
          );
        }
      }
    }

    await Order.deleteOne({ _id: id });
    res.status(200).json({ message: "Sipariş başarıyla silindi." });
  } catch (error) {
    console.error("Sipariş silinirken hata:", error);
    res.status(500).json({ message: "Sipariş silinemedi", error: error.message });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
};
