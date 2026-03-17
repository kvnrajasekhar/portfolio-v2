import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

// ── Dark variants for light mode legibility ──
const DARK_VARIANTS = {
  "#5cbdb9": "#2a9e9a",
  "#fbe3e8": "#c04070",
  "#c9b8f5": "#6040c0",
};

const PRINCIPLES = [
  {
    number: "01",
    tag: "Scalability",
    title: "I build for growth.",
    subtitle: "The Growth Principle",
    color: "#5cbdb9",
    philosophy:
      "Systems should be built to fail gracefully and scale effortlessly. I prioritize statelessness and modularity, ensuring that a single node failure doesn't become a system-wide catastrophe.",
    proof:
      "My focus is on decoupling services. Whether managing message brokers or microservices, I build for the 10x traffic spike, not just the current load.",
    Schematic: ({ color }) => (
      <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
        <line x1="60" y1="40" x2="20" y2="16" stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
        <line x1="60" y1="40" x2="100" y2="16" stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
        <line x1="60" y1="40" x2="16" y2="60" stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
        <line x1="60" y1="40" x2="104" y2="60" stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
        <line x1="60" y1="40" x2="60" y2="8" stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
        <circle cx="60" cy="40" r="7" stroke={color} strokeWidth="1.5" fill={color + "33"} />
        <circle cx="60" cy="40" r="3" fill={color} />
        {[[20, 16], [100, 16], [16, 60], [104, 60], [60, 8]].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="5" stroke={color} strokeWidth="1.2" fill={color + "28"} opacity={0.7 + i * 0.06} />
            <circle cx={x} cy={y} r="2.2" fill={color} opacity={0.85} />
          </g>
        ))}
        <circle cx="60" cy="40" r="36" stroke={color} strokeWidth="0.5" opacity="0.2" strokeDasharray="2 4" />
      </svg>
    ),
  },
  {
    number: "02",
    tag: "Clean Architecture",
    title: "Atomic Logic.",
    subtitle: "The Precision Principle",
    color: "#fbe3e8",
    philosophy:
      "Complexity is the enemy of speed. I advocate for 'Atomic Logic'—breaking down complex business requirements into small, testable, and reusable units of code. If a function does more than one thing, it's not finished.",
    proof:
      "Standardizing component patterns and API responses isn't just about aesthetics; it's about reducing the cognitive load for the next engineer who touches the codebase.",
    Schematic: ({ color }) => (
      <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
        {[[8, 8, 34, 22], [46, 8, 34, 22], [84, 8, 28, 22],
        [8, 36, 28, 22], [44, 36, 34, 22], [86, 36, 26, 22],
        [8, 64, 52, 12], [68, 64, 44, 12]].map(([x, y, w, h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} rx="2"
            stroke={color} strokeWidth="1"
            fill={color + (i % 3 === 0 ? "33" : "18")}
            opacity={0.6 + (i % 3) * 0.2}
          />
        ))}
        <line x1="25" y1="30" x2="25" y2="36" stroke={color} strokeWidth="0.8" opacity="0.55" />
        <line x1="63" y1="30" x2="63" y2="36" stroke={color} strokeWidth="0.8" opacity="0.55" />
        <line x1="34" y1="47" x2="34" y2="64" stroke={color} strokeWidth="0.8" opacity="0.55" />
        <line x1="86" y1="47" x2="86" y2="64" stroke={color} strokeWidth="0.8" opacity="0.55" />
        <rect x="46" y="8" width="34" height="22" rx="2" stroke={color} strokeWidth="1.8" fill="none" opacity="0.9" />
      </svg>
    ),
  },
  {
    number: "03",
    tag: "Business Impact",
    title: "Outcome-Driven.",
    subtitle: "The Impact Principle",
    color: "#c9b8f5",
    philosophy:
      "Technical excellence is a means, not an end. I bridge the gap between technical constraints and business objectives, ensuring that every line of code adds measurable value to the end-user experience.",
    proof:
      "I don't just ship features; I ship solutions. My engineering decisions are guided by data, performance metrics, and the ultimate goal of the product's roadmap.",
    Schematic: ({ color }) => (
      <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
        <line x1="16" y1="68" x2="110" y2="68" stroke={color} strokeWidth="1" opacity="0.55" />
        <line x1="16" y1="68" x2="16" y2="10" stroke={color} strokeWidth="1" opacity="0.55" />
        {[54, 40, 26].map((y, i) => (
          <line key={i} x1="16" y1={y} x2="110" y2={y} stroke={color} strokeWidth="0.5" strokeDasharray="3 4" opacity="0.3" />
        ))}
        <path d="M16 68 L32 56 L50 48 L68 36 L86 24 L104 14 L104 68 Z" fill={color + "28"} />
        <path d="M16 68 L32 56 L50 48 L68 36 L86 24 L104 14"
          stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {[[16, 68], [32, 56], [50, 48], [68, 36], [86, 24], [104, 14]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i === 5 ? 4.5 : 3}
            fill={i === 5 ? color : color + "99"}
            stroke={i === 5 ? color : "none"}
          />
        ))}
        <path d="M100 10 L104 14 L108 10" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.9" />
      </svg>
    ),
  },
];

// ── Ghost number ──────────────────────────────────────────────────────────────
function BlueprintNumber({ value, color, isDark }) {
  return (
    <span style={{
      fontFamily: "'Courier New', monospace",
      fontSize: "clamp(48px, 7vw, 80px)",
      fontWeight: 800,
      color: isDark ? color : DARK_VARIANTS[color] || color,
      // Light mode: very faint so it doesn't fight the content
      opacity: isDark ? 0.1 : 0.07,
      lineHeight: 1,
      letterSpacing: "-0.04em",
      userSelect: "none",
      position: "absolute",
      top: -8,
      left: 0,
      pointerEvents: "none",
    }}>
      {value}
    </span>
  );
}

// ── Principle card ────────────────────────────────────────────────────────────
function PrincipleCard({ principle, index, isDark }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { Schematic } = principle;

  // In light mode use dark variants so everything is visible on white
  const displayColor = isDark ? principle.color : DARK_VARIANTS[principle.color] || principle.color;

  const cardBg = isDark ? `${principle.color}08` : "#ffffff";
  const cardBorder = isDark ? `${principle.color}30` : `${displayColor}66`;
  const textPri = isDark ? "#ffffff" : "#0a1212";
  const textSec = isDark ? "rgba(255,255,255,0.45)" : "rgba(10,18,18,0.5)";
  const textMid = isDark ? "rgba(255,255,255,0.75)" : "rgba(10,18,18,0.78)";
  const quoteBg = isDark ? `${principle.color}10` : `${displayColor}0e`;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        boxShadow: isDark
          ? `0 0 40px ${principle.color}18`
          : `0 8px 40px ${displayColor}1a`,
        y: -3,
      }}
      style={{
        position: "relative",
        borderRadius: 6,
        background: cardBg,
        // Light mode: strong visible border + coloured top accent
        border: `1px solid ${cardBorder}`,
        borderTop: isDark ? `1px solid ${cardBorder}` : `3px solid ${displayColor}`,
        padding: "clamp(24px, 4vw, 44px)",
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: 24,
        overflow: "hidden",
        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
        // Light mode shadow so tile "lifts" off white page
        boxShadow: isDark ? "none" : `0 2px 20px ${displayColor}12`,
      }}
    >
      {/* Blueprint micro-grid */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: isDark
          ? `linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)`
          : `linear-gradient(${displayColor}0d 1px, transparent 1px), linear-gradient(90deg, ${displayColor}0d 1px, transparent 1px)`,
        backgroundSize: "28px 28px",
        zIndex: 0,
      }} />

      {/* Corner glow */}
      <div style={{
        position: "absolute", top: 0, right: 0,
        width: 90, height: 90, pointerEvents: "none",
        background: `radial-gradient(circle at top right, ${isDark ? principle.color + "1a" : displayColor + "18"}, transparent 70%)`,
        zIndex: 0,
      }} />

      <div style={{ position: "relative", zIndex: 1, display: "contents" }}>

        {/* Ghost number */}
        <BlueprintNumber value={principle.number} color={principle.color} isDark={isDark} />

        {/* Top row: tag + title + schematic */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20 }}>
          <div style={{ paddingTop: 4 }}>
            {/* Tag */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
              <div style={{ width: 18, height: 1.5, background: displayColor, borderRadius: 1 }} />
              <span style={{
                fontFamily: "'Courier New', monospace",
                fontSize: 10, letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: displayColor,
                fontWeight: 600,
              }}>
                {principle.tag}
              </span>
            </div>

            {/* Title */}
            <h3 style={{
              margin: 0,
              fontFamily: "'Courier New', monospace",
              fontSize: "clamp(20px, 3.2vw, 34px)",
              fontWeight: 800,
              color: textPri,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              maxWidth: 320,
            }}>
              {principle.title}
            </h3>
            <p style={{
              margin: "6px 0 0",
              fontFamily: "'Courier New', monospace",
              fontSize: 11, color: textSec,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}>
              {principle.subtitle}
            </p>
          </div>

          {/* Schematic — pass displayColor so it's visible in both modes */}
          <div style={{
            flexShrink: 0,
            width: "clamp(80px, 13vw, 126px)",
            height: "clamp(54px, 8.5vw, 84px)",
          }}>
            <Schematic color={displayColor} isDark={isDark} />
          </div>
        </div>

        {/* Divider */}
        <div style={{
          height: 1,
          background: `linear-gradient(90deg, ${displayColor}66 0%, ${displayColor}00 100%)`,
          margin: "-4px 0",
        }} />

        {/* Philosophy */}
        <div>
          <span style={{
            display: "block",
            fontFamily: "'Courier New', monospace",
            fontSize: 9, letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: displayColor,
            marginBottom: 10,
            fontWeight: 700,
          }}>
            // The Philosophy
          </span>
          <p style={{
            margin: 0,
            fontFamily: "'Courier New', monospace",
            fontSize: "clamp(12px, 1.35vw, 14px)",
            lineHeight: 1.8,
            color: textMid,
          }}>
            {principle.philosophy}
          </p>
        </div>

        {/* Proof quote */}
        <div style={{
          background: quoteBg,
          borderLeft: `2.5px solid ${displayColor}`,
          borderRadius: "0 5px 5px 0",
          padding: "14px 18px",
          // Extra visibility in light mode
          boxShadow: isDark ? "none" : `inset 0 0 0 1px ${displayColor}1a`,
        }}>
          <span style={{
            display: "block",
            fontFamily: "'Courier New', monospace",
            fontSize: 9, letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: displayColor,
            marginBottom: 8,
            fontWeight: 700,
          }}>
            // Professional Proof
          </span>
          <p style={{
            margin: 0,
            fontFamily: "'Courier New', monospace",
            fontSize: "clamp(11px, 1.25vw, 13px)",
            lineHeight: 1.75,
            color: textMid,
            fontStyle: "italic",
          }}>
            "{principle.proof}"
          </p>
        </div>

        {/* Bottom rule */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: -4 }}>
          <div style={{ flex: 1, height: 1, background: `${displayColor}25` }} />
          <span style={{
            fontFamily: "'Courier New', monospace",
            fontSize: 9, color: displayColor,
            opacity: isDark ? 0.4 : 0.55,
            letterSpacing: "0.2em",
          }}>
            PRINCIPLE — {principle.number}
          </span>
        </div>

      </div>
    </motion.div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function EngineeringManifesto() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  const bg = isDark ? "#000000" : "#ffffff";
  const gridLine = isDark ? "rgba(255,255,255,0.04)" : "rgba(92,189,185,0.1)";
  const textPri = isDark ? "#ffffff" : "#0a1212";
  const textSec = isDark ? "rgba(255,255,255,0.35)" : "rgba(10,18,18,0.55)";

  return (
    <section style={{
      width: "100%",
      background: bg,
      position: "relative",
      padding: "clamp(60px, 10vw, 120px) clamp(20px, 6vw, 80px)",
      fontFamily: "'Courier New', monospace",
      overflow: "hidden",
      transition: "background 0.4s ease",
    }}>

      {/* Blueprint grid */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `
          linear-gradient(${gridLine} 1px, transparent 1px),
          linear-gradient(90deg, ${gridLine} 1px, transparent 1px)
        `,
        backgroundSize: "48px 48px",
        zIndex: 0,
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
          width: 18, height: 18, pointerEvents: "none", zIndex: 1,
          borderTop: i < 2 ? `1.5px solid ${isDark ? "rgba(92,189,185,0.3)" : "rgba(42,158,154,0.7)"}` : "none",
          borderBottom: i >= 2 ? `1.5px solid ${isDark ? "rgba(92,189,185,0.3)" : "rgba(42,158,154,0.7)"}` : "none",
          borderLeft: i % 2 === 0 ? `1.5px solid ${isDark ? "rgba(92,189,185,0.3)" : "rgba(42,158,154,0.7)"}` : "none",
          borderRight: i % 2 === 1 ? `1.5px solid ${isDark ? "rgba(92,189,185,0.3)" : "rgba(42,158,154,0.7)"}` : "none",
        }} />
      ))}

      <div style={{ position: "relative", zIndex: 2, maxWidth: 1100, margin: "0 auto" }}>

        {/* ── Header ── */}
        <div ref={headerRef} style={{ marginBottom: "clamp(40px, 7vw, 80px)" }}>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={headerInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}
          >
            <div style={{ width: 32, height: 1.5, background: isDark ? "#5cbdb9" : "#2a9e9a", opacity: isDark ? 0.7 : 0.9 }} />
            <span style={{
              fontSize: 10, letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: isDark ? "#5cbdb9" : "#2a9e9a",
              fontWeight: 600,
            }}>
              Engineering Manifesto
            </span>
            <div style={{ width: 32, height: 1.5, background: isDark ? "#5cbdb9" : "#2a9e9a", opacity: isDark ? 0.7 : 0.9 }} />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{
              margin: 0,
              fontSize: "clamp(28px, 5vw, 58px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              // Force the main heading to use its own color variable
              color: textPri,
            }}
          >
            Key Engineering
            <br />
            <span style={{
              display: "inline-block",
              padding: "4px 16px",
              margin: "0 4px",
              borderRadius: "12px",
              backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
              border: `1px solid ${isDark ? "rgba(92, 189, 185, 0.3)" : "rgba(42, 158, 154, 0.3)"}`,
              color: isDark ? "#5cbdb9" : "#2a9e9a",
              fontSize: "0.95em", // Slightly smaller to look like a tag
              verticalAlign: "middle"
            }}>
              Principles.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.22 }}
            style={{
              margin: "18px 0 0",
              fontSize: "clamp(12px, 1.4vw, 14px)",
              color: textSec,
              letterSpacing: "0.08em",
              maxWidth: 480,
              lineHeight: 1.7,
            }}
          >
            The mindsets that guide every architecture decision,
            every pull request, and every system I build.
          </motion.p>

          {/* Horizontal rule */}
          <motion.div
            initial={{ scaleX: 0, originX: 0 }}
            animate={headerInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.3 }}
            style={{
              marginTop: 32, height: 1.5,
              background: isDark
                ? `linear-gradient(90deg, #5cbdb9 0%, #fbe3e8 40%, #c9b8f5 70%, transparent 100%)`
                : `linear-gradient(90deg, #2a9e9a 0%, #c04070 40%, #6040c0 70%, transparent 100%)`,
              opacity: isDark ? 0.35 : 0.55,
            }}
          />
        </div>

        {/* ── Cards grid ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
          gap: "clamp(16px, 2.5vw, 28px)",
          alignItems: "start",
        }}>
          {PRINCIPLES.map((p, i) => (
            <PrincipleCard key={p.number} principle={p} index={i} isDark={isDark} />
          ))}
        </div>

        {/* ── Footer rule ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          style={{
            marginTop: "clamp(40px, 6vw, 64px)",
            display: "flex", alignItems: "center", gap: 16,
          }}
        >
          <div style={{ flex: 1, height: 1, background: isDark ? "rgba(255,255,255,0.07)" : "rgba(10,100,90,0.2)" }} />
          <span style={{
            fontSize: 9,
            color: isDark ? "rgba(255,255,255,0.2)" : "rgba(10,80,70,0.5)",
            letterSpacing: "0.3em", textTransform: "uppercase",
          }}>
            Rajasekhar — Engineering Manifesto — v1.0
          </span>
          <div style={{ flex: 1, height: 1, background: isDark ? "rgba(255,255,255,0.07)" : "rgba(10,100,90,0.2)" }} />
        </motion.div>

      </div>
    </section>
  );
}