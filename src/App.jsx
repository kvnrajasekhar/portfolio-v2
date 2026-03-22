import EngineeringManifesto from "./components/EngineeringManifesto";
import RibbonBanners from "./components/RibbonBanners";
import HeroSection  from "./components/hero/HeroSection";
import Navbar from "./components/navbar/Navbar";
import SkillConstellation from "./components/SkillConstellation";
import WarpTransition from "./components/transition/WrapTransition";
import BentoGrid from "./components/BentoGrid";
import PreFooter from "./components/PreFooter";
import MasterFooter from "./components/footer/MasterFooter";


function App() {
  return (
    <div className="min-h-screen bg-[#ffffff] dark:bg-[#000000] text-[#5cbdb9] dark:text-[#fbe3e8] transition-colors duration-300">
      <Navbar />
      <div className="">
          <HeroSection />
          <WarpTransition />
          <SkillConstellation />
          <EngineeringManifesto />
          <RibbonBanners />
          <BentoGrid />
          <PreFooter />
          <MasterFooter />
      </div>
    </div>
  );
}

export default App;