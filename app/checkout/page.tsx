// app/checkout/page.tsx
"use client";

import { AlertCircle, ChevronDown, ChevronUp, Loader2, Lock, Scan, Shield, Truck } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { checkoutSchema } from "@/lib/validations";
import { QRCodeCanvas } from "qrcode.react";
import Link from "next/link";

type CartItem = {
  _id: string;
  name: string;
  salesPrice: number;
  cartQty: number;
  size?: string | null;
  color?: string | null;
  image: string;
};

type FormData = z.infer<typeof checkoutSchema>;

// ── Floating label input ──────────────────────────────────────────────────────
function Field({
  label, id, error, children,
}: { label: string; id: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-[11px] font-semibold tracking-[0.08em] uppercase text-[#6b7280]">
        {label}
      </label>
      {children}
      {error && <p className="text-[11px] text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}

const inputCls = (err?: string) =>
  `w-full h-10 px-3 text-sm border rounded-md bg-white outline-none
   transition-all duration-150 text-[#111827] placeholder:text-[#d1d5db]
   focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10
   ${err ? "border-red-400 bg-red-50/30" : "border-[#e5e7eb] hover:border-[#9ca3af]"}`;

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [shippingCharges, setShippingCharges] = useState(0);
  const [deliveryTime, setDeliveryTime] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [qrCodeValue, setQrCodeValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">("online");
  const [summaryOpen, setSummaryOpen] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(checkoutSchema),
  });

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
  }, []);

  useEffect(() => {
    if (paymentMethod === "online") {
      setShippingCharges(0);
      setDeliveryTime("Kerala: 2–3 days · Outside Kerala: 6–7 days");
    } else {
      setShippingCharges(100);
      setDeliveryTime("Delivery in 7 days");
    }
  }, [paymentMethod]);

  const subtotal = cart.reduce((a, i) => a + i.salesPrice * i.cartQty, 0);
  const total = subtotal + shippingCharges;

  const generateUpiLink = (amount: number) =>
    `upi://pay?pa=${process.env.NEXT_PUBLIC_UPI_ID}&pn=${process.env.NEXT_PUBLIC_APP_NAME}&am=${amount}&tn=Payment for order`;

  const handleOrder = async (data: FormData) => {
    if (!showPayment) {
      setQrCodeValue(generateUpiLink(paymentMethod === "online" ? total : 100));
      localStorage.setItem("pendingOrder", JSON.stringify({ ...data, cart, total, paymentMethod }));
      setShowPayment(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setIsSubmitting(true);
    try {
      const orderData = {
        ...data,
        products: cart.map((p) => ({ product: p._id, quantity: p.cartQty, size: p.size || null, color: p.color || null })),
        paymentMode: paymentMethod,
        shippingCharges,
        totalAmount: total,
        advanceAmount: paymentMethod === "cod" ? 100 : total,
        codRemaining: paymentMethod === "cod" ? total - 100 : 0,
        paymentStatus: true,
        transactionId,
      };
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      if (!res.ok) throw new Error();
      const respdata = await res.json();
      localStorage.removeItem("cart");
      localStorage.removeItem("pendingOrder");
      router.push(`/order/${respdata.orderId}`);
    } catch {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#f3f4f6] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" className="w-7 h-7">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-[#111827] mb-1">Your cart is empty</h2>
          <p className="text-sm text-[#6b7280] mb-5">Add some products before checking out</p>
          <button onClick={() => router.push("/products")}
            className="px-5 py-2.5 bg-[#2563eb] text-white text-sm font-medium rounded-lg hover:bg-[#1d4ed8] transition-colors">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        .checkout-root { font-family: 'DM Sans', sans-serif; }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .slide-down { animation: slideDown 0.25s ease both; }
        /* hide default number input arrows */
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
      `}</style>

      <div className="checkout-root min-h-screen bg-[#f3f4f6]">
        {/* ── Top secure bar ── */}
        <div className="bg-white border-b border-[#e5e7eb] px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#1e3a5f] rounded flex items-center justify-center">
              <span className="text-white text-[9px] font-bold tracking-wider">W</span>
            </div>
            <span className="text-xs font-semibold text-[#374151]">{process.env.NEXT_PUBLIC_APP_NAME || "WOKO"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#22c55e]">
            <Lock className="w-3 h-3" />
            <span className="text-[11px] font-medium text-[#6b7280]">Secure Checkout</span>
          </div>
        </div>

        <div className="max-w-5xl mx-auto lg:flex lg:min-h-[calc(100vh-45px)]">

          {/* ══ LEFT PANEL — dark navy (order summary) ══════════════════ */}
          <div className="bg-primary lg:w-[380px] lg:min-h-full lg:shrink-0">

            {/* Mobile: collapsible summary pill */}
            <button
              className="lg:hidden w-full flex items-center justify-between px-4 py-3.5
                border-b border-white/[0.08] text-white"
              onClick={() => setSummaryOpen(o => !o)}
            >
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-white/50">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
                </svg>
                <span className="text-sm font-medium">
                  {summaryOpen ? "Hide" : "Show"} order summary
                </span>
                {summaryOpen ? <ChevronUp className="w-4 h-4 text-white/50" /> : <ChevronDown className="w-4 h-4 text-white/50" />}
              </div>
              <span className="text-base font-semibold">₹{total}</span>
            </button>

            {/* Summary content */}
            <div className={`${summaryOpen ? "slide-down" : "hidden"} lg:block p-5 lg:p-8 lg:sticky lg:top-0`}>
              {/* Items */}
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item._id} className="flex gap-3">
                    <div className="relative shrink-0">
                      <img src={item.image} alt={item.name}
                        className="w-14 h-14 object-cover rounded-md border border-white/10" />
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#475569]
                        text-white text-[10px] font-semibold flex items-center justify-center">
                        {item.cartQty}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white/90 truncate leading-snug">{item.name}</p>
                      <div className="flex gap-1.5 mt-1 flex-wrap">
                        {item.size && <span className="text-[10px] text-white/40 bg-white/[0.07] px-2 py-0.5 rounded">Size: {item.size}</span>}
                        {item.color && <span className="text-[10px] text-white/40 bg-white/[0.07] px-2 py-0.5 rounded">{item.color}</span>}
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-white/85 shrink-0">₹{item.salesPrice * item.cartQty}</span>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-white/[0.08] mb-4" />

              {/* Totals */}
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-white/50">
                  <span>Subtotal</span><span className="text-white/70">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-white/50">
                  <span>{paymentMethod === "online" ? "Shipping" : "COD charges"}</span>
                  <span className={shippingCharges === 0 ? "text-[#22c55e] font-medium" : "text-white/70"}>
                    {shippingCharges === 0 ? "Free" : `₹${shippingCharges}`}
                  </span>
                </div>
                <div className="border-t border-white/[0.08] pt-2.5 flex justify-between">
                  <span className="font-semibold text-white">Total</span>
                  <span className="font-bold text-lg text-white">₹{total}</span>
                </div>
              </div>

              {/* Delivery */}
              <div className="mt-5 flex items-start gap-2 text-white/40 text-xs">
                <Truck className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>{deliveryTime}</span>
              </div>

              {/* Trust badges */}
              <div className="mt-6 pt-5 border-t border-white/[0.08] flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-white/30 text-[11px]">
                  <Shield className="w-3.5 h-3.5" /><span>Secure payment</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/30 text-[11px]">
                  <Lock className="w-3.5 h-3.5" /><span>SSL encrypted</span>
                </div>
              </div>
            </div>
          </div>

          {/* ══ RIGHT PANEL — white form area ═══════════════════════════ */}
          <div className="flex-1 bg-white lg:border-l lg:border-[#e5e7eb]">

            {/* Step indicator */}
            <div className="px-5 lg:px-10 pt-6 pb-5 border-b border-[#f3f4f6]">
              <div className="flex items-center gap-0">
                {[
                  { n: 1, label: "Info" },
                  { n: 2, label: "Pay" },
                  { n: 3, label: "Done" },
                ].map((step, i) => {
                  const done = (showPayment && step.n === 1) || step.n < (showPayment ? 2 : 1);
                  const active = step.n === (showPayment ? 2 : 1);
                  return (
                    <div key={step.n} className="flex items-center">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold
                          transition-colors duration-300
                          ${active ? "bg-[#2563eb] text-white" : done ? "bg-[#22c55e] text-white" : "bg-[#f3f4f6] text-[#9ca3af]"}`}>
                          {done ? (
                            <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                              <polyline points="2 6 5 9 10 3" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                            </svg>
                          ) : step.n}
                        </div>
                        <span className={`text-xs font-medium ${active ? "text-[#111827]" : "text-[#9ca3af]"}`}>
                          {step.label}
                        </span>
                      </div>
                      {i < 2 && (
                        <div className={`w-8 h-px mx-2 transition-colors duration-300
                          ${done ? "bg-[#22c55e]" : "bg-[#e5e7eb]"}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="px-5 lg:px-10 py-7">

              {/* ── PAYMENT VIEW ── */}
              {showPayment ? (
                <div className="max-w-md slide-down space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-[#111827]">Complete Payment</h2>
                    <p className="text-sm text-[#6b7280] mt-0.5">
                      {paymentMethod === "online"
                        ? `Pay ₹${total} to confirm your order`
                        : `Pay ₹100 advance. Remaining ₹${total - 100} on delivery.`}
                    </p>
                  </div>

                  {/* UPI card */}
                  <div className="border border-[#e5e7eb] rounded-xl p-5 bg-[#fafafa]">
                    <div className="flex items-center gap-2 mb-4">
                      <Scan className="w-4 h-4 text-[#2563eb]" />
                      <span className="text-sm font-semibold text-[#111827]">Pay via UPI</span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6 items-center">
                      {/* QR */}
                      <div className="border border-[#e5e7eb] rounded-xl p-3 bg-white shadow-sm shrink-0">
                        <QRCodeCanvas value={qrCodeValue} size={150} level="H" includeMargin />
                      </div>

                      <div className="flex-1 w-full space-y-4">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6b7280] mb-1">Amount</p>
                          <p className="text-2xl font-bold text-[#111827]">
                            ₹{paymentMethod === "online" ? total : 100}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6b7280] mb-1">UPI ID</p>
                          <p className="text-sm font-mono bg-[#f3f4f6] px-3 py-2 rounded-lg text-[#374151] border border-[#e5e7eb]">
                            {process.env.NEXT_PUBLIC_UPI_ID}
                          </p>
                        </div>
                        <button
                          onClick={() => { window.location.href = qrCodeValue; }}
                          className="w-full py-2.5 bg-[#2563eb] text-white text-sm font-semibold rounded-lg
                            hover:bg-[#1d4ed8] active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                          </svg>
                          Open UPI App
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Transaction ID */}
                  <div className="space-y-2">
                    <Field label="Transaction ID *" id="txn" error={!transactionId.trim() && isSubmitting ? "Required" : undefined}>
                      <input
                        id="txn"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="e.g. T2401011234567"
                        className={inputCls()}
                      />
                    </Field>
                    <p className="text-[11px] text-[#6b7280] flex items-start gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#f59e0b]" />
                      Enter the 12-digit transaction ID from your payment app after paying.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-1">
                    <button
                      onClick={() => setShowPayment(false)}
                      className="flex-1 py-3 border border-[#e5e7eb] text-sm font-medium text-[#374151]
                        rounded-lg hover:bg-[#f9fafb] active:scale-[0.98] transition-all duration-150"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={handleSubmit(handleOrder)}
                      disabled={!transactionId.trim() || isSubmitting}
                      className="flex-[2] py-3 bg-[#2563eb] text-white text-sm font-semibold rounded-lg
                        hover:bg-[#1d4ed8] disabled:opacity-40 disabled:cursor-not-allowed
                        active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</> : "Confirm & Place Order"}
                    </button>
                  </div>
                </div>
              ) : (
                /* ── FORM VIEW ── */
                <form onSubmit={handleSubmit(handleOrder)} className="max-w-md space-y-7">

                  {/* Shipping */}
                  <div>
                    <h2 className="text-base font-semibold text-[#111827] mb-5">Shipping Information</h2>
                    <div className="space-y-4">

                      <Field label="Full Name *" id="customerName" error={errors.customerName?.message}>
                        <input id="customerName" {...register("customerName")}
                          placeholder="Arjun Menon" className={inputCls(errors.customerName?.message)} />
                      </Field>

                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Phone *" id="phoneNumber" error={errors.phoneNumber?.message}>
                          <input id="phoneNumber" {...register("phoneNumber")}
                            placeholder="9400941277" className={inputCls(errors.phoneNumber?.message)} />
                        </Field>
                        <Field label="Alternate Phone" id="alternatePhone">
                          <input id="alternatePhone" {...register("alternatePhone")}
                            placeholder="Optional" className={inputCls()} />
                        </Field>
                      </div>

                      <Field label="Instagram ID" id="instagramId">
                        <input id="instagramId" {...register("instagramId")}
                          placeholder="@username" className={inputCls()} />
                      </Field>

                      <Field label="Full Address *" id="address" error={errors.address?.message}>
                        <textarea id="address" {...register("address")} rows={3}
                          placeholder="House no., Building, Street, Area…"
                          className={`${inputCls(errors.address?.message)} !h-auto py-2 resize-none`} />
                      </Field>

                      <div className="grid grid-cols-3 gap-3">
                        <Field label="District *" id="district" error={errors.district?.message}>
                          <input id="district" {...register("district")}
                            placeholder="Kannur" className={inputCls(errors.district?.message)} />
                        </Field>
                        <Field label="State *" id="state" error={errors.state?.message}>
                          <input id="state" {...register("state")}
                            placeholder="Kerala" className={inputCls(errors.state?.message)} />
                        </Field>
                        <Field label="Pincode *" id="pincode" error={errors.pincode?.message}>
                          <input id="pincode" {...register("pincode")}
                            placeholder="670001" className={inputCls(errors.pincode?.message)} />
                        </Field>
                      </div>

                      <Field label="Landmark" id="landmark">
                        <input id="landmark" {...register("landmark")}
                          placeholder="Near school, temple…" className={inputCls()} />
                      </Field>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-[#f3f4f6]" />

                  {/* Payment method */}
                  <div>
                    <h2 className="text-base font-semibold text-[#111827] mb-4">Payment Method</h2>
                    <div className="space-y-3">

                      {/* Online */}
                      <label
                        className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer
                          transition-all duration-150 select-none
                          ${paymentMethod === "online"
                            ? "border-[#2563eb] bg-[#eff6ff] ring-1 ring-[#2563eb]"
                            : "border-[#e5e7eb] hover:border-[#9ca3af]"}`}
                      >
                        <input type="radio" name="payment" value="online" checked={paymentMethod === "online"}
                          onChange={() => setPaymentMethod("online")} className="mt-0.5 accent-[#2563eb]" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-[#111827]">Online Payment</span>
                            <span className="text-xs font-semibold text-[#22c55e] bg-[#f0fdf4] px-2 py-0.5 rounded-full">
                              FREE shipping
                            </span>
                          </div>
                          <p className="text-xs text-[#6b7280] mt-0.5">Pay via UPI, cards or wallets</p>
                        </div>
                      </label>

                      {/* COD */}
                      <label
                        className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer
                          transition-all duration-150 select-none
                          ${paymentMethod === "cod"
                            ? "border-[#2563eb] bg-[#eff6ff] ring-1 ring-[#2563eb]"
                            : "border-[#e5e7eb] hover:border-[#9ca3af]"}`}
                      >
                        <input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"}
                          onChange={() => setPaymentMethod("cod")} className="mt-0.5 accent-[#2563eb]" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-[#111827]">Cash on Delivery</span>
                            <span className="text-xs font-semibold text-[#f59e0b] bg-[#fffbeb] px-2 py-0.5 rounded-full">
                              +₹100 extra
                            </span>
                          </div>
                          <p className="text-xs text-[#6b7280] mt-0.5">Pay ₹100 advance + rest on delivery</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Policy notice */}
                  <div className="flex items-start gap-2.5 bg-[#fffbeb] border border-[#fde68a] rounded-lg px-4 py-3">
                    <AlertCircle className="w-4 h-4 text-[#d97706] shrink-0 mt-0.5" />
                    <p className="text-xs text-[#92400e] leading-relaxed">
                      By proceeding you agree to our{" "}
                      <Link href="/terms" target="_blank" className="font-semibold underline hover:text-[#78350f]">
                        return policy
                      </Link>
                      . All sales are final unless specified.
                    </p>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#2563eb] text-white font-semibold text-sm rounded-xl
                      hover:bg-[#1d4ed8] active:scale-[0.98]
                      transition-all duration-150 flex items-center justify-center gap-2
                      shadow-[0_4px_14px_rgba(37,99,235,0.35)]"
                  >
                    <Lock className="w-4 h-4" />
                    Proceed to Payment →
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}