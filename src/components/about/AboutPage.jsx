import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import AtomicTransition from "../transition/AtomicTransition";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const SECTIONS = [
    {
        id: "01",
        tag: "CORE_MANIFESTO",
        label: "Manifesto",
        watermark: "ARCHITECT",
        spotlightColor: "92,189,185",
        content: [
            {
                type: "quote",
                text: "I architect for the edge case, build for the user, and scale for the future. Engineering is not just about writing code; it's about solving real-world friction with invisible, elegant logic.",
            },
            {
                type: "body",
                text: "I am energized by the Chaos-to-Order pipeline. I don't just build features — I engineer solutions that transform high-level, complex business bottlenecks into simple, high-performance systems.",
            },
        ],
        image: {
            url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
            alt: "Abstract digital architecture",
            caption: "Building systems that breathe.",
        },
    },
    {
        id: "02",
        tag: "THE_DRIVE",
        label: "The Drive",
        watermark: "WHY",
        spotlightColor: "201,184,245",
        content: [
            {
                type: "label",
                text: "The 'Why' Behind the Code",
            },
            {
                type: "body",
                text: "My goal is to bridge the gap between abstract problems and concrete, scalable reality. Every system I build is a direct answer to a question the user didn't know how to ask.",
            },
            {
                type: "body",
                text: "I bridge the gap between abstract problems and concrete, scalable reality — translating business friction into invisible, performant solutions.",
            },
        ],
    },
    {
        id: "03",
        tag: "OPERATING_PRINCIPLES",
        label: "Principles",
        watermark: "PRINCIPLES",
        spotlightColor: "247,196,160",
        content: [
            {
                type: "label",
                text: "Production-First Mindset. Three Immutable Laws.",
            },
            {
                type: "principle",
                tag: "L1",
                title: "Elastic Architecture",
                text: "Systems must be built to fail gracefully and scale effortlessly. I prioritize statelessness and modularity, ensuring that a single node failure never becomes a system-wide catastrophe.",
            },
            {
                type: "principle",
                tag: "L2",
                title: "Atomic Logic",
                text: "Complexity is the enemy of velocity. I advocate for breaking down dense business requirements into small, testable, and reusable units of code. If a function does more than one thing, it isn't finished.",
            },
            {
                type: "principle",
                tag: "L3",
                title: "Outcome-Driven Engineering",
                text: "Technical excellence is a means, not an end. I align every technical constraint with a business objective, ensuring that every line of code adds measurable value to the end-user experience.",
            },
        ],
        image: {
            url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
            alt: "Server infrastructure",
            caption: "Infrastructure as philosophy.",
        },
    },
    {
        id: "04",
        tag: "CURRENT_SPRINT",
        label: "Current Sprint",
        watermark: "BUILDING",
        spotlightColor: "251,227,232",
        content: [
            {
                type: "sprint",
                tag: "SYSTEM BUILD",
                text: "Architecting a high-throughput Social Media Application focused on real-time data streams and low-latency user interactions.",
            },
            {
                type: "sprint",
                tag: "DEEP DIVE",
                text: "Mastering Cloud Infrastructure through the AWS Developer Associate pipeline.",
            },
            {
                type: "sprint",
                tag: "LEADERSHIP",
                text: "Refining Strategic Mentorship and Agile Ownership through cross-functional community orchestration and technical leadership.",
            },
        ],
    },
    {
        id: "05",
        tag: "ECOSYSTEM_VALUES",
        label: "Values",
        watermark: "OWNERSHIP",
        spotlightColor: "92,189,185",
        content: [
            {
                type: "label",
                text: "Radical Candor. Collective Ownership.",
            },
            {
                type: "value",
                title: "Extreme Ownership",
                text: "If I push the code, I own the outcome.",
            },
            {
                type: "value",
                title: "Innovation over Ego",
                text: "The best idea wins, regardless of who it came from.",
            },
            {
                type: "value",
                title: "Honesty in Logic",
                text: "Transparent communication regarding technical debt and system limitations — always.",
            },
        ],
    },
    {
        id: "06",
        tag: "VISION_TRAJECTORY",
        label: "Vision",
        watermark: "TRAJECTORY",
        spotlightColor: "201,184,245",
        content: [
            {
                type: "quote",
                text: "My career is a deliberate path toward building Impactful Tech Products that disappear into everyday life by making it better.",
            },
            {
                type: "body",
                text: "I am looking to join teams that value performance optimization, user-centric design, and high-integrity engineering — where the stakes are real and the craft is respected.",
            },
        ],
        image: {
            url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
            alt: "Future tech vision",
            caption: "Toward impactful systems.",
        },
    },
    {
        id: "07",
        tag: "HARDWARE_MAINTENANCE",
        label: "Beyond the Screen",
        watermark: "DISCIPLINE",
        spotlightColor: "247,196,160",
        content: [
            {
                type: "label",
                text: "The Same High-Standard Logic — Applied to Life.",
            },
            {
                type: "body",
                text: "Physical Discipline: The Gym is my laboratory for endurance and Uptime. I believe a high-performance mind requires a high-performance vessel.",
            },
            {
                type: "body",
                text: "Aesthetic IQ: My interest in Personal Care and Fashion isn't just about appearance — it's Visual Communication. Attention to detail, symmetry, and the psychology of presentation.",
            },
        ],
        image: {
            url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
            alt: "Gym and discipline",
            caption: "Consistency is the algorithm.",
        },
    },
    {
        id: "08",
        tag: "THE_DEBUG_LOG",
        label: "Debug Log",
        watermark: "OPTIMIZE",
        spotlightColor: "92,189,185",
        content: [
            {
                type: "label",
                text: "Problems I Love Solving.",
            },
            {
                type: "debug",
                tag: "PERF",
                title: "Performance Optimization",
                text: "The Millisecond Hunt — refactoring data fetches, optimizing database indexes, and implementing caching layers (Redis/CDN) to make applications feel instantaneous.",
            },
            {
                type: "debug",
                tag: "UX",
                title: "UX Engineering",
                text: "Taking technically complex processes — like multi-factor authentication or a 5-step order flow — and making them feel like a single, seamless interaction for the human on the other side of the screen.",
            },
        ],
    },
];

// ─── SPOTLIGHT CURSOR ─────────────────────────────────────────────────────────
function SpotlightCursor({ isDark, activeColor }) {
    const [pos, setPos] = useState({ x: -999, y: -999 });
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const move = (e) => {
            setPos({ x: e.clientX, y: e.clientY });
            setVisible(true);
        };
        const leave = () => setVisible(false);
        window.addEventListener("mousemove", move);
        window.addEventListener("mouseleave", leave);
        return () => {
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseleave", leave);
        };
    }, []);

    if (!visible) return null;

    return (
        <div
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: 1 }}
        >
            <div
                style={{
                    position: "absolute",
                    left: pos.x,
                    top: pos.y,
                    transform: "translate(-50%, -50%)",
                    width: 420,
                    height: 420,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, rgba(${activeColor},${isDark ? 0.1 : 0.07}) 0%, transparent 70%)`,
                    transition: "background 0.6s ease",
                    pointerEvents: "none",
                }}
            />
        </div>
    );
}

// ─── WATERMARK ────────────────────────────────────────────────────────────────
function Watermark({ text, isDark, mouseX, mouseY }) {
    const x = useTransform(mouseX, [0, typeof window !== "undefined" ? window.innerWidth : 1440], [-12, 12]);
    const y = useTransform(mouseY, [0, typeof window !== "undefined" ? window.innerHeight : 900], [-8, 8]);

    return (
        <motion.div
            style={{ x, y }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none"
            aria-hidden="true"
        >
            <span
                className="font-black tracking-[0.22em] whitespace-nowrap"
                style={{
                    fontSize: "clamp(52px, 11vw, 130px)",
                    color: isDark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.04)",
                    fontFamily: "'Courier New', monospace",
                    letterSpacing: "0.25em",
                }}
            >
                {text}
            </span>
        </motion.div>
    );
}

// ─── REVEAL TEXT ──────────────────────────────────────────────────────────────
function RevealText({ children, className, delay = 0 }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "start 0.4"] });
    const opacity = useTransform(scrollYProgress, [0, 1], [0.08, 1]);
    const y = useTransform(scrollYProgress, [0, 1], [18, 0]);
    const smoothOp = useSpring(opacity, { stiffness: 80, damping: 20 });
    const smoothY = useSpring(y, { stiffness: 80, damping: 20 });

    return (
        <motion.div ref={ref} style={{ opacity: smoothOp, y: smoothY }} className={className}>
            {children}
        </motion.div>
    );
}

// ─── SECTION IMAGE ────────────────────────────────────────────────────────────
function SectionImage({ image, isDark }) {
    if (!image) return null;
    return (
        <RevealText className="my-8">
            <div className="relative overflow-hidden rounded-lg" style={{ maxHeight: 260 }}>
                <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full object-cover"
                    style={{
                        height: 240,
                        filter: isDark ? "brightness(0.65) saturate(0.8)" : "brightness(0.92) saturate(0.9)",
                    }}
                />
                <div
                    className="absolute inset-0"
                    style={{
                        background: isDark
                            ? "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.7) 100%)"
                            : "linear-gradient(180deg, transparent 40%, rgba(255,255,255,0.6) 100%)",
                    }}
                />
                {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 px-4 py-3">
                        <p
                            className="font-mono text-xs tracking-widest"
                            style={{ color: isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)" }}
                        >
              // {image.caption}
                        </p>
                    </div>
                )}
            </div>
        </RevealText>
    );
}

// ─── CONTENT RENDERER ─────────────────────────────────────────────────────────
function ContentBlock({ block, isDark, accentColor }) {
    const darkAccent = `rgb(${accentColor})`;
    const lightAccent = `rgb(${accentColor})`;
    const accent = darkAccent;

    if (block.type === "quote") {
        return (
            <RevealText className="my-6">
                <blockquote
                    className="relative pl-6 text-xl md:text-2xl font-light leading-relaxed italic"
                    style={{
                        color: isDark ? "rgba(255,255,255,0.9)" : "rgba(26, 26, 26, 0.95)",
                        borderLeft: `3px solid ${accent}`,
                        fontFamily: "Georgia, serif",
                    }}
                >
                    "{block.text}"
                </blockquote>
            </RevealText>
        );
    }

    if (block.type === "body") {
        return (
            <RevealText className="my-4">
                <p
                    className="text-base md:text-lg leading-relaxed"
                    style={{
                        color: isDark ? "rgba(255,255,255,0.68)" : "rgba(26, 26, 26, 0.82)",
                        fontFamily: "'Courier New', monospace",
                    }}
                >
                    {block.text}
                </p>
            </RevealText>
        );
    }

    if (block.type === "label") {
        return (
            <RevealText className="my-5">
                <p
                    className="text-sm tracking-widest uppercase font-bold"
                    style={{ color: accent, fontFamily: "'Courier New', monospace" }}
                >
          // {block.text}
                </p>
            </RevealText>
        );
    }

    if (block.type === "principle") {
        return (
            <RevealText className="my-5">
                <div
                    className="pl-4 py-3"
                    style={{ borderLeft: `2px solid ${accent}44` }}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <span
                            className="text-xs font-black tracking-widest px-2 py-1 rounded"
                            style={{
                                color: isDark ? accentColor : `rgba(0,0,0,0.58)`,
                                background: `rgba(${accentColor},0.12)`,
                                border: `1px solid rgba(${accentColor},0.3)`,
                                fontFamily: "'Courier New', monospace",
                            }}
                        >
                            {block.tag}
                        </span>
                        <span
                            className="text-sm font-bold tracking-wide"
                            style={{ color: isDark ? "rgba(255,255,255,0.88)" : "rgba(26, 26, 26, 0.92)" }}
                        >
                            {block.title}
                        </span>
                    </div>
                    <p
                        className="text-sm leading-relaxed"
                        style={{
                            color: isDark ? "rgba(255,255,255,0.6)" : "rgba(26, 26, 26, 0.72)",
                            fontFamily: "'Courier New', monospace",
                        }}
                    >
                        {block.text}
                    </p>
                </div>
            </RevealText>
        );
    }

    if (block.type === "sprint") {
        return (
            <RevealText className="my-4">
                <div className="flex gap-4 items-start">
                    <span
                        className="text-[9px] font-black tracking-widest mt-1 px-2 py-1 rounded shrink-0"
                        style={{
                            color: isDark ? accentColor : `rgba(0,0,0,0.58)`,
                            background: `rgba(${accentColor},0.6)`,
                            border: `1px solid rgba(${accentColor},0.25)`,
                            fontFamily: "'Courier New', monospace",
                        }}
                    >
                        {block.tag}
                    </span>
                    <p
                        className="text-sm md:text-base leading-relaxed"
                        style={{
                            color: isDark ? "rgba(255,255,255,0.7)" : "rgba(26, 26, 26, 0.78)",
                            fontFamily: "'Courier New', monospace",
                        }}
                    >
                        {block.text}
                    </p>
                </div>
            </RevealText>
        );
    }

    if (block.type === "value") {
        return (
            <RevealText className="my-4">
                <div>
                    <span
                        className="text-sm font-black tracking-wide block mb-1"
                        style={{ color: accent, fontFamily: "'Courier New', monospace" }}
                    >
                        {block.title} →
                    </span>
                    <p
                        className="text-sm leading-relaxed"
                        style={{
                            color: isDark ? "rgba(255,255,255,0.65)" : "rgba(26, 26, 26, 0.74)",
                            fontFamily: "'Courier New', monospace",
                        }}
                    >
                        {block.text}
                    </p>
                </div>
            </RevealText>
        );
    }

    if (block.type === "debug") {
        return (
            <RevealText className="my-5">
                <div
                    className="p-4 rounded-lg"
                    style={{
                        background: isDark ? `rgba(${accentColor},0.06)` : `rgba(${accentColor},0.05)`,
                        border: `1px solid rgba(${accentColor},${isDark ? 0.2 : 0.3})`,
                    }}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <span
                            className="text-[9px] font-black tracking-widest px-2 py-1 rounded"
                            style={{
                                color: accent,
                                background: `rgba(${accentColor},0.15)`,
                                fontFamily: "'Courier New', monospace",
                            }}
                        >
                            [{block.tag}]
                        </span>
                        <span
                            className="text-sm font-bold"
                            style={{ color: isDark ? "rgba(255,255,255,0.88)" : "rgba(26, 26, 26, 0.92)" }}
                        >
                            {block.title}
                        </span>
                    </div>
                    <p
                        className="text-sm leading-relaxed"
                        style={{
                            color: isDark ? "rgba(255,255,255,0.62)" : "rgba(26, 26, 26, 0.74)",
                            fontFamily: "'Courier New', monospace",
                        }}
                    >
                        {block.text}
                    </p>
                </div>
            </RevealText>
        );
    }

    return null;
}

// ─── SINGLE SECTION ───────────────────────────────────────────────────────────
function AboutSection({ section, isDark, mouseX, mouseY, onEnter }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.2"] });
    const labelY = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [30, 0, 0, -30]);
    const labelOp = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    return (
        <section
            ref={ref}
            className="relative min-h-screen flex items-start py-24 md:py-32"
            onMouseEnter={() => onEnter(section.spotlightColor)}
        >
            {/* Watermark */}
            <Watermark text={section.watermark} isDark={isDark} mouseX={mouseX} mouseY={mouseY} />

            {/* Thin vertical axis line (desktop only) */}
            <div
                className="hidden md:block absolute left-[calc(30%+1px)] top-0 bottom-0 w-px pointer-events-none"
                style={{ background: isDark ? "rgba(255,255,255,0.045)" : "rgba(0,0,0,0.07)" }}
                aria-hidden
            />

            <div className="relative w-full max-w-6xl mx-auto px-6 md:px-12 lg:px-20 grid grid-cols-1 md:grid-cols-[30%_1fr] gap-8 md:gap-20">

                {/* ── LEFT: sticky label ── */}
                <motion.div
                    style={{ y: labelY, opacity: labelOp }}
                    className="md:sticky md:top-36 h-fit flex flex-col gap-3 pt-2"
                >
                    <span
                        className="text-xs font-black tracking-[0.3em] uppercase"
                        style={{
                            color: `rgb(${section.spotlightColor})`,
                            fontFamily: "'Courier New', monospace",
                        }}
                    >
                        {section.id}
                    </span>
                    <h2
                        className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-none"
                        style={{
                            color: isDark ? "rgba(255,255,255,0.88)" : "rgba(26, 26, 26, 0.94)",
                            fontFamily: "'Courier New', monospace",
                            wordBreak: "break-word",
                        }}
                    >
                        {section.label}
                    </h2>
                    <div
                        className="text-xs tracking-widest uppercase mt-1"
                        style={{
                            color: isDark ? "rgba(255,255,255,0.3)" : "rgba(26, 26, 26, 0.6)",
                            fontFamily: "'Courier New', monospace",
                        }}
                    >
                        // {section.tag}
                    </div>
                    {/* Accent line */}
                    <motion.div
                        style={{ scaleX: scrollYProgress }}
                        className="origin-left h-0.5 w-full mt-3 rounded"
                    // No inline background here — use a child div to avoid framer conflict
                    >
                        <div
                            className="w-full h-full rounded"
                            style={{ background: `rgb(${section.spotlightColor})`, opacity: 0.5 }}
                        />
                    </motion.div>
                </motion.div>

                {/* ── RIGHT: content ── */}
                <div className="flex flex-col relative z-10">
                    {section.image && <SectionImage image={section.image} isDark={isDark} />}
                    {section.content.map((block, i) => (
                        <ContentBlock
                            key={i}
                            block={block}
                            isDark={isDark}
                            accentColor={section.spotlightColor}
                        />
                    ))}
                </div>
            </div>

            {/* Section separator */}
            <div
                className="absolute bottom-0 left-6 right-6 md:left-12 md:right-12 lg:left-20 lg:right-20 h-px"
                style={{
                    background: isDark
                        ? `linear-gradient(90deg, transparent, rgba(${section.spotlightColor},0.25), transparent)`
                        : `linear-gradient(90deg, transparent, rgba(${section.spotlightColor},0.35), transparent)`,
                }}
                aria-hidden
            />
        </section>
    );
}

// ─── PAGE HEADER ──────────────────────────────────────────────────────────────
function PageHeader({ isDark }) {
    return (
        <div className="relative min-h-[50vh] flex flex-col justify-center items-start max-w-6xl mx-auto px-6 md:px-12 lg:px-20 py-32">
            <RevealText>
                <span
                    className="text-xs font-black tracking-[0.4em] uppercase mb-4 block"
                    style={{ color: "#5cbdb9", fontFamily: "'Courier New', monospace" }}
                >
                    SYSTEM_PROFILE // RAJASEKHAR
                </span>
            </RevealText>
            <RevealText delay={0.1}>
                <h1
                    className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none mb-6"
                    style={{
                        color: isDark ? "#ffffff" : "#0a1212",
                        fontFamily: "'Courier New', monospace",
                    }}
                >
                    About<br />
                    <span
                        style={{
                            backgroundImage: "linear-gradient(135deg, #5cbdb9, #c9b8f5)",
                            WebkitBackgroundClip: "text",
                            backgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            color: "transparent",
                            display: "inline",
                        }}
                    >
                        _me.
                    </span>
                </h1>
            </RevealText>
            <RevealText delay={0.2}>
                <p
                    className="text-base md:text-lg max-w-xl leading-relaxed"
                    style={{
                        color: isDark ? "rgba(255,255,255,0.45)" : "rgba(10,18,18,0.5)",
                        fontFamily: "'Courier New', monospace",
                    }}
                >
                    Full Stack Engineer. Architect by instinct. Builder by obsession.
                    Scroll to load the full profile.
                </p>
            </RevealText>

            {/* The Scroll hint */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="mt-20 flex flex-col items-center"
                style={{ position: "relative" }}
            >
                {/* The Wire */}
                <div
                    style={{
                        width: 1.5,
                        height: 40,
                        background: `linear-gradient(to top, ${isDark ? "rgba(92,189,185,0.3)" : "rgba(42,158,154,0.4)"}, transparent)`,
                        marginBottom: -2
                    }}
                />

                {/* Mouse Body */}
                <div
                    style={{
                        width: 26,
                        height: 44,
                        borderRadius: 14,
                        border: `2px solid ${isDark ? "rgba(92,189,185,0.3)" : "rgba(42,158,154,0.4)"}`,
                        position: "relative",
                        display: "flex",
                        justifyContent: "center",
                        paddingTop: 8,
                        overflow: "hidden" // Keeps the wheel inside the body
                    }}
                >
                    {/* CSS-Powered Scroll Wheel (Bypasses Framer Motion Logic) */}
                    <div
                        className="mouse-wheel-animation"
                        style={{
                            width: 3,
                            height: 8,
                            borderRadius: 2,
                            backgroundColor: isDark ? "#5cbdb9" : "#2a9e9a",
                            boxShadow: isDark ? "0 0 10px #5cbdb9" : "none",
                        }}
                    />
                </div>

                {/* Status Text */}
                <div
                    style={{
                        fontSize: 10,
                        fontWeight: 800,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: isDark ? "#5cbdb9" : "#2a9e9a",
                        fontFamily: "'Courier New', monospace",
                        marginTop: 16,
                        display: "flex",
                        alignItems: "center",
                        gap: 6
                    }}
                >
                    <span>Scroll_to_Sync</span>
                    <span className="terminal-cursor" style={{ backgroundColor: isDark ? "#5cbdb9" : "#2a9e9a" }} />
                </div>

                {/* Injecting CSS directly into the component for 100% Reliability */}
                <style>{`
    @keyframes mouse-scroll {
      0%   { transform: translateY(0); opacity: 0.2; }
      20%  { opacity: 1; }
      80%  { opacity: 1; }
      100% { transform: translateY(18px); opacity: 0; }
    }

    @keyframes cursor-blink {
      0%, 100% { opacity: 0; }
      50% { opacity: 1; }
    }

    .mouse-wheel-animation {
      animation: mouse-scroll 2s cubic-bezier(0.19, 1, 0.22, 1) infinite;
    }

    .terminal-cursor {
      width: 6px;
      height: 10px;
      animation: cursor-blink 0.8s step-end infinite;
    }
  `}</style>
            </motion.div>
        </div>
    );
}

// ... rest of the code remains the same ...
export default function AboutPage() {
    // ... rest of the code remains the same ...
    const { theme, colors } = useTheme();
    const isDark = theme === "dark";
    const [activeColor, setActiveColor] = useState("92,189,185");

    // Mouse spring for watermark parallax
    const rawX = useRef(0);
    const rawY = useRef(0);
    const mouseX = useSpring(0, { stiffness: 60, damping: 20 });
    const mouseY = useSpring(0, { stiffness: 60, damping: 20 });

    useEffect(() => {
        const onMove = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };
        window.addEventListener("mousemove", onMove, { passive: true });
        return () => window.removeEventListener("mousemove", onMove);
    }, [mouseX, mouseY]);

    const handleSectionEnter = useCallback((color) => {
        setActiveColor(color);
    }, []);

    return (
        <AtomicTransition>
            <div style={{ minHeight: "100vh", background: colors.background, position: "relative" }}>
                {/* Blueprint grid */}
                <div
                    className="fixed inset-0 pointer-events-none"
                    style={{
                        backgroundImage: `
            linear-gradient(${isDark ? "rgba(255,255,255,0.022)" : "rgba(92,189,185,0.06)"} 1px, transparent 1px),
            linear-gradient(90deg, ${isDark ? "rgba(255,255,255,0.022)" : "rgba(92,189,185,0.06)"} 1px, transparent 1px)
          `,
                        backgroundSize: "56px 56px",
                        zIndex: 0,
                    }}
                    aria-hidden
                />

                {/* Spotlight cursor */}
                <SpotlightCursor isDark={isDark} activeColor={activeColor} />

                {/* Content */}
                <div className="relative" style={{ zIndex: 2 }}>
                    <PageHeader isDark={isDark} />

                    {SECTIONS.map((section) => (
                        <AboutSection
                            key={section.id}
                            section={section}
                            isDark={isDark}
                            mouseX={mouseX}
                            mouseY={mouseY}
                            onEnter={handleSectionEnter}
                        />
                    ))}

                    {/* Closing statement */}
                    <div
                        className="relative max-w-6xl mx-auto px-6 md:px-12 lg:px-20 py-24 md:py-36 flex flex-col items-center text-center gap-6"
                        onMouseEnter={() => handleSectionEnter("92,189,185")}
                    >
                        <span
                            className="text-xs font-black tracking-[0.4em] uppercase"
                            style={{ color: "#5cbdb9", fontFamily: "'Courier New', monospace" }}
                        >
                            END OF PROFILE
                        </span>
                        <p
                            className="text-2xl md:text-4xl font-black tracking-tight max-w-2xl leading-tight"
                            style={{
                                color: isDark ? "rgba(255,255,255,0.85)" : "rgba(10,18,18,0.85)",
                                fontFamily: "'Courier New', monospace",
                            }}
                        >
                            Build. Scale. Repeat.
                        </p>
                        <p
                            className="text-sm max-w-md"
                            style={{
                                color: isDark ? "rgba(255,255,255,0.35)" : "rgba(10,18,18,0.38)",
                                fontFamily: "'Courier New', monospace",
                                letterSpacing: "0.06em",
                            }}
                        >
                            kvn_rajasekhar.profile - loaded successfully
                        </p>
                        <div
                            className="w-px h-16 rounded mt-4"
                            style={{ background: isDark ? "rgba(92,189,185,0.4)" : "rgba(92,189,185,0.6)" }}
                        />
                    </div>
                </div>
            </div>
        </AtomicTransition>
    );
}