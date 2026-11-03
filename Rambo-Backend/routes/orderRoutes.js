import express from 'express';
import Order from '../models/Order.js';
import { sendCompanyNotification } from '../utils/sendEmail.js';

const router = express.Router();

// Helper function to handle order creation
const createOrder = async (req, res) => {
  try {
    const {
      customerName,
      email,
      phone,
      address,
      apartment,
      city,
      postalCode,
      country,
      items,
      subtotal,
      tipAmount,
      appliedDiscount,
      grandTotal,
      paymentMethod,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in cart' });
    }

    const orderNumber = `RM-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder = new Order({
      orderNumber,
      customerName,
      email,
      phone,
      address,
      apartment,
      city,
      postalCode,
      country: country || 'Pakistan',
      items,
      subtotal,
      tipAmount: tipAmount || 0,
      appliedDiscount: appliedDiscount || 0,
      grandTotal,
      paymentMethod: paymentMethod || 'cod',
    });

    // 1. Save order to MongoDB
    const savedOrder = await newOrder.save();

    // 2. Send instant email notification to company address
    sendCompanyNotification(savedOrder);

    // 3. Respond to frontend
    return res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order: savedOrder,
    });
  } catch (error) {
    console.error('Error saving order:', error);
    return res.status(500).json({
      success: false,
      message: 'Server Error: Unable to place order.',
      error: error.message,
    });
  }
};

// POST /api/orders OR POST /api/orders/create
router.post('/', createOrder);
router.post('/create', createOrder);

// GET /api/orders - Fetch all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({
      success: false,
      message: 'Server Error: Unable to retrieve orders.',
      error: error.message,
    });
  }
});

// GET /api/orders/lookup?query=...
router.get('/lookup', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ success: false, message: 'Search query is required' });
    }

    const orders = await Order.find({
      $or: [
        { orderNumber: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } },
      ],
    }).sort({ createdAt: -1 });

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'No orders found matching your details.' });
    }

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('Error tracking order:', error);
    return res.status(500).json({ success: false, message: 'Server error while tracking order.' });
  }
});

// GET /api/orders/track/:orderNumber
router.get('/track/:orderNumber', async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('Error tracking order:', error);
    return res.status(500).json({
      success: false,
      message: 'Server Error: Unable to track order.',
      error: error.message,
    });
  }
});

export default router;