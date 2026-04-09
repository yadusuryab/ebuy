"use client";
import React, { useState, useRef, useEffect, Suspense } from "react";
import Brand from "../utils/brand";
import { Button } from "../ui/button";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  IconSearch,
  IconShoppingBag,
  IconMenu2,
  IconX,
  IconHome,
  IconHeart,
  IconUser,
  IconChevronRight,
  IconPackage,
  IconMenu,
} from "@tabler/icons-react";

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

function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const topSectionRef = useRef<HTMLDivElement>(null);
  const [topSectionHeight, setTopSectionHeight] = useState(0);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const hideSearchPaths = [
    "/checkout",
    "/cart",
    "/checkout/success",
    "/account",
    "/wishlist",
  ];

  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const placeholders = [
    "Search products...",
    "Find watches",
    "Explore gadgets",
    "Shop fashion",
    "Discover trends",
  ];

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <Suspense fallback={<HeaderFallback />}>
      <HeaderWithSearchParams>
        {({ searchParams, pathname, router }) => {
          const shouldHideSearch = hideSearchPaths.includes(pathname);

          useEffect(() => {
            const categoryFromUrl = searchParams.get("category");
            setSelectedCategory(categoryFromUrl);
          }, [searchParams]);

          useEffect(() => {
            if (shouldHideSearch) return;
            const interval = setInterval(() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
                setIsTransitioning(false);
              }, 300);
            }, 3000);
            return () => clearInterval(interval);
          }, [placeholders.length, shouldHideSearch]);

          useEffect(() => {
            const fetchCategories = async () => {
              try {
                setIsLoading(true);
                const cached = localStorage.getItem("categories_cache");
                const cacheTime = localStorage.getItem("categories_cache_time");
                const now = new Date().getTime();

                if (
                  cached &&
                  cacheTime &&
                  now - parseInt(cacheTime) < 1000 * 60 * 10
                ) {
                  setCategories(JSON.parse(cached));
                } else {
                  const res = await fetch("/api/categories");
                  const data = await res.json();
                  setCategories(data);
                  localStorage.setItem("categories_cache", JSON.stringify(data));
                  localStorage.setItem("categories_cache_time", now.toString());
                }
              } catch (err) {
                console.error("Failed to fetch categories:", err);
              } finally {
                setIsLoading(false);
              }
            };
            fetchCategories();
          }, []);

          useEffect(() => {
            if (topSectionRef.current) {
              setTopSectionHeight(topSectionRef.current.offsetHeight);
            }
          }, []);

          useEffect(() => {
            const handleScroll = () => {
              lastScrollY.current = window.scrollY;
              if (!ticking.current) {
                window.requestAnimationFrame(() => {
                  const currentScrollY = lastScrollY.current;
                  setIsScrolled(currentScrollY > 50);
                  ticking.current = false;
                });
                ticking.current = true;
              }
            };
            window.addEventListener("scroll", handleScroll, { passive: true });
            return () => window.removeEventListener("scroll", handleScroll);
          }, []);

          const handleSearch = (e: React.FormEvent) => {
            e.preventDefault();
            if (searchQuery.trim()) {
              const params = new URLSearchParams(searchParams.toString());
              params.set("q", encodeURIComponent(searchQuery.trim()));
              if (selectedCategory) params.set("category", selectedCategory);
              setSearchQuery("");
              setIsSearchFocused(false);
              if (pathname === "/products") {
                window.location.href = `/products?${params.toString()}`;
              } else {
                router.push(`/products?${params.toString()}`);
              }
            }
          };

          const handleCategoryClick = (slug: string) => {
            setSelectedCategory(slug);
            const params = new URLSearchParams(searchParams.toString());
            if (slug === selectedCategory) {
              params.delete("category");
              setSelectedCategory(null);
            } else {
              params.set("category", slug);
            }
            if (searchParams.get("q")) params.set("q", searchParams.get("q")!);
            router.push(`/products?${params.toString()}`);
          };

          const handleMobileCategoryClick = (slug: string) => {
            handleCategoryClick(slug);
            setIsMobileMenuOpen(false);
          };

          useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
              if (
                searchInputRef.current &&
                !searchInputRef.current.contains(event.target as Node)
              ) {
                setIsSearchFocused(false);
              }
            };
            document.addEventListener("mousedown", handleClickOutside);
            return () =>
              document.removeEventListener("mousedown", handleClickOutside);
          }, []);

          const navLinks = [
            { href: "/", label: "Home", icon: <IconHome size={20} /> },
            { href: "/products", label: "All Products", icon: <IconPackage size={20} /> },
            { href: "/cart", label: "Cart", icon: <IconShoppingBag size={20} /> },
          ];

          return (
            <>
              {/* Mobile Menu Overlay */}
              <div
                className={`fixed inset-0 z-[60] transition-all duration-300 md:hidden ${
                  isMobileMenuOpen ? "visible" : "invisible"
                }`}
              >
                <div
                  className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
                    isMobileMenuOpen ? "opacity-100" : "opacity-0"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                />

                <div
                  className={`absolute top-0 left-0 h-full w-[80vw] max-w-[320px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
                    isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                  }`}
                >
                  <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                      <Brand />
                    </Link>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                      aria-label="Close menu"
                    >
                      <IconX size={20} />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    <nav className="px-3 pt-4 pb-2">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-widest px-2 mb-3">
                        Navigation
                      </p>
                      {navLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${
                            pathname === link.href
                              ? "bg-slate-100 text-slate-900 font-medium"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          <span
                            className={
                              pathname === link.href
                                ? "text-slate-600"
                                : "text-gray-400"
                            }
                          >
                            {link.icon}
                          </span>
                          <span className="flex-1 text-sm">{link.label}</span>
                          <IconChevronRight size={16} className="text-gray-300" />
                        </Link>
                      ))}
                    </nav>

                    <div className="mx-4 border-t border-gray-100 my-3" />

                    <div className="px-3 pt-3 pb-4">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-widest px-2 mb-3">
                        Categories
                      </p>

                      <button
                        onClick={() => handleMobileCategoryClick("")}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-2 transition-colors ${
                          !selectedCategory
                            ? "bg-slate-100 text-slate-900 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <IconShoppingBag size={18} />
                        <span className="flex-1 text-sm text-left">For you</span>
                      </button>

                      {isLoading
                        ? [...Array(6)].map((_, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-3 px-3 py-2.5 mb-1"
                            >
                              <div className="w-8 h-8 rounded-md bg-gray-200 animate-pulse" />
                              <div className="h-4 bg-gray-200 rounded animate-pulse flex-1" />
                            </div>
                          ))
                        : categories.map((category: any) => (
                            <button
                              key={category._id}
                              onClick={() =>
                                handleMobileCategoryClick(category.slug)
                              }
                              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${
                                selectedCategory === category.slug
                                  ? "bg-slate-100 text-slate-900 font-medium"
                                  : "text-gray-600 hover:bg-gray-50"
                              }`}
                            >
                              <div className="w-8 h-8 rounded-md overflow-hidden bg-gray-100">
                                {category.image ? (
                                  <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <IconShoppingBag size={16} className="text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <span className="flex-1 text-sm text-left">
                                {category.name}
                              </span>
                            </button>
                          ))}
                    </div>
                  </div>

                  <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                    <p className="text-xs text-gray-500 text-center font-medium">
                      Trending Store Kerala
                    </p>
                  </div>
                </div>
              </div>

              {/* Main Header */}
              <header
                ref={headerRef}
                className="mx-auto fixed top-0 left-0 right-0 bg-white z-50 md:left-1/2 md:-translate-x-1/2 md:w-full border-b border-gray-200"
              >
                {/* Top section */}
                <div
                  ref={topSectionRef}
                  className="transition-all duration-500 ease-in-out transform-gpu will-change-transform"
                  style={{
                    transform: isScrolled ? "translateY(-100%)" : "translateY(0)",
                    opacity: isScrolled ? 0 : 1,
                    marginBottom: isScrolled ? `-${topSectionHeight}px` : 0,
                  }}
                >
                  <div className="px-4 py-1 flex items-center bg-white gap-3 -b ">
                    <button
                      className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
                      onClick={() => setIsMobileMenuOpen(true)}
                      aria-label="Open menu"
                    >
                      <IconMenu size={22} />
                    </button>

                    <div className="flex-1 flex justify-center">
                      <Link
                        href="/"
                        className="transition-all duration-300 hover:opacity-80 z-10"
                      >
                        <Brand />
                      </Link>
                    </div>

                    <div className="flex-shrink-0">
                      <Link
                        href="/cart"
                        className="transition-all duration-300 flex items-center gap-2"
                      >
                        <button className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-700">
                          <IconShoppingBag size={22} />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Search and Categories section */}
                {!shouldHideSearch && (
                  <div className="search-portion md:flex items-center justify-between flex-row-reverse px-4 py-3 bg-white">
                    <form onSubmit={handleSearch} className="w-full md:w-auto">
                      <div
                        className={`border flex rounded-lg items-center bg-white px-3 py-2 transition-all duration-300 ${
                          isSearchFocused
                            ? "border-orange-400 shadow-sm ring-1 ring-slate-200"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <IconSearch
                          size={18}
                          className={`transition-all duration-300 ${
                            isSearchFocused
                              ? "text-orange-600"
                              : "text-gray-400"
                          }`}
                        />
                        <div className="relative w-full overflow-hidden">
                          <input
                            ref={searchInputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                            className="w-full px-2 py-1.5 text-sm rounded-lg focus:outline-none bg-transparent placeholder-transparent"
                          />
                          <div
                            className={`absolute left-2 top-0 pointer-events-none flex items-center h-full transition-all duration-600 ease-in-out ${
                              searchQuery ? "opacity-0" : "opacity-100"
                            }`}
                          >
                            <span
                              className={`text-sm text-gray-400 transition-all duration-600 ease-in-out transform ${
                                isTransitioning
                                  ? "translate-y-8 opacity-0"
                                  : "translate-y-0 opacity-100"
                              }`}
                              key={placeholderIndex}
                            >
                              {placeholders[placeholderIndex]}
                            </span>
                          </div>
                        </div>
                      </div>
                    </form>

                    {/* Categories section */}
                    <div className="categories pt-3 pb-1 flex overflow-x-auto gap-2 scrollbar-hide md:pt-0">
                      <button
                        onClick={() => handleCategoryClick("")}
                        className={`flex p-2 flex-col justify-center items-center rounded-lg transition-all duration-300 min-w-[70px] text-sm font-medium ${
                          !selectedCategory
                            ? "bg-slate-100 text-slate-900 "
                            : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <div
                          className={`transition-all duration-300 ${
                            isScrolled
                              ? "h-0 w-0 opacity-0 overflow-hidden"
                              : "h-auto w-auto opacity-100"
                          }`}
                        >
                          <IconShoppingBag size={20} />
                        </div>
                        <span
                          className={`text-xs transition-all duration-300 ${
                            isScrolled ? "mt-0" : "mt-1"
                          }`}
                        >
                          For you
                        </span>
                      </button>

                      {isLoading
                        ? [...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className="flex p-2 flex-col justify-center items-center rounded-lg min-w-[70px]"
                            >
                              <div
                                className={`bg-gray-200 rounded-md transition-all duration-300 ${
                                  isScrolled ? "h-0 w-0" : "h-12 w-12"
                                } animate-pulse`}
                              ></div>
                              <div
                                className={`h-3 bg-gray-200 rounded transition-all duration-300 ${
                                  isScrolled ? "w-8 mt-0" : "w-12 mt-1"
                                } animate-pulse`}
                              ></div>
                            </div>
                          ))
                        : categories.map((category: any) => (
                            <button
                              key={category._id}
                              onClick={() =>
                                handleCategoryClick(category.slug)
                              }
                              className={`flex p-2 flex-col justify-center items-center rounded-lg transition-all duration-300 min-w-[70px] text-sm font-medium ${
                                selectedCategory === category.slug
                                  ? "bg-slate-100 text-slate-900 shadow-sm scale-105"
                                  : "bg-gray-50 text-gray-700 hover:bg-gray-100 hover:scale-105"
                              }`}
                            >
                              <div
                                className={`rounded-md overflow-hidden transition-all duration-300 ${
                                  isScrolled
                                    ? "h-0 w-0 opacity-0"
                                    : "h-12 w-12 opacity-100"
                                }`}
                              >
                                {category.image ? (
                                  <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-12 h-12 object-cover rounded-md"
                                  />
                                ) : (
                                  <div className="w-12 h-12 bg-gray-200 flex items-center justify-center rounded-md">
                                    <IconShoppingBag
                                      size={20}
                                      className="text-gray-400"
                                    />
                                  </div>
                                )}
                              </div>
                              <span
                                className={`text-xs transition-all duration-300 ${
                                  isScrolled ? "mt-0 font-semibold" : "mt-1"
                                } truncate w-full text-center`}
                              >
                                {category.name}
                              </span>
                            </button>
                          ))}
                    </div>
                  </div>
                )}
              </header>

              {/* Dynamic spacer */}
              <div
                className="transition-all duration-500 ease-in-out"
                style={{
                  height: isScrolled
                    ? shouldHideSearch
                      ? "60px"
                      : "100px"
                    : `${(topSectionHeight || 60) + (shouldHideSearch ? 0 : 160)}px`,
                }}
              />
            </>
          );
        }}
      </HeaderWithSearchParams>
    </Suspense>
  );
}

function HeaderFallback() {
  return (
    <header className="mx-auto fixed top-0 left-0 right-0 bg-white z-50 md:left-1/2 md:-translate-x-1/2 md:w-full border-b ">
      <div className="px-4 py-3 flex items-center justify-between">
        <Button variant="ghost" className="w-full max-w-[600px]">
          <Link href={"/"}>
            <Brand />
          </Link>
        </Button>
        <Link href="/cart" className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <IconShoppingBag size={20} />
          </Button>
        </Link>
      </div>
      <div style={{ height: "60px" }} />
    </header>
  );
}

export default Header;