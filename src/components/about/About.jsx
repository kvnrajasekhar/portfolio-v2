import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useInView } from 'framer-motion';

// ─── SECTION DATA ────────────────────────────────────────────────────────────
const sections = [
    {
        id: 'manifesto',
        label: '01 // CORE_MANIFESTO',
        content: `"I architect for the edge case, build for the user, and scale for the future. Engineering is not just about writing code; it's about solving real-world friction with invisible, elegant logic."`,
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop',
        theme: 'primary'
    },
    {
        id: 'drive',
        label: '02 // THE_DRIVE',
        content: `The "Why" Behind the Code:\n\nI am energized by the "Chaos-to-Order" pipeline. I don't just build features; I engineer solutions that turn high-level, complex business bottlenecks into simple, high-performance systems. My goal is to bridge the gap between abstract problems and concrete, scalable reality.`,
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
        theme: 'secondary'
    },
    {
        id: 'principles',
        label: '03 // OPERATING_PRINCIPLES',
        content: `How I Work:\n\nI approach every codebase with a "Production-First" mindset, guided by three immutable laws:\n\nL1: Elastic Architecture\nSystems must be built to fail gracefully and scale effortlessly. I prioritize statelessness and modularity, ensuring that a single node failure never becomes a system-wide catastrophe.\n\nL2: Atomic Logic\nComplexity is the enemy of velocity. I advocate for breaking down dense business requirements into small, testable, and reusable units of code. If a function does more than one thing, it isn't finished.\n\nL3: Outcome-Driven Engineering\nTechnical excellence is a means, not an end. I align every technical constraint with a business objective, ensuring that every line of code adds measurable value to the end-user experience.`,
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
        theme: 'accent'
    },
    {
        id: 'sprint',
        label: '04 // CURRENT_SPRINT',
        content: `Focus & R&D:\n\nSystem Build: Architecting a high-throughput Social Media Application focused on real-time data streams and low-latency user interactions.\n\nDeep Dive: Mastering Cloud Infrastructure through the AWS Developer Associate pipeline.\n\nLeadership: Refining "Strategic Mentorship" and "Agile Ownership" through community orchestration (GDG/Codex).`,
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop',
        theme: 'primary'
    },
    {
        id: 'ecosystem',
        label: '05 // ECOSYSTEM_&_VALUES',
        content: `Collaboration:\n\nI believe in Radical Candor and Collective Ownership. I treat code reviews as a mentorship tool and documentation as a love letter to the next engineer.\n\nCore Values:\n\nExtreme Ownership: If I push the code, I own the outcome.\n\nInnovation over Ego: The best idea wins, regardless of who it came from.\n\nHonesty in Logic: Transparent communication regarding technical debt and system limitations.`,
        image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=600&fit=crop',
        theme: 'secondary'
    },
    {
        id: 'vision',
        label: '06 // VISION_&_TRAJECTORY',
        content: `My career is a deliberate path toward building Impactful Tech Products that disappear into everyday life by making it better. I am looking to join teams that value performance optimization, user-centric design, and high-integrity engineering.`,
        image: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab8986?w=800&h=600&fit=crop',
        theme: 'accent'
    },
    {
        id: 'hardware',
        label: '07 // HARDWARE_MAINTENANCE',
        content: `Beyond the IDE:\n\nI treat my personal life with the same high-standard logic I apply to my code. Consistency is the ultimate algorithm for growth.\n\nPhysical Discipline: The Gym is my laboratory for endurance and "Uptime." I believe a high-performance mind requires a high-performance vessel.\n\nAesthetic IQ: My interest in Personal Care and Fashion isn't just about appearance—it's about Visual Communication. I value attention to detail, symmetry, and the psychology of presentation in both my lifestyle and my User Interfaces.`,
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
        theme: 'primary'
    },
    {
        id: 'intellectual',
        label: '08 // THE_INTELLECTUAL_COMPASS',
        content: `Interests:\n\nWeb Development: The intersection of human psychology and high-speed data.\n\nTech Communities: Building the networks that build the future.\n\nEntrepreneurship: The ultimate problem-solving challenge—scaling a solution into a business.`,
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
        theme: 'secondary'
    },
    {
        id: 'debuglog',
        label: '09 // THE_DEBUG_LOG',
        content: `The Sweet Spot of Engineering:\n\nI am most effective when the stakes involve Efficiency and User Friction. If a system is slow or a user is confused, the architecture has failed.\n\nPerformance Optimization: I enjoy the "Millisecond Hunt"—refactoring data fetches, optimizing database indexes, and implementing caching layers (Redis/CDN) to make applications feel instantaneous.\n\nUX Engineering: I love the challenge of taking a technically complex process (like multi-factor authentication or a 5-step order flow) and making it feel like a single, seamless interaction for the human on the other side of the screen.`,
        image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&h=600&fit=crop',
        theme: 'accent'
    }
];

// ─── SPOTLIGHT CURSOR COMPONENT ─────────────────────────────────────────────
const SpotlightCursor = ({ children, isDark }) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const spotlightRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (spotlightRef.current) {
                const rect = spotlightRef.current.getBoundingClientRect();
                setMousePos({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                });
            }
        };

        const element = spotlightRef.current;
        if (element) {
            element.addEventListener('mousemove', handleMouseMove);
            return () => element.removeEventListener('mousemove', handleMouseMove);
        }
    }, []);

    return (
        <div ref={spotlightRef} className="relative">
            {/* Base dimmed layer */}
            <div className={`absolute inset-0 transition-opacity duration-300 ${isDark ? 'bg-black/40' : 'bg-white/60'
                }`} />

            {/* Spotlight gradient */}
            <div
                className="absolute pointer-events-none transition-all duration-200 ease-out"
                style={{
                    left: mousePos.x - 150,
                    top: mousePos.y - 150,
                    width: 300,
                    height: 300,
                    background: `radial-gradient(circle, ${isDark
                        ? 'rgba(255,255,255,0.15) 0%, transparent 70%'
                        : 'rgba(0,0,0,0.25) 0%, transparent 70%'
                        })`,
                    filter: 'blur(20px)'
                }}
            />

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

// ─── PARALLAX BACKGROUND TEXT ───────────────────────────────────────────────
const ParallaxWatermark = ({ scrollY, isDark }) => {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    // Responsive parallax based on screen size
    const isMobile = dimensions.width < 768;
    const isTablet = dimensions.width >= 768 && dimensions.width < 1024;

    // Adjust parallax intensity based on device
    const parallaxRange = isMobile ? [0, 100] : isTablet ? [0, 150] : [0, 200];
    const watermarkY = useTransform(scrollY, [0, 2000], parallaxRange);
    const watermarkX = useSpring(0, { stiffness: 100, damping: 20 });

    // Update dimensions on resize
    useEffect(() => {
        const updateDimensions = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * (isMobile ? 20 : 50);
            watermarkX.set(x);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [watermarkX, isMobile]);

    // Responsive font size
    const fontSize = isMobile ? '16vw' : isTablet ? '18vw' : '20vw';

    return (
        <motion.div
            className="fixed inset-0 pointer-events-none overflow-hidden flex items-center justify-center"
            style={{ y: watermarkY, x: watermarkX }}
        >
            <div
                className={`font-bold opacity-5 leading-none whitespace-nowrap ${isDark ? 'text-white' : 'text-black'
                    }`}
                style={{
                    fontFamily: 'monospace',
                    fontSize: fontSize,
                    transform: 'rotate(-5deg)'
                }}
            >
                BUILD_FOR_THE_USER
            </div>
        </motion.div>
    );
};

// ─── SECTION COMPONENT ───────────────────────────────────────────────────────
const Section = ({ section, index, scrollY, isDark, isActive }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { amount: 0.3 });
    const [imageLoaded, setImageLoaded] = useState(false);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    // Update dimensions on resize
    useEffect(() => {
        const updateDimensions = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // Responsive breakpoints
    const isMobile = dimensions.width < 768;
    const isTablet = dimensions.width >= 768 && dimensions.width < 1024;

    // Parallax effect for image
    const imageY = useTransform(scrollY, [0, 1000], [0, -50]);

    // Text reveal animation based on scroll position
    const sectionY = useTransform(scrollY, [index * 300, (index + 1) * 300], [0, 1]);

    // Responsive label sizing
    const getLabelSize = () => {
        if (isMobile) return 'text-2xl';
        if (isTablet) return 'text-4xl';
        return 'text-4xl md:text-6xl lg:text-8xl';
    };

    // Responsive layout
    const getLayoutClasses = () => {
        if (isMobile) {
            return 'flex-col';
        }
        return index % 2 === 0 ? 'flex-row' : 'flex-row-reverse';
    };

    const getLabelWidth = () => {
        if (isMobile) return 'w-full';
        if (isTablet) return 'w-2/5';
        return 'w-1/3';
    };

    const getContentWidth = () => {
        if (isMobile) return 'w-full';
        if (isTablet) return 'w-3/5';
        return 'w-2/3';
    };

    return (
        <motion.section
            ref={ref}
            className={`min-h-screen flex ${getLayoutClasses()} relative`}
        >
            {/* Left Side - Fixed Label */}
            <motion.div
                className={`${getLabelWidth()} flex items-center justify-center ${isMobile ? 'py-8' : 'sticky top-32 h-screen'
                    }`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className={`${isMobile ? 'text-center' : 'transform -rotate-90 origin-center'}`}>
                    <h2 className={`${getLabelSize()} font-bold tracking-wider whitespace-nowrap ${isDark ? 'text-gray-800' : 'text-gray-200'
                        }`} style={{ fontFamily: 'monospace' }}>
                        {section.label}
                    </h2>
                </div>
            </motion.div>

            {/* Right Side - Content */}
            <div className={`${getContentWidth()} flex items-center justify-center ${isMobile ? 'p-6' : 'p-8 md:p-16'
                }`}>
                <SpotlightCursor isDark={isDark}>
                    <motion.div
                        className={`${isMobile ? 'max-w-full' : 'max-w-3xl'} space-y-8`}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                    >
                        {/* Image */}
                        <motion.div
                            className={`relative ${isMobile ? 'h-48' : 'h-64 md:h-96'
                                } rounded-2xl overflow-hidden`}
                            style={{ y: imageY }}
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.6 }}
                        >
                            <img
                                src={section.image}
                                alt={section.label}
                                className="w-full h-full object-cover"
                                onLoad={() => setImageLoaded(true)}
                            />
                            <div className={`absolute inset-0 bg-gradient-to-t ${section.theme === 'primary'
                                    ? isDark ? 'from-blue-900/50' : 'from-blue-600/30'
                                    : section.theme === 'secondary'
                                        ? isDark ? 'from-purple-900/50' : 'from-purple-600/30'
                                        : isDark ? 'from-teal-900/50' : 'from-teal-600/30'
                                } to-transparent`} />
                        </motion.div>

                        {/* Content with sentence-by-sentence reveal */}
                        <div className={`space-y-4 ${isMobile ? 'text-base' : 'text-lg md:text-xl'
                            } leading-relaxed ${isDark ? 'text-gray-100' : 'text-gray-900'
                            }`} style={{ fontFamily: 'Georgia, serif' }}>
                            {section.content.split('\n\n').map((paragraph, pIndex) => (
                                <div key={pIndex} className="space-y-2">
                                    {paragraph.split('. ').map((sentence, sIndex) => {
                                        if (!sentence.trim()) return null;
                                        const fullSentence = sentence + (sIndex < paragraph.split('. ').length - 1 ? '. ' : '');
                                        return (
                                            <motion.p
                                                key={`${pIndex}-${sIndex}`}
                                                initial={{ opacity: 0.1 }}
                                                whileInView={{ opacity: 1 }}
                                                viewport={{ once: false, amount: 0.8 }}
                                                transition={{
                                                    duration: 0.6,
                                                    delay: (pIndex * 0.1) + (sIndex * 0.05)
                                                }}
                                                className="font-light"
                                            >
                                                {fullSentence}
                                            </motion.p>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </SpotlightCursor>
            </div>
        </motion.section>
    );
};

// ─── MAIN ABOUT COMPONENT ───────────────────────────────────────────────────
export default function About() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const scrollY = useScroll();
    const [activeSection, setActiveSection] = useState(0);

    // Track active section for potential navigation
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;
            const currentSection = Math.floor(scrollPosition / windowHeight);
            setActiveSection(Math.min(currentSection, sections.length - 1));
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className={`relative ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
            {/* Parallax Watermark Background */}
            <ParallaxWatermark scrollY={scrollY.scrollY} isDark={isDark} />

            {/* Hero Section */}
            <motion.section
                className="min-h-screen flex items-center justify-center relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <SpotlightCursor isDark={isDark}>
                    <div className="text-center max-w-4xl mx-auto px-8">
                        <motion.h1
                            className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8"
                            style={{ fontFamily: 'monospace' }}
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <span className={isDark ? 'text-gray-800' : 'text-gray-200'}>
                                THE_FLUID_MANUSCRIPT
                            </span>
                        </motion.h1>

                        <motion.p
                            className="text-xl md:text-2xl lg:text-3xl font-light mb-12"
                            style={{ fontFamily: 'Georgia, serif' }}
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            A Senior Engineer in the Making
                        </motion.p>

                        <motion.div
                            className="flex flex-col md:flex-row gap-4 justify-center"
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                            <div className={`px-6 py-3 rounded-full border ${isDark
                                ? 'border-gray-700 text-gray-300'
                                : 'border-gray-300 text-gray-700'
                                }`}>
                                <span className="font-mono text-sm">BUILD_FOR_THE_USER</span>
                            </div>
                            <div className={`px-6 py-3 rounded-full border ${isDark
                                ? 'border-gray-700 text-gray-300'
                                : 'border-gray-300 text-gray-700'
                                }`}>
                                <span className="font-mono text-sm">SCALE_FOR_THE_FUTURE</span>
                            </div>
                        </motion.div>
                    </div>
                </SpotlightCursor>
            </motion.section>

            {/* Content Sections */}
            {sections.map((section, index) => (
                <Section
                    key={section.id}
                    section={section}
                    index={index}
                    scrollY={scrollY.scrollY}
                    isDark={isDark}
                    isActive={activeSection === index}
                />
            ))}

            {/* Footer */}
            <motion.footer
                className={`py-16 text-center border-t ${isDark ? 'border-gray-800 text-gray-400' : 'border-gray-200 text-gray-600'
                    }`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <div className="max-w-4xl mx-auto px-8">
                    <motion.p
                        className="text-lg font-light mb-4"
                        style={{ fontFamily: 'Georgia, serif' }}
                    >
                        "The best code is the code you never have to write because the problem was solved before it existed."
                    </motion.p>
                    <motion.div
                        className="flex justify-center gap-8"
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <span className="font-mono text-sm">RAJASEKHAR VEMPATI</span>
                        <span className="font-mono text-sm">•</span>
                        <span className="font-mono text-sm">FULL STACK ENGINEER</span>
                        <span className="font-mono text-sm">•</span>
                        <span className="font-mono text-sm">BUILDING AT SCALE</span>
                    </motion.div>
                </div>
            </motion.footer>
        </div>
    );
}