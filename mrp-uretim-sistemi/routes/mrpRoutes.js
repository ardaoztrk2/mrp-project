const express = require('express');
const router = express.Router();
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const RawMaterial = require('../models/rawMaterialModel');
const RawMaterialSupplier = require('../models/rawMaterialSupplierModel');
const PurchaseOrder = require('../models/purchaseOrderModel');
const PurchaseOrderItem = require('../models/purchaseOrderItemModel');

// MRP Raporu Oluşturma Endpoint'i
router.get('/report', async (req, res) => {
  try {
    console.log("MRP Report Endpoint Çağrıldı.");

    // 1. Bekleyen Siparişleri Çek
    // 'product' alanını Product modelindeki 'rawMaterials' ile populate et
    const pendingOrders = await Order.find({ status: 'pending' }).populate({
      path: 'product',
      populate: {
        path: 'rawMaterials.rawMaterial', // Product içindeki rawMaterials array'indeki rawMaterial'ı populate et
        model: 'RawMaterial' // RawMaterial modelini kullan
      }
    });

    console.log("Fetched Orders (pending):", pendingOrders.length);
    // Eğer siparişler doğru geliyorsa, detaylı logları kapatabiliriz: console.log(pendingOrders);

    // 2. Tüm Hammaddeleri Çek
    const allRawMaterials = await RawMaterial.find({});
    console.log("Fetched Raw Materials:", allRawMaterials.length);

    // Gerekli Hammaddelerin Toplamını Hesapla
    const requiredRawMaterials = {}; // { rawMaterialId: totalRequiredQuantity }

    for (const order of pendingOrders) {
      // Kontrol: Ürün ve hammaddeler doğru yüklenmiş mi?
      if (!order.product || !order.product.rawMaterials || order.product.rawMaterials.length === 0) {
        console.log(`Uyarı: Sipariş ${order._id} için ürün veya hammaddeler bulunamadı/boş.`);
        continue; // Bu siparişi atla, sonraki siparişe geç
      }

      console.log(`  Processing Order: ${order._id} for Product: ${order.product.name} Quantity: ${order.quantity}`);

      for (const bomItem of order.product.rawMaterials) {
        if (!bomItem.rawMaterial) {
          console.log(`    Uyarı: Ürün ${order.product.name} içindeki bir hammadde bilgisi eksik.`);
          continue; // Bu hammadde kalemini atla
        }
        const rawMaterialId = bomItem.rawMaterial._id.toString();
        const requiredQtyForProduct = bomItem.quantity * order.quantity;

        if (requiredRawMaterials[rawMaterialId]) {
          requiredRawMaterials[rawMaterialId] += requiredQtyForProduct;
        } else {
          requiredRawMaterials[rawMaterialId] = requiredQtyForProduct;
        }
        console.log(`    Raw Material: ${bomItem.rawMaterial.name} (ID: ${rawMaterialId}), Required: ${requiredQtyForProduct}`);
      }
    }

    console.log("Toplam Gerekli Hammaddeler (requiredRawMaterials):", requiredRawMaterials);

    // MRP Raporu Sonuçlarını Oluştur
    const mrpReport = allRawMaterials.map(rawMaterial => {
      const required = requiredRawMaterials[rawMaterial._id.toString()] || 0;
      const available = rawMaterial.currentStock || 0; // <-- DÜZELTİLDİ: 'stock' yerine 'currentStock'
      const missing = Math.max(0, required - available);

      console.log(`MRP Item: ${rawMaterial.name}, Required: ${required}, Available: ${available}, Missing: ${missing}`);

      return {
        rawMaterialId: rawMaterial._id,
        rawMaterialName: rawMaterial.name,
        requiredQuantity: required,
        currentStock: available, // Frontend'e bu isimle gönderiyoruz
        missingQuantity: missing,
        unit: rawMaterial.unit,
      };
    });

    res.status(200).json(mrpReport);

  } catch (error) {
    console.error("MRP raporu oluşturulurken hata:", error);
    res.status(500).json({
      message: "Sunucu hatası.",
      error: error.message
    });
  }
});

// Satınalma Siparişleri Oluşturma Endpoint'i
router.post('/create-purchase-orders', async (req, res) => {
  try {
    const missingRawMaterials = req.body;
    const createdOrderIds = [];

    for (const item of missingRawMaterials) {
      const { rawMaterialId, missingQuantity } = item;

      if (missingQuantity <= 0) {
        console.log(`Eksik miktar sıfır veya daha az (${rawMaterialId}). Sipariş oluşturulmuyor.`);
        continue;
      }

      // Hammadde için uygun bir tedarikçi bul
      const supplierInfo = await RawMaterialSupplier.findOne({ rawMaterial: rawMaterialId })
        .populate('supplier')
        .sort({ price: 1 }); // En ucuz tedarikçiyi bulmak için (isteğe bağlı)

      if (!supplierInfo || !supplierInfo.supplier) {
        // Eğer tedarikçi bulunamazsa veya tedarikçi bilgisi eksikse
        console.log(`Uygun tedarikçi bulunamadı veya tedarikçi bilgisi eksik for RawMaterialId: ${rawMaterialId}`);
        continue; // Bu hammadde için sipariş oluşturmadan sonraki hammaddeye geç
      }

      const supplier = supplierInfo.supplier;
      const unitPrice = supplierInfo.price;
      const minOrderQuantity = supplierInfo.minimumOrderQuantity || 1;

      // Sipariş verilecek miktar, minimum sipariş miktarından az olmamalı ve eksik miktarı karşılamalı
      const quantityToOrder = Math.max(missingQuantity, minOrderQuantity);

      // Yeni bir satınalma siparişi oluştur
      const purchaseOrder = new PurchaseOrder({
        supplier: supplier._id,
        orderNumber: `PO-${Date.now()}-${Math.floor(Math.random() * 1000)}`, // Benzersiz sipariş numarası
        orderDate: new Date(),
        status: 'pending',
        totalAmount: 0
      });

      await purchaseOrder.save();

      // Sipariş kalemi oluştur
      const purchaseOrderItem = new PurchaseOrderItem({
        purchaseOrder: purchaseOrder._id,
        rawMaterial: rawMaterialId,
        quantity: quantityToOrder,
        unitPrice: unitPrice,
        totalPrice: quantityToOrder * unitPrice
      });

      await purchaseOrderItem.save();

      // Satınalma siparişinin toplam tutarını güncelle
      purchaseOrder.totalAmount += purchaseOrderItem.totalPrice;
      await purchaseOrder.save();

      console.log(`Satınalma Siparişi Oluşturuldu: ${purchaseOrder.orderNumber} for Raw Material: ${supplierInfo.rawMaterial.name || rawMaterialId} Quantity: ${quantityToOrder}`);
      createdOrderIds.push(purchaseOrder._id);
    }

    if (createdOrderIds.length > 0) {
      res.status(200).json({
        message: 'Satınalma siparişleri başarıyla oluşturuldu.',
        orderIds: createdOrderIds
      });
    } else {
      res.status(200).json({
        message: 'Eksik hammadde bulunamadı veya uygun tedarikçi belirlenemedi. Hiçbir sipariş oluşturulmadı.',
        orderIds: []
      });
    }

  } catch (error) {
    console.error('Satınalma siparişleri oluşturulurken hata:', error);
    res.status(500).json({
      message: 'Sunucu hatası.',
      error: error.message
    });
  }
});

module.exports = router;
