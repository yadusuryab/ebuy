"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

type PromoBannerProps = {
  heading?: string;
  subheading?: string;
  ctaText?: string;
  ctaHref?: string;
  imageUrl?: string;
  tag?: string;
};

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

export default function PromoBanner({
  heading = "The New Season\nIs Here.",
  subheading = "Discover the latest drops — curated pieces built for the modern wardrobe.",
  ctaText = "Shop the Collection",
  ctaHref = "/products",
  imageUrl = "/hero.avif",
  tag = "SS '25",
}: PromoBannerProps) {
  const { ref, visible } = useReveal();
  const [hovered, setHovered] = useState(false);

  const lines = heading.split("\n");

  return (
    <>
      <style>{`
        @keyframes lineReveal {
          from { clip-path: inset(0 100% 0 0); opacity: 0; }
          to   { clip-path: inset(0 0% 0 0);   opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes expandW {
          from { width: 0; }
          to   { width: 100%; }
        }
        @keyframes scaleYAnim {
          from { transform: scaleY(0); }
          to   { transform: scaleY(1); }
        }
      `}</style>

      <section ref={ref} className="px-4 py-4 bg-white">
        <div className="relative grid grid-cols-1 md:grid-cols-2 bg-neutral-950 overflow-hidden min-h-[520px] md:min-h-[560px]">

          {/* Orange top stripe */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-orange-600 via-red-500 to-orange-600 z-10" />

          {/* ── Left: Text column ──────────────────────────────────────── */}
          <div className="flex flex-col justify-between p-7 md:p-14 relative z-20 border-r border-neutral-800">

            {/* Top: tag row */}
            <div
              className="flex items-center gap-3 transition-opacity duration-500"
              style={{ opacity: visible ? 1 : 0, transitionDelay: '100ms' }}
            >
              <Zap className="w-3 h-3 text-orange-500 shrink-0" strokeWidth={2.5} />
              <span className="text-[9px] font-black tracking-[0.4em] uppercase text-orange-500">
                {tag}
              </span>
              <div
                className="h-px bg-orange-500/25 flex-1"
                style={{
                  animation: visible ? 'expandW 0.8s ease 0.3s forwards' : 'none',
                  width: 0,
                }}
              />
            </div>

            {/* Heading */}
            <div className="my-auto py-8">
              {lines.map((line, i) => (
                <div key={i} className="overflow-hidden leading-none">
                  <h2
                    className="font-['Bebas_Neue',sans-serif] text-white m-0 leading-none tracking-widest"
                    style={{
                      fontSize: 'clamp(40px, 6vw, 72px)',
                      animation: visible
                        ? `lineReveal 0.75s cubic-bezier(0.16,1,0.3,1) ${0.2 + i * 0.15}s forwards`
                        : 'none',
                      opacity: 0,
                    }}
                  >
                    {i % 2 === 1
                      ? <span className="text-orange-500">{line}</span>
                      : line}
                  </h2>
                </div>
              ))}

              {/* Orange underline */}
              <div
                className="h-[3px] bg-gradient-to-r from-orange-500 to-transparent mt-5 rounded-sm"
                style={{
                  animation: visible ? 'expandW 1s ease 0.6s forwards' : 'none',
                  width: 0,
                }}
              />
            </div>

            {/* Bottom: subheading + CTAs */}
            <div className="flex flex-col gap-6">
              <p
                className="text-[11px] font-semibold leading-relaxed tracking-wider text-neutral-500 m-0 max-w-xs uppercase"
                style={{
                  animation: visible ? 'fadeUp 0.6s ease 0.55s forwards' : 'none',
                  opacity: 0,
                }}
              >
                {subheading}
              </p>

              <div
                className="flex items-center gap-4"
                style={{
                  animation: visible ? 'fadeUp 0.6s ease 0.65s forwards' : 'none',
                  opacity: 0,
                }}
              >
                {/* Primary CTA */}
                <Link
                  href={ctaHref}
                  className="group inline-flex items-center gap-2.5 px-6 h-11 bg-orange-500 hover:bg-orange-400 text-white text-[9px] font-black tracking-[0.3em] uppercase rounded-sm transition-all duration-200 no-underline"
                >
                  {ctaText}
                  <ArrowRight
                    size={13}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                    strokeWidth={2.5}
                  />
                </Link>

                {/* Secondary link */}
                <Link
                  href="/products"
                  className="inline-flex items-center gap-1.5 text-[9px] font-black tracking-[0.25em] uppercase text-neutral-600 hover:text-white border-b border-neutral-700 hover:border-neutral-400 pb-px transition-all duration-200 no-underline"
                >
                  Browse all
                </Link>
              </div>
            </div>
          </div>

          {/* ── Right: Image column ────────────────────────────────────── */}
          <div
            className="hidden md:block relative overflow-hidden"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {/* Wipe-in curtain */}
            <div
              className="absolute inset-0 bg-neutral-950 z-[3] origin-left transition-transform duration-[900ms]"
              style={{
                transitionTimingFunction: 'cubic-bezier(0.76,0,0.24,1)',
                transitionDelay: '0.3s',
                transform: visible ? 'scaleX(0)' : 'scaleX(1)',
              }}
            />

            <Image
              src={imageUrl}
              alt="Promo banner"
              fill
              className="object-cover transition-transform duration-[900ms]"
              style={{
                transform: hovered ? 'scale(1.06)' : 'scale(1.02)',
                transitionTimingFunction: 'cubic-bezier(0.25,0.46,0.45,0.94)',
              }}
              priority
            />

            {/* Left fade blend */}
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/50 to-transparent z-[1]" />

            {/* Orange left accent on hover */}
            <div
              className="absolute left-0 top-0 bottom-0 w-[3px] bg-orange-500 z-[2] transition-opacity duration-300"
              style={{ opacity: hovered ? 1 : 0 }}
            />

            {/* Bottom-right vertical label */}
            <div
              className="absolute bottom-7 right-5 z-[2] flex flex-col items-end gap-1.5 transition-opacity duration-500"
              style={{ opacity: visible ? 1 : 0, transitionDelay: '1s' }}
            >
              <div
                className="w-px bg-orange-500/50 origin-top"
                style={{
                  height: '36px',
                  animation: visible ? 'scaleYAnim 0.6s ease 1.1s forwards' : 'none',
                  transform: 'scaleY(0)',
                }}
              />
              <span
                className="text-[8px] font-black tracking-[0.3em] uppercase text-orange-500/70"
                style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}
              >
                Collection {tag}
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}