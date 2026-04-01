import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import GitHubSnake from "./GitHubSnake";
import GitHubStats from "./GitHubStats";
import GitHubRedirect from "./GitHubRedirect";

// ─── PROJECT DATA ─────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    id: "SYS_ARCH_01",
    codename: "DISTRIBUTED_FOOD_GENIUS",
    title: "Integrated Food Management System",
    identity: "Full-Stack Enterprise Ordering Solution",
    philosophy: "Seamless CRUD Orchestration and Relational Data Integrity.",
    github: "https://github.com/kvnrajasekhar/food-ordering-system",
    terminalPath: "cat projects/food-ordering/Main.java",
    color: "#5cbdb9",
    status: "DEPLOYED",
    stack: ["Java", "Spring Boot", "Spring MVC", "MySQL", "REST API", "Hibernate"],
    schematic: {
      nodes: [
        { id: "CLIENT", label: "Client Layer", sub: "Multi-role UI", x: 15, y: 20 },
        { id: "AUTH", label: "Auth Guard", sub: "Session Validation", x: 40, y: 10 },
        { id: "CTRL", label: "REST Controllers", sub: "Browse→Order→Track", x: 70, y: 20 },
        { id: "SVC", label: "Service Layer", sub: "State Machine Logic", x: 40, y: 48 },
        { id: "DB", label: "Persistence Layer", sub: "Relational Schema", x: 15, y: 70 },
        { id: "ADMIN", label: "Admin Panel", sub: "Menu & Order Mgmt", x: 70, y: 70 },
      ],
      edges: [
        ["CLIENT", "AUTH"], ["AUTH", "CTRL"], ["CTRL", "SVC"],
        ["SVC", "DB"], ["SVC", "ADMIN"], ["CLIENT", "SVC"],
      ],
    },
    constraint: {
      label: "ROLE-BASED STATE MANAGEMENT",
      problem: "Ensuring Customer vs. Admin roles couldn't cross-contaminate live order data or menu state during concurrent sessions.",
      solution: "Designed a Service-Oriented validation layer + state-machine logic for orders: Pending → Confirmed → Out for Delivery.",
    },
    optimization: {
      label: "RELATIONAL INTEGRITY",
      before: "Cascading deletes broke historical order logs on menu removal.",
      after: "Schema redesign preserved all historical data while handling live menu updates without orphaned records.",
      metric: { label: "Data Integrity", before: "Broken", after: "100%" },
    },
    dossier: [
      { tag: "IDENTITY", text: "Full-Stack Enterprise Ordering Solution" },
      { tag: "PHILOSOPHY", text: "Seamless CRUD Orchestration and Relational Data Integrity" },
      { tag: "ARCH", text: "Java Full-Stack — Clean separation of UI, Logic, and Persistence" },
      { tag: "CHALLENGE", text: "Role-based access control without cross-contaminating order state" },
      { tag: "RESOLUTION", text: "State-machine order workflow + session-validated service layer" },
    ],
  },
  {
    id: "SYS_ARCH_02",
    codename: "HIGH_THROUGHPUT_SOCIAL_ENGINE",
    title: "Qotes Server",
    identity: "High-Throughput Social Media Engine",
    philosophy: "Latency Elimination through Event-Driven Streams.",
    github: "https://github.com/kvnrajasekhar/qotes-server",
    terminalPath: "cat projects/qotes-server/index.js",
    color: "#c9b8f5",
    status: "ACTIVE",
    stack: ["Node.js", "Express", "Redis", "Kafka", "MongoDB", "Mongoose"],
    schematic: {
      nodes: [
        { id: "CLIENT", label: "Client", sub: "API Consumers", x: 10, y: 35 },
        { id: "EXPRESS", label: "Express Engine", sub: "Event Loop Core", x: 38, y: 15 },
        { id: "REDIS", label: "Redis Cache", sub: "Hot Content Store", x: 65, y: 10 },
        { id: "KAFKA", label: "Kafka Broker", sub: "Analytics Offload", x: 65, y: 50 },
        { id: "MONGO", label: "MongoDB", sub: "Document Store", x: 45, y: 75 },
        { id: "WORKER", label: "Workers", sub: "Async Processors", x: 15, y: 75 },
      ],
      edges: [
        ["CLIENT", "EXPRESS"], ["EXPRESS", "REDIS"], ["EXPRESS", "KAFKA"],
        ["EXPRESS", "MONGO"], ["KAFKA", "WORKER"], ["WORKER", "MONGO"],
      ],
    },
    constraint: {
      label: "VIRAL TRAFFIC BOTTLENECK",
      problem: "Read surges on popular content caused primary database overload — response times spiked above 300ms under load.",
      solution: "Cache-Aside Strategy with Redis reduced DB query load dramatically; Kafka offloaded non-critical analytics writes.",
    },
    optimization: {
      label: "LATENCY ELIMINATION",
      before: "300ms+ response times on hot content under stress load.",
      after: "Sub-100ms responses via Redis cache-hit serving popular content from memory.",
      metric: { label: "API Response Time", before: "300ms+", after: "<100ms" },
    },
    dossier: [
      { tag: "IDENTITY", text: "High-Throughput Social Media Engine" },
      { tag: "PHILOSOPHY", text: "Latency Elimination through Event-Driven Streams" },
      { tag: "ARCH", text: "Node.js async stack — Cache → Broker → Document DB pipeline" },
      { tag: "CHALLENGE", text: "Viral traffic spikes overwhelming the primary database layer" },
      { tag: "RESOLUTION", text: "Redis Cache-Aside + Kafka decoupling for sub-100ms throughput" },
    ],
  },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

// ─── SCHEMATIC CANVAS ─────────────────────────────────────────────────────────
function SchematicCanvas({ project, isDark, activeNode }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const tickRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const nodes = project.schematic.nodes.map(n => ({
      ...n,
      px: (n.x / 100) * W,
      py: (n.y / 100) * H,
    }));
    const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));

    const draw = () => {
      tickRef.current += 0.015;
      const t = tickRef.current;
      ctx.clearRect(0, 0, W, H);

      // Edges
      project.schematic.edges.forEach(([a, b]) => {
        const na = nodeMap[a], nb = nodeMap[b];
        if (!na || !nb) return;
        const isActive = activeNode === a || activeNode === b;
        ctx.beginPath();
        ctx.moveTo(na.px, na.py);
        ctx.lineTo(nb.px, nb.py);
        ctx.strokeStyle = isActive
          ? project.color
          : isDark ? `rgba(255,255,255,0.12)` : `rgba(${hexToRgb(project.color)},0.25)`;
        ctx.lineWidth = isActive ? 1.8 : 0.8;
        ctx.setLineDash(isActive ? [] : [4, 5]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Animated particle along active edge
        if (isActive) {
          const tp = (t * 0.6) % 1;
          const px = na.px + (nb.px - na.px) * tp;
          const py = na.py + (nb.py - na.py) * tp;
          ctx.save();
          ctx.shadowBlur = 10;
          ctx.shadowColor = project.color;
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fillStyle = project.color;
          ctx.fill();
          ctx.restore();
        }
      });

      // Nodes
      nodes.forEach(n => {
        const isActive = activeNode === n.id;
        const pulse = 1 + 0.1 * Math.sin(t * 1.5 + n.px * 0.05);
        const r = (isActive ? 22 : 16) * pulse;

        ctx.save();
        ctx.shadowBlur = isActive ? 28 : 8;
        ctx.shadowColor = project.color;
        ctx.beginPath();
        ctx.arc(n.px, n.py, r, 0, Math.PI * 2);
        ctx.fillStyle = isActive
          ? project.color
          : isDark ? `rgba(${hexToRgb(project.color)},0.18)` : `rgba(${hexToRgb(project.color)},0.12)`;
        ctx.fill();
        ctx.strokeStyle = project.color + (isActive ? "ff" : "66");
        ctx.lineWidth = isActive ? 2 : 1;
        ctx.stroke();
        ctx.restore();

        // Label
        ctx.font = `bold ${isActive ? 10 : 9}px 'Courier New',monospace`;
        ctx.fillStyle = isActive ? project.color : (isDark ? "rgba(255,255,255,0.65)" : "rgba(10,18,18,0.65)");
        ctx.textAlign = "center";
        ctx.fillText(n.label, n.px, n.py + r + 12);
        ctx.font = `400 8px 'Courier New',monospace`;
        ctx.fillStyle = isDark ? "rgba(255,255,255,0.3)" : "rgba(10,18,18,0.35)";
        ctx.fillText(n.sub, n.px, n.py + r + 22);
      });

      animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [project, isDark, activeNode]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}

// ─── DOSSIER REVEAL ───────────────────────────────────────────────────────────
function DossierBlock({ items, color, isDark }) {
  const [revealed, setRevealed] = useState([]);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    items.forEach((_, i) => {
      setTimeout(() => setRevealed(r => [...r, i]), i * 180);
    });
  }, [inView, items]);

  return (
    <div ref={ref} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {items.map((item, i) => (
        <div key={i} style={{
          opacity: revealed.includes(i) ? 1 : 0,
          transform: revealed.includes(i) ? "translateX(0)" : "translateX(-12px)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
          display: "flex", gap: 10, alignItems: "flex-start",
        }}>
          <span style={{
            fontFamily: "'Courier New',monospace",
            fontSize: 9, fontWeight: 800,
            letterSpacing: "0.2em",
            color,
            background: `rgba(${hexToRgb(color)},0.12)`,
            border: `1px solid ${color}44`,
            borderRadius: 3,
            padding: "2px 7px",
            flexShrink: 0,
            marginTop: 2,
          }}>
            [{item.tag}]
          </span>
          <span style={{
            fontFamily: "'Courier New',monospace",
            fontSize: "clamp(11px,1.2vw,13px)",
            fontWeight: 600,
            color: isDark ? "rgba(255,255,255,0.78)" : "rgba(10,18,18,0.78)",
            lineHeight: 1.7,
          }}>
            {item.text}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── METRIC BAR ───────────────────────────────────────────────────────────────
function MetricBar({ label, before, after, color, isDark }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} style={{
      background: isDark ? `rgba(${hexToRgb(color)},0.06)` : `rgba(${hexToRgb(color)},0.06)`,
      borderStyle: "solid",
      borderWidth: "1px 1px 1px 3px", // Top, Right, Bottom, Left
      borderLeftColor: color,
      borderRadius: "0 6px 6px 0",
      padding: "14px 18px",
      display: "flex", flexDirection: "column", gap: 10,
    }}>
      <span style={{
        fontFamily: "'Courier New',monospace",
        fontSize: 9, fontWeight: 800,
        letterSpacing: "0.25em", textTransform: "uppercase",
        color,
      }}>
        // OPTIMIZATION → {label}
      </span>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 28px 1fr", alignItems: "center", gap: 8 }}>
        <div style={{
          background: isDark ? "rgba(255,0,0,0.08)" : "rgba(200,0,0,0.06)",
          border: "1px solid rgba(220,50,50,0.3)",
          borderRadius: 5, padding: "8px 12px",
        }}>
          <div style={{ fontSize: 8, color: "rgba(220,80,80,0.8)", letterSpacing: "0.2em", marginBottom: 4, fontFamily: "'Courier New',monospace", fontWeight: 700 }}>BEFORE</div>
          <div style={{ fontFamily: "'Courier New',monospace", fontSize: "clamp(12px,1.4vw,15px)", fontWeight: 800, color: isDark ? "rgba(255,120,120,0.9)" : "rgba(180,40,40,0.9)" }}>{before}</div>
        </div>
        <div style={{ textAlign: "center", color, fontWeight: 800, fontSize: 14 }}>→</div>
        <div style={{
          background: `rgba(${hexToRgb(color)},0.1)`,
          border: `1px solid ${color}55`,
          borderRadius: 5, padding: "8px 12px",
        }}>
          <div style={{ fontSize: 8, color: color + "cc", letterSpacing: "0.2em", marginBottom: 4, fontFamily: "'Courier New',monospace", fontWeight: 700 }}>AFTER</div>
          <div style={{ fontFamily: "'Courier New',monospace", fontSize: "clamp(12px,1.4vw,15px)", fontWeight: 800, color }}>{after}</div>
        </div>
      </div>
      <div style={{ fontSize: "clamp(10px,1.1vw,12px)", color: isDark ? "rgba(255,255,255,0.6)" : "rgba(10,18,18,0.65)", fontFamily: "'Courier New',monospace", lineHeight: 1.7 }}>
        <span style={{ color, fontWeight: 800 }}>[PROBLEM] </span>{before_text => before}
      </div>
    </div>
  );
}

// ─── CONSTRAINT BLOCK ─────────────────────────────────────────────────────────
function ConstraintBlock({ constraint, color, isDark }) {
  return (
    <div style={{
      // Use borderStyle and borderColor to avoid shorthand conflicts
      borderStyle: "solid",
      borderWidth: "1px", // Default 1px for all sides
      borderLeftWidth: "3px", // Specific override for the left accent
      borderColor: "rgba(255,100,100,0.85)",

      borderRadius: "0 6px 6px 0",
      padding: "14px 18px",
      background: isDark ? "rgba(255,0,0,0.05)" : "rgba(200,0,0,0.04)",
      display: "flex",
      flexDirection: "column",
      gap: 10,
    }}>
      <span style={{
        fontFamily: "'Courier New',monospace",
        fontSize: 9, fontWeight: 800,
        letterSpacing: "0.25em",
        color: isDark ? "rgba(255,100,100,0.85)" : "rgba(180,40,40,0.85)",
      }}>
        [PROBLEM_DETECTED] → {constraint.label}
      </span>
      <p style={{
        margin: 0,
        fontFamily: "'Courier New',monospace",
        fontSize: "clamp(11px,1.2vw,13px)",
        fontWeight: 600,
        color: isDark ? "rgba(255,255,255,0.72)" : "rgba(10,18,18,0.72)",
        lineHeight: 1.75,
      }}>
        {constraint.problem}
      </p>
      <span style={{
        fontFamily: "'Courier New',monospace",
        fontSize: 9, fontWeight: 800,
        letterSpacing: "0.25em",
        color: color,
      }}>
        [PATCH_APPLIED] → RESOLUTION
      </span>
      <p style={{
        margin: 0,
        fontFamily: "'Courier New',monospace",
        fontSize: "clamp(11px,1.2vw,13px)",
        fontWeight: 600,
        color: isDark ? "rgba(255,255,255,0.72)" : "rgba(10,18,18,0.72)",
        lineHeight: 1.75,
      }}>
        {constraint.solution}
      </p>
    </div>
  );
}

// ─── PROJECT CARD ─────────────────────────────────────────────────────────────
function ProjectCard({ project, index, isDark }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [activeNode, setActiveNode] = useState(null);
  const [copied, setCopied] = useState(false);

  const isEven = index % 2 === 0;
  const color = project.color;
  const muted = isDark ? "rgba(255,255,255,0.38)" : "rgba(10,18,18,0.4)";
  const text = isDark ? "rgba(255,255,255,0.82)" : "rgba(10,18,18,0.82)";
  const border = isDark ? `${color}22` : `${color}44`;
  const cardBg = isDark ? `rgba(${hexToRgb(color)},0.04)` : "#ffffff";

  const copyTerminal = () => {
    navigator.clipboard?.writeText(project.terminalPath);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "relative",
        background: cardBg,
        borderTop: `3px solid ${color}`,
        borderRight: `1px solid ${border}`,
        borderBottom: `1px solid ${border}`,
        borderLeft: `1px solid ${border}`,
        borderRadius: 8,
        overflow: "hidden",
        boxShadow: isDark ? "none" : `0 4px 32px rgba(${hexToRgb(color)},0.1)`,
        transition: "box-shadow 0.3s ease",
      }}
    >
      {/* Blueprint micro-grid */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `linear-gradient(${isDark ? "rgba(255,255,255,0.02)" : `rgba(${hexToRgb(color)},0.05)`} 1px, transparent 1px),
          linear-gradient(90deg, ${isDark ? "rgba(255,255,255,0.02)" : `rgba(${hexToRgb(color)},0.05)`} 1px, transparent 1px)`,
        backgroundSize: "32px 32px",
        zIndex: 0,
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* ── Header bar ── */}
        <div style={{
          padding: "clamp(16px,2.5vw,24px) clamp(20px,3vw,32px)",
          borderBottom: `1px solid ${border}`,
          display: "flex", alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap", gap: 12,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Mission ID */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 14, height: 1.5, background: color, borderRadius: 1 }} />
              <span style={{
                fontFamily: "'Courier New',monospace",
                fontSize: 9, fontWeight: 800,
                letterSpacing: "0.3em",
                color,
              }}>
                {project.id} :: {project.codename}
              </span>
            </div>

            {/* Title */}
            <h3 style={{
              margin: 0,
              fontFamily: "'Courier New',monospace",
              fontSize: "clamp(18px,2.5vw,28px)",
              fontWeight: 900,
              color: isDark ? "#ffffff" : "#0a1212",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}>
              {project.title}
            </h3>
            <p style={{
              margin: "6px 0 0",
              fontFamily: "'Courier New',monospace",
              fontSize: "clamp(11px,1.2vw,13px)",
              fontWeight: 600,
              color: muted,
              letterSpacing: "0.05em",
              fontStyle: "italic",
            }}>
              {project.philosophy}
            </p>
          </div>

          {/* Status badge */}
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8,
            flexShrink: 0,
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              background: `rgba(${hexToRgb(color)},0.12)`,
              border: `1px solid ${color}55`,
              borderRadius: 5,
              padding: "5px 12px",
            }}>
              <motion.div
                animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0, 0.8] }}
                transition={{ repeat: Infinity, duration: 1.8 }}
                style={{ width: 7, height: 7, borderRadius: "50%", background: color }}
              />
              <span style={{
                fontFamily: "'Courier New',monospace",
                fontSize: 9, fontWeight: 800,
                letterSpacing: "0.2em",
                color,
              }}>
                {project.status}
              </span>
            </div>
          </div>
        </div>

        {/* ── Tech stack bar ── */}
        <div style={{
          padding: "12px clamp(20px,3vw,32px)",
          borderBottom: `1px solid ${border}`,
          display: "flex", alignItems: "center",
          gap: 8, flexWrap: "wrap",
        }}>
          <span style={{ fontSize: 9, fontWeight: 800, color: muted, letterSpacing: "0.25em", textTransform: "uppercase", fontFamily: "'Courier New',monospace", flexShrink: 0 }}>
            STACK //
          </span>
          {project.stack.map(tech => (
            <span key={tech} style={{
              fontFamily: "'Courier New',monospace",
              fontSize: "clamp(9px,1vw,11px)",
              fontWeight: 700,
              color,
              background: `rgba(${hexToRgb(color)},0.1)`,
              border: `1px solid ${color}44`,
              borderRadius: 4,
              padding: "3px 9px",
              letterSpacing: "0.05em",
            }}>
              {tech}
            </span>
          ))}
        </div>

        {/* ── Main content: schematic + details ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%,320px),1fr))",
          gap: 0,
        }}>

          {/* Schematic panel */}
          <div style={{
            borderRight: `1px solid ${border}`,
            padding: "clamp(20px,3vw,32px)",
            display: "flex", flexDirection: "column", gap: 14,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 14, height: 1.5, background: color, borderRadius: 1 }} />
              <span style={{
                fontFamily: "'Courier New',monospace",
                fontSize: 9, fontWeight: 800,
                letterSpacing: "0.28em", textTransform: "uppercase", color,
              }}>
                System Architecture
              </span>
            </div>

            {/* Canvas area */}
            <div style={{
              height: "clamp(220px,28vw,320px)",
              background: isDark ? "rgba(0,0,0,0.4)" : `rgba(${hexToRgb(color)},0.3)`,
              border: `1px solid ${border}`,
              borderRadius: 6,
              overflow: "hidden",
              position: "relative",
            }}>
              <SchematicCanvas project={project} isDark={isDark} activeNode={activeNode} />
              <div style={{
                position: "absolute", bottom: 8, left: 10,
                fontFamily: "'Courier New',monospace",
                fontSize: 8, color: muted,
                letterSpacing: "0.15em",
              }}>
                HOVER LAYER NODES →
              </div>
            </div>

            {/* Node list — hover to highlight */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {project.schematic.nodes.map(n => (
                <div
                  key={n.id}
                  onMouseEnter={() => setActiveNode(n.id)}
                  onMouseLeave={() => setActiveNode(null)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "6px 10px",
                    borderRadius: 5,
                    background: activeNode === n.id
                      ? `rgba(${hexToRgb(color)},0.12)` : "transparent",
                    border: `1px solid ${activeNode === n.id ? color + "55" : "transparent"}`,
                    cursor: "pointer",
                    transition: "all 0.18s ease",
                  }}
                >
                  <div style={{
                    width: 7, height: 7, borderRadius: "50%",
                    background: activeNode === n.id ? color : (isDark ? "rgba(255,255,255,0.2)" : `rgba(${hexToRgb(color)},0.3)`),
                    boxShadow: activeNode === n.id ? `0 0 8px ${color}` : "none",
                    transition: "all 0.18s ease",
                    flexShrink: 0,
                  }} />
                  <span style={{
                    fontFamily: "'Courier New',monospace",
                    fontSize: "clamp(10px,1.1vw,12px)",
                    fontWeight: 700,
                    color: activeNode === n.id ? color : text,
                    transition: "color 0.18s ease",
                  }}>
                    {n.label}
                  </span>
                  <span style={{
                    fontFamily: "'Courier New',monospace",
                    fontSize: 9, color: muted,
                    marginLeft: "auto",
                  }}>
                    {n.sub}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Details panel */}
          <div style={{
            padding: "clamp(20px,3vw,32px)",
            display: "flex", flexDirection: "column", gap: 24,
          }}>

            {/* Dossier */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <div style={{ width: 14, height: 1.5, background: color, borderRadius: 1 }} />
                <span style={{ fontFamily: "'Courier New',monospace", fontSize: 9, fontWeight: 800, letterSpacing: "0.28em", textTransform: "uppercase", color }}>
                  Mission Dossier
                </span>
              </div>
              <DossierBlock items={project.dossier} color={color} isDark={isDark} />
            </div>

            {/* Constraint */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <div style={{ width: 14, height: 1.5, background: "rgba(220,60,60,0.7)", borderRadius: 1 }} />
                <span style={{ fontFamily: "'Courier New',monospace", fontSize: 9, fontWeight: 800, letterSpacing: "0.28em", textTransform: "uppercase", color: isDark ? "rgba(255,100,100,0.8)" : "rgba(180,40,40,0.8)" }}>
                  Technical Constraint
                </span>
              </div>
              <ConstraintBlock constraint={project.constraint} color={color} isDark={isDark} />
            </div>

            {/* Before/After optimization */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <div style={{ width: 14, height: 1.5, background: color, borderRadius: 1 }} />
                <span style={{ fontFamily: "'Courier New',monospace", fontSize: 9, fontWeight: 800, letterSpacing: "0.28em", textTransform: "uppercase", color }}>
                  Optimization Log
                </span>
              </div>
              <div style={{
                background: isDark ? `rgba(${hexToRgb(color)},0.06)` : `rgba(${hexToRgb(color)},0.05)`,
                border: `1px solid ${color}33`,
                borderLeft: `3px solid ${color}`,
                borderRadius: "0 6px 6px 0",
                padding: "14px 18px",
                display: "flex", flexDirection: "column", gap: 12,
              }}>
                <span style={{ fontFamily: "'Courier New',monospace", fontSize: 9, fontWeight: 800, letterSpacing: "0.25em", color }}>
                  // {project.optimization.label}
                </span>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 24px 1fr", alignItems: "center", gap: 8 }}>
                  {[
                    { label: "BEFORE", val: project.optimization.metric.before, bad: true },
                    null,
                    { label: "AFTER", val: project.optimization.metric.after, bad: false },
                  ].map((item, i) =>
                    item === null ? (
                      <span key={i} style={{ textAlign: "center", color, fontWeight: 900, fontSize: 16 }}>→</span>
                    ) : (
                      <div key={i} style={{
                        background: item.bad
                          ? (isDark ? "rgba(255,0,0,0.07)" : "rgba(200,0,0,0.05)")
                          : `rgba(${hexToRgb(color)},0.1)`,
                        border: `1px solid ${item.bad ? "rgba(220,50,50,0.3)" : color + "44"}`,
                        borderRadius: 5, padding: "8px 12px",
                      }}>
                        <div style={{ fontSize: 8, fontFamily: "'Courier New',monospace", fontWeight: 800, letterSpacing: "0.2em", marginBottom: 4, color: item.bad ? "rgba(220,80,80,0.8)" : color }}>
                          {item.label}
                        </div>
                        <div style={{ fontFamily: "'Courier New',monospace", fontSize: "clamp(13px,1.5vw,16px)", fontWeight: 900, color: item.bad ? (isDark ? "rgba(255,120,120,0.9)" : "rgba(180,40,40,0.9)") : color }}>
                          {item.val}
                        </div>
                      </div>
                    )
                  )}
                </div>
                <p style={{ margin: 0, fontFamily: "'Courier New',monospace", fontSize: "clamp(10px,1.1vw,12px)", fontWeight: 600, color: text, lineHeight: 1.75 }}>
                  {project.optimization.after}
                </p>
              </div>
            </div>

            {/* Terminal command link */}
            <motion.a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ x: 4 }}
              onClick={copyTerminal}
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                background: isDark ? "rgba(0,0,0,0.5)" : "rgba(10,18,18,0.04)",
                border: `1px solid ${color}44`,
                borderRadius: 6,
                padding: "10px 16px",
                textDecoration: "none",
                width: "fit-content",
                transition: "border-color 0.2s ease",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = color}
              onMouseLeave={e => e.currentTarget.style.borderColor = color + "44"}
            >
              <span style={{ color, fontWeight: 800, fontSize: 12 }}>$</span>
              <span style={{
                fontFamily: "'Courier New',monospace",
                fontSize: "clamp(10px,1.1vw,12px)",
                fontWeight: 700,
                color,
                letterSpacing: "0.04em",
              }}>
                {project.terminalPath}
              </span>
              <span style={{
                fontFamily: "'Courier New',monospace",
                fontSize: 9, color: muted, marginLeft: "auto",
              }}>
                {copied ? "COPIED ✓" : "↗ GITHUB"}
              </span>
            </motion.a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── AXIS LINE ────────────────────────────────────────────────────────────────
function AxisLine({ isDark }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "8px 0",
    }}>
      <div style={{
        width: 1.5, height: 48,
        background: isDark
          ? "linear-gradient(180deg, rgba(92,189,185,0.6), rgba(201,184,245,0.6))"
          : "linear-gradient(180deg, rgba(92,189,185,0.8), rgba(201,184,245,0.8))",
        borderRadius: 1,
      }} />
      <div style={{
        width: 10, height: 10, borderRadius: "50%",
        background: isDark ? "#5cbdb9" : "#2a9e9a",
        boxShadow: `0 0 12px ${isDark ? "#5cbdb9" : "#2a9e9a"}`,
      }} />
      <div style={{
        width: 1.5, height: 48,
        background: isDark
          ? "linear-gradient(180deg, rgba(201,184,245,0.6), rgba(92,189,185,0.6))"
          : "linear-gradient(180deg, rgba(201,184,245,0.8), rgba(92,189,185,0.8))",
        borderRadius: 1,
      }} />
    </div>
  );
}

// ─── PAGE HEADER ─────────────────────────────────────────────────────────────
function PageHeader({ isDark }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const teal = isDark ? "#5cbdb9" : "#2a9e9a";
  const text = isDark ? "#ffffff" : "#0a1212";
  const muted = isDark ? "rgba(255,255,255,0.38)" : "rgba(10,18,18,0.42)";

  return (
    <div ref={ref} style={{ marginTop: "clamp(40px,6vw,64px)" }}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5 }}
        style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}
      >
        <div style={{ width: 28, height: 1.5, background: teal, borderRadius: 1 }} />
        <span style={{ fontFamily: "'Courier New',monospace", fontSize: 10, fontWeight: 800, letterSpacing: "0.35em", textTransform: "uppercase", color: teal }}>
          The Execution Log
        </span>
        <div style={{ width: 28, height: 1.5, background: teal, borderRadius: 1 }} />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, delay: 0.1 }}
        style={{
          margin: 0,
          fontFamily: "'Courier New',monospace",
          fontSize: "clamp(28px,5vw,56px)",
          fontWeight: 900,
          letterSpacing: "-0.03em",
          lineHeight: 1.05,
          color: text,
        }}
      >
        Flagship{" "}
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
          Systems.
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, delay: 0.2 }}
        style={{
          margin: "14px 0 0",
          fontFamily: "'Courier New',monospace",
          fontSize: "clamp(12px,1.3vw,14px)",
          fontWeight: 600,
          color: muted,
          letterSpacing: "0.06em",
          maxWidth: 520,
          lineHeight: 1.75,
        }}
      >
        Deep architecture breakdowns. Every constraint documented. Every optimization measured.
      </motion.p>

      <motion.div
        initial={{ scaleX: 0, originX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1, delay: 0.3 }}
        style={{
          marginTop: 24, height: 1.5,
          background: isDark
            ? "linear-gradient(90deg, #5cbdb9, #c9b8f5 45%, #fbe3e8 75%, transparent)"
            : "linear-gradient(90deg, #2a9e9a, #6040c0 45%, #c04070 75%, transparent)",
          opacity: isDark ? 0.45 : 0.6,
        }}
      />
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function ProjectsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const bg = isDark ? "#000000" : "#ffffff";
  const gridLine = isDark ? "rgba(255,255,255,0.025)" : "rgba(92,189,185,0.07)";

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
        backgroundImage: `
          linear-gradient(${gridLine} 1px, transparent 1px),
          linear-gradient(90deg, ${gridLine} 1px, transparent 1px)
        `,
        backgroundSize: "48px 48px",
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <PageHeader isDark={isDark} />

        {/* ── Central axis + cards ── */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: 0 }}>
          {PROJECTS.map((project, i) => (
            <div key={project.id}>
              <ProjectCard project={project} index={i} isDark={isDark} />
              {i < PROJECTS.length - 1 && <AxisLine isDark={isDark} />}
            </div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <GitHubRedirect style={{ filter: isDark ? "invert(1)" : "none" }} />
        </div>
        {/* Footer rule */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          style={{
            marginTop: "clamp(40px,6vw,64px)",
            display: "flex", alignItems: "center", gap: 16,
          }}
        >

          <div style={{ flex: 1, height: 1, background: isDark ? "rgba(255,255,255,0.07)" : "rgba(10,100,90,0.15)" }} />
          <span style={{
            fontFamily: "'Courier New',monospace",
            fontSize: 9, fontWeight: 700,
            letterSpacing: "0.3em", textTransform: "uppercase",
            color: isDark ? "rgba(255,255,255,0.2)" : "rgba(10,80,70,0.4)",
          }}>
            Rajasekhar — Flagship Systems — v1.0
          </span>
          <div style={{ flex: 1, height: 1, background: isDark ? "rgba(255,255,255,0.07)" : "rgba(10,100,90,0.15)" }} />
        </motion.div>

        {/* The Contribution Snake */}
        <GitHubSnake style={{ marginLeft: 12, filter: isDark ? "invert(1)" : "none" }} />

        {/* GitHub Stats */}
        <div className="max-w-7xl mx-auto relative z-10"
          style={{ willChange: "transform" }}>
          <GitHubStats />
        </div>
      </div>
    </div>
  );
}