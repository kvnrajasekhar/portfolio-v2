// AtomicTransition.jsx
import { motion } from "framer-motion";

// ── How many bars to render ──────────────────────────────────────────────────
const BAR_COUNT = 7;

// ── Each bar alternates: odd bars drop FROM TOP, even bars rise FROM BOTTOM ──
// This creates the "jaw closing / opening" effect
const makeBarVariants = (fromTop, index) => ({
  // Page ENTERING  → bars are already retracted (off-screen), page is visible
  initial: {
    y: fromTop ? "-100%" : "100%",
    scaleY: 1,
  },
  // Settled state  → bars retract back off-screen → content revealed
  animate: {
    y: fromTop ? "-100%" : "100%",
    transition: {
      duration: 0.55,
      delay: (BAR_COUNT - 1 - index) * 0.04,   // reverse stagger on reveal
      ease: [0.76, 0, 0.24, 1],
    },
  },
  // Page EXITING   → bars slam IN to cover screen (staggered)
  exit: {
    y: "0%",
    transition: {
      duration: 0.42,
      delay: index * 0.045,                      // forward stagger on cover
      ease: [0.76, 0, 0.24, 1],
    },
  },
});

// ── Content fade ─────────────────────────────────────────────────────────────
const contentVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.35, delay: 0.52, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.18, ease: "easeIn" },
  },
};

// ── Color sequence for the bars ──────────────────────────────────────────────
// Alternates teal / lavender / blush to match your palette
const BAR_COLORS = [
  "#5cbdb9",   // teal
  "#c9b8f5",
  "#5cbdb9",   // teal
  "#c9b8f5",
  "#5cbdb9",   // teal
  "#c9b8f5",
  "#5cbdb9",   // teal
  // "#c9b8f5",   // lavender
  // "#fbe3e8",   // blush
  // "#5cbdb9",
  // "#c9b8f5",
  // "#fbe3e8",
  // "#5cbdb9",
];

const AtomicTransition = ({ children }) => {
  return (
    // ⚠️  Keep `overflow-hidden` OFF the outer wrapper — the bars are `fixed`
    // so they sit above everything regardless.
    <div className="relative w-full min-h-screen bg-white dark:bg-black">

      {/* ── VERTICAL BARS ─────────────────────────────────────────────────── */}
      {Array.from({ length: BAR_COUNT }).map((_, i) => {
        const fromTop = i % 2 === 0;   // alternating direction
        const widthPct = `${100 / BAR_COUNT}%`;

        return (
          <motion.div
            key={i}
            variants={makeBarVariants(fromTop, i)}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{
              position: "fixed",
              top: fromTop ? 0 : "auto",
              bottom: fromTop ? "auto" : 0,
              left: `${(i / BAR_COUNT) * 100}%`,
              width: widthPct,
              // Tall enough to cover viewport from either end
              height: "102vh",
              background: BAR_COLORS[i % BAR_COLORS.length],
              zIndex: 9999,
              pointerEvents: "none",
              // Remove any gap between bars
              borderRadius: 0,
            }}
          />
        );
      })}

      {/* ── LABEL shown while bars are covering the screen ────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0 }}          // never visible on enter
        exit={{
          opacity: [0, 1, 1, 0],          // fades in then out during exit
          transition: { duration: 0.42, times: [0, 0.3, 0.7, 1] },
        }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 10000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <span style={{
          fontFamily: "'Courier New', monospace",
          fontSize: "clamp(9px,1vw,11px)",
          fontWeight: 800,
          letterSpacing: "0.45em",
          textTransform: "uppercase",
          color: "rgba(0,0,0,0.35)",
        }}>
          Loading_Next_Module...
        </span>
      </motion.div>

      {/* ── CONTENT ───────────────────────────────────────────────────────── */}
      <motion.div
        variants={contentVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="relative z-10"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default AtomicTransition;