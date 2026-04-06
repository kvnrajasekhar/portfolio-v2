import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

// ─── ACTUAL RESUME DATA FROM PDF ─────────────────────────────────────────────────────
const EXPERIENCE = [
    {
        id: "software-engineer",
        company: "COGNIZANT TECHNOLOGY SOLUTIONS",
        role: "Software Engineer Trainee",
        period: "Sep 2025 – Present",
        location: "Hyderabad, India",
        tech: ["C#", "ASP.NET MVC", "SQL Server", "Oracle", "RESTful APIs", "JWT"],
        description: "Enhance and maintain full-stack enterprise applications for international financial services clients using C#, ASP.NET MVC, SQL Server, and Oracle databases, implementing RESTful APIs and backend business logic serving 100K+ daily transactions.",
        impact: {
            enabled: false,
            metrics: [
                "Reduced query execution time by 35% through indexing strategies",
                "Implemented secure authentication with OAuth and JWT principles",
                "Achieved 99.5% uptime in production deployments",
                "Served 100K+ daily transactions in financial systems"
            ]
        }
    },
    {
        id: "programmer-analyst",
        company: "COGNIZANT TECHNOLOGY SOLUTIONS",
        role: "Programmer Analyst Trainee",
        period: "Feb 2025 – Aug 2025",
        location: "Chennai, India",
        tech: ["Java", "Spring Boot", "JPA", "PostgreSQL", "Docker", "Render"],
        description: "Architected and led implementation of production-ready Food Ordering Management Platform using 3-tier design pattern with Spring Boot, JPA, and PostgreSQL database.",
        impact: {
            enabled: false,
            metrics: [
                "Engineered 15+ secure REST API endpoints",
                "Implemented JWT stateless authentication system",
                "Containerized full application stack with Docker",
                "Achieved conversion to full-time Software Engineer role"
            ]
        }
    }
];

const EDUCATION = [
    {
        id: "btech",
        institution: "R.V.R. & J.C. COLLEGE OF ENGINEERING",
        degree: "Bachelor of Technology in Computer Science and Engineering (IoT)",
        period: "2021 - 2025",
        location: "Guntur, Andhra Pradesh",
        gpa: "9.22/10.0"
    }
];

const PROJECTS = [
    {
        id: "quickfix",
        name: "QuickFix - Multilingual Service Platform",
        tech: ["React.js", "Hooks", "Context API", "Tailwind CSS", "Material-UI", "Framer Motion", "i18next", "Vercel"],
        description: "Built multilingual React.js application with real-time language switching (English, Telugu, Hindi) using i18next library and Context API state management."
    },
    {
        id: "quotes-server",
        name: "Qotes-server - Quote Sharing Social Media Backend",
        tech: ["Node.js", "Express.js", "MongoDB", "Mongoose", "Redis", "Apache Kafka", "JWT", "RESTful APIs"],
        description: "Developed scalable RESTful backend with user authentication, CRUD operations, and real-time feed generation using event-driven architecture with Kafka."
    }
];

const LEADERSHIP = [
    {
        type: "Technical Excellence",
        organization: "Hackathons & Competitive Programming",
        role: "Finalist & Winner",
        period: "2021 - 2025",
        achievements: [
            "Hacksday National Hackathon Finalist - Top 15 from 1,400+ teams",
            "Hackmela Hackathon - 2nd place in 24-hour challenge",
            "Rank 3, CodeByte Competitive Programming Contest",
            "Best Cadet 2024, 1 (A) ENGR COY NCC"
        ]
    }
];

const SKILL_RADAR = [
    { skill: "Frontend", level: 0.90 },
    { skill: "Backend", level: 0.85 },
    { skill: "Database", level: 0.80 },
    { skill: "DevOps", level: 0.75 },
    { skill: "Problem Solving", level: 0.95 },
    { skill: "Communication", level: 0.85 }
];

const CERTIFICATIONS = [
    "AWS Certified Developer Associate – In Progress (Expected: March 2026)",
    "The Complete Web Development Bootcamp – Udemy",
    "API Fundamentals Student Expert – Postman",
    "Introduction to DevOps – IBM (Coursera)",
    "Git for Beginners – Kode Kloud"
];

const TECHNICAL_SKILLS = {
    programming: ["JavaScript (ES6+)", "C#", "Java", "Python"],
    frameworks: ["React.js (Hooks, Context API)", "ASP.NET MVC", "Spring Boot", "Material-UI", "Bootstrap", "Tailwind CSS", "Framer Motion"],
    web: ["HTML5", "CSS3", "Node.js", "Express.js", "RESTful API design", "Middleware architecture", "JWT authentication"],
    databases: ["SQL Server", "Oracle", "PL/SQL", "MongoDB", "Mongoose"],
    tools: ["Git/GitHub", "Postman", "VS Code", "Docker", "GitHub Actions", "Vercel", "Render", "AWS"]
};

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function TechChip({ tech, isSelected, onClick, isDark }) {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onClick(tech)}
            className={`px-3 py-1 rounded-full text-xs font-mono transition-all duration-200 ${isSelected
                ? isDark
                    ? "bg-teal-600 text-white shadow-lg shadow-teal-600/30"
                    : "bg-teal-500 text-white shadow-lg shadow-teal-500/30"
                : isDark
                    ? "bg-gray-800 text-gray-300 border border-gray-700 hover:border-teal-600"
                    : "bg-gray-100 text-gray-700 border border-gray-300 hover:border-teal-500"
                }`}
            style={{
                fontFamily: "'Courier New', monospace",
                fontSize: "11px",
                letterSpacing: "0.05em"
            }}
        >
            {tech}
        </motion.button>
    );
}


function ExperienceCard({ exp, showImpact, isDark, onTechClick, selectedTech }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative mb-12"
        >
            <div className="border-l-2 border-teal-500 pl-8">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3
                            className={`text-xl font-black mb-1 ${isDark ? "text-white" : "text-gray-900"
                                }`}
                            style={{ fontFamily: "'Courier New', monospace" }}
                        >
                            {exp.company}
                        </h3>
                        <p
                            className={`text-sm ${isDark ? "text-teal-400" : "text-teal-600"
                                }`}
                            style={{ fontFamily: "'Courier New', monospace" }}
                        >
                            {exp.role}
                        </p>
                    </div>
                    <div className="text-right">
                        <p
                            className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"
                                }`}
                            style={{ fontFamily: "'Courier New', monospace" }}
                        >
                            {exp.period}
                        </p>
                        <p
                            className={`text-xs ${isDark ? "text-gray-500" : "text-gray-600"
                                }`}
                            style={{ fontFamily: "'Courier New', monospace" }}
                        >
                            {exp.location}
                        </p>
                    </div>
                </div>

                <p
                    className={`mb-4 ${isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                    style={{ fontFamily: "Georgia, serif", lineHeight: 1.6 }}
                >
                    {exp.description}
                </p>

                {/* Tech Chips */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {exp.tech.map(tech => (
                        <TechChip
                            key={tech}
                            tech={tech}
                            isSelected={selectedTech.includes(tech)}
                            onClick={onTechClick}
                            isDark={isDark}
                        />
                    ))}
                </div>

                {/* Impact Metrics Toggle */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => exp.impact.enabled = !exp.impact.enabled}
                        className={`text-xs font-mono px-3 py-1 rounded ${exp.impact.enabled
                            ? isDark
                                ? "bg-teal-600/20 text-teal-400 border border-teal-600/30"
                                : "bg-teal-100 text-teal-700 border border-teal-300"
                            : isDark
                                ? "bg-gray-800 text-gray-400 border border-gray-700"
                                : "bg-gray-100 text-gray-600 border border-gray-300"
                            }`}
                        style={{ fontFamily: "'Courier New', monospace" }}
                    >
                        {exp.impact.enabled ? "HIDE IMPACT" : "VIEW IMPACT"}
                    </button>

                    {exp.impact.enabled && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="space-y-2"
                        >
                            {exp.impact.metrics.map((metric, i) => (
                                <motion.p
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`text-sm font-mono ${isDark ? "text-teal-400" : "text-teal-600"
                                        }`}
                                    style={{
                                        fontFamily: "'Courier New', monospace",
                                        fontWeight: "bold"
                                    }}
                                >
                                    ► {metric}
                                </motion.p>
                            ))}
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

function LeadershipPillar({ item, isDark }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="relative mb-8"
        >
            <div className="border-l-2 border-teal-500 pl-8">
                <div className="flex items-center justify-between mb-3">
                    <h4
                        className={`text-sm font-black tracking-wider ${isDark ? "text-teal-400" : "text-teal-600"
                            }`}
                        style={{ fontFamily: "'Courier New', monospace" }}
                    >
                        {item.type}
                    </h4>
                    <span
                        className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                        style={{ fontFamily: "'Courier New', monospace" }}
                    >
                        {item.period}
                    </span>
                </div>

                <h5
                    className={`font-black mb-2 ${isDark ? "text-white" : "text-gray-900"
                        }`}
                    style={{ fontFamily: "'Courier New', monospace" }}
                >
                    {item.organization}
                </h5>

                <p
                    className={`text-sm mb-3 ${isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                    style={{ fontFamily: "'Courier New', monospace" }}
                >
                    {item.role}
                </p>

                <ul className="space-y-1">
                    {item.achievements.map((achievement, i) => (
                        <li
                            key={i}
                            className={`text-sm flex items-start ${isDark ? "text-gray-400" : "text-gray-600"
                                }`}
                            style={{ fontFamily: "'Courier New', monospace", lineHeight: 1.5 }}
                        >
                            <span className="mr-2">▸</span>
                            <span>{achievement}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </motion.div>
    );
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────────
export default function Resume() {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";
    const [selectedTech, setSelectedTech] = useState([]);
    const [viewMode, setViewMode] = useState("human"); // human | machine
    const [isGenerating, setIsGenerating] = useState(false);
    const { scrollY } = useScroll();

    const headerY = useTransform(scrollY, [0, 300], [0, -50]);
    const sectionY = useTransform(scrollY, [0, 600], [50, 0]);

    const handleTechClick = (tech) => {
        setSelectedTech(prev =>
            prev.includes(tech)
                ? prev.filter(t => t !== tech)
                : [...prev, tech]
        );
    };

    const handleDownload = () => {
        setIsGenerating(true);
        setTimeout(() => {
            const link = document.createElement('a');
            link.href = '/src/components/resume/Rajasekhar_SDE_Developer.pdf';
            link.download = 'Rajasekhar_SDE_Developer.pdf';
            link.click();
            setIsGenerating(false);
        }, 1000);
    };

    const resumeData = {
        personal: {
            name: "K.V.N. Rajasekhar",
            title: "Software Development Engineer",
            contact: "kanagalavnrajasekhar@gmail.com"
        },
        experience: EXPERIENCE,
        education: EDUCATION,
        projects: PROJECTS,
        leadership: LEADERSHIP,
        skills: SKILL_RADAR
    };

    return (
        <div
            className={`min-h-screen relative overflow-x-hidden ${isDark ? "bg-gray-950 text-white" : "bg-white text-gray-900"
                }`}
        >
            {/* Grid Overlay */}
            <div
                className="fixed inset-0 pointer-events-none"
                style={{
                    backgroundImage: `
            linear-gradient(${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} 1px, transparent 1px),
            linear-gradient(90deg, ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} 1px, transparent 1px)
          `,
                    backgroundSize: "40px 40px"
                }}
            />

            {/* Version Control Tag */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="fixed top-4 left-4 z-50"
            >
                <div
                    className={`px-3 py-1 rounded text-xs font-mono ${isDark ? "bg-gray-900 text-teal-400 border border-teal-600/30" : "bg-white text-teal-600 border border-teal-300"
                        }`}
                    style={{ fontFamily: "'Courier New', monospace" }}
                >
                    REV_2026.04 // STATUS: VERIFIED
                </div>
            </motion.div>

            {/* Floating Download Button */}
            <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownload}
                className={`fixed bottom-6 right-6 z-40 px-4 py-2 rounded-lg font-mono text-xs transition-all ${isDark
                    ? "bg-gray-900 text-teal-400 border border-teal-600/30 hover:bg-teal-600/10"
                    : "bg-white text-teal-600 border border-teal-300 hover:bg-teal-100"
                    }`}
                style={{ fontFamily: "'Courier New', monospace" }}
            >
                {isGenerating ? (
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                        <span>GENERATING...</span>
                    </div>
                ) : (
                    <span>[ COMMAND: EXPORT_AS_PDF ]</span>
                )}
            </motion.button>

            {/* Header */}
            <motion.header
                style={{ y: headerY }}
                className="relative z-10 pt-20 pb-12 text-center"
            >
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tight"
                    style={{
                        fontFamily: "'Courier New', monospace",
                        fontWeight: 100,
                        letterSpacing: "-0.02em"
                    }}
                >
                    K.V.N. RAJASEKHAR
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className={`mt-4 flex flex-col md:flex-row justify-center items-center gap-4 text-sm ${isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                    style={{ fontFamily: "'Courier New', monospace" }}
                >
                    <span>+91 63004 13643</span>
                    <span>•</span>
                    <span>Guntur, AP, India</span>
                    <span>•</span>
                    <span>kanagalavnrajasekhar@gmail.com</span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className={`mt-3 flex flex-col md:flex-row justify-center items-center gap-4 text-sm ${isDark ? "text-teal-400" : "text-teal-600"
                        }`}
                    style={{ fontFamily: "'Courier New', monospace" }}
                >
                    <a href="https://raja-eta.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:underline">
                        Portfolio: raja-eta.vercel.app
                    </a>
                    <span>•</span>
                    <a href="https://linkedin.com/in/kvnrs23" target="_blank" rel="noopener noreferrer" className="hover:underline">
                        LinkedIn: linkedin.com/in/kvnrs23
                    </a>
                    <span>•</span>
                    <a href="https://github.com/kvnrajasekhar" target="_blank" rel="noopener noreferrer" className="hover:underline">
                        GitHub: github.com/kvnrajasekhar
                    </a>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className={`mt-8 max-w-4xl mx-auto text-center ${isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                    style={{
                        fontFamily: "Georgia, serif",
                        lineHeight: 1.6,
                        fontSize: "clamp(14px, 1.5vw, 16px)"
                    }}
                >
                    <h3
                        className={`text-lg font-black mb-3 ${isDark ? "text-teal-400" : "text-teal-600"
                            }`}
                        style={{ fontFamily: "'Courier New', monospace" }}
                    >
                        PROFESSIONAL SUMMARY
                    </h3>
                    <p className="text-left">
                        Full-Stack Software Engineer with 1 year of enterprise experience building scalable applications across Java and .NET
                        ecosystems. Currently contributing to financial services systems at Cognizant using C#, ASP.NET MVC, and Oracle/SQL
                        Server databases. Proficient in RESTful API design, JWT authentication, database performance tuning, and cloud
                        deployment (Render, Vercel). Demonstrated ability to rapidly learn new technology stacks and deliver production
                        ready solutions across full software development lifecycle.
                    </p>
                </motion.div>
            </motion.header>

            {/* Technical Skills Section */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="mb-16"
            >
                <motion.h2
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className={`text-2xl font-black mb-8 ${isDark ? "text-white" : "text-gray-900"
                        }`}
                    style={{ fontFamily: "'Courier New', monospace" }}
                >
                    [ TECHNICAL SKILLS ]
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Object.entries(TECHNICAL_SKILLS).map(([category, skills]) => (
                        <motion.div
                            key={category}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className={`p-6 rounded-lg border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
                                }`}
                        >
                            <h4
                                className={`text-sm font-black mb-4 ${isDark ? "text-teal-400" : "text-teal-600"
                                    }`}
                                style={{ fontFamily: "'Courier New', monospace" }}
                            >
                                {category.toUpperCase()}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {skills.map(skill => (
                                    <TechChip
                                        key={skill}
                                        tech={skill}
                                        isSelected={selectedTech.includes(skill)}
                                        onClick={handleTechClick}
                                        isDark={isDark}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Main Content */}
            <main className="relative z-10 max-w-4xl mx-auto px-6 lg:px-12">

                {/* Experience Section */}
                <motion.section
                    style={{ y: sectionY }}
                    className="mb-20"
                >
                    <motion.h2
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className={`text-2xl font-black mb-12 ${isDark ? "text-white" : "text-gray-900"
                            }`}
                        style={{ fontFamily: "'Courier New', monospace" }}
                    >
                        [ EXPERIENCE ]
                    </motion.h2>

                    {EXPERIENCE.map(exp => (
                        <ExperienceCard
                            key={exp.id}
                            exp={exp}
                            showImpact={exp.impact.enabled}
                            isDark={isDark}
                            onTechClick={handleTechClick}
                            selectedTech={selectedTech}
                        />
                    ))}
                </motion.section>

                {/* Education Section */}
                <motion.section className="mb-20">
                    <motion.h2
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className={`text-2xl font-black mb-12 ${isDark ? "text-white" : "text-gray-900"
                            }`}
                        style={{ fontFamily: "'Courier New', monospace" }}
                    >
                        [ EDUCATION ]
                    </motion.h2>

                    {EDUCATION.map(edu => (
                        <motion.div
                            key={edu.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="relative mb-12"
                        >
                            <div className="border-l-2 border-teal-500 pl-8">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3
                                            className={`text-lg font-black ${isDark ? "text-white" : "text-gray-900"
                                                }`}
                                            style={{ fontFamily: "'Courier New', monospace" }}
                                        >
                                            {edu.institution}
                                        </h3>
                                        <p
                                            className={`text-sm ${isDark ? "text-teal-400" : "text-teal-600"
                                                }`}
                                            style={{ fontFamily: "'Courier New', monospace" }}
                                        >
                                            {edu.degree}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p
                                            className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"
                                                }`}
                                            style={{ fontFamily: "'Courier New', monospace" }}
                                        >
                                            {edu.period}
                                        </p>
                                        <p
                                            className={`text-xs ${isDark ? "text-gray-500" : "text-gray-600"
                                                }`}
                                            style={{ fontFamily: "'Courier New', monospace" }}
                                        >
                                            GPA: {edu.gpa}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.section>

                {/* Projects Section */}
                <motion.section className="mb-20">
                    <motion.h2
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className={`text-2xl font-black mb-12 ${isDark ? "text-white" : "text-gray-900"
                            }`}
                        style={{ fontFamily: "'Courier New', monospace" }}
                    >
                        [ PROJECTS ]
                    </motion.h2>

                    {PROJECTS.map(project => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className={`relative mb-12 ${selectedTech.length > 0 &&
                                project.tech.some(tech => selectedTech.includes(tech))
                                ? "ring-2 ring-teal-500 ring-opacity-50 rounded-lg p-6"
                                : ""
                                }`}
                        >
                            <div className="border-l-2 border-teal-500 pl-8">
                                <h3
                                    className={`font-black mb-2 ${isDark ? "text-white" : "text-gray-900"
                                        }`}
                                    style={{ fontFamily: "'Courier New', monospace" }}
                                >
                                    {project.name}
                                </h3>
                                <p
                                    className={`text-sm mb-4 ${isDark ? "text-gray-300" : "text-gray-700"
                                        }`}
                                    style={{ fontFamily: "Georgia, serif" }}
                                >
                                    {project.description}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {project.tech.map(tech => (
                                        <TechChip
                                            key={tech}
                                            tech={tech}
                                            isSelected={selectedTech.includes(tech)}
                                            onClick={handleTechClick}
                                            isDark={isDark}
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.section>

                {/* Leadership & Discipline Section */}
                <motion.section className="mb-20">
                    <motion.h2
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className={`text-2xl font-black mb-12 ${isDark ? "text-white" : "text-gray-900"
                            }`}
                        style={{ fontFamily: "'Courier New', monospace" }}
                    >
                        [ LEADERSHIP_DISCIPLINE ]
                    </motion.h2>

                    {LEADERSHIP.map(item => (
                        <LeadershipPillar key={item.type} item={item} isDark={isDark} />
                    ))}
                </motion.section>

                {/* View Mode Toggle */}
                <motion.section className="mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className={`p-6 rounded-lg border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
                            }`}
                    >
                        <h3
                            className={`text-sm font-black mb-4 ${isDark ? "text-teal-400" : "text-teal-600"
                                }`}
                            style={{ fontFamily: "'Courier New', monospace" }}
                        >
                            [ DATA_FORMAT ]
                        </h3>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setViewMode("human")}
                                className={`flex-1 py-2 px-3 rounded text-xs font-mono transition-all ${viewMode === "human"
                                    ? isDark
                                        ? "bg-teal-600 text-white"
                                        : "bg-teal-500 text-white"
                                    : isDark
                                        ? "bg-gray-800 text-gray-300"
                                        : "bg-gray-100 text-gray-700"
                                    }`}
                                style={{ fontFamily: "'Courier New', monospace" }}
                            >
                                Human
                            </button>
                            <button
                                onClick={() => setViewMode("machine")}
                                className={`flex-1 py-2 px-3 rounded text-xs font-mono transition-all ${viewMode === "machine"
                                    ? isDark
                                        ? "bg-teal-600 text-white"
                                        : "bg-teal-500 text-white"
                                    : isDark
                                        ? "bg-gray-800 text-gray-300"
                                        : "bg-gray-100 text-gray-700"
                                    }`}
                                style={{ fontFamily: "'Courier New', monospace" }}
                            >
                                Machine
                            </button>
                        </div>
                    </motion.div>
                </motion.section>

            </main>

            {/* JSON View (Machine Mode) */}
            <AnimatePresence>
                {viewMode === "machine" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center"
                        style={{ background: "rgba(0,0,0,0.9)" }}
                    >
                        <div className="relative w-full max-w-4xl max-h-[80vh] overflow-auto p-8">
                            <button
                                onClick={() => setViewMode("human")}
                                className="absolute top-4 right-4 text-white text-sm font-mono"
                                style={{ fontFamily: "'Courier New', monospace" }}
                            >
                                [ CLOSE ]
                            </button>
                            <pre
                                className="text-green-400 text-xs"
                                style={{
                                    fontFamily: "'Courier New', monospace",
                                    lineHeight: 1.4,
                                    whiteSpace: "pre-wrap"
                                }}
                            >
                                {JSON.stringify(resumeData, null, 2)}
                            </pre>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}