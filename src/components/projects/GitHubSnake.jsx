import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

const GitHubSnake = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const darkSnake = "https://raw.githubusercontent.com/kvnrajasekhar/kvnrajasekhar/output/github-contribution-grid-snake-dark.svg";
  const lightSnake = "https://raw.githubusercontent.com/kvnrajasekhar/kvnrajasekhar/output/github-contribution-grid-snake.svg";

  const teal = isDark ? "#5cbdb9" : "#2a9e9a";
  const text = isDark ? "#ffffff" : "#0a1212";
  const muted = isDark ? "rgba(255,255,255,0.38)" : "rgba(10,18,18,0.42)";

  // Animation Variants to ensure they trigger
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-12 px-4">
      {/* ── SECTION HEADER ── */}
      <div style={{ marginBottom: "40px" }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, x: -20 },
            visible: { opacity: 1, x: 0 }
          }}
          transition={{ duration: 0.5 }}
          style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}
        >
          <div style={{ width: 28, height: 1.5, background: teal, borderRadius: 1 }} />
          <span style={{ fontFamily: "'Courier New',monospace", fontSize: 12, fontWeight: 800, letterSpacing: "0.35em", textTransform: "uppercase", color: teal }}>
            The GitHub Log
          </span>
        </motion.div>

        <motion.h1
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.65, delay: 0.1 }}
          style={{
            margin: 0,
            fontFamily: "'Courier New',monospace",
            fontSize: "clamp(28px, 5vw, 56px)",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            color: text,
          }}
        >
          Contribution to{" "}
          <span style={{
            display: "inline-block",
            padding: "2px 12px",
            borderRadius: "12px",
            backgroundColor: isDark ? "rgba(92, 189, 185, 0.1)" : "rgba(42, 158, 154, 0.1)",
            border: `1px solid ${isDark ? "rgba(92, 189, 185, 0.3)" : "rgba(42, 158, 154, 0.3)"}`,
            color: teal,
            fontSize: "0.7em",
            verticalAlign: "middle",
            marginLeft: "8px"
          }}>
            GitHub
          </span>
        </motion.h1>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.55, delay: 0.2 }}
          style={{
            margin: "14px 0 0",
            fontFamily: "'Courier New',monospace",
            fontSize: "clamp(11px, 1.2vw, 13px)",
            fontWeight: 600,
            color: muted,
            letterSpacing: "0.06em",
            maxWidth: 520,
            lineHeight: 1.6,
          }}
        >
          Visualizing deployment frequency and commit intensity.
          Automated logic tracking through the contribution grid.
        </motion.p>
      </div>

      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-[2px] bg-[#5cbdb9]" />
        <span className="font-mono text-[9px] font-black text-[#5cbdb9] tracking-[0.4em] uppercase">
          01 — Contribution Snake.exe
        </span>
      </div>

      {/* ── SNAKE DISPLAY CARD ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative group p-4 lg:p-6 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/30 backdrop-blur-md shadow-xl"
      >
        {/* Top Decoration: Console Header */}
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/40" />
          </div>
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-500">
            Contribution_Activity.exe
          </span>
        </div>

        {/* The Actual Snake Map */}
        <div className="relative overflow-hidden rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-black/40 p-2 sm:p-4">
          <img
            src={isDark ? darkSnake : lightSnake}
            alt="GitHub Snake"
            className="w-full h-auto object-contain"
            style={{
              contain: "layout", // Prevents the SVG from affecting the rest of the page layout
              aspectRatio: "820 / 150",
              minHeight: "150px"
            }}
          />
        </div>

        {/* Bottom Status Bar */}
        <div className="mt-4 flex items-center justify-between px-2 font-mono text-[9px] font-bold">
          <div className="flex items-center gap-2 text-[#5cbdb9]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5cbdb9] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5cbdb9]"></span>
            </span>
            LIVE_FEED_ACTIVE
          </div>
          <a
            href="https://github.com/kvnrajasekhar"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-[#5cbdb9] transition-colors"
          >
            SOURCE: GITHUB // kvnrajasekhar
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default GitHubSnake;