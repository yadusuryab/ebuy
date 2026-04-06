"use client";

import { CartItem } from "@/components/utils/add-to-cart";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Trash2, X, Plus, Minus, ArrowRight, ShoppingBag, Lock, Zap } from "lucide-react";
import { toast } from "sonner";

function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    try {
      setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
    } catch {
      setCart([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCartQty = (id: string, newQty: number) => {
    if (newQty < 1) return;
    const product = cart.find((item) => item._id === id);
    if (!product) return;
    const limited = Math.min(newQty, product.maxQty);
    const updated = cart.map((item) =>
      item._id === id ? { ...item, cartQty: limited } : item
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    if (limited !== newQty) toast(`Max quantity is ${product.maxQty}`);
  };

  const removeFromCart = (id: string) => {
    setRemoving(id);
    setTimeout(() => {
      const updated = cart.filter((item) => item._id !== id);
      setCart(updated);
      localStorage.setItem("cart", JSON.stringify(updated));
      setRemoving(null);
      toast("Item removed");
    }, 280);
  };

  const clearCart = () => {
    setCart([]);
    localStorage.setItem("cart", JSON.stringify([]));
    toast("Cart cleared");
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + (item.salesPrice ?? item.price) * item.cartQty,
    0
  );

  // ── Skeleton ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto px-4 py-8 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-neutral-50 border border-neutral-200 rounded-sm p-4 flex gap-4 animate-pulse">
              <div className="w-20 h-20 bg-neutral-200 rounded-sm shrink-0" />
              <div className="flex-1 space-y-2.5 py-1">
                <div className="h-4 bg-neutral-200 rounded-sm w-2/3" />
                <div className="h-3 bg-neutral-200 rounded-sm w-1/3" />
                <div className="h-8 bg-neutral-200 rounded-sm w-28 mt-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Empty ─────────────────────────────────────────────────────────────────────
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-neutral-950 border-2 border-neutral-800 rounded-sm flex items-center justify-center mx-auto mb-5">
            <ShoppingBag className="w-8 h-8 text-neutral-600" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="w-3 h-3 text-orange-500" strokeWidth={2.5} />
            <span className="text-[9px] font-black tracking-[0.4em] uppercase text-orange-500">Cart Empty</span>
          </div>
          <h2 className="font-['Bebas_Neue',sans-serif] text-3xl tracking-widest text-neutral-900 mb-1">
            Nothing Here Yet
          </h2>
          <p className="text-[11px] font-semibold tracking-wider uppercase text-neutral-400 mb-7">
            Add some products to get started
          </p>
          <Link
            href="/products"
            className="group inline-flex items-center gap-2.5 px-7 h-11 bg-orange-500 hover:bg-orange-400 text-white text-[9px] font-black tracking-[0.3em] uppercase rounded-sm transition-all duration-200 no-underline"
          >
            Browse Products
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes fadeOut { to { opacity: 0; transform: translateX(-16px); } }
        .removing { animation: fadeOut 0.28s ease forwards; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both; }
      `}</style>

      <div className="min-h-screen bg-white">
        {/* Orange top stripe */}
        <div className="w-full h-[3px] bg-gradient-to-r from-orange-600 via-red-500 to-orange-600" />

        <div className="max-w-2xl mx-auto px-4 py-7 lg:max-w-5xl">

          {/* ── Header ────────────────────────────────────────────────── */}
          <div className="flex items-center justify-between mb-7">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-3 h-3 text-orange-500" strokeWidth={2.5} />
                <span className="text-[9px] font-black tracking-[0.4em] uppercase text-orange-500">Your Order</span>
              </div>
              <h1 className="font-['Bebas_Neue',sans-serif] text-4xl tracking-widest text-neutral-900 leading-none">
                Shopping Cart
              </h1>
              <p className="text-[10px] font-black tracking-[0.25em] uppercase text-neutral-400 mt-1">
                {cart.length} item{cart.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={clearCart}
              className="flex items-center gap-1.5 text-[9px] font-black tracking-[0.25em] uppercase text-red-500 hover:text-red-400 px-3 py-2 border border-red-200 hover:border-red-400 rounded-sm transition-all duration-150"
            >
              <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
              Clear All
            </button>
          </div>

          <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-6 lg:items-start">

            {/* ── Cart Items ────────────────────────────────────────────── */}
            <div className="space-y-2 mb-4 lg:mb-0">
              {cart.map((item: any, i) => (
                <div
                  key={item._id}
                  className={`fade-up bg-white border border-neutral-200 overflow-hidden transition-all duration-200 hover:border-neutral-300 ${removing === item._id ? "removing" : ""}`}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {/* Orange left accent on hover — via border-l trick */}
                  <div className="flex gap-4 p-4 relative group">
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                    {/* Image */}
                    <Link href={`/product/${item._id}`} className="shrink-0">
                      <div className="w-20 h-20 overflow-hidden bg-neutral-100 border border-neutral-200 rounded-sm">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <Link href={`/product/${item._id}`} className="no-underline">
                          <p className="text-[13px] font-black tracking-wide text-neutral-900 hover:text-orange-500 transition-colors leading-snug line-clamp-2 uppercase">
                            {item.name}
                          </p>
                        </Link>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="shrink-0 w-7 h-7 flex items-center justify-center border border-neutral-200 hover:border-red-400 hover:text-red-500 text-neutral-400 rounded-sm transition-all duration-150"
                        >
                          <X className="w-3.5 h-3.5" strokeWidth={2} />
                        </button>
                      </div>

                      {/* Variants */}
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        {item.size && (
                          <span className="text-[9px] font-black tracking-[0.2em] uppercase text-neutral-500 bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded-sm">
                            Size: {item.size}
                          </span>
                        )}
                        {item.color && (
                          <span className="text-[9px] font-black tracking-[0.2em] uppercase text-neutral-500 bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded-sm">
                            {item.color}
                          </span>
                        )}
                      </div>

                      {/* Price + qty row */}
                      <div className="flex items-center justify-between mt-3">
                        {/* Qty stepper */}
                        <div className="flex items-center border border-neutral-200 rounded-sm overflow-hidden">
                          <button
                            onClick={() => updateCartQty(item._id, item.cartQty - 1)}
                            disabled={item.cartQty <= 1}
                            className="w-8 h-8 flex items-center justify-center text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 active:scale-90 border-r border-neutral-200"
                          >
                            <Minus className="w-3 h-3" strokeWidth={2.5} />
                          </button>
                          <span className="w-9 text-center text-[13px] font-black text-neutral-900 tracking-wide">
                            {item.cartQty}
                          </span>
                          <button
                            onClick={() => updateCartQty(item._id, item.cartQty + 1)}
                            disabled={item.cartQty >= item.maxQty}
                            className="w-8 h-8 flex items-center justify-center text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 active:scale-90 border-l border-neutral-200"
                          >
                            <Plus className="w-3 h-3" strokeWidth={2.5} />
                          </button>
                        </div>

                        {/* Item total */}
                        <div className="text-right">
                          <p className="font-['Bebas_Neue',sans-serif] text-xl tracking-widest text-neutral-900">
                            ₹{((item.salesPrice ?? item.price) * item.cartQty)?.toLocaleString("en-IN")}
                          </p>
                          {item.cartQty > 1 && (
                            <p className="text-[9px] font-black tracking-wider uppercase text-neutral-400">
                              ₹{(item.salesPrice ?? item.price)?.toLocaleString("en-IN")} each
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Order Summary ─────────────────────────────────────────── */}
            <div className="lg:sticky lg:top-6">
              <div className="bg-neutral-950 border border-neutral-800 overflow-hidden">

                {/* Orange top stripe */}
                <div className="w-full h-[3px] bg-gradient-to-r from-orange-600 via-red-500 to-orange-600" />

                {/* Header */}
                <div className="px-5 py-4 border-b border-neutral-800 flex items-center gap-2">
                  <Zap className="w-3 h-3 text-orange-500" strokeWidth={2.5} />
                  <h2 className="font-['Bebas_Neue',sans-serif] text-[17px] tracking-[0.2em] text-white">
                    Order Summary
                  </h2>
                </div>

                <div className="px-5 py-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black tracking-[0.25em] uppercase text-neutral-500">
                      Subtotal ({cart.length} item{cart.length !== 1 ? "s" : ""})
                    </span>
                    <span className="text-[13px] font-black tracking-wide text-neutral-300">
                      ₹{subtotal?.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black tracking-[0.25em] uppercase text-neutral-500">
                      Shipping
                    </span>
                    <span className="text-[10px] font-black tracking-[0.25em] uppercase text-orange-500">
                      Free
                    </span>
                  </div>
                  <div className="pt-3 border-t border-neutral-800 flex justify-between items-center">
                    <span className="text-[10px] font-black tracking-[0.3em] uppercase text-neutral-400">Total</span>
                    <span className="font-['Bebas_Neue',sans-serif] text-3xl tracking-widest text-white">
                      ₹{subtotal?.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* CTAs */}
                <div className="px-5 pb-5 space-y-2">
                  <Link href="/checkout" className="block no-underline">
                    <button className="group w-full h-12 bg-orange-500 hover:bg-orange-400 text-white text-[9px] font-black tracking-[0.3em] uppercase rounded-sm transition-all duration-200 flex items-center justify-center gap-2.5 active:scale-[0.98]">
                      <Lock className="w-3.5 h-3.5" strokeWidth={2.5} />
                      Proceed to Checkout
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" strokeWidth={2.5} />
                    </button>
                  </Link>
                  <Link href="/products" className="block no-underline">
                    <button className="w-full h-10 border border-neutral-700 hover:border-neutral-500 text-[9px] font-black tracking-[0.3em] uppercase text-neutral-500 hover:text-white rounded-sm transition-all duration-200 active:scale-[0.98]">
                      Continue Shopping
                    </button>
                  </Link>

                  {/* Trust line */}
                  <div className="flex items-center justify-center gap-1.5 pt-1">
                    <Lock className="w-3 h-3 text-neutral-700" strokeWidth={2} />
                    <span className="text-[9px] font-black tracking-[0.2em] uppercase text-neutral-700">
                      Secure & Encrypted Checkout
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default CartPage;