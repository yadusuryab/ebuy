"use client";

import React, { useState } from "react";
import Link from "next/link";

// ── Contact channels ──────────────────────────────────────────────────────────
const CHANNELS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className="w-5 h-5">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="m2 3 10 8.5L22 3"/>
      </svg>
    ),
    label: "Email",
    value: "wokoonline@gmail.com",
    href: "mailto:wokoonline@gmail.com",
    hint: "We reply within 24 hours",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className="w-5 h-5">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 010 1.18 2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z"/>
      </svg>
    ),
    label: "Phone / WhatsApp",
    value: "+91 94009 41277",
    href: "https://wa.me/919400941277",
    hint: "Mon – Sat, 9 am – 8 pm IST",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className="w-5 h-5">
        <rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
    label: "Instagram",
    value: "@woko_online",
    href: "https://instagram.com/woko_online",
    hint: "DM us anytime",
  },
];

type FormState = "idle" | "sending" | "sent" | "error";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<FormState>("idle");
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");
    // Replace with your actual form submission endpoint
    try {
      await new Promise((r) => setTimeout(r, 1200)); // simulate
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const inputBase = `w-full bg-transparent text-sm font-light leading-relaxed
    text-white/85 placeholder:text-white/20 outline-none resize-none
    transition-colors duration-200`;

  const fieldWrapper = (name: string) =>
    `relative border rounded-xl px-4 py-3.5 transition-all duration-250
    ${focused === name
      ? "border-[rgba(20,184,154,0.5)] bg-[rgba(20,184,154,0.04)]"
      : "border-white/[0.08] bg-white/[0.03] hover:border-white/[0.14]"}`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --teal: #0d6e5e;
          --teal-light: #14b89a;
          --teal-glow: rgba(20,184,154,0.10);
          --bg: #0a0c0b;
          --border: rgba(255,255,255,0.07);
          --text: #e8ede9;
          --muted: rgba(232,237,233,0.38);
        }

        .contact-page {
          font-family: 'DM Sans', sans-serif;
          background: var(--bg);
          color: var(--text);
          min-height: 100vh;
        }

        .serif { font-family: 'Cormorant Garamond', serif; }

        .glass {
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .gradient-line {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(20,184,154,0.3), transparent);
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) both; }
        .d1 { animation-delay: 0.05s; }
        .d2 { animation-delay: 0.13s; }
        .d3 { animation-delay: 0.22s; }
        .d4 { animation-delay: 0.32s; }

        .channel-card {
          transition: border-color 0.25s ease, background 0.25s ease, transform 0.25s ease;
        }
        .channel-card:hover {
          border-color: rgba(20,184,154,0.3);
          background: rgba(20,184,154,0.04);
          transform: translateY(-2px);
        }

        .submit-btn {
          background: linear-gradient(135deg, #0d6e5e 0%, #14b89a 100%);
          transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .submit-btn:hover:not(:disabled) {
          opacity: 0.88;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(20,184,154,0.25);
        }
        .submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .teal-dot {
          display: inline-block;
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--teal-light);
          box-shadow: 0 0 8px rgba(20,184,154,0.6);
        }
      `}</style>

      <div className="contact-page">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-16 md:py-24">

          {/* ── Header ── */}
          <div className="mb-14 md:mb-20">
            <div className="fade-up d1 flex items-center gap-3 mb-5">
              <span className="teal-dot" />
              <span className="text-[10px] tracking-[0.3em] uppercase font-mono text-[var(--teal-light)] opacity-75">
                Get in touch
              </span>
            </div>
            <h1 className="fade-up d2 serif text-[clamp(2.8rem,8vw,5.5rem)] font-light
              leading-[0.92] tracking-tight text-white">
              We'd love to<br /><em>hear from you.</em>
            </h1>
            <p className="fade-up d3 mt-5 text-[var(--muted)] text-sm md:text-base font-light
              leading-relaxed max-w-sm">
              Questions, order support, or just want to say hi — we're quick to reply.
            </p>
          </div>

          <div className="gradient-line mb-14" />

          {/* ── Two-column layout ── */}
          <div className="grid md:grid-cols-[1fr_1.1fr] gap-10 md:gap-16 items-start">

            {/* LEFT — contact channels ── */}
            <div className="fade-up d3 space-y-3">
              <p className="text-[10px] tracking-[0.25em] uppercase font-mono text-white/30 mb-6">
                Reach us directly
              </p>

              {CHANNELS.map((ch) => (
                <a
                  key={ch.label}
                  href={ch.href}
                  target={ch.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="channel-card glass flex items-start gap-4 p-5 rounded-2xl no-underline block"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                    bg-[var(--teal-glow)] border border-[rgba(20,184,154,0.15)]
                    text-[var(--teal-light)]">
                    {ch.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] tracking-[0.18em] uppercase font-mono text-white/30 mb-0.5">
                      {ch.label}
                    </p>
                    <p className="text-sm font-medium text-white/85 truncate">{ch.value}</p>
                    <p className="text-[11.5px] text-white/30 mt-0.5 font-light">{ch.hint}</p>
                  </div>
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
                    className="w-4 h-4 text-white/15 shrink-0 mt-1 ml-auto group-hover:text-white/40">
                    <path d="M3 8h10M9 4l4 4-4 4"/>
                  </svg>
                </a>
              ))}

              {/* Business hours */}
          
            </div>

            {/* RIGHT — message form ── */}
            <div className="fade-up d4">
              <div className="glass rounded-3xl p-7 md:p-9 relative overflow-hidden">
                {/* Glow */}
                <div className="absolute -bottom-12 -right-12 w-56 h-56 rounded-full
                  bg-[var(--teal-glow)] blur-3xl pointer-events-none" />

                <div className="relative">
                  <p className="text-[10px] tracking-[0.25em] uppercase font-mono text-white/25 mb-7">
                    Send a message
                  </p>

                  {status === "sent" ? (
                    <div className="text-center py-10">
                      <div className="w-14 h-14 rounded-full bg-[var(--teal-glow)] border border-[rgba(20,184,154,0.2)]
                        flex items-center justify-center mx-auto mb-5 text-[var(--teal-light)]">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                      <h3 className="serif text-2xl font-light text-white mb-2">Message sent!</h3>
                      <p className="text-sm text-white/35 font-light mb-7">
                        We'll get back to you within 24 hours.
                      </p>
                      <button
                        onClick={() => setStatus("idle")}
                        className="text-xs tracking-[0.15em] uppercase font-mono text-[var(--teal-light)]
                          border-b border-[rgba(20,184,154,0.3)] pb-px hover:border-[var(--teal-light)]
                          transition-colors duration-200"
                      >
                        Send another
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Name */}
                      <div className={fieldWrapper("name")}>
                        <label className="block text-[9px] tracking-[0.22em] uppercase font-mono
                          text-white/25 mb-1.5">
                          Your name
                        </label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                          onFocus={() => setFocused("name")}
                          onBlur={() => setFocused(null)}
                          placeholder="John Doe"
                          required
                          className={inputBase}
                        />
                      </div>

                      {/* Email */}
                      <div className={fieldWrapper("email")}>
                        <label className="block text-[9px] tracking-[0.22em] uppercase font-mono
                          text-white/25 mb-1.5">
                          Email address
                        </label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                          onFocus={() => setFocused("email")}
                          onBlur={() => setFocused(null)}
                          placeholder="you@example.com"
                          required
                          className={inputBase}
                        />
                      </div>

                      {/* Message */}
                      <div className={fieldWrapper("message")}>
                        <label className="block text-[9px] tracking-[0.22em] uppercase font-mono
                          text-white/25 mb-1.5">
                          Message
                        </label>
                        <textarea
                          value={form.message}
                          onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
                          onFocus={() => setFocused("message")}
                          onBlur={() => setFocused(null)}
                          placeholder="How can we help you?"
                          rows={4}
                          required
                          className={inputBase}
                        />
                      </div>

                      {status === "error" && (
                        <p className="text-[11.5px] text-red-400/80 font-light">
                          Something went wrong. Please try WhatsApp or email directly.
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={status === "sending" || !form.name || !form.email || !form.message}
                        className="submit-btn w-full py-3.5 rounded-xl text-white text-sm font-medium
                          tracking-wide flex items-center justify-center gap-2.5 mt-2"
                      >
                        {status === "sending" ? (
                          <>
                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25"/>
                              <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            Sending…
                          </>
                        ) : (
                          <>
                            Send Message
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </>
                        )}
                      </button>

                      <p className="text-[10.5px] text-white/20 text-center font-light leading-relaxed">
                        Or reach us faster on{" "}
                        <a href="https://wa.me/919400941277" target="_blank" rel="noopener noreferrer"
                          className="text-[var(--teal-light)] opacity-70 hover:opacity-100 transition-opacity">
                          WhatsApp
                        </a>
                        {" "}or{" "}
                        <a href="https://instagram.com/woko_online" target="_blank" rel="noopener noreferrer"
                          className="text-[var(--teal-light)] opacity-70 hover:opacity-100 transition-opacity">
                          Instagram DM
                        </a>
                      </p>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}