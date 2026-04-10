import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

// ─── RESUME DATA ──────────────────────────────────────────────────────────────
const RESUME_JSON = {
  meta: { version: "2025.1", generated: new Date().toISOString(), format: "SDE_SPEC_SHEET" },
  identity: {
    name: "K.V.N.Rajasekhar",
    phone: "+91 63004 13643",
    location: "Hyderabad, India",
    email: "kanagalavnrajasekhar@gmail.com",
    portfolio: "raja-eta.vercel.app",
    linkedin: "linkedin.com/in/kvnrs23",
    github: "github.com/kvnrajasekhar",
  },
  summary:
    "Full-Stack Software Engineer with 1 year of enterprise experience building scalable applications across Java and .NET ecosystems. Currently contributing to financial services systems at Cognizant using C#, ASP.NET MVC, and Oracle/SQL Server. Proficient in RESTful API design, JWT authentication, database performance tuning, and cloud deployment.",
  skills: {
    programming: ["JavaScript (ES6+)", "C#", "Java", "Python"],
    frameworks: ["React.js", "ASP.NET MVC", "Spring Boot", "Material-UI", "Bootstrap", "Tailwind CSS", "Framer Motion"],
    backend: ["Node.js", "Express.js", "RESTful APIs", "JWT Auth", "Middleware Architecture"],
    databases: ["SQL Server", "Oracle", "PL/SQL", "MongoDB", "Mongoose"],
    devops: ["Git/GitHub", "Docker", "GitHub Actions", "Vercel", "Render", "AWS (in progress)"],
    soft: ["Cross-functional Collaboration", "Problem-solving", "Adaptability", "Technical Communication"],
  },
  experience: [
    {
      id: "cognizant_swe",
      role: "Software Engineer Trainee",
      company: "Cognizant Technology Solutions",
      period: "Sep 2025 – Present",
      location: "Hyderabad, India",
      stack: ["C#", "ASP.NET MVC", "SQL Server", "Oracle", "JWT", "REST APIs"],
      bullets: [
        { text: "Enhance and maintain full-stack enterprise applications for international financial services clients using C#, ASP.NET MVC, SQL Server, and Oracle databases, implementing RESTful APIs and backend business logic serving 100K+ daily transactions.", metric: "100K+ daily transactions", metricType: "scale" },
        { text: "Design and optimize database schemas and queries in SQL Server and PL/SQL, reducing query execution time by 35% through indexing strategies, stored procedure optimization, and data model refinement.", metric: "35% query time reduction", metricType: "performance" },
        { text: "Implement secure authentication and authorization mechanisms following OAuth and JWT principles, ensuring compliance with financial domain standards and maintaining data integrity.", metric: "100% compliance", metricType: "security" },
        { text: "Collaborate with cross-functional teams in Agile sprints to deliver feature enhancements, perform code reviews, debug production issues, and deploy updates with 99.5% uptime.", metric: "99.5% uptime", metricType: "reliability" },
      ],
    },
    {
      id: "cognizant_pat",
      role: "Programmer Analyst Trainee",
      company: "Cognizant Technology Solutions",
      period: "Feb 2025 – Aug 2025",
      location: "Chennai, India",
      stack: ["Spring Boot", "Java", "JPA", "PostgreSQL", "JWT", "Docker", "Render"],
      bullets: [
        { text: "Architected and led implementation of production-ready Food Ordering Management Platform using 3-tier design pattern with Spring Boot, JPA, and PostgreSQL.", metric: "Production deployed", metricType: "delivery" },
        { text: "Engineered secure REST API ecosystem with 15+ endpoints implementing JWT stateless authentication, role-based authorization, and comprehensive security controls.", metric: "15+ endpoints", metricType: "scale" },
        { text: "Containerized full application stack using Docker; orchestrated deployment to Render Cloud platform with environment-based configuration management.", metric: "Docker containerized", metricType: "devops" },
        { text: "Completed intensive enterprise software development training achieving conversion to full-time Software Engineer role based on technical performance.", metric: "FTE conversion", metricType: "achievement" },
      ],
    },
  ],
  projects: [
    {
      id: "quickfix",
      name: "QuickFix",
      subtitle: "Multilingual Service Platform",
      stack: ["React.js", "Tailwind CSS", "Material-UI", "Framer Motion", "i18next", "Vercel"],
      bullets: [
        "Built multilingual React.js application with real-time language switching (English, Telugu, Hindi) using i18next serving diverse user demographics.",
        "Designed responsive, accessible UI with Tailwind CSS and Material-UI; integrated Framer Motion for smooth page transitions, tested across 5+ device sizes.",
        "Architected React Context API state management for user preferences, authentication state, and service booking flow with custom hooks (useLanguage, useAuth).",
        "Deployed to Vercel with continuous deployment from GitHub; implemented code splitting and environment-based configuration.",
      ],
    },
    {
      id: "qotes",
      name: "Qotes-server",
      subtitle: "Quote Sharing Social Media Backend",
      stack: ["Node.js", "Express.js", "MongoDB", "Redis", "Kafka", "JWT", "RESTful APIs"],
      bullets: [
        "Developed scalable RESTful backend supporting JWT auth, quote CRUD, social interactions (likes, shares, comments), and real-time feed generation.",
        "Designed MongoDB/Mongoose schema with virtual properties, pre-save hooks, population for nested references, and aggregation pipelines for feed generation.",
        "Integrated Apache Kafka for event-driven architecture reducing API response times by 40% through non-blocking operations and Redis caching.",
        "Built modular middleware with auth guards, error handling, rate limiting, and environment-specific configurations across development, staging, and production.",
      ],
    },
  ],
  education: [
    {
      degree: "B.Tech in Computer Science & Engineering (IoT)",
      institution: "R.V.R. & J.C. College of Engineering, Guntur",
      gpa: "9.22 / 10.0",
      period: "2021 – 2025",
    },
  ],
  certifications: [
    { name: "AWS Certified Developer Associate", issuer: "AWS", status: "In Progress", year: "2026" },
    { name: "The Complete Web Development Bootcamp", issuer: "Udemy", status: "Completed", year: "2024" },
    { name: "API Fundamentals Student Expert", issuer: "Postman", status: "Completed", year: "2024" },
    { name: "Introduction to DevOps", issuer: "IBM / Coursera", status: "Completed", year: "2024" },
    { name: "Git for Beginners", issuer: "KodeKloud", status: "Completed", year: "2024" },
  ],
  leadership: [
    { role: "Co-Organizer", org: "Google Developer Groups (GDG)", frame: "Ecosystem Orchestration", desc: "Bridging global Google technologies and local developer talent through structured knowledge-sharing frameworks and stakeholder management." },
    { role: "President", org: "Codex Student Technical Club", frame: "Strategic Management", desc: "Transitioned club from interest group to professional incubator. Fostered peer-mentorship culture and industry-aligned skill development." },
    { role: "Best Cadet 2024", org: "1(A) ENGR COY NCC, Guntur Group", frame: "Operational Discipline", desc: "Andhra Pradesh & Telangana Directorate. Demonstrated leadership, physical endurance, and structured accountability frameworks." },
  ],
  achievements: [
    { title: "Hacksday National Hackathon Finalist", detail: "Top 15 from 1,400+ teams · 48-hour · SMVEC Pondicherry" },
    { title: "Hackmela Hackathon — 2nd Place", detail: "24-hour challenge · KITS College of Engineering" },
    { title: "Rank 3, CodeByte Programming Contest", detail: "R.V.R. & J.C. College of Engineering" },
  ],
};

// ─── METRIC TYPE COLORS ───────────────────────────────────────────────────────
const METRIC_COLORS = {
  scale: "#5cbdb9",
  performance: "#c9b8f5",
  security: "#f7c4a0",
  reliability: "#a8d8b9",
  delivery: "#fbe3e8",
  devops: "#5cbdb9",
  achievement: "#c9b8f5",
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionSlide({ label, index, isDark }) {
  const teal = isDark ? "#5cbdb9" : "#2a9e9a";
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -32 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        marginBottom: 28,
        marginTop: 8,
      }}
    >
      <span style={{
        fontFamily: "'Courier New', monospace",
        fontSize: 9,
        fontWeight: 800,
        letterSpacing: "0.28em",
        color: teal,
        minWidth: 28,
      }}>
        {String(index).padStart(2, "0")}
      </span>
      <div style={{ flex: 1, height: 1, background: isDark ? "rgba(255,255,255,0.08)" : "rgba(10,18,18,0.1)" }} />
      <span style={{
        fontFamily: "'Courier New', monospace",
        fontSize: "clamp(11px,1.2vw,13px)",
        fontWeight: 800,
        letterSpacing: "0.3em",
        textTransform: "uppercase",
        color: teal,
      }}>
        {label}
      </span>
      <div style={{ width: 20, height: 1, background: teal, opacity: 0.6 }} />
    </motion.div>
  );
}

function StackChip({ name, isDark }) {
  const teal = isDark ? "#5cbdb9" : "#2a9e9a";
  return (
    <span style={{
      fontFamily: "'Courier New', monospace",
      fontSize: "clamp(9px,0.9vw,10px)",
      fontWeight: 700,
      color: teal,
      background: isDark ? "rgba(92,189,185,0.1)" : "rgba(42,158,154,0.08)",
      border: `1px solid ${isDark ? "rgba(92,189,185,0.3)" : "rgba(42,158,154,0.35)"}`,
      borderRadius: 4,
      padding: "3px 8px",
      letterSpacing: "0.06em",
      whiteSpace: "nowrap",
    }}>
      {name}
    </span>
  );
}

// ─── IMPACT BULLET ────────────────────────────────────────────────────────────
function ImpactBullet({ bullet, showMetrics, isDark }) {
  const text = isDark ? "rgba(255,255,255,0.72)" : "rgba(10,18,18,0.72)";
  const color = METRIC_COLORS[bullet.metricType] || "#5cbdb9";

  // Highlight metric phrase in text
  const parts = bullet.metric
    ? bullet.text.split(new RegExp(`(${bullet.metric.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "i"))
    : [bullet.text];

  return (
    <li style={{
      fontFamily: "'Courier New', monospace",
      fontSize: "clamp(11px,1.15vw,13px)",
      color: text,
      lineHeight: 1.78,
      paddingLeft: 0,
      listStyle: "none",
      display: "flex",
      gap: 10,
      alignItems: "flex-start",
    }}>
      <span style={{ color: isDark ? "rgba(255,255,255,0.25)" : "rgba(10,18,18,0.3)", flexShrink: 0, marginTop: 2 }}>›</span>
      <span>
        {parts.map((part, i) =>
          showMetrics && bullet.metric && part.toLowerCase() === bullet.metric.toLowerCase() ? (
            <motion.span
              key={i}
              initial={{ color: text }}
              animate={{ color }}
              transition={{ duration: 0.4 }}
              style={{
                fontWeight: 800,
                background: showMetrics ? `rgba(${color === "#5cbdb9" ? "92,189,185" : color === "#c9b8f5" ? "201,184,245" : color === "#f7c4a0" ? "247,196,160" : "168,216,185"},0.18)` : "transparent",
                borderRadius: 3,
                padding: showMetrics ? "1px 4px" : 0,
                transition: "background 0.3s ease",
              }}
            >
              {part}
            </motion.span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    </li>
  );
}

// ─── EXPERIENCE BLOCK ─────────────────────────────────────────────────────────
function ExperienceBlock({ job, isDark }) {
  const [showMetrics, setShowMetrics] = useState(false);
  const teal = isDark ? "#5cbdb9" : "#2a9e9a";
  const text = isDark ? "rgba(255,255,255,0.88)" : "rgba(10,18,18,0.88)";
  const muted = isDark ? "rgba(255,255,255,0.38)" : "rgba(10,18,18,0.4)";

  return (
    <Reveal className="mb-10">
      <div style={{
        borderLeft: `2px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(10,18,18,0.1)"}`,
        paddingLeft: "clamp(16px,2.5vw,28px)",
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 8 }}>
          <div>
            <h3 style={{
              fontFamily: "'Courier New', monospace",
              fontSize: "clamp(14px,1.8vw,18px)",
              fontWeight: 900,
              color: text,
              letterSpacing: "-0.01em",
              margin: 0,
            }}>
              {job.role}
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3, flexWrap: "wrap" }}>
              <span style={{ fontFamily: "'Courier New', monospace", fontSize: "clamp(11px,1.2vw,13px)", fontWeight: 700, color: teal }}>
                {job.company}
              </span>
              <span style={{ color: muted, fontSize: 10 }}>·</span>
              <span style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: muted, letterSpacing: "0.1em" }}>
                {job.location}
              </span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 10,
              fontWeight: 700,
              color: muted,
              letterSpacing: "0.12em",
              whiteSpace: "nowrap",
            }}>
              {job.period}
            </span>
            {/* Impact toggle */}
            <button
              onClick={() => setShowMetrics(m => !m)}
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: 9,
                fontWeight: 800,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: showMetrics ? (isDark ? "#000" : "#fff") : teal,
                background: showMetrics ? teal : "transparent",
                border: `1px solid ${teal}`,
                borderRadius: 4,
                padding: "4px 10px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
              }}
            >
              {showMetrics ? "▪ Metrics On" : "▸ View Impact"}
            </button>
          </div>
        </div>

        {/* Stack chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
          {job.stack.map(s => <StackChip key={s} name={s} isDark={isDark} />)}
        </div>

        {/* Bullets */}
        <ul style={{ margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 6 }}>
          {job.bullets.map((b, i) => (
            <ImpactBullet key={i} bullet={b} showMetrics={showMetrics} isDark={isDark} />
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

// ─── PROJECT BLOCK ────────────────────────────────────────────────────────────
function ProjectBlock({ project, isDark }) {
  const teal = isDark ? "#5cbdb9" : "#2a9e9a";
  const lav = isDark ? "#c9b8f5" : "#6040c0";
  const text = isDark ? "rgba(255,255,255,0.88)" : "rgba(10,18,18,0.88)";
  const muted = isDark ? "rgba(255,255,255,0.38)" : "rgba(10,18,18,0.4)";
  const bodyC = isDark ? "rgba(255,255,255,0.68)" : "rgba(10,18,18,0.7)";

  return (
    <Reveal className="mb-9">
      <div style={{
        borderLeft: `2px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(10,18,18,0.1)"}`,
        paddingLeft: "clamp(16px,2.5vw,28px)",
      }}>
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
            <h3 style={{
              fontFamily: "'Courier New', monospace",
              fontSize: "clamp(14px,1.8vw,18px)",
              fontWeight: 900,
              color: text,
              letterSpacing: "-0.01em",
              margin: 0,
            }}>
              {project.name}
            </h3>
            <span style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 10,
              color: lav,
              fontStyle: "italic",
              letterSpacing: "0.06em",
            }}>
              — {project.subtitle}
            </span>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
          {project.stack.map(s => <StackChip key={s} name={s} isDark={isDark} />)}
        </div>
        <ul style={{ margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 6 }}>
          {project.bullets.map((b, i) => (
            <li key={i} style={{
              fontFamily: "'Courier New', monospace",
              fontSize: "clamp(11px,1.15vw,13px)",
              color: bodyC,
              lineHeight: 1.78,
              listStyle: "none",
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
            }}>
              <span style={{ color: muted, flexShrink: 0, marginTop: 2 }}>›</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

// ─── DOWNLOAD BUTTON ─────────────────────────────────────────────────────────
function DownloadButton({ isDark, floating = false }) {
  const [phase, setPhase] = useState("idle"); // idle | generating | done
  const teal = isDark ? "#5cbdb9" : "#2a9e9a";

  const downloadPDF = () => {
    if (phase !== "idle") return;
    setPhase("generating");

    // Create download link for PDF file
    const link = document.createElement('a');
    link.href = '/Rajasekhar_Software_Engineer_Apr26.pdf';
    link.download = 'Rajasekhar_Software_Engineer_Apr26.pdf';
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Simulate generation time for UX
    setTimeout(() => {
      setPhase("done");
      setTimeout(() => setPhase("idle"), 2000);
    }, 800);
  };

  const handleClick = downloadPDF;

  const label =
    phase === "idle" ? "[ EXPORT_AS_PDF ]" :
      phase === "generating" ? "[ Generating... ]" :
        "[ Download Ready ✓ ]";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: floating ? "center" : "flex-start", gap: 6 }}>
      <motion.button
        onClick={handleClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        style={{
          fontFamily: "'Courier New', monospace",
          fontSize: floating ? 11 : "clamp(11px,1.2vw,13px)",
          fontWeight: 800,
          letterSpacing: "0.18em",
          color: phase === "done" ? (isDark ? "#000" : "#fff") : teal,
          background: phase === "done" ? teal : "transparent",
          border: `1.5px solid ${teal}`,
          borderRadius: 6,
          padding: floating ? "8px 14px" : "clamp(10px,1.5vw,14px) clamp(16px,2vw,24px)",
          cursor: phase === "idle" ? "pointer" : "default",
          transition: "all 0.25s ease",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </motion.button>
      {/* Progress bar */}
      {phase === "generating" && (
        <div style={{
          width: "100%",
          height: 2,
          background: isDark ? "rgba(255,255,255,0.08)" : "rgba(10,18,18,0.08)",
          borderRadius: 1,
          overflow: "hidden",
        }}>
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1, ease: "easeInOut" }}
            style={{ height: "100%", background: teal, borderRadius: 1 }}
          />
        </div>
      )}
    </div>
  );
}

// ─── JSON VIEW ────────────────────────────────────────────────────────────────
function JsonView({ isDark }) {
  const text = isDark ? "#a8d8b9" : "#1a6040";
  const str = isDark ? "#fbe3e8" : "#b04060";
  const num = isDark ? "#f7c4a0" : "#a04010";
  const key = isDark ? "#c9b8f5" : "#5030a0";
  const muted = isDark ? "rgba(255,255,255,0.28)" : "rgba(10,18,18,0.3)";

  // Simple syntax-highlighted JSON renderer
  const syntax = JSON.stringify(RESUME_JSON, null, 2);
  const lines = syntax.split("\n");

  const colorize = (line) => {
    return line
      .replace(/"([^"]+)":/g, `<span style="color:${key}">"$1"</span>:`)
      .replace(/: "([^"]+)"/g, `: <span style="color:${str}">"$1"</span>`)
      .replace(/: (\d[\d.]*)/g, `: <span style="color:${num}">$1</span>`)
      .replace(/: (true|false|null)/g, `: <span style="color:${num}">$1</span>`);
  };

  return (
    <div style={{
      fontFamily: "'Courier New', monospace",
      fontSize: "clamp(10px,1vw,12px)",
      lineHeight: 1.7,
      overflowX: "auto",
      padding: "clamp(16px,2.5vw,28px)",
      background: isDark ? "rgba(255,255,255,0.025)" : "rgba(10,18,18,0.03)",
      border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(10,18,18,0.09)"}`,
      borderRadius: 8,
    }}>
      {lines.map((line, i) => (
        <div key={i} style={{ display: "flex", gap: 16 }}>
          <span style={{ color: muted, minWidth: 32, userSelect: "none", textAlign: "right" }}>{i + 1}</span>
          <span style={{ color: text }} dangerouslySetInnerHTML={{ __html: colorize(line) }} />
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN RESUME PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function ResumePage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [viewMode, setViewMode] = useState("human"); // human | machine

  const teal = isDark ? "#5cbdb9" : "#2a9e9a";
  const lav = isDark ? "#c9b8f5" : "#6040c0";
  const bg = isDark ? "#000000" : "#ffffff";
  const text = isDark ? "rgba(255,255,255,0.88)" : "rgba(10,18,18,0.88)";
  const muted = isDark ? "rgba(255,255,255,0.38)" : "rgba(10,18,18,0.4)";
  const bodyC = isDark ? "rgba(255,255,255,0.7)" : "rgba(10,18,18,0.72)";
  const R = RESUME_JSON;

  return (
    <div style={{ minHeight: "100vh", background: bg, position: "relative", overflowX: "hidden", transition: "background 0.4s ease" }}>

      {/* Blueprint grid */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `
          linear-gradient(${isDark ? "rgba(255,255,255,0.022)" : "rgba(92,189,185,0.065)"} 1px, transparent 1px),
          linear-gradient(90deg, ${isDark ? "rgba(255,255,255,0.022)" : "rgba(92,189,185,0.065)"} 1px, transparent 1px)
        `,
        backgroundSize: "48px 48px",
      }} aria-hidden />

      {/* Floating download */}
      <div style={{
        position: "fixed",
        bottom: "clamp(20px,3vw,32px)",
        right: "clamp(16px,3vw,32px)",
        zIndex: 50,
      }} className="print:hidden">
        <DownloadButton isDark={isDark} floating />
      </div>

      {/* Content */}
      <div style={{
        position: "relative", zIndex: 1,
        maxWidth: 900,
        margin: "0 auto",
        padding: "clamp(56px,10vw,100px) clamp(20px,6vw,64px) clamp(64px,10vw,100px)",
      }}>

        {/* ── HEADER ── */}
        <Reveal>
          <div style={{ marginBottom: "clamp(40px,7vw,64px)" }}>
            {/* Top meta row */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
              <div style={{ width: 24, height: 1.5, background: teal, borderRadius: 1 }} />
              <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, fontWeight: 800, letterSpacing: "0.32em", color: teal, textTransform: "uppercase" }}>
                SDE Spec Sheet · Resume
              </span>
              <div style={{ width: 24, height: 1.5, background: teal, borderRadius: 1 }} />
            </div>

            {/* Name */}
            <h1 style={{
              fontFamily: "'Courier New', monospace",
              fontSize: "clamp(32px,6vw,64px)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              color: text,
              margin: "0 0 8px",
            }}>
              {R.identity.name}
            </h1>
            <p style={{
              fontFamily: "'Courier New', monospace",
              fontSize: "clamp(12px,1.4vw,15px)",
              fontWeight: 700,
              color: teal,
              letterSpacing: "0.08em",
              margin: "0 0 20px",
            }}>
              Full-Stack Software Engineer · Cognizant Technology Solutions
            </p>

            {/* Contact row */}
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px 20px",
              fontFamily: "'Courier New', monospace",
              fontSize: "clamp(10px,1.1vw,12px)",
              color: muted,
            }}>
              {[
                { label: "mail", val: R.identity.email },
                { label: "tel", val: R.identity.phone },
                { label: "web", val: R.identity.portfolio },
                { label: "li", val: R.identity.linkedin },
                { label: "gh", val: R.identity.github },
              ].map(c => (
                <span key={c.label}>
                  <span style={{ color: teal, fontWeight: 800 }}>{c.label}://</span>{c.val}
                </span>
              ))}
            </div>

            {/* View toggle + download */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginTop: 28,
              flexWrap: "wrap",
            }}>
              {/* Human / Machine toggle */}
              <div style={{
                display: "flex",
                gap: 0,
                border: `1px solid ${isDark ? "rgba(255,255,255,0.14)" : "rgba(10,18,18,0.16)"}`,
                borderRadius: 6,
                overflow: "hidden",
              }}>
                {["human", "machine"].map(m => (
                  <button
                    key={m}
                    onClick={() => setViewMode(m)}
                    style={{
                      fontFamily: "'Courier New', monospace",
                      fontSize: 10,
                      fontWeight: 800,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      padding: "7px 14px",
                      border: "none",
                      cursor: "pointer",
                      background: viewMode === m ? teal : "transparent",
                      color: viewMode === m ? (isDark ? "#000" : "#fff") : muted,
                      transition: "all 0.2s ease",
                    }}
                  >
                    {m === "human" ? "Human" : "Machine"}
                  </button>
                ))}
              </div>
              <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: muted, letterSpacing: "0.1em" }}>
                // view as:
              </span>
              <DownloadButton isDark={isDark} />
            </div>
          </div>
        </Reveal>

        {/* ── MACHINE VIEW ── */}
        <AnimatePresence mode="wait">
          {viewMode === "machine" ? (
            <motion.div key="machine" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
              <Reveal>
                <div style={{ marginBottom: 16 }}>
                  <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: muted, letterSpacing: "0.25em", textTransform: "uppercase" }}>
                    // RESUME.JSON — Raw data export for machine readers
                  </span>
                </div>
                <JsonView isDark={isDark} />
              </Reveal>
            </motion.div>

          ) : (

            /* ── HUMAN VIEW ── */
            <motion.div key="human" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>

              {/* ── SUMMARY ── */}
              <SectionSlide label="Professional Summary" index={1} isDark={isDark} />
              <Reveal className="mb-12">
                <p style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "clamp(12px,1.35vw,14px)",
                  color: bodyC,
                  lineHeight: 1.85,
                  maxWidth: 760,
                  borderLeft: `2px solid ${teal}44`,
                  paddingLeft: "clamp(14px,2vw,22px)",
                }}>
                  {R.summary}
                </p>
              </Reveal>

              {/* ── SKILLS ── */}
              <SectionSlide label="Technical Skills" index={2} isDark={isDark} />
              <Reveal className="mb-12">
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {Object.entries(R.skills).map(([cat, items]) => (
                    <div key={cat} style={{ display: "flex", gap: "clamp(12px,2vw,20px)", alignItems: "flex-start", flexWrap: "wrap" }}>
                      <span style={{
                        fontFamily: "'Courier New', monospace",
                        fontSize: 9,
                        fontWeight: 800,
                        letterSpacing: "0.22em",
                        color: muted,
                        textTransform: "uppercase",
                        minWidth: "clamp(70px,8vw,96px)",
                        paddingTop: 4,
                        flexShrink: 0,
                      }}>
                        {cat}
                      </span>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {items.map(s => <StackChip key={s} name={s} isDark={isDark} />)}
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>

              {/* ── EXPERIENCE ── */}
              <SectionSlide label="Professional Experience" index={3} isDark={isDark} />
              <div className="mb-12">
                {R.experience.map(job => <ExperienceBlock key={job.id} job={job} isDark={isDark} />)}
              </div>

              {/* ── PROJECTS ── */}
              <SectionSlide label="Personal Projects" index={4} isDark={isDark} />
              <div className="mb-12">
                {R.projects.map(p => <ProjectBlock key={p.id} project={p} isDark={isDark} />)}
              </div>

              {/* ── EDUCATION ── */}
              <SectionSlide label="Education" index={5} isDark={isDark} />
              <Reveal className="mb-12">
                {R.education.map((e, i) => (
                  <div key={i} style={{
                    borderLeft: `2px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(10,18,18,0.1)"}`,
                    paddingLeft: "clamp(16px,2.5vw,28px)",
                  }}>
                    <h3 style={{ fontFamily: "'Courier New', monospace", fontSize: "clamp(13px,1.6vw,16px)", fontWeight: 900, color: text, margin: "0 0 4px", letterSpacing: "-0.01em" }}>
                      {e.degree}
                    </h3>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                      <span style={{ fontFamily: "'Courier New', monospace", fontSize: "clamp(11px,1.2vw,13px)", fontWeight: 700, color: teal }}>{e.institution}</span>
                      <span style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: muted }}>·</span>
                      <span style={{ fontFamily: "'Courier New', monospace", fontSize: 10, fontWeight: 800, color: lav }}>CGPA {e.gpa}</span>
                      <span style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: muted }}>·</span>
                      <span style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: muted, letterSpacing: "0.1em" }}>{e.period}</span>
                    </div>
                  </div>
                ))}
              </Reveal>

              {/* ── CERTIFICATIONS ── */}
              <SectionSlide label="Certifications" index={6} isDark={isDark} />
              <Reveal className="mb-12">
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {R.certifications.map((c, i) => (
                    <div key={i} style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 8,
                      paddingBottom: 10,
                      borderBottom: i < R.certifications.length - 1
                        ? `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(10,18,18,0.07)"}`
                        : "none",
                    }}>
                      <div>
                        <span style={{ fontFamily: "'Courier New', monospace", fontSize: "clamp(11px,1.2vw,13px)", fontWeight: 700, color: text }}>
                          {c.name}
                        </span>
                        <span style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: muted, marginLeft: 10 }}>
                          {c.issuer} · {c.year}
                        </span>
                      </div>
                      <span style={{
                        fontFamily: "'Courier New', monospace",
                        fontSize: 9,
                        fontWeight: 800,
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: c.status === "In Progress" ? "#f7c4a0" : teal,
                        background: c.status === "In Progress" ? "rgba(247,196,160,0.1)" : `rgba(${isDark ? "92,189,185" : "42,158,154"},0.1)`,
                        border: `1px solid ${c.status === "In Progress" ? "rgba(247,196,160,0.3)" : `rgba(${isDark ? "92,189,185" : "42,158,154"},0.3)`}`,
                        borderRadius: 4,
                        padding: "2px 8px",
                      }}>
                        {c.status}
                      </span>
                    </div>
                  ))}
                </div>
              </Reveal>

              {/* ── LEADERSHIP & DISCIPLINE ── */}
              <SectionSlide label="Leadership · Discipline" index={7} isDark={isDark} />
              <Reveal className="mb-12">
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {R.leadership.map((l, i) => (
                    <div key={i} style={{
                      display: "flex",
                      gap: "clamp(14px,2.5vw,28px)",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      paddingBottom: 14,
                      borderBottom: i < R.leadership.length - 1
                        ? `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(10,18,18,0.07)"}`
                        : "none",
                    }}>
                      <div style={{ flexShrink: 0, minWidth: "clamp(100px,14vw,140px)" }}>
                        <span style={{
                          fontFamily: "'Courier New', monospace",
                          fontSize: 9,
                          fontWeight: 800,
                          letterSpacing: "0.18em",
                          textTransform: "uppercase",
                          color: lav,
                          background: `rgba(${isDark ? "201,184,245" : "96,64,192"},0.1)`,
                          border: `1px solid rgba(${isDark ? "201,184,245" : "96,64,192"},0.25)`,
                          borderRadius: 4,
                          padding: "3px 8px",
                          display: "inline-block",
                        }}>
                          {l.frame}
                        </span>
                      </div>
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "baseline", marginBottom: 4 }}>
                          <span style={{ fontFamily: "'Courier New', monospace", fontSize: "clamp(12px,1.4vw,14px)", fontWeight: 900, color: text }}>{l.role}</span>
                          <span style={{ fontFamily: "'Courier New', monospace", fontSize: "clamp(11px,1.2vw,13px)", fontWeight: 700, color: teal }}>{l.org}</span>
                        </div>
                        <p style={{ fontFamily: "'Courier New', monospace", fontSize: "clamp(10px,1.1vw,12px)", color: bodyC, lineHeight: 1.75, margin: 0 }}>
                          {l.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>

              {/* ── ACHIEVEMENTS ── */}
              <SectionSlide label="Achievements" index={8} isDark={isDark} />
              <Reveal className="mb-16">
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {R.achievements.map((a, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <span style={{ color: teal, fontFamily: "'Courier New', monospace", fontSize: 12, fontWeight: 800, flexShrink: 0, marginTop: 1 }}>✦</span>
                      <div>
                        <span style={{ fontFamily: "'Courier New', monospace", fontSize: "clamp(12px,1.3vw,14px)", fontWeight: 800, color: text }}>{a.title}</span>
                        <span style={{ fontFamily: "'Courier New', monospace", fontSize: "clamp(10px,1.1vw,12px)", color: muted, marginLeft: 10 }}>{a.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>

              {/* ── FOOTER ACTION ── */}
              <Reveal>
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 14,
                  paddingTop: "clamp(28px,5vw,48px)",
                  borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(10,18,18,0.08)"}`,
                }}>
                  <span style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: muted, letterSpacing: "0.25em", textTransform: "uppercase" }}>
                    // Take this offline
                  </span>
                  <DownloadButton isDark={isDark} />
                  <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: muted, letterSpacing: "0.15em" }}>
                    Rajasekhar · Resume v2025.1 · {new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                  </span>
                </div>
              </Reveal>

            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
    </div>
  );
}