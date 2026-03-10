import HeroSection  from "./components/hero/HeroSection";
import Navbar from "./components/navbar/Navbar";

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      <Navbar />

      <div className="">
          <HeroSection />
      </div>
    </div>
  );
}

export default App;