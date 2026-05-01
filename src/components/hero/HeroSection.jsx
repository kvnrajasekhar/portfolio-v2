import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiMapPin, FiLayers } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import GlowingName from "./GlowingName";

const HeroSection = () => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <>
      <style>{`
        .hero-section {
          height: 100vh;
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          position: relative;
          text-align: center;
          overflow: hidden;
        }
        
        /* Desktop */
        @media (min-width: 1024px) {
          .hero-section {
            padding-top: 168px;
          }
        }
        
        /* Tablet */
        @media (min-width: 768px) and (max-width: 1023px) {
          .hero-section {
            padding-top: 318px;
          }
        }
        
        /* Large Mobile */
        @media (min-width: 641px) and (max-width: 767px) {
          .hero-section {
            padding-top: 542px;
          }
        }
        
        /* Medium Mobile (376px - 431px) */
        @media (min-width: 376px) and (max-width: 431px) {
          .hero-section {
            padding-top: 250px;
          }
        }
        
        /* Small Mobile (≤376px) */
        @media (max-width: 376px) {
          .hero-section {
            padding-top: 184px;
          }
        }
        

        /* Bottom Row */
        .bottom-row {
          position: absolute;
          bottom: 48px;
        }
        
        /* Desktop */
        @media (min-width: 1024px) {
          .bottom-row {
            bottom: 68px;
          }
          .scroll-indicator{
            bottom: 22px;
          }
        }
        
        /* Tablet */
        @media (min-width: 768px) and (max-width: 1023px) {
          .bottom-row {
            bottom: 112px;
          }
          .scroll-indicator{
            bottom: 62px;
          }
        }
        
        /* Large Mobile */
        @media (min-width: 641px) and (max-width: 767px) {
          .bottom-row {
            bottom: 210px;
          }
          .scroll-indicator{
            bottom: 82px;
          }
        }
        
        /* Medium Mobile (376px - 430px) */
        @media (min-width: 376px) and (max-width: 431px) {
          .bottom-row {
            bottom: 158px;
          }
          .scroll-indicator{
            bottom: 84px;
          }
        }
        
        /* Small Mobile (≤376px) */
        @media (max-width: 376px) {
          .bottom-row {
            bottom: 88px;
          }
          .scroll-indicator{
            bottom: 22px;
          }
        }
        
        /* Scroll Indicator */
        .scroll-indicator {
          position: absolute;
        }
        
        /* Desktop */
        @media (min-width: 1024px) {
          .scroll-indicator {
            bottom: 22px;
          }
        }
        
        @keyframes mouse-scroll {
          0%   { transform: translateY(0); opacity: 0.2; }
          20%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateY(18px); opacity: 0; }
        }
        
        .mouse-wheel-animation {
          animation: mouse-scroll 2s cubic-bezier(0.19, 1, 0.22, 1) infinite;
        }
        
      `}</style>
      <section className="hero-section">

        {/* Cursor Glow
        <div
          className="pointer-events-none fixed w-[500px] h-[500px] rounded-full blur-3xl opacity-20 bg-[#fbe3e8] dark:bg-[#5cbdb9]"
          style={{
            left: mouse.x - 250,
            top: mouse.y - 250,
          }}
        /> */}

        {/* Floating Background */}
        {/* <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-[#5cbdb9] dark:bg-[#fbe3e8] opacity-20 blur-[150px] rounded-full animate-pulse"></div>

        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#fbe3e8] dark:bg-[#5cbdb9] opacity-20 blur-[150px] rounded-full animate-pulse"></div> */}

        {/* MAIN CONTENT */}
        <div className="flex flex-col items-center gap-6 z-10 center-section">

          {/* Name */}
          <GlowingName />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="uppercase tracking-[0.4em] text-sm text-gray-600 dark:text-gray-400"
          >
            Always chasing the next breakthrough
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-4xl font-oleo text-[#5cbdb9] dark:text-[#fbe3e8] max-w-2xl drop-shadow-[0_0_0.3px_rgba(0,0,0,1)] dark:drop-shadow-[0_0_0.3px_white]"
          >
            learning, building, evolving.
          </motion.p>
        </div>

        {/* Bottom Row */}
        <div className="bottom-row w-full flex justify-between px-8 text-sm z-10">

          <div className="flex flex-col items-center gap-1">
            <FiMapPin className="text-[#5cbdb9]" />
            <p className="font-semibold uppercase">Hyderabad</p>
            <p className="text-gray-400 uppercase text-xs">
              <span className="text-orange-400 font-bold">I</span>
              <span className="text-orange-400 font-bold">N</span>
              <span className="dark:text-white font-bold">D</span>
              <span className="text-green-400 font-bold">I</span>
              <span className="text-green-400 font-bold">A</span>
            </p>
          </div>

          <div className="flex flex-col items-center gap-1">
            <FiLayers className="text-[#5cbdb9]" />
            <p className="font-semibold uppercase">Software Engineer</p>
            <p className="text-black-400 dark:text-white uppercase text-xs">
              Full Stack Dev
            </p>
          </div>

        </div>

        {/* Scroll Indicator */}
        <div className="scroll-indicator flex flex-col items-center gap-3">
          {/* The Mouse Body */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-20 flex flex-col items-center"
            style={{ position: "relative" }}
          >
            {/* The Wire */}
            <div
              style={{
                width: 2,
                height: 40,
                background: `linear-gradient(to top, ${isDark ? "rgba(251,227,232,0.3)" : "rgba(42,158,154,0.4)"}, transparent)`,
                marginBottom: -2
              }}
            />

            {/* Mouse Body */}
            <div
              style={{
                width: 26,
                height: 44,
                borderRadius: 14,
                border: `3px solid ${isDark ? "rgba(251,227,232,0.3)" : "rgba(42,158,154,0.4)"}`,
                position: "relative",
                display: "flex",
                justifyContent: "center",
                paddingTop: 8,
                overflow: "hidden"
              }}
            >
              {/* CSS-Powered Scroll Wheel */}
              <div
                className="mouse-wheel-animation"
                style={{
                  width: 3,
                  height: 8,
                  borderRadius: 2,
                  backgroundColor: isDark ? "#fbe3e8" : "#2a9e9a",
                  boxShadow: isDark ? "0 0 10px #fbe3e8" : "none",
                }}
              />
            </div>

            {/* Status Text */}
            <div
              style={{
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: isDark ? "#fbe3e8" : "#2a9e9a",
                fontFamily: "'Courier New', monospace",
                marginTop: 16,
                display: "flex",
                alignItems: "center",
                gap: 6
              }}
            >
              <span>Scroll</span>
            </div>
          </motion.div>

        </div>

      </section>
    </>
  );
};

export default HeroSection;