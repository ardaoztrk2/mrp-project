// mrp-uretim-sistemi/controllers/userController.js
const User = require("../models/usermodel"); // Düzeltildi
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Token oluşturma fonksiyonu (daha önce vardı)
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

// Kullanıcı kaydı
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Lütfen tüm alanları doldurun." });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "Bu e-posta zaten kayıtlı." });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || "user", // Varsayılan rol 'user'
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } else {
    res.status(400).json({ message: "Geçersiz kullanıcı verisi." });
  }
};

// Kullanıcı giriş
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } else {
    res.status(400).json({ message: "Geçersiz kimlik bilgileri." });
  }
};

// Tüm kullanıcıları getir
const getAllUsers = async (req, res) => {
  try {
    // Şifre hariç tüm kullanıcıları getir
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    console.error("getAllUsers error:", err);
    res.status(500).json({ message: "Kullanıcılar alınırken sunucu hatası.", error: err.message });
  }
};

// Kullanıcı silme
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    // Kendi hesabını silmeyi engelle (isteğe bağlı)
    if (req.user.id === req.params.id) {
        return res.status(403).json({ message: "Kendi hesabınızı silemezsiniz." });
    }

    await User.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Kullanıcı başarıyla silindi." });
  } catch (error) {
    console.error("deleteUser error:", error);
    res.status(500).json({ message: "Kullanıcı silinirken sunucu hatası.", error: error.message });
  }
};

// Kullanıcı rolünü güncelleme (örn: admin yetkisi verme/alma)
const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role || !['user', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Geçersiz rol belirtildi.' });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

    user.role = role;
    await user.save();
    res.status(200).json({ message: 'Kullanıcı rolü başarıyla güncellendi.', user });
  } catch (error) {
    console.error("updateUserRole error:", error);
    res.status(500).json({ message: 'Kullanıcı rolü güncellenirken sunucu hatası.', error: error.message });
  }
};


module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  deleteUser,
  updateUserRole,
};