import EngineeringManifesto from "./components/EngineeringManifesto";
import RibbonBanners from "./components/RibbonBanners";
import HeroSection from "./components/hero/HeroSection";
import Navbar from "./components/navbar/Navbar";
import SkillConstellation from "./components/SkillConstellation";
import WarpTransition from "./components/transition/WrapTransition";
import BentoGrid from "./components/BentoGrid";
import PreFooter from "./components/PreFooter";
import MasterFooter from "./components/footer/MasterFooter";


function App() {
  return (
    <div className="main-screen">
      <HeroSection />
      <WarpTransition />
      <SkillConstellation />
      <EngineeringManifesto />
      <RibbonBanners />
      <BentoGrid />
    </div>
  );
}

export default App;