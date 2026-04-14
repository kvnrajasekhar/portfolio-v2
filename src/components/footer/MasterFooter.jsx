import { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

import darkLogo from "../../assets/portfolio-dark-logo.png";
import lightLogo from "../../assets/portfolio-light-logo.png";
import charminaImg from "../../assets/charminar.png";


const START_DATE = new Date("2025-02-01T00:00:00");

const NAV_COLS = [
  {
    heading: "Navigate",
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Skills", href: "/skills" },
      { label: "Projects", href: "/projects" },
    ],
  },
  {
    heading: "Connect",
    links: [
      { label: "Experience", href: "/experience" },
      { label: "Contact", href: "/contact" },
      { label: "Links", href: "/links" },
      { label: "Guest Book", href: "/guestbook" },
    ],
  },
];

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/kvnrajasekhar", icon: <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg> },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/kvnrs23", icon: <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg> },
  { label: "Twitter", href: "https://x.com/vnrajasekar", icon: <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg> },
  { label: "Instagram", href: "https://instagram.com/vnrajasekar", icon: <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg> },
  { label: "Medium", href: "https://medium.com/@kanagalavnrajasekhar", icon: <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" /></svg> },
  { label: "LeetCode", href: "https://leetcode.com/u/vnrajasekhar/", icon: <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M13.483 0a1.374 1.374 0 00-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 00-1.209 2.104 5.35 5.35 0 00-.125.513 5.527 5.527 0 00.062 2.362 5.83 5.83 0 00.349 1.017 5.938 5.938 0 001.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 00-1.951-.003l-2.396 2.392a3.021 3.021 0 01-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 01.066-.523 2.545 2.545 0 01.619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 00-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0013.483 0zm-2.866 12.815a1.38 1.38 0 00-1.38 1.382 1.38 1.38 0 001.38 1.382H19.79a1.38 1.38 0 001.38-1.382 1.38 1.38 0 00-1.38-1.382z" /></svg> },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function getIST() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const ist = new Date(utc + 5.5 * 3600000);
  //   console.log(`Current IST Time: ${ist.getHours()}:${ist.getMinutes()}:${ist.getSeconds()}`);
  return ist;
}

// ── Refined Analog Clock (reference style) ────────────────────────────────────
function AnalogClock({ isDark }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  const accent = isDark ? "#fbe3e8" : "#5cbdb9";
  const secColor = isDark ? "#c9b8f5" : "#e05050";
  const faceColor = isDark ? "#111111" : "#5cbdba5f";
  const rimColor = isDark ? "#2a2a2a" : "#5cbdb922";
  const numColor = isDark ? "rgba(255,255,255,0.55)" : "rgba(30,30,30,0.65)";
  const tickColor = isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.18)";
  const handColor = isDark ? "#ffffff" : "#1a1a1a";
  const minColor = isDark ? "rgba(255,255,255,0.85)" : "rgba(10,10,10,0.8)";

  // Status text based on IST hour
  const getStatus = () => {
    const h = getIST().getHours();
    if (h >= 22 || h < 6) return ["I'M PROBABLY NOT SLEEPING", "HIT ME UP"];
    if (h >= 6 && h < 9) return ["EARLY MORNING MODE", "COFFEE TIME"];
    if (h >= 9 && h < 18) return ["DEEP WORK MODE", "LET'S BUILD"];
    return ["WINDING DOWN", "PING ME ANYWAY"];
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const S = 220;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = S * dpr;
    canvas.height = S * dpr;
    ctx.scale(dpr, dpr);
    const cx = S / 2, cy = S / 2;
    const R = S / 2 - 6; // outer rim radius

    const draw = () => {
      const ist = getIST();
      //   console.log(`Current IST Time: ${ist.getHours()}:${ist.getMinutes()}:${ist.getSeconds()}`);
      const h = ist.getHours() % 12;
      const m = ist.getMinutes();
      const s = ist.getSeconds();
      const ms = ist.getMilliseconds();

      ctx.clearRect(0, 0, S, S);

      // ── Outer neumorphic rim ──
      // Shadow bottom-right
      //   ctx.save();
      //   ctx.shadowColor = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.18)";
      //   ctx.shadowBlur  = 18;
      //   ctx.shadowOffsetX = 1; ctx.shadowOffsetY = 2;
      //   ctx.beginPath(); ctx.arc(cx, cy, R +1, 0, Math.PI * 2);
      //   ctx.fillStyle = rimColor; ctx.fill();
      //   ctx.restore();
      // Highlight top-left
      ctx.save();
      ctx.shadowColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.9)";
      ctx.shadowBlur = 14;
      ctx.shadowOffsetX = -3; ctx.shadowOffsetY = -3;
      ctx.beginPath(); ctx.arc(cx, cy, R + 4, 0, Math.PI * 2);
      ctx.fillStyle = rimColor; ctx.fill();
      ctx.restore();

      // ── Clock face ──
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = faceColor; ctx.fill();

      // Subtle inner ring
      ctx.beginPath(); ctx.arc(cx, cy, R - 1, 0, Math.PI * 2);
      ctx.strokeStyle = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
      ctx.lineWidth = 1; ctx.stroke();

      // ── Hour numbers ──
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.font = `400 ${S * 0.068}px 'Courier New', monospace`;
      ctx.fillStyle = numColor;
      for (let i = 1; i <= 12; i++) {
        const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
        const nr = R - S * 0.115;
        ctx.fillText(String(i), cx + Math.cos(a) * nr, cy + Math.sin(a) * nr);
      }

      // ── Minute ticks ──
      for (let i = 0; i < 60; i++) {
        const a = (i / 60) * Math.PI * 2 - Math.PI / 2;
        const isHr = i % 5 === 0;
        const r1 = R - 4;
        const r2 = isHr ? R - S * 0.08 : R - S * 0.055;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
        ctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2);
        ctx.strokeStyle = isHr ? (isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.3)") : tickColor;
        ctx.lineWidth = isHr ? 1.8 : 0.8;
        ctx.stroke();
      }

      // ── Status text inside face ──
      const [line1, line2] = getStatus();
      ctx.font = `400 ${S * 0.042}px 'Courier New', monospace`;
      ctx.fillStyle = isDark ? "rgba(255,255,255,0.22)" : "#000000";
      ctx.textAlign = "center";
      ctx.fillText(line1, cx, cy + R * 0.45);
      ctx.fillText(line2, cx, cy + R * 0.45 + S * 0.052);

      // ── Hands ──
      const drawHand = (angle, length, width, color, tailLen = 0.12) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, R * tailLen);
        ctx.lineTo(0, -R * length);
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = "round";
        if (color === secColor) {
          ctx.shadowBlur = 6;
          ctx.shadowColor = secColor;
        }
        ctx.stroke();
        ctx.restore();
      };

      const hrAngle = ((h + m / 60) / 12) * Math.PI * 2;
      const minAngle = ((m + s / 60) / 60) * Math.PI * 2;
      const secAngle = ((s + ms / 1000) / 60) * Math.PI * 2;

      drawHand(hrAngle, 0.52, 3.5, handColor, 0.1);
      drawHand(minAngle, 0.72, 2.2, minColor, 0.12);
      drawHand(secAngle, 0.84, 1.2, secColor, 0.18);

      // ── Center cap ──
      // Outer ring
      ctx.beginPath(); ctx.arc(cx, cy, 5.5, 0, Math.PI * 2);
      ctx.fillStyle = secColor; ctx.fill();
      // Inner white dot
      ctx.beginPath(); ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? "#222" : "#fff"; ctx.fill();

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [isDark]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <SectionHeading label="My Current Time · IST" isDark={isDark} />
      <canvas ref={canvasRef} style={{ width: 220, height: 220, display: "block" }} />
    </div>
  );
}

// ── Section heading style (bold, accented) ────────────────────────────────────
function SectionHeading({ label, isDark }) {
  const accent = isDark ? "#fbe3e8" : "#5cbdb9";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 16, height: 1.5, background: accent, borderRadius: 1 }} />
      <span style={{
        fontFamily: "'Courier New', monospace",
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: "0.3em",
        textTransform: "uppercase",
        color: accent,
      }}>
        {label}
      </span>
      <div style={{ width: 16, height: 1.5, background: accent, borderRadius: 1 }} />
    </div>
  );
}

// ── Experience counter ────────────────────────────────────────────────────────
function ExperienceCounter({ isDark }) {
  const [elapsed, setElapsed] = useState({ years: 0, months: 0 });

  useEffect(() => {
    const calc = () => {
      const now = new Date();
      let years = now.getFullYear() - START_DATE.getFullYear();
      let months = now.getMonth() - START_DATE.getMonth();
      if (months < 0) { years--; months += 12; }
      setElapsed({ years, months });
    };
    calc();
    const id = setInterval(calc, 60000);
    return () => clearInterval(id);
  }, []);

  const accent = isDark ? "#fbe3e8" : "#5cbdb9";
  const muted = isDark ? "rgba(255,255,255,0.45)" : "rgba(10,18,18,0.5)";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 10 }}>
      <SectionHeading label="Experience" isDark={isDark} />
      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <span style={{
          fontFamily: "'Courier New',monospace",
          fontSize: "clamp(36px,4.5vw,56px)",
          fontWeight: 900,
          color: accent,
          letterSpacing: "-0.03em",
          lineHeight: 1,
          textShadow: isDark ? `0 0 28px ${accent}66` : "none",
        }}>
          {elapsed.years > 0 ? `${elapsed.years}Y ` : ""}{elapsed.months}M
        </span>
      </div>
      <span style={{
        fontFamily: "'Courier New',monospace",
        fontSize: 11,
        fontWeight: 700,
        color: muted,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
      }}>
        Since Feb 2025
      </span>
    </div>
  );
}

// ── Location widget with Charminar image ──────────────────────────────────────
function LocationWidget({ isDark }) {
  const accent = isDark ? "#fbe3e8" : "#5cbdb9";
  const muted = isDark ? "rgba(255,255,255,0.45)" : "rgba(10,18,18,0.5)";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
      <SectionHeading label="Location" isDark={isDark} />
      <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end", marginBottom: 4 }}>
            {/* Pulsing live dot */}
            <div style={{ position: "relative", width: 9, height: 9, flexShrink: 0 }}>
              <motion.div
                animate={{ scale: [1, 2.4, 1], opacity: [0.8, 0, 0.8] }}
                transition={{ repeat: Infinity, duration: 1.8 }}
                style={{ position: "absolute", inset: 0, borderRadius: "50%", background: accent }}
              />
              <div style={{ position: "absolute", inset: 2, borderRadius: "50%", background: accent }} />
            </div>
            <span style={{
              fontFamily: "'Courier New',monospace",
              fontSize: "clamp(18px,2.2vw,26px)",
              fontWeight: 900,
              color: accent,
              letterSpacing: "-0.01em",
              textShadow: isDark ? `0 0 20px ${accent}55` : "none",
            }}>
              Hyderabad
            </span>
          </div>
          <span style={{
            fontFamily: "'Courier New',monospace",
            fontSize: 11,
            fontWeight: 700,
            color: muted,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}>
            Telangana,
            <span className="text-orange-400 font-bold">I</span>
            <span className="text-orange-400 font-bold">N</span>
            <span className="dark:text-white font-bold">D</span>
            <span className="text-green-400 font-bold">I</span>
            <span className="text-green-400 font-bold">A</span>            🇮🇳
          </span>
        </div>

        {/* Charminar image — transparent background PNG */}
        <img
          src="/src/assets/charminar.png"
          alt="Charminar"
          style={{
            width: "clamp(52px,6vw,72px)",
            height: "auto",
            objectFit: "contain",
            // Tint via CSS filter to match theme
            filter: isDark
              ? "sepia(1) saturate(0.6) hue-rotate(300deg) brightness(1.1) drop-shadow(0 0 8px #fbe3e888)"
              : "sepia(0.4) saturate(1.2) hue-rotate(140deg) brightness(0.95) drop-shadow(0 0 6px #5cbdb966)",
            flexShrink: 0,
          }}
        />
      </div>
    </div>
  );
}

// ── Nav column ────────────────────────────────────────────────────────────────
function NavColumn({ col, isDark }) {
  const accent = isDark ? "#fbe3e8" : "#5cbdb9";
  const text = isDark ? "rgba(255,255,255,0.82)" : "rgba(10,18,18,0.82)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionHeading label={col.heading} isDark={isDark} />
      {col.links.map(link => (
        <motion.a
          key={link.label}
          href={link.href}
          whileHover={{ x: 6, color: accent }}
          transition={{ duration: 0.16 }}
          style={{
            fontFamily: "'Courier New',monospace",
            fontSize: "clamp(13px,1.4vw,16px)",
            fontWeight: 700,
            color: text,
            textDecoration: "none",
            letterSpacing: "0.05em",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ width: 10, height: 1.5, background: "currentColor", opacity: 0.35, display: "inline-block", borderRadius: 1 }} />
          {link.label}
        </motion.a>
      ))}
    </div>
  );
}

// ── MASTER FOOTER ─────────────────────────────────────────────────────────────
export default function MasterFooter() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const footerRef = useRef(null);
  const logoControls = useAnimation();
  const inView = useInView(footerRef, { once: true, margin: "-60px" });

  const accent = isDark ? "#fbe3e8" : "#5cbdb9";
  const bg = isDark ? "#010101" : "#ffffff";
  const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(92,189,185,0.16)";
  const muted = isDark ? "rgba(255,255,255,0.38)" : "rgba(10,18,18,0.42)";
  const text = isDark ? "rgba(255,255,255,0.8)" : "rgba(10,18,18,0.8)";

  const currentLogo = isDark ? darkLogo : lightLogo; // Replace with your logic

  useEffect(() => {
    if (!inView) return;
    logoControls.start({
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 36, damping: 16, mass: 1.6 },
    });
  }, [inView, logoControls]);

  useEffect(() => {
    logoControls.set({ x: "-110vw", opacity: 0 });
    if (inView) {
      logoControls.start({
        x: 0, opacity: 1,
        transition: { type: "spring", stiffness: 36, damping: 16, mass: 1.6 },
      });
    }
  }, [isDark, inView, logoControls]);

  return (
    <div className="mx-3">
      <footer
        ref={footerRef}
        style={{
          width: "100%",
          background: bg,
          fontFamily: "'Courier New', monospace",
          transition: "background 0.4s ease",
          position: "relative",
          overflow: "hidden",
          minHeight: "75vh",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
          borderTop: `1px solid ${border}`,
          borderRadius: "12px 12px 0 0",
        }}
      >
        {/* Blueprint grid */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `
            linear-gradient(${isDark ? "rgba(255,255,255,0.025)" : "rgba(92,189,185,0.07)"} 1px, transparent 1px),
            linear-gradient(90deg, ${isDark ? "rgba(255,255,255,0.025)" : "rgba(92,189,185,0.07)"} 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }} />

        {/* ── TOP SECTION (1/3) ── */}
        <div
          className="footer-top-container" // Added custom class for Media Query
          style={{
            flex: "0 0 33.33%",
            backgroundColor: isDark ? "#6040c032" : "rgba(92, 189, 186, 0.1)",
            border: `2px solid ${border}`,
            borderRadius: "14px",
            padding: "clamp(24px,3.5vw,44px) clamp(20px,5vw,72px)",
            display: "flex", // Base layout
            flexWrap: "wrap",
            position: "relative",
            zIndex: 2,
          }}
        >
          <ExperienceCounter isDark={isDark} />
          <AnalogClock isDark={isDark} />
          <LocationWidget isDark={isDark} />
        </div>

        {/* ── BOTTOM SECTION (2/3) ── */}
        <div style={{
          flex: "1 1 66.67%",
          position: "relative",
          padding: "clamp(28px,3.5vw,44px) clamp(20px,5vw,72px) 0",
          display: "flex",
          flexDirection: "column",
        }}>

          <div style={{ flex: 1, display: "flex", alignItems: "center", position: "relative", minHeight: 200 }}>

            {/* Logo Container */}
            <motion.div
              className="footer-logo"
              initial={{ x: "-110vw", opacity: 0 }}
              animate={logoControls}
              style={{
                zIndex: 0,
                pointerEvents: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                key={isDark ? "dark" : "light"}
                src={currentLogo}
                alt="Logo"
                style={{
                  width: "clamp(150px,20vw,260px)",
                  height: "auto",
                  opacity: isDark ? 0.2 : 0.14,
                  filter: isDark ? "drop-shadow(0 0 28px #fbe3e899)" : "drop-shadow(0 0 22px #5cbdb977)",
                }}
              />
            </motion.div>

            {/* Nav Columns */}
            <div className="footer-nav-grid"
              style={{
                position: "relative",
                zIndex: 10,
                display: "grid",
                width: "100%",
                // Desktop: 3 equal columns | Mobile: handled by CSS below
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "clamp(24px, 3vw, 40px)",
                alignItems: "start",
              }}>
              {NAV_COLS.map(col => (
                <NavColumn key={col.heading} col={col} isDark={isDark} />
              ))}

              <div className="footer-about-col" style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 220 }}>
                <SectionHeading label="About" isDark={isDark} />
                <p style={{ margin: 0, fontSize: "clamp(11px,1.15vw,13px)", fontWeight: 600, color: text, lineHeight: 1.85 }}>
                  Full Stack Engineer building scalable systems with atomic precision.
                </p>
              </div>
            </div>
          </div>

          {/* Socials Bar */}
          <div className="footer-bottom-bar" style={{
            borderTop: `1px solid ${border}`,
            marginTop: "clamp(20px,3vw,32px)",
            padding: "clamp(14px,2vw,22px) 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            zIndex: 10,
          }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: muted, letterSpacing: "0.2em", textTransform: "uppercase" }}>
              © {new Date().getFullYear()} Rajasekhar
            </span>

            <div style={{ display: "flex", gap: "12px" }}>
              {/* Social Icons Mapping */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "clamp(8px,1.8vw,18px)",
                flexWrap: "wrap",
                justifyContent: "center",
              }}>
                {SOCIALS.map(s => (
                  <motion.a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={s.label}
                    whileHover={{ scale: 1.3, color: accent }}
                    transition={{ duration: 0.16 }}
                    style={{
                      color: muted,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      textDecoration: "none",
                      padding: 7,
                      borderRadius: 8,
                      border: `1px solid transparent`,
                      transition: "color 0.2s ease, border-color 0.2s ease",
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = accent + "44"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "transparent"}
                  >
                    {s.icon}
                  </motion.a>
                ))}
              </div>
            </div>
            <span style={{
              fontSize: 10,
              fontWeight: 700,
              color: muted,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}>
              Built with React & ♥
            </span>
          </div>
        </div>

        {/* ── RESPONSIVE OVERRIDES ── */}
        <style>{`
  /* ── TOP SECTION ── */
  .footer-top-container {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 32px;
    text-align: center;
  }
  @media (min-width: 1024px) {
    .footer-top-container {
      flex-direction: row;
      justify-content: space-between;
      text-align: left;
    }
  }

  /* ── NAV GRID ──
     Desktop: 3 cols side by side (Navigate | Connect | About)
     Tablet/Mobile: Navigate + Connect side by side top row,
                    About centered below, logo behind both
  */
  .footer-nav-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 900px) {
    .footer-nav-grid {
      /* 2-col top row + About spans full width centered below */
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto auto;
    }

    /* Navigate = col 1 row 1, Connect = col 2 row 1 */
    .footer-nav-grid > *:nth-child(1) {
      grid-column: 1;
      grid-row: 1;
      justify-self: start;
      margin-right: clamp(36px, 2vw, 40px);
    }
    .footer-nav-grid > *:nth-child(2) {
      grid-column: 2;
      grid-row: 1;
      justify-self: start;
      margin-left: clamp(3px, 2vw, 40px);
    }
    /* About spans both columns, centered */
    .footer-about-col {
      grid-column: 1 / -1 !important;
      grid-row: 2;
      align-items: center;
      text-align: center;
      max-width: 320px;
      margin: 0 auto;
    }
  }

  /* ── LOGO: background watermark on all sizes ── */
  .footer-logo {
    position: absolute !important;
    /* Desktop */
    left: 50% !important;
    top: 50% !important;
    transform: translate(-50%, -50%) !important;
    z-index: 0;
    pointer-events: none;
  }

  @media (max-width: 900px) {
    .footer-logo {
      /* On mobile/tablet: center it horizontally behind the grid */
      left: 50% !important;
      top: 45% !important;
      transform: translate(-50%, -50%) !important;
      opacity: 0.8 !important;
    }
    .footer-logo img {
      width: clamp(180px, 50vw, 280px) !important;
    }
  }

  /* ── BOTTOM BAR ── */
  @media (max-width: 640px) {
    .footer-bottom-bar {
      flex-direction: column !important;
      align-items: center !important;
      text-align: center;
      gap: 12px !important;
    }
  }
`}</style>
      </footer>
    </div>
  );
}