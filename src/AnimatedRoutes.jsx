import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import App from "./App";
import Projects from "./components/projects/Projects";
import SkillsPage from "./components/skills/SkillsPage";
import SocialLinks from "./components/links/SocialTerminal";
import About from "./components/about/AboutPage";
import ContactPage from "./components/contact/Contact";
import Resume from "./components/resume/ResumePage";
import RegistryPage from "./components/registry/RegistryPage";
import AuthCallback from "./components/auth/AuthCallback";
import ExperiencePage from "./components/experience/ExperiencePage";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    /* mode="wait" ensures the old page exits before the new one starts */
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<App />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/links" element={<SocialLinks />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/registry" element={<RegistryPage />} />
        <Route path="/experience" element={<ExperiencePage   />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="*" element={<App />} />
      </Routes>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;  