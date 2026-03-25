import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext";
import Projects from "./components/projects/Projects";
import Navbar from "./components/navbar/Navbar";
import PreFooter from "./components/PreFooter";
import MasterFooter from "./components/footer/MasterFooter";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#ffffff] dark:bg-[#000000] text-[#5cbdb9] dark:text-[#fbe3e8] transition-colors duration-300">
          <Navbar />
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/projects" element={<Projects />} />
          </Routes>
          <PreFooter />
          <MasterFooter />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode >
);