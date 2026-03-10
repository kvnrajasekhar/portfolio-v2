import React from "react";
import { FiMapPin, FiLayers } from "react-icons/fi";

const HeroSection = () => {
  return (
    <section className="h-screen w-full flex flex-col justify-center items-center relative px-8 text-center">
      
      {/* MAIN TEXT */}
      <div className="flex flex-col items-center gap-6">
        
        {/* Name */}
        <h1 className="text-[12vw] leading-none font-extrabold tracking-tight">
          Rajasekhar
        </h1>

        {/* Small line */}
        <p className="uppercase tracking-[0.4em] text-sm text-gray-400">
          Passionate about doing new things
        </p>

        {/* Tagline */}
        <p className="text-4xl font-oleo text-gray-500 max-w-2xl">
          learning new technologies.
        </p>

      </div>

      {/* BOTTOM ROW */}
      <div className="absolute bottom-12 w-full flex justify-between px-8 text-sm">

        {/* Location */}
        <div className="flex flex-col items-center gap-1">
          <FiMapPin className="text-green-400 text-lg" />
          <p className="font-semibold uppercase">Hyderabad,</p>
          <p className="text-gray-400 uppercase text-xs">
            <span className="text-orange-400 font-bold">I</span>
            <span className="text-orange-400 font-bold">N</span>
            <span className="dark:text-white font-bold">D</span>
            <span className="text-green-400 font-bold">I</span>
            <span className="text-green-400 font-bold">A</span>
            </p>
        </div>

        {/* Role */}
        <div className="flex flex-col items-center gap-1">
          <FiLayers className="text-blue-400 text-lg center" />
          <p className="font-semibold uppercase">Software Engineer</p>
          <p className="text-black-400 dark:text-gray-500 uppercase text-xs ">
            Full Stack Dev
          </p>
        </div>

      </div>

    </section>
  );
};

export default HeroSection;