const Product = require('../models/productModel');
const Order = require('../models/orderModel');

const getStats = async (req, res) => {
  try {
    const products = await Product.find({}, "name stock");

    const orders = await Order.aggregate([
      {
        $match: { orderDate: { $exists: true, $ne: null } }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$orderDate" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      stockData: products,
      orderData: orders
    });
  } catch (error) {
    console.error("getStats error:", error);
    res.status(500).json({ message: "İstatistik verisi alınamadı.", error: error.message });
  }
};

module.exports = { getStats };