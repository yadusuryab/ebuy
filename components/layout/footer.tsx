"use client";

import * as React from "react";
import Link from "next/link";
import Brand from "../utils/brand";

function Footer() {
  const currentYear = new Date().getFullYear();
  const [categories, setCategories] = React.useState<any[]>([]);

  React.useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setCategories(data))
      .catch(() => {});
  }, []);

  const dynamicCategories = categories.slice(0, 5).map((c) => ({
    label: c.name || "Category",
    href: `/products?category=${c.slug?.current || c.slug || "category"}`,
  }));

  const fallbackCategories = [
    { label: "Watches", href: "/products?category=watches" },
    { label: "Footwear", href: "/products?category=footwears" },
  ];

  const shopCategories = dynamicCategories.length > 0 ? dynamicCategories : fallbackCategories;

  const instagram = process.env.NEXT_PUBLIC_INSTA || "#";
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP || "#";

  const marqueeItems = [
    "New arrivals every Friday",
    "Easy 30-day returns",
    "Premium collections, curated for you",
    "Secure checkout · 100% safe",
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        @keyframes footerMarquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .wz-marquee {
          display: inline-flex;
          animation: footerMarquee 28s linear infinite;
          white-space: nowrap;
        }
        .wz-marquee:hover { animation-play-state: paused; }

        .wz-nav-link {
          font-size: 13px;
          color: #888;
          text-decoration: none;
          font-weight: 300;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: color 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .wz-nav-link .arr {
          font-size: 10px;
          opacity: 0;
          transform: translate(-2px, 2px);
          transition: all 0.2s;
        }
        .wz-nav-link:hover { color: #e8e4dc; }
        .wz-nav-link:hover .arr { opacity: 1; transform: translate(0, 0); }
      `}</style>

      <footer style={{ background: "#0f0f0f", color: "#e8e4dc", fontFamily: "'DM Sans', sans-serif" }}>

        {/* Marquee */}
        <div style={{ borderBottom: "1px solid #1e1e1e", padding: "10px 0", overflow: "hidden" }}>
          <div className="wz-marquee">
            {[...marqueeItems, ...marqueeItems].map((t, i) => (
              <React.Fragment key={i}>
                <span style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#444", fontWeight: 300, padding: "0 4px" }}>
                  {t}
                </span>
                <span style={{ display: "inline-block", width: 3, height: 3, background: "#2a2a2a", borderRadius: "50%", margin: "0 18px", verticalAlign: "middle" }} />
              </React.Fragment>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>

          {/* Hero row */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 60,
            padding: "64px 0 56px",
            borderBottom: "1px solid #1e1e1e",
            alignItems: "end",
          }}>
            <div>
              <Link href="/" style={{ display: "block", marginBottom: 16 }}>
                <Brand className="h-12 w-auto" />
              </Link>
              <p style={{ fontSize: 13, color: "#555", lineHeight: 1.8, fontWeight: 300, maxWidth: 300 }}>
                Handpicked fashion, curated for the modern wardrobe. Quality pieces built to last.
              </p>
            </div>
            {/* <div>
              <p style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: "#333", marginBottom: 12 }}>
                Our philosophy
              </p>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#2a2a2a", lineHeight: 1.5, fontStyle: "italic", textAlign: "right" }}>
                "Style is not about trends.<br />
                It's about <span style={{ color: "#b8933f" }}>presence.</span>"
              </p>
            </div> */}
          </div>

          {/* Link columns */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 32,
            padding: "48px 0 40px",
            borderBottom: "1px solid #1e1e1e",
          }}>

            {/* Help + Social */}
            <div>
              <p style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "#333", fontWeight: 500, marginBottom: 20 }}>Help</p>
              <ul style={{ listStyle: "none", marginBottom: 28 }}>
                <li><Link href="/contact" className="wz-nav-link">Contact Us <span className="arr">↗</span></Link></li>
              </ul>
              <p style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "#333", fontWeight: 500, marginBottom: 16 }}>Follow</p>
              <div style={{ display: "flex", gap: 10 }}>
                {[{ label: "IG", href: instagram }, { label: "WA", href: whatsapp }].map(({ label, href }) => (
                  <Link key={label} href={href} target="_blank" rel="noopener noreferrer"
                    style={{
                      width: 34, height: 34,
                      border: "1px solid #222",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#555", fontSize: 11, textDecoration: "none",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#b8933f"; (e.currentTarget as HTMLElement).style.color = "#b8933f"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#222"; (e.currentTarget as HTMLElement).style.color = "#555"; }}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Company */}
            {/* <div>
              <p style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "#333", fontWeight: 500, marginBottom: 20 }}>Company</p>
              <ul style={{ listStyle: "none" }}>
                <li><Link href="/about" className="wz-nav-link">About Us <span className="arr">↗</span></Link></li>
              </ul>
            </div> */}

            {/* Shop */}
            <div>
              <p style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "#333", fontWeight: 500, marginBottom: 20 }}>Shop</p>
              <ul style={{ listStyle: "none" }}>
                {shopCategories.map((l) => (
                  <li key={l.href} style={{ marginBottom: 12 }}>
                    <Link href={l.href} className="wz-nav-link">{l.label} <span className="arr">↗</span></Link>
                  </li>
                ))}
                <li><Link href="/products" className="wz-nav-link">All products <span className="arr">↗</span></Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <p style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "#333", fontWeight: 500, marginBottom: 20 }}>Legal</p>
              <ul style={{ listStyle: "none" }}>
                {[{ label: "Privacy Policy", href: "/privacy-policy" }, { label: "Terms & Conditions", href: "/terms" }, { label: "Cookies", href: "/cookies" }].map((l) => (
                  <li key={l.href} style={{ marginBottom: 12 }}>
                    <Link href={l.href} className="wz-nav-link">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 0" }}>
            <p style={{ fontSize: 11, color: "#333", fontWeight: 300 }}>
              © {currentYear} {process.env.NEXT_PUBLIC_APP_NAME || "Store"}. All rights reserved.
            </p>
            <p style={{ fontSize: 12, color: "#333", fontWeight: 300 }}>
              Made with ♥ by{" "}
              <Link href="https://instagram.com/getshopigo" target="_blank" rel="noopener noreferrer"
                style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", color: "#b8933f", textDecoration: "none" }}>
                Shopigo
              </Link>
            </p>
          </div>

        </div>
      </footer>
    </>
  );
}

export { Footer };