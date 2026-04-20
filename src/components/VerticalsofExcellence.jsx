import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

// ─── Network pulse canvas ─────────────────────────────────────────────────────
function NetworkCanvas({ color, isDark }) {
    const canvasRef = useRef(null);
    const animRef = useRef(null);
    const tickRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const dpr = window.devicePixelRatio || 1;
        const W = canvas.clientWidth, H = canvas.clientHeight;
        canvas.width = W * dpr; canvas.height = H * dpr;
        ctx.scale(dpr, dpr);

        const nodes = Array.from({ length: 9 }, () => ({
            x: 14 + Math.random() * (W - 28),
            y: 10 + Math.random() * (H - 20),
            r: 2.5 + Math.random() * 2,
            phase: Math.random() * Math.PI * 2,
        }));
        const edges = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [0, 4], [2, 6], [1, 5], [3, 7]];

        const draw = () => {
            tickRef.current += 0.018;
            const t = tickRef.current;
            ctx.clearRect(0, 0, W, H);

            edges.forEach(([a, b]) => {
                const pulse = 0.25 + 0.2 * Math.sin(t + nodes[a].phase);
                ctx.beginPath();
                ctx.moveTo(nodes[a].x, nodes[a].y);
                ctx.lineTo(nodes[b].x, nodes[b].y);
                // much stronger alpha in light mode
                ctx.strokeStyle = isDark
                    ? color + Math.round(pulse * 255).toString(16).padStart(2, "0")
                    : color + "bb";
                ctx.lineWidth = isDark ? 0.8 : 1.2;
                ctx.stroke();
            });

            nodes.forEach((n) => {
                const glow = 0.6 + 0.4 * Math.sin(t * 1.2 + n.phase);
                ctx.save();
                ctx.shadowBlur = isDark ? 8 * glow : 12 * glow;
                ctx.shadowColor = color;
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.r * (0.85 + 0.3 * glow), 0, Math.PI * 2);
                // full opacity in light mode
                ctx.fillStyle = isDark
                    ? color + Math.round((0.55 + 0.45 * glow) * 255).toString(16).padStart(2, "0")
                    : color;
                ctx.fill();
                ctx.restore();
            });

            animRef.current = requestAnimationFrame(draw);
        };
        animRef.current = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(animRef.current);
    }, [color, isDark]);

    return <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />;
}

// ─── Performance Metrics Canvas ───────────────────────────────────────────────────
function PerformanceMetricsCanvas({ color, isDark }) {
    const canvasRef = useRef(null);
    const animRef = useRef(null);
    const tickRef = useRef(0);
    const barHeightsRef = useRef([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const dpr = window.devicePixelRatio || 1;
        const W = canvas.clientWidth, H = canvas.clientHeight;
        canvas.width = W * dpr; canvas.height = H * dpr;
        ctx.scale(dpr, dpr);

        // 5 performance bars with fixed varied heights
        const barCount = 5;
        if (barHeightsRef.current.length === 0) {
            barHeightsRef.current = [0.85, 0.55, 0.75, 0.45, 0.90]; // Different base heights
        }

        const barWidth = (W * 0.7) / barCount;
        const barGap = 10;
        const startX = (W - (barCount * barWidth + (barCount - 1) * barGap)) / 2;
        const baselineY = H * 0.72;
        const maxHeight = H * 0.55;

        const draw = () => {
            tickRef.current += 0.015;
            const t = tickRef.current;
            ctx.clearRect(0, 0, W, H);

            // Draw baseline
            ctx.beginPath();
            ctx.moveTo(startX - 12, baselineY);
            ctx.lineTo(startX + barCount * barWidth + (barCount - 1) * barGap + 12, baselineY);
            ctx.strokeStyle = isDark ? color + "18" : color + "33";
            ctx.lineWidth = 0.8;
            ctx.stroke();

            // Draw animated bars
            for (let i = 0; i < barCount; i++) {
                const baseHeight = barHeightsRef.current[i];
                // Subtle pulse animation - each bar pulses independently
                const pulse = 0.95 + 0.08 * Math.sin(t * 2.5 + i * 0.8);
                const finalHeight = maxHeight * baseHeight * pulse;
                const x = startX + i * (barWidth + barGap);
                const y = baselineY - finalHeight;

                // Bar background (very faint)
                ctx.fillStyle = isDark ? color + "0a" : color + "15";
                ctx.fillRect(x, baselineY - maxHeight * baseHeight, barWidth, maxHeight * baseHeight);

                // Animated bar with gradient
                const gradient = ctx.createLinearGradient(x, y, x, baselineY);
                gradient.addColorStop(0, color);
                gradient.addColorStop(0.5, isDark ? color + "88" : color + "bb");
                gradient.addColorStop(1, isDark ? color + "44" : color + "88");

                ctx.save();
                ctx.shadowBlur = 10;
                ctx.shadowColor = color;
                ctx.fillStyle = gradient;
                ctx.fillRect(x, y, barWidth, finalHeight);
                ctx.restore();

                // Top accent cap
                ctx.fillStyle = isDark ? color + "99" : color;
                ctx.fillRect(x, y - 1.5, barWidth, 2);
            }

            animRef.current = requestAnimationFrame(draw);
        };
        animRef.current = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(animRef.current);
    }, [color, isDark]);

    return <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />;
}

// ─── Battery icon ─────────────────────────────────────────────────────────────
function Battery({ color, isDark, pct = 99 }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{
                position: "relative", width: 40, height: 20,
                border: `2px solid ${color}`,
                borderRadius: 4,
                display: "flex", alignItems: "center",
                boxShadow: isDark ? `0 0 8px ${color}44` : `0 0 10px ${color}66`,
            }}>
                <div style={{
                    position: "absolute", right: -6, top: "50%",
                    transform: "translateY(-50%)",
                    width: 5, height: 10,
                    background: color,
                    borderRadius: "0 3px 3px 0",
                }} />
                <div style={{
                    margin: 2, height: "calc(100% - 4px)",
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, ${color}bb, ${color})`,
                    borderRadius: 2,
                    boxShadow: `0 0 8px ${color}`,
                }} />
            </div>
            <span style={{
                color,
                fontFamily: "'Courier New', monospace",
                fontSize: 12,
                fontWeight: 800,
                textShadow: isDark ? "none" : `0 0 8px ${color}66`,
            }}>
                {pct}%
            </span>
        </div>
    );
}

// ─── Palette swatch ───────────────────────────────────────────────────────────
function PaletteSwatch({ isDark }) {
    const swatches = [
        { hex: "#5cbdb9" },
        { hex: "#fbe3e8" },
        { hex: "#c9b8f5" },
        { hex: isDark ? "#0a0a0a" : "#f0f0f0" },
    ];
    return (
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            {swatches.map((s) => (
                <div key={s.hex} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                    <div style={{
                        width: "clamp(22px,3.5vw,32px)",
                        height: "clamp(32px,5vw,46px)",
                        borderRadius: 5,
                        background: s.hex,
                        border: isDark ? "1.5px solid rgba(255,255,255,0.15)" : "1.5px solid rgba(0,0,0,0.15)",
                        boxShadow: `0 3px 10px ${s.hex}77`,
                    }} />
                    <span style={{
                        fontFamily: "'Courier New', monospace",
                        fontSize: "clamp(6px,0.8vw,8px)",
                        color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.55)",
                        letterSpacing: "0.02em",
                    }}>
                        {s.hex.toUpperCase()}
                    </span>
                </div>
            ))}
        </div>
    );
}

// ─── Flask icon ───────────────────────────────────────────────────────────────
function FlaskIcon({ color, isDark }) {
    return (
        <svg width="38" height="46" viewBox="0 0 38 46" fill="none">
            <path d="M13 4V19L3 34C1.5 37.5 3.5 41 7.5 41H30.5C34.5 41 36.5 37.5 35 34L25 19V4"
                stroke={color} strokeWidth={isDark ? 1.5 : 2} strokeLinecap="round" strokeLinejoin="round" />
            <line x1="11" y1="4" x2="27" y2="4" stroke={color} strokeWidth={isDark ? 1.5 : 2} strokeLinecap="round" />
            <circle cx="12" cy="33" r="2.5" fill={color} opacity={isDark ? 0.7 : 0.9} />
            <circle cx="22" cy="36" r="2" fill={color} opacity={isDark ? 0.55 : 0.75} />
            <circle cx="27" cy="30" r="1.5" fill={color} opacity={isDark ? 0.65 : 0.85} />
            <path d="M5 28H33" stroke={color} strokeWidth="0.8" strokeDasharray="2 3" opacity={isDark ? 0.3 : 0.4} />
            <path d="M16 6 Q14 13 12 22" stroke={isDark ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.7)"} strokeWidth="1.4" strokeLinecap="round" />
        </svg>
    );
}

// ─── People/Team icon ──────────────────────────────────────────────────────────
function PeopleTeamIcon({ color, isDark }) {
    return (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            {/* Left person */}
            <circle cx="14" cy="12" r="5.5" stroke={color} strokeWidth={isDark ? 1.2 : 1.8} fill={color + (isDark ? "22" : "33")} />
            <path d="M6 28 C6 21 10 18 14 18 C18 18 22 21 22 28 V38"
                stroke={color} strokeWidth={isDark ? 1.2 : 1.8} fill="none" strokeLinecap="round" />

            {/* Center person (elevated/leading) */}
            <circle cx="24" cy="8" r="6.5" stroke={color} strokeWidth={isDark ? 1.4 : 2} fill={color + (isDark ? "33" : "44")} />
            <path d="M14 26 C14 17 18 12 24 12 C30 12 34 17 34 26 V38"
                stroke={color} strokeWidth={isDark ? 1.4 : 2} fill="none" strokeLinecap="round" />

            {/* Right person */}
            <circle cx="36" cy="12" r="5.5" stroke={color} strokeWidth={isDark ? 1.2 : 1.8} fill={color + (isDark ? "22" : "33")} />
            <path d="M28 28 C28 21 32 18 36 18 C40 18 44 21 44 28 V38"
                stroke={color} strokeWidth={isDark ? 1.2 : 1.8} fill="none" strokeLinecap="round" />

            {/* Connection lines (network effect) */}
            <line x1="19" y1="18" x2="29" y2="18" stroke={color} strokeWidth="0.8" opacity={isDark ? 0.4 : 0.6} />
            <line x1="22" y1="26" x2="26" y2="26" stroke={color} strokeWidth="0.8" opacity={isDark ? 0.3 : 0.5} />

            {/* Base line */}
            <line x1="6" y1="38" x2="42" y2="38" stroke={color} strokeWidth="1.2" opacity={isDark ? 0.4 : 0.6} />
        </svg>
    );
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ label, color, isDark, pulse = false }) {
    return (
        <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: isDark ? `${color}18` : `${color}28`,
            border: `1.5px solid ${isDark ? color + "55" : color + "cc"}`,
            borderRadius: 5,
            padding: "5px 11px",
            width: "fit-content",
            boxShadow: isDark ? "none" : `0 2px 8px ${color}33`,
        }}>
            {pulse && (
                <div style={{ position: "relative", width: 8, height: 8 }}>
                    <motion.div
                        animate={{ scale: [1, 2, 1], opacity: [0.7, 0, 0.7] }}
                        transition={{ repeat: Infinity, duration: 1.8 }}
                        style={{ position: "absolute", inset: 0, borderRadius: "50%", background: color }}
                    />
                    <div style={{ position: "absolute", inset: 1.5, borderRadius: "50%", background: color }} />
                </div>
            )}
            <span style={{
                fontFamily: "'Courier New', monospace",
                fontSize: "clamp(8px,0.95vw,10px)",
                letterSpacing: "0.15em",
                color: isDark ? color : color === "#fbe3e8" ? "#a04060" : color === "#c9b8f5" ? "#6040c0" : color === "#f7c4a0" ? "#b06020" : "#2a8a86",
                fontWeight: 700,
            }}>
                {label}
            </span>
        </div>
    );
}

// ─── Tag label ────────────────────────────────────────────────────────────────
const Tag = ({ label, color, isDark }) => (
    <span style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        fontFamily: "'Courier New', monospace",
        fontSize: "clamp(8px,0.9vw,10px)",
        letterSpacing: "0.25em",
        textTransform: "uppercase",
        color: isDark ? color + "cc" : color === "#fbe3e8" ? "#a04060" : color === "#c9b8f5" ? "#6040c0" : color === "#f7c4a0" ? "#b06020" : "#2a8a86",
        fontWeight: 600,
    }}>
        <span style={{ width: 14, height: 1.5, background: isDark ? color : color === "#fbe3e8" ? "#a04060" : color === "#c9b8f5" ? "#6040c0" : color === "#f7c4a0" ? "#b06020" : "#2a8a86", display: "inline-block", borderRadius: 1 }} />
        {label}
    </span>
);

// ─── Tile title ───────────────────────────────────────────────────────────────
const TileTitle = ({ children, isDark }) => (
    <h3 style={{
        margin: 0,
        fontFamily: "'Courier New', monospace",
        fontSize: "clamp(16px,2vw,21px)",
        fontWeight: 800,
        letterSpacing: "-0.02em",
        lineHeight: 1.2,
        color: isDark ? "#ffffff" : "#0a1212",
    }}>
        {children}
    </h3>
);

// ─── Tile body text ───────────────────────────────────────────────────────────
const TileBody = ({ children, isDark }) => (
    <p style={{
        margin: 0,
        fontFamily: "'Courier New', monospace",
        fontSize: "clamp(10px,1.1vw,12px)",
        lineHeight: 1.8,
        color: isDark ? "rgba(255,255,255,0.58)" : "rgba(10,18,18,0.7)",
        flex: 1,
    }}>
        {children}
    </p>
);

// ─── Tile wrapper ─────────────────────────────────────────────────────────────
function Tile({ children, color, isDark, delay = 0, gridArea, fullHeight = false }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-50px" });

    // Derive a dark version of each color for light mode text/borders
    const darkVariant = color === "#fbe3e8" ? "#d06080"
        : color === "#c9b8f5" ? "#7050d0"
            : color === "#f7c4a0" ? "#c07030"
                : "#2a9e9a";

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{
                boxShadow: isDark ? `0 0 40px ${color}25` : `0 8px 40px ${darkVariant}22`,
                y: -3,
            }}
            style={{
                gridArea,
                position: "relative",
                background: isDark ? `${color}0a` : "#ffffff",
                border: isDark ? `1px solid ${color}30` : `1.5px solid ${darkVariant}44`,
                borderRadius: 8,
                padding: "clamp(18px,2.5vw,28px)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                gap: 14,
                height: fullHeight ? "100%" : "auto",
                boxSizing: "border-box",
                transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                // Light mode: subtle colored top border accent
                borderTop: !isDark ? `3px solid ${darkVariant}` : undefined,
                boxShadow: isDark ? "none" : `0 2px 16px ${darkVariant}14`,
            }}
        >
            {/* Corner glow */}
            <div style={{
                position: "absolute", top: 0, right: 0,
                width: 80, height: 80, pointerEvents: "none",
                background: `radial-gradient(circle at top right, ${color}${isDark ? "1a" : "22"}, transparent 70%)`,
            }} />
            {/* Blueprint grid */}
            <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                backgroundImage: `linear-gradient(${isDark ? "rgba(255,255,255,0.022)" : darkVariant + "0f"} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? "rgba(255,255,255,0.022)" : darkVariant + "0f"} 1px, transparent 1px)`,
                backgroundSize: "28px 28px",
                zIndex: 0,
            }} />
            <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 14, height: "100%" }}>
                {children}
            </div>
        </motion.div>
    );
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
export default function VerticalsofExcellence() {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const lastRnD = "17 Mar 2026";

    const teal = "#5cbdb9";
    const blush = "#fbe3e8";
    const lavender = "#c9b8f5";
    const amber = "#f7c4a0";

    // Dark variants for light mode legibility
    const tealD = "#2a9e9a";
    const blushD = "#d06080";
    const lavenderD = "#7050d0";
    const amberD = "#c07030";

    return (
        <section style={{
            width: "100%",
            background: isDark ? "#000000" : "#ffffff",
            padding: "clamp(45px,3vw,110px) clamp(16px,6vw,80px)",
            transition: "background 0.4s ease",
            fontFamily: "'Courier New', monospace",
        }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>

                {/* ── Header ── */}
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    style={{ marginBottom: "clamp(32px,5vw,52px)" }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                        <div style={{ width: 28, height: 1.5, background: isDark ? teal : tealD, opacity: 0.8 }} />
                        <span style={{ fontSize: 10, letterSpacing: "0.35em", textTransform: "uppercase", color: isDark ? teal : tealD, fontWeight: 600 }}>
                            Intelligence Dashboard
                        </span>
                        <div style={{ width: 28, height: 1.5, background: isDark ? teal : tealD, opacity: 0.8 }} />
                    </div>
                    <h2 style={{
                        margin: 0,
                        fontSize: "clamp(26px,4.5vw,52px)",
                        fontWeight: 800,
                        letterSpacing: "-0.03em",
                        lineHeight: 1.05,
                        color: isDark ? "#ffffff" : "#0a1212",
                    }}>
                        Verticals of{" "}
                        <span style={{
                            display: "inline-block",
                            padding: "4px 16px",
                            margin: "0 4px",
                            borderRadius: "12px",
                            backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
                            border: `1px solid ${isDark ? "rgba(92, 189, 185, 0.3)" : "rgba(42, 158, 154, 0.3)"}`,
                            color: isDark ? "#5cbdb9" : "#2a9e9a",
                            fontSize: "0.95em",
                            verticalAlign: "middle"
                        }}>
                            Excellence.
                        </span>
                    </h2>
                    <motion.div
                        initial={{ scaleX: 0, originX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 }}
                        style={{
                            marginTop: 22, height: 1.5,
                            background: `linear-gradient(90deg, ${isDark ? teal : tealD}, ${isDark ? blush : blushD} 45%, ${isDark ? lavender : lavenderD} 75%, transparent)`,
                            opacity: isDark ? 0.35 : 0.7,
                        }}
                    />
                </motion.div>

                {/* ── BENTO GRID — desktop uses CSS grid-template-areas ── */}
                <style>{`
          .bento-grid {
            display: grid;
            gap: clamp(12px, 2vw, 20px);
            grid-template-columns: 1fr 1fr 1fr;
            grid-template-rows: auto auto;
            grid-template-areas:
              "stylist  catalyst catalyst"
              "lab      lab      discipline";
          }
          @media (max-width: 900px) {
            .bento-grid {
              grid-template-columns: 1fr 1fr;
              grid-template-areas:
                "stylist  catalyst"
                "lab      lab"
                "discipline discipline";
            }
          }
          @media (max-width: 580px) {
            .bento-grid {
              grid-template-columns: 1fr;
              grid-template-areas:
                "stylist"
                "catalyst"
                "lab"
                "discipline";
            }
          }
        `}</style>

                <div className="bento-grid">

                    {/* ── TILE 1: The Leader — narrow tall ── */}
                    <Tile color={teal} isDark={isDark} delay={0} gridArea="stylist">
                        <Tag label="Vertical 01 — The Leader" color={teal} isDark={isDark} />
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                            <TileTitle isDark={isDark}>Strategic Leadership{"\n"}& Team Empowerment</TileTitle>
                            <PeopleTeamIcon color={isDark ? teal : tealD} isDark={isDark} />
                        </div>
                        <TileBody isDark={isDark}>
                            Proven track record of driving collective excellence within high-stakes environments
                            like the NCC and collegiate organizations.
                            Skilled in aligning diverse groups under a shared vision,
                            fostering collaborative cultures, and empowering individuals to exceed their performance benchmarks.
                        </TileBody>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <StatusBadge label="Status: Elevating Teams" color={teal} isDark={isDark} pulse />
                            <span style={{
                                fontFamily: "'Courier New', monospace", fontSize: 9,
                                color: isDark ? teal + "55" : tealD + "88",
                                letterSpacing: "0.22em", textTransform: "uppercase",
                            }}>
                                MULTIPLYING IMPACT
                            </span>
                        </div>
                    </Tile>

                    {/* ── TILE 2: The Catalyst — wide ── */}
                    <Tile color={lavender} isDark={isDark} delay={0.1} gridArea="catalyst">
                        <Tag label="Vertical 02 — The Catalyst" color={lavender} isDark={isDark} />
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                            <TileTitle isDark={isDark}>Tech Community Involvement</TileTitle>
                            <span style={{
                                fontFamily: "'Courier New', monospace", fontSize: 10,
                                color: isDark ? lavender + "99" : lavenderD,
                                letterSpacing: "0.18em", textTransform: "uppercase",
                                flexShrink: 0, paddingTop: 3,
                            }}>
                                NETWORK IS NETWORTH
                            </span>
                        </div>

                        {/* Network canvas — larger in wide tile */}
                        <div style={{
                            width: "100%", height: "clamp(80px,10vw,120px)",
                            borderRadius: 6, overflow: "hidden",
                            border: `1.5px solid ${isDark ? lavender + "28" : lavenderD + "44"}`,
                            background: isDark ? `${lavender}08` : `${lavenderD}0a`,
                            boxShadow: isDark ? "none" : `inset 0 0 20px ${lavenderD}0a`,
                        }}>
                            <NetworkCanvas color={isDark ? lavender : lavenderD} isDark={isDark} />
                        </div>

                        <TileBody isDark={isDark}>
                            Fostering technical talent and bridging the gap between student innovation
                            and industry standards. Actively involved in networking with like-minded people.
                        </TileBody>
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                            <StatusBadge label="500+ Connections" color={lavender} isDark={isDark} />
                            <StatusBadge label="5+ Events Orchestrated" color={lavender} isDark={isDark} />
                        </div>
                    </Tile>

                    {/* ── TILE 3: The Lab — wide ── */}
                    <Tile color={amber} isDark={isDark} delay={0.2} gridArea="lab">
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                <Tag label="Vertical 03 — The Lab" color={amber} isDark={isDark} />
                                <TileTitle isDark={isDark}>Tech & Personal R&D Lab</TileTitle>
                            </div>
                            <FlaskIcon color={isDark ? amber : amberD} isDark={isDark} />
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                            <div style={{
                                background: isDark ? `${amber}28` : `${amberD}18`,
                                border: `1.5px solid ${isDark ? amber + "77" : amberD + "99"}`,
                                borderRadius: 5, padding: "4px 12px",
                                boxShadow: isDark ? "none" : `0 2px 8px ${amberD}22`,
                            }}>
                                <span style={{
                                    fontFamily: "'Courier New', monospace", fontSize: 11,
                                    fontWeight: 800, letterSpacing: "0.22em",
                                    color: isDark ? amber : amberD,
                                }}>
                                    β BETA
                                </span>
                            </div>
                            <span style={{
                                fontFamily: "'Courier New', monospace", fontSize: 9,
                                color: isDark ? amber + "77" : amberD + "99",
                                letterSpacing: "0.2em", textTransform: "uppercase",
                            }}>
                                EXPERIMENTAL FRAMEWORKS
                            </span>
                        </div>

                        <TileBody isDark={isDark}>
                            Pursuing systematic innovation through rigorous experimentation and prototyping.
                            Weekly deep-dives into cutting-edge technologies, emerging frameworks, and novel architectures.
                            This is my sandbox for testing what's next before it becomes mainstream — combining technical rigor
                            with creative exploration to drive excellence in innovation.
                        </TileBody>

                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                            <StatusBadge label="Status: Innovation Pipeline" color={amber} isDark={isDark} pulse />
                            <StatusBadge label="100+ Experiments" color={amber} isDark={isDark} />
                        </div>
                    </Tile>

                    {/* ── TILE 4: The Foundation — narrow tall ── */}
                    <Tile color={blush} isDark={isDark} delay={0.3} gridArea="discipline">
                        <Tag label="Vertical 04 — The Foundation" color={blush} isDark={isDark} />
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                            <TileTitle isDark={isDark}>Systemic Discipline</TileTitle>
                            <Battery color={isDark ? blush : blushD} isDark={isDark} pct={99} />
                        </div>

                        {/* Performance Metrics */}
                        <div style={{
                            width: "100%", height: "clamp(56px,8vw,80px)",
                            borderRadius: 6, overflow: "hidden",
                            border: `1.5px solid ${isDark ? blush + "28" : blushD + "44"}`,
                            background: isDark ? `${blush}08` : `${blushD}0a`,
                            boxShadow: isDark ? "none" : `inset 0 0 16px ${blushD}0a`,
                        }}>
                            <PerformanceMetricsCanvas color={isDark ? blush : blushD} isDark={isDark} />
                        </div>

                        <TileBody isDark={isDark}>
                            Applying engineering principles to physical performance. Treating discipline
                            as a core system requirement for cognitive endurance.
                        </TileBody>

                        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                            <StatusBadge label="System: Optimal" color={blush} isDark={isDark} pulse />
                            <span style={{
                                fontFamily: "'Courier New', monospace", fontSize: 9,
                                color: isDark ? blush + "55" : blushD + "77",
                                letterSpacing: "0.2em", textTransform: "uppercase",
                            }}>
                                HARDWARE MAINTENANCE
                            </span>
                        </div>
                    </Tile>

                </div>

                {/* ── Footer ── */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    style={{ marginTop: "clamp(36px,5vw,56px)", display: "flex", alignItems: "center", gap: 16 }}
                >
                    <div style={{ flex: 1, height: 1, background: isDark ? "rgba(255,255,255,0.07)" : "rgba(10,100,90,0.18)" }} />
                    <span style={{
                        fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase",
                        color: isDark ? "rgba(255,255,255,0.2)" : "rgb(10, 80, 70)",
                    }}>
                        Rajasekhar — Verticals of Excellence — v1.0
                    </span>
                    <div style={{ flex: 1, height: 1, background: isDark ? "rgba(255,255,255,0.07)" : "rgba(10,100,90,0.18)" }} />
                </motion.div>

            </div>
        </section>
    );
}