import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiGithub, FiLinkedin, FiType, FiEdit3, FiPlusCircle, FiChevronLeft, FiChevronRight, FiShield, FiUser } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";

// --- Technical Constants & Theme Mapping ---
const AUTH_PROVIDERS = [
  { id: 'github', label: 'LOGIN_WITH_GITHUB', color: '#181717', icon: <FiGithub /> },
  { id: 'linkedin', label: 'LOGIN_WITH_LINKEDIN', color: '#0077B5', icon: <FiLinkedin /> },
  { id: 'google', label: 'LOGIN_WITH_GOOGLE', color: '#4285F4', icon: <FiUser /> }
];

// --- MAIN PAGE COMPONENT ---
export default function RegistryPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  // State Management
  const [user, setUser] = useState(null); // Mock: { name: "Alex Dev", avatar: "...", entries: ["Insight 1"] }
  const [entries, setEntries] = useState([]); 
  const [isConflictModalOpen, setConflictModalOpen] = useState(false);
  const [inputText, setInputText] = useState("");

  // Logic: Fetch & Sort Ledger (Genesis -> Pinned -> Registry)
  useEffect(() => {
    // Initial fetch logic here
    const mockData = [
      { id: 'gen', user: 'Rajasekhar', role: 'ADMIN', color: '#FFD700', messages: ["Genesis Block initialized. Authorizing connections..."], timestamp: '2026.04.01', isPinned: true },
      { id: 'p1', user: 'Sarah_CTO', role: 'USER', messages: ["Scalable architecture.", "Excellent motion design."], timestamp: '2026.04.05', isPinned: true },
      { id: 'r1', user: 'Guest_99', role: 'USER', messages: ["Testing the ledger protocol."], timestamp: '2026.04.07', isPinned: false },
    ];
    setEntries(mockData);
  }, []);

  return (
    <div className={`min-h-screen pt-32 pb-20 px-6 font-mono transition-colors duration-500 
      ${isDark ? 'bg-[#030303] text-white' : 'bg-[#ffffff] text-zinc-900'}`}
      style={{ backgroundImage: `radial-gradient(${isDark ? '#111' : '#eee'} 1px, transparent 1px)`, backgroundSize: '32px 32px' }}>
      
      <div className="max-w-4xl mx-auto">
        {/* 1. AUTH / SESSION BAR */}
        <section className="mb-16">
          <AnimatePresence mode="wait">
            {!user ? (
              <motion.div 
                key="auth" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="flex flex-col md:flex-row justify-center gap-4"
              >
                {AUTH_PROVIDERS.map(p => (
                  <button 
                    key={p.id} onClick={() => setUser({ name: "Visitor_Node", entries: [] })}
                    className="px-6 py-3 border text-[10px] font-black tracking-widest transition-all hover:scale-105 active:scale-95"
                    style={{ borderColor: p.color, color: p.color }}
                  >
                    [ {p.label} ]
                  </button>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="session" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`p-4 border rounded-xl flex items-center gap-4 ${isDark ? 'border-zinc-800 bg-zinc-900/40' : 'border-zinc-200 bg-zinc-50'}`}
              >
                <div className="w-10 h-10 rounded-full border-2 border-[#5cbdb9] overflow-hidden bg-zinc-800" />
                <div className="flex-1">
                  <span className="text-[10px] text-zinc-500 font-bold block">USER_SESSION_ACTIVE</span>
                  <span className="text-sm font-black uppercase tracking-tight">{user.name}@authenticated:~$</span>
                </div>
                <button onClick={() => setConflictModalOpen(true)} className="px-4 py-2 bg-[#5cbdb9] text-black text-[10px] font-black rounded hover:opacity-90">
                   SIGN_LEDGER
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* 2. THE GLOBAL LEDGER FEED */}
        <div className="space-y-6">
          {entries.length === 0 ? (
            <div className="py-20 text-center opacity-20 font-black tracking-[0.5em] text-xl">
              WAITING_FOR_INITIAL_HANDSHAKE...
            </div>
          ) : (
            entries.map((node, i) => (
              <IdentityCard key={node.id} node={node} isDark={isDark} />
            ))
          )}
        </div>
      </div>

      {/* 3. CONFLICT MODAL */}
      <ConflictModal 
        isOpen={isConflictModalOpen} 
        onClose={() => setConflictModalOpen(false)} 
        isDark={isDark} 
        count={user?.entries?.length || 0}
      />
    </div>
  );
}

// --- SUB-COMPONENT: IDENTITY CARD (CAROUSEL LOGIC) ---
function IdentityCard({ node, isDark }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const isGenesis = node.role === 'ADMIN';
  const accent = isGenesis ? '#FFD700' : (isDark ? '#5cbdb9' : '#2a9e9a');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative border p-6 rounded-2xl transition-all
        ${isDark ? 'bg-zinc-900/20 border-zinc-800' : 'bg-white border-zinc-200'}
        ${node.isPinned && !isGenesis ? 'animate-pulse-subtle shadow-lg shadow-[#5cbdb9]/5' : ''}`}
      style={{ borderColor: node.isPinned ? `${accent}66` : undefined, borderWidth: node.isPinned ? '1.5px' : '1px' }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-800 border" style={{ borderColor: accent }} />
          <div>
            <h4 className="text-sm font-black uppercase flex items-center gap-2">
              {node.user}
              {isGenesis && <FiShield className="text-[#FFD700]" title="System Creator" />}
            </h4>
            <span className="text-[9px] text-zinc-500 font-bold tracking-widest">{node.timestamp}</span>
          </div>
        </div>
        <div className="text-[9px] font-mono text-zinc-600">LOG_ID: #{node.id.toUpperCase()} // REV_01</div>
      </div>

      {/* Carousel Body */}
      <div className="relative group px-8">
        <AnimatePresence mode="wait">
          <motion.p
            key={activeIdx}
            initial={{ opacity: 0, x: 5 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -5 }}
            className={`text-sm leading-relaxed min-h-[60px] ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}
          >
            {node.messages[activeIdx]}
          </motion.p>
        </AnimatePresence>

        {node.messages.length > 1 && (
          <>
            <button 
              onClick={() => setActiveIdx(prev => Math.max(0, prev - 1))}
              className="absolute left-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1"
            >
              <FiChevronLeft />
            </button>
            <button 
              onClick={() => setActiveIdx(prev => Math.min(node.messages.length - 1, prev + 1))}
              className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1"
            >
              <FiChevronRight />
            </button>
          </>
        )}
      </div>

      {/* Pagination Dots */}
      {node.messages.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {node.messages.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 transition-all rounded-full ${i === activeIdx ? 'w-4' : 'w-1'}`}
              style={{ backgroundColor: i === activeIdx ? accent : '#333' }}
            />
          ))}
          <span className="text-[8px] ml-2 text-zinc-600 font-bold">0{activeIdx + 1}/0{node.messages.length}</span>
        </div>
      )}
    </motion.div>
  );
}

// --- SUB-COMPONENT: CONFLICT MODAL ---
function ConflictModal({ isOpen, onClose, isDark, count }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className={`relative w-full max-w-md p-8 border rounded-2xl shadow-2xl ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}
      >
        <h3 className="text-xs font-black uppercase tracking-widest mb-4 text-[#5cbdb9]">Existing_Record_Detected</h3>
        <p className="text-sm text-zinc-500 leading-relaxed mb-8">
          You have currently utilized <span className="text-white font-bold">{count}</span> of <span className="text-white font-bold">3</span> signature slots. 
          Would you like to refine your current entry or initialize a new data point?
        </p>
        <div className="flex gap-4">
          <button className="flex-1 py-3 border border-zinc-700 text-[10px] font-black uppercase hover:bg-white hover:text-black transition-colors">
            [ EDIT_CURRENT ]
          </button>
          <button 
            disabled={count >= 3}
            className={`flex-1 py-3 text-[10px] font-black uppercase transition-colors ${count >= 3 ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' : 'bg-[#5cbdb9] text-black hover:opacity-90'}`}
          >
            [ CREATE_NEW ]
          </button>
        </div>
      </motion.div>
    </div>
  );
}