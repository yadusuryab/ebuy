"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Search, ShoppingBag, X, ArrowRight, Menu, Zap } from "lucide-react";
import Brand from "../utils/brand";

const NAV_LEFT = [
  { name: "Terms", href: "/terms" },
  { name: "Privacy", href: "/privacy" },
];

const SCROLL_THRESHOLD = 60;

type MegaItem = { name: string; tag?: string };
type MegaCol = { label: string; items: MegaItem[] };
type NavItem = { name: string; href?: string; mega?: MegaCol[] };

// ─── SearchOverlay ────────────────────────────────────────────────────────────
function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?q=${encodeURIComponent(query.trim())}`);
      onClose();
      setQuery("");
    }
  };

  return (
    <div
      className={`
        fixed inset-0 z-[200] bg-neutral-950/98 backdrop-blur-xl
        flex flex-col items-center justify-center
        transition-all duration-300
        ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
      `}
    >
      {/* diagonal accent line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500" />

      <button
        onClick={onClose}
        aria-label="Close search"
        className="absolute top-6 right-8 w-10 h-10 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/5 rounded transition-all duration-200 border border-transparent hover:border-white/10"
      >
        <X className="w-4 h-4" strokeWidth={2} />
      </button>

      <div className="w-full max-w-[620px] px-6">
        <div className="flex items-center gap-2 mb-5">
          <Zap className="w-3.5 h-3.5 text-orange-500" strokeWidth={2.5} />
          <p className="text-[9px] font-black tracking-[0.4em] uppercase text-orange-500">
            Quick Search
          </p>
        </div>
        <form onSubmit={handleSubmit} className="relative">
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Reference, model, brand…"
            autoComplete="off"
            className="
              w-full bg-transparent
              font-['Bebas_Neue',sans-serif] text-[clamp(32px,6vw,56px)] tracking-wider
              text-white placeholder:text-neutral-700
              border-0 border-b-2 border-neutral-800 focus:border-orange-500
              outline-none pb-3 pr-12
              caret-orange-500 transition-colors duration-300
            "
          />
          <button
            type="submit"
            aria-label="Submit search"
            className={`absolute right-0 bottom-3 w-10 h-10 flex items-center justify-center rounded transition-all duration-200 ${
              query.trim()
                ? "text-orange-500 hover:text-white hover:bg-orange-500"
                : "text-neutral-700 pointer-events-none"
            }`}
          >
            <ArrowRight className="w-5 h-5" strokeWidth={2} />
          </button>
        </form>
        <p className="mt-4 text-[9px] tracking-[0.25em] uppercase text-neutral-600 hidden sm:block font-semibold">
          Press Enter · Esc to close
        </p>
      </div>
    </div>
  );
}

// ─── MobileMenu ───────────────────────────────────────────────────────────────
function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  return (
    <div
      className={`
        fixed inset-0 z-[150] bg-neutral-950
        flex flex-col
        transition-all duration-300 ease-out
        ${open ? "opacity-100 pointer-events-auto translate-x-0" : "opacity-0 pointer-events-none -translate-x-4"}
      `}
    >
      {/* top accent bar */}
      <div className="w-full h-1 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 shrink-0" />

      <div className="flex items-center justify-between px-5 h-[60px] shrink-0 border-b border-neutral-800">
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" strokeWidth={2} />
        </button>
        <div className="text-white font-['Bebas_Neue',sans-serif] text-[22px] tracking-[0.2em] uppercase">
          <Brand />
        </div>
        <div className="w-10" />
      </div>

      <nav className="flex-1 flex flex-col justify-center px-8 gap-0">
        {NAV_LEFT.map((item, i) => (
          <Link
            key={item.name}
            href={item.href ?? "#"}
            onClick={onClose}
            className={`
              group flex items-center justify-between
              py-5 border-b border-neutral-800/60 last:border-0
              no-underline transition-all duration-200
              ${pathname === item.href ? "text-orange-500" : "text-neutral-500 hover:text-white"}
            `}
            style={{ transitionDelay: open ? `${i * 50 + 80}ms` : "0ms" }}
          >
            <span className="font-['Bebas_Neue',sans-serif] text-[clamp(32px,9vw,60px)] tracking-widest leading-none">
              {item.name}
            </span>
            <ArrowRight
              className="w-5 h-5 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-orange-500 shrink-0"
              strokeWidth={2}
            />
          </Link>
        ))}
      </nav>

      <div className="px-8 pb-10 shrink-0">
        <p className="text-[9px] tracking-[0.25em] uppercase text-neutral-600 font-bold text-center">
          MADE BY{" "}
          <Link href="https://instagram.com/getshopigo" className="text-orange-500 hover:text-orange-400 transition-colors">
            SHOPIGO
          </Link>
        </p>
      </div>
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = pathname === "/";
  const isOverHero = isHome && !scrolled && !menuOpen && !searchOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen, searchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* ── Main Header ─────────────────────────────────────────────────── */}
      <header
        className={`
          fixed top-0 inset-x-0 z-50
          transition-all duration-400 ease-out
          ${
            scrolled || !isHome
              ? "h-[60px] bg-neutral-950/95 backdrop-blur-xl border-b border-neutral-800"
              : "h-[72px] bg-transparent border-b border-transparent"
          }
        `}
      >
        {/* ── Orange top accent stripe ─────────────────────────────────── */}
        <div
          className={`absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-orange-600 via-red-500 to-orange-600 transition-opacity duration-400 ${
            scrolled || !isHome ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Hero gradient scrim */}
        {isOverHero && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 100%)",
            }}
          />
        )}

        <div className="relative h-full max-w-[1440px] mx-auto px-5 sm:px-10">
          <div className="h-full grid grid-cols-[1fr_auto_1fr] items-center gap-6">

            {/* ── LEFT ──────────────────────────────────────────────────── */}
            <div className="flex items-center gap-1">
              {/* Mobile hamburger */}
              <button
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                className={`
                  md:hidden w-10 h-10 flex items-center justify-center rounded
                  transition-colors duration-200
                  ${isOverHero ? "text-white/70 hover:text-white hover:bg-white/10" : "text-neutral-400 hover:text-white hover:bg-white/5"}
                `}
              >
                <Menu className="w-[18px] h-[18px]" strokeWidth={2} />
              </button>

              {/* Desktop nav */}
              <nav className="hidden md:flex items-center" aria-label="Main navigation">
                {NAV_LEFT.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href ?? "#"}
                    className={`
                      relative px-4 py-1.5
                      text-[10px] font-black tracking-[0.3em] uppercase
                      no-underline transition-colors duration-200
                      group
                      ${
                        pathname === item.href
                          ? "text-orange-500"
                          : isOverHero
                          ? "text-white/60 hover:text-white"
                          : "text-neutral-400 hover:text-white"
                      }
                    `}
                  >
                    {item.name}
                    {/* underline — orange slash */}
                    <span
                      className={`
                        absolute bottom-0 left-4 right-4 h-[2px]
                        bg-orange-500
                        scale-x-0 group-hover:scale-x-100
                        transition-transform duration-300 origin-left
                        ${pathname === item.href ? "scale-x-100" : ""}
                      `}
                    />
                  </Link>
                ))}
              </nav>
            </div>

            {/* ── CENTER LOGO ───────────────────────────────────────────── */}
            <Link
              href="/"
              aria-label="Home"
              className="flex flex-col items-center gap-0.5 no-underline group"
            >
              {/* Logo pill container */}
              <div
            
              >
                  <Brand />
              </div>
              {/* performance tagline */}
              <span
                className={`
                  text-[7px] font-black tracking-[0.45em] uppercase transition-colors duration-300
                  ${isOverHero ? "text-white/30" : "text-neutral-600 group-hover:text-orange-500/70"}
                `}
              >
                ONLINE · STORE
              </span>
            </Link>

            {/* ── RIGHT ACTIONS ─────────────────────────────────────────── */}
            <div className="flex items-center justify-end gap-0.5">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className={`
                  w-10 h-10 flex items-center justify-center rounded
                  transition-all duration-200
                  ${isOverHero ? "text-white/60 hover:text-white hover:bg-white/10" : "text-neutral-400 hover:text-white hover:bg-neutral-800"}
                `}
              >
                <Search className="w-[17px] h-[17px]" strokeWidth={2} />
              </button>

              {/* Cart */}
              <Link
                href="/cart"
                aria-label="Shopping cart"
                className={`
                  relative w-10 h-10 flex items-center justify-center rounded
                  transition-all duration-200 no-underline group
                  ${isOverHero ? "text-white/60 hover:text-white hover:bg-white/10" : "text-neutral-400 hover:text-white hover:bg-neutral-800"}
                `}
              >
                <ShoppingBag className="w-[17px] h-[17px]" strokeWidth={2} />
                {/* Cart badge */}
                <span className="absolute top-2 right-2 w-[5px] h-[5px] rounded-full bg-orange-500 group-hover:scale-125 transition-transform duration-200" />
              </Link>

              {/* CTA — desktop only */}
              <Link
                href="/products"
                className={`
                  hidden lg:flex items-center gap-2
                  ml-3 px-4 h-8 rounded-sm
                  text-[9px] font-black tracking-[0.3em] uppercase
                  no-underline transition-all duration-200
                  bg-orange-500 hover:bg-orange-400 text-white
                  group
                `}
              >
                <span>Shop Now</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-200" strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </div>

        {/* ── Bottom accent line (scrolled) ────────────────────────────── */}
        <div
          className={`
            absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-orange-500/30 to-transparent
            transition-all duration-500
            ${scrolled || !isHome ? "w-full opacity-100" : "w-0 opacity-0"}
          `}
        />
      </header>

      {!isHome && <div className="h-[60px]" aria-hidden="true" />}
    </>
  );
}