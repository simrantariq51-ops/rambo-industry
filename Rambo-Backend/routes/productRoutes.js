import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// GET /api/products - Fetch all products (with optional filtering & search)
router.get('/', async (req, res) => {
  try {
    const { category, subcategory, search, featured } = req.query;
    let query = { active: true }; // Only return active products by default

    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;
    if (featured) query.featured = featured === 'true';
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// GET /api/products/:id - Fetch a single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ productId: req.params.id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// POST /api/products - Add a new product
router.post('/', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Invalid Product Data', error: error.message });
  }
});

export default router;