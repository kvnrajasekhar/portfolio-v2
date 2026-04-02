import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import {
    SiJavascript, SiPython, SiSpringboot, SiNodedotjs, SiExpress,
    SiDotnet, SiReact, SiTailwindcss, SiFramer, SiMui, SiMongodb,
    SiDocker, SiGithubactions, SiVercel,
} from "react-icons/si";
import { FaJava, FaAws } from "react-icons/fa";
import { GrOracle } from "react-icons/gr";


// ─── RADAR RATINGS (honest approximate) ──────────────────────────────────────
const RADAR_AXES = [
    { label: "Backend\nMastery", value: 7.5 },
    { label: "Frontend\nExecution", value: 7.8 },
    { label: "System\nArchitecture", value: 6.5 },
    { label: "Community\nLeadership", value: 8.5 },
    { label: "Professional\nDiscipline", value: 8.0 },
];

// ─── TECH STACK DATA ──────────────────────────────────────────────────────────
const LAYERS = [
    {
        id: "L01", label: "Core Engines", sublabel: "Languages",
        color: "#5cbdb9",
        skills: [
            { name: "Java", years: 1, tooltip: "Enterprise Logic & Spring ecosystem", icon: <FaJava /> },
            { name: "JavaScript ES6+", years: 2, tooltip: "Web Orchestration & async patterns", icon: <SiJavascript /> },
            { name: "Python", years: 2, tooltip: "Scripting, automation & data tasks", icon: <SiPython /> },
        ],
    },
    {
        id: "L02", label: "Framework Ecosystem", sublabel: "Backend + Frontend",
        color: "#c9b8f5",
        backend: [
            { name: "Spring Boot", years: 1, tooltip: "REST APIs, MVC, Hibernate ORM", icon: <SiSpringboot /> },
            { name: "Node.js", years: 2, tooltip: "Event-loop server architecture", icon: <SiNodedotjs /> },
            { name: "Express.js", years: 2, tooltip: "Middleware routing & REST design", icon: <SiExpress /> },
            { name: "ASP.NET MVC", years: 0.5, tooltip: "C# based enterprise MVC pattern", icon: <SiDotnet /> },
        ],
        frontend: [
            { name: "React.js", years: 2, tooltip: "Hooks, Context API, component design", icon: <SiReact /> },
            { name: "Tailwind CSS", years: 1.5, tooltip: "Utility-first responsive UI", icon: <SiTailwindcss /> },
            { name: "Framer Motion", years: 1, tooltip: "Animation & interaction layer", icon: <SiFramer /> },
            { name: "Material-UI", years: 1.5, tooltip: "Component library & theming", icon: <SiMui /> },
        ],
    },
    {
        id: "L03", label: "Data & Infrastructure", sublabel: "Foundation",
        color: "#f7c4a0",
        databases: [
            { name: "MongoDB", years: 2, tooltip: "Document store, Mongoose schemas", icon: <SiMongodb /> },
            { name: "Oracle SQL", years: 1, tooltip: "Relational design, stored procedures", icon: <GrOracle /> },
            { name: "PL/SQL", years: 0.5, tooltip: "Oracle procedural SQL scripting", icon: <GrOracle />    },
        ],
        devops: [
            { name: "Docker", years: 1, tooltip: "Containerisation & compose stacks", icon: <SiDocker /> },
            { name: "GitHub Actions", years: 1, tooltip: "CI/CD pipeline automation", icon: <SiGithubactions /> },
            { name: "Vercel", years: 1.5, tooltip: "Frontend deployment & edge functions", icon: <SiVercel /> },
            { name: "AWS", years: 0.2, tooltip: "Developer Associate — In Progress", icon: <FaAws />, status: "IN_PROGRESS", progress: 22 },
        ],
    },
];

// ─── LEADERSHIP DATA ──────────────────────────────────────────────────────────
const PILLARS = [
    {
        id: "P01", role: "Co-Organizer",
        org: "Google Developer Groups",
        color: "#5cbdb9",
        icon: "◈",
        mission: "Orchestrating a high-impact technical ecosystem by bridging the gap between global Google technologies and local developer talent. Focused on stakeholder management, community-led innovation, and scaling technical literacy through structured knowledge-sharing frameworks.",
        keywords: ["Stakeholder Management", "Public Speaking", "Community Growth", "Event ROI"],
        label: "ECOSYSTEM ORCHESTRATION",
    },
    {
        id: "P02", role: "President",
        org: "Codex Student Technical Club",
        color: "#c9b8f5",
        icon: "◉",
        mission: "Driving the strategic vision and operational excellence of a premier technical organization. Transitioned the club from a student interest group into a professional incubator, fostering a culture of peer-mentorship, rapid prototyping, and industry-aligned skill development.",
        keywords: ["Team Building", "Conflict Resolution", "Technical Roadmap Design", "Curriculum"],
        label: "STRATEGIC MENTORSHIP",
    },
    {
        id: "P03", role: "Contributor",
        org: "Hackathons & Internships",
        color: "#fbe3e8",
        icon: "◆",
        mission: "Managing full-cycle project delivery under pressure. Taking end-to-end ownership from initial API design to final deployment, with a focus on rapid prototyping, peer review quality, and shipping features that create measurable user impact.",
        keywords: ["Resource Allocation", "Rapid Prototyping", "Peer Review", "End-to-End Ownership"],
        label: "AGILE OWNERSHIP",
    },
];

// ─── OPERATIONAL VALUES ───────────────────────────────────────────────────────
const VALUES = [
    {
        value: "Technical Translation",
        translation: "Simplifying complex Middleware Architecture or JWT Auth flows into clear narratives for non-technical stakeholders and cross-functional teams.",
        connects: ["Backend Mastery", "Community Leadership"],
        color: "#5cbdb9",
    },
    {
        value: "Agile Ownership",
        translation: "Taking end-to-end responsibility for features — from initial RESTful API design through testing, review, and final Vercel deployment.",
        connects: ["Frontend Execution", "Professional Discipline"],
        color: "#c9b8f5",
    },
    {
        value: "Systems Thinking",
        translation: "Evaluating how a single Mongoose Schema change impacts the long-term scalability and maintainability of an entire distributed application.",
        connects: ["System Architecture", "Backend Mastery"],
        color: "#f7c4a0",
    },
    {
        value: "Radical Candor",
        translation: "Giving and receiving high-quality, actionable code reviews — the foundational communication skill for SDE-1 roles in high-performance teams.",
        connects: ["Community Leadership", "Frontend Execution"],
        color: "#fbe3e8",
    },
];

// ─── CERTS ────────────────────────────────────────────────────────────────────
const CERTS = [
    { name: "IBM Full Stack Developer", issuer: "IBM", year: 2024, color: "#5cbdb9", link: "#" },
    { name: "Postman API Fundamentals", issuer: "Postman", year: 2024, color: "#c9b8f5", link: "https://drive.google.com/file/d/1l8Q_tP4arAryS3YrLy7FBFNhhqK5FJZX/view?usp=sharing" },
    { name: "NCC C Certificate", issuer: "NCC India", year: 2023, color: "#f7c4a0", link: "#" },
    { name: "Git for Beginners", issuer: "KodeKloud", year: 2024, color: "#fbe3e8", link: "https://drive.google.com/file/d/1qHHp5uyRJD75CoGnJWqAxh1l5ghzdhI7/view?usp=sharing" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function hexRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r},${g},${b}`;
}

function YearBadge({ years, color, isDark }) {
    const label = years < 1 ? `${Math.round(years * 12)}mo` : `${years}yr`;
    return (
        <span style={{
            fontFamily: "'Courier New',monospace",
            fontSize: 8, fontWeight: 800,
            letterSpacing: "0.15em",
            color: isDark ? `rgba(${hexRgb(color)},0.85)` : `rgba(10,18,18,0.85)`,
            background: `rgba(${hexRgb(color)},0.25)`,
            border: `1px solid ${color}55`,
            borderRadius: 3,
            padding: "2px 6px",
            flexShrink: 0,
        }}>
            {label}
        </span>
    );
}

function SectionTag({ label, isDark, color }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 20, height: 1.5, background: color, borderRadius: 1 }} />
            <span style={{
                fontFamily: "'Courier New',monospace",
                fontSize: 12, fontWeight: 800,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color,
            }}>
                {label}
            </span>
            <div style={{ width: 20, height: 1.5, background: color, borderRadius: 1 }} />
        </div>
    );
}

// ─── RADAR CHART ─────────────────────────────────────────────────────────────
function RadarChart({ isDark }) {
    const canvasRef = useRef(null);
    const animRef = useRef(null);
    const progRef = useRef(0);
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });

    useEffect(() => {
        if (!inView) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const dpr = window.devicePixelRatio || 1;
        const S = canvas.clientWidth;
        canvas.width = S * dpr;
        canvas.height = S * dpr;
        ctx.scale(dpr, dpr);
        const cx = S / 2, cy = S / 2;
        const maxR = S * 0.24;
        const labelR = maxR + S * 0.12;
        const n = RADAR_AXES.length;
        const teal = "#5cbdb9", lav = "#c9b8f5";

        const draw = () => {
            if (progRef.current < 1) progRef.current = Math.min(1, progRef.current + 0.018);
            const p = progRef.current;
            ctx.clearRect(0, 0, S, S);

            // Grid rings
            for (let ring = 1; ring <= 5; ring++) {
                const r = (ring / 5) * maxR;
                ctx.beginPath();
                for (let i = 0; i <= n; i++) {
                    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
                    i === 0 ? ctx.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r)
                        : ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
                }
                ctx.closePath();
                ctx.strokeStyle = isDark ? "rgba(255,255,255,0.17)" : "rgba(92,189,185,0.40)";
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }

            // Axis lines
            for (let i = 0; i < n; i++) {
                const a = (i / n) * Math.PI * 2 - Math.PI / 2;
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(cx + Math.cos(a) * maxR, cy + Math.sin(a) * maxR);
                ctx.strokeStyle = isDark ? "rgba(255,255,255,0.1)" : "rgba(92,189,185,0.2)";
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }

            // Filled polygon (animated)
            ctx.beginPath();
            RADAR_AXES.forEach((ax, i) => {
                const a = (i / n) * Math.PI * 2 - Math.PI / 2;
                const r = (ax.value / 10) * maxR * p;
                i === 0 ? ctx.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r)
                    : ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
            });
            ctx.closePath();
            const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
            grad.addColorStop(0, `rgba(92,189,185,${isDark ? 0.35 : 0.28})`);
            grad.addColorStop(1, `rgba(201,184,245,${isDark ? 0.15 : 0.1})`);
            ctx.fillStyle = grad;
            ctx.fill();
            ctx.strokeStyle = teal;
            ctx.lineWidth = 1.8;
            ctx.shadowBlur = 10; ctx.shadowColor = teal;
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Axis dots + labels
            RADAR_AXES.forEach((ax, i) => {
                const a = (i / n) * Math.PI * 2 - Math.PI / 2;
                const r = (ax.value / 10) * maxR * p;
                const dotX = cx + Math.cos(a) * r;
                const dotY = cy + Math.sin(a) * r;

                ctx.save();
                ctx.shadowBlur = 12; ctx.shadowColor = lav;
                ctx.beginPath(); ctx.arc(dotX, dotY, 4.5, 0, Math.PI * 2);
                ctx.fillStyle = lav; ctx.fill();
                ctx.restore();

                // Labels at full radius
                const lx = cx + Math.cos(a) * labelR;
                const ly = cy + Math.sin(a) * labelR;
                const lines = ax.label.split("\n");
                ctx.font = `700 ${S * 0.028}px 'Courier New',monospace`;
                ctx.fillStyle = isDark ? "rgba(255,255,255,0.7)" : "rgba(10,18,18,0.7)";
                ctx.textAlign = "center";
                lines.forEach((ln, li) => {
                    ctx.fillText(ln, lx, ly + (li - (lines.length - 1) / 2) * S * 0.045);
                });

                // Value
                ctx.font = `800 ${S * 0.032}px 'Courier New',monospace`;
                ctx.fillStyle = teal;
                ctx.fillText(`${ax.value}`, dotX, dotY - 10);
            });

            if (progRef.current < 1) animRef.current = requestAnimationFrame(draw);
        };
        animRef.current = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(animRef.current);
    }, [inView, isDark]);

    return (
        <div ref={ref} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <SectionTag label="Proficiency Radar" isDark={isDark} color={isDark ? "#5cbdb9" : "#2a9e9a"} />
            <canvas
                ref={canvasRef}
                style={{ width: "clamp(300px,90vw,480px)", height: "clamp(300px,90vw,480px)", display: "block", margin: "0 auto" }}
            />
        </div>
    );
}

// ─── SKILL CHIP ───────────────────────────────────────────────────────────────
function SkillChip({ skill, color, isDark, showTooltip = true }) {
    // 1. Add state for fixed positioning
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
    const [hovered, setHovered] = useState(false);

    const handleInteraction = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();

        setTooltipPos({
            // 1. Align X exactly to the left edge of the chip
            x: rect.left,
            // 2. Set Y above the chip
            y: rect.top - 46,
            // 3. Store the chip width to apply to the tooltip
            width: rect.width
        });

        if (window.innerWidth < 768) {
            setHovered(!hovered);
        } else {
            setHovered(true);
        }
    };
    // 2. Mobile Scroll Fix
    useEffect(() => {
        const close = () => setHovered(false);
        if (hovered) {
            window.addEventListener("scroll", close, { passive: true });
            window.addEventListener("touchstart", close);
        }
        return () => {
            window.removeEventListener("scroll", close);
            window.removeEventListener("touchstart", close);
        };
    }, [hovered]);

    return (
        <div
            style={{ position: "relative" }}
            onMouseEnter={window.innerWidth > 768 ? handleInteraction : undefined}
            onMouseLeave={() => setHovered(false)}
            onClick={handleInteraction} // Handle tap for mobile
        >
            <motion.div
                whileHover={{ y: -2, boxShadow: `0 6px 20px rgba(${hexRgb(color)},0.3)` }}
                style={{
                    display: "flex", alignItems: "center", gap: 7,
                    background: isDark ? `rgba(${hexRgb(color)},0.1)` : "#ffffff",
                    // Fix Shorthand conflict warnings by defining sides individually
                    borderTop: `1px solid ${color}`,
                    borderRight: `1px solid ${isDark ? `${color}28` : `${color}99`}`, // Darker border for light mode
                    borderBottom: `1px solid ${isDark ? `${color}28` : `${color}99`}`,
                    borderLeft: `1px solid ${isDark ? `${color}28` : `${color}99`}`,
                    borderRadius: 6,
                    padding: "8px 12px",
                    cursor: "default",
                    boxShadow: isDark ? "none" : `0 2px 10px rgba(${hexRgb(color)},0.1)`,
                }}
            >
                {skill.icon && (
                    <span style={{ fontSize: 13 }}>{skill.icon}</span>
                )}
                <span style={{
                    fontFamily: "'Courier New',monospace",
                    fontSize: "clamp(10px,1.1vw,12px)",
                    fontWeight: 700,
                    // Fix light mode legibility
                    color: isDark ? "rgba(255,255,255,0.85)" : "#0a1212",
                    letterSpacing: "0.04em",
                }}>
                    {skill.name}
                </span>
                <YearBadge years={skill.years} color={color} isDark={isDark} />

                {skill.status === "IN_PROGRESS" && (
                    <span style={{
                        fontFamily: "'Courier New',monospace",
                        fontSize: 7, fontWeight: 800,
                        color: "#f7c4a0",
                        background: "rgba(247,196,160,0.15)",
                        border: "1px solid rgba(247,196,160,0.4)",
                        borderRadius: 3, padding: "1px 5px",
                        letterSpacing: "0.15em",
                        animation: "pulse 1.8s ease-in-out infinite",
                    }}>
                        IN PROGRESS
                    </span>
                )}
            </motion.div>

            {/* Tooltip Fix: Fixed position centers above the tracked coordinate */}
            <AnimatePresence>
                {hovered && showTooltip && skill.tooltip && (
                    <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.95 }}
                        transition={{ duration: 0.12 }}
                        style={{
                            position: "fixed",
                            top: tooltipPos.y,        // Use tracked Y
                            left: tooltipPos.x,       // Use tracked X
                            transform: "translateY(-100%)",
                            width: 180,
                            background: isDark ? "#0d1520ee" : "#ffffffee",
                            border: `1px solid ${color}${isDark ? "44" : "99"}`,
                            borderRadius: 7,
                            padding: "8px 12px",
                            pointerEvents: "none",
                            zIndex: 99999,            // Ensure it's above everything
                            backdropFilter: "blur(12px)",
                            boxShadow: `0 4px 20px rgba(${hexRgb(color)},0.25)`,
                            whiteSpace: "normal",
                            wordWrap: "break-word",
                            textAlign: "center",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <span style={{
                            fontFamily: "'Courier New',monospace",
                            fontSize: 11, fontWeight: 600,
                            color: isDark ? "rgba(255,255,255,0.82)" : "#0a1212",
                            lineHeight: 1.5,
                        }}>
                            {skill.tooltip}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ─── AWS PROGRESS BAR ────────────────────────────────────────────────────────
function AWSBar({ isDark }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });
    return (
        <div ref={ref} style={{
            background: isDark ? "rgba(247,196,160,0.08)" : "rgba(247,196,160,0.12)",
            border: "1px solid rgba(247,196,160,0.35)",
            borderRadius: "0 6px 6px 0",
            padding: "12px 16px",
            display: "flex", flexDirection: "column", gap: 8,
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "'Courier New',monospace", fontSize: 10, fontWeight: 800, color: isDark ? "#ffffff" : "#000000", letterSpacing: "0.2em" }}>
                    AWS Developer Associate
                </span>
                <span style={{ fontFamily: "'Courier New',monospace", fontSize: 9, color: "#f7c4a0", fontWeight: 900 }}>
                    22% · IN PROGRESS
                </span>
            </div>
            <div style={{ height: 4, backgroundImage: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)", borderRadius: 2, overflow: "hidden" }}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={inView ? { width: "22%" } : {}}
                    transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                    style={{ height: "100%", backgroundImage: "linear-gradient(90deg, #f7c4a088, #f7c4a0)", boxShadow: "0 0 8px #f7c4a099" }}
                />
            </div>
            <span style={{ fontFamily: "'Courier New',monospace", fontSize: 9, color: isDark ? "rgba(255,255,255,0.4)" : "rgba(10,18,18,0.45)", letterSpacing: "0.12em" }}>
                Target: AWS Certified Developer Associate Q3 2025
            </span>
        </div>
    );
}

// ─── LAYER CARD ───────────────────────────────────────────────────────────────
function LayerCard({ layer, isDark, index, color }) {
    const [expanded, setExpanded] = useState(true);
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-60px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
            style={{
                background: isDark ? `rgba(${hexRgb(layer.color)},0.05)` : "#ffffff",
                borderTopWidth: "1px",
                borderTopStyle: "solid",
                borderTopColor: color,
                borderRightWidth: "1px",
                borderRightStyle: "solid",
                borderRightColor: isDark ? `${color}28` : `${color}55`,
                borderBottomWidth: "1px",
                borderBottomStyle: "solid",
                borderBottomColor: isDark ? `${color}28` : `${color}55`,
                borderLeftWidth: "1px",
                borderLeftStyle: "solid",
                borderLeftColor: isDark ? `${color}28` : `${color}55`,
                borderRadius: 8,
                boxShadow: isDark ? "none" : `0 3px 24px rgba(${hexRgb(layer.color)},0.1)`,
            }}
        >
            {/* Layer header */}
            <button
                onClick={() => setExpanded(e => !e)}
                style={{
                    width: "100%", background: "none", border: "none",
                    padding: "clamp(14px,2vw,20px) clamp(18px,2.5vw,28px)",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    cursor: "pointer", gap: 12,
                    borderBottom: expanded ? `1px solid ${layer.color}22` : "none",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                        fontFamily: "'Courier New',monospace",
                        fontSize: 9, fontWeight: 800, letterSpacing: "0.25em",
                        color: layer.color,
                        background: `rgba(${hexRgb(layer.color)},0.15)`,
                        border: `1px solid ${layer.color}44`,
                        borderRadius: 4, padding: "3px 9px",
                    }}>
                        {layer.id}
                    </div>
                    <div style={{ textAlign: "left" }}>
                        <div style={{ fontFamily: "'Courier New',monospace", fontSize: "clamp(14px,1.8vw,18px)", fontWeight: 900, color: isDark ? "#ffffff" : "#0a1212", letterSpacing: "-0.01em" }}>
                            {layer.label}
                        </div>
                        <div style={{ fontFamily: "'Courier New',monospace", fontSize: 10, fontWeight: 600, color: isDark ? "rgba(255,255,255,0.4)" : "rgba(10,18,18,0.45)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                            {layer.sublabel}
                        </div>
                    </div>
                </div>
                <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.22 }}
                    style={{ color: layer.color, fontSize: 16, fontWeight: 800 }}>▾</motion.span>
            </button>

            <AnimatePresence initial={false}>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: "hidden" }}
                    >
                        <div style={{ padding: "clamp(16px,2vw,24px) clamp(18px,2.5vw,28px)", display: "flex", flexDirection: "column", gap: 20 }}>

                            {/* L01: languages */}
                            {layer.skills && (
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                                    {layer.skills.map(s => <SkillChip key={s.name} skill={s} color={layer.color} isDark={isDark} />)}
                                </div>
                            )}

                            {/* L02: backend + frontend with connector */}
                            {layer.backend && (
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,240px),1fr))", gap: 16 }}>
                                    <div>
                                        <div style={{ fontFamily: "'Courier New',monospace", fontSize: 9, fontWeight: 800, letterSpacing: "0.25em", color: isDark ? "rgba(255,255,255,0.35)" : "rgba(10,18,18,0.4)", textTransform: "uppercase", marginBottom: 10 }}>
                      // Backend
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                            {layer.backend.map(s => <SkillChip key={s.name} skill={s} color={layer.color} isDark={isDark} />)}
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <div style={{ width: 1, minHeight: 80, backgroundImage: `linear-gradient(180deg, ${layer.color}00, ${layer.color}88, ${layer.color}00)` }} />
                                        <span style={{ fontFamily: "'Courier New',monospace", fontSize: 10, color: layer.color, fontWeight: 800, writingMode: "vertical-rl", letterSpacing: "0.2em", margin: "0 4px" }}>FULL-STACK</span>
                                        <div style={{ width: 1, minHeight: 80, backgroundImage: `linear-gradient(180deg, ${layer.color}00, ${layer.color}88, ${layer.color}00)` }} />
                                    </div>
                                    <div>
                                        <div style={{ fontFamily: "'Courier New',monospace", fontSize: 9, fontWeight: 800, letterSpacing: "0.25em", color: isDark ? "rgba(255,255,255,0.35)" : "rgba(10,18,18,0.4)", textTransform: "uppercase", marginBottom: 10 }}>
                      // Frontend
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                            {layer.frontend.map(s => <SkillChip key={s.name} skill={s} color={layer.color} isDark={isDark} />)}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* L03: databases + devops */}
                            {layer.databases && (
                                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                    <div>
                                        <div style={{ fontFamily: "'Courier New',monospace", fontSize: 9, fontWeight: 800, letterSpacing: "0.25em", color: isDark ? "rgba(255,255,255,0.35)" : "rgba(10,18,18,0.4)", textTransform: "uppercase", marginBottom: 10 }}>
                      // Databases
                                        </div>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                                            {layer.databases.map(s => <SkillChip key={s.name} skill={s} color={layer.color} isDark={isDark} />)}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontFamily: "'Courier New',monospace", fontSize: 9, fontWeight: 800, letterSpacing: "0.25em", color: isDark ? "rgba(255,255,255,0.35)" : "rgba(10,18,18,0.4)", textTransform: "uppercase", marginBottom: 10 }}>
                      // Cloud & DevOps
                                        </div>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                                            {layer.devops.filter(s => s.status !== "IN_PROGRESS").map(s => <SkillChip key={s.name} skill={s} color={layer.color} isDark={isDark} />)}
                                        </div>
                                    </div>
                                    <AWSBar isDark={isDark} />
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// ─── LEADERSHIP PILLAR ────────────────────────────────────────────────────────
function LeadershipPillar({ pillar, index, isDark, color }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-60px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 44 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: index * 0.13, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4, boxShadow: `0 12px 40px rgba(${hexRgb(pillar.color)},0.2)` }}
            style={{
                background: isDark ? `rgba(${hexRgb(pillar.color)},0.06)` : "#ffffff",
                borderTopWidth: "1px",
                borderTopStyle: "solid",
                borderTopColor: color,
                borderRightWidth: "1px",
                borderRightStyle: "solid",
                borderRightColor: isDark ? `${color}28` : `${color}55`,
                borderBottomWidth: "1px",
                borderBottomStyle: "solid",
                borderBottomColor: isDark ? `${color}28` : `${color}55`,
                borderLeftWidth: "1px",
                borderLeftStyle: "solid",
                borderLeftColor: isDark ? `${color}28` : `${color}55`,
                borderRadius: 8,
                padding: "clamp(20px,2.5vw,28px)",
                display: "flex", flexDirection: "column", gap: 16,
                boxShadow: isDark ? "none" : `0 3px 20px rgba(${hexRgb(pillar.color)},0.1)`,
                transition: "box-shadow 0.3s ease",
            }}
        >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                <div>
                    <div style={{ fontFamily: "'Courier New',monospace", fontSize: 9, fontWeight: 800, letterSpacing: "0.28em", color: pillar.color, marginBottom: 8 }}>
                        {pillar.label}
                    </div>
                    <div style={{ fontFamily: "'Courier New',monospace", fontSize: "clamp(16px,2vw,22px)", fontWeight: 900, color: isDark ? "#ffffff" : "#0a1212", letterSpacing: "-0.01em", lineHeight: 1.15 }}>
                        {pillar.org}
                    </div>
                    <div style={{ fontFamily: "'Courier New',monospace", fontSize: 11, fontWeight: 700, color: isDark ? "rgba(255,255,255,0.45)" : "rgba(10,18,18,0.5)", marginTop: 4, letterSpacing: "0.08em" }}>
                        {pillar.role}
                    </div>
                </div>
                <span style={{ fontSize: "clamp(22px,3vw,32px)", color: pillar.color, flexShrink: 0, opacity: 0.7 }}>{pillar.icon}</span>
            </div>

            <p style={{
                margin: 0,
                fontFamily: "'Courier New',monospace",
                fontSize: "clamp(10px,1.1vw,12px)",
                fontWeight: 600,
                color: isDark ? "rgba(255,255,255,0.68)" : "rgba(10,18,18,0.7)",
                lineHeight: 1.8,
            }}>
                {pillar.mission}
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {pillar.keywords.map(kw => (
                    <span key={kw} style={{
                        fontFamily: "'Courier New',monospace",
                        fontSize: "clamp(8px,0.9vw,10px)",
                        fontWeight: 700,
                        color: isDark ? "#ffffff8b" : "#0a12126d",
                        background: `rgba(${hexRgb(pillar.color)},0.32)`,
                        border: `1px solid ${pillar.color}44`,
                        borderRadius: 4,
                        padding: "3px 9px",
                        letterSpacing: "0.08em",
                    }}>
                        {kw}
                    </span>
                ))}
            </div>
        </motion.div>
    );
}

// ─── OPERATIONAL VALUE ────────────────────────────────────────────────────────
function ValueCard({ val, index, isDark, color }) { 
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-40px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: index % 2 === 0 ? -24 : 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{
                display: "flex", gap: 14, alignItems: "flex-start",
                padding: "clamp(14px,2vw,20px)",
                background: isDark ? `rgba(${hexRgb(val.color)},0.06)` : "#ffffff",
                borderTopWidth: "1px",
                borderTopStyle: "solid",
                borderTopColor: color,
                borderRightWidth: "1px",
                borderRightStyle: "solid",
                borderRightColor: isDark ? `${color}28` : `${color}55`,
                borderBottomWidth: "1px",
                borderBottomStyle: "solid",
                borderBottomColor: isDark ? `${color}28` : `${color}55`,
                borderLeftWidth: "1px",
                borderLeftStyle: "solid",
                borderLeftColor: isDark ? `${color}28` : `${color}55`,
                borderRadius: "0 8px 8px 0",
                boxShadow: isDark ? "none" : `0 2px 14px rgba(${hexRgb(val.color)},0.08)`,
            }}
        >
            <div style={{ flexShrink: 0, width: 8, height: 8, borderRadius: "50%", background: val.color, marginTop: 5, boxShadow: `0 0 8px ${val.color}` }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ fontFamily: "'Courier New',monospace", fontSize: "clamp(12px,1.3vw,14px)", fontWeight: 900, color: isDark ? "#ffffff" : "#0a1212" }}>
                    {val.value}
                </div>
                <p style={{ margin: 0, fontFamily: "'Courier New',monospace", fontSize: "clamp(10px,1.1vw,12px)", fontWeight: 600, color: isDark ? "rgba(255,255,255,0.65)" : "rgba(10,18,18,0.68)", lineHeight: 1.75 }}>
                    {val.translation}
                </p>
                <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                    {val.connects.map(c => (
                        <span key={c} style={{ fontFamily: "'Courier New',monospace", fontSize: 8, fontWeight: 800, color: isDark ? c.color : "#0a12126d", letterSpacing: "0.15em", opacity: 0.75 }}>
                            ↔ {c}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

// ─── CERT VAULT ───────────────────────────────────────────────────────────────
function CertVault({ isDark, color }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });

    return (
        <div ref={ref}>
            <SectionTag label="Certification Vault" isDark={isDark} color={isDark ? "#5cbdb9" : "#2a9e9a"} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,220px),1fr))", gap: "clamp(12px,2vw,18px)" }}>
                {CERTS.map((cert, i) => (
                    <motion.div
                        key={cert.name}
                        initial={{ opacity: 0, y: 24 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        whileHover={{ y: -3, boxShadow: `0 8px 28px rgba(${hexRgb(cert.color)},0.2)` }}
                        style={{
                            background: isDark ? `rgba(${hexRgb(cert.color)},0.07)` : "#ffffff",
                            borderTopWidth: "1px",
                            borderTopStyle: "solid",
                            borderTopColor: color,
                            borderRightWidth: "1px",
                            borderRightStyle: "solid",
                            borderRightColor: isDark ? `${color}28` : `${color}55`,
                            borderBottomWidth: "1px",
                            borderBottomStyle: "solid",
                            borderBottomColor: isDark ? `${color}28` : `${color}55`,
                            borderLeftWidth: "1px",
                            borderLeftStyle: "solid",
                            borderLeftColor: isDark ? `${color}28` : `${color}55`,
                            borderRadius: 8,
                            padding: "clamp(14px,2vw,20px)",
                            display: "flex", flexDirection: "column", gap: 10,
                            boxShadow: isDark ? "none" : `0 2px 14px rgba(${hexRgb(cert.color)},0.08)`,
                            transition: "box-shadow 0.3s ease",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: cert.color, boxShadow: `0 0 8px ${cert.color}` }} />
                            <span style={{ fontFamily: "'Courier New',monospace", fontSize: 9, fontWeight: 800, color: cert.color, letterSpacing: "0.2em" }}>
                                VERIFIED MODULE
                            </span>
                        </div>
                        <div style={{ fontFamily: "'Courier New',monospace", fontSize: "clamp(11px,1.2vw,13px)", fontWeight: 900, color: isDark ? "#ffffff" : "#0a1212", lineHeight: 1.35 }}>
                            {cert.name}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                            <span style={{ fontFamily: "'Courier New',monospace", fontSize: 9, fontWeight: 700, color: isDark ? "rgba(255,255,255,0.45)" : "rgba(10,18,18,0.5)", letterSpacing: "0.1em" }}>
                                {cert.issuer} · {cert.year}
                            </span>
                            <a
                                href={cert.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    fontFamily: "'Courier New',monospace",
                                    fontSize: 9, fontWeight: 800,
                                    color: isDark ? cert.color : "#0a121280",
                                    textDecoration: "none",
                                    background: `rgba(${hexRgb(cert.color)},0.32)`,
                                    border: `1px solid ${cert.color}44`,
                                    borderRadius: 4,
                                    padding: "3px 9px",
                                    letterSpacing: "0.15em",
                                }}
                            >
                                [VERIFY ↗]
                            </a>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

// ─── VIEW TOGGLE ─────────────────────────────────────────────────────────────
const VIEWS = ["Developer Mode", "Leader Mode", "Hybrid"];

function ViewToggle({ view, setView, isDark }) {
    const teal = isDark ? "#5cbdb9" : "#2a9e9a";
    return (
        <div style={{
            display: "flex", gap: 4, padding: 4,
            background: isDark ? "rgba(255,255,255,0.05)" : "rgba(10,18,18,0.05)",
            border: `1px solid ${teal}33`,
            borderRadius: 10,
            width: "fit-content",
        }}>
            {VIEWS.map(v => (
                <button
                    key={v}
                    onClick={() => setView(v)}
                    style={{
                        fontFamily: "'Courier New',monospace",
                        fontSize: "clamp(9px,1vw,11px)",
                        fontWeight: 800,
                        letterSpacing: "0.1em",
                        color: view === v ? (isDark ? "#000000" : "#ffffff") : (isDark ? "rgba(255,255,255,0.5)" : "rgba(10,18,18,0.5)"),
                        background: view === v ? teal : "transparent",
                        border: "none",
                        borderRadius: 7,
                        padding: "clamp(6px,1vw,9px) clamp(10px,1.5vw,16px)",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                    }}
                >
                    [{v}]
                </button>
            ))}
        </div>
    );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function SkillsPage() {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const [view, setView] = useState("Hybrid");
    const bg = isDark ? "#000000" : "#ffffff";
    const teal = isDark ? "#5cbdb9" : "#2a9e9a";
    const text = isDark ? "#ffffff" : "#0a1212";
    const muted = isDark ? "rgba(255,255,255,0.38)" : "rgba(10,18,18,0.42)";
    const gridLine = isDark ? "rgba(255,255,255,0.025)" : "rgba(92,189,185,0.07)";

    const showDev = view === "Developer Mode" || view === "Hybrid";
    const showLeader = view === "Leader Mode" || view === "Hybrid";

    return (
        <div style={{
            minHeight: "100vh",
            background: bg,
            padding: "clamp(56px,9vw,100px) clamp(16px,5vw,72px)",
            fontFamily: "'Courier New',monospace",
            transition: "background 0.4s ease",
            position: "relative",
        }}>
            {/* Blueprint grid */}
            <div style={{
                position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
                backgroundImage: `linear-gradient(${gridLine} 1px,transparent 1px),linear-gradient(90deg,${gridLine} 1px,transparent 1px)`,
                backgroundSize: "48px 48px",
            }} />

            <div style={{ maxWidth: "100%", margin: "0 auto", position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: "clamp(48px,7vw,80px)" }}>

                {/* ── Page header ── */}
                <div className="mt-12">
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                        <div style={{ width: 24, height: 1.5, background: teal, borderRadius: 1 }} />
                        <span style={{ fontFamily: "'Courier New',monospace", fontSize: 9, fontWeight: 800, letterSpacing: "0.35em", textTransform: "uppercase", color: teal }}>
                            The Skill Equilibrium
                        </span>
                        <div style={{ width: 24, height: 1.5, background: teal, borderRadius: 1 }} />
                    </div>
                    <h1 style={{
                        margin: 0,
                        fontFamily: "'Courier New',monospace",
                        fontSize: "clamp(28px,5.5vw,60px)",
                        fontWeight: 900,
                        letterSpacing: "-0.03em",
                        lineHeight: 1.05,
                        color: text,
                    }}>
                        Dual-Core{" "}
                        <div style={{ display: "inline-block" }}>
                            <span style={{
                                display: "inline",
                                backgroundImage: isDark
                                    ? "linear-gradient(135deg, #5cbdb9, #c9b8f5)"
                                    : "linear-gradient(135deg, #2a9e9a, #6040c0)",
                                WebkitBackgroundClip: "text",
                                backgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                color: "transparent",
                            }}>
                                System.
                            </span>
                        </div>
                    </h1>
                    <p style={{ margin: "14px 0 24px", fontFamily: "'Courier New',monospace", fontSize: "clamp(11px,1.3vw,14px)", fontWeight: 600, color: muted, letterSpacing: "0.06em", maxWidth: 520, lineHeight: 1.75 }}>
                        Logic Core meets Leadership OS. Every skill documented, every year counted.
                    </p>
                    <ViewToggle view={view} setView={setView} isDark={isDark} />
                    <div style={{ marginTop: 24, height: 1.5, background: isDark ? "linear-gradient(90deg,#5cbdb9,#c9b8f5 45%,#fbe3e8 75%,transparent)" : "linear-gradient(90deg,#2a9e9a,#6040c0 45%,#c04070 75%,transparent)", opacity: isDark ? 0.45 : 0.6 }} />
                </div>

                {/* ── Radar chart ── */}
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <RadarChart isDark={isDark} />
                </div>

                {/* ── Logic Core (Tech Stack) ── */}
                <AnimatePresence>
                    {showDev && (
                        <motion.div
                            key="dev"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            <SectionTag label="Logic Core · Tech Stack" isDark={isDark} color={isDark ? "#5cbdb9" : "#2a9e9a"} />
                            <div style={{ display: "flex", flexDirection: "column", gap: "clamp(14px,2vw,20px)" }}>
                                {LAYERS.map((layer, i) => <LayerCard key={layer.id} layer={layer} isDark={isDark} index={i} color={isDark ? "#5cbdb9" : "#2a9e9a"} />)}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Leadership OS ── */}
                <AnimatePresence>
                    {showLeader && (
                        <motion.div
                            key="leader"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            <SectionTag label="Leadership OS · Command Center" isDark={isDark} color={isDark ? "#c9b8f5" : "#6040c0"} />
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,280px),1fr))", gap: "clamp(14px,2vw,20px)" }}>
                                {PILLARS.map((p, i) => <LeadershipPillar key={p.id} pillar={p} index={i} isDark={isDark} color={isDark ? "#c9b8f5" : "#6040c0"} />)}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Operational Values (always shown) ── */}
                <div>
                    <SectionTag label="Operational Values · Connective Tissue" isDark={isDark} color={isDark ? "#fbe3e8" : "#c04070"} />
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: "clamp(12px,1.8vw,18px)" }}>
                        {VALUES.map((v, i) => <ValueCard key={v.value} val={v} index={i} isDark={isDark} color={isDark ? "#fbe3e8" : "#c04070"} />)}
                    </div>
                </div>

                {/* ── Cert Vault ── */}
                <CertVault isDark={isDark} color={isDark ? "#fbe3e8" : "#c04070"} />

                {/* ── Footer rule ── */}
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ flex: 1, height: 1, background: isDark ? "rgba(255,255,255,0.07)" : "rgba(10,100,90,0.15)" }} />
                    <span style={{ fontFamily: "'Courier New',monospace", fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: isDark ? "rgba(255,255,255,0.2)" : "rgba(10,80,70,0.4)" }}>
                        Rajasekhar — Skill Equilibrium — v1.0
                    </span>
                    <div style={{ flex: 1, height: 1, background: isDark ? "rgba(255,255,255,0.07)" : "rgba(10,100,90,0.15)" }} />
                </div>

            </div>

            <style>{`
        @keyframes pulse {
          0%,100% { opacity:0.6; }
          50%      { opacity:1; }
        }
      `}</style>
        </div>
    );
}