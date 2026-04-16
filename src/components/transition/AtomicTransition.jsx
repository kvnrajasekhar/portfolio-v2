import { motion } from "framer-motion";

const AtomicTransition = ({ children }) => {
  // 1. Shutter Variants: The vertical blades that wipe the screen
  const bladeVariants = {
    initial: { scaleX: 0 },
    animate: { 
      scaleX: 0,
      transition: { duration: 0.6, ease: [0.83, 0, 0.17, 1] } 
    },
    exit: { 
      scaleX: 1,
      transition: { 
        duration: 0.5, 
        ease: [0.83, 0, 0.17, 1] 
      } 
    },
  };

  // 2. Content Variants: Gentle slide and fade to match the "Stream" direction
  const contentVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.5, delay: 0.4, ease: "easeOut" } 
    },
    exit: { 
      opacity: 0, 
      x: -20, 
      transition: { duration: 0.4, ease: "easeIn" } 
    },
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-white dark:bg-[#000000]">
      {/* Blade 1: High Contrast Accent */}
      <motion.div
        variants={bladeVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ delay: 0 }}
        className="fixed inset-0 z-[110] origin-left pointer-events-none bg-[#5cbdb9] opacity-30"
      />

      {/* Blade 2: Muted Complementary */}
      <motion.div
        variants={bladeVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ delay: 0.1 }}
        className="fixed inset-0 z-[120] origin-left pointer-events-none bg-[#c9b8f5] opacity-60"
      />

      {/* Blade 3: Main System Block (Solid) */}
      <motion.div
        variants={bladeVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ delay: 0.2 }}
        className="fixed inset-0 z-[130] origin-left pointer-events-none bg-[#5cbdb9] dark:bg-[#fbe3e8]"
      >
        {/* Terminal Text Overlay (Visible only during wipe) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] font-mono font-black tracking-[0.5em] text-black/40 uppercase">
            Buffering_Data_Block...
          </span>
        </div>
      </motion.div>

      {/* Content Layer */}
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