const jwt = require("jsonwebtoken");
const User = require("../models/User");

// التحقق من JWT وإلحاق المستخدم بالطلب
const protect = async (req, res, next) => {
  let token;

// نقرأ التوكن من الكوكي
  token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    // نفك التوكن
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // نجيب بيانات المستخدم (بدون الباسوورد)
    req.user = await User.findById(decoded.id).select("-password");

    next();
  } catch (error) {
    console.error("JWT Error:", error.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// التحقق إن كان المستخدم Admin
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as admin" });
  }
};

module.exports = { protect, admin };
