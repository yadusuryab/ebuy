"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

type AboutTeaserProps = {
  imageUrl?: string;
  tag?: string;
  heading?: string;
  body?: string;
  ctaText?: string;
  ctaHref?: string;
  stat1?: { value: string; label: string };
  stat2?: { value: string; label: string };
  stat3?: { value: string; label: string };
};

export default function AboutTeaser({
  imageUrl = "/hero.avif",
  tag = "Our Story",
  heading = "Designed for the\nModern Wardrobe.",
  body = "We believe fashion should feel effortless. Every piece in our collection is thoughtfully sourced — quality fabrics, considered cuts, and a commitment to lasting style over passing trends.",
  ctaText = "Learn More",
  ctaHref = "/about",
  stat1 = { value: "500+", label: "Curated styles" },
  stat2 = { value: "30k+", label: "Happy customers" },
  stat3 = { value: "4.9★", label: "Avg. rating" },
}: AboutTeaserProps) {
  const { ref, visible } = useReveal();
  const lines = heading.split("\n");
  const stats = [stat1, stat2, stat3];

  return (
    <>
      <style>{`
        @keyframes aboutFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes aboutExpandH {
          from { width: 0; }
          to   { width: 100%; }
        }
        @keyframes aboutExpandV {
          from { transform: scaleY(0); }
          to   { transform: scaleY(1); }
        }
        @keyframes lineReveal {
          from { clip-path: inset(0 100% 0 0); opacity: 0; }
          to   { clip-path: inset(0 0% 0 0);   opacity: 1; }
        }
      `}</style>

      <section ref={ref} className="p-4 bg-white">
        <div className="relative w-full min-h-[600px] overflow-hidden bg-neutral-950">

          {/* Orange top stripe */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-orange-600 via-red-500 to-orange-600 z-10" />

          {/* Background image */}
          <div
            className="absolute inset-0"
            style={{
              transform: visible ? "scale(1.03)" : "scale(1.1)",
              transition: `transform ${visible ? "9s" : "0s"} cubic-bezier(0.25,0.46,0.45,0.94)`,
            }}
          >
            <Image
              src={imageUrl}
              alt="About our brand"
              fill
              className="object-cover object-center"
              style={{ filter: "grayscale(20%) brightness(0.65) contrast(1.08)" }}
            />
          </div>

          {/* Gradient overlays */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to right, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.60) 55%, rgba(10,10,10,0.15) 100%)" }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(10,10,10,0.65) 0%, transparent 50%)" }}
          />

          {/* Diagonal texture */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "repeating-linear-gradient(135deg, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 1px, transparent 1px, transparent 10px)",
            }}
          />

          {/* Orange vertical rule — left gutter */}
          <div
            className="absolute left-8 origin-top"
            style={{
              top: "10%",
              bottom: "10%",
              width: "2px",
              background: "linear-gradient(to bottom, transparent, rgba(249,115,22,0.6) 30%, rgba(249,115,22,0.6) 70%, transparent)",
              animation: visible ? "aboutExpandV 0.8s ease 0.3s forwards" : "none",
              transform: "scaleY(0)",
            }}
          />

          {/* ── Main content ───────────────────────────────────────────── */}
          <div className="relative z-20 flex flex-col justify-between min-h-[600px] pl-14 pr-7 py-12 max-w-[600px]">

            {/* Tag row */}
            <div
              className="flex items-center gap-3 transition-opacity duration-500"
              style={{ opacity: visible ? 1 : 0, transitionDelay: "150ms" }}
            >
              <Zap className="w-3 h-3 text-orange-500 shrink-0" strokeWidth={2.5} />
              <span className="text-[9px] font-black tracking-[0.4em] uppercase text-orange-500">
                {tag}
              </span>
              <div
                className="h-px bg-orange-500/30 min-w-[40px] max-w-[80px]"
                style={{
                  animation: visible ? "aboutExpandH 0.8s ease 0.35s forwards" : "none",
                  width: 0,
                }}
              />
            </div>

            {/* Heading + body */}
            <div className="py-10">
              <div className="mb-6">
                {lines.map((line, i) => (
                  <div key={i} className="overflow-hidden leading-none">
                    <h2
                      className="font-['Bebas_Neue',sans-serif] text-white m-0 leading-none tracking-widest"
                      style={{
                        fontSize: "clamp(40px, 6.5vw, 72px)",
                        color: i % 2 === 1 ? "#f97316" : "#ffffff",
                        animation: visible
                          ? `lineReveal 0.75s cubic-bezier(0.16,1,0.3,1) ${0.25 + i * 0.12}s forwards`
                          : "none",
                        opacity: 0,
                      }}
                    >
                      {line}
                    </h2>
                  </div>
                ))}
              </div>

              {/* Orange underline */}
              <div
                className="h-[3px] bg-gradient-to-r from-orange-500 to-transparent rounded-sm mb-6"
                style={{
                  animation: visible ? "aboutExpandH 1s ease 0.55s forwards" : "none",
                  width: 0,
                }}
              />

              <p
                className="text-[10.5px] font-semibold leading-relaxed tracking-wider uppercase text-neutral-500 max-w-sm m-0"
                style={{
                  animation: visible ? "aboutFadeUp 0.65s ease 0.5s forwards" : "none",
                  opacity: 0,
                }}
              >
                {body}
              </p>
            </div>

            {/* Stats + CTA */}
            <div className="flex flex-col gap-7">

              {/* Stats strip */}
              <div
                className="grid grid-cols-3 border-t border-b border-neutral-800 py-5"
                style={{
                  animation: visible ? "aboutFadeUp 0.6s ease 0.6s forwards" : "none",
                  opacity: 0,
                }}
              >
                {stats.map((stat, i) => (
                  <div
                    key={i}
                    className={`flex flex-col gap-1.5 group ${i > 0 ? "pl-5 border-l border-neutral-800" : ""}`}
                  >
                    <span className="font-['Bebas_Neue',sans-serif] text-white leading-none tracking-widest group-hover:text-orange-500 transition-colors duration-300"
                      style={{ fontSize: "clamp(26px, 4vw, 36px)" }}
                    >
                      {stat.value}
                    </span>
                    <span className="text-[8px] font-black tracking-[0.25em] uppercase text-neutral-600">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Link
                href={ctaHref}
                className="group inline-flex items-center gap-3 no-underline w-fit"
                style={{
                  animation: visible ? "aboutFadeUp 0.6s ease 0.72s forwards" : "none",
                  opacity: 0,
                }}
              >
                <div className="w-9 h-9 rounded-sm flex items-center justify-center border border-orange-500/40 bg-orange-500/8 group-hover:bg-orange-500/20 group-hover:border-orange-500/70 transition-all duration-300">
                  <ArrowRight size={14} className="text-orange-400 group-hover:translate-x-0.5 transition-transform duration-200" strokeWidth={2.5} />
                </div>
                <span className="text-[9px] font-black tracking-[0.3em] uppercase text-neutral-500 group-hover:text-white border-b border-neutral-700 group-hover:border-neutral-400 pb-px transition-all duration-200">
                  {ctaText}
                </span>
              </Link>
            </div>
          </div>

          {/* Bottom-right vertical label */}
          <div
            className="absolute bottom-8 right-7 flex flex-col items-center gap-2.5 transition-opacity duration-500"
            style={{ opacity: visible ? 1 : 0, transitionDelay: "900ms" }}
          >
            <span
              className="text-[8px] font-black tracking-[0.3em] uppercase text-orange-500/50"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              Est. 2020
            </span>
            <div className="w-px h-10 bg-gradient-to-b from-transparent to-orange-500/40" />
          </div>
        </div>
      </section>
    </>
  );
}