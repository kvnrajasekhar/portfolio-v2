import { useRef, useEffect } from "react";
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

// ── Glowing meta circle ───────────────────────────────────────────────────────
function MetaCircle({ isDark }) {
  const canvasRef = useRef(null);
  const requestRef = useRef();
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      canvas.width = 500 * dpr;
      canvas.height = 500 * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();

    const draw = () => {
      timeRef.current += 0.015;
      const t = timeRef.current;
      const { width, height } = canvas.getBoundingClientRect();
      const cx = 250;
      const cy = 250;

      ctx.clearRect(0, 0, 500, 500);

      // --- 1. Background Glow Ring ---
      const gradient = ctx.createRadialGradient(cx, cy, 140, cx, cy, 180);
      gradient.addColorStop(0, isDark ? "rgba(186, 42, 226, 0)" : "rgba(42, 158, 154, 0)");
      gradient.addColorStop(0.5, isDark ? "rgba(226, 42, 158, 0.4)" : "rgba(42, 158, 154, 0.3)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.beginPath();
      ctx.arc(cx, cy, 180, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // --- 2. Dynamic Glowing Ring ---
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, 150, 0, Math.PI * 2);
      ctx.lineWidth = 3;
      ctx.strokeStyle = isDark ? "#ff2ae0" : "#2a9e9a";
      ctx.shadowBlur = 25;
      ctx.shadowColor = isDark ? "#ff2ae0" : "#2a9e9a";
      ctx.stroke();
      ctx.restore();

      // --- 3. Abstract Waves (The "Fluid" part) ---
      // We use 'lighter' to make overlapping lines glow brighter
      ctx.globalCompositeOperation = "lighter";

      const drawWave = (offset, color, amplitude, freq) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 5;
        ctx.shadowColor = color;

        for (let i = 0; i <= 360; i += 2) {
          const angle = (i * Math.PI) / 180;
          // Deform the radius using multiple sine waves
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

      // Wave Layers
      if (isDark) {
        drawWave(0, "rgba(0, 255, 255, 0.6)", 25, 0.5);   // Cyan
        drawWave(2, "rgba(186, 42, 226, 0.5)", 35, -0.3); // Purple
        drawWave(4, "rgba(42, 92, 255, 0.4)", 15, 0.8);  // Blue
      } else {
        drawWave(0, "rgba(0, 255, 255, 0.6)", 20, 0.4);  // Teal
        drawWave(2, "rgba(186, 42, 226, 0.5)", 35, -0.3);
        drawWave(4, "rgba(96, 64, 192, 0.4)", 30, -0.2);  // Violet
      }

      // --- 4. Particles (Floating Dots) ---
      for (let i = 0; i < 5; i++) {
        const pAngle = t * 0.5 + (i * Math.PI) / 2.5;
        const px = cx + Math.cos(pAngle) * 190;
        const py = cy + Math.sin(pAngle) * 190;

        ctx.beginPath();
        ctx.arc(px, py, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? "#fff" : "#2a9e9a";
        ctx.fill();
      }

      requestRef.current = requestAnimationFrame(draw);
    };

    requestRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isDark]);

  return (
    <div className="flex items-center justify-center">
      <canvas
        ref={canvasRef}
        style={{
          width: "400px",
          height: "400px",
          filter: "contrast(1.1) brightness(1.1)",
        }}
      />
    </div>
  );
};

// ── Stacked big words — NO gradient, uses solid + outline alternation ─────────
function BigWords({ isDark }) {
  // Solid colors per line — all visible in both themes
  const solidColors = isDark
    ? ["#5cbdb9", "#ffffff", "#c9b8f5", "#ffffff", "#fbe3e8", "#5cbdb9"]
    : ["#2a9e9a", "#0a1212", "#6040c0", "#0a1212", "#c04070", "#2a9e9a"];

  // Even lines = solid fill, odd lines = outline/stroke only
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "clamp(1px, 0.4vw, 3px)",
      lineHeight: 0.9,
      flex: 1,
      minWidth: 0,
    }}>
      {BIG_WORDS.map((word, i) => {
        const isOutline = i % 2 === 1;
        const color = solidColors[i];
        const delay = i * 0.08;

        return (
          <motion.div
            key={word}
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: "clamp(24px, 5vw, 66px)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
              lineHeight: 0.92,
              // Solid fill lines
              ...(!isOutline ? {
                color,
                textShadow: isDark
                  ? `0 0 40px ${color}55`
                  : "none",
              } : {
                // Outline/hollow lines
                color: "transparent",
                WebkitTextStroke: isDark
                  ? `1.5px rgba(255,255,255,0.22)`
                  : `1.5px ${color}55`,
              }),
            }}
          >
            {word}
          </motion.div>
        );
      })}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function PreFooter() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const bg = isDark ? "#000000" : "#ffffff";
  const textSec = isDark ? "rgba(255,255,255,0.42)" : "rgb(10, 18, 18)";
  const borderC = isDark ? "rgba(255,255,255,0.07)" : "rgba(10,100,90,0.15)";

  return (
    <section
      ref={ref}
      style={{
        width: "100%",
        background: bg,
        position: "relative",
        overflow: "hidden",
        // 100vh on desktop, auto on mobile
        minHeight: "clamp(auto, 100vh, 100vh)",
        height: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "clamp(36px,5vw,70px) clamp(20px,6vw,80px)",
        boxSizing: "border-box",
        transition: "background 0.4s ease",
        fontFamily: "'Courier New', monospace",
      }}
    >
      {/* Blueprint grid */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `
          linear-gradient(${isDark ? "rgba(255,255,255,0.03)" : "rgba(92,189,185,0.07)"} 1px, transparent 1px),
          linear-gradient(90deg, ${isDark ? "rgba(255,255,255,0.03)" : "rgba(92,189,185,0.07)"} 1px, transparent 1px)
        `,
        backgroundSize: "52px 52px",
      }} />

      {/* Corner marks */}
      {[
        { top: 24, left: 24 },
        { top: 24, right: 24 },
        { bottom: 24, left: 24 },
        { bottom: 24, right: 24 },
      ].map((pos, i) => (
        <div key={i} style={{
          position: "absolute", ...pos,
          width: 18, height: 18, pointerEvents: "none",
          borderTop: i < 2 ? `1.5px solid ${isDark ? "rgba(92,189,185,0.35)" : "rgba(42,158,154,0.6)"}` : "none",
          borderBottom: i >= 2 ? `1.5px solid ${isDark ? "rgba(92,189,185,0.35)" : "rgba(42,158,154,0.6)"}` : "none",
          borderLeft: i % 2 === 0 ? `1.5px solid ${isDark ? "rgba(92,189,185,0.35)" : "rgba(42,158,154,0.6)"}` : "none",
          borderRight: i % 2 === 1 ? `1.5px solid ${isDark ? "rgba(92,189,185,0.35)" : "rgba(42,158,154,0.6)"}` : "none",
        }} />
      ))}

      <div style={{
        maxWidth: 1100,
        margin: "0 auto",
        width: "100%",
        position: "relative",
        zIndex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "clamp(10px, 3vw, 40px)",
      }}>

        {/* ── Top label ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ display: "flex", alignItems: "center", gap: 12, padding: `clamp(0px, 0vw, 0px) clamp(12px, 3vw, 28px)` }}
        >
          <div style={{ width: 28, height: 1.5, background: isDark ? "#5cbdb9" : "#2a9e9a" }} />
          <span style={{
            fontSize: 10, letterSpacing: "0.35em", textTransform: "uppercase",
            color: isDark ? "#5cbdb9" : "#2a9e9a", fontWeight: 600,
          }}>
            Rajasekhar — Full Stack Engineer
          </span>
          <div style={{ width: 28, height: 1.5, background: isDark ? "#5cbdb9" : "#2a9e9a" }} />
        </motion.div>

        {/* ── Main row: words + circle ── */}
        <div style={{
          display: "flex",
          // column for mobile, row for desktop
          flexDirection: window.innerWidth < 768 ? "column" : "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "clamp(20px, 5vw, 40px)",
          flexWrap: "wrap",
        }}>
          <BigWords isDark={isDark} />
          <div style={{
            display: "flex",
            justifyContent: "center",
            width: window.innerWidth < 768 ? "100%" : "auto"
          }}>
            <MetaCircle isDark={isDark} />
          </div>
        </div>

        {/* ── Tagline ── */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            margin: 0,
            fontSize: "clamp(8px, 1.2vw, 12px)",
            color: textSec,
            lineHeight: 1.7,
            maxWidth: 440,
            letterSpacing: "0.02em",
          }}
        >
          Crafting enterprise-grade architecture with precision.
          From atomic components to distributed systems — built to last.
        </motion.p>

        {/* ── Divider ── */}
        <motion.div
          initial={{ scaleX: 0, originX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.6 }}
          style={{
            height: 1,
            background: isDark
              ? "linear-gradient(90deg, #5cbdb9, #c9b8f5 40%, #fbe3e8 70%, transparent)"
              : "linear-gradient(90deg, #2a9e9a, #6040c0 40%, #c04070 70%, transparent)",
            opacity: isDark ? 0.4 : 0.5,
          }}
        />

        {/* ── Bottom row: availability + stat chips ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.75 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 14,
          }}
        >
          {/* Availability */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ position: "relative", width: 9, height: 9 }}>
              <motion.div
                animate={{ scale: [1, 2.2, 1], opacity: [0.7, 0, 0.7] }}
                transition={{ repeat: Infinity, duration: 2 }}
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
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[
              { label: "Projects Shipped", value: "4+", color: isDark ? "#5cbdb9" : "#2a9e9a" },
              { label: "Stack Depth", value: "Full", color: isDark ? "#c9b8f5" : "#6040c0" },
              { label: "Experience", value: "1+ Yrs", color: isDark ? "#fbe3e8" : "#c04070" },
            ].map(chip => (
              <div key={chip.label} style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                background: isDark ? `${chip.color}10` : `${chip.color}25`,
                border: `1px solid ${chip.color}${isDark ? "33" : "77"}`,
                borderRadius: 6,
                padding: "8px 16px",
                boxShadow: isDark ? "none" : `0 2px 12px ${chip.color}16`,
              }}>
                <span style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "clamp(14px, 2vw, 20px)",
                  fontWeight: 800, letterSpacing: "-0.02em",
                  color: chip.color,
                }}>
                  {chip.value}
                </span>
                <span style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase",
                  color: isDark ? "rgba(255,255,255,0.35)" : "rgba(10,18,18,0.45)",
                  marginTop: 2,
                }}>
                  {chip.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Footer text ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1 }}
          style={{ display: "flex", alignItems: "center", gap: 16 }}
        >
          <div style={{ flex: 1, height: 1, background: borderC }} />
          <span style={{
            fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase",
            color: isDark ? "rgba(255,255,255,0.18)" : "rgba(10, 80, 70, 0.96)",
          }}>
            V N Rajasekhar  — Portfolio — {new Date().getFullYear()}
          </span>
          <div style={{ flex: 1, height: 1, background: borderC }} />
        </motion.div>

      </div>
    </section>
  );
}