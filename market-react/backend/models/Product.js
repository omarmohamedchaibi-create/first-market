// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  price: {
    type: Number,
    required: true,
  },
  category: String,
  image: String,
  inStock: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Product", productSchema);
