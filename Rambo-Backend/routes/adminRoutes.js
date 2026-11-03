
import express from "express";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { protect, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes below require a valid JWT and an admin account.
router.use(protect, verifyAdmin);

// GET: Admin dashboard analytics
router.get("/analytics", async (req, res) => {
  try {
    const [revenueData, lowStockProducts] = await Promise.all([
      Order.aggregate([
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalRevenue: {
              $sum: { $ifNull: ["$grandTotal", 0] },
            },
          },
        },
      ]),
      Product.find({ stockQuantity: { $lt: 5 } })
        .select("name stockQuantity price image")
        .lean(),
    ]);

    const stats = revenueData[0] || {
      totalOrders: 0,
      totalRevenue: 0,
    };

    return res.status(200).json({
      success: true,
      totalRevenue: stats.totalRevenue,
      totalOrders: stats.totalOrders,
      lowStockCount: lowStockProducts.length,
      lowStockProducts,
    });
  } catch (err) {
    console.error("Admin analytics error:", err);
    return res.status(500).json({
      success: false,
      message: "Unable to load dashboard analytics.",
    });
  }
});

// PUT: Update an order's status
router.put("/orders/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID.",
      });
    }

    if (typeof status !== "string" || !status.trim()) {
      return res.status(400).json({
        success: false,
        message: "A valid status is required.",
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { $set: { status: status.trim() } },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      order,
    });
  } catch (err) {
    console.error("Update order status error:", err);

    if (err.name === "ValidationError" || err.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid order data or status.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to update order status.",
    });
  }
});

// DELETE: Delete a product
router.delete("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (err) {
    console.error("Delete product error:", err);
    return res.status(500).json({
      success: false,
      message: "Unable to delete product.",
    });
  }
});

export default router;
