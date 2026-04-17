import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const BAR_COUNT = 8; // number of vertical bars
const COLORS_DARK  = ["#5cbdb9", "#c9b8f5", "#fbe3e8", "#f7c4a0", "#a8d8b9", "#5cbdb9", "#c9b8f5", "#fbe3e8"];
const COLORS_LIGHT = ["#2a9e9a", "#6040c0", "#c04070", "#c07030", "#3a9e6a", "#2a9e9a", "#6040c0", "#c04070"];

// Each bar: odd bars come FROM TOP, even bars come FROM BOTTOM
// They close (fill screen) then open (retract) to reveal new route

export default function PageTransition({ children, isDark }) {
  const location = useLocation();
  const colors   = isDark ? COLORS_DARK : COLORS_LIGHT;

  // ── Bar animation variants ────────────────────────────────────────────────
  // Phase 1 — CLOSE: bars enter from top/bottom and meet in the center
  // Phase 2 — OPEN:  bars retract back out to top/bottom

  const barVariants = (fromTop) => ({
    initial: {
      scaleY: 0,
      // top bars anchor at top, bottom bars anchor at bottom
      originY: fromTop ? 0 : 1,
    },
    close: {
      scaleY: 1,
      transition: {
        duration: 0.38,
        ease: [0.76, 0, 0.24, 1],
      },
    },
    open: {
      scaleY: 0,
      originY: fromTop ? 0 : 1,
      transition: {
        duration: 0.38,
        ease: [0.76, 0, 0.24, 1],
        delay: 0.08, // small hold after close completes
      },
    },
  });

  // ── Page content variants ─────────────────────────────────────────────────
  const pageVariants = {
    hidden:  { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.22, delay: 0.52 }, // appears after bars retract
    },
    exit:    { opacity: 0, transition: { duration: 0.1 } },
  };

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          variants={pageVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {/* ── TRANSITION OVERLAY ── */}
      <AnimatePresence>
        <motion.div
          key={`bars-${location.pathname}`}
          initial="initial"
          animate={["close", "open"]}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9998,
            pointerEvents: "none",
            display: "flex",
          }}
        >
          {Array.from({ length: BAR_COUNT }).map((_, i) => {
            const fromTop = i % 2 === 0;
            const color   = colors[i % colors.length];
            const delay   = i * 0.028; // stagger across bars

            return (
              <motion.div
                key={i}
                style={{
                  flex: 1,
                  height: "100vh",
                  background: color,
                  transformOrigin: fromTop ? "top center" : "bottom center",
                  scaleY: 0,
                  opacity: 0.92,
                }}
                variants={{
                  initial: {
                    scaleY: 0,
                  },
                  close: {
                    scaleY: 1,
                    transition: {
                      duration: 0.36,
                      delay: delay,
                      ease: [0.76, 0, 0.24, 1],
                    },
                  },
                  open: {
                    scaleY: 0,
                    transition: {
                      duration: 0.36,
                      delay: 0.32 + delay, // hold for 0.32s then retract
                      ease: [0.76, 0, 0.24, 1],
                    },
                  },
                }}
              />
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}