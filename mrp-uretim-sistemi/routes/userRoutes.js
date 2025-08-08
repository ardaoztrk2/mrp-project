const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware"); // protect ve admin middleware'lerini import edin
const {
  registerUser,
  loginUser,
  getAllUsers, // <<<<<<<<<< BU SATIRI EKLEYİN
  deleteUser,  // <<<<<<<<<< BU SATIRI EKLEYİN
} = require("../controllers/userController");

// Kullanıcı kaydı ve girişi için public rotalar
router.post("/register", registerUser);
router.post("/login", loginUser);

// Tüm kullanıcıları getir (Sadece adminler erişebilir)
router.route("/")
  .get(protect, admin, getAllUsers); // <<<<<<<<<< BU SATIRI EKLEYİN

// Kullanıcı silme (Sadece adminler erişebilir)
router.route("/:id")
  .delete(protect, admin, deleteUser); // <<<<<<<<<< BU SATIRI EKLEYİN

module.exports = router;
