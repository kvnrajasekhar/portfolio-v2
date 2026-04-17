import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or default to dark
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'dark';
  });

  const isDark = theme === "dark";

  // Centralized color system
  const colors = {
    // Background colors
    background: isDark ? "#000000" : "#ffffff",
    backgroundSecondary: isDark ? "#111111" : "#f8f8f8",
    backgroundTertiary: isDark ? "#1a1a1a" : "#f0f0f0",

    // Text colors
    textPrimary: isDark ? "#ffffff" : "#0a1212",
    textSecondary: isDark ? "rgba(255,255,255,0.88)" : "rgba(10,18,18,0.88)",
    textMuted: isDark ? "rgba(255,255,255,0.38)" : "rgba(10,18,18,0.74)",
    textFaint: isDark ? "rgba(255,255,255,0.25)" : "rgba(10,18,18,0.55)",

    // Accent colors
    accent: {
      primary: isDark ? "#5cbdb9" : "#2a9e9a",
      secondary: isDark ? "#c9b8f5" : "#6040c0",
      tertiary: isDark ? "#fbe3e8" : "#c04070",
      quaternary: isDark ? "#f7c4a0" : "#c07030",
      success: isDark ? "#a8d8b9" : "#3a9e6a",
      warning: isDark ? "#f7c4a0" : "#c07030",
      error: isDark ? "#ff6b6b" : "#e74c3c",
    },

    // Border and separator colors
    border: isDark ? "rgba(255,255,255,0.07)" : "rgba(10,18,18,0.09)",
    borderLight: isDark ? "rgba(255,255,255,0.045)" : "rgba(10,18,18,0.07)",
    borderFaint: isDark ? "rgba(255,255,255,0.025)" : "rgba(92,189,185,0.07)",

    // Grid and overlay colors
    grid: isDark ? "rgba(255,255,255,0.022)" : "rgba(92,189,185,0.06)",
    overlay: isDark ? "rgba(0,0,0,0.18)" : "rgba(255,255,255,0.12)",

    // Shadow colors
    shadow: isDark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.1)",
    shadowLight: isDark ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.05)",
  };

  useEffect(() => {
    const root = document.documentElement;

    // Save theme to localStorage whenever it changes
    localStorage.setItem('theme', theme);

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);