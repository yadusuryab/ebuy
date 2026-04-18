// app/checkout/page.tsx
"use client";

import { AlertCircle, ChevronDown, ChevronUp, Loader2, Lock, Scan, Shield, Truck, Search } from "lucide-react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { QRCodeCanvas } from "qrcode.react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { 
  getAllStates, 
  getDistrictsByState, 
  validatePincode, 
  getLocationFromPincode,
  states as statesData
} from "@/lib/location";

type CartItem = {
  _id: string;
  name: string;
  salesPrice: number;
  cartQty: number;
  size?: string | null;
  color?: string | null;
  image: string;
};

// Manual entry constant
const MANUAL_ENTRY = "Other (Manual Entry)";

// Extended checkout schema with manual entry support
const checkoutSchemaExtended = z.object({
  customerName: z.string().min(3, "Name must be at least 3 characters"),
  phoneNumber: z.string().min(10, "Valid phone number required").max(15),
  alternatePhone: z.string().optional(),
  instagramId: z.string().optional(),
  address: z.string().min(10, "Please enter complete address"),
  state: z.string().min(1, "Please select state"),
  district: z.string().min(1, "Please select district"),
  manualState: z.string().optional(),
  manualDistrict: z.string().optional(),
  pincode: z.string()
    .min(6, "Pincode must be 6 digits")
    .max(6)
    .regex(/^[1-9][0-9]{5}$/, "Invalid pincode format"),
  landmark: z.string().optional(),
}).refine((data) => {
  // If manual entry selected, require manual fields
  if (data.state === MANUAL_ENTRY) {
    return !!data.manualState && data.manualState.length >= 2;
  }
  return true;
}, {
  message: "Please enter state name",
  path: ["manualState"],
}).refine((data) => {
  if (data.district === MANUAL_ENTRY) {
    return !!data.manualDistrict && data.manualDistrict.length >= 2;
  }
  return true;
}, {
  message: "Please enter district name",
  path: ["manualDistrict"],
});

type FormData = z.infer<typeof checkoutSchemaExtended>;

// Helper to check if a value is manual entry
const isManualEntry = (value: string): boolean => value === MANUAL_ENTRY;

// Helper to check if location is Kerala
const isKeralaLocation = (state: string): boolean => {
  return state?.toLowerCase() === "kerala";
};

// ── Floating label input ──────────────────────────────────────────────────────
function Field({
  label, id, error, required, children,
}: { label: string; id: string; error?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-[11px] font-semibold tracking-[0.08em] uppercase text-[#6b7280]">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-[11px] text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}

const inputCls = (err?: string) =>
  `w-full h-10 px-3 text-sm border rounded-md bg-white outline-none
   transition-all duration-150 text-[#111827] placeholder:text-[#d1d5db]
   focus:border-primary focus:ring-2 focus:ring-primary/10
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
  const [isLoadingPincode, setIsLoadingPincode] = useState(false);
  
  const router = useRouter();

  const { register, handleSubmit, formState: { errors }, control, watch, setValue, setError, clearErrors } = useForm<FormData>({
    resolver: zodResolver(checkoutSchemaExtended),
    defaultValues: {
      state: "",
      district: "",
      pincode: "",
      manualState: "",
      manualDistrict: "",
    }
  });

  const watchState = watch("state");
  const watchDistrict = watch("district");
  const watchPincode = watch("pincode");
  const watchManualState = watch("manualState");
  const watchManualDistrict = watch("manualDistrict");

  // Get all states including manual option
  const states = useMemo(() => {
    const allStates = getAllStates();
    return [...allStates, MANUAL_ENTRY];
  }, []);

  // Get districts based on selected state
  const districts = useMemo(() => {
    if (!watchState) return [];
    if (isManualEntry(watchState)) return [MANUAL_ENTRY];
    const stateDistricts = getDistrictsByState(watchState);
    return [...stateDistricts, MANUAL_ENTRY];
  }, [watchState]);

  // Get actual location values (manual or selected)
  const getActualState = useCallback(() => {
    return isManualEntry(watchState) ? watchManualState : watchState;
  }, [watchState, watchManualState]);

  const getActualDistrict = useCallback(() => {
    return isManualEntry(watchDistrict) ? watchManualDistrict : watchDistrict;
  }, [watchDistrict, watchManualDistrict]);

  // Reset district when state changes
  useEffect(() => {
    if (watchState) {
      setValue("district", "");
      setValue("manualDistrict", "");
    }
  }, [watchState, setValue]);

  // Calculate shipping based on location
  useEffect(() => {
    const calculateShipping = () => {
      const actualState = getActualState();
      
      if (!actualState) {
        // Default values before location is selected
        setShippingCharges(0);
        setDeliveryTime("Select location for delivery estimate");
        return;
      }
      
      if (paymentMethod === "online") {
        if (isKeralaLocation(actualState)) {
          setShippingCharges(0);
          setDeliveryTime("Kerala: 2–3 days");
        } else {
          setShippingCharges(50);
          setDeliveryTime("Outside Kerala: 6–7 days");
        }
      } else {
        // COD charges
        if (isKeralaLocation(actualState)) {
          setShippingCharges(100);
          setDeliveryTime("Delivery in 7 days");
        } else {
          setShippingCharges(150); // 100 COD + 50 outside Kerala
          setDeliveryTime("Delivery in 7-9 days");
        }
      }
    };
    
    calculateShipping();
  }, [paymentMethod, watchState, watchManualState, getActualState]);

  // Handle pincode lookup
  const handlePincodeLookup = useCallback(() => {
    const pincode = watchPincode;
    if (!pincode || pincode.length !== 6) return;

    if (!validatePincode(pincode)) {
      setError("pincode", { message: "Invalid pincode format" });
      return;
    }

    setIsLoadingPincode(true);
    
    // Simulate async behavior for smooth UX
    setTimeout(() => {
      const location = getLocationFromPincode(pincode);
      
      if (location) {
        // Check if state exists in our list
        const stateExists = statesData.some(s => 
          s.name.toLowerCase() === location.state.toLowerCase()
        );
        
        if (stateExists) {
          setValue("state", location.state);
          
          // Get districts for this state
          const stateDistricts = getDistrictsByState(location.state);
          
          // Check if district exists
          const districtExists = stateDistricts.some(
            d => d.toLowerCase() === location.district.toLowerCase()
          );
          
          if (districtExists) {
            setValue("district", location.district);
          } else {
            // District not in list, use manual entry
            setValue("district", MANUAL_ENTRY);
            setValue("manualDistrict", location.district);
          }
          
          clearErrors("pincode");
          
          const isKerala = isKeralaLocation(location.state);
          
          toast.success(
            <div>
              <p className="font-semibold">📍 {location.district}, {location.state}</p>
              <p className="text-xs mt-1">
                {isKerala ? "✓ Free shipping applicable" : "ℹ️ Additional ₹50 shipping for outside Kerala"}
              </p>
            </div>
          );
        } else {
          // State not in list, use manual entry
          setValue("state", MANUAL_ENTRY);
          setValue("manualState", location.state);
          setValue("district", MANUAL_ENTRY);
          setValue("manualDistrict", location.district);
          
          clearErrors("pincode");
          
          const isKerala = isKeralaLocation(location.state);
          toast.success(
            <div>
              <p className="font-semibold">📍 {location.district}, {location.state}</p>
              <p className="text-xs mt-1">
                {isKerala ? "✓ Free shipping applicable" : "ℹ️ Additional ₹50 shipping for outside Kerala"}
              </p>
            </div>
          );
        }
      } else {
        toast.info("Pincode not found in our database. Please select or enter location manually.");
      }
      
      setIsLoadingPincode(false);
    }, 300);
  }, [watchPincode, setValue, setError, clearErrors]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        setCart([]);
      }
    }
  }, []);

  const subtotal = cart.reduce((a, i) => a + i.salesPrice * i.cartQty, 0);
  const total = subtotal + shippingCharges;

  const generateUpiLink = (amount: number) =>
    `upi://pay?pa=${process.env.NEXT_PUBLIC_UPI_ID}&pn=${process.env.NEXT_PUBLIC_APP_NAME}&am=${amount}&tn=Payment for order`;

  const handleOrder = async (data: FormData) => {
    if (!showPayment) {
      const paymentAmount = paymentMethod === "online" ? total : 100;
      setQrCodeValue(generateUpiLink(paymentAmount));
      
      // Prepare order data with actual location values
      const orderData = {
        ...data,
        actualState: getActualState(),
        actualDistrict: getActualDistrict(),
        cart,
        total,
        paymentMethod
      };
      
      localStorage.setItem("pendingOrder", JSON.stringify(orderData));
      setShowPayment(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const orderData = {
        ...data,
        actualState: getActualState(),
        actualDistrict: getActualDistrict(),
        products: cart.map((p) => ({ 
          product: p._id, 
          quantity: p.cartQty, 
          size: p.size || null, 
          color: p.color || null 
        })),
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
            className="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-[#1d4ed8] transition-colors">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const showManualStateInput = isManualEntry(watchState);
  const showManualDistrictInput = isManualEntry(watchDistrict);

  // Get shipping badge text
  const getShippingBadgeText = () => {
    const actualState = getActualState();
    if (!actualState) return "";
    if (paymentMethod === "online") {
      return isKeralaLocation(actualState) ? "FREE shipping" : "+₹50 shipping";
    } else {
      return isKeralaLocation(actualState) ? "+₹100 extra" : "+₹150 extra";
    }
  };

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
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
      `}</style>

      <div className="checkout-root min-h-screen bg-[#f3f4f6]">
        {/* Top secure bar */}
        <div className="bg-white border-b border-[#e5e7eb] px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <span className="text-white text-[9px] font-bold tracking-wider">E</span>
            </div>
            <span className="text-xs font-semibold text-[#374151]">{process.env.NEXT_PUBLIC_APP_NAME || "EBUY"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#22c55e]">
            <Lock className="w-3 h-3" />
            <span className="text-[11px] font-medium text-[#6b7280]">Secure Checkout</span>
          </div>
        </div>

        <div className="max-w-5xl mx-auto lg:flex lg:min-h-[calc(100vh-45px)]">

          {/* LEFT PANEL — dark navy (order summary) */}
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
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto">
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
                  <span className={shippingCharges === 0 ? "text-white font-medium" : "text-white/70"}>
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
                <span>{deliveryTime || "Select location for estimate"}</span>
              </div>

              {/* Location summary if selected */}
              {getActualState() && (
                <div className="mt-3 flex items-start gap-2 text-white/30 text-[11px]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 mt-0.5 shrink-0">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    <circle cx="12" cy="9" r="2.5"/>
                  </svg>
                  <span>
                    {getActualDistrict()}, {getActualState()}
                    {isKeralaLocation(getActualState()!) && " ✓ Kerala"}
                  </span>
                </div>
              )}

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

          {/* RIGHT PANEL — white form area */}
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
                          ${active ? "bg-primary text-white" : done ? "bg-[#22c55e] text-white" : "bg-[#f3f4f6] text-[#9ca3af]"}`}>
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

              {/* PAYMENT VIEW */}
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
                      <Scan className="w-4 h-4 text-primary" />
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
                          className="w-full py-2.5 bg-primary text-white text-sm font-semibold rounded-lg
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
                    <Field label="Transaction ID" id="txn" required error={!transactionId.trim() && isSubmitting ? "Required" : undefined}>
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
                      className="flex-[2] py-3 bg-primary text-white text-sm font-semibold rounded-lg
                        hover:bg-[#1d4ed8] disabled:opacity-40 disabled:cursor-not-allowed
                        active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</> : "Confirm & Place Order"}
                    </button>
                  </div>
                </div>
              ) : (
                /* FORM VIEW */
                <form onSubmit={handleSubmit(handleOrder)} className="max-w-md space-y-7">

                  {/* Shipping */}
                  <div>
                    <h2 className="text-base font-semibold text-[#111827] mb-5">Shipping Information</h2>
                    <div className="space-y-4">

                      <Field label="Full Name" id="customerName" required error={errors.customerName?.message}>
                        <input id="customerName" {...register("customerName")}
                          placeholder="Your Name" className={inputCls(errors.customerName?.message)} />
                      </Field>

                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Phone" id="phoneNumber" required error={errors.phoneNumber?.message}>
                          <input id="phoneNumber" {...register("phoneNumber")}
                            placeholder="Phone Number" className={inputCls(errors.phoneNumber?.message)} />
                        </Field>
                        <Field label="Alternate Phone" id="alternatePhone">
                          <input id="alternatePhone" {...register("alternatePhone")}
                            placeholder="Optional" className={inputCls()} />
                        </Field>
                      </div>

                      <Field label="Instagram ID" id="instagramId">
                        <input id="instagramId" {...register("instagramId")}
                          placeholder="Instagram ID" className={inputCls()} />
                      </Field>

                      <Field label="Full Address" id="address" required error={errors.address?.message}>
                        <textarea id="address" {...register("address")} rows={3}
                          placeholder="House no., Building, Street, Area…"
                          className={`${inputCls(errors.address?.message)} !h-auto py-2 resize-none`} />
                      </Field>

                      {/* Pincode with auto-lookup */}
                      <Field label="Pincode" id="pincode" required error={errors.pincode?.message}>
                        <div className="relative">
                          <input 
                            id="pincode" 
                            {...register("pincode")}
                            placeholder="6-digit pincode"
                            maxLength={6}
                            className={`${inputCls(errors.pincode?.message)} pr-10`}
                          />
                          <button
                            type="button"
                            onClick={handlePincodeLookup}
                            disabled={isLoadingPincode || !watchPincode || watchPincode.length !== 6}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 
                              text-[#6b7280] hover:text-primary disabled:opacity-40 
                              disabled:cursor-not-allowed transition-colors rounded-md
                              hover:bg-[#f3f4f6]"
                            title="Lookup pincode"
                          >
                            {isLoadingPincode ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Search className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        <p className="text-[10px] text-[#6b7280] mt-1">
                          Enter pincode to auto-fill state & district
                        </p>
                      </Field>

                      <div className="grid grid-cols-2 gap-3">
                        <Field label="State" id="state" required error={errors.state?.message}>
                          <Controller
                            name="state"
                            control={control}
                            render={({ field }) => (
                              <Select
                                {...field}
                                options={states.map((s) => ({ value: s, label: s }))}
                                placeholder="Select state"
                                className={errors.state?.message ? "border-red-400 bg-red-50/30" : ""}
                              />
                            )}
                          />
                        </Field>

                        <Field label="District" id="district" required error={errors.district?.message}>
                          <Controller
                            name="district"
                            control={control}
                            render={({ field }) => (
                              <Select
                                {...field}
                                options={districts.map((d) => ({ value: d, label: d }))}
                                placeholder={watchState ? "Select district" : "Select state first"}
                                disabled={!watchState}
                                className={errors.district?.message ? "border-red-400 bg-red-50/30" : ""}
                              />
                            )}
                          />
                        </Field>
                      </div>

                      {/* Manual State Input */}
                      {showManualStateInput && (
                        <Field label="Enter State Name" id="manualState" required error={errors.manualState?.message}>
                          <input 
                            id="manualState" 
                            {...register("manualState")}
                            placeholder="Enter your state"
                            className={inputCls(errors.manualState?.message)}
                          />
                        </Field>
                      )}

                      {/* Manual District Input */}
                      {showManualDistrictInput && (
                        <Field label="Enter District Name" id="manualDistrict" required error={errors.manualDistrict?.message}>
                          <input 
                            id="manualDistrict" 
                            {...register("manualDistrict")}
                            placeholder="Enter your district"
                            className={inputCls(errors.manualDistrict?.message)}
                          />
                        </Field>
                      )}

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
                            ? "border-primary bg-[#eff6ff] ring-1 ring-primary"
                            : "border-[#e5e7eb] hover:border-[#9ca3af]"}`}
                      >
                        <input type="radio" name="payment" value="online" checked={paymentMethod === "online"}
                          onChange={() => setPaymentMethod("online")} className="mt-0.5 accent-primary" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-[#111827]">Online Payment</span>
                            {getActualState() && (
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                                ${getActualState() && isKeralaLocation(getActualState()!) 
                                  ? "text-[#22c55e] bg-[#f0fdf4]" 
                                  : "text-[#f59e0b] bg-[#fffbeb]"}`}>
                                {getShippingBadgeText()}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#6b7280] mt-0.5">Pay via UPI, cards or wallets</p>
                        </div>
                      </label>

                      {/* COD */}
                      <label
                        className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer
                          transition-all duration-150 select-none
                          ${paymentMethod === "cod"
                            ? "border-primary bg-[#eff6ff] ring-1 ring-primary"
                            : "border-[#e5e7eb] hover:border-[#9ca3af]"}`}
                      >
                        <input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"}
                          onChange={() => setPaymentMethod("cod")} className="mt-0.5 accent-primary" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-[#111827]">Cash on Delivery</span>
                            {getActualState() && (
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                                ${getActualState() && isKeralaLocation(getActualState()!) 
                                  ? "text-[#f59e0b] bg-[#fffbeb]" 
                                  : "text-[#ef4444] bg-[#fef2f2]"}`}>
                                {getShippingBadgeText()}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#6b7280] mt-0.5">
                            Pay ₹100 advance + rest on delivery
                            {getActualState() && !isKeralaLocation(getActualState()!) && " (+₹50 outside Kerala)"}
                          </p>
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
                  <Button
                    type="submit"
                    className="w-full"
                    size={'lg'}
                  >
                    <Lock className="w-4 h-4" />
                    Proceed to Payment →
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}