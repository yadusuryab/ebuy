'use client';

import { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { Play, Pause, Volume2, VolumeX, ArrowRight, ChevronLeft, ChevronRight, Zap } from "lucide-react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type BannerItem = {
  _id: string;
  _type: 'image' | 'video';
  title?: string;
  subtitle?: string;
  mediaType?: 'image' | 'video';
  imageUrl?: string;
  image?: { asset?: { url: string } };
  video?: { url: string; mimeType?: string };
  videoPoster?: string;
  buttonText?: string;
  buttonLink?: string;
  ctaText?: string;
  ctaLink?: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const SLIDE_DURATION = 6000;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const convertBannerToMediaItem = (banner: BannerItem, index: number) => {
  const isVideo = banner.mediaType === 'video';
  return {
    _key: banner._id || `banner-${index}`,
    _type: isVideo ? 'video' : 'image',
    asset: isVideo ? undefined : { url: banner.imageUrl || banner.image?.asset?.url || '' },
    videoFile: isVideo
      ? { asset: { url: banner.video?.url || '', mimeType: banner.video?.mimeType } }
      : undefined,
    poster: isVideo ? { asset: { url: banner.videoPoster || '' } } : undefined,
    alt: banner.title || 'Banner',
  };
};

const getActiveBanners = async (): Promise<BannerItem[]> => {
  try {
    const res = await fetch('/api/banner');
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
};

// ─── Animated Number ──────────────────────────────────────────────────────────

const AnimatedNumber: React.FC<{ value: number }> = ({ value }) => {
  const [displayed, setDisplayed] = useState(value);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    setExiting(true);
    const t = setTimeout(() => {
      setDisplayed(value);
      setExiting(false);
    }, 180);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <span
      className="inline-block transition-all duration-200"
      style={{
        opacity: exiting ? 0 : 1,
        transform: exiting ? 'translateY(-6px)' : 'translateY(0)',
      }}
    >
      {String(displayed + 1).padStart(2, '0')}
    </span>
  );
};

// ─── Slide Media ──────────────────────────────────────────────────────────────

const SlideMedia: React.FC<{
  media: ReturnType<typeof convertBannerToMediaItem>;
  isActive: boolean;
  priority?: boolean;
}> = ({ media, isActive, priority }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    if (media._type !== 'video' || !videoRef.current) return;
    if (isActive && playing) {
      videoRef.current.play().catch(() => setPlaying(false));
    } else {
      videoRef.current.pause();
      if (!isActive) setPlaying(false);
    }
  }, [playing, isActive, media._type]);

  if (media._type === 'image') {
    return (
      <div className="absolute inset-0">
        {media.asset?.url && (
          <img
            src={media.asset.url}
            alt={media.alt || ''}
            className="w-full h-full object-cover"
            style={{
              transform: isActive ? 'scale(1.06)' : 'scale(1)',
              transition: isActive
                ? `transform ${SLIDE_DURATION + 1200}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`
                : 'transform 900ms ease',
            }}
            loading={priority ? 'eager' : 'lazy'}
          />
        )}
      </div>
    );
  }

  const videoUrl = media.videoFile?.asset?.url;

  return (
    <div className="absolute inset-0 bg-neutral-950">
      {videoUrl && (
        <>
          <video
            ref={videoRef}
            src={videoUrl}
            poster={media.poster?.asset?.url}
            className="w-full h-full object-cover"
            muted={muted}
            playsInline
            onEnded={() => setPlaying(false)}
          />
          {!playing && (
            <button
              onClick={() => setPlaying(true)}
              aria-label="Play video"
              className="absolute inset-0 z-10 flex items-center justify-center group"
            >
              <span className="w-16 h-16 rounded-sm border border-orange-500/50 bg-black/30 backdrop-blur-md flex items-center justify-center group-hover:bg-orange-500/20 group-hover:border-orange-400 group-hover:scale-105 transition-all duration-300">
                <Play className="w-5 h-5 text-orange-400 ml-0.5" strokeWidth={2} />
              </span>
            </button>
          )}
          {playing && (
            <div className="absolute bottom-6 right-8 z-20 flex gap-2">
              <button
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.muted = !muted;
                    setMuted((m) => !m);
                  }
                }}
                aria-label={muted ? 'Unmute' : 'Mute'}
                className="w-8 h-8 rounded-sm bg-black/40 backdrop-blur-sm border border-neutral-700 flex items-center justify-center text-orange-400 hover:border-orange-500/60 transition-all duration-200"
              >
                {muted ? <VolumeX size={12} strokeWidth={2} /> : <Volume2 size={12} strokeWidth={2} />}
              </button>
              <button
                onClick={() => setPlaying(false)}
                aria-label="Pause"
                className="w-8 h-8 rounded-sm bg-black/40 backdrop-blur-sm border border-neutral-700 flex items-center justify-center text-orange-400 hover:border-orange-500/60 transition-all duration-200"
              >
                <Pause size={12} strokeWidth={2} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ─── Hero ─────────────────────────────────────────────────────────────────────

const Hero: React.FC<{ className?: string }> = ({ className }) => {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [textVisible, setTextVisible] = useState(true);
  const [progressKey, setProgressKey] = useState(0);
  const autoSlideRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getActiveBanners();
        setBanners(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const startAutoSlide = useCallback((count: number) => {
    if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    if (count <= 1) return;
    autoSlideRef.current = setInterval(() => {
      setSelectedIndex((p) => (p + 1) % count);
      setProgressKey((k) => k + 1);
    }, SLIDE_DURATION);
  }, []);

  useEffect(() => {
    startAutoSlide(banners.length);
    return () => { if (autoSlideRef.current) clearInterval(autoSlideRef.current); };
  }, [banners.length, startAutoSlide]);

  const goTo = useCallback(
    (index: number) => {
      setTextVisible(false);
      setTimeout(() => {
        setSelectedIndex(index);
        setProgressKey((k) => k + 1);
        setTextVisible(true);
      }, 260);
      startAutoSlide(banners.length);
    },
    [banners.length, startAutoSlide]
  );

  const goPrev = () => goTo(selectedIndex === 0 ? banners.length - 1 : selectedIndex - 1);
  const goNext = () => goTo(selectedIndex === banners.length - 1 ? 0 : selectedIndex + 1);

  // ── Skeleton ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <section className={cn('w-full', className)}>
        <div className="relative w-full h-[75vh] md:h-[90vh] bg-neutral-950 overflow-hidden">
          {/* orange top bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-600 via-red-500 to-orange-600" />
          <div
            className="absolute inset-0 -translate-x-full"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(251,146,60,0.05), transparent)',
              animation: 'shimmer 2s ease-in-out infinite',
            }}
          />
          <div className="absolute bottom-10 left-10 md:left-16 space-y-3">
            <div className="h-3 w-20 rounded-sm bg-white/5" />
            <div className="h-10 w-64 rounded-sm bg-white/5" />
            <div className="h-10 w-48 rounded-sm bg-white/5" />
            <div className="h-8 w-32 rounded-sm bg-orange-500/10 mt-4" />
          </div>
        </div>
        <style>{`@keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(250%)}}`}</style>
      </section>
    );
  }

  // ── Fallback ──────────────────────────────────────────────────────────────────
  if (!banners.length) {
    return (
      <section className={cn('w-full', className)}>
        <div className="relative w-full h-[75vh] md:h-[90vh] bg-neutral-950 overflow-hidden flex items-end">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-600 via-red-500 to-orange-600" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none" />
          <div className="relative z-10 p-8 md:p-16 max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-3 h-3 text-orange-500" strokeWidth={2.5} />
              <span className="text-[9px] tracking-[0.4em] uppercase text-orange-500 font-black">
                New Collection
              </span>
            </div>
            <h1 className="font-['Bebas_Neue',sans-serif] text-6xl md:text-8xl text-white leading-none tracking-widest mb-7">
              Welcome to<br />
              <span className="text-orange-500">Our Store</span>
            </h1>
            <Link
              href="/products"
              className="group inline-flex items-center gap-2.5 px-6 h-11 bg-orange-500 hover:bg-orange-400 text-white text-[10px] font-black tracking-[0.3em] uppercase rounded-sm transition-all duration-200 no-underline"
            >
              Explore Collection
              <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.5} />
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
        @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(250%)} }
        @keyframes progressFill { from{transform:scaleY(0)} to{transform:scaleY(1)} }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes expandWidth {
          from { width: 0; }
          to   { width: 40px; }
        }
      `}</style>

      <section className={cn('w-full select-none', className)} aria-label="Featured collection">
        <div className="relative w-full h-[75vh] md:h-[90vh] overflow-hidden bg-neutral-950">

          {/* Orange accent stripe — top */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-orange-600 via-red-500 to-orange-600 z-30" />

          {/* Cross-fade slides */}
          {banners.map((banner, index) => {
            const media = convertBannerToMediaItem(banner, index);
            const isActive = selectedIndex === index;
            return (
              <div
                key={banner._id || index}
                className="absolute inset-0"
                style={{
                  opacity: isActive ? 1 : 0,
                  transition: 'opacity 900ms cubic-bezier(0.4, 0, 0.2, 1)',
                  zIndex: isActive ? 1 : 0,
                }}
                aria-hidden={!isActive}
              >
                <SlideMedia media={media} isActive={isActive} priority={index === 0} />
              </div>
            );
          })}

          {/* Gradient overlays */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.10) 55%, rgba(0,0,0,0.20) 100%)' }}
          />
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.50) 0%, transparent 65%)' }}
          />

          {/* ── Slide counter — top right ────────────────────────────────── */}
          <div className="absolute top-8 right-8 md:right-12 z-30 flex items-baseline gap-1.5 font-black text-[11px] tracking-[0.2em] text-neutral-600">
            <AnimatedNumber value={selectedIndex} />
            <span className="text-neutral-700 mx-0.5">/</span>
            <span>{String(banners.length).padStart(2, '0')}</span>
          </div>

          {/* ── Vertical progress rail — right ──────────────────────────── */}
          {banners.length > 1 && (
            <div className="absolute right-8 md:right-12 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3 items-center">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className="relative flex items-start justify-center overflow-hidden rounded-full"
                  style={{
                    width: 2,
                    height: selectedIndex === i ? 40 : 12,
                    background: selectedIndex === i ? 'rgba(249,115,22,0.3)' : 'rgba(255,255,255,0.15)',
                    transition: 'height 0.4s cubic-bezier(0.16,1,0.3,1), background 0.3s',
                  }}
                >
                  {selectedIndex === i && (
                    <div
                      key={progressKey}
                      className="absolute top-0 left-0 right-0 rounded-full bg-orange-500"
                      style={{
                        animation: `progressFill ${SLIDE_DURATION}ms linear forwards`,
                        transformOrigin: 'top',
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* ── Desktop text block ───────────────────────────────────────── */}
          <div className="hidden md:flex absolute inset-0 z-20 items-end p-10 lg:p-16 pb-14 lg:pb-16">
            <div className="max-w-2xl">

              {/* Eyebrow */}
              <div
                key={`eyebrow-${selectedIndex}`}
                className="flex items-center gap-3 mb-5"
                style={{
                  animation: textVisible ? 'slideInLeft 0.5s cubic-bezier(0.16,1,0.3,1) 0.05s both' : 'none',
                  opacity: textVisible ? undefined : 0,
                }}
              >
                <Zap className="w-3 h-3 text-orange-500" strokeWidth={2.5} />
                <span className="text-[9px] tracking-[0.4em] uppercase text-orange-500 font-black">
                  {current?.mediaType === 'video' ? 'Watch Now' : 'New Drop'}
                </span>
                <div className="h-px bg-orange-500/30 w-10" />
              </div>

              {/* Title */}
              {current?.title && (
                <h1
                  key={`title-${selectedIndex}`}
                  className="font-['Bebas_Neue',sans-serif] text-6xl lg:text-8xl text-white leading-none tracking-widest mb-4"
                  style={{
                    animation: textVisible ? 'fadeSlideUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.12s both' : 'none',
                    opacity: textVisible ? undefined : 0,
                  }}
                >
                  {current.title}
                </h1>
              )}

              {/* Subtitle */}
              {current?.subtitle && (
                <p
                  key={`sub-${selectedIndex}`}
                  className="text-[13px] font-semibold leading-relaxed tracking-wider text-neutral-400 mb-8 max-w-sm uppercase"
                  style={{
                    animation: textVisible ? 'fadeSlideUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.20s both' : 'none',
                    opacity: textVisible ? undefined : 0,
                  }}
                >
                  {current.subtitle}
                </p>
              )}

              {/* CTA buttons */}
              {ctaLabel && ctaHref && (
                <div
                  key={`cta-${selectedIndex}`}
                  className="flex items-center gap-3"
                  style={{
                    animation: textVisible ? 'fadeSlideUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.28s both' : 'none',
                    opacity: textVisible ? undefined : 0,
                  }}
                >
                  <Link
                    href={ctaHref}
                    className="group inline-flex items-center gap-2.5 px-7 h-11 bg-orange-500 hover:bg-orange-400 text-white text-[10px] font-black tracking-[0.3em] uppercase rounded-sm transition-all duration-200 no-underline"
                  >
                    {ctaLabel}
                    <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.5} />
                  </Link>
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 px-5 h-11 border border-neutral-700 hover:border-neutral-500 text-neutral-400 hover:text-white text-[10px] font-black tracking-[0.3em] uppercase rounded-sm transition-all duration-200 no-underline"
                  >
                    All Products
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* ── Arrow nav — desktop only ─────────────────────────────────── */}
          {banners.length > 1 && (
            <div className="hidden md:flex absolute bottom-12 right-16 z-30 items-center gap-2">
              <button
                onClick={goPrev}
                aria-label="Previous slide"
                className="w-10 h-10 flex items-center justify-center border border-neutral-700 hover:border-orange-500/60 rounded-sm text-neutral-500 hover:text-orange-400 transition-all duration-200"
              >
                <ChevronLeft className="w-4 h-4" strokeWidth={2} />
              </button>
              <button
                onClick={goNext}
                aria-label="Next slide"
                className="w-10 h-10 flex items-center justify-center border border-neutral-700 hover:border-orange-500/60 rounded-sm text-neutral-500 hover:text-orange-400 transition-all duration-200"
              >
                <ChevronRight className="w-4 h-4" strokeWidth={2} />
              </button>
            </div>
          )}

          {/* ── Mobile swipe dots ──────────────────────────────────────────── */}
          {banners.length > 1 && (
            <div className="md:hidden absolute bottom-5 left-1/2 -translate-x-1/2 z-30">
              <div className="flex gap-2 items-center bg-black/30 backdrop-blur-md px-3 py-2 rounded-sm border border-neutral-800">
                {banners.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Slide ${i + 1}`}
                    className="rounded-sm transition-all duration-300"
                    style={{
                      width: selectedIndex === i ? 20 : 5,
                      height: 4,
                      background: selectedIndex === i ? '#f97316' : 'rgba(255,255,255,0.2)',
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Mobile text panel ─────────────────────────────────────────────── */}
        <div className="md:hidden bg-neutral-950 px-5 pt-5 pb-8 border-t-2 border-orange-500/60">

          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-3 h-3 text-orange-500" strokeWidth={2.5} />
            <span className="text-[8px] tracking-[0.4em] uppercase text-orange-500 font-black">
              {current?.mediaType === 'video' ? 'Watch Now' : 'New Drop'}
            </span>
          </div>

          {current?.title && (
            <h2
              key={`m-title-${selectedIndex}`}
              className="font-['Bebas_Neue',sans-serif] text-5xl text-white leading-none tracking-widest"
              style={{ animation: 'fadeSlideUp 0.5s cubic-bezier(0.16,1,0.3,1) both' }}
            >
              {current.title}
            </h2>
          )}

          {current?.subtitle && (
            <p
              key={`m-sub-${selectedIndex}`}
              className="text-[11px] text-neutral-500 mt-2.5 leading-relaxed font-semibold tracking-wider uppercase"
              style={{ animation: 'fadeSlideUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.08s both' }}
            >
              {current.subtitle}
            </p>
          )}

          {ctaLabel && ctaHref && (
            <div
              key={`m-cta-${selectedIndex}`}
              className="flex gap-2 mt-5"
              style={{ animation: 'fadeSlideUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.15s both' }}
            >
              <Link
                href={ctaHref}
                className="group inline-flex items-center gap-2 px-5 h-10 bg-orange-500 hover:bg-orange-400 text-white text-[9px] font-black tracking-[0.3em] uppercase rounded-sm transition-all duration-200 no-underline"
              >
                {ctaLabel}
                <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2.5} />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center px-4 h-10 border border-neutral-800 text-neutral-500 text-[9px] font-black tracking-[0.3em] uppercase rounded-sm transition-all duration-200 no-underline hover:border-neutral-600 hover:text-white"
              >
                All
              </Link>
            </div>
          )}

          {/* Mobile nav controls */}
          {banners.length > 1 && (
            <div className="flex items-center justify-between mt-6 pt-5 border-t border-neutral-800">
              <div className="flex items-baseline gap-1.5 font-black text-[11px] tracking-[0.2em] text-neutral-600">
                <AnimatedNumber value={selectedIndex} />
                <span className="text-neutral-700 mx-0.5">/</span>
                <span>{String(banners.length).padStart(2, '0')}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={goPrev}
                  aria-label="Previous"
                  className="w-9 h-9 flex items-center justify-center rounded-sm border border-neutral-800 text-neutral-600 hover:text-orange-400 hover:border-orange-500/40 transition-all duration-200 active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4" strokeWidth={2} />
                </button>
                <button
                  onClick={goNext}
                  aria-label="Next"
                  className="w-9 h-9 flex items-center justify-center rounded-sm border border-neutral-800 text-neutral-600 hover:text-orange-400 hover:border-orange-500/40 transition-all duration-200 active:scale-95"
                >
                  <ChevronRight className="w-4 h-4" strokeWidth={2} />
                </button>
              </div>
            </div>
          )}
        </div>

      </section>
    </>
  );
};

export default Hero;