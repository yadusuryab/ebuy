"use client";

import React from "react";
import { Dot, Zap } from "lucide-react";

const items = [
  "Free shipping on PREPAID ORDERS for NEXT 24 HOURS",
  "Extra Discounts on Prepaid Orders - Limited Time Only!",
  "Order Now - Fast Delivery Available",
  "Secure checkout · 100% safe payments",
  "Free shipping on PREPAID ORDERS for NEXT 24 HOURS",
  "Extra Discounts on Prepaid Orders - Limited Time Only!",
  "Order Now - Fast Delivery Available",
  "Secure checkout · 100% safe payments",
];

const Divider = () => (
  <span className="inline-flex items-center mx-6 flex-shrink-0">
    <Dot className=" text-white" strokeWidth={2.5} />
  </span>
);

export default function MarqueeStrip() {
  return (
    <>
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marquee 28s linear infinite;
          will-change: transform;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="w-full bg-primary  overflow-hidden py-0 select-none relative">
        {/* left/right fade masks */}
        {/* <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-neutral-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-neutral-950 to-transparent z-10 pointer-events-none" /> */}

        {/* orange left accent bar */}
        {/* <div className="absolute left-0 top-0 h-full w-[3px] bg-orange-500 z-20" /> */}

        <div className="flex items-center whitespace-nowrap marquee-track py-2">
          {items.map((text, i) => (
            <React.Fragment key={i}>
              <span className="inline-flex items-center gap-2 text-sm uppercase font-black text-white transition-colors duration-200 flex-shrink-0 cursor-default">
                {text}
              </span>
              <Divider />
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}