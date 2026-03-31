import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import App from "./App";
import Projects from "./components/projects/ProjectsPage";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    /* mode="wait" ensures the old page exits before the new one starts */
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<App />} />
        <Route path="/projects" element={<Projects />} />
      </Routes>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;  