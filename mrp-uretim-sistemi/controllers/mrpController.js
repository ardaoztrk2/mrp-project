// mrp-uretim-sistemi/controllers/mrpController.js
const Order = require('../models/orderModel');
const Product = require("../models/productModel");
const RawMaterial = require("../models/rawMaterialModel");

/**
 * @desc Malzeme İhtiyaç Planlaması (MRP) raporu oluşturur.
 * Bekleyen siparişlere göre hammadde ihtiyaçlarını hesaplar ve stokla karşılaştırır.
 * @route GET /api/mrp/report
 * @access Private/Admin
 */
const getMrpReport = async (req, res) => {
  try {
    // 1. Bekleyen (pending) veya Üretimde (in production) olan siparişleri al
    // 'shipped' durumu tamamlanmış sipariş olduğu için dahil edilmedi,
    // ancak MRP planlaması için 'in production' eklendi.
    const pendingOrders = await Order.find({
      status: { $in: ["pending", "in production"] },
    })
      .populate("product")
      .populate({
        path: "customRawMaterials.rawMaterial", // Özel hammaddeleri populate et
        model: "RawMaterial",
        select: "name unit currentStock",
      });

    // Toplam hammadde ihtiyacını tutacak bir nesne
    const totalRawMaterialNeeds = {};

    // 2. Her bir sipariş için BOM patlatma (Bill of Materials Explosion) yap
    for (const order of pendingOrders) {
      let rawMaterialsToUse = [];
      // Siparişin özel hammaddeleri varsa onları kullan, yoksa ürünün hammaddelerini kullan
      if (order.customRawMaterials && order.customRawMaterials.length > 0) {
        rawMaterialsToUse = order.customRawMaterials;
      } else if (order.product && order.product.rawMaterials) {
        // Ürünün hammaddelerini getirmek için product modelini tekrar sorgula
        // Çünkü yukarıdaki populate sadece customRawMaterials'ı populate etti.
        const productDetails = await Product.findById(order.product._id).populate("rawMaterials.rawMaterial");
        rawMaterialsToUse = productDetails.rawMaterials;
      }

      for (const item of rawMaterialsToUse) {
        if (!item.rawMaterial || !item.rawMaterial._id) {
          continue; // Hammadde bilgisi eksikse atla
        }
        const rawMaterialId = item.rawMaterial._id.toString();
        const rawMaterialName = item.rawMaterial.name;
        const rawMaterialUnit = item.rawMaterial.unit;
        // Sipariş miktarına göre gerekli olan toplam hammadde miktarını hesapla
        const neededForThisOrder = item.quantity * order.quantity;

        if (totalRawMaterialNeeds[rawMaterialId]) {
          totalRawMaterialNeeds[rawMaterialId].requiredQuantity += neededForThisOrder;
        } else {
          totalRawMaterialNeeds[rawMaterialId] = {
            name: rawMaterialName,
            unit: rawMaterialUnit,
            requiredQuantity: neededForThisOrder,
            currentStock: 0, // Aşağıda güncellenecek
            shortage: 0, // Aşağıda güncellenecek
          };
        }
      }
    }

    // 3. Mevcut hammadde stoklarını al
    const allRawMaterials = await RawMaterial.find({});
    const rawMaterialStocks = {};
    for (const rm of allRawMaterials) {
      // Stok alanı adını "currentStock" olarak güncelledik
      rawMaterialStocks[rm._id.toString()] = rm.currentStock;
    }

    // 4. İhtiyaçları stoklarla karşılaştır ve eksiklikleri belirle
    const mrpReport = [];
    for (const rmId in totalRawMaterialNeeds) {
      const needed = totalRawMaterialNeeds[rmId].requiredQuantity;
      const current = rawMaterialStocks[rmId] || 0; // Stokta yoksa 0 kabul et
      const shortage = Math.max(0, needed - current); // Eksik miktar

      mrpReport.push({
        rawMaterialId: rmId,
        name: totalRawMaterialNeeds[rmId].name,
        unit: totalRawMaterialNeeds[rmId].unit,
        requiredQuantity: needed,
        currentStock: current,
        shortage: shortage,
      });
    }

    // Raporu gönder
    res.status(200).json(mrpReport);
  } catch (error) {
    console.error("MRP raporu oluşturulurken hata:", error);
    res.status(500).json({ message: "MRP raporu oluşturulamadı", error: error.message });
  }
};

module.exports = {
  getMrpReport
};
