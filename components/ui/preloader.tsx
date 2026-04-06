"use client";

import { useEffect, useState } from "react";
import Brand from "../utils/brand";

const MIN_DISPLAY_MS = 1000;

export function Preloader() {
  const [visible, setVisible] = useState(true);
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    const start = Date.now();

    const dismiss = () => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);
      setTimeout(() => {
        setHiding(true);
        setTimeout(() => setVisible(false), 700);
      }, remaining);
    };

    if (document.readyState === "complete") {
      dismiss();
    } else {
      window.addEventListener("load", dismiss, { once: true });
      return () => window.removeEventListener("load", dismiss);
    }
  }, []);

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes pl-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes pl-sec {
          from { transform: translateX(-50%) rotate(0deg); }
          to   { transform: translateX(-50%) rotate(360deg); }
        }
        @keyframes pl-min {
          from { transform: translateX(-50%) rotate(0deg); }
          to   { transform: translateX(-50%) rotate(360deg); }
        }
        @keyframes pl-fadein {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .pl-ring-gold {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1px solid transparent;
          border-top-color: #b8933f;
          border-right-color: #b8933f;
          animation: pl-spin 1.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .pl-hand-min {
          position: absolute;
          bottom: 50%;
          left: 50%;
          width: 1px;
          height: 13px;
          background: #e8e3d8;
          transform-origin: bottom center;
          animation: pl-min 10s linear infinite;
        }
        .pl-hand-sec {
          position: absolute;
          bottom: 50%;
          left: 50%;
          width: 1px;
          height: 14px;
          background: #b8933f;
          transform-origin: bottom center;
          animation: pl-sec 1s linear infinite;
        }
        .pl-content {
          animation: pl-fadein 0.5s ease both;
        }
      `}</style>

      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0c0c0c",
          transition: "opacity 700ms ease",
          opacity: hiding ? 0 : 1,
          pointerEvents: hiding ? "none" : "auto",
        }}
      >
        <div
          className="pl-content"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transition: "transform 600ms ease, opacity 600ms ease",
            transform: hiding ? "scale(0.96)" : "scale(1)",
            opacity: hiding ? 0 : 1,
          }}
        >
          {/* Brand */}
          <Brand />

          {/* Tagline */}
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 9,
            letterSpacing: "0.45em",
            textTransform: "uppercase",
            color: "#3a3a3a",
            marginTop: 6,
            marginBottom: 48,
            fontWeight: 300,
          }}>
            Timeless Precision
          </p>

          {/* Watch dial loader */}
          <div style={{ position: "relative", width: 80, height: 80, marginBottom: 36 }}>
            {/* Outer ring */}
            <div style={{
              position: "absolute", inset: 0,
              borderRadius: "50%",
              border: "1px solid #1e1e1e",
            }} />
            {/* Spinning gold arc */}
            <div className="pl-ring-gold" />

            {/* Dial face */}
            <div style={{
              position: "absolute", inset: 10,
              borderRadius: "50%",
              background: "#111",
              border: "1px solid #1e1e1e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}>
              {/* Hour markers */}
              <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 60 60">
                <line x1="30" y1="4"  x2="30" y2="8"  stroke="#2a2a2a" strokeWidth="1"/>
                <line x1="30" y1="52" x2="30" y2="56" stroke="#2a2a2a" strokeWidth="1"/>
                <line x1="4"  y1="30" x2="8"  y2="30" stroke="#2a2a2a" strokeWidth="1"/>
                <line x1="52" y1="30" x2="56" y2="30" stroke="#2a2a2a" strokeWidth="1"/>
              </svg>

              {/* Hands */}
              <div style={{ position: "relative", width: 36, height: 36 }}>
                {/* Hour hand — static at ~10 o'clock */}
                <div style={{
                  position: "absolute", bottom: "50%", left: "50%",
                  width: 1, height: 10,
                  background: "#e8e3d8",
                  transformOrigin: "bottom center",
                  transform: "translateX(-50%) rotate(-60deg)",
                }} />
                {/* Minute hand */}
                <div className="pl-hand-min" />
                {/* Second hand */}
                <div className="pl-hand-sec" />
                {/* Center dot */}
                <div style={{
                  position: "absolute", top: "50%", left: "50%",
                  width: 3, height: 3,
                  background: "#b8933f",
                  borderRadius: "50%",
                  transform: "translate(-50%, -50%)",
                }} />
              </div>
            </div>
          </div>

          {/* Loading label */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}>
            <div style={{ width: 28, height: 1, background: "#1e1e1e" }} />
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 9,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#2a2a2a",
              fontWeight: 300,
            }}>
              Loading
            </span>
            <div style={{ width: 28, height: 1, background: "#1e1e1e" }} />
          </div>
        </div>
      </div>
    </>
  );
}