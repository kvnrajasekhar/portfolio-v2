import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiGithub, FiLinkedin, FiMail, FiTerminal, FiShield, FiActivity, FiX } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";

// --- MOCK DATA / CONSTANTS ---
const GENESIS_ENTRY = {
  id: "SYS_00",
  user: "Rajasekhar",
  origin: "ADMIN",
  payload: "Welcome to the Genesis Block. This ledger is a decentralized proof of connection. Every signature here is cryptographically tied to a verified identity.",
  timestamp: "2026.04.07_14:30",
  isPinned: true
};

const MOCK_REGISTRY = [
  { id: "LOG_01", user: "TechRecruiter_X", origin: "LINKEDIN", payload: "The system architecture breakdown in your projects is top-tier. Connection authorized.", timestamp: "2026.04.06_18:12", isPinned: false },
  { id: "LOG_02", user: "OpenSource_Contrib", origin: "GITHUB", payload: "Clean implementation of the Framer Motion layers. Looking forward to more experiments.", timestamp: "2026.04.05_11:05", isPinned: false },
];

const hexToRgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
};

// --- SUB-COMPONENT: LEDGER ROW ---
const LedgerRow = ({ entry, isDark, isGenesis, index }) => {
  const teal = isDark ? "#5cbdb9" : "#2a9e9a";
  const gold = "#FFD700";
  const accent = isGenesis ? gold : teal;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`grid grid-cols-1 md:grid-cols-12 gap-4 p-5 items-center border-b group relative transition-colors
        ${isDark ? 'border-zinc-800/50 hover:bg-zinc-900/30' : 'border-zinc-100 hover:bg-zinc-50'}`}
    >
      {isGenesis && (
        <div className="absolute left-0 top-0 bottom-0 w-1 shadow-[0_0_10px_rgba(255,215,0,0.5)]" style={{ backgroundColor: gold }} />
      )}
      
      {/* TIMESTAMP */}
      <div className="col-span-2 font-mono text-[10px] text-zinc-500 font-bold tracking-tighter">
        [{entry.timestamp}]
      </div>
      
      {/* ORIGIN */}
      <div className="col-span-2 flex">
        <span className="text-[9px] px-2 py-0.5 rounded border font-black tracking-widest"
          style={{ 
            borderColor: `${accent}44`, 
            color: accent,
            backgroundColor: `${accent}11`
          }}>
          {entry.origin}
        </span>
      </div>

      {/* USER */}
      <div className="col-span-3 flex items-center gap-2">
        <span className={`font-black text-sm tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
          {entry.user}
        </span>
        {isGenesis && (
          <span className="text-[8px] px-1 bg-amber-400 text-black font-black rounded flex items-center gap-1">
            <FiShield size={8} /> ROOT
          </span>
        )}
      </div>

      {/* PAYLOAD */}
      <div className={`col-span-5 text-xs leading-relaxed font-medium ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
        <span className="opacity-30 mr-2" style={{ color: accent }}>{">"}</span>
        {entry.payload}
      </div>
    </motion.div>
  );
};

// --- MAIN COMPONENT ---
export default function RegistryPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [entries, setEntries] = useState([]);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [signature, setSignature] = useState("");
  const [isScanning, setIsScanning] = useState(true);

  const teal = isDark ? "#5cbdb9" : "#2a9e9a";
  const lav = "#c9b8f5";

  useEffect(() => {
    const timer = setTimeout(() => {
      setEntries([GENESIS_ENTRY, ...MOCK_REGISTRY]);
      setIsScanning(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`min-h-screen pt-32 pb-20 px-6 lg:px-20 font-mono transition-colors duration-500
      ${isDark ? 'bg-[#000000] text-white' : 'bg-[#ffffff] text-zinc-900'}`}>
      
      {/* 1. HEADER & STATS */}
      <header className="max-w-6xl mx-auto mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-[2px]" style={{ backgroundColor: teal }} />
          <h1 className="text-xs font-black tracking-[0.4em] uppercase" style={{ color: teal }}>
            System_Registry_v4.0
          </h1>
        </div>

        <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 p-8 border rounded-2xl backdrop-blur-md
          ${isDark ? 'border-zinc-800 bg-zinc-900/20' : 'border-zinc-200 bg-zinc-50/50'}`}>
          <div className="space-y-1">
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Auth_Nodes</span>
            <div className="text-xl font-black">128.00</div>
          </div>
          <div className="space-y-1">
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">System_Uptime</span>
            <div className="text-xl font-black text-green-500">99.9%</div>
          </div>
          <div className="space-y-1">
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Latest_Sync</span>
            <div className="text-xl font-black">2m ago</div>
          </div>
          <div className="space-y-1 flex flex-col justify-end">
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-2">Pulse</span>
            <div className="flex items-end gap-1 h-6">
              {[4, 7, 2, 8, 5, 9, 3, 6].map((h, i) => (
                <motion.div 
                  key={i} 
                  animate={{ height: [`${h*10}%`, `${(h+2)*8}%`, `${h*10}%`] }} 
                  transition={{ repeat: Infinity, duration: 2, delay: i * 0.1 }}
                  className="w-1 rounded-full" 
                  style={{ backgroundColor: teal }}
                />
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        {/* 2. AUTH GATE CALL TO ACTION */}
        <section className="mb-20 flex flex-col items-center text-center">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setAuthModalOpen(true)}
            className={`group relative px-10 py-5 border-2 border-dashed rounded-2xl transition-all
              ${isDark ? 'border-zinc-800 hover:border-[#5cbdb9]' : 'border-zinc-200 hover:border-[#2a9e9a]'}`}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-current" style={{ color: teal }} />
            <span className="flex items-center gap-3 text-sm font-black tracking-widest uppercase">
              <FiTerminal className="animate-pulse" />
              [ Authorize_Connection ]
            </span>
          </motion.button>
          <p className="mt-4 text-[10px] text-zinc-500 font-bold tracking-widest uppercase">
            Protocol: OAuth_2.0 // Port: 443_Secure
          </p>
        </section>

        {/* 3. STATIC ENTRIES (GENESIS) */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-black tracking-widest uppercase px-2 py-0.5 bg-amber-400 text-black">
              Static_Entries
            </span>
          </div>
          <div className={`border-2 rounded-xl overflow-hidden shadow-2xl shadow-amber-900/10
            ${isDark ? 'border-amber-900/30' : 'border-amber-100'}`}>
            {entries.filter(e => e.isPinned).map(entry => (
              <LedgerRow key={entry.id} entry={entry} isDark={isDark} isGenesis />
            ))}
          </div>
        </section>

        {/* 4. LIVE FEED */}
        <section>
          <div className="flex items-center justify-between mb-4 px-2">
            <span className="text-[10px] font-black tracking-widest uppercase text-zinc-500">
              Live_Registry_Feed
            </span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[9px] font-bold text-zinc-500 uppercase">Incoming_Stream</span>
            </div>
          </div>
          
          <div className={`border rounded-xl overflow-hidden shadow-xl
            ${isDark ? 'border-zinc-800 bg-zinc-900/10' : 'border-zinc-200 bg-white'}`}>
            
            {/* Table Header */}
            <div className={`hidden md:grid grid-cols-12 gap-4 p-4 text-[9px] font-black uppercase tracking-tighter
              ${isDark ? 'bg-zinc-900/50 text-zinc-500' : 'bg-zinc-50 text-zinc-400'}`}>
              <div className="col-span-2">TIMESTAMP</div>
              <div className="col-span-2">ORIGIN</div>
              <div className="col-span-3">IDENT_USER</div>
              <div className="col-span-5">PAYLOAD_DATA</div>
            </div>

            {isScanning ? (
              <div className="p-12 flex flex-col items-center gap-4">
                <FiActivity className="animate-spin text-zinc-700" size={24} />
                <span className="text-[10px] font-bold text-zinc-500 animate-pulse uppercase">Scanning_Database_Blocks...</span>
              </div>
            ) : (
              entries.filter(e => !e.isPinned).map((entry, i) => (
                <LedgerRow key={entry.id} entry={entry} isDark={isDark} index={i} />
              ))
            )}
          </div>
        </section>

        {/* 5. FOOTER SOURCE */}
        <footer className="mt-20 pt-10 border-t border-dashed border-zinc-800 flex flex-col items-center">
          <a 
            href="https://github.com/kvnrajasekhar" 
            target="_blank" 
            rel="noreferrer"
            className="group flex items-center gap-3 px-6 py-3 rounded-full border border-zinc-800 hover:border-white transition-all"
          >
            <FiGithub className="group-hover:rotate-12 transition-transform" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">[ View_Ledger_Source ]</span>
          </a>
          <p className="mt-6 text-[9px] text-zinc-600 font-bold uppercase tracking-[0.4em]">
            Archival_Node_01 // End_Of_Buffer
          </p>
        </footer>
      </main>

      {/* 6. AUTH MODAL & SIGNATURE INPUT */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setAuthModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md" 
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={`relative w-full max-w-xl border-2 rounded-2xl p-8 overflow-hidden
                ${isDark ? 'bg-zinc-900 border-zinc-800 shadow-2xl shadow-teal-500/5' : 'bg-white border-zinc-200 shadow-2xl'}`}
            >
              {/* Terminal Header */}
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50" />
                  </div>
                  <span className="ml-4 text-[10px] font-black uppercase text-zinc-500 tracking-widest">
                    Auth_Terminal // Session_Init
                  </span>
                </div>
                <button onClick={() => setAuthModalOpen(false)} className="hover:rotate-90 transition-transform">
                  <FiX size={18} className="text-zinc-500" />
                </button>
              </div>

              {/* Step 1: Handshake */}
              <div className="mb-10">
                <h3 className="text-xs font-black uppercase mb-4 tracking-wider" style={{ color: teal }}>1. Select_Identity_Provider</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: 'github', icon: <FiGithub />, label: 'GitHub' },
                    { id: 'linkedin', icon: <FiLinkedin />, label: 'LinkedIn' },
                    { id: 'mail', icon: <FiMail />, label: 'Email' }
                  ].map(provider => (
                    <button 
                      key={provider.id}
                      className={`flex flex-col items-center gap-3 p-4 border rounded-xl transition-all grayscale hover:grayscale-0
                        ${isDark ? 'border-zinc-800 bg-zinc-800/50 hover:bg-white hover:text-black' : 'border-zinc-100 bg-zinc-50 hover:bg-black hover:text-white'}`}
                    >
                      <div className="text-xl">{provider.icon}</div>
                      <span className="text-[9px] font-black uppercase tracking-tighter">{provider.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Payload */}
              <div>
                <h3 className="text-xs font-black uppercase mb-4 tracking-wider text-zinc-500">2. Write_Signature_Payload</h3>
                <div className={`p-4 border rounded-xl ${isDark ? 'bg-black border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                  <div className="flex items-start gap-3">
                    <span className="text-[#5cbdb9] font-black mt-1">{">"}</span>
                    <textarea 
                      value={signature}
                      onChange={(e) => setSignature(e.target.value.slice(0, 256))}
                      placeholder="Enter connection message..."
                      rows={3}
                      className="w-full bg-transparent border-none outline-none text-sm resize-none font-mono placeholder:text-zinc-700"
                    />
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-zinc-800/50">
                    <span className="text-[9px] font-bold text-zinc-600 uppercase">
                      Data_Size: {signature.length} / 256 BYTES
                    </span>
                    <button 
                      disabled={signature.length === 0}
                      className={`px-4 py-2 rounded text-[10px] font-black uppercase transition-all
                        ${signature.length > 0 
                          ? 'bg-[#5cbdb9] text-black hover:scale-105 active:scale-95' 
                          : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'}`}
                    >
                      Commit_To_Ledger
                    </button>
                  </div>
                </div>
              </div>

              {/* Background Decoration */}
              <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none select-none">
                <FiTerminal size={200} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes scan {
          from { transform: translateY(-100%); }
          to { transform: translateY(100%); }
        }
        .scan-line {
          animation: scan 3s linear infinite;
        }
      `}</style>
    </div>
  );
}