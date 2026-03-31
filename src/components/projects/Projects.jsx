import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import AtomicTransition from "../transition/AtomicTransition";

// ── DATA CONSTANTS (KEEPING ALL YOUR SPECS) ──────────────────────────────────
const GITHUB_LINKS = {
  food: "https://github.com/kvnrajasekhar/food-ordering-system",
  qotes: "https://github.com/kvnrajasekhar/qotes-server",
};

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
    constraint: {
      challenge: "Role-Based State Management",
      detail: "Ensuring a Customer can only view and order while a Restaurant Admin can modify live menus and update order statuses.",
      solution: "Implemented Service-Oriented Logic where every request is validated against the user's session role.",
    },
    optimization: {
      title: "Relational Integrity at Scale",
      before: "Cascading deletes broke historical order logs",
      after: "Schema redesign preserves all historical data on menu item removal",
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
    constraint: {
      challenge: "The Viral Traffic Bottleneck",
      detail: "Handling a surge of read requests for popular content without overwhelming the primary MongoDB instance.",
      solution: "Implemented a Cache-Aside Strategy with Redis — serving high-frequency data from memory.",
    },
    optimization: {
      title: "Latency Elimination",
      before: "Direct DB reads: ~280ms avg response",
      after: "Redis cache-aside: <45ms avg response",
      metric: "~84% latency reduction on hot content",
    },
    stateFlow: ["POST /create", "Kafka Emit", "Cache Warm", "DB Persist", "Client ACK"],
  },
];

const CICD_STEPS = [
  { icon: "⬆", label: "git push", sub: "Feature Branch", color: "#5cbdb9" },
  { icon: "🧪", label: "Unit Tests", sub: "JUnit / Jest", color: "#c9b8f5" },
  { icon: "🚀", label: "Deploy", sub: "Vercel / Render", color: "#fbe3e8" },
];

// ── COMPONENT: System Core Visual ──────────────────────────────────────────
function SystemCore({ project, isDark }) {
  const accent = project.color;
  return (
    <div className="relative w-full aspect-square flex items-center justify-center bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 p-4">
      {/* Central Pulsing Node */}
      <motion.div
        animate={{ 
          scale: [1, 1.05, 1],
          boxShadow: isDark ? [`0 0 20px ${accent}22`, `0 0 40px ${accent}44`, `0 0 20px ${accent}22`] : [`0 0 10px ${accent}11`, `0 0 20px ${accent}22`, `0 0 10px ${accent}11`] 
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="w-32 h-32 rounded-3xl border-2 flex flex-col items-center justify-center bg-white dark:bg-black"
        style={{ borderColor: accent }}
      >
        <span className="text-4xl font-black" style={{ color: accent }}>{project.id[0].toUpperCase()}</span>
        <span className="text-[8px] font-mono mt-2 tracking-widest opacity-50 uppercase">{project.id}_CORE</span>
      </motion.div>

      {/* Orbiting Tech Particles */}
      {project.stack.slice(0, 4).map((tech, i) => (
        <motion.div
          key={tech}
          animate={{ rotate: 360 }}
          transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "linear" }}
          className="absolute w-full h-full pointer-events-none"
        >
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 py-1 rounded-md text-[8px] font-bold border whitespace-nowrap bg-white dark:bg-zinc-900"
            style={{ color: accent, borderColor: `${accent}44` }}
          >
            {tech}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ── COMPONENT: Flagship Project Card ────────────────────────────────────────
function FlagshipProject({ project, isDark, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const color = project.color;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      className="flex flex-col lg:flex-row w-full mb-16 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] overflow-hidden bg-white dark:bg-[#080808] shadow-xl dark:shadow-2xl"
    >
      {/* Left: Visual Panel */}
      <div className="w-full lg:w-[42%] p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-4 mb-8">
          <span className="font-mono text-[10px] font-bold px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-900 uppercase tracking-tighter" style={{ color }}>
            {project.systemId}
          </span>
          <div className="h-[1px] flex-1 bg-zinc-100 dark:bg-zinc-900" />
        </div>
        
        <h2 className="text-3xl font-black mb-8 tracking-tighter dark:text-white text-zinc-900 uppercase italic">
          {project.codename}
        </h2>

        <SystemCore project={project} isDark={isDark} />

        <div className="mt-8 flex flex-wrap gap-2">
          {project.stack.map(s => (
            <span key={s} className="text-[9px] font-bold border px-2 py-1 rounded uppercase tracking-widest" style={{ color: color, borderColor: `${color}33`, backgroundColor: `${color}05` }}>
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Right: Specs Panel */}
      <div className="w-full lg:w-[58%] p-8 lg:p-12 flex flex-col justify-between bg-zinc-50/30 dark:bg-transparent">
        <div className="space-y-10">
          <section>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-3">// 01_IDENTITY</h3>
            <p className="text-2xl font-black dark:text-zinc-100 text-zinc-900 leading-tight mb-2">{project.identity}</p>
            <p className="text-sm italic text-zinc-500 font-mono">"{project.philosophy}"</p>
          </section>

          <section className="p-6 rounded-2xl border-l-4 bg-white dark:bg-zinc-900 shadow-sm" style={{ borderColor: color }}>
            <h4 className="text-[9px] font-bold uppercase text-zinc-400 mb-3 tracking-widest">Engineering Challenge</h4>
            <p className="font-bold dark:text-white text-zinc-900 mb-2 text-sm">⚠ {project.constraint.challenge}</p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3">{project.constraint.detail}</p>
            <p className="text-xs font-bold font-mono" style={{ color }}>✓ {project.constraint.solution}</p>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-red-100 dark:border-red-900/20 bg-red-50/30 dark:bg-red-900/5">
              <span className="text-[8px] font-bold text-red-500 uppercase tracking-widest">Legacy/Before</span>
              <p className="text-[11px] text-zinc-500 mt-1 font-medium">{project.optimization.before}</p>
            </div>
            <div className="p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/20 bg-emerald-50/30 dark:bg-emerald-900/5">
              <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">Optimized/After</span>
              <p className="text-[11px] text-zinc-500 mt-1 font-medium">{project.optimization.after}</p>
            </div>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <motion.a 
            href={GITHUB_LINKS[project.id]}
            target="_blank"
            whileHover={{ x: 5 }}
            className="inline-flex items-center gap-3 font-mono text-[11px] font-bold"
            style={{ color }}
          >
            <span>$ {project.terminalPath}</span>
            <span className="w-2 h-4 bg-current animate-pulse" />
          </motion.a>
          <span className="text-[10px] font-bold text-zinc-400 font-mono">{project.optimization.metric}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ── MAIN PAGE: ProjectsPage ────────────────────────────────────────────────
export default function ProjectsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <AtomicTransition>
      <section className="relative w-full min-h-screen pt-32 pb-20 px-6 lg:px-12 bg-white dark:bg-black transition-colors duration-500">
        
        {/* Engineering Blueprint Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]" 
          style={{ 
            backgroundImage: `radial-gradient(${isDark ? '#fff' : '#5cbdb9'} 1px, transparent 0)`,
            backgroundSize: '40px 40px' 
          }} 
        />

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Header Section */}
          <header className="mb-20">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="w-12 h-[2px] bg-[#5cbdb9]" />
              <span className="font-mono text-xs font-black text-[#5cbdb9] tracking-[0.4em] uppercase">System Execution Log</span>
            </motion.div>
            
            <h1 className="text-5xl lg:text-7xl font-black dark:text-white text-zinc-900 tracking-tighter mb-6 uppercase italic">
              Selected <br /> <span className="text-[#5cbdb9]">Architectures.</span>
            </h1>
            
            <p className="max-w-2xl text-zinc-500 dark:text-zinc-400 text-sm lg:text-base leading-relaxed font-medium">
              A documentation of high-throughput systems, distributed services, and enterprise logic. 
              Focused on relational integrity, event-driven patterns, and latency optimization.
            </p>
          </header>

          {/* Projects List */}
          <div className="space-y-12">
            {PROJECTS.map((project, i) => (
              <FlagshipProject key={project.id} project={project} isDark={isDark} index={i} />
            ))}
          </div>

          {/* CI/CD Mini Section */}
          <footer className="mt-32 pt-20 border-t border-zinc-200 dark:border-zinc-800">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
              <div>
                <h3 className="font-mono text-[10px] font-black text-zinc-400 tracking-widest uppercase mb-4">// Deployment_Workflow</h3>
                <p className="text-xs text-zinc-500 leading-loose">
                  Every system listed follows a strict CI/CD pipeline involving automated unit testing, linting, and multi-stage deployment.
                </p>
              </div>
              
              <div className="lg:col-span-2 flex justify-between items-center gap-4">
                {CICD_STEPS.map((step) => (
                  <div key={step.label} className="flex flex-col items-center gap-2 group">
                    <div className="w-12 h-12 rounded-full border-2 flex items-center justify-center text-lg transition-all group-hover:scale-110" 
                      style={{ borderColor: step.color, color: step.color, backgroundColor: `${step.color}10` }}>
                      {step.icon}
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-tighter text-zinc-400">{step.label}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-20 text-center">
              <span className="font-mono text-[9px] text-zinc-400 tracking-[0.5em] uppercase">
                Rajasekhar — {new Date().getFullYear()} — End of Log
              </span>
            </div>
          </footer>

        </div>
      </section>
    </AtomicTransition>
  );
}