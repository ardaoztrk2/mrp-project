// mrp-uretim-sistemi/controllers/productController.js
const Product = require('../models/productModel');
const RawMaterial = require('../models/rawMaterialModel');
const WorkCenter = require('../models/workCenterModel');

// Tüm ürünleri getir
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate('rawMaterials.rawMaterial', 'name unit') // Hammadde adını ve birimini getir
      .populate('routing.workCenter', 'name code capacityUnit') // İş merkezi adını, kodunu ve kapasite birimini getir
      .sort({ createdAt: -1 }) // En yeni ürünleri öne getir
      .lean(); // Veriyi düz JavaScript objesi olarak al
    res.status(200).json(products);
  } catch (error) {
    console.error('Ürünler alınırken hata:', error);
    res.status(500).json({ message: 'Ürünler alınamadı', error: error.message });
  }
};

// Yeni ürün oluştur
const createProduct = async (req, res) => {
  // Not: productModel'de 'stock' alanı tanımlı olduğu için, burada 'stock' yerine 'quantity' kullanılması
  // front-end'den gelen veriye göre ayarlanmalıdır. Eğer front-end 'stock' gönderiyorsa, onu kullanın.
  const { name, code, description, stock, unit, unitPrice, rawMaterials, routing } = req.body;

  if (!name || !code || stock === undefined || !unit || unitPrice === undefined) {
    return res.status(400).json({ message: 'Lütfen tüm gerekli alanları doldurun: Ad, Kod, Stok, Birim, Birim Fiyat.' });
  }

  try {
    const productExists = await Product.findOne({ $or: [{ name }, { code }] });
    if (productExists) {
      return res.status(400).json({ message: 'Bu ürün adı veya kodu zaten mevcut.' });
    }

    // Hammadde ve İş Merkezi ID'lerinin geçerliliğini kontrol et
    if (rawMaterials && rawMaterials.length > 0) {
      for (const item of rawMaterials) {
        if (!await RawMaterial.findById(item.rawMaterial)) {
          return res.status(400).json({ message: `Hammadde ID'si geçersiz: ${item.rawMaterial}` });
        }
      }
    }

    if (routing && routing.length > 0) {
      for (const step of routing) {
        if (!await WorkCenter.findById(step.workCenter)) {
          return res.status(400).json({ message: `İş Merkezi ID'si geçersiz: ${step.workCenter}` });
        }
      }
    }

    const newProduct = await Product.create({
      name,
      code,
      description,
      stock: stock, // Modeldeki 'stock' alanına eşleştirildi
      unit,
      unitPrice,
      rawMaterials,
      routing,
    });
    res.status(201).json({ message: 'Ürün başarıyla eklendi.', product: newProduct });
  } catch (error) {
    console.error('Ürün oluşturulurken hata:', error);
    res.status(500).json({ message: 'Ürün oluşturulamadı', error: error.message });
  }
};

// Belirli bir ürünü ID'ye göre getir
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('rawMaterials.rawMaterial', 'name unit')
      .populate('routing.workCenter', 'name code capacityUnit')
      .lean(); // Veriyi düz JavaScript objesi olarak al

    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı.' });
    }

    // Hammadde listesindeki null değerleri filtreleyerek veri bütünlüğünü sağla
    if (product.rawMaterials) {
      product.rawMaterials = product.rawMaterials.filter(item => item.rawMaterial);
    }
    // Rotalama listesindeki null değerleri filtreleyerek veri bütünlüğünü sağla
    if (product.routing) {
      product.routing = product.routing.filter(step => step.workCenter);
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Ürün alınırken hata:', error);
    res.status(500).json({ message: 'Ürün alınamadı', error: error.message });
  }
};

// Ürünü güncelle
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, code, description, stock, unit, unitPrice, rawMaterials, routing } = req.body;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı.' });
    }

    // Hammadde ve İş Merkezi ID'lerinin geçerliliğini kontrol et
    if (rawMaterials && rawMaterials.length > 0) {
      for (const item of rawMaterials) {
        if (!await RawMaterial.findById(item.rawMaterial)) {
          return res.status(400).json({ message: `Güncelleme: Hammadde ID'si geçersiz: ${item.rawMaterial}` });
        }
      }
    }

    if (routing && routing.length > 0) {
      for (const step of routing) {
        if (!await WorkCenter.findById(step.workCenter)) {
          return res.status(400).json({ message: `Güncelleme: İş Merkezi ID'si geçersiz: ${step.workCenter}` });
        }
      }
    }

    product.name = name || product.name;
    product.code = code || product.code;
    product.description = description !== undefined ? description : product.description;
    product.stock = stock !== undefined ? stock : product.stock; // Modeldeki 'stock' alanı kullanıldı
    product.unit = unit || product.unit;
    product.unitPrice = unitPrice !== undefined ? unitPrice : product.unitPrice;
    product.rawMaterials = rawMaterials || product.rawMaterials;
    product.routing = routing !== undefined ? routing : product.routing;

    await product.save();
    res.status(200).json({ message: 'Ürün başarıyla güncellendi.', product });
  } catch (error) {
    console.error('Ürün güncellenirken hata:', error);
    res.status(500).json({ message: 'Ürün güncellenemedi', error: error.message });
  }
};

// Ürünü sil
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı.' });
    }
    await Product.deleteOne({ _id: id });
    res.status(200).json({ message: 'Ürün başarıyla silindi.' });
  } catch (error) {
    console.error('Ürün silinirken hata:', error);
    res.status(500).json({ message: 'Ürün silinemedi', error: error.message });
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
