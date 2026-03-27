import AtomicTransition from "../transition/AtomicTransition";

function Projects() {
  return (
    <AtomicTransition>
      <div className="min-h-screen flex flex-col items-center justify-center transition-colors duration-300">
        <h1 className="text-4xl font-bold mb-8">Projects</h1>
        <p className="text-lg mb-4">Here are some of the projects I've worked on:</p>
      </div>
    </AtomicTransition>
  );
}

export default Projects;