import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

const CATEGORIES = [
  {
    id: "programming",
    label: "Programming",
    color: "#5cbdb9",
    position: { x: 0.22, y: 0.28 },
    skills: [
      { name: "JavaScript (ES6+)", level: 0.70 },
      { name: "C#", level: 0.65 },
      { name: "Java", level: 0.70 },
      { name: "Python", level: 0.75 },
    ],
  },
  {
    id: "frameworks",
    label: "Frameworks & Libraries",
    color: "#fbe3e8",
    position: { x: 0.72, y: 0.22 },
    skills: [
      { name: "React.js", level: 0.85 },
      { name: "ASP.NET MVC", level: 0.68 },
      { name: "Spring Boot", level: 0.72 },
      { name: "Material-UI", level: 0.75 },
      { name: "Bootstrap", level: 0.80 },
      { name: "Tailwind CSS", level: 0.85 },
      { name: "Framer Motion", level: 0.65 },
    ],
  },
  {
    id: "web",
    label: "Web & Backend",
    color: "#a8d8b9",
    position: { x: 0.5, y: 0.58 },
    skills: [
      { name: "HTML5", level: 0.90 },
      { name: "CSS3", level: 0.90 },
      { name: "Node.js", level: 0.88 },
      { name: "Express.js", level: 0.85 },
      { name: "RESTful API", level: 0.85 },
      { name: "JWT Auth", level: 0.80 },
    ],
  },
  {
    id: "databases",
    label: "Databases",
    color: "#f7c4a0",
    position: { x: 0.2, y: 0.72 },
    skills: [
      { name: "SQL Server", level: 0.80 },
      { name: "Oracle / PL-SQL", level: 0.70 },
      { name: "MongoDB", level: 0.80 },
      { name: "Mongoose", level: 0.70 },
    ],
  },
  {
    id: "tools",
    label: "Tools & DevOps",
    color: "#c9b8f5",
    position: { x: 0.78, y: 0.70 },
    skills: [
      { name: "Git / GitHub", level: 0.90 },
      { name: "Docker", level: 0.60 },
      { name: "GitHub Actions", level: 0.60 },
      { name: "Vercel / Render", level: 0.75 },
      { name: "AWS (in progress)", level: 0.45 },
      { name: "Postman", level: 0.80 },
    ],
  },
];

function starPositionsForCategory(cat, w, h, seed) {
  const cx = cat.position.x * w;
  const cy = cat.position.y * h;
  return cat.skills.map((skill, i) => {
    const angle = (i / cat.skills.length) * Math.PI * 2 + seed;
    const radius = 55 + skill.level * 38;
    return {
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius,
      skill,
    };
  });
}

// ─── MOBILE CARD VIEW ────────────────────────────────────────────────────────
function MobileSkillCard({ cat, index }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.45 }}
      style={{ width: "100%" }}
    >
      {/* Card header — tap to expand */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 18px",
            borderRadius: open ? "14px 14px 0 0" : 14,
            border: `1px solid ${cat.color}44`,
            background: open
              ? `linear-gradient(135deg, ${cat.color}18 0%, #00000000 100%)`
              : `${cat.color}0a`,
            transition: "all 0.3s ease",
            boxShadow: open ? `0 0 20px ${cat.color}22` : "none",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Pulsing dot */}
            <div style={{ position: "relative", width: 14, height: 14, flexShrink: 0 }}>
              <div style={{
                width: 10, height: 10, borderRadius: "50%",
                background: cat.color,
                boxShadow: `0 0 10px ${cat.color}`,
                position: "absolute", top: 2, left: 2,
              }} />
              {open && (
                <motion.div
                  animate={{ scale: [1, 1.9, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ repeat: Infinity, duration: 1.6 }}
                  style={{
                    width: 14, height: 14, borderRadius: "50%",
                    background: cat.color,
                    position: "absolute", top: 0, left: 0,
                  }}
                />
              )}
            </div>
            <span style={{
              color: cat.color,
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontFamily: "'Courier New', monospace",
            }}>
              {cat.label}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{
              fontSize: 10,
              color: cat.color + "99",
              fontFamily: "'Courier New', monospace",
              letterSpacing: "0.05em",
            }}>
              {cat.skills.length} skills
            </span>
            {/* Chevron */}
            <motion.div
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.25 }}
              style={{ color: cat.color, fontSize: 14, lineHeight: 1 }}
            >
              ▾
            </motion.div>
          </div>
        </div>
      </button>

      {/* Expandable skill list */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div style={{
              border: `1px solid ${cat.color}33`,
              borderTop: "none",
              borderRadius: "0 0 14px 14px",
              padding: "10px 18px 16px",
              background: `${cat.color}08`,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}>
              {cat.skills.map((skill, si) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: si * 0.05 }}
                >
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 5,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      {/* Mini star dot */}
                      <div style={{
                        width: 5, height: 5, borderRadius: "50%",
                        background: cat.color,
                        boxShadow: `0 0 5px ${cat.color}`,
                        flexShrink: 0,
                      }} />
                      <span style={{
                        color: "#ffffff",
                        fontSize: 12,
                        fontFamily: "'Courier New', monospace",
                        letterSpacing: "0.03em",
                      }}>
                        {skill.name}
                      </span>
                    </div>
                    <span style={{
                      color: cat.color,
                      fontSize: 11,
                      fontFamily: "'Courier New', monospace",
                      fontWeight: 700,
                      flexShrink: 0,
                      marginLeft: 8,
                    }}>
                      {Math.round(skill.level * 100)}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div style={{
                    height: 3,
                    background: "#ffffff12",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level * 100}%` }}
                      transition={{ duration: 0.6, delay: si * 0.06, ease: "easeOut" }}
                      style={{
                        height: "100%",
                        background: `linear-gradient(90deg, ${cat.color}88, ${cat.color})`,
                        borderRadius: 2,
                        boxShadow: `0 0 6px ${cat.color}88`,
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── DESKTOP CONSTELLATION  ────────────────────
function DesktopConstellation() {
  const canvasRef = useRef(null);
  const [dims, setDims] = useState({ w: 900, h: 600 });
  const [hoveredCat, setHoveredCat] = useState(null);
  const [hoveredStar, setHoveredStar] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const tickRef = useRef(0);
  const animRef = useRef(null);

  useEffect(() => {
    const update = () => {
      const el = canvasRef.current?.parentElement;
      if (el) setDims({ w: el.clientWidth, h: el.clientHeight });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = dims.w * dpr;
    canvas.height = dims.h * dpr;
    ctx.scale(dpr, dpr);

    const bgStars = Array.from({ length: 140 }, () => ({
      x: Math.random() * dims.w,
      y: Math.random() * dims.h,
      r: Math.random() * 1.2,
      twinkle: Math.random() * Math.PI * 2,
    }));

    function draw() {
      tickRef.current += 0.012;
      const t = tickRef.current;
      ctx.clearRect(0, 0, dims.w, dims.h);

      const bgGrad = ctx.createRadialGradient(
        dims.w * 0.5, dims.h * 0.5, 0,
        dims.w * 0.5, dims.h * 0.5, dims.w * 0.75
      );
      bgGrad.addColorStop(0, "#000000");
      bgGrad.addColorStop(1, "#000000");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, dims.w, dims.h);

      CATEGORIES.forEach((cat) => {
        const cx = cat.position.x * dims.w;
        const cy = cat.position.y * dims.h;
        const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 160);
        grd.addColorStop(0, cat.color + "18");
        grd.addColorStop(1, "transparent");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(cx, cy, 160, 0, Math.PI * 2);
        ctx.fill();
      });

      bgStars.forEach((s) => {
        const alpha = 0.3 + 0.4 * Math.sin(s.twinkle + t * 0.8);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      });

      CATEGORIES.forEach((cat) => {
        const isHov = hoveredCat === cat.id;
        const cx = cat.position.x * dims.w;
        const cy = cat.position.y * dims.h;
        const stars = starPositionsForCategory(cat, dims.w, dims.h, cat.id.length * 0.6);

        stars.forEach((star) => {
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(star.x, star.y);
          const lineAlpha = isHov ? 0.55 : 0.18;
          ctx.strokeStyle = cat.color + Math.round(lineAlpha * 255).toString(16).padStart(2, "0");
          ctx.lineWidth = isHov ? 1.2 : 0.6;
          ctx.setLineDash([4, 6]);
          ctx.stroke();
          ctx.setLineDash([]);
        });

        stars.forEach((star, i) => {
          const next = stars[(i + 1) % stars.length];
          ctx.beginPath();
          ctx.moveTo(star.x, star.y);
          ctx.lineTo(next.x, next.y);
          ctx.strokeStyle = cat.color + (isHov ? "55" : "22");
          ctx.lineWidth = 0.5;
          ctx.stroke();
        });

        const pulse = 1 + 0.12 * Math.sin(t * 1.4 + cat.id.length);
        const centerR = (isHov ? 10 : 7) * pulse;
        ctx.save();
        ctx.shadowBlur = isHov ? 28 : 14;
        ctx.shadowColor = cat.color;
        ctx.beginPath();
        ctx.arc(cx, cy, centerR, 0, Math.PI * 2);
        ctx.fillStyle = cat.color;
        ctx.fill();
        ctx.restore();

        ctx.beginPath();
        ctx.arc(cx, cy, centerR * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();

        // ── Category label — bigger font ──
        ctx.font = `${isHov ? "bold" : "600"} ${isHov ? 14 : 12}px 'Courier New', monospace`;
        ctx.fillStyle = isHov ? cat.color : cat.color + "bb";
        ctx.textAlign = "center";
        ctx.fillText(cat.label.toUpperCase(), cx, cy + centerR + 18);

        stars.forEach((star) => {
          const isStarHov = hoveredStar?.name === star.skill.name;
          const starPulse = 1 + 0.15 * Math.sin(t * 2 + star.x * 0.05);
          const r = (3 + star.skill.level * 5) * (isStarHov ? 1.6 : 1) * (isHov ? 1.2 : 0.9) * starPulse;

          ctx.save();
          ctx.shadowBlur = isHov ? 16 : 8;
          ctx.shadowColor = cat.color;
          ctx.beginPath();
          ctx.arc(star.x, star.y, r, 0, Math.PI * 2);
          ctx.fillStyle = isHov ? cat.color : cat.color + "88";
          ctx.fill();
          ctx.restore();

          ctx.beginPath();
          ctx.arc(star.x, star.y, r * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,255,255,0.9)";
          ctx.fill();

          if (isHov || isStarHov) {
            // ── Skill name — bigger font ──
            ctx.font = `bold 13px 'Courier New', monospace`;
            ctx.fillStyle = "#fff";
            ctx.textAlign = "center";
            ctx.fillText(star.skill.name, star.x, star.y - r - 8);

            const arcR = r + 5;
            ctx.beginPath();
            ctx.arc(star.x, star.y, arcR, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * star.skill.level);
            ctx.strokeStyle = cat.color;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        });
      });

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [dims, hoveredCat, hoveredStar]);

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    let foundCat = null;
    let foundStar = null;
    let tip = null;

    CATEGORIES.forEach((cat) => {
      const cx = cat.position.x * dims.w;
      const cy = cat.position.y * dims.h;
      const stars = starPositionsForCategory(cat, dims.w, dims.h, cat.id.length * 0.6);

      stars.forEach((star) => {
        const dist = Math.hypot(mx - star.x, my - star.y);
        if (dist < 25) {
          foundCat = cat.id;
          foundStar = star.skill;
          tip = {
            x: e.clientX,
            y: e.clientY,
            name: star.skill.name,
            level: star.skill.level,
            color: cat.color
          };
        }
      });

      if (!foundStar) {
        const distCenter = Math.hypot(mx - cx, my - cy);
        if (distCenter < 120) foundCat = cat.id;
      }
    });

    // Only update state if the actual value reference changed
    if (foundCat !== hoveredCat) setHoveredCat(foundCat);
    if (foundStar?.name !== hoveredStar?.name) setHoveredStar(foundStar); // Faster check
    setTooltip(tip);
  };

  
  return (
    <div style={{ width: "100%", flex: 1, minHeight: 580, position: "relative" }}>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", minHeight: 580, display: "block", cursor: "crosshair" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { setHoveredCat(null); setHoveredStar(null); setTooltip(null); }}
      />
      {createPortal(
        <AnimatePresence>
          {tooltip && (
            <motion.div
              key={tooltip.name}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{
                position: "fixed",
                left: tooltip.x + 20,
                top: tooltip.y - 60,
                background: "rgba(13, 21, 32, 0.95)",
                border: `1px solid ${tooltip.color}aa`,
                borderRadius: "12px",
                padding: "12px 16px",
                pointerEvents: "none", // Critical: prevents mouse interference
                zIndex: 99999,
                backdropFilter: "blur(12px)",
                boxShadow: `0 8px 32px ${tooltip.color}33`,
                minWidth: "180px",
              }}
            >
              {/* Skill Name */}
              <div style={{
                color: tooltip.color,
                fontWeight: 800,
                fontSize: "14px",
                marginBottom: "8px",
                fontFamily: "'Courier New', monospace",
                letterSpacing: "0.05em"
              }}>
                {tooltip.name.toUpperCase()}
              </div>

              {/* Progress Section */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  flex: 1,
                  height: "6px",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "3px",
                  overflow: "hidden"
                }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${tooltip.level * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    style={{
                      height: "100%",
                      background: tooltip.color,
                      borderRadius: "3px",
                      // Fixed Shadow Logic:
                      boxShadow: `0 0 10px ${tooltip.color}`
                    }}
                  />
                </div>

                {/* Percentage Text */}
                <span style={{
                  color: "#fff",
                  fontSize: "12px",
                  fontFamily: "'Courier New', monospace",
                  fontWeight: "bold"
                }}>
                  {Math.round(tooltip.level * 100)}%
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────
export default function SkillConstellation() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section
      style={{
        width: "100%",
        background: "#000000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: isMobile ? "88px 0 40px 0px" : "99px 0 40px 0px",
        fontFamily: "'Courier New', monospace",
        position: "relative",
        overflow: "hidden",
        // No minHeight — let content define height on mobile
        minHeight: isMobile ? "100vh" : "100vh",
      }}
    >

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: "center", marginBottom: isMobile ? 28 : 12, zIndex: 10, padding: "24px 24px" }}
      >
        <p style={{
          fontSize: 11, letterSpacing: "0.35em", textTransform: "uppercase",
          color: "#5cbdb9", marginBottom: 8, opacity: 0.8,
        }}>
          ✦ navigate the universe ✦
        </p>
        <h2 style={{
          fontSize: "clamp(26px, 4vw, 48px)",
          fontWeight: 800, margin: 0,
          background: "linear-gradient(135deg, #5cbdb9 0%, #fbe3e8 60%, #c9b8f5 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "-0.02em",
        }}>
          Skills Constellation
        </h2>
        <p style={{ color: "#ffffff44", fontSize: 13, marginTop: 10, letterSpacing: "0.15em" }}>
          {isMobile ? "Tap a category to expand" : "Hover over a cluster to explore — each star is a skill"}
        </p>
      </motion.div>

      {/* Conditional layout */}
      {isMobile ? (
        // ── MOBILE: stacked accordion cards ──
        <div style={{
          width: "100%",
          maxWidth: 480,
          padding: "0 16px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}>
          {CATEGORIES.map((cat, i) => (
            <MobileSkillCard key={cat.id} cat={cat} index={i} />
          ))}
        </div>
      ) : (
        <DesktopConstellation />
      )}

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{
          display: "flex", flexWrap: "wrap", gap: "10px 24px",
          justifyContent: "center", padding: "0 32px",
          zIndex: 10, marginTop: isMobile ? 64 : 8,
        }}
      >
        {CATEGORIES.map((cat) => (
          <div key={cat.id} style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%",
              background: cat.color,
              boxShadow: `0 0 8px ${cat.color}`,
            }} />
            <span style={{ fontSize: 10, color: cat.color + "cc", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {cat.label}
            </span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}