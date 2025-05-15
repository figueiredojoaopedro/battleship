import React from "react";
const Game = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <h2 className="text-4xl font-bold mb-8">Campo de batalha</h2>
      <div className="grid grid-cols-10 gap-2">
        {Array.from({ length: 100 }, (_, index) => (
          <div
            key={index}
            className="w-14 h-14 bg-blue-500 border border-white hover:bg-blue-400 cursor-pointer"
          />
        ))}
      </div>
    </div>
  );
};

export default Game;
