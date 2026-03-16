import { useTheme } from "../context/ThemeContext";

const ribbonWords = [
  "DEPENDABLE",
  "CAPTIVATING",
  "USER-FRIENDLY",
  "ADAPTIVE",
  "FLUID",
  "FUTURE-PROOF",
  "SECURE",
  "SCALABLE",
];

// Build a long repeated string for seamless looping
const buildTrack = (words, repeat = 6) =>
  Array(repeat)
    .fill(words)
    .flat()
    .map((w) => [w, "✦"])
    .flat();

const track = buildTrack(ribbonWords);

export default function RibbonBanners() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <>
      <style>{`
        @keyframes marquee-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .marquee-left  { animation: marquee-left  190s linear infinite; }
        .marquee-right { animation: marquee-right 190s linear infinite; }
        .marquee-left:hover,
        .marquee-right:hover { animation-play-state: paused; }
      `}</style>

      {/* Outer wrapper — occupies space in the document flow */}
      <div className="relative w-full overflow-hidden mt-12"
        style={{ height: "clamp(170px, 22vw, 160px)" }}
      >

        {/* ── Ribbon 1 — tilted -3deg, scrolls LEFT ── */}
        <div
          className="absolute w-[140%] left-[-20%] overflow-hidden"
          style={{
            top: "18%",
            transform: "rotate(-4deg)",
            zIndex: 2,
          }}
        >

          {/* Ribbon body */}
          <div
            className="relative w-full flex items-center overflow-hidden"
            style={{
              height: "clamp(36px, 5.5vw, 60px)",
              background: isDark
                ? "linear-gradient(90deg, #3a9e9a 0%, #5cbdb9 40%, #4eb8b4 70%, #3a9e9a 100%)"
                : "linear-gradient(90deg, #3a9e9a 0%, #5cbdb9 45%, #4ab5b1 75%, #3a9e9a 100%)",
              boxShadow: isDark
                ? "0 4px 24px rgba(92,189,185,0.35), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.2)"
                : "0 4px 20px rgba(92,189,185,0.45), inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(0,0,0,0.1)",
            }}
          >
            {/* Shine overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 55%, rgba(0,0,0,0.08) 100%)",
              }}
            />

            {/* Scrolling track — doubled for seamless loop */}
            <div className="marquee-left flex items-center whitespace-nowrap">
              {[...track, ...track].map((item, i) => (
                <span
                  key={i}
                  className={
                    item === "✦"
                      ? "mx-2 opacity-60 text-white"
                      : "font-black tracking-widest text-white"
                  }
                  style={{
                    fontSize: "clamp(9px, 1.4vw, 15px)",
                    letterSpacing: item !== "✦" ? "0.22em" : undefined,
                    textShadow: "0 1px 3px rgba(0,0,0,0.3)",
                    paddingLeft: item !== "✦" ? "clamp(8px, 1.2vw, 16px)" : 0,
                    paddingRight: item !== "✦" ? "clamp(8px, 1.2vw, 16px)" : 0,
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Ribbon 2 — tilted +3deg, scrolls RIGHT ── */}
        <div
          className="absolute w-[140%] left-[-20%] overflow-hidden"
          style={{
            top: "18%",
            transform: "rotate(3deg)",
            zIndex: 1,
          }}
        >


          {/* Ribbon body */}
          <div
            className="relative w-full flex items-center overflow-hidden"
            style={{
              height: "clamp(36px, 5.5vw, 60px)",
              background: isDark
                ? "linear-gradient(90deg, #e8c8d0 0%, #fbe3e8 40%, #f5d5dc 70%, #e8c8d0 100%)"
                : "linear-gradient(90deg, #e8a0b0 0%, #f4b8c4 40%, #fbe3e8 70%, #e8a0b0 100%)",
              boxShadow: isDark
                ? "0 4px 24px rgba(251,227,232,0.25), inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(0,0,0,0.1)"
                : "0 4px 20px rgba(232,128,152,0.35), inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.08)",
            }}
          >
            {/* Shine overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.22) 0%, transparent 55%, rgba(0,0,0,0.05) 100%)",
              }}
            />

            {/* Scrolling track — reversed order, scrolls right */}
            <div className="marquee-right flex items-center whitespace-nowrap">
              {[...[...track].reverse(), ...[...track].reverse()].map((item, i) => (
                <span
                  key={i}
                  className={item === "✦" ? "mx-2 opacity-50" : "font-black tracking-widest"}
                  style={{
                    fontSize: "clamp(9px, 1.4vw, 15px)",
                    letterSpacing: item !== "✦" ? "0.22em" : undefined,
                    color: isDark ? "#4a2030" : "#6a1530",
                    textShadow: isDark
                      ? "0 1px 2px rgba(255,255,255,0.15)"
                      : "0 1px 3px rgba(255,255,255,0.6)",
                    paddingLeft: item !== "✦" ? "clamp(8px, 1.2vw, 16px)" : 0,
                    paddingRight: item !== "✦" ? "clamp(8px, 1.2vw, 16px)" : 0,
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}