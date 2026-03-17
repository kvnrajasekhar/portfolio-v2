import { useEffect, useRef } from "react";

// How tall the scroll zone is — user physically scrolls through this height
// to experience the full warp. Tune freely without affecting anything else.
const WARP_SCROLL_HEIGHT = "140vh";

export default function WarpTransition() {
  const triggerRef = useRef(null); // the tall spacer div that drives scroll progress
  const canvasRef  = useRef(null); // fixed overlay canvas
  const starsRef   = useRef([]);
  const animRef    = useRef(null);
  const progRef    = useRef(0);    // current progress 0→1
  const activeRef  = useRef(false);

  // ── Generate warp stars once ──
  useEffect(() => {
    const isMobile = window.innerWidth < 600;
    starsRef.current = Array.from({ length: isMobile ? 110 : 210 }, () => ({
      angle: Math.random() * Math.PI * 2,
      dist:  0.02 + Math.random() * 0.98,
      speed: 0.35 + Math.random() * 0.65,
      width: 0.4  + Math.random() * 1.1,
      color:
        Math.random() > 0.65 ? "#5cbdb9" :
        Math.random() > 0.45 ? "#fbe3e8" : "#ffffff",
    }));
  }, []);

  // ── Scroll listener — maps triggerRef position → 0…1 progress ──
  useEffect(() => {
    const onScroll = () => {
      const el = triggerRef.current;
      if (!el) return;

      const rect   = el.getBoundingClientRect();
      const viewH  = window.innerHeight;
      // progress: 0 when top of zone hits bottom of viewport,
      //           1 when bottom of zone hits top of viewport
      const total  = el.offsetHeight; // same as WARP_SCROLL_HEIGHT in px
      const scrolled = viewH - rect.top;
      const p = Math.max(0, Math.min(1, scrolled / (total + viewH)));
      progRef.current = p;

      // Show canvas only while warp is active (p > 0 and < 1)
      const canvas = canvasRef.current;
      if (!canvas) return;
      if (p > 0.01 && p < 0.99) {
        canvas.style.opacity = "1";
        canvas.style.pointerEvents = "none";
        activeRef.current = true;
      } else {
        canvas.style.opacity = "0";
        activeRef.current = false;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // run once on mount
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── RAF draw loop ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = window.innerWidth  * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      animRef.current = requestAnimationFrame(draw);

      if (!activeRef.current) return; // skip paint when invisible

      const p  = progRef.current;
      const W  = window.innerWidth;
      const H  = window.innerHeight;
      const cx = W / 2, cy = H / 2;
      const maxDim = Math.sqrt(cx * cx + cy * cy);

      ctx.clearRect(0, 0, W, H);

      // ── Black base ──
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, W, H);

      // Ease curve
      const eased = p < 0.5
        ? 2 * p * p
        : 1 - Math.pow(-2 * p + 2, 2) / 2;

      // Phase: 0→0.35 ramp-in │ 0.35→0.72 full warp │ 0.72→1 dissolve-out
      const streakMult =
        p < 0.35 ? p / 0.35 :
        p < 0.72 ? 1 :
        Math.max(0, 1 - (p - 0.72) / 0.28);

      const warpIntensity = Math.min(1, eased * 1.3);

      // ── Nebula centre glow ──
      if (p > 0.15) {
        const na  = Math.min(1, (p - 0.15) / 0.35) * streakMult * 0.28;
        const nr  = 50 + warpIntensity * (W < 500 ? 110 : 240);
        const ng  = ctx.createRadialGradient(cx, cy, 0, cx, cy, nr);
        ng.addColorStop(0, `rgba(92,189,185,${na})`);
        ng.addColorStop(0.5, `rgba(92,189,185,${na * 0.3})`);
        ng.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = ng;
        ctx.beginPath(); ctx.arc(cx, cy, nr, 0, Math.PI * 2); ctx.fill();
      }

      // ── Warp streaks ──
      starsRef.current.forEach(star => {
        const baseLen   = 2 + warpIntensity * star.speed * (W < 500 ? 110 : 195) * streakMult;
        const startDist = star.dist * maxDim * (0.04 + warpIntensity * 0.96);
        const endDist   = startDist + baseLen;
        const x1 = cx + Math.cos(star.angle) * startDist;
        const y1 = cy + Math.sin(star.angle) * startDist;
        const x2 = cx + Math.cos(star.angle) * endDist;
        const y2 = cy + Math.sin(star.angle) * endDist;

        const alpha = Math.min(1, streakMult * 1.1) * (0.4 + warpIntensity * 0.6);
        const hex   = n => Math.round(n * 255).toString(16).padStart(2, "0");
        const g = ctx.createLinearGradient(x1, y1, x2, y2);
        g.addColorStop(0,   star.color + "00");
        g.addColorStop(0.4, star.color + hex(alpha * 0.65));
        g.addColorStop(1,   star.color + hex(alpha));

        ctx.beginPath();
        ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
        ctx.strokeStyle = g;
        ctx.lineWidth   = star.width * (1 + warpIntensity * 1.9);
        ctx.stroke();
      });

      // ── Central lens burst (peak p 0.40→0.74) ──
      if (p > 0.38 && p < 0.76) {
        const bp = p < 0.57
          ? (p - 0.38) / 0.19
          : 1 - (p - 0.57) / 0.19;
        const ba = Math.max(0, Math.min(1, bp));

        // Outer teal glow
        const gr = 16 + ba * (W < 500 ? 75 : 145);
        const gg = ctx.createRadialGradient(cx, cy, 0, cx, cy, gr);
        gg.addColorStop(0,    `rgba(92,189,185,${ba * 0.95})`);
        gg.addColorStop(0.35, `rgba(92,189,185,${ba * 0.28})`);
        gg.addColorStop(1,    "rgba(0,0,0,0)");
        ctx.fillStyle = gg;
        ctx.beginPath(); ctx.arc(cx, cy, gr, 0, Math.PI * 2); ctx.fill();

        // Hot white core
        const cr = ba * (W < 500 ? 12 : 22);
        const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr);
        cg.addColorStop(0, `rgba(255,255,255,${ba})`);
        cg.addColorStop(1, "rgba(92,189,185,0)");
        ctx.fillStyle = cg;
        ctx.beginPath(); ctx.arc(cx, cy, cr, 0, Math.PI * 2); ctx.fill();
      }

      // ── Vignette ──
      const vig = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxDim);
      vig.addColorStop(0,   "rgba(0,0,0,0)");
      vig.addColorStop(0.5, "rgba(0,0,0,0)");
      vig.addColorStop(1,   `rgba(0,0,0,${0.45 + eased * 0.5})`);
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      // ── Fade-to-black at the very end so SkillConstellation appears clean ──
      if (p > 0.80) {
        const fo = (p - 0.80) / 0.20;
        ctx.fillStyle = `rgba(0,0,0,${Math.min(1, fo)})`;
        ctx.fillRect(0, 0, W, H);
      }

      // ── "Entering space" label — visible in mid-warp only ──
      if (p > 0.12 && p < 0.70) {
        const la =
          p < 0.22 ? (p - 0.12) / 0.10 :
          p > 0.58 ? 1 - (p - 0.58) / 0.12 : 1;
        const labelAlpha = Math.max(0, Math.min(1, la));

        ctx.save();
        ctx.globalAlpha = labelAlpha;

        // Sub-label
        ctx.font = `${W < 500 ? 9 : 16}px 'Courier New', monospace`;
        ctx.fillStyle  = "#5cbdb9";
        ctx.textAlign  = "center";
        ctx.letterSpacing = "0.4em";
        ctx.fillText("✦  Now! We are  ✦", cx, cy - (W < 500 ? 36 : 52));

        // Main label
        ctx.font        = `bold ${W < 500 ? 14 : 36}px 'Courier New', monospace`;
        ctx.fillStyle   = "#ffffff";
        ctx.textAlign   = "center";
        ctx.shadowBlur  = 18;
        ctx.shadowColor = "#5cbdb9";
        ctx.fillText("Entering the Skill Universe", cx, cy - (W < 500 ? 10 : 14));
        ctx.shadowBlur  = 0;

        // Dots
        const dotCount = 5;
        const dotSpacing = W < 500 ? 12 : 16;
        const dotsY = cy + (W < 500 ? 18 : 28);
        const dotsX = cx - ((dotCount - 1) / 2) * dotSpacing;
        const now   = performance.now() / 1000;
        for (let i = 0; i < dotCount; i++) {
          const pulse = 0.3 + 0.7 * Math.abs(Math.sin(now * 2.2 + i * 0.55));
          ctx.beginPath();
          ctx.arc(dotsX + i * dotSpacing, dotsY, W < 500 ? 2.5 : 3.5, 0, Math.PI * 2);
          ctx.fillStyle  = `rgba(92,189,185,${pulse})`;
          ctx.shadowBlur  = 8;
          ctx.shadowColor = "#5cbdb9";
          ctx.fill();
          ctx.shadowBlur  = 0;
        }

        ctx.restore();
      }
    };

    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      {/*
        position:fixed means it is completely outside normal document flow.
        It never pushes, clips or overlaps any section content.
      */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: 0,
          width:  "100vw",
          height: "100vh",
          zIndex: 50,          // above hero & navbar content, below modals
          opacity: 0,          // scroll listener toggles this
          transition: "opacity 0.3s ease",
          pointerEvents: "none",
        }}
      />

      {/*
        Tall spacer — this is the ONLY thing that adds height to the document.
        Its scroll position drives the warp progress.
        Background matches hero→skill so there is no colour flash.
      */}
      <div
        ref={triggerRef}
        style={{
          height: WARP_SCROLL_HEIGHT,
          width:  "100%",
          background: "#000000",
          // No content, no padding — purely a scroll driver
        }}
      />
    </>
  );
}