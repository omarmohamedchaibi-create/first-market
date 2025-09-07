// server.js
const express = require("express");
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require("cookie-parser");



const hpp = require('hpp');
const compression = require('compression');
const mongoose = require("mongoose");
const cors = require("cors");


require("dotenv").config();

const app = express();

// ================= Security Middlewares =================
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173'], // عدّلها عند النشر
  credentials: true
}));

app.use(express.json({ limit: '100kb' }));
// فلترة أي مفتاح يحتوي $ أو .
function sanitize(obj) {
  for (let key in obj) {
    if (key.startsWith("$") || key.includes(".")) {
      delete obj[key];
    } else if (typeof obj[key] === "object") {
      sanitize(obj[key]);
    }
  }
}

app.use((req, res, next) => {
  if (req.body) sanitize(req.body);
  if (req.params) sanitize(req.params);
  if (req.query) sanitize(req.query);
  next();
});

app.use(hpp());
app.use(compression());
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, slow down.' }
}));

app.use(cookieParser());
// ================= Routes =================
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");

app.use("/api/products", productRoutes);
app.use("/api/users", authRoutes);


// Simple test route
app.get("/", (req, res) => {
  res.send("✅ Backend running...");
});

// ================= Error Handling (must be last) =================
const { notFound, errorHandler } = require('./middleware/error');
app.use(notFound);
app.use(errorHandler);

// ================= DB + Server =================
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ Mongo Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

