import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const CONNECTION_CRITERIA = [
    "Extreme Ownership",
    "Systemic Thinking",
    "Continuous Refinement",
    "Impact-Driven Code",
    "Discipline as Foundation"
];

const GROWTH_LOG = [
    { period: "L1 2024", achievement: "Inclusive Leadership", status: "evolving" },
    { period: "L2 2024", achievement: "Product Ownership", status: "in_progress" },
    { period: "L3 2024", achievement: "Clean Architecture Practices", status: "applied" },
    { period: "L4 2024", achievement: "Scalable System Design", status: "exploring" }
];

const AVAILABILITY_SLOTS = [
    { time: "11:00 - 17:00 IST", focus: "Enterprise Engineering", intensity: 0.9 },
    { time: "18:00 - 21:00 IST", focus: "R&D / Open Source / Networking", intensity: 0.7 },
    { time: "Weekend Bursts", focus: "Deep Architecture Sessions", intensity: 0.8 }
];

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function AlignmentParameters({ isDark }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative py-20"
        >
            {/* Background Circuit Pattern */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `
            linear-gradient(${isDark ? "rgba(92,189,185,0.1)" : "rgba(42,127,126,0.08)"} 1px, transparent 1px),
            linear-gradient(90deg, ${isDark ? "rgba(92,189,185,0.1)" : "rgba(42,127,126,0.08)"} 1px, transparent 1px)
          `,
                    backgroundSize: "40px 40px",
                    transform: "rotate(0.5deg)"
                }}
            />

            <div className="relative max-w-4xl mx-auto px-8">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-center mb-12"
                >
                    <h2
                        className="text-2xl md:text-3xl font-black tracking-tight mb-4"
                        style={{
                            fontFamily: "'Courier New', monospace",
                            color: isDark ? "rgba(255,255,255,0.9)" : "rgba(26,26,26,0.95)"
                        }}
                    >
                        [ ALIGNMENT_PARAMETERS ]
                    </h2>
                    <div
                        className="w-24 h-1 mx-auto rounded-full"
                        style={{
                            background: "linear-gradient(90deg, #5cbdb9, #c9b8f5)"
                        }}
                    />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {CONNECTION_CRITERIA.map((criteria, index) => (
                        <motion.div
                            key={criteria}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="relative group"
                        >
                            <div
                                className="p-6 rounded-lg border backdrop-blur-sm transition-all duration-300 hover:scale-105"
                                style={{
                                    background: isDark
                                        ? "rgba(255,255,255,0.03)"
                                        : "rgba(255,255,255,0.7)",
                                    borderColor: isDark
                                        ? "rgba(92,189,185,0.2)"
                                        : "rgba(42,127,126,0.3)",
                                    boxShadow: isDark
                                        ? "0 4px 20px rgba(92,189,185,0.1)"
                                        : "0 4px 20px rgba(42,127,126,0.08)"
                                }}
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div
                                        className="w-2 h-2 rounded-full"
                                        style={{
                                            background: `hsl(${170 + index * 15}, 70%, 60%)`
                                        }}
                                    />
                                    <span
                                        className="text-sm font-mono"
                                        style={{
                                            color: isDark ? "rgba(255,255,255,0.6)" : "rgba(26,26,26,0.7)",
                                            fontFamily: "'Courier New', monospace"
                                        }}
                                    >
                                        PARAM_{String(index + 1).padStart(2, '0')}
                                    </span>
                                </div>
                                <p
                                    className="font-medium"
                                    style={{
                                        color: isDark ? "rgba(255,255,255,0.85)" : "rgba(26,26,26,0.9)",
                                        fontFamily: "Georgia, serif"
                                    }}
                                >
                                    {criteria}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-12 text-center max-w-2xl mx-auto"
                    style={{
                        color: isDark ? "rgba(255,255,255,0.7)" : "rgba(26,26,26,0.78)",
                        fontFamily: "'Courier New', monospace",
                        fontSize: "0.95rem",
                        lineHeight: 1.6
                    }}
                >
                    I am looking to connect with engineers, founders, and mentors who value these principles.
                    If you believe that code is a tool for impact and that discipline is the foundation of innovation, let's sync.
                </motion.p>
            </div>
        </motion.div>
    );
}

function GrowthLog({ isDark }) {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative py-20 overflow-hidden"
        >
            {/* Animated Background Grid */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `
            repeating-linear-gradient(
              45deg,
              ${isDark ? "rgba(92,189,185,0.03)" : "rgba(42,127,126,0.04)"},
              ${isDark ? "rgba(92,189,185,0.03)" : "rgba(42,127,126,0.04)"} 10px,
              transparent 10px,
              transparent 20px
            )
          `
                }}
            />

            <div className="relative max-w-6xl mx-auto px-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h2
                        className="text-2xl md:text-3xl font-black tracking-tight mb-4"
                        style={{
                            fontFamily: "'Courier New', monospace",
                            color: isDark ? "rgba(255,255,255,0.9)" : "rgba(26,26,26,0.95)"
                        }}
                    >
                        [ GROWTH_LOG ]
                    </h2>
                    <p
                        className="text-sm font-mono opacity-70"
                        style={{
                            color: isDark ? "rgba(255,255,255,0.6)" : "rgba(26,26,26,0.7)",
                            fontFamily: "'Courier New', monospace"
                        }}
                    >
                        Work in Progress // Always Moving Forward
                    </p>
                </motion.div>

                <div className="relative">
                    {/* Timeline Line */}
                    <div
                        className="absolute left-1/2 top-0 bottom-0 w-0.5 transform -translate-x-1/2"
                        style={{
                            background: `linear-gradient(180deg, 
                ${isDark ? "rgba(92,189,185,0.3)" : "rgba(42,127,126,0.4)"} 0%, 
                transparent 100%)`
                        }}
                    />

                    <div className="space-y-12">
                        {GROWTH_LOG.map((log, index) => (
                            <motion.div
                                key={log.period}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.15 }}
                                className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                                    }`}
                                onMouseEnter={() => setActiveIndex(index)}
                            >
                                {/* Content Card */}
                                <motion.div
                                    animate={{
                                        scale: activeIndex === index ? 1.05 : 1,
                                        boxShadow: activeIndex === index
                                            ? isDark
                                                ? "0 8px 32px rgba(92,189,185,0.2)"
                                                : "0 8px 32px rgba(42,127,126,0.15)"
                                            : "none"
                                    }}
                                    className={`w-5/12 p-6 rounded-lg border backdrop-blur-sm cursor-pointer ${index % 2 === 0 ? 'mr-auto' : 'ml-auto'
                                        }`}
                                    style={{
                                        background: isDark
                                            ? "rgba(255,255,255,0.04)"
                                            : "rgba(255,255,255,0.8)",
                                        borderColor: isDark
                                            ? "rgba(92,189,185,0.2)"
                                            : "rgba(42,127,126,0.3)"
                                    }}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <span
                                            className="text-xs font-mono"
                                            style={{
                                                color: isDark ? "rgba(255,255,255,0.5)" : "rgba(26,26,26,0.6)",
                                                fontFamily: "'Courier New', monospace"
                                            }}
                                        >
                                            {log.period}
                                        </span>
                                        <motion.div
                                            animate={{
                                                scale: activeIndex === index ? [1, 1.2, 1] : 1
                                            }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div
                                                className={`w-2 h-2 rounded-full ${log.status === 'completed' ? 'bg-green-500' :
                                                    log.status === 'in_progress' ? 'bg-yellow-500' :
                                                        log.status === 'planned' ? 'bg-blue-500' :
                                                            'bg-purple-500'
                                                    }`}
                                            />
                                        </motion.div>
                                    </div>
                                    <h3
                                        className="font-medium mb-2"
                                        style={{
                                            color: isDark ? "rgba(255,255,255,0.85)" : "rgba(26,26,26,0.9)",
                                            fontFamily: "Georgia, serif"
                                        }}
                                    >
                                        {log.achievement}
                                    </h3>
                                    <span
                                        className="text-xs font-mono uppercase tracking-wider"
                                        style={{
                                            color: isDark ? "rgba(255,255,255,0.4)" : "rgba(26,26,26,0.5)",
                                            fontFamily: "'Courier New', monospace"
                                        }}
                                    >
                                        {log.status.replace('_', ' ')}
                                    </span>
                                </motion.div>

                                {/* Timeline Dot */}
                                <div
                                    className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full border-2"
                                    style={{
                                        background: isDark ? "#000000" : "#ffffff",
                                        borderColor: isDark ? "#5cbdb9" : "#2a7f7e"
                                    }}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function HandshakeProtocol({ isDark }) {
    const [isInitializing, setIsInitializing] = useState(false);

    const handleInitialize = () => {
        setIsInitializing(true);
        setTimeout(() => {
            // Open Gmail directly in browser
            const gmailUrl = "https://mail.google.com/mail/?view=cm&to=kanagalavnrajasekhar@gmail.com&su=Handshake_Requested%20//%20%5BIntent%3A%20Project%2FMentorship%2FGreeting%5D&body=Hello%20Rajasekhar%2C%0A%0AI%E2%80%99ve%20reviewed%20your%20Engineering%20Logic.%20I%E2%80%99d%20like%20to%20discuss...";
            window.open(gmailUrl, '_blank');
            setIsInitializing(false);
        }, 1500);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative py-20"
        >
            {/* Radial Gradient Background */}
            <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                    background: `radial-gradient(circle, 
            ${isDark ? "rgba(92,189,185,0.1)" : "rgba(42,127,126,0.08)"} 0%, 
            transparent 70%)`
                }}
            />

            <div className="relative max-w-4xl mx-auto px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h2
                        className="text-2xl md:text-3xl font-black tracking-tight mb-4"
                        style={{
                            fontFamily: "'Courier New', monospace",
                            color: isDark ? "rgba(255,255,255,0.9)" : "rgba(26,26,26,0.95)"
                        }}
                    >
                        [ HANDSHAKE_PROTOCOL ]
                    </h2>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="relative"
                >
                    {/* Command Terminal Frame */}
                    <div
                        className="relative p-8 rounded-xl border backdrop-blur-sm"
                        style={{
                            background: isDark
                                ? "rgba(0,0,0,0.6)"
                                : "rgba(255,255,255,0.9)",
                            borderColor: isDark
                                ? "rgba(92,189,185,0.3)"
                                : "rgba(42,127,126,0.4)",
                            boxShadow: isDark
                                ? "0 20px 60px rgba(0,0,0,0.3)"
                                : "0 20px 60px rgba(0,0,0,0.1)"
                        }}
                    >
                        {/* Terminal Header */}
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <div
                                className="ml-4 text-xs font-mono"
                                style={{
                                    color: isDark ? "rgba(255,255,255,0.4)" : "rgba(26,26,26,0.5)",
                                    fontFamily: "'Courier New', monospace"
                                }}
                            >
                                system@rajasekhar:~$
                            </div>
                        </div>

                        {/* Command Display */}
                        <div className="mb-8">
                            <motion.div
                                animate={{ opacity: isInitializing ? [1, 0.3, 1] : 1 }}
                                transition={{ duration: 0.8, repeat: isInitializing ? Infinity : 0 }}
                            >
                                <span
                                    className="text-sm font-mono"
                                    style={{
                                        color: isDark ? "rgba(92,189,185,0.9)" : "rgba(42,127,126,0.9)",
                                        fontFamily: "'Courier New', monospace"
                                    }}
                                >
                                    {isInitializing ? "> INITIALIZE_DIRECT_MAIL..." : "$ INITIALIZE_DIRECT_MAIL"}
                                </span>
                            </motion.div>

                            {isInitializing && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-2 text-left"
                                >
                                    <div
                                        className="text-xs font-mono space-y-1"
                                        style={{
                                            color: isDark ? "rgba(255,255,255,0.6)" : "rgba(26,26,26,0.7)",
                                            fontFamily: "'Courier New', monospace"
                                        }}
                                    >
                                        <div>Establishing secure connection...</div>
                                        <div>Authenticating handshake protocol...</div>
                                        <div>Opening external mail client...</div>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Initialize Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleInitialize}
                            disabled={isInitializing}
                            className="w-full py-4 px-8 rounded-lg font-mono text-sm font-black tracking-wider transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                                background: isInitializing
                                    ? isDark ? "rgba(92,189,185,0.2)" : "rgba(42,127,126,0.3)"
                                    : "linear-gradient(135deg, #5cbdb9, #c9b8f5)",
                                color: isInitializing
                                    ? isDark ? "rgba(255,255,255,0.5)" : "rgba(26,26,26,0.6)"
                                    : "#ffffff",
                                border: isInitializing
                                    ? `1px solid ${isDark ? "rgba(92,189,185,0.3)" : "rgba(42,127,126,0.4)"}`
                                    : "none",
                                fontFamily: "'Courier New', monospace"
                            }}
                        >
                            {isInitializing ? "INITIALIZING..." : "> INITIALIZE_DIRECT_MAIL"}
                        </motion.button>
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="mt-8 text-sm"
                        style={{
                            color: isDark ? "rgba(255,255,255,0.6)" : "rgba(26,26,26,0.7)",
                            fontFamily: "'Courier New', monospace"
                        }}
                    >
                        Forces interaction in your environment (Outlook/Gmail) for high-stakes communication
                    </motion.p>
                </motion.div>
            </div>
        </motion.div>
    );
}

function SystemUptime({ isDark }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative py-20"
        >
            {/* Minimal Grid Background */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `
            linear-gradient(${isDark ? "rgba(92,189,185,0.1)" : "rgba(42,127,126,0.08)"} 1px, transparent 1px),
            linear-gradient(90deg, ${isDark ? "rgba(92,189,185,0.1)" : "rgba(42,127,126,0.08)"} 1px, transparent 1px)
          `,
                    backgroundSize: "60px 60px"
                }}
            />

            <div className="relative max-w-5xl mx-auto px-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h2
                        className="text-2xl md:text-3xl font-black tracking-tight mb-4"
                        style={{
                            fontFamily: "'Courier New', monospace",
                            color: isDark ? "rgba(255,255,255,0.9)" : "rgba(26,26,26,0.95)"
                        }}
                    >
                        [ SYSTEM_UPTIME ]
                    </h2>
                    <p
                        className="text-sm font-mono opacity-70"
                        style={{
                            color: isDark ? "rgba(255,255,255,0.6)" : "rgba(26,26,26,0.7)",
                            fontFamily: "'Courier New', monospace"
                        }}
                    >
                        Peak Cognitive Hours // Maximum Value Creation
                    </p>
                </motion.div>

                <div className="space-y-6">
                    {AVAILABILITY_SLOTS.map((slot, index) => (
                        <motion.div
                            key={slot.time}
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="relative"
                        >
                            <div
                                className="p-6 rounded-lg border backdrop-blur-sm"
                                style={{
                                    background: isDark
                                        ? "rgba(255,255,255,0.03)"
                                        : "rgba(255,255,255,0.7)",
                                    borderColor: isDark
                                        ? "rgba(92,189,185,0.2)"
                                        : "rgba(42,127,126,0.3)"
                                }}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-3">
                                            <span
                                                className="text-lg font-mono font-black"
                                                style={{
                                                    color: isDark ? "rgba(92,189,185,0.9)" : "rgba(42,127,126,0.9)",
                                                    fontFamily: "'Courier New', monospace"
                                                }}
                                            >
                                                {slot.time}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className="w-1 h-4 rounded-full"
                                                        style={{
                                                            background: i < Math.floor(slot.intensity * 5)
                                                                ? isDark ? "#5cbdb9" : "#2a7f7e"
                                                                : isDark ? "rgba(92,189,185,0.2)" : "rgba(42,127,126,0.3)"
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <h3
                                            className="font-medium mb-2"
                                            style={{
                                                color: isDark ? "rgba(255,255,255,0.85)" : "rgba(26,26,26,0.9)",
                                                fontFamily: "Georgia, serif"
                                            }}
                                        >
                                            {slot.focus}
                                        </h3>
                                    </div>

                                    {/* Status Indicator */}
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.1, 1],
                                            opacity: [0.7, 1, 0.7]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            delay: index * 0.3
                                        }}
                                        className="ml-6"
                                    >
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{
                                                background: slot.intensity > 0.8
                                                    ? "#10b981"
                                                    : slot.intensity > 0.6
                                                        ? "#f59e0b"
                                                        : "#6b7280",
                                                boxShadow: `0 0 10px ${slot.intensity > 0.8
                                                    ? "#10b981"
                                                    : slot.intensity > 0.6
                                                        ? "#f59e0b"
                                                        : "#6b7280"
                                                    }`
                                            }}
                                        />
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-12 text-center max-w-2xl mx-auto"
                    style={{
                        color: isDark ? "rgba(255,255,255,0.7)" : "rgba(26,26,26,0.78)",
                        fontFamily: "'Courier New', monospace",
                        fontSize: "0.95rem",
                        lineHeight: 1.6
                    }}
                >
                    I respect your time, and I value mine. Here is when we can build the most value together.
                </motion.p>
            </div>
        </motion.div>
    );
}

function FeedbackLoop({ isDark }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative py-20"
        >
            {/* Diagonal Lines Background */}
            <div
                className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: `repeating-linear-gradient(
            45deg,
            ${isDark ? "rgba(92,189,185,0.2)" : "rgba(42,127,126,0.3)"},
            ${isDark ? "rgba(92,189,185,0.2)" : "rgba(42,127,126,0.3)"} 1px,
            transparent 1px,
            transparent 15px
          )`
                }}
            />

            <div className="relative max-w-4xl mx-auto px-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h2
                        className="text-2xl md:text-3xl font-black tracking-tight mb-4"
                        style={{
                            fontFamily: "'Courier New', monospace",
                            color: isDark ? "rgba(255,255,255,0.9)" : "rgba(26,26,26,0.95)"
                        }}
                    >
                        [ REQUEST_FOR_CRITIQUE ]
                    </h2>
                    <p
                        className="text-sm font-mono opacity-70"
                        style={{
                            color: isDark ? "rgba(255,255,255,0.6)" : "rgba(26,26,26,0.7)",
                            fontFamily: "'Courier New', monospace"
                        }}
                    >
                        Radical Candor Over Polite Praise
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="relative"
                >
                    {/* Code Review Style Box */}
                    <div
                        className="p-8 rounded-lg border backdrop-blur-sm"
                        style={{
                            background: isDark
                                ? "rgba(0,0,0,0.4)"
                                : "rgba(255,255,255,0.8)",
                            borderColor: isDark
                                ? "rgba(239,68,68,0.3)"
                                : "rgba(220,38,38,0.3)",
                            borderLeft: `4px solid ${isDark ? "#ef4444" : "#dc2626"}`
                        }}
                    >
                        <div className="flex items-start gap-4">
                            <div
                                className="text-2xl"
                                style={{
                                    color: isDark ? "#ef4444" : "#dc2626"
                                }}
                            >
                //
                            </div>
                            <div className="flex-1">
                                <h3
                                    className="font-black text-lg mb-4"
                                    style={{
                                        color: isDark ? "rgba(255,255,255,0.9)" : "rgba(26,26,26,0.95)",
                                        fontFamily: "'Courier New', monospace"
                                    }}
                                >
                                    CRITICAL_FEEDBACK_REQUESTED
                                </h3>

                                <div className="space-y-4">
                                    <p
                                        className="leading-relaxed"
                                        style={{
                                            color: isDark ? "rgba(255,255,255,0.75)" : "rgba(26,26,26,0.82)",
                                            fontFamily: "Georgia, serif"
                                        }}
                                    >
                                        If you've explored my portfolio and found a bug, a logic flaw, or a way I can optimize my code/design — tell me.
                                        I value Radical Candor over polite praise.
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                        {[
                                            { icon: "🐛", label: "Bug Report", desc: "Found an issue?" },
                                            { icon: "⚡", label: "Optimization", desc: "Can improve performance?" },
                                            { icon: "🎨", label: "Design Flaw", desc: "UX/UI feedback?" }
                                        ].map((item, index) => (
                                            <motion.div
                                                key={item.label}
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                                                className="p-4 rounded-lg border"
                                                style={{
                                                    background: isDark
                                                        ? "rgba(255,255,255,0.02)"
                                                        : "rgba(255,255,255,0.6)",
                                                    borderColor: isDark
                                                        ? "rgba(255,255,255,0.1)"
                                                        : "rgba(26,26,26,0.2)"
                                                }}
                                            >
                                                <div className="text-2xl mb-2">{item.icon}</div>
                                                <h4
                                                    className="font-mono text-sm font-black mb-1"
                                                    style={{
                                                        color: isDark ? "rgba(255,255,255,0.8)" : "rgba(26,26,26,0.9)",
                                                        fontFamily: "'Courier New', monospace"
                                                    }}
                                                >
                                                    {item.label}
                                                </h4>
                                                <p
                                                    className="text-xs"
                                                    style={{
                                                        color: isDark ? "rgba(255,255,255,0.5)" : "rgba(26,26,26,0.6)",
                                                        fontFamily: "'Courier New', monospace"
                                                    }}
                                                >
                                                    {item.desc}
                                                </p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="mt-8 text-center italic"
                        style={{
                            color: isDark ? "rgba(255,255,255,0.6)" : "rgba(26,26,26,0.7)",
                            fontFamily: "Georgia, serif"
                        }}
                    >
                        "I'm not afraid of being wrong; I'm afraid of staying the same."
                    </motion.p>
                </motion.div>
            </div>
        </motion.div>
    );
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────────
export default function ContactPage() {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <div
            className="relative min-h-screen"
            style={{
                background: isDark ? "#000000" : "#ffffff",
                transition: "background 0.4s ease"
            }}
        >
            {/* Subtle Grid Overlay */}
            <div
                className="fixed inset-0 pointer-events-none opacity-5"
                style={{
                    backgroundImage: `
            linear-gradient(${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} 1px, transparent 1px),
            linear-gradient(90deg, ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} 1px, transparent 1px)
          `,
                    backgroundSize: "100px 100px"
                }}
            />

            <div className="relative z-10">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative py-20 text-center"
                >
                    <div className="max-w-4xl mx-auto px-8">
                        <h1
                            className="text-2xl md:text-5xl lg:text-5xl font-black tracking-tight mb-6"
                            style={{
                                fontFamily: "'Courier New', monospace",
                                color: isDark ? "rgba(255,255,255,0.95)" : "rgba(26,26,26,0.98)"
                            }}
                        >
                            Protocol
                            <span
                                style={{
                                    backgroundImage: "linear-gradient(135deg, #5cbdb9, #c9b8f5)",
                                    WebkitBackgroundClip: "text",
                                    backgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    color: "transparent",
                                    display: "inline",
                                    marginLeft: "0.1em"
                                }}
                            >
                                Initialization
                            </span>
                        </h1>
                        <p
                            className="text-lg md:text-xl max-w-2xl mx-auto"
                            style={{
                                color: isDark ? "rgba(255,255,255,0.6)" : "rgba(26,26,26,0.7)",
                                fontFamily: "'Courier New', monospace"
                            }}
                        >
                            Filter for alignment // Establish connection // Build together
                        </p>
                    </div>
                </motion.div>

                {/* Sections */}
                <AlignmentParameters isDark={isDark} />
                <GrowthLog isDark={isDark} />
                <HandshakeProtocol isDark={isDark} />
                <SystemUptime isDark={isDark} />
                <FeedbackLoop isDark={isDark} />

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative py-16 text-center border-t"
                    style={{
                        borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(26,26,26,0.1)"
                    }}
                >
                    <p
                        className="text-sm font-mono"
                        style={{
                            color: isDark ? "rgba(255,255,255,0.5)" : "rgba(26,26,26,0.6)",
                            fontFamily: "'Courier New', monospace"
                        }}
                    >
            // Connection protocol initialized // Ready for handshake
                    </p>
                </motion.div>
            </div>
        </div>
    );
}