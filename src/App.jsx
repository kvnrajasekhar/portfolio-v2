import HeroSection  from "./components/hero/HeroSection";
import Navbar from "./components/navbar/Navbar";
import SkillConstellation from "./components/SkillConstellation";
import WarpTransition from "./components/transition/WrapTransition";


function App() {
  return (
    <div className="min-h-screen bg-[#e4decd] dark:bg-[#000000] text-[#5cbdb9] dark:text-[#fbe3e8] transition-colors duration-300">
      <Navbar />
      <div className="">
          <HeroSection />
          <WarpTransition />
          <SkillConstellation />
      </div>
    </div>
  );
}

export default App;