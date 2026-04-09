import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { useLocation } from "react-router-dom";

const API = "http://localhost:5000";

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function fmtDate(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) +
        " " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });
}
function shortId(id = "") { return id.slice(-8).toUpperCase(); }
function getToken() { return localStorage.getItem("registry_token"); }
function setToken(t) { localStorage.setItem("registry_token", t); }
function clearToken() { localStorage.removeItem("registry_token"); }

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({ toasts, remove }) {
    const COLOR = { success: "#5cbdb9", error: "#f87171", info: "#c9b8f5" };
    return (
        <div style={{ position: "fixed", top: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8, pointerEvents: "none" }}>
            <AnimatePresence>
                {toasts.map(t => (
                    <motion.div key={t.id}
                        initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }}
                        style={{
                            fontFamily: "'Courier New', monospace", fontSize: 12, fontWeight: 700,
                            padding: "10px 16px", borderRadius: 6,
                            border: `1px solid ${COLOR[t.type] || COLOR.info}`,
                            background: t.dark ? "#0a0a0a" : "#fff",
                            color: COLOR[t.type] || COLOR.info,
                            pointerEvents: "auto", cursor: "pointer",
                            boxShadow: `0 0 16px ${COLOR[t.type]}33`,
                        }}
                        onClick={() => remove(t.id)}
                    >
                        [{t.type.toUpperCase()}] {t.msg}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}

function useToast(isDark) {
    const [toasts, setToasts] = useState([]);
    const push = useCallback((msg, type = "info") => {
        const id = Date.now();
        setToasts(p => [...p, { id, msg, type, dark: isDark }]);
        setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3800);
    }, [isDark]);
    const remove = useCallback(id => setToasts(p => p.filter(t => t.id !== id)), []);
    return { toasts, push, remove };
}

// ─── SKELETON ─────────────────────────────────────────────────────────────────
function Skeleton({ isDark, h = 120 }) {
    return (
        <motion.div animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ repeat: Infinity, duration: 1.4 }}
            style={{ height: h, borderRadius: 6, background: isDark ? "rgba(255,255,255,0.06)" : "rgba(10,18,18,0.07)" }} />
    );
}

// ─── PROVIDER ICON ────────────────────────────────────────────────────────────
function ProviderIcon({ p }) {
    if (p === "github") return <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>;
    if (p === "linkedin") return <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>;
    if (p === "Admin") return (
        <img
            src="https://cdn-icons-png.freepik.com/512/2397/2397707.png"
            alt="google"
            style={{
                width: 13,
                height: 13,
                objectFit: "contain",
                display: "block",
            }}
        />
    );
    return <img
        src="https://freelogopng.com/images/all_img/1657955079google-icon-png.png"
        alt="google"
        style={{
            width: 13,
            height: 13,
            objectFit: "contain",
            display: "block",
        }}
    />
}

// ─── ENTITY CARD ─────────────────────────────────────────────────────────────
function EntityCard({ user, isDark, isGenesis, onEdit, currentUser, isAdmin, onPinToggle }) {
    const [slide, setSlide] = useState(0);
    const sigs = user.signatures || [];
    const total = sigs.length;
    const teal = isDark ? "#5cbdb9" : "#2a9e9a";
    const lav = isDark ? "#c9b8f5" : "#6040c0";
    const text = isDark ? "rgba(255,255,255,0.88)" : "rgba(10,18,18,0.88)";
    const muted = isDark ? "rgba(255,255,255,0.38)" : "rgba(10,18,18,0.4)";
    const bodyC = isDark ? "rgba(255,255,255,0.72)" : "rgba(10,18,18,0.72)";

    const borderStyle = isGenesis
        ? "2px solid #FFD700"
        : user.isPinned
            ? `1px solid ${teal}`
            : `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(10,18,18,0.12)"}`;

    const PROV_COLORS = { github: "#e0e0e0", linkedin: "#0077B5", google: "#4285F4" };

    const isOwn = currentUser && (currentUser._id === user._id || currentUser.id === user._id);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{
                border: borderStyle,
                borderRadius: 8,
                overflow: "hidden",
                background: isDark ? (isGenesis ? "rgba(255,215,0,0.04)" : "rgba(255,255,255,0.02)") : (isGenesis ? "rgba(255,215,0,0.03)" : "rgba(10,18,18,0.01)"),
                boxShadow: isGenesis ? "0 0 32px rgba(255,215,0,0.1)" : "none",
                transition: "border-color 0.2s ease",
            }}
        >
            {/* Card header */}
            <div style={{
                display: "flex", alignItems: "center", gap: 12, padding: "14px 18px",
                borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(10,18,18,0.08)"}`,
                flexWrap: "wrap", rowGap: 8,
            }}>
                {/* Avatar */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                    <img
                        src={user.profileImg || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                        alt={user.name}
                        style={{
                            width: 36, height: 36, borderRadius: "50%", objectFit: "cover",
                            border: isGenesis ? "2px solid #FFD700" : `2px solid ${user.isPinned ? teal : (isDark ? "rgba(255,255,255,0.15)" : "rgba(10,18,18,0.15)")}`,
                        }}
                    />
                    {/* Provider badge */}
                    <div style={{
                        position: "absolute", bottom: -2, right: -2,
                        width: 14, height: 14, borderRadius: "50%",
                        background: PROV_COLORS[user.provider] || "#888",
                        border: `1px solid ${isDark ? "#000" : "#fff"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: user.provider === "github" ? "#000" : "#fff",
                    }}>

                        <ProviderIcon p={user.provider} />
                    </div>
                </div>

                {/* Name + meta */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontFamily: "'Courier New', monospace", fontSize: "clamp(12px,1.4vw,14px)", fontWeight: 800, color: text, letterSpacing: "-0.01em" }}>
                            {user.name}
                        </span>
                        {isGenesis && (
                            <span style={{ fontFamily: "'Courier New', monospace", fontSize: 8, fontWeight: 800, letterSpacing: "0.2em", color: "#FFD700", background: "rgba(255,215,0,0.12)", border: "1px solid rgba(255,215,0,0.3)", borderRadius: 3, padding: "2px 6px" }}>
                                GENESIS
                            </span>
                        )}
                        {user.isPinned && !isGenesis && (
                            <span style={{ fontFamily: "'Courier New', monospace", fontSize: 8, fontWeight: 800, letterSpacing: "0.2em", color: teal, background: `rgba(${isDark ? "92,189,185" : "42,158,154"},0.1)`, border: `1px solid rgba(${isDark ? "92,189,185" : "42,158,154"},0.3)`, borderRadius: 3, padding: "2px 6px" }}>
                                ENDORSED
                            </span>
                        )}
                    </div>
                    <div style={{ display: "flex", gap: 10, marginTop: 2, flexWrap: "wrap" }}>
                        <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: muted, letterSpacing: "0.15em" }}>
                            LOG_ID:{shortId(user._id)}
                        </span>
                        <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: muted }}>
                            · {user.provider?.toUpperCase()}
                        </span>
                        <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: muted }}>
                            · {total} {total === 1 ? "entry" : "entries"}
                        </span>
                    </div>
                </div>

                {/* Admin controls */}
                {isAdmin && !isGenesis && (
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                        <button
                            onClick={() => onPinToggle(user._id, user.isPinned)}
                            style={{
                                fontFamily: "'Courier New', monospace", fontSize: 9, fontWeight: 800,
                                letterSpacing: "0.18em", textTransform: "uppercase",
                                color: user.isPinned ? "#f87171" : teal,
                                background: "transparent",
                                border: `1px solid ${user.isPinned ? "#f87171" : teal}55`, borderRadius: 4,
                                padding: "4px 10px", cursor: "pointer",
                                transition: "all 0.2s ease",
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = `rgba(${user.isPinned ? "248,113,113" : "92,189,185"},0.1)`; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                        >
                            {user.isPinned ? "UNPIN" : "PIN"}
                        </button>
                    </div>
                )}

                {/* Edit button */}
                {isOwn && total > 0 && (
                    <button
                        onClick={() => onEdit(user, sigs[slide])}
                        style={{
                            fontFamily: "'Courier New', monospace", fontSize: 9, fontWeight: 800,
                            letterSpacing: "0.18em", textTransform: "uppercase",
                            color: teal, background: "transparent",
                            border: `1px solid ${teal}55`, borderRadius: 4,
                            padding: "4px 10px", cursor: "pointer",
                            transition: "all 0.2s ease",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = `rgba(${isDark ? "92,189,185" : "42,158,154"},0.1)`; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                    >
                        EDIT
                    </button>
                )}
            </div>

            {/* Signature body */}
            {total > 0 && sigs[slide]?.content && (
                <div style={{ padding: "16px 18px" }}>
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={slide}
                            initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
                            transition={{ duration: 0.22 }}
                            style={{
                                fontFamily: "Georgia, serif",
                                fontSize: "clamp(13px,1.4vw,15px)",
                                color: bodyC, lineHeight: 1.8, margin: 0,
                                fontStyle: "italic",
                            }}
                        >
                            "{sigs[slide]?.content}"
                        </motion.p>
                    </AnimatePresence>

                    {/* Carousel nav */}
                    {total > 1 && (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
                            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                {sigs.map((_, i) => (
                                    <button key={i} onClick={() => setSlide(i)} style={{
                                        width: i === slide ? 16 : 6, height: 6,
                                        borderRadius: 3, border: "none", cursor: "pointer",
                                        background: i === slide ? teal : (isDark ? "rgba(255,255,255,0.18)" : "rgba(10,18,18,0.18)"),
                                        padding: 0, transition: "all 0.25s ease",
                                    }} />
                                ))}
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: muted, letterSpacing: "0.15em" }}>
                                    {String(slide + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                                </span>
                                <button onClick={() => setSlide(s => Math.max(0, s - 1))} disabled={slide === 0}
                                    style={{ background: "none", border: "none", cursor: slide === 0 ? "default" : "pointer", color: slide === 0 ? muted : teal, fontSize: 14, padding: "0 2px", lineHeight: 1 }}>
                                    ‹
                                </button>
                                <button onClick={() => setSlide(s => Math.min(total - 1, s + 1))} disabled={slide === total - 1}
                                    style={{ background: "none", border: "none", cursor: slide === total - 1 ? "default" : "pointer", color: slide === total - 1 ? muted : teal, fontSize: 14, padding: "0 2px", lineHeight: 1 }}>
                                    ›
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Footer */}
            <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "8px 18px",
                borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(10,18,18,0.06)"}`,
                flexWrap: "wrap", gap: 6,
            }}>
                <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: muted }}>
                    Latest_Sync: {fmtDate(sigs[slide]?.timestamp || user.createdAt)}
                </span>
                {total > 0 && (
                    <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: muted, letterSpacing: "0.1em" }}>
                        SIG_{shortId(sigs[slide]?.id)}
                    </span>
                )}
            </div>
        </motion.div>
    );
}

// ─── SIGN MODAL ───────────────────────────────────────────────────────────────
function SignModal({ isDark, user, existingSigs, editSig, onClose, onSaved, pushToast }) {
    const [text, setText] = useState(editSig?.content || "");
    const [loading, setLoading] = useState(false);
    const teal = isDark ? "#5cbdb9" : "#2a9e9a";
    const text2 = isDark ? "rgba(255,255,255,0.88)" : "rgba(10,18,18,0.88)";
    const muted = isDark ? "rgba(255,255,255,0.38)" : "rgba(10,18,18,0.4)";
    const MAX = 320;
    const remaining = MAX - text.length;

    const submit = async () => {
        // Enhanced validation
        const trimmedText = text.trim();
        if (!trimmedText) {
            pushToast("Signature cannot be empty.", "error");
            return;
        }
        if (trimmedText.length < 3) {
            pushToast("Signature must be at least 3 characters.", "error");
            return;
        }
        if (trimmedText.length > MAX) {
            pushToast(`Max ${MAX} characters.`, "error");
            return;
        }

        setLoading(true);
        try {
            const token = getToken();
            if (!token) {
                pushToast("Authentication required. Please login again.", "error");
                return;
            }

            let res;
            if (editSig) {
                res = await fetch(`${API}/api/registry/edit/${editSig.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ content: trimmedText }),
                });
            } else {
                res = await fetch(`${API}/api/registry/sign`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ content: trimmedText }),
                });
            }

            const data = await res.json();
            if (!data.success) {
                (data.errors || []).forEach(e => pushToast(e.message || e, "error"));
                if (data.message) pushToast(data.message, "error");
            } else {
                pushToast(editSig ? "Entry updated successfully." : "Signature recorded successfully.", "success");
                onSaved();
                onClose();
            }
        } catch (error) {
            console.error("Signature submission error:", error);
            pushToast("Network error. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
            onClick={e => e.target === e.currentTarget && onClose()}
        >
            <motion.div
                initial={{ scale: 0.93, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.93, y: 16 }}
                style={{
                    width: "100%", maxWidth: 560,
                    background: isDark ? "#0a0a0a" : "#ffffff",
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(10,18,18,0.14)"}`,
                    borderRadius: 10, padding: "clamp(20px,4vw,32px)",
                    boxSizing: "border-box",
                }}
            >
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <div>
                        <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: "0.28em", color: teal, textTransform: "uppercase", display: "block", marginBottom: 4 }}>
                            {editSig ? "// EDIT_RECORD" : "// NEW_SIGNATURE"}
                        </span>
                        <span style={{ fontFamily: "'Courier New', monospace", fontSize: "clamp(13px,1.6vw,16px)", fontWeight: 800, color: text2 }}>
                            {editSig ? "Update Entry" : `Sign the Registry`}
                        </span>
                        {!editSig && existingSigs.length > 0 && (
                            <span style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: muted, display: "block", marginTop: 2 }}>
                                {existingSigs.length}/3 slots used
                            </span>
                        )}
                    </div>
                    <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: muted, lineHeight: 1, padding: 4 }}>✕</button>
                </div>

                {/* Input */}
                <textarea
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder="Leave your mark on the ledger…"
                    maxLength={MAX + 10}
                    rows={4}
                    style={{
                        width: "100%", boxSizing: "border-box",
                        fontFamily: "Georgia, serif", fontSize: "clamp(13px,1.4vw,15px)",
                        color: text2, lineHeight: 1.75, fontStyle: "italic",
                        background: isDark ? "rgba(255,255,255,0.03)" : "rgba(10,18,18,0.03)",
                        border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(10,18,18,0.12)"}`,
                        borderRadius: 6, padding: 14, resize: "vertical",
                        outline: "none", transition: "border-color 0.2s",
                    }}
                    onFocus={e => e.target.style.borderColor = teal}
                    onBlur={e => e.target.style.borderColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(10,18,18,0.12)"}
                />
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
                    <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: remaining < 30 ? "#f87171" : muted }}>
                        {remaining} chars remaining
                    </span>
                </div>

                {/* Live preview */}
                {text.trim() && (
                    <div style={{
                        marginTop: 14, padding: "12px 16px",
                        background: isDark ? "rgba(255,255,255,0.025)" : "rgba(10,18,18,0.03)",
                        border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(10,18,18,0.08)"}`,
                        borderRadius: 6,
                    }}>
                        <span style={{ fontFamily: "'Courier New', monospace", fontSize: 8, letterSpacing: "0.25em", color: muted, textTransform: "uppercase", display: "block", marginBottom: 8 }}>
              // LIVE_PREVIEW
                        </span>
                        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
                            <img src={user.profileImg || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} alt="" style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover", border: `1.5px solid ${teal}` }} />
                            <span style={{ fontFamily: "'Courier New', monospace", fontSize: 12, fontWeight: 800, color: text2 }}>{user.name}</span>
                        </div>
                        <p style={{ fontFamily: "Georgia, serif", fontSize: 13, color: isDark ? "rgba(255,255,255,0.68)" : "rgba(10,18,18,0.7)", lineHeight: 1.75, margin: 0, fontStyle: "italic" }}>
                            "{text}"
                        </p>
                    </div>
                )}

                {/* Actions */}
                <div style={{ display: "flex", gap: 10, marginTop: 18, justifyContent: "flex-end", flexWrap: "wrap" }}>
                    <button onClick={onClose}
                        style={{ fontFamily: "'Courier New', monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: muted, background: "transparent", border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(10,18,18,0.12)"}`, borderRadius: 5, padding: "8px 16px", cursor: "pointer" }}>
                        CANCEL
                    </button>
                    <button onClick={submit} disabled={loading || !text.trim()}
                        style={{
                            fontFamily: "'Courier New', monospace", fontSize: 10, fontWeight: 800, letterSpacing: "0.18em",
                            color: isDark ? "#000" : "#fff", background: teal,
                            border: `1px solid ${teal}`, borderRadius: 5,
                            padding: "8px 20px", cursor: loading ? "default" : "pointer",
                            opacity: loading || !text.trim() ? 0.6 : 1, transition: "opacity 0.2s",
                        }}>
                        {loading ? "SAVING…" : editSig ? "UPDATE_RECORD" : "SIGN_LEDGER"}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

// ─── SLOT CONFLICT MODAL ──────────────────────────────────────────────────────
function SlotModal({ isDark, sigs, onEdit, onNew, onClose }) {
    const teal = isDark ? "#5cbdb9" : "#2a9e9a";
    const text = isDark ? "rgba(255,255,255,0.88)" : "rgba(10,18,18,0.88)";
    const muted = isDark ? "rgba(255,255,255,0.38)" : "rgba(10,18,18,0.4)";

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
            onClick={e => e.target === e.currentTarget && onClose()}
        >
            <motion.div initial={{ scale: 0.93 }} animate={{ scale: 1 }} exit={{ scale: 0.93 }}
                style={{ width: "100%", maxWidth: 420, background: isDark ? "#0a0a0a" : "#fff", border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(10,18,18,0.14)"}`, borderRadius: 10, padding: 28, boxSizing: "border-box" }}
            >
                <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: "0.28em", color: "#f7c4a0", display: "block", marginBottom: 8 }}>// EXISTING_RECORD_DETECTED</span>
                <p style={{ fontFamily: "'Courier New', monospace", fontSize: "clamp(12px,1.4vw,14px)", fontWeight: 700, color: text, margin: "0 0 6px" }}>
                    You have used {sigs.length} of 3 slots.
                </p>
                <p style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: muted, margin: "0 0 20px" }}>
                    Edit an existing entry or create a new one.
                </p>

                {/* Sig list to pick edit */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
                    {sigs.map((sig, i) => (
                        <button key={sig.id} onClick={() => onEdit(sig)}
                            style={{
                                background: "transparent", border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(10,18,18,0.12)"}`,
                                borderRadius: 6, padding: "8px 12px", cursor: "pointer", textAlign: "left",
                                display: "flex", alignItems: "center", gap: 10,
                            }}
                        >
                            <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: teal }}>#{i + 1}</span>
                            <span style={{ fontFamily: "Georgia, serif", fontSize: 12, color: isDark ? "rgba(255,255,255,0.7)" : "rgba(10,18,18,0.7)", fontStyle: "italic", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                                "{sig.content}"
                            </span>
                            <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: teal, flexShrink: 0 }}>EDIT →</span>
                        </button>
                    ))}
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {sigs.length < 3 && (
                        <button onClick={onNew}
                            style={{ fontFamily: "'Courier New', monospace", fontSize: 10, fontWeight: 800, letterSpacing: "0.15em", color: isDark ? "#000" : "#fff", background: teal, border: `1px solid ${teal}`, borderRadius: 5, padding: "8px 16px", cursor: "pointer" }}>
                            + NEW_ENTRY
                        </button>
                    )}
                    <button onClick={onClose}
                        style={{ fontFamily: "'Courier New', monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: muted, background: "transparent", border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(10,18,18,0.12)"}`, borderRadius: 5, padding: "8px 14px", cursor: "pointer" }}>
                        CANCEL
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function RegistryPage() {
    const location = useLocation();
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const { toasts, push: pushToast, remove: removeToast } = useToast(isDark);

    const [authUser, setAuthUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [initAnim, setInitAnim] = useState(false);

    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [feedLoading, setFeedLoading] = useState(true);
    const [page, setPage] = useState(1);

    const [signModal, setSignModal] = useState(false);
    const [slotModal, setSlotModal] = useState(false);
    const [editSig, setEditSig] = useState(null);

    const teal = isDark ? "#5cbdb9" : "#2a9e9a";
    const lav = isDark ? "#c9b8f5" : "#6040c0";
    const bg = isDark ? "#000000" : "#ffffff";
    const text = isDark ? "rgba(255,255,255,0.88)" : "rgba(10,18,18,0.88)";
    const muted = isDark ? "rgba(255,255,255,0.38)" : "rgba(10,18,18,0.4)";

    // ✅ fetchFeed already returns a Promise implicitly since it's async
    // Just make sure it's defined with useCallback and no issues:
    const fetchFeed = useCallback(async (pg = 1) => {
        setFeedLoading(true);
        try {
            const r = await fetch(`${API}/api/registry?page=${pg}&limit=10`);
            const d = await r.json();
            if (d.success) {
                const sorted = [...(d.data.users || [])].sort((a, b) => {
                    if (a.isPinned && !b.isPinned) return -1;
                    if (!a.isPinned && b.isPinned) return 1;
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });
                setUsers(pg === 1 ? sorted : prev => [...prev, ...sorted]);
                setPagination(d.data.pagination);
            }
        } catch {
            pushToast("Failed to load registry.", "error");
        } finally {
            setFeedLoading(false);
        }
    }, [pushToast]); // ← only pushToast as dep

    useEffect(() => {
        const token = getToken();
        const storedAdmin = localStorage.getItem("isAdmin") === "true";

        if (!token) {
            setAuthLoading(false);
            setIsAdmin(storedAdmin);
            return;
        }

        fetch(`${API}/api/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(d => {
                if (d.success) {
                    setAuthUser(d.data?.user || d.data);
                    setIsAdmin(d.data?.isAdmin || storedAdmin);
                } else {
                    clearToken();
                    setIsAdmin(false);
                }
            })
            .catch(() => {
                clearToken();
                setIsAdmin(false);
            })
            .finally(() => setAuthLoading(false));
    }, []); // ← empty deps, runs once

    // Effect 2: OAuth message listener (stable, never re-registers)
    useEffect(() => {
        const handler = (e) => {
            if (e.origin !== window.location.origin) return;

            if (e.data?.type === "OAUTH_SUCCESS") {
                localStorage.setItem("registry_token", e.data.token);

                if (e.data.user) {
                    setAuthUser(e.data.user);
                    setIsAdmin(e.data.isAdmin || false);
                    pushToast(`Welcome, ${e.data.user.name}`, "success");
                } else {
                    // fallback (safety)
                    fetch(`${API}/api/auth/profile`, {
                        headers: {
                            Authorization: `Bearer ${e.data.token}`
                        }
                    })
                        .then(r => r.json())
                        .then(d => {
                            setAuthUser(d.data?.user || d.data);
                            setIsAdmin(d.data?.isAdmin || false);
                            pushToast(`Welcome, ${d.data?.user?.name}`, "success");
                        });
                }

                fetchFeed(1);
            }
        };

        window.addEventListener("message", handler);
        return () => window.removeEventListener("message", handler);
    }, [pushToast, fetchFeed]); // these are useCallback so stable references

    const handleOAuth = (provider) => {
        window.location.href =
            `${API}/api/auth/${provider}`;
    };

    useEffect(() => {
        if (location.state?.openSignModal) {
            setSignModal(true);
        }
    }, [location.state]);


    const [initialLoaded, setInitialLoaded] = useState(false);

    useEffect(() => {
        fetchFeed(page).then(() => setInitialLoaded(true));
    }, [page]);

    const handleLogout = () => {
        localStorage.removeItem("registry_token");
        localStorage.removeItem("isAdmin");
        setAuthUser(null);
        pushToast("Logged out successfully.", "info");
    };

    const handleSignClick = () => {
        if (!authUser) { pushToast("Authenticate first to sign.", "error"); return; }
        const myUser = users.find(u => u._id === authUser._id || u._id === authUser.id);
        const sigs = myUser?.signatures || [];
        if (sigs.length === 0) {
            setEditSig(null); setSignModal(true);
        } else {
            setSlotModal(true);
        }
    };

    const handleEdit = (user, sig) => {
        setSlotModal(false);
        setEditSig(sig);
        setSignModal(true);
    };

    const handleSlotNew = () => {
        setSlotModal(false);
        setEditSig(null);
        setSignModal(true);
    };

    const handlePinToggle = async (userId, currentPinned) => {
        const token = getToken();
        if (!token) return;

        try {
            const res = await fetch(`${API}/api/registry/pin/${userId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ isPinned: !currentPinned })
            });

            const data = await res.json();
            console.log(res.status, data);
            if (data.success) {
                pushToast(currentPinned ? "Signature unpinned successfully." : "Signature pinned successfully.", "success");
                fetchFeed(1); // Refresh feed
            } else {
                pushToast(data.message || "Failed to update pin status.", "error");
            }
        } catch {
            pushToast("Network error. Try again.", "error");
        }
    };

    const myUser = authUser ? users.find(u => u._id === authUser._id || u._id === authUser.id) : null;
    const mySigs = myUser?.signatures || [];

    // Debug admin state
    console.log("Admin state:", { isAdmin, authUser, token: getToken() });

    // ── GENESIS card ──
    const GENESIS = {
        _id: "genesis_rajasekhar",
        name: "K.V.N. Rajasekhar",
        profileImg: "https://lh3.googleusercontent.com/a/ACg8ocImj6iRC2XzDs3P7pm4QfIfJyYunNITbT1bofBenjvDPbhd3uQSCQ=s96-c",
        provider: "Admin",
        isPinned: false,
        isGenesis: true,
        signatures: [{
            id: "genesis_sig_01",
            content: "Built this registry to collect a ledger of engineers, founders, and thinkers who believe that code is a tool for impact. If you're reading this — you're already aligned.",
            timestamp: new Date().toISOString(),
        }],
        createdAt: new Date("2025-01-01").toISOString(),
    };

    return (
        <div style={{ minHeight: "100vh", background: bg, position: "relative", overflowX: "hidden", transition: "background 0.4s ease" }}>
            <Toast toasts={toasts} remove={removeToast} />

            {/* Grid */}
            <div style={{
                position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
                backgroundImage: `linear-gradient(${isDark ? "rgba(255,255,255,0.022)" : "rgba(92,189,185,0.065)"} 1px, transparent 1px),linear-gradient(90deg,${isDark ? "rgba(255,255,255,0.022)" : "rgba(92,189,185,0.065)"} 1px,transparent 1px)`,
                backgroundSize: "48px 48px",
            }} aria-hidden />

            <div style={{ position: "relative", zIndex: 1, maxWidth: 840, margin: "0 auto", padding: "clamp(56px,10vw,96px) clamp(16px,5vw,48px) clamp(72px,10vw,100px)", boxSizing: "border-box" }}>

                {/* ── PAGE HEADER ── */}
                <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} style={{ marginBottom: "clamp(36px,6vw,56px)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
                        <div style={{ width: 22, height: 1.5, background: teal, borderRadius: 1 }} />
                        <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, fontWeight: 800, letterSpacing: "0.32em", textTransform: "uppercase", color: teal }}>
                            Digital Archive · Portfolio Registry
                        </span>
                        <div style={{ width: 22, height: 1.5, background: teal, borderRadius: 1 }} />
                    </div>

                    <h1 style={{ fontFamily: "'Courier New', monospace", fontSize: "clamp(32px,6vw,60px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.05, color: text, margin: "0 0 10px" }}>
                        The Ledger
                    </h1>
                    <p style={{ fontFamily: "'Courier New', monospace", fontSize: "clamp(11px,1.3vw,13px)", color: muted, lineHeight: 1.78, maxWidth: 520, margin: 0 }}>
                        A permanent record of engineers, founders, and builders who crossed paths with this portfolio.
                        Sign to leave your mark in the archive.
                    </p>
                </motion.div>

                {/* ── AUTH ZONE ── */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
                    style={{
                        padding: "clamp(18px,3vw,28px)", marginBottom: "clamp(28px,5vw,44px)",
                        border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(10,18,18,0.12)"}`,
                        borderRadius: 8,
                        background: isDark ? "rgba(255,255,255,0.02)" : "rgba(10,18,18,0.01)",
                    }}>

                    <AnimatePresence mode="wait">
                        {authLoading ? (
                            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <Skeleton isDark={isDark} h={52} />
                            </motion.div>
                        ) : authUser ? (
                            <motion.div key="authed" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.38 }}>
                                {/* Session bar */}
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <div style={{ position: "relative" }}>
                                            <img src={authUser.profileImg || `https://api.dicebear.com/7.x/initials/svg?seed=${authUser.name}`} alt={authUser.name}
                                                style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", border: `2px solid ${teal}` }} />
                                            <div style={{ position: "absolute", bottom: -2, right: -2, width: 12, height: 12, borderRadius: "50%", background: "#22c55e", border: `1.5px solid ${bg}` }} />
                                        </div>
                                        <div>
                                            <span style={{ fontFamily: "'Courier New', monospace", fontSize: "clamp(12px,1.4vw,14px)", fontWeight: 800, color: text, display: "block" }}>{authUser.name}</span>
                                            <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: muted }}>Session active · {mySigs.length}/3 slots</span>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                                        <button onClick={handleSignClick}
                                            style={{
                                                fontFamily: "'Courier New', monospace", fontSize: 10, fontWeight: 800, letterSpacing: "0.18em",
                                                color: isDark ? "#000" : "#fff", background: teal, border: `1px solid ${teal}`,
                                                borderRadius: 5, padding: "8px 18px", cursor: "pointer",
                                            }}>
                                            &gt; SIGN_HERE
                                        </button>
                                        <button onClick={handleLogout}
                                            style={{ fontFamily: "'Courier New', monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: muted, background: "transparent", border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(10,18,18,0.12)"}`, borderRadius: 5, padding: "8px 14px", cursor: "pointer" }}>
                                            LOGOUT
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key="loggedout" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: "0.28em", color: muted, display: "block", marginBottom: 14, textTransform: "uppercase" }}>
                  // HANDSHAKE_PROTOCOL — Select auth provider
                                </span>
                                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                                    {[
                                        { id: "github", label: "GitHub", bg: "#181717", fg: "#ffffff" },
                                        { id: "linkedin", label: "LinkedIn", bg: "#0077B5", fg: "#ffffff" },
                                        { id: "google", label: "Google", bg: "#4285F4", fg: "#ffffff" },
                                    ].map(p => (
                                        <button key={p.id} onClick={() => handleOAuth(p.id)}
                                            style={{
                                                fontFamily: "'Courier New', monospace", fontSize: 11, fontWeight: 800,
                                                letterSpacing: "0.14em", textTransform: "uppercase",
                                                color: p.fg, background: p.bg,
                                                border: "none", borderRadius: 6,
                                                padding: "10px 20px", cursor: "pointer",
                                                display: "flex", alignItems: "center", gap: 8,
                                                transition: "opacity 0.2s ease",
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                                            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                                        >
                                            <ProviderIcon p={p.id} />
                                            {p.label}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* ── STATS ROW ── */}
                {pagination && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                        style={{ display: "flex", gap: "clamp(20px,4vw,40px)", marginBottom: "clamp(24px,4vw,36px)", flexWrap: "wrap" }}>
                        {[
                            { label: "TOTAL_SIGNATORIES", val: pagination.totalUsers },
                            { label: "LEDGER_PAGES", val: pagination.totalPages },
                            { label: "STATUS", val: "LIVE" },
                        ].map(s => (
                            <div key={s.label}>
                                <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: muted, letterSpacing: "0.22em", textTransform: "uppercase", display: "block", marginBottom: 2 }}>{s.label}</span>
                                <span style={{ fontFamily: "'Courier New', monospace", fontSize: "clamp(16px,2.2vw,22px)", fontWeight: 900, color: s.val === "LIVE" ? teal : text, letterSpacing: "-0.01em" }}>{s.val}</span>
                            </div>
                        ))}
                    </motion.div>
                )}

                {/* ── REGISTRY FEED ── */}
                <div style={{ display: "flex", flexDirection: "column", gap: "clamp(14px,2vw,18px)" }}>

                    {/* Genesis — always first */}
                    <EntityCard user={GENESIS} isDark={isDark} isGenesis={true} onEdit={() => { }} currentUser={null} isAdmin={false} onPinToggle={() => { }} />

                    {/* Feed */}
                    {feedLoading && users.length === 0 ? (
                        Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} isDark={isDark} h={140} />)
                    ) : (
                        users
                            .filter(u => {
                                // Only show users who have at least one signature with content
                                const sigs = u.signatures || [];
                                return sigs.length > 0 && sigs.some(sig => sig.content && sig.content.trim().length > 0);
                            })
                            .map(u => (
                                <EntityCard
                                    key={u._id} user={u} isDark={isDark}
                                    isGenesis={false}
                                    onEdit={(user, sig) => handleEdit(user, sig)}
                                    currentUser={authUser}
                                    isAdmin={isAdmin}
                                    onPinToggle={handlePinToggle}
                                />
                            ))
                    )}

                    {/* Load more */}
                    {pagination?.hasNextPage && !feedLoading && (
                        <button onClick={() => setPage(p => p + 1)}
                            style={{
                                fontFamily: "'Courier New', monospace", fontSize: 10, fontWeight: 800, letterSpacing: "0.2em",
                                color: teal, background: "transparent",
                                border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(10,18,18,0.12)"}`,
                                borderRadius: 6, padding: "12px 0", cursor: "pointer", width: "100%",
                                transition: "border-color 0.2s, background 0.2s",
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = teal; e.currentTarget.style.background = `rgba(${isDark ? "92,189,185" : "42,158,154"},0.06)`; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(10,18,18,0.12)"; e.currentTarget.style.background = "transparent"; }}
                        >
                            LOAD_MORE ({pagination.totalUsers - users.length} remaining)
                        </button>
                    )}

                    {feedLoading && users.length > 0 && (
                        <Skeleton isDark={isDark} h={80} />
                    )}
                </div>

                {/* ── FOOTER ── */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: "clamp(40px,7vw,60px)" }}>
                    <div style={{ flex: 1, height: 1, background: isDark ? "rgba(255,255,255,0.07)" : "rgba(10,18,18,0.09)" }} />
                    <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: muted }}>
                        Registry · Ledger v1.0 · {new Date().getFullYear()}
                    </span>
                    <div style={{ flex: 1, height: 1, background: isDark ? "rgba(255,255,255,0.07)" : "rgba(10,18,18,0.09)" }} />
                </div>
            </div>

            {/* ── MODALS ── */}
            <AnimatePresence>
                {slotModal && (
                    <SlotModal
                        key="slot"
                        isDark={isDark}
                        sigs={mySigs}
                        onEdit={sig => handleEdit(myUser, sig)}
                        onNew={handleSlotNew}
                        onClose={() => setSlotModal(false)}
                    />
                )}
                {signModal && (
                    <SignModal
                        key="sign"
                        isDark={isDark}
                        user={authUser}
                        existingSigs={mySigs}
                        editSig={editSig}
                        onClose={() => { setSignModal(false); setEditSig(null); }}
                        onSaved={() => fetchFeed(1)}
                        pushToast={pushToast}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
