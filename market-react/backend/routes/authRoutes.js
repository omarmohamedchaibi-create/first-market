const express = require("express");
const router = express.Router();
const { signin, login, logout, profile, loginLimiter, updatePassword} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// ✅ تسجيل مستخدم جديد
router.post("/register", signin);

// ✅ تسجيل الدخول
router.post("/login",loginLimiter, login);
// ✅ تسجيل الخروج
router.post("/logout", logout);
// حماية المسارات
router.get("/profile", protect, profile);


module.exports = router;
