// Add this import at the top
import { useState } from "react";
import {useTheme} from "../../context/ThemeContext";
import { useRef, useEffect } from "react";


// ── Replace your existing GlowingName with this ──
export default function GlowingName() {
  const { theme } = useTheme();
  const isDark  = theme === "dark";
  const pathRef = useRef(null);
  const [hovered, setHovered] = useState(false);  // ← ADD THIS

  useEffect(() => {
    const el = pathRef.current;
    if (!el) return;
    let frame;
    let offset = 0;

    // Use a fixed large number — SVG text getTotalLength is unreliable cross-browser
    const total = 1800;

    const tick = () => {
      if (hovered) {
        // ── HOVER: full stroke covers entire perimeter — stationary glow border ──
        el.style.strokeDasharray  = `${total} 0`;
        el.style.strokeDashoffset = `0`;
        el.style.strokeOpacity    = "1";
        el.style.strokeWidth      = "2";
      } else {
        // ── IDLE: short travelling segment ──
        offset -= 2.4;
        el.style.strokeDasharray  = `${total * 0.18} ${total * 0.82}`;
        el.style.strokeDashoffset = `${offset}`;
        el.style.strokeOpacity    = "0.9";
        el.style.strokeWidth      = "2.5";
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [hovered]);  // ← RE-RUN WHEN HOVER CHANGES

  const strokeColor = isDark ? "#fbe3e8" : "#2a9e9a";
  const fillColor   = isDark ? "#fbe3e8" : "#5cbdb9";

  // Shared text props to avoid repetition
  const textProps = {
    x: "50%",
    textAnchor: "middle",
    dominantBaseline: "auto",
    y: "125",
    fontFamily: "'Courier New', monospace",
    fontSize: "128",
    fontWeight: "900",
    letterSpacing: "-3",
  };

  return (
    <div
      style={{ display: "inline-block", position: "relative", lineHeight: 1 }}
      // ── ADD THESE TWO HANDLERS ──
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg
        viewBox="0 0 820 140"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: "clamp(260px, 70vw, 820px)",
          height: "auto",
          overflow: "visible",
          display: "block",
          // Cursor hint
          cursor: "default",
        }}
      >
        <defs>
          <filter id="textGlow" x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation={hovered ? "6" : "4"} result="blur1" />
            <feGaussianBlur stdDeviation={hovered ? "14" : "10"} result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="ambientGlow" x="-10%" y="-30%" width="120%" height="160%">
            <feGaussianBlur stdDeviation={hovered ? "10" : "6"} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Layer 1: ghost outline */}
        <text
          {...textProps}
          fill="none"
          stroke={isDark ? "rgba(255,255,255,0.07)" : "rgba(42,158,154,0.15)"}
          strokeWidth="1"
        >
          Rajasekhar
        </text>

        {/* Layer 2: faint fill + ambient glow — brightens on hover */}
        <text
          {...textProps}
          fill={fillColor}
          fillOpacity={hovered ? (isDark ? 0.22 : 0.18) : (isDark ? 0.12 : 0.1)}
          stroke="none"
          filter="url(#ambientGlow)"
          style={{ transition: "fill-opacity 0.4s ease" }}
        >
          Rajasekhar
        </text>

        {/* Layer 3: main animated / hover-locked stroke */}
        <text
          ref={pathRef}
          {...textProps}
          fill="none"
          stroke={strokeColor}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#textGlow)"
        >
          Rajasekhar
        </text>

        {/* Layer 4: trailing stroke — hides on hover so only the border glow shows */}
        <text
          {...textProps}
          fill="none"
          stroke={isDark ? "#c9b8f5" : "#6040c0"}
          strokeWidth={hovered ? "0" : "1.5"}   // ← disappears on hover
          strokeLinecap="round"
          strokeOpacity={hovered ? "0" : "0.5"}
          style={{
            strokeDasharray: hovered ? `${1800} 0` : "180 1200",
            strokeDashoffset: hovered ? "0" : "300",
            animation: hovered ? "none" : "trailStroke 3.2s linear infinite",
            transition: "stroke-opacity 0.3s ease, stroke-width 0.3s ease",
          }}
        >
          Rajasekhar
        </text>

        {/* ── HOVER ONLY: extra thick outer bloom for border effect ── */}
        {hovered && (
          <text
            {...textProps}
            fill="none"
            stroke={strokeColor}
            strokeWidth="6"
            strokeOpacity="0.18"
            strokeLinecap="round"
            filter="url(#textGlow)"
            style={{
              strokeDasharray: "1800 0",
              strokeDashoffset: "0",
            }}
          >
            Rajasekhar
          </text>
        )}
      </svg>

      <style>{`
        @keyframes trailStroke {
          from { stroke-dashoffset: 300; }
          to   { stroke-dashoffset: -1620; }
        }
      `}</style>
    </div>
  );
}