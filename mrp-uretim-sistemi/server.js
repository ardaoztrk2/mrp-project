const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// const logger = require("morgan"); // Eğer kullanıyorsanız açabilirsiniz, şimdilik yorum satırı yaptım.

require("dotenv").config();

// Rota importları (Her rotayı SADECE BİR KEZ import edin)
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const rawMaterialRoutes = require("./routes/rawMaterialRoutes");
const orderRoutes = require("./routes/orderRoutes");
const stockRoutes = require("./routes/stockRoutes");
const statsRoutes = require("./routes/statsRoutes");
const mrpRoutes = require("./routes/mrpRoutes");
const workCenterRoutes = require("./routes/workCenterRoutes");
const supplierRoutes = require('./routes/supplierRoutes');
const rawMaterialSupplierRoutes = require('./routes/rawMaterialSupplierRoutes');
const purchaseOrderRoutes = require('./routes/purchaseOrderRoutes');
const productionOrderRoutes = require('./routes/productionOrderRoutes');
const stockMovementRoutes = require('./routes/stockMovementRoutes');

const app = express();

// CORS middleware'ini EN ÜSTTE, TÜM DİĞER MIDDLEWARE VE ROTLARDAN ÖNCE EKLEYİN
app.use(cors());

app.use(express.json()); // JSON body parsing middleware
// app.use(logger("dev")); // Eğer kullanıyorsanız açabilirsiniz

// Rota tanımları (Her rotayı SADECE BİR KEZ kullanın)
app.use("/api/stats", statsRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/products", productRoutes); // Sadece bu satır kalsın
app.use("/api/users", userRoutes);
app.use("/api/rawmaterials", rawMaterialRoutes);
app.use("/api/orders", orderRoutes); // Sadece bu satır kalsın
app.use("/api/mrp", mrpRoutes);
app.use("/api/workcenters", workCenterRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/rawmaterialsuppliers', rawMaterialSupplierRoutes);
app.use('/api/purchaseorders', purchaseOrderRoutes);
app.use('/api/productionorders', productionOrderRoutes); // <<<<<<< Bu satırı ekleyin, eğer üretim siparişi rotanız varsa
app.use('/api/stock-movements', stockMovementRoutes);


// MongoDB bağlantısı
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});