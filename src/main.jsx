import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter} from "react-router-dom";
import "./index.css";
import Navbar from "./components/navbar/Navbar";
import PreFooter from "./components/PreFooter";
import MasterFooter from "./components/footer/MasterFooter";
import AnimatedRoutes from "./AnimatedRoutes"; 
import { ThemeProvider } from "./context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#ffffff] dark:bg-[#000000] text-[#5cbdb9] dark:text-[#fbe3e8] transition-colors duration-300">
          <Navbar />
          <AnimatedRoutes />
          <PreFooter />
          <MasterFooter />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);