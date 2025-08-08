const jwt = require("jsonwebtoken");
const User = require("../models/usermodel"); // User modelini ekle

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ message: "Token bulunamadı" });

  const token = authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Token eksik" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(403).json({ message: "Geçersiz token" });
  }
};

const admin = (req, res, next) => {
  // req.user içindeki role kontrolü yapıyoruz
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Yalnızca admin erişebilir" });
  }
};

module.exports = { protect, admin };
