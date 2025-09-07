const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const rateLimit = require('express-rate-limit');
// توليد JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });
};
// تسجيل مستخدم جديد
const signin = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });
    // إنشاء JWT
     const token = generateToken(user._id, user.isAdmin);

    // إرساله في Cookie آمنة بدلًا من JSON
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // https فقط في production
      sameSite: "strict", // يمنع إرسالها مع cross-site requests
      maxAge: 2 * 60 * 60 * 1000, // 2ساعة واحدة
    });


    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
// تسجيل الدخول
const login = async (req, res) => {
    const { email, password } = req.body;
    
      try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });
    
        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
        // إنشاء JWT
        const token = generateToken(user._id, user.isAdmin);

         // إرساله في Cookie آمنة بدلًا من JSON
        res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // https فقط في production
        sameSite: "strict", // يمنع إرسالها مع cross-site requests
        maxAge: 2 * 60 * 60 * 1000, // 2ساعة واحدة
        });

        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          
        });
      } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
      }
    };

// تسجيل الخروج
const logout = async (req, res) => {
  try {
    // في حالة الكوكيز:
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0), // مسح الكوكي
    });

    res.status(200).json({ message: "✅ Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
// الحصول على بروفايل المستخدم
const profile = async (req, res) => {
   res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    isAdmin: req.user.isAdmin,
  });
};



// Rate limiting لتسجيل الدخول
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  message: { message: 'Too many login attempts, try later.' }
});



module.exports = {
  signin,
  login,
  logout,
  profile,
  loginLimiter,
};