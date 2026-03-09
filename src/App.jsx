import Navbar from "./components/navbar/Navbar";

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      <Navbar />

      <div className="pt-24">
        <div className="h-screen flex items-center justify-center">
          Dark mode test section
        </div>
      </div>
    </div>
  );
}

export default App;