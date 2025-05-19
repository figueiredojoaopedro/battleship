import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const ItemTypes = {
  SHIP: "ship",
};

const Ship = ({ ship }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.SHIP,
    item: { ...ship },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className="bg-gray-200"
      style={{
        width: `${ship.w * 56}px`,
        height: `${ship.h * 56}px`,
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
      }}
    />
  );
};

const Cell = ({ index, onDropShip }) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.SHIP,
    drop: (item) => onDropShip(index, item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`w-14 h-14 border border-white ${
        isOver && canDrop ? "bg-green-500" : "bg-blue-500"
      }`}
    />
  );
};

const Game = () => {
  const columns = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  const [ships, setShips] = useState([
    { id: 1, w: 2, h: 1 },
    // adicionar outros navios aqui depois
  ]);
  const [placedShips, setPlacedShips] = useState([]);

  const handleDropShip = (cellIndex, ship) => {
    setPlacedShips((prev) => [...prev, { ...ship, index: cellIndex }]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
        <h2 className="text-4xl font-bold mb-8">Campo de batalha</h2>

        <div className="flex gap-12">
          {/* Tabuleiro com marcadores */}
          <div className="grid grid-cols-[30px_repeat(10,56px)] gap-0">
            {/* Cabeçalho */}
            <div />
            {columns.map((letter) => (
              <div key={letter} className="text-center text-lg font-bold mb-2">
                {letter}
              </div>
            ))}

            {/* Grid com células */}
            {Array.from({ length: 10 }).map((_, rowIndex) => (
              <React.Fragment key={rowIndex}>
                <div className="flex items-center justify-center text-lg font-bold">
                  {rowIndex + 1}
                </div>
                {Array.from({ length: 10 }).map((_, colIndex) => {
                  const index = rowIndex * 10 + colIndex;
                  const shipHere = placedShips.find((s) => s.index === index);

                  return (
                    <div key={index} className="relative">
                      <Cell index={index} onDropShip={handleDropShip} />
                      {shipHere && (
                        <div
                          className="absolute top-0 left-0 bg-yellow-300"
                          style={{
                            width: `${shipHere.w * 56}px`,
                            height: `${shipHere.h * 56}px`,
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>

          {/* Área dos navios */}
          <div className="flex flex-col gap-4 items-center">
            <h3 className="text-2xl font-semibold mb-2">Navios</h3>
            {ships.map((ship) => (
              <Ship key={ship.id} ship={ship} />
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default Game;
