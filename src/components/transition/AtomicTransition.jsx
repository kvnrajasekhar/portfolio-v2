    import { motion } from "framer-motion";

    const AtomicTransition = ({ children }) => {
        // 1. The Shutter: A high-speed accent bar that clears the old page
        const shutterVariants = {
            initial: { x: "-100%", skewX: "-20deg" },
            animate: {
                x: "100%",
                skewX: "0deg",
                transition: {
                    duration: 0.8,
                    ease: [0.87, 0, 0.13, 1], // Custom exponential ease
                }
            },
            exit: {
                x: "-100%",
                skewX: "20deg",
                transition: {
                    duration: 0.6,
                    ease: [0.76, 0, 0.24, 1]
                }
            },
        };

        // 2. The Content: Scales in slightly after the shutter passes
        const contentVariants = {
            initial: { opacity: 0, scale: 0.98, filter: "blur(4px)" },
            animate: {
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
                transition: {
                    duration: 0.5,
                    delay: 0.4, // Wait for shutter to reach midpoint
                    ease: "easeOut"
                }
            },
            exit: {
                opacity: 0,
                scale: 1.02,
                filter: "blur(4px)",
                transition: { duration: 0.4, ease: "easeIn" }
            },
        };

        return (
            <div className="relative w-full min-h-screen overflow-hidden">
                {/* The Liquid Shutter Layer */}
                <motion.div
                    variants={shutterVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="fixed inset-0 z-[100] pointer-events-none bg-[#5cbdb9] dark:bg-[#fbe3e8]"
                    style={{ willChange: "transform" }}
                />

                {/* The Content Layer */}
                <motion.div
                    variants={contentVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="relative z-10 w-full"
                >
                    {children}
                </motion.div>

                {/* Background Overlay to prevent layout flashing */}
                <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="fixed inset-0 z-[100] bg-white dark:bg-[#000000] pointer-events-none"
                />
            </div>
        );
    };

    export default AtomicTransition;