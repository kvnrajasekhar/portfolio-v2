import { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import AtomicTransition from "../transition/AtomicTransition";

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function hexRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r},${g},${b}`;
}

// ─── GROWTH LOG DATA ──────────────────────────────────────────────────────────
const GROWTH_LOG = [
    { skill: "Inclusive Leadership", context: "practiced over time", status: "evolving", pct: 72, color: "#5cbdb9" },
    { skill: "Product Ownership", context: "actively applied", status: "in_progress", pct: 62, color: "#c9b8f5" },
    { skill: "Clean Architecture", context: "learned + implemented", status: "applied", pct: 65, color: "#a8d8b9" },
    { skill: "Scalable System Design", context: "deep concept exploration", status: "exploring", pct: 55, color: "#f7c4a0" },
];

const STATUS_STYLE = {
    evolving: { bg: "rgba(92,189,185,0.12)", border: "rgba(92,189,185,0.4)", text: "#5cbdb9" },
    in_progress: { bg: "rgba(201,184,245,0.12)", border: "rgba(201,184,245,0.4)", text: "#c9b8f5" },
    applied: { bg: "rgba(168,216,185,0.12)", border: "rgba(168,216,185,0.4)", text: "#a8d8b9" },
    exploring: { bg: "rgba(247,196,160,0.12)", border: "rgba(247,196,160,0.4)", text: "#f7c4a0" },
};

// ─── UPTIME BLOCKS ────────────────────────────────────────────────────────────
const UPTIME = [
    {
        range: "11:00 – 17:00",
        zone: "IST",
        label: "Enterprise Engineering",
        desc: "Deep work. Architecture reviews. Complex problem-solving.",
        intensity: 1.0,
        color: "#5cbdb9",
    },
    {
        range: "18:00 – 21:00",
        zone: "IST",
        label: "R&D · OSS · Networking",
        desc: "Exploration, open-source, community discourse.",
        intensity: 0.72,
        color: "#c9b8f5",
    },
];

// ─── REVEAL WRAPPER ───────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, direction = "up", className = "" }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-60px" });
    const variants = {
        hidden: {
            opacity: 0,
            y: direction === "up" ? 28 : direction === "down" ? -28 : 0,
            x: direction === "left" ? 28 : direction === "right" ? -28 : 0,
        },
        show: { opacity: 1, y: 0, x: 0 },
    };
    return (
        <motion.div
            ref={ref}
            variants={variants}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// ─── PAGE LABEL ───────────────────────────────────────────────────────────────
function PageLabel({ text, color, isDark }) {
    return (
        <div className="flex items-center gap-3 mb-4">
            <div style={{ width: 22, height: 1.5, background: color, borderRadius: 1 }} />
            <span
                style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: "0.32em",
                    textTransform: "uppercase",
                    color,
                }}
            >
                {text}
            </span>
            <div style={{ width: 22, height: 1.5, background: color, borderRadius: 1 }} />
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// § 1 — HERO: PROTOCOL INIT
// ═══════════════════════════════════════════════════════════════════════════════
function HeroSection({ isDark }) {
    const [tick, setTick] = useState(0);
    const [typed, setTyped] = useState("");
    const msg = "PROTOCOL_INIT :: CONTACT_CHANNEL // secure";
    const teal = isDark ? "#5cbdb9" : "#2a9e9a";
    const text = isDark ? "rgba(255,255,255,0.88)" : "rgba(10,18,18,0.88)";
    const muted = isDark ? "rgba(255,255,255,0.38)" : "rgba(10,18,18,0.4)";

    useEffect(() => {
        let i = 0;
        const iv = setInterval(() => {
            i++;
            setTyped(msg.slice(0, i));
            if (i >= msg.length) clearInterval(iv);
        }, 38);
        return () => clearInterval(iv);
    }, []);

    useEffect(() => {
        const id = setInterval(() => setTick(t => t + 1), 1000);
        return () => clearInterval(id);
    }, []);

    return (
        <section
            className="relative min-h-[62vh] flex flex-col justify-center overflow-hidden"
            style={{ padding: "clamp(72px,12vw,120px) clamp(20px,7vw,96px) clamp(48px,8vw,80px)" }}
        >
            {/* Large background word */}
            <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
                aria-hidden
            >
                <span
                    style={{
                        fontFamily: "'Courier New', monospace",
                        fontSize: "clamp(80px,18vw,200px)",
                        fontWeight: 900,
                        letterSpacing: "0.18em",
                        color: isDark ? "rgba(255,255,255,0.052)" : "rgba(0,0,0,0.065)",
                    }}
                >
                    CONNECT
                </span>
            </div>

            <div className="relative z-10 max-w-4xl">
                {/* Typewriter label */}
                <Reveal>
                    <div
                        className="mb-6 flex items-center gap-2"
                        style={{ fontFamily: "'Courier New', monospace", fontSize: "clamp(10px,1.2vw,13px)", color: teal }}
                    >
                        <span>&gt;</span>
                        <span>{typed}</span>
                        <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ repeat: Infinity, duration: 0.7 }}
                            style={{ display: "inline-block", width: 8, height: "1em", background: teal, verticalAlign: "middle" }}
                        />
                    </div>
                </Reveal>

                {/* Main heading */}
                <Reveal delay={0.1}>
                    <h1
                        style={{
                            fontFamily: "'Courier New', monospace",
                            fontSize: "clamp(38px,7vw,82px)",
                            fontWeight: 900,
                            letterSpacing: "-0.03em",
                            lineHeight: 1.05,
                            color: text,
                            margin: 0,
                        }}
                    >
                        Let's build<br />
                        <span
                            style={{
                                display: "inline",
                                backgroundImage: `linear-gradient(135deg, ${teal}, #c9b8f5)`,
                                WebkitBackgroundClip: "text",
                                backgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                color: "transparent",
                            }}
                        >
                            something real.
                        </span>
                    </h1>
                </Reveal>

                <Reveal delay={0.22}>
                    <p
                        style={{
                            fontFamily: "'Courier New', monospace",
                            fontSize: "clamp(12px,1.4vw,15px)",
                            color: muted,
                            marginTop: 20,
                            maxWidth: 520,
                            lineHeight: 1.8,
                            letterSpacing: "0.04em",
                        }}
                    >
                        Not a contact form. A handshake protocol. If you value deep engineering,
                        high-integrity collaboration, and measurable outcomes — this channel is open.
                    </p>
                </Reveal>

                {/* Ping counter */}
                <Reveal delay={0.35}>
                    <div
                        className="flex items-center gap-3 mt-8"
                        style={{ fontFamily: "'Courier New', monospace", fontSize: 11 }}
                    >
                        <div className="relative w-2 h-2">
                            <motion.div
                                animate={{ scale: [1, 2.2, 1], opacity: [0.8, 0, 0.8] }}
                                transition={{ repeat: Infinity, duration: 1.8 }}
                                style={{ position: "absolute", inset: 0, borderRadius: "50%", background: teal }}
                            />
                            <div style={{ position: "absolute", inset: 2, borderRadius: "50%", background: teal }} />
                        </div>
                        <span style={{ color: teal, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase" }}>
                            Channel Online
                        </span>
                        <span style={{ color: muted }}>· session {String(tick).padStart(4, "0")}s</span>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// § 2 — ALIGNMENT PARAMETERS
// ═══════════════════════════════════════════════════════════════════════════════
function AlignmentSection({ isDark }) {
    const teal = isDark ? "#5cbdb9" : "#2a9e9a";
    const text = isDark ? "rgba(255,255,255,0.82)" : "rgba(10,18,18,0.82)";
    const muted = isDark ? "rgba(255,255,255,0.4)" : "rgba(10,18,18,0.42)";
    const traits = ["Extreme Ownership", "Systemic Thinking", "Continuous Refinement"];

    return (
        <section
            style={{
                padding: "clamp(56px,9vw,100px) clamp(20px,7vw,96px)",
                borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(10,18,18,0.08)"}`,
            }}
        >
            <div className="max-w-5xl mx-auto">
                <Reveal>
                    <PageLabel text="Alignment Parameters" color={teal} isDark={isDark} />
                </Reveal>

                {/* Two-column layout: statement + traits */}
                <div
                    className="grid gap-12 mt-8"
                    style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))" }}
                >
                    {/* Left: paragraph */}
                    <Reveal direction="left">
                        <p
                            style={{
                                fontFamily: "Georgia, serif",
                                fontSize: "clamp(16px,2vw,22px)",
                                lineHeight: 1.85,
                                color: text,
                                fontStyle: "italic",
                            }}
                        >
                            "I am looking to connect with engineers, founders, and mentors who value{" "}
                            {traits.map((t, i) => (
                                <span key={t}>
                                    <span style={{ color: teal, fontStyle: "normal", fontWeight: 700 }}>{t}</span>
                                    {i < traits.length - 1 ? ", " : ""}
                                </span>
                            ))}
                            . If you believe that code is a tool for impact and that discipline is the
                            foundation of innovation — let's sync."
                        </p>
                    </Reveal>

                    {/* Right: trait pills stacked */}
                    <Reveal direction="right">
                        <div className="flex flex-col gap-4 justify-center h-full">
                            {traits.map((t, i) => (
                                <motion.div
                                    key={t}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.12, duration: 0.5 }}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 14,
                                        padding: "14px 20px",
                                        borderRadius: 8,
                                        background: isDark ? "rgba(92,189,185,0.06)" : "rgba(42,158,154,0.05)",
                                        border: `1px solid rgba(${hexRgb(teal)},${isDark ? 0.22 : 0.3})`,
                                    }}
                                >
                                    <span
                                        style={{
                                            fontFamily: "'Courier New', monospace",
                                            fontSize: 10,
                                            fontWeight: 800,
                                            color: teal,
                                            letterSpacing: "0.2em",
                                            minWidth: 24,
                                        }}
                                    >
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                    <span
                                        style={{
                                            fontFamily: "'Courier New', monospace",
                                            fontSize: "clamp(12px,1.3vw,14px)",
                                            fontWeight: 700,
                                            color: text,
                                            letterSpacing: "0.04em",
                                        }}
                                    >
                                        {t}
                                    </span>
                                    <div
                                        style={{
                                            marginLeft: "auto",
                                            width: 6,
                                            height: 6,
                                            borderRadius: "50%",
                                            background: teal,
                                            boxShadow: `0 0 8px ${teal}`,
                                        }}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// § 3 — GROWTH LOG
// ═══════════════════════════════════════════════════════════════════════════════
function GrowthLogSection({ isDark }) {
    const teal = isDark ? "#5cbdb9" : "#2a9e9a";
    const text = isDark ? "rgba(255,255,255,0.85)" : "rgba(10,18,18,0.85)";
    const muted = isDark ? "rgba(255,255,255,0.38)" : "rgba(10,18,18,0.6)";

    return (
        <section
            style={{
                padding: "clamp(56px,9vw,100px) clamp(20px,7vw,96px)",
                background: isDark ? "rgba(255,255,255,0.015)" : "rgba(10,18,18,0.018)",
            }}
        >
            <div className="max-w-5xl mx-auto">
                <Reveal>
                    <PageLabel text="Growth Log · Work In Progress" color={teal} isDark={isDark} />
                    <p
                        style={{
                            fontFamily: "'Courier New', monospace",
                            fontSize: "clamp(11px,1.2vw,13px)",
                            color: muted,
                            marginBottom: 32,
                            letterSpacing: "0.06em",
                            maxWidth: 520,
                        }}
                    >
            // Skills aren't binary. These are live entries — actively updating.
                    </p>
                </Reveal>

                <div className="flex flex-col gap-6">
                    {GROWTH_LOG.map((item, i) => {
                        const st = STATUS_STYLE[item.status];
                        return (
                            <Reveal key={item.skill} delay={i * 0.1}>
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr auto",
                                        alignItems: "center",
                                        gap: "12px 20px",
                                    }}
                                >
                                    {/* Top row */}
                                    <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                                        <span
                                            style={{
                                                fontFamily: "'Courier New', monospace",
                                                fontSize: "clamp(13px,1.5vw,16px)",
                                                fontWeight: 800,
                                                color: text,
                                                letterSpacing: "-0.01em",
                                            }}
                                        >
                                            {item.skill}
                                        </span>
                                        <span
                                            style={{
                                                fontFamily: "'Courier New', monospace",
                                                fontSize: 9,
                                                color: muted,
                                                letterSpacing: "0.12em",
                                                fontStyle: "italic",
                                            }}
                                        >
                                            — {item.context}
                                        </span>
                                    </div>

                                    {/* Status badge */}
                                    <span
                                        style={{
                                            fontFamily: "'Courier New', monospace",
                                            fontSize: 9,
                                            fontWeight: 800,
                                            letterSpacing: "0.18em",
                                            color: isDark ? `${st.text}` : "#2a2a2abe",
                                            background: st.bg,
                                            border: `1px solid ${st.border}`,
                                            borderRadius: 4,
                                            padding: "3px 10px",
                                            whiteSpace: "nowrap",
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        {item.status}
                                    </span>

                                    {/* Progress bar — spans full width */}
                                    <div style={{ gridColumn: "1 / -1" }}>
                                        <div
                                            style={{
                                                height: 3,
                                                background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                                                borderRadius: 2,
                                                overflow: "hidden",
                                            }}
                                        >
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${item.pct}%` }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 1.1, delay: i * 0.1, ease: "easeOut" }}
                                                style={{
                                                    height: "100%",
                                                    background: `linear-gradient(90deg, ${item.color}77, ${item.color})`,
                                                    borderRadius: 2,
                                                    boxShadow: `0 0 6px ${item.color}88`,
                                                }}
                                            />
                                        </div>
                                        <div
                                            style={{
                                                fontFamily: "'Courier New', monospace",
                                                fontSize: 9,
                                                color: muted,
                                                marginTop: 4,
                                                letterSpacing: "0.12em",
                                            }}
                                        >
                                            {item.pct}% committed
                                        </div>
                                    </div>
                                </div>

                                {/* Separator */}
                                {i < GROWTH_LOG.length - 1 && (
                                    <div
                                        style={{
                                            height: 1,
                                            marginTop: 16,
                                            background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)",
                                        }}
                                    />
                                )}
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// § 4 — HANDSHAKE PROTOCOL (Email CTA)
// ═══════════════════════════════════════════════════════════════════════════════
function HandshakeSection({ isDark }) {
    const [state, setState] = useState("idle"); // idle | ready | sent
    const teal = isDark ? "#5cbdb9" : "#2a9e9a";
    const text = isDark ? "rgba(255,255,255,0.88)" : "rgba(10,18,18,0.88)";
    const muted = isDark ? "rgba(255,255,255,0.38)" : "rgba(10,18,18,0.6)";
    const bg = isDark ? "#000000" : "#ffffff";

    const subject = encodeURIComponent(
        "Engineering Collaboration Request — Rajasekhar Portfolio Review"
    );
    const body = encodeURIComponent(
        `Hi Rajasekhar,\n\nI came across your portfolio and wanted to reach out.\n\n[Tell me what caught your attention — a project, a principle, or an idea you want to discuss.]\n\nI believe we could build value together because:\n[Your reason here]\n\nLooking forward to connecting.\n\n— [Your Name]`
    );

    const mailto = `mailto:kanagalavnrajasekhar@gmail.com?subject=${subject}&body=${body}`;
    const gmailLink = `https://mail.google.com/mail/?view=cm&to=kanagalavnrajasekhar@gmail.com&su=${subject}&body=${body}`;

    const handleClick = () => {
        setState("ready");
        setTimeout(() => {
            window.location.href = mailto;
            setState("sent");
            setTimeout(() => setState("idle"), 3500);
        }, 800);
    };

    return (
        <section
            style={{
                padding: "clamp(72px,11vw,120px) clamp(20px,7vw,96px)",
                borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(10,18,18,0.08)"}`,
                borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(10,18,18,0.08)"}`,
            }}
        >
            <div className="max-w-4xl mx-auto flex flex-col items-center text-align-center gap-8">
                <Reveal>
                    <PageLabel text="Handshake Protocol" color={teal} isDark={isDark} />
                </Reveal>

                <Reveal delay={0.08}>
                    <p
                        style={{
                            fontFamily: "'Courier New', monospace",
                            fontSize: "clamp(12px,1.3vw,14px)",
                            color: muted,
                            textAlign: "center",
                            maxWidth: 440,
                            lineHeight: 1.8,
                            letterSpacing: "0.05em",
                        }}
                    >
                        No anonymous web form. Your own inbox — your own voice.
                        <br />
                        This opens a pre-filled email in your client.
                    </p>
                </Reveal>

                {/* THE BIG BUTTON */}
                <Reveal delay={0.16}>
                    <div className="flex flex-col items-center gap-5 w-full">
                        <motion.button
                            onClick={handleClick}
                            whileHover={{ scale: 1.025 }}
                            whileTap={{ scale: 0.975 }}
                            style={{
                                position: "relative",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 6,
                                width: "clamp(280px, 60vw, 480px)",
                                padding: "clamp(22px,3.5vw,36px) clamp(24px,4vw,40px)",
                                background:
                                    state === "sent"
                                        ? `rgba(${hexRgb(teal)},0.12)`
                                        : isDark
                                            ? "rgba(255,255,255,0.04)"
                                            : "rgba(10,18,18,0.04)",
                                border: `1.5px solid ${state === "sent" ? teal : isDark ? "rgba(255,255,255,0.18)" : "rgba(10,18,18,0.2)"}`,
                                borderRadius: 12,
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                boxShadow:
                                    state !== "idle"
                                        ? `0 0 40px rgba(${hexRgb(teal)},0.22)`
                                        : isDark
                                            ? "none"
                                            : "0 4px 24px rgba(10,18,18,0.08)",
                            }}
                        >
                            {/* Animated ring */}
                            {state === "ready" && (
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0.8 }}
                                    animate={{ scale: 1.12, opacity: 0 }}
                                    transition={{ duration: 0.7 }}
                                    style={{
                                        position: "absolute",
                                        inset: -3,
                                        borderRadius: 14,
                                        border: `2px solid ${teal}`,
                                        pointerEvents: "none",
                                    }}
                                />
                            )}

                            <span
                                style={{
                                    fontFamily: "'Courier New', monospace",
                                    fontSize: 10,
                                    fontWeight: 800,
                                    letterSpacing: "0.32em",
                                    textTransform: "uppercase",
                                    color: state === "sent" ? teal : muted,
                                }}
                            >
                                {state === "sent" ? "// TUNNEL OPEN" : "// EXECUTE"}
                            </span>

                            <span
                                style={{
                                    fontFamily: "'Courier New', monospace",
                                    fontSize: "clamp(16px,2.5vw,26px)",
                                    fontWeight: 900,
                                    color: state === "sent" ? teal : text,
                                    letterSpacing: "-0.02em",
                                    textAlign: "center",
                                }}
                            >
                                {state === "idle"
                                    ? "> initiate_contact.send()"
                                    : state === "ready"
                                        ? "> establishing tunnel..."
                                        : "> mail_client.launched ✓"}
                            </span>

                            <span
                                style={{
                                    fontFamily: "'Courier New', monospace",
                                    fontSize: 10,
                                    color: muted,
                                    letterSpacing: "0.1em",
                                }}
                            >
                                kanagalavnrajasekhar@gmail.com
                            </span>
                        </motion.button>

                        {/* Gmail fallback */}
                        <a
                            href={gmailLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                fontFamily: "'Courier New', monospace",
                                fontSize: 10,
                                color: "#2a2a2abe",
                                textDecoration: "none",
                                letterSpacing: "0.18em",
                                textTransform: "uppercase",
                                borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.42)"}`,
                                paddingBottom: 2,
                                transition: "color 0.2s ease",
                            }}
                            onMouseEnter={e => e.currentTarget.style.color = teal}
                            onMouseLeave={e => e.currentTarget.style.color = muted}
                        >
                            or open in Gmail ↗
                        </a>
                    </div>
                </Reveal>
            </div >
        </section >
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// § 5 — SYSTEM UPTIME
// ═══════════════════════════════════════════════════════════════════════════════
function UptimeSection({ isDark }) {
    const teal = isDark ? "#5cbdb9" : "#2a9e9a";
    const text = isDark ? "rgba(255,255,255,0.85)" : "rgba(10,18,18,0.85)";
    const muted = isDark ? "rgba(255,255,255,0.38)" : "rgba(10,18,18,0.4)";

    // 24-hour timeline: mark active blocks
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const isActive = (h) => (h >= 11 && h < 17) || (h >= 18 && h < 22);
    const blockColor = (h) => h >= 11 && h < 17 ? "#5cbdb9" : "#c9b8f5";

    return (
        <section
            style={{
                padding: "clamp(56px,9vw,100px) clamp(20px,7vw,96px)",
            }}
        >
            <div className="max-w-5xl mx-auto">
                <Reveal>
                    <PageLabel text="System Uptime · Peak Cognitive Hours" color={teal} isDark={isDark} />
                    <p
                        style={{
                            fontFamily: "'Courier New', monospace",
                            fontSize: "clamp(11px,1.2vw,13px)",
                            color: muted,
                            marginBottom: 36,
                            maxWidth: 480,
                            lineHeight: 1.75,
                            letterSpacing: "0.05em",
                        }}
                    >
            // I respect your time, and I value mine. Here is when we build the most value together.
                    </p>
                </Reveal>

                {/* 24h bar */}
                <Reveal delay={0.08}>
                    <div style={{ marginBottom: 28 }}>
                        <div style={{ display: "flex", gap: 3, alignItems: "flex-end" }}>
                            {hours.map(h => (
                                <div key={h} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                                    <motion.div
                                        initial={{ height: 0 }}
                                        whileInView={{ height: isActive(h) ? 48 : 16 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: h * 0.025, ease: "easeOut" }}
                                        style={{
                                            width: "100%",
                                            borderRadius: 3,
                                            background: isActive(h)
                                                ? blockColor(h)
                                                : isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
                                            boxShadow: isActive(h) ? `0 0 8px ${blockColor(h)}88` : "none",
                                        }}
                                    />
                                    {(h % 3 === 0) && (
                                        <span
                                            style={{
                                                fontFamily: "'Courier New', monospace",
                                                fontSize: 8,
                                                color: muted,
                                                letterSpacing: 0,
                                            }}
                                        >
                                            {String(h).padStart(2, "0")}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </Reveal>

                {/* Uptime detail rows */}
                <div
                    style={{
                        display: "grid",
                        gap: 16,
                        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
                    }}
                >
                    {UPTIME.map((u, i) => (
                        <Reveal key={u.label} delay={i * 0.12}>
                            <div
                                style={{
                                    padding: "20px 22px",
                                    borderRadius: 8,
                                    background: isDark
                                        ? `rgba(${hexRgb(u.color)},0.07)`
                                        : `rgba(${hexRgb(u.color)},0.06)`,
                                    borderLeft: `3px solid ${u.color}`,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 6,
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                                    <span
                                        style={{
                                            fontFamily: "'Courier New', monospace",
                                            fontSize: "clamp(14px,1.8vw,18px)",
                                            fontWeight: 900,
                                            color: u.color,
                                            letterSpacing: "-0.02em",
                                        }}
                                    >
                                        {u.range}
                                    </span>
                                    <span
                                        style={{
                                            fontFamily: "'Courier New', monospace",
                                            fontSize: 9,
                                            fontWeight: 700,
                                            color: muted,
                                            letterSpacing: "0.2em",
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        {u.zone}
                                    </span>
                                </div>
                                <span
                                    style={{
                                        fontFamily: "'Courier New', monospace",
                                        fontSize: "clamp(11px,1.2vw,13px)",
                                        fontWeight: 700,
                                        color: text,
                                        letterSpacing: "0.04em",
                                    }}
                                >
                                    {u.label}
                                </span>
                                <span
                                    style={{
                                        fontFamily: "'Courier New', monospace",
                                        fontSize: 11,
                                        color: muted,
                                        lineHeight: 1.65,
                                    }}
                                >
                                    {u.desc}
                                </span>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// § 6 — FEEDBACK LOOP (Request for Critique)
// ═══════════════════════════════════════════════════════════════════════════════
function FeedbackSection({ isDark }) {
    const teal = isDark ? "#5cbdb9" : "#2a9e9a";
    const blush = isDark ? "#fbe3e8" : "#c04070";
    const text = isDark ? "rgba(255,255,255,0.85)" : "rgba(10,18,18,0.85)";
    const muted = isDark ? "rgba(255,255,255,0.38)" : "rgba(10,18,18,0.4)";
    const subject = encodeURIComponent("Portfolio Critique / Bug Report — Rajasekhar");
    const body = encodeURIComponent(
        `Hi Rajasekhar,\n\nI reviewed your portfolio and want to share some feedback.\n\n[BUG / LOGIC FLAW / DESIGN NOTE]:\n\n[YOUR SUGGESTION]:\n\n— [Your Name]`
    );

    return (
        <section
            style={{
                padding: "clamp(56px,9vw,100px) clamp(20px,7vw,96px)",
                background: isDark ? "rgba(255,255,255,0.015)" : "rgba(10,18,18,0.018)",
                borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(10,18,18,0.08)"}`,
            }}
        >
            <div className="max-w-5xl mx-auto">
                <Reveal>
                    <PageLabel text="Request For Critique · Feedback Loop" color={blush} isDark={isDark} />
                </Reveal>

                <div
                    style={{
                        display: "grid",
                        gap: 32,
                        marginTop: 8,
                        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
                        alignItems: "center",
                    }}
                >
                    {/* Statement */}
                    <Reveal direction="left" delay={0.08}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <p
                                style={{
                                    fontFamily: "Georgia, serif",
                                    fontSize: "clamp(15px,1.8vw,20px)",
                                    lineHeight: 1.85,
                                    color: text,
                                    fontStyle: "italic",
                                }}
                            >
                                "If you've explored my portfolio and found a bug, a logic flaw, or a way I can
                                optimize my code or design — tell me."
                            </p>
                            <p
                                style={{
                                    fontFamily: "'Courier New', monospace",
                                    fontSize: "clamp(11px,1.2vw,13px)",
                                    color: muted,
                                    lineHeight: 1.75,
                                }}
                            >
                                I value Radical Candor over polite praise. I'm not afraid of being wrong —
                                I'm afraid of staying the same.
                            </p>
                        </div>
                    </Reveal>

                    {/* CTA block */}
                    <Reveal direction="right" delay={0.16}>
                        <div
                            style={{
                                padding: "clamp(24px,3vw,36px)",
                                borderRadius: 10,
                                background: isDark
                                    ? `rgba(${hexRgb(blush)},0.05)`
                                    : `rgba(${hexRgb(blush)},0.06)`,
                                border: `1px solid rgba(${hexRgb(blush)},${isDark ? 0.2 : 0.35})`,
                                display: "flex",
                                flexDirection: "column",
                                gap: 16,
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: "'Courier New', monospace",
                                    fontSize: 9,
                                    fontWeight: 800,
                                    letterSpacing: "0.3em",
                                    textTransform: "uppercase",
                                    color: blush,
                                }}
                            >
                // SUBMIT_CRITIQUE
                            </span>
                            <p
                                style={{
                                    fontFamily: "'Courier New', monospace",
                                    fontSize: "clamp(11px,1.2vw,13px)",
                                    color: muted,
                                    lineHeight: 1.7,
                                }}
                            >
                                Found a bug? Logic flaw? Design gap? Use the link below — it opens a
                                pre-addressed critique email.
                            </p>
                            <a
                                href={`mailto:kanagalavnrajasekhar@gmail.com?subject=${subject}&body=${body}`}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 8,
                                    fontFamily: "'Courier New', monospace",
                                    fontSize: "clamp(11px,1.2vw,13px)",
                                    fontWeight: 800,
                                    color: blush,
                                    textDecoration: "none",
                                    letterSpacing: "0.06em",
                                    padding: "10px 16px",
                                    borderRadius: 6,
                                    background: `rgba(${hexRgb(blush)},0.1)`,
                                    border: `1px solid rgba(${hexRgb(blush)},0.3)`,
                                    transition: "all 0.2s ease",
                                    width: "fit-content",
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = `rgba(${hexRgb(blush)},0.18)`;
                                    e.currentTarget.style.borderColor = blush;
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = `rgba(${hexRgb(blush)},0.1)`;
                                    e.currentTarget.style.borderColor = `rgba(${hexRgb(blush)},0.3)`;
                                }}
                            >
                                &gt; send_critique.submit() ↗
                            </a>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// § 7 — FOOTER RULE
// ═══════════════════════════════════════════════════════════════════════════════
function FooterRule({ isDark }) {
    const teal = isDark ? "#5cbdb9" : "#2a9e9a";
    const muted = isDark ? "rgba(255,255,255,0.22)" : "rgba(10,18,18,0.35)";
    return (
        <div
            style={{
                padding: "clamp(32px,5vw,48px) clamp(20px,7vw,96px)",
                display: "flex",
                alignItems: "center",
                gap: 16,
            }}
        >
            <div style={{ flex: 1, height: 1, background: isDark ? "rgba(255,255,255,0.07)" : "rgba(10,18,18,0.1)" }} />
            <span
                style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: muted,
                }}
            >
                KVN_Rajasekhar · Protocol Init Complete
            </span>
            <div style={{ flex: 1, height: 1, background: isDark ? "rgba(255,255,255,0.07)" : "rgba(10,18,18,0.1)" }} />
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function Contact() {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <AtomicTransition>
            <div
                style={{
                    minHeight: "100vh",
                    background: isDark ? "#000000" : "#ffffff",
                    transition: "background 0.4s ease",
                    overflowX: "hidden",
                    position: "relative",
                }}
            >
                {/* Blueprint grid */}
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        pointerEvents: "none",
                        zIndex: 0,
                        backgroundImage: `
            linear-gradient(${isDark ? "rgba(255,255,255,0.022)" : "rgba(92,189,185,0.07)"} 1px, transparent 1px),
            linear-gradient(90deg, ${isDark ? "rgba(255,255,255,0.022)" : "rgba(92,189,185,0.07)"} 1px, transparent 1px)
          `,
                        backgroundSize: "52px 52px",
                    }}
                    aria-hidden
                />

                {/* Content */}
                <div style={{ position: "relative", zIndex: 1 }}>
                    <HeroSection isDark={isDark} />
                    <AlignmentSection isDark={isDark} />
                    <GrowthLogSection isDark={isDark} />
                    <HandshakeSection isDark={isDark} />
                    <UptimeSection isDark={isDark} />
                    <FeedbackSection isDark={isDark} />
                    <FooterRule isDark={isDark} />
                </div>
            </div>
        </AtomicTransition>
    );
}