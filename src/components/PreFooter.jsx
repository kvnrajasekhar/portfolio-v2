import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const BIG_WORDS = [
  "BUILDING",
  "SCALABLE",
  "SYSTEMS.",
  "WITH",
  "ATOMIC",
  "PRECISION.",
];

// ── Optimized Glowing meta circle ─────────────────────────────────────────────
function MetaCircle({ isDark }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const requestRef = useRef();
  const timeRef = useRef(0);

  // Only animate if the circle is actually visible to save CPU/Battery
  const isVisible = useInView(canvasRef, { margin: "100px" });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    // Optimization: Cap DPR at 2.0. Mobile screens at 3.0+ kill performance.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = 500;

    const resize = () => {
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();

    const draw = () => {
      if (!isVisible) {
        requestRef.current = requestAnimationFrame(draw);
        return;
      }

      timeRef.current += 0.015;
      const t = timeRef.current;
      const cx = 250;
      const cy = 250;

      ctx.clearRect(0, 0, size, size);

      // --- 1. Background Glow Ring ---
      const gradient = ctx.createRadialGradient(cx, cy, 140, cx, cy, 180);
      gradient.addColorStop(0, isDark ? "rgba(186, 42, 226, 0)" : "rgba(42, 158, 154, 0)");
      gradient.addColorStop(0.5, isDark ? "rgba(226, 42, 158, 0.2)" : "rgba(42, 158, 154, 0.15)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.beginPath();
      ctx.arc(cx, cy, 180, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // --- 2. Dynamic Glowing Ring ---
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, 150, 0, Math.PI * 2);
      ctx.lineWidth = 2;
      ctx.strokeStyle = isDark ? "#ff2ae0" : "#2a9e9a";
      // Reduced blur for mobile performance
      ctx.shadowBlur = 15;
      ctx.shadowColor = isDark ? "#ff2ae0" : "#2a9e9a";
      ctx.stroke();
      ctx.restore();

      // --- 3. Abstract Waves ---
      ctx.globalCompositeOperation = "lighter";

      const drawWave = (offset, color, amplitude, freq) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        // Optimization: No heavy shadows on the moving waves
        ctx.shadowBlur = 0;

        for (let i = 0; i <= 360; i += 4) { // Increased step to 4 for fewer calculations
          const angle = (i * Math.PI) / 180;
          const p = (angle + t * freq) * 3;
          const deformation = Math.sin(p + offset) * amplitude;
          const r = 130 + deformation;

          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      };

      if (isDark) {
        drawWave(0, "rgba(0, 255, 255, 0.5)", 20, 0.5);
        drawWave(2, "rgba(186, 42, 226, 0.4)", 30, -0.3);
      } else {
        drawWave(0, "rgba(42, 158, 154, 0.5)", 15, 0.4);
        drawWave(2, "rgba(96, 64, 192, 0.4)", 25, -0.3);
      }

      requestRef.current = requestAnimationFrame(draw);
    };

    requestRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isDark, isVisible]);

  return (
    <div className="flex items-center justify-center w-full max-w-[400px]">
      <canvas
        ref={canvasRef}
        className="w-full h-auto max-w-[400px] aspect-square"
        style={{
          // will-change hints the browser to use GPU for this element
          willChange: "transform",
          filter: "brightness(1.05)",
        }}
      />
    </div>
  );
}

// ── Optimized BigWords ────────────────────────────────────────────────────────
function BigWords({ isDark }) {
  const solidColors = isDark
    ? ["#5cbdb9", "#ffffff", "#c9b8f5", "#ffffff", "#fbe3e8", "#5cbdb9"]
    : ["#2a9e9a", "#0a1212", "#6040c0", "#0a1212", "#c04070", "#020d0d"];

  return (
    <div className="flex flex-col flex-1 min-w-0" style={{
      gap: "clamp(2px, 0.5vw, 4px)",
      lineHeight: 0.9,
      contain: "layout"
    }}>
      {BIG_WORDS.map((word, i) => {
        const isOutline = i % 2 === 1;
        const color = solidColors[i];

        return (
          <motion.div
            key={word}
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.4, delay: i * 0.05, ease: "easeOut" }}
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: "clamp(28px, 6vw, 66px)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
              color: isOutline ? "transparent" : color,
              WebkitTextStroke: isOutline
                ? (isDark ? "1px rgba(255, 255, 255, 0.5)" : `1px ${color}55`)
                : "none",
              // Only apply text shadow on desktop to save mobile GPU
              textShadow: (!isOutline && isDark) ? `0 0 20px ${color}33` : "none",
            }}
          >
            {word}
          </motion.div>
        );
      })}
    </div>
  );
}

export default function PreFooter() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  const bg = isDark ? "#000000" : "#ffffff";
  const textSec = isDark ? "rgba(255,255,255,0.4)" : "rgb(10, 18, 18)";

  return (
    <section
      ref={ref}
      style={{
        width: "100%",
        background: bg,
        position: "relative",
        overflow: "hidden",
        minHeight: "65vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "clamp(40px, 8vh, 80px) clamp(20px, 6vw, 80px)",
        boxSizing: "border-box",
        transition: "background 0.4s ease",
      }}
    >
      {/* Blueprint grid - Static background is cheap to render */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `
          linear-gradient(${isDark ? "rgba(255,255,255,0.03)" : "rgba(92,189,185,0.07)"} 1px, transparent 1px),
          linear-gradient(90deg, ${isDark ? "rgba(255,255,255,0.03)" : "rgba(92,189,185,0.07)"} 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
      }} />

      <div className="relative z-10 w-full max-w-[1100px] mx-auto flex flex-col gap-10">

        {/* Top Label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="flex items-center gap-3 opacity-80"
        >
          <div className="w-8 h-[1px]" style={{ background: isDark ? "#5cbdb9" : "#2a9e9a" }} />
          <span style={{
            fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase",
            color: isDark ? "#5cbdb9" : "#2a9e9a", fontWeight: 700,
          }}>
            V N Rajasekhar — Full Stack
          </span>
        </motion.div>

        {/* Main Content: Responsive via Tailwind-like logic (no JS window checks) */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          <BigWords isDark={isDark} />
          <MetaCircle isDark={isDark} />
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          style={{
            margin: 0, fontSize: "clamp(12px, 1.2vw, 14px)",
            color: textSec, lineHeight: 1.6, maxWidth: 450,
            fontFamily: "'Courier New', monospace",
          }}
        >
          Crafting enterprise-grade architecture with atomic precision.
          Built for scale, designed for performance.
        </motion.p>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          // Performance: only animate if in view, otherwise stay static
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.75 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 14,
            // Optimization: helps the browser manage this as a single layer
            willChange: "transform, opacity",
          }}
        >
          {/* Availability */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ position: "relative", width: 9, height: 9 }}>
              <motion.div
                // Optimization: 'scale' and 'opacity' are GPU-accelerated.
                // We use 'whileInView' so the pulse stops when the user scrolls away.
                animate={inView ? { scale: [1, 2.2, 1], opacity: [0.7, 0, 0.7] } : {}}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                style={{
                  position: "absolute", inset: 0, borderRadius: "50%",
                  background: isDark ? "#5cbdb9" : "#2a9e9a",
                }}
              />
              <div style={{
                position: "absolute", inset: 1.5, borderRadius: "50%",
                background: isDark ? "#5cbdb9" : "#2a9e9a",
              }} />
            </div>
            <span style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 11, fontWeight: 700,
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: isDark ? "#5cbdb9" : "#2a9e9a",
            }}>
              Available for Opportunities
            </span>
          </div>

          {/* Stat chips */}
          <div style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            // Mobile tweak: ensures chips stay centered if they wrap to a new line
            justifyContent: "center"
          }}>
            {[
              { label: "Projects Shipped", value: "4+", color: isDark ? "#5cbdb9" : "#2a9e9a" },
              { label: "Experience", value: "1+ Yrs", color: isDark ? "#fbe3e8" : "#c04070" },
            ].map(chip => (
              <div key={chip.label} style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                // Using semi-transparent hex instead of calculations for speed
                background: isDark ? `${chip.color}15` : `${chip.color}20`,
                border: `1px solid ${chip.color}${isDark ? "33" : "66"}`,
                borderRadius: 6,
                padding: "8px 16px",
                // Performance: Shadows are heavy on mobile. 
                // We remove it for dark mode and simplify it for light mode.
                boxShadow: isDark ? "none" : `0 2px 8px ${chip.color}10`,
                minWidth: "100px", // Prevents chips from collapsing on tiny screens
              }}>
                <span style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "clamp(14px, 2vw, 18px)",
                  fontWeight: 800, letterSpacing: "-0.02em",
                  color: chip.color,
                }}>
                  {chip.value}
                </span>
                <span style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: 8, letterSpacing: "0.15em", textTransform: "uppercase",
                  color: isDark ? "rgba(255,255,255,0.4)" : "rgba(10,18,18,0.5)",
                  marginTop: 2,
                  textAlign: "center"
                }}>
                  {chip.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}