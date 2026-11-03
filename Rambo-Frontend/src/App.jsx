import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import Navbar from "./components/Navbar";
import Products from "./components/Products";
import SocialTicker from "./components/SocialTicker"; // Imported SocialTicker
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import Checkout from "./components/Checkout";
import OrderTracking from "./components/OrderTracking";
import Admin from "./components/Admin";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const navigate = useNavigate();

  // Preloader timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Safe Add To Cart
  const handleAddToCart = (productWithQty) => {
    const qtyToAdd = productWithQty.quantity || 1;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.id === productWithQty.id
      );

      if (existingIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],
          quantity: updatedCart[existingIndex].quantity + qtyToAdd,
        };
        return updatedCart;
      }

      return [...prevCart, { ...productWithQty, quantity: qtyToAdd }];
    });

    setIsCartOpen(true);
  };

  // Update Cart Quantity
  const handleUpdateQty = (id, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id !== id) return item;
          const newQuantity = item.quantity + delta;
          return newQuantity < 1 ? null : { ...item, quantity: newQuantity };
        })
        .filter(Boolean)
    );
  };

  // Remove Single Item
  const handleRemoveItem = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Clear Entire Cart
  const handleClearCart = () => setCart([]);

  // Navigate to Checkout Route
  const handleOpenCheckout = () => {
    setIsCartOpen(false);
    navigate("/checkout");
  };

  // Total Quantity Count
  const totalCartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black text-white"
        >
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-amber-400 border-t-transparent" />
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400">
            Loading Rambo Industry...
          </span>
        </motion.div>
      ) : (
        <motion.div
          key="main-store"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative min-h-screen bg-slate-50 font-body text-slate-900 antialiased transition-colors duration-500 dark:bg-[#08051a] dark:text-white"
        >
          <Navbar
            cartCount={totalCartCount}
            onOpenCart={() => setIsCartOpen(true)}
          />

          <main>
            <Routes>
              {/* HOME PAGE */}
              <Route
                path="/"
                element={
                  <>
                    <Products onAddToCart={handleAddToCart} />
                    <SocialTicker />
                  </>
                }
              />

              {/* PRODUCTS PAGE */}
              <Route
                path="/products"
                element={
                  <>
                    <Products onAddToCart={handleAddToCart} />
                    <SocialTicker />
                  </>
                }
              />

              {/* CHECKOUT PAGE */}
              <Route
                path="/checkout"
                element={
                  <Checkout
                    cartItems={cart}
                    onBackToStore={() => navigate("/")}
                    onCompleteOrder={() => {
                      setCart([]);
                      navigate("/track-order");
                    }}
                  />
                }
              />

              {/* TRACK ORDER PAGE */}
              <Route
                path="/track-order"
                element={
                  <OrderTracking onBackToStore={() => navigate("/")} />
                }
              />

              {/* CONTACT PAGE */}
              <Route path="/contact" element={<Contact />} />

              {/* SECRET ADMIN ROUTE */}
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>

          <Footer />

          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cartItems={cart}
            onUpdateQty={handleUpdateQty}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onProceedToCheckout={handleOpenCheckout}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}