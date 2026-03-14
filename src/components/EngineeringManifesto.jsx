import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

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
    // SVG schematic: expanding nodes
    Schematic: ({ color, isDark }) => (
      <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
        <line x1="60" y1="40" x2="20" y2="16" stroke={color} strokeWidth="0.75" strokeDasharray="3 3" opacity="0.5" />
        <line x1="60" y1="40" x2="100" y2="16" stroke={color} strokeWidth="0.75" strokeDasharray="3 3" opacity="0.5" />
        <line x1="60" y1="40" x2="16" y2="60" stroke={color} strokeWidth="0.75" strokeDasharray="3 3" opacity="0.5" />
        <line x1="60" y1="40" x2="104" y2="60" stroke={color} strokeWidth="0.75" strokeDasharray="3 3" opacity="0.5" />
        <line x1="60" y1="40" x2="60" y2="8" stroke={color} strokeWidth="0.75" strokeDasharray="3 3" opacity="0.5" />
        {/* center */}
        <circle cx="60" cy="40" r="7" stroke={color} strokeWidth="1.2" fill={color + "22"} />
        <circle cx="60" cy="40" r="3" fill={color} />
        {/* nodes */}
        {[[20, 16], [100, 16], [16, 60], [104, 60], [60, 8]].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="5" stroke={color} strokeWidth="1" fill={color + "18"} opacity={0.6 + i * 0.08} />
            <circle cx={x} cy={y} r="2" fill={color} opacity={0.7} />
          </g>
        ))}
        {/* outer ring hint */}
        <circle cx="60" cy="40" r="36" stroke={color} strokeWidth="0.4" opacity="0.15" strokeDasharray="2 4" />
      </svg>
    ),
  },
  {
    number: "02",
    tag: "Clean Architecture",
    title: "Atomic Logic.",
    subtitle: "The Precision Principle",
    color: "#5cbdb9",
    philosophy:
      "Complexity is the enemy of speed. I advocate for 'Atomic Logic'—breaking down complex business requirements into small, testable, and reusable units of code. If a function does more than one thing, it's not finished.",
    proof:
      "Standardizing component patterns and API responses isn't just about aesthetics; it's about reducing the cognitive load for the next engineer who touches the codebase.",
    // SVG schematic: modular grid blocks
    Schematic: ({ color, isDark }) => (
      <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
        {/* grid cells */}
        {[[8, 8, 34, 22], [46, 8, 34, 22], [84, 8, 28, 22],
        [8, 36, 28, 22], [44, 36, 34, 22], [86, 36, 26, 22],
        [8, 64, 52, 12], [68, 64, 44, 12]].map(([x, y, w, h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} rx="2"
            stroke={color} strokeWidth="0.8"
            fill={color + (i % 3 === 0 ? "22" : "0d")}
            opacity={0.5 + (i % 3) * 0.2}
          />
        ))}
        {/* connector lines between rows */}
        <line x1="25" y1="30" x2="25" y2="36" stroke={color} strokeWidth="0.6" opacity="0.4" />
        <line x1="63" y1="30" x2="63" y2="36" stroke={color} strokeWidth="0.6" opacity="0.4" />
        <line x1="34" y1="47" x2="34" y2="64" stroke={color} strokeWidth="0.6" opacity="0.4" />
        <line x1="86" y1="47" x2="86" y2="64" stroke={color} strokeWidth="0.6" opacity="0.4" />
        {/* highlight atom */}
        <rect x="46" y="8" width="34" height="22" rx="2" stroke={color} strokeWidth="1.4" fill="none" opacity="0.8" />
      </svg>
    ),
  },
  {
    number: "03",
    tag: "Business Impact",
    title: "Outcome-Driven.",
    subtitle: "The Impact Principle",
    color: "#5cbdb9",
    philosophy:
      "Technical excellence is a means, not an end. I bridge the gap between technical constraints and business objectives, ensuring that every line of code adds measurable value to the end-user experience.",
    proof:
      "I don't just ship features; I ship solutions. My engineering decisions are guided by data, performance metrics, and the ultimate goal of the product's roadmap.",
    // SVG schematic: upward trend with data points
    Schematic: ({ color, isDark }) => (
      <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
        {/* axes */}
        <line x1="16" y1="68" x2="110" y2="68" stroke={color} strokeWidth="0.8" opacity="0.4" />
        <line x1="16" y1="68" x2="16" y2="10" stroke={color} strokeWidth="0.8" opacity="0.4" />
        {/* grid lines */}
        {[54, 40, 26].map((y, i) => (
          <line key={i} x1="16" y1={y} x2="110" y2={y} stroke={color} strokeWidth="0.4" strokeDasharray="3 4" opacity="0.2" />
        ))}
        {/* area fill */}
        <path d="M16 68 L32 56 L50 48 L68 36 L86 24 L104 14 L104 68 Z"
          fill={color + "18"} />
        {/* trend line */}
        <path d="M16 68 L32 56 L50 48 L68 36 L86 24 L104 14"
          stroke={color} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
        {/* data points */}
        {[[16, 68], [32, 56], [50, 48], [68, 36], [86, 24], [104, 14]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i === 5 ? 4 : 2.5}
            fill={i === 5 ? color : color + "88"}
            stroke={i === 5 ? color : "none"}
          />
        ))}
        {/* arrow tip */}
        <path d="M100 10 L104 14 L108 10" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.8" />
      </svg>
    ),
  },
];

// ── Animated counter for the section number ──
function BlueprintNumber({ value, color, isDark }) {
  return (
    <span style={{
      fontFamily: "'Courier New', monospace",
      fontSize: "clamp(48px, 7vw, 80px)",
      fontWeight: 800,
      color: color,
      opacity: 0.7,
      lineHeight: 1,
      letterSpacing: "-0.04em",
      userSelect: "none",
      position: "absolute",
      top: -8,
      left: 0,
    }}>
      {value}
    </span>
  );
}

// ── Single principle card ──
function PrincipleCard({ principle, index, isDark }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { Schematic } = principle;

  const border = isDark ? `${principle.color}28` : `${principle.color}cc`;
  const cardBg = isDark ? `${principle.color}08` : "#ffffff";
  const textPri = isDark ? "#ffffff" : "#0a1a1a";
  const textSec = isDark ? "rgba(255,255,255,0.5)" : "rgba(10,26,26,0.45)";
  const textMid = isDark ? "rgba(255,255,255,0.75)" : "rgba(10,26,26,0.82)";
  const quoteBg = isDark ? `${principle.color}10` : `${principle.color}14`;


  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "relative",
        borderRadius: 2,
        background: cardBg,
        border: `1px solid ${border}`,
        padding: "clamp(24px, 4vw, 44px)",
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: 28,
        overflow: "hidden",
        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
      }}
      whileHover={{
        boxShadow: `0 0 40px ${principle.color}18`,
        borderColor: `${principle.color}55`,
      }}
    >
      {/* Large ghost number */}
      <BlueprintNumber value={principle.number} color={principle.color} isDark={isDark} />

      {/* Top row: tag + schematic */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20 }}>
        <div style={{ paddingTop: 4 }}>
          {/* Tag */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            marginBottom: 14,
          }}>
            <div style={{ width: 18, height: 1, background: principle.color, opacity: 0.7 }} />
            <span style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 10, letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: principle.color,
              opacity: 0.85,
            }}>
              {principle.tag}
            </span>
          </div>

          {/* Title */}
          <h3 style={{
            margin: 0,
            fontFamily: "'Courier New', monospace",
            fontSize: "clamp(22px, 3.5vw, 36px)",
            fontWeight: 800,
            color: textPri,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            maxWidth: 340,
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

        {/* Schematic */}
        <div style={{
          flexShrink: 0,
          width: "clamp(80px, 14vw, 130px)",
          height: "clamp(54px, 9vw, 86px)",
          opacity: 0.75,
        }}>
          <Schematic color={principle.color} isDark={isDark} />
        </div>
      </div>

      {/* Divider */}
      <div style={{
        height: 1,
        background: `linear-gradient(90deg, ${principle.color}55 0%, ${principle.color}00 100%)`,
        margin: "-8px 0",
      }} />

      {/* Philosophy */}
      <div>
        <span style={{
          display: "block",
          fontFamily: "'Courier New', monospace",
          fontSize: 9, letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: principle.color,
          marginBottom: 10, opacity: 0.7,
          fontWeight: 900,
        }}>
          // The Philosophy
        </span>
        <p style={{
          margin: 0,
          fontFamily: "'Courier New', monospace",
          fontSize: "clamp(12px, 1.4vw, 14px)",
          lineHeight: 1.8,
          color: textMid,
        }}>
          {principle.philosophy}
        </p>
      </div>

      {/* Proof quote */}
      <div style={{
        background: `${principle.color}10`,
        borderLeft: `2px solid ${principle.color}`,
        borderRadius: "0 4px 4px 0",
        padding: "14px 18px",
      }}>
        <span style={{
          display: "block",
          fontFamily: "'Courier New', monospace",
          fontSize: 9, letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: principle.color,
          marginBottom: 8, opacity: 0.7,
        }}>
          // Professional Proof
        </span>
        <p style={{
          margin: 0,
          fontFamily: "'Courier New', monospace",
          fontSize: "clamp(11px, 1.3vw, 13px)",
          lineHeight: 1.75,
          color: textMid,
          fontStyle: "italic",
        }}>
          "{principle.proof}"
        </p>
      </div>

      {/* Bottom rule with number */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        marginTop: -8,
      }}>
        <div style={{ flex: 1, height: 1, background: `${principle.color}20` }} />
        <span style={{
          fontFamily: "'Courier New', monospace",
          fontSize: 9, color: principle.color,
          opacity: 0.4, letterSpacing: "0.2em",
        }}>
          PRINCIPLE — {principle.number}
        </span>
      </div>
    </motion.div>
  );
}

// ── Main Export ──
export default function EngineeringManifesto() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  const bg = isDark ? "#000000" : "#ffffff";
  const gridLine = isDark ? "rgba(255,255,255,0.04)" : "rgba(92,189,185,0.12)";
  const textPri = isDark ? "#ffffff" : "#0a1a1a";
  const textSec = isDark ? "rgba(255,255,255,0.35)" : "rgba(10,26,26,0.55)";

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

      {/* Blueprint grid background */}
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
          width: 16, height: 16, pointerEvents: "none", zIndex: 1,
          borderTop: i < 2 ? `1px solid ${isDark ? "rgba(92,189,185,0.3)" : "rgba(92,189,185,0.85)"}` : "none",
          borderBottom: i >= 2 ? `1px solid ${isDark ? "rgba(92,189,185,0.3)" : "rgba(92,189,185,0.85)"}` : "none",
          borderLeft: i % 2 === 0 ? `1px solid ${isDark ? "rgba(92,189,185,0.3)" : "rgba(92,189,185,0.85)"}` : "none",
          borderRight: i % 2 === 1 ? `1px solid ${isDark ? "rgba(92,189,185,0.3)" : "rgba(92,189,185,0.85)"}` : "none",
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
            <div style={{ width: 32, height: 1, background: "#5cbdb9", opacity: 0.7 }} />
            <span style={{
              fontSize: 10, letterSpacing: "0.35em",
              textTransform: "uppercase", color: "#5cbdb9", opacity: 0.8,
            }}>
              Engineering Manifesto
            </span>
            <div style={{ width: 32, height: 1, background: "#5cbdb9", opacity: 0.7 }} />
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
              color: textPri,
            }}
          >
            Key Engineering
            <br />
            <span style={{
              background: "linear-gradient(135deg, #5cbdb9 0%, #fbe3e8 55%, #c9b8f5 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
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
              marginTop: 32, height: 1,
              background: `linear-gradient(90deg, #5cbdb9 0%, #fbe3e8 40%, #c9b8f5 70%, transparent 100%)`,
              opacity: isDark ? 0.35 : 0.7,
            }}
          />
        </div>

        {/* ── Principle cards ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
          gap: "clamp(16px, 3vw, 28px)",
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
          <div style={{
            flex: 1, height: 1, background: isDark ? "rgba(255,255,255,0.07)" : "rgba(10,100,90,0.2)"
          }} />
          <span style={{
            fontSize: 9, color: isDark ? "rgba(255,255,255,0.2)" : "rgba(10,80,70,0.55)",
            letterSpacing: "0.3em", textTransform: "uppercase",
          }}>
            Rajasekhar — Engineering Manifesto — v1.0
          </span>
          <div style={{
            flex: 1, height: 1, background: isDark ? "rgba(255,255,255,0.07)" : "rgba(10,100,90,0.2)"
          }} />
        </motion.div>

      </div>
    </section>
  );
}