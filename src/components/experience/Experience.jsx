import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

// Import your profile images
import bestCadetImage from "../../assets/ncc/best-cadet.jpg";
import certificateA from "../../assets/ncc/certificate-a.jpg";
import certificateB from "../../assets/ncc/certificate-b.jpg";
import certificateC from "../../assets/ncc/certificate-c.jpg";
import nccSocial1 from "../../assets/ncc/ncc-social-1.jpg";
import nccSocial2 from "../../assets/ncc/ncc-social-2.jpg";
import gdgWorkshop1 from "../../assets/gdg/gdg-workshop-1.jpg";
import gdgWorkshop2 from "../../assets/gdg/gdg-workshop-2.jpg";
import codexCompetition1 from "../../assets/codex/codex-competition-1.jpg";
import codexCompetition2 from "../../assets/codex/codex-competition-2.jpg";
import codexCompetition3 from "../../assets/codex/codex-competition-3.jpg";

// Professional Experience Data
const PROFESSIONAL_EXPERIENCE = [
    {
        id: "cognizant-se-2025",
        company: "Cognizant Technology Solutions",
        role: "Software Engineer Trainee",
        period: "Sep 2025 – Present",
        location: "Hyderabad, India",
        type: "professional",
        achievements: [
            "BI Data Pipeline Management: Architect and maintain critical data synchronization layer using Microsoft Access as middleware",
            "Database Optimization: Design and optimize Oracle SQL schemas for accurate BI customer reports",
            "Business Intelligence: Translate client requirements into functional database updates with 99.5% system uptime",
            "Scrum Process: Active participation in agile ceremonies with cross-functional collaboration"
        ],
        skills: ["Java", "Spring Boot", "Oracle SQL", "Microsoft Access", "BI Tools", "Agile", "Scrum"]
    },
    {
        id: "cognizant-pa-2025",
        company: "Cognizant Technology Solutions",
        role: "Programmer Analyst Trainee",
        period: "Feb 2025 – Aug 2025",
        location: "Chennai, India",
        type: "professional",
        achievements: [
            "Full-stack platform development using 3-tier architecture with Spring Boot, JPA, and PostgreSQL",
            "REST API ecosystem with 15+ endpoints implementing JWT authentication and role-based authorization",
            "Containerization and deployment to Render Cloud with Docker orchestration",
            "Completed intensive training program achieving conversion to full-time Software Engineer role"
        ],
        skills: ["Java", "Spring Boot", "JPA", "PostgreSQL", "REST APIs", "JWT", "Docker", "Render Cloud"]
    }
];

// Hackathon Experience Data
const HACKATHON_EXPERIENCE = [
    {
        id: "hackmela-2024",
        name: "Hackmela @KKR & KSR Institute",
        period: "2024",
        location: "Guntur, India",
        type: "hackathon",
        position: "2nd Prize",
        description: "48-hour intensive hackathon with 1400+ participating teams",
        skills: ["Full-stack Development", "Problem Solving", "Team Leadership"]
    },
    {
        id: "udvikash-2024",
        name: "Udvikash 24 Hour Hackathon",
        period: "2024",
        location: "Guntur, India",
        type: "hackathon",
        position: "Top 10",
        description: "24-hour non-stop coding competition",
        skills: ["Rapid Prototyping", "Backend Development", "Time Management"]
    },
    {
        id: "smvec-2024",
        name: "National 48-Hour Hackathon @SMVEC",
        period: "2024",
        location: "Pondicherry, India",
        type: "hackathon",
        position: "Shortlisted among 1400 teams",
        description: "National level competition with teams from across India",
        skills: ["System Architecture", "Database Design", "Performance Optimization"]
    }
];

// NCC Experience Data with Leadership Journey
const NCC_EXPERIENCE = {
    journey: [
        {
            rank: "Cadet",
            period: "Sep 2022 - Jul 2023",
            unit: "1 (Andhra) ENGR COY NCC, Guntur",
            achievements: ["Joined NCC as Cadet", "Basic military training completion"]
        },
        {
            rank: "Lance Corporal",
            period: "Jul 2023 - Feb 2024",
            unit: "1 (Andhra) ENGR COY NCC, Guntur",
            achievements: ["Promotion to Lance Corporal", "Leadership skills development"]
        },
        {
            rank: "Corporal",
            period: "Feb 2024 - Nov 2024",
            unit: "1 (Andhra) ENGR COY NCC, Guntur",
            achievements: ["Advanced training completion", "Team coordination responsibilities"]
        },
        {
            rank: "Sergeant",
            period: "Nov 2024 - Feb 2025",
            unit: "1 (Andhra) ENGR COY NCC, Guntur",
            achievements: ["Promotion to Sergeant", "Senior leadership role", "Mentoring junior cadets"]
        }
    ],
    certificates: [
        { id: "cert-a", name: "NCC Certificate A", image: certificateA },
        { id: "cert-b", name: "NCC Certificate B", image: certificateB },
        { id: "cert-c", name: "NCC Certificate C", image: certificateC }
    ],
    socialActivities: [
        { id: "social-1", name: "Republic Day Camp", description: "Inter-group competition at Hyderabad", image: nccSocial1 },
        { id: "social-2", name: "National Camp Participation", description: "Advanced Leadership Camp at Rourkela, Odisha", image: nccSocial2 }
    ],
    awards: [
        { id: "best-cadet", name: "Best Cadet Award 2024", issuer: "Guntur Group HQ", image: bestCadetImage }
    ]
};

// Extracurricular Activities Data
const EXTRACURRICULAR = [
    {
        id: "gdg-2024",
        name: "Google Developer Groups",
        role: "Co-Organizer",
        period: "Aug 2024 - Jul 2025",
        organization: "RVR&JC CE, Guntur",
        link: "https://gdg.community.dev/gdg-on-campus-rvr-jccollege-of-engineering-guntur-india/",
        type: "extracurricular",
        achievements: [
            "Conducted technical workshops on web development",
            "Organized online webinars for students",
            "Built community of 200+ student developers",
            "Collaborated with Google Developer Relations team"
        ],
        images: [gdgWorkshop1, gdgWorkshop2],
        skills: ["Community Building", "Technical Training", "Event Management"]
    },
    {
        id: "codex-2023",
        name: "Codex",
        role: "President",
        period: "Aug 2023 - Sep 2024",
        organization: "Code-x, RVR&JC CE, Guntur",
        type: "extracurricular",
        achievements: [
            "Led technical club of 50+ members",
            "Organized web development competitions",
            "Conducted student teaching sessions",
            "Increased club membership by 40%"
        ],
        images: [codexCompetition1, codexCompetition2, codexCompetition3],
        skills: ["Leadership", "Technical Training", "Event Management", "Web Development"]
    }
];

// ── COMPONENTS ────────────────────────────────────────────────────────────────

// Timeline Component for Career Progression
function Timeline({ experiences, isDark }) {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            marginBottom: 48
        }}>
            <h3 style={{
                fontSize: "clamp(18px, 2.5vw, 28px)",
                fontWeight: 800,
                color: isDark ? "#fbe3e8" : "#5cbdb9",
                marginBottom: 32,
                textAlign: "center",
                letterSpacing: "0.05em"
            }}>
                Career Journey Timeline
            </h3>

            <div style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                gap: 16
            }}>
                {experiences.map((exp, index) => (
                    <motion.div
                        key={exp.id}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        style={{
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                            gap: 16
                        }}
                    >
                        {/* Timeline Node */}
                        <div style={{
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            background: isDark ? "#fbe3e8" : "#5cbdb9",
                            flexShrink: 0,
                            boxShadow: `0 0 0 4px ${isDark ? "#fbe3e833" : "#5cbdb933"}`
                        }} />

                        {/* Timeline Line */}
                        {index < experiences.length - 1 && (
                            <div style={{
                                flex: 1,
                                height: 2,
                                background: isDark ? "rgba(251, 227, 232, 0.3)" : "rgba(92, 189, 185, 0.3)"
                            }} />
                        )}

                        {/* Content */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setActiveIndex(index)}
                            style={{
                                flex: 1,
                                padding: 20,
                                borderRadius: 12,
                                background: isDark ? "rgba(255,255,255,0.05)" : "rgba(92,189,185,0.08)",
                                border: `1px solid ${isDark ? "rgba(251,227,232,0.2)" : "rgba(92,189,185,0.2)"}`,
                                cursor: "pointer",
                                transition: "all 0.3s ease"
                            }}
                        >
                            <h4 style={{
                                fontSize: 16,
                                fontWeight: 700,
                                color: isDark ? "#fbe3e8" : "#5cbdb9",
                                marginBottom: 8
                            }}>
                                {exp.company || exp.name}
                            </h4>
                            <p style={{
                                fontSize: 14,
                                fontWeight: 600,
                                color: isDark ? "rgba(255,255,255,0.8)" : "rgba(10,18,18,0.8)",
                                marginBottom: 4
                            }}>
                                {exp.role}
                            </p>
                            <p style={{
                                fontSize: 12,
                                color: isDark ? "rgba(255,255,255,0.6)" : "rgba(10,18,18,0.6)"
                            }}>
                                {exp.period} | {exp.location}
                            </p>
                        </motion.div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

// Professional Experience Card
function ProfessionalCard({ experience, isDark }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            style={{
                background: isDark ? "rgba(255,255,255,0.03)" : "rgba(92,189,185,0.06)",
                border: `1px solid ${isDark ? "rgba(251,227,232,0.2)" : "rgba(92,189,185,0.2)"}`,
                borderRadius: 16,
                padding: 32,
                marginBottom: 24,
                position: "relative",
                overflow: "hidden"
            }}
        >
            {/* Header */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 20
            }}>
                <div>
                    <h3 style={{
                        fontSize: "clamp(18px, 2.2vw, 24px)",
                        fontWeight: 800,
                        color: isDark ? "#fbe3e8" : "#5cbdb9",
                        marginBottom: 4
                    }}>
                        {experience.company}
                    </h3>
                    <p style={{
                        fontSize: "clamp(14px, 1.6vw, 18px)",
                        fontWeight: 600,
                        color: isDark ? "rgba(255,255,255,0.8)" : "rgba(10,18,18,0.8)",
                        marginBottom: 4
                    }}>
                        {experience.role}
                    </p>
                    <p style={{
                        fontSize: 13,
                        color: isDark ? "rgba(251,227,232,0.7)" : "#5cbdb9",
                        display: "flex",
                        alignItems: "center",
                        gap: 8
                    }}>
                        <span>{experience.period}</span>
                        <span>•</span>
                        <span>{experience.location}</span>
                    </p>
                </div>

                {/* Expand Button */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    style={{
                        background: "none",
                        border: `1px solid ${isDark ? "rgba(251,227,232,0.3)" : "rgba(92,189,185,0.3)"}`,
                        borderRadius: 8,
                        padding: "8px 12px",
                        cursor: "pointer",
                        color: isDark ? "#fbe3e8" : "#5cbdb9",
                        fontSize: 12,
                        transition: "all 0.3s ease"
                    }}
                >
                    {isExpanded ? "−" : "+"}
                </button>
            </div>

            {/* Achievements */}
            <motion.div
                animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                style={{
                    overflow: "hidden"
                }}
            >
                <div style={{ marginTop: 16 }}>
                    <h4 style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: isDark ? "#fbe3e8" : "#5cbdb9",
                        marginBottom: 12
                    }}>
                        Key Achievements
                    </h4>
                    <ul style={{
                        margin: 0,
                        paddingLeft: 20,
                        color: isDark ? "rgba(255,255,255,0.7)" : "rgba(10,18,18,0.7)"
                    }}>
                        {experience.achievements.map((achievement, index) => (
                            <li key={index} style={{ marginBottom: 8 }}>
                                {achievement}
                            </li>
                        ))}
                    </ul>
                </div>
            </motion.div>

            {/* Skills Tags */}
            <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginTop: 20
            }}>
                {experience.skills.map(skill => (
                    <span key={skill} style={{
                        fontSize: 12,
                        fontWeight: 600,
                        padding: "6px 12px",
                        borderRadius: 20,
                        background: isDark ? "rgba(251,227,232,0.15)" : "rgba(92,189,185,0.15)",
                        color: isDark ? "#fbe3e8" : "#5cbdb9",
                        border: `1px solid ${isDark ? "rgba(251,227,232,0.3)" : "rgba(92,189,185,0.3)"}`
                    }}>
                        {skill}
                    </span>
                ))}
            </div>
        </motion.div>
    );
}

// Photo Gallery Component
function PhotoGallery({ images, title, isDark }) {
    const [selectedImage, setSelectedImage] = useState(null);

    return (
        <div style={{ marginBottom: 32 }}>
            <h3 style={{
                fontSize: "clamp(16px, 2vw, 20px)",
                fontWeight: 700,
                color: isDark ? "#fbe3e8" : "#5cbdb9",
                marginBottom: 16,
                textAlign: "center"
            }}>
                {title}
            </h3>

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 16,
                marginBottom: 16
            }}>
                {images.map((image, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setSelectedImage(image)}
                        style={{
                            borderRadius: 12,
                            overflow: "hidden",
                            cursor: "pointer",
                            aspectRatio: "4/3",
                            background: isDark ? "rgba(255,255,255,0.05)" : "rgba(92,189,185,0.08)"
                        }}
                    >
                        <img
                            src={image}
                            alt={`${title} ${index + 1}`}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                transition: "transform 0.3s ease"
                            }}
                        />
                    </motion.div>
                ))}
            </div>

            {/* LinkedIn Button */}
            <div style={{ textAlign: "center" }}>
                <motion.a
                    href="https://www.linkedin.com/in/kvnrs23/"
                    target="_blank"
                    whileHover={{ scale: 1.05 }}
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "12px 24px",
                        borderRadius: 25,
                        background: isDark ? "#fbe3e8" : "#5cbdb9",
                        color: isDark ? "#010101" : "#ffffff",
                        textDecoration: "none",
                        fontWeight: 600,
                        fontSize: 14,
                        transition: "all 0.3s ease"
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 3a2 2 0 0 0-2 2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5m-7 2L9 9l-3 3m6-4v4h4v-4l-3-3z" />
                    </svg>
                    View LinkedIn Posts
                </motion.a>
            </div>

            {/* Image Modal */}
            {selectedImage && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedImage(null)}
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.8)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                        cursor: "pointer"
                    }}
                >
                    <motion.img
                        src={selectedImage}
                        alt="Enlarged view"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        style={{
                            maxWidth: "90vw",
                            maxHeight: "90vh",
                            borderRadius: 12,
                            boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
                        }}
                    />
                </motion.div>
            )}
        </div>
    );
}

// NCC Leadership Journey Component
function NCCJourney({ nccData, isDark }) {
    const [activeRank, setActiveRank] = useState(null);

    return (
        <div style={{ marginBottom: 48 }}>
            <h3 style={{
                fontSize: "clamp(20px, 2.5vw, 28px)",
                fontWeight: 800,
                color: isDark ? "#fbe3e8" : "#5cbdb9",
                marginBottom: 32,
                textAlign: "center",
                letterSpacing: "0.05em"
            }}>
                NCC Leadership Journey
            </h3>

            {/* Rank Progression */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: 20,
                marginBottom: 32
            }}>
                {nccData.journey.map((rank, index) => (
                    <motion.div
                        key={rank.rank}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.15 }}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setActiveRank(activeRank === rank.rank ? null : rank.rank)}
                        style={{
                            padding: 24,
                            borderRadius: 12,
                            background: isDark ? "rgba(255,255,255,0.03)" : "rgba(92,189,185,0.06)",
                            border: `2px solid ${isDark ? "rgba(251,227,232,0.3)" : "rgba(92,189,185,0.3)"}`,
                            cursor: "pointer",
                            position: "relative",
                            transition: "all 0.3s ease"
                        }}
                    >
                        {/* Rank Badge */}
                        <div style={{
                            position: "absolute",
                            top: -10,
                            right: -10,
                            background: isDark ? "#fbe3e8" : "#5cbdb9",
                            color: isDark ? "#010101" : "#ffffff",
                            padding: "4px 8px",
                            borderRadius: 12,
                            fontSize: 11,
                            fontWeight: 700
                        }}>
                            {rank.rank}
                        </div>

                        <h4 style={{
                            fontSize: 16,
                            fontWeight: 700,
                            color: isDark ? "#fbe3e8" : "#5cbdb9",
                            marginBottom: 8
                        }}>
                            {rank.rank}
                        </h4>
                        <p style={{
                            fontSize: 13,
                            color: isDark ? "rgba(251,227,232,0.7)" : "#5cbdb9",
                            marginBottom: 4
                        }}>
                            {rank.period}
                        </p>
                        <p style={{
                            fontSize: 12,
                            color: isDark ? "rgba(255,255,255,0.6)" : "rgba(10,18,18,0.6)"
                        }}>
                            {rank.unit}
                        </p>

                        {/* Achievements */}
                        {activeRank === rank.rank && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                style={{
                                    marginTop: 12,
                                    paddingTop: 12,
                                    borderTop: `1px solid ${isDark ? "rgba(251,227,232,0.2)" : "rgba(92,189,185,0.2)"}`
                                }}
                            >
                                <h5 style={{
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: isDark ? "#fbe3e8" : "#5cbdb9",
                                    marginBottom: 8
                                }}>
                                    Key Achievements
                                </h5>
                                <ul style={{
                                    margin: 0,
                                    paddingLeft: 16,
                                    color: isDark ? "rgba(255,255,255,0.7)" : "rgba(10,18,18,0.7)"
                                }}>
                                    {rank.achievements.map((achievement, idx) => (
                                        <li key={idx} style={{ marginBottom: 6 }}>
                                            {achievement}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Awards and Certificates */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 24
            }}>
                <PhotoGallery
                    images={[nccData.awards[0].image]}
                    title="Awards"
                    isDark={isDark}
                />
                <PhotoGallery
                    images={nccData.certificates.map(cert => cert.image)}
                    title="Certificates"
                    isDark={isDark}
                />
                <PhotoGallery
                    images={nccData.socialActivities.map(activity => activity.image)}
                    title="Social Activities"
                    isDark={isDark}
                />
            </div>
        </div>
    );
}

// Hackathon Experience Component
function HackathonSection({ hackathons, isDark }) {
    return (
        <div style={{ marginBottom: 48 }}>
            <h3 style={{
                fontSize: "clamp(20px, 2.5vw, 28px)",
                fontWeight: 800,
                color: isDark ? "#fbe3e8" : "#5cbdb9",
                marginBottom: 32,
                textAlign: "center",
                letterSpacing: "0.05em"
            }}>
                Hackathon Achievements
            </h3>

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: 24
            }}>
                {hackathons.map((hackathon, index) => (
                    <motion.div
                        key={hackathon.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{
                            scale: 1.03,
                            boxShadow: isDark ? "0 10px 30px rgba(251,227,232,0.2)" : "0 10px 30px rgba(92,189,185,0.2)"
                        }}
                        style={{
                            padding: 28,
                            borderRadius: 16,
                            background: isDark ? "rgba(255,255,255,0.03)" : "rgba(92,189,185,0.06)",
                            border: `1px solid ${isDark ? "rgba(251,227,232,0.2)" : "rgba(92,189,185,0.2)"}`,
                            position: "relative"
                        }}
                    >
                        {/* Achievement Badge */}
                        <div style={{
                            position: "absolute",
                            top: -12,
                            right: -12,
                            background: `linear-gradient(135deg, ${isDark ? "#fbe3e8" : "#5cbdb9"}, ${isDark ? "#c9b8f5" : "#e05050"})`,
                            color: "#ffffff",
                            padding: "6px 12px",
                            borderRadius: 20,
                            fontSize: 11,
                            fontWeight: 700,
                            boxShadow: `0 4px 12px ${isDark ? "rgba(251,227,232,0.3)" : "rgba(92,189,185,0.3)"}`
                        }}>
                            {hackathon.position}
                        </div>

                        <h4 style={{
                            fontSize: "clamp(16px, 2vw, 20px)",
                            fontWeight: 700,
                            color: isDark ? "#fbe3e8" : "#5cbdb9",
                            marginBottom: 12
                        }}>
                            {hackathon.name}
                        </h4>
                        <p style={{
                            fontSize: 13,
                            color: isDark ? "rgba(251,227,232,0.7)" : "#5cbdb9",
                            marginBottom: 8
                        }}>
                            {hackathon.location} • {hackathon.period}
                        </p>
                        <p style={{
                            fontSize: 12,
                            color: isDark ? "rgba(255,255,255,0.6)" : "rgba(10,18,18,0.6)",
                            marginBottom: 16,
                            lineHeight: 1.5
                        }}>
                            {hackathon.description}
                        </p>

                        {/* Skills */}
                        <div style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 6
                        }}>
                            {hackathon.skills.map(skill => (
                                <span key={skill} style={{
                                    fontSize: 11,
                                    fontWeight: 600,
                                    padding: "4px 8px",
                                    borderRadius: 12,
                                    background: isDark ? "rgba(251,227,232,0.15)" : "rgba(92,189,185,0.15)",
                                    color: isDark ? "#fbe3e8" : "#5cbdb9"
                                }}>
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

// Extracurricular Activities Component
function ExtracurricularSection({ activities, isDark }) {
    return (
        <div style={{ marginBottom: 48 }}>
            <h3 style={{
                fontSize: "clamp(20px, 2.5vw, 28px)",
                fontWeight: 800,
                color: isDark ? "#fbe3e8" : "#5cbdb9",
                marginBottom: 32,
                textAlign: "center",
                letterSpacing: "0.05em"
            }}>
                Leadership & Community
            </h3>

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
                gap: 32
            }}>
                {activities.map((activity, index) => (
                    <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.15 }}
                        whileHover={{ y: -5 }}
                        style={{
                            padding: 32,
                            borderRadius: 16,
                            background: isDark ? "rgba(255,255,255,0.03)" : "rgba(92,189,185,0.06)",
                            border: `1px solid ${isDark ? "rgba(251,227,232,0.2)" : "rgba(92,189,185,0.2)"}`,
                            position: "relative"
                        }}
                    >
                        <h4 style={{
                            fontSize: "clamp(18px, 2.2vw, 22px)",
                            fontWeight: 700,
                            color: isDark ? "#fbe3e8" : "#5cbdb9",
                            marginBottom: 12
                        }}>
                            {activity.name}
                        </h4>
                        <p style={{
                            fontSize: 13,
                            color: isDark ? "rgba(251,227,232,0.7)" : "#5cbdb9",
                            marginBottom: 8
                        }}>
                            {activity.role} • {activity.organization}
                        </p>
                        <p style={{
                            fontSize: 12,
                            color: isDark ? "rgba(255,255,255,0.6)" : "rgba(10,18,18,0.6)",
                            marginBottom: 16
                        }}>
                            {activity.period}
                        </p>

                        {/* Link */}
                        {activity.link && (
                            <motion.a
                                href={activity.link}
                                target="_blank"
                                whileHover={{ scale: 1.05 }}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 6,
                                    padding: "8px 16px",
                                    borderRadius: 20,
                                    background: isDark ? "#fbe3e8" : "#5cbdb9",
                                    color: isDark ? "#010101" : "#ffffff",
                                    textDecoration: "none",
                                    fontWeight: 600,
                                    fontSize: 12,
                                    transition: "all 0.3s ease"
                                }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48v2.05c0 1.41.91 2.72 2.72l5.67 5.67c.59.59 1.41.59 2.72V17c0 1.1-.9 2-2 2s-2-.9-2-2zm0 13.5c0 1.1.9 2 2s2 .9 2 2 .9-2 2zm-2-15.5c0-1.1-.9-2-2-2s-.9-2-2-2 .9-2 2-2zm0 4.5c0 1.1.9 2 2s2-.9 2-2 .9-2 2-2z" />
                                </svg>
                                Visit Community
                            </motion.a>
                        )}

                        {/* Achievements */}
                        <div style={{ marginTop: 16 }}>
                            <h5 style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: isDark ? "#fbe3e8" : "#5cbdb9",
                                marginBottom: 8
                            }}>
                                Key Achievements
                            </h5>
                            <ul style={{
                                margin: 0,
                                paddingLeft: 16,
                                color: isDark ? "rgba(255,255,255,0.7)" : "rgba(10,18,18,0.7)"
                            }}>
                                {activity.achievements.map((achievement, idx) => (
                                    <li key={idx} style={{ marginBottom: 6 }}>
                                        {achievement}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Photo Gallery */}
                        {activity.images && (
                            <PhotoGallery
                                images={activity.images}
                                title={`${activity.name} Events`}
                                isDark={isDark}
                            />
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

// ── MAIN EXPERIENCE COMPONENT ─────────────────────────────────────────────────
export default function ExperiencePage() {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const [activeSection, setActiveSection] = useState("professional");

    return (
        <div style={{
            minHeight: "100vh",
            background: isDark ? "#010101" : "#ffffff",
            fontFamily: "'Courier New', monospace",
            transition: "background 0.4s ease"
        }}>
            {/* Header */}
            <div style={{
                padding: "clamp(40px, 6vw, 80px) clamp(24px, 4vw, 48px)",
                textAlign: "center",
                borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(92,189,185,0.1)"}`
            }}>
                <h1 style={{
                    fontSize: "clamp(32px, 4vw, 48px)",
                    fontWeight: 900,
                    color: isDark ? "#fbe3e8" : "#5cbdb9",
                    marginBottom: 16,
                    letterSpacing: "-0.02em",
                    textShadow: isDark ? `0 0 30px ${isDark ? "#fbe3e833" : "#5cbdb933"}` : "none"
                }}>
                    Experience & Journey
                </h1>
                <p style={{
                    fontSize: "clamp(14px, 1.8vw, 18px)",
                    color: isDark ? "rgba(255,255,255,0.7)" : "rgba(10,18,18,0.7)",
                    maxWidth: "600px",
                    margin: "0 auto",
                    lineHeight: 1.6
                }}>
                    Professional experience, hackathon achievements, NCC leadership journey, and community contributions showcasing technical excellence and leadership development.
                </p>
            </div>

            {/* Navigation Tabs */}
            <div style={{
                display: "flex",
                justifyContent: "center",
                gap: 8,
                padding: "0 clamp(24px, 4vw, 48px)",
                marginBottom: 48,
                flexWrap: "wrap"
            }}>
                {[
                    { id: "professional", label: "Professional" },
                    { id: "hackathons", label: "Hackathons" },
                    { id: "ncc", label: "NCC Journey" },
                    { id: "extracurricular", label: "Leadership" }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveSection(tab.id)}
                        style={{
                            padding: "12px 24px",
                            borderRadius: 25,
                            background: activeSection === tab.id
                                ? (isDark ? "#fbe3e8" : "#5cbdb9")
                                : "transparent",
                            border: `1px solid ${isDark ? "rgba(251,227,232,0.3)" : "rgba(92,189,185,0.3)"}`,
                            color: activeSection === tab.id
                                ? (isDark ? "#010101" : "#ffffff")
                                : (isDark ? "#fbe3e8" : "#5cbdb9"),
                            fontWeight: 600,
                            fontSize: 14,
                            cursor: "pointer",
                            transition: "all 0.3s ease"
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Sections */}
            <div style={{
                padding: "0 clamp(24px, 4vw, 48px) clamp(40px, 6vw, 80px)"
            }}>
                {/* Professional Experience */}
                {activeSection === "professional" && (
                    <div>
                        <Timeline experiences={PROFESSIONAL_EXPERIENCE} isDark={isDark} />
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
                            gap: 24
                        }}>
                            {PROFESSIONAL_EXPERIENCE.map((exp, index) => (
                                <ProfessionalCard key={exp.id} experience={exp} isDark={isDark} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Hackathon Experience */}
                {activeSection === "hackathons" && (
                    <HackathonSection hackathons={HACKATHON_EXPERIENCE} isDark={isDark} />
                )}

                {/* NCC Journey */}
                {activeSection === "ncc" && (
                    <NCCJourney nccData={NCC_EXPERIENCE} isDark={isDark} />
                )}

                {/* Extracurricular Activities */}
                {activeSection === "extracurricular" && (
                    <ExtracurricularSection activities={EXTRACURRICULAR} isDark={isDark} />
                )}
            </div>

            {/* Floating Elements for Visual Interest */}
            <div style={{
                position: "fixed",
                bottom: 20,
                right: 20,
                display: "flex",
                flexDirection: "column",
                gap: 12,
                zIndex: 100,
                pointerEvents: "none"
            }}>
                <div style={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    background: `linear-gradient(45deg, ${isDark ? "#fbe3e8" : "#5cbdb9"}, ${isDark ? "#c9b8f5" : "#e05050"})`,
                    opacity: 0.8,
                    animation: "pulse 2s infinite"
                }} />
                <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${isDark ? "#c9b8f5" : "#e05050"}, ${isDark ? "#fbe3e8" : "#5cbdb9"})`,
                    opacity: 0.6,
                    animation: "pulse 3s infinite"
                }} />
            </div>

            {/* Custom Styles */}
            <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
          .experience-container {
            padding: 0 16px !important;
          }
          .timeline-node {
            width: 12px !important;
            height: 12px !important;
          }
          .professional-card {
            padding: 20px !important;
            margin-bottom: 16px !important;
          }
        }
        
        @media (max-width: 480px) {
          .experience-header h1 {
            font-size: 28px !important;
          }
          .nav-tabs {
            flex-direction: column !important;
            align-items: center !important;
          }
          .nav-tabs button {
            width: 100% !important;
            margin-bottom: 8px !important;
          }
        }
      `}</style>
        </div>
    );
}