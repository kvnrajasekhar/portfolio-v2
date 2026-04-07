import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiGithub, FiLinkedin, FiUser, FiEdit3, FiPlusCircle, FiChevronLeft, FiChevronRight, FiShield, FiTerminal, FiLogOut, FiClock } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";

// --- TECHNICAL CONSTANTS & BRAND SPECIFICATIONS ---
const AUTH_PROVIDERS = [
  {
    id: 'github',
    label: 'GITHUB_OAUTH',
    color: '#181717',
    hoverColor: '#2f2f2f',
    icon: <FiGithub />,
    endpoint: '/api/auth/github'
  },
  {
    id: 'linkedin',
    label: 'LINKEDIN_OAUTH',
    color: '#0077B5',
    hoverColor: '#005885',
    icon: <FiLinkedin />,
    endpoint: '/api/auth/linkedin'
  },
  {
    id: 'google',
    label: 'GOOGLE_OAUTH',
    color: '#4285F4',
    hoverColor: '#3367d6',
    icon: <FiUser />,
    endpoint: '/api/auth/google'
  }
];

// --- MOCK API RESPONSE STRUCTURE ---
const MOCK_API_RESPONSE = {
  status: "success",
  data: {
    users: [
      {
        id: "genesis_001",
        name: "RAJASEKHAR",
        role: "ADMIN",
        avatar: "https://avatars.githubusercontent.com/u/1?v=4",
        isGenesis: true,
        signatures: [
          {
            id: "sig_gen_001",
            content: "Genesis Block initialized. System protocols activated. Authorizing connections...",
            timestamp: "2026-04-01T00:00:00Z",
            isPinned: true,
            logId: "GEN_001"
          }
        ],
        latestSync: "2026-04-01T00:00:00Z"
      },
      {
        id: "user_002",
        name: "SARAH_CTO",
        role: "ENDORSED",
        avatar: "https://avatars.githubusercontent.com/u/2?v=4",
        isPinned: true,
        signatures: [
          {
            id: "sig_pinned_001",
            content: "Scalable architecture patterns implemented. Production-ready deployment pipeline.",
            timestamp: "2026-04-05T14:30:00Z",
            isPinned: true,
            logId: "PIN_001"
          },
          {
            id: "sig_pinned_002",
            content: "Excellent motion design and micro-interactions. Performance optimization noted.",
            timestamp: "2026-04-05T14:45:00Z",
            isPinned: true,
            logId: "PIN_002"
          }
        ],
        latestSync: "2026-04-05T14:45:00Z"
      },
      {
        id: "user_003",
        name: "ALEX_DEV",
        role: "CONTRIBUTOR",
        avatar: "https://avatars.githubusercontent.com/u/3?v=4",
        signatures: [
          {
            id: "sig_reg_001",
            content: "Testing the ledger protocol. Transaction validation successful.",
            timestamp: "2026-04-07T09:15:00Z",
            isPinned: false,
            logId: "REG_001"
          },
          {
            id: "sig_reg_002",
            content: "API integration complete. Real-time sync functioning optimally.",
            timestamp: "2026-04-07T10:30:00Z",
            isPinned: false,
            logId: "REG_002"
          },
          {
            id: "sig_reg_003",
            content: "Security audit passed. No vulnerabilities detected in current implementation.",
            timestamp: "2026-04-07T11:45:00Z",
            isPinned: false,
            logId: "REG_003"
          }
        ],
        latestSync: "2026-04-07T11:45:00Z"
      }
    ]
  }
};

// --- MAIN PAGE COMPONENT ---
export default function RegistryPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // State Management
  const [currentUser, setCurrentUser] = useState(null);
  const [registryData, setRegistryData] = useState([]);
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Fetch and sort registry data
  useEffect(() => {
    // Simulate API call
    const fetchRegistry = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Sort hierarchy: Genesis -> Pinned -> General Ledger (timestamp desc)
      const sortedData = MOCK_API_RESPONSE.data.users.sort((a, b) => {
        // Genesis always first
        if (a.isGenesis) return -1;
        if (b.isGenesis) return 1;

        // Pinned entries next
        const aHasPinned = a.signatures.some(sig => sig.isPinned);
        const bHasPinned = b.signatures.some(sig => sig.isPinned);
        if (aHasPinned && !bHasPinned) return -1;
        if (!aHasPinned && bHasPinned) return 1;

        // General ledger by latest timestamp
        return new Date(b.latestSync) - new Date(a.latestSync);
      });

      setRegistryData(sortedData);
      setIsLoading(false);
    };

    fetchRegistry();
  }, []);

  // Authentication handlers
  const handleAuth = async (provider) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock user session
      const mockUser = {
        id: "current_user",
        name: "VISITOR_NODE",
        role: "GUEST",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
        signatures: []
      };

      setCurrentUser(mockUser);
    } catch (error) {
      setAuthError("Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setInputText("");
    setIsInputModalOpen(false);
    setIsConflictModalOpen(false);
  };

  const handleSignLedger = () => {
    const userSignatures = currentUser?.signatures || [];

    if (userSignatures.length === 0) {
      // No existing entries - show input modal
      setIsInputModalOpen(true);
    } else if (userSignatures.length >= 3) {
      // Max slots reached - show conflict modal with create disabled
      setIsConflictModalOpen(true);
    } else {
      // Has existing entries but slots available - show conflict modal
      setIsConflictModalOpen(true);
    }
  };

  const handleSubmitSignature = () => {
    if (!inputText.trim()) return;

    const newSignature = {
      id: `sig_${Date.now()}`,
      content: inputText.trim(),
      timestamp: new Date().toISOString(),
      isPinned: false,
      logId: `USER_${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
    };

    // Update current user
    const updatedUser = {
      ...currentUser,
      signatures: [...currentUser.signatures, newSignature],
      latestSync: new Date().toISOString()
    };

    setCurrentUser(updatedUser);

    // Add to registry if not already present
    const userInRegistry = registryData.find(u => u.id === currentUser.id);
    if (!userInRegistry) {
      setRegistryData(prev => [...prev, updatedUser].sort((a, b) => {
        if (a.isGenesis) return -1;
        if (b.isGenesis) return 1;
        return new Date(b.latestSync) - new Date(a.latestSync);
      }));
    }

    // Reset
    setInputText("");
    setIsInputModalOpen(false);
  };

  return (
    <div className={`min-h-screen pt-32 pb-20 px-6 transition-colors duration-500 
      ${isDark ? 'bg-[#0a0a0a] text-white' : 'bg-[#fafafa] text-zinc-900'}`}
      style={{
        backgroundImage: `radial-gradient(${isDark ? '#1a1a1a' : '#e5e5e5'} 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }}>

      <div className="max-w-4xl mx-auto">
        {/* 1. HANDSHAKE PROTOCOL / USER SESSION */}
        <section className="mb-16">
          <AnimatePresence mode="wait">
            {!currentUser ? (
              <motion.div
                key="auth"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                <h2 className={`text-xs font-black uppercase tracking-widest mb-8 ${isDark ? 'text-zinc-500' : 'text-zinc-400'
                  }`}>
                  [ HANDSHAKE_PROTOCOL ]
                </h2>

                <div className="flex flex-col md:flex-row justify-center items-center gap-6">
                  {AUTH_PROVIDERS.map(provider => (
                    <motion.button
                      key={provider.id}
                      onClick={() => handleAuth(provider.id)}
                      disabled={isLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="relative px-8 py-4 border text-[10px] font-black tracking-widest transition-all duration-200 min-w-[200px]"
                      style={{
                        borderColor: provider.color,
                        color: provider.color,
                        backgroundColor: isLoading ? 'transparent' : 'transparent'
                      }}
                      onHoverStart={(e) => {
                        e.currentTarget.style.backgroundColor = provider.color + '10';
                      }}
                      onHoverEnd={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          <span>INITIALIZING...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-3">
                          <span className="text-lg">{provider.icon}</span>
                          <span>[ {provider.label} ]</span>
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>

                {authError && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 text-xs text-red-500 font-mono"
                  >
                    ERROR: {authError}
                  </motion.p>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="session"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`p-6 border rounded-xl ${isDark ? 'border-zinc-800 bg-zinc-900/40' : 'border-zinc-200 bg-zinc-50'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-12 h-12 rounded-full border-2 border-[#5cbdb9]"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-current" />
                    </div>
                    <div>
                      <span className={`text-[9px] font-bold block ${isDark ? 'text-zinc-500' : 'text-zinc-400'
                        }`}>
                        USER_SESSION_ACTIVE
                      </span>
                      <span className="text-sm font-black uppercase tracking-tight">
                        {currentUser.name}@authenticated:~$
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSignLedger}
                      className="px-4 py-2 bg-[#5cbdb9] text-black text-[10px] font-black rounded hover:opacity-90 transition-opacity"
                    >
                      <FiTerminal className="inline mr-2" />
                      SIGN_LEDGER
                    </button>
                    <button
                      onClick={handleLogout}
                      className={`px-4 py-2 border text-[10px] font-black rounded transition-colors ${isDark ? 'border-zinc-700 hover:bg-zinc-800' : 'border-zinc-300 hover:bg-zinc-100'
                        }`}
                    >
                      <FiLogOut className="inline mr-2" />
                      LOGOUT
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* 2. REGISTRY FEED */}
        <section>
          <h2 className={`text-xs font-black uppercase tracking-widest mb-8 ${isDark ? 'text-zinc-500' : 'text-zinc-400'
            }`}>
            [ REGISTRY_LEDGER ]
          </h2>

          {isLoading ? (
            <div className="py-20 text-center">
              <div className="inline-flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-[#5cbdb9] border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-mono">SYNCING_LEDGER...</span>
              </div>
            </div>
          ) : registryData.length === 0 ? (
            <div className="py-20 text-center opacity-20 font-black tracking-[0.5em] text-xl">
              WAITING_FOR_INITIAL_HANDSHAKE...
            </div>
          ) : (
            <div className="space-y-6">
              {registryData.map((user) => (
                <EntityCard
                  key={user.id}
                  user={user}
                  isDark={isDark}
                  isCurrentUser={currentUser?.id === user.id}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* 3. INPUT MODAL */}
      <InputModal
        isOpen={isInputModalOpen}
        onClose={() => setIsInputModalOpen(false)}
        onSubmit={handleSubmitSignature}
        inputText={inputText}
        setInputText={setInputText}
        isDark={isDark}
      />

      {/* 4. CONFLICT MODAL */}
      <ConflictModal
        isOpen={isConflictModalOpen}
        onClose={() => setIsConflictModalOpen(false)}
        onEdit={() => {
          setIsConflictModalOpen(false);
          setIsInputModalOpen(true);
        }}
        onCreateNew={() => {
          setIsConflictModalOpen(false);
          setIsInputModalOpen(true);
        }}
        userSignatures={currentUser?.signatures || []}
        isDark={isDark}
      />
    </div>
  );
}

// --- ENTITY CARD COMPONENT ---
function EntityCard({ user, isDark, isCurrentUser }) {
  const [activeSignatureIndex, setActiveSignatureIndex] = useState(0);
  const isGenesis = user.isGenesis;
  const hasPinned = user.signatures.some(sig => sig.isPinned);

  const accentColor = isGenesis ? '#FFD700' : (hasPinned ? '#5cbdb9' : (isDark ? '#6b7280' : '#4b5563'));

  const nextSignature = () => {
    setActiveSignatureIndex((prev) => (prev + 1) % user.signatures.length);
  };

  const prevSignature = () => {
    setActiveSignatureIndex((prev) => (prev - 1 + user.signatures.length) % user.signatures.length);
  };

  const currentSignature = user.signatures[activeSignatureIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative border p-6 rounded-2xl transition-all duration-300 ${isDark ? 'bg-zinc-900/20' : 'bg-white'
        }`}
      style={{
        borderColor: isGenesis ? accentColor : (hasPinned ? `${accentColor}66` : undefined),
        borderWidth: isGenesis ? '2px' : (hasPinned ? '1.5px' : '1px'),
        boxShadow: isGenesis ? `0 0 20px ${accentColor}20` : (hasPinned ? `0 0 10px ${accentColor}10` : undefined)
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full border-2"
              style={{ borderColor: accentColor }}
            />
            {isGenesis && (
              <div className="absolute -top-1 -right-1">
                <FiShield className="text-[#FFD700]" title="System Creator" />
              </div>
            )}
          </div>
          <div>
            <h4 className="text-sm font-black uppercase flex items-center gap-2">
              {user.name}
              {isCurrentUser && (
                <span className={`text-[8px] px-2 py-1 rounded ${isDark ? 'bg-[#5cbdb9]/20 text-[#5cbdb9]' : 'bg-[#5cbdb9]/10 text-[#2a7f7e]'
                  }`}>
                  CURRENT
                </span>
              )}
            </h4>
            <span className={`text-[9px] font-bold tracking-widest ${isDark ? 'text-zinc-500' : 'text-zinc-400'
              }`}>
              {user.role}
            </span>
          </div>
        </div>

        <div className="text-right">
          <div className={`text-[9px] font-mono ${isDark ? 'text-zinc-600' : 'text-zinc-400'
            }`}>
            LOG_ID: #{currentSignature.logId}
          </div>
          <div className={`text-[8px] font-mono flex items-center gap-1 ${isDark ? 'text-zinc-600' : 'text-zinc-400'
            }`}>
            <FiClock className="w-3 h-3" />
            {new Date(currentSignature.timestamp).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Carousel Body */}
      <div className="relative group">
        <div className="px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSignatureIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={`text-sm leading-relaxed min-h-[80px] ${isDark ? 'text-zinc-300' : 'text-zinc-700'
                }`}
              style={{ fontFamily: 'monospace' }}
            >
              {currentSignature.content}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Navigation */}
        {user.signatures.length > 1 && (
          <>
            <button
              onClick={prevSignature}
              className="absolute left-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded hover:bg-zinc-800/50"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSignature}
              className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded hover:bg-zinc-800/50"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Pagination */}
      {user.signatures.length > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          {user.signatures.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSignatureIndex(index)}
              className={`h-1 transition-all rounded-full ${index === activeSignatureIndex ? 'w-4' : 'w-1'
                }`}
              style={{
                backgroundColor: index === activeSignatureIndex ? accentColor : (isDark ? '#374151' : '#d1d5db')
              }}
            />
          ))}
          <span className={`text-[8px] ml-2 font-bold ${isDark ? 'text-zinc-600' : 'text-zinc-400'
            }`}>
            {String(activeSignatureIndex + 1).padStart(2, '0')} / {String(user.signatures.length).padStart(2, '0')}
          </span>
        </div>
      )}

      {/* Footer Metadata */}
      <div className="mt-4 pt-4 border-t border-zinc-800/50 flex justify-between items-center">
        <span className={`text-[8px] font-mono ${isDark ? 'text-zinc-600' : 'text-zinc-400'
          }`}>
          LATEST_SYNC: {new Date(user.latestSync).toLocaleString()}
        </span>
        {isGenesis && (
          <span className="text-[8px] font-mono text-[#FFD700]">
            GENESIS_BLOCK
          </span>
        )}
      </div>
    </motion.div>
  );
}

// --- INPUT MODAL COMPONENT ---
function InputModal({ isOpen, onClose, onSubmit, inputText, setInputText, isDark }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`relative w-full max-w-2xl p-8 border rounded-2xl shadow-2xl ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
          }`}
      >
        <h3 className={`text-xs font-black uppercase tracking-widest mb-6 text-[#5cbdb9]`}>
          [ SIGNATURE_INPUT ]
        </h3>

        <div className="space-y-4">
          <div className={`p-4 rounded-lg border font-mono text-xs ${isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-200'
            }`}>
            <span className={isDark ? 'text-zinc-500' : 'text-zinc-400'}>$ </span>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter your signature message..."
              className={`flex-1 bg-transparent outline-none ${isDark ? 'text-white' : 'text-zinc-900'
                }`}
              style={{ fontFamily: 'monospace' }}
              autoFocus
            />
          </div>

          <div className="flex justify-between items-center">
            <span className={`text-[10px] font-mono ${isDark ? 'text-zinc-500' : 'text-zinc-400'
              }`}>
              Characters: {inputText.length}/280
            </span>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className={`px-4 py-2 border text-[10px] font-black uppercase transition-colors ${isDark ? 'border-zinc-700 hover:bg-zinc-800' : 'border-zinc-300 hover:bg-zinc-100'
                  }`}
              >
                [ CANCEL ]
              </button>
              <button
                onClick={onSubmit}
                disabled={!inputText.trim()}
                className={`px-4 py-2 text-[10px] font-black uppercase transition-colors ${!inputText.trim()
                    ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                    : 'bg-[#5cbdb9] text-black hover:opacity-90'
                  }`}
              >
                [ SUBMIT_SIGNATURE ]
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// --- CONFLICT MODAL COMPONENT ---
function ConflictModal({ isOpen, onClose, onEdit, onCreateNew, userSignatures, isDark }) {
  if (!isOpen) return null;

  const slotsUsed = userSignatures.length;
  const slotsRemaining = 3 - slotsUsed;
  const canCreateNew = slotsRemaining > 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`relative w-full max-w-md p-8 border rounded-2xl shadow-2xl ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
          }`}
      >
        <h3 className={`text-xs font-black uppercase tracking-widest mb-4 text-[#5cbdb9]`}>
          [ EXISTING_RECORD_DETECTED ]
        </h3>

        <div className="space-y-4">
          <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-700'
            }`}>
            You have currently utilized <span className="text-[#5cbdb9] font-bold">{slotsUsed}</span> of <span className="text-[#5cbdb9] font-bold">3</span> signature slots.
          </p>

          <div className={`p-3 rounded-lg border text-[10px] font-mono ${isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-200'
            }`}>
            <div className="flex justify-between items-center">
              <span>SLOTS_AVAILABLE:</span>
              <span className={canCreateNew ? 'text-green-500' : 'text-red-500'}>
                {slotsRemaining}/3
              </span>
            </div>
          </div>

          <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'
            }`}>
            Would you like to refine your current entry or initialize a new data point?
          </p>

          <div className="flex gap-3">
            <button
              onClick={onEdit}
              className={`flex-1 py-3 border text-[10px] font-black uppercase transition-colors ${isDark ? 'border-zinc-700 hover:bg-zinc-800' : 'border-zinc-300 hover:bg-zinc-100'
                }`}
            >
              <FiEdit3 className="inline mr-2" />
              [ EDIT_CURRENT ]
            </button>
            <button
              onClick={onCreateNew}
              disabled={!canCreateNew}
              className={`flex-1 py-3 text-[10px] font-black uppercase transition-colors ${!canCreateNew
                  ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                  : 'bg-[#5cbdb9] text-black hover:opacity-90'
                }`}
            >
              <FiPlusCircle className="inline mr-2" />
              [ CREATE_NEW ]
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}