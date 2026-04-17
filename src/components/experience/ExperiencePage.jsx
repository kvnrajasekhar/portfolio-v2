import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { FaMapMarkerAlt } from "react-icons/fa";
import AtomicTransition from "../transition/AtomicTransition";

// ImageKit CDN Configuration
const IMAGEKIT_BASE_URL = "https://ik.imagekit.io/vnrajasekhar";

// Images using ImageKit CDN
const bestCadetImage = `${IMAGEKIT_BASE_URL}/tr:w-1000,q-99,f-auto/ncc/best-cadet.jpg`;
const bestCadetImage2 = `${IMAGEKIT_BASE_URL}/tr:w-1000,q-99,f-auto/ncc/best-cadet-2.png`;
const bestCadetImage3 = `${IMAGEKIT_BASE_URL}/tr:w-1000,q-99,f-auto/ncc/best-cadet-3.jpg`;
const certificateA = `${IMAGEKIT_BASE_URL}/tr:w-1000,q-99,f-auto/ncc/certificate-a.jpg`;
const certificateB = `${IMAGEKIT_BASE_URL}/tr:w-1000,q-99,f-auto/ncc/certificate-b.jpg`;
const certificateC = `${IMAGEKIT_BASE_URL}/tr:w-1000,q-99,f-auto/ncc/certificate-c.jpg`;
const nccSocial1 = `${IMAGEKIT_BASE_URL}/tr:w-1000,q-99,f-auto/ncc/ncc-social-1.jpg`;
const nccSocial2 = `${IMAGEKIT_BASE_URL}/tr:w-1000,q-99,f-auto/ncc/ncc-social-2.jpg`;
const gdgWorkshop1 = `${IMAGEKIT_BASE_URL}/tr:w-1000,q-99,f-auto/gdg/gdg-workshop-1.jpg`;
const gdgWorkshop2 = `${IMAGEKIT_BASE_URL}/tr:w-1000,q-99,f-auto/gdg/gdg-workshop-2.jpg`;
const codexCompetition1 = `${IMAGEKIT_BASE_URL}/tr:w-1000,q-99,f-auto/codex/codex-competition-1.jpg`;
const codexCompetition2 = `${IMAGEKIT_BASE_URL}/tr:w-1000,q-99,f-auto/codex/codex-competition-2.jpg`;
const codexCompetition3 = `${IMAGEKIT_BASE_URL}/tr:w-1000,q-99,f-auto/codex/codex-competition-3.jpg`;


// ─── IMAGE LIGHTBOX ───────────────────────────────────────────────────────────
function ImageLightbox({ images, startIndex, onClose, isDark }) {
    const [current, setCurrent] = useState(startIndex);
    const [zoom, setZoom] = useState(0.3);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const total = images.length;

    useEffect(() => {
        const handler = (e) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight") setCurrent(c => Math.min(c + 1, total - 1));
            if (e.key === "ArrowLeft") setCurrent(c => Math.max(c - 1, 0));
            if (e.key === "+" || e.key === "=") setZoom(z => Math.min(z + 0.05, 3));
            if (e.key === "-" || e.key === "_") setZoom(z => Math.max(z - 0.05, 0.3));
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [total, onClose]);

    // Reset zoom and position when image changes
    useEffect(() => {
        setZoom(0.3);
        setPosition({ x: 0, y: 0 });
    }, [current]);

    // Disable body scrolling when lightbox is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const teal = isDark ? "#5cbdb9" : "#2a9e9a";
    const muted = isDark ? "rgba(255,255,255,0.38)" : "rgba(10,18,18,0.4)";

    const handleWheel = (e) => {
        // Only zoom if Ctrl key is held down
        if (e.ctrlKey) {
            e.preventDefault();
            e.stopPropagation();
            const delta = e.deltaY > 0 ? -0.05 : 0.05;
            setZoom(z => Math.max(0.3, Math.min(3, z + delta)));
        }
        // Otherwise, do nothing (normal scroll behavior)
    };

    const handleMouseDown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
        setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y
        });
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            e.preventDefault();
            e.stopPropagation();
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleTouchStart = (e) => {
        e.stopPropagation();
        const touch = e.touches[0];
        setIsDragging(true);
        setDragStart({
            x: touch.clientX - position.x,
            y: touch.clientY - position.y
        });
    };

    const handleTouchMove = (e) => {
        if (isDragging) {
            e.stopPropagation();
            const touch = e.touches[0];
            setPosition({
                x: touch.clientX - dragStart.x,
                y: touch.clientY - dragStart.y
            });
        }
    };

    const handleTouchEnd = (e) => {
        e.stopPropagation();
        setIsDragging(false);
    };

    const resetZoom = () => {
        setZoom(0.3);
        setPosition({ x: 0, y: 0 });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="lg:mt-12"
            style={{
                position: "fixed", inset: 0, zIndex: 1000,
                background: "rgba(0,0,0,0.92)", backdropFilter: "blur(8px)",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", padding: 24,
            }}
        >
            <motion.div
                initial={{ scale: 0.88, y: 20 }} animate={{ scale: 1, y: 0 }}
                onClick={e => e.stopPropagation()}
                className="mt-9"
                style={{ zIndex: "99999", position: "relative", maxWidth: 820, width: "100%", display: "flex", flexDirection: "column", gap: 16 }}
            >
                {/* Image */}
                <div
                    style={{
                        position: "relative", borderRadius: 8, overflow: "hidden",
                        background: isDark ? "#111" : "#f0f0f0",
                        border: `1px solid ${teal}44`,
                        aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default",
                    }}
                    onWheel={handleWheel}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {images[current].src ? (
                        <div style={{
                            position: "relative",
                            overflow: "auto",
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                            <img
                                src={images[current].src}
                                alt={images[current].label}
                                style={{
                                    transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
                                    transition: isDragging ? "none" : "transform 0.2s ease",
                                    maxWidth: "none",
                                    maxHeight: "none",
                                    cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default",
                                    userSelect: "none",
                                    WebkitUserDrag: "none",
                                    KhtmlUserDrag: "none",
                                    MozUserDrag: "none",
                                    OUserDrag: "none",
                                    pointerEvents: "auto",
                                }}
                            />
                        </div>
                    ) : (
                        <div style={{
                            display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                            color: muted, fontFamily: "'Courier New', monospace", fontSize: 12,
                        }}>
                            <span style={{ fontSize: 32, opacity: 0.3 }}>◻</span>
                            <span style={{ letterSpacing: "0.2em" }}>IMAGE_PENDING</span>
                        </div>
                    )}
                    {/* Floating label */}
                    <div style={{
                        position: "absolute", bottom: 0, left: 0, right: 0,
                        background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
                        padding: "32px 20px 16px",
                    }}>
                        <span style={{ fontFamily: "'Courier New', monospace", fontSize: 12, fontWeight: 700, color: "#fff", letterSpacing: "0.08em" }}>
                            {images[current].label}
                        </span>
                    </div>
                    {/* Counter */}
                    <div style={{
                        position: "absolute", top: 12, right: 12,
                        background: "rgba(0,0,0,0.7)", borderRadius: 4,
                        padding: "4px 10px", fontFamily: "'Courier New', monospace", fontSize: 9,
                        color: teal, letterSpacing: "0.2em",
                    }}>
                        {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                    </div>
                </div>

                {/* Caption */}
                {images[current].caption && (
                    <p style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: muted, textAlign: "center", margin: 0, fontStyle: "italic" }}>
                        {images[current].caption}
                    </p>
                )}

                {/* Nav */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>
                    <button onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}
                        style={{ background: "none", border: `1px solid ${current === 0 ? "rgba(255,255,255,0.1)" : teal}`, borderRadius: 4, color: current === 0 ? "rgba(255,255,255,0.2)" : teal, fontFamily: "'Courier New', monospace", fontSize: 11, padding: "6px 16px", cursor: current === 0 ? "default" : "pointer", letterSpacing: "0.15em" }}>
                        ‹ PREV
                    </button>
                    <div style={{ display: "flex", gap: 6 }}>
                        {images.map((_, i) => (
                            <button key={i} onClick={() => setCurrent(i)} style={{
                                width: i === current ? 20 : 7, height: 7, borderRadius: 4, border: "none",
                                background: i === current ? teal : "rgba(255,255,255,0.2)", cursor: "pointer", padding: 0, transition: "all 0.2s",
                            }} />
                        ))}
                    </div>
                    <button onClick={() => setCurrent(c => Math.min(total - 1, c + 1))} disabled={current === total - 1}
                        style={{ background: "none", border: `1px solid ${current === total - 1 ? "rgba(255,255,255,0.1)" : teal}`, borderRadius: 4, color: current === total - 1 ? "rgba(255,255,255,0.2)" : teal, fontFamily: "'Courier New', monospace", fontSize: 11, padding: "6px 16px", cursor: current === total - 1 ? "default" : "pointer", letterSpacing: "0.15em" }}>
                        NEXT ›
                    </button>
                </div>

                {/* Zoom Controls */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
                    <button onClick={() => setZoom(z => Math.max(0.3, z - 0.05))}
                        style={{ background: "none", border: `1px solid ${zoom <= 0.3 ? "rgba(255,255,255,0.1)" : teal}`, borderRadius: 4, color: zoom <= 0.3 ? "rgba(255,255,255,0.2)" : teal, fontFamily: "'Courier New', monospace", fontSize: 10, padding: "4px 8px", cursor: zoom <= 0.3 ? "default" : "pointer", letterSpacing: "0.1em" }}>
                        − ZOOM OUT
                    </button>
                    <button onClick={resetZoom}
                        style={{ background: "none", border: `1px solid ${teal}`, borderRadius: 4, color: teal, fontFamily: "'Courier New', monospace", fontSize: 10, padding: "4px 8px", cursor: "pointer", letterSpacing: "0.1em" }}>
                        RESET
                    </button>
                    <button onClick={() => setZoom(z => Math.min(3, z + 0.05))}
                        style={{ background: "none", border: `1px solid ${zoom >= 3 ? "rgba(255,255,255,0.1)" : teal}`, borderRadius: 4, color: zoom >= 3 ? "rgba(255,255,255,0.2)" : teal, fontFamily: "'Courier New', monospace", fontSize: 10, padding: "4px 8px", cursor: zoom >= 3 ? "default" : "pointer", letterSpacing: "0.1em" }}>
                        ZOOM IN +
                    </button>
                    <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: muted, letterSpacing: "0.1em" }}>
                        {Math.round(zoom * 100)}%
                    </span>
                </div>

                {/* Close */}
                <button onClick={onClose} style={{
                    position: "absolute", top: -40, right: 0,
                    background: "none", border: "none", color: "rgba(255,255,255,0.5)",
                    fontSize: 20, cursor: "pointer", fontFamily: "'Courier New', monospace",
                }}>✕ CLOSE</button>
            </motion.div>
        </motion.div>
    );
}

// ─── THUMBNAIL STRIP ──────────────────────────────────────────────────────────
function ThumbnailStrip({ images, isDark, label }) {
    const [open, setOpen] = useState(false);
    const [startIdx, setStartIdx] = useState(0);
    const teal = isDark ? "#5cbdb9" : "#2a9e9a";
    const muted = isDark ? "rgba(255,255,255,0.38)" : "rgba(10,18,18,0.4)";

    const openAt = (i) => { setStartIdx(i); setOpen(true); };

    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase", color: muted }}>
          // EVIDENCE_LOG · {images.length} frame{images.length !== 1 ? "s" : ""}
                </span>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {images.map((img, i) => (
                        <motion.button
                            key={i} onClick={() => openAt(i)}
                            whileHover={{ scale: 1.04 }}
                            style={{
                                position: "relative", width: 72, height: 52,
                                borderRadius: 5, overflow: "hidden", cursor: "pointer",
                                border: `1px solid ${teal}44`, background: isDark ? "#111" : "#f0f0f0",
                                padding: 0, flexShrink: 0,
                            }}
                        >
                            {img.src ? (
                                <img src={img.src} alt={img.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <span style={{ fontSize: 9, opacity: 0.25 }}>◻</span>
                                </div>
                            )}
                            {/* Hover overlay with label */}
                            <motion.div
                                initial={{ opacity: 0 }} whileHover={{ opacity: 1 }}
                                style={{
                                    position: "absolute", inset: 0,
                                    background: "rgba(0,0,0,0.75)",
                                    display: "flex", alignItems: "center", justifyContent: "center", padding: 4,
                                }}
                            >
                                <span style={{ fontFamily: "'Courier New', monospace", fontSize: 7, color: isDark ? teal : "#fff", textAlign: "center", letterSpacing: "0.1em", lineHeight: 1.4 }}>
                                    {img.label}
                                </span>
                            </motion.div>
                            {/* Index badge */}
                            <div style={{
                                position: "absolute", top: 3, left: 3,
                                background: "rgba(0,0,0,0.7)", borderRadius: 2,
                                padding: "1px 4px", fontFamily: "'Courier New', monospace", fontSize: 7, color: isDark ? teal : "#fff",
                            }}>
                                {String(i + 1).padStart(2, "0")}
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {open && (
                    <ImageLightbox images={images} startIndex={startIdx} onClose={() => setOpen(false)} isDark={isDark} />
                )}
            </AnimatePresence>
        </>
    );
}

// ─── AXIS DOT ─────────────────────────────────────────────────────────────────
function AxisDot({ color, isDark, size = 10 }) {
    return (
        <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
            <motion.div
                animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ repeat: Infinity, duration: 2.2 }}
                style={{ position: "absolute", inset: 0, borderRadius: "50%", background: color }}
            />
            <div style={{ position: "absolute", inset: 2, borderRadius: "50%", background: color }} />
        </div>
    );
}

// ─── REVEAL ───────────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = "" }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-50px" });
    return (
        <motion.div ref={ref} initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
            className={className}>
            {children}
        </motion.div>
    );
}

// ─── SECTION HEADER ───────────────────────────────────────────────────────────
function SectionHeader({ index, tag, title, role, subtitle, isDark, color }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });
    return (
        <motion.div ref={ref} initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55 }}
            style={{ marginBottom: "clamp(32px,5vw,48px)" }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, fontWeight: 800, letterSpacing: "0.3em", color, minWidth: 28 }}>
                    {index}
                </span>
                <div style={{ flex: 1, height: 1, background: isDark ? "rgba(255,255,255,0.08)" : "rgba(10,18,18,0.1)" }} />
                <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase", color }}>
                    {tag}
                </span>
                <div style={{ width: 20, height: 1, background: color, opacity: 0.6 }} />
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 16, flexWrap: "wrap", marginBottom: 8 }}>
                <h2 style={{ fontFamily: "'Courier New', monospace", fontSize: "clamp(22px,4vw,40px)", fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1.1, color: isDark ? "#ffffff" : "#0a1212", margin: 0 }}>
                    {title}
                </h2>
                {(role || subtitle) && (
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        {role && (
                            <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, fontWeight: 700, color: isDark ? "#fff" : "#000", background: `rgba(${isDark ? "92,189,185" : "42,158,154"},0.1)`, border: `1px solid rgba(${isDark ? "92,189,185" : "42,158,154"},0.25)`, borderRadius: 3, padding: "3px 9px", letterSpacing: "0.06em" }}>
                                {role}
                            </span>
                        )}
                        {subtitle && (
                            <span style={{ fontFamily: "'Courier New', monospace", fontSize: "clamp(11px,1.3vw,13px)", color: isDark ? "rgba(255, 255, 255, 0.75)" : "rgba(10,18,18,0.42)", letterSpacing: "0.06em" }}>
                                {subtitle}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// §1 — PROFESSIONAL DEPLOYMENT
// ═══════════════════════════════════════════════════════════════════════════════
const WORK_EXP = [
    {
        role: "Software Engineer Trainee",
        company: "Cognizant Technology Solutions",
        period: "Sep 2025 – Present",
        location: "Hyderabad, India",
        status: "ACTIVE",
        color: "#5cbdb9",
        stack: ["C#", "ASP.NET MVC", "Oracle SQL", "MS Access", "BI Reporting"],
        bullets: [
            { text: "Architect and maintain a critical data synchronization layer using Microsoft Access as a middleware bridge; engineered complex SQL queries to flow data from backend servers to BI platforms.", impact: "Production BI Pipeline" },
            { text: "Design and optimize database schemas and complex queries in Oracle SQL Developer for highly accurate Business Intelligence customer reports per evolving business requirements.", impact: "35% query optimization" },
            { text: "Translate intricate client business requirements into functional database updates, modifying middleware queries to ensure real-time accuracy in Customer BI Reports and financial dashboards.", impact: "Real-time BI accuracy" },
            { text: "Actively participate in Scrum ceremonies, collaborating with Business Analysts and QA Engineers to debug production data discrepancies and deploy schema updates.", impact: "99.5% uptime" },
        ],
    },
    {
        role: "Programmer Analyst Trainee",
        company: "Cognizant Technology Solutions",
        period: "Feb 2025 – Aug 2025",
        location: "Chennai, India",
        status: "COMPLETED",
        color: "#c9b8f5",
        stack: ["Spring Boot", "Java", "JPA", "PostgreSQL", "JWT", "Docker", "Render"],
        bullets: [
            { text: "Architected and led implementation of production-ready Food Ordering Management Platform using 3-tier design pattern with Spring Boot, JPA, and PostgreSQL.", impact: "Production deployed" },
            { text: "Engineered secure REST API ecosystem with 15+ endpoints implementing JWT stateless authentication, role-based authorization, XSS prevention, CORS configuration.", impact: "15+ endpoints" },
            { text: "Containerized full application stack using Docker; orchestrated deployment to Render Cloud platform with environment-based configuration management.", impact: "Docker containerized" },
            { text: "Completed intensive enterprise software development training, achieving conversion to full-time Software Engineer role based on technical performance.", impact: "FTE conversion" },
        ],
    },
];

function WorkEntry({ job, isDark, index }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-60px" });
    const text = isDark ? "rgba(255,255,255,0.85)" : "rgba(10,18,18,0.85)";
    const muted = isDark ? "rgba(255,255,255,0.38)" : "rgba(10,18,18,0.74)";
    const bodyC = isDark ? "rgba(255,255,255,0.68)" : "rgba(10,18,18,0.7)";

    return (
        <motion.div ref={ref} initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: "flex", gap: "clamp(16px,3vw,36px)", alignItems: "flex-start" }}
        >
            {/* Timeline axis */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 4, flexShrink: 0 }}>
                <AxisDot color={job.color} isDark={isDark} size={10} />
                {index === 0 && (
                    <div style={{ width: 1, flex: 1, minHeight: 40, marginTop: 8, background: `linear-gradient(${job.color}88, transparent)` }} />
                )}
            </div>

            {/* Content */}
            <div style={{ flex: 1, paddingBottom: 40 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
                    <div>
                        <h3 style={{ fontFamily: "'Courier New', monospace", fontSize: "clamp(14px,2vw,20px)", fontWeight: 900, color: text, margin: "0 0 4px", letterSpacing: "-0.01em" }}>
                            {job.role}
                        </h3>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                            <span style={{ fontFamily: "'Courier New', monospace", fontSize: "clamp(11px,1.2vw,13px)", fontWeight: 700, color: job.color }}>{job.company}</span>
                            <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: muted }}>· {job.location}</span>
                        </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: muted, letterSpacing: "0.12em" }}>{job.period}</span>
                        <span style={{ fontFamily: "'Courier New', monospace", fontSize: 8, fontWeight: 800, letterSpacing: "0.18em", color: job.status === "ACTIVE" ? "#a8d8b9" : muted, background: job.status === "ACTIVE" ? "rgba(168,216,185,0.12)" : "transparent", border: `1px solid ${job.status === "ACTIVE" ? "rgba(168,216,185,0.3)" : "transparent"}`, borderRadius: 3, padding: "2px 7px" }}>
                            {job.status}
                        </span>
                    </div>
                </div>

                {/* Stack tokens */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                    {job.stack.map(s => (
                        <span key={s} style={{ fontFamily: "'Courier New', monospace", fontSize: 9, fontWeight: 700, color: job.color, background: `rgba(${job.color === "#5cbdb9" ? "92,189,185" : "201,184,245"},0.1)`, border: `1px solid rgba(${job.color === "#5cbdb9" ? "92,189,185" : "201,184,245"},0.25)`, borderRadius: 3, padding: "2px 8px", letterSpacing: "0.06em" }}>
                            {s}
                        </span>
                    ))}
                </div>

                {/* Bullets */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10, borderLeft: `2px solid ${job.color}22`, paddingLeft: 16 }}>
                    {job.bullets.map((b, i) => (
                        <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                            <span style={{ color: job.color, fontFamily: "'Courier New', monospace", fontSize: 10, flexShrink: 0, marginTop: 3 }}>›</span>
                            <div>
                                <span style={{ fontFamily: "'Courier New', monospace", fontSize: "clamp(10px,1.15vw,12px)", color: bodyC, lineHeight: 1.78 }}>{b.text}</span>
                                <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, fontWeight: 800, color: job.color, background: `rgba(${job.color === "#5cbdb9" ? "92,189,185" : "201,184,245"},0.12)`, borderRadius: 3, padding: "1px 6px", marginLeft: 8, letterSpacing: "0.1em", whiteSpace: "nowrap" }}>
                                    [{b.impact}]
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// §2 — COMBAT ENGINEERING (Hackathons)
// ═══════════════════════════════════════════════════════════════════════════════
const HACKATHONS = [
    { id: "H01", name: "HackMela", venue: "KKR & KSR Institute of Technology and Sciences", location: "Guntur, AP", type: "Centralized · 24hr", outcome: "2ND PLACE", outcomeBg: "#f7c4a0", detail: "Competed in a centralized 24-hour hackathon against teams from multiple colleges.", stat: null },
    { id: "H02", name: "Udvikash", venue: "R.V.R & J.C. College of Engineering", location: "Guntur, AP", type: "Centralized · 24hr", outcome: "TOP 10", outcomeBg: "#c9b8f5", detail: "Secured top 10 position in the centralized technical hackathon.", stat: null },
    { id: "H03", name: "Hacksday National Hackathon", venue: "SMVEC", location: "Pondicherry", type: "National · 48hr", outcome: "NATIONAL FINALIST", outcomeBg: "#5cbdb9", detail: "Shortlisted among top 15 finalists from over 1400+ participating teams nationwide.", stat: "1400+ TEAMS → SHORTLISTED" },
];

function HackathonEntry({ hack, isDark, index }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-50px" });
    const text = isDark ? "rgba(255,255,255,0.88)" : "rgba(10,18,18,0.88)";
    const muted = isDark ? "rgba(255,255,255,0.38)" : "rgba(10,18,18,0.74)";

    return (
        <motion.div ref={ref} initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: index * 0.1 }}
            style={{
                display: "flex", gap: 20, alignItems: "flex-start",
                paddingBottom: 28,
                borderBottom: index < HACKATHONS.length - 1 ? `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(10,18,18,0.08)"}` : "none",
            }}
        >
            {/* Index label vertical */}
            <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, paddingTop: 2 }}>
                <span style={{ fontFamily: "'Courier New', monospace", fontSize: 10, fontWeight: 900, color: hack.outcomeBg, letterSpacing: "0.2em", }}>
                    {hack.id}
                </span>
                <div style={{ width: 1, height: 40, background: `linear-gradient(${hack.outcomeBg}66, transparent)` }} />
            </div>

            <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 8 }}>
                    <div>
                        <h3 style={{ fontFamily: "'Courier New', monospace", fontSize: "clamp(14px,1.8vw,18px)", fontWeight: 900, color: text, margin: "0 0 4px", letterSpacing: "-0.01em" }}>
                            {hack.name}
                        </h3>
                        <div style={{ display: "flex", alignItems: "center", fontFamily: "'Courier New', monospace", fontSize: "clamp(10px,1.1vw,12px)", color: muted }}>
                            <FaMapMarkerAlt style={{ marginRight: 4, fontSize: "0.8em" }} />
                            <span>{hack.venue} · {hack.location}</span>
                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5 }}>
                        <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", color: isDark ? "#000" : "#fff", background: hack.outcomeBg, borderRadius: 4, padding: "3px 10px" }}>
                            {hack.outcome}
                        </span>
                        <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: muted, letterSpacing: "0.12em" }}>{hack.type}</span>
                    </div>
                </div>
                <p style={{ fontFamily: "'Courier New', monospace", fontSize: "clamp(10px,1.1vw,12px)", color: isDark ? "rgba(255,255,255,0.62)" : "rgba(10,18,18,0.65)", lineHeight: 1.75, margin: "0 0 8px" }}>
                    {hack.detail}
                </p>
                {hack.stat && (
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `rgba(${92},${189},${185},0.08)`, border: `1px solid rgba(92,189,185,0.25)`, borderRadius: 5, padding: "5px 12px" }}>
                        <span style={{ fontFamily: "'Courier New', monospace", fontSize: 10, fontWeight: 800, color: hack.outcomeBg, letterSpacing: "0.1em" }}>
                            {hack.stat}
                        </span>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// §3 — NCC RANK PROGRESSION
// ═══════════════════════════════════════════════════════════════════════════════
const NCC_RANKS = [
    { rank: "Cadet", period: "Sep 2022 – Jul 2023", note: "Joined 1(A) ENGR COY NCC, Guntur Group" },
    { rank: "Lance Corporal", period: "Jul 2023 – Feb 2024", note: "Selected for Inter Group Competition (RDC)" },
    { rank: "Corporal", period: "Feb 2024 – Nov 2024", note: "Attended ALC at Rourkela, Odisha · National Camp" },
    { rank: "Sergeant", period: "Nov 2024 – Feb 2025", note: "Awarded Best Cadet 2024, Guntur Group HQ" },
];

const NCC_CERTS = [
    { name: "NCC 'A' Certificate", detail: "Foundation level — issued by Ministry of Defence" },
    { name: "NCC 'B' Certificate", detail: "Grade: A — Advanced proficiency certification" },
    { name: "NCC 'C' Certificate", detail: "Grade: A — Highest NCC certification level" },
];

const NCC_ACHIEVEMENTS = [
    { tag: "AWARD", title: "Best Cadet 2024", org: "Guntur Group HQ · 1(A) ENGR COY NCC", color: "#FFD700" },
    { tag: "CAMP", title: "Advance Leadership Camp (ALC)", org: "Rourkela, Odisha · National Level", color: "#5cbdb9" },
    { tag: "COMPETITION", title: "Republic Day Camp Selection", org: "Directorate Level · Inter Group Competition (RDC) · Hyderabad", color: "#a188df" },
];

const NCC_IMAGES = [
    { src: bestCadetImage, label: "Best Cadet Award", caption: "Best Cadet 2024 — Guntur Group HQ ceremony" },
    { src: bestCadetImage2, label: "Best Cadet Photo 2", caption: "Award presentation with commanding officer" },
    { src: bestCadetImage3, label: "Best Cadet Photo 3", caption: "Post-award group photograph" },
    { src: "", label: "NCC A Certificate", caption: "NCC A Certificate — Foundation level" },
    { src: certificateB, label: "NCC B Certificate", caption: "NCC B Certificate — Grade A" },
    { src: certificateC, label: "NCC C Certificate", caption: "NCC C Certificate — Grade A · Highest Level" },
    { src: nccSocial1, label: "Social Activity 1", caption: "Community service activity conducted" },
    { src: nccSocial2, label: "Social Activity 2", caption: "Social outreach programme" },
];

function NCCRankTimeline({ isDark }) {
    const teal = isDark ? "#5cbdb9" : "#2a9e9a";
    const text = isDark ? "rgba(255,255,255,0.88)" : "rgba(10,18,18,0.88)";
    const muted = isDark ? "rgba(255,255,255,0.38)" : "rgba(10,18,18,0.74)";

    return (
        <Reveal>
            {/* Rank progression — horizontal scroll on mobile */}
            <div style={{ overflowX: "auto", paddingBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 0, minWidth: "max-content", position: "relative" }}>
                    {/* Connecting line */}
                    <div style={{ position: "absolute", top: 11, left: 12, right: 12, height: 1.5, background: `linear-gradient(90deg, ${teal}, #c9b8f5, #f7c4a0, #FFD700)`, opacity: 0.4, zIndex: 0 }} />

                    {NCC_RANKS.map((r, i) => (
                        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, minWidth: 140, position: "relative", zIndex: 1 }}>
                            {/* Node */}
                            <div style={{
                                width: 24, height: 24, borderRadius: "50%",
                                background: isDark ? "#000" : "#fff",
                                border: `2px solid ${["#5cbdb9", "#a188df", "#f7c4a0", "#FFD700"][i]}`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                boxShadow: `0 0 12px ${["#5cbdb9", "#a188df", "#f7c4a0", "#FFD700"][i]}55`,
                                marginBottom: 12, flexShrink: 0,
                            }}>
                                <div style={{ width: 8, height: 8, borderRadius: "50%", background: ["#5cbdb9", "#a188df", "#f7c4a0", "#FFD700"][i] }} />
                            </div>
                            <span style={{ fontFamily: "'Courier New', monospace", fontSize: "clamp(10px,1.2vw,13px)", fontWeight: 800, color: ["#5cbdb9", "#a188df", "#f7c4a0", "#FFD700"][i], textAlign: "center", marginBottom: 4, letterSpacing: "-0.01em" }}>
                                {r.rank}
                            </span>
                            <span style={{ fontFamily: "'Courier New', monospace", fontSize: "clamp(10px,1.1vw,10px)", color: muted, textAlign: "center", letterSpacing: "0.08em", maxWidth: 130, lineHeight: 1.5 }}>
                                {r.period}
                            </span>
                            <span style={{ fontFamily: "'Courier New', monospace", fontSize: "clamp(9px,1.1vw,10px)", color: isDark ? "rgba(255,255,255,0.3)" : "rgba(10,18,18,0.85)", textAlign: "center", marginTop: 6, maxWidth: 130, lineHeight: 1.5 }}>
                                {r.note}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </Reveal>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// §4 + §5 — GDG & CODEX
// ═══════════════════════════════════════════════════════════════════════════════
const GDG_IMAGES = [
    { src: gdgWorkshop1, label: "GDG Workshop 1", caption: "Technical workshop session at GDG On Campus" },
    { src: gdgWorkshop2, label: "GDG Workshop 2", caption: "Student engagement during GDG webinar" },
];
const CODEX_IMAGES = [
    { src: codexCompetition1, label: "CodeX Competition 1", caption: "Web Development competition organised by CodeX" },
    { src: codexCompetition2, label: "CodeX Competition 2", caption: "Students participating in CodeX tech challenge" },
    { src: codexCompetition3, label: "CodeX Competition 3", caption: "Prize distribution at CodeX event" },
];

// ═══════════════════════════════════════════════════════════════════════════════
// §6 — OPERATIONAL VALUES (Soft Skills)
// ═══════════════════════════════════════════════════════════════════════════════
const SOFT_SKILLS = [
    { value: "Radical Candor", translation: "Giving and receiving high-quality code reviews. Transparency over polite ambiguity — whether in pull requests or stakeholder discussions.", link: "Professional Experience", color: "#5cbdb9" },
    { value: "Operational Discipline", translation: "Built through four years of NCC service — from Cadet to Sergeant. Consistency, punctuality, and structured accountability applied to engineering workflows.", link: "NCC Service", color: "#FFD700" },
    { value: "Ecosystem Thinking", translation: "Designing systems with the downstream consumer in mind — whether a database query, a REST endpoint, or a community-learning curriculum.", link: "GDG · CodeX", color: "#9976f2" },
    { value: "Adaptive Communication", translation: "Translating complex Kafka event streams or JWT auth flows into simple language for business analysts, QA engineers, and non-technical stakeholders.", link: "Cognizant", color: "#f7c4a0" },
    { value: "Pressure-Tested Delivery", translation: "Shipping under 24h and 48h hackathon constraints across national competitions — where scope clarity and rapid prototyping are survival skills.", link: "Hackathons", color: "#77e19d" },
    { value: "Community Catalyst", translation: "Transitioning CodeX from a student interest group into a technical incubator, and co-orchestrating GDG workshops that connected campus talent with global technologies.", link: "GDG · CodeX", color: "#5cbdb9" },
];

function SoftSkillsSection({ isDark }) {
    const teal = isDark ? "#5cbdb9" : "#2a9e9a";
    const text = isDark ? "rgba(255,255,255,0.88)" : "rgba(10,18,18,0.88)";
    const muted = isDark ? "rgba(255, 255, 255, 0.76)" : "rgba(10, 18, 18, 0.74)";
    const bodyC = isDark ? "rgba(255,255,255,0.68)" : "rgba(10,18,18,0.7)";

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {SOFT_SKILLS.map((s, i) => {
                const ref = useRef(null);
                const inView = useInView(ref, { once: true, margin: "-40px" });
                const isEven = i % 2 === 0;

                return (
                    <motion.div key={s.value} ref={ref}
                        initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.55, delay: i * 0.08 }}
                        style={{
                            display: "grid",
                            gridTemplateColumns: "clamp(120px,18vw,180px) 1fr",
                            gap: "clamp(16px,2.5vw,32px)",
                            alignItems: "start",
                            padding: "clamp(14px,2vw,20px) 0",
                            borderBottom: i < SOFT_SKILLS.length - 1 ? `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(10,18,18,0.07)"}` : "none",
                        }}
                    >
                        {/* Left: value name */}
                        <div>
                            <span style={{ fontFamily: "'Courier New', monospace", fontSize: "clamp(11px,1.3vw,13px)", fontWeight: 900, color: s.color, display: "block", letterSpacing: "-0.01em", marginBottom: 4, }}>
                                {s.value}
                            </span>
                            <span style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: muted, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                                ↔ {s.link}
                            </span>
                        </div>
                        {/* Right: translation */}
                        <p style={{ fontFamily: "'Courier New', monospace", fontSize: "clamp(10px,1.2vw,13px)", color: bodyC, lineHeight: 1.8, margin: 0 }}>
                            {s.translation}
                        </p>
                    </motion.div>
                );
            })}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function ExperiencePage() {
    const { theme } = useTheme();
    const {colors} = useTheme();
    const isDark = theme === "dark";

    const bg = isDark ? "#000000" : "#ffffff";
    const teal = isDark ? "#5cbdb9" : "#2a9e9a";
    const lav = isDark ? "#c9b8f5" : "#6040c0";
    const amber = "#f7c4a0";
    const gold = "#FFD700";
    const text = isDark ? "rgba(255,255,255,0.88)" : "rgba(10,18,18,0.88)";
    const muted = isDark ? "rgba(255,255,255,0.38)" : "rgba(10,18,18,0.74)";
    const bodyC = isDark ? "rgba(255,255,255,0.68)" : "rgba(10, 18, 18, 0.97)";
    const sep = isDark ? "rgba(255,255,255,0.07)" : "rgba(10,18,18,0.09)";

    return (
        <AtomicTransition>
            <div style={{ minHeight: "100vh", background: colors.background, position: "relative", overflowX: "hidden", transition: "background 0.4s ease", fontFamily: "'Courier New', monospace" }}>

                {/* Blueprint grid */}
                <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, backgroundImage: `linear-gradient(${isDark ? "rgba(255,255,255,0.022)" : "rgba(92,189,185,0.065)"} 1px,transparent 1px),linear-gradient(90deg,${isDark ? "rgba(255,255,255,0.022)" : "rgba(92,189,185,0.065)"} 1px,transparent 1px)`, backgroundSize: "48px 48px" }} aria-hidden />

                <div style={{ position: "relative", zIndex: 1, maxWidth: 960, margin: "0 auto", padding: "clamp(56px,10vw,96px) clamp(16px,5vw,56px) clamp(72px,10vw,100px)", boxSizing: "border-box" }}>

                    {/* ── PAGE HEADER ── */}
                    <Reveal style={{ marginBottom: "clamp(48px,8vw,72px)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                            <div style={{ width: 22, height: 1.5, background: teal, borderRadius: 1 }} />
                            <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.32em", textTransform: "uppercase", color: teal }}>Operations Record · Full Career Ledger</span>
                            <div style={{ width: 22, height: 1.5, background: teal, borderRadius: 1 }} />
                        </div>
                        <h1 style={{ fontSize: "clamp(32px,6vw,64px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.05, color: text, margin: "0 0 10px" }}>
                            Experience
                        </h1>
                        <p style={{ fontSize: "clamp(11px,1.3vw,13px)", color: muted, maxWidth: 500, lineHeight: 1.78, margin: 0 }}>
                            Professional deployments, field operations, rank progression, and community orchestration — every chapter documented.
                        </p>
                        <motion.div initial={{ scaleX: 0, originX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 0.3 }}
                            style={{ marginTop: 22, height: 1.5, background: isDark ? "linear-gradient(90deg,#5cbdb9,#c9b8f5 45%,#fbe3e8 75%,transparent)" : "linear-gradient(90deg,#2a9e9a,#6040c0 45%,#c04070 75%,transparent)", opacity: isDark ? 0.45 : 0.6 }} />
                    </Reveal>

                    {/* ════════════════════════════════════════════
            §1 PROFESSIONAL DEPLOYMENT
        ════════════════════════════════════════════ */}
                    <section style={{ marginBottom: "clamp(56px,9vw,88px)" }}>
                        <SectionHeader index="01" tag="Professional Deployment" title="Work Experience" subtitle="Enterprise engineering at scale — financial services & backend systems." isDark={isDark} color={teal} />
                        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                            {WORK_EXP.map((job, i) => <WorkEntry key={job.role} job={job} isDark={isDark} index={i} />)}
                        </div>
                    </section>

                    <div style={{ height: 1, background: sep, marginBottom: "clamp(56px,9vw,88px)" }} />

                    {/* ════════════════════════════════════════════
            §2 COMBAT ENGINEERING
        ════════════════════════════════════════════ */}
                    <section style={{ marginBottom: "clamp(56px,9vw,88px)" }}>
                        <SectionHeader index="02" tag="Combat Engineering" title="Hackathon Record" subtitle="High-pressure delivery under time constraints — field-tested problem solving." isDark={isDark} color={amber} />
                        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                            {HACKATHONS.map((h, i) => <HackathonEntry key={h.id} hack={h} isDark={isDark} index={i} />)}
                        </div>
                    </section>

                    <div style={{ height: 1, background: sep, marginBottom: "clamp(56px,9vw,88px)" }} />

                    {/* ════════════════════════════════════════════
            §3 NCC — RANK PROGRESSION
        ════════════════════════════════════════════ */}
                    <section style={{ marginBottom: "clamp(56px,9vw,88px)" }}>
                        <SectionHeader index="03" tag="Service Record" title="NCC Journey" subtitle="Sep 2022 – Feb 2025 · 1(A) ENGR COY NCC, Guntur Group · AP & Telangana Directorate" isDark={isDark} color={gold} />

                        {/* Rank timeline */}
                        <div style={{ marginBottom: 40 }}>
                            <span style={{ fontSize: 9, letterSpacing: "0.28em", color: muted, textTransform: "uppercase", display: "block", marginBottom: 20 }}>// RANK_PROGRESSION · Scroll →</span>
                            <NCCRankTimeline isDark={isDark} />
                        </div>

                        {/* Achievements */}
                        <Reveal delay={0.1}>
                            <span style={{ fontSize: 9, letterSpacing: "0.28em", color: muted, textTransform: "uppercase", display: "block", marginBottom: 16 }}>// COMMENDATIONS & CAMPS</span>
                            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                                {NCC_ACHIEVEMENTS.map((a, i) => (
                                    <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                                        <span style={{ fontFamily: "'Courier New', monospace", fontSize: 8, fontWeight: 800, letterSpacing: "0.18em", color: isDark ? "#000" : "#000", background: a.color, borderRadius: 3, padding: "2px 7px", flexShrink: 0, marginTop: 2 }}>{a.tag}</span>
                                        <div>
                                            <span style={{ fontFamily: "'Courier New', monospace", fontSize: "clamp(11px,1.3vw,13px)", fontWeight: 800, color: text, display: "block", marginBottom: 2 }}>{a.title}</span>
                                            <span style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: muted }}>{a.org}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Reveal>

                        {/* Certificates */}
                        <Reveal delay={0.2}>
                            <span style={{ fontSize: 9, letterSpacing: "0.28em", color: muted, textTransform: "uppercase", display: "block", marginBottom: 16 }}>// CERTIFICATION_LEDGER</span>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
                                {NCC_CERTS.map((c, i) => (
                                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, paddingBottom: 8, borderBottom: i < NCC_CERTS.length - 1 ? `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(10,18,18,0.07)"}` : "none" }}>
                                        <span style={{ fontFamily: "'Courier New', monospace", fontSize: "clamp(11px,1.2vw,13px)", fontWeight: 800, color: text }}>{c.name}</span>
                                        <span style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: muted }}>{c.detail}</span>
                                    </div>
                                ))}
                            </div>
                        </Reveal>

                        {/* NCC images */}
                        <Reveal delay={0.3}>
                            <ThumbnailStrip images={NCC_IMAGES} isDark={isDark} label="NCC Evidence" />
                        </Reveal>
                    </section>

                    <div style={{ height: 1, background: sep, marginBottom: "clamp(56px,9vw,88px)" }} />

                    {/* ════════════════════════════════════════════
            §4 GDG
        ════════════════════════════════════════════ */}
                    <section style={{ marginBottom: "clamp(56px,9vw,88px)" }}>
                        <SectionHeader index="04" tag="Ecosystem Orchestration" title="Google Developer Groups" role="Co-Organizer" subtitle=" Aug 2024 – Jul 2025 · RVR & JC CE, Guntur" isDark={isDark} color={teal} />

                        <Reveal>
                            <p style={{ fontSize: "clamp(12px,1.35vw,14px)", color: bodyC, lineHeight: 1.85, maxWidth: 680, marginBottom: 20 }}>
                                Bridging global Google technologies and local developer talent through structured knowledge-sharing frameworks — workshops, online webinars, and community-led innovation sessions for college students.
                            </p>
                            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
                                {["Stakeholder Management", "Public Speaking", "Workshop Design", "Community Growth"].map(k => (
                                    <span key={k} style={{ fontFamily: "'Courier New', monospace", fontSize: 9, fontWeight: 700, color: teal, background: `rgba(${isDark ? "92,189,185" : "42,158,154"},0.1)`, border: `1px solid rgba(${isDark ? "92,189,185" : "42,158,154"},0.25)`, borderRadius: 3, padding: "3px 9px", letterSpacing: "0.06em" }}>
                                        {k}
                                    </span>
                                ))}
                            </div>
                            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
                                <a href="https://gdg.community.dev/gdg-on-campus-rvr-jccollege-of-engineering-guntur-india/" target="_blank" rel="noopener noreferrer"
                                    style={{ fontFamily: "'Courier New', monospace", fontSize: 10, fontWeight: 800, letterSpacing: "0.15em", color: teal, textDecoration: "none", border: `1px solid ${teal}55`, borderRadius: 5, padding: "7px 14px", transition: "all 0.2s" }}
                                    onMouseEnter={e => { e.currentTarget.style.background = `rgba(${isDark ? "92,189,185" : "42,158,154"},0.1)`; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                                >
                                    GDG Community Page ↗
                                </a>
                                {/* <a href="https://www.linkedin.com/in/kvnrs23" target="_blank" rel="noopener noreferrer"
                style={{ fontFamily: "'Courier New', monospace", fontSize: 10, fontWeight: 800, letterSpacing: "0.15em", color: muted, textDecoration: "none", border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(10,18,18,0.12)"}`, borderRadius: 5, padding: "7px 14px", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = teal; e.currentTarget.style.color = teal; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(10,18,18,0.12)"; e.currentTarget.style.color = muted; }}
              >
                View LinkedIn Posts ↗
              </a> */}
                            </div>
                            <ThumbnailStrip images={GDG_IMAGES} isDark={isDark} label="GDG Evidence" />
                        </Reveal>
                    </section>

                    <div style={{ height: 1, background: sep, marginBottom: "clamp(56px,9vw,88px)" }} />

                    {/* ════════════════════════════════════════════
            §5 CODEX
        ════════════════════════════════════════════ */}
                    <section style={{ marginBottom: "clamp(56px,9vw,88px)" }}>
                        <SectionHeader index="05" tag="Strategic Management" title="Code-X Technical Club" role="President" subtitle=" · Aug 2023 – Sep 2024 · RVR & JC CE, Guntur" isDark={isDark} color={lav} />

                        <Reveal>
                            <p style={{ fontSize: "clamp(12px,1.35vw,14px)", color: bodyC, lineHeight: 1.85, maxWidth: 680, marginBottom: 20 }}>
                                Transitioned Code-X from a student interest group into a professional technical incubator. Conducted Web Development competitions, peer-teaching sessions, and industry-aligned skill development initiatives, fostering a culture of mentorship and rapid prototyping.
                            </p>
                            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
                                {["Team Building", "Curriculum Design", "Technical Roadmap", "Peer Mentorship"].map(k => (
                                    <span key={k} style={{ fontFamily: "'Courier New', monospace", fontSize: 9, fontWeight: 700, color: lav, background: `rgba(${isDark ? "201,184,245" : "96,64,192"},0.1)`, border: `1px solid rgba(${isDark ? "201,184,245" : "96,64,192"},0.25)`, borderRadius: 3, padding: "3px 9px", letterSpacing: "0.06em" }}>
                                        {k}
                                    </span>
                                ))}
                            </div>
                            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
                                <a href="https://www.linkedin.com/in/kvnrs23" target="_blank" rel="noopener noreferrer"
                                    style={{ fontFamily: "'Courier New', monospace", fontSize: 10, fontWeight: 800, letterSpacing: "0.15em", color: lav, textDecoration: "none", border: `1px solid ${lav}55`, borderRadius: 5, padding: "7px 14px", transition: "all 0.2s" }}
                                    onMouseEnter={e => { e.currentTarget.style.background = `rgba(${isDark ? "201,184,245" : "96,64,192"},0.1)`; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                                >
                                    View LinkedIn Posts ↗
                                </a>
                            </div>
                            <ThumbnailStrip images={CODEX_IMAGES} isDark={isDark} label="CodeX Evidence" />
                        </Reveal>
                    </section>

                    <div style={{ height: 1, background: sep, marginBottom: "clamp(56px,9vw,88px)" }} />

                    {/* ════════════════════════════════════════════
            §6 OPERATIONAL VALUES
        ════════════════════════════════════════════ */}
                    <section style={{ marginBottom: "clamp(56px,9vw,72px)" }}>
                        <SectionHeader index="06" tag="Operational Values" title="Soft Skills" subtitle="Derived from real deployments — not self-assessed traits." isDark={isDark} color={isDark ? "#fbe3e8" : "#c04070"} />
                        <SoftSkillsSection isDark={isDark} />
                    </section>

                    {/* Footer rule */}
                    <Reveal>
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                            <div style={{ flex: 1, height: 1, background: sep }} />
                            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: muted }}>
                                Rajasekhar · Operations Record · v1.0
                            </span>
                            <div style={{ flex: 1, height: 1, background: sep }} />
                        </div>
                    </Reveal>

                </div>
            </div>
        </AtomicTransition>
    );
}