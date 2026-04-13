"use client";
import React, { useState, useRef, useEffect, Suspense } from "react";
import Brand from "../utils/brand";
import { Button } from "../ui/button";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  IconSearch,
  IconShoppingBag,
  IconX,
  IconHome,
  IconChevronRight,
  IconPackage,
  IconMenu,
} from "@tabler/icons-react";
import MarqueeStrip from "../sections/marquee-strip";

/* ─── paths that hide search bar + categories ─── */
const HIDE_SEARCH_PATHS = [
  "/checkout",
  "/cart",
  "/checkout/success",
  "/account",
  "/wishlist",
  "/product",
  "/products",
  "/term",
  "/contact"
];

/* ─── paths that hide the marquee strip ─── */
const HIDE_MARQUEE_PATHS = [
  "/checkout",
  "/checkout/success",
  "/account",
];

const PLACEHOLDERS = [
  "Search products...",
  "Find watches",
  "Explore gadgets",
  "Shop fashion",
  "Discover trends",
];

/* ════════════════════════════════════════════════════════════ */
function HeaderWithSearchParams({
  children,
}: {
  children: (params: {
    searchParams: ReturnType<typeof useSearchParams>;
    pathname: ReturnType<typeof usePathname>;
    router: ReturnType<typeof useRouter>;
  }) => React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  return children({ searchParams, pathname, router });
}

/* ════════════════════════════════════════════════════════════ */
function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);   // ← collapsible
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const topSectionRef = useRef<HTMLDivElement>(null);
  const [topSectionHeight, setTopSectionHeight] = useState(0);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  /* ── lock body scroll when mobile menu is open ── */
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  /* ── auto-focus search input when opened ── */
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  return (
    <Suspense fallback={<HeaderFallback />}>
      <HeaderWithSearchParams>
        {({ searchParams, pathname, router }) => {
          const shouldHideSearch  = HIDE_SEARCH_PATHS.some(p => pathname.startsWith(p));
          const shouldHideMarquee = HIDE_MARQUEE_PATHS.some(p => pathname.startsWith(p));

          /* sync category from URL */
          // eslint-disable-next-line react-hooks/rules-of-hooks
          useEffect(() => {
            setSelectedCategory(searchParams.get("category"));
          }, [searchParams]);

          /* rotate placeholders */
          // eslint-disable-next-line react-hooks/rules-of-hooks
          useEffect(() => {
            if (shouldHideSearch) return;
            const id = setInterval(() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setPlaceholderIndex(p => (p + 1) % PLACEHOLDERS.length);
                setIsTransitioning(false);
              }, 300);
            }, 3000);
            return () => clearInterval(id);
          }, [shouldHideSearch]);

          /* fetch categories with 10-min cache */
          // eslint-disable-next-line react-hooks/rules-of-hooks
          useEffect(() => {
            (async () => {
              try {
                setIsLoading(true);
                const cached    = localStorage.getItem("categories_cache");
                const cacheTime = localStorage.getItem("categories_cache_time");
                const now       = Date.now();
                if (cached && cacheTime && now - +cacheTime < 600_000) {
                  setCategories(JSON.parse(cached));
                } else {
                  const data = await fetch("/api/categories").then(r => r.json());
                  setCategories(data);
                  localStorage.setItem("categories_cache", JSON.stringify(data));
                  localStorage.setItem("categories_cache_time", String(now));
                }
              } catch (e) {
                console.error("Failed to fetch categories:", e);
              } finally {
                setIsLoading(false);
              }
            })();
          }, []);

          /* measure top section for spacer */
          // eslint-disable-next-line react-hooks/rules-of-hooks
          useEffect(() => {
            if (topSectionRef.current)
              setTopSectionHeight(topSectionRef.current.offsetHeight);
          }, []);

          /* scroll listener */
          // eslint-disable-next-line react-hooks/rules-of-hooks
          useEffect(() => {
            const onScroll = () => {
              lastScrollY.current = window.scrollY;
              if (!ticking.current) {
                requestAnimationFrame(() => {
                  setIsScrolled(lastScrollY.current > 50);
                  ticking.current = false;
                });
                ticking.current = true;
              }
            };
            window.addEventListener("scroll", onScroll, { passive: true });
            return () => window.removeEventListener("scroll", onScroll);
          }, []);

          /* click-outside to close search */
          // eslint-disable-next-line react-hooks/rules-of-hooks
          useEffect(() => {
            const handler = (e: MouseEvent) => {
              if (!searchInputRef.current?.closest(".search-container")?.contains(e.target as Node)) {
                setIsSearchOpen(false);
              }
            };
            document.addEventListener("mousedown", handler);
            return () => document.removeEventListener("mousedown", handler);
          }, []);

          /* ── handlers ── */
          const handleSearch = (e: React.FormEvent) => {
            e.preventDefault();
            if (!searchQuery.trim()) return;
            const params = new URLSearchParams(searchParams.toString());
            params.set("q", encodeURIComponent(searchQuery.trim()));
            if (selectedCategory) params.set("category", selectedCategory);
            setSearchQuery("");
            setIsSearchOpen(false);
            if (pathname === "/products") {
              window.location.href = `/products?${params}`;
            } else {
              router.push(`/products?${params}`);
            }
          };

          const handleCategoryClick = (slug: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (slug && slug !== selectedCategory) {
              params.set("category", slug);
              setSelectedCategory(slug);
            } else {
              params.delete("category");
              setSelectedCategory(null);
            }
            const q = searchParams.get("q");
            if (q) params.set("q", q);
            router.push(`/products?${params}`);
          };

          const navLinks = [
            { href: "/",         label: "Home",         icon: <IconHome size={20} /> },
            { href: "/products", label: "All Products",  icon: <IconPackage size={20} /> },
            { href: "/cart",     label: "Cart",          icon: <IconShoppingBag size={20} /> },
          ];

          /* ════════════════ JSX ════════════════ */
          return (
            <>
              <style>{`
                @keyframes slideDown {
                  from { opacity: 0; transform: translateY(-8px); }
                  to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                  from { opacity: 0; }
                  to   { opacity: 1; }
                }
                @keyframes searchExpand {
                  from { width: 0; opacity: 0; }
                  to   { width: 100%; opacity: 1; }
                }
                .header-animate  { animation: slideDown .35s cubic-bezier(.22,1,.36,1) both; }
                .search-expand   { animation: searchExpand .3s cubic-bezier(.22,1,.36,1) both; }
                .fade-in         { animation: fadeIn .25s ease both; }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide  { -ms-overflow-style: none; scrollbar-width: none; }
                .cat-pill        { transition: all .25s cubic-bezier(.22,1,.36,1); }
                .cat-pill:hover  { transform: translateY(-2px) scale(1.04); }
                .cat-pill.active { transform: translateY(-1px) scale(1.05); }
                .mobile-drawer   { transition: transform .35s cubic-bezier(.22,1,.36,1); }
                .overlay-bg      { transition: opacity .3s ease; }
                .top-strip       {
                  transition: max-height .45s cubic-bezier(.22,1,.36,1),
                              opacity    .35s ease,
                              margin     .45s cubic-bezier(.22,1,.36,1);
                  overflow: hidden;
                }
                .icon-btn {
                  position: relative;
                  display: flex; align-items: center; justify-content: center;
                  width: 40px; height: 40px;
                  border-radius: 10px;
                  transition: background .2s ease, transform .2s ease;
                }
                .icon-btn:hover { background: #f3f4f6; transform: scale(1.05); }
                .icon-btn:active { transform: scale(.95); }
              `}</style>

              {/* ── Mobile Menu Overlay ── */}
              <div
                className={`fixed inset-0 z-[60] md:hidden`}
                style={{
                  pointerEvents: isMobileMenuOpen ? "auto" : "none",
                  visibility: isMobileMenuOpen ? "visible" : "hidden",
                }}
              >
                {/* backdrop */}
                <div
                  className="overlay-bg absolute inset-0 bg-black/40 backdrop-blur-sm"
                  style={{ opacity: isMobileMenuOpen ? 1 : 0 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                />

                {/* drawer */}
                <div
                  className={`mobile-drawer absolute top-0 left-0 h-full w-[82vw] max-w-[340px] bg-white shadow-2xl flex flex-col`}
                  style={{ transform: isMobileMenuOpen ? "translateX(0)" : "translateX(-100%)" }}
                >
                  {/* drawer header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                      <Brand />
                    </Link>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="icon-btn text-gray-500"
                      aria-label="Close menu"
                    >
                      <IconX size={18} />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    {/* nav links */}
                    <nav className="px-4 pt-5 pb-3">
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-2 mb-3">
                        Navigation
                      </p>
                      {navLinks.map((link, i) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-3 py-3 rounded-xl mb-1 transition-all duration-200 ${
                            pathname === link.href
                              ? "bg-orange-50 text-orange-700 font-semibold"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                          style={{ animationDelay: `${i * 40}ms` }}
                        >
                          <span className={pathname === link.href ? "text-orange-500" : "text-gray-400"}>
                            {link.icon}
                          </span>
                          <span className="flex-1 text-sm">{link.label}</span>
                          <IconChevronRight size={14} className="text-gray-300" />
                        </Link>
                      ))}
                    </nav>

                    <div className="mx-5 border-t border-gray-100 my-1" />

                    {/* categories */}
                    <div className="px-4 pt-4 pb-6">
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-2 mb-3">
                        Categories
                      </p>
                      <button
                        onClick={() => { handleCategoryClick(""); setIsMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl mb-2 transition-all duration-200 ${
                          !selectedCategory
                            ? "bg-orange-50 text-orange-700 font-semibold"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <IconShoppingBag size={18} className={!selectedCategory ? "text-orange-500" : "text-gray-400"} />
                        <span className="flex-1 text-sm text-left">For you</span>
                      </button>

                      {isLoading
                        ? [...Array(6)].map((_, i) => (
                            <div key={i} className="flex items-center gap-3 px-3 py-3 mb-1">
                              <div className="w-8 h-8 rounded-lg bg-gray-100 animate-pulse" />
                              <div className="h-3.5 bg-gray-100 rounded animate-pulse flex-1" />
                            </div>
                          ))
                        : categories.map((cat: any) => (
                            <button
                              key={cat._id}
                              onClick={() => { handleCategoryClick(cat.slug); setIsMobileMenuOpen(false); }}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all duration-200 ${
                                selectedCategory === cat.slug
                                  ? "bg-orange-50 text-orange-700 font-semibold"
                                  : "text-gray-600 hover:bg-gray-50"
                              }`}
                            >
                              <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                {cat.image
                                  ? <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                                  : <IconShoppingBag size={16} className="m-auto mt-1.5 text-gray-400" />}
                              </div>
                              <span className="flex-1 text-sm text-left">{cat.name}</span>
                            </button>
                          ))}
                    </div>
                  </div>

                  <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/80">
                    <p className="text-[11px] text-gray-400 text-center font-medium tracking-wide">
                      Trending Store Kerala
                    </p>
                  </div>
                </div>
              </div>

              {/* ── Main Header ── */}
              <header className="header-animate fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md ">

                {/* Marquee strip */}
                {!shouldHideMarquee && (
                  <div
                    className="top-strip"
                    style={{
                      maxHeight: isScrolled ? "0px" : "40px",
                      opacity:   isScrolled ? 0 : 1,
                      marginBottom: 0,
                    }}
                  >
                    <MarqueeStrip />
                  </div>
                )}

                {/* ── Brand / icons row ── */}
                <div ref={topSectionRef} className="search-container relative h-14 overflow-hidden">

                  {/* DEFAULT: [☰] ····· [Logo centered] ····· [🔍] [🛍] */}
                  <div
                    className="absolute inset-0 flex items-center px-3 gap-2 transition-all duration-300 ease-[cubic-bezier(.22,1,.36,1)]"
                    style={{
                      opacity:       isSearchOpen ? 0 : 1,
                      transform:     isSearchOpen ? "translateY(-10px)" : "translateY(0)",
                      pointerEvents: isSearchOpen ? "none" : "auto",
                    }}
                  >
                    {/* hamburger */}
                    <button
                      className="icon-btn flex-shrink-0 md:hidden text-gray-600"
                      onClick={() => setIsMobileMenuOpen(true)}
                      aria-label="Open menu"
                    >
                      <IconMenu size={22} />
                    </button>

                    {/* logo — truly centered via absolute positioning */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <Link href="/" className="pointer-events-auto transition-opacity hover:opacity-75">
                        <Brand />
                      </Link>
                    </div>

                    {/* right icons */}
                    <div className="ml-auto flex items-center gap-1">
                      {!shouldHideSearch && (
                        <button
                          className="icon-btn text-gray-600"
                          onClick={() => setIsSearchOpen(true)}
                          aria-label="Open search"
                        >
                          <IconSearch size={20} />
                        </button>
                      )}
                      <Link href="/cart">
                        <button className="icon-btn text-gray-600" aria-label="Cart">
                          <IconShoppingBag size={21} />
                        </button>
                      </Link>
                    </div>
                  </div>

                  {/* SEARCH: [input·············] [Cancel] */}
                  {!shouldHideSearch && (
                    <div
                      className="absolute inset-0 flex items-center px-3 gap-2 transition-all duration-300 ease-[cubic-bezier(.22,1,.36,1)]"
                      style={{
                        opacity:       isSearchOpen ? 1 : 0,
                        transform:     isSearchOpen ? "translateY(0)" : "translateY(10px)",
                        pointerEvents: isSearchOpen ? "auto" : "none",
                      }}
                    >
                      <form onSubmit={handleSearch} className="flex-1 flex items-center h-9 border border-orange-300 rounded-xl bg-white ring-2 ring-orange-100 px-3 gap-2">
                        <IconSearch size={15} className="flex-shrink-0 text-orange-400" />
                        <input
                          ref={searchInputRef}
                          type="text"
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          className="flex-1 min-w-0 text-sm focus:outline-none bg-transparent placeholder-gray-400"
                          placeholder={PLACEHOLDERS[placeholderIndex]}
                        />
                        {searchQuery && (
                          <button type="button" onClick={() => setSearchQuery("")} className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors">
                            <IconX size={14} />
                          </button>
                        )}
                      </form>
                      <button
                        onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                        className="flex-shrink-0 text-sm font-medium text-orange-500 hover:text-orange-700 transition-colors whitespace-nowrap"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {/* ── Categories strip ── */}
                {!shouldHideSearch && (
                  <div className="px-3 pb-2 pt-1 flex overflow-x-auto gap-2 scrollbar-hide">
                    {/* "For you" pill */}
                    <button
                      onClick={() => handleCategoryClick("")}
                      className={`cat-pill flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium ${
                        !selectedCategory
                          ? "active bg-primary/10 text-primary ring-1 ring-primary/20"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <div
                        className="rounded-lg overflow-hidden  flex items-center justify-center transition-all duration-400"
                        style={{
                          width:   isScrolled ? 0 : 44,
                          height:  isScrolled ? 0 : 44,
                          opacity: isScrolled ? 0 : 1,
                        }}
                      >
                        <IconShoppingBag size={20} className="text-primary" />
                      </div>
                      <span className="truncate max-w-[60px]">For you</span>
                    </button>

                    {isLoading
                      ? [...Array(5)].map((_, i) => (
                          <div key={i} className="flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-xl min-w-[64px]">
                            <div
                              className="bg-gray-100 rounded-lg animate-pulse transition-all duration-400"
                              style={{ width: isScrolled ? 0 : 44, height: isScrolled ? 0 : 44 }}
                            />
                            <div className="h-3 w-12 bg-gray-100 rounded animate-pulse" />
                          </div>
                        ))
                      : categories.map((cat: any) => (
                          <button
                            key={cat._id}
                            onClick={() => handleCategoryClick(cat.slug)}
                            className={`cat-pill flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium ${
                              selectedCategory === cat.slug
                                ? "active bg-orange-50 text-orange-700 ring-1 ring-orange-200"
                                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            <div
                              className="rounded-lg overflow-hidden bg-gray-100 transition-all duration-400"
                              style={{
                                width:   isScrolled ? 0 : 44,
                                height:  isScrolled ? 0 : 44,
                                opacity: isScrolled ? 0 : 1,
                              }}
                            >
                              {cat.image
                                ? <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                                : <div className="w-full h-full flex items-center justify-center">
                                    <IconShoppingBag size={18} className="text-gray-400" />
                                  </div>}
                            </div>
                            <span className="truncate max-w-[60px]">{cat.name}</span>
                          </button>
                        ))}
                  </div>
                )}
              </header>

              {/* ── Dynamic spacer ── */}
              <div
                style={{
                  height: isScrolled
                    ? shouldHideSearch ? "0px" : "52px"
                    : `${
                        (shouldHideMarquee ? 0 : 36) +
                        56 +
                        0 +
                        (shouldHideSearch ? 0 : 72)
                      }px`,
                  transition: "height .4s cubic-bezier(.22,1,.36,1)",
                }}
              />
            </>
          );
        }}
      </HeaderWithSearchParams>
    </Suspense>
  );
}

/* ════════════════════════════════════════════════════════════ */
function HeaderFallback() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="px-4 h-14 flex items-center justify-between">
        <div className="flex-1 flex justify-center">
          <Link href="/"><Brand /></Link>
        </div>
        <Link href="/cart">
          <Button variant="ghost" size="icon"><IconShoppingBag size={20} /></Button>
        </Link>
      </div>
    </header>
  );
}

export default Header;