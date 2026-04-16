import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import AtomicTransition from "../transition/AtomicTransition";

// ─── PROTOCOL DATA ────────────────────────────────────────────────────────────
const PROTOCOLS = [
  {
    id: 1,
    name: "linkedin",
    label: "LinkedIn",
    cmd: "linkedin --connect",
    url: "https://www.linkedin.com/in/kvnrs23",
    desc: "Professional network node. SDE-1 candidate profile. 500+ connections.",
    port: "443/TLS",
    status: "ONLINE",
  },
  {
    id: 2,
    name: "github",
    label: "GitHub",
    cmd: "github --view-repos",
    url: "https://github.com/kvnrajasekhar",
    desc: "Source control node. Public repositories, commit history, open-source contributions.",
    port: "22/SSH",
    status: "ONLINE",
  },
  {
    id: 3,
    name: "leetcode",
    label: "LeetCode",
    cmd: "leetcode --check-stats",
    url: "https://leetcode.com/u/vnrajasekhar",
    desc: "Algorithm training node. DSA problem solutions, contest ratings, acceptance rate.",
    port: "8080/HTTP",
    status: "ONLINE",
  },
  {
    id: 4,
    name: "medium",
    label: "Medium",
    cmd: "medium --read-insights",
    url: "https://medium.com/@kanagalavnrajasekhar",
    desc: "Technical writing node. Engineering articles, dev insights, tutorials.",
    port: "443/TLS",
    status: "ONLINE",
  },
  {
    id: 5,
    name: "geeksforgeeks",
    label: "GeeksForGeeks",
    cmd: "geeksforgeeks --check-stats",
    url: "https://www.geeksforgeeks.org/profile/vnrajasekhar",
    desc: "Competitive coding node. Practice problems, article contributions, coding score.",
    port: "80/HTTP",
    status: "ONLINE",
  },
];

const BOOT_LINES = [
  { text: "SECURE_TERMINAL v2.0.1 — Initializing...", color: "dim", delay: 0 },
  { text: "Loading kernel modules...", color: "dim", delay: 300 },
  { text: "[OK] crypto/tls.ko loaded", color: "success", delay: 550 },
  { text: "[OK] net/ssh.ko loaded", color: "success", delay: 750 },
  { text: "[OK] fs/protocol.ko loaded", color: "success", delay: 950 },
  { text: "Scanning social protocol nodes...", color: "info", delay: 1200 },
  { text: "[FOUND] linkedin.local — port 443/TLS", color: "success", delay: 1450 },
  { text: "[FOUND] github.local — port 22/SSH", color: "success", delay: 1650 },
  { text: "[FOUND] leetcode.local — port 8080/HTTP", color: "success", delay: 1850 },
  { text: "[FOUND] medium.local — port 443/TLS", color: "success", delay: 2050 },
  { text: "[FOUND] geeksforgeeks.local — port 80/HTTP", color: "success", delay: 2250 },
  { text: "Establishing secure handshake...", color: "warn", delay: 2500 },
  { text: "[OK] All nodes authenticated. Encryption active.", color: "success", delay: 2850 },
  { text: "─────────────────────────────────────────────", color: "dim", delay: 3050 },
  { text: "Welcome, Rajasekhar. Terminal ready.", color: "header", delay: 3200 },
  { text: "Type  raj --help  for available commands.", color: "dim", delay: 3400 },
  { text: "─────────────────────────────────────────────", color: "dim", delay: 3550 },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function colorClass(type, isDark) {
  const map = {
    success: isDark ? "text-green-400" : "text-green-700",
    error: isDark ? "text-red-400" : "text-red-600",
    warn: isDark ? "text-yellow-400" : "text-yellow-600",
    info: isDark ? "text-blue-400" : "text-blue-600",
    dim: isDark ? "text-gray-500" : "text-gray-400",
    header: isDark ? "text-teal-300" : "text-teal-700",
    cmd: isDark ? "text-green-300" : "text-green-800",
    protocol: isDark ? "text-purple-400" : "text-purple-700",
    white: isDark ? "text-gray-100" : "text-gray-800",
  };
  return map[type] || (isDark ? "text-gray-300" : "text-gray-700");
}

// ─── TYPEWRITER LINE ──────────────────────────────────────────────────────────
function TypewriterLine({ text, color, isDark, speed = 28, onDone }) {
  const [displayed, setDisplayed] = useState("");
  const idx = useRef(0);

  useEffect(() => {
    idx.current = 0;
    setDisplayed("");
    if (!text) { onDone?.(); return; }
    const iv = setInterval(() => {
      idx.current++;
      setDisplayed(text.slice(0, idx.current));
      if (idx.current >= text.length) {
        clearInterval(iv);
        onDone?.();
      }
    }, speed);
    return () => clearInterval(iv);
  }, [text]);

  return (
    <span className={colorClass(color, isDark)}>
      {displayed}
    </span>
  );
}

// ─── TERMINAL LINE ────────────────────────────────────────────────────────────
function TermLine({ line, isDark }) {
  if (line.type === "prompt") {
    return (
      <div className="flex gap-2 items-start">
        <span className={colorClass("success", isDark)}>C:\sociallinks $</span>
        <span className={colorClass("cmd", isDark)}>{line.text}</span>
      </div>
    );
  }
  if (line.type === "protocol-list") {
    return (
      <div className="flex flex-col gap-[2px]">
        {PROTOCOLS.map(p => (
          <div key={p.id} className="flex gap-3 items-center">
            <span className={colorClass("dim", isDark)}>[{p.id}]</span>
            <span className={colorClass("protocol", isDark)}>{p.label}</span>
            <span className={colorClass("dim", isDark)}>--</span>
            <span className={colorClass("success", isDark)}>{p.cmd.split(" ")[1]}</span>
            <span className={colorClass("dim", isDark)}>| {p.port}</span>
            <span className="ml-auto">
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${isDark ? "bg-green-900 text-green-300" : "bg-green-100 text-green-700"}`}>
                ● {p.status}
              </span>
            </span>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className={colorClass(line.color || "white", isDark)}>
      {line.text}
    </div>
  );
}

// ─── BLINKING CURSOR ─────────────────────────────────────────────────────────
function Cursor({ isDark }) {
  return (
    <motion.span
      animate={{ opacity: [1, 0, 1] }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      className={`inline-block w-2 h-4 ml-0.5 align-middle ${isDark ? "bg-green-400" : "bg-gray-700"}`}
    />
  );
}

// ─── MAIN TERMINAL ────────────────────────────────────────────────────────────
export default function SocialTerminal() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [lines, setLines] = useState([]);
  const [input, setInput] = useState("");
  const [booted, setBooted] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [history, setHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [bootIdx, setBootIdx] = useState(0);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // ── Auto-scroll ──
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines, bootIdx]);

  // ── Boot sequence ──
  useEffect(() => {
    if (bootIdx >= BOOT_LINES.length) {
      setBooted(true);
      pushLines([
        { type: "blank" },
        { text: "Available Social Protocol Nodes:", color: "header" },
        { type: "protocol-list" },
        { type: "blank" },
        { text: "Use  connect <num>  or click a protocol above.", color: "dim" },
      ]);
      return;
    }
    const line = BOOT_LINES[bootIdx];
    const timer = setTimeout(() => {
      setLines(prev => [...prev, { text: line.text, color: line.color }]);
      setBootIdx(i => i + 1);
    }, bootIdx === 0 ? 200 : BOOT_LINES[bootIdx].delay - BOOT_LINES[bootIdx - 1].delay);
    return () => clearTimeout(timer);
  }, [bootIdx]);

  const pushLines = useCallback((newLines) => {
    setLines(prev => [...prev, ...newLines]);
  }, []);

  const pushLine = useCallback((line) => {
    setLines(prev => [...prev, line]);
  }, []);

  // ── Connection animation ──
  const runConnect = useCallback((proto) => {
    setProcessing(true);
    const steps = [
      { text: `Initializing connection to ${proto.name}...`, color: "warn", delay: 0 },
      { text: `Authenticating with ${proto.name}.local...`, color: "warn", delay: 500 },
      { text: `Verifying certificate on port ${proto.port}...`, color: "info", delay: 1000 },
      { text: `Secure tunnel established.`, color: "success", delay: 1500 },
      { text: `Redirecting to Secure_Node: ${proto.label.toUpperCase()}.local...`, color: "success", delay: 1900 },
      { text: `[OK] Connection successful. Opening ${proto.label}...`, color: "success", delay: 2300 },
    ];
    steps.forEach(s => {
      setTimeout(() => pushLine({ text: s.text, color: s.color }), s.delay);
    });
    setTimeout(() => {
      window.open(proto.url, "_blank", "noopener,noreferrer");
      pushLine({ type: "blank" });
      setProcessing(false);
    }, 2700);
  }, [pushLine]);

  // ── Help output ──
  const showHelp = useCallback(() => {
    pushLines([
      { text: "─────────────────────────────────────────────", color: "dim" },
      { text: "AVAILABLE COMMANDS:", color: "header" },
      { text: "  connect <num>          Connect to social protocol by index", color: "white" },
      { text: "  raj --help             Show this help message", color: "white" },
      { text: "  raj --log              Display command history", color: "white" },
      { text: "  raj --desc <name>      Show protocol details (e.g. raj --desc github)", color: "white" },
      { text: "  raj --status           System status report", color: "white" },
      { text: "  raj --about            Terminal information", color: "white" },
      { text: "  raj --clear            Clear terminal output", color: "white" },
      { text: "─────────────────────────────────────────────", color: "dim" },
    ]);
  }, [pushLines]);

  // ── Status output ──
  const showStatus = useCallback(() => {
    pushLines([
      { text: "─────────────────────────────────────────────", color: "dim" },
      { text: "SYSTEM STATUS REPORT:", color: "header" },
      { text: `  Terminal     : SECURE_TERMINAL v2.0.1`, color: "info" },
      { text: `  Encryption   : AES-256 / TLS 1.3`, color: "success" },
      { text: `  Nodes online : ${PROTOCOLS.length}/${PROTOCOLS.length}`, color: "success" },
      ...PROTOCOLS.map(p => ({
        text: `  [●] ${p.name.padEnd(16)} ${p.port.padEnd(12)} ONLINE`,
        color: "success",
      })),
      { text: `  Uptime       : ${Math.floor(Math.random() * 99) + 1}h ${Math.floor(Math.random() * 59)}m`, color: "dim" },
      { text: "─────────────────────────────────────────────", color: "dim" },
    ]);
  }, [pushLines]);

  // ── About output ──
  const showAbout = useCallback(() => {
    pushLines([
      { text: "─────────────────────────────────────────────", color: "dim" },
      { text: "SECURE_TERMINAL v2.0.1", color: "header" },
      { text: "  Developer   : KVN_Rajasekhar", color: "info" },
      { text: "  Build       : Full Stack Engineer — Portfolio Terminal", color: "info" },
      { text: "  Stack       : React · Framer Motion · Tailwind CSS", color: "dim" },
      { text: "  Purpose     : Authenticate and connect to social protocols", color: "dim" },
      { text: "  License     : MIT / Open Source", color: "dim" },
      { text: "─────────────────────────────────────────────", color: "dim" },
    ]);
  }, [pushLines]);

  // ── Command processor ──
  const processCommand = useCallback((raw) => {
    const cmd = raw.trim();
    if (!cmd) return;

    // Record in history
    setHistory(h => [cmd, ...h]);
    setHistIdx(-1);

    // Echo prompt
    pushLine({ type: "prompt", text: cmd });

    const parts = cmd.toLowerCase().split(/\s+/);

    // raj --clear
    if (parts[0] === "raj" && parts[1] === "--clear") {
      setLines([]);
      return;
    }

    // raj --help
    if (parts[0] === "raj" && parts[1] === "--help") {
      showHelp();
      return;
    }

    // raj --log
    if (parts[0] === "raj" && parts[1] === "--log") {
      if (history.length === 0) {
        pushLine({ text: "No commands in history yet.", color: "dim" });
      } else {
        pushLines([
          { text: "COMMAND HISTORY:", color: "header" },
          ...history.slice(0, 20).map((h, i) => ({
            text: `  [${String(i + 1).padStart(2, "0")}] ${h}`,
            color: "dim",
          })),
        ]);
      }
      return;
    }

    // raj --status
    if (parts[0] === "raj" && parts[1] === "--status") {
      showStatus();
      return;
    }

    // raj --about
    if (parts[0] === "raj" && parts[1] === "--about") {
      showAbout();
      return;
    }

    // raj --desc <name>
    if (parts[0] === "raj" && parts[1] === "--desc" && parts[2]) {
      const proto = PROTOCOLS.find(p => p.name === parts[2]);
      if (!proto) {
        pushLine({ text: `Protocol '${parts[2]}' not found. Run raj --help for list.`, color: "error" });
        return;
      }
      pushLines([
        { text: `─── PROTOCOL: ${proto.label.toUpperCase()} ───`, color: "header" },
        { text: `  Name     : ${proto.name}`, color: "info" },
        { text: `  Port     : ${proto.port}`, color: "info" },
        { text: `  Status   : ${proto.status}`, color: "success" },
        { text: `  URL      : ${proto.url}`, color: "dim" },
        { text: `  Details  : ${proto.desc}`, color: "white" },
        { text: `  Command  : connect ${proto.id}`, color: "dim" },
      ]);
      return;
    }

    // connect <num>
    if (parts[0] === "connect" && parts[1]) {
      const num = parseInt(parts[1]);
      const proto = PROTOCOLS.find(p => p.id === num);
      if (!proto) {
        pushLine({ text: `Error: Protocol index '${parts[1]}' not found. Valid range: 1-${PROTOCOLS.length}.`, color: "error" });
        return;
      }
      runConnect(proto);
      return;
    }

    // Unknown
    pushLines([
      { text: `Command not found: '${cmd}'`, color: "error" },
      { text: "Try  raj --help  for available commands.", color: "dim" },
    ]);
  }, [history, pushLine, pushLines, showHelp, showStatus, showAbout, runConnect]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      processCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(next);
      setInput(history[next] || "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(histIdx - 1, -1);
      setHistIdx(next);
      setInput(next === -1 ? "" : history[next] || "");
    }
  };

  const focusInput = () => inputRef.current?.focus();

  // ── Protocol click ──
  const handleProtocolClick = (proto) => {
    if (processing) return;
    pushLine({ type: "prompt", text: `connect ${proto.id}` });
    runConnect(proto);
  };

  // ── Theme classes ──
  const termBg = isDark ? "bg-black" : "bg-gray-50";
  const termBorder = isDark ? "border-gray-700" : "border-gray-300";
  const termText = isDark ? "text-green-400" : "text-gray-800";
  const headerBg = isDark ? "bg-gray-900" : "bg-gray-200";
  const footerBg = isDark ? "bg-gray-900 text-gray-500" : "bg-gray-100 text-gray-500";
  const inputBg = isDark ? "bg-transparent text-green-300" : "bg-transparent text-gray-800";
  const promptCol = isDark ? "text-green-400" : "text-green-700";

  return (
    <AtomicTransition>
      <section
        className={`w-full flex items-center justify-center py-16 px-4 ${isDark ? "bg-black" : "bg-white"}`}
        style={{ fontFamily: "'Courier New', monospace" }}
      >
        {/* Terminal window */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={`w-full max-w-3xl rounded-xl border ${termBorder} ${termBg} overflow-hidden shadow-2xl mt-12`}
          style={{ boxShadow: isDark ? "0 0 60px rgba(0,255,128,0.06)" : "0 8px 48px rgba(0,0,0,0.12)" }}
          onClick={focusInput}
        >

          {/* ── Title bar ── */}
          <div className={`flex items-center gap-3 px-4 py-3 ${headerBg} border-b ${termBorder} select-none`}>
            {/* macOS dots */}
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className={`flex-1 text-center text-xs font-semibold tracking-widest ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              SECURE_TERMINAL — social-protocols@raj:~
            </span>
            <div className={`text-[10px] px-2 py-0.5 rounded ${isDark ? "bg-green-900/50 text-green-400" : "bg-green-100 text-green-700"}`}>
              ● ENCRYPTED
            </div>
          </div>

          {/* ── Output area ── */}
          <div
            ref={scrollRef}
            className="h-[420px] overflow-y-scroll px-5 py-4 flex flex-col gap-[3px] text-sm"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <style>{`::-webkit-scrollbar { display: none; }`}</style>

            <AnimatePresence initial={false}>
              {lines.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  {line.type === "blank" ? (
                    <div className="h-2" />
                  ) : line.type === "protocol-list" ? (
                    <div className="flex flex-col gap-1 my-1">
                      {PROTOCOLS.map(p => (
                        <motion.div
                          key={p.id}
                          whileHover={{ x: 5 }}
                          transition={{ duration: 0.12 }}
                          onClick={(e) => { e.stopPropagation(); handleProtocolClick(p); }}
                          className={`flex items-center gap-2 cursor-pointer px-2 py-1 rounded transition-colors ${isDark
                              ? "hover:bg-green-900/20 hover:border-green-800"
                              : "hover:bg-teal-50 hover:border-teal-200"
                            } border border-transparent`}
                          title={`Click to connect: ${p.name}`}
                        >
                          <span className={`text-xs w-5 ${isDark ? "text-gray-600" : "text-gray-400"}`}>[{p.id}]</span>
                          <span className={`w-28 font-bold ${isDark ? "text-purple-400" : "text-purple-700"}`}>{p.label}</span>
                          <span className={`text-xs flex-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>--{p.cmd.split(" ").slice(1).join(" ")}</span>
                          <span className={`text-[10px] ${isDark ? "text-gray-600" : "text-gray-400"}`}>{p.port}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ml-2 ${isDark ? "bg-green-900/50 text-green-400" : "bg-green-100 text-green-700"}`}>
                            ● {p.status}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <TermLine line={line} isDark={isDark} />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Processing animation */}
            {processing && (
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className={`text-xs ${isDark ? "text-yellow-400" : "text-yellow-600"}`}
              >
                ▶ Processing...
              </motion.div>
            )}
          </div>

          {/* ── Input row ── */}
          <div className={`flex items-center gap-2 px-5 py-3 border-t ${termBorder} ${isDark ? "bg-gray-950/60" : "bg-gray-100/60"}`}>
            <span className={`text-sm font-bold shrink-0 ${promptCol}`}>C:\sociallinks $</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={!booted || processing}
              placeholder={booted ? "type a command..." : "booting..."}
              className={`flex-1 bg-transparent outline-none border-none text-sm ${inputBg} placeholder-gray-600 caret-green-400`}
              style={{ fontFamily: "'Courier New', monospace" }}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
            {booted && !processing && <Cursor isDark={isDark} />}
          </div>

          {/* ── Footer ── */}
          <div className={`px-5 py-2 text-[10px] tracking-widest flex items-center justify-between ${footerBg} border-t ${termBorder}`}>
            <span>SECURE_TERMINAL v2.0.1</span>
            <span className="flex gap-4">
              <span>AES-256 / TLS 1.3</span>
              <span className={isDark ? "text-green-500" : "text-green-600"}>● ENCRYPTED</span>
              <span>{PROTOCOLS.length} NODES ONLINE</span>
            </span>
          </div>

        </motion.div>
      </section>
    </AtomicTransition>
  );
}