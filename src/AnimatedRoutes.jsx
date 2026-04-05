import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import App from "./App";
import Projects from "./components/projects/Projects";
import SkillsPage from "./components/skills/SkillsPage";
import SocialLinks from "./components/contact/SocialTerminal";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    /* mode="wait" ensures the old page exits before the new one starts */
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<App />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/links" element={<SocialLinks />} />
        <Route path="*" element={<App />} />
      </Routes>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;  