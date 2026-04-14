import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import Navbar from "./components/navbar/Navbar";
import PreFooter from "./components/PreFooter";
import MasterFooter from "./components/footer/MasterFooter";
import AnimatedRoutes from "./AnimatedRoutes";
import { ThemeProvider } from "./context/ThemeContext";
import ScrollToTop from "./components/ScrollToTop";

if (import.meta.env.PROD) {
  // Disable right-click
  document.addEventListener('contextmenu', (e) => e.preventDefault());

  // Disable specific key combinations
  document.addEventListener('keydown', (e) => {
    if (
      // Disable F12
      e.key === 'F12' ||
      // Disable Ctrl+Shift+I (Inspect), Ctrl+Shift+J (Console), Ctrl+Shift+C (Elements)
      (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
      // Disable Ctrl+U (View Source)
      (e.ctrlKey && e.key === 'u')
    ) {
      e.preventDefault();
      return false;
    }
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#000000] text-[#5cbdb9] dark:text-[#fbe3e8] transition-colors duration-300">
          <AnimatedRoutes />
          <PreFooter />
          <MasterFooter />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
