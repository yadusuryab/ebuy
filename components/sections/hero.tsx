'use client';

import { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────

type BannerItem = {
  _id: string;
  title?: string;
  subtitle?: string;
  mediaType?: 'image' | 'video';
  imageUrl?: string;
  imageUrlMobile?: string;
  imageUrlWebp?: string;
  lqip?: string;
  video?: { url: string; mimeType?: string };
  videoPoster?: string;
  buttonText?: string;
  buttonLink?: string;
  ctaText?: string;
  ctaLink?: string;
  offerTag?: string;
  bankOffer?: string;
  order?: number;
  active?: boolean;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const SLIDE_DURATION = 4000;

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getActiveBanners = async (): Promise<BannerItem[]> => {
  try {
    const res = await fetch('/api/banner', { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
};

// ─── Optimized Image Component ────────────────────────────────────────────────

const OptimizedBannerImage: React.FC<{
  banner: BannerItem;
  isActive: boolean;
  isMobile?: boolean;
  priority?: boolean;
}> = ({ banner, isActive, isMobile, priority }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  const imageUrl = isMobile ? banner.imageUrlMobile : banner.imageUrl;
  const imageUrlWebp = banner.imageUrlWebp;
  const lqip = banner.lqip;

  if (!imageUrl || error) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-700">
        <div className="absolute inset-0 bg-black/20" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Blur placeholder for better perceived performance */}
      {lqip && !isLoaded && (
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 transition-opacity duration-500"
          style={{
            backgroundImage: `url(${lqip})`,
            filter: 'blur(20px)',
            transform: 'scale(1.1)',
          }}
        />
      )}

      {/* Responsive picture element */}
      <picture>
        {imageUrlWebp && (
          <source srcSet={imageUrlWebp} type="image/webp" />
        )}
        <img
          src={imageUrl}
          alt={banner.title || 'Banner'}
          className={`w-full h-full object-cover transition-opacity duration-700 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            objectPosition: isMobile ? 'center' : 'top center',
          }}
          onLoad={() => setIsLoaded(true)}
          onError={() => setError(true)}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
        />
      </picture>

      {/* Gradient overlays for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
      {!isMobile && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      )}
    </div>
  );
};

// ─── Hero Component ───────────────────────────────────────────────────────────

const Hero: React.FC<{ className?: string }> = ({ className }) => {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const autoSlideRef = useRef<NodeJS.Timeout | null>(null);
  const slidesRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Fetch banners
  useEffect(() => {
    (async () => {
      try {
        const data = await getActiveBanners();
        setBanners(data);
      } catch (error) {
        console.error("Failed to load banners:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Preload first banner image
  useEffect(() => {
    if (banners.length > 0 && banners[0].imageUrl) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = banners[0].imageUrl;
      link.fetchPriority = 'high';
      document.head.appendChild(link);
      
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [banners]);

  const startAutoSlide = useCallback((count: number) => {
    if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    if (count <= 1) return;
    autoSlideRef.current = setInterval(() => {
      setSelectedIndex(p => (p + 1) % count);
    }, SLIDE_DURATION);
  }, []);

  useEffect(() => {
    startAutoSlide(banners.length);
    return () => { 
      if (autoSlideRef.current) clearInterval(autoSlideRef.current); 
    };
  }, [banners.length, startAutoSlide]);

  const goTo = useCallback((index: number) => {
    if (index === selectedIndex) return;
    setSelectedIndex(index);
    startAutoSlide(banners.length);
  }, [banners.length, startAutoSlide, selectedIndex]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && selectedIndex < banners.length - 1) {
        goTo(selectedIndex + 1);
      } else if (diff < 0 && selectedIndex > 0) {
        goTo(selectedIndex - 1);
      }
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  // Skeleton loading state
  if (loading) {
    return (
      <section className={cn("w-full", className)}>
        <style>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
        `}</style>
        <div className="relative w-full h-[200px] md:h-[70vh] bg-gray-100 overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        </div>
        <div className="h-1.5 bg-gray-100 md:hidden" />
      </section>
    );
  }

  // Fallback when no banners
  if (!banners.length) {
    return (
      <section className={cn("w-full", className)}>
        <div className="relative w-full h-[200px] md:h-[70vh] bg-gradient-to-r from-blue-600 to-blue-700 overflow-hidden flex items-center px-5 md:px-16">
          <div className="relative z-10 flex-1">
            <p className="text-xs font-semibold text-white/70 uppercase tracking-widest mb-1 md:mb-4">New Collection</p>
            <h1 className="text-2xl md:text-7xl font-bold text-white leading-tight mb-2 md:mb-6">
              Welcome to<br />Our Store
            </h1>
            <Link 
              href="/products" 
              className="inline-flex items-center gap-1 md:gap-2 text-xs md:text-sm font-semibold text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 md:px-6 md:py-2 rounded-sm transition-all"
            >
              Explore <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const current = banners[selectedIndex];
  const ctaHref = current?.buttonLink || current?.ctaLink;
  const ctaLabel = current?.buttonText || current?.ctaText;

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .banner-slide {
          animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        @keyframes progressFill {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>

      <section className={cn("w-full select-none bg-white px-2 ", className)} aria-label="Featured collection">

        {/* ── Mobile Banner Carousel ── */}
        <div className="block md:hidden ">
          <div
            ref={slidesRef}
            className="relative w-full rounded-md overflow-hidden"
            style={{ height: 200 }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {banners.map((banner, index) => {
              const isActive = selectedIndex === index;
              const ctaH = banner.buttonLink || banner.ctaLink;
              const ctaL = banner.buttonText || banner.ctaText;

              return (
                <div
                  key={banner._id || index}
                  className="absolute inset-0"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transition: 'opacity 500ms cubic-bezier(0.4, 0, 0.2, 1)',
                    pointerEvents: isActive ? 'auto' : 'none',
                    zIndex: isActive ? 1 : 0,
                  }}
                  aria-hidden={!isActive}
                >
                  {/* Background Image */}
                  <OptimizedBannerImage 
                    banner={banner} 
                    isActive={isActive}
                    isMobile={true}
                    priority={index === 0}
                  />

                  {/* Text Content */}
                  <div className="relative h-full flex flex-col justify-center px-4 py-3 z-10">
                    {banner.offerTag && (
                      <span 
                        key={`offer-${index}`}
                        className="banner-slide inline-block text-[10px] font-semibold uppercase tracking-wider text-white bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-sm w-fit mb-1.5"
                      >
                        {banner.offerTag}
                      </span>
                    )}

                    {banner.title && (
                      <h2
                        key={`title-${index}`}
                        className="banner-slide text-xl font-bold text-white leading-tight mb-0.5"
                        style={{ animationDelay: '0.05s' }}
                      >
                        {banner.title}
                      </h2>
                    )}

                    {banner.subtitle && (
                      <p
                        key={`sub-${index}`}
                        className="banner-slide text-sm text-white/90 font-medium mb-2"
                        style={{ animationDelay: '0.1s' }}
                      >
                        {banner.subtitle}
                      </p>
                    )}

                    {ctaL && ctaH && (
                      <div 
                        key={`cta-${index}`} 
                        className="banner-slide" 
                        style={{ animationDelay: '0.15s' }}
                      >
                        <Link
                          href={ctaH}
                          className="inline-flex items-center gap-1 text-xs font-bold text-white bg-white/25 hover:bg-white/35 backdrop-blur-sm px-3 py-1.5 rounded-sm transition-all"
                        >
                          {ctaL} <ArrowUpRight size={11} />
                        </Link>
                      </div>
                    )}

                    {banner.bankOffer && (
                      <div 
                        key={`bank-${index}`}
                        className="banner-slide mt-2" 
                        style={{ animationDelay: '0.2s' }}
                      >
                        <span className="text-[10px] bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 rounded-sm">
                          {banner.bankOffer}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Slide Dots */}
          {banners.length > 1 && (
            <div className="flex justify-center items-center gap-1.5 py-2 bg-white border-b border-gray-100">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className="rounded-full transition-all duration-300 cursor-pointer"
                  style={{
                    width: selectedIndex === i ? 20 : 6,
                    height: 6,
                    background: selectedIndex === i ? '#da4c28' : '#d1d5db',
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Desktop Hero Section ── */}
        <div className="hidden md:block relative w-full h-[70vh] overflow-hidden bg-neutral-950">
          {banners.map((banner, index) => {
            const isActive = selectedIndex === index;
            const ctaH = banner.buttonLink || banner.ctaLink;
            const ctaL = banner.buttonText || banner.ctaText;

            return (
              <div
                key={`desktop-${banner._id || index}`}
                className="absolute inset-0"
                style={{
                  opacity: isActive ? 1 : 0,
                  transition: 'opacity 700ms cubic-bezier(0.4, 0, 0.2, 1)',
                  zIndex: isActive ? 1 : 0,
                  pointerEvents: isActive ? 'auto' : 'none',
                }}
                aria-hidden={!isActive}
              >
                {/* Background Image */}
                <OptimizedBannerImage 
                  banner={banner} 
                  isActive={isActive}
                  isMobile={false}
                  priority={index === 0}
                />

                {/* Text Content */}
                <div className="absolute inset-0 z-20 flex items-end p-10 lg:p-16">
                  <div className="max-w-xl">
                    {banner.offerTag && (
                      <p 
                        key={`desktop-offer-${index}`}
                        className="banner-slide text-[10px] tracking-[0.3em] uppercase text-white/70 font-mono mb-5"
                      >
                        {banner.offerTag}
                      </p>
                    )}
                    
                    {banner.title && (
                      <h1 
                        key={`desktop-title-${index}`}
                        className="banner-slide text-5xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-5"
                        style={{ animationDelay: '0.05s' }}
                      >
                        {banner.title}
                      </h1>
                    )}
                    
                    {banner.subtitle && (
                      <p 
                        key={`desktop-sub-${index}`}
                        className="banner-slide text-base text-white/80 mb-7 leading-relaxed max-w-sm font-light"
                        style={{ animationDelay: '0.1s' }}
                      >
                        {banner.subtitle}
                      </p>
                    )}
                    
                    {ctaL && ctaH && (
                      <div 
                        key={`desktop-cta-${index}`}
                        className="banner-slide" 
                        style={{ animationDelay: '0.15s' }}
                      >
                        <Link
                          href={ctaH}
                          className="group inline-flex items-center gap-2.5 text-sm font-medium text-white border-b border-white/25 pb-0.5 hover:border-white hover:gap-4 transition-all duration-300"
                        >
                          {ctaL}
                          <ArrowUpRight size={13} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bank Offer Badge - Desktop */}
                {banner.bankOffer && (
                  <div className="absolute bottom-8 left-10 z-20">
                    <span className="text-xs bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-sm">
                      {banner.bankOffer}
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          {/* Desktop Navigation Dots */}
          {banners.length > 1 && (
            <div className="absolute right-8 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className="group relative flex items-center justify-center transition-all duration-500 cursor-pointer"
                >
                  <div
                    className="rounded-full transition-all duration-500"
                    style={{
                      width: 2,
                      height: selectedIndex === i ? 32 : 12,
                      background: selectedIndex === i ? 'white' : 'rgba(255,255,255,0.3)',
                    }}
                  >
                    {selectedIndex === i && (
                      <div
                        className="absolute inset-0 rounded-full bg-white origin-top"
                        style={{
                          animation: `progressFill ${SLIDE_DURATION}ms linear forwards`,
                          transformOrigin: 'top',
                        }}
                      />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Auto-slide progress bar - Desktop */}
          {banners.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-30">
              <div
                key={selectedIndex}
                className="h-full bg-white"
                style={{
                  width: '100%',
                  animation: `progressFill ${SLIDE_DURATION}ms linear forwards`,
                  transformOrigin: 'left',
                }}
              />
            </div>
          )}
        </div>

      </section>
    </>
  );
};

export default Hero;