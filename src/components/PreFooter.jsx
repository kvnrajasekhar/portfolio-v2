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
  const animRef   = useRef(null);
  const tickRef   = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const S   = 400;
    canvas.width  = S * dpr;
    canvas.height = S * dpr;
    ctx.scale(dpr, dpr);
    const cx = S / 2, cy = S / 2;

    const draw = () => {
      tickRef.current += 0.006;
      const t = tickRef.current;
      ctx.clearRect(0, 0, S, S);

      // ── Outer diffused halo layers ──
      const haloColors = isDark
        ? ["#5cbdb9", "#c9b8f5", "#fbe3e8"]
        : ["#2a9e9a", "#6040c0", "#c04070"];

      haloColors.forEach((col, i) => {
        const r   = 155 + i * 18 + 12 * Math.sin(t * 0.6 + i * 1.2);
        const off = 18 * Math.sin(t * 0.4 + i * 2.1);
        const g   = ctx.createRadialGradient(cx + off, cy + off * 0.6, 0, cx, cy, r);
        g.addColorStop(0,   col + (isDark ? "44" : "55"));
        g.addColorStop(0.55, col + "18");
        g.addColorStop(1,   col + "00");
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      });

      // ── Main sphere ──
      const sphereR = 95 + 3 * Math.sin(t * 0.8);
      const sg = ctx.createRadialGradient(
        cx - sphereR * 0.32, cy - sphereR * 0.32, sphereR * 0.05,
        cx, cy, sphereR
      );
      if (isDark) {
        sg.addColorStop(0,    "rgba(255,255,255,0.22)");
        sg.addColorStop(0.2,  "rgba(92,189,185,0.85)");
        sg.addColorStop(0.55, "rgba(201,184,245,0.75)");
        sg.addColorStop(0.85, "rgba(251,227,232,0.55)");
        sg.addColorStop(1,    "rgba(92,189,185,0.15)");
      } else {
        sg.addColorStop(0,    "rgba(255,255,255,0.55)");
        sg.addColorStop(0.2,  "rgba(42,158,154,0.82)");
        sg.addColorStop(0.55, "rgba(96,64,192,0.72)");
        sg.addColorStop(0.85, "rgba(192,64,112,0.55)");
        sg.addColorStop(1,    "rgba(42,158,154,0.18)");
      }
      ctx.save();
      ctx.shadowBlur  = isDark ? 48 : 32;
      ctx.shadowColor = isDark ? "#5cbdb9" : "#2a9e9a";
      ctx.beginPath();
      ctx.arc(cx, cy, sphereR, 0, Math.PI * 2);
      ctx.fillStyle = sg;
      ctx.fill();
      ctx.restore();

      // ── Specular highlight ──
      const hl = ctx.createRadialGradient(
        cx - sphereR * 0.3, cy - sphereR * 0.35, 0,
        cx - sphereR * 0.2, cy - sphereR * 0.2, sphereR * 0.55
      );
      hl.addColorStop(0,   "rgba(255,255,255,0.55)");
      hl.addColorStop(0.5, "rgba(255,255,255,0.08)");
      hl.addColorStop(1,   "rgba(255,255,255,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, sphereR, 0, Math.PI * 2);
      ctx.fillStyle = hl;
      ctx.fill();

      // ── Rim glow ring ──
      const ringR = sphereR + 10 + 4 * Math.sin(t * 1.2);
      const rg = ctx.createRadialGradient(cx, cy, sphereR - 4, cx, cy, ringR + 8);
      rg.addColorStop(0,   isDark ? "rgba(92,189,185,0.55)" : "rgba(42,158,154,0.5)");
      rg.addColorStop(0.5, isDark ? "rgba(201,184,245,0.2)" : "rgba(96,64,192,0.2)");
      rg.addColorStop(1,   "rgba(0,0,0,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, ringR + 8, 0, Math.PI * 2);
      ctx.fillStyle = rg;
      ctx.fill();

      // ── Orbiting dot ──
      const orbitR  = sphereR + 22 + 4 * Math.sin(t * 0.5);
      const orbitX  = cx + Math.cos(t * 0.7) * orbitR;
      const orbitY  = cy + Math.sin(t * 0.7) * orbitR * 0.45;
      const dotCol  = isDark ? "#fbe3e8" : "#c04070";
      ctx.save();
      ctx.shadowBlur  = 14;
      ctx.shadowColor = dotCol;
      ctx.beginPath();
      ctx.arc(orbitX, orbitY, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = dotCol;
      ctx.fill();
      ctx.restore();

      // ── Second smaller orbiting dot ──
      const orbit2X = cx + Math.cos(t * 0.5 + Math.PI) * (orbitR - 10);
      const orbit2Y = cy + Math.sin(t * 0.5 + Math.PI) * (orbitR - 10) * 0.4;
      const dot2Col = isDark ? "#c9b8f5" : "#6040c0";
      ctx.save();
      ctx.shadowBlur  = 10;
      ctx.shadowColor = dot2Col;
      ctx.beginPath();
      ctx.arc(orbit2X, orbit2Y, 3, 0, Math.PI * 2);
      ctx.fillStyle = dot2Col;
      ctx.fill();
      ctx.restore();

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width:  "clamp(200px, 30vw, 340px)",
        height: "clamp(200px, 30vw, 340px)",
        display: "block",
        flexShrink: 0,
      }}
    />
  );
}

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
        const color     = solidColors[i];
        const delay     = i * 0.08;

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
  const isDark    = theme === "dark";
  const ref       = useRef(null);
  const inView    = useInView(ref, { once: true, margin: "-80px" });

  const bg      = isDark ? "#000000" : "#ffffff";
  const textSec = isDark ? "rgba(255,255,255,0.42)" : "rgba(10,18,18,0.52)";
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
          borderTop:    i < 2  ? `1.5px solid ${isDark ? "rgba(92,189,185,0.35)" : "rgba(42,158,154,0.6)"}` : "none",
          borderBottom: i >= 2 ? `1.5px solid ${isDark ? "rgba(92,189,185,0.35)" : "rgba(42,158,154,0.6)"}` : "none",
          borderLeft:   i % 2 === 0 ? `1.5px solid ${isDark ? "rgba(92,189,185,0.35)" : "rgba(42,158,154,0.6)"}` : "none",
          borderRight:  i % 2 === 1 ? `1.5px solid ${isDark ? "rgba(92,189,185,0.35)" : "rgba(42,158,154,0.6)"}` : "none",
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
          style={{ display: "flex", alignItems: "center", gap: 12 , padding:`clamp(0px, 0vw, 0px) clamp(12px, 3vw, 28px)`}}
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
          alignItems: "center",
          justifyContent: "space-between",
          gap: "clamp(8px, 3vw, 30px)",
          flexWrap: "wrap",
        }}>
          <BigWords isDark={isDark} />
          <MetaCircle isDark={isDark} />
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
              { label: "Projects Shipped", value: "4+",    color: isDark ? "#5cbdb9"  : "#2a9e9a" },
              { label: "Stack Depth",      value: "Full",   color: isDark ? "#c9b8f5"  : "#6040c0" },
              { label: "Experience",       value: "1+ Yrs", color: isDark ? "#fbe3e8"  : "#c04070" },
            ].map(chip => (
              <div key={chip.label} style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                background: isDark ? `${chip.color}10` : "#ffffff",
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
            color: isDark ? "rgba(255,255,255,0.18)" : "rgba(10,80,70,0.4)",
          }}>
            V N Rajasekhar  — Portfolio — {new Date().getFullYear()}
          </span>
          <div style={{ flex: 1, height: 1, background: borderC }} />
        </motion.div>

      </div>
    </section>
  );
}