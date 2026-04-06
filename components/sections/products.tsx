"use client";

import React, { useEffect, useRef, useState } from "react";
import ProductCard from "../cards/product-card";
import { Product } from "@/lib/queries/product";
import Link from "next/link";
import { ArrowUpRight, MoveRight } from "lucide-react";

// ── Skeleton ──────────────────────────────────────────────────────────────────
function ProductSkeleton({ index }: { index: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {/* Index */}
      <div
        style={{
          fontFamily: '"Bebas Neue", "Impact", sans-serif',
          fontSize: "11px",
          letterSpacing: "0.25em",
          color: "#c8b89a",
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>
      {/* Image placeholder */}
      <div
        style={{
          width: "100%",
          aspectRatio: "3/4",
          background: "#ede8df",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)",
            animation: "shimmer 1.6s ease-in-out infinite",
            transform: "translateX(-100%)",
          }}
        />
      </div>
      <div
        style={{ height: "10px", width: "65%", background: "#ede8df", borderRadius: "2px" }}
      />
      <div
        style={{ height: "10px", width: "30%", background: "#ede8df", borderRadius: "2px" }}
      />
    </div>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────
type Props = {
  products: Product[];
  title?: string;
  desc?: string;
  showViewAll?: boolean;
  deskCols?: number;
};

// ── Component ─────────────────────────────────────────────────────────────────
function ProductsSection({
  products,
  title = "Explore",
  desc = "",
  showViewAll = false,
  deskCols = 4,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.04 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const colCount = Math.min(Math.max(deskCols, 2), 5);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Mono:wght@300;400&display=swap');
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .prod-item {
          opacity: 0;
          animation: none;
        }
        .prod-item.revealed {
          animation: fadeSlideUp 0.6s ease forwards;
        }
        .view-btn:hover .view-btn-arrow {
          transform: translateX(4px);
        }
        .view-btn-arrow {
          transition: transform 0.3s ease;
        }
        .prod-link-wrap:hover .prod-idx {
          color: #1a1a1a;
        }
      `}</style>

      <div
        ref={sectionRef}
        style={{
          background: "#f8f4ee",
          position: "relative",
        }}
      >
        {/* ── Ruled header bar ── */}
        <div
          style={{
            borderTop: "1px solid #1a1a1a",
            borderBottom: "1px solid #d4cbbf",
            padding: "0 24px",
            display: "flex",
            alignItems: "stretch",
            justifyContent: "space-between",
            marginBottom: "48px",
          }}
        >
          {/* Left: title block */}
          <div
            style={{
              padding: "20px 0",
              borderRight: "1px solid #d4cbbf",
              paddingRight: "32px",
              flex: "0 0 auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "4px",
            }}
          >
            <span
              style={{
                fontFamily: '"DM Mono", monospace',
                fontSize: "9px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#9c8a72",
              }}
            >
              {desc || "Products"}
            </span>
            <h2
              style={{
                fontFamily: '"Bebas Neue", Impact, sans-serif',
                fontSize: "clamp(36px, 6vw, 60px)",
                lineHeight: 0.95,
                letterSpacing: "0.03em",
                color: "#1a1a1a",
                margin: 0,
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(8px)",
                transition: "opacity 0.5s ease, transform 0.5s ease",
              }}
            >
              {title}
            </h2>
          </div>

          {/* Right: meta info */}
          <div
            style={{
              padding: "20px 0 20px 28px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            {/* Count pill */}
            {/* {!loading && (
              <span
                style={{
                  fontFamily: '"DM Mono", monospace',
                  fontSize: "10px",
                  letterSpacing: "0.15em",
                  color: "#9c8a72",
                  opacity: visible ? 1 : 0,
                  transition: "opacity 0.5s ease 0.2s",
                }}
              >
                {products.length} items
              </span>
            )} */}

            {/* View all */}
            {showViewAll && (
              <Link
                href="/products"
                className="view-btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontFamily: '"DM Mono", monospace',
                  fontSize: "9px",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#1a1a1a",
                  textDecoration: "none",
                  paddingBottom: "2px",
                  borderBottom: "1px solid #1a1a1a",
                  opacity: visible ? 1 : 0,
                  transition: "opacity 0.5s ease 0.1s",
                }}
              >
                View all
                <span className="view-btn-arrow">
                  <ArrowUpRight size={10} />
                </span>
              </Link>
            )}
          </div>
        </div>

        {/* ── Product grid ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(2, 1fr)`,
            gap: "2px",
          }}
          // Responsive via inline style override at md breakpoint is handled by the CSS below
        >
          <style>{`
            @media (min-width: 768px) {
              .prod-grid { grid-template-columns: repeat(${colCount}, 1fr) !important; }
            }
          `}</style>

          {loading ? (
            Array.from({ length: deskCols * 2 }).map((_, i) => (
              <div
                key={i}
                style={{
                  background: "#f8f4ee",
                  padding: "24px 16px",
                  borderLeft: "1px solid #e5ddd3",
                }}
              >
                <ProductSkeleton index={i} />
              </div>
            ))
          ) : products.length === 0 ? (
            <div
              style={{
                gridColumn: "1/-1",
                padding: "96px 0",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontFamily: '"Cormorant Garamond", Georgia, serif',
                  fontSize: "20px",
                  fontStyle: "italic",
                  color: "#9c8a72",
                }}
              >
                Nothing here yet.
              </p>
            </div>
          ) : (
            products.map((prod, i) => (
              <div
                key={prod._id}
                className={`prod-item ${visible ? "revealed" : ""}`}
                style={{
                  background: "#f8f4ee",
                  padding: "24px 16px 32px",
                  borderLeft: i % (colCount || 2) !== 0 ? "1px solid #e5ddd3" : "none",
                  borderBottom: "1px solid #e5ddd3",
                  animationDelay: visible ? `${i * 60}ms` : "0ms",
                  position: "relative",
                }}
              >
                {/* Index number — top left corner */}
                <div
                  className="prod-idx"
                  style={{
                    fontFamily: '"DM Mono", monospace',
                    fontSize: "9px",
                    letterSpacing: "0.2em",
                    color: "#c8b89a",
                    marginBottom: "14px",
                    transition: "color 0.3s ease",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>

                <ProductCard
                  id={prod._id}
                  name={prod.name}
                  rating={prod.rating}
                  imageUrl={prod.image}
                  price={prod.price}
                  salesPrice={prod.salesPrice}
                />
              </div>
            ))
          )}
        </div>

        {/* ── Bottom CTA ── */}
        {showViewAll && !loading && products.length > 0 && (
          <div
            style={{
              padding: "0 24px",
              marginTop: "48px",
              display: "flex",
              alignItems: "center",
              gap: "20px",
              opacity: visible ? 1 : 0,
              transition: "opacity 0.5s ease 0.4s",
            }}
          >
            {/* Ruled line */}
            <div style={{ flex: 1, height: "1px", background: "#d4cbbf" }} />

            <Link
              href="/products"
              className="view-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
                padding: "14px 28px",
                background: "#1a1a1a",
                color: "#f8f4ee",
                fontFamily: '"DM Mono", monospace',
                fontSize: "10px",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                textDecoration: "none",
                transition: "background 0.3s ease",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "#3a3028")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "#1a1a1a")
              }
            >
              View more products
              <span className="view-btn-arrow">
                <MoveRight size={12} />
              </span>
            </Link>

            {/* Ruled line */}
            <div style={{ flex: 1, height: "1px", background: "#d4cbbf" }} />
          </div>
        )}
      </div>
    </>
  );
}

export default ProductsSection;