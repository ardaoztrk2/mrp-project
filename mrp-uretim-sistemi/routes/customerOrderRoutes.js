const express = require("express");
const router = express.Router();

// Örnek GET isteği
router.get("/", (req, res) => {
  res.send("Müşteri sipariş rotası çalışıyor.");
});

module.exports = router;
