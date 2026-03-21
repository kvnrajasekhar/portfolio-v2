import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiMapPin, FiLayers } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import GlowingName from "./GlowingNamw";

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
    <section className="h-screen w-full flex flex-col justify-center items-center relative px-8 text-center overflow-hidden">

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
      <div className="flex flex-col items-center gap-6 z-10">

        {/* Name */}
        <GlowingName />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="uppercase tracking-[0.4em] text-sm text-gray-600 dark:text-gray-400"
        >
          Passionate about doing new things
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-4xl font-oleo text-[#5cbdb9] dark:text-[#fbe3e8] max-w-2xl drop-shadow-[0_0_0.3px_rgba(0,0,0,1)] dark:drop-shadow-[0_0_0.3px_white]"
        >
          learning new technologies.
        </motion.p>
      </div>

      {/* Bottom Row */}
      <div className="absolute bottom-16 w-full flex justify-between px-8 text-sm z-10">

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
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="absolute bottom-6 w-[2px] h-8 bg-[#5cbdb9] dark:bg-[#fbe3e8]"
      />

    </section>
  );
};

export default HeroSection;