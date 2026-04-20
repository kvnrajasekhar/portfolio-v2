import EngineeringManifesto from "./components/EngineeringManifesto";
import RibbonBanners from "./components/RibbonBanners";
import HeroSection from "./components/hero/HeroSection";
import SkillConstellation from "./components/SkillConstellation";
import WarpTransition from "./components/transition/WrapTransition";
import VerticalsofExcellence from "./components/VerticalsofExcellence";
import AtomicTransition from "./components/transition/AtomicTransition";


function App() {
  return (
    <AtomicTransition>
      <div className="main-screen">
        <HeroSection />
        <WarpTransition />
        <SkillConstellation />
        <EngineeringManifesto />
        <RibbonBanners />
        <VerticalsofExcellence />
      </div>
    </AtomicTransition>

  );
}

export default App;