// models/Order.js
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    apartment: { type: String },
    city: { type: String, required: true },
    postalCode: { type: String },
    country: { type: String, default: 'Pakistan' },
    items: { type: Array, required: true },
    subtotal: { type: Number, required: true },
    tipAmount: { type: Number, default: 0 },
    appliedDiscount: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
    paymentMethod: { type: String, default: 'cod' },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;