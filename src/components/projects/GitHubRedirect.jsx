import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

const GitHubRedirect = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const accent = isDark ? "#5cbdb9" : "#2a9e9a";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-24 mb-20 px-4 flex flex-col items-center"
    >
      <div className="relative group max-w-2xl w-full">
        {/* Decorative Corner Accents */}
        <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2" style={{ borderColor: accent }} />
        <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2" style={{ borderColor: accent }} />

        <div className={`p-8 lg:p-12 rounded-2xl border border-dashed flex flex-col items-center text-center transition-all duration-500
          ${isDark 
            ? "bg-zinc-900/20 border-zinc-800 hover:border-[#5cbdb9]/50" 
            : "bg-zinc-50/50 border-zinc-200 hover:border-[#2a9e9a]/50"
          }`}
        >
          <span className="font-mono text-[10px] tracking-[0.4em] uppercase mb-4" style={{ color: accent }}>
            // End_Of_Catalogue
          </span>
          
          <h2 className={`text-2xl lg:text-3xl font-black mb-6 tracking-tighter italic uppercase
            ${isDark ? "text-white" : "text-zinc-900"}`}
          >
            Looking for more <span style={{ color: accent }}>Experiments?</span>
          </h2>

          <p className="text-zinc-500 text-sm max-w-md mb-10 leading-relaxed font-medium">
            The projects above are selected architectures. My full laboratory of 
            30+ repositories, prototypes, lives on GitHub.
          </p>

          <motion.a
            href="https://github.com/kvnrajasekhar?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative px-8 py-4 font-mono text-xs font-bold tracking-widest uppercase overflow-hidden group/btn"
            style={{ 
              backgroundColor: isDark ? "#5cbdb9" : "#000000",
              color: isDark ? "#000000" : "#ffffff"
            }}
          >
            {/* Button Hover Glow Effect */}
            <motion.div 
              className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity"
              style={{ background: `linear-gradient(90deg, transparent, ${accent}33, transparent)` }}
            />
            
            <span className="relative z-10 flex items-center gap-3">
              Explore_Full_Archive 
              <span className="text-lg">→</span>
            </span>
          </motion.a>
          
          {/* System Status Line */}
          <div className="mt-8 font-mono text-[9px] text-zinc-400 opacity-50 flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
            REDIRECT_PROTOCOL_READY // PORT_443_SECURE
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GitHubRedirect;