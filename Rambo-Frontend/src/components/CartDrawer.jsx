import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Minus, Plus } from "lucide-react";

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
}) {
  // Pricing in PKR
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingFee = subtotal > 0 ? (subtotal > 5000 ? 0 : 250) : 0; // Free shipping over PKR 5,000
  const grandTotal = subtotal + shippingFee;
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#081832]/60 backdrop-blur-sm"
          />

          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="flex w-screen max-w-md flex-col bg-slate-50 shadow-2xl"
            >
              {/* ---------------- HEADER ---------------- */}
              <div className="relative bg-[#0a1f44] px-5 py-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400/15 text-cyan-400">
                      <ShoppingBag size={20} />
                    </div>
                    <div>
                      <h2 className="text-base font-bold tracking-wide">
                        Your Order Cart
                      </h2>
                      <p className="text-xs text-slate-300">
                        {itemCount} {itemCount === 1 ? "item" : "items"} selected
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={onClose}
                    aria-label="Close cart"
                    className="rounded-lg p-2 text-slate-300 transition-colors hover:bg-white/10 hover:text-cyan-400"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Cyan accent line */}
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-500" />
              </div>

              {/* ---------------- ITEM LIST ---------------- */}
              <div className="flex-1 space-y-3 overflow-y-auto p-5">
                {cartItems.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#0a1f44]/5 text-[#0a1f44]/40">
                      <ShoppingBag size={36} />
                    </div>
                    <p className="text-sm font-semibold text-[#0a1f44]">
                      Your cart is empty
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Add items from the catalog to build your order.
                    </p>
                    <button
                      onClick={onClose}
                      className="mt-5 rounded-md bg-[#0a1f44] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-[#12306a]"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-colors hover:border-cyan-400"
                    >
                      {/* Thumbnail */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-16 w-16 shrink-0 rounded-lg bg-slate-100 object-cover"
                      />

                      {/* Info & quantity controls */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="line-clamp-1 text-sm font-semibold text-[#0a1f44]">
                              {item.name}
                            </h4>
                            <button
                              onClick={() => onRemoveItem(item.id)}
                              title="Remove item"
                              aria-label={`Remove ${item.name}`}
                              className="text-slate-400 transition-colors hover:text-red-500"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <p className="mt-0.5 text-[11px] text-slate-500">
                            {item.material}
                          </p>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-sm font-bold text-[#0a1f44]">
                            PKR {(item.price * item.quantity).toLocaleString()}
                          </span>

                          {/* Quantity stepper */}
                          <div className="flex items-center overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                            <button
                              onClick={() => onUpdateQty(item.id, -1)}
                              aria-label="Decrease quantity"
                              className="px-2 py-1 text-[#0a1f44] transition-colors hover:bg-cyan-400 hover:text-[#0a1f44]"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="min-w-[1.75rem] text-center text-xs font-semibold text-[#0a1f44]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQty(item.id, 1)}
                              aria-label="Increase quantity"
                              className="px-2 py-1 text-[#0a1f44] transition-colors hover:bg-cyan-400 hover:text-[#0a1f44]"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* ---------------- SUMMARY ---------------- */}
              {cartItems.length > 0 && (
                <div className="space-y-4 bg-[#0a1f44] p-5 text-white">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Subtotal</span>
                      <span className="font-semibold">
                        PKR {subtotal.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-300">Estimated Delivery</span>
                      <span className="font-semibold">
                        {shippingFee === 0 ? (
                          <span className="font-bold text-cyan-400">FREE</span>
                        ) : (
                          `PKR ${shippingFee}`
                        )}
                      </span>
                    </div>

                    {shippingFee > 0 && (
                      <p className="text-[11px] text-cyan-300/80">
                        Add PKR {(5001 - subtotal).toLocaleString()} more for free delivery
                      </p>
                    )}

                    <div className="flex items-center justify-between border-t border-white/10 pt-3">
                      <span className="text-sm font-semibold">Grand Total</span>
                      <span className="text-lg font-extrabold text-cyan-400">
                        PKR {grandTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={onProceedToCheckout}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-400 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#0a1f44] transition-colors hover:bg-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                  >
                    Proceed to Checkout <ArrowRight size={14} />
                  </button>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <ShieldCheck size={13} className="text-cyan-400" />
                      Genuine Rambo Quality Guarantee
                    </span>
                    <button
                      onClick={onClearCart}
                      className="font-medium text-slate-400 transition-colors hover:text-red-400"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}