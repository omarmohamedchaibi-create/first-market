// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const { getAllProducts, createProduct , deleteProduct, getProductById, updateProduct, validateProduct, handleValidation } = require("../controllers/productController");
const { protect, admin } = require("../middleware/authMiddleware");
const { param } = require('express-validator');

router.get("/", getAllProducts);

router.post("/", protect, admin, validateProduct, handleValidation, createProduct); 

router.get('/:id', getProductById);

router.put("/:id", protect, admin, param('id').isMongoId(), validateProduct, handleValidation, updateProduct);

router.delete("/:id", protect, admin, deleteProduct);



module.exports = router;
