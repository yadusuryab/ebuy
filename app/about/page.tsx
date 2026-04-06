import Link from "next/link";

// ── WOKO About Page ──────────────────────────────────────────────────────────
// Dark luxury · teal accent · glassmorphism · editorial

const STATS = [
  { value: "2,290+", label: "Happy customers" },
  { value: "84+",    label: "Products listed" },
  { value: "4.9★",   label: "Average rating" },
  { value: "24h",    label: "Reply guarantee" },
];

const VALUES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-6 h-6">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: "Built for Everyday",
    body: "Every watch and gadget we carry is chosen for real life — durable, versatile, and worth wearing every single day.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-6 h-6">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: "Trusted Quality",
    body: "We source directly and verify every product. What you see is exactly what arrives at your door.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-6 h-6">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
    title: "Best Price Promise",
    body: "Premium doesn't have to mean expensive. We negotiate hard so you get the best price without compromise.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-6 h-6">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    title: "Fast & Friendly Support",
    body: "Real replies, not bots. Message us on Instagram or WhatsApp and hear back within hours — always.",
  },
];

export default function AboutPage() {
  // Get dynamic values from environment variables
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "WOKO";
  const brandDesc = process.env.NEXT_PUBLIC_BRAND_DESC || "Premium Watches & Gadgets";
  const productDesc = process.env.NEXT_PUBLIC_PRODUCT_DESC || "Premium Watches, Premium Sunglass, Gadgets";
  const instagramUrl = process.env.NEXT_PUBLIC_INSTA || "https://www.instagram.com/woko_online";
  const whatsappUrl = process.env.NEXT_PUBLIC_WHATSAPP || "https://wa.me/919400941277";
  const phoneNumber = process.env.NEXT_PUBLIC_PHONE || "+919400941277";
  const email = process.env.NEXT_PUBLIC_EMAIL || "woko@example.com";
  const address = process.env.NEXT_PUBLIC_ADDR || "Kerala, India";
  const upiId = process.env.NEXT_PUBLIC_UPI_ID || "woko@okhdf";
  
  // Extract Instagram handle from URL
  const instagramHandle = instagramUrl.split('.com/')[1]?.replace(/\/$/, '') || "@woko_online";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --teal: #0d6e5e;
          --teal-light: #14b89a;
          --teal-glow: rgba(20,184,154,0.12);
          --bg: #0a0c0b;
          --surface: rgba(255,255,255,0.035);
          --border: rgba(255,255,255,0.07);
          --text: #e8ede9;
          --muted: rgba(232,237,233,0.4);
        }

        .about-page {
          font-family: 'DM Sans', sans-serif;
          background: var(--bg);
          color: var(--text);
          min-height: 100vh;
          overflow-x: hidden;
        }

        .serif { font-family: 'Cormorant Garamond', serif; }

        /* gradient ring replicating brand logo ring */
        .brand-ring {
          background: conic-gradient(from 180deg, #ff6b6b, #ffd93d, #6bcb77, #4d96ff, #c77dff, #ff6b6b);
          border-radius: 9999px;
          padding: 3px;
        }
        .brand-ring-inner {
          background: #0e2d26;
          border-radius: 9999px;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* glass card */
        .glass {
          background: var(--surface);
          border: 1px solid var(--border);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        /* teal glow behind hero section */
        .hero-glow {
          position: absolute;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(20,184,154,0.10) 0%, transparent 70%);
          border-radius: 9999px;
          pointer-events: none;
        }

        /* divider line */
        .gradient-line {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(20,184,154,0.4), transparent);
        }

        /* animate in */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .delay-4 { animation-delay: 0.45s; }

        /* stat number */
        .stat-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 300;
          color: var(--teal-light);
          line-height: 1;
        }

        /* value card hover */
        .value-card {
          transition: border-color 0.3s ease, background 0.3s ease;
        }
        .value-card:hover {
          border-color: rgba(20,184,154,0.25);
          background: rgba(20,184,154,0.05);
        }

        /* CTA button */
        .cta-btn {
          background: linear-gradient(135deg, #0d6e5e, #14b89a);
          transition: opacity 0.2s, transform 0.2s;
        }
        .cta-btn:hover { opacity: 0.88; transform: translateY(-1px); }

        .ghost-btn {
          border: 1px solid rgba(20,184,154,0.3);
          color: var(--teal-light);
          transition: background 0.2s, border-color 0.2s;
        }
        .ghost-btn:hover {
          background: rgba(20,184,154,0.08);
          border-color: rgba(20,184,154,0.5);
        }
      `}</style>

      <div className="about-page">

        {/* ── Hero ── */}
        <section className="relative flex flex-col items-center justify-center text-center
          px-5 pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">

          {/* Glow */}
          <div className="hero-glow top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

          {/* Brand mark */}
          <div className="fade-up relative mb-10">
            <div className="brand-ring w-24 h-24 md:w-28 md:h-28 mx-auto shadow-[0_0_60px_rgba(20,184,154,0.2)]">
              <div className="brand-ring-inner">
                <span className="serif text-white text-2xl md:text-3xl font-light tracking-wider">{appName}</span>
              </div>
            </div>
          </div>

          {/* Eyebrow */}
          <p className="fade-up delay-1 text-[10px] tracking-[0.35em] uppercase font-mono
            text-[var(--teal-light)] mb-5 opacity-80">
            {brandDesc}
          </p>

          {/* Headline */}
          <h1 className="fade-up delay-2 serif text-[clamp(2.8rem,8vw,6rem)] font-light
            leading-[0.95] tracking-tight text-white max-w-3xl">
            Designed for<br /><em>Everyday.</em>
          </h1>

          {/* Sub */}
          <p className="fade-up delay-3 mt-7 text-[var(--muted)] text-sm md:text-base
            font-light leading-relaxed max-w-md">
            We believe great design should be accessible. {appName} brings you {productDesc.toLowerCase()} —
            built for life, priced for everyone.
          </p>

          {/* CTAs */}
          <div className="fade-up delay-4 flex items-center gap-3 mt-10 flex-wrap justify-center">
            <Link href="/products"
              className="cta-btn inline-flex items-center gap-2 px-6 py-3 rounded-full
                text-white text-sm font-medium tracking-wide no-underline">
              Shop Now
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer"
              className="ghost-btn inline-flex items-center gap-2 px-6 py-3 rounded-full
                text-sm font-medium tracking-wide no-underline">
              Follow on Instagram
            </a>
          </div>
        </section>

        <div className="gradient-line mx-5 md:mx-16" />

        {/* ── Stats ── */}
        <section className="px-5 md:px-16 py-16 md:py-20">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <div key={i} className="glass rounded-2xl px-5 py-6 text-center value-card">
                <div className="stat-value">{s.value}</div>
                <p className="text-[11px] tracking-[0.15em] uppercase mt-2 text-[var(--muted)] font-mono">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="gradient-line mx-5 md:mx-16" />

        {/* ── Story ── */}
        <section className="px-5 md:px-16 py-16 md:py-24 max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">

            {/* Text */}
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase font-mono text-[var(--teal-light)] mb-5 opacity-80">
                Our Story
              </p>
              <h2 className="serif text-[clamp(2rem,5vw,3.2rem)] font-light leading-[1.05] text-white mb-6">
                Started with a passion<br />for great {productDesc.split(',')[0].toLowerCase()}.
              </h2>
              <div className="space-y-4 text-[var(--muted)] text-sm leading-relaxed font-light">
                <p>
                  {appName} started as a simple idea: premium {productDesc.toLowerCase()} shouldn't cost a fortune,
                  and finding them online shouldn't feel like a gamble. We set out to change that.
                </p>
                <p>
                  Every piece in our collection is personally reviewed before it's listed.
                  We test for build quality, accuracy, and everyday wearability —
                  so you get exactly what you see.
                </p>
                <p>
                  Based in {address}, shipping across India. COD available. Fast replies, always.
                </p>
              </div>
              {/* Contact pill */}
              <a href={`tel:${phoneNumber.replace(/[^0-9+]/g, '')}`}
                className="ghost-btn inline-flex items-center gap-2.5 mt-8 px-5 py-2.5
                  rounded-full text-sm no-underline font-medium">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.0 1.18 2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z"/>
                </svg>
                {phoneNumber}
              </a>
            </div>

            {/* Visual — decorative glass panel with brand details */}
            <div className="relative">
              <div className="glass rounded-3xl p-8 md:p-10 relative overflow-hidden">
                {/* teal glow inside card */}
                <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full
                  bg-[var(--teal-glow)] blur-3xl pointer-events-none" />

                <div className="relative space-y-6">
                  {[
                    { label: "Category", value: productDesc },
                    { label: "Location", value: address },
                    { label: "Payment", value: "COD & Online" },
                    { label: "Shipping", value: "Pan India" },
                    { label: "Instagram", value: instagramHandle },
                    { label: "WhatsApp", value: phoneNumber },
                    { label: "Email", value: email },
                    { label: "UPI ID", value: upiId },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start justify-between gap-4
                      border-b border-[var(--border)] pb-4 last:border-0 last:pb-0">
                      <span className="text-[11px] tracking-[0.15em] uppercase font-mono text-[var(--muted)]">
                        {item.label}
                      </span>
                      <span className="text-sm text-white/80 text-right font-light">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="gradient-line mx-5 md:mx-16" />

        {/* ── Values ── */}
        <section className="px-5 md:px-16 py-16 md:py-24">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-[10px] tracking-[0.3em] uppercase font-mono text-[var(--teal-light)] mb-4 opacity-80">
                Why {appName}
              </p>
              <h2 className="serif text-[clamp(2rem,5vw,3rem)] font-light text-white leading-tight">
                What we stand for.
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {VALUES.map((v, i) => (
                <div key={i} className="glass value-card rounded-2xl p-7">
                  <div className="w-10 h-10 rounded-xl bg-[var(--teal-glow)] border border-[var(--border)]
                    flex items-center justify-center text-[var(--teal-light)] mb-5">
                    {v.icon}
                  </div>
                  <h3 className="serif text-xl font-light text-white mb-2">{v.title}</h3>
                  <p className="text-sm text-[var(--muted)] leading-relaxed font-light">{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="gradient-line mx-5 md:mx-16" />

        {/* ── CTA Banner ── */}
        <section className="px-5 md:px-16 py-16 md:py-24">
          <div className="max-w-3xl mx-auto glass rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
            {/* glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-80 h-80 rounded-full bg-[var(--teal-glow)] blur-3xl" />
            </div>

            <div className="relative">
              <p className="text-[10px] tracking-[0.3em] uppercase font-mono text-[var(--teal-light)] mb-5 opacity-80">
                Ready to explore?
              </p>
              <h2 className="serif text-[clamp(2rem,6vw,4rem)] font-light text-white leading-tight mb-6">
                Find your next<br />favourite piece.
              </h2>
              <p className="text-[var(--muted)] text-sm leading-relaxed mb-10 max-w-sm mx-auto font-light">
                Browse our latest collection — new arrivals every week,
                all handpicked, all ready to ship.
              </p>
              <div className="flex items-center gap-3 justify-center flex-wrap">
                <Link href="/products"
                  className="cta-btn inline-flex items-center gap-2 px-7 py-3.5
                    rounded-full text-white text-sm font-medium tracking-wide no-underline">
                  Browse Collection
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                  className="ghost-btn inline-flex items-center gap-2 px-7 py-3.5
                    rounded-full text-sm font-medium tracking-wide no-underline">
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}