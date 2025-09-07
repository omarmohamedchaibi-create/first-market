// controllers/productController.js
const Product = require("../models/Product");
const { body, validationResult } = require('express-validator');
// Get all products
const getAllProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sort, page = 1, limit = 10 } = req.query;

    let query = {};

    // فلترة
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // بناء الاستعلام
    let productQuery = Product.find(query);

    // ترتيب
    if (sort === "asc") {
      productQuery = productQuery.sort({ price: 1 });
    } else if (sort === "desc") {
      productQuery = productQuery.sort({ price: -1 });
    }

    // التصفح (pagination)
    const skip = (parseInt(page) - 1) * parseInt(limit);
    productQuery = productQuery.skip(skip).limit(parseInt(limit));

    const products = await productQuery;
    const total = await Product.countDocuments(query); // عدد كل النتائج

    res.json({
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      products,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



// Create a product
const createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct)
      return res.status(404).json({ message: 'Product not found' });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Get a product by ID
const getProductById = async (req, res) => {  
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Update a product
const updateProduct = async (req, res) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
  
      if (!updatedProduct)
        return res.status(404).json({ message: 'Product not found' });
  
      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };


// Validation middlewares
const validateProduct = [
  // body('name').trim().isLength({ min: 2 }).withMessage('Name too short'),
  // body('price').isFloat({ gt: 0 }).withMessage('Price must be > 0'),
  // body('image').trim().isURL().withMessage('Image must be a valid URL'),
  // body('category').trim().notEmpty(),
  // body('inStock').isBoolean(),
  // body('description').trim().isLength({ min: 5 }),
];

const handleValidation = (req, res, next) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) return res.status(400).json({ message: 'Validation error', errors: errs.array() });
  next();
};  


module.exports = {
  getAllProducts,
  createProduct,
  deleteProduct,
  getProductById,
  updateProduct,
  validateProduct,
  handleValidation,
};
