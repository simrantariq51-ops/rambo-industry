import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import connectDB from './config/db.js';

dotenv.config();
await connectDB();

const sampleProducts = [
  {
    name: "Brass Pillar Tap",
    price: 35.00,
    category: "Faucets",
    image: "https://via.placeholder.com/300",
    description: "Durable chrome-plated brass pillar tap for wash basins.",
    inStock: true
  },
  {
    name: "Overhead Rain Shower 8-Inch",
    price: 65.00,
    category: "Showers",
    image: "https://via.placeholder.com/300",
    description: "Ultra-thin stainless steel rain shower head.",
    inStock: true
  },
  {
    name: "Concealed Mixer Valve",
    price: 85.00,
    category: "Valves",
    image: "https://via.placeholder.com/300",
    description: "Heavy-duty brass body concealed bath mixer valve.",
    inStock: true
  }
];

const importData = async () => {
  try {
    await Product.deleteMany(); // Clears old data
    await Product.insertMany(sampleProducts);
    console.log('Sample Products Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();