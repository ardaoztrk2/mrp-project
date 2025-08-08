const express = require("express");
const router = express.Router();
const Product = require('../models/productModel');
const RawMaterial = require('../models/rawMaterialModel');

// Kritik stok uyarısı için endpoint
router.get("/low", async (req, res) => {
  try {
    const lowProducts = await Product.find({ stock: { $lt: 10 } });
    const lowMaterials = await RawMaterial.find({ stock: { $lt: 10 } });

    res.json({ lowProducts, lowMaterials });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
