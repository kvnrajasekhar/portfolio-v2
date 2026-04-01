import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

const GitHubStats = () => {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const username = "kvnrajasekhar";

    // Use 'monokai' for dark and 'default' for light to match your site's palette
    const cardTheme = isDark ? "monokai" : "default";

    // Mapping for the different summary cards
    const statsCards = [
        { id: "profile", url: `https://github-profile-summary-cards.vercel.app/api/cards/profile-details?username=${username}&theme=${cardTheme}` },
        { id: "stats", url: `https://github-profile-summary-cards.vercel.app/api/cards/stats?username=${username}&theme=${cardTheme}` },
        { id: "languages", url: `https://github-profile-summary-cards.vercel.app/api/cards/most-commit-language?username=${username}&theme=${cardTheme}` },
        { id: "time", url: `https://github-profile-summary-cards.vercel.app/api/cards/productive-time?username=${username}&theme=${cardTheme}` },
    ];

    return (
        <div className="w-full max-w-4xl mx-auto my-12 px-4 space-y-6">
            {/* ── Section Header ── */}
            <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-[2px] bg-[#5cbdb9]" />
                <span className="font-mono text-[9px] font-black text-[#5cbdb9] tracking-[0.4em] uppercase">
                    02 — System Telemetry (GitHub)
                </span>
            </div>

            {/* ── Activity Graph (Full Width) ── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="p-6 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-[#080808]"
                style={{ contain: "paint" }} // Isolates the rendering of this component for better performance
            >
                <h3 className="font-mono text-[10px] text-zinc-400 mb-6 uppercase tracking-widest">// Activity_Graph.sys</h3>
                <div className="overflow-hidden rounded-xl border border-zinc-100 dark:border-zinc-900 bg-white dark:bg-black p-4">
                    <img
                        src={`https://github-readme-activity-graph.vercel.app/graph?username=${username}&bg_color=${isDark ? '000000' : 'ffffff'}&color=${isDark ? '5cbdb9' : '2a9e9a'}&line=EB1484&point=C29AEB&area=true&hide_border=true`}
                        alt="Activity Graph"
                        className="w-full h-auto object-contain"
                    />
                </div>
            </motion.div>

            {/* ── Summary Grid (2x2 on Desktop) ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {statsCards.map((card, index) => (
                    <motion.div
                        key={card.id}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, amount: 0.1 }}
                        // Force a GPU layer to prevent lag
                        style={{ willChange: "transform, opacity" }}
                        className="..."
                    >
                        {/* LOCK THE BOX: Set a min-height and aspect-ratio so the footer doesn't jump */}
                        <div style={{
                            minHeight: "185px",
                            width: "100%",
                            aspectRatio: "495 / 195", // Aspect ratio of GitHub Summary cards
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden"
                        }}>
                            <img
                                src={card.url}
                                loading="lazy"
                                alt="GitHub Stat"
                                className="w-full h-auto object-contain"
                                // Prevent the image from "popping" by keeping it in layout
                                style={{ display: "block" }}
                            />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default GitHubStats;