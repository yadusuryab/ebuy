'use client'

import React, { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '../ui/button'

export type Category = {
  name: string
  image?: string
  imageUrl?: string
  imageUrlWebp?: string
  lqip?: string
  slug: string
  productCount?: number
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function SkeletonCard({ tall }: { tall?: boolean }) {
  return (
    <div className={`relative w-full overflow-hidden bg-neutral-100 ${tall ? 'h-[480px]' : 'h-[280px]'}`}>
      <div
        className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_ease-in-out_infinite]"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.06), transparent)',
        }}
      />
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  )
}

// ── Optimized Category Image ──────────────────────────────────────────────────
const OptimizedCategoryImage: React.FC<{
  imageUrl?: string
  imageUrlWebp?: string
  lqip?: string
  name: string
  hovered: boolean
}> = ({ imageUrl, imageUrlWebp, lqip, name, hovered }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(false)

  if (!imageUrl || error) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white/20 text-sm font-medium">{name}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Blur placeholder for better perceived performance */}
      {lqip && !isLoaded && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
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
          alt={name}
          className={`w-full h-full object-cover transition-all duration-700 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.7s ease',
          }}
          onLoad={() => setIsLoaded(true)}
          onError={() => setError(true)}
          loading="lazy"
        />
      </picture>
    </div>
  )
}

// ── Category Row ──────────────────────────────────────────────────────────────
function CategoryRow({
  cat,
  index,
  visible,
  tall,
}: {
  cat: Category
  index: number
  visible: boolean
  tall?: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const imageUrl = cat.imageUrl || cat.image
  const imageUrlWebp = cat.imageUrlWebp
  const lqip = cat.lqip

  return (
    <Link
      href={`/products?category=${cat.slug}`}
      className="block group relative overflow-hidden"
      style={{ textDecoration: 'none' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative w-full overflow-hidden"
        style={{
          height: tall ? '260px' : '200px',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(28px)',
          transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 100}ms, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 100}ms`,
        }}
      >
        {/* Optimized Background Image */}
        <OptimizedCategoryImage
          imageUrl={imageUrl}
          imageUrlWebp={imageUrlWebp}
          lqip={lqip}
          name={cat.name}
          hovered={hovered}
        />

        {/* Dark gradient overlay */}
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            background: hovered
              ? 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.15) 100%)'
              : 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.30) 55%, rgba(0,0,0,0.05) 100%)',
          }}
        />

        {/* Index number - top left */}
        <div
          className="absolute top-5 left-5 font-black text-[10px] tracking-[0.3em] text-white/80 transition-all duration-300"
          style={{ 
            opacity: visible ? 1 : 0, 
            transitionDelay: `${index * 100 + 200}ms`,
            letterSpacing: '0.3em',
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </div>

        {/* Bottom text content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3
            className="text-white leading-none tracking-tighter m-0 transition-all duration-400 font-bold"
            style={{
              fontSize: tall ? 'clamp(28px, 5vw, 52px)' : 'clamp(24px, 4vw, 32px)',
              transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
              transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {cat.name}
          </h3>

          <div
            className="flex items-center justify-between mt-3 transition-all duration-300"
            style={{
              opacity: hovered ? 1 : 0.6,
              transform: hovered ? 'translateY(0)' : 'translateY(4px)',
            }}
          >
            <span className="text-[9px] font-black tracking-[0.35em] uppercase text-white/70">
              {cat.productCount != null ? `${cat.productCount} pieces` : 'Explore'}
            </span>

            <div
              className="w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300"
              style={{
                borderColor: hovered ? 'rgba(249,115,22,0.8)' : 'rgba(255,255,255,0.3)',
                background: hovered ? 'rgba(249,115,22,0.2)' : 'transparent',
              }}
            >
              <ArrowRight size={13} className="text-orange-400" strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

// ── CategorySection ───────────────────────────────────────────────────────────
function CategorySection() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const res = await fetch('/api/categories')
        if (!res.ok) throw new Error(`${res.status}`)
        const data = await res.json()
        if (!Array.isArray(data)) throw new Error('Invalid data')
        setCategories(data)
      } catch (err) {
        console.error('Failed to fetch categories:', err)
        setError(err instanceof Error ? err.message : 'Failed')
        // Fallback data with optimized local images
        setCategories([
          { name: 'Men', image: '/category-men.avif', slug: 'men', productCount: 84 },
          { name: 'Women', image: '/category-women.avif', slug: 'women', productCount: 112 },
          { name: 'Accessories', image: '/category-accessories.avif', slug: 'accessories', productCount: 56 },
          { name: 'Footwear', image: '/category-footwear.avif', slug: 'footwear', productCount: 39 },
        ])
      } finally {
        setIsLoading(false)
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { 
        if (entry.isIntersecting) { 
          setVisible(true)
          obs.disconnect()
        } 
      },
      { threshold: 0.1, rootMargin: '50px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const [hero, ...rest] = categories

  return (
    <section ref={sectionRef} className="bg-white py-12 md:py-16 relative">

      {/* Orange top accent */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-orange-500 to-orange-600" />

      {/* Header Section */}
      <div className="px-4 md:px-6 mb-6 md:mb-8 flex items-end justify-between flex-wrap gap-4">
        <div>
          {/* Eyebrow */}
          <div
            className="flex items-center gap-2 mb-2 md:mb-3 transition-all duration-500"
            style={{ 
              opacity: visible ? 1 : 0, 
              transform: visible ? 'translateY(0)' : 'translateY(8px)' 
            }}
          >
            <span className="text-xs md:text-sm tracking-tighter uppercase text-orange-600 font-semibold">
              Shop by
            </span>
            <div className="h-px w-6 md:w-8 bg-orange-500" />
          </div>

          {/* Headline */}
          <h2
            className="leading-none tracking-tighter m-0 transition-all duration-500 font-bold text-neutral-900"
            style={{
              fontSize: 'clamp(28px, 6vw, 48px)',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(12px)',
              transitionDelay: '70ms',
            }}
          >
            Categories
          </h2>
        </div>

        {/* View all button */}
        <Link href="/products">
          <Button 
            variant="outline" 
            className="group border-neutral-300 hover:border-orange-500 hover:bg-orange-50 transition-all duration-300"
          >
            View All
            <ArrowRight size={14} className="ml-1 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2} />
          </Button>
        </Link>
      </div>

      {/* Grid Layout */}
      {isLoading ? (
        <div className="px-4 md:px-6 flex flex-col gap-[3px]">
          <SkeletonCard tall />
          <div className="grid grid-cols-2 gap-[3px]">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-neutral-400 text-xs md:text-sm font-medium tracking-wide uppercase">
            No collections available
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-[3px] px-4 md:px-6">
          {/* Hero category (featured) */}
          {hero && (
            <CategoryRow 
              cat={hero} 
              index={0} 
              visible={visible} 
              tall 
            />
          )}
          
          {/* Remaining categories grid */}
          {rest.length > 0 && (
            <div
              className="grid gap-[3px]"
              style={{ gridTemplateColumns: rest.length === 1 ? '1fr' : '1fr 1fr' }}
            >
              {rest.map((cat, i) => (
                <CategoryRow 
                  key={cat.slug} 
                  cat={cat} 
                  index={i + 1} 
                  visible={visible} 
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bottom border */}
      <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />

      {/* Dev error message */}
      {error && process.env.NODE_ENV === 'development' && (
        <div className="mx-4 md:mx-6 mt-4 px-4 py-3 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-orange-600 text-xs font-medium tracking-wide m-0">
            ⚠️ Using fallback data: {error}
          </p>
        </div>
      )}
    </section>
  )
}

export default CategorySection