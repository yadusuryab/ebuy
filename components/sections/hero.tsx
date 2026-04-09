// components/Hero.tsx
'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { buttonVariants } from '../ui/button';

interface Banner {
  _id: string;
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  ctaText?: string;
  ctaLink?: string;
  mediaType: 'image' | 'video';
  video?: {
    url: string;
    mimeType: string;
  };
  videoPoster?: string;
  textPosition: 'left' | 'center' | 'right';
  textColor: 'light' | 'dark';
  buttonText?: string;
  buttonLink?: string;
  order: number;
  isActive: boolean;
}

const Hero = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const fetchBanners = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/banner');
        if (!response.ok) {
          throw new Error('Failed to fetch banners');
        }
        const data = await response.json();
        // The API already sorts and filters active banners
        setBanners(data);
      } catch (error) {
        console.error('Error loading banners:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  // Handle video loading and playback
  useEffect(() => {
    const currentBannerData = banners[currentBanner];
    if (currentBannerData?.mediaType === 'video' && videoRef.current) {
      const video = videoRef.current;
      setIsVideoLoaded(false);
      video.load();
      video.play().catch(error => {
        console.log('Video autoplay failed:', error);
      });
    }
  }, [currentBanner, banners]);

  // Helper function to get text position classes
  const getTextPositionClass = (position: string = 'center') => {
    switch (position) {
      case 'left':
        return 'items-start text-left';
      case 'right':
        return 'items-end text-right';
      default:
        return 'items-center text-center';
    }
  };

  // Helper function to get text color classes
  const getTextColorClass = (color: string = 'dark') => {
    return color === 'light' ? 'text-white' : 'text-gray-900';
  };

  if (loading) {
    return (
      <div className="w-full bg-white py-4">
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="relative h-[280px] md:h-[320px] overflow-hidden rounded-xl bg-gray-200 animate-pulse">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="w-full bg-white py-4 ">
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="relative h-[280px] md:h-[320px] overflow-hidden rounded-xl bg-gray-100 flex items-center justify-center">
            <p className="text-gray-500">No active banners available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white py-4 px-4">
      <div className="relative max-w-7xl mx-auto ">
        {/* Banner Card */}
        <div className="relative h-[280px] md:h-[320px] overflow-hidden rounded-xl shadow-sm group">
          {banners.map((banner, index) => (
            <div
              key={banner._id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === currentBanner ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              {/* Media (Image/Video) */}
              {banner.mediaType === 'video' && banner.video?.url ? (
                <>
                  {banner.videoPoster && (
                    <img
                      src={banner.videoPoster}
                      alt={banner.title || 'Video poster'}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                        isVideoLoaded ? 'opacity-0' : 'opacity-100'
                      }`}
                    />
                  )}
                  <video
                    ref={index === currentBanner ? videoRef : null}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                    autoPlay
                    poster={banner.videoPoster}
                    onLoadedData={() => setIsVideoLoaded(true)}
                  >
                    <source src={banner.video.url} type={banner.video.mimeType || 'video/mp4'} />
                    Your browser does not support the video tag.
                  </video>
                </>
              ) : (
                banner.imageUrl && (
                  <img
                    src={banner.imageUrl}
                    alt={banner.title || 'Banner'}
                    className="w-full h-full object-cover"
                  />
                )
              )}

              {/* Overlay for better text readability */}
              <div className="absolute inset-0 bg-black/20"></div>

              {/* Text Content - Use buttonText and buttonLink from schema */}
              {(banner.title || banner.subtitle || banner.buttonText) && (
                <div className={`absolute inset-0 flex ${getTextPositionClass(banner.textPosition)} px-6 md:px-12 lg:px-16`}>
                  <div className={`max-w-2xl space-y-3 md:space-y-4 ${getTextColorClass(banner.textColor)}`}>
                    {banner.title && (
                      <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight drop-shadow-lg">
                        {banner.title}
                      </h1>
                    )}
                    {banner.subtitle && (
                      <p className="text-sm md:text-lg lg:text-xl opacity-90 drop-shadow-md">
                        {banner.subtitle}
                      </p>
                    )}
                    {banner.buttonText && banner.buttonLink && (
                      <Link
                        href={banner.buttonLink}
                        className={`${buttonVariants({ 
                          variant: banner.textColor === 'light' ? 'default' : 'secondary',
                          size: 'lg' 
                        })} inline-flex mt-2 md:mt-4 shadow-lg hover:scale-105 transition-transform duration-300`}
                      >
                        {banner.buttonText}
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Navigation Arrows */}
          {banners.length > 1 && (
            <>
              <button
                onClick={() =>
                  setCurrentBanner(
                    (prev) => (prev - 1 + banners.length) % banners.length
                  )
                }
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-xl md:text-2xl transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100 z-20"
                aria-label="Previous banner"
              >
                ‹
              </button>
              <button
                onClick={() =>
                  setCurrentBanner((prev) => (prev + 1) % banners.length)
                }
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-xl md:text-2xl transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100 z-20"
                aria-label="Next banner"
              >
                ›
              </button>
            </>
          )}
        </div>

        {/* Dots Navigation */}
        {banners.length > 1 && (
          <div className="flex justify-center mt-4 gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentBanner
                    ? 'w-8 bg-orange-500'
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to banner ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;