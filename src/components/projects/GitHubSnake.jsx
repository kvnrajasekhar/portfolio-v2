import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

const GitHubSnake = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // URLs from your specific repository output
  const darkSnake = "https://raw.githubusercontent.com/kvnrajasekhar/kvnrajasekhar/output/github-contribution-grid-snake-dark.svg";
  const lightSnake = "https://raw.githubusercontent.com/kvnrajasekhar/kvnrajasekhar/output/github-contribution-grid-snake.svg";

  return (
    <div className="w-full max-w-4xl mx-auto my-8">
      {/* Container with theme-aware borders and background */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative group p-4 lg:p-6 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/30 backdrop-blur-md shadow-xl"
      >
        {/* Top Decoration: Console Header */}
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/40" />
          </div>
          <span className="font-mono text-[6px] lg:text-10px] md:text-xs uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-500">
            Contribution_Activity.exe
          </span>
        </div>

        {/* The Actual Snake Map */}
        <div className="relative overflow-hidden rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-black/40 p-2 sm:p-4">
          <img 
            src={isDark ? darkSnake : lightSnake} 
            alt="GitHub Contribution Snake Animation"
            className="w-full h-auto object-contain transition-opacity duration-500"
            style={{ minHeight: "150px" }}
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
            SOURCE: GITHUB // KVNR_01
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default GitHubSnake;