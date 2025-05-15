import "./App.css";
import { Link } from "react-router-dom";
function App() {
  return (
    <div className="bg-linear-to-b from-blue-600 to-blue-800 text-white min-h-screen gap-10 flex flex-col items-center justify-center">
      <header className="text-6xl font-extrabold">
        <h1>Battleship!</h1>
      </header>
      <main>
        <div className="text-center flex flex-col items-center justify-center gap-4">
          <p className="text-2xl font-bold">
            Bem-vindo ao jogo Batalha Naval! Clique no botão abaixo para
            começar.
          </p>
          <Link to="/pages/game">
            <button className="w-fit px-4 py-2 duration-300 ease-in-out hover:scale-105 cursor-pointer bg-white rounded-md text-blue-600 font-bold text-4xl">
              Iniciar Jogo
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default App;
