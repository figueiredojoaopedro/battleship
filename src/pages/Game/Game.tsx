import { useState } from "react";

type ShipPosition = { row: number | null; col: number | null; hit: boolean };
type Ship = { name: string; size: number; positions: ShipPosition[] };
type Player = { ready: boolean; ships: Ship[] };
type Players = { player1: Player; player2: Player };
type Turn = "player1" | "player2";

const Game = () => {
  const [grid, setGrid] = useState<(null | boolean)[][]>(
    Array.from({ length: 10 }, () => Array(10).fill(null))
  ); // se a pos for null, igual a vazio, se false, preenchida, mas não atingida, se true, atingida
  const [players, setPlayers] = useState<Players>({
    player1: {
      ready: false,
      ships: [
        {
          name: "Porta Aviões",
          size: 4,
          positions: Array(4).fill({ row: null, col: null, hit: false }),
        },
        {
          name: "Submarino",
          size: 3,
          positions: Array(3).fill({ row: null, col: null, hit: false }),
        },
        {
          name: "Destróier",
          size: 2,
          positions: Array(2).fill({ row: null, col: null, hit: false }),
        },
        {
          name: "Destróier",
          size: 2,
          positions: Array(2).fill({ row: null, col: null, hit: false }),
        },
        {
          name: "Fragata",
          size: 1,
          positions: Array(1).fill({ row: null, col: null, hit: false }),
        },
      ],
    },
    player2: {
      ready: false,
      ships: [
        {
          name: "Porta Aviões",
          size: 4,
          positions: Array(4).fill({ row: null, col: null, hit: false }),
        },
        {
          name: "Submarino",
          size: 3,
          positions: Array(3).fill({ row: null, col: null, hit: false }),
        },
        {
          name: "Destróier",
          size: 2,
          positions: Array(2).fill({ row: null, col: null, hit: false }),
        },
        {
          name: "Destróier",
          size: 2,
          positions: Array(2).fill({ row: null, col: null, hit: false }),
        },
        {
          name: "Fragata",
          size: 1,
          positions: Array(1).fill({ row: null, col: null, hit: false }),
        },
      ],
    },
  });

  const [isGameStarted, setIsGameStarted] = useState(false);
  const [turn, setTurn] = useState<Turn>("player1");

  const getShipWidth = (size: number): string => {
    const widthMap: { [key: number]: number } = {
      1: 10,
      2: 20,
      3: 30,
      4: 40,
      5: 50,
    };

    return (widthMap[size] * 5).toString() + "px" || (14 * 2).toString() + "px";
  };

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    ship: Ship
  ): void => {
    event.dataTransfer.setData("shipName", ship.name);
    event.dataTransfer.setData("shipSize", ship.size.toString());

    console.log("test ship", event.dataTransfer.getData("shipName"));
    console.log("test shipSize", event.dataTransfer.getData("shipSize"));
  };

  const handleShipDrop = (
    event: React.DragEvent<HTMLDivElement>,
    targetRow: number,
    targetCol: number
  ): void => {
    const shipName = event.dataTransfer.getData("shipName");
    const shipSize = parseInt(event.dataTransfer.getData("shipSize"));

    console.log("test size and index", shipName, shipSize);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <div className="flex flex-col items-center mb-2">
        <h2 className="text-4xl font-bold mb-8">Campo de batalha</h2>
        <p className="text-xl font-bold">{turn} escolhendo as posições...</p>
      </div>
      <div className="flex flex-row items-center justify-center">
        <div className="grid grid-cols-10 gap-2">
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => handleShipDrop(event, rowIndex, colIndex)}
                className="w-14 h-14 bg-blue-500 border border-white hover:bg-blue-400 cursor-pointer"
              />
            ))
          )}
        </div>
        <div className="ml-8">
          {players[turn].ships.map((ship, index) => {
            return (
              <div key={index}>
                <h4>{ship.name}</h4>
                <div className="flex">
                  <div
                    draggable
                    onDragStart={(event) => onDragStart(event, ship)}
                    style={{
                      width: getShipWidth(ship.size),
                    }}
                    className={`border-1 border-white rounded-sm cursor-grab w-10 h-10 bg-red-500`}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Game;
