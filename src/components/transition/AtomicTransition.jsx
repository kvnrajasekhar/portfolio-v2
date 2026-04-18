import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

const AtomicTransition = ({ children }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Theme-aware smoke color
  // Dark mode  → soft blush/pink  (#fbe3e8) — warm against black
  // Light mode → teal             (#5cbdb9) — your primary on white
  const smokeColor = isDark ? "#000" : "#fff";

  // ── Smoke overlay variants ───────────────────────────────────────────────
  // On EXIT  : opacity ramps up (smoke fills screen) then we're done
  // On ENTER : overlay starts opaque then dissolves away
  const smokeVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 0,
      transition: { duration: 0.01 }, // instantly transparent on mount
    },
    exit: {
      opacity: [0, 0.18, 0.55, 0.85, 1],
      transition: {
        duration: 0.55,
        ease: "easeInOut",
        times: [0, 0.2, 0.5, 0.75, 1],
      },
    },
  };

  // ── Reveal overlay: covers screen then dissolves ─────────────────────────
  // Sits on top during the enter phase and fades out to reveal content
  const revealVariants = {
    initial: { opacity: 1 },   // starts covering the page
    animate: {
      opacity: 0,
      transition: {
        duration: 0.65,
        delay: 0.05,
        ease: [0.45, 0, 0.55, 1],
      },
    },
    exit: { opacity: 0, transition: { duration: 0.01 } },
  };

  // ── Content layer ────────────────────────────────────────────────────────
  const contentVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { duration: 0.42, delay: 0.38, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.22, ease: "easeIn" },
    },
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        background: isDark ? "#000000" : "#ffffff",
      }}
    >

      {/* ── EXIT smoke: rises from bottom-left corner when leaving a page ── */}
      <motion.div
        variants={smokeVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 9998,
          pointerEvents: "none",
          background: smokeColor,
          // Diagonal smoke gradient from bottom-left corner
          backgroundImage: `
            radial-gradient(ellipse 300% 200% at 0% 100%,
              ${smokeColor}00 0%,
              ${smokeColor}22 25%,
              ${smokeColor}55 50%,
              ${smokeColor}88 75%,
              ${smokeColor}ff 100%
            ),
            radial-gradient(ellipse 250% 150% at -10% 110%,
              ${smokeColor}00 0%,
              ${smokeColor}18 30%,
              ${smokeColor}44 60%,
              ${smokeColor}77 90%,
              ${smokeColor}ff 100%
            )
          `,
          // Blur for organic smoke effect
          filter: "blur(20px)",
          // Origin from bottom-left
          transformOrigin: "bottom left",
        }}
      />

      {/* ── ENTER reveal: smoke from bottom-left corner, dissolves on page load ── */}
      <motion.div
        variants={revealVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 9997,
          pointerEvents: "none",
          background: smokeColor,
          // Diagonal smoke gradient from bottom-left corner (same as exit)
          backgroundImage: `
            radial-gradient(ellipse 300% 200% at 0% 100%,
              ${smokeColor}00 0%,
              ${smokeColor}22 25%,
              ${smokeColor}55 50%,
              ${smokeColor}88 75%,
              ${smokeColor}ff 100%
            ),
            radial-gradient(ellipse 250% 150% at -10% 110%,
              ${smokeColor}00 0%,
              ${smokeColor}18 30%,
              ${smokeColor}44 60%,
              ${smokeColor}77 90%,
              ${smokeColor}ff 100%
            )
          `,
          filter: "blur(20px)",
          transformOrigin: "bottom left",
        }}
      />

      {/* ── CONTENT ── */}
      <motion.div
        variants={contentVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ position: "relative", zIndex: 10 }}
      >
        {children}
      </motion.div>

    </div>
  );
};

export default AtomicTransition;