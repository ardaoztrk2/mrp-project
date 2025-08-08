// routes/purchaseOrderRoutes.js
const express = require('express');
const router = express.Router();
const PurchaseOrder = require("../models/purchaseOrderModel"); // PurchaseOrder modelinizi içe aktarın
const PurchaseOrderItem = require('../models/PurchaseOrderItemModel'); // PurchaseOrderItem modelinizi içe aktarın
const RawMaterial = require('../models/rawMaterialModel'); // Hammadde modelinizi içe aktarın (stok güncelleme için)
const Supplier = require('../models/suppliermodel');
const RawMaterialSupplier = require('../models/rawMaterialSupplierModel');

// Otomatik sipariş numarası oluşturma (basit bir örnek)
const generateOrderNumber = async () => {
    const count = await PurchaseOrder.countDocuments();
    return `PO-${String(count + 1).padStart(5, '0')}`; // Örn: PO-00001
};

// POST yeni satınalma siparişi oluştur
// POST /api/purchaseorders
// Body: { supplierId: "...", items: [{ rawMaterialId: "...", quantity: N }] }
router.post('/', async (req, res) => {
    const { supplierId, items, notes } = req.body;

    if (!supplierId || !items || items.length === 0) {
        return res.status(400).json({ message: 'Tedarikçi ve sipariş kalemleri gereklidir.' });
    }

    try {
        const supplier = await Supplier.findById(supplierId);
        if (!supplier) {
            return res.status(404).json({ message: 'Belirtilen tedarikçi bulunamadı.' });
        }

        const orderNumber = await generateOrderNumber();

        const newPurchaseOrder = new PurchaseOrder({
            orderNumber,
            supplier: supplierId,
            notes
        });

        let totalAmount = 0;
        const purchaseOrderItems = [];
        let maxLeadTime = 0; // maxLeadTime'ı burada başlatıyoruz

        for (const item of items) {
            const rawMaterial = await RawMaterial.findById(item.rawMaterialId);
            if (!rawMaterial) {
                return res.status(404).json({ message: `Hammadde ID bulunamadı: ${item.rawMaterialId}` });
            }

            // Her bir item için kendi rawMaterialSupplierInfo'yu bul
            const rawMaterialSupplierInfoForThisItem = await RawMaterialSupplier.findOne({
                rawMaterial: item.rawMaterialId,
                supplier: supplierId
            });

            let unitPrice = rawMaterialSupplierInfoForThisItem ? rawMaterialSupplierInfoForThisItem.unitPrice : 0;
            let currentLeadTime = rawMaterialSupplierInfoForThisItem ? rawMaterialSupplierInfoForThisItem.leadTime : 0;

            // En uzun tedarik süresini güncelle
            if (currentLeadTime > maxLeadTime) {
                maxLeadTime = currentLeadTime;
            }

            if (item.unitPrice !== undefined) {
                unitPrice = item.unitPrice;
            }

            const subtotal = item.quantity * unitPrice;
            totalAmount += subtotal;

            purchaseOrderItems.push({
                purchaseOrder: newPurchaseOrder._id,
                rawMaterial: item.rawMaterialId,
                quantity: item.quantity,
                unitPrice: unitPrice,
                subtotal: subtotal
            });
        }

        newPurchaseOrder.totalAmount = totalAmount;
        // Beklenen teslim tarihini hesapla (döngüde bulunan en uzun lead time'a göre)
        newPurchaseOrder.deliveryDateExpected = new Date(Date.now() + maxLeadTime * 24 * 60 * 60 * 1000);

        const savedOrder = await newPurchaseOrder.save();
        await PurchaseOrderItem.insertMany(purchaseOrderItems);

        res.status(201).json(savedOrder);

    } catch (error) {
        console.error("Satınalma Siparişi Oluşturma Hatası:", error);
        res.status(500).json({ message: error.message });
    }
});

// GET tüm satınalma siparişlerini getir (item'ları ve tedarikçiyi populate et)
// GET /api/purchaseorders
router.get('/', async (req, res) => {
    try {
        const purchaseOrders = await PurchaseOrder.find({})
            .populate('supplier') // Tedarikçi detaylarını getir
            .sort({ orderDate: -1 }); // En yeniyi üste al

        // Her sipariş için kalemleri de getir
        const ordersWithItems = await Promise.all(purchaseOrders.map(async (order) => {
            const items = await PurchaseOrderItem.find({ purchaseOrder: order._id })
                .populate('rawMaterial'); // Hammadde detaylarını getir
            return { ...order.toObject(), items };
        }));

        res.status(200).json(ordersWithItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET tek bir satınalma siparişini ID'ye göre getir
// GET /api/purchaseorders/:id
router.get('/:id', async (req, res) => {
    try {
        const purchaseOrder = await PurchaseOrder.findById(req.params.id)
            .populate('supplier');

        if (!purchaseOrder) {
            return res.status(404).json({ message: 'Satınalma siparişi bulunamadı.' });
        }

        const items = await PurchaseOrderItem.find({ purchaseOrder: req.params.id })
            .populate('rawMaterial');

        res.status(200).json({ ...purchaseOrder.toObject(), items });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT satınalma siparişinin durumunu güncelle (veya diğer alanları)
// PUT /api/purchaseorders/:id
router.put('/:id', async (req, res) => {
    const { status, notes } = req.body; // Örnek olarak sadece status ve notes güncellensin

    try {
        const updatedPurchaseOrder = await PurchaseOrder.findByIdAndUpdate(
            req.params.id,
            { status, notes, updatedAt: Date.now() }, // updatedAt'ı manuel güncelle
            { new: true, runValidators: true }
        )
        .populate('supplier');

        if (!updatedPurchaseOrder) {
            return res.status(404).json({ message: 'Satınalma siparişi bulunamadı.' });
        }

        // Eğer durum 'Received' (Teslim Edildi) ise, stoğu güncelle
        if (status === 'Received') {
            const orderItems = await PurchaseOrderItem.find({ purchaseOrder: updatedPurchaseOrder._id });
            for (const item of orderItems) {
                // Her bir hammadde için stoğu artır
                await RawMaterial.findByIdAndUpdate(
                    item.rawMaterial,
                    { $inc: { stockQuantity: item.quantity } }, // Stok miktarını artır
                    { new: true }
                );
                // Sipariş kalemindeki alınan miktarı güncelle (opsiyonel)
                await PurchaseOrderItem.findByIdAndUpdate(
                    item._id,
                    { receivedQuantity: item.quantity, updatedAt: Date.now() },
                    { new: true }
                );
            }
        }

        const items = await PurchaseOrderItem.find({ purchaseOrder: updatedPurchaseOrder._id })
            .populate('rawMaterial');

        res.status(200).json({ ...updatedPurchaseOrder.toObject(), items });

    } catch (error) {
        console.error("Satınalma Siparişi Güncelleme Hatası:", error);
        res.status(500).json({ message: error.message });
    }
});

// DELETE satınalma siparişini ve kalemlerini sil
// DELETE /api/purchaseorders/:id
router.delete('/:id', async (req, res) => {
    try {
        const deletedPurchaseOrder = await PurchaseOrder.findByIdAndDelete(req.params.id);
        if (!deletedPurchaseOrder) {
            return res.status(404).json({ message: 'Satınalma siparişi bulunamadı.' });
        }
        // İlişkili tüm kalemleri de sil
        await PurchaseOrderItem.deleteMany({ purchaseOrder: req.params.id });

        res.status(200).json({ message: 'Satınalma siparişi ve kalemleri başarıyla silindi.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;