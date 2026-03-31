import { useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import GitHubSnake from "./GitHubSnake";

// ── GitHub links — replace these when ready ───────────────────────────────────
const GITHUB_LINKS = {
  food:  " https://github.com/kvnrajasekhar/food-ordering-system",
  qotes: "https://github.com/kvnrajasekhar/qotes-server",
};

// ── Project data ──────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    id: "food",
    systemId: "SYSTEM_ARCH_01",
    codename: "DISTRIBUTED_FOOD_GENIUS",
    identity: "Full-Stack Enterprise Ordering Solution",
    philosophy: "Seamless CRUD Orchestration and Relational Data Integrity.",
    color: "#5cbdb9",
    stack: ["Java", "Spring Boot", "Spring Security", "PostgreSQL", "REST API", "JWT"],
    terminalPath: "cat projects/food-management/Main.java",
    schematic: {
      nodes: [
        { id: "client",    label: "Client Layer",       sub: "Multi-Role UI",             x: 50,  y: 12  },
        { id: "gateway",   label: "API Gateway",        sub: "REST Controllers",           x: 50,  y: 32  },
        { id: "authSvc",   label: "Auth Service",       sub: "JWT + Role Guard",           x: 20,  y: 52  },
        { id: "orderSvc",  label: "Order Service",      sub: "State Machine Logic",        x: 50,  y: 52  },
        { id: "menuSvc",   label: "Menu Service",       sub: "Admin CRUD",                 x: 80,  y: 52  },
        { id: "db",        label: "PostgreSQL",         sub: "Relational Schema",          x: 50,  y: 74  },
        { id: "session",   label: "Session Store",      sub: "Role Validation",            x: 20,  y: 74  },
      ],
      edges: [
        ["client","gateway"],["gateway","authSvc"],["gateway","orderSvc"],
        ["gateway","menuSvc"],["orderSvc","db"],["menuSvc","db"],
        ["authSvc","session"],["orderSvc","session"],
      ],
    },
    constraint: {
      challenge: "Role-Based State Management",
      detail: "Ensuring a Customer can only view and order while a Restaurant Admin can modify live menus and update order statuses — without cross-contaminating data or compromising the order flow.",
      solution: "Implemented Service-Oriented Logic where every request is validated against the user's session role, plus a state-machine for orders (Pending → Confirmed → Out for Delivery) to ensure data consistency.",
    },
    optimization: {
      title: "Relational Integrity at Scale",
      before: "Cascading deletes broke historical order logs",
      after:  "Schema redesign preserves all historical data on menu item removal",
      metric: "0 data integrity violations in production",
    },
    stateFlow: ["Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered"],
  },
  {
    id: "qotes",
    systemId: "SYSTEM_ARCH_02",
    codename: "QOTES_SERVER",
    identity: "High-Throughput Social Media Engine",
    philosophy: "Latency Elimination through Event-Driven Streams.",
    color: "#c9b8f5",
    stack: ["Node.js", "Express", "Redis", "Kafka", "MongoDB", "WebSockets"],
    terminalPath: "cat projects/qotes-server/index.js",
    schematic: {
      nodes: [
        { id: "client",  label: "Client",          sub: "API Consumer",            x: 50,  y: 10  },
        { id: "express", label: "Express Server",  sub: "Event Loop / Routes",     x: 50,  y: 28  },
        { id: "redis",   label: "Redis Cache",     sub: "Hot Content Store",       x: 18,  y: 50  },
        { id: "kafka",   label: "Kafka Broker",    sub: "Async Event Stream",      x: 50,  y: 50  },
        { id: "mongo",   label: "MongoDB",         sub: "Document Store",          x: 82,  y: 50  },
        { id: "analytics",label:"Analytics Svc",   sub: "Offloaded Processing",    x: 35,  y: 72  },
        { id: "actlog",  label: "Activity Log",    sub: "Non-critical Tasks",      x: 65,  y: 72  },
      ],
      edges: [
        ["client","express"],["express","redis"],["express","kafka"],
        ["express","mongo"],["kafka","analytics"],["kafka","actlog"],
        ["redis","mongo"],
      ],
    },
    constraint: {
      challenge: "The Viral Traffic Bottleneck",
      detail: "Handling a surge of read requests for popular content without overwhelming the primary MongoDB instance during traffic spikes.",
      solution: "Implemented a Cache-Aside Strategy with Redis — serving high-frequency data from memory, dramatically reducing database query load during stress tests.",
    },
    optimization: {
      title: "Latency Elimination",
      before: "Direct DB reads: ~280ms avg response",
      after:  "Redis cache-aside: <45ms avg response",
      metric: "~84% latency reduction on hot content",
    },
    stateFlow: ["POST /create", "Kafka Emit", "Cache Warm", "DB Persist", "Client ACK"],
  },
];

// ── CI/CD + Branching data ────────────────────────────────────────────────────
const CICD_STEPS = [
  { icon: "⬆", label: "git push",        sub: "Feature Branch",     color: "#5cbdb9" },
  { icon: "🔍", label: "Lint + Format",   sub: "ESLint / Checkstyle",color: "#f7c4a0" },
  { icon: "🧪", label: "Unit Tests",      sub: "JUnit / Jest",       color: "#c9b8f5" },
  { icon: "🔨", label: "Build",           sub: "Maven / npm build",  color: "#a8d8b9" },
  { icon: "🚀", label: "Deploy",          sub: "Vercel / Render",    color: "#fbe3e8" },
  { icon: "✅", label: "Production",      sub: "Live Environment",   color: "#5cbdb9" },
];

const BRANCHES = [
  { name: "main",        type: "main",    desc: "Production-ready code only" },
  { name: "develop",     type: "develop", desc: "Integration branch" },
  { name: "feature/auth",type: "feature", desc: "New feature work" },
  { name: "hotfix/bug",  type: "hotfix",  desc: "Emergency patches" },
];

// ── Schematic canvas ──────────────────────────────────────────────────────────
function SchematicDiagram({ project, isDark, hoveredNode }) {
  const color = project.color;
  const bg    = isDark ? "#050505" : "#f8fffe";
  const dim   = isDark ? "rgba(255,255,255,0.08)" : "rgba(10,18,18,0.12)";
  const W = 320, H = 320;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: "100%", height: "100%", maxWidth: 340, maxHeight: 340 }}
    >
      {/* Grid */}
      {Array.from({ length: 8 }).map((_, i) => (
        <g key={i}>
          <line x1={i * 46} y1={0} x2={i * 46} y2={H} stroke={dim} strokeWidth="0.5" />
          <line x1={0} y1={i * 46} x2={W} y2={i * 46} stroke={dim} strokeWidth="0.5" />
        </g>
      ))}

      {/* Edges */}
      {project.schematic.edges.map(([from, to], i) => {
        const a = project.schematic.nodes.find(n => n.id === from);
        const b = project.schematic.nodes.find(n => n.id === to);
        if (!a || !b) return null;
        const ax = (a.x / 100) * W, ay = (a.y / 100) * H;
        const bx = (b.x / 100) * W, by = (b.y / 100) * H;
        const isActive = hoveredNode === from || hoveredNode === to;
        return (
          <g key={i}>
            <line
              x1={ax} y1={ay} x2={bx} y2={by}
              stroke={isActive ? color : color + "33"}
              strokeWidth={isActive ? 1.5 : 0.8}
              strokeDasharray={isActive ? "none" : "4 4"}
            />
            {/* Arrow */}
            {isActive && (
              <circle
                cx={ax + (bx - ax) * 0.65}
                cy={ay + (by - ay) * 0.65}
                r={3}
                fill={color}
              />
            )}
          </g>
        );
      })}

      {/* Nodes */}
      {project.schematic.nodes.map(node => {
        const x = (node.x / 100) * W;
        const y = (node.y / 100) * H;
        const isActive = hoveredNode === node.id;
        const r = 22;
        return (
          <g key={node.id}>
            {/* Glow */}
            {isActive && (
              <circle cx={x} cy={y} r={r + 12} fill={color + "22"} />
            )}
            {/* Node circle */}
            <circle
              cx={x} cy={y} r={r}
              fill={isActive ? color + "22" : (isDark ? "#111" : "#fff")}
              stroke={isActive ? color : color + "55"}
              strokeWidth={isActive ? 1.8 : 1}
            />
            {/* Label */}
            <text
              x={x} y={y - 4}
              textAnchor="middle"
              fontSize="7"
              fontWeight="700"
              fontFamily="'Courier New',monospace"
              fill={isActive ? color : (isDark ? "rgba(255,255,255,0.75)" : "rgba(10,18,18,0.75)")}
            >
              {node.label}
            </text>
            <text
              x={x} y={y + 8}
              textAnchor="middle"
              fontSize="5.5"
              fontFamily="'Courier New',monospace"
              fill={isActive ? color + "cc" : (isDark ? "rgba(255,255,255,0.35)" : "rgba(10,18,18,0.35)")}
            >
              {node.sub}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Flagship project (sticky left, scroll right) ──────────────────────────────
function FlagshipProject({ project, isDark, index }) {
  const [hoveredNode, setHoveredNode] = useState(null);
  const sectionRef = useRef(null);

  const color  = project.color;
  const accent = isDark ? color : color;
  const bg2    = isDark ? color + "0a" : color + "0d";
  const border = isDark ? color + "28" : color + "55";
  const text   = isDark ? "rgba(255,255,255,0.82)" : "rgba(10,18,18,0.82)";
  const muted  = isDark ? "rgba(255,255,255,0.42)" : "rgba(10,18,18,0.45)";
  const textPri = isDark ? "#ffffff" : "#0a1212";

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  // Nodes for hover mapping
  const nodeMap = {};
  project.schematic.nodes.forEach(n => { nodeMap[n.id] = n.label.toLowerCase(); });

  const detectHover = (textContent) => {
    const lower = textContent.toLowerCase();
    const found = project.schematic.nodes.find(n =>
      lower.includes(n.label.toLowerCase()) || lower.includes(n.id.toLowerCase())
    );
    setHoveredNode(found ? found.id : null);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1 }}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 0,
        border: `1px solid ${border}`,
        borderRadius: 8,
        overflow: "hidden",
        background: isDark ? "#050505" : "#ffffff",
        boxShadow: isDark ? `0 0 48px ${color}14` : `0 4px 32px ${color}14`,
        marginBottom: "clamp(32px,5vw,56px)",
      }}
    >
      {/* ── LEFT: Sticky diagram panel ── */}
      <div style={{
        position: "sticky",
        top: 80,
        alignSelf: "start",
        padding: "clamp(24px,3vw,36px)",
        borderRight: `1px solid ${border}`,
        background: isDark ? "#040404" : "#f8fffe",
        display: "flex",
        flexDirection: "column",
        gap: 20,
        height: "fit-content",
      }}>
        {/* System ID */}
        <div>
          <span style={{
            fontFamily: "'Courier New',monospace",
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: "0.3em",
            color: color,
            textTransform: "uppercase",
            display: "block",
            marginBottom: 4,
          }}>
            {project.systemId}
          </span>
          <h2 style={{
            margin: 0,
            fontFamily: "'Courier New',monospace",
            fontSize: "clamp(13px,1.5vw,17px)",
            fontWeight: 900,
            color: textPri,
            letterSpacing: "0.04em",
            lineHeight: 1.25,
          }}>
            {project.codename.replace(/_/g, "_\u200B")}
          </h2>
        </div>

        {/* Live schematic */}
        <div style={{
          width: "100%",
          aspectRatio: "1",
          background: isDark ? "#080808" : "#f2fbfb",
          border: `1px solid ${color}22`,
          borderRadius: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 8,
        }}>
          <SchematicDiagram project={project} isDark={isDark} hoveredNode={hoveredNode} />
        </div>

        {/* State flow */}
        <div>
          <span style={{
            fontFamily: "'Courier New',monospace",
            fontSize: 8,
            letterSpacing: "0.25em",
            color: muted,
            textTransform: "uppercase",
            display: "block",
            marginBottom: 8,
          }}>
            // State Flow
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {project.stateFlow.map((state, i) => (
              <div key={state} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: color,
                  opacity: 0.4 + (i / project.stateFlow.length) * 0.6,
                  boxShadow: `0 0 6px ${color}`,
                  flexShrink: 0,
                }} />
                <span style={{
                  fontFamily: "'Courier New',monospace",
                  fontSize: 10,
                  fontWeight: 700,
                  color: text,
                }}>
                  {state}
                </span>
                {i < project.stateFlow.length - 1 && (
                  <div style={{ width: 12, height: 1, background: color + "44", marginLeft: 2 }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tech stack */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {project.stack.map(tech => (
            <span key={tech} style={{
              fontFamily: "'Courier New',monospace",
              fontSize: 9,
              fontWeight: 700,
              color: color,
              background: color + "14",
              border: `1px solid ${color}33`,
              borderRadius: 3,
              padding: "3px 7px",
              letterSpacing: "0.08em",
            }}>
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* ── RIGHT: Scrollable detail panel ── */}
      <div
        style={{ padding: "clamp(24px,3vw,40px)", display: "flex", flexDirection: "column", gap: 32 }}
        onMouseMove={e => detectHover(e.target.textContent || "")}
        onMouseLeave={() => setHoveredNode(null)}
      >
        {/* Header */}
        <div>
          <span style={{ fontFamily: "'Courier New',monospace", fontSize: 9, color: muted, letterSpacing: "0.25em", textTransform: "uppercase" }}>
            // Identity
          </span>
          <h3 style={{ margin: "8px 0 6px", fontFamily: "'Courier New',monospace", fontSize: "clamp(16px,2vw,22px)", fontWeight: 900, color: textPri, letterSpacing: "-0.01em" }}>
            {project.identity}
          </h3>
          <p style={{ margin: 0, fontFamily: "'Courier New',monospace", fontSize: "clamp(11px,1.2vw,13px)", color: muted, fontStyle: "italic", letterSpacing: "0.05em" }}>
            "{project.philosophy}"
          </p>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: `linear-gradient(90deg, ${color}66, transparent)` }} />

        {/* Schematic description */}
        <div>
          <span style={{ fontFamily: "'Courier New',monospace", fontSize: 9, color: color, letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 700, display: "block", marginBottom: 14 }}>
            // System Overview
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { layer: "Client Layer",      desc: "Interactive UI with multi-role access — Customer and Restaurant Admin flows isolated by session." },
              { layer: "Logic Layer",       desc: "Spring REST Controllers orchestrating the Browse → Order → Track workflow with role-gated endpoints." },
              { layer: "Persistence Layer", desc: "Relational schema handling complex many-to-many relationships between Orders and Menu Items with cascade integrity." },
            ].map(row => (
              <div
                key={row.layer}
                style={{
                  padding: "12px 14px",
                  background: bg2,
                  border: `1px solid ${border}`,
                  borderRadius: 5,
                  cursor: "default",
                }}
                onMouseEnter={() => {
                  const node = project.schematic.nodes.find(n =>
                    row.layer.toLowerCase().includes(n.id) ||
                    n.label.toLowerCase().includes(row.layer.split(" ")[0].toLowerCase())
                  );
                  setHoveredNode(node ? node.id : null);
                }}
              >
                <span style={{ fontFamily: "'Courier New',monospace", fontSize: 10, fontWeight: 800, color, display: "block", marginBottom: 4, letterSpacing: "0.1em" }}>
                  {row.layer}
                </span>
                <span style={{ fontFamily: "'Courier New',monospace", fontSize: "clamp(11px,1.1vw,12px)", color: text, lineHeight: 1.75 }}>
                  {row.desc}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Constraint */}
        <div style={{ padding: "18px 20px", background: isDark ? "#0d0d0d" : "#f4fffe", border: `1px solid ${color}33`, borderLeft: `3px solid ${color}`, borderRadius: "0 5px 5px 0" }}>
          <span style={{ fontFamily: "'Courier New',monospace", fontSize: 9, color: muted, letterSpacing: "0.25em", textTransform: "uppercase", display: "block", marginBottom: 10 }}>
            // The Constraint
          </span>
          <span style={{ fontFamily: "'Courier New',monospace", fontSize: "clamp(12px,1.3vw,14px)", fontWeight: 800, color: textPri, display: "block", marginBottom: 8 }}>
            ⚠ {project.constraint.challenge}
          </span>
          <p style={{ margin: "0 0 10px", fontFamily: "'Courier New',monospace", fontSize: "clamp(11px,1.1vw,12px)", color: text, lineHeight: 1.8 }}>
            {project.constraint.detail}
          </p>
          <p style={{ margin: 0, fontFamily: "'Courier New',monospace", fontSize: "clamp(11px,1.1vw,12px)", color: color, lineHeight: 1.8, fontStyle: "italic" }}>
            ✓ {project.constraint.solution}
          </p>
        </div>

        {/* Optimization before/after */}
        <div>
          <span style={{ fontFamily: "'Courier New',monospace", fontSize: 9, color: color, letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 700, display: "block", marginBottom: 14 }}>
            // Optimization
          </span>
          <span style={{ fontFamily: "'Courier New',monospace", fontSize: "clamp(12px,1.3vw,14px)", fontWeight: 800, color: textPri, display: "block", marginBottom: 12 }}>
            {project.optimization.title}
          </span>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            <div style={{ padding: "12px 14px", background: isDark ? "#1a0a0a" : "#fff5f5", border: "1px solid #e0404033", borderRadius: 5 }}>
              <span style={{ fontFamily: "'Courier New',monospace", fontSize: 8, color: "#e04040", letterSpacing: "0.2em", textTransform: "uppercase", display: "block", marginBottom: 5 }}>BEFORE</span>
              <span style={{ fontFamily: "'Courier New',monospace", fontSize: "clamp(10px,1vw,11px)", color: isDark ? "rgba(255,255,255,0.65)" : "rgba(10,18,18,0.65)", lineHeight: 1.6 }}>
                {project.optimization.before}
              </span>
            </div>
            <div style={{ padding: "12px 14px", background: isDark ? "#0a1a0a" : "#f4fff8", border: `1px solid ${color}33`, borderRadius: 5 }}>
              <span style={{ fontFamily: "'Courier New',monospace", fontSize: 8, color, letterSpacing: "0.2em", textTransform: "uppercase", display: "block", marginBottom: 5 }}>AFTER</span>
              <span style={{ fontFamily: "'Courier New',monospace", fontSize: "clamp(10px,1vw,11px)", color: isDark ? "rgba(255,255,255,0.65)" : "rgba(10,18,18,0.65)", lineHeight: 1.6 }}>
                {project.optimization.after}
              </span>
            </div>
          </div>
          <div style={{ padding: "10px 14px", background: color + "14", border: `1px solid ${color}44`, borderRadius: 5, textAlign: "center" }}>
            <span style={{ fontFamily: "'Courier New',monospace", fontSize: "clamp(11px,1.2vw,13px)", fontWeight: 800, color, letterSpacing: "0.08em" }}>
              ◈ {project.optimization.metric}
            </span>
          </div>
        </div>

        {/* Terminal link */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <motion.a
            href={GITHUB_LINKS[project.id]}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ x: 4 }}
            style={{
              fontFamily: "'Courier New',monospace",
              fontSize: "clamp(11px,1.2vw,13px)",
              fontWeight: 700,
              color,
              textDecoration: "none",
              letterSpacing: "0.05em",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ opacity: 0.5 }}>$</span>
            <span style={{ textDecoration: "underline", textUnderlineOffset: 4 }}>
              {project.terminalPath}
            </span>
            <span style={{ fontSize: 10, opacity: 0.5 }}>↗</span>
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}

// ── CI/CD Pipeline ────────────────────────────────────────────────────────────
function CICDPipeline({ isDark }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const text   = isDark ? "rgba(255,255,255,0.82)" : "rgba(10,18,18,0.82)";
  const muted  = isDark ? "rgba(255,255,255,0.38)" : "rgba(10,18,18,0.42)";
  const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(92,189,185,0.2)";

  return (
    <div ref={ref} style={{ marginBottom: 40 }}>
      <span style={{ fontFamily: "'Courier New',monospace", fontSize: 9, color: muted, letterSpacing: "0.28em", textTransform: "uppercase", display: "block", marginBottom: 24 }}>
        // CI/CD Pipeline
      </span>
      <div style={{ position: "relative", overflowX: "auto", paddingBottom: 8 }}>
        {/* Connecting line */}
        <div style={{
          position: "absolute",
          top: "50%", left: 0, right: 0,
          height: 1.5,
          background: isDark
            ? "linear-gradient(90deg, #5cbdb944, #c9b8f544, #5cbdb944)"
            : "linear-gradient(90deg, #5cbdb966, #c9b8f566, #5cbdb966)",
          transform: "translateY(-50%)",
          zIndex: 0,
        }} />
        <div style={{ display: "flex", alignItems: "center", gap: 0, position: "relative", zIndex: 1, minWidth: "fit-content" }}>
          {CICD_STEPS.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.45 }}
              style={{ display: "flex", alignItems: "center" }}
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "0 clamp(12px,2vw,24px)" }}>
                <div style={{
                  width: 48, height: 48,
                  borderRadius: "50%",
                  background: isDark ? step.color + "18" : step.color + "22",
                  border: `2px solid ${step.color}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18,
                  boxShadow: `0 0 16px ${step.color}44`,
                }}>
                  {step.icon}
                </div>
                <span style={{ fontFamily: "'Courier New',monospace", fontSize: "clamp(9px,1vw,11px)", fontWeight: 800, color: step.color, letterSpacing: "0.08em", textAlign: "center", whiteSpace: "nowrap" }}>
                  {step.label}
                </span>
                <span style={{ fontFamily: "'Courier New',monospace", fontSize: "clamp(8px,0.85vw,9px)", color: muted, textAlign: "center", whiteSpace: "nowrap" }}>
                  {step.sub}
                </span>
              </div>
              {i < CICD_STEPS.length - 1 && (
                <span style={{ color: muted, fontSize: 14, flexShrink: 0 }}>›</span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Branching strategy ────────────────────────────────────────────────────────
function BranchingStrategy({ isDark }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const muted  = isDark ? "rgba(255,255,255,0.38)" : "rgba(10,18,18,0.42)";
  const text   = isDark ? "rgba(255,255,255,0.8)"  : "rgba(10,18,18,0.8)";

  const branchColors = {
    main:    "#5cbdb9",
    develop: "#f7c4a0",
    feature: "#c9b8f5",
    hotfix:  "#fbe3e8",
  };

  return (
    <div ref={ref} style={{ marginBottom: 40 }}>
      <span style={{ fontFamily: "'Courier New',monospace", fontSize: 9, color: muted, letterSpacing: "0.28em", textTransform: "uppercase", display: "block", marginBottom: 24 }}>
        // Branching Strategy
      </span>
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {/* Git graph visual */}
        <svg viewBox="0 0 600 160" style={{ width: "100%", maxWidth: 640, height: "auto", marginBottom: 16 }}>
          {/* main line */}
          <line x1="40" y1="80" x2="560" y2="80" stroke="#5cbdb9" strokeWidth="2.5" />
          {/* develop branch */}
          <path d="M 160 80 Q 180 80 200 50 L 420 50 Q 440 50 460 80" stroke="#f7c4a0" strokeWidth="1.8" fill="none" strokeDasharray="5 3" />
          {/* feature branch */}
          <path d="M 240 50 Q 255 50 270 25 L 360 25 Q 375 25 390 50" stroke="#c9b8f5" strokeWidth="1.4" fill="none" strokeDasharray="4 4" />
          {/* hotfix */}
          <path d="M 480 80 Q 495 80 510 105 L 530 105 Q 545 105 560 80" stroke="#fbe3e8" strokeWidth="1.4" fill="none" strokeDasharray="4 4" />

          {/* Commits on main */}
          {[40, 160, 320, 460, 560].map((x, i) => (
            <circle key={i} cx={x} cy={80} r={i === 0 || i === 4 ? 7 : 5}
              fill={i === 0 || i === 4 ? "#5cbdb9" : "#5cbdb966"}
              stroke="#5cbdb9" strokeWidth="1.5" />
          ))}
          {/* Commits on develop */}
          {[200, 300, 420].map((x, i) => (
            <circle key={i} cx={x} cy={50} r={4} fill="#f7c4a044" stroke="#f7c4a0" strokeWidth="1.2" />
          ))}
          {/* Commits on feature */}
          {[270, 330, 390].map((x, i) => (
            <circle key={i} cx={x} cy={25} r={3.5} fill="#c9b8f533" stroke="#c9b8f5" strokeWidth="1" />
          ))}
          {/* Hotfix commit */}
          <circle cx={520} cy={105} r={4} fill="#fbe3e833" stroke="#fbe3e8" strokeWidth="1" />

          {/* Labels */}
          {[
            { x: 40, y: 100, label: "init", col: "#5cbdb9" },
            { x: 210, y: 40, label: "develop", col: "#f7c4a0" },
            { x: 300, y: 15, label: "feature/auth", col: "#c9b8f5" },
            { x: 520, y: 122, label: "hotfix", col: "#fbe3e8" },
            { x: 560, y: 100, label: "main", col: "#5cbdb9" },
          ].map((lb, i) => (
            <text key={i} x={lb.x} y={lb.y}
              textAnchor="middle" fontSize="9" fontWeight="700"
              fontFamily="'Courier New',monospace" fill={lb.col}>
              {lb.label}
            </text>
          ))}
        </svg>

        {/* Branch legend */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {BRANCHES.map(branch => (
            <motion.div
              key={branch.name}
              initial={{ opacity: 0, x: -10 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4 }}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "8px 14px",
                background: isDark ? branchColors[branch.type] + "10" : branchColors[branch.type] + "14",
                border: `1px solid ${branchColors[branch.type]}44`,
                borderRadius: 5,
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: branchColors[branch.type], boxShadow: `0 0 6px ${branchColors[branch.type]}` }} />
              <span style={{ fontFamily: "'Courier New',monospace", fontSize: 10, fontWeight: 800, color: branchColors[branch.type] }}>
                {branch.name}
              </span>
              <span style={{ fontFamily: "'Courier New',monospace", fontSize: 9, color: muted }}>
                — {branch.desc}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Vertical axis connector ───────────────────────────────────────────────────
function AxisConnector({ isDark, label }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const accent = "#5cbdb9";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5 }}
      style={{
        display: "flex", alignItems: "center", gap: 16,
        margin: "clamp(24px,4vw,40px) 0",
        position: "relative",
      }}
    >
      <div style={{ flex: 1, height: 1, background: isDark ? "rgba(255,255,255,0.06)" : "rgba(92,189,185,0.2)" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: accent, boxShadow: `0 0 10px ${accent}` }} />
        <span style={{ fontFamily: "'Courier New',monospace", fontSize: 9, fontWeight: 800, color: accent, letterSpacing: "0.28em", textTransform: "uppercase" }}>
          {label}
        </span>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: accent, boxShadow: `0 0 10px ${accent}` }} />
      </div>
      <div style={{ flex: 1, height: 1, background: isDark ? "rgba(255,255,255,0.06)" : "rgba(92,189,185,0.2)" }} />
    </motion.div>
  );
}

// ── Section heading ───────────────────────────────────────────────────────────
function SectionHeading({ label, sub, isDark }) {
  const accent = "#5cbdb9";
  const textPri = isDark ? "#ffffff" : "#0a1212";
  const muted   = isDark ? "rgba(255,255,255,0.42)" : "rgba(10,18,18,0.45)";
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55 }}
      style={{ marginBottom: "clamp(28px,4vw,44px)" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <div style={{ width: 28, height: 1.5, background: accent }} />
        <span style={{ fontFamily: "'Courier New',monospace", fontSize: 10, fontWeight: 800, color: accent, letterSpacing: "0.32em", textTransform: "uppercase" }}>
          {label}
        </span>
        <div style={{ width: 28, height: 1.5, background: accent }} />
      </div>
      {sub && (
        <p style={{ margin: 0, fontFamily: "'Courier New',monospace", fontSize: "clamp(11px,1.2vw,13px)", color: muted, letterSpacing: "0.08em", lineHeight: 1.7 }}>
          {sub}
        </p>
      )}
      <motion.div
        initial={{ scaleX: 0, originX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.9, delay: 0.2 }}
        style={{ marginTop: 18, height: 1, background: `linear-gradient(90deg, ${accent}, #c9b8f5 45%, #fbe3e8 75%, transparent)`, opacity: 0.45 }}
      />
    </motion.div>
  );
}

// ── MAIN EXPORT ───────────────────────────────────────────────────────────────
export default function ProjectsPage() {
  const { theme } = useTheme();
  const isDark    = theme === "dark";

  const bg      = isDark ? "#000000" : "#ffffff";
  const text    = isDark ? "rgba(255,255,255,0.82)" : "rgba(10,18,18,0.82)";
  const muted   = isDark ? "rgba(255,255,255,0.38)" : "rgba(10,18,18,0.42)";
  const border  = isDark ? "rgba(255,255,255,0.07)" : "rgba(92,189,185,0.15)";
  const textPri = isDark ? "#ffffff" : "#0a1212";

  return (
    <section style={{
      width: "100%",
      background: bg,
      padding: "clamp(56px,9vw,110px) clamp(16px,6vw,72px)",
      fontFamily: "'Courier New',monospace",
      transition: "background 0.4s ease",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Blueprint grid bg */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `
          linear-gradient(${isDark ? "rgba(255,255,255,0.022)" : "rgba(92,189,185,0.07)"} 1px, transparent 1px),
          linear-gradient(90deg, ${isDark ? "rgba(255,255,255,0.022)" : "rgba(92,189,185,0.07)"} 1px, transparent 1px)
        `,
        backgroundSize: "48px 48px",
      }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* ── Page header ── */}
        <SectionHeading
          label="Execution Log"
          sub="Systems built, constraints conquered, optimizations shipped."
          isDark={isDark}
        />

        {/* ── SECTION 1: Flagship Systems ── */}
        <div style={{ marginBottom: "clamp(48px,7vw,80px)" }}>
          <div style={{ marginBottom: "clamp(24px,3.5vw,36px)" }}>
            <span style={{
              fontFamily: "'Courier New',monospace", fontSize: 9, fontWeight: 800,
              color: "#5cbdb9", letterSpacing: "0.32em", textTransform: "uppercase",
            }}>
              01 — The Flagship Systems
            </span>
          <header className="mb-20">                
            <h1 className="text-5xl lg:text-7xl font-black dark:text-white text-zinc-900 tracking-tighter mb-6 uppercase italic">
              Selected <br /> <span className="text-[#5cbdb9]">Architectures.</span>
            </h1>
            
            <p className="max-w-2xl text-zinc-500 dark:text-zinc-400 text-sm lg:text-base leading-relaxed font-medium">
              A documentation of high-throughput systems, distributed services, and enterprise logic. 
              Focused on relational integrity, event-driven patterns, and latency optimization.
            </p>
          </header>
          </div>

          {PROJECTS.map((project, i) => (
            <div key={project.id}>
              <FlagshipProject project={project} isDark={isDark} index={i} />
              {i < PROJECTS.length - 1 && (
                <AxisConnector isDark={isDark} label="plugging in next system" />
              )}
            </div>
          ))}
        </div>

        {/* ── SECTION 2: Production Lifecycle ── */}
        <AxisConnector isDark={isDark} label="entering production lifecycle" />

        <div style={{
          padding: "clamp(28px,4vw,48px)",
          border: `1px solid ${border}`,
          borderRadius: 8,
          background: isDark ? "#040404" : "#f8fffe",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Section label */}
          <div style={{ marginBottom: "clamp(24px,3.5vw,40px)" }}>
            <span style={{
              fontFamily: "'Courier New',monospace", fontSize: 9, fontWeight: 800,
              color: "#5cbdb9", letterSpacing: "0.32em", textTransform: "uppercase",
            }}>
              02 — The Production Lifecycle
            </span>
            <h2 style={{
              margin: "10px 0 6px",
              fontFamily: "'Courier New',monospace",
              fontSize: "clamp(20px,3vw,36px)",
              fontWeight: 900, color: textPri, letterSpacing: "-0.02em",
            }}>
              GitHub Beyond the Map
            </h2>
            <p style={{ margin: 0, fontFamily: "'Courier New',monospace", fontSize: "clamp(11px,1.2vw,13px)", color: muted, lineHeight: 1.75 }}>
              Workflow discipline. From first commit to live environment.
            </p>
          </div>

          <CICDPipeline isDark={isDark} />
          <BranchingStrategy isDark={isDark} />

          <GitHubSnake isDark={isDark} />

          {/* README link */}
          <div style={{
            padding: "18px 20px",
            background: isDark ? "#5cbdb910" : "#5cbdb914",
            border: `1px solid #5cbdb944`,
            borderLeft: "3px solid #5cbdb9",
            borderRadius: "0 5px 5px 0",
          }}>
            <span style={{ fontFamily: "'Courier New',monospace", fontSize: 9, color: muted, letterSpacing: "0.25em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
              // Documentation Quality
            </span>
            <p style={{ margin: "0 0 12px", fontFamily: "'Courier New',monospace", fontSize: "clamp(11px,1.2vw,13px)", color: text, lineHeight: 1.75 }}>
              Every project ships with structured documentation — API contracts, environment setup, and usage examples clearly defined.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {[
                { label: "$ cat README.md → Food System",  href: GITHUB_LINKS.food  + "/blob/main/README.md" },
                { label: "$ cat README.md → Qotes Server", href: GITHUB_LINKS.qotes + "/blob/main/README.md" },
              ].map(link => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: 4 }}
                  style={{
                    fontFamily: "'Courier New',monospace",
                    fontSize: "clamp(10px,1.1vw,12px)",
                    fontWeight: 700,
                    color: "#5cbdb9",
                    textDecoration: "underline",
                    textUnderlineOffset: 4,
                    letterSpacing: "0.04em",
                  }}
                >
                  {link.label} ↗
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer rule */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          style={{ marginTop: "clamp(40px,6vw,64px)", display: "flex", alignItems: "center", gap: 16 }}
        >
          <div style={{ flex: 1, height: 1, background: isDark ? "rgba(255,255,255,0.07)" : "rgba(10,100,90,0.18)" }} />
          <span style={{ fontSize: 9, color: muted, letterSpacing: "0.3em", textTransform: "uppercase" }}>
            Rajasekhar — Execution Log — {new Date().getFullYear()}
          </span>
          <div style={{ flex: 1, height: 1, background: isDark ? "rgba(255,255,255,0.07)" : "rgba(10,100,90,0.18)" }} />
        </motion.div>

      </div>

      {/* Mobile overrides */}
      <style>{`
        @media (max-width: 680px) {
          .flagship-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}